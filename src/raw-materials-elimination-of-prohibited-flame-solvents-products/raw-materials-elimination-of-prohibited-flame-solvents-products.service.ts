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

  async deleteAllProductsForUrn(urnNo: string, vendorId: string): Promise<void> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    await this.model.deleteMany({ urnNo: urnNo.trim(), vendorId: vendorObjectId });
  }

  private parseMeaningfulProducts(
    products?: Array<{ productsName?: string; productsTestReport?: string }>,
  ) {
    const rows: Array<{ productName: string; testReportReference: string }> = [];
    for (const item of products ?? []) {
      const n = normalizeRawMaterialsProductRow(item as Record<string, unknown>);
      if (hasPartialRawMaterialsProductRow(n)) {
        rows.push(n);
      }
    }
    return rows;
  }

  async replaceByUrn(params: {
    urnNo: string;
    vendorId: string;
    products?: Array<{ productsName?: string; productsTestReport?: string }>;
  }) {
    const vendorObjectId = this.toObjectId(params.vendorId, 'vendorId');
    const urnNo = params.urnNo.trim();
    const now = new Date();
    const meaningful = this.parseMeaningfulProducts(params.products);

    await this.deleteAllProductsForUrn(urnNo, params.vendorId);

    const inserted = [];
    for (const row of meaningful) {
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId();
      const doc = await this.model.create({
        rawMaterialsEliminationProhibitedFlameSolventsProductsId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: row.productName,
        productsTestReport: row.testReportReference,
        createdDate: now,
        updatedDate: now,
      });
      inserted.push(doc);
    }

    return {
      urnNo,
      vendorId: vendorObjectId.toString(),
      products: filterFormaldehydeStyleProductsForVendorDisplay(
        inserted.map((r) =>
          typeof r.toObject === 'function' ? r.toObject() : r,
        ) as Array<Record<string, unknown>>,
      ),
    };
  }

  async create(
    dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto,
    vendorId: string,
    options?: { replaceTableBeforeInsert?: boolean },
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
      const urnNo = dto.urnNo.trim();

      if (options?.replaceTableBeforeInsert) {
        await this.deleteAllProductsForUrn(urnNo, vendorId);
      }

      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId();
      const now = new Date();

      return await this.model.create({
        rawMaterialsEliminationProhibitedFlameSolventsProductsId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
        createdDate: now,
        updatedDate: now,
      });
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
