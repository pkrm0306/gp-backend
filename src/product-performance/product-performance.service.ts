import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  ProductPerformance,
  ProductPerformanceDocument,
} from './schemas/product-performance.schema';
import {
  PpTestReport,
  PpTestReportDocument,
} from './schemas/pp-test-report.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProductPerformanceDto } from './dto/create-product-performance.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { normalizeTestReportRow } from '../common/form-partial-field.util';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../utils/upload-file.util';
import {
  collectProductPerformanceUploadFiles,
  PERFORMANCE_TEST_REPORT_SUBSECTION,
} from './product-performance-upload.util';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';
import {
  isVendorResubmitCycle,
  trackInsertedCertificationDocuments,
} from '../documents/helpers/certification-document-version.util';

export type SavedTestReportRow = {
  _id?: Types.ObjectId;
  productPerformanceTestReportId?: number;
  productName: string;
  testReportFileName: string;
};

@Injectable()
export class ProductPerformanceService implements OnModuleInit {
  private static readonly EMPTY_PRODUCT_NORMALIZED_KEY = '__default__';
  private static readonly EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY = '__unnamed__';

  constructor(
    @InjectModel(ProductPerformance.name)
    private productPerformanceModel: Model<ProductPerformanceDocument>,
    @InjectModel(PpTestReport.name)
    private ppTestReportModel: Model<PpTestReportDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async assertVendorCanEditUrn(vendorId: string, urnNo: string): Promise<void> {
    await assertVendorCanEditUrn(this.productModel, vendorId, urnNo);
  }

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.productPerformanceModel.syncIndexes();
      await this.ppTestReportModel.syncIndexes();
    } catch (error) {
      console.error(
        '[product-performance] syncIndexes failed (check existing duplicates):',
        error,
      );
    }
  }

  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  private normalizeText(value?: string): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private normalizedProductNameKey(productName?: string): string {
    return (
      this.normalizeText(productName) ||
      ProductPerformanceService.EMPTY_PRODUCT_NORMALIZED_KEY
    );
  }

  private normalizedTestReportFileNameKey(testReportFileName?: string): string {
    return (
      this.normalizeText(testReportFileName) ||
      ProductPerformanceService.EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY
    );
  }

  private isMeaningfulTestReportRow(
    productName: string,
    testReportFileName: string,
  ): boolean {
    return Boolean(productName.trim() || testReportFileName.trim());
  }

  private dedupeTestReportRows(
    rows: Array<{
      productName: string;
      testReportFileName: string;
      normalizedProductName: string;
      normalizedTestReportFileName: string;
    }>,
  ) {
    const seen = new Set<string>();
    const unique: typeof rows = [];
    for (const row of rows) {
      if (!this.isMeaningfulTestReportRow(row.productName, row.testReportFileName)) {
        continue;
      }
      const key = `${row.normalizedProductName}__${row.normalizedTestReportFileName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(row);
    }
    return unique;
  }

  /** Full replace list from request body only (never from upload filenames). */
  private parseIncomingTestReportRows(
    dto: CreateProductPerformanceDto,
  ): Array<{
    productName: string;
    testReportFileName: string;
    normalizedProductName: string;
    normalizedTestReportFileName: string;
  }> {
    const defaultProductName = String(dto.productName ?? '').trim();
    const rawRows =
      Array.isArray(dto.testReports) && dto.testReports.length > 0
        ? dto.testReports
        : dto.testReportFileName?.trim()
          ? [
              {
                productName: dto.productName,
                testReportFileName: dto.testReportFileName,
              },
            ]
          : [];

    const parsedRows: Array<{
      productName: string;
      testReportFileName: string;
      normalizedProductName: string;
      normalizedTestReportFileName: string;
    }> = [];

    for (const row of rawRows) {
      const normalized = normalizeTestReportRow(
        row as Record<string, unknown>,
      );
      const productName = (
        normalized.productName || defaultProductName
      ).trim();
      const testReportFileName = normalized.testReportFileName.trim();
      if (!this.isMeaningfulTestReportRow(productName, testReportFileName)) {
        continue;
      }
      parsedRows.push({
        productName,
        testReportFileName,
        normalizedProductName: this.normalizedProductNameKey(productName),
        normalizedTestReportFileName:
          this.normalizedTestReportFileNameKey(testReportFileName),
      });
    }

    return this.dedupeTestReportRows(parsedRows);
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

  /**
   * Count performance documents retained after applying existingDocumentIds.
   * Omit existingDocumentIds → keep all docs on URN (vendor text-only save).
   */
  async countRetainedProductPerformanceDocuments(
    urnNo: string,
    vendorId: string,
    existingDocumentIds?: string[],
  ): Promise<number> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const keepRefs =
      existingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingDocumentIds)
        : null;

    const existingDocs = await this.allProductDocumentModel
      .find({
        vendorId: vendorObjectId,
        urnNo,
        documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
        isDeleted: { $ne: true },
      })
      .lean()
      .exec();

    let retained = 0;
    for (const doc of existingDocs) {
      const keep =
        keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
      if (keep) retained += 1;
    }
    return retained;
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

  private async syncPerformanceDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    eoiNo?: string;
    formPrimaryId: number;
    now: Date;
    session: ClientSession;
    uploadedFiles: Express.Multer.File[];
    incomingRows: Array<{
      productName: string;
      testReportFileName: string;
    }>;
    existingDocumentIds?: string[];
    createdFileFullPaths: string[];
  }): Promise<{
    totalDocumentCount: number;
    oldFileLinksToDeleteAfterCommit: string[];
  }> {
    const {
      urnNo,
      vendorObjectId,
      eoiNo,
      formPrimaryId,
      now,
      session,
      uploadedFiles,
      incomingRows,
      existingDocumentIds,
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
        documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
        isDeleted: { $ne: true },
      })
      .session(session);

    const retainIds: Types.ObjectId[] = [];
    const deleteIds: Types.ObjectId[] = [];
    const docsToDelete: typeof existingDocs = [];
    const oldFileLinksToDeleteAfterCommit: string[] = [];

    for (const doc of existingDocs) {
      const retain =
        keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
      if (retain) {
        retainIds.push(doc._id as Types.ObjectId);
      } else {
        deleteIds.push(doc._id as Types.ObjectId);
        docsToDelete.push(doc);
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
      await trackProductDocumentDeleteBatch({
        versioning: this.documentVersioningService,
        urnNo,
        sectionKey: DocumentSectionKey.PRODUCT_PERFORMANCE,
        userId: vendorObjectId,
        docs: docsToDelete,
        slotKeyMode: 'subsection',
        session,
      });
    }

    if (retainIds.length) {
      await this.allProductDocumentModel.updateMany(
        { _id: { $in: retainIds } },
        { $set: { formPrimaryId, updatedDate: now } },
        { session },
      );
    }

    if (uploadedFiles.length) {
      const isResubmitCycle = await isVendorResubmitCycle(
        this.productModel,
        urnNo,
        session,
      );
      const docsToInsert = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const uploaded = await this.saveFileToUrnFolder(file, urnNo);
        createdFileFullPaths.push(uploaded.fileUrl);

        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo,
          documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
          documentFormSubsection: PERFORMANCE_TEST_REPORT_SUBSECTION,
          formPrimaryId,
          documentName: uploaded.fileName || `Test report ${i + 1}`,
          documentOriginalName: file.originalname,
          documentLink: uploaded.fileUrl,
          createdDate: now,
          updatedDate: now,
        });
      }
      const insertedDocs = await this.allProductDocumentModel.insertMany(
        docsToInsert,
        { session },
      );
      await trackInsertedCertificationDocuments({
        versioning: this.documentVersioningService,
        documentModel: this.allProductDocumentModel,
        urnNo,
        sectionKey: DocumentSectionKey.PRODUCT_PERFORMANCE,
        userId: vendorObjectId,
        vendorId: vendorObjectId,
        insertedDocs,
        isResubmitCycle,
        session,
        filesByIndex: uploadedFiles,
      });
    }

    const totalDocumentCount = await this.allProductDocumentModel
      .countDocuments({
        vendorId: vendorObjectId,
        urnNo,
        documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
        isDeleted: { $ne: true },
      })
      .session(session);

    return { totalDocumentCount, oldFileLinksToDeleteAfterCommit };
  }

  private async replaceTestReportsTable(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    processProductPerformanceId: number;
    normalizedReports: Array<{
      productName: string;
      testReportFileName: string;
      normalizedProductName: string;
      normalizedTestReportFileName: string;
    }>;
    now: Date;
    session: ClientSession;
  }): Promise<SavedTestReportRow[]> {
    const {
      urnNo,
      vendorObjectId,
      processProductPerformanceId,
      normalizedReports,
      now,
      session,
    } = params;

    await this.ppTestReportModel.deleteMany(
      { urnNo, vendorId: vendorObjectId },
      { session },
    );

    if (!normalizedReports.length) {
      return [];
    }

    const docs = [];
    for (const row of normalizedReports) {
      const productPerformanceTestReportId =
        await this.sequenceHelper.getProductPerformanceTestReportId();
      docs.push({
        productPerformanceTestReportId,
        urnNo,
        vendorId: vendorObjectId,
        processProductPerformanceId,
        productName: row.productName,
        testReportFileName: row.testReportFileName,
        normalizedProductName:
          row.normalizedProductName ||
          ProductPerformanceService.EMPTY_PRODUCT_NORMALIZED_KEY,
        normalizedTestReportFileName:
          row.normalizedTestReportFileName ||
          ProductPerformanceService.EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY,
        createdDate: now,
        updatedDate: now,
      });
    }

    const inserted = await this.ppTestReportModel.insertMany(docs, { session });
    return inserted.map((row) => ({
      _id: row._id as Types.ObjectId,
      productPerformanceTestReportId: row.productPerformanceTestReportId,
      productName: String(row.productName ?? ''),
      testReportFileName: String(row.testReportFileName ?? ''),
    }));
  }

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  private toPublicTestReports(rows: SavedTestReportRow[]) {
    return rows.map((r) => ({
      _id: r._id,
      productPerformanceTestReportId: r.productPerformanceTestReportId,
      productName: r.productName,
      testReportFileName: r.testReportFileName,
    }));
  }

  async createProductPerformance(
    createProductPerformanceDto: CreateProductPerformanceDto,
    vendorId: string,
    files?: Express.Multer.File[],
  ): Promise<{
    productPerformance: ProductPerformanceDocument;
    filesUploaded: number;
    totalDocumentCount: number;
    savedTestReports: SavedTestReportRow[];
  }> {
    const session = await this.connection.startSession();
    session.startTransaction();
    const createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = createProductPerformanceDto.urnNo;
      const now = new Date();
      const uploadedFiles = collectProductPerformanceUploadFiles(files);
      const incomingRows = this.parseIncomingTestReportRows(
        createProductPerformanceDto,
      );
      const embeddedTestReports = incomingRows.map((r) => ({
        productName: r.productName,
        testReportFileName: r.testReportFileName,
      }));

      const productRow = await this.connection
        .collection('products')
        .findOne(
          { urnNo, vendorId: vendorObjectId },
          { projection: { eoiNo: 1 } },
        );
      if (!productRow) {
        throw new NotFoundException(
          'URN not found or does not belong to this vendor',
        );
      }
      const eoiNo: string | undefined = productRow?.eoiNo;

      const existingProductPerformance = await this.productPerformanceModel
        .findOne({ urnNo, vendorId: vendorObjectId })
        .sort({ updatedDate: -1, createdDate: -1, _id: -1 })
        .session(session);

      const processProductPerformanceId =
        existingProductPerformance?.processProductPerformanceId ??
        (await this.sequenceHelper.getProductPerformanceId());

      const documentSync = await this.syncPerformanceDocuments({
        urnNo,
        vendorObjectId,
        eoiNo,
        formPrimaryId: processProductPerformanceId,
        now,
        session,
        uploadedFiles,
        incomingRows: embeddedTestReports,
        existingDocumentIds:
          createProductPerformanceDto.existingDocumentIds,
        createdFileFullPaths,
      });

      oldFileLinksToDeleteAfterCommit =
        documentSync.oldFileLinksToDeleteAfterCommit;

      const renewalType = createProductPerformanceDto.renewalType ?? null;
      const productPerformanceStatus =
        createProductPerformanceDto.productPerformanceStatus ?? 0;

      const savedProductPerformance = await this.productPerformanceModel
        .findOneAndUpdate(
          { urnNo, vendorId: vendorObjectId },
          {
            $set: {
              urnNo,
              vendorId: vendorObjectId,
              testReportFiles: documentSync.totalDocumentCount,
              renewalType,
              productPerformanceStatus,
              testReports: embeddedTestReports,
              updatedDate: now,
            },
            $setOnInsert: {
              processProductPerformanceId,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      if (!savedProductPerformance) {
        throw new InternalServerErrorException(
          'Failed to save product performance record',
        );
      }

      const savedTestReports = await this.replaceTestReportsTable({
        urnNo,
        vendorObjectId,
        processProductPerformanceId,
        normalizedReports: incomingRows,
        now,
        session,
      });

      savedProductPerformance.testReports = embeddedTestReports;
      savedProductPerformance.testReportFiles = documentSync.totalDocumentCount;

      await session.commitTransaction();
      session.endSession();

      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        try {
          await deleteUploadedFileByDocumentLink(fileLink);
        } catch {
          // Ignore file cleanup issues after successful commit
        }
      }

      return {
        productPerformance: savedProductPerformance,
        filesUploaded: uploadedFiles.length,
        totalDocumentCount: documentSync.totalDocumentCount,
        savedTestReports,
      };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      try {
        for (const fileLink of createdFileFullPaths) {
          await deleteUploadedFileByDocumentLink(fileLink);
        }
      } catch {
        // Ignore cleanup errors
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Product performance creation error:', error);

      if (
        error.name === 'CastError' ||
        error.message?.includes('Cast to ObjectId')
      ) {
        throw new BadRequestException(
          `Invalid ID format provided: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to create product performance. Please check the logs for details.',
      );
    }
  }
}

