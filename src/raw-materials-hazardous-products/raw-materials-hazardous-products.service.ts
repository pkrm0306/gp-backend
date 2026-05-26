import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
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
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../utils/upload-file.util';
import * as path from 'path';

export type HazardousProductRowInput = {
  productsName?: string;
  productsTestReport?: string;
  productsTestReportFileName?: string;
};

@Injectable()
export class RawMaterialsHazardousProductsService {
  constructor(
    @InjectModel(RawMaterialsHazardousProducts.name)
    private model: Model<RawMaterialsHazardousProductsDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
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
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
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

  private toPublicProductRow(row: RawMaterialsHazardousProductsDocument | Record<string, unknown>) {
    const o = typeof (row as RawMaterialsHazardousProductsDocument).toObject === 'function'
      ? (row as RawMaterialsHazardousProductsDocument).toObject()
      : row;
    return {
      _id: (o as { _id?: Types.ObjectId })._id,
      rawMaterialsHazardousProductsId: (o as RawMaterialsHazardousProducts).rawMaterialsHazardousProductsId,
      urnNo: (o as RawMaterialsHazardousProducts).urnNo,
      vendorId: (o as RawMaterialsHazardousProducts).vendorId,
      productsName: String((o as RawMaterialsHazardousProducts).productsName ?? ''),
      productsTestReport: String((o as RawMaterialsHazardousProducts).productsTestReport ?? ''),
      productsTestReportFileName: String(
        (o as RawMaterialsHazardousProducts).productsTestReport ?? '',
      ),
      createdDate: (o as RawMaterialsHazardousProducts).createdDate,
      updatedDate: (o as RawMaterialsHazardousProducts).updatedDate,
    };
  }

  private parseMeaningfulProductRows(
    products: HazardousProductRowInput[] | undefined,
  ): Array<{ productName: string; testReportReference: string }> {
    if (!Array.isArray(products)) {
      return [];
    }
    const rows: Array<{ productName: string; testReportReference: string }> = [];
    for (const item of products) {
      const normalized = normalizeRawMaterialsProductRow(
        item as Record<string, unknown>,
      );
      if (hasPartialRawMaterialsProductRow(normalized)) {
        rows.push(normalized);
      }
    }
    return rows;
  }

  private resolveDocumentIdRefs(ids: string[]): {
    objectIds: Types.ObjectId[];
    productDocumentIds: number[];
  } {
    const objectIds: Types.ObjectId[] = [];
    const productDocumentIds: number[] = [];
    for (const raw of ids) {
      const value = String(raw).trim();
      if (!value) continue;
      if (Types.ObjectId.isValid(value)) {
        objectIds.push(new Types.ObjectId(value));
        continue;
      }
      const numericId = Number(value);
      if (Number.isFinite(numericId)) {
        productDocumentIds.push(numericId);
      }
    }
    return { objectIds, productDocumentIds };
  }

  private docMatchesIdRefs(
    doc: { _id?: Types.ObjectId; productDocumentId?: number },
    refs: { objectIds: Types.ObjectId[]; productDocumentIds: number[] },
  ): boolean {
    if (
      doc._id &&
      refs.objectIds.some((id) => id.equals(doc._id as Types.ObjectId))
    ) {
      return true;
    }
    return (
      doc.productDocumentId !== undefined &&
      refs.productDocumentIds.includes(doc.productDocumentId)
    );
  }

  async deleteAllProductsForUrn(
    urnNo: string,
    vendorId: string,
    session?: ClientSession,
  ): Promise<void> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    await this.model.deleteMany(
      { urnNo: urnNo.trim(), vendorId: vendorObjectId },
      { session },
    );
  }

  /** Remove all product metadata rows for URN (details-only save / explicit clear). */
  async clearAllProductsForUrn(urnNo: string, vendorId: string): Promise<void> {
    await this.deleteAllProductsForUrn(urnNo, vendorId);
  }

  private async syncHazardousProductDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    eoiNo: string;
    now: Date;
    session: ClientSession;
    uploadedFiles: Express.Multer.File[];
    existingDocumentIds?: string[];
    firstProductRowId?: number;
    createdFileFullPaths: string[];
  }): Promise<{
    documents: ReturnType<RawMaterialsHazardousProductsService['mapDocument']>[];
    oldFileLinksToDeleteAfterCommit: string[];
  }> {
    const {
      urnNo,
      vendorObjectId,
      eoiNo,
      now,
      session,
      uploadedFiles,
      existingDocumentIds,
      firstProductRowId,
      createdFileFullPaths,
    } = params;

    const keepRefs =
      existingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingDocumentIds)
        : null;

    const existingDocs = await this.allProductDocumentModel
      .find({
        vendorId: vendorObjectId,
        urnNo,
        documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
        isDeleted: { $ne: true },
      })
      .session(session);

    const retainIds: Types.ObjectId[] = [];
    const deleteIds: Types.ObjectId[] = [];
    const oldFileLinksToDeleteAfterCommit: string[] = [];

    for (const doc of existingDocs) {
      const retain =
        keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
      if (retain) {
        retainIds.push(doc._id as Types.ObjectId);
      } else {
        deleteIds.push(doc._id as Types.ObjectId);
        if (doc.documentLink) {
          oldFileLinksToDeleteAfterCommit.push(doc.documentLink);
        }
      }
    }

    if (deleteIds.length) {
      await this.allProductDocumentModel.updateMany(
        { _id: { $in: deleteIds } },
        {
          $set: {
            isDeleted: true,
            deletedAt: now,
            deletedBy: vendorObjectId,
            updatedDate: now,
          },
        },
        { session },
      );
    }

    const formPrimaryId = firstProductRowId ?? 0;
    if (retainIds.length) {
      await this.allProductDocumentModel.updateMany(
        { _id: { $in: retainIds } },
        { $set: { formPrimaryId, eoiNo, updatedDate: now } },
        { session },
      );
    }

    const documents: ReturnType<RawMaterialsHazardousProductsService['mapDocument']>[] =
      [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      createdFileFullPaths.push(uploaded.fileUrl);
      const productDocumentId =
        await this.sequenceHelper.getProductDocumentId();
      const linkFormPrimaryId =
        i === 0 && firstProductRowId ? firstProductRowId : productDocumentId;
      const inserted = await this.allProductDocumentModel.create(
        [
          {
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo,
            eoiNo,
            documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
            documentFormSubsection: 'products_test_report',
            formPrimaryId: linkFormPrimaryId,
            documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
            documentOriginalName: file.originalname,
            documentLink: uploaded.fileUrl,
            createdDate: now,
            updatedDate: now,
          },
        ],
        { session },
      );
      documents.push(this.mapDocument(inserted[0]));
    }

    return { documents, oldFileLinksToDeleteAfterCommit };
  }

  /**
   * Full replace: product table snapshot + document sync (Product Performance pattern).
   */
  async replaceByUrn(params: {
    urnNo: string;
    vendorId: string;
    eoiNo?: string;
    products?: HazardousProductRowInput[];
    uploadedFiles?: Express.Multer.File[];
    existingDocumentIds?: string[];
  }): Promise<{
    urnNo: string;
    vendorId: string;
    products: ReturnType<RawMaterialsHazardousProductsService['toPublicProductRow']>[];
    documents: ReturnType<RawMaterialsHazardousProductsService['mapDocument']>[];
  }> {
    const session = await this.connection.startSession();
    session.startTransaction();
    const createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      const vendorObjectId = this.toObjectId(params.vendorId, 'vendorId');
      const urnNo = params.urnNo.trim();
      const eoiNo = String(params.eoiNo ?? '').trim();
      const now = new Date();
      const meaningfulRows = this.parseMeaningfulProductRows(params.products);
      const uploadFiles = params.uploadedFiles ?? [];

      if (
        meaningfulRows.length === 0 &&
        uploadFiles.length === 0 &&
        params.existingDocumentIds === undefined
      ) {
        const existingDocCount = await this.allProductDocumentModel
          .countDocuments({
            vendorId: vendorObjectId,
            urnNo,
            documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
            isDeleted: { $ne: true },
          })
          .session(session);
        if (existingDocCount === 0) {
          throw new BadRequestException(
            'Please fill in at least one field in the form before continuing.',
          );
        }
      }

      await this.deleteAllProductsForUrn(urnNo, params.vendorId, session);

      const docsToInsert = [];
      for (const row of meaningfulRows) {
        const id = await this.sequenceHelper.getRawMaterialsHazardousProductsId();
        docsToInsert.push({
          rawMaterialsHazardousProductsId: id,
          urnNo,
          vendorId: vendorObjectId,
          productsName: row.productName,
          productsTestReport: row.testReportReference,
          createdDate: now,
          updatedDate: now,
        });
      }

      const insertedProducts =
        docsToInsert.length > 0
          ? await this.model.insertMany(docsToInsert, { session })
          : [];

      const firstProductRowId = insertedProducts[0]?.rawMaterialsHazardousProductsId;

      const docSync = await this.syncHazardousProductDocuments({
        urnNo,
        vendorObjectId,
        eoiNo,
        now,
        session,
        uploadedFiles: uploadFiles,
        existingDocumentIds: params.existingDocumentIds,
        firstProductRowId,
        createdFileFullPaths,
      });
      oldFileLinksToDeleteAfterCommit = docSync.oldFileLinksToDeleteAfterCommit;

      await session.commitTransaction();
      session.endSession();

      for (const link of oldFileLinksToDeleteAfterCommit) {
        try {
          await deleteUploadedFileByDocumentLink(link);
        } catch {
          // ignore post-commit cleanup errors
        }
      }

      const retainedDocs =
        docSync.documents.length > 0
          ? docSync.documents
          : (
              await this.allProductDocumentModel
                .find({
                  vendorId: vendorObjectId,
                  urnNo,
                  documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                  isDeleted: { $ne: true },
                })
                .sort({ productDocumentId: -1 })
                .exec()
            ).map((d) => this.mapDocument(d));

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        products: insertedProducts.map((r) => this.toPublicProductRow(r)),
        documents: retainedDocs,
      };
    } catch (error: unknown) {
      await session.abortTransaction();
      session.endSession();
      for (const link of createdFileFullPaths) {
        try {
          await deleteUploadedFileByDocumentLink(link);
        } catch {
          // ignore
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('[Raw Materials Hazardous Products] Replace error:', error);
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to replace hazardous product records.',
      );
    }
  }

  /** Persist upload metadata only — no product table row. */
  private async saveDocumentOnly(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    file: Express.Multer.File,
    eoiNo = '',
  ) {
    const now = new Date();
    const uploaded = await this.saveFileToUrnFolder(file, urnNo);
    const productDocumentId = await this.sequenceHelper.getProductDocumentId();
    const doc = await this.allProductDocumentModel.create({
      productDocumentId,
      vendorId: vendorObjectId,
      urnNo,
      eoiNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
      documentFormSubsection: 'products_test_report',
      formPrimaryId: productDocumentId,
      documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
      documentOriginalName: file.originalname,
      documentLink: uploaded.fileUrl,
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
    options?: { replaceTableBeforeInsert?: boolean },
  ) {
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

      if (!hasProductText && productsTestReportFile) {
        return this.saveDocumentOnly(
          urnNo,
          vendorObjectId,
          productsTestReportFile,
          String(dto.eoiNo ?? '').trim(),
        );
      }

      if (!hasProductText && !productsTestReportFile) {
        return { skipped: true };
      }

      const id = await this.sequenceHelper.getRawMaterialsHazardousProductsId();
      const now = new Date();

      let storedRelativePath = '';
      if (productsTestReportFile) {
        const uploaded = await this.saveFileToUrnFolder(
          productsTestReportFile,
          urnNo,
        );
        storedRelativePath = uploaded.fileUrl;
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
          eoiNo: String(dto.eoiNo ?? '').trim(),
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
    eoiNo?: string,
  ) {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const documents = [];
    for (const file of files) {
      const result = await this.saveDocumentOnly(
        urnNo.trim(),
        vendorObjectId,
        file,
        String(eoiNo ?? '').trim(),
      );
      documents.push(...result.documents);
    }
    return { documentOnly: true, documents };
  }

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
