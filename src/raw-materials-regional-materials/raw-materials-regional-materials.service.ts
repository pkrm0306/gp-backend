import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsRegionalMaterials,
  RawMaterialsRegionalMaterialsDocument,
} from './schemas/raw-materials-regional-materials.schema';
import { CreateRawMaterialsRegionalMaterialsDto } from './dto/create-raw-materials-regional-materials.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsRegionalMaterialsService {
  constructor(
    @InjectModel(RawMaterialsRegionalMaterials.name)
    private model: Model<RawMaterialsRegionalMaterialsDocument>,
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
    dto: CreateRawMaterialsRegionalMaterialsDto,
    vendorId: string,
  ): Promise<RawMaterialsRegionalMaterialsDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsRegionalMaterialsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsRegionalMaterialsId: id,
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
      console.error('[Raw Materials Regional Materials] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials regional materials record.',
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
      console.error('[Raw Materials Regional Materials] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials regional materials records.',
      );
    }
  }
}
