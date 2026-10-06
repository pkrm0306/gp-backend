import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessProductStewardship,
  ProcessProductStewardshipDocument,
} from './schemas/process-product-stewardship.schema';
import {
  ProcessPsStakeholderEduAwarness,
  ProcessPsStakeholderEduAwarnessDocument,
} from './schemas/process-ps-stakeholder-edu-awarness.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessProductStewardshipDto } from './dto/create-process-product-stewardship.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { ProductDocumentUploadNotificationHelper } from '../notifications/helpers/product-document-upload-notification.helper';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import {
  isVendorResubmitCycle,
  trackInsertedCertificationDocuments,
} from '../documents/helpers/certification-document-version.util';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';
import { ProductStewardshipProgrammeDetailDto } from './dto/create-process-product-stewardship.dto';
import {
  resolveDesiredDocumentIdRefs,
  softDeleteUnkeptCertificationDocuments,
} from '../documents/helpers/desired-document-state.apply';

const SEA_SUBSECTION = 'sea_supporting_documents';
const QM_SUBSECTION = 'qm_supporting_documents';
const EPR_SUBSECTION = 'epr_supporting_documents';

@Injectable()
export class ProcessProductStewardshipService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessProductStewardship.name)
    private processProductStewardshipModel: Model<ProcessProductStewardshipDocument>,
    @InjectModel(ProcessPsStakeholderEduAwarness.name)
    private processPsStakeholderEduAwarnessModel: Model<ProcessPsStakeholderEduAwarnessDocument>,
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
      await this.processProductStewardshipModel.syncIndexes();
      await this.processPsStakeholderEduAwarnessModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-product-stewardship] syncIndexes failed (check duplicates):',
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
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  private normalizeProgrammeRows(
    rows?: ProductStewardshipProgrammeDetailDto[],
  ): Array<{ seaProgramDetails: string; seaNoOfPrograms: string }> {
    if (!Array.isArray(rows)) {
      return [];
    }
    const normalized = rows
      .map((row) => ({
        seaProgramDetails: String(row?.programmeDetails ?? '').trim(),
        seaNoOfPrograms: String(row?.numberOfPrograms ?? '').trim(),
      }))
      .filter((row) => row.seaProgramDetails !== '' || row.seaNoOfPrograms !== '');

    const seen = new Set<string>();
    const unique: typeof normalized = [];
    for (const row of normalized) {
      const key = `${row.seaProgramDetails.toLowerCase()}__${row.seaNoOfPrograms.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(row);
    }
    return unique;
  }

  /**
   * Create process product stewardship with file uploads.
   * DesiredState keep lists are independent per SEA / QM / EPR document slot.
   * Programme-row soft-delete + insertMany remains replace-all (not DesiredState).
   */
  async createProcessProductStewardship(
    createProcessProductStewardshipDto: CreateProcessProductStewardshipDto,
    vendorId: string,
    seaSupportingDocumentsFiles?: Express.Multer.File[],
    qmSupportingDocumentsFiles?: Express.Multer.File[],
    eprSupportingDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessProductStewardshipDocument> {
    await assertVendorCanEditUrn(
      this.productModel,
      vendorId,
      createProcessProductStewardshipDto.urnNo,
    );
    const session = await this.connection.startSession();
    session.startTransaction();

    // Track new and replaced files for cleanup
    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingStewardship = await this.processProductStewardshipModel
        .findOne({
          urnNo: createProcessProductStewardshipDto.urnNo,
        })
        .session(session);
      const processProductStewardshipId =
        existingStewardship?.processProductStewardshipId ??
        (await this.sequenceHelper.getProcessProductStewardshipId());

      const seaFiles = Array.isArray(seaSupportingDocumentsFiles)
        ? seaSupportingDocumentsFiles
        : [];
      const qmFiles = Array.isArray(qmSupportingDocumentsFiles)
        ? qmSupportingDocumentsFiles
        : [];
      const eprFiles = Array.isArray(eprSupportingDocumentsFiles)
        ? eprSupportingDocumentsFiles
        : [];

      const seaDisplayName =
        createProcessProductStewardshipDto.seaSupportingDocumentsFileName?.trim() ||
        '';
      const qmDisplayName =
        createProcessProductStewardshipDto.qmSupportingDocumentsFileName?.trim() ||
        '';
      const eprDisplayName =
        createProcessProductStewardshipDto.eprSupportingDocumentsFileName?.trim() ||
        '';

      const liveDocs = await this.allProductDocumentModel
        .find({
          vendorId: vendorObjectId,
          urnNo: createProcessProductStewardshipDto.urnNo,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        })
        .session(session);

      const seaLive = liveDocs.filter(
        (d) => String(d.documentFormSubsection ?? '') === SEA_SUBSECTION,
      );
      const qmLive = liveDocs.filter(
        (d) => String(d.documentFormSubsection ?? '') === QM_SUBSECTION,
      );
      const eprLive = liveDocs.filter(
        (d) => String(d.documentFormSubsection ?? '') === EPR_SUBSECTION,
      );

      const { existingSeaDocumentIds, existingQmDocumentIds, existingEprDocumentIds } =
        createProcessProductStewardshipDto;

      const seaKeepRefs =
        existingSeaDocumentIds !== undefined
          ? resolveDesiredDocumentIdRefs(existingSeaDocumentIds)
          : null;
      const qmKeepRefs =
        existingQmDocumentIds !== undefined
          ? resolveDesiredDocumentIdRefs(existingQmDocumentIds)
          : null;
      const eprKeepRefs =
        existingEprDocumentIds !== undefined
          ? resolveDesiredDocumentIdRefs(existingEprDocumentIds)
          : null;

      const seaSync = await softDeleteUnkeptCertificationDocuments({
        documentModel: this.allProductDocumentModel,
        versioning: this.documentVersioningService,
        urnNo: createProcessProductStewardshipDto.urnNo,
        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
        vendorObjectId,
        now,
        session,
        liveDocs: seaLive,
        keepRefs: seaKeepRefs,
      });
      const qmSync = await softDeleteUnkeptCertificationDocuments({
        documentModel: this.allProductDocumentModel,
        versioning: this.documentVersioningService,
        urnNo: createProcessProductStewardshipDto.urnNo,
        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
        vendorObjectId,
        now,
        session,
        liveDocs: qmLive,
        keepRefs: qmKeepRefs,
      });
      const eprSync = await softDeleteUnkeptCertificationDocuments({
        documentModel: this.allProductDocumentModel,
        versioning: this.documentVersioningService,
        urnNo: createProcessProductStewardshipDto.urnNo,
        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
        vendorObjectId,
        now,
        session,
        liveDocs: eprLive,
        keepRefs: eprKeepRefs,
      });

      oldFileLinksToDeleteAfterCommit = [
        ...seaSync.oldFileLinks,
        ...qmSync.oldFileLinks,
        ...eprSync.oldFileLinks,
      ];

      const allRetainIds = [
        ...seaSync.retainIds,
        ...qmSync.retainIds,
        ...eprSync.retainIds,
      ];
      if (allRetainIds.length) {
        await this.allProductDocumentModel.updateMany(
          { _id: { $in: allRetainIds } },
          {
            $set: {
              formPrimaryId: processProductStewardshipId,
              updatedDate: now,
            },
          },
          { session },
        );
      }

      // DesiredState flags: retained live docs + new uploads per slot only.
      let seaSupportingDocuments: number | null =
        seaSync.retainIds.length > 0 ? 1 : null;
      let qmSupportingDocuments: number | null =
        qmSync.retainIds.length > 0 ? 1 : null;
      let eprSupportingDocuments: number | null =
        eprSync.retainIds.length > 0 ? 1 : null;

      const seaFilePaths: string[] = [];
      const seaStoredNames: string[] = [];
      if (seaFiles.length > 0) {
        for (const seaSupportingDocumentsFile of seaFiles) {
          const uploaded = await this.saveFileToUrnFolder(
            seaSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
          );
          seaFilePaths.push(uploaded.fileUrl);
          seaStoredNames.push(uploaded.fileName);
          createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
        }
        seaSupportingDocuments = 1;
      }

      const qmFilePaths: string[] = [];
      const qmStoredNames: string[] = [];
      if (qmFiles.length > 0) {
        for (const qmSupportingDocumentsFile of qmFiles) {
          const uploaded = await this.saveFileToUrnFolder(
            qmSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
          );
          qmFilePaths.push(uploaded.fileUrl);
          qmStoredNames.push(uploaded.fileName);
          createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
        }
        qmSupportingDocuments = 1;
      }

      const eprFilePaths: string[] = [];
      const eprStoredNames: string[] = [];
      if (eprFiles.length > 0) {
        for (const eprSupportingDocumentsFile of eprFiles) {
          const uploaded = await this.saveFileToUrnFolder(
            eprSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
          );
          eprFilePaths.push(uploaded.fileUrl);
          eprStoredNames.push(uploaded.fileName);
          createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
        }
        eprSupportingDocuments = 1;
      }

      const isResubmitCycle = await isVendorResubmitCycle(
        this.productModel,
        createProcessProductStewardshipDto.urnNo,
        session,
      );

      const processProductStewardshipData = {
        vendorId: vendorObjectId,
        urnNo: createProcessProductStewardshipDto.urnNo,
        seaSupportingDocuments,
        qualityManagementDetails:
          createProcessProductStewardshipDto.qualityManagementDetails || '',
        qmSupportingDocuments,
        eprImplementedDetails:
          createProcessProductStewardshipDto.eprImplementedDetails || '',
        eprGreenPackagingDetails:
          createProcessProductStewardshipDto.eprGreenPackagingDetails || '',
        eprSupportingDocuments,
        productStewardshipStatus:
          createProcessProductStewardshipDto.productStewardshipStatus || 0,
        updatedDate: now,
      };

      const savedProcessProductStewardship =
        await this.processProductStewardshipModel
          .findOneAndUpdate(
            { urnNo: createProcessProductStewardshipDto.urnNo },
            {
              $set: processProductStewardshipData,
              $setOnInsert: {
                processProductStewardshipId,
                createdDate: now,
              },
            },
            { upsert: true, new: true, session },
          )
          .exec();

      // Programme rows: soft-delete + insertMany replace (NOT DesiredState).
      if (createProcessProductStewardshipDto.programmeDetails !== undefined) {
        const normalizedProgrammeRows = this.normalizeProgrammeRows(
          createProcessProductStewardshipDto.programmeDetails,
        );

        await this.processPsStakeholderEduAwarnessModel.updateMany(
          {
            urnNo: createProcessProductStewardshipDto.urnNo,
            vendorId: vendorObjectId,
            isDeleted: { $ne: true },
          },
          {
            $set: {
              isDeleted: true,
              updatedDate: now,
            },
          },
          { session },
        );

        if (normalizedProgrammeRows.length > 0) {
          const rowsToInsert = normalizedProgrammeRows.map((row) => ({
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            processProductStewardshipId: savedProcessProductStewardship._id,
            seaProgramDetails: row.seaProgramDetails,
            seaNoOfPrograms: row.seaNoOfPrograms,
            seaSupportingDocuments,
            productStewardshipStatus:
              createProcessProductStewardshipDto.productStewardshipStatus || 0,
            createdDate: now,
            updatedDate: now,
            isDeleted: false,
          }));
          await this.processPsStakeholderEduAwarnessModel.insertMany(
            rowsToInsert,
            { session },
          );
        }
      }

      // Insert uploaded documents into all_product_documents (master table)
      if (seaFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < seaFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: SEA_SUBSECTION,
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: seaDisplayName || seaStoredNames[i],
            documentOriginalName: seaFiles[i].originalname,
            documentLink: seaFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        const insertedSeaDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessProductStewardshipDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs: insertedSeaDocs,
          isResubmitCycle,
          session,
          filesByIndex: seaFiles,
        });
      }

      if (qmFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < qmFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: QM_SUBSECTION,
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: qmDisplayName || qmStoredNames[i],
            documentOriginalName: qmFiles[i].originalname,
            documentLink: qmFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        const insertedQmDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessProductStewardshipDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs: insertedQmDocs,
          isResubmitCycle,
          session,
          filesByIndex: qmFiles,
        });
      }

      if (eprFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < eprFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: EPR_SUBSECTION,
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: eprDisplayName || eprStoredNames[i],
            documentOriginalName: eprFiles[i].originalname,
            documentLink: eprFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        const insertedEprDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessProductStewardshipDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs: insertedEprDocs,
          isResubmitCycle,
          session,
          filesByIndex: eprFiles,
        });
      }

      await session.commitTransaction();
      session.endSession();

      const uploadedDocumentCount =
        seaFilePaths.length + qmFilePaths.length + eprFilePaths.length;
      this.documentUploadNotification.notifyAfterDocumentsUploaded(
        vendorId,
        uploadedDocumentCount,
        createProcessProductStewardshipDto.urnNo,
      );

      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        const normalizedPath = String(fileLink).replace(/\\/g, '/');
        if (normalizedPath && fs.existsSync(normalizedPath)) {
          try {
            fs.unlinkSync(normalizedPath);
          } catch {
            // Ignore cleanup issues after successful commit
          }
        }
      }

      return savedProcessProductStewardship;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        for (const fullPath of createdFileFullPaths) {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (cleanupError: any) {
        console.error(
          '[Process Product Stewardship] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Product Stewardship] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process product stewardship record.',
      );
    }
  }
}
