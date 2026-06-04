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
import { formatRenewWmManufacturingUnitForDetails } from '../utils/renew-details-format.util';

@Injectable()
export class ProcessRenewWmManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessRenewWmManufacturingUnit.name)
    private readonly model: Model<ProcessRenewWmManufacturingUnitDocument>,
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
  ): Promise<number | undefined> {
    if (dtoWasteId != null) {
      return dtoWasteId;
    }
    const header = await this.renewWasteModel
      .findOne({ urnNo })
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
      const { context } = await assertRenewProcessEditable(
        this.productModel,
        this.renewalCycleModel,
        dto.urnNo,
      );
      const ownership = renewOwnershipFields(context);
      const now = new Date();
      const urnNo = ownership.urnNo;

      const unitId = this.resolveUnitId(dto);
      const processRenewWasteManagementId = await this.resolveWasteManagementId(
        urnNo,
        dto.processWasteManagementId,
      );

      const {
        processWmManufacturingUnitId: _wmId,
        processWasteManagementId: _wasteId,
        urnNo: _urn,
        ...fieldUpdates
      } = dto;

      const setFields: Record<string, unknown> = {
        ...fieldUpdates,
        urnNo,
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

  async listByUrn(urnNo: string) {
    const trimmedUrn = urnNo.trim();
    const rows = await this.model
      .find({ urnNo: trimmedUrn })
      .sort({ processRenewWmManufacturingUnitId: 1 })
      .lean()
      .exec();
    return rows.map((row) =>
      formatRenewWmManufacturingUnitForDetails(row as Record<string, unknown>),
    );
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
