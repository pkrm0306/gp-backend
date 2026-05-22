import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  ProductDesign,
  ProductDesignDocument,
} from './schemas/product-design.schema';
import { PdMeasure, PdMeasureDocument } from './schemas/pd-measure.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from './schemas/all-product-document.schema';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../utils/upload-file.util';
import {
  ECO_VISION_SUBSECTION,
  SUPPORTING_SUBSECTION,
} from './product-design-upload.util';
import { normalizeMeasureBenefitRow } from '../common/form-partial-field.util';

@Injectable()
export class ProductDesignService implements OnModuleInit {
  constructor(
    @InjectModel(ProductDesign.name)
    private productDesignModel: Model<ProductDesignDocument>,
    @InjectModel(PdMeasure.name)
    private pdMeasureModel: Model<PdMeasureDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.productDesignModel.syncIndexes();
      await this.pdMeasureModel.syncIndexes();
    } catch (error) {
      console.error(
        '[product-design] syncIndexes failed (check existing duplicates):',
        error,
      );
    }
  }

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  /**
   * Normalize and deduplicate measures rows from multipart payload.
   * This prevents duplicate inserts when clients accidentally append
   * the same measures for each uploaded file.
   */
  private normalizeUniqueMeasures(
    rows?: Array<{ measuresImplemented?: string; benefitsAchieved?: string }>,
  ): Array<{
    measuresImplemented: string;
    benefitsAchieved: string;
    normalizedMeasures: string;
    normalizedBenefits: string;
  }> {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const seen = new Set<string>();
    const unique: Array<{
      measuresImplemented: string;
      benefitsAchieved: string;
      normalizedMeasures: string;
      normalizedBenefits: string;
    }> = [];

    for (const row of rows) {
      const normalized = normalizeMeasureBenefitRow(
        row as Record<string, unknown>,
      );
      const measuresImplemented = normalized.measuresImplemented;
      const benefitsAchieved = normalized.benefitsAchieved;
      const normalizedMeasures = measuresImplemented.toLowerCase();
      const normalizedBenefits = benefitsAchieved.toLowerCase();

      // Skip fully empty rows
      if (!measuresImplemented && !benefitsAchieved) continue;

      const key = `${normalizedMeasures}__${normalizedBenefits}`;
      if (seen.has(key)) continue;
      seen.add(key);

      unique.push({
        measuresImplemented,
        benefitsAchieved,
        normalizedMeasures,
        normalizedBenefits,
      });
    }

    return unique;
  }

  private toEmbeddedMeasures(
    rows: Array<{
      measuresImplemented: string;
      benefitsAchieved: string;
    }>,
  ): Array<{ measuresImplemented: string; benefitsAchieved: string }> {
    return rows.map((row) => ({
      measuresImplemented: row.measuresImplemented,
      benefitsAchieved: row.benefitsAchieved,
    }));
  }

  /**
   * Replace all measure rows for this URN/vendor with the POST payload (no merge).
   */
  private async replaceMeasuresByUrn(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    effectiveProductDesignId: number;
    normalizedMeasures: Array<{
      measuresImplemented: string;
      benefitsAchieved: string;
      normalizedMeasures: string;
      normalizedBenefits: string;
    }>;
    now: Date;
    session: ClientSession;
  }): Promise<
    Array<{
      _id: Types.ObjectId;
      productDesignMeasureId: number;
      measuresImplemented: string;
      benefitsAchieved: string;
    }>
  > {
    const {
      urnNo,
      vendorObjectId,
      effectiveProductDesignId,
      normalizedMeasures,
      now,
      session,
    } = params;

    await this.pdMeasureModel.deleteMany(
      { urnNo, vendorId: vendorObjectId },
      { session },
    );

    if (!normalizedMeasures.length) {
      return [];
    }

    const measureDocs = [];
    for (const row of normalizedMeasures) {
      const productDesignMeasureId =
        await this.sequenceHelper.getProductDesignMeasureId();
      measureDocs.push({
        productDesignMeasureId,
        urnNo,
        vendorId: vendorObjectId,
        productDesignId: effectiveProductDesignId,
        measures: row.measuresImplemented,
        benefits: row.benefitsAchieved,
        normalizedMeasures: row.normalizedMeasures,
        normalizedBenefits: row.normalizedBenefits,
        createdDate: now,
        updatedDate: now,
      });
    }

    const inserted = await this.pdMeasureModel.insertMany(measureDocs, {
      session,
    });

    return inserted.map((row) => ({
      _id: row._id as Types.ObjectId,
      productDesignMeasureId: row.productDesignMeasureId,
      measuresImplemented: String(row.measures ?? ''),
      benefitsAchieved: String(row.benefits ?? ''),
    }));
  }

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  private resolveDocumentIdRefs(ids: string[]): {
    objectIds: Types.ObjectId[];
    productDocumentIds: number[];
  } {
    const objectIds: Types.ObjectId[] = [];
    const productDocumentIds: number[] = [];
    for (const raw of ids) {
      const value = String(raw).trim();
      if (!value) continue;
      if (Types.ObjectId.isValid(value)) {
        objectIds.push(new Types.ObjectId(value));
        continue;
      }
      const numericId = Number(value);
      if (Number.isFinite(numericId)) {
        productDocumentIds.push(numericId);
      }
    }
    return { objectIds, productDocumentIds };
  }

  /**
   * Count product_design documents that would remain after applying retention lists.
   * `existing*DocumentIds` omitted → keep all docs of that subsection (vendor text-only save).
   */
  async countRetainedProductDesignDocuments(
    urnNo: string,
    vendorId: string,
    existingEcoVisionDocumentIds?: string[],
    existingSupportingDocumentIds?: string[],
  ): Promise<{ ecoVision: number; supporting: number }> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const ecoKeepRefs =
      existingEcoVisionDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingEcoVisionDocumentIds)
        : null;
    const supportingKeepRefs =
      existingSupportingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingSupportingDocumentIds)
        : null;

    const existingDocs = await this.allProductDocumentModel
      .find({
        vendorId: vendorObjectId,
        urnNo,
        documentForm: DocumentSectionKey.PRODUCT_DESIGN,
        isDeleted: { $ne: true },
      })
      .lean()
      .exec();

    let ecoVision = 0;
    let supporting = 0;

    for (const doc of existingDocs) {
      const subsection = String(doc.documentFormSubsection ?? '');
      if (subsection === ECO_VISION_SUBSECTION) {
        const retain =
          ecoKeepRefs === null || this.docMatchesIdRefs(doc, ecoKeepRefs);
        if (retain) ecoVision += 1;
      } else if (subsection === SUPPORTING_SUBSECTION) {
        const retain =
          supportingKeepRefs === null ||
          this.docMatchesIdRefs(doc, supportingKeepRefs);
        if (retain) supporting += 1;
      }
    }

    return { ecoVision, supporting };
  }

  private docMatchesIdRefs(
    doc: { _id?: Types.ObjectId; productDocumentId?: number },
    refs: { objectIds: Types.ObjectId[]; productDocumentIds: number[] },
  ): boolean {
    if (
      doc._id &&
      refs.objectIds.some((id) => id.equals(doc._id as Types.ObjectId))
    ) {
      return true;
    }
    return (
      doc.productDocumentId !== undefined &&
      refs.productDocumentIds.includes(doc.productDocumentId)
    );
  }

  private async syncProductDesignDocuments(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    eoiNo?: string;
    formPrimaryId: number;
    now: Date;
    session: ClientSession;
    ecoVisionFiles: Express.Multer.File[];
    supportingDocumentFiles: Express.Multer.File[];
    existingEcoVisionDocumentIds?: string[];
    existingSupportingDocumentIds?: string[];
    createdFileFullPaths: string[];
  }): Promise<{
    ecoVisionUpload: number;
    productDesignSupportingDocument: number;
    oldFileLinksToDeleteAfterCommit: string[];
  }> {
    const {
      urnNo,
      vendorObjectId,
      eoiNo,
      formPrimaryId,
      now,
      session,
      ecoVisionFiles,
      supportingDocumentFiles,
      existingEcoVisionDocumentIds,
      existingSupportingDocumentIds,
      createdFileFullPaths,
    } = params;

    const ecoKeepRefs =
      existingEcoVisionDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingEcoVisionDocumentIds)
        : null;
    const supportingKeepRefs =
      existingSupportingDocumentIds !== undefined
        ? this.resolveDocumentIdRefs(existingSupportingDocumentIds)
        : null;

    const existingDocs = await this.allProductDocumentModel
      .find({
        vendorId: vendorObjectId,
        urnNo,
        documentForm: DocumentSectionKey.PRODUCT_DESIGN,
        isDeleted: { $ne: true },
      })
      .session(session);

    const retainIds: Types.ObjectId[] = [];
    const deleteIds: Types.ObjectId[] = [];
    const oldFileLinksToDeleteAfterCommit: string[] = [];

    for (const doc of existingDocs) {
      const subsection = String(doc.documentFormSubsection ?? '');
      const isEco = subsection === ECO_VISION_SUBSECTION;
      const isSupporting = subsection === SUPPORTING_SUBSECTION;

      if (!isEco && !isSupporting) {
        retainIds.push(doc._id as Types.ObjectId);
        continue;
      }

      const retain = isEco
        ? ecoKeepRefs === null || this.docMatchesIdRefs(doc, ecoKeepRefs)
        : supportingKeepRefs === null ||
          this.docMatchesIdRefs(doc, supportingKeepRefs);

      if (retain) {
        retainIds.push(doc._id as Types.ObjectId);
      } else {
        deleteIds.push(doc._id as Types.ObjectId);
        if (doc.documentLink) {
          oldFileLinksToDeleteAfterCommit.push(doc.documentLink);
        }
      }
    }

    if (deleteIds.length) {
      await this.allProductDocumentModel.updateMany(
        { _id: { $in: deleteIds } },
        {
          $set: {
            isDeleted: true,
            deletedAt: now,
            deletedBy: vendorObjectId,
            updatedDate: now,
          },
        },
        { session },
      );
    }

    if (retainIds.length) {
      await this.allProductDocumentModel.updateMany(
        { _id: { $in: retainIds } },
        { $set: { formPrimaryId, updatedDate: now } },
        { session },
      );
    }

    const docRows: Array<{
      subsection: string;
      filePath: string;
      fileName: string;
      originalName: string;
    }> = [];

    for (const file of ecoVisionFiles) {
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      createdFileFullPaths.push(uploaded.fileUrl);
      docRows.push({
        subsection: ECO_VISION_SUBSECTION,
        filePath: uploaded.fileUrl,
        fileName: uploaded.fileName,
        originalName: file.originalname,
      });
    }

    for (const file of supportingDocumentFiles) {
      const uploaded = await this.saveFileToUrnFolder(file, urnNo);
      createdFileFullPaths.push(uploaded.fileUrl);
      docRows.push({
        subsection: SUPPORTING_SUBSECTION,
        filePath: uploaded.fileUrl,
        fileName: uploaded.fileName,
        originalName: file.originalname,
      });
    }

    if (docRows.length) {
      const docsToInsert = [];
      for (const row of docRows) {
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo,
          documentForm: DocumentSectionKey.PRODUCT_DESIGN,
          documentFormSubsection: row.subsection,
          formPrimaryId,
          documentName: row.fileName,
          documentOriginalName: row.originalName,
          documentLink: row.filePath,
          createdDate: now,
          updatedDate: now,
        });
      }
      await this.allProductDocumentModel.insertMany(docsToInsert, { session });
    }

    const baseDocFilter = {
      vendorId: vendorObjectId,
      urnNo,
      documentForm: DocumentSectionKey.PRODUCT_DESIGN,
      isDeleted: { $ne: true },
    };

    const ecoCount = await this.allProductDocumentModel
      .countDocuments({
        ...baseDocFilter,
        documentFormSubsection: ECO_VISION_SUBSECTION,
      })
      .session(session);

    const supportingCount = await this.allProductDocumentModel
      .countDocuments({
        ...baseDocFilter,
        documentFormSubsection: SUPPORTING_SUBSECTION,
      })
      .session(session);

    return {
      ecoVisionUpload: ecoCount,
      productDesignSupportingDocument: supportingCount,
      oldFileLinksToDeleteAfterCommit,
    };
  }

  /**
   * Create product design with file uploads
   */
  async createProductDesign(
    createProductDesignDto: CreateProductDesignDto,
    vendorId: string,
    uploadParts?: {
      ecoVisionFiles: Express.Multer.File[];
      supportingDocumentFiles: Express.Multer.File[];
    },
  ): Promise<{
    productDesign: ProductDesignDocument;
    measuresAndBenefits: Array<{
      _id: Types.ObjectId;
      productDesignMeasureId: number;
      measuresImplemented: string;
      benefitsAchieved: string;
    }>;
    ecoVisionDocumentCount: number;
    supportingDocumentCount: number;
  }> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Track new files created in this request for rollback cleanup
    let createdFileFullPaths: string[] = [];
    // Track old files to delete only after successful commit
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const normalizedMeasures = this.normalizeUniqueMeasures(
        createProductDesignDto.measuresAndBenefits,
      );
      const ecoVisionFiles = uploadParts?.ecoVisionFiles ?? [];
      const supportingDocumentFiles = uploadParts?.supportingDocumentFiles ?? [];

      // Fetch EOI no (optional) for master document table
      const productRow = await this.connection
        .collection('products')
        .findOne(
          { urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId },
          { projection: { eoiNo: 1 } },
        );
      if (!productRow) {
        throw new NotFoundException(
          'URN not found or does not belong to this vendor',
        );
      }
      const eoiNo: string | undefined = productRow?.eoiNo;

      const productDesignId = await this.sequenceHelper.getProductDesignId();

      const strategiesText = String(
        createProductDesignDto.strategies ??
          createProductDesignDto.statergies ??
          '',
      ).trim();

      // Replace master product-design row for this URN + vendor.
      await this.productDesignModel.deleteMany(
        { urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId },
        { session },
      );

      const embeddedMeasures = this.toEmbeddedMeasures(normalizedMeasures);

      const productDesignData = {
        productDesignId,
        urnNo: createProductDesignDto.urnNo,
        vendorId: vendorObjectId,
        ecoVisionUpload: 0,
        statergies: strategiesText,
        productDesignSupportingDocument: 0,
        productDesignStatus: createProductDesignDto.productDesignStatus ?? 0,
        measuresAndBenefits: embeddedMeasures,
        createdDate: now,
        updatedDate: now,
      };

      const createdProductDesign = new this.productDesignModel(productDesignData);
      const savedProductDesign = await createdProductDesign.save({ session });

      if (!savedProductDesign) {
        throw new InternalServerErrorException(
          'Failed to save product design record',
        );
      }

      const effectiveProductDesignId = savedProductDesign.productDesignId;

      const savedMeasures = await this.replaceMeasuresByUrn({
        urnNo: createProductDesignDto.urnNo,
        vendorObjectId,
        effectiveProductDesignId,
        normalizedMeasures,
        now,
        session,
      });

      await this.productDesignModel.updateOne(
        { _id: savedProductDesign._id },
        { $set: { measuresAndBenefits: this.toEmbeddedMeasures(savedMeasures) } },
        { session },
      );
      savedProductDesign.measuresAndBenefits =
        this.toEmbeddedMeasures(savedMeasures);

      const documentSync = await this.syncProductDesignDocuments({
        urnNo: createProductDesignDto.urnNo,
        vendorObjectId,
        eoiNo,
        formPrimaryId: effectiveProductDesignId,
        now,
        session,
        ecoVisionFiles,
        supportingDocumentFiles,
        existingEcoVisionDocumentIds:
          createProductDesignDto.existingEcoVisionDocumentIds,
        existingSupportingDocumentIds:
          createProductDesignDto.existingSupportingDocumentIds,
        createdFileFullPaths,
      });

      oldFileLinksToDeleteAfterCommit =
        documentSync.oldFileLinksToDeleteAfterCommit;

      await this.productDesignModel.updateOne(
        { _id: savedProductDesign._id },
        {
          $set: {
            ecoVisionUpload: documentSync.ecoVisionUpload,
            productDesignSupportingDocument:
              documentSync.productDesignSupportingDocument,
            updatedDate: now,
          },
        },
        { session },
      );

      savedProductDesign.ecoVisionUpload = documentSync.ecoVisionUpload;
      savedProductDesign.productDesignSupportingDocument =
        documentSync.productDesignSupportingDocument;

      await session.commitTransaction();
      session.endSession();

      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        try {
          await deleteUploadedFileByDocumentLink(fileLink);
        } catch {
          // Ignore file cleanup issues after successful commit
        }
      }

      return {
        productDesign: savedProductDesign,
        measuresAndBenefits: savedMeasures,
        ecoVisionDocumentCount: documentSync.ecoVisionUpload,
        supportingDocumentCount: documentSync.productDesignSupportingDocument,
      };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        for (const fileLink of createdFileFullPaths) {
          await deleteUploadedFileByDocumentLink(fileLink);
        }
      } catch (cleanupError) {
        // Ignore cleanup errors
        console.warn('File cleanup error:', cleanupError);
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        console.error('Validation error:', error.message);
        throw error;
      }

      // Log the actual error for debugging
      console.error('Product design creation error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);

      // Check for specific error types
      if (
        error.name === 'CastError' ||
        error.message?.includes('Cast to ObjectId')
      ) {
        throw new BadRequestException(
          `Invalid ID format provided: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to create product design. Please check the logs for details.',
      );
    }
  }
}
