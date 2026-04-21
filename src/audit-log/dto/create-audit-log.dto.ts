export type AuditOutcome = 'success' | 'failure';

export class CreateAuditLogDto {
  occurred_at?: Date;
  action: string;
  outcome: AuditOutcome;
  module?: string;
  action_type?: string;
  entity_name?: string;
  description?: string;
  performed_by?: {
    user_id?: string;
    name?: string;
    email?: string;
  };
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  http_method?: string;
  route?: string;
  status_code?: number;
  actor?: {
    user_id?: string;
    role?: string;
    vendor_id?: string;
    manufacturer_id?: string;
  };
  resource?: {
    type?: string;
    id?: string;
    urn_no?: string;
  };
  request?: {
    correlation_id?: string;
    ip?: string;
    user_agent?: string;
  };
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
