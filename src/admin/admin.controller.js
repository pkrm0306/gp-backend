"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var event_date_util_1 = require("../events/utils/event-date.util");
var merge_category_ids_util_1 = require("../standards/utils/merge-category-ids.util");
var merge_team_member_sectors_from_form_util_1 = require("./utils/merge-team-member-sectors-from-form.util");
var team_member_sectors_constants_1 = require("./team-member-sectors.constants");
var banner_vendor_scope_util_1 = require("./utils/banner-vendor-scope.util");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var update_manufacturer_dto_1 = require("./dto/update-manufacturer.dto");
var change_password_dto_1 = require("../manufacturers/dto/change-password.dto");
var update_manufacturer_profile_dto_1 = require("../manufacturers/dto/update-manufacturer-profile.dto");
var create_team_member_dto_1 = require("./dto/create-team-member.dto");
var edit_team_member_dto_1 = require("./dto/edit-team-member.dto");
var delete_team_member_dto_1 = require("./dto/delete-team-member.dto");
var create_banner_dto_1 = require("./dto/create-banner.dto");
var delete_banner_dto_1 = require("./dto/delete-banner.dto");
var update_banner_status_dto_1 = require("./dto/update-banner-status.dto");
var edit_banner_dto_1 = require("./dto/edit-banner.dto");
var create_event_dto_1 = require("./dto/create-event.dto");
var update_event_dto_1 = require("./dto/update-event.dto");
var manufacturer_reply_dto_1 = require("./dto/manufacturer-reply.dto");
var contact_reply_dto_1 = require("./dto/contact-reply.dto");
var delete_newsletter_subscriber_dto_1 = require("./dto/delete-newsletter-subscriber.dto");
var update_newsletter_subscriber_status_dto_1 = require("./dto/update-newsletter-subscriber-status.dto");
var delete_contact_message_dto_1 = require("./dto/delete-contact-message.dto");
var public_decorator_1 = require("../common/decorators/public.decorator");
var multer_1 = require("multer");
var path_1 = require("path");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var any_permissions_decorator_1 = require("../common/decorators/any-permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var gallery_schema_1 = require("../gallery/schemas/gallery.schema");
var upload_file_util_1 = require("../utils/upload-file.util");
var banner_image_upload_util_1 = require("./utils/banner-image-upload.util");
var banner_video_duration_util_1 = require("./utils/banner-video-duration.util");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var document_upload_validation_1 = require("../common/upload/document-upload.validation");
var event_brochures_util_1 = require("../events/utils/event-brochures.util");
var bannerImageMultipartFields = banner_image_upload_util_1.BANNER_MEDIA_MULTIPART_FIELDS;
function resolveUploadedBannerVideoUrl(uploadedVideo, durationBody) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uploadedVideo)
                        return [2 /*return*/, undefined];
                    (0, banner_video_duration_util_1.assertBannerVideoDurationWithinLimit)(uploadedVideo, durationBody);
                    return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(uploadedVideo, 'banners')];
                case 1: return [2 /*return*/, (_a.sent()).fileUrl];
            }
        });
    });
}
function mergeBannerVideoDurationBody() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, __spreadArray([{}], sources.filter(Boolean), false));
}
function parseBannerClearVideoFlag(body) {
    var _a, _b;
    var raw = String((_b = (_a = body.clearVideo) !== null && _a !== void 0 ? _a : body.removeVideo) !== null && _b !== void 0 ? _b : '').trim().toLowerCase();
    return raw === '1' || raw === 'true' || raw === 'yes';
}
var storage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'manufacturers'),
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        var ext = (0, path_1.extname)(file.originalname);
        cb(null, "manufacturer-".concat(uniqueSuffix).concat(ext));
    },
});
var teamMemberStorage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'team-members'),
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        var ext = (0, path_1.extname)(file.originalname);
        cb(null, "team-member-".concat(uniqueSuffix).concat(ext));
    },
});
var teamMemberImageInterceptor = (0, platform_express_1.FileInterceptor)('image', {
    storage: teamMemberStorage,
    fileFilter: function (req, file, cb) {
        if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
            cb(null, true);
            return;
        }
        var allowedMimes = [
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
                    enum: __spreadArray([], vendor_user_schema_1.BUSINESS_VERTICALS, true),
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
var AdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin'), (0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listAdminPayments_decorators;
    var _getDashboardMetrics_decorators;
    var _getCertifiedVsUncertifiedProducts_decorators;
    var _getVerifiedVsUnverifiedManufacturers_decorators;
    var _getExpiredProductsImpact_decorators;
    var _getProductStatusBreakdown_decorators;
    var _getUrnPipeline_decorators;
    var _getRevenueAnalytics_decorators;
    var _getRejectedProductsAnalytics_decorators;
    var _getDashboardFilters_decorators;
    var _getDashboardRecentProducts_decorators;
    var _getDashboardActivity_decorators;
    var _editProfile_decorators;
    var _listBanners_decorators;
    var _createBanner_decorators;
    var _editBanner_decorators;
    var _createEvent_decorators;
    var _editEvent_decorators;
    var _createGallery_decorators;
    var _editGallery_decorators;
    var _listEventsForAdmin_decorators;
    var _listEvents_decorators;
    var _listGalleryTypes_decorators;
    var _listGallery_decorators;
    var _getGalleryById_decorators;
    var _updateGalleryStatus_decorators;
    var _createArticle_decorators;
    var _editArticle_decorators;
    var _listArticles_decorators;
    var _getArticleById_decorators;
    var _updateArticleStatus_decorators;
    var _deleteArticleAlias_decorators;
    var _deleteArticle_decorators;
    var _getEventById_decorators;
    var _deleteEvent_decorators;
    var _deleteGallery_decorators;
    var _deleteGalleryAlias_decorators;
    var _replyToCustomer_decorators;
    var _replyToContact_decorators;
    var _getContactReplies_decorators;
    var _listNotifications_decorators;
    var _markAllNotificationsSeen_decorators;
    var _markNotificationSeen_decorators;
    var _deleteBannerPost_decorators;
    var _deleteBannerDelete_decorators;
    var _getBannerById_decorators;
    var _updateBannerStatus_decorators;
    var _createTeamMember_decorators;
    var _editTeamMemberPost_decorators;
    var _editTeamMemberPatch_decorators;
    var _deleteTeamMemberPost_decorators;
    var _deleteTeamMemberDelete_decorators;
    var _listNewsletterSubscribers_decorators;
    var _deleteNewsletterSubscriberPost_decorators;
    var _deleteNewsletterSubscriberDelete_decorators;
    var _setNewsletterSubscriberStatusPost_decorators;
    var _setNewsletterSubscriberStatusPatch_decorators;
    var _setNewsletterSubscriberStatusParam_decorators;
    var _listTeamMemberSectorOptions_decorators;
    var _listTeamMembers_decorators;
    var _listTeamMembersPaginated_decorators;
    var _listContactMessages_decorators;
    var _viewContactMessage_decorators;
    var _listProductInquiries_decorators;
    var _viewProductInquiry_decorators;
    var _deleteContactMessagePost_decorators;
    var _deleteContactMessageDelete_decorators;
    var _searchTeamMembersByName_decorators;
    var _searchTeamMembersByEmail_decorators;
    var _searchTeamMembers_decorators;
    var _getTeamMemberById_decorators;
    var _updateTeamMemberStatus_decorators;
    var _changePassword_decorators;
    var _updateManufacturer_decorators;
    var _updateManufacturerStatus_decorators;
    var _updateVendorStatus_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService, galleryService, manufacturersService, paymentsService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
            this.galleryService = galleryService;
            this.manufacturersService = manufacturersService;
            this.paymentsService = paymentsService;
        }
        AdminController_1.prototype.listAdminPayments = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.paymentsService.getAdminPayments(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Payment history retrieved successfully',
                                    data: result.data,
                                    pagination: result.pagination,
                                    meta: result.meta,
                                    totalCount: result.pagination.totalCount,
                                    page: result.pagination.page,
                                    limit: result.pagination.limit,
                                    totalPages: result.pagination.totalPages,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getDashboardMetrics = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getDashboardMetricsForUser({
                                    role: user.role,
                                    type: user.type,
                                    manufacturerId: user.manufacturerId,
                                    userId: user.userId,
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Admin dashboard metrics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getCertifiedVsUncertifiedProducts = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getCertifiedVsUncertifiedProductsForUser({
                                    role: user.role,
                                    type: user.type,
                                    manufacturerId: user.manufacturerId,
                                    userId: user.userId,
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Certified vs uncertified product metrics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getVerifiedVsUnverifiedManufacturers = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getVerifiedVsUnverifiedManufacturersForUser({
                                    role: user.role,
                                    type: user.type,
                                    manufacturerId: user.manufacturerId,
                                    userId: user.userId,
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Verified vs unverified manufacturer metrics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getExpiredProductsImpact = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getExpiredProductsImpactForUser({
                                    role: user.role,
                                    type: user.type,
                                    manufacturerId: user.manufacturerId,
                                    userId: user.userId,
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Expired products impact metrics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getProductStatusBreakdown = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getProductStatusBreakdownForUser({
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Product status breakdown retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getUrnPipeline = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getUrnPipelineForUser({ filters: filters, query: query })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'URN pipeline analytics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getRevenueAnalytics = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getRevenueAnalyticsForUser({
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Revenue analytics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getRejectedProductsAnalytics = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getRejectedProductsAnalyticsForUser({
                                    role: user.role,
                                    type: user.type,
                                    manufacturerId: user.manufacturerId,
                                    userId: user.userId,
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Rejected products analytics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getDashboardFilters = function () {
            return {
                message: 'Dashboard filter options retrieved successfully',
                data: this.adminService.getDashboardFilterOptions(),
            };
        };
        AdminController_1.prototype.getDashboardRecentProducts = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.adminService.getDashboardRecentProducts((_a = query.page) !== null && _a !== void 0 ? _a : 1, (_b = query.limit) !== null && _b !== void 0 ? _b : 10)];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, {
                                    message: 'Recent products retrieved successfully',
                                    data: result.data,
                                    total: result.total,
                                    page: result.page,
                                    limit: result.limit,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getDashboardActivity = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.getDashboardActivity((_a = query.limit) !== null && _a !== void 0 ? _a : 20)];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard activity retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.parseEventStatus = function (raw) {
            if (raw === undefined || raw === null || String(raw).trim() === '') {
                return undefined;
            }
            var v = String(raw).trim().toLowerCase();
            if (v === '1' || v === 'active' || v === 'true')
                return 1;
            if (v === '0' || v === 'inactive' || v === 'false')
                return 0;
            throw new common_1.BadRequestException('Invalid status. Use active/inactive (or 1/0)');
        };
        AdminController_1.prototype.parseEventBrochuresFromBody = function (body, pick) {
            var raw = pick(['brochures', 'brochure_items', 'brochureItems']);
            if (raw === undefined) {
                return undefined;
            }
            return (0, event_brochures_util_1.normalizeEventBrochuresInput)(raw);
        };
        AdminController_1.prototype.resolveEventDateRange = function (body) {
            var _a, _b;
            var pick = function (keys) {
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined)
                        return body[key];
                }
                return undefined;
            };
            var startRaw = (_a = pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date'])) !== null && _a !== void 0 ? _a : pick(['eventDate', 'date', 'event_date']);
            var endRaw = (_b = pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date'])) !== null && _b !== void 0 ? _b : startRaw;
            var eventStartDate = (0, event_date_util_1.parseEventDateInput)(startRaw);
            var eventEndDate = (0, event_date_util_1.parseEventDateInput)(endRaw);
            if (!eventStartDate) {
                throw new common_1.BadRequestException('Event start date is required.');
            }
            if (!eventEndDate) {
                throw new common_1.BadRequestException('Event end date is required.');
            }
            if (eventEndDate.getTime() < eventStartDate.getTime()) {
                throw new common_1.BadRequestException('Event end date must be on or after the start date.');
            }
            return { eventStartDate: eventStartDate, eventEndDate: eventEndDate };
        };
        AdminController_1.prototype.parseExternalUrlToggle = function (raw, required) {
            if (required === void 0) { required = false; }
            if (raw === undefined || raw === null || String(raw).trim() === '') {
                if (required) {
                    throw new common_1.BadRequestException('externalUrl is required (true/false)');
                }
                return undefined;
            }
            var v = String(raw).trim().toLowerCase();
            if (v === '1' || v === 'true' || v === 'yes' || v === 'on')
                return true;
            if (v === '0' || v === 'false' || v === 'no' || v === 'off')
                return false;
            throw new common_1.BadRequestException('Invalid externalUrl. Use true/false (or 1/0)');
        };
        AdminController_1.prototype.resolveExternalUrlRaw = function (body) {
            var _a, _b, _c, _d;
            return ((_d = (_c = (_b = (_a = body === null || body === void 0 ? void 0 : body.externalUrl) !== null && _a !== void 0 ? _a : body === null || body === void 0 ? void 0 : body.external_url) !== null && _b !== void 0 ? _b : body === null || body === void 0 ? void 0 : body.externalURL) !== null && _c !== void 0 ? _c : body === null || body === void 0 ? void 0 : body.isExternalUrl) !== null && _d !== void 0 ? _d : body === null || body === void 0 ? void 0 : body.is_external_url);
        };
        AdminController_1.prototype.readArticleShortDescription = function (body) {
            var _a, _b, _c;
            return String((_c = (_b = (_a = body === null || body === void 0 ? void 0 : body.shortDescription) !== null && _a !== void 0 ? _a : body === null || body === void 0 ? void 0 : body.short_description) !== null && _b !== void 0 ? _b : body === null || body === void 0 ? void 0 : body.shortDesc) !== null && _c !== void 0 ? _c : '').trim();
        };
        AdminController_1.prototype.parseGalleryType = function (raw, required) {
            if (required === void 0) { required = false; }
            if (raw === undefined || raw === null || String(raw).trim() === '') {
                if (required) {
                    throw new common_1.BadRequestException("galleryType is required. Use one of: ".concat(gallery_schema_1.GALLERY_TYPES.join(', ')));
                }
                return undefined;
            }
            var matched = this.resolveCanonicalGalleryType(String(raw));
            if (!matched) {
                throw new common_1.BadRequestException("Invalid galleryType. Use one of: ".concat(gallery_schema_1.GALLERY_TYPES.join(', ')));
            }
            return matched;
        };
        AdminController_1.prototype.resolveCanonicalGalleryType = function (value) {
            var normalized = value.trim().toLowerCase();
            var direct = gallery_schema_1.GALLERY_TYPES.find(function (t) { return t.toLowerCase() === normalized; });
            if (direct)
                return direct;
            var aliases = {
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
        };
        AdminController_1.prototype.parseJsonStringArrayField = function (raw) {
            if (raw === undefined || raw === null)
                return undefined;
            if (Array.isArray(raw)) {
                return raw.map(function (v) { return String(v).trim(); }).filter(Boolean);
            }
            var text = String(raw).trim();
            if (!text)
                return [];
            try {
                var parsed = JSON.parse(text);
                if (!Array.isArray(parsed)) {
                    throw new common_1.BadRequestException('Expected a JSON array');
                }
                return parsed.map(function (v) { return String(v).trim(); }).filter(Boolean);
            }
            catch (err) {
                if (err instanceof common_1.BadRequestException)
                    throw err;
                throw new common_1.BadRequestException('Invalid JSON array field');
            }
        };
        AdminController_1.prototype.assertGalleryImageCount = function (count) {
            if (count > gallery_schema_1.GALLERY_MAX_IMAGES) {
                throw new common_1.BadRequestException("A gallery item can have at most ".concat(gallery_schema_1.GALLERY_MAX_IMAGES, " images"));
            }
        };
        AdminController_1.prototype.normalizeTeamMemberRoleIds = function (body) {
            var _a;
            var parseJsonArray = function (value) {
                try {
                    var parsed = JSON.parse(value);
                    return Array.isArray(parsed) ? parsed.map(function (v) { return String(v); }) : null;
                }
                catch (_a) {
                    return null;
                }
            };
            var candidates = [];
            var roleIdsArrayField = body === null || body === void 0 ? void 0 : body['roleIds[]'];
            if (Array.isArray(roleIdsArrayField)) {
                candidates.push.apply(candidates, roleIdsArrayField.map(function (v) { return String(v); }));
            }
            else if (roleIdsArrayField !== undefined && roleIdsArrayField !== null) {
                candidates.push(String(roleIdsArrayField));
            }
            var roleIds = body === null || body === void 0 ? void 0 : body.roleIds;
            if (Array.isArray(roleIds)) {
                candidates.push.apply(candidates, roleIds.map(function (v) { return String(v); }));
            }
            else if (typeof roleIds === 'string') {
                var trimmed = roleIds.trim();
                var parsed = trimmed.startsWith('[') ? parseJsonArray(trimmed) : null;
                if (parsed) {
                    candidates.push.apply(candidates, parsed);
                }
                else if (trimmed) {
                    candidates.push(trimmed);
                }
            }
            else if (roleIds !== undefined && roleIds !== null) {
                candidates.push(String(roleIds));
            }
            var normalized = Array.from(new Set(candidates
                .map(function (v) { return v.trim(); })
                .filter(function (v) { return /^[a-fA-F0-9]{24}$/.test(v); })));
            if (normalized.length > 0)
                return normalized;
            var roleId = String((_a = body === null || body === void 0 ? void 0 : body.roleId) !== null && _a !== void 0 ? _a : '').trim();
            return /^[a-fA-F0-9]{24}$/.test(roleId) ? [roleId] : [];
        };
        AdminController_1.prototype.resolveBusinessVerticalInput = function (body) {
            var _a, _b, _c;
            var direct = (_c = (_b = (_a = body === null || body === void 0 ? void 0 : body.businessVertical) !== null && _a !== void 0 ? _a : body === null || body === void 0 ? void 0 : body.business_vertical) !== null && _b !== void 0 ? _b : body === null || body === void 0 ? void 0 : body.businessvertical) !== null && _c !== void 0 ? _c : body === null || body === void 0 ? void 0 : body.vertical;
            if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
                return direct;
            }
            try {
                var sectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
                if (sectorIds.length > 0) {
                    var name_1 = (0, team_member_sectors_constants_1.getTeamMemberSectorNameById)(sectorIds[0]);
                    if (name_1)
                        return name_1.toLowerCase();
                }
            }
            catch (_d) {
                // Invalid sector payload is handled when sectors are merged for persistence.
            }
            return undefined;
        };
        AdminController_1.prototype.mapGalleryResponse = function (item) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var images = Array.isArray(item === null || item === void 0 ? void 0 : item.galleryImages)
                ? item.galleryImages
                : (item === null || item === void 0 ? void 0 : item.image)
                    ? [item.image]
                    : (item === null || item === void 0 ? void 0 : item.eventImage)
                        ? [item.eventImage]
                        : [];
            var rawDate = (_a = item === null || item === void 0 ? void 0 : item.date) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.eventDate;
            var normalizedDate = rawDate instanceof Date
                ? rawDate.toISOString().slice(0, 10)
                : rawDate
                    ? /^\d{4}-\d{2}-\d{2}$/.test(String(rawDate).trim())
                        ? String(rawDate).trim()
                        : new Date(rawDate).toISOString().slice(0, 10)
                    : '';
            return {
                id: item === null || item === void 0 ? void 0 : item.id,
                eventId: (_b = item === null || item === void 0 ? void 0 : item.galleryId) !== null && _b !== void 0 ? _b : item === null || item === void 0 ? void 0 : item.eventId,
                title: (_d = (_c = item === null || item === void 0 ? void 0 : item.title) !== null && _c !== void 0 ? _c : item === null || item === void 0 ? void 0 : item.eventName) !== null && _d !== void 0 ? _d : '',
                galleryType: (_e = item === null || item === void 0 ? void 0 : item.galleryType) !== null && _e !== void 0 ? _e : '',
                description: (_g = (_f = item === null || item === void 0 ? void 0 : item.description) !== null && _f !== void 0 ? _f : item === null || item === void 0 ? void 0 : item.eventDescription) !== null && _g !== void 0 ? _g : '',
                date: normalizedDate,
                image: (_h = images[0]) !== null && _h !== void 0 ? _h : null,
                images: images,
                event_image: (_k = (_j = item === null || item === void 0 ? void 0 : item.gallery_image) !== null && _j !== void 0 ? _j : item === null || item === void 0 ? void 0 : item.event_image) !== null && _k !== void 0 ? _k : null,
            };
        };
        /** Gallery/event images via shared upload helper (local uploads/ or S3 when configured). */
        AdminController_1.prototype.uploadGalleryImageFiles = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var urls, _i, files_1, file, uploaded;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            urls = [];
                            _i = 0, files_1 = files;
                            _b.label = 1;
                        case 1:
                            if (!(_i < files_1.length)) return [3 /*break*/, 4];
                            file = files_1[_i];
                            if (!((_a = file === null || file === void 0 ? void 0 : file.buffer) === null || _a === void 0 ? void 0 : _a.length) && !(file === null || file === void 0 ? void 0 : file.path)) {
                                return [3 /*break*/, 3];
                            }
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'gallery')];
                        case 2:
                            uploaded = _b.sent();
                            urls.push(uploaded.fileUrl);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, urls];
                    }
                });
            });
        };
        AdminController_1.prototype.mapArticleResponse = function (item) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var id = (_a = item === null || item === void 0 ? void 0 : item.id) !== null && _a !== void 0 ? _a : ((item === null || item === void 0 ? void 0 : item._id) ? String(item._id) : undefined);
            var externalUrl = (item === null || item === void 0 ? void 0 : item.externalUrl) === true;
            return {
                id: id,
                title: (_b = item === null || item === void 0 ? void 0 : item.title) !== null && _b !== void 0 ? _b : '',
                description: (_c = item === null || item === void 0 ? void 0 : item.description) !== null && _c !== void 0 ? _c : '',
                shortDescription: (_d = item === null || item === void 0 ? void 0 : item.shortDescription) !== null && _d !== void 0 ? _d : (externalUrl ? (_e = item === null || item === void 0 ? void 0 : item.description) !== null && _e !== void 0 ? _e : '' : ''),
                date: (item === null || item === void 0 ? void 0 : item.date) instanceof Date
                    ? item.date.toISOString().slice(0, 10)
                    : (item === null || item === void 0 ? void 0 : item.date)
                        ? new Date(item.date).toISOString().slice(0, 10)
                        : '',
                image: (_f = item === null || item === void 0 ? void 0 : item.image) !== null && _f !== void 0 ? _f : null,
                article_image: (_g = item === null || item === void 0 ? void 0 : item.article_image) !== null && _g !== void 0 ? _g : '',
                url: (_h = item === null || item === void 0 ? void 0 : item.url) !== null && _h !== void 0 ? _h : '',
                externalUrl: externalUrl,
                pdf: (_j = item === null || item === void 0 ? void 0 : item.pdf) !== null && _j !== void 0 ? _j : null,
                article_pdf: (_k = item === null || item === void 0 ? void 0 : item.article_pdf) !== null && _k !== void 0 ? _k : '',
                is_active: Number(item === null || item === void 0 ? void 0 : item.status) === 1 || (item === null || item === void 0 ? void 0 : item.is_active) === true,
            };
        };
        AdminController_1.prototype.editProfile = function (user, updateProfileDto) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.editProfile(user, updateProfileDto)];
                        case 1:
                            profile = _a.sent();
                            return [2 /*return*/, { message: 'Profile updated successfully', data: profile }];
                    }
                });
            });
        };
        AdminController_1.prototype.listBanners = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            return [4 /*yield*/, this.adminService.listBanners(vendorScope)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Banners retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.createBanner = function (user, body, req, files) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, uploadedFile, uploadedVideo, dto, errors, errorMessages, imageUrl, _a, videoUrl, resolvedImageSource, data;
                var _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            uploadedFile = (0, banner_image_upload_util_1.pickBannerImageFile)(files);
                            uploadedVideo = (0, banner_image_upload_util_1.pickBannerVideoFile)(files);
                            if (String((_b = body.imageUrl) !== null && _b !== void 0 ? _b : '').trim() && !uploadedFile) {
                                throw new common_1.BadRequestException('Banner image must be uploaded from your device. Image URLs are not accepted.');
                            }
                            if (String((_d = (_c = body.videoUrl) !== null && _c !== void 0 ? _c : body.video_url) !== null && _d !== void 0 ? _d : '').trim()) {
                                throw new common_1.BadRequestException('Banner video must be uploaded from your device. Video URLs are not accepted.');
                            }
                            dto = (0, class_transformer_1.plainToClass)(create_banner_dto_1.CreateBannerDto, {
                                imageUrl: body.imageUrl,
                                title: (_e = body.title) !== null && _e !== void 0 ? _e : body.heading,
                                status: body.status,
                                sequenceNumber: (_h = (_g = (_f = body.sequenceNumber) !== null && _f !== void 0 ? _f : body.sequence) !== null && _g !== void 0 ? _g : body.displayOrder) !== null && _h !== void 0 ? _h : body.order,
                                description: (_j = body.description) !== null && _j !== void 0 ? _j : body.bannerDescription,
                                imageSource: body.imageSource,
                                videoDurationSeconds: body.videoDurationSeconds,
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto)];
                        case 1:
                            errors = _k.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            if (!uploadedFile) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(uploadedFile, 'banners')];
                        case 2:
                            _a = (_k.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = dto.imageUrl;
                            _k.label = 4;
                        case 4:
                            imageUrl = _a;
                            if (!uploadedFile) {
                                throw new common_1.BadRequestException('Banner image must be uploaded from your device.');
                            }
                            if (!imageUrl) {
                                throw new common_1.BadRequestException('Banner image is required');
                            }
                            return [4 /*yield*/, resolveUploadedBannerVideoUrl(uploadedVideo, mergeBannerVideoDurationBody(req.body, body, dto))];
                        case 5:
                            videoUrl = _k.sent();
                            resolvedImageSource = uploadedFile ? 'binary_upload' : 'manual_url';
                            return [4 /*yield*/, this.adminService.createBanner(vendorScope, __assign(__assign(__assign({}, dto), { imageUrl: imageUrl }), (videoUrl ? { videoUrl: videoUrl } : {})), resolvedImageSource, videoUrl ? 'binary_upload' : undefined)];
                        case 6:
                            data = _k.sent();
                            return [2 /*return*/, { message: 'Banner created successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.editBanner = function (user, id, body, req, files) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, uploadedFile, uploadedVideo, clearVideo, dto, errors, errorMessages, imageUrl, _a, videoUrl, imageSource, data;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            uploadedFile = (0, banner_image_upload_util_1.pickBannerImageFile)(files);
                            uploadedVideo = (0, banner_image_upload_util_1.pickBannerVideoFile)(files);
                            if (String((_b = body.imageUrl) !== null && _b !== void 0 ? _b : '').trim() && !uploadedFile) {
                                throw new common_1.BadRequestException('Banner image must be uploaded from your device. Image URLs are not accepted.');
                            }
                            if (String((_d = (_c = body.videoUrl) !== null && _c !== void 0 ? _c : body.video_url) !== null && _d !== void 0 ? _d : '').trim()) {
                                throw new common_1.BadRequestException('Banner video must be uploaded from your device. Video URLs are not accepted.');
                            }
                            clearVideo = parseBannerClearVideoFlag(body);
                            dto = (0, class_transformer_1.plainToClass)(edit_banner_dto_1.EditBannerDto, {
                                imageUrl: body.imageUrl,
                                title: (_e = body.title) !== null && _e !== void 0 ? _e : body.heading,
                                status: body.status,
                                sequenceNumber: body.sequenceNumber,
                                description: body.description,
                                imageSource: body.imageSource,
                                videoDurationSeconds: body.videoDurationSeconds,
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto, { skipMissingProperties: true })];
                        case 1:
                            errors = _f.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
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
                            if (!uploadedFile) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(uploadedFile, 'banners')];
                        case 2:
                            _a = (_f.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = dto.imageUrl;
                            _f.label = 4;
                        case 4:
                            imageUrl = _a;
                            return [4 /*yield*/, resolveUploadedBannerVideoUrl(uploadedVideo, mergeBannerVideoDurationBody(req.body, body, dto))];
                        case 5:
                            videoUrl = _f.sent();
                            if (uploadedFile) {
                                imageSource = 'binary_upload';
                            }
                            else if (dto.imageUrl !== undefined &&
                                dto.imageUrl !== null &&
                                String(dto.imageUrl).trim() !== '') {
                                imageSource = 'manual_url';
                            }
                            return [4 /*yield*/, this.adminService.updateBanner(vendorScope, id, __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (imageUrl ? { imageUrl: imageUrl } : {})), (imageSource !== undefined ? { imageSource: imageSource } : {})), (clearVideo ? { clearVideo: true } : {})), (videoUrl ? { videoUrl: videoUrl, videoSource: 'binary_upload' } : {})), (dto.title !== undefined ? { title: dto.title } : {})), (dto.status !== undefined ? { status: dto.status } : {})), (dto.sequenceNumber !== undefined
                                    ? { sequenceNumber: dto.sequenceNumber }
                                    : {})), (dto.description !== undefined ? { description: dto.description } : {})))];
                        case 6:
                            data = _f.sent();
                            return [2 /*return*/, { message: 'Banner updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.createEvent = function (body, file) {
            return __awaiter(this, void 0, void 0, function () {
                var pick, dto, errors, errorMessages, _a, eventStartDate, eventEndDate, eventStatus, brochures, eventImage, _b, data;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            pick = function (keys) {
                                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                                    var k = keys_2[_i];
                                    if ((body === null || body === void 0 ? void 0 : body[k]) !== undefined)
                                        return body[k];
                                }
                                return undefined;
                            };
                            dto = (0, class_transformer_1.plainToClass)(create_event_dto_1.CreateEventDto, {
                                eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
                                eventStartDate: (_c = pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date'])) !== null && _c !== void 0 ? _c : pick(['eventDate', 'date', 'event_date']),
                                eventEndDate: (_e = (_d = pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date'])) !== null && _d !== void 0 ? _d : pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date'])) !== null && _e !== void 0 ? _e : pick(['eventDate', 'date', 'event_date']),
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
                                brochureLink: pick(['brochureLink', 'brochure_link']),
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto)];
                        case 1:
                            errors = _f.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            _a = this.resolveEventDateRange(body), eventStartDate = _a.eventStartDate, eventEndDate = _a.eventEndDate;
                            eventStatus = this.parseEventStatus(pick(['eventStatus', 'status', 'is_active', 'active']));
                            brochures = this.parseEventBrochuresFromBody(body, pick);
                            if (!file) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'events')];
                        case 2:
                            _b = (_f.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _b = undefined;
                            _f.label = 4;
                        case 4:
                            eventImage = _b;
                            return [4 /*yield*/, this.adminService.createEvent(__assign(__assign(__assign({ eventName: dto.eventName, eventDate: eventStartDate, eventStartDate: eventStartDate, eventEndDate: eventEndDate, eventStartTime: dto.eventStartTime, eventEndTime: dto.eventEndTime, eventLocation: dto.eventLocation, eventDescription: dto.eventDescription, contactPersonName: dto.contactPersonName, contactPersonDesignation: dto.contactPersonDesignation, contactPersonEmail: dto.contactPersonEmail, contactPersonPhone: dto.contactPersonPhone, registrationLink: dto.registrationLink, brochureLink: dto.brochureLink }, (brochures !== undefined ? { brochures: brochures } : {})), { eventImage: eventImage }), (eventStatus !== undefined ? { eventStatus: eventStatus } : {})))];
                        case 5:
                            data = _f.sent();
                            return [2 /*return*/, { message: 'Event created successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.editEvent = function (id, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var pick, dto, errors, errorMessages, eventStartDate, eventEndDate, resolved, eventStatus, brochures, picked, eventImage, _a, data;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            pick = function (keys) {
                                for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
                                    var k = keys_3[_i];
                                    if ((body === null || body === void 0 ? void 0 : body[k]) !== undefined)
                                        return body[k];
                                }
                                return undefined;
                            };
                            dto = (0, class_transformer_1.plainToClass)(update_event_dto_1.UpdateEventDto, {
                                eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
                                eventStartDate: (_b = pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date'])) !== null && _b !== void 0 ? _b : pick(['eventDate', 'date', 'event_date']),
                                eventEndDate: (_d = (_c = pick(['eventEndDate', 'event_end_date', 'endDate', 'end_date'])) !== null && _c !== void 0 ? _c : pick(['eventStartDate', 'event_start_date', 'startDate', 'start_date'])) !== null && _d !== void 0 ? _d : pick(['eventDate', 'date', 'event_date']),
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
                                brochureLink: pick(['brochureLink', 'brochure_link']),
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto)];
                        case 1:
                            errors = _l.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            if (dto.eventStartDate !== undefined ||
                                dto.eventEndDate !== undefined ||
                                dto.eventDate !== undefined) {
                                resolved = this.resolveEventDateRange({
                                    eventStartDate: (_e = dto.eventStartDate) !== null && _e !== void 0 ? _e : dto.eventDate,
                                    eventEndDate: (_g = (_f = dto.eventEndDate) !== null && _f !== void 0 ? _f : dto.eventStartDate) !== null && _g !== void 0 ? _g : dto.eventDate,
                                });
                                eventStartDate = resolved.eventStartDate;
                                eventEndDate = resolved.eventEndDate;
                            }
                            eventStatus = this.parseEventStatus(pick(['eventStatus', 'status', 'is_active', 'active']));
                            brochures = this.parseEventBrochuresFromBody(body, pick);
                            picked = ((_h = files === null || files === void 0 ? void 0 : files.image) === null || _h === void 0 ? void 0 : _h[0]) ||
                                ((_j = files === null || files === void 0 ? void 0 : files.eventImage) === null || _j === void 0 ? void 0 : _j[0]) ||
                                ((_k = files === null || files === void 0 ? void 0 : files.event_image) === null || _k === void 0 ? void 0 : _k[0]) ||
                                null;
                            if (!picked) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(picked, 'events')];
                        case 2:
                            _a = (_l.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = undefined;
                            _l.label = 4;
                        case 4:
                            eventImage = _a;
                            return [4 /*yield*/, this.adminService.updateEvent(id, __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (dto.eventName !== undefined ? { eventName: dto.eventName } : {})), (eventStartDate !== undefined ? { eventStartDate: eventStartDate, eventDate: eventStartDate } : {})), (eventEndDate !== undefined ? { eventEndDate: eventEndDate } : {})), (dto.eventStartTime !== undefined
                                    ? { eventStartTime: dto.eventStartTime }
                                    : {})), (dto.eventEndTime !== undefined
                                    ? { eventEndTime: dto.eventEndTime }
                                    : {})), (dto.eventLocation !== undefined
                                    ? { eventLocation: dto.eventLocation }
                                    : {})), (dto.eventDescription !== undefined
                                    ? { eventDescription: dto.eventDescription }
                                    : {})), (dto.contactPersonName !== undefined
                                    ? { contactPersonName: dto.contactPersonName }
                                    : {})), (dto.contactPersonDesignation !== undefined
                                    ? { contactPersonDesignation: dto.contactPersonDesignation }
                                    : {})), (dto.contactPersonEmail !== undefined
                                    ? { contactPersonEmail: dto.contactPersonEmail }
                                    : {})), (dto.contactPersonPhone !== undefined
                                    ? { contactPersonPhone: dto.contactPersonPhone }
                                    : {})), (dto.registrationLink !== undefined
                                    ? { registrationLink: dto.registrationLink }
                                    : {})), (dto.brochureLink !== undefined
                                    ? { brochureLink: dto.brochureLink }
                                    : {})), (brochures !== undefined ? { brochures: brochures } : {})), (eventStatus !== undefined ? { eventStatus: eventStatus } : {})), (eventImage ? { eventImage: eventImage } : {})))];
                        case 5:
                            data = _l.sent();
                            return [2 /*return*/, { message: 'Event updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.createGallery = function (body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var allImages, pick, title, rawDate, descriptionRaw, description, eventDate, galleryImages, galleryType, data;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            allImages = __spreadArray(__spreadArray(__spreadArray([], ((_a = files === null || files === void 0 ? void 0 : files.image) !== null && _a !== void 0 ? _a : []), true), ((_b = files === null || files === void 0 ? void 0 : files['image[]']) !== null && _b !== void 0 ? _b : []), true), ((_c = files === null || files === void 0 ? void 0 : files.images) !== null && _c !== void 0 ? _c : []), true);
                            pick = function (keys) {
                                for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
                                    var k = keys_4[_i];
                                    if ((body === null || body === void 0 ? void 0 : body[k]) !== undefined)
                                        return body[k];
                                }
                                return undefined;
                            };
                            title = String((_d = pick(['eventName', 'title', 'name', 'event_name', 'event_title'])) !== null && _d !== void 0 ? _d : '').trim();
                            rawDate = String((_e = pick(['eventDate', 'date', 'event_date'])) !== null && _e !== void 0 ? _e : '').trim();
                            descriptionRaw = pick([
                                'eventDescription',
                                'description',
                                'event_description',
                            ]);
                            description = descriptionRaw === undefined || descriptionRaw === null
                                ? undefined
                                : String(descriptionRaw).trim();
                            if (!title || title.length < 2) {
                                throw new common_1.BadRequestException('title should not be empty');
                            }
                            if (!rawDate) {
                                throw new common_1.BadRequestException('date should not be empty');
                            }
                            eventDate = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
                                ? new Date("".concat(rawDate.slice(6, 10), "-").concat(rawDate.slice(3, 5), "-").concat(rawDate.slice(0, 2)))
                                : new Date(rawDate);
                            if (Number.isNaN(eventDate.getTime())) {
                                throw new common_1.BadRequestException('Invalid eventDate (expected ISO date/datetime)');
                            }
                            return [4 /*yield*/, this.uploadGalleryImageFiles(allImages)];
                        case 1:
                            galleryImages = _f.sent();
                            this.assertGalleryImageCount(galleryImages.length);
                            galleryType = this.parseGalleryType(pick(['galleryType', 'type', 'category']), true);
                            return [4 /*yield*/, this.galleryService.createGallery(__assign({ title: title, date: eventDate, description: description, galleryType: galleryType }, (galleryImages.length
                                    ? { galleryImages: galleryImages, image: galleryImages[0] }
                                    : {})))];
                        case 2:
                            data = _f.sent();
                            return [2 /*return*/, {
                                    message: 'Gallery item created successfully',
                                    data: this.mapGalleryResponse(data),
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.editGallery = function (id, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var allImages, pick, titleRaw, dateRaw, descriptionRaw, title, description, eventDate, raw, galleryType, existingImages, uploadedImages, mergedGalleryImages, data;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            allImages = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], ((_a = files === null || files === void 0 ? void 0 : files.image) !== null && _a !== void 0 ? _a : []), true), ((_b = files === null || files === void 0 ? void 0 : files['image[]']) !== null && _b !== void 0 ? _b : []), true), ((_c = files === null || files === void 0 ? void 0 : files.images) !== null && _c !== void 0 ? _c : []), true), ((_d = files === null || files === void 0 ? void 0 : files.eventImage) !== null && _d !== void 0 ? _d : []), true), ((_e = files === null || files === void 0 ? void 0 : files.event_image) !== null && _e !== void 0 ? _e : []), true);
                            pick = function (keys) {
                                for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
                                    var k = keys_5[_i];
                                    if ((body === null || body === void 0 ? void 0 : body[k]) !== undefined)
                                        return body[k];
                                }
                                return undefined;
                            };
                            titleRaw = pick(['eventName', 'title', 'name', 'event_name', 'event_title']);
                            dateRaw = pick(['eventDate', 'date', 'event_date']);
                            descriptionRaw = pick([
                                'eventDescription',
                                'description',
                                'event_description',
                            ]);
                            title = titleRaw === undefined || titleRaw === null
                                ? undefined
                                : String(titleRaw).trim();
                            description = descriptionRaw === undefined || descriptionRaw === null
                                ? undefined
                                : String(descriptionRaw).trim();
                            if (title !== undefined && title.length > 0 && title.length < 2) {
                                throw new common_1.BadRequestException('title must be longer than or equal to 2 characters');
                            }
                            eventDate = undefined;
                            if (dateRaw !== undefined && dateRaw !== null) {
                                raw = String(dateRaw).trim();
                                if (!raw) {
                                    throw new common_1.BadRequestException('date should not be empty');
                                }
                                eventDate = /^\d{2}-\d{2}-\d{4}$/.test(raw)
                                    ? new Date("".concat(raw.slice(6, 10), "-").concat(raw.slice(3, 5), "-").concat(raw.slice(0, 2)))
                                    : new Date(raw);
                                if (Number.isNaN(eventDate.getTime())) {
                                    throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
                                }
                            }
                            galleryType = this.parseGalleryType(pick(['galleryType', 'type', 'category']), false);
                            existingImages = this.parseJsonStringArrayField(pick(['existingImages']));
                            return [4 /*yield*/, this.uploadGalleryImageFiles(allImages)];
                        case 1:
                            uploadedImages = _f.sent();
                            mergedGalleryImages = existingImages !== undefined || uploadedImages.length > 0
                                ? __spreadArray(__spreadArray([], (existingImages !== null && existingImages !== void 0 ? existingImages : []), true), uploadedImages, true) : undefined;
                            if (mergedGalleryImages !== undefined) {
                                this.assertGalleryImageCount(mergedGalleryImages.length);
                            }
                            return [4 /*yield*/, this.galleryService.updateGallery(id, __assign(__assign(__assign(__assign(__assign({}, (title !== undefined ? { title: title } : {})), (description !== undefined ? { description: description } : {})), (eventDate !== undefined ? { date: eventDate } : {})), (galleryType !== undefined ? { galleryType: galleryType } : {})), (mergedGalleryImages !== undefined
                                    ? {
                                        galleryImages: mergedGalleryImages,
                                        image: mergedGalleryImages[0],
                                    }
                                    : {})))];
                        case 2:
                            data = _f.sent();
                            return [2 /*return*/, {
                                    message: 'Gallery item updated successfully',
                                    data: this.mapGalleryResponse(data),
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.listEventsForAdmin = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listEvents('event')];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Events retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.listEvents = function (pageRaw, limitRaw) {
            return __awaiter(this, void 0, void 0, function () {
                var pageNum, limitNum, page, limit, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pageNum = Number.parseInt(String(pageRaw !== null && pageRaw !== void 0 ? pageRaw : '1'), 10);
                            limitNum = Number.parseInt(String(limitRaw !== null && limitRaw !== void 0 ? limitRaw : '10'), 10);
                            page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
                            limit = Number.isFinite(limitNum) && limitNum > 0
                                ? Math.min(limitNum, 50)
                                : 10;
                            return [4 /*yield*/, this.adminService.listEventsPaginated(page, limit, {
                                    activeOnly: true,
                                })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Events retrieved successfully',
                                    pagination: result.pagination,
                                    data: result.data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.listGalleryTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Gallery types retrieved successfully',
                            data: gallery_schema_1.GALLERY_TYPE_OPTIONS,
                        }];
                });
            });
        };
        AdminController_1.prototype.listGallery = function (pageRaw, limitRaw) {
            return __awaiter(this, void 0, void 0, function () {
                var pageNum, limitNum, page, limit, result, data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pageNum = Number.parseInt(String(pageRaw !== null && pageRaw !== void 0 ? pageRaw : '1'), 10);
                            limitNum = Number.parseInt(String(limitRaw !== null && limitRaw !== void 0 ? limitRaw : '50'), 10);
                            page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
                            limit = Number.isFinite(limitNum) && limitNum > 0
                                ? Math.min(limitNum, 50)
                                : 50;
                            return [4 /*yield*/, this.galleryService.listGalleryPaginated(page, limit, {
                                    activeOnly: false,
                                })];
                        case 1:
                            result = _a.sent();
                            data = result.data.map(function (r) { return (__assign(__assign({ s_no: r.s_no }, _this.mapGalleryResponse(r)), { is_active: r.is_active })); });
                            return [2 /*return*/, {
                                    message: 'Gallery retrieved successfully',
                                    pagination: __assign(__assign({}, result.pagination), { limit: result.pagination.perPage }),
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.getGalleryById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var item, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.galleryService.getGalleryById(id)];
                        case 1:
                            item = _a.sent();
                            data = this.mapGalleryResponse(item);
                            return [2 /*return*/, { message: 'Gallery item retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateGalleryStatus = function (id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var status, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            status = this.parseEventStatus(body === null || body === void 0 ? void 0 : body.status);
                            return [4 /*yield*/, this.galleryService.setOrToggleGalleryStatus(id, status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Gallery status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.createArticle = function (body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var title, rawDate, date, description, shortDescription, url, explicitExternalUrl, inferredExternalUrl, externalUrl, status, imageFile, pdfFile, imageUpload, _a, pdfUpload, _b, image, pdf, data;
                var _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            title = String((_c = body === null || body === void 0 ? void 0 : body.title) !== null && _c !== void 0 ? _c : '').trim();
                            if (!title)
                                throw new common_1.BadRequestException('title is required');
                            rawDate = String((_d = body === null || body === void 0 ? void 0 : body.date) !== null && _d !== void 0 ? _d : '').trim();
                            if (!rawDate)
                                throw new common_1.BadRequestException('date is required');
                            date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
                                ? new Date("".concat(rawDate.slice(6, 10), "-").concat(rawDate.slice(3, 5), "-").concat(rawDate.slice(0, 2)))
                                : new Date(rawDate);
                            if (Number.isNaN(date.getTime())) {
                                throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
                            }
                            description = String((_e = body === null || body === void 0 ? void 0 : body.description) !== null && _e !== void 0 ? _e : '').trim();
                            shortDescription = this.readArticleShortDescription(body);
                            url = String((_f = body === null || body === void 0 ? void 0 : body.url) !== null && _f !== void 0 ? _f : '').trim();
                            explicitExternalUrl = this.parseExternalUrlToggle(this.resolveExternalUrlRaw(body));
                            inferredExternalUrl = explicitExternalUrl !== null && explicitExternalUrl !== void 0 ? explicitExternalUrl : (url && shortDescription && !description
                                ? true
                                : description && !url
                                    ? false
                                    : url && !description
                                        ? true
                                        : false);
                            externalUrl = inferredExternalUrl;
                            status = this.parseEventStatus(body === null || body === void 0 ? void 0 : body.status);
                            imageFile = (_g = files === null || files === void 0 ? void 0 : files.image) === null || _g === void 0 ? void 0 : _g[0];
                            pdfFile = (_j = (_h = files === null || files === void 0 ? void 0 : files.pdf) === null || _h === void 0 ? void 0 : _h[0]) !== null && _j !== void 0 ? _j : (_k = files === null || files === void 0 ? void 0 : files.file) === null || _k === void 0 ? void 0 : _k[0];
                            if (!imageFile)
                                throw new common_1.BadRequestException('image is required');
                            if (!pdfFile)
                                throw new common_1.BadRequestException('pdf/file is required');
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
                            if (!imageFile) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(imageFile, 'articles')];
                        case 1:
                            _a = _l.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _l.label = 3;
                        case 3:
                            imageUpload = _a;
                            if (!pdfFile) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(pdfFile, 'articles')];
                        case 4:
                            _b = _l.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = undefined;
                            _l.label = 6;
                        case 6:
                            pdfUpload = _b;
                            image = imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.fileUrl;
                            pdf = pdfUpload === null || pdfUpload === void 0 ? void 0 : pdfUpload.fileUrl;
                            return [4 /*yield*/, this.adminService.createArticle(__assign({ title: title, description: externalUrl ? '' : description, shortDescription: externalUrl ? shortDescription : '', date: date, image: image, pdf: pdf, url: externalUrl ? url : '', externalUrl: externalUrl }, (status !== undefined ? { status: status } : {})))];
                        case 7:
                            data = _l.sent();
                            return [2 /*return*/, {
                                    message: 'Article created successfully',
                                    data: this.mapArticleResponse(data),
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.editArticle = function (id, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var date, rawDate, status, explicitExternalUrl, imageFile, pdfFile, imageUpload, _a, pdfUpload, _b, image, pdf, description, shortDescription, url, inferredExternalUrl, data;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            date = undefined;
                            if ((body === null || body === void 0 ? void 0 : body.date) !== undefined && String(body.date).trim() !== '') {
                                rawDate = String(body.date).trim();
                                date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
                                    ? new Date("".concat(rawDate.slice(6, 10), "-").concat(rawDate.slice(3, 5), "-").concat(rawDate.slice(0, 2)))
                                    : new Date(rawDate);
                                if (Number.isNaN(date.getTime())) {
                                    throw new common_1.BadRequestException('Invalid date (expected ISO date/datetime)');
                                }
                            }
                            status = this.parseEventStatus(body === null || body === void 0 ? void 0 : body.status);
                            explicitExternalUrl = this.parseExternalUrlToggle(this.resolveExternalUrlRaw(body));
                            imageFile = (_c = files === null || files === void 0 ? void 0 : files.image) === null || _c === void 0 ? void 0 : _c[0];
                            pdfFile = (_e = (_d = files === null || files === void 0 ? void 0 : files.pdf) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : (_f = files === null || files === void 0 ? void 0 : files.file) === null || _f === void 0 ? void 0 : _f[0];
                            if (!imageFile) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(imageFile, 'articles')];
                        case 1:
                            _a = _g.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _g.label = 3;
                        case 3:
                            imageUpload = _a;
                            if (!pdfFile) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(pdfFile, 'articles')];
                        case 4:
                            _b = _g.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = undefined;
                            _g.label = 6;
                        case 6:
                            pdfUpload = _b;
                            image = imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.fileUrl;
                            pdf = pdfUpload === null || pdfUpload === void 0 ? void 0 : pdfUpload.fileUrl;
                            description = (body === null || body === void 0 ? void 0 : body.description) !== undefined ? String(body.description).trim() : undefined;
                            shortDescription = (body === null || body === void 0 ? void 0 : body.shortDescription) !== undefined ||
                                (body === null || body === void 0 ? void 0 : body.short_description) !== undefined ||
                                (body === null || body === void 0 ? void 0 : body.shortDesc) !== undefined
                                ? this.readArticleShortDescription(body)
                                : undefined;
                            url = (body === null || body === void 0 ? void 0 : body.url) !== undefined ? String(body.url).trim() : undefined;
                            inferredExternalUrl = explicitExternalUrl !== null && explicitExternalUrl !== void 0 ? explicitExternalUrl : (url !== undefined && description === undefined && shortDescription !== undefined
                                ? true
                                : description !== undefined && url === undefined
                                    ? false
                                    : shortDescription !== undefined && description === undefined
                                        ? true
                                        : undefined);
                            return [4 /*yield*/, this.adminService.updateArticle(id, __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, ((body === null || body === void 0 ? void 0 : body.title) !== undefined ? { title: body.title } : {})), (description !== undefined ? { description: description } : {})), (shortDescription !== undefined ? { shortDescription: shortDescription } : {})), (date !== undefined ? { date: date } : {})), (url !== undefined ? { url: url } : {})), (inferredExternalUrl !== undefined ? { externalUrl: inferredExternalUrl } : {})), (status !== undefined ? { status: status } : {})), (image !== undefined ? { image: image } : {})), (pdf !== undefined ? { pdf: pdf } : {})))];
                        case 7:
                            data = _g.sent();
                            return [2 /*return*/, {
                                    message: 'Article updated successfully',
                                    data: this.mapArticleResponse(data),
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.listArticles = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listArticles()];
                        case 1:
                            data = (_a.sent()).map(function (a) { return (__assign({ s_no: a.s_no }, _this.mapArticleResponse(a))); });
                            return [2 /*return*/, { message: 'Articles retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.getArticleById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.mapArticleResponse;
                            return [4 /*yield*/, this.adminService.getArticleById(id)];
                        case 1:
                            data = _a.apply(this, [_b.sent()]);
                            return [2 /*return*/, { message: 'Article retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateArticleStatus = function (id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var status, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            status = this.parseEventStatus(body === null || body === void 0 ? void 0 : body.status);
                            return [4 /*yield*/, this.adminService.setOrToggleArticleStatus(id, status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Article status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteArticleAlias = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteArticle(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Article deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteArticle = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteArticle(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Article deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.getEventById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.getEventById(id, 'event')];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Event retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteEvent = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteEvent(id, 'event')];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Event deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteGallery = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.galleryService.deleteGallery(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Gallery item deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteGalleryAlias = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.galleryService.deleteGallery(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Gallery item deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.replyToCustomer = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.replyToCustomerViaManufacturer(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Reply email sent successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.replyToContact = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.sendContactReply(id, dto.replyMessage)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Reply sent successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.getContactReplies = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.getContactReplyHistory(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Reply history retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.listNotifications = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listNotifications(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Notifications retrieved successfully',
                                    data: result.data,
                                    totalCount: result.totalCount,
                                    unreadCount: result.unreadCount,
                                    currentPage: result.currentPage,
                                    totalPages: result.totalPages,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.markAllNotificationsSeen = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.markAllNotificationsSeen()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'All notifications marked as seen',
                                    success: result.success,
                                    markedCount: result.markedCount,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.markNotificationSeen = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.markNotificationSeen(id)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Notification marked as seen',
                                    success: result.success,
                                    id: result.id,
                                    seen: result.seen,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteBannerPost = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeBannerDelete(user, body)];
                });
            });
        };
        AdminController_1.prototype.deleteBannerDelete = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeBannerDelete(user, body)];
                });
            });
        };
        AdminController_1.prototype.executeBannerDelete = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            return [4 /*yield*/, this.adminService.deleteBanner(vendorScope, body.id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Banner deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.getBannerById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            return [4 /*yield*/, this.adminService.getBannerById(vendorScope, id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Banner retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateBannerStatus = function (user, id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorScope = (0, banner_vendor_scope_util_1.resolveBannerVendorScope)(user);
                            return [4 /*yield*/, this.adminService.setOrToggleBannerStatus(vendorScope, id, body === null || body === void 0 ? void 0 : body.status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Banner status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.createTeamMember = function (body, file) {
            return __awaiter(this, void 0, void 0, function () {
                var parsedCreateDisplayOrder, normalizedRoleIds, mergedSectorIds, dto, errors, errorMessages, imagePath, _a, teamMember;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            parsedCreateDisplayOrder = body.displayOrder === undefined ||
                                body.displayOrder === null ||
                                String(body.displayOrder).trim() === ''
                                ? undefined
                                : Number.parseInt(String(body.displayOrder), 10);
                            normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
                            if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(body)) {
                                throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).');
                            }
                            mergedSectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
                            dto = (0, class_transformer_1.plainToClass)(create_team_member_dto_1.CreateTeamMemberDto, {
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
                                showOnWebsite: (_b = body.showOnWebsite) !== null && _b !== void 0 ? _b : body.show_on_website,
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto)];
                        case 1:
                            errors = _c.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            if (!file) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'team-members')];
                        case 2:
                            _a = (_c.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = undefined;
                            _c.label = 4;
                        case 4:
                            imagePath = _a;
                            return [4 /*yield*/, this.adminService.createTeamMember({
                                    name: dto.name,
                                    designation: dto.designation,
                                    email: dto.email,
                                    mobile: dto.mobile,
                                    displayOrder: dto.displayOrder,
                                    businessVertical: dto.businessVertical,
                                    imagePath: imagePath,
                                    facebookUrl: dto.facebookUrl,
                                    twitterUrl: dto.twitterUrl,
                                    linkedinUrl: dto.linkedinUrl,
                                    roleId: dto.roleId,
                                    roleIds: normalizedRoleIds,
                                    sector_ids: mergedSectorIds,
                                    showOnWebsite: dto.showOnWebsite,
                                })];
                        case 5:
                            teamMember = _c.sent();
                            return [2 /*return*/, { message: 'Team member created successfully', data: teamMember }];
                    }
                });
            });
        };
        AdminController_1.prototype.editTeamMemberPost = function (user, body, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeTeamMemberEdit(user, body, file)];
                });
            });
        };
        AdminController_1.prototype.editTeamMemberPatch = function (user, body, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeTeamMemberEdit(user, body, file)];
                });
            });
        };
        AdminController_1.prototype.executeTeamMemberEdit = function (user, body, file) {
            return __awaiter(this, void 0, void 0, function () {
                var parsedEditDisplayOrder, normalizedRoleIds, explicitSectors, mergedSectorIds, dto, errors, errorMessages, imagePath, _a, teamMember;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            parsedEditDisplayOrder = body.displayOrder === undefined ||
                                body.displayOrder === null ||
                                String(body.displayOrder).trim() === ''
                                ? undefined
                                : Number.parseInt(String(body.displayOrder), 10);
                            normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
                            if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(body)) {
                                throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).');
                            }
                            explicitSectors = (0, merge_team_member_sectors_from_form_util_1.hasExplicitTeamMemberSectorFields)(body);
                            mergedSectorIds = (0, merge_team_member_sectors_from_form_util_1.mergeTeamMemberSectorIdsFromFormObject)(body);
                            dto = (0, class_transformer_1.plainToClass)(edit_team_member_dto_1.EditTeamMemberDto, {
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
                                showOnWebsite: (_b = body.showOnWebsite) !== null && _b !== void 0 ? _b : body.show_on_website,
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(dto)];
                        case 1:
                            errors = _c.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            if (!file) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'team-members')];
                        case 2:
                            _a = (_c.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = undefined;
                            _c.label = 4;
                        case 4:
                            imagePath = _a;
                            return [4 /*yield*/, this.adminService.updateTeamMember({
                                    id: dto.id,
                                    name: dto.name,
                                    designation: dto.designation,
                                    email: dto.email,
                                    mobile: dto.mobile,
                                    displayOrder: dto.displayOrder,
                                    businessVertical: dto.businessVertical,
                                    imagePath: imagePath,
                                    facebookUrl: dto.facebookUrl,
                                    twitterUrl: dto.twitterUrl,
                                    linkedinUrl: dto.linkedinUrl,
                                    roleId: dto.roleId,
                                    roleIds: normalizedRoleIds,
                                    sector_ids: explicitSectors ? mergedSectorIds : undefined,
                                    showOnWebsite: dto.showOnWebsite,
                                })];
                        case 5:
                            teamMember = _c.sent();
                            return [2 /*return*/, { message: 'Team member updated successfully', data: teamMember }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteTeamMemberPost = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeTeamMemberDelete(user, body)];
                });
            });
        };
        AdminController_1.prototype.deleteTeamMemberDelete = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeTeamMemberDelete(user, body)];
                });
            });
        };
        AdminController_1.prototype.executeTeamMemberDelete = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteTeamMember((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', body.id)];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team member deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.listNewsletterSubscribers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listNewsletterSubscribers()];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: data.length > 0
                                        ? 'Subscribers retrieved successfully'
                                        : 'No subscriptions found',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteNewsletterSubscriberPost = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteNewsletterSubscriber(body.id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscriber deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteNewsletterSubscriberDelete = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteNewsletterSubscriber(body.id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscriber deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.setNewsletterSubscriberStatusPost = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.setOrToggleNewsletterSubscriberStatus(body.id, body.status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscriber status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.setNewsletterSubscriberStatusPatch = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.setOrToggleNewsletterSubscriberStatus(body.id, body.status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscriber status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.setNewsletterSubscriberStatusParam = function (id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.setOrToggleNewsletterSubscriberStatus(id, body === null || body === void 0 ? void 0 : body.status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscriber status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.listTeamMemberSectorOptions = function () {
            return this.adminService.listTeamMemberSectorOptions();
        };
        AdminController_1.prototype.listTeamMembers = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeListTeamMembers(user, query)];
                });
            });
        };
        AdminController_1.prototype.listTeamMembersPaginated = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.executeListTeamMembers(user, query)];
                });
            });
        };
        AdminController_1.prototype.executeListTeamMembers = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.listTeamMembersPaginated((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', query)];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    message: 'Team members retrieved successfully',
                                    data: result.data,
                                    displayOrderMax: result.displayOrderMax,
                                    totalCount: result.totalCount,
                                    currentPage: result.currentPage,
                                    totalPages: result.totalPages,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.listContactMessages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listContactMessages()];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Contact messages retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.viewContactMessage = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.getContactMessageById(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Contact message retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.listProductInquiries = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.listProductInquiries()];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Product inquiries retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.viewProductInquiry = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.getProductInquiryById(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Product inquiry retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteContactMessagePost = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteContactMessage(body.id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Contact message deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.deleteContactMessageDelete = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.deleteContactMessage(body.id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Contact message deleted successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.searchTeamMembersByName = function (user, name) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = name === null || name === void 0 ? void 0 : name.trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Query parameter "name" is required');
                            }
                            return [4 /*yield*/, this.adminService.searchTeamMembers((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', {
                                    name: trimmed,
                                })];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team members search completed successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.searchTeamMembersByEmail = function (user, email) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = email === null || email === void 0 ? void 0 : email.trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Query parameter "email" is required');
                            }
                            return [4 /*yield*/, this.adminService.searchTeamMembers((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', {
                                    email: trimmed,
                                })];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team members search completed successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.searchTeamMembers = function (user, name, email) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.searchTeamMembers((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', {
                                name: (name === null || name === void 0 ? void 0 : name.trim()) || undefined,
                                email: (email === null || email === void 0 ? void 0 : email.trim()) || undefined,
                            })];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team members search completed successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.getTeamMemberById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.getTeamMemberById((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', id)];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team member retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateTeamMemberStatus = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.updateTeamMemberStatus((_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : '', id)];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { message: 'Team member status updated successfully', data: data }];
                    }
                });
            });
        };
        AdminController_1.prototype.changePassword = function (user, changePasswordDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.changePassword(user.userId, changePasswordDto)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateManufacturer = function (id, body, file) {
            return __awaiter(this, void 0, void 0, function () {
                var updateDto, errors, errorMessages, imagePath, _a, manufacturer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            updateDto = (0, class_transformer_1.plainToClass)(update_manufacturer_dto_1.UpdateManufacturerDto, {
                                manufacturerName: body.manufacturerName,
                                gpInternalId: body.gpInternalId,
                                manufacturerInitial: body.manufacturerInitial,
                            });
                            return [4 /*yield*/, (0, class_validator_1.validate)(updateDto)];
                        case 1:
                            errors = _b.sent();
                            if (errors.length > 0) {
                                errorMessages = errors
                                    .map(function (error) { return Object.values(error.constraints || {}); })
                                    .flat();
                                throw new common_1.BadRequestException(errorMessages.join(', '));
                            }
                            if (!file) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'manufacturers')];
                        case 2:
                            _a = (_b.sent()).fileUrl;
                            return [3 /*break*/, 4];
                        case 3:
                            _a = undefined;
                            _b.label = 4;
                        case 4:
                            imagePath = _a;
                            return [4 /*yield*/, this.adminService.updateManufacturer(id, updateDto, imagePath)];
                        case 5:
                            manufacturer = _b.sent();
                            return [2 /*return*/, {
                                    message: 'Manufacturer updated successfully',
                                    data: manufacturer,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateManufacturerStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.updateManufacturerStatus(id)];
                        case 1:
                            manufacturer = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Manufacturer status updated successfully',
                                    data: manufacturer,
                                }];
                    }
                });
            });
        };
        AdminController_1.prototype.updateVendorStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var vendor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.updateVendorStatus(id)];
                        case 1:
                            vendor = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Vendor status updated successfully',
                                    data: vendor,
                                }];
                    }
                });
            });
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listAdminPayments_decorators = [(0, common_1.Get)('payments/list'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Admin payment history (all vendors)',
                description: 'Lists payment_details across the platform (registration, certification, renew). ' +
                    'Same URN-based rules as the vendor GET /payments. Optional `manufacturerId` to scope one vendor. ' +
                    'Omit `status` to include all statuses. Search matches URN, reference no., or manufacturer name/email.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment history retrieved' })];
        _getDashboardMetrics_decorators = [(0, common_1.Get)('dashboard/metrics'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Admin dashboard metrics',
                description: 'Returns dashboard KPIs, **charts** (product status breakdown, certified vs uncertified, URN pipeline, ' +
                    'category certified counts, time-series), and **visibleSections** for RBAC. ' +
                    'Query filters: `period`, `year`, `month`, `quarter`, `productStatus`, `categoryId`, `region`, `granularity`. ' +
                    'See `data.charts.productStatusBreakdown`, `certifiedVsUncertified`, `urnPipeline`, `categoryCertified`. ' +
                    'Revenue widgets use GET /admin/dashboard/revenue-analytics.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metrics retrieved' })];
        _getCertifiedVsUncertifiedProducts_decorators = [(0, common_1.Get)('dashboard/certified-vs-uncertified-products'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Certified vs uncertified product metrics',
                description: 'Returns card totals + chart payload for certified and uncertified products on the admin dashboard.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Certified vs uncertified metrics retrieved' })];
        _getVerifiedVsUnverifiedManufacturers_decorators = [(0, common_1.Get)('dashboard/verified-vs-unverified-manufacturers'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verified vs unverified manufacturer metrics',
                description: 'Returns card totals + chart payload for verified and unverified manufacturers on the admin dashboard.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Verified vs unverified manufacturer metrics retrieved' })];
        _getExpiredProductsImpact_decorators = [(0, common_1.Get)('dashboard/expired-products-impact'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Expired products impact tracking',
                description: 'Returns expired certification impact totals (counts + percent) and chart payload for admin dashboard.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired products impact metrics retrieved' })];
        _getProductStatusBreakdown_decorators = [(0, common_1.Get)('dashboard/product-status-breakdown'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Product status breakdown for admin dashboard',
                description: 'Returns certified, uncertified, expired, and renewed product counts plus chart payload. ' +
                    'Same data as `GET /admin/dashboard/metrics` → `data.charts.productStatusBreakdown`.',
            })];
        _getUrnPipeline_decorators = [(0, common_1.Get)('dashboard/urn-pipeline'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'URN certification pipeline counts',
                description: 'Returns product counts per admin pipeline step (EOI → Certified). ' +
                    'Same data as `GET /admin/dashboard/metrics` → `data.charts.urnPipeline`.',
            })];
        _getRevenueAnalytics_decorators = [(0, common_1.Get)('dashboard/revenue-analytics'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Revenue analytics for admin dashboard',
                description: 'Returns donut (`distribution`: total centre + fee %/amount) and weekly line chart (`weeklyComparison`). ' +
                    'Source: `payment_details` with `paymentStatus` 1–2, summed on `quoteTotal`. ' +
                    'Filters: `period=last_month|this_month|this_week|this_year` (or alias `last_month`, `month`, `week`, `year`). ' +
                    'Prefer GET /admin/dashboard/revenue for the same payload.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue analytics retrieved' })];
        _getRejectedProductsAnalytics_decorators = [(0, common_1.Get)('dashboard/rejected-products-analytics'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Rejected products analytics',
                description: 'Returns rejected-product totals, rejection rate, and chart payload for admin dashboard.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Rejected products analytics retrieved' })];
        _getDashboardFilters_decorators = [(0, common_1.Get)('dashboard/filters'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Dashboard filter options',
                description: 'Returns period/year/month labels and values for the admin dashboard filter bar. ' +
                    'Use the same query param names when calling GET /admin/dashboard/metrics.',
            })];
        _getDashboardRecentProducts_decorators = [(0, common_1.Get)('dashboard/recent-products'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Recent products for admin dashboard table',
                description: 'Latest product/URN rows (same shape as POST /api/admin/products/list).',
            })];
        _getDashboardActivity_decorators = [(0, common_1.Get)('dashboard/activity'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Recent certification activity for admin dashboard',
            })];
        _editProfile_decorators = [(0, common_1.Patch)('profile/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Edit profile (unique GST + phone)',
                description: 'Edits the logged-in vendor profile on the linked manufacturer. Blocks the update if GST number or phone already exists for another vendor. ' +
                    '**gst** = GST certificate document URL path (or `https://…`); **gstNumber** = GSTIN; **companyLogo** = logo image URL; **pan** = PAN card document URL (**PDF, JPG, or PNG** file). Legacy: plain GSTIN may still be sent in **gst**.',
            }), (0, swagger_1.ApiBody)({ type: update_manufacturer_profile_dto_1.UpdateProfileDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or GST/phone already exists',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired token' })];
        _listBanners_decorators = [(0, common_1.Get)('banner/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List banners (vendor admin)',
                description: 'Returns **this vendor’s** banners for the admin grid (ordered by sequence number): **title**, **description**, **sequenceNumber**, **is_active**, and **id**. IDs match **GET /admin/banner/:id** (vendor-scoped). For **all** active banners on the public site, use **GET /website/public/banners**.',
            }), (0, swagger_1.ApiResponse)({
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
            })];
        _createBanner_decorators = [(0, common_1.Post)('banner'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)(bannerImageMultipartFields, (0, banner_image_upload_util_1.createBannerDiskMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Create banner',
                description: 'Creates a banner for the logged-in vendor. Image file may be sent as multipart field **image**, **bannerImage**, **banner_image**, or **file** (first non-empty file wins). Otherwise send **imageUrl** (http(s) or `/uploads/...`). Server stores **imageSource**: `binary_upload` vs `manual_url` from that choice.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        image: { type: 'string', format: 'binary', description: 'Primary file field name' },
                        bannerImage: { type: 'string', format: 'binary' },
                        banner_image: { type: 'string', format: 'binary' },
                        file: { type: 'string', format: 'binary' },
                        imageUrl: { type: 'string', description: 'Optional if image uploaded' },
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
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Banner created successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or invalid vendor',
            })];
        _editBanner_decorators = [(0, common_1.Patch)(['banner/:id', 'banner/:id/edit']), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.BANNERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)(bannerImageMultipartFields, (0, banner_image_upload_util_1.createBannerDiskMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Edit banner',
                description: 'Edits a banner for the logged-in vendor. New image: multipart **image**, **bannerImage**, **banner_image**, or **file**. New URL: **imageUrl**. Server sets **imageSource** only when the image changes.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id (from banner list)' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['title', 'sequenceNumber', 'description'],
                    properties: {
                        image: { type: 'string', format: 'binary' },
                        bannerImage: { type: 'string', format: 'binary' },
                        banner_image: { type: 'string', format: 'binary' },
                        file: { type: 'string', format: 'binary' },
                        imageUrl: { type: 'string', description: 'Optional if image uploaded' },
                        title: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive'] },
                        sequenceNumber: { type: 'number', example: 1 },
                        description: { type: 'string' },
                        imageSource: {
                            type: 'string',
                            enum: ['binary_upload', 'manual_url'],
                            description: 'Optional; when `image` or `imageUrl` is sent, server updates stored image source.',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error / invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' })];
        _createEvent_decorators = [(0, common_1.Post)('events/create'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
                storage: (0, multer_1.diskStorage)({
                    destination: (0, path_1.join)(process.cwd(), 'uploads', 'events'),
                    filename: function (req, file, cb) {
                        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var ext = (0, path_1.extname)(file.originalname || '');
                        cb(null, "event-".concat(uniqueSuffix).concat(ext));
                    },
                }),
                fileFilter: function (req, file, cb) {
                    if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                        cb(null, true);
                        return;
                    }
                    var allowedMimes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                    ];
                    cb(null, allowedMimes.includes(file.mimetype));
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            })), (0, swagger_1.ApiOperation)({
                summary: 'Create event',
                description: 'Creates an event (Admin panel). Multipart form fields: eventName, image, eventDate, eventStartTime, eventEndTime, eventLocation, eventDescription, and contact person details.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
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
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Event created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _editEvent_decorators = [(0, common_1.Patch)('events/:id/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: 20 },
                { name: 'images', maxCount: 20 },
                { name: 'eventImage', maxCount: 20 },
                { name: 'event_image', maxCount: 20 },
            ], {
                storage: (0, multer_1.diskStorage)({
                    destination: (0, path_1.join)(process.cwd(), 'uploads', 'events'),
                    filename: function (req, file, cb) {
                        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var ext = (0, path_1.extname)(file.originalname || '');
                        cb(null, "event-".concat(uniqueSuffix).concat(ext));
                    },
                }),
                fileFilter: function (req, file, cb) {
                    if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                        cb(null, true);
                        return;
                    }
                    var allowedMimes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                    ];
                    cb(null, allowedMimes.includes(file.mimetype));
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            })), (0, swagger_1.ApiOperation)({
                summary: 'Edit event',
                description: 'Edits an event (Admin panel). Same fields as create. URL param `id` can be MongoDB _id or numeric eventId.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
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
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Event updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' })];
        _createGallery_decorators = [(0, common_1.Post)('gallery/create'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'image[]', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'images', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
            ], (0, multer_universal_config_1.adminImageMemoryMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Create gallery item',
                description: 'Creates a gallery item. Fields accepted: title, description, date, galleryType, image. ' +
                    'galleryType dropdown must only use: Training & Workshops, Site Visits, Recognition.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['title', 'date', 'galleryType'],
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        date: { type: 'string', example: '2026-04-08' },
                        galleryType: { type: 'string', enum: __spreadArray([], gallery_schema_1.GALLERY_TYPES, true) },
                        image: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Upload one or more images with field name "image"',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Gallery item created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _editGallery_decorators = [(0, common_1.Patch)('gallery/:id/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'image[]', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'images', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'eventImage', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
                { name: 'event_image', maxCount: gallery_schema_1.GALLERY_MAX_IMAGES },
            ], (0, multer_universal_config_1.adminImageMemoryMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Edit gallery item',
                description: 'Edits a gallery item by id. Fields accepted: title, description, date, galleryType, image. ' +
                    'galleryType dropdown must only use: Training & Workshops, Site Visits, Recognition.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        date: { type: 'string', example: '2026-04-08' },
                        galleryType: { type: 'string', enum: __spreadArray([], gallery_schema_1.GALLERY_TYPES, true) },
                        image: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Upload one or more images with field name "image"',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' })];
        _listEventsForAdmin_decorators = [(0, common_1.Get)('events/manage/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List all events (admin dashboard)',
                description: 'Returns all events for the admin dashboard, including events whose end date has passed. Website visibility is derived from event end date, not manual status.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Events retrieved successfully' })];
        _listEvents_decorators = [(0, common_1.Get)('events/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List events (public website)',
                description: 'Returns paginated events for the public website events page. Default: page=1, limit=10. Only events whose end date has not passed are returned.',
            }), (0, swagger_1.ApiQuery)({
                name: 'page',
                required: false,
                type: Number,
                example: 1,
                description: 'Page number (1-based). Default 1.',
            }), (0, swagger_1.ApiQuery)({
                name: 'limit',
                required: false,
                type: Number,
                example: 10,
                description: 'Items per page. Default 10, max 50.',
            }), (0, swagger_1.ApiResponse)({
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
            }), (0, public_decorator_1.Public)()];
        _listGalleryTypes_decorators = [(0, common_1.Get)('gallery/types'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Gallery type options for add/edit dropdown',
                description: 'Returns only the gallery tabs allowed in admin add/edit: Training & Workshops, Site Visits, Recognition.',
            }), (0, swagger_1.ApiResponse)({
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
                                    value: { type: 'string', enum: __spreadArray([], gallery_schema_1.GALLERY_TYPES, true) },
                                    label: { type: 'string', enum: __spreadArray([], gallery_schema_1.GALLERY_TYPES, true) },
                                },
                            },
                        },
                    },
                },
            })];
        _listGallery_decorators = [(0, common_1.Get)('gallery/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List gallery items (public website)',
                description: 'Returns paginated gallery items for the public website. Default: page=1, limit=50. Only active items (eventStatus=1) are returned. No authentication required.',
            }), (0, swagger_1.ApiQuery)({
                name: 'page',
                required: false,
                type: Number,
                example: 1,
                description: 'Page number (1-based). Default 1.',
            }), (0, swagger_1.ApiQuery)({
                name: 'limit',
                required: false,
                type: Number,
                example: 50,
                description: 'Items per page. Default 50, max 50.',
            }), (0, swagger_1.ApiResponse)({
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
                                    galleryType: { type: 'string', enum: __spreadArray([], gallery_schema_1.GALLERY_TYPES, true) },
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
            }), (0, public_decorator_1.Public)()];
        _getGalleryById_decorators = [(0, common_1.Get)('gallery/:id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get gallery item by id (admin)',
                description: 'Returns one gallery item for edit/view with fields: title, description, date, image, images.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' })];
        _updateGalleryStatus_decorators = [(0, common_1.Patch)('gallery/:id/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle gallery status',
                description: 'Sets gallery item status to active/inactive. If body status is omitted, backend toggles current status.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['active', 'inactive'] },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery status updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' })];
        _createArticle_decorators = [(0, common_1.Post)('articles/create'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: 1 },
                { name: 'pdf', maxCount: 1 },
                { name: 'file', maxCount: 1 },
            ], {
                storage: (0, multer_1.diskStorage)({
                    destination: (0, path_1.join)(process.cwd(), 'uploads', 'articles'),
                    filename: function (req, file, cb) {
                        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var ext = (0, path_1.extname)(file.originalname || '');
                        cb(null, "article-".concat(uniqueSuffix).concat(ext));
                    },
                }),
                fileFilter: function (req, file, cb) {
                    if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                        cb(null, true);
                        return;
                    }
                    if (file.fieldname === 'pdf' || file.fieldname === 'file') {
                        if ((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file)) {
                            cb(null, true);
                            return;
                        }
                        cb(new common_1.BadRequestException(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE), false);
                        return;
                    }
                    var allowedImageMimes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                    ];
                    cb(null, allowedImageMimes.includes(file.mimetype));
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            })), (0, swagger_1.ApiOperation)({
                summary: 'Create article',
                description: 'Creates an article with title, date, image, file/pdf (PDF), externalUrl toggle and status. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url and shortDescription are required and full description is hidden.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['title', 'date', 'image', 'pdf'],
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        shortDescription: { type: 'string' },
                        date: { type: 'string', example: '2026-05-05' },
                        externalUrl: { type: 'boolean', default: false },
                        image: { type: 'string', format: 'binary' },
                        file: { type: 'string', format: 'binary' },
                        pdf: { type: 'string', format: 'binary' },
                        url: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive'] },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _editArticle_decorators = [(0, common_1.Patch)('articles/:id/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: 1 },
                { name: 'pdf', maxCount: 1 },
                { name: 'file', maxCount: 1 },
            ], {
                storage: (0, multer_1.diskStorage)({
                    destination: (0, path_1.join)(process.cwd(), 'uploads', 'articles'),
                    filename: function (req, file, cb) {
                        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var ext = (0, path_1.extname)(file.originalname || '');
                        cb(null, "article-".concat(uniqueSuffix).concat(ext));
                    },
                }),
                fileFilter: function (req, file, cb) {
                    if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                        cb(null, true);
                        return;
                    }
                    if (file.fieldname === 'pdf' || file.fieldname === 'file') {
                        if ((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file)) {
                            cb(null, true);
                            return;
                        }
                        cb(new common_1.BadRequestException(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE), false);
                        return;
                    }
                    var allowedImageMimes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                    ];
                    cb(null, allowedImageMimes.includes(file.mimetype));
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            })), (0, swagger_1.ApiOperation)({
                summary: 'Edit article',
                description: 'Edits article fields: title, date, image, file/pdf (PDF), externalUrl toggle, url/description/shortDescription and status. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url and shortDescription are required and full description is hidden.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        shortDescription: { type: 'string' },
                        date: { type: 'string', example: '2026-05-05' },
                        externalUrl: { type: 'boolean' },
                        image: { type: 'string', format: 'binary' },
                        file: { type: 'string', format: 'binary' },
                        pdf: { type: 'string', format: 'binary' },
                        url: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive'] },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' })];
        _listArticles_decorators = [(0, common_1.Get)(['articles/list', 'article/list']), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({
                summary: 'List articles',
                description: 'Returns articles with title, description, date, image, url and active flag (newest first).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Articles retrieved successfully' })];
        _getArticleById_decorators = [(0, common_1.Get)('articles/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({
                summary: 'Get article by id',
                description: 'Returns one article for view/edit with title, description, date, image, url and active flag.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Article retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' })];
        _updateArticleStatus_decorators = [(0, common_1.Patch)('articles/:id/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle article status',
                description: 'Sets article status to active/inactive. If body status is omitted, backend toggles current status.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['active', 'inactive'] },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Article status updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' })];
        _deleteArticleAlias_decorators = [(0, common_1.Delete)('articles/:id/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete article',
                description: 'Deletes an article by id. This is an alias route for frontend convenience.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' })];
        _deleteArticle_decorators = [(0, common_1.Delete)('articles/:id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete article',
                description: 'Deletes an article by id. Same behavior as DELETE /admin/articles/:id/delete.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Article MongoDB _id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' })];
        _getEventById_decorators = [(0, common_1.Get)('events/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get event by id (for edit/view)',
                description: 'Fetches one event with all fields needed to pre-fill the edit form. Accepts MongoDB _id or numeric eventId.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Event retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }), (0, public_decorator_1.Public)()];
        _deleteEvent_decorators = [(0, common_1.Delete)('events/:id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete event',
                description: 'Permanently deletes an event. `id` can be MongoDB _id or numeric eventId.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Event deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' })];
        _deleteGallery_decorators = [(0, common_1.Delete)('gallery/:id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete gallery item',
                description: 'Permanently deletes a gallery item. `id` can be MongoDB _id or numeric eventId.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' })];
        _deleteGalleryAlias_decorators = [(0, common_1.Delete)('gallery/:id/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete gallery item (alias)',
                description: 'Alias of DELETE /admin/gallery/:id for frontend convenience.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'MongoDB _id OR numeric eventId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery item deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Gallery item not found' })];
        _replyToCustomer_decorators = [(0, common_1.Post)('manufacturer/reply'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Reply to customer (email)',
                description: 'Sends an email to the customer. Requires email, userMessage, replyMessage.',
            }), (0, swagger_1.ApiBody)({ type: manufacturer_reply_dto_1.ManufacturerReplyDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply email sent successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _replyToContact_decorators = [(0, common_1.Post)('contact/:id/reply'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_REPLY), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Reply to contact message (store history)',
                description: 'Sends reply email to the contact message email, and stores only the admin reply history linked to contact message id.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact message MongoDB id' }), (0, swagger_1.ApiBody)({ type: contact_reply_dto_1.ContactReplyDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply sent and stored' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error / invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' })];
        _getContactReplies_decorators = [(0, common_1.Get)('contact/:id/replies'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get contact reply history',
                description: 'Returns stored admin reply history for a given contact message id.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact message MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Reply history' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' })];
        _listNotifications_decorators = [(0, common_1.Get)('notifications'), (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List admin in-app notifications',
                description: 'Admin bell feed (`notifications` collection). Optional time-range: all, today, week, 30d, 90d. Use PATCH `.../:id/seen` to mark read (`id` = MongoDB _id).',
            }), (0, swagger_1.ApiQuery)({
                name: 'range',
                required: false,
                enum: ['all', 'today', 'week', '30d', '90d'],
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiQuery)({
                name: 'seen',
                required: false,
                type: Boolean,
                description: 'Optional: true = read only, false = unread only',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Notifications list with pagination and root unreadCount (unread within range filter)',
            })];
        _markAllNotificationsSeen_decorators = [(0, common_1.Patch)('notifications/seen-all'), (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Mark all admin notifications as seen',
                description: 'Sets seen=true on all unread rows in the admin feed. Returns markedCount.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as seen' })];
        _markNotificationSeen_decorators = [(0, common_1.Patch)('notifications/:id/seen'), (0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Mark an admin notification as seen' }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Notification MongoDB _id (24-char hex)',
                example: '674a1b2c3d4e5f6789012345',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as seen' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' })];
        _deleteBannerPost_decorators = [(0, common_1.Post)('banner/delete'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete banner',
                description: 'Permanently deletes a banner by id. The banner must belong to the logged-in vendor. Same pattern as **team-member/delete** (JSON body).',
            }), (0, swagger_1.ApiBody)({ type: delete_banner_dto_1.DeleteBannerDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' })];
        _deleteBannerDelete_decorators = [(0, common_1.Delete)('banner/delete'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete banner',
                description: 'Same as **POST /admin/banner/delete** — JSON body `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_banner_dto_1.DeleteBannerDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' })];
        _getBannerById_decorators = [(0, common_1.Get)('banner/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get banner by id',
                description: 'Returns one banner for the **View Banner** modal: **imageUrl**, **imageSource** (`binary_upload` vs `manual_url`), **title**, **sequenceNumber**, and **description**. Vendor-scoped.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' })];
        _updateBannerStatus_decorators = [(0, common_1.Patch)('banner/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle banner status',
                description: 'Sets a banner **status** to **active/inactive** (1/0). If body `status` is omitted, backend toggles current state. Vendor-scoped.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Banner MongoDB id' }), (0, swagger_1.ApiBody)({ type: update_banner_status_dto_1.UpdateBannerStatusDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Banner status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Banner not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' })];
        _createTeamMember_decorators = [(0, common_1.Post)('team-member/create'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)(teamMemberImageInterceptor), (0, swagger_1.ApiOperation)({
                summary: 'Create team member',
                description: 'Use **Authorize** (Bearer) as usual. Swagger sometimes drops `Authorization` on multipart uploads — then send the same JWT via **x-access-token** header or **access_token** query param. ' +
                    '**businessVertical** is required and must be one of: Building Products, Industrial Products, Consumer Products, Facility Services. ' +
                    '**Sectors** multiselect — fixed options only (GET **/admin/team-member/sector-options**): Building, Industries, Consumer Products, Facility Services. Send **sectors** as JSON array of names or ids 1–4, **sectors[]**, **sector_ids**, etc. Category fields are not accepted.',
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
                        name: { type: 'string' },
                        designation: { type: 'string' },
                        email: { type: 'string' },
                        mobile: { type: 'string' },
                        displayOrder: { type: 'number', minimum: 1 },
                        businessVertical: {
                            type: 'string',
                            enum: __spreadArray([], vendor_user_schema_1.BUSINESS_VERTICALS, true),
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
                    required: ['name', 'email', 'mobile', 'displayOrder', 'businessVertical'],
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Team member created successfully' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or mobile already exists' })];
        _editTeamMemberPost_decorators = [TeamMemberEditDocs(), (0, common_1.Post)('team-member/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_UPDATE)];
        _editTeamMemberPatch_decorators = [TeamMemberEditDocs(), (0, common_1.Patch)('team-member/edit'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_UPDATE)];
        _deleteTeamMemberPost_decorators = [(0, common_1.Post)('team-member/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete team member (soft delete)',
                description: 'Sets team member **status** to **2** (removed from list). Same behaviour as partner delete. **POST** or **DELETE** with JSON body `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_team_member_dto_1.DeleteTeamMemberDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' })];
        _deleteTeamMemberDelete_decorators = [(0, common_1.Delete)('team-member/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete team member (soft delete)',
                description: 'Same as POST **/admin/team-member/delete** — JSON body `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_team_member_dto_1.DeleteTeamMemberDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' })];
        _listNewsletterSubscribers_decorators = [(0, common_1.Get)('newsletter/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List newsletter subscribers (admin)',
                description: 'Returns website newsletter subscriptions for the admin subscribers table. Reads directly from MongoDB.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscribers retrieved successfully' })];
        _deleteNewsletterSubscriberPost_decorators = [(0, common_1.Post)('newsletter/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete newsletter subscriber',
                description: 'Permanently deletes a newsletter subscriber by id (MongoDB _id). JSON body: `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriber deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' })];
        _deleteNewsletterSubscriberDelete_decorators = [(0, common_1.Delete)('newsletter/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete newsletter subscriber',
                description: 'Same as **POST /admin/newsletter/delete** — JSON body `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_newsletter_subscriber_dto_1.DeleteNewsletterSubscriberDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriber deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' })];
        _setNewsletterSubscriberStatusPost_decorators = [(0, common_1.Post)('newsletter/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle newsletter subscriber status',
                description: 'For subscribers list toggle. If `status` is omitted, backend toggles current status. Accepts MongoDB _id or S.No as `id`.',
            }), (0, swagger_1.ApiBody)({ type: update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscriber status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' })];
        _setNewsletterSubscriberStatusPatch_decorators = [(0, common_1.Patch)('newsletter/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle newsletter subscriber status',
                description: 'Same as **POST /admin/newsletter/status** — JSON body `{ "id": "...", "status"?: "active|inactive" }`.',
            }), (0, swagger_1.ApiBody)({ type: update_newsletter_subscriber_status_dto_1.UpdateNewsletterSubscriberStatusDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscriber status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' })];
        _setNewsletterSubscriberStatusParam_decorators = [(0, common_1.Patch)('newsletter/:id/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.SUBSCRIBERS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Set/toggle newsletter subscriber status (param)',
                description: 'Alternative form: pass id in URL. Optional body `{ "status"?: "active|inactive" }`. If status omitted, toggles.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Mongo _id or S.No (1-based)' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscriber status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id/status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscriber not found' })];
        _listTeamMemberSectorOptions_decorators = [(0, common_1.Get)('team-member/sector-options'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Fixed team member sector options',
                description: 'Returns the four allowed CMS team-member sectors for multiselect (not from GET /api/sectors): Building, Industries, Consumer Products, Facility Services.',
            }), (0, swagger_1.ApiResponse)({
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
            })];
        _listTeamMembers_decorators = [(0, common_1.Get)('team-member/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List team members',
                description: 'Returns global team members dataset for admin panel: serial number, name, designation, email, mobile, displayOrder, businessVertical, active flag, and id for actions. Excludes soft-deleted members (status 2). Sorted by displayOrder ascending.',
            }), (0, swagger_1.ApiResponse)({
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
                                        enum: __spreadArray([], vendor_user_schema_1.BUSINESS_VERTICALS, true),
                                    },
                                    business_vertical: { type: 'string', example: 'building products' },
                                    is_active: { type: 'boolean' },
                                },
                            },
                        },
                    },
                },
            })];
        _listTeamMembersPaginated_decorators = [(0, common_1.Get)('team-members/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.TEAM_MEMBERS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List team members (filters + pagination)',
                description: 'Supports filters (status, designation) and pagination (page, limit). Uses global team-members dataset and displayOrder sorting.',
            }), (0, swagger_1.ApiQuery)({
                name: 'status',
                required: false,
                description: 'active | inactive',
            }), (0, swagger_1.ApiQuery)({
                name: 'designation',
                required: false,
                description: 'Exact designation match (case-insensitive)',
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Default 1' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Default 10' })];
        _listContactMessages_decorators = [(0, common_1.Get)('contact/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List contact messages',
                description: 'Returns website contact form submissions for the admin panel table: S.No, Name, Email, Phone No, plus id for actions. Newest first.',
            }), (0, swagger_1.ApiResponse)({
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
            })];
        _viewContactMessage_decorators = [(0, common_1.Get)('contact/:id/view'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'View contact message',
                description: 'Returns one contact message for admin view: name, email, phone, subject, message.',
            }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Contact message MongoDB id (from list)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact message details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' })];
        _listProductInquiries_decorators = [(0, common_1.Get)('product-inquiry/list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List product inquiries',
                description: 'Returns ecolabelled product inquiry submissions for the admin panel with resolved manufacturerName, categoryName, productName, urnNumber, and eoiNo.',
            })];
        _viewProductInquiry_decorators = [(0, common_1.Get)('product-inquiry/:id/view'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'View product inquiry',
                description: 'Returns one product inquiry with manufacturer, product, category, and URN details.',
            })];
        _deleteContactMessagePost_decorators = [(0, common_1.Post)('contact/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete contact message',
                description: 'Permanently deletes a contact message by id. JSON body: `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_contact_message_dto_1.DeleteContactMessageDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Contact message deleted successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' })];
        _deleteContactMessageDelete_decorators = [(0, common_1.Delete)('contact/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.INQUIRIES_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete contact message',
                description: 'Same as **POST /admin/contact/delete** — JSON body `{ "id": "..." }`.',
            }), (0, swagger_1.ApiBody)({ type: delete_contact_message_dto_1.DeleteContactMessageDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Contact message deleted successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id / validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact message not found' })];
        _searchTeamMembersByName_decorators = [(0, common_1.Get)('team-member/search/by-name'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Search team members by name',
                description: 'Case-insensitive partial match on **name** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
            }), (0, swagger_1.ApiQuery)({
                name: 'name',
                required: true,
                description: 'Substring to match against team member name',
                example: 'Priya',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Search results (may be empty array)',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing or empty name' })];
        _searchTeamMembersByEmail_decorators = [(0, common_1.Get)('team-member/search/by-email'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Search team members by email',
                description: 'Case-insensitive partial match on **email** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
            }), (0, swagger_1.ApiQuery)({
                name: 'email',
                required: true,
                description: 'Substring to match against team member email',
                example: 'greenpro',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Search results (may be empty array)',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing or empty email' })];
        _searchTeamMembers_decorators = [(0, common_1.Get)('team-member/search'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Search team members by name and/or email',
                description: 'Optional **name** and **email** query params (case-insensitive partial match). At least one is required. If both are sent, both must match (**AND**). Same response shape as the team member list.',
            }), (0, swagger_1.ApiQuery)({
                name: 'name',
                required: false,
                description: 'Substring to match against name',
            }), (0, swagger_1.ApiQuery)({
                name: 'email',
                required: false,
                description: 'Substring to match against email',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Search results (may be empty array)',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Neither name nor email provided' })];
        _getTeamMemberById_decorators = [(0, common_1.Get)('team-member/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get team member by id',
                description: 'Returns one team member for the **View** modal: name, designation, email, mobile, displayOrder, businessVertical, status (**Active** / **Inactive**), image URL, social URLs, **sectors** (fixed: Building, Industries, Consumer Products, Facility Services). Soft-deleted excluded.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Team member MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' })];
        _updateTeamMemberStatus_decorators = [(0, common_1.Patch)('team-member/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Toggle team member status',
                description: 'Toggles team member (partner) **status**: **1** (active) ↔ **0** (inactive). Same as partner status toggle. Soft-deleted members (**2**) are not found.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Team member MongoDB id' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Team member status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Team member not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id or unexpected status' })];
        _changePassword_decorators = [(0, common_1.Patch)('change-password'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Change password',
                description: 'Updates the logged-in user password after verifying the current password.',
            }), (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or passwords do not match',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Invalid token or wrong current password',
            })];
        _updateManufacturer_decorators = [(0, common_1.Put)('manufacturers/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('manufacturer_image', {
                storage: storage,
                fileFilter: function (req, file, cb) {
                    if (!file) {
                        cb(null, true);
                        return;
                    }
                    var allowedMimes = [
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
            })), (0, swagger_1.ApiOperation)({
                summary: 'Update manufacturer details',
                description: 'Updates manufacturer display name (required). For **unverified** manufacturers, **gpInternalId** and **manufacturerInitial** are generated server-side from the name (multipart fields ignored if sent). For verified manufacturers, optional **gpInternalId** / **manufacturerInitial** may be supplied. Supports optional image upload.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer ID' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        manufacturerName: {
                            type: 'string',
                            description: 'Manufacturer name',
                        },
                        gpInternalId: {
                            type: 'string',
                            description: 'Optional for verified manufacturers (e.g. GPGP-001 or legacy GPSC-312). Ignored when unverified (auto-generated).',
                            example: 'GPGP-001',
                        },
                        manufacturerInitial: {
                            type: 'string',
                            description: 'Optional for verified (two letters). Ignored when unverified (auto-generated).',
                            example: 'GP',
                        },
                        manufacturer_image: {
                            type: 'string',
                            format: 'binary',
                            description: 'Manufacturer image (optional)',
                        },
                    },
                    required: ['manufacturerName'],
                },
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Manufacturer updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or format' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        _updateManufacturerStatus_decorators = [(0, common_1.Patch)('manufacturers/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Toggle manufacturer status',
                description: 'Toggles manufacturer status: if current status is 1, sets to 2; if 2, sets to 1',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Manufacturer status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        _updateVendorStatus_decorators = [(0, common_1.Patch)('vendors/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Toggle vendor status',
                description: 'Toggles vendor status: if current status is 0, sets to 1; if 1, sets to 0',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Vendor ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Vendor status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vendor not found' })];
        __esDecorate(_classThis, null, _listAdminPayments_decorators, { kind: "method", name: "listAdminPayments", static: false, private: false, access: { has: function (obj) { return "listAdminPayments" in obj; }, get: function (obj) { return obj.listAdminPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardMetrics_decorators, { kind: "method", name: "getDashboardMetrics", static: false, private: false, access: { has: function (obj) { return "getDashboardMetrics" in obj; }, get: function (obj) { return obj.getDashboardMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCertifiedVsUncertifiedProducts_decorators, { kind: "method", name: "getCertifiedVsUncertifiedProducts", static: false, private: false, access: { has: function (obj) { return "getCertifiedVsUncertifiedProducts" in obj; }, get: function (obj) { return obj.getCertifiedVsUncertifiedProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVerifiedVsUnverifiedManufacturers_decorators, { kind: "method", name: "getVerifiedVsUnverifiedManufacturers", static: false, private: false, access: { has: function (obj) { return "getVerifiedVsUnverifiedManufacturers" in obj; }, get: function (obj) { return obj.getVerifiedVsUnverifiedManufacturers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExpiredProductsImpact_decorators, { kind: "method", name: "getExpiredProductsImpact", static: false, private: false, access: { has: function (obj) { return "getExpiredProductsImpact" in obj; }, get: function (obj) { return obj.getExpiredProductsImpact; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductStatusBreakdown_decorators, { kind: "method", name: "getProductStatusBreakdown", static: false, private: false, access: { has: function (obj) { return "getProductStatusBreakdown" in obj; }, get: function (obj) { return obj.getProductStatusBreakdown; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUrnPipeline_decorators, { kind: "method", name: "getUrnPipeline", static: false, private: false, access: { has: function (obj) { return "getUrnPipeline" in obj; }, get: function (obj) { return obj.getUrnPipeline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevenueAnalytics_decorators, { kind: "method", name: "getRevenueAnalytics", static: false, private: false, access: { has: function (obj) { return "getRevenueAnalytics" in obj; }, get: function (obj) { return obj.getRevenueAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRejectedProductsAnalytics_decorators, { kind: "method", name: "getRejectedProductsAnalytics", static: false, private: false, access: { has: function (obj) { return "getRejectedProductsAnalytics" in obj; }, get: function (obj) { return obj.getRejectedProductsAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardFilters_decorators, { kind: "method", name: "getDashboardFilters", static: false, private: false, access: { has: function (obj) { return "getDashboardFilters" in obj; }, get: function (obj) { return obj.getDashboardFilters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardRecentProducts_decorators, { kind: "method", name: "getDashboardRecentProducts", static: false, private: false, access: { has: function (obj) { return "getDashboardRecentProducts" in obj; }, get: function (obj) { return obj.getDashboardRecentProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardActivity_decorators, { kind: "method", name: "getDashboardActivity", static: false, private: false, access: { has: function (obj) { return "getDashboardActivity" in obj; }, get: function (obj) { return obj.getDashboardActivity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editProfile_decorators, { kind: "method", name: "editProfile", static: false, private: false, access: { has: function (obj) { return "editProfile" in obj; }, get: function (obj) { return obj.editProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listBanners_decorators, { kind: "method", name: "listBanners", static: false, private: false, access: { has: function (obj) { return "listBanners" in obj; }, get: function (obj) { return obj.listBanners; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBanner_decorators, { kind: "method", name: "createBanner", static: false, private: false, access: { has: function (obj) { return "createBanner" in obj; }, get: function (obj) { return obj.createBanner; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editBanner_decorators, { kind: "method", name: "editBanner", static: false, private: false, access: { has: function (obj) { return "editBanner" in obj; }, get: function (obj) { return obj.editBanner; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createEvent_decorators, { kind: "method", name: "createEvent", static: false, private: false, access: { has: function (obj) { return "createEvent" in obj; }, get: function (obj) { return obj.createEvent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editEvent_decorators, { kind: "method", name: "editEvent", static: false, private: false, access: { has: function (obj) { return "editEvent" in obj; }, get: function (obj) { return obj.editEvent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGallery_decorators, { kind: "method", name: "createGallery", static: false, private: false, access: { has: function (obj) { return "createGallery" in obj; }, get: function (obj) { return obj.createGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editGallery_decorators, { kind: "method", name: "editGallery", static: false, private: false, access: { has: function (obj) { return "editGallery" in obj; }, get: function (obj) { return obj.editGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listEventsForAdmin_decorators, { kind: "method", name: "listEventsForAdmin", static: false, private: false, access: { has: function (obj) { return "listEventsForAdmin" in obj; }, get: function (obj) { return obj.listEventsForAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listEvents_decorators, { kind: "method", name: "listEvents", static: false, private: false, access: { has: function (obj) { return "listEvents" in obj; }, get: function (obj) { return obj.listEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listGalleryTypes_decorators, { kind: "method", name: "listGalleryTypes", static: false, private: false, access: { has: function (obj) { return "listGalleryTypes" in obj; }, get: function (obj) { return obj.listGalleryTypes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listGallery_decorators, { kind: "method", name: "listGallery", static: false, private: false, access: { has: function (obj) { return "listGallery" in obj; }, get: function (obj) { return obj.listGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGalleryById_decorators, { kind: "method", name: "getGalleryById", static: false, private: false, access: { has: function (obj) { return "getGalleryById" in obj; }, get: function (obj) { return obj.getGalleryById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateGalleryStatus_decorators, { kind: "method", name: "updateGalleryStatus", static: false, private: false, access: { has: function (obj) { return "updateGalleryStatus" in obj; }, get: function (obj) { return obj.updateGalleryStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createArticle_decorators, { kind: "method", name: "createArticle", static: false, private: false, access: { has: function (obj) { return "createArticle" in obj; }, get: function (obj) { return obj.createArticle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editArticle_decorators, { kind: "method", name: "editArticle", static: false, private: false, access: { has: function (obj) { return "editArticle" in obj; }, get: function (obj) { return obj.editArticle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listArticles_decorators, { kind: "method", name: "listArticles", static: false, private: false, access: { has: function (obj) { return "listArticles" in obj; }, get: function (obj) { return obj.listArticles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getArticleById_decorators, { kind: "method", name: "getArticleById", static: false, private: false, access: { has: function (obj) { return "getArticleById" in obj; }, get: function (obj) { return obj.getArticleById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateArticleStatus_decorators, { kind: "method", name: "updateArticleStatus", static: false, private: false, access: { has: function (obj) { return "updateArticleStatus" in obj; }, get: function (obj) { return obj.updateArticleStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteArticleAlias_decorators, { kind: "method", name: "deleteArticleAlias", static: false, private: false, access: { has: function (obj) { return "deleteArticleAlias" in obj; }, get: function (obj) { return obj.deleteArticleAlias; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteArticle_decorators, { kind: "method", name: "deleteArticle", static: false, private: false, access: { has: function (obj) { return "deleteArticle" in obj; }, get: function (obj) { return obj.deleteArticle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEventById_decorators, { kind: "method", name: "getEventById", static: false, private: false, access: { has: function (obj) { return "getEventById" in obj; }, get: function (obj) { return obj.getEventById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteEvent_decorators, { kind: "method", name: "deleteEvent", static: false, private: false, access: { has: function (obj) { return "deleteEvent" in obj; }, get: function (obj) { return obj.deleteEvent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteGallery_decorators, { kind: "method", name: "deleteGallery", static: false, private: false, access: { has: function (obj) { return "deleteGallery" in obj; }, get: function (obj) { return obj.deleteGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteGalleryAlias_decorators, { kind: "method", name: "deleteGalleryAlias", static: false, private: false, access: { has: function (obj) { return "deleteGalleryAlias" in obj; }, get: function (obj) { return obj.deleteGalleryAlias; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _replyToCustomer_decorators, { kind: "method", name: "replyToCustomer", static: false, private: false, access: { has: function (obj) { return "replyToCustomer" in obj; }, get: function (obj) { return obj.replyToCustomer; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _replyToContact_decorators, { kind: "method", name: "replyToContact", static: false, private: false, access: { has: function (obj) { return "replyToContact" in obj; }, get: function (obj) { return obj.replyToContact; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getContactReplies_decorators, { kind: "method", name: "getContactReplies", static: false, private: false, access: { has: function (obj) { return "getContactReplies" in obj; }, get: function (obj) { return obj.getContactReplies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listNotifications_decorators, { kind: "method", name: "listNotifications", static: false, private: false, access: { has: function (obj) { return "listNotifications" in obj; }, get: function (obj) { return obj.listNotifications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAllNotificationsSeen_decorators, { kind: "method", name: "markAllNotificationsSeen", static: false, private: false, access: { has: function (obj) { return "markAllNotificationsSeen" in obj; }, get: function (obj) { return obj.markAllNotificationsSeen; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markNotificationSeen_decorators, { kind: "method", name: "markNotificationSeen", static: false, private: false, access: { has: function (obj) { return "markNotificationSeen" in obj; }, get: function (obj) { return obj.markNotificationSeen; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteBannerPost_decorators, { kind: "method", name: "deleteBannerPost", static: false, private: false, access: { has: function (obj) { return "deleteBannerPost" in obj; }, get: function (obj) { return obj.deleteBannerPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteBannerDelete_decorators, { kind: "method", name: "deleteBannerDelete", static: false, private: false, access: { has: function (obj) { return "deleteBannerDelete" in obj; }, get: function (obj) { return obj.deleteBannerDelete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBannerById_decorators, { kind: "method", name: "getBannerById", static: false, private: false, access: { has: function (obj) { return "getBannerById" in obj; }, get: function (obj) { return obj.getBannerById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBannerStatus_decorators, { kind: "method", name: "updateBannerStatus", static: false, private: false, access: { has: function (obj) { return "updateBannerStatus" in obj; }, get: function (obj) { return obj.updateBannerStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTeamMember_decorators, { kind: "method", name: "createTeamMember", static: false, private: false, access: { has: function (obj) { return "createTeamMember" in obj; }, get: function (obj) { return obj.createTeamMember; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editTeamMemberPost_decorators, { kind: "method", name: "editTeamMemberPost", static: false, private: false, access: { has: function (obj) { return "editTeamMemberPost" in obj; }, get: function (obj) { return obj.editTeamMemberPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editTeamMemberPatch_decorators, { kind: "method", name: "editTeamMemberPatch", static: false, private: false, access: { has: function (obj) { return "editTeamMemberPatch" in obj; }, get: function (obj) { return obj.editTeamMemberPatch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTeamMemberPost_decorators, { kind: "method", name: "deleteTeamMemberPost", static: false, private: false, access: { has: function (obj) { return "deleteTeamMemberPost" in obj; }, get: function (obj) { return obj.deleteTeamMemberPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTeamMemberDelete_decorators, { kind: "method", name: "deleteTeamMemberDelete", static: false, private: false, access: { has: function (obj) { return "deleteTeamMemberDelete" in obj; }, get: function (obj) { return obj.deleteTeamMemberDelete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listNewsletterSubscribers_decorators, { kind: "method", name: "listNewsletterSubscribers", static: false, private: false, access: { has: function (obj) { return "listNewsletterSubscribers" in obj; }, get: function (obj) { return obj.listNewsletterSubscribers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteNewsletterSubscriberPost_decorators, { kind: "method", name: "deleteNewsletterSubscriberPost", static: false, private: false, access: { has: function (obj) { return "deleteNewsletterSubscriberPost" in obj; }, get: function (obj) { return obj.deleteNewsletterSubscriberPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteNewsletterSubscriberDelete_decorators, { kind: "method", name: "deleteNewsletterSubscriberDelete", static: false, private: false, access: { has: function (obj) { return "deleteNewsletterSubscriberDelete" in obj; }, get: function (obj) { return obj.deleteNewsletterSubscriberDelete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setNewsletterSubscriberStatusPost_decorators, { kind: "method", name: "setNewsletterSubscriberStatusPost", static: false, private: false, access: { has: function (obj) { return "setNewsletterSubscriberStatusPost" in obj; }, get: function (obj) { return obj.setNewsletterSubscriberStatusPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setNewsletterSubscriberStatusPatch_decorators, { kind: "method", name: "setNewsletterSubscriberStatusPatch", static: false, private: false, access: { has: function (obj) { return "setNewsletterSubscriberStatusPatch" in obj; }, get: function (obj) { return obj.setNewsletterSubscriberStatusPatch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setNewsletterSubscriberStatusParam_decorators, { kind: "method", name: "setNewsletterSubscriberStatusParam", static: false, private: false, access: { has: function (obj) { return "setNewsletterSubscriberStatusParam" in obj; }, get: function (obj) { return obj.setNewsletterSubscriberStatusParam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listTeamMemberSectorOptions_decorators, { kind: "method", name: "listTeamMemberSectorOptions", static: false, private: false, access: { has: function (obj) { return "listTeamMemberSectorOptions" in obj; }, get: function (obj) { return obj.listTeamMemberSectorOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listTeamMembers_decorators, { kind: "method", name: "listTeamMembers", static: false, private: false, access: { has: function (obj) { return "listTeamMembers" in obj; }, get: function (obj) { return obj.listTeamMembers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listTeamMembersPaginated_decorators, { kind: "method", name: "listTeamMembersPaginated", static: false, private: false, access: { has: function (obj) { return "listTeamMembersPaginated" in obj; }, get: function (obj) { return obj.listTeamMembersPaginated; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listContactMessages_decorators, { kind: "method", name: "listContactMessages", static: false, private: false, access: { has: function (obj) { return "listContactMessages" in obj; }, get: function (obj) { return obj.listContactMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _viewContactMessage_decorators, { kind: "method", name: "viewContactMessage", static: false, private: false, access: { has: function (obj) { return "viewContactMessage" in obj; }, get: function (obj) { return obj.viewContactMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listProductInquiries_decorators, { kind: "method", name: "listProductInquiries", static: false, private: false, access: { has: function (obj) { return "listProductInquiries" in obj; }, get: function (obj) { return obj.listProductInquiries; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _viewProductInquiry_decorators, { kind: "method", name: "viewProductInquiry", static: false, private: false, access: { has: function (obj) { return "viewProductInquiry" in obj; }, get: function (obj) { return obj.viewProductInquiry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteContactMessagePost_decorators, { kind: "method", name: "deleteContactMessagePost", static: false, private: false, access: { has: function (obj) { return "deleteContactMessagePost" in obj; }, get: function (obj) { return obj.deleteContactMessagePost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteContactMessageDelete_decorators, { kind: "method", name: "deleteContactMessageDelete", static: false, private: false, access: { has: function (obj) { return "deleteContactMessageDelete" in obj; }, get: function (obj) { return obj.deleteContactMessageDelete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchTeamMembersByName_decorators, { kind: "method", name: "searchTeamMembersByName", static: false, private: false, access: { has: function (obj) { return "searchTeamMembersByName" in obj; }, get: function (obj) { return obj.searchTeamMembersByName; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchTeamMembersByEmail_decorators, { kind: "method", name: "searchTeamMembersByEmail", static: false, private: false, access: { has: function (obj) { return "searchTeamMembersByEmail" in obj; }, get: function (obj) { return obj.searchTeamMembersByEmail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchTeamMembers_decorators, { kind: "method", name: "searchTeamMembers", static: false, private: false, access: { has: function (obj) { return "searchTeamMembers" in obj; }, get: function (obj) { return obj.searchTeamMembers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTeamMemberById_decorators, { kind: "method", name: "getTeamMemberById", static: false, private: false, access: { has: function (obj) { return "getTeamMemberById" in obj; }, get: function (obj) { return obj.getTeamMemberById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTeamMemberStatus_decorators, { kind: "method", name: "updateTeamMemberStatus", static: false, private: false, access: { has: function (obj) { return "updateTeamMemberStatus" in obj; }, get: function (obj) { return obj.updateTeamMemberStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changePassword_decorators, { kind: "method", name: "changePassword", static: false, private: false, access: { has: function (obj) { return "changePassword" in obj; }, get: function (obj) { return obj.changePassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateManufacturer_decorators, { kind: "method", name: "updateManufacturer", static: false, private: false, access: { has: function (obj) { return "updateManufacturer" in obj; }, get: function (obj) { return obj.updateManufacturer; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateManufacturerStatus_decorators, { kind: "method", name: "updateManufacturerStatus", static: false, private: false, access: { has: function (obj) { return "updateManufacturerStatus" in obj; }, get: function (obj) { return obj.updateManufacturerStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVendorStatus_decorators, { kind: "method", name: "updateVendorStatus", static: false, private: false, access: { has: function (obj) { return "updateVendorStatus" in obj; }, get: function (obj) { return obj.updateVendorStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
