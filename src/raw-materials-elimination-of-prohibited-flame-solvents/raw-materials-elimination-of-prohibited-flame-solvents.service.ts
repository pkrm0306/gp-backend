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
  RawMaterialsEliminationOfProhibitedFlameSolvents,
  RawMaterialsEliminationOfProhibitedFlameSolventsDocument,
} from './schemas/raw-materials-elimination-of-prohibited-flame-solvents.schema';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameSolventsService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlameSolvents.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameSolventsDocument>,
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
    dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto,
    vendorId: string,
    prohibitedFlameSolventsFile?: Express.Multer.File,
  ): Promise<RawMaterialsEliminationOfProhibitedFlameSolventsDocument | null> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const details = dto.details?.trim() || '';
      const hasText = hasAnyTrimmedText(details);

      let formPrimaryId = 0;
      let saved: RawMaterialsEliminationOfProhibitedFlameSolventsDocument | null =
        null;

      if (hasText) {
        const id =
          await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsId();
        formPrimaryId = id;
        saved = await replaceSingleRecordForUrn(
          this.model,
          urnNo,
          vendorObjectId,
          {
            rawMaterialsEliminationOfProhibitedFlameSolventsId: id,
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

      if (prohibitedFlameSolventsFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          prohibitedFlameSolventsFile,
          urnNo,
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const createdDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: formPrimaryId || productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: prohibitedFlameSolventsFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
        await trackCertificationDocumentAfterCreate({
          productModel: this.productModel,
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo,
          sectionKey:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: createdDoc,
          file: prohibitedFlameSolventsFile,
        });
      }

      return saved;
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Prohibited Flame Solvents] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of prohibited flame solvents record.',
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
        documentForm:
          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
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
        '[Raw Materials Elimination Of Prohibited Flame Solvents] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of prohibited flame solvents records.',
      );
    }
  }
}
