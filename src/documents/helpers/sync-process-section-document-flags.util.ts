import { Connection } from 'mongoose';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import { Model } from 'mongoose';

type FlagTarget = {
  collection: string;
  field: string;
  emptyValue: number | null;
};

const SUBSECTION_FLAG_TARGETS: Partial<
  Record<DocumentSectionKey, Record<string, FlagTarget>>
> = {
  [DocumentSectionKey.PROCESS_MANUFACTURING]: {
    energy_conservation_supporting_documents: {
      collection: 'process_manufacturing',
      field: 'energyConservationSupportingDocuments',
      emptyValue: null,
    },
    energy_consumption_documents: {
      collection: 'process_manufacturing',
      field: 'energyConsumptionDocuments',
      emptyValue: null,
    },
  },
  [DocumentSectionKey.PROCESS_WASTE_MANAGEMENT]: {
    wm_supporting_documents: {
      collection: 'process_waste_management',
      field: 'wmSupportingDocuments',
      emptyValue: null,
    },
  },
  [DocumentSectionKey.PROCESS_INNOVATION]: {
    innovation_implementation_documents: {
      collection: 'process_innovation',
      field: 'innovationImplementationDocuments',
      emptyValue: 0,
    },
  },
  [DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP]: {
    sea_supporting_documents: {
      collection: 'process_product_stewardship',
      field: 'seaSupportingDocuments',
      emptyValue: null,
    },
    qm_supporting_documents: {
      collection: 'process_product_stewardship',
      field: 'qmSupportingDocuments',
      emptyValue: null,
    },
    epr_supporting_documents: {
      collection: 'process_product_stewardship',
      field: 'eprSupportingDocuments',
      emptyValue: null,
    },
  },
};

/**
 * After a document delete, clear section "file available" flags when no active
 * documents remain for that subsection (fixes ghost files on URN detail UI).
 */
export async function syncProcessSectionDocumentFlags(params: {
  documentModel: Model<AllProductDocumentDocument>;
  connection: Connection;
  urnNo: string;
  documentForm: DocumentSectionKey | string;
  documentFormSubsection?: string | null;
}): Promise<void> {
  const sectionKey = params.documentForm as DocumentSectionKey;
  const subsection = String(params.documentFormSubsection ?? '').trim();
  const subsectionMap = SUBSECTION_FLAG_TARGETS[sectionKey];
  if (!subsectionMap) {
    return;
  }

  const target = subsectionMap[subsection];
  if (!target) {
    return;
  }

  const activeCount = await params.documentModel.countDocuments({
    urnNo: params.urnNo,
    documentForm: sectionKey,
    documentFormSubsection: subsection,
    isDeleted: { $ne: true },
  });

  const nextValue = activeCount > 0 ? 1 : target.emptyValue;
  await params.connection.collection(target.collection).updateOne(
    { urnNo: params.urnNo },
    {
      $set: {
        [target.field]: nextValue,
        updatedDate: new Date(),
      },
    },
  );
}
