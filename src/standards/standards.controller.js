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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var StandardsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Standards'), (0, common_1.Controller)('api/standards')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findBySector_decorators;
    var _findByCategory_decorators;
    var _exportCsv_decorators;
    var _streamFile_decorators;
    var _findOne_decorators;
    var _create_decorators;
    var _update_decorators;
    var _patchStatus_decorators;
    var _remove_decorators;
    var StandardsController = _classThis = /** @class */ (function () {
        function StandardsController_1(standardsService) {
            this.standardsService = (__runInitializers(this, _instanceExtraInitializers), standardsService);
        }
        StandardsController_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findAllPaginated(query)];
                });
            });
        };
        StandardsController_1.prototype.findBySector = function (sectorId, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findAllPaginatedForSectorPath(sectorId, query)];
                });
            });
        };
        StandardsController_1.prototype.findByCategory = function (categoryId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var cid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardsService.resolveCategoryIdForByCategoryRoute(categoryId)];
                        case 1:
                            cid = _a.sent();
                            return [2 /*return*/, this.standardsService.findAllPaginated(__assign(__assign({}, query), { category_id: cid }))];
                    }
                });
            });
        };
        StandardsController_1.prototype.exportCsv = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var csv, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardsService.buildCsvExport(query)];
                        case 1:
                            csv = _a.sent();
                            buf = Buffer.from(csv, 'utf-8');
                            return [2 /*return*/, new common_1.StreamableFile(buf, {
                                    type: 'text/csv; charset=utf-8',
                                    disposition: 'attachment; filename="standards-export.csv"',
                                })];
                    }
                });
            });
        };
        StandardsController_1.prototype.streamFile = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.standardsService.parseStandardId(id);
                            return [4 /*yield*/, this.standardsService.streamStandardFile(numericId, res)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.standardsService.parseStandardId(id);
                            return [4 /*yield*/, this.standardsService.findOneById(numericId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Standard retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        StandardsController_1.prototype.create = function (dto, file, req) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.');
                            }
                            return [4 /*yield*/, this.standardsService.create(dto, file, req.body)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Standard created successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        StandardsController_1.prototype.update = function (id, dto, req, file) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.standardsService.parseStandardId(id);
                            return [4 /*yield*/, this.standardsService.update(numericId, dto, file, req.body)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Standard updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        StandardsController_1.prototype.patchStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.standardsService.parseStandardId(id);
                            return [4 /*yield*/, this.standardsService.updateStatus(numericId, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Standard status updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        StandardsController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.standardsService.parseStandardId(id);
                            return [4 /*yield*/, this.standardsService.remove(numericId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    message: 'Standard deleted successfully',
                                    data: null,
                                }];
                    }
                });
            });
        };
        return StandardsController_1;
    }());
    __setFunctionName(_classThis, "StandardsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'List standards (paginated)',
                description: 'Pagination, search on name, filter by **resource_standard_type** (single) or **resource_standard_types** (multi-select, comma-separated), **category_id**, **sector**, and status, sort. Each row includes **category_ids**, **categories**, and sector fields for admin dropdowns.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list' })];
        _findBySector_decorators = [(0, common_1.Get)('by-sector/:sectorId'), (0, swagger_1.ApiOperation)({
                summary: 'List standards for a sector (paginated)',
                description: 'Same pagination and filters as GET /api/standards, except **do not pass sector** in the query — the sector is fixed by the path. **sectorId** is the numeric sector `id` from GET /api/sectors. Returns 400 if the sector does not exist.',
            }), (0, swagger_1.ApiParam)({
                name: 'sectorId',
                description: 'Numeric sector `id` from GET /api/sectors',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or unknown sector id' })];
        _findByCategory_decorators = [(0, common_1.Get)('by-category/:categoryId'), (0, swagger_1.ApiOperation)({
                summary: 'List standards for a category (paginated)',
                description: 'Same pagination and filters as GET /api/standards, except **do not pass category_id** in the query — the category is fixed by the path. ' +
                    '**categoryId** may be the numeric `category_id` from GET /categories or the category MongoDB `_id` (24-char hex). Returns 400 if the category does not exist.',
            }), (0, swagger_1.ApiParam)({
                name: 'categoryId',
                description: 'Numeric `category_id` from GET /categories, or category document `_id` (MongoDB ObjectId string)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or unknown category id' })];
        _exportCsv_decorators = [(0, common_1.Get)('export'), (0, swagger_1.ApiOperation)({
                summary: 'Export standards as CSV',
                description: 'Applies search, resource_standard_type / resource_standard_types, **category_id**, **sector**, and status filters. ' +
                    'Returns all matching rows as CSV (no page/limit). Prefer this over GET /api/standards?limit=… for export.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV download' })];
        _streamFile_decorators = [(0, common_1.Get)(':id/file'), (0, swagger_1.ApiOperation)({
                summary: 'View standard document (PDF/image)',
                description: 'Streams the file from local disk or redirects to the public S3/CloudFront URL. No auth required so admin can open in a new tab.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric standard id' }), (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to S3 URL' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard or file not found' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({
                summary: 'Get standard by id',
                description: 'Response includes **category_ids**, **categories**, legacy **category_id** / **category_name**, and **sector_id** / **sector_ids** / **sector_name** (primary category’s sector).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric standard id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, multer_universal_config_1.standardsDocumentMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Create standard (file upload)',
                description: 'Form: **sectors** (required, multiselect) — one or more numeric sector ids from GET /api/sectors. The standard is linked to **all** categories in each selected sector (union). ' +
                    '**file** (required): PDF, JPG, or PNG, max 10MB — stored only via the shared **uploadFile()** helper (`src/utils/upload-file.util.ts`, folder `standards`, local or S3). ' +
                    'Also: name, description (optional), resource_standard_type. New standards are always created **active** (`status=1`); use PATCH `.../status` to change.',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['name', 'resource_standard_type', 'file'],
                    properties: {
                        sectors: {
                            oneOf: [
                                { type: 'array', items: { type: 'integer' } },
                                { type: 'string', description: 'JSON array of sector ids, e.g. "[1,2]"' },
                            ],
                            description: 'Multiselect: one or more sector ids from GET /api/sectors (required unless using sector / sectors[] / sector_ids)',
                        },
                        sector: {
                            oneOf: [{ type: 'integer' }, { type: 'string' }],
                            description: 'Legacy single sector id (merged with sectors)',
                        },
                        'sectors[]': {
                            oneOf: [
                                { type: 'array', items: { type: 'integer' } },
                                { type: 'string' },
                            ],
                            description: 'Repeated sector ids (multipart)',
                        },
                        sector_ids: {
                            oneOf: [
                                { type: 'array', items: { type: 'integer' } },
                                { type: 'string', description: 'JSON array or comma-separated ids' },
                            ],
                        },
                        sectorIds: {
                            type: 'string',
                            description: 'JSON array string of sector ids',
                        },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        resource_standard_type: { type: 'string' },
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'PDF, JPG, or PNG',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Created' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or missing file' })];
        _update_decorators = [(0, common_1.Put)(':id/edit'), (0, common_1.Patch)(':id/edit'), (0, common_1.Put)(':id'), (0, common_1.Patch)(':id'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, multer_universal_config_1.standardsDocumentMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Update standard',
                description: 'Supports **PUT** or **PATCH** on `/api/standards/:id` (and legacy `/api/standards/:id/edit`). ' +
                    'Optional **sectors** (multiselect) or legacy **sector** — when sent, replaces linked categories with the union across selected sectors. ' +
                    'Optional **file**: new PDF/JPG/PNG via shared **uploadFile()** (`uploads/standards/` or S3); previous file is removed when a new file is uploaded. ' +
                    'Other fields: name, description, resource_standard_type. **status** is not changed from this endpoint — use PATCH `.../status`. At least one field or file required.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric standard id' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        sectors: {
                            oneOf: [
                                { type: 'array', items: { type: 'integer' } },
                                { type: 'string', description: 'JSON array string' },
                            ],
                            description: 'Multiselect sector ids; replaces category links when sent',
                        },
                        sector: {
                            oneOf: [{ type: 'integer' }, { type: 'string' }],
                            description: 'Single sector id (legacy); merged with sectors',
                        },
                        'sectors[]': {
                            oneOf: [{ type: 'array', items: { type: 'integer' } }, { type: 'string' }],
                        },
                        sector_ids: {
                            oneOf: [
                                { type: 'array', items: { type: 'integer' } },
                                { type: 'string' },
                            ],
                        },
                        sectorIds: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        resource_standard_type: { type: 'string' },
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Optional replacement (PDF, JPG, PNG)',
                        },
                    },
                },
            })];
        _patchStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Set standard status' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric standard id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete standard and its file' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric standard id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findBySector_decorators, { kind: "method", name: "findBySector", static: false, private: false, access: { has: function (obj) { return "findBySector" in obj; }, get: function (obj) { return obj.findBySector; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCategory_decorators, { kind: "method", name: "findByCategory", static: false, private: false, access: { has: function (obj) { return "findByCategory" in obj; }, get: function (obj) { return obj.findByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCsv_decorators, { kind: "method", name: "exportCsv", static: false, private: false, access: { has: function (obj) { return "exportCsv" in obj; }, get: function (obj) { return obj.exportCsv; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamFile_decorators, { kind: "method", name: "streamFile", static: false, private: false, access: { has: function (obj) { return "streamFile" in obj; }, get: function (obj) { return obj.streamFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchStatus_decorators, { kind: "method", name: "patchStatus", static: false, private: false, access: { has: function (obj) { return "patchStatus" in obj; }, get: function (obj) { return obj.patchStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsController = _classThis;
}();
exports.StandardsController = StandardsController;
