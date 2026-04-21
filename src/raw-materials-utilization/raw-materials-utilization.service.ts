import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilization,
  RawMaterialsUtilizationDocument,
} from './schemas/raw-materials-utilization.schema';
import { CreateRawMaterialsUtilizationDto } from './dto/create-raw-materials-utilization.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsUtilizationService {
  constructor(
    @InjectModel(RawMaterialsUtilization.name)
    private model: Model<RawMaterialsUtilizationDocument>,
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
    dto: CreateRawMaterialsUtilizationDto,
    vendorId: string,
  ): Promise<RawMaterialsUtilizationDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsUtilizationId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsUtilizationId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        details: dto.details?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Utilization] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials utilization record.',
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
      console.error('[Raw Materials Utilization] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials utilization records.',
      );
    }
  }
}
