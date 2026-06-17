import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  assertVendorCanEditUrn as assertVendorCanEditUrnShared,
  VENDOR_URN_REVIEW_LOCK_MESSAGE,
  VENDOR_URN_REVIEW_LOCK_STATUS,
} from '../vendor/vendor-urn-edit.util';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import {
  DocumentSectionKey,
  normalizeDocumentSectionKey,
} from '../constants/document-section-key.constants';
import {
  assertAtLeastOneRawMaterialsField,
  hasAnyMeaningfulRawMaterialsSavePayload,
} from './raw-materials-upload.util';

export {
  VENDOR_URN_REVIEW_LOCK_MESSAGE,
  VENDOR_URN_REVIEW_LOCK_STATUS,
};

export type RawMaterialsAtLeastOneParams = {
  vendorId: string;
  urnNo: string;
  /** Count saved PDF/Excel (and similar) on this URN for the step. */
  documentForm?: DocumentSectionKey | string | Array<DocumentSectionKey | string>;
  files?: Express.Multer.File[];
  textValues?: Array<string | undefined | null>;
  rows?: Array<Record<string, unknown>>;
  rowKeys?: string[];
  /** Rows already stored for this step (tables without file metadata). */
  persistedRecordCount?: number;
  /** Step 15 grid / multipart body (any non-metadata field). */
  multipartBody?: Record<string, unknown>;
  /** Multipart / JSON body for partial product-row detection. */
  body?: Record<string, unknown>;
};

@Injectable()
export class RawMaterialsStepGateService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async assertVendorCanEditUrn(vendorId: string, urnNo: string): Promise<void> {
    await assertVendorCanEditUrnShared(this.productModel, vendorId, urnNo);
  }

  /** Review lock + vendor empty-form mirror (single entry for POST handlers). */
  async assertStepSubmitAllowed(
    params: RawMaterialsAtLeastOneParams,
  ): Promise<void> {
    await this.assertVendorCanEditUrn(params.vendorId, params.urnNo);
    await this.assertAtLeastOne(params);
  }

  /**
   * Vendor “≥ 1 field” mirror: incoming content, new files, saved documents, or persisted rows.
   */
  async assertAtLeastOne(params: RawMaterialsAtLeastOneParams): Promise<void> {
    const retainedDocumentCount = params.documentForm
      ? await this.countDocumentsOnUrn(
          params.vendorId,
          params.urnNo,
          params.documentForm,
        )
      : 0;

    const payloadBody = params.body ?? params.multipartBody;
    if (payloadBody && hasAnyMeaningfulRawMaterialsSavePayload(payloadBody)) {
      return;
    }

    assertAtLeastOneRawMaterialsField({
      files: params.files,
      textValues: params.textValues,
      rows: params.rows,
      rowKeys: params.rowKeys,
      body: params.body ?? params.multipartBody,
      retainedDocumentCount,
      persistedRecordCount: params.persistedRecordCount ?? 0,
    });
  }

  async countDocumentsOnUrn(
    vendorId: string,
    urnNo: string,
    documentForm: DocumentSectionKey | string | Array<DocumentSectionKey | string>,
  ): Promise<number> {
    if (!Types.ObjectId.isValid(vendorId)) {
      return 0;
    }
    const forms = Array.isArray(documentForm) ? documentForm : [documentForm];
    const normalized = [
      ...new Set(
        forms.map((f) => normalizeDocumentSectionKey(String(f))).filter(Boolean),
      ),
    ];
    if (!normalized.length) {
      return 0;
    }

    return this.allProductDocumentModel
      .countDocuments({
        vendorId: new Types.ObjectId(vendorId),
        urnNo: urnNo.trim(),
        documentForm: { $in: normalized },
        isDeleted: { $ne: true },
      })
      .exec();
  }
}
