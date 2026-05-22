import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import {
  DocumentSectionKey,
  normalizeDocumentSectionKey,
} from '../constants/document-section-key.constants';
import { assertAtLeastOneRawMaterialsField } from './raw-materials-upload.util';

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
};

@Injectable()
export class RawMaterialsStepGateService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
  ) {}

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

    assertAtLeastOneRawMaterialsField({
      files: params.files,
      textValues: params.textValues,
      rows: params.rows,
      rowKeys: params.rowKeys,
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
