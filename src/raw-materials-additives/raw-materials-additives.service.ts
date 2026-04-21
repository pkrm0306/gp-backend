import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsAdditives,
  RawMaterialsAdditivesDocument,
} from './schemas/raw-materials-additives.schema';
import { CreateRawMaterialsAdditivesDto } from './dto/create-raw-materials-additives.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsAdditivesService {
  constructor(
    @InjectModel(RawMaterialsAdditives.name)
    private model: Model<RawMaterialsAdditivesDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async create(dto: CreateRawMaterialsAdditivesDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsAdditivesId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsAdditivesId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        unitName: dto.unitName.trim(),
        year1: dto.year1,
        year1a: dto.year1a,
        year1b: dto.year1b,
        year1c: dto.year1c,
        year2: dto.year2,
        year2a: dto.year2a,
        year2b: dto.year2b,
        year2c: dto.year2c,
        year3: dto.year3,
        year3a: dto.year3a,
        year3b: dto.year3b,
        year3c: dto.year3c,
        psc: dto.psc.trim(),
        coc: dto.coc.trim(),
        percentcoc: dto.percentcoc.trim(),
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Additives] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials additives record.',
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
      console.error('[Raw Materials Additives] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials additives records.',
      );
    }
  }
}
