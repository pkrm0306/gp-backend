import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import {
  ProcessRenewComments,
  ProcessRenewCommentsDocument,
} from '../schemas/process-renew-comments.schema';
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
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  resolveUrnRenewContext,
} from '../helpers/renew-common.util';

/** Admin renew review tabs — exact POST field names (incl. legacy typo). */
export const ADMIN_RENEW_PROCESS_COMMENT_FIELDS = [
  'productPerformance',
  'manfacturingProcess',
  'wasteManagement',
  'productInnovation',
] as const;

const COMMENT_FIELDS = [
  'productDesign',
  'productPerformance',
  'manfacturingProcess',
  'wasteManagement',
  'lifeCycleApproach',
  'productStewardship',
  'productInnovation',
  'rawMaterials31',
  'rawMaterials32',
  'rawMaterials33',
  'rawMaterials34',
  'rawMaterials35',
  'rawMaterials36',
  'rawMaterials37',
  'rawMaterials38',
  'rawMaterials39',
  'rawMaterials310',
  'rawMaterials311',
  'rawMaterials312',
  'rawMaterials313',
  'rawMaterials314',
  'rawMaterials315',
] as const;

export type UpsertRenewCommentsInput = Partial<
  Omit<
    ProcessRenewComments,
    | 'processRenewCommentsId'
    | 'vendorId'
    | 'manufacturerId'
    | 'updatedDate'
    | 'renewalCycleId'
  >
> & { urnNo: string; renewalCycleId?: string };

const LEGACY_URN_ONLY_INDEX = 'uniq_process_renew_comments_urn';

@Injectable()
export class ProcessRenewCommentsService implements OnModuleInit {
  private readonly logger = new Logger(ProcessRenewCommentsService.name);

  constructor(
    @InjectModel(ProcessRenewComments.name)
    private readonly renewCommentsModel: Model<ProcessRenewCommentsDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.renewCommentsModel.collection.dropIndex(LEGACY_URN_ONLY_INDEX);
      this.logger.log(
        `Dropped legacy index ${LEGACY_URN_ONLY_INDEX} on process_renew_comments`,
      );
    } catch (error: unknown) {
      const code = (error as { code?: number })?.code;
      if (code !== 27 && code !== 26) {
        this.logger.warn(
          `Could not drop legacy index ${LEGACY_URN_ONLY_INDEX}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    try {
      await this.renewCommentsModel.syncIndexes();
    } catch (error: unknown) {
      this.logger.warn(
        `process_renew_comments syncIndexes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async upsert(input: UpsertRenewCommentsInput) {
    const { context, cycle } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo,
    );
    const cycleId = await this.resolveCycleId(
      input.urnNo,
      input.renewalCycleId,
      cycle._id as Types.ObjectId,
    );
    return this.upsertForCycle(input, renewOwnershipFields(context), cycleId);
  }

  /** Admin process review — no vendor edit lock. */
  async adminUpsert(input: UpsertRenewCommentsInput) {
    const context = await resolveUrnRenewContext(this.productModel, input.urnNo);
    const ownership = renewOwnershipFields(context);
    const cycleId = await this.resolveAdminCycleId(
      input.urnNo,
      input.renewalCycleId,
    );
    return this.upsertForCycle(input, ownership, cycleId);
  }

  /**
   * Admin POST — requires urnNo, renewalCycleId, and exactly one section field.
   */
  async adminUpsertSection(input: UpsertRenewCommentsInput) {
    if (!input.renewalCycleId?.trim()) {
      throw new BadRequestException('renewalCycleId is required');
    }
    const sectionPatch = this.pickSingleAdminSectionField(input);
    return this.adminUpsert({
      urnNo: input.urnNo,
      renewalCycleId: input.renewalCycleId,
      ...sectionPatch,
    });
  }

  /** GET payload for admin UI — cert field names, cycle-scoped, non-empty only. */
  async adminGetCommentsPayload(
    urnNo: string,
    renewalCycleId: string,
  ): Promise<Record<string, string>> {
    await this.resolveAdminCycleId(urnNo, renewalCycleId);
    const doc = await this.getByUrnAndCycle(urnNo, renewalCycleId);
    if (!doc) {
      return {};
    }
    const row = doc.toObject() as unknown as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const field of ADMIN_RENEW_PROCESS_COMMENT_FIELDS) {
      const value = row[field];
      if (typeof value === 'string' && value.trim() !== '') {
        out[field] = value;
      }
    }
    return out;
  }

  private pickSingleAdminSectionField(
    input: UpsertRenewCommentsInput,
  ): Pick<UpsertRenewCommentsInput, (typeof ADMIN_RENEW_PROCESS_COMMENT_FIELDS)[number]> {
    const provided = ADMIN_RENEW_PROCESS_COMMENT_FIELDS.filter(
      (field) => input[field] !== undefined,
    );
    if (provided.length === 0) {
      throw new BadRequestException(
        'One process comment section field is required (productPerformance, manfacturingProcess, wasteManagement, or productInnovation)',
      );
    }
    if (provided.length > 1) {
      throw new BadRequestException(
        'Only one process comment section field may be sent per request',
      );
    }
    const field = provided[0];
    return { [field]: input[field] } as Pick<
      UpsertRenewCommentsInput,
      (typeof ADMIN_RENEW_PROCESS_COMMENT_FIELDS)[number]
    >;
  }

  private async resolveAdminCycleId(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<Types.ObjectId> {
    if (!renewalCycleId?.trim()) {
      throw new BadRequestException('renewalCycleId is required');
    }
    const cycleObjectId = await this.resolveCycleId(urnNo, renewalCycleId);
    const cycle = await this.renewalCycleModel.findById(cycleObjectId).lean().exec();
    if (!cycle) {
      throw new BadRequestException('Renewal cycle not found');
    }
    if (
      cycle.status === RenewalCycleStatus.COMPLETED ||
      cycle.status === RenewalCycleStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Renewal cycle is ${cycle.status}; process comments cannot be edited`,
      );
    }
    return cycleObjectId;
  }

  async getByUrnAndCycle(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    if (renewalCycleId?.trim()) {
      const cycleObjectId = await this.resolveCycleId(trimmedUrn, renewalCycleId);
      const scoped = await this.renewCommentsModel
        .findOne({ urnNo: trimmedUrn, renewalCycleId: cycleObjectId })
        .exec();
      if (scoped) {
        return scoped;
      }
    }

    const legacy = await this.renewCommentsModel.findOne({ urnNo: trimmedUrn }).exec();
    return legacy;
  }

  /** @deprecated use getByUrnAndCycle */
  async getByUrn(urnNo: string) {
    return this.getByUrnAndCycle(urnNo);
  }

  /** Cycle-scoped row first; fall back to legacy URN-only row (pre–renewalCycleId index). */
  private async findExistingCommentRow(
    urnNo: string,
    renewalCycleId: Types.ObjectId,
  ): Promise<ProcessRenewCommentsDocument | null> {
    const scoped = await this.renewCommentsModel
      .findOne({ urnNo, renewalCycleId })
      .exec();
    if (scoped) {
      return scoped;
    }

    return this.renewCommentsModel
      .findOne({ urnNo })
      .sort({ updatedDate: -1 })
      .exec();
  }

  private buildCommentUpdateData(
    input: UpsertRenewCommentsInput,
    ownership: {
      vendorId: Types.ObjectId;
      manufacturerId: Types.ObjectId;
    },
    renewalCycleId: Types.ObjectId,
    now: Date,
  ): Record<string, unknown> {
    const updateData: Record<string, unknown> = {
      vendorId: ownership.vendorId,
      manufacturerId: ownership.manufacturerId,
      renewalCycleId,
      updatedDate: now,
    };
    for (const field of COMMENT_FIELDS) {
      if (input[field] !== undefined) {
        updateData[field] = input[field];
      }
    }
    return updateData;
  }

  private async updateExistingCommentRow(
    existing: ProcessRenewCommentsDocument,
    updateData: Record<string, unknown>,
  ): Promise<ProcessRenewCommentsDocument | null> {
    return this.renewCommentsModel
      .findByIdAndUpdate(existing._id, { $set: updateData }, { new: true })
      .exec();
  }

  private async upsertForCycle(
    input: UpsertRenewCommentsInput,
    ownership: {
      urnNo: string;
      vendorId: Types.ObjectId;
      manufacturerId: Types.ObjectId;
    },
    renewalCycleId: Types.ObjectId,
  ) {
    const now = new Date();
    const trimmedUrn = ownership.urnNo;
    const updateData = this.buildCommentUpdateData(
      input,
      ownership,
      renewalCycleId,
      now,
    );

    try {
      const existing = await this.findExistingCommentRow(trimmedUrn, renewalCycleId);
      if (existing) {
        const updated = await this.updateExistingCommentRow(existing, updateData);
        if (updated) {
          return updated;
        }
      }

      const processRenewCommentsId =
        await this.sequenceHelper.getProcessRenewCommentsId();
      const record = new this.renewCommentsModel({
        processRenewCommentsId,
        urnNo: trimmedUrn,
        renewalCycleId,
        vendorId: ownership.vendorId,
        manufacturerId: ownership.manufacturerId,
        productDesign: input.productDesign ?? '',
        productPerformance: input.productPerformance ?? '',
        manfacturingProcess: input.manfacturingProcess ?? '',
        wasteManagement: input.wasteManagement ?? '',
        lifeCycleApproach: input.lifeCycleApproach ?? '',
        productStewardship: input.productStewardship ?? '',
        productInnovation: input.productInnovation ?? '',
        updatedDate: now,
        ...Object.fromEntries(
          COMMENT_FIELDS.filter((f) => input[f] !== undefined).map((f) => [f, input[f]]),
        ),
      });
      return record.save();
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        const legacy = await this.renewCommentsModel.findOne({ urnNo: trimmedUrn }).exec();
        if (legacy) {
          const updated = await this.updateExistingCommentRow(legacy, updateData);
          if (updated) {
            return updated;
          }
        }
      }
      const message = error instanceof Error ? error.message : 'Failed to save renew comments';
      throw new InternalServerErrorException(message);
    }
  }

  private async resolveCycleId(
    urnNo: string,
    renewalCycleId?: string,
    fallbackCycleId?: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    if (renewalCycleId?.trim()) {
      if (!Types.ObjectId.isValid(renewalCycleId.trim())) {
        throw new BadRequestException('Invalid renewalCycleId');
      }
      const cycle = await this.renewalCycleModel.findById(renewalCycleId.trim()).exec();
      if (!cycle || cycle.urnNo !== urnNo.trim()) {
        throw new BadRequestException('renewalCycleId does not match this URN');
      }
      return cycle._id as Types.ObjectId;
    }

    if (fallbackCycleId) {
      return fallbackCycleId;
    }

    const cycle = await this.renewalCycleModel
      .findOne({ urnNo: urnNo.trim(), status: RenewalCycleStatus.IN_PROGRESS })
      .sort({ cycleNo: -1 })
      .exec();

    if (!cycle) {
      throw new BadRequestException(
        'renewalCycleId is required when no active renewal cycle exists',
      );
    }
    return cycle._id as Types.ObjectId;
  }
}
