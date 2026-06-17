import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsDocument,
} from './schemas/raw-materials-rapidly-renewable-materials.schema';
import { CreateRawMaterialsRapidlyRenewableMaterialsDto } from './dto/create-raw-materials-rapidly-renewable-materials.dto';
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
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';
import {
  assertUnitYearFieldsPositive,
  filterMeaningfulRows,
  mapRawMaterialsStandardGridUnitForSave,
  RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS,
  withRawMaterialsNumericFields,
} from '../common/raw-materials/raw-materials-upload.util';

const RAPIDLY_RENEWABLE_UNIT_KEYS = [
  'unitName',
  'year',
  'unit1',
  'yeardata1',
  'unit2',
  'yeardata2',
];

type RapidlyRenewableProductDocumentRow = {
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
export class RawMaterialsRapidlyRenewableMaterialsService {
  constructor(
    @InjectModel(RawMaterialsRapidlyRenewableMaterials.name)
    private model: Model<RawMaterialsRapidlyRenewableMaterialsDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
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

  private toResponseUnit(row: Partial<RawMaterialsRapidlyRenewableMaterials>) {
    return withRawMaterialsNumericFields(
      {
        rawMaterialsRapidlyRenewableMaterialsId: row.rawMaterialsRapidlyRenewableMaterialsId,
        unitName: row.unitName,
        year: row.year,
        unit1: row.unit1,
        yeardata1: row.yeardata1,
        unit2: row.unit2,
        yeardata2: row.yeardata2,
        yeardata3:
          row.yeardata3 === undefined || row.yeardata3 === null
            ? null
            : this.roundToTwo(Number(row.yeardata3)),
      },
      RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS,
    );
  }

  private mapProductDocument(d: AllProductDocumentDocument): RapidlyRenewableProductDocumentRow {
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
    dto: CreateRawMaterialsRapidlyRenewableMaterialsDto,
    vendorId: string,
    rapidlyRenewableFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<{
      rawMaterialsRapidlyRenewableMaterialsId: number;
      unitName: string;
      year: number;
      unit1: number;
      yeardata1: number;
      unit2: number;
      yeardata2: number;
      yeardata3: number;
    }>;
    documents: RapidlyRenewableProductDocumentRow[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const docsToCreate: Array<
        Omit<RawMaterialsRapidlyRenewableMaterials, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      const meaningfulUnits = filterMeaningfulRows(
        (dto.units ?? []) as unknown as Array<Record<string, unknown>>,
        RAPIDLY_RENEWABLE_UNIT_KEYS,
      );

      assertUnitYearFieldsPositive(meaningfulUnits);

      for (const unit of meaningfulUnits) {
        const mapped = mapRawMaterialsStandardGridUnitForSave(unit);
        const id = await this.sequenceHelper.getRawMaterialsRapidlyRenewableMaterialsId();
        docsToCreate.push({
          rawMaterialsRapidlyRenewableMaterialsId: id,
          urnNo,
          vendorId: vendorObjectId,
          ...mapped,
          createdDate: now,
          updatedDate: now,
        });
      }

      // Replace behavior: keep only the units coming in current request for this URN+vendor.
      await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      const created = await this.model.insertMany(docsToCreate);
      const documents: RapidlyRenewableProductDocumentRow[] = [];

      if (rapidlyRenewableFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          rapidlyRenewableFile,
          urnNo,
          'rapidly_renewable_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const masterDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId:
            created[0]?.rawMaterialsRapidlyRenewableMaterialsId ??
            productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: rapidlyRenewableFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
        documents.push(this.mapProductDocument(masterDoc));
        await trackCertificationDocumentAfterCreate({
          productModel: this.productModel,
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: masterDoc,
          file: rapidlyRenewableFile,
        });
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: created.map((row) => this.toResponseUnit(row.toObject())),
        documents,
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Rapidly Renewable Materials] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials rapidly renewable materials record.',
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
        .sort({ rawMaterialsRapidlyRenewableMaterialsId: 1 })
        .exec();

      const docRows = await this.allProductDocumentModel
        .find({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
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
      console.error(
        '[Raw Materials Rapidly Renewable Materials] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials rapidly renewable materials records.',
      );
    }
  }
}
