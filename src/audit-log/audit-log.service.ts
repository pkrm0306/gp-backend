import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger('AuditLog');

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  /**
   * Append-only insert. Never throws to callers for persistence failures.
   */
  async record(entry: CreateAuditLogDto): Promise<void> {
    try {
      const doc: Partial<AuditLog> = {
        occurred_at: entry.occurred_at ?? new Date(),
        action: entry.action,
        outcome: entry.outcome,
        module: entry.module,
        action_type: entry.action_type,
        entity_name: entry.entity_name,
        description: entry.description,
        performed_by: entry.performed_by,
        old_values: entry.old_values,
        new_values: entry.new_values,
        http_method: entry.http_method,
        route: entry.route,
        status_code: entry.status_code,
        actor: entry.actor,
        resource: entry.resource,
        request: entry.request,
        changes: entry.changes,
        metadata: entry.metadata,
      };
      await this.auditLogModel.create(doc);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.warn(`[AuditLog] insert failed: ${msg}`);
    }
  }

  async list(query: QueryAuditLogDto): Promise<{
    items: AuditLog[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (query.action) {
      filter.action = query.action;
    }
    if (query.module) {
      filter.module = query.module;
    }
    if (query.action_type) {
      filter.action_type = query.action_type;
    }
    if (query.actor_user_id) {
      filter.$or = [
        { 'actor.user_id': query.actor_user_id },
        { 'performed_by.user_id': query.actor_user_id },
      ];
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
    if (query.from || query.to) {
      const range: Record<string, Date> = {};
      if (query.from) {
        range.$gte = new Date(query.from);
      }
      if (query.to) {
        range.$lte = new Date(query.to);
      }
      filter.occurred_at = range;
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort({ occurred_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.auditLogModel.countDocuments(filter).exec(),
    ]);
    return {
      items: items as AuditLog[],
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}
