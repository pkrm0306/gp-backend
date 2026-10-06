import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessLifeCycleApproach,
  ProcessLifeCycleApproachDocument,
} from './schemas/process-life-cycle-approach.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessLifeCycleApproachDto } from './dto/create-process-life-cycle-approach.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../utils/upload-file.util';
import { ProductDocumentUploadNotificationHelper } from '../notifications/helpers/product-document-upload-notification.helper';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  isVendorResubmitCycle,
  trackInsertedCertificationDocuments,
} from '../documents/helpers/certification-document-version.util';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';
import {
  resolveDesiredDocumentIdRefs,
  softDeleteUnkeptCertificationDocuments,
} from '../documents/helpers/desired-document-state.apply';

/** Canonical write subsection (API typo spelling preserved). */
export const LCA_ASSESSMENT_SUBSECTION = 'life_cycle_assesment_reports';
export const LCA_IMPLEMENTATION_SUBSECTION =
  'life_cycle_implementation_documents';

const LCA_ASSESSMENT_SUBSECTIONS = new Set([
  'life_cycle_assesment_reports',
  'life_cycle_assessment_reports',
  'life_cycle_assessment_report',
  'lca_assessment_report',
  'lca_reports',
]);

const LCA_IMPLEMENTATION_SUBSECTIONS = new Set([
  'life_cycle_implementation_documents',
  'life_cycle_implementation_document',
  'life_cycle_supporting_documents',
  'supporting_documents',
]);

/** Partition helper for DesiredState isolation tests / sync. */
export function partitionLcaLiveDocsBySubsection<
  T extends { documentFormSubsection?: string | null },
>(liveDocs: T[]): { assessment: T[]; implementation: T[]; other: T[] } {
  const assessment: T[] = [];
  const implementation: T[] = [];
  const other: T[] = [];
  for (const doc of liveDocs) {
    const sub = String(doc.documentFormSubsection ?? '')
      .trim()
      .toLowerCase();
    if (LCA_IMPLEMENTATION_SUBSECTIONS.has(sub)) {
      implementation.push(doc);
    } else if (LCA_ASSESSMENT_SUBSECTIONS.has(sub) || !sub) {
      // Legacy empty subsection → assessment (matches vendor FE).
      assessment.push(doc);
    } else {
      other.push(doc);
    }
  }
  return { assessment, implementation, other };
}

@Injectable()
export class ProcessLifeCycleApproachService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessLifeCycleApproach.name)
    private processLifeCycleApproachModel: Model<ProcessLifeCycleApproachDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private readonly documentUploadNotification: ProductDocumentUploadNotificationHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.processLifeCycleApproachModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-life-cycle-approach] syncIndexes failed (check duplicates):',
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

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: 'lca_reports' | 'lca_implementation',
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  /**
   * Create process life cycle approach with file uploads.
   * DesiredState: independent keep lists per Assessment / Implementation subsection.
   */
  async createProcessLifeCycleApproach(
    createProcessLifeCycleApproachDto: CreateProcessLifeCycleApproachDto,
    vendorId: string,
    lifeCycleAssesmentReportsFiles?: Express.Multer.File[],
    lifeCycleImplementationDocumentsFiles?: Express.Multer.File[],
    existingAssessmentDocumentIds?: string[],
    existingImplementationDocumentIds?: string[],
  ): Promise<ProcessLifeCycleApproachDocument> {
    await assertVendorCanEditUrn(
      this.productModel,
      vendorId,
      createProcessLifeCycleApproachDto.urnNo,
    );
    const session = await this.connection.startSession();
    session.startTransaction();

    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const now = new Date();
      const existingLifeCycle = await this.processLifeCycleApproachModel
        .findOne({ urnNo: createProcessLifeCycleApproachDto.urnNo })
        .session(session);
      const processLifeCycleApproachId =
        existingLifeCycle?.processLifeCycleApproachId ??
        (await this.sequenceHelper.getProcessLifeCycleApproachId());
      const lcaReportsFiles = Array.isArray(lifeCycleAssesmentReportsFiles)
        ? lifeCycleAssesmentReportsFiles
        : [];
      const lcaImplementationFiles = Array.isArray(
        lifeCycleImplementationDocumentsFiles,
      )
        ? lifeCycleImplementationDocumentsFiles
        : [];

      const lcaReportsDisplayName =
        createProcessLifeCycleApproachDto.lifeCycleAssesmentReportsFileName?.trim() ||
        '';
      const lcaImplementationDisplayName =
        createProcessLifeCycleApproachDto.lifeCycleImplementationDocumentsFileName?.trim() ||
        '';

      const liveDocs = await this.allProductDocumentModel
        .find({
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          isDeleted: { $ne: true },
        })
        .session(session);

      const { assessment: assessmentLive, implementation: implementationLive } =
        partitionLcaLiveDocsBySubsection(liveDocs);

      const assessmentKeepRefs =
        existingAssessmentDocumentIds !== undefined
          ? resolveDesiredDocumentIdRefs(existingAssessmentDocumentIds)
          : null;
      const implementationKeepRefs =
        existingImplementationDocumentIds !== undefined
          ? resolveDesiredDocumentIdRefs(existingImplementationDocumentIds)
          : null;

      const assessmentSync = await softDeleteUnkeptCertificationDocuments({
        documentModel: this.allProductDocumentModel,
        versioning: this.documentVersioningService,
        urnNo: createProcessLifeCycleApproachDto.urnNo,
        sectionKey: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
        vendorObjectId,
        now,
        session,
        liveDocs: assessmentLive,
        keepRefs: assessmentKeepRefs,
      });
      const implementationSync = await softDeleteUnkeptCertificationDocuments({
        documentModel: this.allProductDocumentModel,
        versioning: this.documentVersioningService,
        urnNo: createProcessLifeCycleApproachDto.urnNo,
        sectionKey: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
        vendorObjectId,
        now,
        session,
        liveDocs: implementationLive,
        keepRefs: implementationKeepRefs,
      });
      oldFileLinksToDeleteAfterCommit = [
        ...assessmentSync.oldFileLinks,
        ...implementationSync.oldFileLinks,
      ];

      const retainIds = [
        ...assessmentSync.retainIds,
        ...implementationSync.retainIds,
      ];
      if (retainIds.length) {
        await this.allProductDocumentModel.updateMany(
          { _id: { $in: retainIds } },
          {
            $set: {
              formPrimaryId: processLifeCycleApproachId,
              updatedDate: now,
            },
          },
          { session },
        );
      }

      let lifeCycleAssesmentReports =
        assessmentSync.retainIds.length > 0 ? 1 : null;
      let lifeCycleImplementationDocuments =
        implementationSync.retainIds.length > 0 ? 1 : null;

      const lcaReportsFilePaths: string[] = [];
      const lcaReportsStoredNames: string[] = [];

      if (lcaReportsFiles.length > 0) {
        for (const lifeCycleAssesmentReportsFile of lcaReportsFiles) {
          const lcaReportsFilePath = await this.saveFileToUrnFolder(
            lifeCycleAssesmentReportsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_reports',
          );
          lcaReportsFilePaths.push(lcaReportsFilePath.fileUrl);
          lcaReportsStoredNames.push(lcaReportsFilePath.fileName);
          createdFileFullPaths.push(
            path.join('uploads', lcaReportsFilePath.fileUrl),
          );
        }
        lifeCycleAssesmentReports = 1;
      }

      const lcaImplementationFilePaths: string[] = [];
      const lcaImplementationStoredNames: string[] = [];

      if (lcaImplementationFiles.length > 0) {
        for (const lifeCycleImplementationDocumentsFile of lcaImplementationFiles) {
          const lcaImplementationFilePath = await this.saveFileToUrnFolder(
            lifeCycleImplementationDocumentsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_implementation',
          );
          lcaImplementationFilePaths.push(lcaImplementationFilePath.fileUrl);
          lcaImplementationStoredNames.push(lcaImplementationFilePath.fileName);
          createdFileFullPaths.push(
            path.join('uploads', lcaImplementationFilePath.fileUrl),
          );
        }
        lifeCycleImplementationDocuments = 1;
      }

      const processLifeCycleApproachData = {
        vendorId: vendorObjectId,
        urnNo: createProcessLifeCycleApproachDto.urnNo,
        lifeCycleAssesmentReports,
        lifeCycleImplementationDetails:
          createProcessLifeCycleApproachDto.lifeCycleImplementationDetails ||
          '',
        lifeCycleImplementationDocuments,
        processLifeCycleApproachStatus:
          createProcessLifeCycleApproachDto.processLifeCycleApproachStatus || 0,
        updatedDate: now,
      };
      const savedProcessLifeCycleApproach =
        await this.processLifeCycleApproachModel
          .findOneAndUpdate(
            { urnNo: createProcessLifeCycleApproachDto.urnNo },
            {
              $set: processLifeCycleApproachData,
              $setOnInsert: { processLifeCycleApproachId, createdDate: now },
            },
            { upsert: true, new: true, session },
          )
          .exec();

      const docsToInsert = [];
      for (let i = 0; i < lcaReportsFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          documentFormSubsection: LCA_ASSESSMENT_SUBSECTION,
          formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
          documentName: lcaReportsDisplayName || lcaReportsStoredNames[i],
          documentOriginalName: lcaReportsFiles[i].originalname,
          documentLink: lcaReportsFilePaths[i],
          createdDate: now,
          updatedDate: now,
        });
      }
      for (let i = 0; i < lcaImplementationFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          documentFormSubsection: LCA_IMPLEMENTATION_SUBSECTION,
          formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
          documentName:
            lcaImplementationDisplayName || lcaImplementationStoredNames[i],
          documentOriginalName: lcaImplementationFiles[i].originalname,
          documentLink: lcaImplementationFilePaths[i],
          createdDate: now,
          updatedDate: now,
        });
      }
      if (docsToInsert.length) {
        const isResubmitCycle = await isVendorResubmitCycle(
          this.productModel,
          createProcessLifeCycleApproachDto.urnNo,
          session,
        );
        const insertedDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs,
          isResubmitCycle,
          session,
          filesByIndex: [...lcaReportsFiles, ...lcaImplementationFiles],
        });
      }

      await session.commitTransaction();
      session.endSession();

      for (const link of oldFileLinksToDeleteAfterCommit) {
        try {
          await deleteUploadedFileByDocumentLink(link);
        } catch {
          // ignore
        }
      }

      if (docsToInsert.length > 0) {
        this.documentUploadNotification.notifyAfterDocumentsUploaded(
          vendorId,
          docsToInsert.length,
          createProcessLifeCycleApproachDto.urnNo,
        );
      }

      return savedProcessLifeCycleApproach;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      try {
        for (const fullPath of createdFileFullPaths) {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (cleanupError: any) {
        console.error(
          '[Process Life Cycle Approach] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Life Cycle Approach] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process life cycle approach record.',
      );
    }
  }
}
