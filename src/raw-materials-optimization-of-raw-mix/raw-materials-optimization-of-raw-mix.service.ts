import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsOptimizationOfRawMix,
  RawMaterialsOptimizationOfRawMixDocument,
} from './schemas/raw-materials-optimization-of-raw-mix.schema';
import { CreateRawMaterialsOptimizationOfRawMixDto } from './dto/create-raw-materials-optimization-of-raw-mix.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

type RawMixProductDocumentRow = {
  _id: unknown;
  productDocumentId: number;
  vendorId: Types.ObjectId;
  urnNo: string;
  eoiNo?: string;
  documentForm: string;
  documentFormSubsection?: string;
  formPrimaryId: number;
  documentName: string;
  documentOriginalName: string;
  documentLink: string;
  createdDate: Date;
  updatedDate: Date;
};

@Injectable()
export class RawMaterialsOptimizationOfRawMixService {
  constructor(
    @InjectModel(RawMaterialsOptimizationOfRawMix.name)
    private model: Model<RawMaterialsOptimizationOfRawMixDocument>,
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

  private toResponseUnit(row: Partial<RawMaterialsOptimizationOfRawMix>) {
    return {
      rawMaterialsOptimizationOfRawMixId: row.rawMaterialsOptimizationOfRawMixId,
      unitName: row.unitName,
      year: row.year,
      yeardata1: row.yeardata1,
      yeardata2: row.yeardata2,
      yeardata3: row.yeardata3,
    };
  }

  private mapProductDocument(d: AllProductDocumentDocument): RawMixProductDocumentRow {
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
    dto: CreateRawMaterialsOptimizationOfRawMixDto,
    vendorId: string,
    optimizationOfRawMixFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<{
      rawMaterialsOptimizationOfRawMixId: number;
      unitName: string;
      year: number;
      yeardata1: number;
      yeardata2: number;
      yeardata3: number;
    }>;
    documents: RawMixProductDocumentRow[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const docsToCreate: Array<
        Omit<RawMaterialsOptimizationOfRawMix, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      for (const unit of dto.units) {
        if (
          !unit?.unitName ||
          unit.year === undefined ||
          unit.yeardata1 === undefined ||
          unit.yeardata2 === undefined ||
          unit.yeardata3 === undefined
        ) {
          throw new BadRequestException(
            'Each unit must include unitName, year, yeardata1, yeardata2, and yeardata3',
          );
        }

        const id = await this.sequenceHelper.getRawMaterialsOptimizationOfRawMixId();
        docsToCreate.push({
          rawMaterialsOptimizationOfRawMixId: id,
          urnNo,
          vendorId: vendorObjectId,
          unitName: unit.unitName.trim(),
          year: unit.year,
          yeardata1: unit.yeardata1,
          yeardata2: unit.yeardata2,
          yeardata3: unit.yeardata3,
          createdDate: now,
          updatedDate: now,
        });
      }

      // Replace behavior: keep only the units coming in current request for this URN+vendor.
      await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      const created = await this.model.insertMany(docsToCreate);
      const documents: RawMixProductDocumentRow[] = [];

      if (optimizationOfRawMixFile) {
        const storedRelativePath = this.saveFileToUrnFolder(
          optimizationOfRawMixFile,
          urnNo,
          'raw_mix_optimization_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const masterDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: created[0].rawMaterialsOptimizationOfRawMixId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: optimizationOfRawMixFile.originalname,
          documentLink: `uploads/${storedRelativePath}`,
          createdDate: now,
          updatedDate: now,
        });
        documents.push(this.mapProductDocument(masterDoc));
      }

      return {
        urnNo,
        vendorId: vendorObjectId.toString(),
        units: created.map((row) => this.toResponseUnit(row.toObject())),
        documents,
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Optimization Of Raw Mix] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials optimization of raw mix record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const trimmedUrn = urnNo.trim();
      const rows = await this.model
        .find({ urnNo: trimmedUrn, vendorId: vendorObjectId })
        .sort({ rawMaterialsOptimizationOfRawMixId: 1 })
        .exec();

      const docRows = await this.allProductDocumentModel
        .find({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
          $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
        })
        .sort({ productDocumentId: -1 })
        .exec();

      return {
        urnNo: trimmedUrn,
        vendorId: vendorObjectId.toString(),
        units: rows.map((row) => this.toResponseUnit(row.toObject())),
        documents: docRows.map((d) => this.mapProductDocument(d)),
      };
    } catch (error: any) {
      console.error(
        '[Raw Materials Optimization Of Raw Mix] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials optimization of raw mix records.',
      );
    }
  }
}
