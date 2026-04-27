import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilizationManufacturingUnits,
  RawMaterialsUtilizationManufacturingUnitsDocument,
} from './schemas/raw-materials-utilization-manufacturing-units.schema';
import { CreateRawMaterialsUtilizationManufacturingUnitsDto } from './dto/create-raw-materials-utilization-manufacturing-units.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class RawMaterialsUtilizationManufacturingUnitsService {
  constructor(
    @InjectModel(RawMaterialsUtilizationManufacturingUnits.name)
    private model: Model<RawMaterialsUtilizationManufacturingUnitsDocument>,
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

  async create(
    dto: CreateRawMaterialsUtilizationManufacturingUnitsDto,
    vendorId: string,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: RawMaterialsUtilizationManufacturingUnitsDocument[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const unitsPayload = dto.units;

      if (!Array.isArray(unitsPayload) || unitsPayload.length === 0) {
        throw new BadRequestException('units must be a non-empty array');
      }

      const rowsToInsert: Array<
        Omit<RawMaterialsUtilizationManufacturingUnits, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      for (const unit of unitsPayload) {
        if (
          !unit?.unitName ||
          unit.year === undefined ||
          unit.yeardata1 === undefined ||
          unit.yeardata2 === undefined ||
          unit.yeardata3 === undefined
        ) {
          throw new BadRequestException(
            'Each unit must include unitName, year, yeardata1, yeardata2, and yeardata3',
          );
        }

        const id =
          await this.sequenceHelper.getRawMaterialsUtilizationManufacturingUnitsId();
        rowsToInsert.push({
          rawMaterialsUtilizationManufacturingUnitsId: id,
          urnNo,
          vendorId: vendorObjectId,
          unitName: unit.unitName.trim(),
          year: unit.year,
          yeardata1: unit.yeardata1,
          yeardata2: unit.yeardata2,
          yeardata3: unit.yeardata3,
          createdDate: now,
          updatedDate: now,
        });
      }

      // Replace behavior: keep only rows from the current request for this URN+vendor.
      await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      const created = await this.model.insertMany(rowsToInsert);
      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: created,
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Utilization Manufacturing Units] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials utilization manufacturing units record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
    } catch (error: any) {
      console.error(
        '[Raw Materials Utilization Manufacturing Units] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials utilization manufacturing units records.',
      );
    }
  }
}
