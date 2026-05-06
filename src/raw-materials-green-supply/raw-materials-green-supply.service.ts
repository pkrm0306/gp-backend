import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class RawMaterialsGreenSupplyService {
  constructor(
    @InjectModel(RawMaterialsGreenSupply.name)
    private model: Model<RawMaterialsGreenSupplyDocument>,
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
    fileType: string,
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  async create(
    dto: CreateRawMaterialsGreenSupplyDto,
    vendorId: string,
    greenSupplyFile?: Express.Multer.File,
  ): Promise<RawMaterialsGreenSupplyDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsGreenSupplyId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsGreenSupplyId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        awarenessAndEducation: dto.awarenessAndEducation?.trim() || '',
        measuresImplemented: dto.measuresImplemented?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (greenSupplyFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          greenSupplyFile,
          dto.urnNo.trim(),
          'green_supply_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: dto.urnNo.trim(),
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: id,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: greenSupplyFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
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
