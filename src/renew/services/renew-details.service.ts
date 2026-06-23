import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRegistrationService } from '../../product-registration/product-registration.service';
import { enrichUrnDetailRowsWithSharedProcessData } from '../../product-registration/utils/consolidate-urn-detail-items.util';
import {
  ProcessRenewManufacturing,
  ProcessRenewManufacturingDocument,
} from '../schemas/process-renew-manufacturing.schema';
import { withRenewPlantsStateAliases } from '../utils/renew-plant-state.util';
import {
  ProcessRenewInnovation,
  ProcessRenewInnovationDocument,
} from '../schemas/process-renew-innovation.schema';
import {
  ProcessRenewWasteManagement,
  ProcessRenewWasteManagementDocument,
} from '../schemas/process-renew-waste-management.schema';
import {
  ProcessRenewProductStewardship,
  ProcessRenewProductStewardshipDocument,
} from '../schemas/process-renew-product-stewardship.schema';
import {
  ProcessRenewPsStakeholderEduAwarness,
  ProcessRenewPsStakeholderEduAwarnessDocument,
} from '../schemas/process-renew-ps-stakeholder-edu-awarness.schema';
import {
  ProcessRenewComments,
  ProcessRenewCommentsDocument,
} from '../schemas/process-renew-comments.schema';
import {
  ProcessRenewMpManufacturingUnit,
  ProcessRenewMpManufacturingUnitDocument,
} from '../schemas/process-renew-mp-manufacturing-unit.schema';
import {
  ProcessRenewWmManufacturingUnit,
  ProcessRenewWmManufacturingUnitDocument,
} from '../schemas/process-renew-wm-manufacturing-unit.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import { ProcessRenewProductPerformanceService } from '../process-renew-product-performance/process-renew-product-performance.service';
import {
  RENEW_CLEARED_CERT_SECTIONS,
  buildInnovationSection,
  buildManufacturingSection,
  buildRenewDocumentsQueryFilter,
  buildStewardshipSection,
  buildWasteSection,
  formatRenewComments,
  mergeRenewDocumentSources,
  formatRenewMpManufacturingUnitForDetails,
  formatRenewWmManufacturingUnitForDetails,
  spreadProductPerformanceToDetailRows,
} from '../utils/renew-details-format.util';
import {
  fetchRenewCertifiedEoiSet,
  filterRenewDetailsRows,
  filterRenewRowsByCertifiedEoi,
  matchRenewEligibleProducts,
} from '../helpers/renew-eligible-product.util';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  buildRenewPaymentsPayload,
  buildRenewProcessHeaderFilter,
  findRenewPaymentsForCycle,
  resolveCycleScopedUrnStatus,
} from '../helpers/renew-cycle-scope.util';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { RenewUrnTabReviewService } from './renew-urn-tab-review.service';
import { ProcessRenewCommentsService } from '../process-renew-comments/process-renew-comments.service';
import { assertRenewActorCanReadUrn } from '../helpers/renew-common.util';
import { RenewDetailsIncludeMode } from '../utils/renew-details-response.util';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';

export type RenewDetailsRole = 'admin' | 'vendor';

export type GetRenewDetailsOptions = {
  role: RenewDetailsRole;
  include?: RenewDetailsIncludeMode;
  actorVendorOrManufacturerId?: string;
};

export type RenewDetailsResult = {
  data: Array<Record<string, unknown>>;
  /** Certified EOIs with joined category + product_plants (per-row mirror). */
  products: Array<Record<string, unknown>>;
  product_details_list?: Array<Record<string, unknown>>;
  manufacturer: Record<string, unknown> | null;
  manufacturing_details: Record<string, unknown> | null;
  plants: Array<Record<string, unknown>>;
  plant_details: Array<Record<string, unknown>>;
  all_renew_product_documents: Array<Record<string, unknown>>;
  all_urn_product_documents: Array<Record<string, unknown>>;
  documents: Array<Record<string, unknown>>;
  renewContext: Record<string, unknown>;
  urnContext?: Record<string, unknown>;
  siteVisits: unknown[];
  payment?: Record<string, unknown> | null;
  payments?: Array<Record<string, unknown>>;
  vendor?: Record<string, unknown> | null;
  category?: Record<string, unknown> | null;
  tabReviews?: Record<string, unknown>;
  processComments?: Record<string, unknown>;
};

function dedupePlantsById(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];
  for (const row of rows) {
    for (const plant of (row.plants as
      | Array<Record<string, unknown>>
      | undefined) ?? []) {
      const key = String(
        plant._id ??
          plant.productPlantId ??
          `${plant.eoiNo}|${plant.plantName}`,
      );
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(plant);
    }
  }
  return out;
}

function buildRenewProductsSummary(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return rows.map((row) => ({
    product_details: row.product_details ?? null,
    category: row.category ?? null,
    plants: row.plants ?? [],
    manufacturer: row.manufacturer ?? null,
    vendor: row.vendor ?? null,
  }));
}

@Injectable()
export class RenewDetailsService {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
    private readonly processRenewProductPerformanceService: ProcessRenewProductPerformanceService,
    @InjectModel(ProcessRenewManufacturing.name)
    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,
    @InjectModel(ProcessRenewInnovation.name)
    private readonly renewInnovationModel: Model<ProcessRenewInnovationDocument>,
    @InjectModel(ProcessRenewWasteManagement.name)
    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,
    @InjectModel(ProcessRenewProductStewardship.name)
    private readonly renewStewardshipModel: Model<ProcessRenewProductStewardshipDocument>,
    @InjectModel(ProcessRenewPsStakeholderEduAwarness.name)
    private readonly renewStakeholderModel: Model<ProcessRenewPsStakeholderEduAwarnessDocument>,
    @InjectModel(ProcessRenewComments.name)
    private readonly renewCommentsModel: Model<ProcessRenewCommentsDocument>,
    @InjectModel(ProcessRenewMpManufacturingUnit.name)
    private readonly renewMpUnitModel: Model<ProcessRenewMpManufacturingUnitDocument>,
    @InjectModel(ProcessRenewWmManufacturingUnit.name)
    private readonly renewWmUnitModel: Model<ProcessRenewWmManufacturingUnitDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentModel: Model<PaymentDetailsDocument>,
    private readonly renewUrnTabReviewService: RenewUrnTabReviewService,
    private readonly processRenewCommentsService: ProcessRenewCommentsService,
  ) {}

  private buildCompactProductDetailsList(
    rows: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    return rows.map((row) => {
      const productDetails = (row.product_details ?? {}) as Record<
        string,
        unknown
      >;
      const plants =
        (row.plants as Array<Record<string, unknown>> | undefined) ?? [];
      const eoiNo = String(productDetails.eoiNo ?? row.eoiNo ?? '').trim();
      const plantsForEoi = eoiNo
        ? plants.filter((plant) => String(plant.eoiNo ?? '').trim() === eoiNo)
        : plants;
      const unitCount = Number(
        productDetails.plantCount ??
          productDetails.hpUnits ??
          plantsForEoi.length ??
          0,
      );
      return {
        eoiNo: productDetails.eoiNo ?? row.eoiNo ?? null,
        productName: productDetails.productName ?? row.productName ?? null,
        productStatus:
          productDetails.productStatus ?? row.productStatus ?? null,
        hpUnits: unitCount,
        plantCount: unitCount,
        product_details: productDetails,
      };
    });
  }

  private buildVendorSummary(
    first: Record<string, unknown>,
  ): Record<string, unknown> | null {
    const vendor = first.vendor as Record<string, unknown> | undefined;
    if (!vendor) {
      return null;
    }
    const manufacturer = first.manufacturer as
      | Record<string, unknown>
      | undefined;
    const company =
      vendor.companyName ??
      vendor.manufacturerName ??
      vendor.vendor_name ??
      manufacturer?.manufacturerName ??
      null;
    return {
      _id: vendor._id ?? null,
      company,
      contact: vendor.contactName ?? company,
      email: vendor.vendor_email ?? vendor.email ?? null,
      phone: vendor.vendor_phone ?? vendor.phone ?? null,
    };
  }

  private async resolveActiveCycle(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<RenewalCycleDocument | null> {
    if (renewalCycleId?.trim()) {
      const cycle = await this.renewalCycleModel
        .findById(renewalCycleId.trim())
        .exec();
      if (!cycle || cycle.urnNo !== urnNo) {
        throw new BadRequestException('renewalCycleId does not match this URN');
      }
      return cycle;
    }
    return this.renewalCycleModel
      .findOne({ urnNo, status: RenewalCycleStatus.IN_PROGRESS })
      .sort({ cycleNo: -1 })
      .exec();
  }

  private async loadRenewBundle(urnNo: string, renewalCycleId?: string) {
    const cycle = await this.resolveActiveCycle(urnNo, renewalCycleId);
    const cycleIdForRead =
      renewalCycleId?.trim() ?? (cycle?._id ? String(cycle._id) : undefined);

    const performanceRead =
      await this.processRenewProductPerformanceService.loadRenewProductPerformanceReadPayload(
        urnNo,
        cycleIdForRead,
      );

    const headerFilter = buildRenewProcessHeaderFilter(urnNo, cycle);
    const strictDocs = Number(cycle?.cycleNo ?? 1) > 1;
    const documentCycleId = cycle?._id ?? performanceRead.renewalCycleId;

    const [
      manufacturing,
      innovation,
      waste,
      stewardship,
      stakeholders,
      comments,
      allDocuments,
    ] = await Promise.all([
      this.renewManufacturingModel.findOne(headerFilter).lean().exec(),
      this.renewInnovationModel.findOne(headerFilter).lean().exec(),
      this.renewWasteModel.findOne(headerFilter).lean().exec(),
      this.renewStewardshipModel.findOne(headerFilter).lean().exec(),
      this.renewStakeholderModel
        .find({ urnNo, isDeleted: { $ne: true } })
        .lean()
        .exec(),
      this.renewCommentsModel
        .findOne(
          cycle?._id
            ? Number(cycle.cycleNo) > 1
              ? { urnNo, renewalCycleId: cycle._id }
              : {
                  urnNo,
                  $or: [
                    { renewalCycleId: cycle._id },
                    { renewalCycleId: null },
                    { renewalCycleId: { $exists: false } },
                  ],
                }
            : { urnNo },
        )
        .lean()
        .exec()
        .then(async (scoped) => {
          if (scoped || Number(cycle?.cycleNo ?? 0) > 1) {
            return scoped;
          }
          return this.renewCommentsModel.findOne({ urnNo }).lean().exec();
        }),
      this.renewDocumentModel
        .find(
          buildRenewDocumentsQueryFilter(urnNo, documentCycleId, {
            strictCycleOnly: strictDocs,
          }),
        )
        .sort({ productDocumentId: -1 })
        .lean()
        .exec(),
    ]);

    const unitFilter = buildRenewProcessHeaderFilter(urnNo, cycle);
    const mpUnits = await this.renewMpUnitModel.find(unitFilter).lean().exec();
    const wmUnits = await this.renewWmUnitModel.find(unitFilter).lean().exec();

    const documentRows = allDocuments as Array<Record<string, unknown>>;
    const manufacturingSection = buildManufacturingSection(
      manufacturing as Record<string, unknown> | null,
      documentRows,
    );
    const innovationSection = buildInnovationSection(
      innovation as Record<string, unknown> | null,
      documentRows,
    );
    const wasteSection = buildWasteSection(
      waste as Record<string, unknown> | null,
      documentRows,
    );
    const stewardshipSection = buildStewardshipSection(
      stewardship as Record<string, unknown> | null,
      stakeholders as Array<Record<string, unknown>>,
      documentRows,
    );

    const unifiedDocuments = mergeRenewDocumentSources(
      documentRows,
      performanceRead.product_performance_documents as Array<
        Record<string, unknown>
      >,
      manufacturingSection.process_manufacturing_documents as Array<
        Record<string, unknown>
      >,
      wasteSection.process_waste_management_documents as Array<
        Record<string, unknown>
      >,
      innovationSection.process_innovation_documents as Array<
        Record<string, unknown>
      >,
      stewardshipSection.process_product_stewardship_documents as Array<
        Record<string, unknown>
      >,
    );

    const certifiedEoiNos = await fetchRenewCertifiedEoiSet(
      this.productModel,
      urnNo,
    );
    const renewDocumentsOnly = filterRenewRowsByCertifiedEoi(
      unifiedDocuments,
      certifiedEoiNos,
    );

    return {
      cycle,
      performanceCycleId: performanceRead.renewalCycleId,
      processSections: {
        product_performance: performanceRead.product_performance,
        product_performance_test_reports:
          performanceRead.product_performance_test_reports,
        product_performance_documents:
          performanceRead.product_performance_documents,
        ...manufacturingSection,
        ...innovationSection,
        ...wasteSection,
        ...stewardshipSection,
        process_comments: formatRenewComments(
          comments as Record<string, unknown> | null,
        ),
        process_mp_manufacturing_units: (
          mpUnits as Array<Record<string, unknown>>
        ).map(formatRenewMpManufacturingUnitForDetails),
        process_wm_manufacturing_units: (
          wmUnits as Array<Record<string, unknown>>
        ).map(formatRenewWmManufacturingUnitForDetails),
        all_renew_product_documents: renewDocumentsOnly,
        all_urn_product_documents: renewDocumentsOnly,
        documents: renewDocumentsOnly,
      },
    };
  }

  async getRenewDetailsByUrn(
    urnNo: string,
    renewalCycleId?: string,
    options?: GetRenewDetailsOptions,
  ): Promise<RenewDetailsResult> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('URN number is required');
    }

    const include = options?.include ?? 'summary';
    if (options?.role === 'vendor' && options.actorVendorOrManufacturerId) {
      await assertRenewActorCanReadUrn(
        this.productModel,
        trimmedUrn,
        options.actorVendorOrManufacturerId,
      );
    }

    const [allDetailRows, bundle] = await Promise.all([
      this.productRegistrationService.getRenewProductDetailsByUrn(trimmedUrn),
      this.loadRenewBundle(trimmedUrn, renewalCycleId),
    ]);

    const joinedRows =
      await this.productRegistrationService.enrichUrnDetailRowsWithManufacturerAndPlants(
        trimmedUrn,
        allDetailRows as Array<Record<string, unknown>>,
      );

    const baseRows = filterRenewDetailsRows(joinedRows);
    if (baseRows.length === 0) {
      throw new NotFoundException(
        `No certified products found for URN ${trimmedUrn} (rejected EOIs are excluded from renewal)`,
      );
    }

    const siteVisits =
      (baseRows[0] as { siteVisits?: unknown[] } | undefined)?.siteVisits ?? [];

    const renewMpUnits = bundle.processSections.process_mp_manufacturing_units;
    const renewWmUnits = bundle.processSections.process_wm_manufacturing_units;

    const baseRowsWithoutCertUnits = baseRows.map((row) => {
      const {
        process_mp_manufacturing_units: _mp,
        process_wm_manufacturing_units: _wm,
        ...rest
      } = row as Record<string, unknown>;
      return rest;
    });

    const mergedRows = baseRowsWithoutCertUnits.map((row) => ({
      ...row,
      ...RENEW_CLEARED_CERT_SECTIONS,
      ...bundle.processSections,
      process_mp_manufacturing_units: renewMpUnits,
      process_wm_manufacturing_units: renewWmUnits,
    }));

    const enriched = enrichUrnDetailRowsWithSharedProcessData(
      mergedRows.map((row) => ({
        ...row,
        siteVisits,
      })),
    );

    const data = enriched.map((row) => {
      const next = {
        ...row,
        process_mp_manufacturing_units: renewMpUnits,
        process_wm_manufacturing_units: renewWmUnits,
      };
      if (!next.product_performance) {
        spreadProductPerformanceToDetailRows(
          [next],
          bundle.processSections.product_performance as Record<
            string,
            unknown
          > | null,
        );
      }
      return next;
    });

    const first = (data[0] ?? {}) as Record<string, unknown>;
    const productDetails = first.product_details as
      | Record<string, unknown>
      | undefined;
    const category = first.category as
      | Record<string, unknown>
      | null
      | undefined;
    const activeCycle = bundle.cycle;
    const products = buildRenewProductsSummary(data);
    const manufacturer =
      (first.manufacturer as Record<string, unknown> | null | undefined) ??
      null;
    const manufacturing_details =
      (first.manufacturing_details as
        | Record<string, unknown>
        | null
        | undefined) ?? manufacturer;
    const plants = withRenewPlantsStateAliases(dedupePlantsById(data));
    const plant_details = plants;
    const allRenewDocuments =
      (bundle.processSections.all_renew_product_documents as Array<
        Record<string, unknown>
      >) ?? [];
    const documents = allRenewDocuments;

    let cyclePayments: Array<Record<string, unknown>> = [];
    let cyclePayment: Record<string, unknown> | null = null;
    if (bundle.cycle) {
      const payRows = await findRenewPaymentsForCycle(
        this.paymentModel,
        trimmedUrn,
        bundle.cycle,
      );
      const paymentPayload = buildRenewPaymentsPayload(payRows);
      cyclePayments = paymentPayload.payments;
      cyclePayment = paymentPayload.payment;
    }

    const productSnapshot = await this.productModel
      .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })
      .select('urnStatus renewCycleNo productRenewStatus')
      .lean()
      .exec();
    const contextCycle = bundle.cycle;
    const cycleScopedUrnStatus = resolveCycleScopedUrnStatus(
      contextCycle,
      {
        urnStatus: Number(
          productSnapshot?.urnStatus ??
            productDetails?.urnStatus ??
            first.urnStatus ??
            0,
        ),
        renewCycleNo: Number(
          productSnapshot?.renewCycleNo ??
            productDetails?.renewCycleNo ??
            first.renewCycleNo ??
            0,
        ),
      },
      cyclePayment,
    );

    const dataWithDocuments = data.map((row) => ({
      ...row,
      all_renew_product_documents: allRenewDocuments,
      all_urn_product_documents: allRenewDocuments,
      documents: allRenewDocuments,
      payments: cyclePayments,
      payment: cyclePayment,
    }));

    const renewContext = {
      urnNo: trimmedUrn,
      urnStatus: cycleScopedUrnStatus,
      urn_status: cycleScopedUrnStatus,
      productRenewStatus:
        productSnapshot?.productRenewStatus ??
        productDetails?.productRenewStatus ??
        first.productRenewStatus ??
        null,
      renewCycleNo:
        productSnapshot?.renewCycleNo ??
        productDetails?.renewCycleNo ??
        first.renewCycleNo ??
        null,
      category: category ?? null,
      categoryName: category?.categoryName ?? category?.category_name ?? null,
      vendorId:
        first.vendorId ??
        (first.vendor as Record<string, unknown> | undefined)?._id ??
        null,
      manufacturerId:
        first.manufacturerId ??
        (first.manufacturer as Record<string, unknown> | undefined)?._id ??
        null,
      renewalCycleId: String(
        activeCycle?._id ??
          bundle.performanceCycleId ??
          renewalCycleId?.trim() ??
          '',
      ),
      activeRenewalCycle: activeCycle
        ? {
            id: String(activeCycle._id),
            cycleNo: activeCycle.cycleNo,
            status: activeCycle.status,
            paymentId: activeCycle.paymentId ?? null,
          }
        : null,
      renewalCycle: activeCycle
        ? {
            id: String(activeCycle._id),
            cycleNo: activeCycle.cycleNo,
            status: activeCycle.status,
            paymentId: activeCycle.paymentId ?? null,
          }
        : null,
    };

    const urnContext = {
      urnNo: trimmedUrn,
      urnStatus: cycleScopedUrnStatus,
      productRenewStatus:
        productSnapshot?.productRenewStatus ??
        productDetails?.productRenewStatus ??
        first.productRenewStatus ??
        null,
      product_renew_status:
        productSnapshot?.productRenewStatus ??
        productDetails?.productRenewStatus ??
        first.productRenewStatus ??
        null,
      renewCycleNo:
        productSnapshot?.renewCycleNo ??
        productDetails?.renewCycleNo ??
        first.renewCycleNo ??
        null,
      vendorId: renewContext.vendorId,
      manufacturerId: renewContext.manufacturerId,
      renewalCycleId: renewContext.renewalCycleId,
    };

    const baseResult: RenewDetailsResult = {
      data: dataWithDocuments,
      products,
      manufacturer,
      manufacturing_details,
      plants,
      plant_details,
      all_renew_product_documents: allRenewDocuments,
      all_urn_product_documents: allRenewDocuments,
      documents,
      siteVisits,
      renewContext,
      urnContext,
    };

    if (include !== 'full') {
      return baseResult;
    }

    const cycleIdForExtras = String(
      activeCycle?._id ?? renewalCycleId?.trim() ?? '',
    );
    const fullExtras: Partial<RenewDetailsResult> = {
      product_details_list:
        this.buildCompactProductDetailsList(dataWithDocuments),
      payment: cyclePayment,
      payments: cyclePayments,
      category: (category as Record<string, unknown> | null) ?? null,
      vendor: this.buildVendorSummary(first),
    };

    if (options?.role === 'admin' && cycleIdForExtras) {
      const [tabReviewsRaw, processComments] = await Promise.all([
        this.renewUrnTabReviewService.getUrnTabReviews(
          trimmedUrn,
          cycleIdForExtras,
        ),
        this.processRenewCommentsService.adminGetCommentsPayload(
          trimmedUrn,
          cycleIdForExtras,
        ),
      ]);
      fullExtras.tabReviews = {
        ...(tabReviewsRaw as Record<string, unknown>),
        urnStatus: cycleScopedUrnStatus,
        canReview:
          cycleScopedUrnStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
      };
      fullExtras.processComments = processComments;
    }

    return {
      ...baseResult,
      ...fullExtras,
    };
  }

  /** Renew MP/WM/Innovation document buckets for certified vendor URN details merge. */
  async loadRenewProcessDocumentsReadPayload(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<Record<string, unknown>> {
    const trimmedUrn = urnNo.trim();
    const emptyPayload = {
      process_manufacturing_documents: [] as Array<Record<string, unknown>>,
      process_waste_management_documents: [] as Array<Record<string, unknown>>,
      process_innovation_documents: [] as Array<Record<string, unknown>>,
      all_renew_product_documents: [] as Array<Record<string, unknown>>,
    };

    let cycle: RenewalCycleDocument;
    try {
      cycle =
        await this.processRenewProductPerformanceService.resolveRenewalCycleForRead(
          trimmedUrn,
          renewalCycleId,
        );
    } catch {
      return emptyPayload;
    }

    const strictDocs = Number(cycle.cycleNo ?? 1) > 1;
    const documentRows = (await this.renewDocumentModel
      .find(
        buildRenewDocumentsQueryFilter(trimmedUrn, cycle._id, {
          strictCycleOnly: strictDocs,
        }),
      )
      .sort({ productDocumentId: -1 })
      .lean()
      .exec()) as Array<Record<string, unknown>>;

    const manufacturingSection = buildManufacturingSection(null, documentRows);
    const wasteSection = buildWasteSection(null, documentRows);
    const innovationSection = buildInnovationSection(null, documentRows);

    const certifiedEoiNos = await fetchRenewCertifiedEoiSet(
      this.productModel,
      trimmedUrn,
    );
    const scopedRenewDocuments = filterRenewRowsByCertifiedEoi(
      documentRows,
      certifiedEoiNos,
    );

    return {
      process_manufacturing_documents:
        (manufacturingSection.process_manufacturing_documents as Array<
          Record<string, unknown>
        >) ?? [],
      process_waste_management_documents:
        (wasteSection.process_waste_management_documents as Array<
          Record<string, unknown>
        >) ?? [],
      process_innovation_documents:
        (innovationSection.process_innovation_documents as Array<
          Record<string, unknown>
        >) ?? [],
      all_renew_product_documents: scopedRenewDocuments,
    };
  }

  async getManufacturingByUrn(urnNo: string, renewalCycleId?: string) {
    const bundle = await this.loadRenewBundle(urnNo.trim(), renewalCycleId);
    return {
      process_manufacturing: bundle.processSections.process_manufacturing,
      process_manufacturing_documents:
        bundle.processSections.process_manufacturing_documents,
      process_mp_manufacturing_units:
        bundle.processSections.process_mp_manufacturing_units,
    };
  }

  async getInnovationByUrn(urnNo: string, renewalCycleId?: string) {
    const bundle = await this.loadRenewBundle(urnNo.trim(), renewalCycleId);
    return {
      process_innovation: bundle.processSections.process_innovation,
      process_innovation_documents:
        bundle.processSections.process_innovation_documents,
    };
  }

  async getWasteByUrn(urnNo: string, renewalCycleId?: string) {
    const bundle = await this.loadRenewBundle(urnNo.trim(), renewalCycleId);
    return {
      process_waste_management: bundle.processSections.process_waste_management,
      process_waste_management_documents:
        bundle.processSections.process_waste_management_documents,
      process_wm_manufacturing_units:
        bundle.processSections.process_wm_manufacturing_units,
    };
  }

  async getStewardshipByUrn(urnNo: string, renewalCycleId?: string) {
    const bundle = await this.loadRenewBundle(urnNo.trim(), renewalCycleId);
    return {
      process_product_stewardship:
        bundle.processSections.process_product_stewardship,
      process_ps_stakeholder_edu_awarness:
        bundle.processSections.process_ps_stakeholder_edu_awarness,
      process_product_stewardship_documents:
        bundle.processSections.process_product_stewardship_documents,
    };
  }

  async getCommentsByUrn(urnNo: string, renewalCycleId?: string) {
    const bundle = await this.loadRenewBundle(urnNo.trim(), renewalCycleId);
    return { process_comments: bundle.processSections.process_comments };
  }

  async getProductPerformanceByUrn(urnNo: string, renewalCycleId?: string) {
    return this.processRenewProductPerformanceService.getFormPayloadByUrn(
      urnNo.trim(),
      renewalCycleId,
    );
  }
}
