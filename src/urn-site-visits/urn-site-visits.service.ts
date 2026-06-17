import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UrnSiteVisit,
  UrnSiteVisitDocument,
} from './schemas/urn-site-visit.schema';
import { CreateUrnSiteVisitDto } from './dto/create-urn-site-visit.dto';
import { UpdateUrnSiteVisitDto } from './dto/update-urn-site-visit.dto';
import { ListUrnSiteVisitsDto } from './dto/list-urn-site-visits.dto';
import { formatSiteVisitRecord } from './urn-site-visit.util';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../product-registration/schemas/product-plant.schema';
import {
  matchActiveProducts,
  matchActiveProductPlants,
} from '../product-registration/constants/active-product.filter';
import { resolveSiteVisitUrnStatusAfterCreate } from './urn-site-visit-workflow.util';

@Injectable()
export class UrnSiteVisitsService {
  constructor(
    @InjectModel(UrnSiteVisit.name)
    private readonly siteVisitModel: Model<UrnSiteVisitDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
  ) {}

  private normalizeUrnNo(urnNo: string): string {
    return String(urnNo ?? '')
      .trim()
      .replace(/\/+$/g, '');
  }

  private urnCandidates(urnNo: string): string[] {
    const normalized = this.normalizeUrnNo(urnNo);
    if (!normalized) return [];
    return [normalized, `${normalized}/`];
  }

  private toObjectId(id: string, fieldName: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  private parseOptionalDate(value?: string | null): Date | null {
    if (value === undefined || value === null || String(value).trim() === '') {
      return null;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException('Invalid auditConductedOn date');
    }
    return d;
  }

  private parseActorId(userId?: string): Types.ObjectId | null {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return null;
    }
    return new Types.ObjectId(userId);
  }

  async assertUrnExists(urnNo: string): Promise<{
    normalizedUrn: string;
    vendorId: Types.ObjectId;
    manufacturerId: Types.ObjectId;
    urnStatus: number;
  }> {
    const normalizedUrn = this.normalizeUrnNo(urnNo);
    if (!normalizedUrn) {
      throw new BadRequestException('urnNo is required');
    }
    const urnOptions = this.urnCandidates(normalizedUrn);
    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: { $in: urnOptions } }))
      .select('vendorId manufacturerId urnStatus urnNo')
      .sort({ createdDate: 1 })
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No products found for URN: ${normalizedUrn}`);
    }

    return {
      normalizedUrn: this.normalizeUrnNo(String(product.urnNo ?? normalizedUrn)),
      vendorId: product.vendorId as Types.ObjectId,
      manufacturerId: product.manufacturerId as Types.ObjectId,
      urnStatus: Number(product.urnStatus ?? 0),
    };
  }

  private logSiteVisitEvent(
    action:
      | 'urn_site_visit_created'
      | 'urn_site_visit_updated'
      | 'urn_site_visit_deleted',
    urnNo: string,
    siteVisitId: string,
    name: string,
    urnStatus: number,
    extra?: { fields?: string[] },
  ): void {
    const labelByAction: Record<typeof action, string> = {
      urn_site_visit_created: `Admin added site visit '${name}' for URN ${urnNo}`,
      urn_site_visit_updated: `Admin updated site visit '${name}' for URN ${urnNo}`,
      urn_site_visit_deleted: `Admin deleted site visit '${name}' for URN ${urnNo}`,
    };
    // Site visits are stored in urn_site_visits and audit_log — not activity_log,
    // so Quick View workflow status is not overwritten by auxiliary admin events.
    console.info(`[URN Site Visit] ${action}`, {
      urnNo,
      siteVisitId,
      name,
      urnStatus,
      activity: labelByAction[action],
      ...extra,
    });
  }

  /**
   * Vendor dashboard `site_visit` is derived from products.urnStatus (see vendor-applications.util).
   * When the first visit is created during process forms (status 3), move to site-visit-in-progress (5).
   * Do not change workflow stage once the vendor has submitted for review (status >= 4).
   */
  private async resolveMaxUrnWorkflowStatus(urnNo: string): Promise<number> {
    const urnOptions = this.urnCandidates(urnNo);
    const rows = await this.productModel
      .find(matchActiveProducts({ urnNo: { $in: urnOptions } }))
      .select('urnStatus')
      .lean()
      .exec();
    let maxStatus = 0;
    for (const row of rows) {
      maxStatus = Math.max(maxStatus, Number(row.urnStatus ?? 0));
    }
    return maxStatus;
  }

  private async syncUrnStatusAfterSiteVisitChange(
    urnNo: string,
    vendorId: Types.ObjectId,
  ): Promise<number> {
    const urnOptions = this.urnCandidates(urnNo);
    const activeCount = await this.siteVisitModel.countDocuments({
      urnNo: { $in: urnOptions },
      isDeleted: { $ne: true },
    });
    if (activeCount === 0) {
      return this.resolveMaxUrnWorkflowStatus(urnNo);
    }

    const currentStatus = await this.resolveMaxUrnWorkflowStatus(urnNo);
    const decision = resolveSiteVisitUrnStatusAfterCreate(currentStatus);

    if (decision.shouldUpdate) {
      await this.productModel.updateMany(
        matchActiveProducts({ urnNo: { $in: urnOptions }, vendorId }),
        { $set: { urnStatus: decision.nextStatus, updatedDate: new Date() } },
      );
    }

    return decision.nextStatus;
  }

  private normalizePlantNameKey(name: string): string {
    return String(name ?? '')
      .trim()
      .toLowerCase();
  }

  /**
   * Active manufacturing plants for a URN — used for admin site-visit `name` dropdown.
   */
  async listPlantOptionsForUrn(urnNo: string): Promise<
    Array<{
      plantName: string;
      label: string;
      eoiNo: string;
      plantLocation: string;
      city: string;
      stateName: string;
      countryName: string;
    }>
  > {
    const urnContext = await this.assertUrnExists(urnNo);
    const urnOptions = this.urnCandidates(urnContext.normalizedUrn);

    const rows = await this.productPlantModel
      .aggregate([
        {
          $match: matchActiveProductPlants({
            urnNo: { $in: urnOptions },
          }),
        },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        {
          $unwind: {
            path: '$state',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'countries',
            localField: 'countryId',
            foreignField: '_id',
            as: 'country',
          },
        },
        {
          $unwind: {
            path: '$country',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            plantName: 1,
            eoiNo: 1,
            plantLocation: 1,
            city: 1,
            stateName: {
              $ifNull: [
                '$state.stateName',
                { $ifNull: ['$state.state_name', '$state.name'] },
              ],
            },
            countryName: {
              $ifNull: [
                '$country.countryName',
                { $ifNull: ['$country.country_name', '$country.name'] },
              ],
            },
          },
        },
        { $sort: { plantName: 1, eoiNo: 1 } },
      ])
      .exec();

    const byName = new Map<
      string,
      {
        plantName: string;
        label: string;
        eoiNo: string;
        plantLocation: string;
        city: string;
        stateName: string;
        countryName: string;
      }
    >();

    for (const row of rows) {
      const plantName = String(row.plantName ?? '').trim();
      if (!plantName) continue;
      const key = this.normalizePlantNameKey(plantName);
      const eoiNo = String(row.eoiNo ?? '').trim();
      const entry = {
        plantName,
        eoiNo,
        plantLocation: String(row.plantLocation ?? '').trim(),
        city: String(row.city ?? '').trim(),
        stateName: String(row.stateName ?? '').trim(),
        countryName: String(row.countryName ?? '').trim(),
        label: plantName,
      };
      const existing = byName.get(key);
      if (!existing) {
        byName.set(key, entry);
        continue;
      }
      if (eoiNo && existing.eoiNo && existing.eoiNo !== eoiNo) {
        const eois = new Set(
          [existing.eoiNo, eoiNo].filter((v) => v.trim() !== ''),
        );
        entry.label = `${plantName} (${Array.from(eois).join(', ')})`;
      }
      byName.set(key, entry);
    }

    return Array.from(byName.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }

  private async assertPlantNameForUrn(
    urnNo: string,
    plantName: string,
  ): Promise<string> {
    const normalizedName = plantName.trim();
    if (!normalizedName) {
      throw new BadRequestException('name is required');
    }
    const options = await this.listPlantOptionsForUrn(urnNo);
    if (options.length === 0) {
      throw new BadRequestException(
        'No manufacturing plants are registered for this URN. Add plants on the product registration before scheduling a site visit.',
      );
    }
    const key = this.normalizePlantNameKey(normalizedName);
    const match = options.find(
      (o) => this.normalizePlantNameKey(o.plantName) === key,
    );
    if (!match) {
      throw new BadRequestException(
        `name must be one of the manufacturing plants for this URN: ${options.map((o) => o.plantName).join(', ')}`,
      );
    }
    return match.plantName;
  }

  async list(dto: ListUrnSiteVisitsDto) {
    const urnContext = await this.assertUrnExists(dto.urnNo);
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;
    const urnOptions = this.urnCandidates(urnContext.normalizedUrn);

    const filter: Record<string, unknown> = {
      urnNo: { $in: urnOptions },
    };
    if (!dto.includeDeleted) {
      filter.isDeleted = { $ne: true };
    }

    if (dto.search?.trim()) {
      const escaped = dto.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ name: regex }, { conductedBy: regex }, { city: regex }];
    }

    const sortField = dto.sortBy ?? 'createdAt';
    const sortOrder = dto.order === 'asc' ? 1 : -1;

    const [rows, total] = await Promise.all([
      this.siteVisitModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.siteVisitModel.countDocuments(filter).exec(),
    ]);

    return {
      data: rows.map((r) => formatSiteVisitRecord(r)),
      total,
      page,
      limit,
    };
  }

  async findAllByUrnForEmbed(urnNo: string, limit = 100) {
    const urnContext = await this.assertUrnExists(urnNo).catch(() => null);
    if (!urnContext) {
      return [];
    }
    const urnOptions = this.urnCandidates(urnContext.normalizedUrn);
    const rows = await this.siteVisitModel
      .find({ urnNo: { $in: urnOptions }, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return rows.map((r) => formatSiteVisitRecord(r));
  }

  async getById(id: string, urnNoQuery?: string) {
    const objectId = this.toObjectId(id, 'id');
    const doc = await this.siteVisitModel.findById(objectId).exec();
    if (!doc || doc.isDeleted) {
      throw new NotFoundException('Site visit not found');
    }
    if (urnNoQuery) {
      const expected = this.normalizeUrnNo(urnNoQuery);
      const actual = this.normalizeUrnNo(doc.urnNo);
      if (expected && actual !== expected) {
        throw new BadRequestException(
          'Site visit does not belong to the requested URN',
        );
      }
    }
    return formatSiteVisitRecord(doc);
  }

  async create(
    dto: CreateUrnSiteVisitDto,
    actorUserId?: string,
  ): Promise<Record<string, unknown>> {
    const urnContext = await this.assertUrnExists(dto.urnNo);
    const normalizedName = await this.assertPlantNameForUrn(
      urnContext.normalizedUrn,
      dto.name,
    );

    const duplicate = await this.siteVisitModel
      .findOne({
        urnNo: { $in: this.urnCandidates(urnContext.normalizedUrn) },
        name: normalizedName,
        isDeleted: { $ne: true },
      })
      .lean()
      .exec();
    if (duplicate) {
      throw new ConflictException(
        'A site visit with this name already exists for this URN',
      );
    }

    const actor = this.parseActorId(actorUserId);
    const doc = await this.siteVisitModel.create({
      urnNo: urnContext.normalizedUrn,
      name: normalizedName,
      addressLine1: dto.addressLine1.trim(),
      addressLine2: String(dto.addressLine2 ?? '').trim(),
      city: dto.city.trim(),
      state: dto.state.trim(),
      postalCode: '',
      country: dto.country.trim(),
      auditType: dto.auditType?.trim() || null,
      auditConductedOn: this.parseOptionalDate(dto.auditConductedOn),
      conductedBy: dto.conductedBy?.trim() || null,
      createdBy: actor,
      updatedBy: actor,
      isDeleted: false,
    });

    const urnStatus = await this.syncUrnStatusAfterSiteVisitChange(
      urnContext.normalizedUrn,
      urnContext.vendorId,
    );

    this.logSiteVisitEvent(
      'urn_site_visit_created',
      urnContext.normalizedUrn,
      String(doc._id),
      doc.name,
      urnStatus,
    );

    return formatSiteVisitRecord(doc);
  }

  async update(
    id: string,
    dto: UpdateUrnSiteVisitDto,
    actorUserId?: string,
    rawBody?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    if (
      rawBody &&
      (rawBody.urnNo !== undefined ||
        rawBody.urn_no !== undefined ||
        rawBody['urnNo'] !== undefined)
    ) {
      throw new BadRequestException('urnNo cannot be changed on update');
    }

    const objectId = this.toObjectId(id, 'id');
    const existing = await this.siteVisitModel.findById(objectId).exec();
    if (!existing || existing.isDeleted) {
      throw new NotFoundException('Site visit not found');
    }

    const urnContext = await this.assertUrnExists(existing.urnNo);
    const updateFields: string[] = [];
    const $set: Partial<UrnSiteVisit> & { updatedBy?: Types.ObjectId | null } =
      {};

    if (dto.name !== undefined) {
      const name = await this.assertPlantNameForUrn(
        urnContext.normalizedUrn,
        dto.name,
      );
      if (name !== existing.name) {
        const duplicate = await this.siteVisitModel
          .findOne({
            _id: { $ne: objectId },
            urnNo: { $in: this.urnCandidates(urnContext.normalizedUrn) },
            name,
            isDeleted: { $ne: true },
          })
          .lean()
          .exec();
        if (duplicate) {
          throw new ConflictException(
            'A site visit with this name already exists for this URN',
          );
        }
      }
      $set.name = name;
      updateFields.push('name');
    }
    if (dto.addressLine1 !== undefined) {
      $set.addressLine1 = dto.addressLine1.trim();
      updateFields.push('addressLine1');
    }
    if (dto.addressLine2 !== undefined) {
      $set.addressLine2 = dto.addressLine2.trim();
      updateFields.push('addressLine2');
    }
    if (dto.city !== undefined) {
      $set.city = dto.city.trim();
      updateFields.push('city');
    }
    if (dto.state !== undefined) {
      $set.state = dto.state.trim();
      updateFields.push('state');
    }
    if (dto.country !== undefined) {
      $set.country = dto.country.trim();
      updateFields.push('country');
    }
    if (dto.auditType !== undefined) {
      $set.auditType =
        dto.auditType === null ? null : String(dto.auditType).trim() || null;
      updateFields.push('auditType');
    }
    if (dto.auditConductedOn !== undefined) {
      $set.auditConductedOn = this.parseOptionalDate(dto.auditConductedOn);
      updateFields.push('auditConductedOn');
    }
    if (dto.conductedBy !== undefined) {
      $set.conductedBy =
        dto.conductedBy === null
          ? null
          : String(dto.conductedBy).trim() || null;
      updateFields.push('conductedBy');
    }

    if (updateFields.length === 0) {
      throw new BadRequestException('No updatable fields provided');
    }

    $set.updatedBy = this.parseActorId(actorUserId);

    const updated = await this.siteVisitModel
      .findByIdAndUpdate(objectId, { $set }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Site visit not found after update');
    }

    this.logSiteVisitEvent(
      'urn_site_visit_updated',
      urnContext.normalizedUrn,
      String(updated._id),
      updated.name,
      await this.resolveMaxUrnWorkflowStatus(urnContext.normalizedUrn),
      { fields: updateFields },
    );

    return formatSiteVisitRecord(updated);
  }

  async softDelete(id: string, actorUserId?: string): Promise<void> {
    const objectId = this.toObjectId(id, 'id');
    const existing = await this.siteVisitModel.findById(objectId).exec();
    if (!existing) {
      throw new NotFoundException('Site visit not found');
    }
    if (existing.isDeleted) {
      throw new NotFoundException('Site visit not found');
    }

    const urnContext = await this.assertUrnExists(existing.urnNo);
    const actor = this.parseActorId(actorUserId);

    await this.siteVisitModel.findByIdAndUpdate(objectId, {
      $set: { isDeleted: true, updatedBy: actor },
    });

    this.logSiteVisitEvent(
      'urn_site_visit_deleted',
      urnContext.normalizedUrn,
      String(existing._id),
      existing.name,
      await this.resolveMaxUrnWorkflowStatus(urnContext.normalizedUrn),
    );
  }
}
