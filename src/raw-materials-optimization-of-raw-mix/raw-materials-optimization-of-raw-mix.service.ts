import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsOptimizationOfRawMix,
  RawMaterialsOptimizationOfRawMixDocument,
} from './schemas/raw-materials-optimization-of-raw-mix.schema';
import { CreateRawMaterialsOptimizationOfRawMixDto } from './dto/create-raw-materials-optimization-of-raw-mix.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsOptimizationOfRawMixService {
  constructor(
    @InjectModel(RawMaterialsOptimizationOfRawMix.name)
    private model: Model<RawMaterialsOptimizationOfRawMixDocument>,
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
    dto: CreateRawMaterialsOptimizationOfRawMixDto,
    vendorId: string,
  ): Promise<RawMaterialsOptimizationOfRawMixDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsOptimizationOfRawMixId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsOptimizationOfRawMixId: id,
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
      console.error('[Raw Materials Optimization Of Raw Mix] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials optimization of raw mix record.',
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
      console.error('[Raw Materials Optimization Of Raw Mix] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials optimization of raw mix records.',
      );
    }
  }
}
