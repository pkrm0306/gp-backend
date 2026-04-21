import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsDocument,
} from './schemas/raw-materials-rapidly-renewable-materials.schema';
import { CreateRawMaterialsRapidlyRenewableMaterialsDto } from './dto/create-raw-materials-rapidly-renewable-materials.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsRapidlyRenewableMaterialsService {
  constructor(
    @InjectModel(RawMaterialsRapidlyRenewableMaterials.name)
    private model: Model<RawMaterialsRapidlyRenewableMaterialsDocument>,
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
    dto: CreateRawMaterialsRapidlyRenewableMaterialsDto,
    vendorId: string,
  ): Promise<RawMaterialsRapidlyRenewableMaterialsDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsRapidlyRenewableMaterialsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsRapidlyRenewableMaterialsId: id,
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
      console.error('[Raw Materials Rapidly Renewable Materials] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials rapidly renewable materials record.',
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
      console.error('[Raw Materials Rapidly Renewable Materials] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials rapidly renewable materials records.',
      );
    }
  }
}
