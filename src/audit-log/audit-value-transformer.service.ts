import { Injectable } from '@nestjs/common';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { isAuditIgnoredField } from './audit-ignore-fields';

export type AuditPrimitiveSnapshot = Record<string, unknown>;

export interface AuditFileSnapshot {
  field?: string;
  original_name?: string;
  mimetype?: string;
  size?: number;
  stored_name?: string;
  storage_path?: string;
}

type RequestWithUploads = {
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | Record<string, Express.Multer.File[]>
    | undefined;
};

const AUDIT_ENUM_LABELS: Record<string, Record<string, string>> = {
  paymenttype: {
    registration: 'Registration',
    certification: 'Certification',
    renew: 'Renewal',
  },
  paymentmode: {
    online: 'Online',
    cheque_or_dd: 'Cheque / DD',
    neft_or_rtgs: 'NEFT / RTGS',
  },
  decision: {
    approved: 'Approved',
    rejected: 'Rejected',
  },
  updatestatustype: {
    urn_status: 'URN Status',
    payment_status: 'Payment Status',
  },
};

@Injectable()
export class AuditValueTransformer {
  constructor(private readonly statusResolver: AuditStatusResolver) {}

  safeBodySnapshot(
    body: Record<string, unknown> | undefined,
    stringMax = 500,
  ): AuditPrimitiveSnapshot | undefined {
    if (!body) {
      return undefined;
    }
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, value] of Object.entries(body)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      const normalized = this.normalizeAuditValue(key, value, stringMax);
      if (normalized !== undefined) {
        out[key] = normalized;
      }
    }
    return Object.keys(out).length ? out : undefined;
  }

  safeResponseSnapshot(
    response: unknown,
    stringMax = 500,
  ): AuditPrimitiveSnapshot | undefined {
    if (!response || typeof response !== 'object' || Array.isArray(response)) {
      return undefined;
    }
    const responseRecord = response as Record<string, unknown>;
    const data =
      responseRecord['data'] &&
      typeof responseRecord['data'] === 'object' &&
      !Array.isArray(responseRecord['data'])
        ? (responseRecord['data'] as Record<string, unknown>)
        : responseRecord;
    return this.safeBodySnapshot(data, stringMax);
  }

  safeBodyFieldKeys(body: Record<string, unknown> | undefined): string[] {
    if (!body) {
      return [];
    }
    return Object.keys(body).filter((key) => !isAuditIgnoredField(key));
  }

  safeFileSnapshot(req: RequestWithUploads): AuditFileSnapshot[] | undefined {
    const files = this.flattenFiles(req);
    if (!files.length) {
      return undefined;
    }
    return files.map((file) => ({
      field: file.fieldname,
      original_name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      stored_name: file.filename,
      storage_path: file.path,
    }));
  }

  mergeSnapshots(
    base: AuditPrimitiveSnapshot | undefined,
    extra: AuditPrimitiveSnapshot | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!base && !extra) {
      return undefined;
    }
    return this.sanitizeSnapshot({
      ...(base ?? {}),
      ...(extra ?? {}),
    });
  }

  sanitizeSnapshot(
    values: AuditPrimitiveSnapshot | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
      return values;
    }
    const sanitized = this.sanitizeRecord(values);
    return Object.keys(sanitized).length ? sanitized : undefined;
  }

  buildChanges(
    oldValues: AuditPrimitiveSnapshot | undefined,
    newValues: AuditPrimitiveSnapshot | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!oldValues || !newValues) {
      return undefined;
    }
    const changes: AuditPrimitiveSnapshot = {};
    const keys = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);
    for (const key of keys) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      const before = this.sanitizeAuditValue(key, oldValues[key]);
      const after = this.sanitizeAuditValue(key, newValues[key]);
      if (this.valuesEqual(before, after)) {
        continue;
      }
      changes[key] = { before, after };
    }
    return Object.keys(changes).length ? changes : undefined;
  }

  transformDisplayValues(
    values: AuditPrimitiveSnapshot | undefined,
    resolveLookup: (key: string, value: unknown) => string | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
      return values;
    }
    const out = this.transformDisplayRecord(values, resolveLookup);
    return Object.keys(out).length ? out : undefined;
  }

  private transformDisplayRecord(
    values: Record<string, unknown>,
    resolveLookup: (key: string, value: unknown) => string | undefined,
  ): AuditPrimitiveSnapshot {
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, value] of Object.entries(values)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      const statusLabel = this.statusResolver.resolve(key, value);
      if (statusLabel) {
        out[key] = statusLabel;
        continue;
      }
      const enumLabel = this.enumLabel(key, value);
      if (enumLabel) {
        out[key] = enumLabel;
        continue;
      }
      const lookupLabel = resolveLookup(key, value);
      if (lookupLabel) {
        out[key] = lookupLabel;
        continue;
      }
      const transformed = this.transformSingleDisplayValue(
        key,
        value,
        resolveLookup,
      );
      if (transformed !== undefined) {
        out[key] = transformed;
      }
    }
    return out;
  }

  transformDisplayChanges(
    changes: AuditPrimitiveSnapshot | undefined,
    resolveLookup: (key: string, value: unknown) => string | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      return changes;
    }
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, change] of Object.entries(changes)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      if (!change || typeof change !== 'object' || Array.isArray(change)) {
        out[key] = this.sanitizeAuditValue(key, change);
        continue;
      }
      const pair = change as { before?: unknown; after?: unknown };
      out[key] = {
        before: this.transformSingleDisplayValue(
          key,
          pair.before,
          resolveLookup,
        ),
        after: this.transformSingleDisplayValue(key, pair.after, resolveLookup),
      };
    }
    return Object.keys(out).length ? out : undefined;
  }

  sanitizeChanges(
    changes: AuditPrimitiveSnapshot | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      return changes;
    }
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, change] of Object.entries(changes)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      if (!change || typeof change !== 'object' || Array.isArray(change)) {
        const sanitized = this.sanitizeAuditValue(key, change);
        if (sanitized !== undefined) {
          out[key] = sanitized;
        }
        continue;
      }
      const pair = change as { before?: unknown; after?: unknown };
      const before = this.sanitizeAuditValue(key, pair.before);
      const after = this.sanitizeAuditValue(key, pair.after);
      if (!this.valuesEqual(before, after)) {
        out[key] = { before, after };
      }
    }
    return Object.keys(out).length ? out : undefined;
  }

  private flattenFiles(req: RequestWithUploads): Express.Multer.File[] {
    if (req.file) {
      return [req.file];
    }
    if (Array.isArray(req.files)) {
      return req.files;
    }
    if (req.files && typeof req.files === 'object') {
      return Object.values(req.files).flat();
    }
    return [];
  }

  private valuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private sanitizeRecord(
    value: Record<string, unknown>,
  ): AuditPrimitiveSnapshot {
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, item] of Object.entries(value)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      const sanitized = this.sanitizeAuditValue(key, item);
      if (sanitized !== undefined) {
        out[key] = sanitized;
      }
    }
    return out;
  }

  private sanitizeAuditValue(key: string, value: unknown): unknown {
    return this.normalizeAuditValue(key, value);
  }

  private transformSingleDisplayValue(
    key: string,
    value: unknown,
    resolveLookup: (key: string, value: unknown) => string | undefined,
  ): unknown {
    const scalarLabel =
      this.statusResolver.resolve(key, value) ??
      this.enumLabel(key, value) ??
      resolveLookup(key, value);
    if (scalarLabel) {
      return scalarLabel;
    }
    if (!value || typeof value !== 'object') {
      return value;
    }
    if (value instanceof Date) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return this.transformDisplayRecord(
            item as Record<string, unknown>,
            resolveLookup,
          );
        }
        return (
          this.statusResolver.resolve(key, item) ??
          this.enumLabel(key, item) ??
          resolveLookup(key, item) ??
          item
        );
      });
    }
    if (
      typeof (value as { toHexString?: unknown }).toHexString === 'function'
    ) {
      return value;
    }
    return this.transformDisplayRecord(
      value as Record<string, unknown>,
      resolveLookup,
    );
  }

  private enumLabel(key: string, value: unknown): string | undefined {
    const normalizedKey = this.statusResolver.normalizeKey(key);
    const labels = AUDIT_ENUM_LABELS[normalizedKey];
    if (!labels) {
      return undefined;
    }
    if (typeof value === 'string') {
      return labels[value.trim().toLowerCase()] ?? labels[value.trim()];
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return labels[String(value)];
    }
    return undefined;
  }

  private normalizeAuditValue(
    key: string,
    value: unknown,
    stringMax = 500,
    seen = new WeakSet<object>(),
  ): unknown {
    if (isAuditIgnoredField(key) || value === undefined) {
      return undefined;
    }
    if (value === null) {
      return null;
    }
    if (typeof value === 'string') {
      return this.normalizeAuditString(value, stringMax);
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
      return undefined;
    }
    if (typeof value !== 'object') {
      return String(value);
    }
    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);

    if (
      typeof (value as { toHexString?: unknown }).toHexString === 'function'
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      const normalized = value
        .map((item) => this.normalizeAuditValue(key, item, stringMax, seen))
        .filter((item) => {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            return Object.keys(item as Record<string, unknown>).length > 0;
          }
          return item !== undefined;
        });
      return normalized.length ? normalized : undefined;
    }

    const maybePlain = this.toPlainObject(value);
    if (!maybePlain) {
      return undefined;
    }
    const normalized = this.normalizeAuditRecord(maybePlain, stringMax, seen);
    return Object.keys(normalized).length ? normalized : undefined;
  }

  private normalizeAuditRecord(
    value: Record<string, unknown>,
    stringMax: number,
    seen: WeakSet<object>,
  ): AuditPrimitiveSnapshot {
    const out: AuditPrimitiveSnapshot = {};
    for (const [key, item] of Object.entries(value)) {
      if (isAuditIgnoredField(key)) {
        continue;
      }
      const normalized = this.normalizeAuditValue(key, item, stringMax, seen);
      if (normalized !== undefined) {
        out[key] = normalized;
      }
    }
    return out;
  }

  private normalizeAuditString(value: string, stringMax: number): unknown {
    const trimmed = value.trim();
    if (trimmed === '[object Object]') {
      return undefined;
    }
    const parsed = this.parseJsonString(trimmed);
    if (parsed !== undefined) {
      return this.normalizeAuditValue('', parsed, stringMax);
    }
    return value.length > stringMax ? value.slice(0, stringMax) : value;
  }

  private parseJsonString(value: string): unknown {
    if (!value || !['{', '['].includes(value[0])) {
      return undefined;
    }
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return undefined;
    }
  }

  private toPlainObject(value: object): Record<string, unknown> | undefined {
    if (typeof (value as { toObject?: unknown }).toObject === 'function') {
      return (value as { toObject: () => Record<string, unknown> }).toObject();
    }
    if (typeof (value as { toJSON?: unknown }).toJSON === 'function') {
      const json = (value as { toJSON: () => unknown }).toJSON();
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        return json as Record<string, unknown>;
      }
    }
    return value as Record<string, unknown>;
  }
}
