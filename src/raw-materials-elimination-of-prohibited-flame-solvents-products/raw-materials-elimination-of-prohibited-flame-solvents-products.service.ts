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
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { deleteUploadedFileByDocumentLink, uploadFile } from '../utils/upload-file.util';
import {
  countMeaningfulRawMaterialsProductRows,
  filterFormaldehydeStyleProductsForVendorDisplay,
} from '../common/raw-materials/raw-materials-hazardous-display.util';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import * as path from 'path';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

const SOLVENTS_PRODUCTS_DOCUMENT_FORMS = [
  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
];

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameSolventsProductsService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlameSolventsProducts.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
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
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  async deleteAllProductsForUrn(urnNo: string, vendorId: string): Promise<void> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    await this.model.deleteMany({ urnNo: urnNo.trim(), vendorId: vendorObjectId });
  }

  private parseMeaningfulProducts(
    products?: Array<Record<string, unknown>>,
  ) {
    const rows: Array<{ productName: string; testReportReference: string }> = [];
    for (const item of products ?? []) {
      const n = normalizeRawMaterialsProductRow(item);
      if (hasPartialRawMaterialsProductRow(n)) {
        rows.push(n);
      }
    }
    return rows;
  }

  private async syncDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    uploadFiles: Express.Multer.File[];
    existingDocumentIds?: string[];
    firstProductRowId?: number;
  }) {
    const { urnNo, vendorObjectId, uploadFiles, existingDocumentIds, firstProductRowId } =
      params;
    const now = new Date();
    const existingDocs = await this.allProductDocumentModel.find({
      vendorId: vendorObjectId,
      urnNo,
      documentForm: { $in: SOLVENTS_PRODUCTS_DOCUMENT_FORMS },
      isDeleted: { $ne: true },
    });

    const keepIds = existingDocumentIds ?? [];
    const keepRefs = existingDocumentIds !== undefined ? keepIds : null;
    const oldLinks: string[] = [];
    const docsToDelete: typeof existingDocs = [];

    if (keepRefs !== null) {
      for (const doc of existingDocs) {
        const keep =
          keepIds.includes(String(doc.productDocumentId)) ||
          keepIds.includes(String(doc._id));
        if (!keep) {
          docsToDelete.push(doc);
          if (doc.documentLink) oldLinks.push(doc.documentLink);
          doc.isDeleted = true;
          doc.deletedAt = now;
          doc.deletedBy = vendorObjectId;
          doc.updatedDate = now;
          await doc.save();
        }
      }
      if (docsToDelete.length) {
        await trackProductDocumentDeleteBatch({
          versioning: this.documentVersioningService,
          urnNo,
          sectionKey:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
          userId: vendorObjectId,
          docs: docsToDelete,
          slotKeyMode: 'subsection',
        });
      }
    }

    const documents = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const d = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm:
          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId:
          i === 0 && firstProductRowId ? firstProductRowId : productDocumentId,
        documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
        documentOriginalName: file.originalname,
        documentLink: uploaded.fileUrl,
        createdDate: now,
        updatedDate: now,
      });
      documents.push(d);
      await trackCertificationDocumentAfterCreate({
        productModel: this.productModel,
        versioning: this.documentVersioningService,
        documentModel: this.allProductDocumentModel,
        urnNo,
        sectionKey:
          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
        userId: vendorObjectId,
        vendorId: vendorObjectId,
        doc: d,
        file,
      });
    }

    for (const link of oldLinks) {
      try {
        await deleteUploadedFileByDocumentLink(link);
      } catch {
        // ignore
      }
    }

    return documents;
  }

  private async saveDocumentOnly(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    files: Express.Multer.File[],
  ) {
    const documents = await this.syncDocuments({
      urnNo,
      vendorObjectId,
      uploadFiles: files,
    });
    return { documentOnly: true as const, documents };
  }

  async replaceByUrn(params: {
    urnNo: string;
    vendorId: string;
    products?: Array<Record<string, unknown>>;
    uploadedFiles?: Express.Multer.File[];
    existingDocumentIds?: string[];
  }) {
    const vendorObjectId = this.toObjectId(params.vendorId, 'vendorId');
    const urnNo = params.urnNo.trim();
    const now = new Date();
    const meaningful = this.parseMeaningfulProducts(params.products);
    const uploadFiles = params.uploadedFiles ?? [];

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

    const documents = await this.syncDocuments({
      urnNo,
      vendorObjectId,
      uploadFiles,
      existingDocumentIds: params.existingDocumentIds,
      firstProductRowId:
        inserted[0]?.rawMaterialsEliminationProhibitedFlameSolventsProductsId,
    });

    return {
      urnNo,
      vendorId: vendorObjectId.toString(),
      products: filterFormaldehydeStyleProductsForVendorDisplay(
        inserted.map((r) =>
          typeof r.toObject === 'function' ? r.toObject() : r,
        ) as Array<Record<string, unknown>>,
      ),
      documents,
    };
  }

  async create(
    dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto,
    vendorId: string,
    options?: {
      replaceTableBeforeInsert?: boolean;
      uploadFiles?: Express.Multer.File[];
    },
  ): Promise<
    | RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument
    | { documentOnly: true; documents: unknown[] }
    | null
  > {
    try {
      const productRow = normalizeRawMaterialsProductRow({
        productsName: dto.productsName,
        productsTestReport: dto.productsTestReport,
      });
      const hasProductText = hasPartialRawMaterialsProductRow(productRow);
      const uploadFiles = options?.uploadFiles ?? [];

      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();

      if (options?.replaceTableBeforeInsert) {
        await this.deleteAllProductsForUrn(urnNo, vendorId);
      }

      if (!hasProductText && uploadFiles.length > 0) {
        return this.saveDocumentOnly(urnNo, vendorObjectId, uploadFiles);
      }

      if (!hasProductText) {
        return null;
      }

      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId();
      const now = new Date();

      const saved = await this.model.create({
        rawMaterialsEliminationProhibitedFlameSolventsProductsId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
        createdDate: now,
        updatedDate: now,
      });

      if (uploadFiles.length > 0) {
        await this.syncDocuments({
          urnNo,
          vendorObjectId,
          uploadFiles,
          firstProductRowId: id,
        });
      }

      return saved;
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
