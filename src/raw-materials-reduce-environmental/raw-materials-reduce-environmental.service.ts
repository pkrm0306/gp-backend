import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsReduceEnvironmental,
  RawMaterialsReduceEnvironmentalDocument,
} from './schemas/raw-materials-reduce-environmental.schema';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

type ReduceEnvironmentalUnitInput = {
  location: string;
  enhancementOfMinesLife: string;
  topsoilConservation: string;
  waterTableManagement: string;
  restorationOfSpentMines: string;
  greenBeltDevelopmentAndBioDiversity: string;
};

@Injectable()
export class RawMaterialsReduceEnvironmentalService {
  constructor(
    @InjectModel(RawMaterialsReduceEnvironmental.name)
    private model: Model<RawMaterialsReduceEnvironmentalDocument>,
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

  private unitSignature(unit: ReduceEnvironmentalUnitInput): string {
    return [
      unit.location.trim(),
      unit.enhancementOfMinesLife.trim(),
      unit.topsoilConservation.trim(),
      unit.waterTableManagement.trim(),
      unit.restorationOfSpentMines.trim(),
      unit.greenBeltDevelopmentAndBioDiversity.trim(),
    ].join('|');
  }

  async create(
    dto: CreateRawMaterialsReduceEnvironmentalDto,
    vendorId: string,
    reduceEnvironmentalFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: RawMaterialsReduceEnvironmentalDocument[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();

      const unitsPayload: ReduceEnvironmentalUnitInput[] = Array.isArray(dto.units)
        ? dto.units
        : [
            {
              location: dto.location?.trim() || '',
              enhancementOfMinesLife: dto.enhancementOfMinesLife?.trim() || '',
              topsoilConservation: dto.topsoilConservation?.trim() || '',
              waterTableManagement: dto.waterTableManagement?.trim() || '',
              restorationOfSpentMines: dto.restorationOfSpentMines?.trim() || '',
              greenBeltDevelopmentAndBioDiversity:
                dto.greenBeltDevelopmentAndBioDiversity?.trim() || '',
            },
          ];

      if (unitsPayload.length === 0) {
        throw new BadRequestException('units must be a non-empty array');
      }
      for (const unit of unitsPayload) {
        if (
          !unit.location ||
          !unit.enhancementOfMinesLife ||
          !unit.topsoilConservation ||
          !unit.waterTableManagement ||
          !unit.restorationOfSpentMines ||
          !unit.greenBeltDevelopmentAndBioDiversity
        ) {
          throw new BadRequestException(
            'Each unit must include location, enhancementOfMinesLife, topsoilConservation, waterTableManagement, restorationOfSpentMines and greenBeltDevelopmentAndBioDiversity',
          );
        }
      }

      const existingRows = await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ rawMaterialsReduceEnvironmentalId: 1 })
        .exec();

      const existingBySignature = new Map<string, RawMaterialsReduceEnvironmentalDocument>();
      for (const row of existingRows) {
        const signature = this.unitSignature({
          location: row.location,
          enhancementOfMinesLife: row.enhancementOfMinesLife,
          topsoilConservation: row.topsoilConservation,
          waterTableManagement: row.waterTableManagement,
          restorationOfSpentMines: row.restorationOfSpentMines,
          greenBeltDevelopmentAndBioDiversity: row.greenBeltDevelopmentAndBioDiversity,
        });
        if (!existingBySignature.has(signature)) {
          existingBySignature.set(signature, row);
        }
      }

      const rowsToInsert: Array<
        Omit<RawMaterialsReduceEnvironmental, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];
      const requestSeenSignatures = new Set<string>();
      for (const unit of unitsPayload) {
        const signature = this.unitSignature(unit);

        // Prevent duplicate rows both against DB and within current payload.
        if (requestSeenSignatures.has(signature) || existingBySignature.has(signature)) {
          continue;
        }
        requestSeenSignatures.add(signature);

        const generatedId = await this.sequenceHelper.getRawMaterialsReduceEnvironmentalId();
        rowsToInsert.push({
          rawMaterialsReduceEnvironmentalId: generatedId,
          urnNo,
          vendorId: vendorObjectId,
          location: unit.location.trim(),
          enhancementOfMinesLife: unit.enhancementOfMinesLife.trim(),
          topsoilConservation: unit.topsoilConservation.trim(),
          waterTableManagement: unit.waterTableManagement.trim(),
          restorationOfSpentMines: unit.restorationOfSpentMines.trim(),
          greenBeltDevelopmentAndBioDiversity:
            unit.greenBeltDevelopmentAndBioDiversity.trim(),
          createdDate: now,
          updatedDate: now,
        });
      }
      const createdRows =
        rowsToInsert.length > 0 ? await this.model.insertMany(rowsToInsert) : [];

      const allRows = await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ rawMaterialsReduceEnvironmentalId: 1 })
        .exec();

      if (reduceEnvironmentalFile) {
        await this.allProductDocumentModel.updateMany(
          {
            urnNo,
            vendorId: vendorObjectId,
            documentForm: {
              $in: [
                DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
                DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
              ],
            },
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

        const storedRelativePath = this.saveFileToUrnFolder(
          reduceEnvironmentalFile,
          urnNo,
          'reduce_environmental_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId:
            createdRows[0]?.rawMaterialsReduceEnvironmentalId ||
            allRows[0]?.rawMaterialsReduceEnvironmentalId ||
            0,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: reduceEnvironmentalFile.originalname,
          documentLink: `uploads/${storedRelativePath}`,
          createdDate: now,
          updatedDate: now,
        });
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: allRows,
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Reduce Environmental] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials reduce environmental record.',
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
      console.error('[Raw Materials Reduce Environmental] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials reduce environmental records.',
      );
    }
  }
}
