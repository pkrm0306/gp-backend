import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsEliminationOfFormaldehyde,
  RawMaterialsEliminationOfFormaldehydeDocument,
} from './schemas/raw-materials-elimination-of-formaldehyde.schema';
import { CreateRawMaterialsEliminationOfFormaldehydeDto } from './dto/create-raw-materials-elimination-of-formaldehyde.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  countMeaningfulRawMaterialsProductRows,
  filterFormaldehydeStyleProductsForVendorDisplay,
} from '../common/raw-materials/raw-materials-hazardous-display.util';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class RawMaterialsEliminationOfFormaldehydeService {
  constructor(
    @InjectModel(RawMaterialsEliminationOfFormaldehyde.name)
    private model: Model<RawMaterialsEliminationOfFormaldehydeDocument>,
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
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  /** File-only: documents only — no formaldehyde product row. */
  private async saveDocumentOnly(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const now = new Date();
    const storedRelativePath = await this.saveFileToUrnFolder(file, urnNo);
    const productDocumentId = await this.sequenceHelper.getProductDocumentId();
    const doc = await this.allProductDocumentModel.create({
      productDocumentId,
      vendorId: vendorObjectId,
      urnNo,
      eoiNo: '',
      documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      documentFormSubsection: 'supporting_documents',
      formPrimaryId: productDocumentId,
      documentName: path.basename(storedRelativePath),
      documentOriginalName: file.originalname,
      documentLink: storedRelativePath,
      createdDate: now,
      updatedDate: now,
    });
    return { documentOnly: true as const, documents: [doc] };
  }

  async create(
    dto: CreateRawMaterialsEliminationOfFormaldehydeDto,
    vendorId: string,
    formaldehydeFile?: Express.Multer.File,
  ): Promise<
    | RawMaterialsEliminationOfFormaldehydeDocument
    | { documentOnly: true; documents: unknown[] }
  > {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = dto.urnNo.trim();
      const productRow = normalizeRawMaterialsProductRow({
        productsName: dto.productsName,
        productsTestReport: dto.productsTestReport,
      });
      const hasProductText = hasPartialRawMaterialsProductRow(productRow);

      if (!hasProductText && formaldehydeFile) {
        return this.saveDocumentOnly(urnNo, vendorObjectId, formaldehydeFile);
      }

      if (!hasProductText) {
        return { skipped: true } as any;
      }

      const id =
        await this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId();
      const now = new Date();

      const doc = new this.model({
        rawMaterialsEliminationOfFormaldehydeId: id,
        urnNo,
        vendorId: vendorObjectId,
        productsName: productRow.productName,
        productsTestReport: productRow.testReportReference,
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      if (formaldehydeFile) {
        const storedRelativePath = await this.saveFileToUrnFolder(
          formaldehydeFile,
          urnNo,
        );
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo,
          eoiNo: '',
          documentForm:
            DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
          documentFormSubsection: 'supporting_documents',
          formPrimaryId: id,
          documentName: path.basename(storedRelativePath),
          documentOriginalName: formaldehydeFile.originalname,
          documentLink: storedRelativePath,
          createdDate: now,
          updatedDate: now,
        });
      }

      return saved;
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Formaldehyde] Create error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to create raw materials elimination of formaldehyde record.',
      );
    }
  }

  async countMeaningfulProductsByUrn(
    urnNo: string,
    vendorId: string,
  ): Promise<number> {
    return countMeaningfulRawMaterialsProductRows(this.model, urnNo, vendorId);
  }

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return this.countMeaningfulProductsByUrn(urnNo, vendorId);
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const rows = await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .lean()
        .exec();
      return filterFormaldehydeStyleProductsForVendorDisplay(
        rows as Array<Record<string, unknown>>,
      );
    } catch (error: any) {
      console.error(
        '[Raw Materials Elimination Of Formaldehyde] List error:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials elimination of formaldehyde records.',
      );
    }
  }
}
