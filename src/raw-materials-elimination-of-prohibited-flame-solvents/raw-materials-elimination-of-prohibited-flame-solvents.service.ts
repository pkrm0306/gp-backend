import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RawMaterialsEliminationOfProhibitedFlameSolventsService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfProhibitedFlameSolvents.name)
    private model: Model<RawMaterialsEliminationOfProhibitedFlameSolventsDocument>,
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
    dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto,
    vendorId: string,
    prohibitedFlameSolventsFile?: Express.Multer.File,
  ): Promise<RawMaterialsEliminationOfProhibitedFlameSolventsDocument> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameSolventsId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationOfProhibitedFlameSolventsId: id,
        urnNo: dto.urnNo.trim(),
        vendorId: vendorObjectId,
        details: dto.details?.trim() || '',
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (prohibitedFlameSolventsFile) {
        const storedRelativePath = this.saveFileToUrnFolder(
          prohibitedFlameSolventsFile,
          dto.urnNo.trim(),
          'prohibited_flame_solvents_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: dto.urnNo.trim(),
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: id,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: prohibitedFlameSolventsFile.originalname,
          documentLink: `uploads/${storedRelativePath}`,
          createdDate: now,
          updatedDate: now,
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
