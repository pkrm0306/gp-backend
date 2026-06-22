import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import { Sector, SectorDocument } from '../sectors/schemas/sector.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { Country, CountryDocument } from '../countries/schemas/country.schema';
import { State, StateDocument } from '../states/schemas/state.schema';
import {
  Standard,
  StandardDocument,
} from '../standards/schemas/standard.schema';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { Role, RoleDocument } from '../rbac/schemas/role.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { parseProductsToBeCertified } from '../product-registration/helpers/parse-products-to-be-certified.util';
import { AuditStatusResolver } from './audit-status-resolver.service';

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
  product: 'product',
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
  productids: 'product',
  product_ids: 'product',
  productstobecertified: 'product',
  products_to_be_certified: 'product',
  productsid: 'product',
  products_id: 'product',
  productsids: 'product',
  products_ids: 'product',
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

/** Payment certification field stores JSON productId array as a string. */
const PRODUCT_ID_LIST_FIELDS = new Set(['productstobecertified']);

@Injectable()
export class AuditLookupResolver {
  constructor(
    private readonly statusResolver: AuditStatusResolver,
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

  collectValues(values: Array<Record<string, unknown> | undefined>) {
    const valuesByModel = new Map<LookupModelName, Set<string>>();
    for (const valueSet of values) {
      this.collectRecordValues(valueSet, valuesByModel);
    }
    return valuesByModel;
  }

  onlyModels(
    valuesByModel: Map<LookupModelName, Set<string>>,
    modelNames: LookupModelName[],
  ): Map<LookupModelName, Set<string>> {
    const allowed = new Set(modelNames);
    return new Map(
      Array.from(valuesByModel.entries()).filter(([modelName]) =>
        allowed.has(modelName),
      ),
    );
  }

  async resolveLookupLabels(
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

  resolveLabel(
    labels: Map<string, string>,
    key: string,
    value: unknown,
  ): string | undefined {
    const modelName = LOOKUP_FIELD_MODEL[this.statusResolver.normalizeKey(key)];
    if (!modelName) {
      return undefined;
    }
    if (this.isProductIdListField(key)) {
      return this.resolveProductIdListLabel(labels, value);
    }
    if (!this.canLookupValue(value)) {
      return undefined;
    }
    return (
      labels.get(this.lookupCacheKey(modelName, String(value))) ??
      this.fallbackLabel(modelName, value)
    );
  }

  private collectRecordValues(
    valueSet: unknown,
    valuesByModel: Map<LookupModelName, Set<string>>,
  ): void {
    if (!valueSet || typeof valueSet !== 'object') {
      return;
    }
    if (Array.isArray(valueSet)) {
      for (const item of valueSet) {
        this.collectRecordValues(item, valuesByModel);
      }
      return;
    }
    for (const [key, value] of Object.entries(
      valueSet as Record<string, unknown>,
    )) {
      const modelName =
        LOOKUP_FIELD_MODEL[this.statusResolver.normalizeKey(key)];
      if (modelName) {
        const lookupValues = this.lookupValues(key, value);
        if (!lookupValues.length) {
          this.collectRecordValues(value, valuesByModel);
          continue;
        }
        const bucket = valuesByModel.get(modelName) ?? new Set<string>();
        for (const lookupValue of lookupValues) {
          bucket.add(String(lookupValue));
        }
        valuesByModel.set(modelName, bucket);
        continue;
      }
      this.collectRecordValues(value, valuesByModel);
    }
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

  private canLookupValue(value: unknown): value is string | number {
    return (
      (typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'number' && Number.isFinite(value))
    );
  }

  private isProductIdListField(key: string): boolean {
    return PRODUCT_ID_LIST_FIELDS.has(this.statusResolver.normalizeKey(key));
  }

  private productIdsFromListValue(value: unknown): {
    productIds: number[];
    mongoIds: string[];
  } {
    if (typeof value === 'string') {
      const parsed = parseProductsToBeCertified(value);
      return {
        productIds: parsed.productIds,
        mongoIds: parsed.mongoIds.map((id) => String(id)),
      };
    }
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return { productIds: [Math.trunc(value)], mongoIds: [] };
    }
    if (Array.isArray(value)) {
      const productIds: number[] = [];
      const mongoIds: string[] = [];
      for (const item of value) {
        if (typeof item === 'number' && Number.isFinite(item) && item > 0) {
          productIds.push(Math.trunc(item));
          continue;
        }
        if (typeof item === 'string' && item.trim()) {
          const nested = parseProductsToBeCertified(item);
          productIds.push(...nested.productIds);
          mongoIds.push(...nested.mongoIds.map((id) => String(id)));
        }
      }
      return {
        productIds: [...new Set(productIds)],
        mongoIds: [...new Set(mongoIds)],
      };
    }
    return { productIds: [], mongoIds: [] };
  }

  private resolveProductIdListLabel(
    labels: Map<string, string>,
    value: unknown,
  ): string | undefined {
    const { productIds, mongoIds } = this.productIdsFromListValue(value);
    const lookupKeys = [
      ...productIds.map((id) => String(id)),
      ...mongoIds,
    ];
    if (!lookupKeys.length) {
      return undefined;
    }
    const names = lookupKeys.map(
      (id) =>
        labels.get(this.lookupCacheKey('product', id)) ??
        this.fallbackLabel('product', id) ??
        id,
    );
    return names.join(', ');
  }

  private lookupValues(
    key: string,
    value: unknown,
  ): Array<string | number> {
    if (this.isProductIdListField(key)) {
      const { productIds, mongoIds } = this.productIdsFromListValue(value);
      return [...productIds, ...mongoIds];
    }
    if (this.canLookupValue(value)) {
      return [value];
    }
    if (Array.isArray(value)) {
      return value.filter((item): item is string | number =>
        this.canLookupValue(item),
      );
    }
    return [];
  }

  private lookupCacheKey(modelName: LookupModelName, value: string): string {
    return `${modelName}:${value}`;
  }

  private fallbackLabel(
    modelName: LookupModelName,
    value: string | number,
  ): string | undefined {
    if (modelName !== 'product') {
      return undefined;
    }
    return `Deleted product (${String(value)})`;
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
