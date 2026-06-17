import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitDocument,
} from './schemas/process-mp-manufacturing-unit.schema';
import { CreateProcessMpManufacturingUnitDto } from './dto/create-process-mp-manufacturing-unit.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { assertMpManufacturingUnitNonNegativeNumbers } from './utils/mp-manufacturing-unit-numeric-fields.util';
import {
  enrichMpManufacturingUnitCalculations,
  normalizeMpManufacturingUnitEnergyInputs,
  pickPersistedEnergyCalculationFields,
} from './utils/mp-energy-consumption-calculations.util';

@Injectable()
export class ProcessMpManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessMpManufacturingUnit.name)
    private model: Model<ProcessMpManufacturingUnitDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  private normalizeForSignature(value: any): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value.trim();
    return String(value);
  }

  private unitSignature(payload: Record<string, any>): string {
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
      'measuresImplementedMpUnits',
      'detailsOfRainWaterHarvestingMpUnits',
    ];

    return keys
      .map((key) => `${key}:${this.normalizeForSignature(payload[key])}`)
      .join('|');
  }

  private buildUnitPayload(
    dto: CreateProcessMpManufacturingUnitDto,
    urnNo: string,
  ): Record<string, unknown> {
    const {
      processMpManufacturingUnitId: _id,
      calculateBulkSec: _sec,
      calculateBulkSecMultipled: _secMultipled,
      calculateBulkSwc: _swc,
      calculateBulkSwcMultipled: _swcMultipled,
      calculateBulkStec: _stec,
      calculateBulkStecMultipled: _stecMultipled,
      calculateBulkTecMultipled: _tecMultipled,
      ...fields
    } = dto;
    const payload = normalizeMpManufacturingUnitEnergyInputs({
      ...fields,
      urnNo,
      offsiteRenewablePower: dto.offsiteRenewablePower ?? null,
      processMpManufacturingUnitStatus: dto.processMpManufacturingUnitStatus ?? 0,
    });
    return enrichMpManufacturingUnitCalculations(payload);
  }

  private async persistCalculatedEnergyFields(
    rowId: unknown,
    payload: Record<string, unknown>,
    updatedAt: Date,
  ) {
    await this.model
      .updateOne(
        { _id: rowId },
        {
          $set: {
            ...pickPersistedEnergyCalculationFields(payload),
            updatedDate: updatedAt,
          },
        },
      )
      .exec();
  }

  private enrichUnitRow(
    row: ProcessMpManufacturingUnitDocument | Record<string, unknown>,
  ) {
    const plain =
      typeof (row as ProcessMpManufacturingUnitDocument).toObject === 'function'
        ? (row as ProcessMpManufacturingUnitDocument).toObject()
        : { ...(row as Record<string, unknown>) };
    return enrichMpManufacturingUnitCalculations(plain);
  }

  async create(dto: CreateProcessMpManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const now = new Date();
      const urnNo = dto.urnNo.trim();
      const incomingPayload = this.buildUnitPayload(dto, urnNo);

      assertMpManufacturingUnitNonNegativeNumbers(
        incomingPayload as Record<string, unknown>,
      );

      if (dto.processMpManufacturingUnitId != null) {
        const updated = await this.model
          .findOneAndUpdate(
            {
              processMpManufacturingUnitId: dto.processMpManufacturingUnitId,
              urnNo,
              vendorId: vendorObjectId,
            },
            { $set: { ...incomingPayload, updatedDate: now } },
            { new: true },
          )
          .exec();
        if (!updated) {
          throw new BadRequestException(
            `Manufacturing unit ${dto.processMpManufacturingUnitId} not found for URN ${urnNo}`,
          );
        }
        await this.persistCalculatedEnergyFields(
          updated._id,
          incomingPayload,
          now,
        );
        return this.enrichUnitRow({
          ...updated.toObject(),
          ...incomingPayload,
        });
      }

      const id = await this.sequenceHelper.getProcessMpManufacturingUnitId();
      const incomingSignature = this.unitSignature(incomingPayload);
      const existingRows = await this.model.find({ urnNo, vendorId: vendorObjectId }).exec();
      const duplicateRow = existingRows.find(
        (row) => this.unitSignature(row.toObject()) === incomingSignature,
      );
      if (duplicateRow) {
        await this.persistCalculatedEnergyFields(
          duplicateRow._id,
          incomingPayload,
          now,
        );
        return this.enrichUnitRow({
          ...duplicateRow.toObject(),
          ...incomingPayload,
        });
      }

      const doc = new this.model({
        processMpManufacturingUnitId: id,
        vendorId: vendorObjectId,
        ...incomingPayload,
        createdDate: now,
        updatedDate: now,
      });

      return this.enrichUnitRow(await doc.save());
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.error('[Process MP Manufacturing Units] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create manufacturing unit record.',
      );
    }
  }

  async deleteById(
    processMpManufacturingUnitId: number,
    urnNo: string,
    vendorId: string,
  ) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const trimmedUrn = urnNo.trim();
      const deleted = await this.model
        .findOneAndDelete({
          processMpManufacturingUnitId,
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
        })
        .exec();
      if (!deleted) {
        throw new NotFoundException(
          `Manufacturing unit ${processMpManufacturingUnitId} not found for URN ${trimmedUrn}`,
        );
      }
      return deleted;
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('[Process MP Manufacturing Units] Delete error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to delete manufacturing unit record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return (await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processMpManufacturingUnitId: 1 })
        .exec()).map((row) => this.enrichUnitRow(row));
    } catch (error: any) {
      console.error('[Process MP Manufacturing Units] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list manufacturing unit records.',
      );
    }
  }

  /** Platform admin: all manufacturing units for a URN (any vendor on that URN). */
  async listByUrnForAdmin(urnNo: string) {
    try {
      const trimmed = urnNo.trim();
      if (!trimmed) {
        throw new BadRequestException('URN number is required');
      }
      return (await this.model
        .find({ urnNo: trimmed })
        .sort({ processMpManufacturingUnitId: 1 })
        .exec()).map((row) => this.enrichUnitRow(row));
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.error('[Process MP Manufacturing Units] Admin list error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list manufacturing unit records.',
      );
    }
  }
}
