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
  RawMaterialsUtilization,
  RawMaterialsUtilizationDocument,
} from './schemas/raw-materials-utilization.schema';
import { CreateRawMaterialsUtilizationDto } from './dto/create-raw-materials-utilization.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as path from 'path';
import { deleteUploadedFileByDocumentLink, uploadFile } from '../utils/upload-file.util';
import { softDeleteUnkeptRawMaterialsSupportingDocuments } from '../common/raw-materials/raw-materials-desired-document-sync.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

@Injectable()
export class RawMaterialsUtilizationService {
  constructor(
    @InjectModel(RawMaterialsUtilization.name)
    private model: Model<RawMaterialsUtilizationDocument>,
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
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  async create(
    dto: CreateRawMaterialsUtilizationDto,
    vendorId: string,
    options?: {
      uploadFiles?: Express.Multer.File[];
      existingDocumentIds?: string[];
      utilizationFile?: Express.Multer.File;
    },
  ): Promise<RawMaterialsUtilizationDocument | null> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const uploadFiles =
        options?.uploadFiles ??
        (options?.utilizationFile ? [options.utilizationFile] : []);
      const now = new Date();
      const details = dto.details?.trim() || '';
      const hasText = hasAnyTrimmedText(details);

      let formPrimaryId = 0;
      let saved: RawMaterialsUtilizationDocument | null = null;

      if (hasText) {
        const id = await this.sequenceHelper.getRawMaterialsUtilizationId();
        formPrimaryId = id;
        saved = await replaceSingleRecordForUrn(
          this.model,
          urnNo,
          vendorObjectId,
          {
            rawMaterialsUtilizationId: id,
            urnNo,
            vendorId: vendorObjectId,
            details,
            createdDate: now,
            updatedDate: now,
          },
        );
      } else {
        await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      }

      if (uploadFiles.length > 0 || options?.existingDocumentIds !== undefined) {
        const sync = await softDeleteUnkeptRawMaterialsSupportingDocuments({
          documentModel: this.allProductDocumentModel,
          versioning: this.documentVersioningService,
          urnNo,
          vendorObjectId,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
          documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
          existingDocumentIds: options?.existingDocumentIds,
          now,
        });
        for (let i = 0; i < uploadFiles.length; i++) {
          const file = uploadFiles[i];
          const storedRelativePath = await this.saveFileToUrnFolder(
            file,
            urnNo,
          );
          const productDocumentId = await this.sequenceHelper.getProductDocumentId();
          const createdDoc = await this.allProductDocumentModel.create({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
            documentFormSubsection: 'supporting_documents',
            formPrimaryId: i === 0 ? (formPrimaryId || productDocumentId) : productDocumentId,
            documentName: path.basename(storedRelativePath),
            documentOriginalName: file.originalname,
            documentLink: storedRelativePath,
            createdDate: now,
            updatedDate: now,
          });
          await trackCertificationDocumentAfterCreate({
            productModel: this.productModel,
            versioning: this.documentVersioningService,
            documentModel: this.allProductDocumentModel,
            urnNo,
            sectionKey: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
            userId: vendorObjectId,
            vendorId: vendorObjectId,
            doc: createdDoc,
            file,
          });
        }
        for (const link of sync.oldFileLinks) {
          try {
            await deleteUploadedFileByDocumentLink(link);
          } catch {
            // ignore
          }
        }
      }

      return saved;
    } catch (error: any) {
      console.error('[Raw Materials Utilization] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials utilization record.',
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
        documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
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
      console.error('[Raw Materials Utilization] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials utilization records.',
      );
    }
  }
}
