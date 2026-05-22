export type ZohoSyncJobType =
  | 'lead.create'
  | 'lead.convert'
  | 'deal.update'
  | 'deal.products.sync'
  | 'payment.sync'
  | 'verification.sync'
  | 'deal.close'
  | 'webhook.process';

export interface ZohoSyncJob<TPayload = Record<string, unknown>> {
  type: ZohoSyncJobType;
  payload: TPayload;
  attempts?: number;
  runAt?: Date;
}
