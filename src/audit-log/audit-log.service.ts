import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import {
  AuditRecordOptions,
  CreateAuditLogDto,
} from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditValueTransformer } from './audit-value-transformer.service';
import {
  AuditPayloadPresenter,
  type AuditLogRow,
} from './audit-payload-presenter.service';
import { auditModuleDisplayName } from './audit-friendlies';
import { buildAuditActorUserFilter } from './audit-log-user-filter.util';
import { resolveAuditQueryRange } from './audit-date.util';

export interface AuditFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface AuditFilterOptionsResult {
  modules: AuditFilterOption[];
  action_types: AuditFilterOption[];
  actions: AuditFilterOption[];
  users: AuditFilterOption[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  from: Date;
  to: Date;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger('AuditLog');

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
    private readonly valueTransformer: AuditValueTransformer,
    private readonly payloadPresenter: AuditPayloadPresenter,
  ) {}

  /**
   * Append-only insert. Never throws to callers for persistence failures.
   * Duplicate `metadata.audit_event_id` is swallowed (idempotent concurrent writes).
   */
  async record(
    entry: CreateAuditLogDto,
    options: AuditRecordOptions = {},
  ): Promise<void> {
    try {
      const doc = this.toPersistDocument(entry);
      if (options.session) {
        await this.auditLogModel.create([doc], { session: options.session });
      } else {
        await this.auditLogModel.create(doc);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (this.isDuplicateKeyError(e)) {
        this.logger.debug(`[AuditLog] duplicate event skipped: ${msg}`);
        return;
      }
      if (options.throwOnError) {
        throw e;
      }
      this.logger.warn(`[AuditLog] insert failed: ${msg}`);
    }
  }

  /** Batch append-only insert for bulk admin actions (e.g. URN reactivation). */
  async recordMany(
    entries: CreateAuditLogDto[],
    options: AuditRecordOptions = {},
  ): Promise<void> {
    if (!entries.length) return;
    try {
      const docs = entries.map((entry) => this.toPersistDocument(entry));
      if (options.session) {
        await this.auditLogModel.insertMany(docs, {
          session: options.session,
          ordered: false,
        });
      } else {
        await this.auditLogModel.insertMany(docs, { ordered: false });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (this.isDuplicateKeyError(e)) {
        this.logger.debug(`[AuditLog] bulk duplicate event skipped: ${msg}`);
        return;
      }
      if (options.throwOnError) {
        throw e;
      }
      this.logger.warn(`[AuditLog] bulk insert failed: ${msg}`);
    }
  }

  async list(query: QueryAuditLogDto): Promise<{
    items: AuditLog[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    from: Date;
    to: Date;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { filter, from, to } = this.buildFilter(query);

    const skip = (page - 1) * limit;
    const [itemsRaw, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort({ occurred_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.auditLogModel.countDocuments(filter).exec(),
    ]);
    const items = await this.payloadPresenter.presentMany(
      itemsRaw as AuditLogRow[],
    );
    return {
      items: items as AuditLog[],
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      from,
      to,
    };
  }

  async filterOptions(
    query: QueryAuditLogDto,
  ): Promise<AuditFilterOptionsResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { filter, from, to } = this.buildFilter(query);
    const skip = (page - 1) * limit;

    const [result] = (await this.auditLogModel
      .aggregate([
        { $match: filter },
        {
          $facet: {
            modules: [
              { $match: { module: { $type: 'string', $ne: '' } } },
              { $group: { _id: '$module', count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
            ],
            action_types: [
              { $match: { action_type: { $type: 'string', $ne: '' } } },
              { $group: { _id: '$action_type', count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
            ],
            actions: [
              { $match: { action: { $type: 'string', $ne: '' } } },
              { $group: { _id: '$action', count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            users: [
              {
                $project: {
                  user_id: {
                    $let: {
                      vars: {
                        raw: {
                          $ifNull: [
                            '$performed_by.user_id',
                            '$actor.user_id',
                          ],
                        },
                      },
                      in: {
                        $cond: [
                          {
                            $in: [
                              { $type: '$$raw' },
                              ['string', 'objectId', 'int', 'long', 'double', 'decimal'],
                            ],
                          },
                          { $toString: '$$raw' },
                          '',
                        ],
                      },
                    },
                  },
                  user_label: {
                    $ifNull: [
                      '$performed_by.name',
                      {
                        $ifNull: [
                          '$performed_by.email',
                          {
                            $let: {
                              vars: {
                                raw: {
                                  $ifNull: [
                                    '$performed_by.user_id',
                                    '$actor.user_id',
                                  ],
                                },
                              },
                              in: {
                                $cond: [
                                  {
                                    $in: [
                                      { $type: '$$raw' },
                                      ['string', 'objectId', 'int', 'long', 'double', 'decimal'],
                                    ],
                                  },
                                  { $toString: '$$raw' },
                                  '',
                                ],
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
              { $match: { user_id: { $type: 'string', $ne: '' } } },
              { $group: { _id: '$user_id', label: { $first: '$user_label' }, count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            actionsTotal: [
              { $match: { action: { $type: 'string', $ne: '' } } },
              { $group: { _id: '$action' } },
              { $count: 'count' },
            ],
          },
        },
      ])
      .exec()) as Array<{
      modules?: Array<{ _id: string; count: number }>;
      action_types?: Array<{ _id: string; count: number }>;
      actions?: Array<{ _id: string; count: number }>;
      users?: Array<{ _id: string; label?: string; count: number }>;
      actionsTotal?: Array<{ count: number }>;
    }>;

    const totalCount = result?.actionsTotal?.[0]?.count ?? 0;
    return {
      modules: this.toOptions(result?.modules ?? [], (value) =>
        auditModuleDisplayName(value),
      ),
      action_types: this.toOptions(result?.action_types ?? []),
      actions: this.toOptions(result?.actions ?? []),
      users: this.toUserFilterOptions(result?.users ?? []),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
      from,
      to,
    };
  }

  async findById(id: string): Promise<AuditLog | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const raw = await this.auditLogModel
      .findById(new Types.ObjectId(id))
      .lean()
      .exec();
    if (!raw) {
      return null;
    }
    return (await this.payloadPresenter.presentOne(raw as AuditLogRow, {
      lookupScope: 'product',
    })) as AuditLog | null;
  }

  private toPersistDocument(entry: CreateAuditLogDto): Partial<AuditLog> {
    return {
      occurred_at: entry.occurred_at ?? new Date(),
      action: entry.action,
      outcome: entry.outcome,
      module: entry.module,
      action_type: entry.action_type,
      entity_name: entry.entity_name,
      description: entry.description,
      performed_by: entry.performed_by,
      old_values: this.valueTransformer.sanitizeSnapshot(entry.old_values),
      new_values: this.valueTransformer.sanitizeSnapshot(entry.new_values),
      http_method: entry.http_method,
      route: entry.route,
      status_code: entry.status_code,
      actor: entry.actor,
      resource: entry.resource,
      request: entry.request,
      changes: this.valueTransformer.sanitizeChanges(entry.changes),
      metadata: entry.metadata,
    };
  }

  private buildFilter(query: QueryAuditLogDto): {
    filter: Record<string, unknown>;
    from: Date;
    to: Date;
  } {
    const filter: Record<string, unknown> = {};
    if (query.action) {
      filter.action = query.action;
    }
    if (query.module) {
      const moduleKey = String(query.module).trim().toLowerCase();
      if (moduleKey === 'spoc_allocation') {
        filter.$or = [
          { module: query.module },
          { module: 'spoc_allocation' },
          { route: { $regex: 'spoc-allocation', $options: 'i' } },
        ];
      } else {
        filter.module = query.module;
      }
    }
    if (query.action_type) {
      filter.action_type = query.action_type;
    }
    if (query.actor_user_id) {
      const actorFilter = buildAuditActorUserFilter(query.actor_user_id);
      if (actorFilter) {
        Object.assign(filter, actorFilter);
      }
    }
    if (query.resource_type) {
      filter['resource.type'] = query.resource_type;
    }
    if (query.resource_id) {
      filter['resource.id'] = query.resource_id;
    }
    if (query.urn_no) {
      filter['resource.urn_no'] = query.urn_no;
    }
    const { from, to } = resolveAuditQueryRange({
      from: query.from,
      to: query.to,
    });
    filter.occurred_at = { $gte: from, $lte: to };
    return { filter, from, to };
  }

  private toUserFilterOptions(
    rows: Array<{ _id: unknown; label?: string; count: number }>,
  ): AuditFilterOption[] {
    return rows
      .map((row) => ({
        value: String(row._id ?? '').trim(),
        label: String(row.label ?? row._id ?? '').trim(),
        count: row.count,
      }))
      .filter((row) => row.value !== '')
      .map((row) => ({
        value: row.value,
        label: row.label || row.value,
        count: row.count,
      }));
  }

  private toOptions(
    rows: Array<{ _id: string; count: number }>,
    labelFor: (value: string) => string | null = (value) => value,
  ): AuditFilterOption[] {
    return rows
      .filter((row) => typeof row._id === 'string' && row._id.trim() !== '')
      .map((row) => ({
        value: row._id,
        label: labelFor(row._id) ?? row._id,
        count: row.count,
      }));
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      (error as { code?: number }).code === 11000
    );
  }
}
