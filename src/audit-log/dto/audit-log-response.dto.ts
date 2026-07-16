import { auditModuleDisplayName } from '../audit-friendlies';
import { formatAuditInstant } from '../audit-date.util';

export type AuditJsonObject = Record<string, unknown>;

export interface AuditLogResponseDto extends AuditJsonObject {
  id: string | null;
  occurred_at: string | null;
  action: string | null;
  outcome: string | null;
  module: string | null;
  module_display: string | null;
  action_type: string | null;
  action_display: string | null;
  entity_name: string | null;
  description: string | null;
  performed_by: AuditJsonObject | null;
  old_values: AuditJsonObject | null;
  new_values: AuditJsonObject | null;
  http_method: string | null;
  route: string | null;
  status_code: number | null;
  actor: AuditJsonObject | null;
  resource: AuditJsonObject | null;
  request: AuditJsonObject | null;
  changes: AuditJsonObject | null;
  metadata: AuditJsonObject | null;
  user_display: string | null;
}

/**
 * Allowlisted API shape for a presented audit row.
 * Field filtering / humanization must already be applied by AuditPayloadPresenter.
 * Spreading raw documents is intentionally avoided so framework fields never leak.
 */
export function toAuditLogResponseDto(
  row: AuditJsonObject,
): AuditLogResponseDto {
  const performedBy = objectOrNull(row['performed_by']);
  const actor = objectOrNull(row['actor']);
  const actionType = stringOrNull(row['action_type']);
  const module = stringOrNull(row['module']);

  const dto: AuditLogResponseDto = {
    id: idString(row['_id'] ?? row['id']),
    occurred_at: formatAuditInstant(row['occurred_at']),
    action: stringOrNull(row['action']),
    outcome: stringOrNull(row['outcome']),
    module,
    module_display: auditModuleDisplayName(module ?? undefined),
    action_type: actionType,
    action_display: actionType,
    entity_name: stringOrNull(row['entity_name']),
    description: stringOrNull(row['description']),
    performed_by: performedBy,
    old_values: objectOrNull(row['old_values']),
    new_values: objectOrNull(row['new_values']),
    http_method: stringOrNull(row['http_method']),
    route: stringOrNull(row['route']),
    status_code:
      typeof row['status_code'] === 'number' ? row['status_code'] : null,
    actor,
    resource: objectOrNull(row['resource']),
    request: objectOrNull(row['request']),
    changes: objectOrNull(row['changes']),
    metadata: objectOrNull(row['metadata']),
    user_display: userDisplay(performedBy, actor),
  };
  return assertJsonSafe(dto);
}

export function assertJsonSafe<T extends AuditJsonObject>(payload: T): T {
  JSON.stringify(payload, jsonSafeReplacer());
  return payload;
}

function objectOrNull(value: unknown): AuditJsonObject | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return normalizeJsonValue(value) as AuditJsonObject;
}

function normalizeJsonValue(value: unknown): unknown {
  if (value === undefined) {
    return null;
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Date) {
    return formatAuditInstant(value);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (typeof (value as { toHexString?: unknown }).toHexString === 'function') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonValue(item));
  }
  return Object.fromEntries(
    Object.entries(value as AuditJsonObject).map(([key, item]) => [
      key,
      normalizeJsonValue(item),
    ]),
  );
}

function jsonSafeReplacer() {
  const seen = new WeakSet<object>();
  return (_key: string, value: unknown) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (value && typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value === undefined ? null : value;
  };
}

function idString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return String(value);
}

function stringOrNull(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return String(value);
}

function userDisplay(
  performedBy: AuditJsonObject | null,
  actor: AuditJsonObject | null,
): string | null {
  return (
    stringOrNull(performedBy?.['name']) ||
    stringOrNull(performedBy?.['email']) ||
    stringOrNull(performedBy?.['user_id']) ||
    stringOrNull(actor?.['user_id'])
  );
}
