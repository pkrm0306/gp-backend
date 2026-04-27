import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsAdditives,
  RawMaterialsAdditivesDocument,
} from './schemas/raw-materials-additives.schema';
import { CreateRawMaterialsAdditivesDto } from './dto/create-raw-materials-additives.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

type AdditivesProductDocumentRow = {
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
export class RawMaterialsAdditivesService {
  constructor(
    @InjectModel(RawMaterialsAdditives.name)
    private model: Model<RawMaterialsAdditivesDocument>,
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

  private toResponseUnit(row: Partial<RawMaterialsAdditives>) {
    return {
      rawMaterialsAdditivesId: row.rawMaterialsAdditivesId,
      unitName: row.unitName,
      year: row.year,
      year1: row.year1,
      year1a: row.year1a,
      year1b: row.year1b,
      year1c: row.year1c,
      year2: row.year2,
      year2a: row.year2a,
      year2b: row.year2b,
      year2c: row.year2c,
      year3: row.year3,
      year3a: row.year3a,
      year3b: row.year3b,
      year3c: row.year3c,
      psc: row.psc,
      coc: row.coc,
      percentcoc: row.percentcoc,
    };
  }

  private mapProductDocument(d: AllProductDocumentDocument): AdditivesProductDocumentRow {
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
    dto: CreateRawMaterialsAdditivesDto,
    vendorId: string,
    additivesFile?: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    vendorId: string;
    units: Array<{
      rawMaterialsAdditivesId: number;
      unitName: string;
      year?: number;
      year1: number;
      year1a: number;
      year1b: number;
      year1c: number;
      year2: number;
      year2a: number;
      year2b: number;
      year2c: number;
      year3: number;
      year3a: number;
      year3b: number;
      year3c: number;
      psc: string;
      coc: string;
      percentcoc: string;
    }>;
    documents: AdditivesProductDocumentRow[];
  }> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const now = new Date();
      const docsToCreate: Array<
        Omit<RawMaterialsAdditives, 'createdDate' | 'updatedDate'> & {
          createdDate: Date;
          updatedDate: Date;
        }
      > = [];

      for (const unit of dto.units) {
        const year1cValue = unit.year1c ?? 0;
        if (
          !unit?.unitName ||
          unit.year1 === undefined ||
          unit.year1a === undefined ||
          unit.year1b === undefined ||
          unit.year2 === undefined ||
          unit.year2a === undefined ||
          unit.year2b === undefined ||
          unit.year2c === undefined ||
          unit.year3 === undefined ||
          unit.year3a === undefined ||
          unit.year3b === undefined ||
          unit.year3c === undefined ||
          !unit.psc ||
          !unit.coc ||
          !unit.percentcoc
        ) {
          throw new BadRequestException(
            'Each unit must include unitName, year1/year1a/year1b, year2/year2a/year2b/year2c, year3/year3a/year3b/year3c, psc, coc, and percentcoc',
          );
        }

        const id = await this.sequenceHelper.getRawMaterialsAdditivesId();
        docsToCreate.push({
          rawMaterialsAdditivesId: id,
          urnNo,
          vendorId: vendorObjectId,
          unitName: unit.unitName.trim(),
          year: unit.year,
          year1: unit.year1,
          year1a: unit.year1a,
          year1b: unit.year1b,
          year1c: year1cValue,
          year2: unit.year2,
          year2a: unit.year2a,
          year2b: unit.year2b,
          year2c: unit.year2c,
          year3: unit.year3,
          year3a: unit.year3a,
          year3b: unit.year3b,
          year3c: unit.year3c,
          psc: unit.psc.trim(),
          coc: unit.coc.trim(),
          percentcoc: unit.percentcoc.trim(),
          createdDate: now,
          updatedDate: now,
        });
      }

      // Replace behavior: keep only the units coming in current request for this URN+vendor.
      await this.model.deleteMany({ urnNo, vendorId: vendorObjectId });
      const created = await this.model.insertMany(docsToCreate);
      const documents: AdditivesProductDocumentRow[] = [];

      if (additivesFile) {
        const storedRelativePath = this.saveFileToUrnFolder(
          additivesFile,
          urnNo,
          'additives_supporting_document',
        );
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const masterDoc = await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: created[0].rawMaterialsAdditivesId,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: additivesFile.originalname,
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
      console.error('[Raw Materials Additives] Create error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create raw materials additives record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const trimmedUrn = urnNo.trim();
      const rows = await this.model
        .find({ urnNo: trimmedUrn, vendorId: vendorObjectId })
        .sort({ rawMaterialsAdditivesId: 1 })
        .exec();

      const docRows = await this.allProductDocumentModel
        .find({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
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
      console.error('[Raw Materials Additives] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to list raw materials additives records.',
      );
    }
  }
}
