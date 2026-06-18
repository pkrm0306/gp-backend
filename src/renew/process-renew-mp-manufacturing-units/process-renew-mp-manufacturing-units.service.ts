import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProcessRenewMpManufacturingUnit,
  ProcessRenewMpManufacturingUnitDocument,
} from '../schemas/process-renew-mp-manufacturing-unit.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../schemas/renewal-cycle.schema';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { CreateProcessMpManufacturingUnitDto } from '../../process-mp-manufacturing-units/dto/create-process-mp-manufacturing-unit.dto';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import { assertMpManufacturingUnitNonNegativeNumbers } from '../../process-mp-manufacturing-units/utils/mp-manufacturing-unit-numeric-fields.util';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
} from '../helpers/renew-common.util';
import {
  buildRenewProcessHeaderFilter,
  resolveRenewCycleForQuery,
} from '../helpers/renew-cycle-scope.util';
import { formatRenewMpManufacturingUnitForDetails } from '../utils/renew-details-format.util';

function readRenewalCycleId(dto: CreateProcessMpManufacturingUnitDto): string | undefined {
  const raw = (dto as { renewalCycleId?: string; renewal_cycle_id?: string })
    .renewalCycleId ?? (dto as { renewal_cycle_id?: string }).renewal_cycle_id;
  const trimmed = String(raw ?? '').trim();
  return trimmed || undefined;
}

@Injectable()
export class ProcessRenewMpManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessRenewMpManufacturingUnit.name)
    private readonly model: Model<ProcessRenewMpManufacturingUnitDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  private normalizeForSignature(value: unknown): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value.trim();
    return String(value);
  }

  private unitSignature(payload: Record<string, unknown>): string {
    const keys = [
      'unitName',
      'renewableEnergyUtilization',
      'ecdYear1',
      'ecdYear2',
      'ecdYear3',
      'ecdProductionUnit',
      'ecdProductionYear1',
      'ecdProductionYear2',
      'ecdProductionYear3',
      'ecdElectricUnit',
      'ecdElectricYear1',
      'ecdElectricYear2',
      'ecdElectricYear3',
      'ecdThermalUnitFuel1',
      'ecdThermalUnitFuel2',
      'ecdThermalUnitFuel3',
      'ecdThermalFuel1Year1',
      'ecdThermalFuel1Year2',
      'ecdThermalFuel1Year3',
      'ecdThermalFuel2Year1',
      'ecdThermalFuel2Year2',
      'ecdThermalFuel2Year3',
      'ecdThermalFuel3Year1',
      'ecdThermalFuel3Year2',
      'ecdThermalFuel3Year3',
      'ecdCalorificFuel1Year1',
      'ecdCalorificFuel1Year2',
      'ecdCalorificFuel1Year3',
      'ecdCalorificFuel2Year1',
      'ecdCalorificFuel2Year2',
      'ecdCalorificFuel2Year3',
      'ecdCalorificFuel3Year1',
      'ecdCalorificFuel3Year2',
      'ecdCalorificFuel3Year3',
      'ecdTextareaNewUnits',
      'wcdYear1',
      'wcdYear2',
      'wcdYear3',
      'wcdProductionUnit',
      'wcdWaterUnit',
      'wcdProductionYear1',
      'wcdProductionYear2',
      'wcdProductionYear3',
      'wcdWaterYear1',
      'wcdWaterYear2',
      'wcdWaterYear3',
      'reYear',
      'reSolarPhotovoltaic',
      'reWind',
      'reBiomass',
      'reSolarThermal',
      'reOthersUnit',
      'reOthers',
      'offsiteRenewablePower',
      'processMpManufacturingUnitStatus',
      'calculateBulkSec',
      'calculateBulkSwc',
      'calculateBulkSecMultipled',
      'calculateBulkSwcMultipled',
      'measuresImplementedMpUnits',
      'detailsOfRainWaterHarvestingMpUnits',
    ];

    return keys
      .map((key) => `${key}:${this.normalizeForSignature(payload[key])}`)
      .join('|');
  }

  private resolveUnitId(dto: CreateProcessMpManufacturingUnitDto): number | undefined {
    const renewId = (dto as { processRenewMpManufacturingUnitId?: number })
      .processRenewMpManufacturingUnitId;
    return dto.processMpManufacturingUnitId ?? renewId;
  }

  private buildUnitPayload(
    dto: CreateProcessMpManufacturingUnitDto,
    urnNo: string,
  ): Record<string, unknown> {
    const {
      processMpManufacturingUnitId: _mpId,
      urnNo: _urn,
      ...fields
    } = dto;
    return {
      ...fields,
      urnNo,
      offsiteRenewablePower: dto.offsiteRenewablePower ?? 0,
      processMpManufacturingUnitStatus: dto.processMpManufacturingUnitStatus ?? 0,
    };
  }

  private formatRow(doc: ProcessRenewMpManufacturingUnitDocument | Record<string, unknown>) {
    const plain =
      typeof (doc as ProcessRenewMpManufacturingUnitDocument).toObject === 'function'
        ? (doc as ProcessRenewMpManufacturingUnitDocument).toObject()
        : { ...doc };
    return formatRenewMpManufacturingUnitForDetails(plain as Record<string, unknown>);
  }

  async upsert(dto: CreateProcessMpManufacturingUnitDto) {
    try {
      const cycleIdHint = readRenewalCycleId(dto);
      const { cycle, context } = await assertRenewProcessEditable(
        this.productModel,
        this.renewalCycleModel,
        dto.urnNo,
        cycleIdHint,
      );
      const ownership = renewOwnershipFields(context);
      const cycleFilter = buildRenewProcessHeaderFilter(ownership.urnNo, cycle);
      const renewalCycleObjectId = cycle._id;
      const now = new Date();
      const urnNo = ownership.urnNo;
      const incomingPayload = this.buildUnitPayload(dto, urnNo);

      assertMpManufacturingUnitNonNegativeNumbers(incomingPayload);

      const unitId = this.resolveUnitId(dto);
      if (unitId != null) {
        const updated = await this.model
          .findOneAndUpdate(
            {
              processRenewMpManufacturingUnitId: unitId,
              urnNo,
              vendorId: ownership.vendorId,
            },
            { $set: { ...incomingPayload, updatedDate: now } },
            { new: true },
          )
          .exec();
        if (!updated) {
          throw new BadRequestException(
            `Renew manufacturing unit ${unitId} not found for URN ${urnNo}`,
          );
        }
        return this.formatRow(updated);
      }

      const id = await this.sequenceHelper.getProcessRenewMpManufacturingUnitId();
      const incomingSignature = this.unitSignature(incomingPayload);
      const existingRows = await this.model
        .find({ ...cycleFilter, vendorId: ownership.vendorId })
        .exec();
      const duplicateRow = existingRows.find(
        (row) =>
          this.unitSignature(
            row.toObject() as unknown as Record<string, unknown>,
          ) ===
          incomingSignature,
      );
      if (duplicateRow) {
        return this.formatRow(duplicateRow);
      }

      const doc = new this.model({
        processRenewMpManufacturingUnitId: id,
        vendorId: ownership.vendorId,
        manufacturerId: ownership.manufacturerId,
        renewalCycleId: renewalCycleObjectId,
        ...incomingPayload,
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();
      return this.formatRow(saved);
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Failed to save renew MP manufacturing unit.';
      throw new InternalServerErrorException(message);
    }
  }

  async listByUrn(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    const cycle = await resolveRenewCycleForQuery(
      this.renewalCycleModel,
      trimmedUrn,
      renewalCycleId,
    );
    const filter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);
    const rows = await this.model
      .find(filter)
      .sort({ processRenewMpManufacturingUnitId: 1 })
      .lean()
      .exec();
    return rows.map((row) =>
      formatRenewMpManufacturingUnitForDetails(row as Record<string, unknown>),
    );
  }

  async deleteById(unitId: number, urnNo: string) {
    try {
      await assertRenewProcessEditable(
        this.productModel,
        this.renewalCycleModel,
        urnNo,
      );
      const trimmedUrn = urnNo.trim();
      const deleted = await this.model
        .findOneAndDelete({
          processRenewMpManufacturingUnitId: unitId,
          urnNo: trimmedUrn,
        })
        .exec();
      if (!deleted) {
        throw new NotFoundException(
          `Renew manufacturing unit ${unitId} not found for URN ${trimmedUrn}`,
        );
      }
      return this.formatRow(deleted);
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete renew MP manufacturing unit.';
      throw new InternalServerErrorException(message);
    }
  }
}
