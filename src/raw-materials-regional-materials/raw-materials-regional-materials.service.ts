import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsRegionalMaterials,
  RawMaterialsRegionalMaterialsDocument,
} from './schemas/raw-materials-regional-materials.schema';
import { CreateRawMaterialsRegionalMaterialsDto } from './dto/create-raw-materials-regional-materials.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackUploadedProductDocument } from '../documents/helpers/product-document-version.integration';
import {
  assertUnitYearFieldsPositive,
  filterMeaningfulRows,
} from '../common/raw-materials/raw-materials-upload.util';

const REGIONAL_UNIT_KEYS = [
  'unitName',
  'year',
  'unit1',
  'yeardata1',
  'unit2',
  'yeardata2',
];

type RegionalMaterialsProductDocumentRow = {
  _id: unknown;
  productDocumentId: number;
  vendorId: Types.ObjectId;
  urnNo: string;
  eoiNo?: string;
  documentForm: string;
  documentFormSubsection?: string;
  formPrimaryId: number;
  documentName: string;
  documentOriginalName: string;
  documentLink: string;
  createdDate: Date;
  updatedDate: Date;
};

@Injectable()
export class RawMaterialsRegionalMaterialsService {
  constructor(
    @InjectModel(RawMaterialsRegionalMaterials.name)
    private model: Model<RawMaterialsRegionalMaterialsDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    private sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
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

  private roundToTwo(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: string,
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  private toResponseUnit(row: Partial<RawMaterialsRegionalMaterials>) {
    return {
      rawMaterialsRegionalMaterialsId: row.rawMaterialsRegionalMaterialsId,
      unitName: row.unitName,
      year: row.year,
      unit1: row.unit1,
      yeardata1: row.yeardata1,
      unit2: row.unit2,
      yeardata2: row.yeardata2,
      yeardata3: this.roundToTwo(Number(row.yeardata3 ?? 0)),
    };
  }

  private mapProductDocument(d: AllProductDocumentDocument): RegionalMaterialsProductDocumentRow {
    const o = typeof d.toObject === 'function' ? d.toObject() : d;
    return {
      _id: o._id,
      productDocumentId: o.productDocumentId,
      vendorId: o.vendorId,
      urnNo: o.urnNo,
      eoiNo: o.eoiNo,
      documentForm: o.documentForm,
      documentFormSubsection: o.documentFormSubsection,
      formPrimaryId: o.formPrimaryId,
      documentName: o.documentName,
      documentOriginalName: o.documentOriginalName,
      documentLink: o.documentLink,
      createdDate: o.createdDate,
      updatedDate: o.updatedDate,
    };
  }

  async create(
    dto: CreateRawMaterialsRegionalMaterialsDto,
    vendorId: string,
    regionalMaterialsFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<{
      rawMaterialsRegionalMaterialsId: number;
      unitName: string;
      year: number;
      unit1: number;
      yeardata1: number;
      unit2: number;
      yeardata2: number;
      yeardata3: number;
    }>;
    documents: RegionalMaterialsProductDocumentRow[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const docsToCreate: Array<
        Omit<RawMaterialsRegionalMaterials, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      const meaningfulUnits = filterMeaningfulRows(
        (dto.units ?? []) as unknown as Array<Record<string, unknown>>,
        REGIONAL_UNIT_KEYS,
      );

      assertUnitYearFieldsPositive(meaningfulUnits);

      for (const unit of meaningfulUnits) {
        // if (Number(unit.yeardata1 ?? 0) <= 0) {
        //   throw new BadRequestException(
        //     'yeardata1 must be greater than 0 for each unit',
        //   );
        // }
        const yeardata1 = Number(unit.yeardata1 ?? 0);
        const yeardata2 = Number(unit.yeardata2 ?? 0);
        const yeardata3 =
          yeardata1 > 0 ? (yeardata2 / yeardata1) * 100 : 0;
        const id = await this.sequenceHelper.getRawMaterialsRegionalMaterialsId();
        docsToCreate.push({
          rawMaterialsRegionalMaterialsId: id,
          urnNo,
          vendorId: vendorObjectId,
          unitName: String(unit.unitName ?? '').trim(),
          year: Number(unit.year ?? 0),
          unit1: Number(unit.unit1 ?? 0),
          yeardata1,
          unit2: Number(unit.unit2 ?? 0),
          yeardata2,
          yeardata3,
          createdDate: now,
          updatedDate: now,
        });
      }

      // Replace behavior: keep only the units coming in current request for this URN+vendor.
      await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      const created = await this.model.insertMany(docsToCreate);
      const documents: RegionalMaterialsProductDocumentRow[] = [];

      if (regionalMaterialsFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          regionalMaterialsFile,
          urnNo,
          'regional_materials_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const masterDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId:
            created[0]?.rawMaterialsRegionalMaterialsId ?? productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: regionalMaterialsFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
        documents.push(this.mapProductDocument(masterDoc));
        await trackUploadedProductDocument(this.documentVersioningService, {
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
          subsectionKey: 'supporting_documents',
          userId: vendorObjectId,
          documentId: masterDoc._id,
          productDocumentId,
          filePath: storedRelativePath,
          originalName: regionalMaterialsFile.originalname,
          storedName: path.basename(storedRelativePath),
          file: regionalMaterialsFile,
          action: 'added',
        });
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: created.map((row) => this.toResponseUnit(row.toObject())),
        documents,
      };
    } catch (error: any) {
      console.error('[Raw Materials Regional Materials] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials regional materials record.',
      );
    }
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return countVendorUrnDocuments(this.model, urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const trimmedUrn = urnNo.trim();
      const rows = await this.model
        .find({ urnNo: trimmedUrn, vendorId: vendorObjectId })
        .sort({ rawMaterialsRegionalMaterialsId: 1 })
        .exec();

      const docRows = await this.allProductDocumentModel
        .find({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
          $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
        })
        .sort({ productDocumentId: -1 })
        .exec();

      return {
        urnNo: trimmedUrn,
        vendorId: vendorObjectId.toString(),
        units: rows.map((row) => this.toResponseUnit(row.toObject())),
        documents: docRows.map((d) => this.mapProductDocument(d)),
      };
    } catch (error: any) {
      console.error('[Raw Materials Regional Materials] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials regional materials records.',
      );
    }
  }
}
