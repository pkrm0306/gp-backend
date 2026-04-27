import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RawMaterialsHazardousProducts,
  RawMaterialsHazardousProductsDocument,
} from './schemas/raw-materials-hazardous-products.schema';
import { CreateRawMaterialsHazardousProductsDto } from './dto/create-raw-materials-hazardous-products.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { AllProductDocument, AllProductDocumentDocument } from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RawMaterialsHazardousProductsService {
  constructor(
    @InjectModel(RawMaterialsHazardousProducts.name)
    private model: Model<RawMaterialsHazardousProductsDocument>,
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

  private saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: string,
  ): string {
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
      } catch {}
    } else if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } else {
      throw new BadRequestException('File data not available');
    }

    return path.join('urns', urnNo, fileName).replace(/\\/g, '/');
  }

  async create(
    dto: CreateRawMaterialsHazardousProductsDto,
    vendorId: string,
    productsTestReportFile?: Express.Multer.File,
  ) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const id = await this.sequenceHelper.getRawMaterialsHazardousProductsId();
      const now = new Date();

      // Optional file handling
      let storedFileName = '';
      let storedRelativePath = '';
      if (productsTestReportFile) {
        storedRelativePath = this.saveFileToUrnFolder(
          productsTestReportFile,
          dto.urnNo,
          'hazardous_test_report',
        );
        storedFileName = path.basename(storedRelativePath);
      }

      const doc = new this.model({
        rawMaterialsHazardousProductsId: id,
        urnNo: dto.urnNo,
        vendorId: vendorObjectId,
        productsName: dto.productsName || '',
        productsTestReport: dto.productsTestReport || '',
        createdDate: now,
        updatedDate: now,
      });

      const saved = await doc.save();

      // Insert document metadata into master table if file uploaded
      if (productsTestReportFile && storedRelativePath) {
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        await this.allProductDocumentModel.create({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: dto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
          documentFormSubsection: 'products_test_report',
          formPrimaryId: id,
          documentName: storedFileName,
          documentOriginalName: productsTestReportFile.originalname,
          documentLink: `uploads/${storedRelativePath}`,
          createdDate: now,
          updatedDate: now,
        });
      }

      return saved;
    } catch (error: any) {
      console.error('[Raw Materials Hazardous Products] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create hazardous product record.',
      );
    }
  }

  async listByUrn(urnNo: string, vendorId: string) {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      return await this.model
        .find({ urnNo, vendorId: vendorObjectId })
        .sort({ createdDate: 1 })
        .exec();
    } catch (error: any) {
      console.error('[Raw Materials Hazardous Products] List error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to list hazardous product records.',
      );
    }
  }
}
