import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import archiver from 'archiver';
import PDFDocument from 'pdfkit';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import { readUploadedFileBuffer } from '../../utils/upload-file-read.util';

const CERTIFIED_PRODUCT_STATUS = 2;

export type CertificateDownloadFile = {
  buffer: Buffer;
  fileName: string;
  contentType: string;
};

type ProductWithRelations = ProductDocument & {
  category?: CategoryDocument | null;
  manufacturer?: ManufacturerDocument | null;
};

@Injectable()
export class VendorCertificateService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
  ) {}

  async downloadEoiCertificate(
    vendorId: string,
    productId: string,
  ): Promise<CertificateDownloadFile> {
    const product = await this.loadCertifiedProductForVendor(vendorId, productId);
    const buffer = await this.resolveCertificateBuffer(product);
    return {
      buffer,
      fileName: this.buildCertificateFileName(product.eoiNo),
      contentType: 'application/pdf',
    };
  }

  async downloadUrnCertificatesZip(
    vendorId: string,
    urnNo: string,
  ): Promise<{ stream: archiver.Archiver; fileName: string }> {
    const trimmedUrn = String(urnNo ?? '').trim();
    if (!trimmedUrn) {
      throw new BadRequestException('URN number is required');
    }

    const vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
    const products = await this.productModel
      .find(
        matchActiveProducts({
          vendorId: vendorObjectId,
          urnNo: trimmedUrn,
          productStatus: CERTIFIED_PRODUCT_STATUS,
        }),
      )
      .sort({ eoiNo: 1 })
      .exec();

    if (!products.length) {
      throw new NotFoundException(
        'No certified products found for this URN',
      );
    }

    const hydrated = await Promise.all(
      products.map((product) => this.hydrateProduct(product)),
    );

    const archive = archiver('zip', { zlib: { level: 9 } });
    let added = 0;

    for (const product of hydrated) {
      try {
        const buffer = await this.resolveCertificateBuffer(product);
        archive.append(buffer, {
          name: this.buildCertificateFileName(product.eoiNo),
        });
        added += 1;
      } catch {
        /* skip missing certificate rows in zip */
      }
    }

    if (added === 0) {
      throw new NotFoundException(
        'No certificate files are available for this URN',
      );
    }

    return {
      stream: archive,
      fileName: `Certificates_${trimmedUrn}.zip`,
    };
  }

  private async loadCertifiedProductForVendor(
    vendorId: string,
    productId: string,
  ): Promise<ProductWithRelations> {
    const trimmedId = String(productId ?? '').trim();
    if (!Types.ObjectId.isValid(trimmedId)) {
      throw new BadRequestException('Invalid product id');
    }

    const vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
    const product = await this.productModel
      .findOne(
        matchActiveProducts({
          _id: new Types.ObjectId(trimmedId),
          vendorId: vendorObjectId,
          productStatus: CERTIFIED_PRODUCT_STATUS,
        }),
      )
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Certified product not found for this vendor',
      );
    }

    return this.hydrateProduct(product);
  }

  private async hydrateProduct(
    product: ProductDocument,
  ): Promise<ProductWithRelations> {
    const [category, manufacturer] = await Promise.all([
      product.categoryId
        ? this.categoryModel
            .findById(product.categoryId)
            .select('categoryName category_name')
            .lean()
            .exec()
        : null,
      product.manufacturerId
        ? this.manufacturerModel
            .findById(product.manufacturerId)
            .select('manufacturerName')
            .lean()
            .exec()
        : null,
    ]);

    return Object.assign(product, {
      category: category as CategoryDocument | null,
      manufacturer: manufacturer as ManufacturerDocument | null,
    });
  }

  private async resolveCertificateBuffer(
    product: ProductWithRelations,
  ): Promise<Buffer> {
    const fromDocument = await this.readCertificateFromDocuments(product);
    if (fromDocument) {
      return fromDocument;
    }

    if (product.assessmentReportUrl) {
      const fromAssessment = await readUploadedFileBuffer(
        product.assessmentReportUrl,
      );
      if (fromAssessment?.length) {
        return fromAssessment;
      }
    }

    for (const relativePath of this.buildCertificatePathCandidates(product)) {
      const buffer = await readUploadedFileBuffer(relativePath);
      if (buffer?.length) {
        return buffer;
      }
    }

    return this.generateCertificatePdf(product);
  }

  private async readCertificateFromDocuments(
    product: ProductWithRelations,
  ): Promise<Buffer | null> {
    const urnNo = String(product.urnNo ?? '').trim();
    const eoiNo = String(product.eoiNo ?? '').trim();
    if (!urnNo) {
      return null;
    }

    const docs = await this.allProductDocumentModel
      .find({
        urnNo,
        vendorId: product.vendorId,
        eoiNo,
        isDeleted: { $ne: true },
        $or: [
          { documentForm: { $regex: /certificate/i } },
          { documentFormSubsection: { $regex: /certificate/i } },
          { documentName: { $regex: /certificate/i } },
          { documentOriginalName: { $regex: /certificate/i } },
        ],
      })
      .sort({ updatedDate: -1, createdDate: -1 })
      .limit(5)
      .lean()
      .exec();

    for (const doc of docs) {
      const buffer = await readUploadedFileBuffer(doc.documentLink);
      if (buffer?.length) {
        return buffer;
      }
    }

    return null;
  }

  private buildCertificatePathCandidates(product: ProductWithRelations): string[] {
    const urnNo = String(product.urnNo ?? '').trim();
    const eoiNo = String(product.eoiNo ?? '').trim();
    const productId = String(product.productId ?? '').trim();
    const safeEoi = eoiNo.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeUrn = urnNo.replace(/[^a-zA-Z0-9._-]/g, '_');

    return [
      `certificates/${safeEoi}.pdf`,
      `certificates/${safeUrn}/${safeEoi}.pdf`,
      `certificate/${safeEoi}.pdf`,
      `greenpro_certificates/${safeEoi}.pdf`,
      `certificates/${productId}.pdf`,
      `urns/${safeUrn}/certificates/${safeEoi}.pdf`,
      `urns/${safeUrn}/certificate_${safeEoi}.pdf`,
      `feedback/${safeEoi}.pdf`,
    ];
  }

  private generateCertificatePdf(product: ProductWithRelations): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 48 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const categoryName =
        (product.category as { categoryName?: string; category_name?: string } | null)
          ?.categoryName ??
        (product.category as { category_name?: string } | null)?.category_name ??
        '—';
      const manufacturerName =
        (product.manufacturer as { manufacturerName?: string } | null)
          ?.manufacturerName ?? '—';

      doc
        .fontSize(22)
        .fillColor('#1f6b45')
        .text('GreenPro Ecolabel Certificate', { align: 'center' });
      doc.moveDown(1.5);
      doc.fontSize(12).fillColor('#111111');
      doc.text(`Product Name: ${product.productName ?? '—'}`);
      doc.text(`EOI Number: ${product.eoiNo ?? '—'}`);
      doc.text(`URN Number: ${product.urnNo ?? '—'}`);
      doc.text(`Category: ${categoryName}`);
      doc.text(`Manufacturer: ${manufacturerName}`);
      doc.text(
        `Certified Date: ${this.formatDate(product.certifiedDate) ?? '—'}`,
      );
      doc.text(
        `Valid Till: ${this.formatDate(product.validtillDate) ?? '—'}`,
      );
      doc.moveDown(1.5);
      doc
        .fontSize(10)
        .fillColor('#444444')
        .text(
          'This certificate confirms that the above product has been certified under the GreenPro Ecolabel programme.',
          { align: 'justify' },
        );
      doc.end();
    });
  }

  private buildCertificateFileName(eoiNo?: string | null): string {
    const safe = String(eoiNo ?? 'certificate')
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    return `GreenPro_Certificate_${safe || 'certificate'}.pdf`;
  }

  private formatDate(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return d.toISOString().slice(0, 10);
  }

  private toObjectId(value: string, label: string): Types.ObjectId {
    const trimmed = String(value ?? '').trim();
    if (!Types.ObjectId.isValid(trimmed)) {
      throw new BadRequestException(`Invalid ${label}`);
    }
    return new Types.ObjectId(trimmed);
  }
}
