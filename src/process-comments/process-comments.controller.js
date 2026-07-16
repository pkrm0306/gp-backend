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
exports.ProcessCommentsController = void 0;
var common_1 = require("@nestjs/common");
var active_product_filter_1 = require("../product-registration/constants/active-product.filter");
var renewal_urn_status_constants_1 = require("../renew/constants/renewal-urn-status.constants");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var create_process_comments_dto_1 = require("./dto/create-process-comments.dto");
var process_comments_payload_util_1 = require("./helpers/process-comments-payload.util");
var process_comments_lock_util_1 = require("./helpers/process-comments-lock.util");
var ProcessCommentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Process Comments'), (0, common_1.Controller)('process-comments'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createOrUpdate_decorators;
    var _getByUrn_decorators;
    var ProcessCommentsController = _classThis = /** @class */ (function () {
        function ProcessCommentsController_1(processCommentsService, processRenewCommentsService, productModel) {
            this.processCommentsService = (__runInitializers(this, _instanceExtraInitializers), processCommentsService);
            this.processRenewCommentsService = processRenewCommentsService;
            this.productModel = productModel;
        }
        ProcessCommentsController_1.prototype.loadUrnProduct = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productModel
                            .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: urnNo.trim() }))
                            .select('urnNo urnStatus productRenewStatus productStatus vendorId')
                            .lean()
                            .exec()];
                });
            });
        };
        ProcessCommentsController_1.prototype.shouldUseRenewWorkflow = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.loadUrnProduct(urnNo)];
                        case 1:
                            product = _c.sent();
                            if (!product) {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, (0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
                                    urnStatus: Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0),
                                    productRenewStatus: Number((_b = product.productRenewStatus) !== null && _b !== void 0 ? _b : 0),
                                })];
                    }
                });
            });
        };
        ProcessCommentsController_1.prototype.createOrUpdate = function (user, createProcessCommentsDto) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, product, renew, data_1, _a, urnStatus, productStatus, blockReason, vendorId, data;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0:
                            urnNo = createProcessCommentsDto.urnNo.trim();
                            return [4 /*yield*/, this.loadUrnProduct(urnNo)];
                        case 1:
                            product = _m.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(urnNo));
                            }
                            renew = Boolean((_b = createProcessCommentsDto.renewalCycleId) === null || _b === void 0 ? void 0 : _b.trim()) ||
                                (0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
                                    urnStatus: Number((_c = product.urnStatus) !== null && _c !== void 0 ? _c : 0),
                                    productRenewStatus: Number((_d = product.productRenewStatus) !== null && _d !== void 0 ? _d : 0),
                                });
                            if (!renew) return [3 /*break*/, 6];
                            if (!((_e = createProcessCommentsDto.renewalCycleId) === null || _e === void 0 ? void 0 : _e.trim())) {
                                throw new common_1.BadRequestException('renewalCycleId is required for renewal process comments');
                            }
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.processRenewCommentsService.upsert(createProcessCommentsDto)];
                        case 2:
                            _a = _m.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.processRenewCommentsService.adminUpsert(createProcessCommentsDto)];
                        case 4:
                            _a = _m.sent();
                            _m.label = 5;
                        case 5:
                            data_1 = _a;
                            return [2 /*return*/, { success: true, data: (0, process_comments_payload_util_1.formatProcessCommentsForApi)((_g = (_f = data_1 === null || data_1 === void 0 ? void 0 : data_1.toObject) === null || _f === void 0 ? void 0 : _f.call(data_1)) !== null && _g !== void 0 ? _g : data_1) }];
                        case 6:
                            urnStatus = Number((_h = product.urnStatus) !== null && _h !== void 0 ? _h : 0);
                            productStatus = Number((_j = product.productStatus) !== null && _j !== void 0 ? _j : 0);
                            blockReason = (0, process_comments_lock_util_1.resolveProcessCommentsBlockReason)({
                                urnStatus: urnStatus,
                                productStatus: productStatus,
                            });
                            if (blockReason) {
                                throw new common_1.ForbiddenException(blockReason);
                            }
                            vendorId = String((_l = (_k = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _k !== void 0 ? _k : product.vendorId) !== null && _l !== void 0 ? _l : '').trim();
                            if (!vendorId) {
                                throw new common_1.BadRequestException('Vendor ID not found for this URN');
                            }
                            return [4 /*yield*/, this.processCommentsService.upsertProcessComments(createProcessCommentsDto, vendorId)];
                        case 7:
                            data = _m.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    canSaveProcessComments: (0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
                                        urnStatus: urnStatus,
                                        productStatus: productStatus,
                                    }),
                                    processCommentsBlockReason: null,
                                    data: (0, process_comments_payload_util_1.formatProcessCommentsForApi)(data.toObject()),
                                }];
                    }
                });
            });
        };
        ProcessCommentsController_1.prototype.getByUrn = function (user, urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var product, renew, data_2, vendorId, urnStatus, productStatus, data;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, this.loadUrnProduct(urnNo)];
                        case 1:
                            product = _l.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(urnNo));
                            }
                            renew = Boolean(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) ||
                                (0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
                                    urnStatus: Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0),
                                    productRenewStatus: Number((_b = product.productRenewStatus) !== null && _b !== void 0 ? _b : 0),
                                });
                            if (!renew) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.processRenewCommentsService.getByUrnAndCycle(urnNo, renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())];
                        case 2:
                            data_2 = _l.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    data: (0, process_comments_payload_util_1.formatProcessCommentsForApi)(((_d = (_c = data_2 === null || data_2 === void 0 ? void 0 : data_2.toObject) === null || _c === void 0 ? void 0 : _c.call(data_2)) !== null && _d !== void 0 ? _d : data_2)),
                                }];
                        case 3:
                            vendorId = String((_f = (_e = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _e !== void 0 ? _e : product.vendorId) !== null && _f !== void 0 ? _f : '').trim();
                            if (!vendorId) {
                                throw new common_1.BadRequestException('Vendor ID not found for this URN');
                            }
                            urnStatus = Number((_g = product.urnStatus) !== null && _g !== void 0 ? _g : 0);
                            productStatus = Number((_h = product.productStatus) !== null && _h !== void 0 ? _h : 0);
                            return [4 /*yield*/, this.processCommentsService.getByUrnAndVendor(urnNo, vendorId)];
                        case 4:
                            data = _l.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    canSaveProcessComments: (0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
                                        urnStatus: urnStatus,
                                        productStatus: productStatus,
                                    }),
                                    processCommentsBlockReason: (0, process_comments_lock_util_1.resolveProcessCommentsBlockReason)({
                                        urnStatus: urnStatus,
                                        productStatus: productStatus,
                                    }),
                                    data: (0, process_comments_payload_util_1.formatProcessCommentsForApi)(((_k = (_j = data === null || data === void 0 ? void 0 : data.toObject) === null || _j === void 0 ? void 0 : _j.call(data)) !== null && _k !== void 0 ? _k : data)),
                                }];
                    }
                });
            });
        };
        return ProcessCommentsController_1;
    }());
    __setFunctionName(_classThis, "ProcessCommentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createOrUpdate_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({
                summary: 'Create or update process comments',
                description: 'Creates or updates process comments for a specific URN and logged-in vendor. If a record exists for the given URN and vendor ID, it will be updated. Otherwise, a new record will be created. Only provided fields will be updated.',
            }), (0, swagger_1.ApiBody)({
                type: create_process_comments_dto_1.CreateProcessCommentsDto,
                description: 'Process comments data. Only urnNo is required. All other fields are optional.',
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Process comments created or updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data' }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _getByUrn_decorators = [(0, common_1.Get)(':urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Get process comments by URN',
                description: 'Retrieves process comments for a specific URN. Admin callers resolve vendor from the URN automatically.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn_no',
                description: 'URN number',
                example: 'URN-20260305124230',
                type: String,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Process comments retrieved successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Bad request - Vendor ID not found in token',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        __esDecorate(_classThis, null, _createOrUpdate_decorators, { kind: "method", name: "createOrUpdate", static: false, private: false, access: { has: function (obj) { return "createOrUpdate" in obj; }, get: function (obj) { return obj.createOrUpdate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByUrn_decorators, { kind: "method", name: "getByUrn", static: false, private: false, access: { has: function (obj) { return "getByUrn" in obj; }, get: function (obj) { return obj.getByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessCommentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessCommentsController = _classThis;
}();
exports.ProcessCommentsController = ProcessCommentsController;
