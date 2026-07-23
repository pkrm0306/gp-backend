import {
  BadRequestException,
  Injectable,
  Logger,
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
import archiver from 'archiver';
import { PassThrough } from 'stream';
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
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import { readUploadedFileBuffer } from '../../utils/upload-file-read.util';
import { formatCertificatePlantLocation } from '../utils/certificate-plant-location.util';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const CERTIFIED_PRODUCT_STATUS = 2;
const PAGE_W = 787;
const PAGE_H = 590;
const CERTIFICATE_BACKGROUND_FILES = [
  'GPAMNS281001 2_page-0001.jpg',
  'cert-bg2.jpg',
  'cert-bg.jpg',
] as const;

export type CertificateDownloadFile = {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  /** Present for portfolio downloads — number of plant certificate PDFs inside. */
  certificateCount?: number;
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

type PlantWithGeo = {
  id: string;
  productPlantId: number;
  plantName?: string;
  plantLocation?: string;
  city?: string;
  stateName?: string | null;
  additionalPlantInfo?: string;
};

export type EoiPlantCertificateItem = {
  plantId: string;
  productPlantId: number;
  plantName: string;
  location: string;
  order: number;
  downloadPath: string;
};

export type EoiPlantCertificateList = {
  productId: string;
  eoiNo: string;
  productName: string;
  plantCount: number;
  plants: EoiPlantCertificateItem[];
  downloads: {
    mergedPdfPath: string;
    zipPath: string;
  };
};

@Injectable()
export class VendorCertificateService {
  private readonly logger = new Logger(VendorCertificateService.name);
  /** Reused across one download-all run so we do not re-fetch artwork 100s of times. */
  private certificateBackgroundBytesPromise: Promise<Buffer | null> | null = null;

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
  ) {}

  async downloadEoiCertificate(
    vendorId: string,
    productId: string,
    format: 'merged' | 'zip' = 'merged',
  ): Promise<CertificateDownloadFile> {
    const product = await this.loadCertifiedProductForVendor(vendorId, productId);
    const plants = this.resolveEffectivePlantsForCertificates(
      product,
      await this.loadPlantsForProduct(product),
    );

    if (format === 'zip') {
      return this.downloadEoiCertificateZip(product, plants);
    }

    const buffer = await this.mergePlantCertificateBuffers(
      product,
      plants,
      `No certificate files are available for EOI ${product.eoiNo}`,
    );
    return {
      buffer,
      fileName: this.buildCertificateFileName(product.eoiNo, plants.length),
      contentType: 'application/pdf',
    };
  }

  /**
   * Admin certificate correction preview — load certified product by EOI (no vendor scope)
   and regenerate PDF from current DB fields (skips stale stored cert documents).
   */
  async regenerateCertificatePdfByEoiNo(
    eoiNo: string,
  ): Promise<CertificateDownloadFile> {
    const trimmed = String(eoiNo ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('EOI number is required');
    }

    const productDoc = await this.productModel
      .findOne(
        matchActiveProducts({
          eoiNo: trimmed,
          productStatus: CERTIFIED_PRODUCT_STATUS,
        }),
      )
      .exec();

    if (!productDoc) {
      throw new NotFoundException('EOI number not found!');
    }

    const product = await this.hydrateProduct(productDoc);
    const plants = this.resolveEffectivePlantsForCertificates(
      product,
      await this.loadPlantsForProduct(product),
    );

    if (!plants.length) {
      throw new NotFoundException(
        `No plants found for EOI ${product.eoiNo}`,
      );
    }

    const mergedPdf = await PDFLibDocument.create();
    let addedPages = 0;
    for (const plant of plants) {
      try {
        const location = this.derivePlantLocation(plant);
        const buffer = await this.generateCertificatePdfSafe(product, location);
        const src = await PDFLibDocument.load(buffer);
        const pages = await mergedPdf.copyPages(src, src.getPageIndices());
        for (const p of pages) {
          mergedPdf.addPage(p);
        }
        addedPages += pages.length;
      } catch (err) {
        this.logger.warn(
          `Failed regenerating plant cert for EOI ${product.eoiNo}: ${
            (err as Error)?.message ?? err
          }`,
        );
      }
    }

    if (addedPages === 0) {
      throw new NotFoundException(
        `Unable to generate certificate PDF for EOI ${product.eoiNo}`,
      );
    }

    return {
      buffer: Buffer.from(await mergedPdf.save()),
      fileName: this.buildCertificateFileName(product.eoiNo, plants.length),
      contentType: 'application/pdf',
    };
  }

  async listEoiPlantCertificates(
    vendorId: string,
    productId: string,
  ): Promise<EoiPlantCertificateList> {
    const product = await this.loadCertifiedProductForVendor(vendorId, productId);
    const plants = this.resolveEffectivePlantsForCertificates(
      product,
      await this.loadPlantsForProduct(product),
    );
    const trimmedProductId = String(product._id);

    return {
      productId: trimmedProductId,
      eoiNo: String(product.eoiNo ?? ''),
      productName: String(product.productName ?? ''),
      plantCount: plants.length,
      plants: plants.map((plant, index) => ({
        plantId: plant.id,
        productPlantId: plant.productPlantId,
        plantName: String(plant.plantName ?? `Plant ${index + 1}`),
        location: this.derivePlantLocation(plant),
        order: index + 1,
        downloadPath: this.buildPlantCertificatePath(trimmedProductId, plant.id),
      })),
      downloads: {
        mergedPdfPath: this.buildEoiCertificatePath(trimmedProductId, 'merged'),
        zipPath: this.buildEoiCertificatePath(trimmedProductId, 'zip'),
      },
    };
  }

  async downloadEoiPlantCertificate(
    vendorId: string,
    productId: string,
    plantId: string,
  ): Promise<CertificateDownloadFile> {
    const product = await this.loadCertifiedProductForVendor(vendorId, productId);
    const plant = await this.loadPlantForProduct(product, plantId);
    const buffer = await this.resolvePlantCertificateBuffer(product, plant);

    return {
      buffer,
      fileName: this.buildPlantCertificateFileName(
        product.eoiNo,
        plant.plantName,
        plant.productPlantId,
        plant.id,
        String(product._id),
      ),
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
        this.matchCertifiedProductsForVendor(vendorObjectId, {
          urnNo: trimmedUrn,
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
        const plants = this.resolveEffectivePlantsForCertificates(
          product,
          await this.loadPlantsForProduct(product),
        );

        const plantBuffer = await this.mergePlantCertificateBuffers(product, plants);
        const src = await PDFLibDocument.load(plantBuffer);
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

  /** All plant certificates across every certified EOI for the logged-in vendor. */
  async downloadVendorAllCertifiedCertificates(
    vendorId: string,
    _format: 'merged' | 'zip' = 'zip',
  ): Promise<CertificateDownloadFile> {
    const vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
    const products = await this.listCertifiedProductsForVendor(vendorObjectId);

    if (!products.length) {
      throw new NotFoundException(
        'No certified products found for this vendor',
      );
    }

    // Warm background once for the whole portfolio download.
    this.certificateBackgroundBytesPromise = this.loadCertificateBackgroundBytesFresh();
    try {
      const hydrated = await this.hydrateProductsInBatches(products);
      const plantsByProductId = await this.loadPlantsGroupedByProductIds(
        hydrated.map((product) => product._id as Types.ObjectId),
      );

      const entries: Array<{
        product: ProductWithRelations;
        plant: PlantWithGeo;
        orderKey: string;
      }> = [];

      for (const product of hydrated) {
        const productId = String(product._id);
        const plants = plantsByProductId.get(productId) ?? [];
        const effectivePlants = this.resolveEffectivePlantsForCertificates(
          product,
          plants,
        );

        for (const [index, plant] of effectivePlants.entries()) {
          entries.push({
            product,
            plant,
            orderKey: `${String(product.eoiNo ?? '')}_${String(plant.productPlantId || index + 1)}_${plant.id}`,
          });
        }
      }

      if (!entries.length) {
        throw new NotFoundException(
          'No certificate files are available for this vendor',
        );
      }

      this.logger.log(
        `[downloadVendorAll] vendor=${vendorId} products=${hydrated.length} certificates=${entries.length} format=zip`,
      );

      // Always ZIP for portfolio downloads. Merged PDFs truncate around ~200 pages
      // (pdf-lib / client limits) — that is why vendors saw 199 of 209.
      const files: Array<{ name: string; buffer: Buffer }> = [];

      for (const [index, entry] of entries.entries()) {
        const buffer = await this.generateCertificatePdfSafe(
          entry.product,
          this.derivePlantLocation(entry.plant),
        );
        const seq = String(index + 1).padStart(3, '0');
        const baseName = this.buildPlantCertificateFileName(
          entry.product.eoiNo,
          entry.plant.plantName,
          entry.plant.productPlantId || index + 1,
          entry.plant.id,
          String(entry.product._id),
        );
        files.push({
          name: `${seq}_${baseName}`,
          buffer,
        });
      }

      const zipBuffer = await this.buildZipBuffer(files);
      return {
        buffer: zipBuffer,
        fileName: 'GreenPro_Certificates_All_Plants.zip',
        contentType: 'application/zip',
        certificateCount: files.length,
      };
    } finally {
      this.certificateBackgroundBytesPromise = null;
    }
  }

  async countVendorCertifiedPlantCertificates(vendorId: string): Promise<number> {
    const vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
    const products = await this.productModel
      .find(this.matchCertifiedProductsForVendor(vendorObjectId))
      .select({ _id: 1, plantCount: 1 })
      .lean()
      .exec();

    // Exact same total as the certified-products list: sum of each EOI `plantCount`.
    let total = 0;
    for (const product of products) {
      const declared = Number((product as { plantCount?: number }).plantCount ?? 0);
      total += declared > 0 ? declared : 1;
    }
    return total;
  }

  private matchCertifiedProductsForVendor(
    vendorObjectId: Types.ObjectId,
    extra: Record<string, unknown> = {},
  ): Record<string, unknown> {
    const now = new Date();
    // Match vendor certified list (status 2, not expired) so Download all = UI total.
    return matchActiveProducts({
      ...extra,
      productStatus: CERTIFIED_PRODUCT_STATUS,
      $and: [
        {
          $or: [
            { vendorId: vendorObjectId },
            { manufacturerId: vendorObjectId },
          ],
        },
        {
          $or: [
            { validtillDate: null },
            { validtillDate: { $exists: false } },
            { validtillDate: { $gte: now } },
          ],
        },
      ],
    });
  }

  private async hydrateProductsInBatches(
    products: ProductDocument[],
    batchSize = 25,
  ): Promise<ProductWithRelations[]> {
    const hydrated: ProductWithRelations[] = [];
    for (let i = 0; i < products.length; i += batchSize) {
      const chunk = products.slice(i, i + batchSize);
      const chunkHydrated = await Promise.all(
        chunk.map((product) => this.hydrateProduct(product)),
      );
      hydrated.push(...chunkHydrated);
    }
    return hydrated;
  }

  private async loadPlantsGroupedByProductIds(
    productIds: Types.ObjectId[],
  ): Promise<Map<string, PlantWithGeo[]>> {
    const grouped = new Map<string, PlantWithGeo[]>();
    if (!productIds.length) {
      return grouped;
    }

    // Include every plant row (no soft-delete / plantStatus filter) so location
    // data is available; certificate count still follows product.plantCount.
    const rows = await this.productPlantModel
      .aggregate([
        {
          $match: {
            $or: [
              { productId: { $in: productIds } },
              { productId: { $in: productIds.map((id) => String(id)) } },
            ],
          },
        },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        { $sort: { createdDate: 1, productPlantId: 1 } },
      ])
      .exec();

    for (const row of rows) {
      const productId = String(row.productId ?? '');
      if (!productId) continue;
      const stateDoc = Array.isArray(row.state)
        ? (row.state[0] as Record<string, unknown> | undefined)
        : undefined;
      const plant: PlantWithGeo = {
        id: String(row._id),
        productPlantId: Number(row.productPlantId ?? 0),
        plantName: row.plantName,
        plantLocation: row.plantLocation,
        city: row.city,
        additionalPlantInfo: String(
          row.additionalPlantInfo ?? row.additional_plant_info ?? '',
        ).trim() || undefined,
        stateName:
          (stateDoc?.stateName as string | undefined) ??
          (stateDoc?.name as string | undefined) ??
          null,
      };
      const list = grouped.get(productId) ?? [];
      list.push(plant);
      grouped.set(productId, list);
    }

    return grouped;
  }

  /**
   * Vendor certified list shows `plantCount` per EOI. Include every plant row and
   * pad up to plantCount when rows are missing — never drop plants.
   */
  private resolveEffectivePlantsForCertificates(
    product: ProductWithRelations,
    plants: PlantWithGeo[],
  ): PlantWithGeo[] {
    const declared = Number(product.plantCount ?? 0);
    const target = Math.max(plants.length, declared > 0 ? declared : 0, 1);

    if (plants.length === 0) {
      return this.synthesizePlantsFromProductCount(product, target);
    }

    if (plants.length >= target) {
      return plants;
    }

    const padded = [...plants];
    for (let index = plants.length; index < target; index += 1) {
      padded.push({
        id: `synthetic-${String(product._id)}-${index + 1}`,
        productPlantId: index + 1,
        plantName: `Plant ${index + 1}`,
        plantLocation: plants[0]?.plantLocation ?? '',
        city: plants[0]?.city ?? '',
        additionalPlantInfo: plants[0]?.additionalPlantInfo,
        stateName: plants[0]?.stateName ?? null,
      });
    }
    return padded;
  }

  private synthesizePlantsFromProductCount(
    product: ProductWithRelations,
    overrideCount?: number,
  ): PlantWithGeo[] {
    const declared = Number(product.plantCount ?? 0);
    const count =
      overrideCount && overrideCount > 0
        ? overrideCount
        : declared > 0
          ? declared
          : 1;
    return Array.from({ length: count }, (_, index) => ({
      id: `synthetic-${String(product._id)}-${index + 1}`,
      productPlantId: index + 1,
      plantName: `Plant ${index + 1}`,
      plantLocation: '',
      city: '',
      stateName: null,
    }));
  }

  private listCertifiedProductsForVendor(vendorObjectId: Types.ObjectId) {
    return this.productModel
      .find(this.matchCertifiedProductsForVendor(vendorObjectId))
      .sort({ eoiNo: 1 })
      .exec();
  }

  private async collectPlantCertificateBuffers(
    product: ProductWithRelations,
    plantsOverride?: PlantWithGeo[],
  ): Promise<Buffer[]> {
    const plants = this.resolveEffectivePlantsForCertificates(
      product,
      plantsOverride ?? (await this.loadPlantsForProduct(product)),
    );
    const buffers: Buffer[] = [];

    for (const plant of plants) {
      buffers.push(
        await this.generateCertificatePdfSafe(
          product,
          this.derivePlantLocation(plant),
        ),
      );
    }

    return buffers;
  }

  private async appendBufferToMergedPdf(
    mergedPdf: PDFLibDocument,
    buffer: Buffer,
  ): Promise<number> {
    const src = await PDFLibDocument.load(buffer);
    const pages = await mergedPdf.copyPages(src, src.getPageIndices());
    for (const page of pages) {
      mergedPdf.addPage(page);
    }
    return pages.length;
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
          productStatus: CERTIFIED_PRODUCT_STATUS,
          $and: [
            {
              $or: [
                { vendorId: vendorObjectId },
                { manufacturerId: vendorObjectId },
              ],
            },
          ],
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

  private async loadPlantsForProduct(
    product: ProductWithRelations,
  ): Promise<PlantWithGeo[]> {
    // Do not filter by is_deleted / plantStatus — certificates follow plantCount.
    const rows = await this.productPlantModel
      .aggregate([
        {
          $match: {
            $or: [
              { productId: product._id },
              { productId: String(product._id) },
            ],
          },
        },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        { $sort: { createdDate: 1, productPlantId: 1 } },
      ])
      .exec();

    return rows.map((row) => {
      const stateDoc = Array.isArray(row.state)
        ? (row.state[0] as Record<string, unknown> | undefined)
        : undefined;
      return {
        id: String(row._id),
        productPlantId: Number(row.productPlantId ?? 0),
        plantName: row.plantName,
        plantLocation: row.plantLocation,
        city: row.city,
        additionalPlantInfo: String(
          row.additionalPlantInfo ?? row.additional_plant_info ?? '',
        ).trim() || undefined,
        stateName:
          (stateDoc?.stateName as string | undefined) ??
          (stateDoc?.name as string | undefined) ??
          null,
      };
    });
  }

  private async loadPlantForProduct(
    product: ProductWithRelations,
    plantId: string,
  ): Promise<PlantWithGeo> {
    const trimmedPlantId = String(plantId ?? '').trim();
    if (!Types.ObjectId.isValid(trimmedPlantId)) {
      throw new BadRequestException('Invalid plant id');
    }

    const rows = await this.productPlantModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(trimmedPlantId),
            $or: [
              { productId: product._id },
              { productId: String(product._id) },
            ],
          },
        },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        { $limit: 1 },
      ])
      .exec();

    const row = rows[0];
    if (!row) {
      throw new NotFoundException('Plant not found for this certified EOI');
    }

    const stateDoc = Array.isArray(row.state)
      ? (row.state[0] as Record<string, unknown> | undefined)
      : undefined;

    return {
      id: String(row._id),
      productPlantId: Number(row.productPlantId ?? 0),
      plantName: row.plantName,
      plantLocation: row.plantLocation,
      city: row.city,
      additionalPlantInfo: String(
        row.additionalPlantInfo ?? row.additional_plant_info ?? '',
      ).trim() || undefined,
      stateName:
        (stateDoc?.stateName as string | undefined) ??
        (stateDoc?.name as string | undefined) ??
        null,
    };
  }

  private async downloadEoiCertificateZip(
    product: ProductWithRelations,
    plants: PlantWithGeo[],
  ): Promise<CertificateDownloadFile> {
    const files: Array<{ name: string; buffer: Buffer }> = [];

    for (const [index, plant] of plants.entries()) {
      try {
        const buffer = await this.resolvePlantCertificateBuffer(product, plant);
        files.push({
          name: this.buildPlantCertificateFileName(
            product.eoiNo,
            plant.plantName,
            plant.productPlantId || index + 1,
            plant.id,
            String(product._id),
          ),
          buffer,
        });
      } catch {
        /* skip invalid plant certificate rows */
      }
    }

    if (!files.length) {
      throw new NotFoundException(
        `No certificate files are available for EOI ${product.eoiNo}`,
      );
    }

    const zipBuffer = await this.buildZipBuffer(files);
    return {
      buffer: zipBuffer,
      fileName: this.buildCertificateZipFileName(product.eoiNo),
      contentType: 'application/zip',
    };
  }

  private async buildZipBuffer(
    files: Array<{ name: string; buffer: Buffer }>,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const stream = new PassThrough();
      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
      archive.on('error', reject);
      archive.pipe(stream);

      for (const file of files) {
        archive.append(file.buffer, { name: file.name });
      }

      void archive.finalize();
    });
  }

  private async mergePlantCertificateBuffers(
    product: ProductWithRelations,
    plants: PlantWithGeo[],
    emptyMessage?: string,
  ): Promise<Buffer> {
    const mergedPdf = await PDFLibDocument.create();
    let addedPages = 0;

    for (const plant of plants) {
      try {
        const buffer = await this.resolvePlantCertificateBuffer(product, plant);
        const src = await PDFLibDocument.load(buffer);
        const pages = await mergedPdf.copyPages(src, src.getPageIndices());
        for (const p of pages) {
          mergedPdf.addPage(p);
        }
        addedPages += pages.length;
      } catch {
        /* skip invalid plant certificate rows */
      }
    }

    if (addedPages === 0) {
      throw new NotFoundException(
        emptyMessage ?? 'No certificate files are available for this EOI',
      );
    }

    return Buffer.from(await mergedPdf.save());
  }

  private async resolvePlantCertificateBuffer(
    product: ProductWithRelations,
    plant: PlantWithGeo,
  ): Promise<Buffer> {
    const location = this.derivePlantLocation(plant);
    return this.generateCertificatePdf(product, location);
  }

  private async resolveCertificateBuffer(
    product: ProductWithRelations,
    locationOverride?: string,
  ): Promise<Buffer> {
    const fromDocument = await this.readCertificateFromDocuments(product);
    if (fromDocument) {
      return this.ensurePdfBuffer(product, fromDocument, locationOverride);
    }

    if (product.assessmentReportUrl) {
      const fromAssessment = await readUploadedFileBuffer(
        product.assessmentReportUrl,
      );
      if (fromAssessment?.length) {
        return this.ensurePdfBuffer(
          product,
          fromAssessment,
          locationOverride,
        );
      }
    }

    for (const relativePath of this.buildCertificatePathCandidates(product)) {
      const buffer = await readUploadedFileBuffer(relativePath);
      if (buffer?.length) {
        return this.ensurePdfBuffer(product, buffer, locationOverride);
      }
    }

    return this.generateCertificatePdf(product, locationOverride);
  }

  private ensurePdfBuffer(
    product: ProductWithRelations,
    buffer: Buffer,
    locationOverride?: string,
  ): Buffer | Promise<Buffer> {
    if (buffer.length >= 5 && buffer.subarray(0, 5).toString() === '%PDF-') {
      return buffer;
    }
    return this.generateCertificatePdf(product, locationOverride);
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
    locationOverride?: string,
  ): Promise<Buffer> {
    return this.generateCertificatePdfWithTemplateLayout(
      product,
      locationOverride,
    );
  }

  /** Never drop a plant slot — retry with safe location, then a minimal PDF. */
  private async generateCertificatePdfSafe(
    product: ProductWithRelations,
    locationOverride?: string,
  ): Promise<Buffer> {
    try {
      return await this.generateCertificatePdf(product, locationOverride);
    } catch (error) {
      this.logger.warn(
        `[certificate] retry without location product=${String(product._id)}: ${(error as Error)?.message || error}`,
      );
    }
    try {
      return await this.generateCertificatePdf(product, '');
    } catch (error) {
      this.logger.warn(
        `[certificate] fallback minimal PDF product=${String(product._id)}: ${(error as Error)?.message || error}`,
      );
      return this.generateMinimalCertificatePdf(product);
    }
  }

  private async generateMinimalCertificatePdf(
    product: ProductWithRelations,
  ): Promise<Buffer> {
    const pdfDoc = await PDFLibDocument.create();
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
    const label = this.safeLatinText(
      `${product.productName || 'Product'} (${product.eoiNo || 'EOI'})`,
    );
    page.drawText(label.slice(0, 80) || 'GreenPro Certificate', {
      x: 72,
      y: PAGE_H / 2,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    return Buffer.from(await pdfDoc.save());
  }

  private resolveCertificateBackgroundPath(): string | null {
    const roots = [
      join(process.cwd(), 'uploads', 'certificates'),
      join(process.cwd(), 'public', 'certificate'),
    ];
    for (const fileName of CERTIFICATE_BACKGROUND_FILES) {
      for (const root of roots) {
        const candidate = join(root, fileName);
        if (existsSync(candidate)) return candidate;
      }
    }
    return null;
  }

  private async loadCertificateBackgroundBytes(): Promise<Buffer | null> {
    if (!this.certificateBackgroundBytesPromise) {
      this.certificateBackgroundBytesPromise =
        this.loadCertificateBackgroundBytesFresh();
    }
    return this.certificateBackgroundBytesPromise;
  }

  private async loadCertificateBackgroundBytesFresh(): Promise<Buffer | null> {
    const bgPath = this.resolveCertificateBackgroundPath();
    if (bgPath) {
      try {
        return readFileSync(bgPath);
      } catch {
        /* fall through to remote static assets */
      }
    }

    const base = String(
      process.env.CERTIFICATE_ASSET_BASE_URL ??
        'https://greenpro-portals.vercel.app/vendor/certificate',
    )
      .trim()
      .replace(/\/+$/, '');
    if (!base) return null;

    for (const fileName of CERTIFICATE_BACKGROUND_FILES) {
      const url = `${base}/${encodeURIComponent(fileName)}`;
      try {
        const res = await fetch(url);
        if (res.ok) return Buffer.from(await res.arrayBuffer());
      } catch {
        /* try next candidate */
      }
    }
    return null;
  }

  private async embedCertificateBackground(
    pdfDoc: PDFLibDocument,
    page: PDFPage,
  ): Promise<void> {
    const bytes = await this.loadCertificateBackgroundBytes();
    if (!bytes) return;

    try {
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
      const image = isJpeg
        ? await pdfDoc.embedJpg(bytes)
        : await pdfDoc.embedPng(bytes);
      page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    } catch {
      /* keep text-only page when artwork cannot be loaded */
    }
  }

  private async generateCertificatePdfWithTemplateLayout(
    product: ProductWithRelations,
    locationOverride?: string,
  ): Promise<Buffer> {
    const pdfDoc = await PDFLibDocument.create();
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

    await this.embedCertificateBackground(pdfDoc, page);

    const regular = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);
    const italic = await pdfDoc.embedStandardFont(StandardFonts.HelveticaOblique);
    const boldItalic = await pdfDoc.embedStandardFont(
      StandardFonts.HelveticaBoldOblique,
    );

    // Fixed typography + baselines (pdf-lib bottom-origin — match website/vendor).
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
    const location = this.safeLatinText(
      locationOverride?.trim() || this.deriveLocation(product),
    );
    const validDate = this.safeLatinText(
      this.formatValidityMonthYear(product.validtillDate) || 'N/A',
    );

    this.centerInBox(page, productName, bold, PRODUCT_SZ, 0, PAGE_W, Y_PRODUCT);
    this.centerInBox(page, `(${eoiNo})`, regular, EOI_SZ, 0, PAGE_W, Y_EOI);

    const hasLocation = location.trim().length > 0;
    // Put the boundary space on the preceding run (location or manufacturer).
    // pdf-lib drawText often drops a leading space on the next segment after a font change.
    this.centerSegments(
      page,
      [
        { text: 'Manufactured by ', font: italic, size: P_SZ },
        {
          text: hasLocation ? manufacturerName : `${manufacturerName} `,
          font: boldItalic,
          size: P_SZ,
        },
        ...(hasLocation
          ? [
              { text: ' at ', font: italic, size: P_SZ },
              { text: `${location} `, font: boldItalic, size: P_SZ },
            ]
          : []),
        { text: 'meets the requirements of', font: italic, size: P_SZ },
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

  private safeLatinText(value: string): string {
    // Helvetica (WinAnsi) rejects many Unicode glyphs; keep printable ASCII to avoid PDF generation failures.
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, '?')
      .trim();
  }

  private centerInBox(
    page: PDFPage,
    text: string,
    font: PDFFont,
    size: number,
    boxLeft: number,
    boxWidth: number,
    /** pdf-lib Y (bottom-origin), same constants as website/vendor certificates */
    y: number,
  ): void {
    const safe = text || 'N/A';
    try {
      const width = font.widthOfTextAtSize(safe, size);
      const x = boxLeft + Math.max(0, (boxWidth - width) / 2);
      page.drawText(safe, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    } catch {
      page.drawText('N/A', {
        x: boxLeft + boxWidth / 2 - 10,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }

  private centerSegments(
    page: PDFPage,
    segments: Array<{ text: string; font: PDFFont; size: number }>,
    boxLeft: number,
    boxWidth: number,
    /** pdf-lib Y (bottom-origin), same constants as website/vendor certificates */
    y: number,
  ): void {
    const safeSegments = segments.map((s) => ({
      ...s,
      text: s.text || '',
    }));
    try {
      const totalWidth = safeSegments.reduce(
        (sum, s) => sum + s.font.widthOfTextAtSize(s.text, s.size),
        0,
      );
      let x = boxLeft + Math.max(0, (boxWidth - totalWidth) / 2);
      for (const s of safeSegments) {
        if (!s.text) continue;
        page.drawText(s.text, {
          x,
          y,
          size: s.size,
          font: s.font,
          color: rgb(0, 0, 0),
        });
        x += s.font.widthOfTextAtSize(s.text, s.size);
      }
    } catch {
      page.drawText('N/A', {
        x: boxLeft + boxWidth / 2 - 10,
        y,
        size: 12,
        font: safeSegments[0]?.font,
        color: rgb(0, 0, 0),
      });
    }
  }

  private deriveLocation(product: ProductWithRelations): string {
    const city = (product as unknown as { city?: string })?.city;
    const state = (product as unknown as { stateName?: string })?.stateName;
    const c = String(city ?? '').trim();
    const s = String(state ?? '').trim();
    if (c && s) return `${c}, ${s}`;
    return c || s || '';
  }

  private derivePlantLocation(plant: PlantWithGeo): string {
    return formatCertificatePlantLocation({
      additionalPlantInfo: plant.additionalPlantInfo,
      city: plant.city,
      stateName: plant.stateName,
      plantLocation: plant.plantLocation,
    });
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

  private buildCertificateFileName(
    eoiNo?: string | null,
    plantCount = 1,
  ): string {
    const safe = String(eoiNo ?? 'certificate')
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    if (plantCount > 1) {
      return `GreenPro_Certificates_${safe || 'certificate'}.pdf`;
    }
    return `GreenPro_Certificate_${safe || 'certificate'}.pdf`;
  }

  private buildCertificateZipFileName(eoiNo?: string | null): string {
    const safe = String(eoiNo ?? 'certificate')
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    return `GreenPro_Certificates_${safe || 'certificate'}.zip`;
  }

  private buildPlantCertificateFileName(
    eoiNo?: string | null,
    plantName?: string | null,
    plantKey?: string | number | null,
    plantId?: string | null,
    productId?: string | null,
  ): string {
    const safeEoi = String(eoiNo ?? 'certificate')
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '_');
    const safePlant = String(plantName ?? plantKey ?? 'plant')
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '_');
    const safePlantId = String(plantId ?? plantKey ?? '')
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .slice(-12);
    const safeProductId = String(productId ?? '')
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .slice(-8);
    const unique = [safePlantId, safeProductId].filter(Boolean).join('_');
    return `GreenPro_Certificate_${safeEoi}_${safePlant}${unique ? `_${unique}` : ''}.pdf`;
  }

  private buildEoiCertificatePath(
    productId: string,
    format: 'merged' | 'zip',
  ): string {
    const suffix = format === 'zip' ? '?format=zip' : '';
    return `/products/certificates/eoi/${productId}${suffix}`;
  }

  private buildPlantCertificatePath(productId: string, plantId: string): string {
    return `/products/certificates/eoi/${productId}/plants/${plantId}`;
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
