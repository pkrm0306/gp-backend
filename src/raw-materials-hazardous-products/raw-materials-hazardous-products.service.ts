import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsHazardousProducts,
  RawMaterialsHazardousProductsDocument,
} from './schemas/raw-materials-hazardous-products.schema';
import { CreateRawMaterialsHazardousProductsDto } from './dto/create-raw-materials-hazardous-products.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import { filterHazardousProductsForVendorDisplay } from '../common/raw-materials/raw-materials-hazardous-display.util';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class RawMaterialsHazardousProductsService {
  constructor(
    @InjectModel(RawMaterialsHazardousProducts.name)
    private model: Model<RawMaterialsHazardousProductsDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
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

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  private mapDocument(doc: AllProductDocumentDocument) {
    const o = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    return {
      _id: o._id,
      productDocumentId: o.productDocumentId,
      vendorId: o.vendorId,
      urnNo: o.urnNo,
      eoiNo: o.eoiNo,
      documentForm: o.documentForm,
      documentFormSubsection: o.documentFormSubsection,
      formPrimaryId: o.formPrimaryId,
      documentName: o.documentName,
      documentOriginalName: o.documentOriginalName,
      documentLink: o.documentLink,
      createdDate: o.createdDate,
      updatedDate: o.updatedDate,
    };
  }

  /** Persist upload metadata only — no `raw_materials_hazardous_products` row. */
  private async saveDocumentOnly(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const now = new Date();
    const storedRelativePath = await this.saveFileToUrnFolder(file, urnNo);
    const productDocumentId = await this.sequenceHelper.getProductDocumentId();
    const doc = await this.allProductDocumentModel.create({
      productDocumentId,
      vendorId: vendorObjectId,
      urnNo,
      eoiNo: '',
      documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
      documentFormSubsection: 'products_test_report',
      formPrimaryId: productDocumentId,
      documentName: path.basename(storedRelativePath),
      documentOriginalName: file.originalname,
      documentLink: storedRelativePath,
      createdDate: now,
      updatedDate: now,
    });
    return {
      documentOnly: true,
      documents: [this.mapDocument(doc)],
    };
  }

  async create(
    dto: CreateRawMaterialsHazardousProductsDto,
    vendorId: string,
    productsTestReportFile?: Express.Multer.File,
  ) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const productRow = normalizeRawMaterialsProductRow({
        productsName: dto.productsName,
        productsTestReport: dto.productsTestReport,
      });
      const hasProductText = hasPartialRawMaterialsProductRow(productRow);

      if (!hasProductText && productsTestReportFile) {
        return this.saveDocumentOnly(urnNo, vendorObjectId, productsTestReportFile);
      }

      if (!hasProductText && !productsTestReportFile) {
        return { skipped: true };
      }

      const id = await this.sequenceHelper.getRawMaterialsHazardousProductsId();
      const now = new Date();

      let storedRelativePath = '';
      if (productsTestReportFile) {
        storedRelativePath = await this.saveFileToUrnFolder(
          productsTestReportFile,
          urnNo,
        );
      }

      const doc = new this.model({
        rawMaterialsHazardousProductsId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (productsTestReportFile && storedRelativePath) {
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
          documentFormSubsection: 'products_test_report',
          formPrimaryId: id,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: productsTestReportFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
      }

      return saved;
    } catch (error: any) {
      console.error('[Raw Materials Hazardous Products] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create hazardous product record.',
      );
    }
  }

  async createDocumentsOnly(
    urnNo: string,
    vendorId: string,
    files: Express.Multer.File[],
  ) {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const documents = [];
    for (const file of files) {
      const result = await this.saveDocumentOnly(
        urnNo.trim(),
        vendorObjectId,
        file,
      );
      documents.push(...result.documents);
    }
    return { documentOnly: true, documents };
  }

  /** Meaningful product table rows only (excludes file-only placeholders). */
  async countMeaningfulProductsByUrn(
    urnNo: string,
    vendorId: string,
  ): Promise<number> {
    if (!Types.ObjectId.isValid(vendorId)) {
      return 0;
    }
    const rows = await this.model
      .find({
        urnNo: urnNo.trim(),
        vendorId: new Types.ObjectId(vendorId),
      })
      .lean()
      .exec();
    return filterHazardousProductsForVendorDisplay(
      rows as Array<Record<string, unknown>>,
    ).length;
  }

  /** @deprecated Use countMeaningfulProductsByUrn — avoids counting empty stub rows. */
  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return this.countMeaningfulProductsByUrn(urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const rows = await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
      const plain = rows.map((r) =>
        typeof r.toObject === 'function' ? r.toObject() : r,
      );
      return filterHazardousProductsForVendorDisplay(
        plain as unknown as Array<Record<string, unknown>>,
      );
    } catch (error: any) {
      console.error('[Raw Materials Hazardous Products] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list hazardous product records.',
      );
    }
  }
}
