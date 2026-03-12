import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitDocument,
} from './schemas/process-wm-manufacturing-unit.schema';
import { CreateProcessWmManufacturingUnitDto } from './dto/create-process-wm-manufacturing-unit.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class ProcessWmManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessWmManufacturingUnit.name)
    private model: Model<ProcessWmManufacturingUnitDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async create(dto: CreateProcessWmManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getProcessWmManufacturingUnitId();
      const now = new Date();

      const doc = new this.model({
        processWmManufacturingUnitId: id,
        vendorId: vendorObjectId,
        urnNo: dto.urnNo,
        processWasteManagementId: dto.processWasteManagementId,
        unitName: dto.unitName,
        hazardousWasteYear1: dto.hazardousWasteYear1,
        hazardousWasteYear2: dto.hazardousWasteYear2,
        hazardousWasteYear3: dto.hazardousWasteYear3,
        hazardousWasteProductionUnit: dto.hazardousWasteProductionUnit,
        hazardousWasteQuantityUnit: dto.hazardousWasteQuantityUnit,
        hazardousWasteProductionYear1: dto.hazardousWasteProductionYear1,
        hazardousWasteProductionYear2: dto.hazardousWasteProductionYear2,
        hazardousWasteProductionYear3: dto.hazardousWasteProductionYear3,
        hazardousWasteQuantityYear1: dto.hazardousWasteQuantityYear1,
        hazardousWasteQuantityYear2: dto.hazardousWasteQuantityYear2,
        hazardousWasteQuantityYear3: dto.hazardousWasteQuantityYear3,
        nonHazardousWasteYear1: dto.nonHazardousWasteYear1,
        nonHazardousWasteYear2: dto.nonHazardousWasteYear2,
        nonHazardousWasteYear3: dto.nonHazardousWasteYear3,
        nonHazardousWasteProductionUnit: dto.nonHazardousWasteProductionUnit,
        nonHazardousWasteWaterUnit: dto.nonHazardousWasteWaterUnit,
        nonHazardousWasteProductionYear1: dto.nonHazardousWasteProductionYear1,
        nonHazardousWasteProductionYear2: dto.nonHazardousWasteProductionYear2,
        nonHazardousWasteProductionYear3: dto.nonHazardousWasteProductionYear3,
        nonHazardousWasteWaterYear1: dto.nonHazardousWasteWaterYear1,
        nonHazardousWasteWaterYear2: dto.nonHazardousWasteWaterYear2,
        nonHazardousWasteWaterYear3: dto.nonHazardousWasteWaterYear3,
        calculateBulkRshwd: dto.calculateBulkRshwd,
        calculateBulkRsnhwd: dto.calculateBulkRsnhwd,
        calculateBulkRshwdMultipled: dto.calculateBulkRshwdMultipled,
        calculateBulkRsnhwdMultipled: dto.calculateBulkRsnhwdMultipled,
        wmImplementationDetailsWmUnits: dto.wmImplementationDetailsWmUnits,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Process WM Manufacturing Units] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create waste management manufacturing unit record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processWmManufacturingUnitId: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Process WM Manufacturing Units] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list waste management manufacturing unit records.',
      );
    }
  }
}
