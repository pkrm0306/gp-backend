import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';
import { Product, ProductDocument } from '../schemas/product.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import {
  computeCertificationDates,
  computeNotifyDates,
} from '../helpers/certification-dates.util';
import {
  ProductStatusAudit,
  ProductStatusAuditDocument,
} from '../../renew/schemas/product-status-audit.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_REJECTED,
} from '../../renew/constants/product-status.constants';
import { invalidateProductListingsCache } from '../helpers/invalidate-product-listings-cache.util';
import { RejectedRestoreTargetStatus } from '../dto/admin-rejected-restore.dto';
import { RedisService } from '../../common/redis/redis.service';
import { EoiNumberService } from './eoi-number.service';

type UrnCertifiedGate = {
  hasCertifiedOnUrn: boolean;
  certifiedProductCount: number;
};

type RestoreResultRow = {
  productId: string;
  previousEoiNo: string;
  eoiNo: string;
};

@Injectable()
export class AdminRejectedRestoreService {
  private readonly logger = new Logger(AdminRejectedRestoreService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductStatusAudit.name)
    private readonly productStatusAuditModel: Model<ProductStatusAuditDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eoiNumberService: EoiNumberService,
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
  ) {}

  async getRestoreOptions(urnNo: string): Promise<{
    success: true;
    urnNo: string;
    hasCertifiedProducts: boolean;
    certifiedProductCount: number;
    rejectedProductCount: number;
    allowedTargets: Array<'uncertified' | 'certified'>;
    targetStatusMap: { uncertified: number; certified: number };
  }> {
    const trimmedUrn = urnNo?.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const [gate, rejectedProductCount] = await Promise.all([
      this.loadUrnCertifiedGate(trimmedUrn),
      this.productModel
        .countDocuments({
          urnNo: trimmedUrn,
          productStatus: PRODUCT_STATUS_REJECTED,
          ...matchActiveProducts(),
        })
        .exec(),
    ]);

    const allowedTargets = gate.hasCertifiedOnUrn
      ? (['certified'] as const)
      : (['uncertified', 'certified'] as const);

    return {
      success: true,
      urnNo: trimmedUrn,
      hasCertifiedProducts: gate.hasCertifiedOnUrn,
      certifiedProductCount: gate.certifiedProductCount,
      rejectedProductCount,
      allowedTargets: [...allowedTargets],
      targetStatusMap: {
        uncertified: PRODUCT_STATUS_PENDING,
        certified: PRODUCT_STATUS_CERTIFIED,
      },
    };
  }

  async restoreProduct(
    urnNo: string,
    productId: string,
    targetStatus: RejectedRestoreTargetStatus,
    adminUserId: string,
    eoiNo?: string,
  ): Promise<{
    success: true;
    urnNo: string;
    productId: string;
    previousEoiNo: string;
    eoiNo: string;
    fromStatus: number;
    toStatus: number;
    hasCertifiedOnUrn: boolean;
    updatedAt: Date;
  }> {
    const trimmedUrn = urnNo.trim();
    this.assertValidTargetStatus(targetStatus);

    const product = await this.resolveProduct(trimmedUrn, productId.trim());
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (eoiNo?.trim() && String(product.eoiNo) !== eoiNo.trim()) {
      throw new NotFoundException('Product not found');
    }

    if (Number(product.productStatus) !== PRODUCT_STATUS_REJECTED) {
      throw new ConflictException('Product is not rejected');
    }

    const gate = await this.loadUrnCertifiedGate(trimmedUrn);
    this.assertRestoreGate(targetStatus, gate);

    const now = new Date();
    const adminObjectId = new Types.ObjectId(adminUserId);
    const manufacturerId = String(product.manufacturerId);
    const previousEoiNo = String(product.eoiNo);

    let restored: RestoreResultRow;

    await this.runInTransaction(async (session) => {
      restored = await this.restoreOneProductInSession(
        product._id as Types.ObjectId,
        manufacturerId,
        previousEoiNo,
        targetStatus,
        product.validtillDate,
        now,
        session,
      );
    });

    await invalidateProductListingsCache(this.redisService, this.logger);

    await this.writeAudits({
      productObjectId: product._id as Types.ObjectId,
      urnNo: trimmedUrn,
      previousEoiNo,
      eoiNo: restored!.eoiNo,
      adminUserId,
      adminObjectId,
      now,
      fromStatus: PRODUCT_STATUS_REJECTED,
      toStatus: targetStatus,
      hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
      route: '/api/admin/products/rejected-restore/product',
      auditAction: AUDIT_ACTION.REJECTED_RESTORE_PRODUCT,
      description: `Rejected product restored to ${this.restoreTargetLabel(targetStatus)}`,
    });

    return {
      success: true,
      urnNo: trimmedUrn,
      productId: String(product._id),
      previousEoiNo,
      eoiNo: restored!.eoiNo,
      fromStatus: PRODUCT_STATUS_REJECTED,
      toStatus: targetStatus,
      hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
      updatedAt: now,
    };
  }

  async restoreUrn(
    urnNo: string,
    targetStatus: RejectedRestoreTargetStatus,
    adminUserId: string,
  ): Promise<{
    success: true;
    urnNo: string;
    targetStatus: number;
    hasCertifiedOnUrn: boolean;
    updatedProductIds: string[];
    previousEoiNos: string[];
    updatedEoiNos: string[];
    updatedCount: number;
  }> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }
    this.assertValidTargetStatus(targetStatus);

    const products = await this.productModel
      .find({
        urnNo: trimmedUrn,
        productStatus: PRODUCT_STATUS_REJECTED,
        ...matchActiveProducts(),
      })
      .select('_id eoiNo manufacturerId validtillDate')
      .sort({ createdDate: 1, productId: 1 })
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException('No rejected products on this URN');
    }

    const gate = await this.loadUrnCertifiedGate(trimmedUrn);
    this.assertRestoreGate(targetStatus, gate);

    const now = new Date();
    const adminObjectId = new Types.ObjectId(adminUserId);
    const restoredRows: RestoreResultRow[] = [];

    await this.runInTransaction(async (session) => {
      const runningMaxByManufacturer = new Map<string, number>();

      for (const product of products) {
        const manufacturerId = String(product.manufacturerId);
        let runningMax = runningMaxByManufacturer.get(manufacturerId);
        if (runningMax == null) {
          runningMax = await this.eoiNumberService.getMaxActiveSequenceSuffix(
            manufacturerId,
            session,
          );
        }

        const previousEoiNo = String(product.eoiNo);
        const assignment = await this.eoiNumberService.assignNextActiveEoiNo(
          manufacturerId,
          session,
          { runningMaxSuffix: runningMax, previousEoiNo },
        );
        runningMaxByManufacturer.set(manufacturerId, assignment.eoiSequence);
        await this.applyStatusRestoreUpdate(
          product._id as Types.ObjectId,
          targetStatus,
          product.validtillDate as Date | undefined,
          now,
          session,
        );
        await this.eoiNumberService.applyEoiReassignment(
          product._id as Types.ObjectId,
          assignment,
          now,
          session,
        );
        restoredRows.push({
          productId: String(product._id),
          previousEoiNo,
          eoiNo: assignment.eoiNo,
        });
      }
    });

    await invalidateProductListingsCache(this.redisService, this.logger);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const restored = restoredRows[i];
      await this.writeAudits({
        productObjectId: product._id as Types.ObjectId,
        urnNo: trimmedUrn,
        previousEoiNo: restored.previousEoiNo,
        eoiNo: restored.eoiNo,
        adminUserId,
        adminObjectId,
        now,
        fromStatus: PRODUCT_STATUS_REJECTED,
        toStatus: targetStatus,
        hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
        route: '/api/admin/products/rejected-restore/urn',
        auditAction: AUDIT_ACTION.REJECTED_RESTORE_URN,
        description: `Rejected product restored to ${this.restoreTargetLabel(targetStatus)} via URN bulk action`,
      });
    }

    return {
      success: true,
      urnNo: trimmedUrn,
      targetStatus,
      hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
      updatedProductIds: restoredRows.map((r) => r.productId),
      previousEoiNos: restoredRows.map((r) => r.previousEoiNo),
      updatedEoiNos: restoredRows.map((r) => r.eoiNo),
      updatedCount: restoredRows.length,
    };
  }

  private async restoreOneProductInSession(
    productObjectId: Types.ObjectId,
    manufacturerId: string,
    previousEoiNo: string,
    targetStatus: RejectedRestoreTargetStatus,
    existingValidTill: Date | null | undefined,
    now: Date,
    session: ClientSession,
  ): Promise<RestoreResultRow> {
    const assignment = await this.eoiNumberService.assignNextActiveEoiNo(
      manufacturerId,
      session,
      { previousEoiNo },
    );
    await this.applyStatusRestoreUpdate(
      productObjectId,
      targetStatus,
      existingValidTill,
      now,
      session,
    );
    await this.eoiNumberService.applyEoiReassignment(
      productObjectId,
      assignment,
      now,
      session,
    );
    return {
      productId: String(productObjectId),
      previousEoiNo,
      eoiNo: assignment.eoiNo,
    };
  }

  private assertValidTargetStatus(targetStatus: number): void {
    if (
      targetStatus !== PRODUCT_STATUS_PENDING &&
      targetStatus !== PRODUCT_STATUS_CERTIFIED
    ) {
      throw new BadRequestException(
        'targetStatus must be 0 (Un-certified) or 2 (Certified)',
      );
    }
  }

  private assertRestoreGate(
    targetStatus: RejectedRestoreTargetStatus,
    gate: UrnCertifiedGate,
  ): void {
    if (targetStatus === PRODUCT_STATUS_PENDING && gate.hasCertifiedOnUrn) {
      throw new BadRequestException(
        'This URN already has certified products. Restore to Certified only.',
      );
    }
  }

  private restoreTargetLabel(targetStatus: RejectedRestoreTargetStatus): string {
    return targetStatus === PRODUCT_STATUS_CERTIFIED ? 'certified' : 'uncertified';
  }

  private async loadUrnCertifiedGate(urnNo: string): Promise<UrnCertifiedGate> {
    const certifiedProductCount = await this.productModel
      .countDocuments({
        urnNo,
        productStatus: PRODUCT_STATUS_CERTIFIED,
        ...matchActiveProducts(),
      })
      .exec();
    return {
      hasCertifiedOnUrn: certifiedProductCount > 0,
      certifiedProductCount,
    };
  }

  private async resolveProduct(
    urnNo: string,
    productId: string,
  ): Promise<ProductDocument | null> {
    if (!urnNo || !productId) {
      return null;
    }

    const baseFilter = { urnNo, ...matchActiveProducts() };

    if (Types.ObjectId.isValid(productId)) {
      return this.productModel
        .findOne({ ...baseFilter, _id: new Types.ObjectId(productId) })
        .exec();
    }

    const numericId = Number(productId);
    if (Number.isFinite(numericId)) {
      return this.productModel
        .findOne({ ...baseFilter, productId: numericId })
        .exec();
    }

    return null;
  }

  private buildStatusRestoreFields(
    targetStatus: RejectedRestoreTargetStatus,
    existingValidTill: Date | null | undefined,
    now: Date,
  ): Record<string, unknown> {
    const update: Record<string, unknown> = {
      productStatus: targetStatus,
      updatedDate: now,
      rejectedDetails: null,
      rejectedAt: null,
      discontinuedAt: null,
      discontinuedBy: null,
    };

    if (targetStatus === PRODUCT_STATUS_CERTIFIED) {
      const existing =
        existingValidTill != null ? new Date(existingValidTill) : null;
      if (existing && !Number.isNaN(existing.getTime()) && existing > now) {
        const notifyDates = computeNotifyDates(existing);
        update.validtillDate = existing;
        update.firstNotifyDate = notifyDates.firstNotifyDate;
        update.secondNotifyDate = notifyDates.secondNotifyDate;
        update.thirdNotifyDate = notifyDates.thirdNotifyDate;
      } else {
        const certDates = computeCertificationDates(now);
        update.certifiedDate = certDates.certifiedDate;
        update.validtillDate = certDates.validtillDate;
        update.firstNotifyDate = certDates.firstNotifyDate;
        update.secondNotifyDate = certDates.secondNotifyDate;
        update.thirdNotifyDate = certDates.thirdNotifyDate;
      }
    }

    return update;
  }

  private async applyStatusRestoreUpdate(
    productObjectId: Types.ObjectId,
    targetStatus: RejectedRestoreTargetStatus,
    existingValidTill: Date | null | undefined,
    now: Date,
    session: ClientSession,
  ): Promise<void> {
    const update = this.buildStatusRestoreFields(
      targetStatus,
      existingValidTill,
      now,
    );
    const result = await this.productModel
      .updateOne(
        { _id: productObjectId, productStatus: PRODUCT_STATUS_REJECTED },
        { $set: update },
        { session },
      )
      .exec();
    if ((result.modifiedCount ?? 0) === 0) {
      throw new ConflictException('Product is not rejected');
    }
  }

  private async runInTransaction(
    operation: (session: ClientSession) => Promise<void>,
  ): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await operation(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async writeAudits(input: {
    productObjectId: Types.ObjectId;
    urnNo: string;
    previousEoiNo: string;
    eoiNo: string;
    adminUserId: string;
    adminObjectId: Types.ObjectId;
    now: Date;
    fromStatus: number;
    toStatus: number;
    hasCertifiedOnUrn: boolean;
    route: string;
    auditAction: string;
    description: string;
  }): Promise<void> {
    await this.productStatusAuditModel.create({
      productId: input.productObjectId,
      urnNo: input.urnNo,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      reason: input.description,
      changedBy: input.adminObjectId,
      changedAt: input.now,
    });

    await this.auditLogService.record({
      occurred_at: input.now,
      action: input.auditAction,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: input.eoiNo,
      description: input.description,
      performed_by: { user_id: input.adminUserId },
      old_values: {
        productStatus: input.fromStatus,
        eoiNo: input.previousEoiNo,
      },
      new_values: {
        productStatus: input.toStatus,
        urnNo: input.urnNo,
        previousEoiNo: input.previousEoiNo,
        eoiNo: input.eoiNo,
        hasCertifiedOnUrn: input.hasCertifiedOnUrn,
        restoreTarget:
          input.toStatus === PRODUCT_STATUS_CERTIFIED ? 'certified' : 'uncertified',
      },
      http_method: 'PATCH',
      route: input.route,
      status_code: 200,
    });

    await this.auditLogService.record({
      occurred_at: input.now,
      action: AUDIT_ACTION.EOI_REASSIGNED_ON_RESTORE,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: input.eoiNo,
      description: 'EOI reassigned on rejected product restore',
      performed_by: { user_id: input.adminUserId },
      old_values: { eoiNo: input.previousEoiNo },
      new_values: {
        eoiNo: input.eoiNo,
        urnNo: input.urnNo,
        productId: String(input.productObjectId),
      },
      http_method: 'PATCH',
      route: input.route,
      status_code: 200,
    });
  }
}
