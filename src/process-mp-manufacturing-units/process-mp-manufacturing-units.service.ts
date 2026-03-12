import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitDocument,
} from './schemas/process-mp-manufacturing-unit.schema';
import { CreateProcessMpManufacturingUnitDto } from './dto/create-process-mp-manufacturing-unit.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class ProcessMpManufacturingUnitsService {
  constructor(
    @InjectModel(ProcessMpManufacturingUnit.name)
    private model: Model<ProcessMpManufacturingUnitDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async create(dto: CreateProcessMpManufacturingUnitDto, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getProcessMpManufacturingUnitId();
      const now = new Date();

      const doc = new this.model({
        processMpManufacturingUnitId: id,
        vendorId: vendorObjectId,
        urnNo: dto.urnNo,
        ...dto,
        offsiteRenewablePower: dto.offsiteRenewablePower ?? 0,
        processMpManufacturingUnitStatus: dto.processMpManufacturingUnitStatus ?? 0,
        createdDate: now,
        updatedDate: now,
      });

      return await doc.save();
    } catch (error: any) {
      console.error('[Process MP Manufacturing Units] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create manufacturing unit record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ processMpManufacturingUnitId: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Process MP Manufacturing Units] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list manufacturing unit records.',
      );
    }
  }
}

