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

  async create(dto: CreateProcessWmManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const now = new Date();
      const urnNo = dto.urnNo.trim();

      const {
        processWmManufacturingUnitId: dtoUnitId,
        urnNo: _dtoUrn,
        ...fieldUpdates
      } = dto;

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
                ...fieldUpdates,
                urnNo,
                updatedDate: now,
              },
            },
            { new: true },
          )
          .exec();
        if (updated) {
          return updated;
        }
        // Row was removed (e.g. user deleted the unit) but the client still sends the old id — insert a new unit instead of failing the whole WM save.
      }

      const id = await this.sequenceHelper.getProcessWmManufacturingUnitId();
      const doc = new this.model({
        processWmManufacturingUnitId: id,
        vendorId: vendorObjectId,
        urnNo,
        ...fieldUpdates,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
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
      return await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processWmManufacturingUnitId: 1 })
        .exec();
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
