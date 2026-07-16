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
exports.ProductRegistrationController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var vendor_product_list_pagination_util_1 = require("./helpers/vendor-product-list-pagination.util");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var register_product_dto_1 = require("./dto/register-product.dto");
var update_product_dto_1 = require("./dto/update-product.dto");
var list_products_dto_1 = require("./dto/list-products.dto");
var ProductRegistrationController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Product Registration'), (0, swagger_1.ApiExtraModels)(list_products_dto_1.ListProductsDto), (0, common_1.Controller)('product-registration'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _vendorListFilterOptions_decorators;
    var _listProducts_decorators;
    var _registerSingleProduct_decorators;
    var _registerBulkProducts_decorators;
    var _updateProduct_decorators;
    var ProductRegistrationController = _classThis = /** @class */ (function () {
        function ProductRegistrationController_1(productRegistrationService) {
            this.productRegistrationService = (__runInitializers(this, _instanceExtraInitializers), productRegistrationService);
        }
        ProductRegistrationController_1.prototype.vendorListFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productRegistrationService.vendorGetUncertifiedListFilterOptions()];
                });
            });
        };
        ProductRegistrationController_1.prototype.listProducts = function (user, listProductsDto) {
            return __awaiter(this, void 0, void 0, function () {
                var result, pagination, error_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.listProducts(listProductsDto, user.manufacturerId)];
                        case 1:
                            result = _d.sent();
                            pagination = (_a = result === null || result === void 0 ? void 0 : result.pagination) !== null && _a !== void 0 ? _a : (0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({
                                page: (_b = listProductsDto.page) !== null && _b !== void 0 ? _b : 1,
                                limit: (_c = listProductsDto.limit) !== null && _c !== void 0 ? _c : 20,
                                totalCount: 0,
                            });
                            return [2 /*return*/, {
                                    message: 'EOI list fetched successfully',
                                    data: result !== null && result !== void 0 ? result : {
                                        data: [],
                                        pagination: pagination,
                                    },
                                    pagination: pagination,
                                    totalCount: pagination.totalCount,
                                    totalPages: pagination.totalPages,
                                    page: pagination.page,
                                    limit: pagination.limit,
                                    currentPage: pagination.currentPage,
                                    hasMore: pagination.hasMore,
                                    isLastPage: pagination.isLastPage,
                                }];
                        case 2:
                            error_1 = _d.sent();
                            console.error('Controller error:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationController_1.prototype.registerSingleProduct = function (user, registerProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            manufacturerId = user === null || user === void 0 ? void 0 : user.manufacturerId;
                            if (!manufacturerId) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.registerProduct(registerProductDto, manufacturerId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    status: 'success',
                                    message: 'Product(s) registered successfully',
                                    data: result,
                                }];
                        case 2:
                            error_2 = _a.sent();
                            console.error('Controller error:', error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationController_1.prototype.registerBulkProducts = function (user, bulkRegisterProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, _i, _a, product, results, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            if (bulkRegisterProductDto.products.length === 0) {
                                throw new common_1.BadRequestException('At least one product is required');
                            }
                            manufacturerId = user === null || user === void 0 ? void 0 : user.manufacturerId;
                            if (!manufacturerId) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            // Optional guard for backward compatibility: if manufacturerId is sent in payload, it must match JWT
                            for (_i = 0, _a = bulkRegisterProductDto.products; _i < _a.length; _i++) {
                                product = _a[_i];
                                if (product.manufacturerId &&
                                    product.manufacturerId !== manufacturerId) {
                                    throw new common_1.BadRequestException('Payload manufacturerId must match logged-in manufacturer');
                                }
                            }
                            return [4 /*yield*/, this.productRegistrationService.registerBulkProducts(bulkRegisterProductDto, manufacturerId)];
                        case 1:
                            results = _b.sent();
                            return [2 /*return*/, {
                                    status: 'success',
                                    message: 'Product(s) registered successfully',
                                    data: results,
                                }];
                        case 2:
                            error_3 = _b.sent();
                            console.error('Controller error:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationController_1.prototype.updateProduct = function (user, productId, updateProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.productRegistrationService.updateProduct(productId, updateProductDto)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    status: 'success',
                                    message: 'Product updated successfully',
                                    data: result,
                                }];
                        case 2:
                            error_4 = _a.sent();
                            console.error('Controller error:', error_4);
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductRegistrationController_1;
    }());
    __setFunctionName(_classThis, "ProductRegistrationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _vendorListFilterOptions_decorators = [(0, common_1.Get)('list/filter-options'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor uncertified EOI list — filter options',
                description: 'Returns **all countries** for a dropdown (`data.countries[]`, sorted A–Z). Not limited to countries with products. ' +
                    'Alternative: `GET /countries/dropdown`. **State** and **city** are free-text filters on `GET /product-registration/list`.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Filter options retrieved successfully',
            })];
        _listProducts_decorators = [(0, common_1.Get)('list'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor EOI list grouped by URN',
                description: 'Returns paginated URN groups (not flat products). Each group includes nested **eois[]** with **EOI `productStatus`** and **statusLabel** (Pending / Submitted / …). ' +
                    '**Default filter:** **Pending (0) + Submitted (1)** only (uncertified queue). Override with **`productStatusList`** (e.g. `0,1` or `3`) or a single **`productStatus`** / **`status`**. ' +
                    '**Location filters:** `countryId` (dropdown id), `state` / `state_name` (text), `city` (text) — match any manufacturing plant on the EOI. ' +
                    'Pagination counts URNs. When search matches any EOI in a URN, the full **eois[]** for that URN is returned (same filters).',
            }), (0, swagger_1.ApiQuery)({
                name: 'page',
                required: false,
                type: Number,
                description: 'Page number (default: 1)',
                example: 1,
            }), (0, swagger_1.ApiQuery)({
                name: 'limit',
                required: false,
                type: Number,
                description: 'Number of items per page (default: 20)',
                example: 20,
            }), (0, swagger_1.ApiQuery)({
                name: 'search',
                required: false,
                type: String,
                description: 'Global search term (searches in product_name, eoi_no, urn_no, category.category_name)',
                example: 'Solar Panel',
            }), (0, swagger_1.ApiQuery)({
                name: 'productStatus',
                required: false,
                type: Number,
                description: 'Single EOI **productStatus** filter (0–4). If omitted and `productStatusList` is omitted, server defaults to **0 + 1** (Pending + Submitted).',
                example: 0,
                enum: [0, 1, 2, 3, 4],
            }), (0, swagger_1.ApiQuery)({
                name: 'productStatusList',
                required: false,
                type: String,
                description: 'Multiple EOI **productStatus** values: comma-separated or repeated param, e.g. **`0,1`**. Takes precedence over `productStatus` / `status` when set.',
                example: '0,1',
            }), (0, swagger_1.ApiQuery)({
                name: 'product_status_list',
                required: false,
                type: String,
                description: 'Snake_case alias of `productStatusList`.',
                example: '0,1',
            }), (0, swagger_1.ApiQuery)({
                name: 'status',
                required: false,
                type: Number,
                description: 'Deprecated alias for `productStatus`',
                example: 0,
                enum: [0, 1, 2, 3, 4],
                deprecated: true,
            }), (0, swagger_1.ApiQuery)({
                name: 'categoryId',
                required: false,
                type: String,
                description: 'Filter by category ObjectId',
            }), (0, swagger_1.ApiQuery)({
                name: 'dateFrom',
                required: false,
                type: String,
                description: 'Created date from (YYYY-MM-DD)',
                example: '2026-01-01',
            }), (0, swagger_1.ApiQuery)({
                name: 'dateTo',
                required: false,
                type: String,
                description: 'Created date to (YYYY-MM-DD)',
                example: '2026-12-31',
            }), (0, swagger_1.ApiQuery)({
                name: 'countryId',
                required: false,
                type: String,
                description: 'Filter by plant country MongoDB `_id` (from `GET /product-registration/list/filter-options` or `GET /countries`).',
            }), (0, swagger_1.ApiQuery)({
                name: 'state',
                required: false,
                type: String,
                description: 'Filter by plant state **name** (free text, partial match). Do not send state ObjectId.',
                example: 'Telangana',
            }), (0, swagger_1.ApiQuery)({
                name: 'state_name',
                required: false,
                type: String,
                description: 'Snake_case alias of `state` (text).',
                example: 'Telangana',
            }), (0, swagger_1.ApiQuery)({
                name: 'city',
                required: false,
                type: String,
                description: 'Filter by plant city (free text, partial match).',
                example: 'Hyderabad',
            }), (0, swagger_1.ApiQuery)({
                name: 'sort',
                required: false,
                type: String,
                description: 'URN sort by earliest product createdDate (default: desc)',
                example: 'desc',
                enum: ['asc', 'desc'],
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'EOI list fetched successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'EOI list fetched successfully' },
                        data: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            urnNo: { type: 'string', example: 'URN-20260514165917' },
                                            createdDate: {
                                                type: 'string',
                                                format: 'date-time',
                                            },
                                            urnStatus: {
                                                type: 'string',
                                                enum: ['Active', 'Pending', 'Inactive'],
                                            },
                                            totalEoi: { type: 'number', example: 3 },
                                            eois: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: { type: 'string' },
                                                        eoiNo: { type: 'string', example: 'GPPMI003012' },
                                                        productName: { type: 'string' },
                                                        categoryName: { type: 'string' },
                                                        productStatus: { type: 'number', example: 0 },
                                                        statusLabel: { type: 'string', example: 'Pending' },
                                                        createdDate: { type: 'string', format: 'date-time' },
                                                        hpUnits: { type: 'number', example: 5 },
                                                        plantCount: { type: 'number', example: 5 },
                                                        city: {
                                                            type: 'string',
                                                            nullable: true,
                                                            example: 'Hyderabad',
                                                            description: 'City from the first manufacturing plant (by createdDate) for this EOI.',
                                                        },
                                                        stateName: {
                                                            type: 'string',
                                                            nullable: true,
                                                            example: 'Telangana',
                                                            description: 'State name from the first plant, resolved via `states` collection.',
                                                        },
                                                        sector: {
                                                            type: 'number',
                                                            nullable: true,
                                                            example: 1,
                                                            description: 'Sector id from the product category (`categories.sector`).',
                                                        },
                                                        sectorName: {
                                                            type: 'string',
                                                            nullable: true,
                                                            example: 'Building Materials',
                                                            description: 'Sector label from `sectors` when `sector` matches `sectors.id`.',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        page: { type: 'number', example: 1 },
                                        limit: { type: 'number', example: 10 },
                                        totalCount: { type: 'number', example: 8 },
                                        totalPages: { type: 'number', example: 1 },
                                    },
                                },
                            },
                        },
                    },
                },
            })];
        _registerSingleProduct_decorators = [(0, common_1.Post)('single'), (0, swagger_1.ApiOperation)({
                summary: 'Register a single product',
                description: 'Registers a single product with its plants. Generates URN and EOI automatically. Manufacturer is resolved from logged-in user.',
            }), (0, swagger_1.ApiBody)({ type: register_product_dto_1.RegisterProductDto }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Product registered successfully',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        message: {
                            type: 'string',
                            example: 'Product(s) registered successfully',
                        },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                productId: { type: 'number' },
                                productName: { type: 'string' },
                                eoiNo: { type: 'string' },
                                urnNo: { type: 'string' },
                                plants: { type: 'array' },
                            },
                        },
                    },
                },
            })];
        _registerBulkProducts_decorators = [(0, common_1.Post)('bulk'), (0, swagger_1.ApiOperation)({
                summary: 'Register multiple products (bulk)',
                description: 'Registers multiple products in a single request. All products share the same URN, but each gets a unique EOI.',
            }), (0, swagger_1.ApiBody)({ type: register_product_dto_1.BulkRegisterProductDto }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Products registered successfully',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        message: {
                            type: 'string',
                            example: 'Product(s) registered successfully',
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    productId: { type: 'number' },
                                    productName: { type: 'string' },
                                    eoiNo: { type: 'string' },
                                    urnNo: { type: 'string' },
                                    plants: { type: 'array' },
                                },
                            },
                        },
                    },
                },
            })];
        _updateProduct_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({
                summary: 'Update a product in place (admin EOI edit)',
                description: 'Updates the existing product row only — URN and EOI are never regenerated. ' +
                    'Requires productName, productDetails, urnNo, and eoiNo; urnNo/eoiNo must match the product for {id} (400 on mismatch). ' +
                    'Optional categoryId updates the product and all active product plants for that product. ' +
                    'Category change resets all raw materials data for the URN and invalidates admin/vendor product list caches (`listRefreshRequired` in response). ' +
                    'Category change is blocked when productStatus is certified (2), urnStatus >= 6 (after final review submission), or URN is in renewal (12–17). ' +
                    'Other fields remain optional.',
            }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Product ID',
                example: '507f1f77bcf86cd799439011',
            }), (0, swagger_1.ApiBody)({ type: update_product_dto_1.UpdateProductDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Product updated successfully',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        message: { type: 'string', example: 'Product updated successfully' },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                productId: { type: 'number' },
                                productName: { type: 'string' },
                                productImage: { type: 'string' },
                                productDetails: { type: 'string' },
                                productType: { type: 'number' },
                                productStatus: { type: 'number' },
                                productRenewStatus: { type: 'number' },
                                urnStatus: { type: 'number' },
                                assessmentReportUrl: { type: 'string' },
                                rejectedDetails: { type: 'string' },
                                certifiedDate: { type: 'string', format: 'date-time' },
                                validtillDate: { type: 'string', format: 'date-time' },
                                firstNotifyDate: { type: 'string', format: 'date-time' },
                                secondNotifyDate: { type: 'string', format: 'date-time' },
                                thirdNotifyDate: { type: 'string', format: 'date-time' },
                                renewedDate: { type: 'string', format: 'date-time' },
                                eoiNo: { type: 'string' },
                                urnNo: { type: 'string' },
                                createdDate: { type: 'string', format: 'date-time' },
                                updatedDate: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Invalid product ID or duplicate URN/EOI',
            })];
        __esDecorate(_classThis, null, _vendorListFilterOptions_decorators, { kind: "method", name: "vendorListFilterOptions", static: false, private: false, access: { has: function (obj) { return "vendorListFilterOptions" in obj; }, get: function (obj) { return obj.vendorListFilterOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listProducts_decorators, { kind: "method", name: "listProducts", static: false, private: false, access: { has: function (obj) { return "listProducts" in obj; }, get: function (obj) { return obj.listProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerSingleProduct_decorators, { kind: "method", name: "registerSingleProduct", static: false, private: false, access: { has: function (obj) { return "registerSingleProduct" in obj; }, get: function (obj) { return obj.registerSingleProduct; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerBulkProducts_decorators, { kind: "method", name: "registerBulkProducts", static: false, private: false, access: { has: function (obj) { return "registerBulkProducts" in obj; }, get: function (obj) { return obj.registerBulkProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProduct_decorators, { kind: "method", name: "updateProduct", static: false, private: false, access: { has: function (obj) { return "updateProduct" in obj; }, get: function (obj) { return obj.updateProduct; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductRegistrationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductRegistrationController = _classThis;
}();
exports.ProductRegistrationController = ProductRegistrationController;
