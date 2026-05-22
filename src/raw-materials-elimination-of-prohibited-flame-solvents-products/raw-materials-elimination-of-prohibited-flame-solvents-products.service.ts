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
import {
  countMeaningfulRawMaterialsProductRows,
  filterFormaldehydeStyleProductsForVendorDisplay,
} from '../common/raw-materials/raw-materials-hazardous-display.util';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';

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
  ): Promise<RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument | null> {
    try {
      const productRow = normalizeRawMaterialsProductRow({
        productsName: dto.productsName,
        productsTestReport: dto.productsTestReport,
      });
      if (!hasPartialRawMaterialsProductRow(productRow)) {
        return null;
      }

      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationProhibitedFlameSolventsProductsId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
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

  async countMeaningfulProductsByUrn(
    urnNo: string,
    vendorId: string,
  ): Promise<number> {
    return countMeaningfulRawMaterialsProductRows(this.model, urnNo, vendorId);
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return this.countMeaningfulProductsByUrn(urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const rows = await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .lean()
        .exec();
      return filterFormaldehydeStyleProductsForVendorDisplay(
        rows as Array<Record<string, unknown>>,
      );
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
