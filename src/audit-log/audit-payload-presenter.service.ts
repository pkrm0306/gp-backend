import { Injectable } from '@nestjs/common';
import { AuditLog } from './schemas/audit-log.schema';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import {
  filterAuditResponseChanges,
  filterAuditResponseFields,
  filterAuditResponseMetadata,
  type AuditResponseFieldContext,
} from './audit-response-suppressed-fields';
import {
  hasAuditFilePayload,
  isRenewalDocumentAudit,
  withAuditFileDisplay,
} from './audit-file-presentation.util';
import { isSupportingDocumentAudit } from './audit-supporting-documents.util';

export type AuditLogRow = Partial<AuditLog> & {
  _id?: unknown;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export type AuditLookupScope = 'all' | 'product';

export type AuditPresentOptions = {
  /**
   * List resolves all FK models; detail keeps product-only lookups
   * (legacy contract — do not widen without a product decision).
   */
  lookupScope?: AuditLookupScope;
};

/**
 * Single read-path orchestrator: lookup enrich → human-readable display
 * transform → response field policy. Storage remains untouched.
 */
@Injectable()
export class AuditPayloadPresenter {
  constructor(
    private readonly lookupResolver: AuditLookupResolver,
    private readonly valueTransformer: AuditValueTransformer,
  ) {}

  async presentMany(rows: AuditLogRow[]): Promise<AuditLogRow[]> {
    if (!rows.length) {
      return [];
    }
    const labels = await this.resolveLabels(rows, 'all');
    return rows.map((row) => this.presentRow(row, labels));
  }

  async presentOne(
    row: AuditLogRow | null | undefined,
    options: AuditPresentOptions = {},
  ): Promise<AuditLogRow | null> {
    if (!row) {
      return null;
    }
    const scope = options.lookupScope ?? 'product';
    const labels = await this.resolveLabels([row], scope);
    return this.presentRow(row, labels);
  }

  private async resolveLabels(
    rows: AuditLogRow[],
    scope: AuditLookupScope,
  ): Promise<Map<string, string>> {
    let valuesByModel = this.lookupResolver.collectValues(
      rows.flatMap((row) => [
        row.old_values,
        row.new_values,
        ...this.changeValueSnapshots(row.changes),
      ]),
    );
    if (scope === 'product') {
      valuesByModel = this.lookupResolver.onlyModels(valuesByModel, ['product']);
    }
    if (!valuesByModel.size) {
      return new Map();
    }
    return this.lookupResolver.resolveLookupLabels(valuesByModel);
  }

  private presentRow(
    row: AuditLogRow,
    labels: Map<string, string>,
  ): AuditLogRow {
    const displayed = this.applyDisplayTransforms(row, labels);
    return this.applyResponseFieldPolicy(displayed);
  }

  private applyDisplayTransforms(
    row: AuditLogRow,
    labels: Map<string, string>,
  ): AuditLogRow {
    const resolveLookup = (key: string, value: unknown) =>
      this.lookupResolver.resolveLabel(labels, key, value);
    const ctx = this.buildFieldContext(row);
    const workflowHint =
      (typeof row.new_values?.['workflow'] === 'string'
        ? row.new_values['workflow']
        : undefined) ??
      (typeof row.old_values?.['workflow'] === 'string'
        ? row.old_values['workflow']
        : undefined) ??
      (typeof row.metadata?.['final_review_workflow'] === 'string'
        ? row.metadata['final_review_workflow']
        : undefined);
    let oldValues = this.valueTransformer.transformDisplayValues(
      row.old_values,
      resolveLookup,
      { workflow: workflowHint },
    );
    let newValues = this.valueTransformer.transformDisplayValues(
      row.new_values,
      resolveLookup,
      { workflow: workflowHint },
    );

    const shouldProjectFiles =
      isSupportingDocumentAudit(ctx) ||
      isRenewalDocumentAudit(ctx) ||
      hasAuditFilePayload(row.new_values, row.metadata) ||
      hasAuditFilePayload(row.old_values, row.metadata);

    if (shouldProjectFiles) {
      // Prefer projecting uploads onto new_values (upload/update); fall back to old.
      newValues = withAuditFileDisplay(newValues, row.metadata);
      if (!newValues?.['uploadedDocuments'] && !newValues?.['fileName']) {
        oldValues = withAuditFileDisplay(oldValues, row.metadata);
      } else if (oldValues) {
        oldValues = withAuditFileDisplay(oldValues, undefined);
      }
    }

    return {
      ...row,
      old_values: oldValues,
      new_values: newValues,
      changes: this.valueTransformer.transformDisplayChanges(
        row.changes,
        resolveLookup,
      ),
    };
  }

  private applyResponseFieldPolicy(row: AuditLogRow): AuditLogRow {
    const ctx = this.buildFieldContext(row);
    return {
      ...row,
      old_values: filterAuditResponseFields(row.old_values, ctx),
      new_values: filterAuditResponseFields(row.new_values, ctx),
      changes: filterAuditResponseChanges(row.changes, ctx),
      metadata: filterAuditResponseMetadata(row.metadata, ctx),
    };
  }

  private buildFieldContext(row: AuditLogRow): AuditResponseFieldContext {
    return {
      action: row.action,
      module: row.module,
      description: row.description,
      route: row.route,
      metadata: row.metadata,
    };
  }

  private changeValueSnapshots(
    changes: Record<string, unknown> | undefined,
  ): Array<Record<string, unknown>> {
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      return [];
    }
    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(changes)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        continue;
      }
      const pair = value as { before?: unknown; after?: unknown };
      if (pair.before !== undefined) {
        before[key] = pair.before;
      }
      if (pair.after !== undefined) {
        after[key] = pair.after;
      }
    }
    return [before, after].filter((snapshot) => Object.keys(snapshot).length);
  }
}
