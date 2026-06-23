import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import {
  ProcessRenewProductPerformance,
  ProcessRenewProductPerformanceDocument,
} from '../schemas/process-renew-product-performance.schema';
import {
  ProcessRenewPpTestReport,
  ProcessRenewPpTestReportDocument,
} from '../schemas/process-renew-pp-test-report.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../../utils/upload-file.util';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  trackProductDocumentBatch,
  trackProductDocumentDeleteBatch,
} from '../../documents/helpers/product-document-version.integration';
import {
  isRenewVendorResubmitCycle,
} from '../../documents/helpers/certification-document-version.util';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  renewUploadPath,
  resolveUrnRenewContext,
} from '../helpers/renew-common.util';
import {
  fetchRenewCertifiedEoiSet,
  filterRenewRowsByCertifiedEoi,
  matchRenewEligibleProducts,
} from '../../renew/helpers/renew-eligible-product.util';
import {
  buildRowsFromAuthoritativeTestReports,
  mapRenewProductDocument,
  NormalizedRenewTestReportRow,
  normalizeIncomingRenewTestReportsForReplace,
  RenewTestReportRow,
  resolveRowTestReports,
  toPublicRenewTestReports,
} from './renew-product-performance-payload.util';
import {
  buildPerformanceSection,
  formatRenewProductPerformance,
} from '../utils/renew-details-format.util';
import * as path from 'path';
import { PERFORMANCE_TEST_REPORT_SUBSECTION } from '../../product-performance/product-performance-upload.util';

const RENEW_PERFORMANCE_DOC_SUBSECTION = PERFORMANCE_TEST_REPORT_SUBSECTION;

export interface SaveRenewProductPerformanceInput {
  urnNo: string;
  renewalCycleId?: string;
  eoiNo?: string;
  productPerformanceStatus?: number;
  renewalType?: number;
  testReports?: RenewTestReportRow[];
  existingDocumentIds?: string[];
}

export interface SaveRenewProductPerformanceResult {
  payload: Record<string, unknown>;
  filesUploaded: number;
}

@Injectable()
export class ProcessRenewProductPerformanceService {
  constructor(
    @InjectModel(ProcessRenewProductPerformance.name)
    private readonly renewPerformanceModel: Model<ProcessRenewProductPerformanceDocument>,
    @InjectModel(ProcessRenewPpTestReport.name)
    private readonly renewTestReportModel: Model<ProcessRenewPpTestReportDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

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

  private performanceDocFilter(
    urnNo: string,
    renewalCycleObjectId: Types.ObjectId,
  ) {
    return {
      urnNo,
      documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
      isDeleted: { $ne: true },
      renewalCycleId: renewalCycleObjectId,
    };
  }

  /** Cycle-scoped docs plus legacy rows without renewalCycleId (migrated on retain). */
  private performanceDocMigrationFilter(
    urnNo: string,
    renewalCycleObjectId: Types.ObjectId,
  ) {
    return {
      urnNo,
      documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
      isDeleted: { $ne: true },
      $or: [
        { renewalCycleId: renewalCycleObjectId },
        { renewalCycleId: null },
        { renewalCycleId: { $exists: false } },
      ],
    };
  }

  async resolveRenewalCycle(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<RenewalCycleDocument> {
    const trimmedUrn = urnNo.trim();
    if (renewalCycleId?.trim()) {
      const cycle = await this.renewalCycleModel
        .findById(renewalCycleId.trim())
        .exec();
      if (!cycle || cycle.urnNo !== trimmedUrn) {
        throw new BadRequestException(
          'renewalCycleId does not match this URN',
        );
      }
      return cycle;
    }

    const { cycle } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      trimmedUrn,
    );
    return cycle;
  }

  /**
   * GET: explicit renewalCycleId, else active in-progress cycle, else latest saved performance cycle.
   */
  async resolveRenewalCycleForRead(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<RenewalCycleDocument> {
    if (renewalCycleId?.trim()) {
      return this.resolveRenewalCycle(urnNo, renewalCycleId);
    }

    const trimmedUrn = urnNo.trim();

    const activeCycle = await this.renewalCycleModel
      .findOne({ urnNo: trimmedUrn, status: RenewalCycleStatus.IN_PROGRESS })
      .sort({ cycleNo: -1 })
      .exec();
    if (activeCycle) {
      return activeCycle;
    }

    const latestReport = await this.renewTestReportModel
      .findOne({ urnNo: trimmedUrn })
      .sort({ updatedDate: -1 })
      .select('renewalCycleId')
      .lean()
      .exec();

    if (latestReport?.renewalCycleId) {
      const cycle = await this.renewalCycleModel
        .findById(latestReport.renewalCycleId)
        .exec();
      if (cycle && cycle.urnNo === trimmedUrn) {
        return cycle;
      }
    }

    const latestHeader = await this.renewPerformanceModel
      .findOne({
        urnNo: trimmedUrn,
        renewalCycleId: { $exists: true, $ne: null },
      })
      .sort({ updatedDate: -1 })
      .select('renewalCycleId')
      .lean()
      .exec();

    if (latestHeader?.renewalCycleId) {
      const cycle = await this.renewalCycleModel
        .findById(latestHeader.renewalCycleId)
        .exec();
      if (cycle && cycle.urnNo === trimmedUrn) {
        return cycle;
      }
    }

    const latestCycle = await this.renewalCycleModel
      .findOne({ urnNo: trimmedUrn })
      .sort({ cycleNo: -1 })
      .exec();
    if (latestCycle) {
      return latestCycle;
    }

    throw new BadRequestException('No renewal cycle found for this URN');
  }

  async countRetainedRenewPerformanceDocuments(
    urnNo: string,
    renewalCycleId: string,
    existingDocumentIds?: string[],
  ): Promise<number> {
    const cycle = await this.resolveRenewalCycle(urnNo, renewalCycleId);
    const keepRefs =
      existingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingDocumentIds)
        : null;

    const existingDocs = await this.renewDocumentModel
      .find(
        this.performanceDocMigrationFilter(
          urnNo.trim(),
          cycle._id as Types.ObjectId,
        ),
      )
      .lean()
      .exec();

    let retained = 0;
    for (const doc of existingDocs) {
      if (keepRefs === null || this.docMatchesIdRefs(doc, keepRefs)) {
        retained += 1;
      }
    }
    return retained;
  }

  private async replaceRenewTestReportsTable(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    manufacturerObjectId: Types.ObjectId;
    renewalCycleObjectId: Types.ObjectId;
    processRenewProductPerformanceId: number;
    normalizedReports: NormalizedRenewTestReportRow[];
    now: Date;
    session: ClientSession;
  }): Promise<RenewTestReportRow[]> {
    const {
      urnNo,
      vendorObjectId,
      manufacturerObjectId,
      renewalCycleObjectId,
      processRenewProductPerformanceId,
      normalizedReports,
      now,
      session,
    } = params;

    await this.renewTestReportModel.deleteMany(
      { urnNo, renewalCycleId: renewalCycleObjectId },
      { session },
    );

    if (!normalizedReports.length) {
      return [];
    }

    const docs = [];
    for (const row of normalizedReports) {
      docs.push({
        processRenewProductPerformanceTestReportId:
          await this.sequenceHelper.getProcessRenewProductPerformanceTestReportId(),
        urnNo,
        renewalCycleId: renewalCycleObjectId,
        vendorId: vendorObjectId,
        manufacturerId: manufacturerObjectId,
        processRenewProductPerformanceId,
        eoiNo: row.eoiNo,
        productName: row.productName,
        testReportFileName: row.testReportFileName,
        normalizedProductName: row.normalizedProductName,
        normalizedTestReportFileName: row.normalizedTestReportFileName,
        createdDate: now,
        updatedDate: now,
      });
    }

    await this.renewTestReportModel.insertMany(docs, { session });
    return normalizedReports.map((r) => ({
      productName: r.productName,
      testReportFileName: r.testReportFileName,
      ...(r.eoiNo ? { eoiNo: r.eoiNo } : {}),
    }));
  }

  private async purgeLegacyPerEoiPerformanceRows(
    urnNo: string,
    renewalCycleObjectId: Types.ObjectId,
    session: ClientSession,
  ): Promise<void> {
    await this.renewPerformanceModel.deleteMany(
      {
        urnNo,
        $or: [
          { renewalCycleId: { $exists: false } },
          { renewalCycleId: null },
          {
            renewalCycleId: renewalCycleObjectId,
            eoiNo: { $exists: true, $nin: [null, ''] },
          },
        ],
      },
      { session },
    );
  }

  private async syncRenewPerformanceDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    manufacturerObjectId: Types.ObjectId;
    renewalCycleObjectId: Types.ObjectId;
    urnStatus: number;
    eoiNo?: string;
    formPrimaryId: number;
    now: Date;
    session: ClientSession;
    uploadedFiles: Express.Multer.File[];
    existingDocumentIds?: string[];
    createdFileFullPaths: string[];
  }): Promise<{
    totalDocumentCount: number;
    oldFileLinksToDeleteAfterCommit: string[];
  }> {
    const {
      urnNo,
      vendorObjectId,
      manufacturerObjectId,
      renewalCycleObjectId,
      urnStatus,
      eoiNo,
      formPrimaryId,
      now,
      session,
      uploadedFiles,
      existingDocumentIds,
      createdFileFullPaths,
    } = params;

    const baseFilter = this.performanceDocMigrationFilter(
      urnNo,
      renewalCycleObjectId,
    );

    const keepRefs =
      existingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingDocumentIds)
        : null;

    const existingDocs = await this.renewDocumentModel
      .find(baseFilter)
      .session(session);

    const retainIds: Types.ObjectId[] = [];
    const deleteIds: Types.ObjectId[] = [];
    const docsToDelete: typeof existingDocs = [];
    const oldFileLinksToDeleteAfterCommit: string[] = [];

    for (const doc of existingDocs) {
      const retain = keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
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
      await this.renewDocumentModel.updateMany(
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
      if (isRenewVendorResubmitCycle(urnStatus)) {
        await trackProductDocumentDeleteBatch({
          versioning: this.documentVersioningService,
          urnNo,
          sectionKey: DocumentSectionKey.PRODUCT_PERFORMANCE,
          userId: vendorObjectId,
          docs: docsToDelete,
          slotKeyMode: 'productDocumentId',
          processType: 'renewal',
          renewalCycleId: renewalCycleObjectId,
          session,
        });
      }
    }

    if (retainIds.length) {
      await this.renewDocumentModel.updateMany(
        { _id: { $in: retainIds } },
        {
          $set: {
            formPrimaryId,
            renewalCycleId: renewalCycleObjectId,
            updatedDate: now,
          },
        },
        { session },
      );
    }

    if (uploadedFiles.length) {
      const docsToInsert: Array<Record<string, unknown>> = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const uploaded = await uploadFile(file, renewUploadPath(urnNo));
        createdFileFullPaths.push(uploaded.fileUrl);
        docsToInsert.push({
          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),
          vendorId: vendorObjectId,
          manufacturerId: manufacturerObjectId,
          urnNo,
          renewalCycleId: renewalCycleObjectId,
          eoiNo,
          documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
          documentFormSubsection: RENEW_PERFORMANCE_DOC_SUBSECTION,
          formPrimaryId,
          documentName: path.basename(uploaded.fileUrl) || `Test report ${i + 1}`,
          documentOriginalName: file.originalname,
          documentLink: uploaded.fileUrl,
          createdDate: now,
          updatedDate: now,
        });
      }
      const inserted = await this.renewDocumentModel.insertMany(docsToInsert, {
        session,
      });
      if (isRenewVendorResubmitCycle(urnStatus)) {
        await trackProductDocumentBatch({
          versioning: this.documentVersioningService,
          urnNo,
          sectionKey: DocumentSectionKey.PRODUCT_PERFORMANCE,
          userId: vendorObjectId,
          docs: inserted,
          slotKeyMode: 'productDocumentId',
          processType: 'renewal',
          renewalCycleId: renewalCycleObjectId,
          session,
        });
      }
    }

    const totalDocumentCount = await this.renewDocumentModel
      .countDocuments(this.performanceDocFilter(urnNo, renewalCycleObjectId))
      .session(session);

    return { totalDocumentCount, oldFileLinksToDeleteAfterCommit };
  }

  private async loadAuthoritativeTestReports(
    urnNo: string,
    renewalCycleObjectId: Types.ObjectId,
    certifiedEoiNos?: Set<string>,
  ): Promise<RenewTestReportRow[]> {
    const fromChild = await this.renewTestReportModel
      .find({
        urnNo,
        renewalCycleId: renewalCycleObjectId,
      })
      .sort({ createdDate: 1, _id: 1 })
      .lean()
      .exec();

    if (fromChild.length) {
      const mapped = fromChild.map((r) => ({
        productName: String(r.productName ?? ''),
        testReportFileName: String(r.testReportFileName ?? ''),
        ...(r.eoiNo ? { eoiNo: r.eoiNo } : {}),
      }));
      return certifiedEoiNos
        ? filterRenewRowsByCertifiedEoi(mapped, certifiedEoiNos)
        : mapped;
    }

    const header = await this.renewPerformanceModel
      .findOne({
        urnNo,
        renewalCycleId: renewalCycleObjectId,
        $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
      })
      .lean()
      .exec();

    if (Array.isArray(header?.testReports) && header.testReports.length) {
      return header.testReports
        .map((entry) => {
          const productName = String(entry.productName ?? '').trim();
          const testReportFileName = String(entry.testReportFileName ?? '').trim();
          const eoiNo = entry.eoiNo ? String(entry.eoiNo).trim() : undefined;
          return {
            productName,
            testReportFileName,
            ...(eoiNo ? { eoiNo } : {}),
          };
        })
        .filter((r) => r.productName || r.testReportFileName);
    }

    const legacyRows = await this.renewPerformanceModel
      .find({
        urnNo,
        eoiNo: { $exists: true, $nin: [null, ''] },
        $or: [
          { renewalCycleId: { $exists: false } },
          { renewalCycleId: null },
          { renewalCycleId: renewalCycleObjectId },
        ],
      })
      .lean()
      .exec();

    const aggregated: RenewTestReportRow[] = [];
    for (const row of legacyRows) {
      const eoiNo = String(row.eoiNo ?? '').trim();
      if (certifiedEoiNos && eoiNo && !certifiedEoiNos.has(eoiNo)) {
        continue;
      }
      aggregated.push(
        ...resolveRowTestReports(row as Record<string, unknown>, row.eoiNo),
      );
    }
    return aggregated;
  }

  /**
   * Single read path for renew product performance (details GET + section GET).
   * Child table first; falls back to embedded header.testReports[].
   */
  async loadRenewProductPerformanceReadPayload(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<Record<string, unknown>> {
    const trimmedUrn = urnNo.trim();
    const cycle = await this.resolveRenewalCycleForRead(trimmedUrn, renewalCycleId);
    const renewalCycleObjectId = cycle._id as Types.ObjectId;
    const certifiedEoiNos = await fetchRenewCertifiedEoiSet(
      this.productModel,
      trimmedUrn,
    );

    const [headerPrimary, childRows, documents] = await Promise.all([
      this.renewPerformanceModel
        .findOne({
          urnNo: trimmedUrn,
          renewalCycleId: renewalCycleObjectId,
          $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
        })
        .lean()
        .exec(),
      this.renewTestReportModel
        .find({ urnNo: trimmedUrn, renewalCycleId: renewalCycleObjectId })
        .sort({ processRenewProductPerformanceTestReportId: 1 })
        .lean()
        .exec(),
      this.renewDocumentModel
        .find(
          this.performanceDocMigrationFilter(trimmedUrn, renewalCycleObjectId),
        )
        .lean()
        .exec(),
    ]);

    let header = headerPrimary;
    if (!header) {
      header = await this.renewPerformanceModel
        .findOne({
          urnNo: trimmedUrn,
          renewalCycleId: renewalCycleObjectId,
        })
        .sort({ updatedDate: -1 })
        .lean()
        .exec();
    }

    const documentRows = filterRenewRowsByCertifiedEoi(
      documents.map((d) => mapRenewProductDocument(d as Record<string, unknown>)),
      certifiedEoiNos,
    );
    const section = buildPerformanceSection(
      (header as Record<string, unknown> | null) ?? null,
      childRows as Array<Record<string, unknown>>,
      documentRows,
      renewalCycleObjectId,
    );

    const authoritativeTestReports = await this.loadAuthoritativeTestReports(
      trimmedUrn,
      renewalCycleObjectId,
      certifiedEoiNos,
    );
    const publicTestReports = toPublicRenewTestReports(authoritativeTestReports);
    let productPerformance = section.product_performance as Record<
      string,
      unknown
    > | null;

    if (publicTestReports.length > 0) {
      const syntheticChildRows = authoritativeTestReports.map((row, index) => ({
        ...row,
        urnNo: trimmedUrn,
        processRenewProductPerformanceTestReportId: index + 1,
        productPerformanceTestReportId: index + 1,
      }));
      productPerformance =
        formatRenewProductPerformance(
          (header as Record<string, unknown> | null) ?? null,
          syntheticChildRows as Array<Record<string, unknown>>,
        ) ?? productPerformance;
      if (productPerformance) {
        productPerformance.testReports = publicTestReports;
        productPerformance.testReportFiles = Math.max(
          Number(productPerformance.testReportFiles ?? 0),
          publicTestReports.length,
        );
      }
    }

    return {
      urnNo: trimmedUrn,
      renewalCycleId: String(cycle._id),
      testReports: publicTestReports,
      productPerformanceStatus: Number(
        productPerformance?.productPerformanceStatus ?? 0,
      ),
      renewalType: Number(productPerformance?.renewalType ?? 0),
      testReportFiles: Number(
        productPerformance?.testReportFiles ?? publicTestReports.length,
      ),
      updatedDate: header?.updatedDate ?? null,
      product_performance: productPerformance,
      product_performance_test_reports: section.product_performance_test_reports,
      product_performance_documents: section.product_performance_documents,
    };
  }

  async save(
    input: SaveRenewProductPerformanceInput,
    files?: Express.Multer.File[],
  ): Promise<SaveRenewProductPerformanceResult> {
    if (!input.urnNo?.trim()) {
      throw new BadRequestException('urnNo is required');
    }

    const ownership = renewOwnershipFields(
      await resolveUrnRenewContext(this.productModel, input.urnNo),
    );
    const { cycle, urnStatus } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo.trim(),
      input.renewalCycleId,
    );

    if (input.eoiNo?.trim()) {
      const belongs = await this.productModel.exists({
        urnNo: input.urnNo.trim(),
        eoiNo: input.eoiNo.trim(),
        ...matchRenewEligibleProducts(),
      });
      if (!belongs) {
        throw new BadRequestException('eoiNo does not belong to this URN');
      }
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    const createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      const vendorObjectId = ownership.vendorId;
      const manufacturerObjectId = ownership.manufacturerId;
      const trimmedUrn = ownership.urnNo;
      const renewalCycleObjectId = cycle._id as Types.ObjectId;
      const now = new Date();
      const uploadedFiles = Array.isArray(files) ? files : [];
      const replacingTestReports = input.testReports !== undefined;

      if (replacingTestReports) {
        await this.purgeLegacyPerEoiPerformanceRows(
          trimmedUrn,
          renewalCycleObjectId,
          session,
        );
      }

      const existingHeader = await this.renewPerformanceModel
        .findOne({
          urnNo: trimmedUrn,
          renewalCycleId: renewalCycleObjectId,
          $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
        })
        .session(session)
        .exec();

      const processRenewProductPerformanceId =
        existingHeader?.processRenewProductPerformanceId ??
        (await this.sequenceHelper.getProcessRenewProductPerformanceId());

      const renewalType = input.renewalType ?? existingHeader?.renewalType ?? 0;
      const productPerformanceStatus =
        input.productPerformanceStatus ?? existingHeader?.productPerformanceStatus ?? 0;

      let authoritativeTestReports: RenewTestReportRow[];
      if (replacingTestReports) {
        const normalized = normalizeIncomingRenewTestReportsForReplace(
          input.testReports,
          input.eoiNo?.trim(),
        );
        authoritativeTestReports = await this.replaceRenewTestReportsTable({
          urnNo: trimmedUrn,
          vendorObjectId,
          manufacturerObjectId,
          renewalCycleObjectId,
          processRenewProductPerformanceId,
          normalizedReports: normalized,
          now,
          session,
        });
      } else {
        authoritativeTestReports = await this.loadAuthoritativeTestReports(
          trimmedUrn,
          renewalCycleObjectId,
        );
      }

      const documentSync = await this.syncRenewPerformanceDocuments({
        urnNo: trimmedUrn,
        vendorObjectId,
        manufacturerObjectId,
        renewalCycleObjectId,
        urnStatus,
        eoiNo: input.eoiNo?.trim(),
        formPrimaryId: processRenewProductPerformanceId,
        now,
        session,
        uploadedFiles,
        existingDocumentIds: input.existingDocumentIds,
        createdFileFullPaths,
      });

      oldFileLinksToDeleteAfterCommit =
        documentSync.oldFileLinksToDeleteAfterCommit;

      await this.renewPerformanceModel
        .findOneAndUpdate(
          {
            urnNo: trimmedUrn,
            renewalCycleId: renewalCycleObjectId,
          },
          {
            $set: {
              vendorId: vendorObjectId,
              manufacturerId: manufacturerObjectId,
              renewalCycleId: renewalCycleObjectId,
              testReports: authoritativeTestReports,
              testReportFileName:
                authoritativeTestReports[0]?.testReportFileName ?? '',
              productName: authoritativeTestReports[0]?.productName ?? '',
              testReportFiles: documentSync.totalDocumentCount,
              renewalType,
              productPerformanceStatus,
              updatedDate: now,
            },
            $unset: { eoiNo: '' },
            $setOnInsert: {
              processRenewProductPerformanceId,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      await session.commitTransaction();
      session.endSession();

      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        try {
          await deleteUploadedFileByDocumentLink(fileLink);
        } catch {
          // ignore cleanup errors after commit
        }
      }

      const payload = await this.getFormPayloadByUrn(
        trimmedUrn,
        String(cycle._id),
      );

      return {
        payload,
        filesUploaded: uploadedFiles.length,
      };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      for (const fileLink of createdFileFullPaths) {
        try {
          await deleteUploadedFileByDocumentLink(fileLink);
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
      throw new InternalServerErrorException(
        error.message || 'Failed to save renew product performance',
      );
    }
  }

  async upsert(
    input: {
      urnNo: string;
      eoiNo: string;
      productName?: string;
      testReportFileName?: string;
      productPerformanceStatus?: number;
      renewalCycleId?: string;
    },
    testReportFiles?: Express.Multer.File[],
  ) {
    const result = await this.save(
      {
        urnNo: input.urnNo,
        renewalCycleId: input.renewalCycleId,
        eoiNo: input.eoiNo,
        productPerformanceStatus: input.productPerformanceStatus,
        testReports:
          input.testReportFileName || input.productName
            ? [
                {
                  productName: input.productName ?? '',
                  testReportFileName: input.testReportFileName ?? '',
                  eoiNo: input.eoiNo,
                },
              ]
            : undefined,
      },
      testReportFiles,
    );
    return result.payload;
  }

  async getFormPayloadByUrn(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<Record<string, unknown>> {
    const trimmedUrn = urnNo.trim();
    const performancePayload = await this.loadRenewProductPerformanceReadPayload(
      trimmedUrn,
      renewalCycleId,
    );

    const products = await this.productModel
      .find({
        urnNo: trimmedUrn,
        ...matchRenewEligibleProducts(),
      })
      .select('eoiNo productName productStatus')
      .sort({ createdDate: 1 })
      .lean()
      .exec();

    const publicTestReports =
      (performancePayload.testReports as RenewTestReportRow[]) ?? [];
    const mappedDocuments =
      (performancePayload.product_performance_documents as Array<
        Record<string, unknown>
      >) ?? [];

    const header = performancePayload.product_performance as Record<
      string,
      unknown
    > | null;

    const rows = buildRowsFromAuthoritativeTestReports(
      products.map((p) => ({
        eoiNo: p.eoiNo,
        productName: p.productName,
        productStatus: Number(p.productStatus ?? 0),
      })),
      publicTestReports,
      header,
      mappedDocuments,
      trimmedUrn,
    );

    return {
      ...performancePayload,
      products: products.map((p) => ({
        eoiNo: p.eoiNo,
        productName: p.productName,
        productStatus: Number(p.productStatus ?? 0),
      })),
      rows,
      all_renew_product_documents: mappedDocuments,
    };
  }

  async listByUrn(urnNo: string, renewalCycleId?: string) {
    return this.getFormPayloadByUrn(urnNo, renewalCycleId);
  }
}
