import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlameSolventsProducts,
  RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument,
} from './schemas/raw-materials-elimination-of-prohibited-flame-solvents-products.schema';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents-products.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameSolventsProductsService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlameSolventsProducts.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument>,
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
    dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto,
    vendorId: string,
  ): Promise<RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationProhibitedFlameSolventsProductsId: id,
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
        '[Raw Materials Elimination Of Prohibited Flame Solvents Products] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of prohibited flame solvents products record.',
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
        '[Raw Materials Elimination Of Prohibited Flame Solvents Products] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of prohibited flame solvents products records.',
      );
    }
  }
}
