export type ZohoCrmModule =
  | 'Leads'
  | 'Contacts'
  | 'Accounts'
  | 'Deals'
  | 'Products';

export interface ZohoApiError {
  code?: string;
  message: string;
  details?: unknown;
}

export interface ZohoApiResponse<T = unknown> {
  ok: boolean;
  statusCode: number;
  data?: T;
  error?: ZohoApiError;
  zohoRequestId?: string;
}

export interface ZohoRecordReference {
  module: ZohoCrmModule;
  id: string;
}
