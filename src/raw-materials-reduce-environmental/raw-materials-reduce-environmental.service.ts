import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { countVendorUrnDocuments } from '../common/raw-materials/raw-materials-upload.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsReduceEnvironmental,
  RawMaterialsReduceEnvironmentalDocument,
} from './schemas/raw-materials-reduce-environmental.schema';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as path from 'path';
import { deleteUploadedFileByDocumentLink, uploadFile } from '../utils/upload-file.util';
import { filterMeaningfulRows } from '../common/raw-materials/raw-materials-upload.util';

const QUARRYING_UNIT_KEYS = [
  'location',
  'enhancementOfMinesLife',
  'topsoilConservation',
  'waterTableManagement',
  'restorationOfSpentMines',
  'greenBeltDevelopmentAndBioDiversity',
];

const REDUCE_ENV_DOCUMENT_FORMS = [
  DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
  DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
];

type ReduceEnvironmentalUnitInput = {
  location: string;
  enhancementOfMinesLife: string;
  topsoilConservation: string;
  waterTableManagement: string;
  restorationOfSpentMines: string;
  greenBeltDevelopmentAndBioDiversity: string;
};

@Injectable()
export class RawMaterialsReduceEnvironmentalService {
  constructor(
    @InjectModel(RawMaterialsReduceEnvironmental.name)
    private model: Model<RawMaterialsReduceEnvironmentalDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
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
  }) {
    const { urnNo, vendorObjectId, formPrimaryId, uploadFiles, existingDocumentIds } =
      params;
    const now = new Date();
    const existingDocs = await this.allProductDocumentModel.find({
      vendorId: vendorObjectId,
      urnNo,
      documentForm: { $in: REDUCE_ENV_DOCUMENT_FORMS },
      isDeleted: { $ne: true },
    });

    const keepRefs = existingDocumentIds !== undefined ? existingDocumentIds : null;
    const oldLinks: string[] = [];

    if (keepRefs !== null) {
      for (const doc of existingDocs) {
        const keep =
          keepRefs.includes(String(doc.productDocumentId)) ||
          keepRefs.includes(String(doc._id));
        if (!keep) {
          if (doc.documentLink) oldLinks.push(doc.documentLink);
          doc.isDeleted = true;
          doc.deletedAt = now;
          doc.deletedBy = vendorObjectId;
          doc.updatedDate = now;
          await doc.save();
        }
      }
    }

    const documents = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const d = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm: DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId: i === 0 ? formPrimaryId : productDocumentId,
        documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
        documentOriginalName: file.originalname,
        documentLink: uploaded.fileUrl,
        createdDate: now,
        updatedDate: now,
      });
      documents.push(d);
    }

    for (const link of oldLinks) {
      try {
        await deleteUploadedFileByDocumentLink(link);
      } catch {
        // ignore
      }
    }

    return documents;
  }

  async create(
    dto: CreateRawMaterialsReduceEnvironmentalDto,
    vendorId: string,
    options?: {
      replaceAllRows?: boolean;
      uploadFiles?: Express.Multer.File[];
      existingDocumentIds?: string[];
    },
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: RawMaterialsReduceEnvironmentalDocument[];
    documents?: unknown[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const replaceAllRows = options?.replaceAllRows !== false;

      const meaningfulUnits = filterMeaningfulRows(
        (dto.units ?? []) as unknown as Array<Record<string, unknown>>,
        QUARRYING_UNIT_KEYS,
      ) as ReduceEnvironmentalUnitInput[];

      const rowsToInsert: Array<
        Omit<RawMaterialsReduceEnvironmental, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      for (const unit of meaningfulUnits) {
        const generatedId =
          await this.sequenceHelper.getRawMaterialsReduceEnvironmentalId();
        rowsToInsert.push({
          rawMaterialsReduceEnvironmentalId: generatedId,
          urnNo,
          vendorId: vendorObjectId,
          location: unit.location.trim(),
          enhancementOfMinesLife: unit.enhancementOfMinesLife.trim(),
          topsoilConservation: unit.topsoilConservation.trim(),
          waterTableManagement: unit.waterTableManagement.trim(),
          restorationOfSpentMines: unit.restorationOfSpentMines.trim(),
          greenBeltDevelopmentAndBioDiversity:
            unit.greenBeltDevelopmentAndBioDiversity.trim(),
          createdDate: now,
          updatedDate: now,
        });
      }

      if (replaceAllRows) {
        await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      }

      const createdRows =
        rowsToInsert.length > 0 ? await this.model.insertMany(rowsToInsert) : [];

      const uploadFiles = options?.uploadFiles ?? [];
      let documents: unknown[] | undefined;
      if (uploadFiles.length > 0 || options?.existingDocumentIds !== undefined) {
        const formPrimaryId =
          createdRows[0]?.rawMaterialsReduceEnvironmentalId ??
          (await this.sequenceHelper.getProductDocumentId());
        documents = await this.syncDocuments({
          urnNo,
          vendorObjectId,
          formPrimaryId,
          uploadFiles,
          existingDocumentIds: options?.existingDocumentIds,
        });
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: createdRows,
        ...(documents ? { documents } : {}),
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Reduce Environmental] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials reduce environmental record.',
      );
    }
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return countVendorUrnDocuments(this.model, urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Raw Materials Reduce Environmental] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials reduce environmental records.',
      );
    }
  }
}
