import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitDocument,
} from './schemas/process-mp-manufacturing-unit.schema';
import { CreateProcessMpManufacturingUnitDto } from './dto/create-process-mp-manufacturing-unit.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

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

  async create(dto: CreateProcessMpManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getProcessMpManufacturingUnitId();
      const now = new Date();
      const urnNo = dto.urnNo.trim();

      const incomingPayload = {
        ...dto,
        urnNo,
        offsiteRenewablePower: dto.offsiteRenewablePower ?? 0,
        processMpManufacturingUnitStatus: dto.processMpManufacturingUnitStatus ?? 0,
      };

      const incomingSignature = this.unitSignature(incomingPayload);
      const existingRows = await this.model.find({ urnNo, vendorId: vendorObjectId }).exec();
      const duplicateRow = existingRows.find(
        (row) => this.unitSignature(row.toObject()) === incomingSignature,
      );
      if (duplicateRow) {
        return duplicateRow;
      }

      const doc = new this.model({
        processMpManufacturingUnitId: id,
        vendorId: vendorObjectId,
        urnNo,
        ...incomingPayload,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Process MP Manufacturing Units] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create manufacturing unit record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processMpManufacturingUnitId: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Process MP Manufacturing Units] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list manufacturing unit records.',
      );
    }
  }
}
