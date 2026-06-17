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
  RawMaterialsGreenSupply,
  RawMaterialsGreenSupplyDocument,
} from './schemas/raw-materials-green-supply.schema';
import { CreateRawMaterialsGreenSupplyDto } from './dto/create-raw-materials-green-supply.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

@Injectable()
export class RawMaterialsGreenSupplyService {
  constructor(
    @InjectModel(RawMaterialsGreenSupply.name)
    private model: Model<RawMaterialsGreenSupplyDocument>,
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
    dto: CreateRawMaterialsGreenSupplyDto,
    vendorId: string,
    greenSupplyFile?: Express.Multer.File,
  ): Promise<RawMaterialsGreenSupplyDocument | null> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const awarenessAndEducation = dto.awarenessAndEducation?.trim() || '';
      const measuresImplemented = dto.measuresImplemented?.trim() || '';
      const hasText = hasAnyTrimmedText(awarenessAndEducation, measuresImplemented);

      let formPrimaryId = 0;
      let saved: RawMaterialsGreenSupplyDocument | null = null;

      if (hasText) {
        const id = await this.sequenceHelper.getRawMaterialsGreenSupplyId();
        formPrimaryId = id;
        saved = await replaceSingleRecordForUrn(
          this.model,
          urnNo,
          vendorObjectId,
          {
            rawMaterialsGreenSupplyId: id,
            urnNo,
            vendorId: vendorObjectId,
            awarenessAndEducation,
            measuresImplemented,
            createdDate: now,
            updatedDate: now,
          },
        );
      } else {
        await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      }

      if (greenSupplyFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          greenSupplyFile,
          urnNo,
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const createdDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: formPrimaryId || productDocumentId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: greenSupplyFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
        await trackCertificationDocumentAfterCreate({
          productModel: this.productModel,
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: createdDoc,
          file: greenSupplyFile,
        });
      }

      return saved;
    } catch (error: any) {
      console.error('[Raw Materials Green Supply] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials green supply record.',
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
        documentForm: DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
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
      console.error('[Raw Materials Green Supply] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials green supply records.',
      );
    }
  }
}
