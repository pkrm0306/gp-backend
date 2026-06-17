import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcDocument,
} from './schemas/raw-materials-utilization-rmc.schema';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  countVendorUrnDocuments,
  hasAnyMeaningfulBodyField,
  parseRawMaterialsUnitNumericInput,
  RAW_MATERIALS_AT_LEAST_ONE_MESSAGE,
  sumNullableRawMaterialsNumerics,
  normalizeRawMaterialsUtilizationRmcRow,
  withRawMaterialsNumericFields,
} from '../common/raw-materials/raw-materials-upload.util';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';

type Step15Files = {
  file1?: Express.Multer.File;
  file2?: Express.Multer.File;
};

@Injectable()
export class RawMaterialsUtilizationRmcService {
  constructor(
    @InjectModel(RawMaterialsUtilizationRmc.name)
    private model: Model<RawMaterialsUtilizationRmcDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async countPersistedByUrn(urnNo: string, vendorId: string): Promise<number> {
    return countVendorUrnDocuments(this.model, urnNo, vendorId);
  }

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

  private buildValidationError(fieldErrors: Record<string, string>): never {
    throw new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Invalid Step 15 payload',
      fieldErrors,
    });
  }

  /** Partial-save: invalid/empty numerics become null (explicit 0 preserved). */
  private parseRmcNumericInput(value: unknown): number | null {
    return parseRawMaterialsUnitNumericInput(value);
  }

  private sanitizeRmcNumericPayload(
    payload: Record<string, number | null>,
  ): Record<string, number | null> {
    const out: Record<string, number | null> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value === null || value === undefined) {
        out[key] = null;
        continue;
      }
      const n = Number(value);
      out[key] = Number.isFinite(n) ? n : null;
    }
    return out;
  }

  private getNumericSchemaFields(): string[] {
    const excludeNumericFields = new Set(['rawMaterialsUtilizationRmcId']);
    return Object.entries(this.model.schema.paths)
      .filter(([key, schemaType]) => {
        if (['_id', '__v'].includes(key) || excludeNumericFields.has(key)) return false;
        return schemaType.instance === 'Number';
      })
      .map(([key]) => key);
  }

  private applyAliases(raw: Record<string, any>): Record<string, any> {
    const out = { ...raw };
    const aliasMap: Record<string, string> = {
      brandSelfCpmactiongConcrete: 'brandSelfCpmactingConcrete',
      brandSelfCpmactionConcrete: 'brandSelfCpmactingConcrete',
      brandSelfCompactingConcrete: 'brandSelfCpmactingConcrete',
      productionYear1SelfCpmactiongConcrete: 'productionYear1SelfCpmactingConcrete',
      productionYear2SelfCpmactiongConcrete: 'productionYear2SelfCpmactingConcrete',
      productionYear3SelfCpmactiongConcrete: 'productionYear3SelfCpmactingConcrete',
      productionYear1SelfCompactingConcrete: 'productionYear1SelfCpmactingConcrete',
      productionYear2SelfCompactingConcrete: 'productionYear2SelfCpmactingConcrete',
      productionYear3SelfCompactingConcrete: 'productionYear3SelfCpmactingConcrete',
    };

    for (const mat of ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']) {
      for (const yr of [1, 2, 3, 4]) {
        aliasMap[`percentYear${yr}Subsitution${mat}`] = `percentYear${yr}Subsititution${mat}`;
        aliasMap[`percentYear${yr}Substitution${mat}`] = `percentYear${yr}Subsititution${mat}`;

        // Frontend may send lowercase material suffixes (e.g. "...Subsitutioniron")
        const lowerMat = mat.toLowerCase();
        aliasMap[`percentYear${yr}Subsitution${lowerMat}`] =
          `percentYear${yr}Subsititution${mat}`;
        aliasMap[`percentYear${yr}Substitution${lowerMat}`] =
          `percentYear${yr}Subsititution${mat}`;
        aliasMap[`percentYear${yr}Subsititution${lowerMat}`] =
          `percentYear${yr}Subsititution${mat}`;
      }
    }

    // Plant block: accept misspelled Subsitution variants from frontend.
    for (const yr of [1, 2, 3, 4]) {
      aliasMap[`plantYear${yr}PercentSubsitution`] = `plantYear${yr}PercentSubstitution`;
      aliasMap[`plantYear${yr}Percentsubstitution`] = `plantYear${yr}PercentSubstitution`;
    }

    for (const [alias, canonical] of Object.entries(aliasMap)) {
      if (out[canonical] === undefined && out[alias] !== undefined) {
        out[canonical] = out[alias];
      }
    }

    return out;
  }

  private wasFieldProvided(
    input: Record<string, unknown>,
    field: string,
  ): boolean {
    const value = input[field];
    return value !== undefined && value !== null && value !== '';
  }

  private parseAndNormalizePayload(rawInput: Record<string, any>) {
    const input = this.applyAliases(rawInput);
    const numericFields = this.getNumericSchemaFields();
    const numericPayload: Record<string, number | null> = {};

    for (const field of numericFields) {
      if (this.wasFieldProvided(input, field)) {
        numericPayload[field] = this.parseRmcNumericInput(input[field]);
      }
    }

    const setTotal = (key: string, parts: Array<number | null | undefined>) => {
      const total = sumNullableRawMaterialsNumerics(...parts);
      if (total !== null) {
        numericPayload[key] = total;
      }
    };

    setTotal('total1', [
      numericPayload.cement1,
      numericPayload.flyash1,
      numericPayload.coarseAggregate1,
      numericPayload.fineAggregate1,
      numericPayload.admixture1,
      numericPayload.alcofine1,
      numericPayload.ggbs1,
      numericPayload.anyOtherMaterial1,
    ]);
    setTotal('total2', [
      numericPayload.cement2,
      numericPayload.flyash2,
      numericPayload.coarseAggregate2,
      numericPayload.fineAggregate2,
      numericPayload.admixture2,
      numericPayload.alcofine2,
      numericPayload.ggbs2,
      numericPayload.anyOtherMaterial2,
    ]);
    setTotal('total3', [
      numericPayload.cement3,
      numericPayload.flyash3,
      numericPayload.coarseAggregate3,
      numericPayload.fineAggregate3,
      numericPayload.admixture3,
      numericPayload.alcofine3,
      numericPayload.ggbs3,
      numericPayload.anyOtherMaterial3,
    ]);
    setTotal('brandTotalConcrete', [
      numericPayload.brandConcreteWithHighScm,
      numericPayload.brandHighStrengthConcrete,
      numericPayload.brandSelfCpmactingConcrete,
      numericPayload.brandLowDensityConcrete,
      numericPayload.brandClsmConcrete,
      numericPayload.brandAnyOtherTypes,
    ]);
    setTotal('productionYear1TotalConcrete', [
      numericPayload.productionYear1ConcreteWithHighScm,
      numericPayload.productionYear1HighStrengthConcrete,
      numericPayload.productionYear1SelfCpmactingConcrete,
      numericPayload.productionYear1LowDensityConcrete,
      numericPayload.productionYear1ClsmConcrete,
      numericPayload.productionYear1AnyOtherTypes,
    ]);
    setTotal('productionYear2TotalConcrete', [
      numericPayload.productionYear2ConcreteWithHighScm,
      numericPayload.productionYear2HighStrengthConcrete,
      numericPayload.productionYear2SelfCpmactingConcrete,
      numericPayload.productionYear2LowDensityConcrete,
      numericPayload.productionYear2ClsmConcrete,
      numericPayload.productionYear2AnyOtherTypes,
    ]);
    setTotal('productionYear3TotalConcrete', [
      numericPayload.productionYear3ConcreteWithHighScm,
      numericPayload.productionYear3HighStrengthConcrete,
      numericPayload.productionYear3SelfCpmactingConcrete,
      numericPayload.productionYear3LowDensityConcrete,
      numericPayload.productionYear3ClsmConcrete,
      numericPayload.productionYear3AnyOtherTypes,
    ]);

    const opcUsed = numericPayload.totalQuantityOfOpcUsed ?? null;
    const supplementary = numericPayload.totalQuantityOfSupplementary ?? null;
    if (opcUsed !== null || supplementary !== null) {
      const opcDenom = (opcUsed ?? 0) + (supplementary ?? 0);
      numericPayload.opcSubstitution =
        opcDenom > 0
          ? Number(((supplementary ?? 0) / opcDenom).toFixed(4))
          : 0;
    }

    return this.sanitizeRmcNumericPayload(numericPayload);
  }

  private async ensureUrnOwnership(urnNo: string, vendorObjectId: Types.ObjectId): Promise<void> {
    const owned = await this.productModel.findOne({ urnNo, vendorId: vendorObjectId }).lean().exec();
    if (owned) return;

    const exists = await this.productModel.findOne({ urnNo }).lean().exec();
    if (!exists) {
      throw new HttpException(
        { code: 'URN_NOT_FOUND', message: 'URN not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    throw new HttpException(
      { code: 'URN_ACCESS_DENIED', message: 'Authenticated vendor does not own this URN' },
      HttpStatus.FORBIDDEN,
    );
  }

  private buildResponse(doc: any) {
    const d = withRawMaterialsNumericFields(
      typeof doc?.toObject === 'function' ? doc.toObject() : { ...doc },
      this.getNumericSchemaFields(),
    );
    return {
      urnNo: d.urnNo,
      vendorId: String(d.vendorId),
      data: {
        consumption_year1: d.consumptionYear1,
        consumption_year2: d.consumptionYear2,
        consumption_year3: d.consumptionYear3,
        rawConsumption: {
          cement1: d.cement1,
          cement2: d.cement2,
          cement3: d.cement3,
          flyash1: d.flyash1,
          flyash2: d.flyash2,
          flyash3: d.flyash3,
          coarseAggregate1: d.coarseAggregate1,
          coarseAggregate2: d.coarseAggregate2,
          coarseAggregate3: d.coarseAggregate3,
          fineAggregate1: d.fineAggregate1,
          fineAggregate2: d.fineAggregate2,
          fineAggregate3: d.fineAggregate3,
          admixture1: d.admixture1,
          admixture2: d.admixture2,
          admixture3: d.admixture3,
          alcofine1: d.alcofine1,
          alcofine2: d.alcofine2,
          alcofine3: d.alcofine3,
          ggbs1: d.ggbs1,
          ggbs2: d.ggbs2,
          ggbs3: d.ggbs3,
          anyOtherMaterial1: d.anyOtherMaterial1,
          anyOtherMaterial2: d.anyOtherMaterial2,
          anyOtherMaterial3: d.anyOtherMaterial3,
        },
        concreteTypes: {
          brandConcreteWithHighScm: d.brandConcreteWithHighScm,
          brandHighStrengthConcrete: d.brandHighStrengthConcrete,
          brandSelfCpmactingConcrete: d.brandSelfCpmactingConcrete,
          brandLowDensityConcrete: d.brandLowDensityConcrete,
          brandClsmConcrete: d.brandClsmConcrete,
          brandAnyOtherTypes: d.brandAnyOtherTypes,
        },
        opcSummary: {
          total_quantity_of_opc_used: d.totalQuantityOfOpcUsed,
          total_quantity_of_supplementary: d.totalQuantityOfSupplementary,
          total_opc_substitution_ratio: d.opcSubstitution,
        },
      },
      computed: {
        total_fields1: d.total1,
        total_fields2: d.total2,
        total_fields3: d.total3,
        total_brand_name_concrete: d.brandTotalConcrete,
        total_production_year1_final: d.productionYear1TotalConcrete,
        total_production_year2_final: d.productionYear2TotalConcrete,
        total_production_year3_final: d.productionYear3TotalConcrete,
      },
      updatedDate: d.updatedDate,
    };
  }

  private withLegacyRmcAliases(row: any) {
    const base = typeof row?.toObject === 'function' ? row.toObject() : row;
    if (!base) return base;
    return normalizeRawMaterialsUtilizationRmcRow(
      base as Record<string, unknown>,
    );
  }

  private async upsertStep15Document(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    payload: Record<string, number | null>,
  ): Promise<RawMaterialsUtilizationRmcDocument> {
    const now = new Date();
    const safePayload = this.sanitizeRmcNumericPayload(payload);
    const existing = await this.model.findOne({ urnNo, vendorId: vendorObjectId }).exec();

    if (existing) {
      return await this.model
        .findOneAndUpdate(
          { urnNo, vendorId: vendorObjectId },
          { $set: { ...safePayload, updatedDate: now } },
          { new: true, runValidators: false },
        )
        .exec();
    }

    const id = await this.sequenceHelper.getRawMaterialsUtilizationRmcId();
    return await this.model
      .findOneAndUpdate(
        { urnNo, vendorId: vendorObjectId },
        {
          $set: { ...safePayload, updatedDate: now },
          $setOnInsert: {
            rawMaterialsUtilizationRmcId: id,
            urnNo,
            vendorId: vendorObjectId,
            createdDate: now,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: false,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  private async persistStep15Files(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    formPrimaryId: number,
    files: Step15Files,
    fileNameHint?: string,
  ): Promise<void> {
    if (!files.file1 && !files.file2) {
      return;
    }

    const now = new Date();

    const createDoc = async (
      file: Express.Multer.File,
      documentFormSubsection: string,
      fileType: string,
    ) => {
      const storedRelativePath = await this.saveFileToUrnFolder(
        file,
        urnNo,
        fileType,
      );
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      const createdDoc = await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm:
          DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
        documentFormSubsection,
        formPrimaryId,
        documentName: fileNameHint?.trim() || path.basename(storedRelativePath),
        documentOriginalName: file.originalname,
        documentLink: storedRelativePath,
        createdDate: now,
        updatedDate: now,
      });
      await trackCertificationDocumentAfterCreate({
          productModel: this.productModel,
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo,
          sectionKey: DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: createdDoc,
          file: file,
        });
    };

    if (files.file1) {
      await createDoc(
        files.file1,
        'step_15_1_supporting_document',
        'step_15_1_supporting_document',
      );
    }
    if (files.file2) {
      await createDoc(
        files.file2,
        'step_15_2_supporting_document',
        'step_15_2_supporting_document',
      );
    }
  }

  async create(
    dto: Record<string, any>,
    vendorId: string,
    files?: Step15Files,
    urnNoFromPath?: string,
  ): Promise<any> {
    try {
      if (!vendorId) {
        throw new HttpException(
          { code: 'VALIDATION_ERROR', message: 'Invalid Step 15 payload', fieldErrors: { vendorId: 'Vendor is required' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const urnNo = String(urnNoFromPath ?? dto?.urnNo ?? '').trim();
      if (!urnNo) {
        this.buildValidationError({ urnNo: 'URN number is required' });
      }

      await this.ensureUrnOwnership(urnNo, vendorObjectId);
      await assertVendorCanEditUrn(this.productModel, vendorId, urnNo);

      const uploadFiles = [files?.file1, files?.file2].filter(
        Boolean,
      ) as Express.Multer.File[];
      const [retainedDocumentCount, persistedRecordCount] = await Promise.all([
        this.allProductDocumentModel
          .countDocuments({
            vendorId: vendorObjectId,
            urnNo,
            documentForm:
              DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
            isDeleted: { $ne: true },
          })
          .exec(),
        this.model
          .countDocuments({ urnNo, vendorId: vendorObjectId })
          .exec(),
      ]);
      if (
        uploadFiles.length === 0 &&
        !hasAnyMeaningfulBodyField(dto ?? {}) &&
        retainedDocumentCount === 0 &&
        persistedRecordCount === 0
      ) {
        throw new BadRequestException(RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
      }

      const normalizedNumericPayload = this.parseAndNormalizePayload(dto ?? {});
      const upserted = await this.upsertStep15Document(urnNo, vendorObjectId, normalizedNumericPayload);
      await this.persistStep15Files(
        urnNo,
        vendorObjectId,
        upserted.rawMaterialsUtilizationRmcId,
        files ?? {},
        dto?.utilizationRmcFileName,
      );
      return this.buildResponse(upserted.toObject());
    } catch (error: any) {
      console.error('[Raw Materials Utilization RMC] Create error:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      if (error?.code === 11000) {
        throw new HttpException(
          { code: 'CONFLICT_DUPLICATE_KEY', message: 'Duplicate key conflict' },
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        { code: 'INTERNAL_ERROR', message: error.message || 'Failed to save Step 15 payload' },
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const rows = await this.model
        .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
      return rows.map((row) => this.withLegacyRmcAliases(row));
    } catch (error: any) {
      console.error('[Raw Materials Utilization RMC] List error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list raw materials utilization RMC records.',
      );
    }
  }
}
