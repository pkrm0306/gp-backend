import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsAdditives,
  RawMaterialsAdditivesDocument,
} from './schemas/raw-materials-additives.schema';
import { CreateRawMaterialsAdditivesDto } from './dto/create-raw-materials-additives.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import {
  filterMeaningfulRows,
  mapRawMaterialsAdditivesUnitForSave,
  RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS,
  withRawMaterialsNumericFields,
} from '../common/raw-materials/raw-materials-upload.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

const ADDITIVES_UNIT_KEYS = [
  'unitName',
  'year',
  'year1',
  'year1a',
  'year1b',
  'year1c',
  'year2',
  'year2a',
  'year2b',
  'year2c',
  'year3',
  'year3a',
  'year3b',
  'year3c',
  'psc',
  'coc',
  'percentcoc',
  'ppc',
];

type AdditivesProductDocumentRow = {
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
export class RawMaterialsAdditivesService {
  constructor(
    @InjectModel(RawMaterialsAdditives.name)
    private model: Model<RawMaterialsAdditivesDocument>,
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

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: string,
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  private toResponseUnit(row: Partial<RawMaterialsAdditives>) {
    const numericNormalized = withRawMaterialsNumericFields(
      {
        year: row.year,
        year1: row.year1,
        year1a: row.year1a,
        year1b: row.year1b,
        year1c: row.year1c,
        year2: row.year2,
        year2a: row.year2a,
        year2b: row.year2b,
        year2c: row.year2c,
        year3: row.year3,
        year3a: row.year3a,
        year3b: row.year3b,
        year3c: row.year3c,
      } as Record<string, unknown>,
      RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS,
    );
    const asVendorDisplay = (value: unknown): number | string | null => {
      if (value === null || value === undefined || value === '') return null;
      const n = Number(value);
      if (!Number.isFinite(n)) return null;
      return n === 0 ? '0' : n;
    };
    return {
      rawMaterialsAdditivesId: row.rawMaterialsAdditivesId,
      unitName: row.unitName,
      year: asVendorDisplay(numericNormalized.year),
      year1: asVendorDisplay(numericNormalized.year1),
      year1a: asVendorDisplay(numericNormalized.year1a),
      year1b: asVendorDisplay(numericNormalized.year1b),
      year1c: asVendorDisplay(numericNormalized.year1c),
      year2: asVendorDisplay(numericNormalized.year2),
      year2a: asVendorDisplay(numericNormalized.year2a),
      year2b: asVendorDisplay(numericNormalized.year2b),
      year2c: asVendorDisplay(numericNormalized.year2c),
      year3: asVendorDisplay(numericNormalized.year3),
      year3a: asVendorDisplay(numericNormalized.year3a),
      year3b: asVendorDisplay(numericNormalized.year3b),
      year3c: asVendorDisplay(numericNormalized.year3c),
      psc: row.psc,
      coc: row.coc,
      percentcoc: row.percentcoc,
    };
  }

  private mapProductDocument(d: AllProductDocumentDocument): AdditivesProductDocumentRow {
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
    dto: CreateRawMaterialsAdditivesDto,
    vendorId: string,
    additivesFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<{
      rawMaterialsAdditivesId: number;
      unitName: string;
      year?: number | string | null;
      year1: number | string | null;
      year1a: number | string | null;
      year1b: number | string | null;
      year1c: number | string | null;
      year2: number | string | null;
      year2a: number | string | null;
      year2b: number | string | null;
      year2c: number | string | null;
      year3: number | string | null;
      year3a: number | string | null;
      year3b: number | string | null;
      year3c: number | string | null;
      psc: string;
      coc: string;
      percentcoc: string;
    }>;
    documents: AdditivesProductDocumentRow[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const docsToCreate: Array<
        Omit<RawMaterialsAdditives, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      const meaningfulUnits = filterMeaningfulRows(
        (dto.units ?? []) as unknown as Array<Record<string, unknown>>,
        ADDITIVES_UNIT_KEYS,
      );

      for (const unit of meaningfulUnits) {
        const id = await this.sequenceHelper.getRawMaterialsAdditivesId();
        const mapped = mapRawMaterialsAdditivesUnitForSave(unit);
        docsToCreate.push({
          rawMaterialsAdditivesId: id,
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
      const documents: AdditivesProductDocumentRow[] = [];

      if (additivesFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          additivesFile,
          urnNo,
          'additives_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const masterDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId:
            created[0]?.rawMaterialsAdditivesId ?? productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: additivesFile.originalname,
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
          sectionKey: DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: masterDoc,
          file: additivesFile,
        });
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: created.map((row) => this.toResponseUnit(row.toObject())),
        documents,
      };
    } catch (error: any) {
      console.error('[Raw Materials Additives] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials additives record.',
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
        .sort({ rawMaterialsAdditivesId: 1 })
        .exec();

      const docRows = await this.allProductDocumentModel
        .find({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
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
      console.error('[Raw Materials Additives] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials additives records.',
      );
    }
  }
}
