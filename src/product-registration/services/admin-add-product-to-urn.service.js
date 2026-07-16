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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AdminAddProductToUrnService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("../constants/active-product.filter");
var admin_add_product_to_urn_util_1 = require("../helpers/admin-add-product-to-urn.util");
var audit_actions_1 = require("../../audit-log/audit-actions");
var audit_friendlies_1 = require("../../audit-log/audit-friendlies");
var invalidate_product_listings_cache_util_1 = require("../helpers/invalidate-product-listings-cache.util");
var validate_state_country_util_1 = require("../helpers/validate-state-country.util");
var AdminAddProductToUrnService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminAddProductToUrnService = _classThis = /** @class */ (function () {
        function AdminAddProductToUrnService_1(productModel, productPlantModel, categoryModel, manufacturerModel, connection, eoiNumberService, sequenceHelper, countriesService, statesService, auditLogService, redisService) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.categoryModel = categoryModel;
            this.manufacturerModel = manufacturerModel;
            this.connection = connection;
            this.eoiNumberService = eoiNumberService;
            this.sequenceHelper = sequenceHelper;
            this.countriesService = countriesService;
            this.statesService = statesService;
            this.auditLogService = auditLogService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AdminAddProductToUrnService.name);
        }
        AdminAddProductToUrnService_1.prototype.getAddProductContext = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, bundle, hasCertificationFee, eligibility, suggestedPlants;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.loadUrnBundle(trimmedUrn)];
                        case 1:
                            bundle = _a.sent();
                            return [4 /*yield*/, this.hasCertificationFeeForUrn(trimmedUrn)];
                        case 2:
                            hasCertificationFee = _a.sent();
                            eligibility = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
                                urnStatus: bundle.urnStatus,
                                siblingProductStatuses: bundle.siblings.map(function (s) { return Number(s.productStatus); }),
                                hasCertificationFee: hasCertificationFee,
                            });
                            return [4 /*yield*/, this.loadSuggestedPlants(bundle.siblings[0]._id)];
                        case 3:
                            suggestedPlants = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    categoryId: String(bundle.categoryId),
                                    categoryName: bundle.categoryName,
                                    manufacturerId: String(bundle.manufacturerId),
                                    manufacturerName: bundle.manufacturerName,
                                    vendorId: String(bundle.vendorId),
                                    urnStatus: bundle.urnStatus,
                                    existingEoiCount: bundle.existingEoiCount,
                                    activeEoiCount: bundle.siblings.length,
                                    siblingProductStatuses: bundle.siblings.map(function (s) { return Number(s.productStatus); }),
                                    defaultProductStatus: eligibility.defaultProductStatus,
                                    canAddProduct: eligibility.canAddProduct,
                                    blockReason: eligibility.blockReason,
                                    suggestedPlants: suggestedPlants,
                                }];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.addProductToUrn = function (urnNo, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, bundle, hasCertificationFee, eligibility, urnCategoryId, urnStatusBefore, manufacturerId, adminObjectId, now, created, error_1;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!((_a = dto.plants) === null || _a === void 0 ? void 0 : _a.length)) {
                                throw new common_1.BadRequestException('At least one plant is required');
                            }
                            return [4 /*yield*/, this.loadUrnBundle(trimmedUrn)];
                        case 1:
                            bundle = _d.sent();
                            return [4 /*yield*/, this.hasCertificationFeeForUrn(trimmedUrn)];
                        case 2:
                            hasCertificationFee = _d.sent();
                            eligibility = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
                                urnStatus: bundle.urnStatus,
                                siblingProductStatuses: bundle.siblings.map(function (s) { return Number(s.productStatus); }),
                                hasCertificationFee: hasCertificationFee,
                            });
                            if (!eligibility.canAddProduct) {
                                throw new common_1.BadRequestException((_b = eligibility.blockReason) !== null && _b !== void 0 ? _b : 'URN is not eligible for new products');
                            }
                            urnCategoryId = String(bundle.categoryId);
                            if (((_c = dto.categoryId) === null || _c === void 0 ? void 0 : _c.trim()) && dto.categoryId.trim() !== urnCategoryId) {
                                throw new common_1.BadRequestException('Category must match the URN category');
                            }
                            urnStatusBefore = bundle.urnStatus;
                            manufacturerId = String(bundle.manufacturerId);
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            now = new Date();
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.runInTransaction(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var assignment, numericProductId, productData, savedProduct;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, this.eoiNumberService.assignNextActiveEoiNo(manufacturerId, session)];
                                            case 1:
                                                assignment = _c.sent();
                                                return [4 /*yield*/, this.sequenceHelper.getProductId()];
                                            case 2:
                                                numericProductId = _c.sent();
                                                productData = {
                                                    productId: numericProductId,
                                                    categoryId: bundle.categoryId,
                                                    vendorId: bundle.vendorId,
                                                    manufacturerId: bundle.manufacturerId,
                                                    eoiNo: assignment.eoiNo,
                                                    eoiSequence: assignment.eoiSequence,
                                                    urnNo: trimmedUrn,
                                                    productName: dto.productName.trim(),
                                                    productImage: ((_a = dto.productImage) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                    plantCount: dto.plants.length,
                                                    productDetails: dto.productDetails.trim(),
                                                    productType: 0,
                                                    productStatus: eligibility.defaultProductStatus,
                                                    productRenewStatus: (_b = bundle.siblings[0].productRenewStatus) !== null && _b !== void 0 ? _b : 0,
                                                    urnStatus: urnStatusBefore,
                                                    addedByAdminId: adminObjectId,
                                                    createdDate: now,
                                                    updatedDate: now,
                                                };
                                                return [4 /*yield*/, this.productModel.create([productData], {
                                                        session: session,
                                                    })];
                                            case 3:
                                                savedProduct = (_c.sent())[0];
                                                return [4 /*yield*/, this.createPlantsForProduct(savedProduct._id, assignment.eoiNo, trimmedUrn, bundle, dto.plants, now, session)];
                                            case 4:
                                                _c.sent();
                                                created = {
                                                    productObjectId: savedProduct._id,
                                                    numericProductId: numericProductId,
                                                    eoiNo: assignment.eoiNo,
                                                    productStatus: eligibility.defaultProductStatus,
                                                };
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            _d.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _d.sent();
                            if (this.isDuplicateEoiError(error_1)) {
                                throw new common_1.ConflictException('Could not assign EOI number; retry');
                            }
                            throw error_1;
                        case 6: return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 7:
                            _d.sent();
                            return [4 /*yield*/, this.auditLogService.record({
                                    occurred_at: now,
                                    action: audit_actions_1.AUDIT_ACTION.ADMIN_ADD_PRODUCT_TO_URN,
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                                    action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
                                    entity_name: created.eoiNo,
                                    description: 'Admin added product to existing URN',
                                    performed_by: { user_id: adminUserId },
                                    new_values: {
                                        urnNo: trimmedUrn,
                                        productId: String(created.productObjectId),
                                        eoiNo: created.eoiNo,
                                        categoryId: urnCategoryId,
                                        productStatus: created.productStatus,
                                        manufacturerId: manufacturerId,
                                        adminUserId: adminUserId,
                                    },
                                    http_method: 'POST',
                                    route: "/api/admin/products/urn/".concat(trimmedUrn, "/add-product"),
                                    status_code: 201,
                                })];
                        case 8:
                            _d.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    productId: String(created.productObjectId),
                                    eoiNo: created.eoiNo,
                                    productStatus: created.productStatus,
                                    categoryId: urnCategoryId,
                                    categoryName: bundle.categoryName,
                                    urnStatus: urnStatusBefore,
                                    message: 'Product added to URN.',
                                }];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.hasCertificationFeeForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.db
                                .collection('payment_details')
                                .countDocuments({ urnNo: urnNo, paymentType: 'certification' })];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.loadUrnBundle = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var siblings, existingEoiCount, first, categoryId, manufacturerId, vendorId, urnStatus, _a, category, manufacturer, categoryName, manufacturerName;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .find(__assign({ urnNo: urnNo }, (0, active_product_filter_1.matchActiveProducts)()))
                                .sort({ createdDate: 1, productId: 1 })
                                .lean()
                                .exec()];
                        case 1:
                            siblings = _f.sent();
                            if (!siblings.length) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(urnNo));
                            }
                            return [4 /*yield*/, this.productModel
                                    .countDocuments({ urnNo: urnNo })
                                    .exec()];
                        case 2:
                            existingEoiCount = _f.sent();
                            first = siblings[0];
                            categoryId = first.categoryId;
                            manufacturerId = first.manufacturerId;
                            vendorId = first.vendorId;
                            urnStatus = Number((_b = first.urnStatus) !== null && _b !== void 0 ? _b : 0);
                            return [4 /*yield*/, Promise.all([
                                    this.categoryModel.findById(categoryId).lean().exec(),
                                    this.manufacturerModel.findById(manufacturerId).lean().exec(),
                                ])];
                        case 3:
                            _a = _f.sent(), category = _a[0], manufacturer = _a[1];
                            categoryName = (_d = (_c = category === null || category === void 0 ? void 0 : category.categoryName) !== null && _c !== void 0 ? _c : category === null || category === void 0 ? void 0 : category.category_name) !== null && _d !== void 0 ? _d : null;
                            manufacturerName = (_e = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _e !== void 0 ? _e : null;
                            return [2 /*return*/, {
                                    siblings: siblings,
                                    existingEoiCount: existingEoiCount,
                                    categoryId: categoryId,
                                    categoryName: categoryName,
                                    manufacturerId: manufacturerId,
                                    manufacturerName: manufacturerName,
                                    vendorId: vendorId,
                                    urnStatus: urnStatus,
                                }];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.loadSuggestedPlants = function (productObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                var plants;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productPlantModel
                                .find((0, active_product_filter_1.matchActiveProductPlants)({ productId: productObjectId }))
                                .select('plantName plantLocation countryId stateId city')
                                .limit(5)
                                .lean()
                                .exec()];
                        case 1:
                            plants = _a.sent();
                            return [2 /*return*/, plants.map(function (plant) { return ({
                                    plantName: plant.plantName,
                                    plantLocation: plant.plantLocation,
                                    countryId: String(plant.countryId),
                                    stateId: String(plant.stateId),
                                    city: plant.city,
                                }); })];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.createPlantsForProduct = function (productObjectId, eoiNo, urnNo, bundle, plants, now, session) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, plants_1, plantDto, productPlantId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, plants_1 = plants;
                            _a.label = 1;
                        case 1:
                            if (!(_i < plants_1.length)) return [3 /*break*/, 7];
                            plantDto = plants_1[_i];
                            return [4 /*yield*/, this.validateCountry(plantDto.countryId)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.validateState(plantDto.stateId, plantDto.countryId)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductPlantId()];
                        case 4:
                            productPlantId = _a.sent();
                            return [4 /*yield*/, this.productPlantModel.create([
                                    {
                                        productPlantId: productPlantId,
                                        productId: productObjectId,
                                        vendorId: bundle.vendorId,
                                        categoryId: bundle.categoryId,
                                        manufacturerId: bundle.manufacturerId,
                                        countryId: new mongoose_1.Types.ObjectId(plantDto.countryId),
                                        stateId: new mongoose_1.Types.ObjectId(plantDto.stateId),
                                        urnNo: urnNo,
                                        eoiNo: eoiNo,
                                        plantName: plantDto.plantName.trim(),
                                        plantLocation: plantDto.plantLocation.trim(),
                                        city: plantDto.city.trim(),
                                        plantStatus: 1,
                                        createdDate: now,
                                    },
                                ], { session: session })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.validateCountry = function (countryId) {
            return __awaiter(this, void 0, void 0, function () {
                var country;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.countriesService.findById(countryId)];
                        case 1:
                            country = _a.sent();
                            if (!country) {
                                throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.validateState = function (stateId, countryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, validate_state_country_util_1.assertStateBelongsToCountry)(this.statesService, this.countriesService, stateId, countryId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.runInTransaction = function (operation) {
            return __awaiter(this, void 0, void 0, function () {
                var session, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _a.sent();
                            session.startTransaction();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, 7, 8]);
                            return [4 /*yield*/, operation(session)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 5:
                            error_2 = _a.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 6:
                            _a.sent();
                            throw error_2;
                        case 7:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AdminAddProductToUrnService_1.prototype.isDuplicateEoiError = function (error) {
            var code = error === null || error === void 0 ? void 0 : error.code;
            return code === 11000;
        };
        return AdminAddProductToUrnService_1;
    }());
    __setFunctionName(_classThis, "AdminAddProductToUrnService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminAddProductToUrnService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminAddProductToUrnService = _classThis;
}();
exports.AdminAddProductToUrnService = AdminAddProductToUrnService;
