import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsGreenSupply,
  RawMaterialsGreenSupplyDocument,
} from './schemas/raw-materials-green-supply.schema';
import { CreateRawMaterialsGreenSupplyDto } from './dto/create-raw-materials-green-supply.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsGreenSupplyService {
  constructor(
    @InjectModel(RawMaterialsGreenSupply.name)
    private model: Model<RawMaterialsGreenSupplyDocument>,
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
    dto: CreateRawMaterialsGreenSupplyDto,
    vendorId: string,
  ): Promise<RawMaterialsGreenSupplyDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsGreenSupplyId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsGreenSupplyId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        awarenessAndEducation: dto.awarenessAndEducation?.trim() || '',
        measuresImplemented: dto.measuresImplemented?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Green Supply] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials green supply record.',
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
      console.error('[Raw Materials Green Supply] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials green supply records.',
      );
    }
  }
}
