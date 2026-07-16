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
exports.PaymentsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var platform_rbac_scope_util_1 = require("../common/utils/platform-rbac-scope.util");
var vendor_proposal_approval_dto_1 = require("./dto/vendor-proposal-approval.dto");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var PaymentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Payments'), (0, common_1.Controller)('payments'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPayments_decorators;
    var _createPayment_decorators;
    var _getPaymentByUrn_decorators;
    var _setVendorProposalApproval_decorators;
    var _updatePayment_decorators;
    var PaymentsController = _classThis = /** @class */ (function () {
        function PaymentsController_1(paymentsService) {
            this.paymentsService = (__runInitializers(this, _instanceExtraInitializers), paymentsService);
        }
        PaymentsController_1.prototype.getPayments = function (user, listPaymentsDto) {
            return __awaiter(this, void 0, void 0, function () {
                var result_1, vendorId, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            if (!(0, platform_rbac_scope_util_1.isPlatformPortalJwtUser)(user)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.paymentsService.getAdminPayments(listPaymentsDto)];
                        case 1:
                            result_1 = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Payments retrieved successfully',
                                    data: result_1.data,
                                    pagination: result_1.pagination,
                                    meta: result_1.meta,
                                    totalCount: result_1.pagination.totalCount,
                                    page: result_1.pagination.page,
                                    limit: result_1.pagination.limit,
                                    totalPages: result_1.pagination.totalPages,
                                }];
                        case 2:
                            vendorId = (user === null || user === void 0 ? void 0 : user.manufacturerId) || (user === null || user === void 0 ? void 0 : user.vendorId);
                            if (!vendorId) {
                                throw new common_1.BadRequestException('Vendor organization ID not found in token');
                            }
                            return [4 /*yield*/, this.paymentsService.getPayments(listPaymentsDto, vendorId)];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Payments retrieved successfully',
                                    data: result.data,
                                    pagination: result.pagination,
                                    meta: result.meta,
                                    totalCount: result.pagination.totalCount,
                                    page: result.pagination.page,
                                    limit: result.pagination.limit,
                                    totalPages: result.pagination.totalPages,
                                }];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Controller error:', error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsController_1.prototype.createPayment = function (user, body, proposalFile) {
            return __awaiter(this, void 0, void 0, function () {
                var actorId, createPaymentDto, payment, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            actorId = (user === null || user === void 0 ? void 0 : user.manufacturerId) || (user === null || user === void 0 ? void 0 : user.vendorId) || (user === null || user === void 0 ? void 0 : user.userId) || (user === null || user === void 0 ? void 0 : user.id);
                            if (!actorId) {
                                throw new common_1.BadRequestException('Actor ID not found in token');
                            }
                            createPaymentDto = {
                                urnNo: body.urnNo,
                                quoteAmount: parseFloat(body.quoteAmount),
                                quoteGstAmount: parseFloat(body.quoteGstAmount),
                                quoteTdsAmount: parseFloat(body.quoteTdsAmount),
                                quoteTotal: parseFloat(body.quoteTotal),
                                adminGstNo: body.adminGstNo,
                                vendorGstNo: body.vendorGstNo,
                                paymentType: body.paymentType,
                                paymentMode: body.paymentMode,
                                onlinePaymentId: body.onlinePaymentId
                                    ? parseInt(body.onlinePaymentId)
                                    : undefined,
                                paymentReferenceNo: body.paymentReferenceNo,
                                paymentChequeDate: body.paymentChequeDate,
                                productsToBeCertified: body.productsToBeCertified,
                                renewalCycleId: body.renewalCycleId,
                            };
                            // Validate mandatory fields
                            if (!createPaymentDto.urnNo) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            if (createPaymentDto.quoteAmount === undefined ||
                                createPaymentDto.quoteAmount === null) {
                                throw new common_1.BadRequestException('Quote amount is required');
                            }
                            if (createPaymentDto.quoteGstAmount === undefined ||
                                createPaymentDto.quoteGstAmount === null) {
                                throw new common_1.BadRequestException('GST amount is required');
                            }
                            if (createPaymentDto.quoteTdsAmount === undefined ||
                                createPaymentDto.quoteTdsAmount === null) {
                                throw new common_1.BadRequestException('TDS amount is required');
                            }
                            if (createPaymentDto.quoteTotal === undefined ||
                                createPaymentDto.quoteTotal === null) {
                                throw new common_1.BadRequestException('Total amount is required');
                            }
                            return [4 /*yield*/, this.paymentsService.createPayment(createPaymentDto, actorId, proposalFile, String((user === null || user === void 0 ? void 0 : user.role) || (user === null || user === void 0 ? void 0 : user.type) || ''))];
                        case 1:
                            payment = _a.sent();
                            return [2 /*return*/, {
                                    status: 'success',
                                    message: 'Payment details created successfully',
                                    data: payment,
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
        PaymentsController_1.prototype.getPaymentByUrn = function (user, urnNoParam, paymentType, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = String(urnNoParam !== null && urnNoParam !== void 0 ? urnNoParam : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('Invalid urnNo');
                            }
                            vendorId = (user === null || user === void 0 ? void 0 : user.manufacturerId) || (user === null || user === void 0 ? void 0 : user.vendorId);
                            return [4 /*yield*/, this.paymentsService.getPaymentByUrn(urnNo, {
                                    vendorId: vendorId,
                                    actorRole: (user === null || user === void 0 ? void 0 : user.role) || (user === null || user === void 0 ? void 0 : user.type),
                                    paymentType: paymentType,
                                    renewalCycleId: renewalCycleId,
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Payment retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        PaymentsController_1.prototype.setVendorProposalApproval = function (user, urnNoParam, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var role, vendorId, urnNo, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            role = String((user === null || user === void 0 ? void 0 : user.role) || (user === null || user === void 0 ? void 0 : user.type) || '').toLowerCase();
                            if (role === 'admin' || role === 'staff') {
                                throw new common_1.ForbiddenException('This endpoint is for the vendor portal only. Sign in as the vendor for this URN, or use admin POST/PATCH /payments to upload or revise the proposal.');
                            }
                            vendorId = (user === null || user === void 0 ? void 0 : user.manufacturerId) || (user === null || user === void 0 ? void 0 : user.vendorId);
                            if (!vendorId) {
                                throw new common_1.BadRequestException('Vendor organization ID not found in token. Use a vendor or partner account.');
                            }
                            urnNo = String(urnNoParam !== null && urnNoParam !== void 0 ? urnNoParam : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.paymentsService.setVendorProposalApproval(urnNo, vendorId, dto, role)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Proposal approval updated',
                                    data: data,
                                }];
                    }
                });
            });
        };
        PaymentsController_1.prototype.updatePayment = function (user, urnNoParam, body, renewalCycleIdQuery, renewalCycleIdSnakeQuery, files) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, updatePaymentDto, chequeOrDdFile, tdsFile, proposalFile, vendorId, payment, message, error_3;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _j.trys.push([0, 2, , 3]);
                            urnNo = String(urnNoParam !== null && urnNoParam !== void 0 ? urnNoParam : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('Invalid urnNo');
                            }
                            updatePaymentDto = {
                                urnNo: body.urnNo,
                                quoteAmount: body.quoteAmount !== undefined
                                    ? parseFloat(body.quoteAmount)
                                    : undefined,
                                quoteGstAmount: body.quoteGstAmount !== undefined
                                    ? parseFloat(body.quoteGstAmount)
                                    : undefined,
                                quoteTdsAmount: body.quoteTdsAmount !== undefined
                                    ? parseFloat(body.quoteTdsAmount)
                                    : undefined,
                                quoteTotal: body.quoteTotal !== undefined
                                    ? parseFloat(body.quoteTotal)
                                    : undefined,
                                adminGstNo: body.adminGstNo,
                                vendorGstNo: body.vendorGstNo,
                                paymentType: body.paymentType,
                                paymentMode: body.paymentMode,
                                onlinePaymentId: body.onlinePaymentId !== undefined
                                    ? parseInt(body.onlinePaymentId, 10)
                                    : undefined,
                                paymentReferenceNo: body.paymentReferenceNo,
                                paymentChequeDate: body.paymentChequeDate,
                                productsToBeCertified: body.productsToBeCertified,
                                paymentStatus: body.paymentStatus !== undefined
                                    ? parseInt(body.paymentStatus, 10)
                                    : undefined,
                                paymentRejectionRemarks: body.paymentRejectionRemarks !== undefined &&
                                    body.paymentRejectionRemarks !== null
                                    ? String(body.paymentRejectionRemarks)
                                    : body.payment_rejection_remarks !== undefined &&
                                        body.payment_rejection_remarks !== null
                                        ? String(body.payment_rejection_remarks)
                                        : undefined,
                                urnStatus: body.urnStatus !== undefined
                                    ? parseInt(body.urnStatus, 10)
                                    : undefined,
                                renewalCycleId: (_c = (_b = (_a = body.renewalCycleId) !== null && _a !== void 0 ? _a : body.renewal_cycle_id) !== null && _b !== void 0 ? _b : renewalCycleIdQuery) !== null && _c !== void 0 ? _c : renewalCycleIdSnakeQuery,
                            };
                            chequeOrDdFile = (_d = files === null || files === void 0 ? void 0 : files.cheque_or_dd_file) === null || _d === void 0 ? void 0 : _d[0];
                            tdsFile = (_f = (_e = files === null || files === void 0 ? void 0 : files.tds_file) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : (_g = files === null || files === void 0 ? void 0 : files.supporting_document) === null || _g === void 0 ? void 0 : _g[0];
                            proposalFile = (_h = files === null || files === void 0 ? void 0 : files.proposal_file) === null || _h === void 0 ? void 0 : _h[0];
                            vendorId = (user === null || user === void 0 ? void 0 : user.manufacturerId) || (user === null || user === void 0 ? void 0 : user.vendorId);
                            return [4 /*yield*/, this.paymentsService.updatePaymentDetailsByUrn(urnNo, updatePaymentDto, vendorId, chequeOrDdFile, tdsFile, proposalFile, (user === null || user === void 0 ? void 0 : user.role) || (user === null || user === void 0 ? void 0 : user.type))];
                        case 1:
                            payment = _j.sent();
                            message = updatePaymentDto.paymentStatus === 3
                                ? 'Payment rejected'
                                : updatePaymentDto.paymentStatus === 2
                                    ? 'Payment approved'
                                    : 'Payment updated successfully';
                            return [2 /*return*/, {
                                    success: true,
                                    message: message,
                                    data: payment,
                                }];
                        case 2:
                            error_3 = _j.sent();
                            console.error('Controller error:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return PaymentsController_1;
    }());
    __setFunctionName(_classThis, "PaymentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPayments_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'Get payments for logged-in vendor or admin/staff',
                description: '**Vendor/partner:** paginated payments for the authenticated organization across every URN. ' +
                    '**Admin/staff:** same query params as GET /admin/payments/list (platform-wide; optional `manufacturerId` to scope one vendor). ' +
                    'Omit `status` to include all payment statuses.',
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
                description: 'Number of items per page (default: 10)',
                example: 10,
            }), (0, swagger_1.ApiQuery)({
                name: 'search',
                required: false,
                type: String,
                description: 'Global search term (searches in urn_no, payment_reference_no)',
                example: 'URN-20260303142815',
            }), (0, swagger_1.ApiQuery)({
                name: 'status',
                required: false,
                type: Number,
                description: 'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
                example: 0,
                enum: [0, 1, 2, 3],
            }), (0, swagger_1.ApiQuery)({
                name: 'paymentType',
                required: false,
                type: String,
                description: 'Filter by payment type',
                example: 'registration',
                enum: ['registration', 'certification', 'renew'],
            }), (0, swagger_1.ApiQuery)({
                name: 'sort',
                required: false,
                type: String,
                description: 'Sort: asc | desc, or field:asc | field:desc (e.g. createdAt:desc). Default: createdAt:desc.',
                example: 'createdAt:desc',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Payments retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    paymentId: { type: 'number' },
                                    urnNo: { type: 'string' },
                                    quoteAmount: { type: 'number' },
                                    quoteGstAmount: { type: 'number' },
                                    quoteTdsAmount: { type: 'number' },
                                    quoteTotal: { type: 'number' },
                                    proposalFile: { type: 'string' },
                                    adminGstNo: { type: 'string' },
                                    vendorGstNo: { type: 'string' },
                                    paymentType: { type: 'string' },
                                    paymentMode: { type: 'string' },
                                    paymentReferenceNo: { type: 'string' },
                                    paymentStatus: { type: 'number' },
                                    createdDate: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                totalCount: { type: 'number' },
                                totalPages: { type: 'number' },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Bad request - Invalid query parameters',
            })];
        _createPayment_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('proposal_file', (0, multer_universal_config_1.certificationMultipartMemoryMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Create payment details',
                description: 'Creates payment details with proposal document upload. Only PDF and Excel (.pdf, .xls, .xlsx) files are allowed.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: [
                        'urnNo',
                        'quoteAmount',
                        'quoteGstAmount',
                        'quoteTdsAmount',
                        'quoteTotal',
                    ],
                    properties: {
                        urnNo: {
                            type: 'string',
                            description: 'URN number',
                            example: 'URN-20260303142815',
                        },
                        quoteAmount: {
                            type: 'number',
                            description: 'Quote amount (mandatory)',
                            example: 10000.0,
                        },
                        quoteGstAmount: {
                            type: 'number',
                            description: 'GST amount (mandatory)',
                            example: 1800.0,
                        },
                        quoteTdsAmount: {
                            type: 'number',
                            description: 'TDS amount (mandatory)',
                            example: 1000,
                        },
                        quoteTotal: {
                            type: 'number',
                            description: 'Total amount (mandatory)',
                            example: 10800.0,
                        },
                        adminGstNo: {
                            type: 'string',
                            description: 'Admin GST number',
                            example: '29ABCDE1234F1Z5',
                        },
                        vendorGstNo: {
                            type: 'string',
                            description: 'Vendor GST number',
                            example: '27ABCDE1234F1Z5',
                        },
                        paymentType: {
                            type: 'string',
                            enum: ['registration', 'certification', 'renew'],
                            description: 'Payment type',
                            example: 'registration',
                        },
                        paymentMode: {
                            type: 'string',
                            enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
                            description: 'Payment mode',
                            example: 'online',
                        },
                        onlinePaymentId: {
                            type: 'number',
                            description: 'Online payment ID',
                            example: 0,
                        },
                        paymentReferenceNo: {
                            type: 'string',
                            description: 'Payment reference number',
                            example: 'REF123456',
                        },
                        paymentChequeDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Payment cheque date',
                            example: '2026-03-15',
                        },
                        productsToBeCertified: {
                            type: 'string',
                            description: 'Numeric productId values only — JSON array string, e.g. "[101,102]"',
                            example: '[101,102]',
                        },
                        proposal_file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Proposal document (PDF or Excel: .pdf, .xls, .xlsx)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Payment details created successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: {
                            type: 'string',
                            example: 'Payment details created successfully',
                        },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                paymentId: { type: 'number' },
                                urnNo: { type: 'string' },
                                quoteAmount: { type: 'number' },
                                quoteGstAmount: { type: 'number' },
                                quoteTdsAmount: { type: 'number' },
                                quoteTotal: { type: 'number' },
                                proposalFile: { type: 'string' },
                                paymentStatus: { type: 'number', example: 0 },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or file format' })];
        _getPaymentByUrn_decorators = [(0, common_1.Get)(':urnNo'), (0, swagger_1.ApiOperation)({
                summary: 'Get payment details by URN',
                description: 'Returns payment_details for the authenticated vendor or admin. ' +
                    'Includes submission status, TDS/supporting-document metadata, and reference-number uniqueness rule.',
            }), (0, swagger_1.ApiParam)({
                name: 'urnNo',
                description: 'URN number',
                example: 'URN-20260409142354',
                type: String,
            }), (0, swagger_1.ApiQuery)({
                name: 'paymentType',
                required: false,
                enum: ['registration', 'certification', 'renew'],
                description: 'Optional payment type filter',
            }), (0, swagger_1.ApiQuery)({
                name: 'renewalCycleId',
                required: false,
                description: 'Required when loading renew payments',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Payment retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Payment retrieved successfully' },
                        data: { type: 'object' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' })];
        _setVendorProposalApproval_decorators = [(0, common_1.Patch)(':urnNo/vendor-proposal-approval'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor approve or reject registration fee proposal (vendor portal only)',
                description: '**Vendor/partner login only** — not for admin or staff tokens. ' +
                    'Sets vendorProposalApprovalStatus to 1 (approve) or 2 (reject). ' +
                    'Admins manage proposals via POST/PATCH /payments with proposal_file.',
            }), (0, swagger_1.ApiParam)({
                name: 'urnNo',
                example: 'URN-20260514165917',
            }), (0, swagger_1.ApiBody)({ type: vendor_proposal_approval_dto_1.VendorProposalApprovalDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposal approval updated' })];
        _updatePayment_decorators = [(0, common_1.Patch)(':urnNo'), (0, swagger_1.ApiOperation)({
                summary: 'Update payment details by URN (and optionally update URN status + activity log)',
                description: 'Updates payment_details for the logged-in vendor. If `urnStatus` is provided in payload, it will also update `products.urnStatus` for that URN and insert an activity log entry.',
            }), (0, swagger_1.ApiParam)({
                name: 'urnNo',
                description: 'URN number',
                example: 'URN-20260409142354',
                type: String,
            }), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'cheque_or_dd_file', maxCount: 1 },
                { name: 'tds_file', maxCount: 1 },
                { name: 'supporting_document', maxCount: 1 },
                { name: 'proposal_file', maxCount: 1 },
            ], (0, multer_universal_config_1.certificationMultipartMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        urnNo: { type: 'string', example: 'URN-20260305124230' },
                        proposal_file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Admin only — revised proposal document (resets vendor approval to pending)',
                        },
                        quoteAmount: { type: 'number', example: 10000.0 },
                        quoteGstAmount: { type: 'number', example: 1800.0 },
                        quoteTdsAmount: { type: 'number', example: 1000.0 },
                        quoteTotal: { type: 'number', example: 10800.0 },
                        adminGstNo: { type: 'string', example: '29ABCDE1234F1Z9' },
                        vendorGstNo: { type: 'string', example: '27ABCDE1234F1Z9' },
                        paymentType: {
                            type: 'string',
                            enum: ['registration', 'certification', 'renew'],
                            example: 'registration',
                        },
                        paymentMode: {
                            type: 'string',
                            enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
                            example: 'cheque_or_dd',
                        },
                        onlinePaymentId: { type: 'number', example: 0 },
                        paymentReferenceNo: { type: 'string', example: 'REF123456' },
                        paymentChequeDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-03-06T00:00:00.000Z',
                        },
                        productsToBeCertified: { type: 'string', example: '[101,102]' },
                        paymentStatus: { type: 'number', enum: [0, 1, 2, 3], example: 0 },
                        paymentRejectionRemarks: {
                            type: 'string',
                            description: 'Required when admin sets paymentStatus to 3 (reject submitted payment)',
                            example: 'Cheque image is unclear. Please upload a readable copy.',
                            maxLength: 500,
                        },
                        urnStatus: {
                            type: 'number',
                            enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            example: 1,
                        },
                        cheque_or_dd_file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Required when paymentMode is cheque_or_dd',
                        },
                        tds_file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Required when paymentMode is cheque_or_dd',
                        },
                        supporting_document: {
                            type: 'string',
                            format: 'binary',
                            description: 'Supporting Document for vendor payment submission. Alias of tds_file for backward compatibility.',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Payment updated successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Payment updated successfully' },
                        data: { type: 'object' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid urnNo or payload' }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }), (0, swagger_1.ApiQuery)({
                name: 'renewalCycleId',
                required: false,
                description: 'Renew payment cycle scope (fallback when body omits renewalCycleId)',
            }), (0, swagger_1.ApiQuery)({
                name: 'renewal_cycle_id',
                required: false,
                description: 'Snake-case alias for renewalCycleId query param',
            })];
        __esDecorate(_classThis, null, _getPayments_decorators, { kind: "method", name: "getPayments", static: false, private: false, access: { has: function (obj) { return "getPayments" in obj; }, get: function (obj) { return obj.getPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPayment_decorators, { kind: "method", name: "createPayment", static: false, private: false, access: { has: function (obj) { return "createPayment" in obj; }, get: function (obj) { return obj.createPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPaymentByUrn_decorators, { kind: "method", name: "getPaymentByUrn", static: false, private: false, access: { has: function (obj) { return "getPaymentByUrn" in obj; }, get: function (obj) { return obj.getPaymentByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setVendorProposalApproval_decorators, { kind: "method", name: "setVendorProposalApproval", static: false, private: false, access: { has: function (obj) { return "setVendorProposalApproval" in obj; }, get: function (obj) { return obj.setVendorProposalApproval; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePayment_decorators, { kind: "method", name: "updatePayment", static: false, private: false, access: { has: function (obj) { return "updatePayment" in obj; }, get: function (obj) { return obj.updatePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsController = _classThis;
}();
exports.PaymentsController = PaymentsController;
