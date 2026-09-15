import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import {
  ProductPerformance,
  ProductPerformanceDocument,
} from '../../product-performance/schemas/product-performance.schema';
import {
  PpTestReport,
  PpTestReportDocument,
} from '../../product-performance/schemas/pp-test-report.schema';
import {
  ProcessRenewProductPerformance,
  ProcessRenewProductPerformanceDocument,
} from '../schemas/process-renew-product-performance.schema';
import {
  ProcessRenewPpTestReport,
  ProcessRenewPpTestReportDocument,
} from '../schemas/process-renew-pp-test-report.schema';
import { toRenewObjectId } from '../helpers/renew-common.util';
import {
  isMeaningfulRenewTestReportRow,
  normalizedProductNameKey,
  normalizedTestReportFileNameKey,
  type RenewTestReportRow,
} from '../process-renew-product-performance/renew-product-performance-payload.util';

const EMPTY_PRODUCT_NORMALIZED_KEY = '__default__';
const EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY = '__unnamed__';

/**
 * On renewal completion, copy renew Product Performance test-report metadata
 * (productName / testReportFileName) into certification collections so
 * Certified URN details show the updated renew values.
 *
 * File uploads are handled separately by RenewDocumentPromotionService.
 */
@Injectable()
export class RenewProductPerformancePromotionService {
  private readonly logger = new Logger(
    RenewProductPerformancePromotionService.name,
  );

  constructor(
    @InjectModel(ProcessRenewPpTestReport.name)
    private readonly renewTestReportModel: Model<ProcessRenewPpTestReportDocument>,
    @InjectModel(ProcessRenewProductPerformance.name)
    private readonly renewPerformanceModel: Model<ProcessRenewProductPerformanceDocument>,
    @InjectModel(ProductPerformance.name)
    private readonly productPerformanceModel: Model<ProductPerformanceDocument>,
    @InjectModel(PpTestReport.name)
    private readonly ppTestReportModel: Model<PpTestReportDocument>,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  /**
   * Promote renew PP test-report metadata for a completed cycle into
   * process_pp_test_reports + process_product_performance.
   *
   * Skips when the renew cycle never saved test-report metadata (keeps prior cert rows).
   * When renew did save (child rows and/or header.testReports array), replaces cert rows.
   */
  async promoteRenewProductPerformanceTestReportsForCompletedCycle(
    urnNo: string,
    renewalCycleId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const trimmedUrn = urnNo.trim();
    const cycleObjectId = toRenewObjectId(renewalCycleId, 'renewalCycleId');
    const now = new Date();

    const { rows, vendorId, shouldPromote } =
      await this.loadRenewTestReportsForPromotion(
        trimmedUrn,
        cycleObjectId,
        session,
      );

    if (!shouldPromote) {
      this.logger.debug(
        `Skip PP test-report metadata promotion for ${trimmedUrn} — no renew metadata save this cycle`,
      );
      return 0;
    }

    if (!vendorId) {
      this.logger.warn(
        `Skip PP test-report metadata promotion for ${trimmedUrn} — missing vendorId`,
      );
      return 0;
    }

    const processProductPerformanceId =
      await this.ensureCertProductPerformanceHeader({
        urnNo: trimmedUrn,
        vendorId,
        testReports: rows,
        now,
        session,
      });

    await this.replaceCertTestReportsTable({
      urnNo: trimmedUrn,
      vendorId,
      processProductPerformanceId,
      rows,
      now,
      session,
    });

    return rows.length;
  }

  private async loadRenewTestReportsForPromotion(
    urnNo: string,
    renewalCycleObjectId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<{
    rows: RenewTestReportRow[];
    vendorId: Types.ObjectId | null;
    shouldPromote: boolean;
  }> {
    const childQuery = this.renewTestReportModel
      .find({ urnNo, renewalCycleId: renewalCycleObjectId })
      .sort({ processRenewProductPerformanceTestReportId: 1 });
    if (session) childQuery.session(session);
    const childRows = await childQuery.lean().exec();

    const headerQuery = this.renewPerformanceModel.findOne({
      urnNo,
      renewalCycleId: renewalCycleObjectId,
      $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
    });
    if (session) headerQuery.session(session);
    const header = await headerQuery.lean().exec();

    const vendorId =
      (header?.vendorId as Types.ObjectId | undefined) ??
      (childRows[0]?.vendorId as Types.ObjectId | undefined) ??
      null;

    const fromChild: RenewTestReportRow[] = childRows
      .map((r) => ({
        productName: String(r.productName ?? '').trim(),
        testReportFileName: String(r.testReportFileName ?? '').trim(),
        ...(r.eoiNo ? { eoiNo: String(r.eoiNo).trim() } : {}),
      }))
      .filter((r) =>
        isMeaningfulRenewTestReportRow(r.productName, r.testReportFileName),
      );

    if (fromChild.length > 0) {
      return { rows: fromChild, vendorId, shouldPromote: true };
    }

    // Header.testReports is only written on renew PP save (seed omits it).
    if (header && Array.isArray(header.testReports)) {
      const fromEmbedded = (header.testReports as Array<Record<string, unknown>>)
        .map((entry) => ({
          productName: String(entry.productName ?? '').trim(),
          testReportFileName: String(entry.testReportFileName ?? '').trim(),
          ...(entry.eoiNo
            ? { eoiNo: String(entry.eoiNo).trim() }
            : {}),
        }))
        .filter((r) =>
          isMeaningfulRenewTestReportRow(r.productName, r.testReportFileName),
        );
      return { rows: fromEmbedded, vendorId, shouldPromote: true };
    }

    return { rows: [], vendorId, shouldPromote: false };
  }

  private async ensureCertProductPerformanceHeader(params: {
    urnNo: string;
    vendorId: Types.ObjectId;
    testReports: RenewTestReportRow[];
    now: Date;
    session?: ClientSession;
  }): Promise<number> {
    const { urnNo, vendorId, testReports, now, session } = params;

    const existingQuery = this.productPerformanceModel.findOne({
      urnNo,
      vendorId,
    });
    if (session) existingQuery.session(session);
    const existing = await existingQuery.exec();

    const embedded = testReports.map((r) => ({
      productName: r.productName,
      testReportFileName: r.testReportFileName,
    }));

    if (existing) {
      await this.productPerformanceModel.updateOne(
        { _id: existing._id },
        {
          $set: {
            testReports: embedded,
            testReportFiles: Math.max(
              Number(existing.testReportFiles ?? 0),
              embedded.length,
            ),
            productPerformanceStatus: Math.max(
              Number(existing.productPerformanceStatus ?? 0),
              embedded.length > 0 ? 1 : 0,
            ),
            updatedDate: now,
          },
        },
        session ? { session } : {},
      );
      return Number(existing.processProductPerformanceId);
    }

    const processProductPerformanceId =
      await this.sequenceHelper.getProductPerformanceId();

    await this.productPerformanceModel.create(
      [
        {
          processProductPerformanceId,
          urnNo,
          vendorId,
          testReportFiles: embedded.length,
          testReports: embedded,
          renewalType: 0,
          productPerformanceStatus: embedded.length > 0 ? 1 : 0,
          createdDate: now,
          updatedDate: now,
        },
      ],
      session ? { session } : {},
    );

    return processProductPerformanceId;
  }

  private async replaceCertTestReportsTable(params: {
    urnNo: string;
    vendorId: Types.ObjectId;
    processProductPerformanceId: number;
    rows: RenewTestReportRow[];
    now: Date;
    session?: ClientSession;
  }): Promise<void> {
    const {
      urnNo,
      vendorId,
      processProductPerformanceId,
      rows,
      now,
      session,
    } = params;

    await this.ppTestReportModel.deleteMany(
      { urnNo, vendorId },
      session ? { session } : {},
    );

    if (!rows.length) {
      return;
    }

    const seen = new Set<string>();
    const docs = [];
    for (const row of rows) {
      const normalizedProductName =
        normalizedProductNameKey(row.productName) ||
        EMPTY_PRODUCT_NORMALIZED_KEY;
      const normalizedTestReportFileName =
        normalizedTestReportFileNameKey(row.testReportFileName) ||
        EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY;
      const dedupeKey = `${normalizedProductName}__${normalizedTestReportFileName}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      docs.push({
        productPerformanceTestReportId:
          await this.sequenceHelper.getProductPerformanceTestReportId(),
        urnNo,
        vendorId,
        processProductPerformanceId,
        productName: row.productName,
        testReportFileName: row.testReportFileName,
        normalizedProductName,
        normalizedTestReportFileName,
        createdDate: now,
        updatedDate: now,
      });
    }

    if (docs.length) {
      await this.ppTestReportModel.insertMany(docs, session ? { session } : {});
    }
  }
}
