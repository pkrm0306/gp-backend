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
exports.CategoriesController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var update_category_status_dto_1 = require("./dto/update-category-status.dto");
var category_image_upload_config_1 = require("./category-image-upload.config");
var upload_file_util_1 = require("../utils/upload-file.util");
var CategoriesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Categories'), (0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _exportCsv_decorators;
    var _updateStatus_decorators;
    var _updateCategory_decorators;
    var _updateCategoryPut_decorators;
    var _removeCategory_decorators;
    var _uploadCategoryImage_decorators;
    var _addCategory_decorators;
    var CategoriesController = _classThis = /** @class */ (function () {
        function CategoriesController_1(categoriesService) {
            this.categoriesService = (__runInitializers(this, _instanceExtraInitializers), categoriesService);
        }
        CategoriesController_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var categories;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.findAll(query)];
                        case 1:
                            categories = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Categories retrieved successfully',
                                    data: categories,
                                }];
                    }
                });
            });
        };
        CategoriesController_1.prototype.exportCsv = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var csv, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.buildCsvExport(query)];
                        case 1:
                            csv = _a.sent();
                            buf = Buffer.from(csv, 'utf-8');
                            return [2 /*return*/, new common_1.StreamableFile(buf, {
                                    type: 'text/csv; charset=utf-8',
                                    disposition: 'attachment; filename="categories-export.csv"',
                                })];
                    }
                });
            });
        };
        CategoriesController_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.updateStatus(id, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Category status updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        CategoriesController_1.prototype.updateCategory = function (id, dto, image) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateCategoryMultipart(id, dto, image)];
                });
            });
        };
        CategoriesController_1.prototype.updateCategoryPut = function (id, dto, image) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateCategoryMultipart(id, dto, image)];
                });
            });
        };
        CategoriesController_1.prototype.updateCategoryMultipart = function (id, dto, image) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.update(id, dto, image)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Category updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        CategoriesController_1.prototype.removeCategory = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.remove(id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    message: 'Category deleted successfully',
                                    data: null,
                                }];
                    }
                });
            });
        };
        CategoriesController_1.prototype.uploadCategoryImage = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                var uploaded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('file is required (multipart field name: file)');
                            }
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'categories')];
                        case 1:
                            uploaded = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Image uploaded successfully',
                                    data: {
                                        category_image: uploaded.fileUrl,
                                        category_image_url: this.categoriesService.resolveCategoryImageUrl(uploaded.fileUrl),
                                    },
                                }];
                    }
                });
            });
        };
        CategoriesController_1.prototype.addCategory = function (dto, image) {
            return __awaiter(this, void 0, void 0, function () {
                var uploaded, _a, category;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!image) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(image, 'categories')];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _b.label = 3;
                        case 3:
                            uploaded = _a;
                            return [4 /*yield*/, this.categoriesService.create({
                                    category_name: dto.category_name,
                                    category_image: uploaded === null || uploaded === void 0 ? void 0 : uploaded.fileUrl,
                                    category_raw_material_forms: dto.category_raw_material_forms,
                                    category_status: dto.category_status,
                                    sector: dto.sector,
                                })];
                        case 4:
                            category = _b.sent();
                            return [2 /*return*/, {
                                    message: 'Category created successfully',
                                    data: category,
                                }];
                    }
                });
            });
        };
        return CategoriesController_1;
    }());
    __setFunctionName(_classThis, "CategoriesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)('categories'), (0, swagger_1.ApiOperation)({
                summary: 'Get all categories',
                description: 'Returns categories from the categories collection. Optional filters: sector (single), sectors (multi-select comma-separated, listing only), status (category_status). Sort by category_name: sort=asc (A–Z, default) or sort=desc (Z–A).',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of categories retrieved successfully',
            })];
        _exportCsv_decorators = [(0, common_1.Get)('categories/export'), (0, swagger_1.ApiOperation)({
                summary: 'Export categories as CSV',
                description: 'Applies same filters as categories list: sector, status, sort (by category_name).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV download' })];
        _updateStatus_decorators = [(0, common_1.Patch)('categories/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update category status',
                description: 'Sets category_status (e.g. active/inactive).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Category MongoDB _id' }), (0, swagger_1.ApiBody)({ type: update_category_status_dto_1.UpdateCategoryStatusDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' })];
        _updateCategory_decorators = [(0, common_1.Patch)('categories/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', (0, category_image_upload_config_1.categoryImageMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Edit category (PATCH)',
                description: 'Multipart: optional text fields (category_name, category_raw_material_forms, category_status, sector) and optional file field **image**. Send at least one field or a new image. Same behavior as PUT.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Category MongoDB _id' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        category_name: { type: 'string' },
                        category_raw_material_forms: { type: 'string' },
                        category_status: { type: 'integer' },
                        sector: { type: 'integer' },
                        image: {
                            type: 'string',
                            format: 'binary',
                            description: 'New category image (optional)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Nothing to update' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'Another category already uses this name (case-insensitive)',
            })];
        _updateCategoryPut_decorators = [(0, common_1.Put)('categories/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', (0, category_image_upload_config_1.categoryImageMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Edit category (PUT)',
                description: 'Same as PATCH — multipart category update.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Category MongoDB _id' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        category_name: { type: 'string' },
                        category_raw_material_forms: { type: 'string' },
                        category_status: { type: 'integer' },
                        sector: { type: 'integer' },
                        image: {
                            type: 'string',
                            format: 'binary',
                            description: 'New category image (optional)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Nothing to update' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'Another category already uses this name (case-insensitive)',
            })];
        _removeCategory_decorators = [(0, common_1.Delete)('categories/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete category',
                description: 'Allowed only when no products reference this category (products.categoryId). Otherwise returns 409.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Category MongoDB _id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'Products exist under this category',
            })];
        _uploadCategoryImage_decorators = [(0, common_1.Post)('uploadCategoryImage'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, category_image_upload_config_1.categoryImageMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Upload category image only (optional)',
                description: 'Saves under uploads/categories/. You can use POST /addCategory with an `image` file instead; this endpoint is for uploading an image without creating a category yet.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['file'],
                    properties: {
                        file: { type: 'string', format: 'binary', description: 'Image file' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'File saved' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing file or invalid type' })];
        _addCategory_decorators = [(0, common_1.Post)('addCategory'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', (0, category_image_upload_config_1.categoryImageMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Create a category (multipart — upload image here)',
                description: 'Send multipart/form-data: text fields category_name, category_raw_material_forms, category_status, sector, and file field **image** for the picture. The server saves the file under uploads/categories/ and stores the path; you do not type a filename manually. Image is optional.',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['category_name'],
                    properties: {
                        category_name: { type: 'string', example: 'Wooden Products' },
                        category_raw_material_forms: { type: 'string', example: '1,3,2' },
                        category_status: { type: 'integer', example: 1 },
                        sector: { type: 'integer', example: 1 },
                        image: {
                            type: 'string',
                            format: 'binary',
                            description: 'Category image file (JPEG, PNG, GIF, WebP). Optional.',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or invalid image type',
            }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'A category with this name already exists (case-insensitive)',
            })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCsv_decorators, { kind: "method", name: "exportCsv", static: false, private: false, access: { has: function (obj) { return "exportCsv" in obj; }, get: function (obj) { return obj.exportCsv; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCategory_decorators, { kind: "method", name: "updateCategory", static: false, private: false, access: { has: function (obj) { return "updateCategory" in obj; }, get: function (obj) { return obj.updateCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCategoryPut_decorators, { kind: "method", name: "updateCategoryPut", static: false, private: false, access: { has: function (obj) { return "updateCategoryPut" in obj; }, get: function (obj) { return obj.updateCategoryPut; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeCategory_decorators, { kind: "method", name: "removeCategory", static: false, private: false, access: { has: function (obj) { return "removeCategory" in obj; }, get: function (obj) { return obj.removeCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadCategoryImage_decorators, { kind: "method", name: "uploadCategoryImage", static: false, private: false, access: { has: function (obj) { return "uploadCategoryImage" in obj; }, get: function (obj) { return obj.uploadCategoryImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addCategory_decorators, { kind: "method", name: "addCategory", static: false, private: false, access: { has: function (obj) { return "addCategory" in obj; }, get: function (obj) { return obj.addCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CategoriesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CategoriesController = _classThis;
}();
exports.CategoriesController = CategoriesController;
