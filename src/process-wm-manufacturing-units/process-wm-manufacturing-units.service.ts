import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitDocument,
} from './schemas/process-wm-manufacturing-unit.schema';
import { CreateProcessWmManufacturingUnitDto } from './dto/create-process-wm-manufacturing-unit.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  assertWmManufacturingUnitNonNegativeNumbers,
  normalizeWmManufacturingUnitNumericInputs,
} from './utils/wm-manufacturing-unit-numeric-fields.util';
import {
  enrichWmManufacturingUnitCalculations,
  pickPersistedWmCalculationFields,
} from './utils/wm-waste-disposal-calculations.util';

@Injectable()
export class ProcessWmManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessWmManufacturingUnit.name)
    private model: Model<ProcessWmManufacturingUnitDocument>,
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

  private buildUnitPayload(
    dto: CreateProcessWmManufacturingUnitDto,
    urnNo: string,
  ): Record<string, unknown> {
    const {
      processWmManufacturingUnitId: _id,
      urnNo: _dtoUrn,
      calculateBulkRshwd: _bulkRshwd,
      calculateBulkRsnhwd: _bulkRsnhwd,
      calculateBulkRshwdMultipled: _bulkRshwdMultipled,
      calculateBulkRsnhwdMultipled: _bulkRsnhwdMultipled,
      ...fieldUpdates
    } = dto;

    const normalized = normalizeWmManufacturingUnitNumericInputs({
      ...fieldUpdates,
      urnNo,
    });

    return enrichWmManufacturingUnitCalculations(normalized);
  }

  private async persistCalculatedWmFields(
    rowId: unknown,
    payload: Record<string, unknown>,
    updatedAt: Date,
  ) {
    await this.model
      .updateOne(
        { _id: rowId },
        {
          $set: {
            ...pickPersistedWmCalculationFields(payload),
            updatedDate: updatedAt,
          },
        },
      )
      .exec();
  }

  private enrichUnitRow(
    row: ProcessWmManufacturingUnitDocument | Record<string, unknown>,
  ) {
    const plain =
      typeof (row as ProcessWmManufacturingUnitDocument).toObject === 'function'
        ? (row as ProcessWmManufacturingUnitDocument).toObject()
        : { ...(row as Record<string, unknown>) };
    return enrichWmManufacturingUnitCalculations(plain);
  }

  async create(dto: CreateProcessWmManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const now = new Date();
      const urnNo = dto.urnNo.trim();
      const dtoUnitId = dto.processWmManufacturingUnitId;
      const incomingPayload = this.buildUnitPayload(dto, urnNo);

      assertWmManufacturingUnitNonNegativeNumbers(incomingPayload);

      if (dtoUnitId != null) {
        const updated = await this.model
          .findOneAndUpdate(
            {
              processWmManufacturingUnitId: dtoUnitId,
              urnNo,
              vendorId: vendorObjectId,
            },
            {
              $set: {
                ...incomingPayload,
                updatedDate: now,
              },
            },
            { new: true },
          )
          .exec();
        if (updated) {
          await this.persistCalculatedWmFields(
            updated._id,
            incomingPayload,
            now,
          );
          return this.enrichUnitRow({
            ...updated.toObject(),
            ...incomingPayload,
          });
        }
        // Row was removed (e.g. user deleted the unit) but the client still sends the old id — insert a new unit instead of failing the whole WM save.
      }

      const id = await this.sequenceHelper.getProcessWmManufacturingUnitId();
      const doc = new this.model({
        processWmManufacturingUnitId: id,
        vendorId: vendorObjectId,
        ...incomingPayload,
        createdDate: now,
        updatedDate: now,
      });

      return this.enrichUnitRow(await doc.save());
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.error('[Process WM Manufacturing Units] Create error:', error);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create waste management manufacturing unit record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return (await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processWmManufacturingUnitId: 1 })
        .exec()).map((row) => this.enrichUnitRow(row));
    } catch (error: any) {
      console.error('[Process WM Manufacturing Units] List error:', error);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list waste management manufacturing unit records.',
      );
    }
  }

  async deleteById(
    processWmManufacturingUnitId: number,
    urnNo: string,
    vendorId: string,
  ) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const trimmedUrn = urnNo.trim();
      const deleted = await this.model
        .findOneAndDelete({
          processWmManufacturingUnitId,
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
        })
        .exec();
      // Idempotent: already removed (double delete, or client/server race).
      if (!deleted) {
        return null;
      }
      return deleted;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('[Process WM Manufacturing Units] Delete error:', error);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to delete waste management manufacturing unit record.',
      );
    }
  }
}
