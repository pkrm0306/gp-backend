import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';
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
  ProcessRenewMpManufacturingUnit,
  ProcessRenewMpManufacturingUnitDocument,
} from '../schemas/process-renew-mp-manufacturing-unit.schema';
import {
  DocStream,
  DocStreamDocument,
} from '../../documents/schemas/doc-stream.schema';
import { getRenewalUrnStatusLabel } from '../constants/renewal-urn-status.constants';
import { toRenewObjectId } from '../helpers/renew-common.util';
import {
  filterRenewRowsByCertifiedEoi,
  matchRenewEligibleProducts,
} from '../helpers/renew-eligible-product.util';
import { ProductRegistrationService } from '../../product-registration/product-registration.service';
import { ProcessRenewProductPerformanceService } from '../process-renew-product-performance/process-renew-product-performance.service';
import {
  buildRenewDocumentsQueryFilter,
  mergeRenewDocumentSources,
} from '../utils/renew-details-format.util';
import {
  buildRenewPaymentsPayload,
  buildRenewProcessHeaderFilter,
  findRenewPaymentsForCycle,
  resolveCycleScopedUrnStatus,
} from '../helpers/renew-cycle-scope.util';
import {
  ProcessRenewManufacturing,
  ProcessRenewManufacturingDocument,
} from '../schemas/process-renew-manufacturing.schema';
import {
  resolveRenewPlantState,
  withRenewPlantsStateAliases,
} from '../utils/renew-plant-state.util';

@Injectable()
export class RenewQuickViewService {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
    private readonly processRenewProductPerformanceService: ProcessRenewProductPerformanceService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentModel: Model<PaymentDetailsDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(ProcessRenewMpManufacturingUnit.name)
    private readonly renewMpUnitModel: Model<ProcessRenewMpManufacturingUnitDocument>,
    @InjectModel(ProcessRenewManufacturing.name)
    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,
    @InjectModel(DocStream.name)
    private readonly docStreamModel: Model<DocStreamDocument>,
  ) {}

  async buildQuickView(
    urnNo: string,
    vendorId?: string,
    renewalCycleId?: string,
  ): Promise<Record<string, unknown>> {
    const trimmedUrn = urnNo.trim();
    const productFilter: Record<string, unknown> = {
      urnNo: trimmedUrn,
      ...matchRenewEligibleProducts(),
    };

    if (vendorId) {
      productFilter.vendorId = toRenewObjectId(vendorId, 'vendorId');
    }

    const products = await this.productModel
      .find(productFilter)
      .select(
        'productId eoiNo urnNo productName productStatus productRenewStatus renewCycleNo urnStatus validtillDate renewedDate categoryId vendorId manufacturerId',
      )
      .lean()
      .exec();

    if (products.length === 0) {
      throw new NotFoundException(
        `No certified products found for URN ${trimmedUrn} (rejected EOIs are excluded from renewal)`,
      );
    }

    const first = products[0];
    const productList = products.map((p) => ({
      productId: p.productId,
      eoiNo: p.eoiNo,
      productName: p.productName,
      productStatus: p.productStatus,
      renewCycleNo: p.renewCycleNo ?? null,
      validtillDate: p.validtillDate,
      renewedDate: p.renewedDate,
    }));
    const category = first.categoryId
      ? await this.categoryModel
          .findById(first.categoryId)
          .select('categoryName category_name')
          .lean()
          .exec()
      : null;

    let activeCycle = renewalCycleId?.trim()
      ? await this.renewalCycleModel
          .findById(renewalCycleId.trim())
          .lean()
          .exec()
      : null;
    if (activeCycle && activeCycle.urnNo !== trimmedUrn) {
      throw new BadRequestException('renewalCycleId does not match this URN');
    }
    if (!activeCycle) {
      activeCycle = await this.renewalCycleModel
        .findOne({
          urnNo: trimmedUrn,
          status: RenewalCycleStatus.IN_PROGRESS,
        })
        .sort({ cycleNo: -1 })
        .lean()
        .exec();
    }

    const cycleDoc = activeCycle
      ? await this.renewalCycleModel.findById(activeCycle._id).exec()
      : null;
    const renewPaymentRows = cycleDoc
      ? await findRenewPaymentsForCycle(
          this.paymentModel,
          trimmedUrn,
          cycleDoc,
          vendorId,
        )
      : [];
    const { payments: cyclePayments, payment: cyclePayment } =
      buildRenewPaymentsPayload(renewPaymentRows);

    const performanceCycle =
      await this.processRenewProductPerformanceService.resolveRenewalCycleForRead(
        trimmedUrn,
        renewalCycleId ??
          (activeCycle?._id ? String(activeCycle._id) : undefined),
      );
    const performanceRead =
      await this.processRenewProductPerformanceService.loadRenewProductPerformanceReadPayload(
        trimmedUrn,
        String(performanceCycle._id),
      );

    const strictDocs = Number(performanceCycle.cycleNo) > 1;
    const documentRows = await this.renewDocumentModel
      .find(
        buildRenewDocumentsQueryFilter(trimmedUrn, performanceCycle._id, {
          strictCycleOnly: strictDocs,
        }),
      )
      .sort({ productDocumentId: -1 })
      .lean()
      .exec();

    const certifiedEoiNos = new Set(
      products.map((p) => String(p.eoiNo ?? '').trim()).filter(Boolean),
    );
    const documents = filterRenewRowsByCertifiedEoi(
      mergeRenewDocumentSources(
        documentRows as Array<Record<string, unknown>>,
        performanceRead.product_performance_documents as Array<
          Record<string, unknown>
        >,
      ),
      certifiedEoiNos,
    );

    const streamCycleCandidates = strictDocs
      ? [performanceCycle._id]
      : activeCycle?._id
        ? [activeCycle._id, null]
        : [null];
    const renewalStreams = await this.docStreamModel
      .find({
        urnNo: trimmedUrn,
        processType: 'renewal',
        renewalCycleId: { $in: streamCycleCandidates },
      })
      .select('liveRef latestVersionNo latestVersionId isDeleted')
      .lean()
      .exec();
    const streamByLiveRefId = new Map(
      renewalStreams
        .filter((stream) => stream?.liveRef?.id)
        .map((stream) => [String(stream.liveRef.id), stream]),
    );

    const strictCycle = Number(activeCycle?.cycleNo ?? 1) > 1;
    const mpHeaderFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycleDoc);
    const manufacturingHeader = cycleDoc
      ? await this.renewManufacturingModel
          .findOne(mpHeaderFilter)
          .select('_id')
          .lean()
          .exec()
      : null;
    const mpUnits =
      strictCycle && !manufacturingHeader
        ? []
        : await this.renewMpUnitModel
            .find({ urnNo: trimmedUrn })
            .select(
              'processRenewMpManufacturingUnitId unitName processMpManufacturingUnitStatus',
            )
            .lean()
            .exec();

    const { manufacturer, plants } =
      await this.productRegistrationService.getManufacturerAndPlantsForUrn(
        trimmedUrn,
      );
    const renewPlants = withRenewPlantsStateAliases(plants);
    const manufacturerName =
      manufacturer?.manufacturerName != null
        ? String(manufacturer.manufacturerName).trim()
        : '';

    const contextCycle = activeCycle ?? performanceCycle;
    const cycleScopedUrnStatus = resolveCycleScopedUrnStatus(
      contextCycle,
      {
        urnStatus: first.urnStatus,
        renewCycleNo: first.renewCycleNo,
      },
      cyclePayment,
    );

    return {
      urnNo: trimmedUrn,
      urnStatus: cycleScopedUrnStatus,
      urn_status: cycleScopedUrnStatus,
      urnStatusLabel: getRenewalUrnStatusLabel(cycleScopedUrnStatus),
      productRenewStatus: first.productRenewStatus,
      renewCycleNo: first.renewCycleNo ?? null,
      vendorId: first.vendorId ? String(first.vendorId) : null,
      manufacturerId: first.manufacturerId
        ? String(first.manufacturerId)
        : null,
      manufacturerName: manufacturerName || null,
      manufacturer: manufacturer ?? null,
      manufacturing_details: manufacturer ?? null,
      plants: renewPlants,
      plant_details: renewPlants,
      category: category
        ? {
            id: category._id,
            name:
              (category as { categoryName?: string }).categoryName ??
              (category as { category_name?: string }).category_name ??
              null,
          }
        : null,
      activeRenewalCycle: activeCycle
        ? {
            id: activeCycle._id,
            cycleNo: activeCycle.cycleNo,
            status: activeCycle.status,
            paymentId: activeCycle.paymentId ?? null,
            startedAt: activeCycle.startedAt,
          }
        : null,
      renewalCycle: activeCycle
        ? {
            id: activeCycle._id,
            cycleNo: activeCycle.cycleNo,
            status: activeCycle.status,
            paymentId: activeCycle.paymentId ?? null,
            startedAt: activeCycle.startedAt,
          }
        : null,
      payments: cyclePayments,
      payment: cyclePayment,
      renewContext: {
        renewalCycleId: String(contextCycle._id),
        urnStatus: cycleScopedUrnStatus,
        urn_status: cycleScopedUrnStatus,
        productRenewStatus: first.productRenewStatus,
        renewCycleNo: first.renewCycleNo ?? null,
        activeRenewalCycle: activeCycle
          ? {
              id: String(activeCycle._id),
              cycleNo: activeCycle.cycleNo,
              status: activeCycle.status,
              paymentId: activeCycle.paymentId ?? null,
            }
          : null,
        renewalCycle: contextCycle
          ? {
              id: String(contextCycle._id),
              cycleNo: contextCycle.cycleNo,
              status: contextCycle.status,
              paymentId: contextCycle.paymentId ?? null,
            }
          : null,
      },
      products: productList,
      eois: productList,
      productList,
      documents: documents.map((doc) => {
        const stream = streamByLiveRefId.get(String(doc._id));
        return {
          ...doc,
          latestVersionNo: stream?.latestVersionNo ?? null,
          latestVersionId: stream?.latestVersionId ?? null,
          streamDeleted: stream?.isDeleted ?? null,
        };
      }),
      all_renew_product_documents: documents,
      all_urn_product_documents: documents,
      manufacturingUnitsSummary:
        renewPlants.length > 0
          ? renewPlants.map((plant) => ({
              plantName: plant.plantName,
              plant_name: plant.plantName,
              plantLocation: plant.plantLocation,
              plant_location: plant.plantLocation,
              eoiNo: plant.eoiNo,
              city: plant.city,
              stateName: plant.stateName,
              state: resolveRenewPlantState(plant),
              State: resolveRenewPlantState(plant),
              countryName: plant.countryName,
            }))
          : mpUnits.map((u) => ({
              id: u.processRenewMpManufacturingUnitId,
              unitName: u.unitName ?? null,
              status: u.processMpManufacturingUnitStatus ?? 0,
            })),
    };
  }
}
