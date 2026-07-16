"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSummitsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var any_permissions_decorator_1 = require("../common/decorators/any-permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var summits_service_1 = require("./summits.service");
var summit_constants_1 = require("./constants/summit.constants");
var summit_upload_multer_1 = require("./utils/summit-upload.multer");
var AdminSummitsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Summits'), (0, common_1.Controller)('admin/summits'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listSummits_decorators;
    var _listRoot_decorators;
    var _getMeta_decorators;
    var _previewBySlug_decorators;
    var _create_decorators;
    var _getById_decorators;
    var _updateFull_decorators;
    var _updateStatus_decorators;
    var _updateSection_decorators;
    var _upload_decorators;
    var _remove_decorators;
    var AdminSummitsController = _classThis = /** @class */ (function () {
        function AdminSummitsController_1(summitsService) {
            this.summitsService = (__runInitializers(this, _instanceExtraInitializers), summitsService);
        }
        AdminSummitsController_1.prototype.listSummits = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.list(query)];
                });
            });
        };
        AdminSummitsController_1.prototype.listRoot = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.list(query)];
                });
            });
        };
        AdminSummitsController_1.prototype.list = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.list(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summits retrieved successfully',
                                    data: result.items,
                                    items: result.items,
                                    pagination: {
                                        page: result.page,
                                        limit: result.limit,
                                        perPage: result.limit,
                                        total: result.total,
                                        totalPages: result.totalPages,
                                    },
                                    total: result.total,
                                    page: result.page,
                                    limit: result.limit,
                                    totalPages: result.totalPages,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.getMeta = function (excludeSummitId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.getFormMeta(excludeSummitId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit form metadata retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.previewBySlug = function (req, slug) {
            return __awaiter(this, void 0, void 0, function () {
                var origin, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            origin = "".concat(req.protocol, "://").concat(req.get('host'));
                            return [4 /*yield*/, this.summitsService.findBySlugForPreview(slug, origin)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit preview retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.create(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit created successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.getById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (id === 'list' || id === 'meta') {
                                throw new common_1.BadRequestException("Invalid summit id: ".concat(id));
                            }
                            return [4 /*yield*/, this.summitsService.findById(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.updateFull = function (id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.updateFull(id, body)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.updateStatus(id, dto.status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit status updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.updateSection = function (id, section, body) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!summits_service_1.SummitsService.isValidSection(section)) {
                                throw new common_1.BadRequestException("Invalid section. Allowed: ".concat(summit_constants_1.SUMMIT_SECTION_KEYS.join(', ')));
                            }
                            return [4 /*yield*/, this.summitsService.updateSection(id, section, body)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit section saved successfully',
                                    data: result,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.upload = function (id, query, file) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('file is required');
                            }
                            return [4 /*yield*/, this.summitsService.uploadAsset(id, query.type, file, query.itemId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'File uploaded successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminSummitsController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.summitsService.remove(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit deleted successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return AdminSummitsController_1;
    }());
    __setFunctionName(_classThis, "AdminSummitsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listSummits_decorators = [(0, common_1.Get)('list'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_VIEW, permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List summits (card grid)',
                description: 'Returns `data` as an array of list items (same shape as admin events list). ' +
                    'Use `GET /admin/summits/list` or `GET /admin/summits`. Pagination in `pagination` + top-level totals.',
            })];
        _listRoot_decorators = [(0, common_1.Get)(), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_VIEW, permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'List summits (alias of GET /admin/summits/list)' })];
        _getMeta_decorators = [(0, common_1.Get)('meta'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_VIEW, permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Summit form metadata (year dropdown + status options)',
                description: 'Use `years` for the year select in basic information. `occupiedYears` lists years already used by other summits (one summit per year). Status values are `active` and `inactive`.',
            })];
        _previewBySlug_decorators = [(0, common_1.Get)('preview/:slug'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_VIEW, permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Preview summit by slug (active or inactive)',
                description: 'Same payload as the public detail page (`GET /website/summits/:slug`) but allows inactive/draft summits for admin preview.',
            }), (0, swagger_1.ApiParam)({ name: 'slug', example: 'greenpro-summit-2026' })];
        _create_decorators = [(0, common_1.Post)(), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_ADD, permissions_constants_1.PERMISSIONS.EVENTS_ADD), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create summit (default status: inactive)' })];
        _getById_decorators = [(0, common_1.Get)(':id'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_VIEW, permissions_constants_1.PERMISSIONS.EVENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Get full summit document (edit / preview)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Summit MongoDB id' })];
        _updateFull_decorators = [(0, common_1.Patch)(':id'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_UPDATE, permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Update full summit (final submit)' })];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_UPDATE, permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Set summit active or inactive (public site shows active only)' })];
        _updateSection_decorators = [(0, common_1.Patch)(':id/sections/:section'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_UPDATE, permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Save one summit section' }), (0, swagger_1.ApiParam)({
                name: 'section',
                enum: summit_constants_1.SUMMIT_SECTION_KEYS,
            })];
        _upload_decorators = [(0, common_1.Post)(':id/upload'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_UPDATE, permissions_constants_1.PERMISSIONS.EVENTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, summit_upload_multer_1.summitUploadMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Upload banner, speaker, sponsor image, or PDF',
                description: 'Query: type=banner|speaker|sponsor|pdf_industrial|pdf_buildings, optional itemId. Returns url + fileName for PATCH section.',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                    },
                },
            })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.SUMMITS_DELETE, permissions_constants_1.PERMISSIONS.EVENTS_DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete summit (soft delete)' })];
        __esDecorate(_classThis, null, _listSummits_decorators, { kind: "method", name: "listSummits", static: false, private: false, access: { has: function (obj) { return "listSummits" in obj; }, get: function (obj) { return obj.listSummits; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listRoot_decorators, { kind: "method", name: "listRoot", static: false, private: false, access: { has: function (obj) { return "listRoot" in obj; }, get: function (obj) { return obj.listRoot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMeta_decorators, { kind: "method", name: "getMeta", static: false, private: false, access: { has: function (obj) { return "getMeta" in obj; }, get: function (obj) { return obj.getMeta; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _previewBySlug_decorators, { kind: "method", name: "previewBySlug", static: false, private: false, access: { has: function (obj) { return "previewBySlug" in obj; }, get: function (obj) { return obj.previewBySlug; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getById_decorators, { kind: "method", name: "getById", static: false, private: false, access: { has: function (obj) { return "getById" in obj; }, get: function (obj) { return obj.getById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFull_decorators, { kind: "method", name: "updateFull", static: false, private: false, access: { has: function (obj) { return "updateFull" in obj; }, get: function (obj) { return obj.updateFull; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSection_decorators, { kind: "method", name: "updateSection", static: false, private: false, access: { has: function (obj) { return "updateSection" in obj; }, get: function (obj) { return obj.updateSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _upload_decorators, { kind: "method", name: "upload", static: false, private: false, access: { has: function (obj) { return "upload" in obj; }, get: function (obj) { return obj.upload; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminSummitsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminSummitsController = _classThis;
}();
exports.AdminSummitsController = AdminSummitsController;
