import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilizationManufacturingUnits,
  RawMaterialsUtilizationManufacturingUnitsDocument,
} from './schemas/raw-materials-utilization-manufacturing-units.schema';
import { CreateRawMaterialsUtilizationManufacturingUnitsDto } from './dto/create-raw-materials-utilization-manufacturing-units.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsUtilizationManufacturingUnitsService {
  constructor(
    @InjectModel(RawMaterialsUtilizationManufacturingUnits.name)
    private model: Model<RawMaterialsUtilizationManufacturingUnitsDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async create(
    dto: CreateRawMaterialsUtilizationManufacturingUnitsDto,
    vendorId: string,
  ): Promise<RawMaterialsUtilizationManufacturingUnitsDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsUtilizationManufacturingUnitsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsUtilizationManufacturingUnitsId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        unitName: dto.unitName.trim(),
        year: dto.year,
        yeardata1: dto.yeardata1,
        yeardata2: dto.yeardata2,
        yeardata3: dto.yeardata3,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Utilization Manufacturing Units] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials utilization manufacturing units record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Raw Materials Utilization Manufacturing Units] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials utilization manufacturing units records.',
      );
    }
  }
}
