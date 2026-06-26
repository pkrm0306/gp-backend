import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProcessRenewWmManufacturingUnit,
  ProcessRenewWmManufacturingUnitDocument,
} from '../schemas/process-renew-wm-manufacturing-unit.schema';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitDocument,
} from '../../process-wm-manufacturing-units/schemas/process-wm-manufacturing-unit.schema';
import {
  ProcessRenewWasteManagement,
  ProcessRenewWasteManagementDocument,
} from '../schemas/process-renew-waste-management.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../schemas/renewal-cycle.schema';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { CreateProcessWmManufacturingUnitDto } from '../../process-wm-manufacturing-units/dto/create-process-wm-manufacturing-unit.dto';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
} from '../helpers/renew-common.util';
import {
  buildRenewProcessHeaderFilter,
  resolveRenewCycleForQuery,
} from '../helpers/renew-cycle-scope.util';
import { formatRenewWmManufacturingUnitForDetails } from '../utils/renew-details-format.util';
import { findRenewWmUnitsForRead } from '../helpers/renew-wm-units-read.util';

function readRenewalCycleId(dto: CreateProcessWmManufacturingUnitDto): string | undefined {
  const raw = (dto as { renewalCycleId?: string; renewal_cycle_id?: string })
    .renewalCycleId ?? (dto as { renewal_cycle_id?: string }).renewal_cycle_id;
  const trimmed = String(raw ?? '').trim();
  return trimmed || undefined;
}

@Injectable()
export class ProcessRenewWmManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessRenewWmManufacturingUnit.name)
    private readonly model: Model<ProcessRenewWmManufacturingUnitDocument>,
    @InjectModel(ProcessWmManufacturingUnit.name)
    private readonly certWmModel: Model<ProcessWmManufacturingUnitDocument>,
    @InjectModel(ProcessRenewWasteManagement.name)
    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  private resolveUnitId(dto: CreateProcessWmManufacturingUnitDto): number | undefined {
    const renewId = (dto as { processRenewWmManufacturingUnitId?: number })
      .processRenewWmManufacturingUnitId;
    return dto.processWmManufacturingUnitId ?? renewId;
  }

  private async resolveWasteManagementId(
    urnNo: string,
    dtoWasteId?: number,
    renewalCycleId?: string,
  ): Promise<number | undefined> {
    if (dtoWasteId != null) {
      return dtoWasteId;
    }
    const cycle = await resolveRenewCycleForQuery(
      this.renewalCycleModel,
      urnNo,
      renewalCycleId,
    );
    const header = await this.renewWasteModel
      .findOne(buildRenewProcessHeaderFilter(urnNo, cycle))
      .select('processRenewWasteManagementId')
      .lean()
      .exec();
    return header?.processRenewWasteManagementId;
  }

  private formatRow(doc: ProcessRenewWmManufacturingUnitDocument | Record<string, unknown>) {
    const plain =
      typeof (doc as ProcessRenewWmManufacturingUnitDocument).toObject === 'function'
        ? (doc as ProcessRenewWmManufacturingUnitDocument).toObject()
        : { ...doc };
    return formatRenewWmManufacturingUnitForDetails(plain as Record<string, unknown>);
  }

  async upsert(dto: CreateProcessWmManufacturingUnitDto) {
    try {
      const cycleIdHint = readRenewalCycleId(dto);
      const { cycle, context } = await assertRenewProcessEditable(
        this.productModel,
        this.renewalCycleModel,
        dto.urnNo,
        cycleIdHint,
      );
      const ownership = renewOwnershipFields(context);
      const renewalCycleObjectId = cycle._id;
      const now = new Date();
      const urnNo = ownership.urnNo;

      const unitId = this.resolveUnitId(dto);
      const processRenewWasteManagementId = await this.resolveWasteManagementId(
        urnNo,
        dto.processWasteManagementId,
        cycleIdHint,
      );

      const {
        processWmManufacturingUnitId: _wmId,
        processWasteManagementId: _wasteId,
        urnNo: _urn,
        renewalCycleId: _renewalCycleId,
        renewal_cycle_id: _renewalCycleSnake,
        ...fieldUpdates
      } = dto as CreateProcessWmManufacturingUnitDto & {
        renewalCycleId?: string;
        renewal_cycle_id?: string;
      };

      const setFields: Record<string, unknown> = {
        ...fieldUpdates,
        urnNo,
        renewalCycleId: renewalCycleObjectId,
        updatedDate: now,
      };
      if (processRenewWasteManagementId != null) {
        setFields.processRenewWasteManagementId = processRenewWasteManagementId;
      }

      if (unitId != null) {
        const updated = await this.model
          .findOneAndUpdate(
            {
              processRenewWmManufacturingUnitId: unitId,
              urnNo,
              vendorId: ownership.vendorId,
            },
            { $set: setFields },
            { new: true },
          )
          .exec();
        if (updated) {
          return this.formatRow(updated);
        }
      }

      const id = await this.sequenceHelper.getProcessRenewWmManufacturingUnitId();
      const doc = new this.model({
        processRenewWmManufacturingUnitId: id,
        vendorId: ownership.vendorId,
        manufacturerId: ownership.manufacturerId,
        processRenewWasteManagementId,
        ...setFields,
        renewalCycleId: renewalCycleObjectId,
        createdDate: now,
      });

      const saved = await doc.save();
      return this.formatRow(saved);
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to save renew WM manufacturing unit.';
      throw new InternalServerErrorException(message);
    }
  }

  async listByUrn(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    const cycle = await resolveRenewCycleForQuery(
      this.renewalCycleModel,
      trimmedUrn,
      renewalCycleId,
    );
    return findRenewWmUnitsForRead(this.model, this.certWmModel, trimmedUrn, cycle);
  }

  async deleteById(unitId: number, urnNo: string) {
    try {
      await assertRenewProcessEditable(
        this.productModel,
        this.renewalCycleModel,
        urnNo,
      );
      const trimmedUrn = urnNo.trim();
      const deleted = await this.model
        .findOneAndDelete({
          processRenewWmManufacturingUnitId: unitId,
          urnNo: trimmedUrn,
        })
        .exec();
      if (!deleted) {
        return null;
      }
      return this.formatRow(deleted);
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete renew WM manufacturing unit.';
      throw new InternalServerErrorException(message);
    }
  }
}
