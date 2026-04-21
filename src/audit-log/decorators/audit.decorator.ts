import { SetMetadata } from '@nestjs/common';

export const AUDIT_METADATA_KEY = 'audit_metadata';

export interface AuditRouteMetadata {
  /** Overrides inferred HTTP action */
  action?: string;
  resource_type?: string;
  /** Route param name whose value becomes resource.id */
  resource_param?: string;
  /** Route param name whose value becomes resource.urn_no */
  urn_param?: string;
}

export const Audit = (meta: AuditRouteMetadata) =>
  SetMetadata(AUDIT_METADATA_KEY, meta);
