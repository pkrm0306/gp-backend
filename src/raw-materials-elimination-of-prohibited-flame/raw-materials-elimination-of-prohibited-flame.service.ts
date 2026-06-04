import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { hasAnyTrimmedText } from '../common/raw-materials/raw-materials-upload.util';
import { replaceSingleRecordForUrn } from '../common/raw-materials/raw-materials-single-record-replace.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlame,
  RawMaterialsEliminationOfProhibitedFlameDocument,
} from './schemas/raw-materials-elimination-of-prohibited-flame.schema';
import { CreateRawMaterialsEliminationOfProhibitedFlameDto } from './dto/create-raw-materials-elimination-of-prohibited-flame.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  trackProductDocumentDeleteBatch,
  trackUploadedProductDocument,
} from '../documents/helpers/product-document-version.integration';

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlame.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameDocument>,
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

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  async create(
    dto: CreateRawMaterialsEliminationOfProhibitedFlameDto,
    vendorId: string,
    prohibitedFlameFile?: Express.Multer.File,
  ): Promise<RawMaterialsEliminationOfProhibitedFlameDocument | null> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const measuresImplemented = dto.measuresImplemented?.trim() || '';
      const hasText = hasAnyTrimmedText(measuresImplemented);

      let formPrimaryId = 0;
      let saved: RawMaterialsEliminationOfProhibitedFlameDocument | null = null;

      if (hasText) {
        const id =
          await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameId();
        formPrimaryId = id;
        saved = await replaceSingleRecordForUrn(
          this.model,
          urnNo,
          vendorObjectId,
          {
            rawMaterialsEliminationOfProhibitedFlameId: id,
            urnNo,
            vendorId: vendorObjectId,
            measuresImplemented,
            createdDate: now,
            updatedDate: now,
          },
        );
      } else {
        await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      }

      if (prohibitedFlameFile) {
        const existingDocs = await this.allProductDocumentModel.find({
          vendorId: vendorObjectId,
          urnNo,
          documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
          isDeleted: { $ne: true },
        });
        await this.allProductDocumentModel.updateMany(
          {
            vendorId: vendorObjectId,
            urnNo,
            documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
            isDeleted: { $ne: true },
          },
          {
            $set: {
              isDeleted: true,
              deletedAt: now,
              deletedBy: vendorObjectId,
              updatedDate: now,
            },
          },
        );
        if (existingDocs.length) {
          await trackProductDocumentDeleteBatch({
            versioning: this.documentVersioningService,
            urnNo,
            sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
            userId: vendorObjectId,
            docs: existingDocs,
            slotKeyMode: 'subsection',
          });
        }
        const storedRelativePath = await this.saveFileToUrnFolder(
          prohibitedFlameFile,
          urnNo,
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const createdDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: formPrimaryId || productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: prohibitedFlameFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
        await trackUploadedProductDocument(this.documentVersioningService, {
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
          subsectionKey: 'supporting_documents',
          userId: vendorObjectId,
          documentId: createdDoc._id,
          productDocumentId,
          filePath: storedRelativePath,
          originalName: prohibitedFlameFile.originalname,
          storedName: path.basename(storedRelativePath),
          file: prohibitedFlameFile,
          action: 'replaced',
          slotKeyMode: 'subsection',
        });
      }

      return saved;
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Prohibited Flame] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of prohibited flame record.',
      );
    }
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    if (!Types.ObjectId.isValid(vendorId)) {
      return 0;
    }
    const count = await this.model
      .countDocuments({
        urnNo: urnNo.trim(),
        vendorId: new Types.ObjectId(vendorId),
      })
      .exec();
    if (count > 0) {
      return count;
    }
    return this.allProductDocumentModel
      .countDocuments({
        urnNo: urnNo.trim(),
        vendorId: new Types.ObjectId(vendorId),
        documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
        isDeleted: { $ne: true },
      })
      .exec();
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
        '[Raw Materials Elimination Of Prohibited Flame] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of prohibited flame records.',
      );
    }
  }
}
