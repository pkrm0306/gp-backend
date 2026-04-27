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

type Step15Files = {
  file1?: Express.Multer.File;
  file2?: Express.Multer.File;
};

@Injectable()
export class RawMaterialsUtilizationRmcService {
  private readonly ALWAYS_REQUIRED_FIELDS = new Set([
    'consumptionYear1',
    'consumptionYear2',
    'consumptionYear3',
    'totalQuantityOfOpcUsed',
    'totalQuantityOfSupplementary',
  ]);

  constructor(
    @InjectModel(RawMaterialsUtilizationRmc.name)
    private model: Model<RawMaterialsUtilizationRmcDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
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

  private buildValidationError(fieldErrors: Record<string, string>): never {
    throw new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Invalid Step 15 payload',
      fieldErrors,
    });
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

  private parseAndNormalizePayload(rawInput: Record<string, any>) {
    const input = this.applyAliases(rawInput);
    const fieldErrors: Record<string, string> = {};
    const numericFields = this.getNumericSchemaFields();
    const numericPayload: Record<string, number> = {};

    for (const field of numericFields) {
      const value = input[field];
      const required = this.ALWAYS_REQUIRED_FIELDS.has(field);

      if (value === undefined || value === null || value === '') {
        if (required) {
          fieldErrors[field] = 'Field is required';
        } else {
          numericPayload[field] = 0;
        }
        continue;
      }

      const n = Number(value);
      if (!Number.isFinite(n)) {
        fieldErrors[field] = 'Must be numeric';
        continue;
      }
      if (n < 0) {
        fieldErrors[field] = 'Must be >= 0';
        continue;
      }

      numericPayload[field] = n;
    }

    const y1 = numericPayload.consumptionYear1;
    const y2 = numericPayload.consumptionYear2;
    const y3 = numericPayload.consumptionYear3;
    for (const [key, value] of Object.entries({
      consumptionYear1: y1,
      consumptionYear2: y2,
      consumptionYear3: y3,
    })) {
      if (value !== undefined && (!Number.isInteger(value) || value < 1900 || value > 2100)) {
        fieldErrors[key] = 'Year must be an integer between 1900 and 2100';
      }
    }
    if (y1 !== undefined && y2 !== undefined && y3 !== undefined) {
      const distinct = new Set([y1, y2, y3]);
      if (distinct.size !== 3) {
        fieldErrors.consumptionYear3 =
          'consumptionYear1, consumptionYear2 and consumptionYear3 must be distinct';
      }
    }

    const denominator =
      (numericPayload.totalQuantityOfOpcUsed ?? 0) +
      (numericPayload.totalQuantityOfSupplementary ?? 0);
    if (denominator <= 0) {
      fieldErrors.totalQuantityOfOpcUsed =
        'totalQuantityOfOpcUsed + totalQuantityOfSupplementary must be > 0';
    }

    if (Object.keys(fieldErrors).length > 0) {
      this.buildValidationError(fieldErrors);
    }

    numericPayload.total1 =
      (numericPayload.cement1 ?? 0) +
      (numericPayload.flyash1 ?? 0) +
      (numericPayload.coarseAggregate1 ?? 0) +
      (numericPayload.fineAggregate1 ?? 0) +
      (numericPayload.admixture1 ?? 0) +
      (numericPayload.alcofine1 ?? 0) +
      (numericPayload.ggbs1 ?? 0) +
      (numericPayload.anyOtherMaterial1 ?? 0);

    numericPayload.total2 =
      (numericPayload.cement2 ?? 0) +
      (numericPayload.flyash2 ?? 0) +
      (numericPayload.coarseAggregate2 ?? 0) +
      (numericPayload.fineAggregate2 ?? 0) +
      (numericPayload.admixture2 ?? 0) +
      (numericPayload.alcofine2 ?? 0) +
      (numericPayload.ggbs2 ?? 0) +
      (numericPayload.anyOtherMaterial2 ?? 0);

    numericPayload.total3 =
      (numericPayload.cement3 ?? 0) +
      (numericPayload.flyash3 ?? 0) +
      (numericPayload.coarseAggregate3 ?? 0) +
      (numericPayload.fineAggregate3 ?? 0) +
      (numericPayload.admixture3 ?? 0) +
      (numericPayload.alcofine3 ?? 0) +
      (numericPayload.ggbs3 ?? 0) +
      (numericPayload.anyOtherMaterial3 ?? 0);

    numericPayload.brandTotalConcrete =
      (numericPayload.brandConcreteWithHighScm ?? 0) +
      (numericPayload.brandHighStrengthConcrete ?? 0) +
      (numericPayload.brandSelfCpmactingConcrete ?? 0) +
      (numericPayload.brandLowDensityConcrete ?? 0) +
      (numericPayload.brandClsmConcrete ?? 0) +
      (numericPayload.brandAnyOtherTypes ?? 0);

    numericPayload.productionYear1TotalConcrete =
      (numericPayload.productionYear1ConcreteWithHighScm ?? 0) +
      (numericPayload.productionYear1HighStrengthConcrete ?? 0) +
      (numericPayload.productionYear1SelfCpmactingConcrete ?? 0) +
      (numericPayload.productionYear1LowDensityConcrete ?? 0) +
      (numericPayload.productionYear1ClsmConcrete ?? 0) +
      (numericPayload.productionYear1AnyOtherTypes ?? 0);

    numericPayload.productionYear2TotalConcrete =
      (numericPayload.productionYear2ConcreteWithHighScm ?? 0) +
      (numericPayload.productionYear2HighStrengthConcrete ?? 0) +
      (numericPayload.productionYear2SelfCpmactingConcrete ?? 0) +
      (numericPayload.productionYear2LowDensityConcrete ?? 0) +
      (numericPayload.productionYear2ClsmConcrete ?? 0) +
      (numericPayload.productionYear2AnyOtherTypes ?? 0);

    numericPayload.productionYear3TotalConcrete =
      (numericPayload.productionYear3ConcreteWithHighScm ?? 0) +
      (numericPayload.productionYear3HighStrengthConcrete ?? 0) +
      (numericPayload.productionYear3SelfCpmactingConcrete ?? 0) +
      (numericPayload.productionYear3LowDensityConcrete ?? 0) +
      (numericPayload.productionYear3ClsmConcrete ?? 0) +
      (numericPayload.productionYear3AnyOtherTypes ?? 0);

    numericPayload.opcSubstitution = Number(
      (
        (numericPayload.totalQuantityOfSupplementary ?? 0) /
        ((numericPayload.totalQuantityOfOpcUsed ?? 0) +
          (numericPayload.totalQuantityOfSupplementary ?? 0))
      ).toFixed(4),
    );

    return numericPayload;
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
    return {
      urnNo: doc.urnNo,
      vendorId: String(doc.vendorId),
      data: {
        consumption_year1: doc.consumptionYear1,
        consumption_year2: doc.consumptionYear2,
        consumption_year3: doc.consumptionYear3,
        rawConsumption: {
          cement1: doc.cement1,
          cement2: doc.cement2,
          cement3: doc.cement3,
          flyash1: doc.flyash1,
          flyash2: doc.flyash2,
          flyash3: doc.flyash3,
          coarseAggregate1: doc.coarseAggregate1,
          coarseAggregate2: doc.coarseAggregate2,
          coarseAggregate3: doc.coarseAggregate3,
          fineAggregate1: doc.fineAggregate1,
          fineAggregate2: doc.fineAggregate2,
          fineAggregate3: doc.fineAggregate3,
          admixture1: doc.admixture1,
          admixture2: doc.admixture2,
          admixture3: doc.admixture3,
          alcofine1: doc.alcofine1,
          alcofine2: doc.alcofine2,
          alcofine3: doc.alcofine3,
          ggbs1: doc.ggbs1,
          ggbs2: doc.ggbs2,
          ggbs3: doc.ggbs3,
          anyOtherMaterial1: doc.anyOtherMaterial1,
          anyOtherMaterial2: doc.anyOtherMaterial2,
          anyOtherMaterial3: doc.anyOtherMaterial3,
        },
        concreteTypes: {
          brandConcreteWithHighScm: doc.brandConcreteWithHighScm,
          brandHighStrengthConcrete: doc.brandHighStrengthConcrete,
          brandSelfCpmactingConcrete: doc.brandSelfCpmactingConcrete,
          brandLowDensityConcrete: doc.brandLowDensityConcrete,
          brandClsmConcrete: doc.brandClsmConcrete,
          brandAnyOtherTypes: doc.brandAnyOtherTypes,
        },
        opcSummary: {
          total_quantity_of_opc_used: doc.totalQuantityOfOpcUsed,
          total_quantity_of_supplementary: doc.totalQuantityOfSupplementary,
          total_opc_substitution_ratio: doc.opcSubstitution,
        },
      },
      computed: {
        total_fields1: doc.total1,
        total_fields2: doc.total2,
        total_fields3: doc.total3,
        total_brand_name_concrete: doc.brandTotalConcrete,
        total_production_year1_final: doc.productionYear1TotalConcrete,
        total_production_year2_final: doc.productionYear2TotalConcrete,
        total_production_year3_final: doc.productionYear3TotalConcrete,
      },
      updatedDate: doc.updatedDate,
    };
  }

  private withLegacyRmcAliases(row: any) {
    const base = typeof row?.toObject === 'function' ? row.toObject() : row;
    if (!base) return base;

    const out: any = { ...base };
    for (const mat of ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']) {
      for (const yr of [1, 2, 3, 4]) {
        const canonical = `percentYear${yr}Subsititution${mat}`;
        const legacy = `percentYear${yr}Subsitution${mat}`;
        if (out[legacy] === undefined && out[canonical] !== undefined) {
          out[legacy] = out[canonical];
        }
      }
    }

    for (const yr of [1, 2, 3, 4]) {
      const canonical = `plantYear${yr}PercentSubstitution`;
      const legacy = `plantYear${yr}PercentSubsitution`;
      if (out[legacy] === undefined && out[canonical] !== undefined) {
        out[legacy] = out[canonical];
      }
    }

    return out;
  }

  private async upsertStep15Document(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    payload: Record<string, number>,
  ): Promise<RawMaterialsUtilizationRmcDocument> {
    const now = new Date();
    const existing = await this.model.findOne({ urnNo, vendorId: vendorObjectId }).exec();

    if (existing) {
      return await this.model
        .findOneAndUpdate(
          { urnNo, vendorId: vendorObjectId },
          { $set: { ...payload, updatedDate: now } },
          { new: true, runValidators: false },
        )
        .exec();
    }

    const id = await this.sequenceHelper.getRawMaterialsUtilizationRmcId();
    return await this.model
      .findOneAndUpdate(
        { urnNo, vendorId: vendorObjectId },
        {
          $set: { ...payload, updatedDate: now },
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
    await this.allProductDocumentModel.updateMany(
      {
        urnNo,
        vendorId: vendorObjectId,
        documentForm: { $in: ['raw_materials_3_15_1', 'raw_materials_3_15_2'] },
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

    const createDoc = async (
      file: Express.Multer.File,
      documentForm: 'raw_materials_3_15_1' | 'raw_materials_3_15_2',
      fileType: string,
    ) => {
      const storedRelativePath = this.saveFileToUrnFolder(file, urnNo, fileType);
      const productDocumentId = await this.sequenceHelper.getProductDocumentId();
      await this.allProductDocumentModel.create({
        productDocumentId,
        vendorId: vendorObjectId,
        urnNo,
        eoiNo: '',
        documentForm,
        documentFormSubsection: 'supporting_documents',
        formPrimaryId,
        documentName: fileNameHint?.trim() || path.basename(storedRelativePath),
        documentOriginalName: file.originalname,
        documentLink: `uploads/${storedRelativePath}`,
        createdDate: now,
        updatedDate: now,
      });
    };

    if (files.file1) {
      await createDoc(files.file1, 'raw_materials_3_15_1', 'step_15_1_supporting_document');
    }
    if (files.file2) {
      await createDoc(files.file2, 'raw_materials_3_15_2', 'step_15_2_supporting_document');
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
