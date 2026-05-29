import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PDFDocument as PDFLibDocument,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
} from 'pdf-lib';
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
const PAGE_W = 787;
const PAGE_H = 590;

export type CertificateDownloadFile = {
  buffer: Buffer;
  fileName: string;
  contentType: string;
};

type CategoryLean = {
  categoryName?: string;
  category_name?: string;
};

type ManufacturerLean = {
  manufacturerName?: string;
};

type ProductWithRelations = ProductDocument & {
  category?: CategoryLean | null;
  manufacturer?: ManufacturerLean | null;
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

  async downloadUrnCertificatesPdf(
    vendorId: string,
    urnNo: string,
  ): Promise<CertificateDownloadFile> {
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

    const mergedPdf = await PDFLibDocument.create();
    let addedPages = 0;

    for (const product of hydrated) {
      try {
        const buffer = await this.resolveCertificateBuffer(product);
        const src = await PDFLibDocument.load(buffer);
        const pages = await mergedPdf.copyPages(src, src.getPageIndices());
        for (const p of pages) {
          mergedPdf.addPage(p);
        }
        addedPages += pages.length;
      } catch {
        /* skip invalid PDF certificate rows */
      }
    }

    if (addedPages === 0) {
      throw new NotFoundException(
        'No certificate files are available for this URN',
      );
    }

    const mergedBuffer = Buffer.from(await mergedPdf.save());
    return {
      buffer: mergedBuffer,
      fileName: `Certificates_${trimmedUrn}.pdf`,
      contentType: 'application/pdf',
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
            .exec()
        : null,
      product.manufacturerId
        ? this.manufacturerModel
            .findById(product.manufacturerId)
            .select('manufacturerName')
            .exec()
        : null,
    ]);

    return Object.assign(product, {
      category,
      manufacturer,
    });
  }

  private async resolveCertificateBuffer(
    product: ProductWithRelations,
  ): Promise<Buffer> {
    const fromDocument = await this.readCertificateFromDocuments(product);
    if (fromDocument) {
      return this.ensurePdfBuffer(product, fromDocument);
    }

    if (product.assessmentReportUrl) {
      const fromAssessment = await readUploadedFileBuffer(
        product.assessmentReportUrl,
      );
      if (fromAssessment?.length) {
        return this.ensurePdfBuffer(product, fromAssessment);
      }
    }

    for (const relativePath of this.buildCertificatePathCandidates(product)) {
      const buffer = await readUploadedFileBuffer(relativePath);
      if (buffer?.length) {
        return this.ensurePdfBuffer(product, buffer);
      }
    }

    return this.generateCertificatePdf(product);
  }

  private ensurePdfBuffer(
    product: ProductWithRelations,
    buffer: Buffer,
  ): Buffer | Promise<Buffer> {
    if (buffer.length >= 5 && buffer.subarray(0, 5).toString() === '%PDF-') {
      return buffer;
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

  private generateCertificatePdf(
    product: ProductWithRelations,
  ): Promise<Buffer> {
    return this.generateCertificatePdfWithTemplateLayout(product);
  }

  private async generateCertificatePdfWithTemplateLayout(
    product: ProductWithRelations,
  ): Promise<Buffer> {
    const pdfDoc = await PDFLibDocument.create();
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

    const regular = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);
    const italic = await pdfDoc.embedStandardFont(StandardFonts.HelveticaOblique);
    const boldItalic = await pdfDoc.embedStandardFont(
      StandardFonts.HelveticaBoldOblique,
    );

    // Fixed typography + baselines (kept aligned with provided template math).
    const PRODUCT_SZ = 18;
    const EOI_SZ = 15;
    const P_SZ = 12;
    const Y_PRODUCT = 341.4;
    const Y_EOI = 311.8;
    const Y_MANU1 = 283.6;
    const Y_MANU2 = 261.7;
    const Y_VALID = 239.7;

    const productName = this.safeLatinText(product.productName || 'N/A');
    const eoiNo = this.safeLatinText(product.eoiNo || 'N/A');
    const manufacturerName = this.safeLatinText(
      (
        product.manufacturer as { manufacturerName?: string } | null
      )?.manufacturerName || 'N/A',
    );
    const location = this.safeLatinText(this.deriveLocation(product));
    const validDate = this.safeLatinText(
      this.formatValidityMonthYear(product.validtillDate) || 'N/A',
    );

    this.centerInBox(page, productName, bold, PRODUCT_SZ, 0, PAGE_W, Y_PRODUCT);
    this.centerInBox(page, `(${eoiNo})`, regular, EOI_SZ, 0, PAGE_W, Y_EOI);

    const hasLocation = location.trim().length > 0;
    this.centerSegments(
      page,
      [
        { text: 'Manufactured by ', font: italic, size: P_SZ },
        { text: manufacturerName, font: boldItalic, size: P_SZ },
        ...(hasLocation
          ? [
              { text: ' at ', font: italic, size: P_SZ },
              { text: location, font: boldItalic, size: P_SZ },
            ]
          : []),
        { text: ' meets the requirements of', font: italic, size: P_SZ },
      ],
      0,
      PAGE_W,
      Y_MANU1,
    );

    this.centerSegments(
      page,
      [
        {
          text: 'GreenPro Ecolabel and qualifies as Green Product.',
          font: italic,
          size: P_SZ,
        },
      ],
      0,
      PAGE_W,
      Y_MANU2,
    );

    this.centerSegments(
      page,
      [
        { text: 'This certification is valid till ', font: italic, size: P_SZ },
        { text: validDate, font: boldItalic, size: P_SZ },
      ],
      0,
      PAGE_W,
      Y_VALID,
    );

    const bytes = await pdfDoc.save();
    return Buffer.from(bytes);
  }

  private centerInBox(
    page: PDFPage,
    text: string,
    font: PDFFont,
    size: number,
    boxLeft: number,
    boxWidth: number,
    yFromTop: number,
  ): void {
    const width = font.widthOfTextAtSize(text, size);
    const x = boxLeft + Math.max(0, (boxWidth - width) / 2);
    page.drawText(text, {
      x,
      y: this.topToBottomY(yFromTop, size),
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }

  private centerSegments(
    page: PDFPage,
    segments: Array<{ text: string; font: PDFFont; size: number }>,
    boxLeft: number,
    boxWidth: number,
    yFromTop: number,
  ): void {
    const totalWidth = segments.reduce(
      (sum, s) => sum + s.font.widthOfTextAtSize(s.text, s.size),
      0,
    );
    let x = boxLeft + Math.max(0, (boxWidth - totalWidth) / 2);
    for (const s of segments) {
      page.drawText(s.text, {
        x,
        y: this.topToBottomY(yFromTop, s.size),
        size: s.size,
        font: s.font,
        color: rgb(0, 0, 0),
      });
      x += s.font.widthOfTextAtSize(s.text, s.size);
    }
  }

  private topToBottomY(yFromTop: number, fontSize: number): number {
    return PAGE_H - yFromTop - fontSize;
  }

  private safeLatinText(value: string): string {
    return String(value ?? '').replace(/[^\x00-\xFF]/g, '?');
  }

  private deriveLocation(product: ProductWithRelations): string {
    const city = (product as unknown as { city?: string })?.city;
    const state = (product as unknown as { stateName?: string })?.stateName;
    const c = String(city ?? '').trim();
    const s = String(state ?? '').trim();
    if (c && s) return `${c}, ${s}`;
    return c || s || '';
  }

  private formatValidityMonthYear(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return d.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
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
