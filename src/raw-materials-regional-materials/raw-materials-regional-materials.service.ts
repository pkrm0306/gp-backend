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
import * as path from 'path';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../utils/upload-file.util';
import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';
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
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  private async syncDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    formPrimaryId: number;
    uploadFiles: Express.Multer.File[];
    existingDocumentIds?: string[];
  }): Promise<RegionalMaterialsProductDocumentRow[]> {
    const { urnNo, vendorObjectId, formPrimaryId, uploadFiles, existingDocumentIds } =
      params;
    const now = new Date();
    const existingDocs = await this.allProductDocumentModel.find({
      vendorId: vendorObjectId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
      isDeleted: { $ne: true },
    });

    const keepRefs =
      existingDocumentIds !== undefined ? existingDocumentIds : null;
    const oldLinks: string[] = [];
    const docsToDelete: AllProductDocumentDocument[] = [];

    if (keepRefs !== null) {
      for (const doc of existingDocs) {
        const keep =
          keepRefs.includes(String(doc.productDocumentId)) ||
          keepRefs.includes(String(doc._id));
        if (!keep) {
          docsToDelete.push(doc);
          if (doc.documentLink) {
            oldLinks.push(doc.documentLink);
          }
          doc.isDeleted = true;
          doc.deletedAt = now;
          doc.deletedBy = vendorObjectId;
          doc.updatedDate = now;
          await doc.save();
        }
      }
      if (docsToDelete.length) {
        await trackProductDocumentDeleteBatch({
          versioning: this.documentVersioningService,
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
          userId: vendorObjectId,
          docs: docsToDelete,
          slotKeyMode: 'subsection',
        });
      }
    }

    const documents: RegionalMaterialsProductDocumentRow[] = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const masterDoc = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId: i === 0 ? formPrimaryId : productDocumentId,
        documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
        documentOriginalName: file.originalname,
        documentLink: uploaded.fileUrl,
        createdDate: now,
        updatedDate: now,
      });
      documents.push(this.mapProductDocument(masterDoc));
      await trackCertificationDocumentAfterCreate({
        productModel: this.productModel,
        versioning: this.documentVersioningService,
        documentModel: this.allProductDocumentModel,
        urnNo,
        sectionKey: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
        userId: vendorObjectId,
        vendorId: vendorObjectId,
        doc: masterDoc,
        file,
      });
    }

    for (const link of oldLinks) {
      try {
        await deleteUploadedFileByDocumentLink(link);
      } catch {
        // ignore storage cleanup failures
      }
    }

    return documents;
  }

  private async listDocumentsForUrn(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
  ): Promise<RegionalMaterialsProductDocumentRow[]> {
    const docRows = await this.allProductDocumentModel
      .find({
        urnNo: urnNo.trim(),
        vendorId: vendorObjectId,
        documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
        $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
      })
      .sort({ productDocumentId: -1 })
      .exec();
    return docRows.map((d) => this.mapProductDocument(d));
  }

  private toResponseUnit(row: Partial<RawMaterialsRegionalMaterials>) {
    return withRawMaterialsNumericFields(
      {
        rawMaterialsRegionalMaterialsId: row.rawMaterialsRegionalMaterialsId,
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
    options?: {
      uploadFiles?: Express.Multer.File[];
      existingDocumentIds?: string[];
    },
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
        const mapped = mapRawMaterialsStandardGridUnitForSave(unit);
        const id = await this.sequenceHelper.getRawMaterialsRegionalMaterialsId();
        docsToCreate.push({
          rawMaterialsRegionalMaterialsId: id,
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

      const uploadFiles = options?.uploadFiles ?? [];
      if (uploadFiles.length > 0 || options?.existingDocumentIds !== undefined) {
        const formPrimaryId =
          created[0]?.rawMaterialsRegionalMaterialsId ??
          (await this.sequenceHelper.getProductDocumentId());
        await this.syncDocuments({
          urnNo,
          vendorObjectId,
          formPrimaryId,
          uploadFiles,
          existingDocumentIds: options?.existingDocumentIds,
        });
      }

      const documents = await this.listDocumentsForUrn(urnNo, vendorObjectId);

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

      return {
        urnNo: trimmedUrn,
        vendorId: vendorObjectId.toString(),
        units: rows.map((row) => this.toResponseUnit(row.toObject())),
        documents: await this.listDocumentsForUrn(trimmedUrn, vendorObjectId),
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
