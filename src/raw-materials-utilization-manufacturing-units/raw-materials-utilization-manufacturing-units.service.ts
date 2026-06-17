import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilizationManufacturingUnits,
  RawMaterialsUtilizationManufacturingUnitsDocument,
} from './schemas/raw-materials-utilization-manufacturing-units.schema';
import { CreateRawMaterialsUtilizationManufacturingUnitsDto } from './dto/create-raw-materials-utilization-manufacturing-units.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  assertUnitYearFieldsPositive,
  filterMeaningfulRows,
  mapRawMaterialsManufacturingUnitForSave,
  RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS,
  withRawMaterialsNumericFields,
} from '../common/raw-materials/raw-materials-upload.util';

const MANUFACTURING_UNIT_KEYS = [
  'unitName',
  'year',
  'yeardata1',
  'yeardata2',
  'yeardata3',
];

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

  private toResponseUnit(
    row: Partial<RawMaterialsUtilizationManufacturingUnits>,
  ) {
    const plain =
      typeof (row as RawMaterialsUtilizationManufacturingUnitsDocument)
        .toObject === 'function'
        ? (row as RawMaterialsUtilizationManufacturingUnitsDocument).toObject()
        : row;
    return withRawMaterialsNumericFields(
      {
        rawMaterialsUtilizationManufacturingUnitsId:
          plain.rawMaterialsUtilizationManufacturingUnitsId,
        urnNo: plain.urnNo,
        vendorId: plain.vendorId,
        unitName: plain.unitName,
        year: plain.year,
        yeardata1: plain.yeardata1,
        yeardata2: plain.yeardata2,
        yeardata3: plain.yeardata3,
        createdDate: plain.createdDate,
        updatedDate: plain.updatedDate,
      },
      RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS,
    );
  }

  async create(
    dto: CreateRawMaterialsUtilizationManufacturingUnitsDto,
    vendorId: string,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<Record<string, unknown>>;
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const meaningfulUnits = filterMeaningfulRows(
        (dto.units ?? []) as unknown as Array<Record<string, unknown>>,
        MANUFACTURING_UNIT_KEYS,
      );

      const rowsToInsert: Array<
        Omit<RawMaterialsUtilizationManufacturingUnits, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      assertUnitYearFieldsPositive(meaningfulUnits);

      for (const unit of meaningfulUnits) {
        // if (Number(unit.year ?? 0) <= 0) {
        //   throw new BadRequestException(
        //     'year must be greater than 0 for each manufacturing unit',
        //   );
        // }
        const id =
          await this.sequenceHelper.getRawMaterialsUtilizationManufacturingUnitsId();
        const mapped = mapRawMaterialsManufacturingUnitForSave(unit);
        rowsToInsert.push({
          rawMaterialsUtilizationManufacturingUnitsId: id,
          urnNo,
          vendorId: vendorObjectId,
          ...mapped,
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
        units: created.map((row) => this.toResponseUnit(row)),
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

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return countVendorUrnDocuments(this.model, urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return (await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec()).map((row) => this.toResponseUnit(row));
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
