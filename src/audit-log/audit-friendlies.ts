/** User-facing module bucket (keep values stable for admin grids). */
export const AUDIT_MODULE = {
  ADMIN: 'admin',
  ACTIVITY_LOG: 'activity_log',
  ARTICLE: 'article',
  CATEGORY: 'category',
  CERTIFICATION: 'certification',
  AUTH: 'auth',
  BANNER: 'banner',
  CONTACT: 'contact',
  COUNTRY: 'country',
  DASHBOARD: 'dashboard',
  DOCUMENT: 'document',
  EVENT: 'event',
  GALLERY: 'gallery',
  MANUFACTURER: 'manufacturer',
  MANUFACTURER_INQUIRY: 'manufacturer_inquiry',
  NEWSLETTER: 'newsletter',
  PARTNER: 'partner',
  PAYMENT: 'payment',
  PROCESS: 'process',
  PRODUCT: 'product',
  RAW_MATERIALS: 'raw_materials',
  RBAC: 'rbac',
  SECTOR: 'sector',
  STANDARD: 'standard',
  STATE: 'state',
  SUMMIT: 'summit',
  TEAM_MEMBER: 'team_member',
  USER: 'user',
  WEBSITE: 'website',
  ZOHO: 'zoho',
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
