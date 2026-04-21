import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsEliminationOfFormaldehyde,
  RawMaterialsEliminationOfFormaldehydeDocument,
} from './schemas/raw-materials-elimination-of-formaldehyde.schema';
import { CreateRawMaterialsEliminationOfFormaldehydeDto } from './dto/create-raw-materials-elimination-of-formaldehyde.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsEliminationOfFormaldehydeService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfFormaldehyde.name)
    private model: Model<RawMaterialsEliminationOfFormaldehydeDocument>,
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
    dto: CreateRawMaterialsEliminationOfFormaldehydeDto,
    vendorId: string,
  ): Promise<RawMaterialsEliminationOfFormaldehydeDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationOfFormaldehydeId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        productsName: dto.productsName.trim(),
        productsTestReport: dto.productsTestReport.trim(),
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Formaldehyde] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of formaldehyde record.',
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
        '[Raw Materials Elimination Of Formaldehyde] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of formaldehyde records.',
      );
    }
  }
}
