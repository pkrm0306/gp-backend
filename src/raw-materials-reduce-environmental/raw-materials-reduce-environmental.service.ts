import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsReduceEnvironmental,
  RawMaterialsReduceEnvironmentalDocument,
} from './schemas/raw-materials-reduce-environmental.schema';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsReduceEnvironmentalService {
  constructor(
    @InjectModel(RawMaterialsReduceEnvironmental.name)
    private model: Model<RawMaterialsReduceEnvironmentalDocument>,
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
    dto: CreateRawMaterialsReduceEnvironmentalDto,
    vendorId: string,
  ): Promise<RawMaterialsReduceEnvironmentalDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsReduceEnvironmentalId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsReduceEnvironmentalId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        location: dto.location.trim(),
        enhancementOfMinesLife: dto.enhancementOfMinesLife.trim(),
        topsoilConservation: dto.topsoilConservation.trim(),
        waterTableManagement: dto.waterTableManagement.trim(),
        restorationOfSpentMines: dto.restorationOfSpentMines.trim(),
        greenBeltDevelopmentAndBioDiversity:
          dto.greenBeltDevelopmentAndBioDiversity.trim(),
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Reduce Environmental] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials reduce environmental record.',
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
      console.error('[Raw Materials Reduce Environmental] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials reduce environmental records.',
      );
    }
  }
}
