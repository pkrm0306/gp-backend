"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const event_date_util_1 = require("../events/utils/event-date.util");
const merge_category_ids_util_1 = require("../standards/utils/merge-category-ids.util");
const merge_team_member_sectors_from_form_util_1 = require("./utils/merge-team-member-sectors-from-form.util");
const team_member_sectors_constants_1 = require("./team-member-sectors.constants");
const banner_vendor_scope_util_1 = require("./utils/banner-vendor-scope.util");
const manufacturers_service_1 = require("../manufacturers/manufacturers.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_manufacturer_dto_1 = require("./dto/update-manufacturer.dto");
const change_password_dto_1 = require("../manufacturers/dto/change-password.dto");
const update_manufacturer_profile_dto_1 = require("../manufacturers/dto/update-manufacturer-profile.dto");
const create_team_member_dto_1 = require("./dto/create-team-member.dto");
const edit_team_member_dto_1 = require("./dto/edit-team-member.dto");
const delete_team_member_dto_1 = require("./dto/delete-team-member.dto");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const delete_banner_dto_1 = require("./dto/delete-banner.dto");
const update_banner_status_dto_1 = require("./dto/update-banner-status.dto");
const edit_banner_dto_1 = require("./dto/edit-banner.dto");
const list_team_members_query_dto_1 = require("./dto/list-team-members-query.dto");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const manufacturer_reply_dto_1 = require("./dto/manufacturer-reply.dto");
const contact_reply_dto_1 = require("./dto/contact-reply.dto");
const list_notifications_query_dto_1 = require("./dto/list-notifications-query.dto");
const delete_newsletter_subscriber_dto_1 = require("./dto/delete-newsletter-subscriber.dto");
const update_newsletter_subscriber_status_dto_1 = require("./dto/update-newsletter-subscriber-status.dto");
const delete_contact_message_dto_1 = require("./dto/delete-contact-message.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const multer_1 = require("multer");
const path_1 = require("path");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const any_permissions_decorator_1 = require("../common/decorators/any-permissions.decorator");
const allow_authenticated_admin_portal_user_decorator_1 = require("../common/decorators/allow-authenticated-admin-portal-user.decorator");
const permissions_constants_1 = require("../common/constants/permissions.constants");
const vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
const gallery_schema_1 = require("../gallery/schemas/gallery.schema");
const gallery_service_1 = require("../gallery/gallery.service");
const upload_file_util_1 = require("../utils/upload-file.util");
const banner_image_upload_util_1 = require("./utils/banner-image-upload.util");
const banner_video_duration_util_1 = require("./utils/banner-video-duration.util");
const multer_universal_config_1 = require("../common/upload/multer-universal.config");
const article_schema_1 = require("../articles/schemas/article.schema");
const dashboard_metrics_query_dto_1 = require("./dto/dashboard-metrics-query.dto");
const payments_service_1 = require("../payments/payments.service");
const admin_list_payments_dto_1 = require("../payments/dto/admin-list-payments.dto");
const article_detail_sections_util_1 = require("../articles/utils/article-detail-sections.util");
const vendor_certificate_service_1 = require("../product-registration/services/vendor-certificate.service");
const mongoose_1 = require("mongoose");
const bannerImageMultipartFields = banner_image_upload_util_1.BANNER_MEDIA_MULTIPART_FIELDS;
async function resolveUploadedBannerVideoUrl(uploadedVideo, durationBody) {
    if (!uploadedVideo)
        return undefined;
    (0, banner_video_duration_util_1.assertBannerVideoDurationWithinLimit)(uploadedVideo, durationBody);
    return (await (0, upload_file_util_1.uploadFile)(uploadedVideo, 'banners')).fileUrl;
}
function mergeBannerVideoDurationBody(...sources) {
    return Object.assign({}, ...sources.filter(Boolean));
}
function parseBannerClearVideoFlag(body) {
    const raw = String(body.clearVideo ?? body.removeVideo ?? '').trim().toLowerCase();
    return raw === '1' || raw === 'true' || raw === 'yes';
}
const storage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'manufacturers'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        cb(null, `manufacturer-${uniqueSuffix}${ext}`);
    },
});
const teamMemberStorage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'team-members'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        cb(null, `team-member-${uniqueSuffix}${ext}`);
    },
});
const teamMemberImageInterceptor = (0, platform_express_1.FileInterceptor)('image', {
    storage: teamMemberStorage,
    fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
            cb(null, true);
            return;
        }
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
function TeamMemberEditDocs() {
    return (0, common_1.applyDecorators)((0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)(teamMemberImageInterceptor), (0, swagger_1.ApiOperation)({
        summary: 'Edit team member',
        description: '**POST** or **PATCH** — same handler. Multipart form: **id** (team member from list), name, designation, email, mobile, optional **image** (270×400px recommended), social URLs. ' +
            '**businessVertical** is required and must be one of: Building Products, Industrial Products, Consumer Products, Facility Services. ' +
            '**Sectors** multiselect — fixed options only (GET **/admin/team-member/sector-options**): Building, Industries, Consumer Products, Facility Services. Send names or ids 1–4 via **sectors**, **sectors[]**, **sector_ids**, etc. Omit sector fields to leave assignment unchanged. Category fields are not accepted. ' +
            'Same JWT workarounds as create (**x-access-token** / **access_token**) if Bearer is dropped on multipart.',
    }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiHeader)({
        name: 'x-access-token',
        required: false,
        description: 'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
    }), (0, swagger_1.ApiQuery)({
        name: 'access_token',
        required: false,
        description: 'Raw JWT query fallback for multipart / Swagger',
    }), (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', description: 'Team member MongoDB id' },
                name: { type: 'string' },
                designation: { type: 'string' },
                email: { type: 'string' },
                mobile: { type: 'string' },
                displayOrder: { type: 'number', minimum: 1 },
                businessVertical: {
                    type: 'string',
                    enum: [...vendor_user_schema_1.BUSINESS_VERTICALS],
                },
                image: { type: 'string', format: 'binary' },
                facebookUrl: { type: 'string' },
                twitterUrl: { type: 'string' },
                linkedinUrl: { type: 'string' },
                roleId: { type: 'string', description: 'Legacy single role id' },
                roleIds: {
                    oneOf: [
                        { type: 'array', items: { type: 'string' } },
                        { type: 'string', description: 'JSON string array' },
                    ],
                },
                'roleIds[]': {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Repeated multipart fields for role ids',
                },
                sectors: {
                    oneOf: [
                        {
                            type: 'array',
                            items: {
                                oneOf: [{ type: 'integer' }, { type: 'string' }],
                            },
                        },
                        { type: 'string', description: 'JSON array of sector names or ids' },
                    ],
                    description: 'Multiselect: Building, Industries, Consumer Products, Facility Services',
                },
                sector: {
                    oneOf: [{ type: 'integer' }, { type: 'string' }],
                    description: 'Single sector name or id (1–4)',
                },
                'sectors[]': {
                    oneOf: [
                        { type: 'array', items: { type: 'integer' } },
                        { type: 'string' },
                    ],
                },
                sector_ids: {
                    oneOf: [
                        { type: 'array', items: { type: 'integer' } },
                        { type: 'string' },
                    ],
                },
                sectorIds: { type: 'string' },
            },
            required: [
                'id',
                'name',
                'email',
                'mobile',
                'displayOrder',
                'businessVertical',
            ],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team member updated successfully',
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }), (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email or phone already exists for another member',
    }));
}
let AdminController = class AdminController {
    constructor(adminService, galleryService, manufacturersService, paymentsService, vendorCertificateService) {
        this.adminService = adminService;
        this.galleryService = galleryService;
        this.manufacturersService = manufacturersService;
        this.paymentsService = paymentsService;
        this.vendorCertificateService = vendorCertificateService;
    }
    async listAdminPayments(query) {
        const result = await this.paymentsService.getAdminPayments(query);
        return {
            message: 'Payment history retrieved successfully',
            data: result.data,
            pagination: result.pagination,
            meta: result.meta,
            totalCount: result.pagination.totalCount,
            totalAmount: result.pagination.totalAmount ?? 0,
            totalPaidAmount: result.pagination.totalPaidAmount ?? result.pagination.totalAmount ?? 0,
            page: result.pagination.page,
            limit: result.pagination.limit,
            totalPages: result.pagination.totalPages,
        };
    }
    async getDashboardMetrics(user, query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getDashboardMetricsForUser({
            role: user.role,
            type: user.type,
            manufacturerId: user.manufacturerId,
            userId: user.userId,
            filters,
            query,
        });
        return {
            message: 'Admin dashboard metrics retrieved successfully',
            data,
        };
    }
    async getCertifiedVsUncertifiedProducts(user, query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getCertifiedVsUncertifiedProductsForUser({
            role: user.role,
            type: user.type,
            manufacturerId: user.manufacturerId,
            userId: user.userId,
            filters,
            query,
        });
        return {
            message: 'Certified vs uncertified product metrics retrieved successfully',
            data,
        };
    }
    async getVerifiedVsUnverifiedManufacturers(user, query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getVerifiedVsUnverifiedManufacturersForUser({
            role: user.role,
            type: user.type,
            manufacturerId: user.manufacturerId,
            userId: user.userId,
            filters,
            query,
        });
        return {
            message: 'Verified vs unverified manufacturer metrics retrieved successfully',
            data,
        };
    }
    async getExpiredProductsImpact(user, query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getExpiredProductsImpactForUser({
            role: user.role,
            type: user.type,
            manufacturerId: user.manufacturerId,
            userId: user.userId,
            filters,
            query,
        });
        return {
            message: 'Expired products impact metrics retrieved successfully',
            data,
        };
    }
    async getProductStatusBreakdown(query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getProductStatusBreakdownForUser({
            filters,
            query,
        });
        return {
            message: 'Product status breakdown retrieved successfully',
            data,
        };
    }
    async getUrnPipeline(query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getUrnPipelineForUser({ filters, query });
        return {
            message: 'URN pipeline analytics retrieved successfully',
            data,
        };
    }
    async getRevenueAnalytics(query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getRevenueAnalyticsForUser({
            filters,
            query,
        });
        return {
            message: 'Revenue analytics retrieved successfully',
            data,
        };
    }
    async getRejectedProductsAnalytics(user, query) {
        const filters = await this.adminService.resolveDashboardMetricsFilters(query);
        const data = await this.adminService.getRejectedProductsAnalyticsForUser({
            role: user.role,
            type: user.type,
            manufacturerId: user.manufacturerId,
            userId: user.userId,
            filters,
            query,
        });
        return {
            message: 'Rejected products analytics retrieved successfully',
            data,
        };
    }
    getDashboardFilters() {
        return {
            message: 'Dashboard filter options retrieved successfully',
            data: this.adminService.getDashboardFilterOptions(),
        };
    }
    async getDashboardRecentProducts(query) {
        const result = await this.adminService.getDashboardRecentProducts(query.page ?? 1, query.limit ?? 10);
        return {
            message: 'Recent products retrieved successfully',
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
    }
    async getDashboardActivity(query) {
        const data = await this.adminService.getDashboardActivity(query.limit ?? 20);
        return {
            message: 'Dashboard activity retrieved successfully',
            data,
        };
    }
    parseEventStatus(raw) {
        if (raw === undefined || raw === null || String(raw).trim() === '') {
            return undefined;
        }
        const v = String(raw).trim().toLowerCase();
        if (v === '1' || v === 'active' || v === 'true')
            return 1;
        if (v === '0' || v === 'inactive' || v === 'false')
            return 0;
        throw new common_1.BadRequestException('Invalid status. Use active/inactive (or 1/0)');
    }
    resolveEventDateRange(body) {
        const pick = (keys) => {
            for (const key of keys) {
                if (body?.[key] !== undefined)
                    return body[key];
            }
            return undefined;
        };
        const startRaw = pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date']) ??
            pick(['eventDate', 'date', 'event_date']);
        const endRaw = pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date']) ?? startRaw;
        const eventStartDate = (0, event_date_util_1.parseEventDateInput)(startRaw);
        const eventEndDate = (0, event_date_util_1.parseEventDateInput)(endRaw);
        if (!eventStartDate) {
            throw new common_1.BadRequestException('Event start date is required.');
        }
        if (!eventEndDate) {
            throw new common_1.BadRequestException('Event end date is required.');
        }
        if (eventEndDate.getTime() < eventStartDate.getTime()) {
            throw new common_1.BadRequestException('Event end date must be on or after the start date.');
        }
        return { eventStartDate, eventEndDate };
    }
    parseExternalUrlToggle(raw, required = false) {
        if (raw === undefined || raw === null || String(raw).trim() === '') {
            if (required) {
                throw new common_1.BadRequestException('externalUrl is required (true/false)');
            }
            return undefined;
        }
        const v = String(raw).trim().toLowerCase();
        if (v === '1' || v === 'true' || v === 'yes' || v === 'on')
            return true;
        if (v === '0' || v === 'false' || v === 'no' || v === 'off')
            return false;
        throw new common_1.BadRequestException('Invalid externalUrl. Use true/false (or 1/0)');
    }
    resolveExternalUrlRaw(body) {
        return (body?.externalUrl ??
            body?.external_url ??
            body?.externalURL ??
            body?.isExternalUrl ??
            body?.is_external_url);
    }
    readArticleShortDescription(body) {
        return String(body?.shortDescription ??
            body?.short_description ??
            body?.shortDesc ??
            '').trim();
    }
    parseGalleryType(raw, required = false) {
        if (raw === undefined || raw === null || String(raw).trim() === '') {
            if (required) {
                throw new common_1.BadRequestException(`galleryType is required. Use one of: ${gallery_schema_1.GALLERY_TYPES.join(', ')}`);
            }
            return undefined;
        }
        const matched = this.resolveCanonicalGalleryType(String(raw));
        if (!matched) {
            throw new common_1.BadRequestException(`Invalid galleryType. Use one of: ${gallery_schema_1.GALLERY_TYPES.join(', ')}`);
        }
        return matched;
    }
    resolveCanonicalGalleryType(value) {
        const normalized = value.trim().toLowerCase();
        const direct = gallery_schema_1.GALLERY_TYPES.find((t) => t.toLowerCase() === normalized);
        if (direct)
            return direct;
        const aliases = {
            'training and workshops': 'Training & Workshops',
            trainings: 'Training & Workshops',
            training: 'Training & Workshops',
            workshops: 'Training & Workshops',
            workshop: 'Training & Workshops',
            'site visits': 'Site Visits',
            'site visit': 'Site Visits',
            'site audits': 'Site Visits',
            'site audit': 'Site Visits',
            recognition: 'Recognition',
            awards: 'Recognition',
            award: 'Recognition',
            summits: 'Recognition',
            summit: 'Recognition',
        };
        return aliases[normalized];
    }
    parseJsonStringArrayField(raw) {
        if (raw === undefined || raw === null)
            return undefined;
        if (Array.isArray(raw)) {
            return raw.map((v) => String(v).trim()).filter(Boolean);
        }
        const text = String(raw).trim();
        if (!text)
            return [];
        try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) {
                throw new common_1.BadRequestException('Expected a JSON array');
            }
            return parsed.map((v) => String(v).trim()).filter(Boolean);
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            throw new common_1.BadRequestException('Invalid JSON array field');
        }
    }
    assertGalleryImageCount(count) {
        if (count > gallery_schema_1.GALLERY_MAX_IMAGES) {
            throw new common_1.BadRequestException(`A gallery item can have at most ${gallery_schema_1.GALLERY_MAX_IMAGES} images`);
        }
    }
    assertArticleImageCount(count) {
        if (count > article_schema_1.ARTICLE_MAX_IMAGES) {
            throw new common_1.BadRequestException(`An article can have at most ${article_schema_1.ARTICLE_MAX_IMAGES} images`);
        }
    }
    async uploadArticleImageFiles(files) {
        const urls = [];
        for (const file of files) {
            if (!file?.buffer?.length && !file?.path) {
                continue;
            }
            const uploaded = await (0, upload_file_util_1.uploadFile)(file, 'articles');
            urls.push(uploaded.fileUrl);
        }
        return urls;
    }
    collectArticleImageFiles(files) {
        return [
            ...(files?.image ?? []),
            ...(files?.['image[]'] ?? []),
            ...(files?.images ?? []),
        ];
    }
    normalizeTeamMemberRoleIds(body) {
        const parseJsonArray = (value) => {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.map((v) => String(v)) : null;
            }
            catch {
                return null;
            }
        };
        const candidates = [];
        const roleIdsArrayField = body?.['roleIds[]'];
        if (Array.isArray(roleIdsArrayField)) {
            candidates.push(...roleIdsArrayField.map((v) => String(v)));
        }
        else if (roleIdsArrayField !== undefined && roleIdsArrayField !== null) {
            candidates.push(String(roleIdsArrayField));
        }
        const roleIds = body?.roleIds;
        if (Array.isArray(roleIds)) {
            candidates.push(...roleIds.map((v) => String(v)));
        }
        else if (typeof roleIds === 'string') {
            const trimmed = roleIds.trim();
            const parsed = trimmed.startsWith('[') ? parseJsonArray(trimmed) : null;
            if (parsed) {
                candidates.push(...parsed);
            }
            else if (trimmed) {
                candidates.push(trimmed);
            }
        }
        else if (roleIds !== undefined && roleIds !== null) {
            candidates.push(String(roleIds));
        }
        const normalized = Array.from(new Set(candidates
            .map((v) => v.trim())
            .filter((v) => /^[a-fA-F0-9]{24}$/.test(v))));
        if (normalized.length > 0)
            return normalized;
        const roleId = String(body?.roleId ?? '').trim();
        return /^[a-fA-F0-9]{24}$/.test(roleId) ? [roleId] : [];
    }
    resolveBusinessVerticalInput(body) {
        const direct = body?.businessVertical ??
            body?.business_vertical ??
            body?.businessvertical ??
            body?.vertical;
        if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
            return direct;
        }
        try {
            const sectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
            if (sectorIds.length > 0) {
                const name = (0, team_member_sectors_constants_1.getTeamMemberSectorNameById)(sectorIds[0]);
                if (name)
                    return name.toLowerCase();
            }
        }
        catch {
        }
        return undefined;
    }
    mapGalleryResponse(item) {
        const images = Array.isArray(item?.galleryImages)
            ? item.galleryImages
            : item?.image
                ? [item.image]
                : item?.eventImage
                    ? [item.eventImage]
                    : [];
        const rawDate = item?.date ?? item?.eventDate;
        const normalizedDate = rawDate instanceof Date
            ? rawDate.toISOString().slice(0, 10)
            : rawDate
                ? /^\d{4}-\d{2}-\d{2}$/.test(String(rawDate).trim())
                    ? String(rawDate).trim()
                    : new Date(rawDate).toISOString().slice(0, 10)
                : '';
        return {
            id: item?.id,
            eventId: item?.galleryId ?? item?.eventId,
            title: item?.title ?? item?.eventName ?? '',
            galleryType: item?.galleryType ?? '',
            description: item?.description ?? item?.eventDescription ?? '',
            date: normalizedDate,
            image: images[0] ?? null,
            images,
            event_image: item?.gallery_image ?? item?.event_image ?? null,
        };
    }
    async uploadGalleryImageFiles(files) {
        const urls = [];
        for (const file of files) {
            if (!file?.buffer?.length && !file?.path) {
                continue;
            }
            const uploaded = await (0, upload_file_util_1.uploadFile)(file, 'gallery');
            urls.push(uploaded.fileUrl);
        }
        return urls;
    }
    mapArticleResponse(item) {
        const id = item?.id ?? (item?._id ? String(item._id) : undefined);
        const externalUrl = item?.externalUrl === true;
        const images = Array.isArray(item?.images)
            ? item.images.filter(Boolean)
            : item?.image
                ? [item.image]
                : [];
        return {
            id,
            title: item?.title ?? '',
            publisher: item?.publisher ?? '',
            description: item?.description ?? '',
            shortDescription: item?.shortDescription ??
                (externalUrl ? item?.description ?? '' : ''),
            date: item?.date instanceof Date
                ? item.date.toISOString().slice(0, 10)
                : item?.date
                    ? new Date(item.date).toISOString().slice(0, 10)
                    : '',
            image: images[0] ?? item?.image ?? null,
            article_image: item?.article_image ?? '',
            images,
            url: item?.url ?? '',
            externalUrl,
            whatsInside: Array.isArray(item?.whatsInside) ? item.whatsInside : [],
            keyPoints: Array.isArray(item?.keyPoints) ? item.keyPoints : [],
            whoItsFor: Array.isArray(item?.whoItsFor) ? item.whoItsFor : [],
            tags: Array.isArray(item?.tags) ? item.tags : [],
            is_active: Number(item?.status) === 1 || item?.is_active === true,
        };
    }
    parseCmsDetailSectionsFromBody(body) {
        const pick = (keys) => {
            for (const key of keys) {
                if (body?.[key] !== undefined)
                    return body[key];
            }
            return undefined;
        };
        return {
            whatsInside: (0, article_detail_sections_util_1.normalizeWhatsInsideInput)(pick(['whatsInside', 'whats_inside', 'whatsinside'])),
            keyPoints: (0, article_detail_sections_util_1.normalizeKeyPointsInput)(pick(['keyPoints', 'key_points', 'keyTakeaways', 'key_takeaways'])),
            whoItsFor: (0, article_detail_sections_util_1.normalizeWhoItsForInput)(pick(['whoItsFor', 'who_its_for', 'whoIsItFor', 'who_is_it_for'])),
            tags: (0, article_detail_sections_util_1.normalizeTagsInput)(pick(['tags'])),
        };
    }
    async editProfile(user, updateProfileDto) {
        const profile = await this.manufacturersService.editProfile(user, updateProfileDto);
        return { message: 'Profile updated successfully', data: profile };
    }
    async listBanners(user) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const data = await this.adminService.listBanners(vendorScope);
        return { message: 'Banners retrieved successfully', data };
    }
    async createBanner(user, body, req, files) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const uploadedFile = (0, banner_image_upload_util_1.pickBannerImageFile)(files);
        const uploadedVideo = (0, banner_image_upload_util_1.pickBannerVideoFile)(files);
        if (String(body.videoUrl ?? body.video_url ?? '').trim()) {
            throw new common_1.BadRequestException('Banner video must be uploaded from your device. Video URLs are not accepted.');
        }
        const dto = (0, class_transformer_1.plainToClass)(create_banner_dto_1.CreateBannerDto, {
            imageUrl: body.imageUrl,
            title: body.title ?? body.heading,
            status: body.status,
            sequenceNumber: body.sequenceNumber ?? body.sequence ?? body.displayOrder ?? body.order,
            description: body.description ?? body.bannerDescription,
            imageSource: body.imageSource,
            videoDurationSeconds: body.videoDurationSeconds,
        });
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        const imageUrl = uploadedFile
            ? (await (0, upload_file_util_1.uploadFile)(uploadedFile, 'banners')).fileUrl
            : dto.imageUrl;
        if (!imageUrl) {
            throw new common_1.BadRequestException('Banner image is required (upload a file or provide imageUrl)');
        }
        const videoUrl = await resolveUploadedBannerVideoUrl(uploadedVideo, mergeBannerVideoDurationBody(req.body, body, dto));
        const resolvedImageSource = uploadedFile ? 'binary_upload' : 'manual_url';
        const data = await this.adminService.createBanner(vendorScope, { ...dto, imageUrl, ...(videoUrl ? { videoUrl } : {}) }, resolvedImageSource, videoUrl ? 'binary_upload' : undefined);
        return { message: 'Banner created successfully', data };
    }
    async editBanner(user, id, body, req, files) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const uploadedFile = (0, banner_image_upload_util_1.pickBannerImageFile)(files);
        const uploadedVideo = (0, banner_image_upload_util_1.pickBannerVideoFile)(files);
        const clearVideo = parseBannerClearVideoFlag(body);
        if (String(body.videoUrl ?? body.video_url ?? '').trim() && !uploadedVideo) {
            throw new common_1.BadRequestException('Banner video must be uploaded from your device. Video URLs are not accepted.');
        }
        const dto = (0, class_transformer_1.plainToClass)(edit_banner_dto_1.EditBannerDto, {
            imageUrl: body.imageUrl,
            title: body.title ?? body.heading,
            status: body.status,
            sequenceNumber: body.sequenceNumber,
            description: body.description,
            videoDurationSeconds: body.videoDurationSeconds,
        });
        const errors = await (0, class_validator_1.validate)(dto, { skipMissingProperties: true });
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        if (!uploadedFile &&
            !uploadedVideo &&
            !clearVideo &&
            dto.imageUrl === undefined &&
            dto.title === undefined &&
            dto.status === undefined &&
            dto.sequenceNumber === undefined &&
            dto.description === undefined) {
            throw new common_1.BadRequestException('Provide at least one field to update');
        }
        const imageUrl = uploadedFile
            ? (await (0, upload_file_util_1.uploadFile)(uploadedFile, 'banners')).fileUrl
            : dto.imageUrl;
        const imageSource = uploadedFile
            ? 'binary_upload'
            : imageUrl
                ? 'manual_url'
                : undefined;
        const videoUrl = await resolveUploadedBannerVideoUrl(uploadedVideo, mergeBannerVideoDurationBody(req.body, body, dto));
        const data = await this.adminService.updateBanner(vendorScope, id, {
            ...(imageUrl
                ? { imageUrl, ...(imageSource ? { imageSource } : {}) }
                : {}),
            ...(clearVideo ? { clearVideo: true } : {}),
            ...(videoUrl ? { videoUrl, videoSource: 'binary_upload' } : {}),
            ...(dto.title !== undefined ? { title: dto.title } : {}),
            ...(dto.status !== undefined ? { status: dto.status } : {}),
            ...(dto.sequenceNumber !== undefined
                ? { sequenceNumber: dto.sequenceNumber }
                : {}),
            ...(dto.description !== undefined ? { description: dto.description } : {}),
        });
        return { message: 'Banner updated successfully', data };
    }
    async createEvent(body, file) {
        const pick = (keys) => {
            for (const k of keys) {
                if (body?.[k] !== undefined)
                    return body[k];
            }
            return undefined;
        };
        const dto = (0, class_transformer_1.plainToClass)(create_event_dto_1.CreateEventDto, {
            eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
            eventStartDate: pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date']) ??
                pick(['eventDate', 'date', 'event_date']),
            eventEndDate: pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date']) ??
                pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date']) ??
                pick(['eventDate', 'date', 'event_date']),
            eventDate: pick(['eventDate', 'date', 'event_date']),
            eventStartTime: pick(['eventStartTime', 'startTime', 'event_start_time']),
            eventEndTime: pick(['eventEndTime', 'endTime', 'event_end_time']),
            eventLocation: pick(['eventLocation', 'location', 'event_location']),
            eventDescription: pick([
                'eventDescription',
                'description',
                'event_description',
            ]),
            contactPersonName: pick([
                'contactPersonName',
                'contact_person_name',
                'contactName',
            ]),
            contactPersonDesignation: pick([
                'contactPersonDesignation',
                'contact_person_designation',
                'contactDesignation',
            ]),
            contactPersonEmail: pick([
                'contactPersonEmail',
                'contactPersonemail',
                'contact_person_email',
                'contactEmail',
            ]),
            contactPersonPhone: pick([
                'contactPersonPhone',
                'contact_person_phone',
                'contactPhone',
            ]),
            registrationLink: pick(['registrationLink', 'registration_link']),
        });
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        const { eventStartDate, eventEndDate } = this.resolveEventDateRange(body);
        const eventStatus = this.parseEventStatus(pick(['eventStatus', 'status', 'is_active', 'active']));
        const detailSections = this.parseCmsDetailSectionsFromBody(body ?? {});
        const eventImage = file
            ? (await (0, upload_file_util_1.uploadFile)(file, 'events')).fileUrl
            : undefined;
        const data = await this.adminService.createEvent({
            eventName: dto.eventName,
            eventDate: eventStartDate,
            eventStartDate,
            eventEndDate,
            eventStartTime: dto.eventStartTime,
            eventEndTime: dto.eventEndTime,
            eventLocation: dto.eventLocation,
            eventDescription: dto.eventDescription,
            contactPersonName: dto.contactPersonName,
            contactPersonDesignation: dto.contactPersonDesignation,
            contactPersonEmail: dto.contactPersonEmail,
            contactPersonPhone: dto.contactPersonPhone,
            registrationLink: dto.registrationLink,
            ...(detailSections.whatsInside !== undefined
                ? { whatsInside: detailSections.whatsInside }
                : {}),
            ...(detailSections.keyPoints !== undefined
                ? { keyPoints: detailSections.keyPoints }
                : {}),
            ...(detailSections.whoItsFor !== undefined
                ? { whoItsFor: detailSections.whoItsFor }
                : {}),
            ...(detailSections.tags !== undefined ? { tags: detailSections.tags } : {}),
            eventImage,
            ...(eventStatus !== undefined ? { eventStatus } : {}),
        });
        return { message: 'Event created successfully', data };
    }
    async editEvent(id, body, files) {
        const pick = (keys) => {
            for (const k of keys) {
                if (body?.[k] !== undefined)
                    return body[k];
            }
            return undefined;
        };
        const dto = (0, class_transformer_1.plainToClass)(update_event_dto_1.UpdateEventDto, {
            eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
            eventStartDate: pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date']) ??
                pick(['eventDate', 'date', 'event_date']),
            eventEndDate: pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date']) ??
                pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date']) ??
                pick(['eventDate', 'date', 'event_date']),
            eventDate: pick(['eventDate', 'date', 'event_date']),
            eventStartTime: pick(['eventStartTime', 'startTime', 'event_start_time']),
            eventEndTime: pick(['eventEndTime', 'endTime', 'event_end_time']),
            eventLocation: pick(['eventLocation', 'location', 'event_location']),
            eventDescription: pick([
                'eventDescription',
                'description',
                'event_description',
            ]),
            contactPersonName: pick([
                'contactPersonName',
                'contact_person_name',
                'contactName',
            ]),
            contactPersonDesignation: pick([
                'contactPersonDesignation',
                'contact_person_designation',
                'contactDesignation',
            ]),
            contactPersonEmail: pick([
                'contactPersonEmail',
                'contactPersonemail',
                'contact_person_email',
                'contactEmail',
            ]),
            contactPersonPhone: pick([
                'contactPersonPhone',
                'contact_person_phone',
                'contactPhone',
            ]),
            registrationLink: pick(['registrationLink', 'registration_link']),
        });
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        let eventStartDate;
        let eventEndDate;
        if (dto.eventStartDate !== undefined ||
            dto.eventEndDate !== undefined ||
            dto.eventDate !== undefined) {
            const resolved = this.resolveEventDateRange({
                eventStartDate: dto.eventStartDate ?? dto.eventDate,
                eventEndDate: dto.eventEndDate ?? dto.eventStartDate ?? dto.eventDate,
            });
            eventStartDate = resolved.eventStartDate;
            eventEndDate = resolved.eventEndDate;
        }
        const eventStatus = this.parseEventStatus(pick(['eventStatus', 'status', 'is_active', 'active']));
        const detailSections = this.parseCmsDetailSectionsFromBody(body ?? {});
        const picked = files?.image?.[0] ||
            files?.eventImage?.[0] ||
            files?.event_image?.[0] ||
            null;
        const eventImage = picked
            ? (await (0, upload_file_util_1.uploadFile)(picked, 'events')).fileUrl
            : undefined;
        const data = await this.adminService.updateEvent(id, {
            ...(dto.eventName !== undefined ? { eventName: dto.eventName } : {}),
            ...(eventStartDate !== undefined ? { eventStartDate, eventDate: eventStartDate } : {}),
            ...(eventEndDate !== undefined ? { eventEndDate } : {}),
            ...(dto.eventStartTime !== undefined
                ? { eventStartTime: dto.eventStartTime }
                : {}),
            ...(dto.eventEndTime !== undefined
                ? { eventEndTime: dto.eventEndTime }
                : {}),
            ...(dto.eventLocation !== undefined
                ? { eventLocation: dto.eventLocation }
                : {}),
            ...(dto.eventDescription !== undefined
                ? { eventDescription: dto.eventDescription }
                : {}),
            ...(dto.contactPersonName !== undefined
                ? { contactPersonName: dto.contactPersonName }
                : {}),
            ...(dto.contactPersonDesignation !== undefined
                ? { contactPersonDesignation: dto.contactPersonDesignation }
                : {}),
            ...(dto.contactPersonEmail !== undefined
                ? { contactPersonEmail: dto.contactPersonEmail }
                : {}),
            ...(dto.contactPersonPhone !== undefined
                ? { contactPersonPhone: dto.contactPersonPhone }
                : {}),
            ...(dto.registrationLink !== undefined
                ? { registrationLink: dto.registrationLink }
                : {}),
            ...(detailSections.whatsInside !== undefined
                ? { whatsInside: detailSections.whatsInside }
                : {}),
            ...(detailSections.keyPoints !== undefined
                ? { keyPoints: detailSections.keyPoints }
                : {}),
            ...(detailSections.whoItsFor !== undefined
                ? { whoItsFor: detailSections.whoItsFor }
                : {}),
            ...(detailSections.tags !== undefined ? { tags: detailSections.tags } : {}),
            ...(eventStatus !== undefined ? { eventStatus } : {}),
            ...(eventImage ? { eventImage } : {}),
        });
        return { message: 'Event updated successfully', data };
    }
    async createGallery(body, files) {
        const allImages = [
            ...(files?.image ?? []),
            ...(files?.['image[]'] ?? []),
            ...(files?.images ?? []),
        ];
        const pick = (keys) => {
            for (const k of keys) {
                if (body?.[k] !== undefined)
                    return body[k];
            }
            return undefined;
        };
        const title = String(pick(['eventName', 'title', 'name', 'event_name', 'event_title']) ?? '').trim();
        const rawDate = String(pick(['eventDate', 'date', 'event_date']) ?? '').trim();
        const descriptionRaw = pick([
            'eventDescription',
            'description',
            'event_description',
        ]);
        const description = descriptionRaw === undefined || descriptionRaw === null
            ? undefined
            : String(descriptionRaw).trim();
        if (!title || title.length < 2) {
            throw new common_1.BadRequestException('title should not be empty');
        }
        if (!rawDate) {
            throw new common_1.BadRequestException('date should not be empty');
        }
        const eventDate = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
            ? new Date(`${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`)
            : new Date(rawDate);
        if (Number.isNaN(eventDate.getTime())) {
            throw new common_1.BadRequestException('Invalid eventDate (expected ISO date/datetime)');
        }
        const galleryImages = await this.uploadGalleryImageFiles(allImages);
        this.assertGalleryImageCount(galleryImages.length);
        const galleryType = this.parseGalleryType(pick(['galleryType', 'type', 'category']), true);
        const data = await this.galleryService.createGallery({
            title,
            date: eventDate,
            description,
            galleryType,
            ...(galleryImages.length
                ? { galleryImages, image: galleryImages[0] }
                : {}),
        });
        return {
            message: 'Gallery item created successfully',
            data: this.mapGalleryResponse(data),
        };
    }
    async editGallery(id, body, files) {
        const allImages = [
            ...(files?.image ?? []),
            ...(files?.['image[]'] ?? []),
            ...(files?.images ?? []),
            ...(files?.eventImage ?? []),
            ...(files?.event_image ?? []),
        ];
        const pick = (keys) => {
            for (const k of keys) {
                if (body?.[k] !== undefined)
                    return body[k];
            }
            return undefined;
        };
        const titleRaw = pick(['eventName', 'title', 'name', 'event_name', 'event_title']);
        const dateRaw = pick(['eventDate', 'date', 'event_date']);
        const descriptionRaw = pick([
            'eventDescription',
            'description',
            'event_description',
        ]);
        const title = titleRaw === undefined || titleRaw === null
            ? undefined
            : String(titleRaw).trim();
        const description = descriptionRaw === undefined || descriptionRaw === null
            ? undefined
            : String(descriptionRaw).trim();
        if (title !== undefined && title.length > 0 && title.length < 2) {
            throw new common_1.BadRequestException('title must be longer than or equal to 2 characters');
        }
        let eventDate = undefined;
        if (dateRaw !== undefined && dateRaw !== null) {
            const raw = String(dateRaw).trim();
            if (!raw) {
                throw new common_1.BadRequestException('date should not be empty');
            }
            eventDate = /^\d{2}-\d{2}-\d{4}$/.test(raw)
                ? new Date(`${raw.slice(6, 10)}-${raw.slice(3, 5)}-${raw.slice(0, 2)}`)
                : new Date(raw);
            if (Number.isNaN(eventDate.getTime())) {
                throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
            }
        }
        const galleryType = this.parseGalleryType(pick(['galleryType', 'type', 'category']), false);
        const existingImages = this.parseJsonStringArrayField(pick(['existingImages']));
        const uploadedImages = await this.uploadGalleryImageFiles(allImages);
        const mergedGalleryImages = existingImages !== undefined || uploadedImages.length > 0
            ? [...(existingImages ?? []), ...uploadedImages]
            : undefined;
        if (mergedGalleryImages !== undefined) {
            this.assertGalleryImageCount(mergedGalleryImages.length);
        }
        const data = await this.galleryService.updateGallery(id, {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(eventDate !== undefined ? { date: eventDate } : {}),
            ...(galleryType !== undefined ? { galleryType } : {}),
            ...(mergedGalleryImages !== undefined
                ? {
                    galleryImages: mergedGalleryImages,
                    image: mergedGalleryImages[0],
                }
                : {}),
        });
        return {
            message: 'Gallery item updated successfully',
            data: this.mapGalleryResponse(data),
        };
    }
    async listEventsForAdmin() {
        const data = await this.adminService.listEvents('event');
        return { message: 'Events retrieved successfully', data };
    }
    async listEvents(pageRaw, limitRaw) {
        const pageNum = Number.parseInt(String(pageRaw ?? '1'), 10);
        const limitNum = Number.parseInt(String(limitRaw ?? '10'), 10);
        const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
        const limit = Number.isFinite(limitNum) && limitNum > 0
            ? Math.min(limitNum, 50)
            : 10;
        const result = await this.adminService.listEventsPaginated(page, limit, {
            activeOnly: true,
        });
        return {
            message: 'Events retrieved successfully',
            pagination: result.pagination,
            data: result.data,
        };
    }
    async listGalleryTypes() {
        return {
            message: 'Gallery types retrieved successfully',
            data: gallery_schema_1.GALLERY_TYPE_OPTIONS,
        };
    }
    async listGallery(pageRaw, limitRaw) {
        const pageNum = Number.parseInt(String(pageRaw ?? '1'), 10);
        const limitNum = Number.parseInt(String(limitRaw ?? '50'), 10);
        const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
        const limit = Number.isFinite(limitNum) && limitNum > 0
            ? Math.min(limitNum, 50)
            : 50;
        const result = await this.galleryService.listGalleryPaginated(page, limit, {
            activeOnly: false,
        });
        const data = result.data.map((r) => ({
            s_no: r.s_no,
            ...this.mapGalleryResponse(r),
            is_active: r.is_active,
        }));
        return {
            message: 'Gallery retrieved successfully',
            pagination: {
                ...result.pagination,
                limit: result.pagination.perPage,
            },
            data,
        };
    }
    async getGalleryById(id) {
        const item = await this.galleryService.getGalleryById(id);
        const data = this.mapGalleryResponse(item);
        return { message: 'Gallery item retrieved successfully', data };
    }
    async updateGalleryStatus(id, body) {
        const status = this.parseEventStatus(body?.status);
        const data = await this.galleryService.setOrToggleGalleryStatus(id, status);
        return { message: 'Gallery status updated successfully', data };
    }
    async createArticle(body, files) {
        const title = String(body?.title ?? '').trim();
        if (!title)
            throw new common_1.BadRequestException('title is required');
        const publisher = String(body?.publisher ?? '').trim();
        const rawDate = String(body?.date ?? '').trim();
        if (!rawDate)
            throw new common_1.BadRequestException('date is required');
        const date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
            ? new Date(`${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`)
            : new Date(rawDate);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
        }
        const description = String(body?.description ?? '').trim();
        const shortDescription = this.readArticleShortDescription(body);
        const url = String(body?.url ?? '').trim();
        const explicitExternalUrl = this.parseExternalUrlToggle(this.resolveExternalUrlRaw(body));
        const inferredExternalUrl = explicitExternalUrl ??
            (url && shortDescription && !description
                ? true
                : description && !url
                    ? false
                    : url && !description
                        ? true
                        : false);
        const externalUrl = inferredExternalUrl;
        const status = this.parseEventStatus(body?.status);
        const detailSections = this.parseCmsDetailSectionsFromBody(body ?? {});
        const uploadedImages = await this.uploadArticleImageFiles(this.collectArticleImageFiles(files));
        this.assertArticleImageCount(uploadedImages.length);
        if (!uploadedImages.length) {
            throw new common_1.BadRequestException('image is required');
        }
        if (externalUrl) {
            if (!url) {
                throw new common_1.BadRequestException('url is required when externalUrl is true');
            }
            if (!shortDescription) {
                throw new common_1.BadRequestException('shortDescription is required when externalUrl is true');
            }
        }
        else if (!description) {
            throw new common_1.BadRequestException('description is required');
        }
        const data = await this.adminService.createArticle({
            title,
            publisher,
            description: externalUrl ? '' : description,
            shortDescription: externalUrl ? shortDescription : '',
            date,
            images: uploadedImages,
            image: uploadedImages[0],
            url: externalUrl ? url : '',
            externalUrl,
            ...(detailSections.whatsInside !== undefined
                ? { whatsInside: detailSections.whatsInside }
                : {}),
            ...(detailSections.keyPoints !== undefined
                ? { keyPoints: detailSections.keyPoints }
                : {}),
            ...(detailSections.whoItsFor !== undefined
                ? { whoItsFor: detailSections.whoItsFor }
                : {}),
            ...(detailSections.tags !== undefined ? { tags: detailSections.tags } : {}),
            ...(status !== undefined ? { status } : {}),
        });
        return {
            message: 'Article created successfully',
            data: this.mapArticleResponse(data),
        };
    }
    async editArticle(id, body, files) {
        let date = undefined;
        if (body?.date !== undefined && String(body.date).trim() !== '') {
            const rawDate = String(body.date).trim();
            date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
                ? new Date(`${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`)
                : new Date(rawDate);
            if (Number.isNaN(date.getTime())) {
                throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
            }
        }
        const status = this.parseEventStatus(body?.status);
        const explicitExternalUrl = this.parseExternalUrlToggle(this.resolveExternalUrlRaw(body));
        const detailSections = this.parseCmsDetailSectionsFromBody(body ?? {});
        const existingImages = this.parseJsonStringArrayField(body?.existingImages ?? body?.existing_images);
        const uploadedImages = await this.uploadArticleImageFiles(this.collectArticleImageFiles(files));
        const mergedImages = existingImages !== undefined || uploadedImages.length > 0
            ? [...(existingImages ?? []), ...uploadedImages]
            : undefined;
        if (mergedImages !== undefined) {
            this.assertArticleImageCount(mergedImages.length);
        }
        const description = body?.description !== undefined ? String(body.description).trim() : undefined;
        const shortDescription = body?.shortDescription !== undefined ||
            body?.short_description !== undefined ||
            body?.shortDesc !== undefined
            ? this.readArticleShortDescription(body)
            : undefined;
        const url = body?.url !== undefined ? String(body.url).trim() : undefined;
        const publisher = body?.publisher !== undefined
            ? String(body.publisher).trim()
            : undefined;
        const inferredExternalUrl = explicitExternalUrl ??
            (url !== undefined && description === undefined && shortDescription !== undefined
                ? true
                : description !== undefined && url === undefined
                    ? false
                    : shortDescription !== undefined && description === undefined
                        ? true
                        : undefined);
        const data = await this.adminService.updateArticle(id, {
            ...(body?.title !== undefined ? { title: body.title } : {}),
            ...(publisher !== undefined ? { publisher } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(shortDescription !== undefined ? { shortDescription } : {}),
            ...(date !== undefined ? { date } : {}),
            ...(url !== undefined ? { url } : {}),
            ...(inferredExternalUrl !== undefined ? { externalUrl: inferredExternalUrl } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(mergedImages !== undefined
                ? { images: mergedImages, image: mergedImages[0] }
                : {}),
            ...(detailSections.whatsInside !== undefined
                ? { whatsInside: detailSections.whatsInside }
                : {}),
            ...(detailSections.keyPoints !== undefined
                ? { keyPoints: detailSections.keyPoints }
                : {}),
            ...(detailSections.whoItsFor !== undefined
                ? { whoItsFor: detailSections.whoItsFor }
                : {}),
            ...(detailSections.tags !== undefined ? { tags: detailSections.tags } : {}),
        });
        return {
            message: 'Article updated successfully',
            data: this.mapArticleResponse(data),
        };
    }
    async listArticles() {
        const data = (await this.adminService.listArticles()).map((a) => ({
            s_no: a.s_no,
            ...this.mapArticleResponse(a),
        }));
        return { message: 'Articles retrieved successfully', data };
    }
    async getArticleById(id) {
        const data = this.mapArticleResponse(await this.adminService.getArticleById(id));
        return { message: 'Article retrieved successfully', data };
    }
    async updateArticleStatus(id, body) {
        const status = this.parseEventStatus(body?.status);
        const data = await this.adminService.setOrToggleArticleStatus(id, status);
        return { message: 'Article status updated successfully', data };
    }
    async deleteArticleAlias(id) {
        const data = await this.adminService.deleteArticle(id);
        return { message: 'Article deleted successfully', data };
    }
    async deleteArticle(id) {
        const data = await this.adminService.deleteArticle(id);
        return { message: 'Article deleted successfully', data };
    }
    async getEventById(id) {
        const data = await this.adminService.getEventById(id, 'event');
        return { message: 'Event retrieved successfully', data };
    }
    async deleteEvent(id) {
        const data = await this.adminService.deleteEvent(id, 'event');
        return { message: 'Event deleted successfully', data };
    }
    async deleteGallery(id) {
        const data = await this.galleryService.deleteGallery(id);
        return { message: 'Gallery item deleted successfully', data };
    }
    async deleteGalleryAlias(id) {
        const data = await this.galleryService.deleteGallery(id);
        return { message: 'Gallery item deleted successfully', data };
    }
    async replyToCustomer(dto) {
        const data = await this.adminService.replyToCustomerViaManufacturer(dto);
        return { message: 'Reply email sent successfully', data };
    }
    async replyToContact(id, dto) {
        const data = await this.adminService.sendContactReply(id, dto.replyMessage);
        return { message: 'Reply sent successfully', data };
    }
    async getContactReplies(id) {
        const data = await this.adminService.getContactReplyHistory(id);
        return { message: 'Reply history retrieved successfully', data };
    }
    async listNotifications(query) {
        const result = await this.adminService.listNotifications(query);
        return {
            message: 'Notifications retrieved successfully',
            data: result.data,
            totalCount: result.totalCount,
            unreadCount: result.unreadCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
        };
    }
    async markAllNotificationsSeen() {
        const result = await this.adminService.markAllNotificationsSeen();
        return {
            message: 'All notifications marked as seen',
            success: result.success,
            markedCount: result.markedCount,
        };
    }
    async markNotificationSeen(id) {
        const result = await this.adminService.markNotificationSeen(id);
        return {
            message: 'Notification marked as seen',
            success: result.success,
            id: result.id,
            seen: result.seen,
        };
    }
    async deleteBannerPost(user, body) {
        return this.executeBannerDelete(user, body);
    }
    async deleteBannerDelete(user, body) {
        return this.executeBannerDelete(user, body);
    }
    async executeBannerDelete(user, body) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const data = await this.adminService.deleteBanner(vendorScope, body.id);
        return { message: 'Banner deleted successfully', data };
    }
    async getBannerById(user, id) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const data = await this.adminService.getBannerById(vendorScope, id);
        return { message: 'Banner retrieved successfully', data };
    }
    async updateBannerStatus(user, id, body) {
        const vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
        const data = await this.adminService.setOrToggleBannerStatus(vendorScope, id, body?.status);
        return { message: 'Banner status updated successfully', data };
    }
    async createTeamMember(body, file) {
        const parsedCreateDisplayOrder = body.displayOrder === undefined ||
            body.displayOrder === null ||
            String(body.displayOrder).trim() === ''
            ? undefined
            : Number.parseInt(String(body.displayOrder), 10);
        const normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
        if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(body)) {
            throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).');
        }
        const mergedSectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
        const dto = (0, class_transformer_1.plainToClass)(create_team_member_dto_1.CreateTeamMemberDto, {
            name: body.name,
            designation: body.designation,
            email: body.email,
            mobile: body.mobile,
            displayOrder: parsedCreateDisplayOrder,
            businessVertical: this.resolveBusinessVerticalInput(body),
            facebookUrl: body.facebookUrl,
            twitterUrl: body.twitterUrl,
            linkedinUrl: body.linkedinUrl,
            roleId: normalizedRoleIds[0],
            showOnWebsite: body.showOnWebsite ?? body.show_on_website,
        });
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        const imagePath = file
            ? (await (0, upload_file_util_1.uploadFile)(file, 'team-members')).fileUrl
            : undefined;
        const teamMember = await this.adminService.createTeamMember({
            name: dto.name,
            designation: dto.designation,
            email: dto.email,
            mobile: dto.mobile,
            displayOrder: dto.displayOrder,
            businessVertical: dto.businessVertical,
            imagePath,
            facebookUrl: dto.facebookUrl,
            twitterUrl: dto.twitterUrl,
            linkedinUrl: dto.linkedinUrl,
            roleId: dto.roleId,
            roleIds: normalizedRoleIds,
            sector_ids: mergedSectorIds,
            showOnWebsite: dto.showOnWebsite,
        });
        return { message: 'Team member created successfully', data: teamMember };
    }
    async editTeamMemberPost(user, body, file) {
        return this.executeTeamMemberEdit(user, body, file);
    }
    async editTeamMemberPatch(user, body, file) {
        return this.executeTeamMemberEdit(user, body, file);
    }
    async executeTeamMemberEdit(user, body, file) {
        const parsedEditDisplayOrder = body.displayOrder === undefined ||
            body.displayOrder === null ||
            String(body.displayOrder).trim() === ''
            ? undefined
            : Number.parseInt(String(body.displayOrder), 10);
        const normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
        if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(body)) {
            throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).');
        }
        const explicitSectors = (0, merge_team_member_sectors_from_form_util_1.hasExplicitTeamMemberSectorFields)(body);
        const mergedSectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
        const dto = (0, class_transformer_1.plainToClass)(edit_team_member_dto_1.EditTeamMemberDto, {
            id: body.id,
            name: body.name,
            designation: body.designation,
            email: body.email,
            mobile: body.mobile,
            displayOrder: parsedEditDisplayOrder,
            businessVertical: this.resolveBusinessVerticalInput(body),
            facebookUrl: body.facebookUrl,
            twitterUrl: body.twitterUrl,
            linkedinUrl: body.linkedinUrl,
            roleId: body.roleId,
            showOnWebsite: body.showOnWebsite ?? body.show_on_website,
        });
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        const imagePath = file
            ? (await (0, upload_file_util_1.uploadFile)(file, 'team-members')).fileUrl
            : undefined;
        const teamMember = await this.adminService.updateTeamMember({
            id: dto.id,
            name: dto.name,
            designation: dto.designation,
            email: dto.email,
            mobile: dto.mobile,
            displayOrder: dto.displayOrder,
            businessVertical: dto.businessVertical,
            imagePath,
            facebookUrl: dto.facebookUrl,
            twitterUrl: dto.twitterUrl,
            linkedinUrl: dto.linkedinUrl,
            roleId: dto.roleId,
            roleIds: normalizedRoleIds,
            sector_ids: explicitSectors ? mergedSectorIds : undefined,
            showOnWebsite: dto.showOnWebsite,
        });
        return { message: 'Team member updated successfully', data: teamMember };
    }
    async deleteTeamMemberPost(user, body) {
        return this.executeTeamMemberDelete(user, body);
    }
    async deleteTeamMemberDelete(user, body) {
        return this.executeTeamMemberDelete(user, body);
    }
    async executeTeamMemberDelete(user, body) {
        const data = await this.adminService.deleteTeamMember(user?.vendorId ?? '', body.id);
        return { message: 'Team member deleted successfully', data };
    }
    async listNewsletterSubscribers() {
        const data = await this.adminService.listNewsletterSubscribers();
        return {
            message: data.length > 0
                ? 'Subscribers retrieved successfully'
                : 'No subscriptions found',
            data,
        };
    }
    async deleteNewsletterSubscriberPost(body) {
        const data = await this.adminService.deleteNewsletterSubscriber(body.id);
        return { message: 'Subscriber deleted successfully', data };
    }
    async deleteNewsletterSubscriberDelete(body) {
        const data = await this.adminService.deleteNewsletterSubscriber(body.id);
        return { message: 'Subscriber deleted successfully', data };
    }
    async setNewsletterSubscriberStatusPost(body) {
        const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(body.id, body.status);
        return { message: 'Subscriber status updated successfully', data };
    }
    async setNewsletterSubscriberStatusPatch(body) {
        const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(body.id, body.status);
        return { message: 'Subscriber status updated successfully', data };
    }
    async setNewsletterSubscriberStatusParam(id, body) {
        const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(id, body?.status);
        return { message: 'Subscriber status updated successfully', data };
    }
    listTeamMemberSectorOptions() {
        return this.adminService.listTeamMemberSectorOptions();
    }
    async listTeamMembers(user, query) {
        return this.executeListTeamMembers(user, query);
    }
    async listTeamMembersPaginated(user, query) {
        return this.executeListTeamMembers(user, query);
    }
    async executeListTeamMembers(user, query) {
        const result = await this.adminService.listTeamMembersPaginated(user?.vendorId ?? '', query);
        return {
            message: 'Team members retrieved successfully',
            data: result.data,
            displayOrderMax: result.displayOrderMax,
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
        };
    }
    async listContactMessages() {
        const data = await this.adminService.listContactMessages();
        return { message: 'Contact messages retrieved successfully', data };
    }
    async viewContactMessage(id) {
        const data = await this.adminService.getContactMessageById(id);
        return { message: 'Contact message retrieved successfully', data };
    }
    async acknowledgeContactMessage(id, user) {
        const adminUserId = String(user?.userId ?? user?.vendorId ?? '').trim();
        const data = await this.adminService.acknowledgeInquiry(id, 'contact', adminUserId);
        return { message: 'Contact enquiry acknowledged successfully', data };
    }
    async listProductInquiries() {
        const data = await this.adminService.listProductInquiries();
        return { message: 'Product inquiries retrieved successfully', data };
    }
    async viewProductInquiry(id) {
        const data = await this.adminService.getProductInquiryById(id);
        return { message: 'Product inquiry retrieved successfully', data };
    }
    async acknowledgeProductInquiry(id, user) {
        const adminUserId = String(user?.userId ?? user?.vendorId ?? '').trim();
        const data = await this.adminService.acknowledgeInquiry(id, 'product', adminUserId);
        return { message: 'Product enquiry acknowledged successfully', data };
    }
    async deleteContactMessagePost(body) {
        const data = await this.adminService.deleteContactMessage(body.id);
        return { message: 'Contact message deleted successfully', data };
    }
    async deleteContactMessageDelete(body) {
        const data = await this.adminService.deleteContactMessage(body.id);
        return { message: 'Contact message deleted successfully', data };
    }
    async searchTeamMembersByName(user, name) {
        const trimmed = name?.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Query parameter "name" is required');
        }
        const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
            name: trimmed,
        });
        return { message: 'Team members search completed successfully', data };
    }
    async searchTeamMembersByEmail(user, email) {
        const trimmed = email?.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Query parameter "email" is required');
        }
        const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
            email: trimmed,
        });
        return { message: 'Team members search completed successfully', data };
    }
    async searchTeamMembers(user, name, email) {
        const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
            name: name?.trim() || undefined,
            email: email?.trim() || undefined,
        });
        return { message: 'Team members search completed successfully', data };
    }
    async getTeamMemberById(user, id) {
        const data = await this.adminService.getTeamMemberById(user?.vendorId ?? '', id);
        return { message: 'Team member retrieved successfully', data };
    }
    async updateTeamMemberStatus(user, id) {
        const data = await this.adminService.updateTeamMemberStatus(user?.vendorId ?? '', id);
        return { message: 'Team member status updated successfully', data };
    }
    async changePassword(user, changePasswordDto) {
        await this.manufacturersService.changePassword(user.userId, changePasswordDto);
        return { message: 'Password changed successfully' };
    }
    async countManufacturerPlantCertificates(manufacturerId) {
        const id = String(manufacturerId ?? '').trim();
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid manufacturer ID format');
        }
        const manufacturer = await this.manufacturersService.findById(id);
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const plantCount = await this.vendorCertificateService.countManufacturerCertifiedPlantCertificates(id);
        return {
            message: 'Manufacturer plant certificate count retrieved successfully',
            data: { plantCount, manufacturerId: id },
        };
    }
    async bulkDownloadManufacturerCertificates(manufacturerId, batchRaw, res) {
        const id = String(manufacturerId ?? '').trim();
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid manufacturer ID format');
        }
        const manufacturer = await this.manufacturersService.findById(id);
        if (!manufacturer) {
            throw new common_1.NotFoundException('Manufacturer not found');
        }
        const batchNum = batchRaw != null && String(batchRaw).trim() !== ''
            ? Number(batchRaw)
            : undefined;
        if (batchNum != null &&
            (!Number.isFinite(batchNum) || batchNum < 1 || !Number.isInteger(batchNum))) {
            throw new common_1.BadRequestException('batch must be a positive integer');
        }
        const result = await this.vendorCertificateService.resolveBulkCertificates(id, {
            batch: batchNum,
            downloadUrlBase: `/admin/manufacturers/${encodeURIComponent(id)}/certificates/bulk`,
        });
        if (result.kind === 'meta') {
            return {
                message: 'Bulk certificate batches available',
                data: result.meta,
                ...result.meta,
            };
        }
        const file = result.file;
        if (res) {
            if (file.certificateCount != null) {
                res.setHeader('X-GreenPro-Certificate-Count', String(file.certificateCount));
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type, X-GreenPro-Certificate-Count');
        }
        return new common_1.StreamableFile(file.buffer, {
            type: 'application/pdf',
            disposition: `inline; filename="${file.fileName}"`,
        });
    }
    async updateManufacturer(id, body, file) {
        const updateDto = (0, class_transformer_1.plainToClass)(update_manufacturer_dto_1.UpdateManufacturerDto, {
            manufacturerName: body.manufacturerName,
            gpInternalId: body.gpInternalId,
            manufacturerInitial: body.manufacturerInitial,
        });
        const errors = await (0, class_validator_1.validate)(updateDto);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            throw new common_1.BadRequestException(errorMessages.join(', '));
        }
        const imagePath = file
            ? (await (0, upload_file_util_1.uploadFile)(file, 'manufacturers')).fileUrl
            : undefined;
        const manufacturer = await this.adminService.updateManufacturer(id, updateDto, imagePath);
        return {
            message: 'Manufacturer updated successfully',
            data: manufacturer,
        };
    }
    async updateManufacturerStatus(id) {
        const manufacturer = await this.adminService.updateManufacturerStatus(id);
        return {
            message: 'Manufacturer status updated successfully',
            data: manufacturer,
        };
    }
    async updateVendorStatus(id) {
        const vendor = await this.adminService.updateVendorStatus(id);
        return {
            message: 'Vendor status updated successfully',
            data: vendor,
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('payments/list'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Admin payment history (all vendors)',
        description: 'Lists payment_details across the platform (registration, certification, renew). ' +
            'Same URN-based rules as the vendor GET /payments. Optional `manufacturerId` to scope one vendor. ' +
            'Omit `status` to include all statuses. Search matches URN, reference no., or manufacturer name/email.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment history retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_payments_dto_1.AdminListPaymentsDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listAdminPayments", null);
__decorate([
    (0, common_1.Get)('dashboard/metrics'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Admin dashboard metrics',
        description: 'Returns dashboard KPIs, **charts** (product status breakdown, certified vs uncertified, URN pipeline, ' +
            'category certified counts, time-series), and **visibleSections** for RBAC. ' +
            'Query filters: `period`, `year`, `month`, `quarter`, `productStatus`, `categoryId`, `region`, `granularity`. ' +
            'See `data.charts.productStatusBreakdown`, `certifiedVsUncertified`, `urnPipeline`, `categoryCertified`. ' +
            'Revenue widgets use GET /admin/dashboard/revenue-analytics.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metrics retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('dashboard/certified-vs-uncertified-products'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Certified vs uncertified product metrics',
        description: 'Returns card totals + chart payload for certified and uncertified products on the admin dashboard.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Certified vs uncertified metrics retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCertifiedVsUncertifiedProducts", null);
__decorate([
    (0, common_1.Get)('dashboard/verified-vs-unverified-manufacturers'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verified vs unverified manufacturer metrics',
        description: 'Returns card totals + chart payload for verified and unverified manufacturers on the admin dashboard.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verified vs unverified manufacturer metrics retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVerifiedVsUnverifiedManufacturers", null);
__decorate([
    (0, common_1.Get)('dashboard/expired-products-impact'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Expired products impact tracking',
        description: 'Returns expired certification impact totals (counts + percent) and chart payload for admin dashboard.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired products impact metrics retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getExpiredProductsImpact", null);
__decorate([
    (0, common_1.Get)('dashboard/product-status-breakdown'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Product status breakdown for admin dashboard',
        description: 'Returns certified, uncertified, expired, and renewed product counts plus chart payload. ' +
            'Same data as `GET /admin/dashboard/metrics` → `data.charts.productStatusBreakdown`.',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProductStatusBreakdown", null);
__decorate([
    (0, common_1.Get)('dashboard/urn-pipeline'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'URN certification pipeline counts',
        description: 'Returns product counts per admin pipeline step (EOI → Certified). ' +
            'Same data as `GET /admin/dashboard/metrics` → `data.charts.urnPipeline`.',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUrnPipeline", null);
__decorate([
    (0, common_1.Get)('dashboard/revenue-analytics'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Revenue analytics for admin dashboard',
        description: 'Returns donut (`distribution`: total centre + fee %/amount) and weekly line chart (`weeklyComparison`). ' +
            'Source: `payment_details` with `paymentStatus` 1–2, summed on `quoteAmount` (ex-GST). ' +
            'Filters: `period=last_month|this_month|this_week|this_year` (or alias `last_month`, `month`, `week`, `year`). ' +
            'Prefer GET /admin/dashboard/revenue for the same payload.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue analytics retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('dashboard/rejected-products-analytics'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Rejected products analytics',
        description: 'Returns rejected-product totals, rejection rate, and chart payload for admin dashboard.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rejected products analytics retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_metrics_query_dto_1.DashboardMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRejectedProductsAnalytics", null);
__decorate([
    (0, common_1.Get)('dashboard/filters'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Dashboard filter options',
        description: 'Returns period/year/month labels and values for the admin dashboard filter bar. ' +
            'Use the same query param names when calling GET /admin/dashboard/metrics.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardFilters", null);
__decorate([
    (0, common_1.Get)('dashboard/recent-products'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, ...permissions_constants_1.PRODUCTS_VIEW_ANY),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Recent products for admin dashboard table',
        description: 'Latest product/URN rows (same shape as POST /api/admin/products/list).',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_metrics_query_dto_1.DashboardRecentProductsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardRecentProducts", null);
__decorate([
    (0, common_1.Get)('dashboard/activity'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, ...permissions_constants_1.PRODUCTS_VIEW_ANY),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Recent certification activity for admin dashboard',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_metrics_query_dto_1.DashboardActivityQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardActivity", null);
__decorate([
    (0, common_1.Patch)('profile/edit'),
    (0, allow_authenticated_admin_portal_user_decorator_1.AllowAuthenticatedAdminPortalUser)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit profile (unique GST + phone)',
        description: 'Edits the logged-in vendor profile on the linked manufacturer. Blocks the update if GST number or phone already exists for another vendor. ' +
            '**gst** = GST certificate document URL path (or `https://…`); **gstNumber** = GSTIN; **companyLogo** = logo image URL; **pan** = PAN card document URL (**PDF, JPG, or PNG** file). Legacy: plain GSTIN may still be sent in **gst**.',
    }),
    (0, swagger_1.ApiBody)({ type: update_manufacturer_profile_dto_1.UpdateProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or GST/phone already exists',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired token' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_manufacturer_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editProfile", null);
__decorate([
    (0, common_1.Get)('banner/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List banners (vendor admin)',
        description: 'Returns **this vendor’s** banners for the admin grid (ordered by sequence number): **title**, **description**, **sequenceNumber**, **is_active**, and **id**. IDs match **GET /admin/banner/:id** (vendor-scoped). For **all** active banners on the public site, use **GET /website/public/banners**.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Banner cards data',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Banners retrieved successfully' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            s_no: { type: 'number', example: 1 },
                            id: { type: 'string' },
                            title: { type: 'string' },
                            sequenceNumber: { type: 'number' },
                            description: { type: 'string' },
                            is_active: { type: 'boolean' },
                            imageSource: {
                                type: 'string',
                                enum: ['binary_upload', 'manual_url'],
                                description: 'binary_upload = multipart file; manual_url = image URL/path',
                            },
                        },
                    },
                },
                displayOrderMax: { type: 'number', example: 6 },
            },
        },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listBanners", null);
__decorate([
    (0, common_1.Post)('banner'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_ADD),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)(bannerImageMultipartFields, (0, banner_image_upload_util_1.createBannerDiskMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Create banner',
        description: 'Creates a banner for the logged-in vendor. Provide either a multipart image file (**image**, **bannerImage**, **banner_image**, or **file**) or **imageUrl** (http(s) public URL or `/uploads/...`). Server stores **imageSource**: `binary_upload` vs `manual_url` from that choice.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary', description: 'Primary file field name' },
                bannerImage: { type: 'string', format: 'binary' },
                banner_image: { type: 'string', format: 'binary' },
                file: { type: 'string', format: 'binary' },
                imageUrl: {
                    type: 'string',
                    description: 'Public http(s) image URL or `/uploads/...` path. Optional when uploading a file.',
                },
                title: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] },
                sequenceNumber: { type: 'number', example: 1 },
                description: { type: 'string' },
                imageSource: {
                    type: 'string',
                    enum: ['binary_upload', 'manual_url'],
                    description: 'Optional; server derives from whether multipart `image` or `imageUrl` was used.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Banner created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid vendor',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBanner", null);
__decorate([
    (0, common_1.Patch)(['banner/:id', 'banner/:id/edit']),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)(bannerImageMultipartFields, (0, banner_image_upload_util_1.createBannerDiskMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit banner',
        description: 'Edits a banner for the logged-in vendor. Replace the image by uploading multipart **image**, **bannerImage**, **banner_image**, or **file**, or by sending a new **imageUrl** (public http(s) URL or `/uploads/...`).',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id (from banner list)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['title', 'sequenceNumber', 'description'],
            properties: {
                image: { type: 'string', format: 'binary' },
                bannerImage: { type: 'string', format: 'binary' },
                banner_image: { type: 'string', format: 'binary' },
                file: { type: 'string', format: 'binary' },
                imageUrl: {
                    type: 'string',
                    description: 'Optional public http(s) URL or `/uploads/...` path when not uploading a new file.',
                },
                title: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] },
                sequenceNumber: { type: 'number', example: 1 },
                description: { type: 'string' },
                imageSource: {
                    type: 'string',
                    enum: ['binary_upload', 'manual_url'],
                    description: 'Optional; updated when a new image file or imageUrl is provided.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error / invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editBanner", null);
__decorate([
    (0, common_1.Post)('events/create'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_ADD),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'events'),
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname || '');
                cb(null, `event-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file?.originalname) {
                cb(null, true);
                return;
            }
            const allowedMimes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            cb(null, allowedMimes.includes(file.mimetype));
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Create event',
        description: 'Creates an event (Admin panel). Multipart form fields: eventName, image, eventDate, eventStartTime, eventEndTime, eventLocation, eventDescription, contact person details, and detail sections (whatsInside, keyPoints, whoItsFor, tags). Array fields may be sent as JSON strings.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['eventName', 'eventDate'],
            properties: {
                eventName: { type: 'string' },
                image: { type: 'string', format: 'binary' },
                eventDate: { type: 'string', example: '2026-04-08' },
                eventStartTime: { type: 'string' },
                eventEndTime: { type: 'string' },
                eventLocation: { type: 'string' },
                eventDescription: { type: 'string' },
                contactPersonName: { type: 'string' },
                contactPersonDesignation: { type: 'string' },
                contactPersonEmail: { type: 'string' },
                contactPersonPhone: { type: 'string' },
                whatsInside: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_MAX} items, ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_ITEM_MAX} chars each)`,
                    example: '["Introduction to Green Building","Cement and manufacturing"]',
                },
                keyPoints: {
                    type: 'string',
                    description: `JSON array of {heading, description} (max ${article_detail_sections_util_1.ARTICLE_KEY_POINTS_MAX})`,
                    example: '[{"heading":"Standardization","description":"Clearer standards help procurement teams compare materials."}]',
                },
                whoItsFor: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHO_ITS_FOR_MAX} items)`,
                    example: '["Architects and consultants","Government and corporate procurement teams"]',
                },
                tags: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_TAGS_MAX} items)`,
                    example: '["Event","Building materials","Eco-labels"]',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Patch)('events/:id/edit'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 20 },
        { name: 'images', maxCount: 20 },
        { name: 'eventImage', maxCount: 20 },
        { name: 'event_image', maxCount: 20 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'events'),
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname || '');
                cb(null, `event-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file?.originalname) {
                cb(null, true);
                return;
            }
            const allowedMimes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            cb(null, allowedMimes.includes(file.mimetype));
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit event',
        description: 'Edits an event (Admin panel). Same fields as create, including detail sections (whatsInside, keyPoints, whoItsFor, tags). URL param `id` can be MongoDB _id or numeric eventId. Array fields may be sent as JSON strings.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                eventName: { type: 'string' },
                image: { type: 'string', format: 'binary' },
                eventDate: { type: 'string', example: '09-04-2026' },
                eventStartTime: { type: 'string' },
                eventEndTime: { type: 'string' },
                eventLocation: { type: 'string' },
                eventDescription: { type: 'string' },
                contactPersonName: { type: 'string' },
                contactPersonDesignation: { type: 'string' },
                contactPersonEmail: { type: 'string' },
                contactPersonPhone: { type: 'string' },
                whatsInside: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_MAX} items, ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_ITEM_MAX} chars each)`,
                },
                keyPoints: {
                    type: 'string',
                    description: `JSON array of {heading, description} (max ${article_detail_sections_util_1.ARTICLE_KEY_POINTS_MAX})`,
                },
                whoItsFor: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHO_ITS_FOR_MAX} items)`,
                },
                tags: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_TAGS_MAX} items)`,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editEvent", null);
__decorate([
    (0, common_1.Post)('gallery/create'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_ADD),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'image[]', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'images', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
    ], (0, multer_universal_config_1.adminImageMemoryMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Create gallery item',
        description: 'Creates a gallery item. Fields accepted: title, description, date, galleryType, image. ' +
            'galleryType dropdown must only use: Training & Workshops, Site Visits, Recognition.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['title', 'date', 'galleryType'],
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                date: { type: 'string', example: '2026-04-08' },
                galleryType: { type: 'string', enum: [...gallery_schema_1.GALLERY_TYPES] },
                image: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Upload one or more images with field name "image"',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Gallery item created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createGallery", null);
__decorate([
    (0, common_1.Patch)('gallery/:id/edit'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'image[]', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'images', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'eventImage', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
        { name: 'event_image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
    ], (0, multer_universal_config_1.adminImageMemoryMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit gallery item',
        description: 'Edits a gallery item by id. Fields accepted: title, description, date, galleryType, image. ' +
            'galleryType dropdown must only use: Training & Workshops, Site Visits, Recognition.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                date: { type: 'string', example: '2026-04-08' },
                galleryType: { type: 'string', enum: [...gallery_schema_1.GALLERY_TYPES] },
                image: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Upload one or more images with field name "image"',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editGallery", null);
__decorate([
    (0, common_1.Get)('events/manage/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all events (admin dashboard)',
        description: 'Returns all events for the admin dashboard, including events whose end date has passed. Website visibility is derived from event end date, not manual status.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listEventsForAdmin", null);
__decorate([
    (0, common_1.Get)('events/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List events (public website)',
        description: 'Returns paginated published events (eventStatus=1) for the public website events page (past and upcoming). Default: page=1, limit=10. Each row includes `is_active` based on whether the event end date has passed.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number (1-based). Default 1.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Items per page. Default 10, max 50.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated events list',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Events retrieved successfully' },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        perPage: { type: 'number', example: 10 },
                        total: { type: 'number', example: 25 },
                        totalPages: { type: 'number', example: 3 },
                    },
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            s_no: { type: 'number', example: 1 },
                            id: { type: 'string' },
                            eventId: { type: 'number', nullable: true },
                            image: { type: 'string', nullable: true },
                            eventName: { type: 'string' },
                            dateTime: { type: 'string', example: '2026-03-25 03:00 PM' },
                            location: { type: 'string' },
                            is_active: { type: 'boolean' },
                        },
                    },
                },
            },
        },
    }),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listEvents", null);
__decorate([
    (0, common_1.Get)('gallery/types'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Gallery type options for add/edit dropdown',
        description: 'Returns only the gallery tabs allowed in admin add/edit: Training & Workshops, Site Visits, Recognition.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gallery type options',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            value: { type: 'string', enum: [...gallery_schema_1.GALLERY_TYPES] },
                            label: { type: 'string', enum: [...gallery_schema_1.GALLERY_TYPES] },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listGalleryTypes", null);
__decorate([
    (0, common_1.Get)('gallery/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List gallery items (admin)',
        description: 'Returns paginated gallery items for the admin CMS. Default: page=1, limit=50.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number (1-based). Default 1.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 50,
        description: 'Items per page. Default 50, max 50.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gallery list',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Gallery retrieved successfully' },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        perPage: { type: 'number', example: 50 },
                        total: { type: 'number', example: 145 },
                        totalPages: { type: 'number', example: 3 },
                    },
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            s_no: { type: 'number', example: 1 },
                            id: { type: 'string' },
                            eventId: { type: 'number', nullable: true },
                            title: { type: 'string' },
                            galleryType: { type: 'string', enum: [...gallery_schema_1.GALLERY_TYPES] },
                            description: { type: 'string' },
                            date: { type: 'string', example: '2026-03-25' },
                            image: { type: 'string', nullable: true },
                            images: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            event_image: { type: 'string', nullable: true },
                            is_active: { type: 'boolean' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listGallery", null);
__decorate([
    (0, common_1.Get)('gallery/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get gallery item by id (admin)',
        description: 'Returns one gallery item for edit/view with fields: title, description, date, image, images.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGalleryById", null);
__decorate([
    (0, common_1.Patch)('gallery/:id/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle gallery status',
        description: 'Sets gallery item status to active/inactive. If body status is omitted, backend toggles current status.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['active', 'inactive'] },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateGalleryStatus", null);
__decorate([
    (0, common_1.Post)('articles/create'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_ADD),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
        { name: 'image[]', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
        { name: 'images', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
    ], (0, multer_universal_config_1.adminArticleMemoryMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Create article',
        description: `Creates an article with title, publisher, date, up to ${article_schema_1.ARTICLE_MAX_IMAGES} images (1st = heading; all shown below What's inside), externalUrl toggle, detail sections (whatsInside, keyPoints, whoItsFor, tags) and status. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url and shortDescription are required and full description is hidden. Array fields may be sent as JSON strings in multipart.`,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['title', 'date', 'image'],
            properties: {
                title: { type: 'string' },
                publisher: {
                    type: 'string',
                    description: 'Publisher / source name (plain text)',
                    example: 'IGBC',
                },
                description: { type: 'string' },
                shortDescription: { type: 'string' },
                date: { type: 'string', example: '2026-05-05' },
                externalUrl: { type: 'boolean', default: false },
                image: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: `Upload 1–${article_schema_1.ARTICLE_MAX_IMAGES} images (field name "image"). First image is the heading; all images appear below What's inside.`,
                },
                url: { type: 'string' },
                whatsInside: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_MAX} items, ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_ITEM_MAX} chars each)`,
                    example: '["Introduction to Green Building","Cement and manufacturing"]',
                },
                keyPoints: {
                    type: 'string',
                    description: `JSON array of {heading, description} (max ${article_detail_sections_util_1.ARTICLE_KEY_POINTS_MAX}; heading ${article_detail_sections_util_1.ARTICLE_KEY_POINT_HEADING_MAX}, description ${article_detail_sections_util_1.ARTICLE_KEY_POINT_DESCRIPTION_MAX})`,
                    example: '[{"heading":"Standardization","description":"Clearer standards help procurement teams compare materials."}]',
                },
                whoItsFor: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHO_ITS_FOR_MAX} items, ${article_detail_sections_util_1.ARTICLE_WHO_ITS_FOR_ITEM_MAX} chars each)`,
                    example: '["Architects and consultants","Government and corporate procurement teams"]',
                },
                tags: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_TAGS_MAX} items, ${article_detail_sections_util_1.ARTICLE_TAG_ITEM_MAX} chars each)`,
                    example: '["Event","Building materials","Eco-labels"]',
                },
                status: { type: 'string', enum: ['active', 'inactive'] },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Patch)('articles/:id/edit'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
        { name: 'image[]', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
        { name: 'images', maxCount: article_schema_1.ARTICLE_MAX_IMAGES },
    ], (0, multer_universal_config_1.adminArticleMemoryMulterOptions)())),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit article',
        description: `Edits article fields: title, publisher, date, images (max ${article_schema_1.ARTICLE_MAX_IMAGES}; 1st = heading), externalUrl toggle, url/description/shortDescription, detail sections (whatsInside, keyPoints, whoItsFor, tags) and status. Pass existingImages as a JSON array of kept URLs and upload new files via image. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url and shortDescription are required and full description is hidden. Array fields may be sent as JSON strings in multipart.`,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                publisher: {
                    type: 'string',
                    description: 'Publisher / source name (plain text)',
                    example: 'IGBC',
                },
                description: { type: 'string' },
                shortDescription: { type: 'string' },
                date: { type: 'string', example: '2026-05-05' },
                externalUrl: { type: 'boolean' },
                image: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: `Upload additional images (max ${article_schema_1.ARTICLE_MAX_IMAGES} total with existingImages)`,
                },
                existingImages: {
                    type: 'string',
                    description: 'JSON array of existing image URLs to keep',
                },
                url: { type: 'string' },
                whatsInside: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_MAX} items, ${article_detail_sections_util_1.ARTICLE_WHATS_INSIDE_ITEM_MAX} chars each)`,
                },
                keyPoints: {
                    type: 'string',
                    description: `JSON array of {heading, description} (max ${article_detail_sections_util_1.ARTICLE_KEY_POINTS_MAX})`,
                },
                whoItsFor: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_WHO_ITS_FOR_MAX} items)`,
                },
                tags: {
                    type: 'string',
                    description: `JSON array of strings (max ${article_detail_sections_util_1.ARTICLE_TAGS_MAX} items)`,
                },
                status: { type: 'string', enum: ['active', 'inactive'] },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editArticle", null);
__decorate([
    (0, common_1.Get)(['articles/list', 'article/list']),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List articles',
        description: 'Returns articles with title, publisher, description, date, image/images, url and active flag (newest first).',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Articles retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listArticles", null);
__decorate([
    (0, common_1.Get)('articles/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get article by id',
        description: 'Returns one article for view/edit with title, publisher, description, date, image, url and active flag.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getArticleById", null);
__decorate([
    (0, common_1.Patch)('articles/:id/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle article status',
        description: 'Sets article status to active/inactive. If body status is omitted, backend toggles current status.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['active', 'inactive'] },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateArticleStatus", null);
__decorate([
    (0, common_1.Delete)('articles/:id/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete article',
        description: 'Soft-deletes an article by id (`isDeleted` / `deletedAt`). This is an alias route for frontend convenience.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteArticleAlias", null);
__decorate([
    (0, common_1.Delete)('articles/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.ARTICLES_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete article',
        description: 'Soft-deletes an article by id. Same behavior as DELETE /admin/articles/:id/delete.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteArticle", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get event by id (for edit/view)',
        description: 'Fetches one event with all fields needed to pre-fill the edit form. Accepts MongoDB _id or numeric eventId.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Delete)('events/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete event',
        description: 'Soft-deletes an event (`isDeleted` / `deletedAt`). `id` can be MongoDB _id or numeric eventId.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.Delete)('gallery/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete gallery item',
        description: 'Soft-deletes a gallery item (`isDeleted` / `deletedAt`). `id` can be MongoDB _id or numeric galleryId.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteGallery", null);
__decorate([
    (0, common_1.Delete)('gallery/:id/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GALLERY_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete gallery item (alias)',
        description: 'Alias of DELETE /admin/gallery/:id for frontend convenience.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteGalleryAlias", null);
__decorate([
    (0, common_1.Post)('manufacturer/reply'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_REPLY),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reply to customer (email)',
        description: 'Sends an email to the customer. Requires email, userMessage, replyMessage.',
    }),
    (0, swagger_1.ApiBody)({ type: manufacturer_reply_dto_1.ManufacturerReplyDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply email sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manufacturer_reply_dto_1.ManufacturerReplyDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyToCustomer", null);
__decorate([
    (0, common_1.Post)('contact/:id/reply'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_REPLY),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reply to contact message (store history)',
        description: 'Sends reply email to the contact message email, and stores only the admin reply history linked to contact message id.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact message MongoDB id' }),
    (0, swagger_1.ApiBody)({ type: contact_reply_dto_1.ContactReplyDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply sent and stored' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error / invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contact_reply_dto_1.ContactReplyDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyToContact", null);
__decorate([
    (0, common_1.Get)('contact/:id/replies'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contact reply history',
        description: 'Returns stored admin reply history for a given contact message id.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact message MongoDB id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply history' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getContactReplies", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'),
    (0, allow_authenticated_admin_portal_user_decorator_1.AllowAuthenticatedAdminPortalUser)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List admin in-app notifications',
        description: 'Admin bell feed (`notifications` collection). Optional time-range: all, today, week, 30d, 90d. Use PATCH `.../:id/seen` to mark read (`id` = MongoDB _id).',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'range',
        required: false,
        enum: ['all', 'today', 'week', '30d', '90d'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({
        name: 'seen',
        required: false,
        type: Boolean,
        description: 'Optional: true = read only, false = unread only',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notifications list with pagination and root unreadCount (unread within range filter)',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_notifications_query_dto_1.ListNotificationsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/seen-all'),
    (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'),
    (0, allow_authenticated_admin_portal_user_decorator_1.AllowAuthenticatedAdminPortalUser)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark all admin notifications as seen',
        description: 'Sets seen=true on all unread rows in the admin feed. Returns markedCount.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as seen' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markAllNotificationsSeen", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/seen'),
    (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'),
    (0, allow_authenticated_admin_portal_user_decorator_1.AllowAuthenticatedAdminPortalUser)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark an admin notification as seen' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Notification MongoDB _id (24-char hex)',
        example: '674a1b2c3d4e5f6789012345',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as seen' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markNotificationSeen", null);
__decorate([
    (0, common_1.Post)('banner/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete banner',
        description: 'Soft-deletes a banner by id (`isDeleted` / `deletedAt`). The banner must belong to the logged-in vendor. Same pattern as **team-member/delete** (JSON body).',
    }),
    (0, swagger_1.ApiBody)({ type: delete_banner_dto_1.DeleteBannerDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_banner_dto_1.DeleteBannerDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBannerPost", null);
__decorate([
    (0, common_1.Delete)('banner/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete banner',
        description: 'Same as **POST /admin/banner/delete** — JSON body `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_banner_dto_1.DeleteBannerDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_banner_dto_1.DeleteBannerDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBannerDelete", null);
__decorate([
    (0, common_1.Get)('banner/:id'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get banner by id',
        description: 'Returns one banner for the **View Banner** modal: **imageUrl**, **imageSource** (`binary_upload` vs `manual_url`), **title**, **sequenceNumber**, and **description**. Vendor-scoped.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBannerById", null);
__decorate([
    (0, common_1.Patch)('banner/:id/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle banner status',
        description: 'Sets a banner **status** to **active/inactive** (1/0). If body `status` is omitted, backend toggles current state. Vendor-scoped.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id' }),
    (0, swagger_1.ApiBody)({ type: update_banner_status_dto_1.UpdateBannerStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Banner status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_banner_status_dto_1.UpdateBannerStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBannerStatus", null);
__decorate([
    (0, common_1.Post)('team-member/create'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_ADD),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)(teamMemberImageInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: 'Create team member',
        description: 'Use **Authorize** (Bearer) as usual. Swagger sometimes drops `Authorization` on multipart uploads — then send the same JWT via **x-access-token** header or **access_token** query param. ' +
            '**businessVertical** is required and must be one of: Building Products, Industrial Products, Consumer Products, Facility Services. ' +
            '**Sectors** multiselect — fixed options only (GET **/admin/team-member/sector-options**): Building, Industries, Consumer Products, Facility Services. Send **sectors** as JSON array of names or ids 1–4, **sectors[]**, **sector_ids**, etc. Category fields are not accepted.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiHeader)({
        name: 'x-access-token',
        required: false,
        description: 'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'access_token',
        required: false,
        description: 'Raw JWT query fallback for multipart / Swagger',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                designation: { type: 'string' },
                email: { type: 'string' },
                mobile: { type: 'string' },
                displayOrder: { type: 'number', minimum: 1 },
                businessVertical: {
                    type: 'string',
                    enum: [...vendor_user_schema_1.BUSINESS_VERTICALS],
                },
                image: { type: 'string', format: 'binary' },
                facebookUrl: { type: 'string' },
                twitterUrl: { type: 'string' },
                linkedinUrl: { type: 'string' },
                roleId: { type: 'string', description: 'Legacy single role id' },
                roleIds: {
                    oneOf: [
                        { type: 'array', items: { type: 'string' } },
                        { type: 'string', description: 'JSON string array' },
                    ],
                },
                'roleIds[]': {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Repeated multipart fields for role ids',
                },
                sectors: {
                    oneOf: [
                        {
                            type: 'array',
                            items: {
                                oneOf: [{ type: 'integer' }, { type: 'string' }],
                            },
                        },
                        {
                            type: 'string',
                            description: 'JSON array of sector names or ids, e.g. ["Building","Industries"] or [1,2]',
                        },
                    ],
                    description: 'Multiselect: Building, Industries, Consumer Products, Facility Services',
                },
                sector: {
                    oneOf: [{ type: 'integer' }, { type: 'string' }],
                    description: 'Legacy single sector id',
                },
                'sectors[]': {
                    type: 'array',
                    items: { type: 'integer' },
                    description: 'Repeated multipart sector id fields',
                },
                sector_ids: {
                    oneOf: [
                        { type: 'array', items: { type: 'integer' } },
                        { type: 'string' },
                    ],
                },
                sectorIds: {
                    type: 'string',
                    description: 'JSON array string of sector ids',
                },
            },
            required: ['name', 'email', 'mobile', 'businessVertical'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Team member created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or mobile already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTeamMember", null);
__decorate([
    TeamMemberEditDocs(),
    (0, common_1.Post)('team-member/edit'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_UPDATE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTeamMemberPost", null);
__decorate([
    TeamMemberEditDocs(),
    (0, common_1.Patch)('team-member/edit'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_UPDATE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTeamMemberPatch", null);
__decorate([
    (0, common_1.Post)('team-member/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete team member (soft delete)',
        description: 'Sets team member **status** to **2** (removed from list). Same behaviour as partner delete. **POST** or **DELETE** with JSON body `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_team_member_dto_1.DeleteTeamMemberDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_team_member_dto_1.DeleteTeamMemberDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTeamMemberPost", null);
__decorate([
    (0, common_1.Delete)('team-member/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete team member (soft delete)',
        description: 'Same as POST **/admin/team-member/delete** — JSON body `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_team_member_dto_1.DeleteTeamMemberDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_team_member_dto_1.DeleteTeamMemberDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTeamMemberDelete", null);
__decorate([
    (0, common_1.Get)('newsletter/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List newsletter subscribers (admin)',
        description: 'Returns website newsletter subscriptions for the admin subscribers table. Reads directly from MongoDB.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscribers retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listNewsletterSubscribers", null);
__decorate([
    (0, common_1.Post)('newsletter/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete newsletter subscriber',
        description: 'Soft-deletes a newsletter subscriber by id (MongoDB _id). JSON body: `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriber deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteNewsletterSubscriberPost", null);
__decorate([
    (0, common_1.Delete)('newsletter/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete newsletter subscriber',
        description: 'Same as **POST /admin/newsletter/delete** — JSON body `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriber deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteNewsletterSubscriberDelete", null);
__decorate([
    (0, common_1.Post)('newsletter/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle newsletter subscriber status',
        description: 'For subscribers list toggle. If `status` is omitted, backend toggles current status. Accepts MongoDB _id or S.No as `id`.',
    }),
    (0, swagger_1.ApiBody)({ type: update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscriber status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setNewsletterSubscriberStatusPost", null);
__decorate([
    (0, common_1.Patch)('newsletter/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle newsletter subscriber status',
        description: 'Same as **POST /admin/newsletter/status** — JSON body `{ "id": "...", "status"?: "active|inactive" }`.',
    }),
    (0, swagger_1.ApiBody)({ type: update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscriber status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setNewsletterSubscriberStatusPatch", null);
__decorate([
    (0, common_1.Patch)('newsletter/:id/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set/toggle newsletter subscriber status (param)',
        description: 'Alternative form: pass id in URL. Optional body `{ "status"?: "active|inactive" }`. If status omitted, toggles.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Mongo _id or S.No (1-based)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscriber status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setNewsletterSubscriberStatusParam", null);
__decorate([
    (0, common_1.Get)('team-member/sector-options'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Fixed team member sector options',
        description: 'Returns the four allowed CMS team-member sectors for multiselect (not from GET /api/sectors): Building, Industries, Consumer Products, Facility Services.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Building' },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listTeamMemberSectorOptions", null);
__decorate([
    (0, common_1.Get)('team-member/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List team members',
        description: 'Returns global team members dataset for admin panel: serial number, name, designation, email, mobile, displayOrder, businessVertical, active flag, and id for actions. Excludes soft-deleted members (status 2). Sorted by displayOrder ascending.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team member list',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Team members retrieved successfully',
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            s_no: { type: 'number', example: 1 },
                            id: { type: 'string' },
                            name: { type: 'string' },
                            designation: { type: 'string' },
                            email: { type: 'string' },
                            mobile: { type: 'string' },
                            displayOrder: { type: 'number', example: 1 },
                            businessVertical: {
                                type: 'string',
                                example: 'building products',
                                enum: [...vendor_user_schema_1.BUSINESS_VERTICALS],
                            },
                            business_vertical: { type: 'string', example: 'building products' },
                            is_active: { type: 'boolean' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_team_members_query_dto_1.ListTeamMembersQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listTeamMembers", null);
__decorate([
    (0, common_1.Get)('team-members/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List team members (filters + pagination)',
        description: 'Supports filters (status, designation) and pagination (page, limit). Uses global team-members dataset and displayOrder sorting.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'active | inactive',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'designation',
        required: false,
        description: 'Exact designation match (case-insensitive)',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Default 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Default 10' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_team_members_query_dto_1.ListTeamMembersQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listTeamMembersPaginated", null);
__decorate([
    (0, common_1.Get)('contact/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List contact messages',
        description: 'Returns website contact form submissions for the admin panel table: S.No, Name, Email, Phone No, plus id for actions. Newest first.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contact messages list',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Contact messages retrieved successfully',
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            s_no: { type: 'number', example: 1 },
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string' },
                            phoneNo: { type: 'string' },
                            message: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listContactMessages", null);
__decorate([
    (0, common_1.Get)('contact/:id/view'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'View contact message',
        description: 'Returns one contact message for admin view: name, email, phone, subject, message.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Contact message MongoDB id (from list)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact message details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "viewContactMessage", null);
__decorate([
    (0, common_1.Patch)('contact/:id/acknowledge'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Acknowledge contact enquiry (one-way)',
        description: 'Marks a contact enquiry as acknowledged. Already-acknowledged rows are left unchanged. Stores isAcknowledged, acknowledgedAt, and acknowledgedBy.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Contact message MongoDB id (from list)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact enquiry acknowledged' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acknowledgeContactMessage", null);
__decorate([
    (0, common_1.Get)('product-inquiry/list'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List product inquiries',
        description: 'Returns ecolabelled product inquiry submissions for the admin panel with resolved manufacturerName, categoryName, productName, urnNumber, and eoiNo.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listProductInquiries", null);
__decorate([
    (0, common_1.Get)('product-inquiry/:id/view'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'View product inquiry',
        description: 'Returns one product inquiry with manufacturer, product, category, and URN details.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "viewProductInquiry", null);
__decorate([
    (0, common_1.Patch)('product-inquiry/:id/acknowledge'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Acknowledge product enquiry (one-way)',
        description: 'Marks a product enquiry as acknowledged. Already-acknowledged rows are left unchanged. Stores isAcknowledged, acknowledgedAt, and acknowledgedBy.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product inquiry MongoDB id (from list)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product enquiry acknowledged' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product inquiry not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acknowledgeProductInquiry", null);
__decorate([
    (0, common_1.Post)('contact/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete contact message',
        description: 'Soft-deletes a contact message by id. JSON body: `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_contact_message_dto_1.DeleteContactMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contact message deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_contact_message_dto_1.DeleteContactMessageDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteContactMessagePost", null);
__decorate([
    (0, common_1.Delete)('contact/delete'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete contact message',
        description: 'Same as **POST /admin/contact/delete** — JSON body `{ "id": "..." }`.',
    }),
    (0, swagger_1.ApiBody)({ type: delete_contact_message_dto_1.DeleteContactMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contact message deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_contact_message_dto_1.DeleteContactMessageDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteContactMessageDelete", null);
__decorate([
    (0, common_1.Get)('team-member/search/by-name'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Search team members by name',
        description: 'Case-insensitive partial match on **name** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: true,
        description: 'Substring to match against team member name',
        example: 'Priya',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results (may be empty array)',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing or empty name' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchTeamMembersByName", null);
__decorate([
    (0, common_1.Get)('team-member/search/by-email'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Search team members by email',
        description: 'Case-insensitive partial match on **email** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        required: true,
        description: 'Substring to match against team member email',
        example: 'greenpro',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results (may be empty array)',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing or empty email' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchTeamMembersByEmail", null);
__decorate([
    (0, common_1.Get)('team-member/search'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Search team members by name and/or email',
        description: 'Optional **name** and **email** query params (case-insensitive partial match). At least one is required. If both are sent, both must match (**AND**). Same response shape as the team member list.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        description: 'Substring to match against name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        required: false,
        description: 'Substring to match against email',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results (may be empty array)',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Neither name nor email provided' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchTeamMembers", null);
__decorate([
    (0, common_1.Get)('team-member/:id'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW, permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get team member by id',
        description: 'Returns one team member for the **View** modal: name, designation, email, mobile, displayOrder, businessVertical, status (**Active** / **Inactive**), image URL, social URLs, **sectors** (fixed: Building, Industries, Consumer Products, Facility Services). Soft-deleted excluded.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Team member MongoDB id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTeamMemberById", null);
__decorate([
    (0, common_1.Patch)('team-member/:id/status'),
    (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle team member status',
        description: 'Toggles team member (partner) **status**: **1** (active) ↔ **0** (inactive). Same as partner status toggle. Soft-deleted members (**2**) are not found.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Team member MongoDB id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team member status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id or unexpected status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTeamMemberStatus", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, allow_authenticated_admin_portal_user_decorator_1.AllowAuthenticatedAdminPortalUser)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Change password',
        description: 'Updates the logged-in user password after verifying the current password.',
    }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or passwords do not match',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid token or wrong current password',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('manufacturers/:manufacturerId/certificates/plant-count'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.MANUFACTURERS_VERIFIED_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Count certified plant certificates for a manufacturer',
        description: 'Admin verified-manufacturers view. Returns plant-certificate page count (productStatus=2).',
    }),
    (0, swagger_1.ApiParam)({ name: 'manufacturerId', description: 'Manufacturer MongoDB ObjectId' }),
    __param(0, (0, common_1.Param)('manufacturerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "countManufacturerPlantCertificates", null);
__decorate([
    (0, common_1.Get)('manufacturers/:manufacturerId/certificates/bulk'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.MANUFACTURERS_VERIFIED_VIEW),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk download manufacturer certificates (batched at 100)',
        description: 'Admin verified-manufacturers view. If ≤100 plant certificates → streams a merged PDF. ' +
            'If >100 and no `batch` query → returns JSON batch metadata. ' +
            'If `batch=N` → streams PDF for that batch (≤100 pages).',
    }),
    (0, swagger_1.ApiParam)({ name: 'manufacturerId', description: 'Manufacturer MongoDB ObjectId' }),
    (0, swagger_1.ApiQuery)({ name: 'batch', required: false, description: '1-based batch number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF stream or batch metadata JSON' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No certified products found' }),
    __param(0, (0, common_1.Param)('manufacturerId')),
    __param(1, (0, common_1.Query)('batch')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bulkDownloadManufacturerCertificates", null);
__decorate([
    (0, common_1.Put)('manufacturers/:id'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.MANUFACTURERS_UPDATE, permissions_constants_1.PERMISSIONS.MANUFACTURERS_VERIFIED_UPDATE, permissions_constants_1.PERMISSIONS.MANUFACTURERS_UNVERIFIED_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('manufacturer_image', {
        storage,
        fileFilter: (req, file, cb) => {
            if (!file) {
                cb(null, true);
                return;
            }
            const allowedMimes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
            ];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type. Only images are allowed.'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Update manufacturer details',
        description: 'Updates manufacturer display name (required). **gpInternalId** and **manufacturerInitial** are allocated only when the manufacturer is **verified** (not while pending in the unverified queue). For verified manufacturers, optional **gpInternalId** / **manufacturerInitial** may be supplied. Supports optional image upload.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                manufacturerName: {
                    type: 'string',
                    description: 'Manufacturer name',
                },
                gpInternalId: {
                    type: 'string',
                    description: 'Optional for verified manufacturers (e.g. GPSC-000). Ignored while unverified (assigned on verify).',
                    example: 'GPSC-000',
                },
                manufacturerInitial: {
                    type: 'string',
                    description: 'Optional for verified (exactly 3 letters from company name, e.g. MTL). Ignored while unverified (assigned on verify).',
                    example: 'MTL',
                },
                manufacturer_image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Manufacturer image (optional)',
                },
            },
            required: ['manufacturerName'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Manufacturer updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateManufacturer", null);
__decorate([
    (0, common_1.Patch)('manufacturers/:id/status'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.MANUFACTURERS_STATUS, permissions_constants_1.PERMISSIONS.MANUFACTURERS_VERIFIED_STATUS, permissions_constants_1.PERMISSIONS.MANUFACTURERS_UNVERIFIED_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle manufacturer status',
        description: 'Toggles manufacturer status: if current status is 1, sets to 2; if 2, sets to 1',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Manufacturer status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateManufacturerStatus", null);
__decorate([
    (0, common_1.Patch)('vendors/:id/status'),
    (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.MANUFACTURERS_STATUS, permissions_constants_1.PERMISSIONS.MANUFACTURERS_VERIFIED_STATUS, permissions_constants_1.PERMISSIONS.MANUFACTURERS_UNVERIFIED_STATUS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle vendor status',
        description: 'Toggles vendor status: if current status is 0, sets to 1; if 1, sets to 0',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vendor ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vendor status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vendor not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateVendorStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        gallery_service_1.GalleryService,
        manufacturers_service_1.ManufacturersService,
        payments_service_1.PaymentsService,
        vendor_certificate_service_1.VendorCertificateService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map