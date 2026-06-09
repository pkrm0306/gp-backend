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
  PROPOSAL: 'proposal',
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

export const AUDIT_MODULE_CONFIG: Record<
  AuditModule,
  { value: AuditModule; displayName: string }
> = {
  [AUDIT_MODULE.ADMIN]: { value: AUDIT_MODULE.ADMIN, displayName: 'Admin' },
  [AUDIT_MODULE.ACTIVITY_LOG]: {
    value: AUDIT_MODULE.ACTIVITY_LOG,
    displayName: 'Activity Log',
  },
  [AUDIT_MODULE.ARTICLE]: {
    value: AUDIT_MODULE.ARTICLE,
    displayName: 'Article',
  },
  [AUDIT_MODULE.CATEGORY]: {
    value: AUDIT_MODULE.CATEGORY,
    displayName: 'Category',
  },
  [AUDIT_MODULE.CERTIFICATION]: {
    value: AUDIT_MODULE.CERTIFICATION,
    displayName: 'Certification',
  },
  [AUDIT_MODULE.AUTH]: { value: AUDIT_MODULE.AUTH, displayName: 'Auth' },
  [AUDIT_MODULE.BANNER]: { value: AUDIT_MODULE.BANNER, displayName: 'Banner' },
  [AUDIT_MODULE.CONTACT]: {
    value: AUDIT_MODULE.CONTACT,
    displayName: 'Contact',
  },
  [AUDIT_MODULE.COUNTRY]: {
    value: AUDIT_MODULE.COUNTRY,
    displayName: 'Country',
  },
  [AUDIT_MODULE.DASHBOARD]: {
    value: AUDIT_MODULE.DASHBOARD,
    displayName: 'Dashboard',
  },
  [AUDIT_MODULE.DOCUMENT]: {
    value: AUDIT_MODULE.DOCUMENT,
    displayName: 'Document',
  },
  [AUDIT_MODULE.EVENT]: { value: AUDIT_MODULE.EVENT, displayName: 'Event' },
  [AUDIT_MODULE.GALLERY]: {
    value: AUDIT_MODULE.GALLERY,
    displayName: 'Gallery',
  },
  [AUDIT_MODULE.MANUFACTURER]: {
    value: AUDIT_MODULE.MANUFACTURER,
    displayName: 'Manufacturer',
  },
  [AUDIT_MODULE.MANUFACTURER_INQUIRY]: {
    value: AUDIT_MODULE.MANUFACTURER_INQUIRY,
    displayName: 'Manufacturer Inquiry',
  },
  [AUDIT_MODULE.NEWSLETTER]: {
    value: AUDIT_MODULE.NEWSLETTER,
    displayName: 'Newsletter',
  },
  [AUDIT_MODULE.PARTNER]: {
    value: AUDIT_MODULE.PARTNER,
    displayName: 'Partner',
  },
  [AUDIT_MODULE.PAYMENT]: {
    value: AUDIT_MODULE.PAYMENT,
    displayName: 'Payment',
  },
  [AUDIT_MODULE.PROCESS]: {
    value: AUDIT_MODULE.PROCESS,
    displayName: 'Process',
  },
  [AUDIT_MODULE.PRODUCT]: {
    value: AUDIT_MODULE.PRODUCT,
    displayName: 'Product',
  },
  [AUDIT_MODULE.PROPOSAL]: {
    value: AUDIT_MODULE.PROPOSAL,
    displayName: 'Proposal',
  },
  [AUDIT_MODULE.RAW_MATERIALS]: {
    value: AUDIT_MODULE.RAW_MATERIALS,
    displayName: 'Raw Materials',
  },
  [AUDIT_MODULE.RBAC]: { value: AUDIT_MODULE.RBAC, displayName: 'RBAC' },
  [AUDIT_MODULE.SECTOR]: { value: AUDIT_MODULE.SECTOR, displayName: 'Sector' },
  [AUDIT_MODULE.STANDARD]: {
    value: AUDIT_MODULE.STANDARD,
    displayName: 'Standard',
  },
  [AUDIT_MODULE.STATE]: { value: AUDIT_MODULE.STATE, displayName: 'State' },
  [AUDIT_MODULE.SUMMIT]: { value: AUDIT_MODULE.SUMMIT, displayName: 'Summit' },
  [AUDIT_MODULE.TEAM_MEMBER]: {
    value: AUDIT_MODULE.TEAM_MEMBER,
    displayName: 'Team Member',
  },
  [AUDIT_MODULE.USER]: { value: AUDIT_MODULE.USER, displayName: 'User' },
  [AUDIT_MODULE.WEBSITE]: {
    value: AUDIT_MODULE.WEBSITE,
    displayName: 'Website',
  },
  [AUDIT_MODULE.ZOHO]: { value: AUDIT_MODULE.ZOHO, displayName: 'Zoho' },
  [AUDIT_MODULE.OTHER]: { value: AUDIT_MODULE.OTHER, displayName: 'Other' },
};

export function auditModuleDisplayName(module?: string): string | null {
  if (!module) {
    return null;
  }
  return (
    AUDIT_MODULE_CONFIG[module as AuditModule]?.displayName ??
    module
      .split('_')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

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
