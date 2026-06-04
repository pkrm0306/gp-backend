import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Sector, SectorDocument } from '../sectors/schemas/sector.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { Country, CountryDocument } from '../countries/schemas/country.schema';
import { State, StateDocument } from '../states/schemas/state.schema';
import { Standard, StandardDocument } from '../standards/schemas/standard.schema';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { Role, RoleDocument } from '../rbac/schemas/role.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';

type AuditLogRow = AuditLog & {
  new_values?: Record<string, unknown>;
};

type LookupModelName =
  | 'category'
  | 'sector'
  | 'manufacturer'
  | 'country'
  | 'state'
  | 'standard'
  | 'product'
  | 'role'
  | 'user';

type LookupModelConfig = {
  model: Model<unknown>;
  numericField?: string;
  labelFields: string[];
};

const LOOKUP_FIELD_MODEL: Record<string, LookupModelName> = {
  categoryid: 'category',
  category_id: 'category',
  sector: 'sector',
  sectorid: 'sector',
  sector_id: 'sector',
  manufacturerid: 'manufacturer',
  manufacturer_id: 'manufacturer',
  vendorid: 'manufacturer',
  vendor_id: 'manufacturer',
  countryid: 'country',
  country_id: 'country',
  stateid: 'state',
  state_id: 'state',
  standardid: 'standard',
  standard_id: 'standard',
  productid: 'product',
  product_id: 'product',
  roleid: 'role',
  role_id: 'role',
  userid: 'user',
  user_id: 'user',
  createdby: 'user',
  created_by: 'user',
  updatedby: 'user',
  updated_by: 'user',
  deletedby: 'user',
  deleted_by: 'user',
};

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger('AuditLog');

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Sector.name)
    private readonly sectorModel: Model<SectorDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    @InjectModel(State.name)
    private readonly stateModel: Model<StateDocument>,
    @InjectModel(Standard.name)
    private readonly standardModel: Model<StandardDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(VendorUser.name)
    private readonly vendorUserModel: Model<VendorUserDocument>,
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
    from: Date;
    to: Date;
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
    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from ? new Date(query.from) : new Date(to);
    if (!query.from) {
      from.setMonth(from.getMonth() - 1);
    }
    filter.occurred_at = { $gte: from, $lte: to };

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
    const items = await this.enrichRows(itemsRaw as AuditLogRow[]);
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

  private lookupModels(): Record<LookupModelName, LookupModelConfig> {
    return {
      category: {
        model: this.categoryModel as Model<unknown>,
        numericField: 'category_id',
        labelFields: ['category_name'],
      },
      sector: {
        model: this.sectorModel as Model<unknown>,
        numericField: 'id',
        labelFields: ['name'],
      },
      manufacturer: {
        model: this.manufacturerModel as Model<unknown>,
        labelFields: ['manufacturerName', 'vendor_name', 'vendor_email'],
      },
      country: {
        model: this.countryModel as Model<unknown>,
        numericField: 'id',
        labelFields: ['countryName', 'countryCode', 'country_code'],
      },
      state: {
        model: this.stateModel as Model<unknown>,
        labelFields: ['stateName', 'stateCode'],
      },
      standard: {
        model: this.standardModel as Model<unknown>,
        numericField: 'id',
        labelFields: ['name'],
      },
      product: {
        model: this.productModel as Model<unknown>,
        numericField: 'productId',
        labelFields: ['productName', 'urnNo', 'eoiNo'],
      },
      role: {
        model: this.roleModel as Model<unknown>,
        labelFields: ['name'],
      },
      user: {
        model: this.vendorUserModel as Model<unknown>,
        labelFields: ['name', 'email'],
      },
    };
  }

  private async enrichRows(rows: AuditLogRow[]): Promise<AuditLogRow[]> {
    const valuesByModel = new Map<LookupModelName, Set<string>>();
    for (const row of rows) {
      const values = row.new_values;
      if (!values || typeof values !== 'object' || Array.isArray(values)) {
        continue;
      }
      for (const [key, value] of Object.entries(values)) {
        const modelName = LOOKUP_FIELD_MODEL[this.normalizeLookupKey(key)];
        if (!modelName || !this.canLookupValue(value)) {
          continue;
        }
        const bucket = valuesByModel.get(modelName) ?? new Set<string>();
        bucket.add(String(value));
        valuesByModel.set(modelName, bucket);
      }
    }

    const labels = await this.resolveLookupLabels(valuesByModel);
    return rows.map((row) => ({
      ...row,
      new_values: this.enrichValues(row.new_values, labels),
    }));
  }

  private async resolveLookupLabels(
    valuesByModel: Map<LookupModelName, Set<string>>,
  ): Promise<Map<string, string>> {
    const configs = this.lookupModels();
    const out = new Map<string, string>();
    await Promise.all(
      Array.from(valuesByModel.entries()).map(async ([modelName, values]) => {
        const config = configs[modelName];
        const rawValues = Array.from(values);
        const objectIds = rawValues
          .filter((v) => Types.ObjectId.isValid(v))
          .map((v) => new Types.ObjectId(v));
        const numericValues = rawValues
          .map((v) => Number(v))
          .filter((v) => Number.isInteger(v));

        const or: Record<string, unknown>[] = [];
        if (objectIds.length) {
          or.push({ _id: { $in: objectIds } });
        }
        if (config.numericField && numericValues.length) {
          or.push({ [config.numericField]: { $in: numericValues } });
        }
        if (!or.length) {
          return;
        }

        const docs = (await config.model
          .find({ $or: or })
          .lean()
          .exec()) as Array<Record<string, unknown>>;

        for (const doc of docs) {
          const label = this.pickLabel(doc, config.labelFields);
          if (!label) {
            continue;
          }
          if (doc['_id']) {
            out.set(this.lookupCacheKey(modelName, String(doc['_id'])), label);
          }
          if (config.numericField && doc[config.numericField] !== undefined) {
            out.set(
              this.lookupCacheKey(modelName, String(doc[config.numericField])),
              label,
            );
          }
        }
      }),
    );
    return out;
  }

  private enrichValues(
    values: Record<string, unknown> | undefined,
    labels: Map<string, string>,
  ): Record<string, unknown> | undefined {
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
      return values;
    }
    const out: Record<string, unknown> = { ...values };
    for (const [key, value] of Object.entries(values)) {
      const modelName = LOOKUP_FIELD_MODEL[this.normalizeLookupKey(key)];
      if (!modelName || !this.canLookupValue(value)) {
        continue;
      }
      const label = labels.get(this.lookupCacheKey(modelName, String(value)));
      if (label) {
        out[key] = label;
      }
    }
    return out;
  }

  private normalizeLookupKey(key: string): string {
    return key.replace(/\[\]$/g, '').toLowerCase();
  }

  private canLookupValue(value: unknown): value is string | number {
    return (
      (typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'number' && Number.isFinite(value))
    );
  }

  private lookupCacheKey(modelName: LookupModelName, value: string): string {
    return `${modelName}:${value}`;
  }

  private pickLabel(
    doc: Record<string, unknown>,
    fields: string[],
  ): string | undefined {
    for (const field of fields) {
      const value = doc[field];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
      if (typeof value === 'number') {
        return String(value);
      }
    }
    return undefined;
  }
}
