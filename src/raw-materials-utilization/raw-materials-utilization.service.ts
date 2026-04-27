import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RawMaterialsUtilizationService {
  constructor(
    @InjectModel(RawMaterialsUtilization.name)
    private model: Model<RawMaterialsUtilizationDocument>,
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

  private ensureUrnFolder(urnNo: string): string {
    const urnFolderPath = path.join('uploads', 'urns', urnNo);
    if (!fs.existsSync(urnFolderPath)) {
      fs.mkdirSync(urnFolderPath, { recursive: true });
    }
    return urnFolderPath;
  }

  private saveFileToUrnFolder(file: Express.Multer.File, urnNo: string, fileType: string): string {
    const urnFolderPath = this.ensureUrnFolder(urnNo);
    const fileExt = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const fileName = `${fileType}-${timestamp}-${randomSuffix}${fileExt}`;
    const filePath = path.join(urnFolderPath, fileName);

    if (file.path && fs.existsSync(file.path)) {
      fs.copyFileSync(file.path, filePath);
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore temp-file cleanup failures
      }
    } else if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } else {
      throw new BadRequestException('File data not available');
    }

    return path.join('urns', urnNo, fileName).replace(/\\/g, '/');
  }

  async create(
    dto: CreateRawMaterialsUtilizationDto,
    vendorId: string,
    utilizationFile?: Express.Multer.File,
  ): Promise<RawMaterialsUtilizationDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsUtilizationId();
      const now = new Date();
      const urnNo = dto.urnNo.trim();

      const doc = new this.model({
        rawMaterialsUtilizationId: id,
        urnNo,
        vendorId: vendorObjectId,
        details: dto.details?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (utilizationFile) {
        const storedRelativePath = this.saveFileToUrnFolder(
          utilizationFile,
          urnNo,
          'raw_materials_utilization_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: id,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: utilizationFile.originalname,
          documentLink: `uploads/${storedRelativePath}`,
          createdDate: now,
          updatedDate: now,
        });
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
