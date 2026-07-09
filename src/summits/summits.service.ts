import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Summit, SummitDocument } from './schemas/summit.schema';
import { ListSummitsQueryDto } from './dto/list-summits-query.dto';
import { PublicListSummitsQueryDto } from './dto/public-list-summits-query.dto';
import { CreateSummitDto } from './dto/create-summit.dto';
import { UpdateSummitPayloadDto } from './dto/summit-payload.dto';
import {
  SUMMIT_IMAGE_MAX_BYTES,
  SUMMIT_PDF_MAX_BYTES,
  SUMMIT_SECTION_KEYS,
  SUMMIT_SPONSOR_TIERS,
  SUMMIT_UPLOAD_TYPES,
  type SummitSectionKey,
  type SummitUploadType,
} from './constants/summit.constants';
import {
  ensureSummitItemId,
  mapSummitToApi,
  mapSummitToListItem,
  mapSummitToPublicListItem,
  normalizeSummitAssetUrl,
} from './utils/summit-mapper.util';
import {
  buildSummitSlug,
  isValidSummitSlug,
  slugifySummitInput,
} from './utils/summit-slug.util';
import { sanitizeSummitHtml } from './utils/summit-sanitize.util';
import {
  normalizeSpeakerKeyPoint,
  normalizeSpeakerTags,
  resolveSpeakerDesignationAndOrganisation,
} from './utils/summit-speaker.util';
import {
  normalizeSummitBannersInput,
  normalizeSummitSpeakersInput,
} from './utils/summit-payload-normalize.util';
import { uploadFile } from '../utils/upload-file.util';
import { buildSummitViewPayload } from './utils/summit-section-visibility.util';
import {
  isSummitActiveStatus,
  normalizeSummitStatus,
  summitStatusDbMatch,
} from './utils/summit-status.util';
import { getSummitYearOptions } from './utils/summit-year.util';
import { normalizeSummitBasicInput } from './utils/summit-basic-payload.util';
import {
  normalizeAgendaSectionInput,
  normalizeEventOutcomesSection,
  normalizeFocusedAreaSection,
  normalizeHighlightsSection,
} from './utils/summit-cms-sections.util';

@Injectable()
export class SummitsService {
  constructor(
    @InjectModel(Summit.name)
    private readonly summitModel: Model<SummitDocument>,
  ) {}

  /**
   * Public website listing — only active summits (legacy `published` included).
   */
  async listPublic(query: PublicListSummitsQueryDto, origin?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;
    const filter = this.buildPublicListFilter(query);

    const [rows, total] = await Promise.all([
      this.summitModel
        .find(filter)
        .sort({ date: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.summitModel.countDocuments(filter).exec(),
    ]);

    const items = rows.map((row, index) =>
      mapSummitToPublicListItem(row as unknown as SummitDocument, {
        s_no: skip + index + 1,
        origin,
      }),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /** Response envelope for website controllers (matches events list shape). */
  buildPublicListResponse(
    query: PublicListSummitsQueryDto,
    origin?: string,
  ) {
    const result = this.listPublic(query, origin);
    return result.then((result) => ({
      message: 'Summits retrieved successfully',
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        perPage: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    }));
  }

  private buildPublicListFilter(
    query: PublicListSummitsQueryDto,
  ): FilterQuery<SummitDocument> {
    const clauses: FilterQuery<SummitDocument>[] = [
      {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      },
      summitStatusDbMatch('active'),
    ];

    if (query.year?.trim()) {
      clauses.push({ year: query.year.trim() });
    }
    if (query.search?.trim()) {
      const regex = new RegExp(
        query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      clauses.push({
        $or: [{ title: regex }, { slug: regex }, { location: regex }],
      });
    }

    return { $and: clauses };
  }

  async list(query: ListSummitsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const filter = this.buildListFilter(query);
    const sort = this.resolveListSort(query.sort ?? 'updated_at_desc');

    const [rows, total] = await Promise.all([
      this.summitModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.summitModel.countDocuments(filter).exec(),
    ]);

    const items = rows.map((row) =>
      mapSummitToListItem(row as unknown as SummitDocument),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  private buildListFilter(query: ListSummitsQueryDto): FilterQuery<SummitDocument> {
    const clauses: FilterQuery<SummitDocument>[] = [
      {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      },
    ];

    if (query.status) {
      clauses.push(summitStatusDbMatch(query.status));
    }
    if (query.year?.trim()) {
      clauses.push({ year: query.year.trim() });
    }
    if (query.search?.trim()) {
      const regex = new RegExp(
        query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      clauses.push({
        $or: [{ title: regex }, { slug: regex }, { location: regex }],
      });
    }

    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  async getFormMeta(excludeSummitId?: string) {
    const filter: FilterQuery<SummitDocument> = { deletedAt: null };
    const exclude = String(excludeSummitId ?? '').trim();
    if (exclude && Types.ObjectId.isValid(exclude)) {
      filter._id = { $ne: new Types.ObjectId(exclude) };
    }
    const rows = await this.summitModel.find(filter).select('year').lean().exec();
    const occupiedYears = [
      ...new Set(
        rows
          .map((row) => String(row.year ?? '').trim())
          .filter(Boolean),
      ),
    ];
    return {
      years: getSummitYearOptions(),
      occupiedYears,
      statuses: [
        { value: 'active' as const, label: 'Active' },
        { value: 'inactive' as const, label: 'Inactive' },
      ],
    };
  }

  async findById(id: string, options?: { activeOnly?: boolean }) {
    const doc = await this.findDocumentById(id, options);
    return buildSummitViewPayload(mapSummitToApi(doc));
  }

  async findPublishedBySlug(slug: string, origin?: string) {
    return this.findBySlug(slug, { origin, activeOnly: true });
  }

  /** Admin / draft preview — includes inactive summits. */
  async findBySlugForPreview(slug: string, origin?: string) {
    return this.findBySlug(slug, { origin, activeOnly: false });
  }

  private async findBySlug(
    slug: string,
    options?: { origin?: string; activeOnly?: boolean },
  ) {
    const normalized = slugifySummitInput(slug);
    if (!normalized || normalized === 'list' || normalized === 'preview') {
      throw new NotFoundException('Summit not found');
    }
    const filter: FilterQuery<SummitDocument> = {
      slug: normalized,
      deletedAt: null,
    };
    if (options?.activeOnly !== false) {
      filter.status = { $in: ['active', 'published'] };
    }
    const doc = await this.summitModel.findOne(filter).exec();
    if (!doc) {
      throw new NotFoundException('Summit not found');
    }
    const payload = buildSummitViewPayload(mapSummitToApi(doc));
    if (options?.origin) {
      return this.applyPublicAssetUrls(payload, options.origin);
    }
    return payload;
  }

  private applyPublicAssetUrls<T extends Record<string, unknown>>(
    payload: T,
    origin: string,
  ): T {
    const summit = payload as T & {
      coverImageUrl?: string | null;
      banners?: Array<{ imageUrl?: string }>;
      speakers?: Array<{ imageUrl?: string }>;
      sponsors?: Array<{ logoUrl?: string }>;
      industrialPdfs?: Array<{ fileUrl?: string }>;
      buildingsPdfs?: Array<{ fileUrl?: string }>;
    };

    if (Array.isArray(summit.banners)) {
      summit.banners = summit.banners.map((b) => ({
        ...b,
        imageUrl: normalizeSummitAssetUrl(b.imageUrl, origin),
      }));
    }
    if (summit.coverImageUrl) {
      summit.coverImageUrl =
        normalizeSummitAssetUrl(summit.coverImageUrl, origin) || null;
    } else if (Array.isArray(summit.banners) && summit.banners[0]?.imageUrl) {
      summit.coverImageUrl = summit.banners[0].imageUrl || null;
    }
    if (Array.isArray(summit.speakers)) {
      summit.speakers = summit.speakers.map((s) => {
        const imageUrl = normalizeSummitAssetUrl(s.imageUrl, origin);
        return {
          ...s,
          imageUrl,
          image: imageUrl,
        };
      });
    }
    if (Array.isArray(summit.sponsors)) {
      summit.sponsors = summit.sponsors.map((s) => ({
        ...s,
        logoUrl: normalizeSummitAssetUrl(s.logoUrl, origin),
      }));
    }
    if (Array.isArray(summit.industrialPdfs)) {
      summit.industrialPdfs = summit.industrialPdfs.map((p) => ({
        ...p,
        fileUrl: normalizeSummitAssetUrl(p.fileUrl, origin),
      }));
    }
    if (Array.isArray(summit.buildingsPdfs)) {
      summit.buildingsPdfs = summit.buildingsPdfs.map((p) => ({
        ...p,
        fileUrl: normalizeSummitAssetUrl(p.fileUrl, origin),
      }));
    }

    return payload;
  }

  async create(dto: CreateSummitDto) {
    const title = dto.title.trim();
    const year = dto.year.trim();
    const slug = await this.resolveUniqueSummitSlug(buildSummitSlug(title, year));
    if (!isValidSummitSlug(slug)) {
      throw new BadRequestException({
        message: 'Invalid title',
        errors: {
          'basic.title':
            'Title must produce a valid URL identifier (use letters and numbers)',
        },
      });
    }
    await this.assertYearUnique(year);

    const doc = await this.summitModel.create({
      year,
      title,
      slug,
      date: dto.date ?? '',
      location: dto.location?.trim() ?? '',
      status: normalizeSummitStatus(dto.status ?? 'inactive'),
      banners: [],
      industrialPdfs: [],
      buildingsPdfs: [],
      aboutGreenPro: { title: 'About GreenPro', content: '' },
      aboutSummit: { title: `About ${dto.title.trim()}`, content: '' },
      highlightsTitle: 'Highlights of GreenPro Summit',
      highlights: [],
      focusedAreaTitle: 'Focused Area',
      focusedAreas: [],
      areaPoints: [],
      eventOutcomesTitle: 'Event Outcomes',
      eventOutcomes: [],
      speakers: [],
      agendaTitle: "GreenPro's Core Agenda",
      agendaPoints: [],
      agenda: { title: "GreenPro's Core Agenda", content: '' },
      sponsorsTitle: 'Our Sponsors & Partners',
      sponsors: [],
      deletedAt: null,
    });

    return buildSummitViewPayload(mapSummitToApi(doc));
  }

  async updateFull(id: string, payload: UpdateSummitPayloadDto) {
    const doc = await this.findDocumentById(id);
    this.applyFullPayload(doc, payload);
    await this.validateForActiveIfNeeded(doc);
    const basicPatch = normalizeSummitBasicInput(payload);
    if (
      basicPatch?.title !== undefined ||
      basicPatch?.year !== undefined
    ) {
      doc.slug = await this.resolveUniqueSummitSlug(doc.slug, doc._id);
      doc.markModified('slug');
    }
    if (basicPatch?.year !== undefined) {
      await this.assertYearUnique(doc.year, doc._id);
    }
    await doc.save();
    return buildSummitViewPayload(mapSummitToApi(doc));
  }

  async updateSection(
    id: string,
    section: SummitSectionKey,
    body: Record<string, unknown>,
  ) {
    const doc = await this.findDocumentById(id);
    const updatedAt = new Date();

    switch (section) {
      case 'basic': {
        const basicPatch = normalizeSummitBasicInput(body);
        if (basicPatch) {
          this.applyBasic(doc, basicPatch);
          if (
            basicPatch.title !== undefined ||
            basicPatch.year !== undefined
          ) {
            doc.slug = await this.resolveUniqueSummitSlug(doc.slug, doc._id);
            doc.markModified('slug');
          }
          if (basicPatch.year !== undefined) {
            await this.assertYearUnique(doc.year, doc._id);
          }
          await this.validateForActiveIfNeeded(doc);
        }
        break;
      }
      case 'banners':
        doc.banners = this.normalizeBanners(body.banners);
        break;
      case 'downloads':
        doc.industrialPdfs = this.normalizePdfs(body.industrialPdfs);
        doc.buildingsPdfs = this.normalizePdfs(body.buildingsPdfs);
        break;
      case 'about-greenpro':
        doc.aboutGreenPro = this.normalizeRichText(body);
        break;
      case 'about-summit':
        doc.aboutSummit = this.normalizeRichText(body);
        break;
      case 'highlights': {
        const { title, items } = normalizeHighlightsSection(body);
        doc.highlightsTitle = title;
        doc.highlights = items;
        doc.markModified('highlights');
        break;
      }
      case 'focused-area': {
        const { title, cards } = normalizeFocusedAreaSection(body);
        doc.focusedAreaTitle = title;
        doc.focusedAreas = cards;
        doc.areaPoints = [];
        doc.markModified('focusedAreas');
        doc.markModified('areaPoints');
        break;
      }
      case 'event-outcomes': {
        const { title, items } = normalizeEventOutcomesSection(body);
        doc.eventOutcomesTitle = title;
        doc.eventOutcomes = items;
        doc.markModified('eventOutcomes');
        break;
      }
      case 'speakers':
        doc.speakers = this.normalizeSpeakers(body.speakers);
        break;
      case 'agenda': {
        const { title, points } = normalizeAgendaSectionInput(body);
        doc.agendaTitle = title;
        doc.agendaPoints = points;
        doc.agenda = { title, content: '' };
        doc.markModified('agendaPoints');
        doc.markModified('agenda');
        break;
      }
      case 'sponsors':
        if (typeof body.sponsorsTitle === 'string') {
          doc.sponsorsTitle = body.sponsorsTitle;
        }
        doc.sponsors = this.normalizeSponsors(body.sponsors);
        break;
      default:
        throw new BadRequestException(`Unknown section: ${section}`);
    }

    doc.updatedAt = updatedAt;
    await doc.save();
    const data = buildSummitViewPayload(mapSummitToApi(doc));
    return {
      section,
      data,
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  async updateStatus(id: string, status: 'active' | 'inactive') {
    const doc = await this.findDocumentById(id);
    doc.status = normalizeSummitStatus(status);
    if (doc.status === 'active') {
      this.assertActivatable(doc);
      await this.refreshSummitSlug(doc);
    }
    await doc.save();
    return buildSummitViewPayload(mapSummitToApi(doc));
  }

  async remove(id: string) {
    const doc = await this.findDocumentById(id);
    doc.deletedAt = new Date();
    await doc.save();
    return { id: doc._id.toString() };
  }

  async uploadAsset(
    id: string,
    type: SummitUploadType,
    file: Express.Multer.File,
    itemId?: string,
  ) {
    if (!SUMMIT_UPLOAD_TYPES.includes(type)) {
      throw new BadRequestException('Invalid upload type');
    }
    await this.findDocumentById(id);

    const isPdf = type === 'pdf_industrial' || type === 'pdf_buildings';
    const maxSize = isPdf ? SUMMIT_PDF_MAX_BYTES : SUMMIT_IMAGE_MAX_BYTES;
    if (file.size > maxSize) {
      throw new PayloadTooLargeException(
        isPdf ? 'PDF must be 10MB or smaller' : 'Image must be 5MB or smaller',
      );
    }

    const subfolder =
      type === 'pdf_industrial'
        ? 'pdfs/industrial'
        : type === 'pdf_buildings'
          ? 'pdfs/buildings'
          : `${type}s`;

    const uploaded = await uploadFile(file, `summits/${id}/${subfolder}`);
    return {
      type,
      itemId: itemId ?? null,
      url: uploaded.fileUrl,
      fileName: uploaded.fileName,
    };
  }

  static isValidSection(section: string): section is SummitSectionKey {
    return (SUMMIT_SECTION_KEYS as readonly string[]).includes(section);
  }

  private resolveListSort(sort: string): Record<string, 1 | -1> {
    switch (sort) {
      case 'updated_at_asc':
        return { updatedAt: 1 };
      case 'created_at_desc':
        return { createdAt: -1 };
      case 'date_desc':
        return { date: -1, updatedAt: -1 };
      default:
        return { updatedAt: -1 };
    }
  }

  private async findDocumentById(
    id: string,
    options?: { activeOnly?: boolean },
  ): Promise<SummitDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Summit not found');
    }
    const filter: FilterQuery<SummitDocument> = {
      _id: new Types.ObjectId(id),
      deletedAt: null,
    };
    if (options?.activeOnly) {
      filter.status = { $in: ['active', 'published'] };
    }
    const doc = await this.summitModel.findOne(filter).exec();
    if (!doc) {
      throw new NotFoundException('Summit not found');
    }
    return doc;
  }

  /** One summit per calendar year (non-deleted documents). */
  private async assertYearUnique(year: string, excludeId?: Types.ObjectId) {
    const normalized = String(year ?? '').trim();
    if (!normalized) return;

    const filter: FilterQuery<SummitDocument> = {
      year: normalized,
      deletedAt: null,
    };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const existing = await this.summitModel.findOne(filter).select('_id').lean().exec();
    if (existing) {
      throw new ConflictException({
        message: 'Summit year already exists',
        errors: {
          'basic.year': `A summit for year ${normalized} already exists`,
        },
      });
    }
  }

  private applyFullPayload(doc: SummitDocument, payload: UpdateSummitPayloadDto) {
    const basicPatch = normalizeSummitBasicInput(payload);
    if (basicPatch) {
      this.applyBasic(doc, basicPatch);
    }
    if (payload.banners !== undefined) {
      doc.banners = this.normalizeBanners(payload.banners);
    }
    if (payload.industrialPdfs !== undefined) {
      doc.industrialPdfs = this.normalizePdfs(payload.industrialPdfs);
    }
    if (payload.buildingsPdfs !== undefined) {
      doc.buildingsPdfs = this.normalizePdfs(payload.buildingsPdfs);
    }
    if (payload.aboutGreenPro !== undefined) {
      doc.aboutGreenPro = this.normalizeRichText(payload.aboutGreenPro);
    }
    if (payload.aboutSummit !== undefined) {
      doc.aboutSummit = this.normalizeRichText(payload.aboutSummit);
    }
    if (
      payload.highlightsTitle !== undefined ||
      payload.highlights !== undefined
    ) {
      const { title, items } = normalizeHighlightsSection({
        highlightsTitle:
          payload.highlightsTitle !== undefined
            ? payload.highlightsTitle
            : doc.highlightsTitle,
        highlights:
          payload.highlights !== undefined
            ? payload.highlights
            : doc.highlights,
      });
      doc.highlightsTitle = title;
      doc.highlights = items;
    }
    if (
      payload.focusedAreaTitle !== undefined ||
      payload.focusedAreas !== undefined ||
      payload.areaPoints !== undefined
    ) {
      const focusedBody: Record<string, unknown> = {
        focusedAreaTitle:
          payload.focusedAreaTitle !== undefined
            ? payload.focusedAreaTitle
            : doc.focusedAreaTitle,
      };
      if (payload.focusedAreas !== undefined) {
        focusedBody.focusedAreas = payload.focusedAreas;
      } else if (payload.areaPoints !== undefined) {
        focusedBody.areaPoints = payload.areaPoints;
      } else if ((doc.focusedAreas ?? []).length > 0) {
        focusedBody.focusedAreas = doc.focusedAreas;
      } else {
        focusedBody.areaPoints = doc.areaPoints;
      }
      const { title, cards } = normalizeFocusedAreaSection(focusedBody);
      doc.focusedAreaTitle = title;
      doc.focusedAreas = cards;
      doc.areaPoints = [];
    }
    if (
      payload.eventOutcomesTitle !== undefined ||
      payload.eventOutcomes !== undefined
    ) {
      const { title, items } = normalizeEventOutcomesSection({
        eventOutcomesTitle:
          payload.eventOutcomesTitle !== undefined
            ? payload.eventOutcomesTitle
            : doc.eventOutcomesTitle,
        eventOutcomes:
          payload.eventOutcomes !== undefined
            ? payload.eventOutcomes
            : doc.eventOutcomes,
      });
      doc.eventOutcomesTitle = title;
      doc.eventOutcomes = items;
    }
    if (
      payload.agendaTitle !== undefined ||
      payload.agendaPoints !== undefined ||
      payload.agenda !== undefined
    ) {
      const { title, points } = normalizeAgendaSectionInput({
        agendaTitle:
          payload.agendaTitle !== undefined
            ? payload.agendaTitle
            : payload.agenda?.title ?? doc.agendaTitle,
        agendaPoints:
          payload.agendaPoints !== undefined
            ? payload.agendaPoints
            : doc.agendaPoints,
        agenda: payload.agenda,
      });
      doc.agendaTitle = title;
      doc.agendaPoints = points;
      doc.agenda = { title, content: '' };
    }
    if (payload.speakers !== undefined) {
      doc.speakers = this.normalizeSpeakers(payload.speakers);
    }
    if (payload.sponsorsTitle !== undefined) {
      doc.sponsorsTitle = payload.sponsorsTitle;
    }
    if (payload.sponsors !== undefined) {
      doc.sponsors = this.normalizeSponsors(payload.sponsors);
    }
  }

  private applyBasic(
    doc: SummitDocument,
    basic?: UpdateSummitPayloadDto['basic'],
  ) {
    if (!basic) return;
    if (basic.year !== undefined) {
      doc.year = String(basic.year).trim();
      doc.markModified('year');
    }
    if (basic.title !== undefined) {
      doc.title = String(basic.title).trim();
      doc.markModified('title');
    }
    if (basic.title !== undefined || basic.year !== undefined) {
      this.assignSummitSlugFromTitleYear(doc);
    }
    if (basic.date !== undefined) doc.date = basic.date;
    if (basic.location !== undefined) doc.location = basic.location;
    if (basic.status !== undefined) {
      doc.status = normalizeSummitStatus(basic.status);
      if (doc.status === 'active') {
        this.assertActivatable(doc);
      }
    }
  }

  private assignSummitSlugFromTitleYear(doc: SummitDocument): void {
    const title = String(doc.title ?? '').trim();
    const slug = buildSummitSlug(title, doc.year);
    if (!isValidSummitSlug(slug)) {
      throw new BadRequestException({
        message: 'Invalid title',
        errors: {
          'basic.title':
            'Title must produce a valid URL identifier (use letters and numbers)',
        },
      });
    }
    doc.slug = slug;
    doc.markModified('slug');
  }

  private async refreshSummitSlug(doc: SummitDocument): Promise<void> {
    this.assignSummitSlugFromTitleYear(doc);
    doc.slug = await this.resolveUniqueSummitSlug(doc.slug, doc._id);
    doc.markModified('slug');
  }

  private async resolveUniqueSummitSlug(
    preferredSlug: string,
    excludeId?: Types.ObjectId,
  ): Promise<string> {
    let candidate = preferredSlug;
    let suffix = 2;
    while (!(await this.isSlugAvailable(candidate, excludeId))) {
      candidate = `${preferredSlug}-${suffix}`;
      suffix += 1;
      if (suffix > 50) {
        throw new ConflictException({
          message: 'Summit URL already exists',
          errors: {
            'basic.title':
              'Unable to generate a unique summit URL. Change the title or year and try again.',
          },
        });
      }
    }
    return candidate;
  }

  private async isSlugAvailable(
    slug: string,
    excludeId?: Types.ObjectId,
  ): Promise<boolean> {
    const filter: FilterQuery<SummitDocument> = {
      slug,
      deletedAt: null,
    };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const existing = await this.summitModel
      .findOne(filter)
      .select('_id')
      .lean()
      .exec();
    return !existing;
  }

  private normalizeBanners(raw: unknown) {
    return this.normalizeBannersAfterInput(
      normalizeSummitBannersInput(raw),
    );
  }

  private normalizeBannersAfterInput(raw: unknown) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item, index) => ({
      id: ensureSummitItemId((item as { id?: string }).id),
      sortOrder: (item as { sortOrder?: number }).sortOrder ?? index,
      imageUrl: String((item as { imageUrl?: string }).imageUrl ?? ''),
    }));
  }

  private normalizePdfs(raw: unknown) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item, index) => ({
      id: ensureSummitItemId((item as { id?: string }).id),
      sortOrder: (item as { sortOrder?: number }).sortOrder ?? index,
      title: String((item as { title?: string }).title ?? ''),
      fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ''),
      fileName: String((item as { fileName?: string }).fileName ?? ''),
    }));
  }

  private normalizeRichText(raw: unknown) {
    const o = (raw ?? {}) as { title?: string; content?: string };
    return {
      title: String(o.title ?? ''),
      content: sanitizeSummitHtml(o.content),
    };
  }

  private normalizeSpeakers(raw: unknown) {
    return this.normalizeSpeakersAfterInput(
      normalizeSummitSpeakersInput(raw),
    );
  }

  private normalizeSpeakersAfterInput(raw: unknown) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item, index) => {
      const { designation, organisation } = resolveSpeakerDesignationAndOrganisation(
        item as {
          designation?: string;
          organisation?: string;
          organization?: string;
          sub?: string;
        },
      );
      return {
        id: ensureSummitItemId((item as { id?: string }).id),
        sortOrder: (item as { sortOrder?: number }).sortOrder ?? index,
        name: String((item as { name?: string }).name ?? ''),
        designation,
        organisation,
        sub: String((item as { sub?: string }).sub ?? ''),
        keyPoint: normalizeSpeakerKeyPoint((item as { keyPoint?: string }).keyPoint),
        tags: normalizeSpeakerTags((item as { tags?: unknown }).tags),
        imageUrl: String(
          (item as { imageUrl?: string; image?: string }).imageUrl ??
            (item as { image?: string }).image ??
            '',
        ),
      };
    });
  }

  private normalizeSponsors(raw: unknown) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item, index) => {
      const tier = String((item as { tier?: string }).tier ?? 'Partner');
      if (!SUMMIT_SPONSOR_TIERS.includes(tier as (typeof SUMMIT_SPONSOR_TIERS)[number])) {
        throw new UnprocessableEntityException({
          message: 'Invalid sponsor tier',
          errors: { tier: `Must be one of: ${SUMMIT_SPONSOR_TIERS.join(', ')}` },
        });
      }
      return {
        id: ensureSummitItemId((item as { id?: string }).id),
        sortOrder: (item as { sortOrder?: number }).sortOrder ?? index,
        name: String((item as { name?: string }).name ?? ''),
        tier: tier as (typeof SUMMIT_SPONSOR_TIERS)[number],
        logoUrl: String((item as { logoUrl?: string }).logoUrl ?? ''),
      };
    });
  }

  private async validateForActiveIfNeeded(doc: SummitDocument) {
    if (isSummitActiveStatus(doc.status)) {
      this.assertActivatable(doc);
      await this.refreshSummitSlug(doc);
    }
  }

  private assertActivatable(doc: SummitDocument) {
    const errors: Record<string, string> = {};
    if (!doc.title?.trim()) {
      errors['basic.title'] = 'Title is required before activating';
    }
    if (!doc.date?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(doc.date)) {
      errors['basic.date'] = 'Valid date (YYYY-MM-DD) is required before activating';
    }
    if (!doc.year?.trim() || !/^(19|20)\d{2}$/.test(doc.year)) {
      errors['basic.year'] = 'Valid year is required before activating';
    }
    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Summit cannot be activated',
        errors,
      });
    }
  }
}
