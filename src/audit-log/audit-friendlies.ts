/** User-facing module bucket (keep values stable for admin grids). */
export const AUDIT_MODULE = {
  CATEGORY: 'category',
  SECTOR: 'sector',
  PRODUCT: 'product',
  CERTIFICATION: 'certification',
  AUTH: 'auth',
  OTHER: 'other',
} as const;

export type AuditModule = (typeof AUDIT_MODULE)[keyof typeof AUDIT_MODULE];

export const AUDIT_ACTION_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  LOGIN: 'login',
} as const;

export type AuditActionType =
  (typeof AUDIT_ACTION_TYPE)[keyof typeof AUDIT_ACTION_TYPE];

export interface FriendlyAuditFields {
  module: AuditModule;
  action_type: AuditActionType;
  description: string;
  entity_name?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
}
