import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { CreateRawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesDto } from './dto/create-raw-materials-elimination-of-ozone-depleting-global-warming-substances.dto';

@Injectable()
export class RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
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

  private mapDoc(d: AllProductDocumentDocument) {
    const o = typeof d.toObject === 'function' ? d.toObject() : d;
    return {
      _id: o._id,
      productDocumentId: o.productDocumentId,
      vendorId: o.vendorId,
      urnNo: o.urnNo,
      eoiNo: o.eoiNo,
      documentForm: o.documentForm,
      documentFormSubsection: o.documentFormSubsection,
      formPrimaryId: o.formPrimaryId,
      documentName: o.documentName,
      documentOriginalName: o.documentOriginalName,
      documentLink: o.documentLink,
      createdDate: o.createdDate,
      updatedDate: o.updatedDate,
    };
  }

  async create(
    dto: CreateRawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesDto,
    vendorId: string,
    ozoneReportFile: Express.Multer.File,
  ) {
    try {
      if (!ozoneReportFile) {
        throw new BadRequestException('ozoneReportFile is required');
      }

      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const storedRelativePath = this.saveFileToUrnFolder(
        ozoneReportFile,
        urnNo,
        'ozone_depleting_global_warming_supporting_document',
      );
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const doc = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm:
          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId: productDocumentId,
        documentName: path.basename(storedRelativePath),
        documentOriginalName: ozoneReportFile.originalname,
        documentLink: `uploads/${storedRelativePath}`,
        createdDate: now,
        updatedDate: now,
      });

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        documents: [this.mapDoc(doc)],
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to upload ozone depleting/global warming document.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const rows = await this.allProductDocumentModel
        .find({
          urnNo: urnNo.trim(),
          vendorId: vendorObjectId,
          documentForm:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
          $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
        })
        .sort({ productDocumentId: -1 })
        .exec();

      return {
        urnNo: urnNo.trim(),
        vendorId: vendorObjectId.toString(),
        documents: rows.map((row) => this.mapDoc(row)),
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list ozone depleting/global warming documents.',
      );
    }
  }
}

