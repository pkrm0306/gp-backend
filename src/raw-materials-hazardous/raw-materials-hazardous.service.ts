import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsHazardous,
  RawMaterialsHazardousDocument,
} from './schemas/raw-materials-hazardous.schema';
import { CreateRawMaterialsHazardousDto } from './dto/create-raw-materials-hazardous.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';

@Injectable()
export class RawMaterialsHazardousService {
  constructor(
    @InjectModel(RawMaterialsHazardous.name)
    private model: Model<RawMaterialsHazardousDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async create(
    dto: CreateRawMaterialsHazardousDto,
    vendorId: string,
  ): Promise<RawMaterialsHazardousDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const details = dto.details?.trim() ?? '';
      const eoiNo = dto.eoiNo?.trim() ?? '';

      const existing = await this.model
        .findOne({ urnNo, vendorId: vendorObjectId })
        .sort({ rawMaterialsHazardousId: -1 })
        .exec();

      if (existing) {
        existing.details = details;
        existing.eoiNo = eoiNo;
        existing.updatedDate = now;
        return await existing.save();
      }

      const id = await this.sequenceHelper.getRawMaterialsHazardousId();
      const doc = new this.model({
        rawMaterialsHazardousId: id,
        urnNo,
        vendorId: vendorObjectId,
        eoiNo,
        details,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Raw Materials Hazardous] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials hazardous record.',
      );
    }
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return countVendorUrnDocuments(this.model, urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Raw Materials Hazardous] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials hazardous records.',
      );
    }
  }
}
