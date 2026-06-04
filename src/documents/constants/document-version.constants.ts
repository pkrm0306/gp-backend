export const DOCUMENT_PROCESS_TYPE_VALUES = ['initial', 'renewal'] as const;
export type DocumentProcessType = (typeof DOCUMENT_PROCESS_TYPE_VALUES)[number];

export const DOCUMENT_VERSION_ACTION_VALUES = [
  'added',
  'replaced',
  'deleted',
] as const;
export type DocumentVersionAction =
  (typeof DOCUMENT_VERSION_ACTION_VALUES)[number];

export const ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE = 'all_product_documents';
export const PAYMENT_DETAILS_LIVE_SOURCE = 'payment_details';
