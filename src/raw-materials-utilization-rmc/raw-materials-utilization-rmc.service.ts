import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcDocument,
} from './schemas/raw-materials-utilization-rmc.schema';
import { CreateRawMaterialsUtilizationRmcDto } from './dto/create-raw-materials-utilization-rmc.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsUtilizationRmcService {
  constructor(
    @InjectModel(RawMaterialsUtilizationRmc.name)
    private model: Model<RawMaterialsUtilizationRmcDocument>,
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
    dto: CreateRawMaterialsUtilizationRmcDto,
    vendorId: string,
  ): Promise<RawMaterialsUtilizationRmcDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsUtilizationRmcId();
      const now = new Date();
      const { urnNo, ...metrics } = dto;

      const doc = new this.model({
        rawMaterialsUtilizationRmcId: id,
        urnNo: urnNo.trim(),
        vendorId: vendorObjectId,
        ...metrics,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Utilization RMC] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials utilization RMC record.',
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
      console.error('[Raw Materials Utilization RMC] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials utilization RMC records.',
      );
    }
  }
}
