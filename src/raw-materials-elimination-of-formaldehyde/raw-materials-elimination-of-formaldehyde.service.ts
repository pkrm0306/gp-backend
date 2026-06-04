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
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { deleteUploadedFileByDocumentLink } from '../utils/upload-file.util';
import {
  countMeaningfulRawMaterialsProductRows,
  filterFormaldehydeStyleProductsForVendorDisplay,
} from '../common/raw-materials/raw-materials-hazardous-display.util';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  trackProductDocumentDeleteBatch,
  trackUploadedProductDocument,
} from '../documents/helpers/product-document-version.integration';

@Injectable()
export class RawMaterialsEliminationOfFormaldehydeService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfFormaldehyde.name)
    private model: Model<RawMaterialsEliminationOfFormaldehydeDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
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
    products?: Array<{
      productsName?: string;
      productsTestReport?: string;
    }>,
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
      const id = await this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId();
      const doc = await this.model.create({
        rawMaterialsEliminationOfFormaldehydeId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: row.productName,
        productsTestReport: row.testReportReference,
        createdDate: now,
        updatedDate: now,
      });
      inserted.push(doc);
    }

    const keepIds = params.existingDocumentIds ?? [];
    const existingDocs = await this.allProductDocumentModel.find({
      vendorId: vendorObjectId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      isDeleted: { $ne: true },
    });

    const keepRefs = params.existingDocumentIds !== undefined ? keepIds : null;
    const oldLinks: string[] = [];
    const docsToDelete: typeof existingDocs = [];
    for (const doc of existingDocs) {
      const keep =
        keepRefs === null ||
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
        sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
        userId: vendorObjectId,
        docs: docsToDelete,
      });
    }

    const documents = [];
    const firstId = inserted[0]?.rawMaterialsEliminationOfFormaldehydeId;
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const d = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId: i === 0 && firstId ? firstId : productDocumentId,
        documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
        documentOriginalName: file.originalname,
        documentLink: uploaded.fileUrl,
        createdDate: now,
        updatedDate: now,
      });
      documents.push(d);
      await trackUploadedProductDocument(this.documentVersioningService, {
        urnNo,
        sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
        subsectionKey: 'supporting_documents',
        userId: vendorObjectId,
        documentId: d._id,
        productDocumentId,
        filePath: uploaded.fileUrl,
        originalName: file.originalname,
        storedName: uploaded.fileName || path.basename(uploaded.fileUrl),
        file,
        action: 'added',
      });
    }

    for (const link of oldLinks) {
      try {
        await deleteUploadedFileByDocumentLink(link);
      } catch {
        // ignore
      }
    }

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

  /** File-only: documents only — no formaldehyde product row. */
  private async saveDocumentOnly(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const now = new Date();
    const uploaded = await this.saveFileToUrnFolder(file, urnNo);
    const productDocumentId = await this.sequenceHelper.getProductDocumentId();
    const doc = await this.allProductDocumentModel.create({
      productDocumentId,
      vendorId: vendorObjectId,
      urnNo,
      eoiNo: '',
      documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      documentFormSubsection: 'supporting_documents',
      formPrimaryId: productDocumentId,
      documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
      documentOriginalName: file.originalname,
      documentLink: uploaded.fileUrl,
      createdDate: now,
      updatedDate: now,
    });
    await trackUploadedProductDocument(this.documentVersioningService, {
      urnNo,
      sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      subsectionKey: 'supporting_documents',
      userId: vendorObjectId,
      documentId: doc._id,
      productDocumentId,
      filePath: uploaded.fileUrl,
      originalName: file.originalname,
      storedName: uploaded.fileName || path.basename(uploaded.fileUrl),
      file,
      action: 'added',
    });
    return { documentOnly: true as const, documents: [doc] };
  }

  async create(
    dto: CreateRawMaterialsEliminationOfFormaldehydeDto,
    vendorId: string,
    formaldehydeFile?: Express.Multer.File,
    options?: { replaceTableBeforeInsert?: boolean },
  ): Promise<
    | RawMaterialsEliminationOfFormaldehydeDocument
    | { documentOnly: true; documents: unknown[] }
  > {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const productRow = normalizeRawMaterialsProductRow({
        productsName: dto.productsName,
        productsTestReport: dto.productsTestReport,
      });
      const hasProductText = hasPartialRawMaterialsProductRow(productRow);

      if (options?.replaceTableBeforeInsert) {
        await this.deleteAllProductsForUrn(urnNo, vendorId);
      }

      if (!hasProductText && formaldehydeFile) {
        return this.saveDocumentOnly(urnNo, vendorObjectId, formaldehydeFile);
      }

      if (!hasProductText) {
        return { skipped: true } as any;
      }

      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationOfFormaldehydeId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (formaldehydeFile) {
        const uploaded = await this.saveFileToUrnFolder(formaldehydeFile, urnNo);
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        const createdDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: id,
          documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
          documentOriginalName: formaldehydeFile.originalname,
          documentLink: uploaded.fileUrl,
          createdDate: now,
          updatedDate: now,
        });
        await trackUploadedProductDocument(this.documentVersioningService, {
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
          subsectionKey: 'supporting_documents',
          userId: vendorObjectId,
          documentId: createdDoc._id,
          productDocumentId,
          filePath: uploaded.fileUrl,
          originalName: formaldehydeFile.originalname,
          storedName: uploaded.fileName || path.basename(uploaded.fileUrl),
          file: formaldehydeFile,
          action: 'added',
        });
      }

      return saved;
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
