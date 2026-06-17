import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitDocument,
} from '../../process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema';
import {
  RawMaterialsRecycledContent,
  RawMaterialsRecycledContentDocument,
} from '../../raw-materials-recycled-content/schemas/raw-materials-recycled-content.schema';
import {
  RawMaterialsRecovery,
  RawMaterialsRecoveryDocument,
} from '../../raw-materials-recovery/schemas/raw-materials-recovery.schema';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsDocument,
} from '../../raw-materials-rapidly-renewable-materials/schemas/raw-materials-rapidly-renewable-materials.schema';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcDocument,
} from '../../raw-materials-utilization-rmc/schemas/raw-materials-utilization-rmc.schema';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import { buildProductSnapshotMatch } from '../utils/dashboard-metrics-filters.util';
import {
  averagePositivePercent,
  maxRecycledPercentFromRmcRow,
  renewableCarbonScore,
  roundContributionPercent,
  SUSTAINABILITY_CONTRIBUTION_DEFS,
} from '../utils/admin-dashboard-sustainability.util';
import type { AdminDashboardSustainabilityContributions } from './admin-dashboard-sustainability.types';

@Injectable()
export class AdminDashboardSustainabilityService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProcessMpManufacturingUnit.name)
    private readonly mpManufacturingUnitModel: Model<ProcessMpManufacturingUnitDocument>,
    @InjectModel(RawMaterialsRecycledContent.name)
    private readonly recycledContentModel: Model<RawMaterialsRecycledContentDocument>,
    @InjectModel(RawMaterialsRecovery.name)
    private readonly recoveryModel: Model<RawMaterialsRecoveryDocument>,
    @InjectModel(RawMaterialsRapidlyRenewableMaterials.name)
    private readonly rapidlyRenewableModel: Model<RawMaterialsRapidlyRenewableMaterialsDocument>,
    @InjectModel(RawMaterialsUtilizationRmc.name)
    private readonly utilizationRmcModel: Model<RawMaterialsUtilizationRmcDocument>,
  ) {}

  async getSustainabilityContributions(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardSustainabilityContributions> {
    const now = new Date();
    const certifiedMatch = {
      ...buildProductSnapshotMatch(filters, now),
      productStatus: PRODUCT_STATUS_CERTIFIED,
      $or: [
        { validtillDate: { $exists: false } },
        { validtillDate: null },
        { validtillDate: { $gte: now } },
      ],
    };

    const certifiedProducts = await this.productModel
      .find(certifiedMatch)
      .select('urnNo')
      .lean()
      .exec();

    const urnNos = [
      ...new Set(
        certifiedProducts
          .map((p) => String(p.urnNo ?? '').trim())
          .filter(Boolean),
      ),
    ];

    if (!urnNos.length) {
      return this.emptyContributions(0, 0);
    }

    const urnFilter = { urnNo: { $in: urnNos } };

    const [
      mpUnits,
      recycledRows,
      recoveryRows,
      rapidlyRenewableRows,
      utilizationRmcRows,
    ] = await Promise.all([
      this.mpManufacturingUnitModel.find(urnFilter).lean().exec(),
      this.recycledContentModel.find(urnFilter).lean().exec(),
      this.recoveryModel.find(urnFilter).lean().exec(),
      this.rapidlyRenewableModel.find(urnFilter).lean().exec(),
      this.utilizationRmcModel.find(urnFilter).lean().exec(),
    ]);

    const energySamples: number[] = [];
    const waterSamples: number[] = [];
    const recyclabilitySamples: number[] = [];
    const carbonSamples: number[] = [];

    for (const unit of mpUnits) {
      const sec = Number(unit.calculateBulkSec);
      const stec = Number(unit.calculateBulkStec);
      if (Number.isFinite(sec) && sec > 0) energySamples.push(sec);
      if (Number.isFinite(stec) && stec > 0) energySamples.push(stec);

      const swc = Number(unit.calculateBulkSwc);
      if (Number.isFinite(swc) && swc > 0) waterSamples.push(swc);

      const carbonScore = renewableCarbonScore(unit as Record<string, unknown>);
      if (carbonScore !== null) carbonSamples.push(carbonScore);
    }

    for (const row of recycledRows) {
      const value = Number(row.yeardata3);
      if (Number.isFinite(value) && value > 0) recyclabilitySamples.push(value);
    }

    for (const row of recoveryRows) {
      const value = Number(row.yeardata3);
      if (Number.isFinite(value) && value > 0) recyclabilitySamples.push(value);
    }

    for (const row of utilizationRmcRows) {
      const value = maxRecycledPercentFromRmcRow(row as Record<string, unknown>);
      if (value !== null) recyclabilitySamples.push(value);
    }

    for (const row of rapidlyRenewableRows) {
      const value = Number(row.yeardata3);
      if (Number.isFinite(value) && value > 0) carbonSamples.push(value);
    }

    const metrics: Record<
      'energySaved' | 'waterSaved' | 'recyclability' | 'carbonOffset',
      { percent: number; sampleCount: number }
    > = {
      energySaved: {
        percent: averagePositivePercent(energySamples),
        sampleCount: energySamples.length,
      },
      waterSaved: {
        percent: averagePositivePercent(waterSamples),
        sampleCount: waterSamples.length,
      },
      recyclability: {
        percent: averagePositivePercent(recyclabilitySamples),
        sampleCount: recyclabilitySamples.length,
      },
      carbonOffset: {
        percent: averagePositivePercent(carbonSamples),
        sampleCount: carbonSamples.length,
      },
    };

    return {
      title: 'Sustainability Contributions',
      subtitle: 'Environmental impact from certified products',
      unit: 'percent',
      totals: {
        certifiedUrns: urnNos.length,
        certifiedProducts: certifiedProducts.length,
      },
      items: SUSTAINABILITY_CONTRIBUTION_DEFS.map((def) => ({
        key: def.key,
        label: def.label,
        order: def.order,
        color: def.color,
        percent: roundContributionPercent(metrics[def.key].percent),
        sampleCount: metrics[def.key].sampleCount,
      })),
    };
  }

  private emptyContributions(
    certifiedUrns: number,
    certifiedProducts: number,
  ): AdminDashboardSustainabilityContributions {
    return {
      title: 'Sustainability Contributions',
      subtitle: 'Environmental impact from certified products',
      unit: 'percent',
      totals: { certifiedUrns, certifiedProducts },
      items: SUSTAINABILITY_CONTRIBUTION_DEFS.map((def) => ({
        key: def.key,
        label: def.label,
        order: def.order,
        color: def.color,
        percent: 0,
        sampleCount: 0,
      })),
    };
  }
}
