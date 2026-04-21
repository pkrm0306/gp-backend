import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlame,
  RawMaterialsEliminationOfProhibitedFlameDocument,
} from './schemas/raw-materials-elimination-of-prohibited-flame.schema';
import { CreateRawMaterialsEliminationOfProhibitedFlameDto } from './dto/create-raw-materials-elimination-of-prohibited-flame.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlame.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameDocument>,
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
    dto: CreateRawMaterialsEliminationOfProhibitedFlameDto,
    vendorId: string,
  ): Promise<RawMaterialsEliminationOfProhibitedFlameDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationOfProhibitedFlameId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        measuresImplemented: dto.measuresImplemented?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Prohibited Flame] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of prohibited flame record.',
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
      console.error(
        '[Raw Materials Elimination Of Prohibited Flame] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of prohibited flame records.',
      );
    }
  }
}
