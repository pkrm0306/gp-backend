import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsRecovery,
  RawMaterialsRecoveryDocument,
} from './schemas/raw-materials-recovery.schema';
import { CreateRawMaterialsRecoveryDto } from './dto/create-raw-materials-recovery.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsRecoveryService {
  constructor(
    @InjectModel(RawMaterialsRecovery.name)
    private model: Model<RawMaterialsRecoveryDocument>,
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
    dto: CreateRawMaterialsRecoveryDto,
    vendorId: string,
  ): Promise<RawMaterialsRecoveryDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsRecoveryId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsRecoveryId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        unitName: dto.unitName.trim(),
        year: dto.year,
        unit1: dto.unit1,
        yeardata1: dto.yeardata1,
        unit2: dto.unit2,
        yeardata2: dto.yeardata2,
        yeardata3: dto.yeardata3,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Recovery] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials recovery record.',
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
      console.error('[Raw Materials Recovery] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials recovery records.',
      );
    }
  }
}
