import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from '../../activity-log/schemas/activity-log.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import { buildProductSnapshotMatch } from '../utils/dashboard-metrics-filters.util';
import {
  averageDays,
  buildUrnMilestones,
  CERTIFICATION_TIMING_BREAKDOWN_DEFS,
  CERTIFICATION_TIMING_STAGE_DEFS,
  computeBreakdownDurationsFromMilestones,
  computeEndToEndDays,
  computeStageDurationsFromMilestones,
  daysBetween,
  type CertificationTimingBreakdownKey,
  type CertificationTimingStageKey,
} from '../utils/admin-dashboard-certification-timing.util';
import type { AdminDashboardCertificationTiming } from './admin-dashboard-certification-timing.types';

type StageAccumulator = {
  totalDays: number;
  sampleCount: number;
};

@Injectable()
export class AdminDashboardCertificationTimingService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  async getCertificationTiming(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardCertificationTiming> {
    const now = new Date();
    const productMatch = {
      ...buildProductSnapshotMatch(filters, now),
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: { $exists: true, $ne: null },
      $or: [
        { validtillDate: { $exists: false } },
        { validtillDate: null },
        { validtillDate: { $gte: now } },
      ],
    };

    const certifiedProducts = await this.productModel
      .find(productMatch)
      .select('urnNo manufacturerId certifiedDate createdDate')
      .lean()
      .exec();

    if (!certifiedProducts.length) {
      return this.emptyTiming();
    }

    const urnMap = new Map<
      string,
      {
        manufacturerId: string;
        certifiedDate: Date;
        createdDate: Date;
      }
    >();

    for (const product of certifiedProducts) {
      const urnNo = String(product.urnNo ?? '').trim();
      if (!urnNo) continue;
      const certifiedDate = product.certifiedDate
        ? new Date(product.certifiedDate)
        : null;
      if (!certifiedDate || Number.isNaN(certifiedDate.getTime())) continue;

      const existing = urnMap.get(urnNo);
      if (!existing || certifiedDate.getTime() < existing.certifiedDate.getTime()) {
        urnMap.set(urnNo, {
          manufacturerId: String(product.manufacturerId),
          certifiedDate,
          createdDate: product.createdDate
            ? new Date(product.createdDate)
            : certifiedDate,
        });
      }
    }

    const urnNos = [...urnMap.keys()];
    if (!urnNos.length) {
      return this.emptyTiming();
    }

    const activityLogs = await this.activityLogModel
      .find({ urn_no: { $in: urnNos } })
      .select('urn_no activities_id created_at manufacturer_id')
      .sort({ created_at: 1 })
      .lean()
      .exec();

    const logsByUrn = new Map<string, typeof activityLogs>();
    for (const log of activityLogs) {
      const urn = String(log.urn_no ?? '').trim();
      if (!urn) continue;
      const bucket = logsByUrn.get(urn) ?? [];
      bucket.push(log);
      logsByUrn.set(urn, bucket);
    }

    const manufacturerIds = [
      ...new Set([...urnMap.values()].map((v) => v.manufacturerId)),
    ]
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const manufacturers = manufacturerIds.length
      ? await this.manufacturerModel
          .find({ _id: { $in: manufacturerIds } })
          .select('createdAt updatedAt')
          .lean()
          .exec()
      : [];

    const manufacturerCreatedAt = new Map<string, Date>();
    for (const manufacturer of manufacturers) {
      const created =
        (manufacturer as { createdAt?: Date }).createdAt ??
        (manufacturer as { updatedAt?: Date }).updatedAt;
      if (created) {
        manufacturerCreatedAt.set(String(manufacturer._id), new Date(created));
      }
    }

    const stageTotals = this.initStageAccumulators();
    const breakdownTotals = this.initBreakdownAccumulators();
    const profileTotals: StageAccumulator = { totalDays: 0, sampleCount: 0 };
    const profileManufacturers = new Set<string>();
    const endToEndTotals: StageAccumulator = { totalDays: 0, sampleCount: 0 };

    for (const [urnNo, urnMeta] of urnMap.entries()) {
      const logs = logsByUrn.get(urnNo) ?? [];
      const milestones = buildUrnMilestones(logs, urnMeta.certifiedDate);

      const stageDurations = computeStageDurationsFromMilestones(milestones);
      for (const [stage, days] of stageDurations.entries()) {
        const acc = stageTotals.get(stage);
        if (!acc) continue;
        acc.totalDays += days;
        acc.sampleCount += 1;
      }

      const breakdownDurations =
        computeBreakdownDurationsFromMilestones(milestones);
      for (const [bucket, days] of breakdownDurations.entries()) {
        const acc = breakdownTotals.get(bucket);
        if (!acc) continue;
        acc.totalDays += days;
        acc.sampleCount += 1;
      }

      const endToEnd = computeEndToEndDays(milestones, urnMeta.certifiedDate);
      if (endToEnd !== null && endToEnd > 0) {
        endToEndTotals.totalDays += endToEnd;
        endToEndTotals.sampleCount += 1;
      }

      const manufacturerId = urnMeta.manufacturerId;
      if (!profileManufacturers.has(manufacturerId)) {
        const manufacturerStart = manufacturerCreatedAt.get(manufacturerId);
        const firstRegistration =
          milestones.find((m) => m.activityId === 0)?.at ??
          logs.find((l) => Number(l.activities_id) === 0)?.created_at ??
          urnMeta.createdDate;

        if (manufacturerStart && firstRegistration) {
          const profileDays = daysBetween(
            manufacturerStart,
            new Date(firstRegistration),
          );
          if (profileDays > 0) {
            profileTotals.totalDays += profileDays;
            profileTotals.sampleCount += 1;
          }
        }
        profileManufacturers.add(manufacturerId);
      }
    }

    if (profileTotals.sampleCount > 0) {
      stageTotals.set('profile', profileTotals);
    }

    return {
      timeAtStage: {
        title: 'Time at Stage',
        subtitle: 'Average days spent at each stage',
        unit: 'days',
        stages: CERTIFICATION_TIMING_STAGE_DEFS.map((stage) => {
          const acc = stageTotals.get(stage.key) ?? {
            totalDays: 0,
            sampleCount: 0,
          };
          return {
            key: stage.key,
            label: stage.label,
            order: stage.order,
            avgDays: averageDays(acc.totalDays, acc.sampleCount),
            sampleCount: acc.sampleCount,
          };
        }),
      },
      avgTimeToCertification: {
        title: 'Avg. Time to Certification',
        subtitle: 'End-to-end processing duration',
        unit: 'days',
        avgDays: averageDays(
          endToEndTotals.totalDays,
          endToEndTotals.sampleCount,
        ),
        sampleCount: endToEndTotals.sampleCount,
        breakdown: CERTIFICATION_TIMING_BREAKDOWN_DEFS.map((item) => {
          const acc = breakdownTotals.get(item.key) ?? {
            totalDays: 0,
            sampleCount: 0,
          };
          return {
            key: item.key,
            label: item.label,
            order: item.order,
            avgDays: averageDays(acc.totalDays, acc.sampleCount),
            sampleCount: acc.sampleCount,
          };
        }),
      },
    };
  }

  private initStageAccumulators(): Map<
    CertificationTimingStageKey,
    StageAccumulator
  > {
    const map = new Map<CertificationTimingStageKey, StageAccumulator>();
    for (const stage of CERTIFICATION_TIMING_STAGE_DEFS) {
      map.set(stage.key, { totalDays: 0, sampleCount: 0 });
    }
    return map;
  }

  private initBreakdownAccumulators(): Map<
    CertificationTimingBreakdownKey,
    StageAccumulator
  > {
    const map = new Map<CertificationTimingBreakdownKey, StageAccumulator>();
    for (const item of CERTIFICATION_TIMING_BREAKDOWN_DEFS) {
      map.set(item.key, { totalDays: 0, sampleCount: 0 });
    }
    return map;
  }

  private emptyTiming(): AdminDashboardCertificationTiming {
    return {
      timeAtStage: {
        title: 'Time at Stage',
        subtitle: 'Average days spent at each stage',
        unit: 'days',
        stages: CERTIFICATION_TIMING_STAGE_DEFS.map((stage) => ({
          key: stage.key,
          label: stage.label,
          order: stage.order,
          avgDays: 0,
          sampleCount: 0,
        })),
      },
      avgTimeToCertification: {
        title: 'Avg. Time to Certification',
        subtitle: 'End-to-end processing duration',
        unit: 'days',
        avgDays: 0,
        sampleCount: 0,
        breakdown: CERTIFICATION_TIMING_BREAKDOWN_DEFS.map((item) => ({
          key: item.key,
          label: item.label,
          order: item.order,
          avgDays: 0,
          sampleCount: 0,
        })),
      },
    };
  }
}
