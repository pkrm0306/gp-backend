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
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var upload_file_util_1 = require("../utils/upload-file.util");
var payment_proposal_util_1 = require("./payment-proposal.util");
var payment_overdue_util_1 = require("./payment-overdue.util");
var payment_response_util_1 = require("./payment-response.util");
var document_version_helper_1 = require("../documents/helpers/document-version.helper");
var activity_lifecycle_constants_1 = require("../activity-log/activity-lifecycle.constants");
var active_product_filter_1 = require("../product-registration/constants/active-product.filter");
var parse_products_to_be_certified_util_1 = require("../product-registration/helpers/parse-products-to-be-certified.util");
var parse_payment_list_sort_util_1 = require("./utils/parse-payment-list-sort.util");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var renewal_urn_status_constants_1 = require("../renew/constants/renewal-urn-status.constants");
var renew_eligible_product_util_1 = require("../renew/helpers/renew-eligible-product.util");
var renew_cycle_scope_util_1 = require("../renew/helpers/renew-cycle-scope.util");
var renew_common_util_1 = require("../renew/helpers/renew-common.util");
var PAYMENT_REFERENCE_MAX_LENGTH = 50;
var PAYMENT_REFERENCE_ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
var PaymentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentsService = _classThis = /** @class */ (function () {
        function PaymentsService_1(paymentDetailsModel, productModel, manufacturerModel, renewalCycleModel, connection, sequenceHelper, activityLogService, productRegistrationWorkflowService, zohoDealsService, lifecycleNotification, certificationLifecycle, productSoftDeleteService, documentVersioningService, renewalOrchestration) {
            this.paymentDetailsModel = paymentDetailsModel;
            this.productModel = productModel;
            this.manufacturerModel = manufacturerModel;
            this.renewalCycleModel = renewalCycleModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.activityLogService = activityLogService;
            this.productRegistrationWorkflowService = productRegistrationWorkflowService;
            this.zohoDealsService = zohoDealsService;
            this.lifecycleNotification = lifecycleNotification;
            this.certificationLifecycle = certificationLifecycle;
            this.productSoftDeleteService = productSoftDeleteService;
            this.documentVersioningService = documentVersioningService;
            this.renewalOrchestration = renewalOrchestration;
        }
        PaymentsService_1.prototype.resolveZohoPaymentAmount = function (payment) {
            var _a, _b;
            return Number((_b = (_a = payment.quoteTotal) !== null && _a !== void 0 ? _a : payment.quoteAmount) !== null && _b !== void 0 ? _b : 0);
        };
        PaymentsService_1.prototype.syncPaymentToZohoDeal = function (payment, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.zohoDealsService.updateDealPaymentDetails({
                                manufacturerId: manufacturerId,
                                quoteNumber: payment.paymentId,
                                gstin: payment.vendorGstNo || payment.adminGstNo,
                                amount: this.resolveZohoPaymentAmount(payment),
                                transactionNumber: payment.paymentReferenceNo,
                                paymentMode: payment.paymentMode,
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Certification Flow Status Mapping (URN status -> activity label)
         */
        PaymentsService_1.prototype.getActivityName = function (urnStatus) {
            return (0, activity_lifecycle_constants_1.activityLifecycleName)(urnStatus);
        };
        /** Next timeline step id from the canonical activity lifecycle. */
        PaymentsService_1.prototype.getNextActivityIdForLog = function (currentStatus) {
            return (0, activity_lifecycle_constants_1.nextActivityLifecycleStatus)(currentStatus);
        };
        /** Responsibility owner by status for activity timeline rows. */
        PaymentsService_1.prototype.getResponsibilityForStatus = function (status) {
            return (0, activity_lifecycle_constants_1.activityLifecycleResponsibility)(status);
        };
        /** Accepts case-insensitive textual payment types and normalizes for DB enum. */
        PaymentsService_1.prototype.normalizePaymentType = function (value) {
            var raw = String(value !== null && value !== void 0 ? value : 'registration')
                .trim()
                .toLowerCase();
            if (raw === 'registration' || raw === 'register')
                return 'registration';
            if (raw === 'certification' || raw === 'certificate')
                return 'certification';
            if (raw === 'renew' || raw === 'renewal')
                return 'renew';
            throw new common_1.BadRequestException('Invalid paymentType. Allowed values: registration, certification, renew');
        };
        /** Canonical URN form used by this service (trim + remove trailing slashes). */
        PaymentsService_1.prototype.normalizeUrnNo = function (value) {
            return String(value !== null && value !== void 0 ? value : '')
                .trim()
                .replace(/\/+$/g, '');
        };
        PaymentsService_1.prototype.isAdminPortalRole = function (role) {
            return role === 'admin' || role === 'staff';
        };
        PaymentsService_1.prototype.isVendorPortalRole = function (role) {
            return role === 'vendor' || role === 'partner';
        };
        PaymentsService_1.prototype.idsEqual = function (a, b) {
            if (a == null || b == null) {
                return false;
            }
            return String(a) === String(b);
        };
        /**
         * Vendor org for a URN comes from active products (not the admin user who created the payment).
         */
        PaymentsService_1.prototype.resolveUrnOwnerVendorObjectId = function (urnNo, session) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, query, product, ownerId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            urnOptions = this.urnCandidates(urnNo);
                            query = this.productModel
                                .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: { $in: urnOptions } }))
                                .select('vendorId manufacturerId')
                                .sort({ createdDate: 1 });
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.lean().exec()];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No products found for URN: ".concat(urnNo));
                            }
                            ownerId = (_a = product.vendorId) !== null && _a !== void 0 ? _a : product.manufacturerId;
                            if (!ownerId) {
                                throw new common_1.NotFoundException("URN ".concat(urnNo, " has no vendor organization on file"));
                            }
                            return [2 /*return*/, ownerId instanceof mongoose_1.Types.ObjectId
                                    ? ownerId
                                    : this.toObjectId(String(ownerId), 'vendorId')];
                    }
                });
            });
        };
        /** Resolve an active URN product row for either vendorId or manufacturerId org id. */
        PaymentsService_1.prototype.findUrnProductForOrg = function (urnNo, orgObjectId, select) {
            if (select === void 0) { select = 'manufacturerId vendorId urnStatus productName'; }
            var urnOptions = this.urnCandidates(urnNo);
            return this.productModel
                .findOne((0, active_product_filter_1.matchActiveProducts)({
                urnNo: { $in: urnOptions },
                $or: [{ vendorId: orgObjectId }, { manufacturerId: orgObjectId }],
            }))
                .select(select)
                .lean()
                .exec();
        };
        PaymentsService_1.prototype.assertCallerOwnsUrn = function (urnNo, callerVendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, callerObjectId, product, ownerVendorId, ownerManufacturerId, ownsUrn;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnOptions = this.urnCandidates(urnNo);
                            callerObjectId = this.toObjectId(callerVendorId, 'vendorId');
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: { $in: urnOptions } }))
                                    .select('manufacturerId vendorId urnStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _c.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No products found for URN: ".concat(urnNo));
                            }
                            ownerVendorId = (_a = product.vendorId) !== null && _a !== void 0 ? _a : product.manufacturerId;
                            ownerManufacturerId = (_b = product.manufacturerId) !== null && _b !== void 0 ? _b : product.vendorId;
                            ownsUrn = this.idsEqual(ownerVendorId, callerObjectId) ||
                                this.idsEqual(ownerManufacturerId, callerObjectId);
                            if (!ownsUrn) {
                                throw new common_1.ForbiddenException('You do not have access to this URN');
                            }
                            return [2 /*return*/, {
                                    vendorObjectId: callerObjectId,
                                    product: {
                                        manufacturerId: product.manufacturerId,
                                        vendorId: product.vendorId,
                                        urnStatus: product.urnStatus,
                                    },
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.paymentToPlain = function (payment) {
            return (typeof payment
                .toObject === 'function'
                ? payment.toObject()
                : __assign({}, payment));
        };
        PaymentsService_1.prototype.resolveTdsFileMetadataForPayment = function (payment) {
            return __awaiter(this, void 0, void 0, function () {
                var tdsFile, latest, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tdsFile = String((_b = payment.tdsFile) !== null && _b !== void 0 ? _b : '').trim();
                            if (!tdsFile) {
                                return [2 /*return*/, null];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.documentVersioningService.getLatestDocumentMetadata({
                                    urnNo: payment.urnNo,
                                    processType: (0, document_version_helper_1.paymentTypeToProcessType)(payment.paymentType),
                                    renewalCycleId: payment.renewalCycleId
                                        ? String(payment.renewalCycleId)
                                        : null,
                                    sectionKey: 'payment',
                                    subsectionKey: (0, document_version_helper_1.paymentStreamSubsectionKey)(payment.paymentType),
                                    slotKey: 'tdsFile',
                                })];
                        case 2:
                            latest = _c.sent();
                            return [2 /*return*/, (0, payment_response_util_1.buildTdsFileMetadata)(tdsFile, {
                                    originalName: latest.latestVersion.originalName,
                                    storedName: latest.latestVersion.storedName,
                                    mimeType: latest.latestVersion.mimeType,
                                    sizeBytes: latest.latestVersion.sizeBytes,
                                    filePath: latest.latestVersion.filePath,
                                })];
                        case 3:
                            _a = _c.sent();
                            return [2 /*return*/, (0, payment_response_util_1.buildTdsFileMetadata)(tdsFile)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.formatPaymentForApi = function (payment) {
            return __awaiter(this, void 0, void 0, function () {
                var plain, tdsFileMetadata;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            plain = typeof payment.toObject === 'function'
                                ? this.paymentToPlain(payment)
                                : __assign({}, payment);
                            return [4 /*yield*/, this.resolveTdsFileMetadataForPayment({
                                    urnNo: String((_a = plain.urnNo) !== null && _a !== void 0 ? _a : ''),
                                    paymentType: String((_b = plain.paymentType) !== null && _b !== void 0 ? _b : 'registration'),
                                    renewalCycleId: plain.renewalCycleId,
                                    tdsFile: String((_d = (_c = plain.tdsFile) !== null && _c !== void 0 ? _c : plain.tds_file) !== null && _d !== void 0 ? _d : ''),
                                })];
                        case 1:
                            tdsFileMetadata = _e.sent();
                            return [2 /*return*/, (0, payment_response_util_1.enrichPaymentByUrnResponse)(plain, {
                                    tdsFileMetadata: tdsFileMetadata,
                                    referenceNumberMustBeUnique: true,
                                })];
                    }
                });
            });
        };
        PaymentsService_1.prototype.findPaymentRecordForUrn = function (normalizedUrn, options) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, paymentTypeHint, paymentQuery, renewCycleIdHint, cycle, existingPayment;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            urnOptions = this.urnCandidates(normalizedUrn);
                            paymentTypeHint = (options === null || options === void 0 ? void 0 : options.paymentType) !== undefined
                                ? this.normalizePaymentType(options.paymentType)
                                : undefined;
                            paymentQuery = {
                                urnNo: { $in: urnOptions },
                            };
                            if (paymentTypeHint) {
                                paymentQuery.paymentType = paymentTypeHint;
                            }
                            renewCycleIdHint = String((_a = options === null || options === void 0 ? void 0 : options.renewalCycleId) !== null && _a !== void 0 ? _a : '').trim();
                            if (!(paymentTypeHint === 'renew' || renewCycleIdHint)) return [3 /*break*/, 2];
                            if (!renewCycleIdHint) {
                                throw new common_1.BadRequestException('renewalCycleId is required when loading renew payments');
                            }
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(renewCycleIdHint)
                                    .session((_b = options === null || options === void 0 ? void 0 : options.session) !== null && _b !== void 0 ? _b : null)
                                    .exec()];
                        case 1:
                            cycle = _f.sent();
                            if (!cycle || cycle.urnNo !== normalizedUrn) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, this.paymentDetailsModel
                                    .findOne((0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)(normalizedUrn, cycle))
                                    .session((_c = options === null || options === void 0 ? void 0 : options.session) !== null && _c !== void 0 ? _c : null)
                                    .exec()];
                        case 2: return [4 /*yield*/, this.paymentDetailsModel
                                .findOne(paymentQuery)
                                .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
                                .session((_d = options === null || options === void 0 ? void 0 : options.session) !== null && _d !== void 0 ? _d : null)
                                .exec()];
                        case 3:
                            existingPayment = _f.sent();
                            if (!(!existingPayment && paymentTypeHint)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findOne({ urnNo: { $in: urnOptions } })
                                    .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
                                    .session((_e = options === null || options === void 0 ? void 0 : options.session) !== null && _e !== void 0 ? _e : null)
                                    .exec()];
                        case 4:
                            existingPayment = _f.sent();
                            if ((existingPayment === null || existingPayment === void 0 ? void 0 : existingPayment.paymentType) === 'renew' && !renewCycleIdHint) {
                                throw new common_1.BadRequestException('renewalCycleId is required when loading renew payments');
                            }
                            _f.label = 5;
                        case 5: return [2 /*return*/, existingPayment];
                    }
                });
            });
        };
        PaymentsService_1.prototype.findPaymentForVendorUrn = function (urnNo, vendorObjectId, paymentType, session) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, vendorIdString, query;
                return __generator(this, function (_a) {
                    urnOptions = this.urnCandidates(urnNo);
                    vendorIdString = vendorObjectId.toString();
                    query = this.paymentDetailsModel
                        .findOne({
                        urnNo: { $in: urnOptions },
                        paymentType: paymentType,
                        $or: [
                            { vendorId: vendorObjectId },
                            { $expr: { $eq: [{ $toString: '$vendorId' }, vendorIdString] } },
                        ],
                    })
                        .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 });
                    if (session) {
                        query.session(session);
                    }
                    return [2 /*return*/, query.exec()];
                });
            });
        };
        PaymentsService_1.prototype.isVendorPaymentProofPayload = function (dto, chequeOrDdFile, tdsFile) {
            return (dto.paymentMode !== undefined ||
                dto.paymentReferenceNo !== undefined ||
                dto.paymentChequeDate !== undefined ||
                !!chequeOrDdFile ||
                !!tdsFile);
        };
        PaymentsService_1.prototype.validateSupportingDocumentForPaymentSubmission = function (params) {
            var _a;
            if (!this.isVendorPortalRole(params.actorRole)) {
                return;
            }
            var submittingPayment = params.vendorProofUpdate || params.dto.paymentStatus === 1;
            if (!submittingPayment) {
                return;
            }
            var existingSupportingDocument = String((_a = params.existingPayment.tdsFile) !== null && _a !== void 0 ? _a : '').trim();
            if (!this.hasUploadedFile(params.tdsFile) && !existingSupportingDocument) {
                throw new common_1.BadRequestException('Supporting Document is required.');
            }
        };
        PaymentsService_1.prototype.hasUploadedFile = function (file) {
            var _a, _b, _c, _d;
            return Boolean(file &&
                (String((_a = file.originalname) !== null && _a !== void 0 ? _a : '').trim() ||
                    ((_b = file.size) !== null && _b !== void 0 ? _b : 0) > 0 ||
                    ((_d = (_c = file.buffer) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0));
        };
        PaymentsService_1.prototype.normalizePaymentReferenceNo = function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }
            var reference = String(value).trim();
            if (!reference) {
                return undefined;
            }
            if (reference.length > PAYMENT_REFERENCE_MAX_LENGTH) {
                throw new common_1.BadRequestException("Transaction Reference Number must not exceed ".concat(PAYMENT_REFERENCE_MAX_LENGTH, " characters"));
            }
            if (!PAYMENT_REFERENCE_ALPHANUMERIC.test(reference)) {
                throw new common_1.BadRequestException('Transaction Reference Number must be alphanumeric');
            }
            return reference;
        };
        PaymentsService_1.prototype.assertPaymentReferenceNoUnique = function (paymentReferenceNo, excludePaymentId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var escaped, filter, query, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            escaped = paymentReferenceNo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            filter = {
                                paymentReferenceNo: { $regex: "^".concat(escaped, "$"), $options: 'i' },
                            };
                            if (excludePaymentId) {
                                filter._id = { $ne: excludePaymentId };
                            }
                            query = this.paymentDetailsModel.findOne(filter).select('_id').lean();
                            if (session) {
                                query = query.session(session);
                            }
                            return [4 /*yield*/, query.exec()];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException(payment_response_util_1.PAYMENT_REFERENCE_UNIQUE_MESSAGE);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.validateVendorPaymentProofMutationAllowed = function (params) {
            var _a;
            var currentStatus = Number((_a = params.existingPayment.paymentStatus) !== null && _a !== void 0 ? _a : 0);
            var requestedStatus = params.updatePaymentDto.paymentStatus;
            var isSubmittingPayment = params.vendorProofUpdate || requestedStatus === 1;
            var isRevertingToDraft = requestedStatus === 0 && currentStatus >= 1;
            if (isRevertingToDraft &&
                currentStatus !== 3) {
                throw new common_1.BadRequestException(payment_response_util_1.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE);
            }
            if (!isSubmittingPayment && requestedStatus === undefined) {
                return;
            }
            if (currentStatus === 1 && isSubmittingPayment) {
                throw new common_1.BadRequestException(payment_response_util_1.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE);
            }
            if (currentStatus === 2 && (isSubmittingPayment || params.vendorProofUpdate)) {
                throw new common_1.BadRequestException(payment_response_util_1.PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE);
            }
            if (currentStatus === 0 &&
                isSubmittingPayment &&
                !(0, payment_response_util_1.isVendorPaymentProofEditable)(params.existingPayment)) {
                throw new common_1.BadRequestException('Approve the proposal before submitting payment details');
            }
        };
        PaymentsService_1.prototype.clearVendorPaymentProofFields = function (updateData) {
            updateData.paymentMode = null;
            updateData.paymentReferenceNo = null;
            updateData.paymentChequeDate = null;
            updateData.tdsFile = null;
            updateData.chequeOrDdFile = null;
        };
        PaymentsService_1.prototype.isAdminQuoteFieldsUpdate = function (dto) {
            return (dto.quoteAmount !== undefined ||
                dto.quoteGstAmount !== undefined ||
                dto.quoteTdsAmount !== undefined ||
                dto.quoteTotal !== undefined ||
                dto.adminGstNo !== undefined ||
                dto.vendorGstNo !== undefined);
        };
        PaymentsService_1.prototype.logTimelineEntry = function (vendorId_1, manufacturerId_1, urnNo_1, entry_1) {
            return __awaiter(this, arguments, void 0, function (vendorId, manufacturerId, urnNo, entry, urnStatusFallback) {
                var activitiesId, activityStatus, err_1;
                var _a, _b;
                if (urnStatusFallback === void 0) { urnStatusFallback = 0; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            activitiesId = (_a = entry.activities_id) !== null && _a !== void 0 ? _a : urnStatusFallback;
                            activityStatus = (_b = entry.activity_status) !== null && _b !== void 0 ? _b : activitiesId;
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: vendorId,
                                    manufacturer_id: manufacturerId,
                                    urn_no: urnNo,
                                    activities_id: activitiesId,
                                    activity: entry.activity,
                                    activity_status: activityStatus,
                                    responsibility: entry.responsibility,
                                    next_responsibility: entry.next_responsibility,
                                    next_activity: entry.next_activity,
                                    next_acitivities_id: this.getNextActivityIdForLog(activitiesId),
                                    status: 0,
                                })];
                        case 1:
                            _c.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _c.sent();
                            console.error('[Payment] Timeline activity log failed:', err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.logAdminPaymentRejected = function (vendorId, manufacturerId, urnNo, paymentType, paymentRejectionRemarks, urnStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var isCertification, activityLabel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isCertification = paymentType === 'certification';
                            activityLabel = isCertification
                                ? 'Approve/Reject Certification Fee'
                                : 'Approve/Reject Registration Fee';
                            return [4 /*yield*/, this.logTimelineEntry(vendorId, manufacturerId, urnNo, {
                                    activity: activityLabel,
                                    responsibility: 'Admin',
                                    next_activity: isCertification
                                        ? 'Certification Fee Payment'
                                        : 'Approve/Reject Registration Fee Proposal and make payment',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 1:
                            _a.sent();
                            console.info('[Payment] admin_payment_rejected', {
                                urnNo: urnNo,
                                paymentType: paymentType,
                                paymentStatus: 3,
                                paymentRejectionRemarks: paymentRejectionRemarks,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.applyPaymentStatusUpdate = function (updateData, updatePaymentDto, existingPayment, actorRole) {
            var _a, _b;
            if (updatePaymentDto.paymentStatus === undefined) {
                return { adminRejectedPayment: false, adminApprovedPayment: false };
            }
            var newStatus = updatePaymentDto.paymentStatus;
            var currentStatus = Number((_a = existingPayment.paymentStatus) !== null && _a !== void 0 ? _a : 0);
            if (newStatus === 3) {
                if (!this.isAdminPortalRole(actorRole)) {
                    throw new common_1.ForbiddenException('Only admin portal users can reject a submitted payment');
                }
                if (currentStatus !== 1) {
                    throw new common_1.BadRequestException('Payment can only be rejected when it is pending admin review (paymentStatus 1)');
                }
                var remarks = String((_b = updatePaymentDto.paymentRejectionRemarks) !== null && _b !== void 0 ? _b : '').trim();
                if (!remarks) {
                    throw new common_1.BadRequestException('paymentRejectionRemarks is required when rejecting payment (paymentStatus 3)');
                }
                if (remarks.length > 500) {
                    throw new common_1.BadRequestException('paymentRejectionRemarks must not exceed 500 characters');
                }
                updateData.paymentStatus = 3;
                updateData.paymentRejectionRemarks = remarks;
                return {
                    adminRejectedPayment: true,
                    adminApprovedPayment: false,
                    paymentRejectionRemarks: remarks,
                };
            }
            if (newStatus === 2) {
                if (!this.isAdminPortalRole(actorRole)) {
                    throw new common_1.ForbiddenException('Only admin portal users can approve a submitted payment');
                }
                updateData.paymentStatus = 2;
                updateData.paymentRejectionRemarks = undefined;
                return { adminRejectedPayment: false, adminApprovedPayment: true };
            }
            updateData.paymentStatus = newStatus;
            return { adminRejectedPayment: false, adminApprovedPayment: false };
        };
        /** Query both canonical and legacy trailing-slash URN formats. */
        PaymentsService_1.prototype.urnCandidates = function (urnNo) {
            var normalized = this.normalizeUrnNo(urnNo);
            if (!normalized)
                return [];
            return [normalized, "".concat(normalized, "/")];
        };
        /** Expand distinct product URNs to include legacy trailing-slash variants. */
        PaymentsService_1.prototype.expandUrnListForQuery = function (urnNos) {
            var set = new Set();
            for (var _i = 0, urnNos_1 = urnNos; _i < urnNos_1.length; _i++) {
                var raw = urnNos_1[_i];
                for (var _a = 0, _b = this.urnCandidates(String(raw !== null && raw !== void 0 ? raw : '')); _a < _b.length; _a++) {
                    var candidate = _b[_a];
                    if (candidate)
                        set.add(candidate);
                }
            }
            return __spreadArray([], set, true);
        };
        /**
         * All organization ids linked to this vendor login (closure over products).
         * Connects manufacturerId / vendorId pairs used inconsistently across URNs.
         */
        PaymentsService_1.prototype.resolveVendorOrganizationIds = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var primary, idSet, round, oids, products, expanded, _i, products_1, product, _a, _b, raw, s;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            primary = this.toObjectId(vendorId, 'vendorId');
                            idSet = new Set([primary.toString()]);
                            round = 0;
                            _c.label = 1;
                        case 1:
                            if (!(round < 8)) return [3 /*break*/, 4];
                            oids = __spreadArray([], idSet, true).map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            return [4 /*yield*/, this.productModel
                                    .find({
                                    $or: [{ vendorId: { $in: oids } }, { manufacturerId: { $in: oids } }],
                                })
                                    .select('vendorId manufacturerId')
                                    .lean()
                                    .exec()];
                        case 2:
                            products = _c.sent();
                            expanded = false;
                            for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                                product = products_1[_i];
                                for (_a = 0, _b = [product.vendorId, product.manufacturerId]; _a < _b.length; _a++) {
                                    raw = _b[_a];
                                    if (raw == null)
                                        continue;
                                    s = String(raw).trim();
                                    if (mongoose_1.Types.ObjectId.isValid(s) && !idSet.has(s)) {
                                        idSet.add(s);
                                        expanded = true;
                                    }
                                }
                            }
                            if (!expanded) {
                                return [3 /*break*/, 4];
                            }
                            _c.label = 3;
                        case 3:
                            round += 1;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, __spreadArray([], idSet, true).map(function (id) { return new mongoose_1.Types.ObjectId(id); })];
                    }
                });
            });
        };
        /** Every URN that belongs to the vendor org (all registrations, not a single URN). */
        PaymentsService_1.prototype.resolveAllVendorUrns = function (organizationIds) {
            return __awaiter(this, void 0, void 0, function () {
                var orgFilter, orgIdStrings, _a, productUrns, paymentUrns;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (organizationIds.length === 0) {
                                return [2 /*return*/, []];
                            }
                            orgFilter = {
                                $or: [
                                    { vendorId: { $in: organizationIds } },
                                    { manufacturerId: { $in: organizationIds } },
                                ],
                            };
                            orgIdStrings = organizationIds.map(function (id) { return id.toString(); });
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.distinct('urnNo', orgFilter).exec(),
                                    this.paymentDetailsModel
                                        .distinct('urnNo', {
                                        $or: [
                                            { vendorId: { $in: organizationIds } },
                                            {
                                                $expr: {
                                                    $in: [{ $toString: '$vendorId' }, orgIdStrings],
                                                },
                                            },
                                        ],
                                    })
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), productUrns = _a[0], paymentUrns = _a[1];
                            return [2 /*return*/, this.expandUrnListForQuery(__spreadArray(__spreadArray([], (productUrns !== null && productUrns !== void 0 ? productUrns : []), true), (paymentUrns !== null && paymentUrns !== void 0 ? paymentUrns : []), true).map(function (u) {
                                    return String(u !== null && u !== void 0 ? u : '');
                                }))];
                    }
                });
            });
        };
        /**
         * Vendor payment list: all rows on any owned URN (registration + certification + renew).
         * URN is authoritative — payment.vendorId may differ from the JWT manufacturerId.
         */
        PaymentsService_1.prototype.buildVendorPaymentsListMatch = function (organizationIds, urnNos) {
            if (urnNos.length > 0) {
                return { urnNo: { $in: urnNos } };
            }
            var orgIdStrings = organizationIds.map(function (id) { return id.toString(); });
            return {
                $or: [
                    { vendorId: { $in: organizationIds } },
                    {
                        $expr: {
                            $in: [{ $toString: '$vendorId' }, orgIdStrings],
                        },
                    },
                ],
            };
        };
        /** Certification payments must store numeric `productId` values only (JSON array string). */
        PaymentsService_1.prototype.validateCertificationProductsField = function (raw, options) {
            if (options === void 0) { options = {}; }
            var trimmed = String(raw !== null && raw !== void 0 ? raw : '').trim();
            if (!trimmed) {
                if (options.required) {
                    var message_1 = (0, parse_products_to_be_certified_util_1.getProductsToBeCertifiedValidationError)('');
                    if (message_1) {
                        throw new common_1.BadRequestException(message_1);
                    }
                }
                return;
            }
            var message = (0, parse_products_to_be_certified_util_1.getProductsToBeCertifiedValidationError)(trimmed);
            if (message) {
                throw new common_1.BadRequestException(message);
            }
        };
        /** Persist certification selection as JSON numeric productId array, e.g. `"[101,102]"`. */
        PaymentsService_1.prototype.normalizeCertificationProductsField = function (raw) {
            try {
                return (0, parse_products_to_be_certified_util_1.normalizeProductsToBeCertifiedStorage)(raw);
            }
            catch (error) {
                throw new common_1.BadRequestException(error.message);
            }
        };
        /**
         * Timeline row when payment_details is created (does not by itself change products.urnStatus).
         */
        /** Same lifecycle row shape as `ProductRegistrationService` when URN status advances via payment update. */
        PaymentsService_1.prototype.tryLogUrnLifecycleAfterPayment = function (vendorId, manufacturerIdStr, urnNo, newUrnStatus, previousUrnStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.productRegistrationWorkflowService.syncToUrnStatus({
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerIdStr,
                                    urnNo: urnNo,
                                }, previousUrnStatus, newUrnStatus)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            console.error('[Payment] Activity log (URN status via payment) failed:', err_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.tryLogPaymentCreated = function (vendorId_1, vendorObjectId_1, urnNo_1, paymentType_1) {
            return __awaiter(this, arguments, void 0, function (vendorId, vendorObjectId, urnNo, paymentType, hasProposalFile) {
                var urnOptions, product, urnStatus, manufacturerId, label, err_3;
                if (hasProposalFile === void 0) { hasProposalFile = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!urnNo)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            urnOptions = this.urnCandidates(urnNo);
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    vendorId: vendorObjectId,
                                })
                                    .select('manufacturerId urnStatus')
                                    .lean()
                                    .exec()];
                        case 2:
                            product = _a.sent();
                            if (!product)
                                return [2 /*return*/];
                            urnStatus = typeof product.urnStatus === 'number' ? product.urnStatus : 0;
                            manufacturerId = product.manufacturerId.toString();
                            if (!(hasProposalFile && paymentType === 'registration')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.logTimelineEntry(vendorId, manufacturerId, urnNo, {
                                    activity: 'Assign Registration Fee',
                                    responsibility: 'Admin',
                                    next_activity: 'Approve/Reject Registration Fee Proposal and make payment',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                        case 4:
                            label = paymentType === 'certification'
                                ? 'Assign Certification Fee'
                                : 'Assign Registration Fee';
                            return [4 /*yield*/, this.logTimelineEntry(vendorId, manufacturerId, urnNo, {
                                    activity: label,
                                    responsibility: 'Admin',
                                    next_activity: paymentType === 'certification'
                                        ? 'Certification Fee Payment'
                                        : 'Approve/Reject Registration Fee Proposal and make payment',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            err_3 = _a.sent();
                            console.error('[Payment] Activity log (payment created) failed:', err_3);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.tryNotifyUrnRegistrationApproved = function (urnNo, vendorObjectId, previousUrnStatus) {
            var _this = this;
            if (previousUrnStatus >= 2) {
                return;
            }
            this.findUrnProductForOrg(urnNo, vendorObjectId, 'manufacturerId productName')
                .then(function (product) { return __awaiter(_this, void 0, void 0, function () {
                var manufacturer;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!(product === null || product === void 0 ? void 0 : product.manufacturerId))
                                return [2 /*return*/];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(product.manufacturerId)
                                    .select('manufacturerName vendor_name vendor_email')
                                    .lean()
                                    .exec()];
                        case 1:
                            manufacturer = _e.sent();
                            return [2 /*return*/, this.lifecycleNotification.notifyUrnInitialApproved({
                                    manufacturerId: product.manufacturerId.toString(),
                                    urnNo: urnNo,
                                    productName: String((_a = product.productName) !== null && _a !== void 0 ? _a : urnNo),
                                    vendorEmail: String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_email) !== null && _b !== void 0 ? _b : '').trim() || undefined,
                                    manufacturerName: String((_c = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _c !== void 0 ? _c : '').trim() ||
                                        String((_d = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _d !== void 0 ? _d : '').trim() ||
                                        undefined,
                                })];
                    }
                });
            }); })
                .catch(function (err) {
                return console.warn('[Payment] URN registration approved notification failed:', err === null || err === void 0 ? void 0 : err.message);
            });
        };
        PaymentsService_1.prototype.tryNotifyPaymentProposalReady = function (urnNo, vendorObjectId, paymentId, paymentType, quoteTotal) {
            var _this = this;
            this.findUrnProductForOrg(urnNo, vendorObjectId, 'manufacturerId')
                .then(function (product) { return __awaiter(_this, void 0, void 0, function () {
                var manufacturer;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(product === null || product === void 0 ? void 0 : product.manufacturerId)) {
                                console.warn("[Payment] Proposal ready notification skipped \u2014 no product for ".concat(urnNo));
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(product.manufacturerId)
                                    .select('manufacturerName vendor_name vendor_email')
                                    .lean()
                                    .exec()];
                        case 1:
                            manufacturer = _d.sent();
                            console.log("[Payment] Registration fee proposal notification for ".concat(urnNo, " (paymentId=").concat(paymentId, ")"));
                            return [2 /*return*/, this.lifecycleNotification.notifyPaymentProposalReady({
                                    manufacturerId: product.manufacturerId.toString(),
                                    urnNo: urnNo,
                                    paymentId: paymentId,
                                    paymentType: paymentType,
                                    quoteTotal: quoteTotal,
                                    vendorEmail: String((_a = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_email) !== null && _a !== void 0 ? _a : '').trim() || undefined,
                                    manufacturerName: String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _b !== void 0 ? _b : '').trim() ||
                                        String((_c = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _c !== void 0 ? _c : '').trim() ||
                                        undefined,
                                })];
                    }
                });
            }); })
                .catch(function (err) {
                return console.warn('[Payment] Proposal ready notification failed:', err === null || err === void 0 ? void 0 : err.message);
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        PaymentsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        /**
         * Create payment details
         */
        PaymentsService_1.prototype.createPayment = function (createPaymentDto, vendorId, proposalFile, actorRole) {
            return __awaiter(this, void 0, void 0, function () {
                var maxRetries, retryCount, _loop_1, this_1, state_1;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            maxRetries = 3;
                            retryCount = 0;
                            _loop_1 = function () {
                                var session, normalizedUrnNo, urnOwnerObjectId, callerObjectId, vendorObjectId, urnProductBeforePayment, previousUrnStatus, paymentId, now, proposalFilePath, normalizedPaymentType, renewalCycleObjectId, cycleIdRaw, opened, cycle, existingForCycle, productsToBeCertified, selectedProductIds_1, rejectedProductIds, resequenceApplied, updatedSequenceCount, parsed, urnProducts, urnProductIds_1, mismatches, unselected, manufacturerIds, _i, manufacturerIds_1, manufacturerId, _g, normalizedPaymentReferenceNo, paymentData, payment, savedPayment, response, error_1, errorMessage;
                                return __generator(this, function (_h) {
                                    switch (_h.label) {
                                        case 0: return [4 /*yield*/, this_1.connection.startSession()];
                                        case 1:
                                            session = _h.sent();
                                            session.startTransaction();
                                            _h.label = 2;
                                        case 2:
                                            _h.trys.push([2, 30, , 35]);
                                            normalizedUrnNo = this_1.normalizeUrnNo(createPaymentDto.urnNo);
                                            if (!normalizedUrnNo) {
                                                throw new common_1.BadRequestException('URN number is required');
                                            }
                                            return [4 /*yield*/, this_1.resolveUrnOwnerVendorObjectId(normalizedUrnNo, session)];
                                        case 3:
                                            urnOwnerObjectId = _h.sent();
                                            callerObjectId = this_1.toObjectId(vendorId, 'vendorId');
                                            if (this_1.isVendorPortalRole(actorRole) &&
                                                !this_1.idsEqual(urnOwnerObjectId, callerObjectId)) {
                                                throw new common_1.ForbiddenException('You can only create payments for your own URN registrations');
                                            }
                                            vendorObjectId = urnOwnerObjectId;
                                            return [4 /*yield*/, this_1.findUrnProductForOrg(normalizedUrnNo, vendorObjectId, 'urnStatus')];
                                        case 4:
                                            urnProductBeforePayment = _h.sent();
                                            previousUrnStatus = Number((_a = urnProductBeforePayment === null || urnProductBeforePayment === void 0 ? void 0 : urnProductBeforePayment.urnStatus) !== null && _a !== void 0 ? _a : 0);
                                            return [4 /*yield*/, this_1.sequenceHelper.getPaymentId()];
                                        case 5:
                                            paymentId = _h.sent();
                                            console.log("[Payment Creation] Generated paymentId: ".concat(paymentId, " (attempt ").concat(retryCount + 1, ")"));
                                            now = new Date();
                                            proposalFilePath = void 0;
                                            if (!proposalFile) return [3 /*break*/, 7];
                                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(proposalFile, 'payments')];
                                        case 6:
                                            proposalFilePath = (_h.sent())
                                                .fileUrl;
                                            _h.label = 7;
                                        case 7:
                                            normalizedPaymentType = this_1.normalizePaymentType(createPaymentDto.paymentType);
                                            renewalCycleObjectId = void 0;
                                            if (!(normalizedPaymentType === 'renew')) return [3 /*break*/, 12];
                                            cycleIdRaw = String((_b = createPaymentDto.renewalCycleId) !== null && _b !== void 0 ? _b : '').trim();
                                            if (!!cycleIdRaw) return [3 /*break*/, 9];
                                            if (!this_1.renewalOrchestration) {
                                                throw new common_1.BadRequestException('renewalCycleId is required when paymentType is renew');
                                            }
                                            return [4 /*yield*/, this_1.renewalOrchestration.resolveInProgressRenewalCycleForPayment(normalizedUrnNo, String(vendorObjectId), session)];
                                        case 8:
                                            opened = _h.sent();
                                            cycleIdRaw = String(opened._id);
                                            _h.label = 9;
                                        case 9: return [4 /*yield*/, (0, renew_cycle_scope_util_1.assertRenewCycleAcceptsPayment)(this_1.renewalCycleModel, normalizedUrnNo, cycleIdRaw)];
                                        case 10:
                                            cycle = _h.sent();
                                            renewalCycleObjectId = (0, renew_common_util_1.toRenewObjectId)(String(cycle._id), 'renewalCycleId');
                                            return [4 /*yield*/, this_1.paymentDetailsModel
                                                    .findOne((0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)(normalizedUrnNo, cycle))
                                                    .session(session)
                                                    .exec()];
                                        case 11:
                                            existingForCycle = _h.sent();
                                            if (existingForCycle) {
                                                throw new common_1.BadRequestException("A renew payment already exists for renewal cycle ".concat(cycle.cycleNo));
                                            }
                                            _h.label = 12;
                                        case 12:
                                            productsToBeCertified = void 0;
                                            if (normalizedPaymentType === 'certification') {
                                                if (!String((_c = createPaymentDto.productsToBeCertified) !== null && _c !== void 0 ? _c : '').trim()) {
                                                    throw new common_1.BadRequestException((0, parse_products_to_be_certified_util_1.getProductsToBeCertifiedValidationError)(''));
                                                }
                                                productsToBeCertified = this_1.normalizeCertificationProductsField(createPaymentDto.productsToBeCertified);
                                            }
                                            else if (createPaymentDto.productsToBeCertified !== undefined) {
                                                productsToBeCertified = createPaymentDto.productsToBeCertified;
                                            }
                                            selectedProductIds_1 = [];
                                            rejectedProductIds = [];
                                            resequenceApplied = false;
                                            updatedSequenceCount = 0;
                                            if (!(normalizedPaymentType === 'certification')) return [3 /*break*/, 19];
                                            parsed = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)(productsToBeCertified);
                                            selectedProductIds_1 = __spreadArray([], new Set(parsed.productIds), true);
                                            if (selectedProductIds_1.length === 0) {
                                                throw new common_1.BadRequestException('productsToBeCertified must contain at least one numeric productId');
                                            }
                                            return [4 /*yield*/, this_1.productModel
                                                    .find((0, active_product_filter_1.matchActiveProducts)({
                                                    urnNo: normalizedUrnNo,
                                                    vendorId: vendorObjectId,
                                                }), {
                                                    _id: 1,
                                                    productId: 1,
                                                    manufacturerId: 1,
                                                    productStatus: 1,
                                                })
                                                    .session(session)
                                                    .exec()];
                                        case 13:
                                            urnProducts = _h.sent();
                                            if (!urnProducts.length) {
                                                throw new common_1.NotFoundException("No active products found for URN ".concat(normalizedUrnNo));
                                            }
                                            urnProductIds_1 = new Set(urnProducts
                                                .map(function (p) { return Number(p.productId); })
                                                .filter(function (id) { return Number.isFinite(id); }));
                                            mismatches = selectedProductIds_1.filter(function (id) { return !urnProductIds_1.has(id); });
                                            if (mismatches.length > 0) {
                                                throw new common_1.BadRequestException("productsToBeCertified includes productId(s) not under URN ".concat(normalizedUrnNo, ": ").concat(mismatches.join(', ')));
                                            }
                                            unselected = urnProducts.filter(function (p) {
                                                var _a;
                                                var pid = Number(p.productId);
                                                if (!Number.isFinite(pid))
                                                    return false;
                                                return (!selectedProductIds_1.includes(pid) &&
                                                    [0, 1, 2].includes(Number((_a = p.productStatus) !== null && _a !== void 0 ? _a : 0)));
                                            });
                                            rejectedProductIds = unselected
                                                .map(function (p) { return Number(p.productId); })
                                                .filter(function (id) { return Number.isFinite(id); });
                                            if (!(unselected.length > 0)) return [3 /*break*/, 19];
                                            return [4 /*yield*/, this_1.productModel
                                                    .updateMany({
                                                    _id: { $in: unselected.map(function (p) { return p._id; }) },
                                                }, {
                                                    $set: {
                                                        productStatus: 3,
                                                        rejectedDetails: 'Auto-rejected: not selected for certification fee',
                                                        rejectedAt: now,
                                                        updatedDate: now,
                                                    },
                                                }, { session: session })
                                                    .exec()];
                                        case 14:
                                            _h.sent();
                                            manufacturerIds = __spreadArray([], new Set(urnProducts
                                                .map(function (p) { var _a; return String((_a = p.manufacturerId) !== null && _a !== void 0 ? _a : '').trim(); })
                                                .filter(Boolean)), true);
                                            _i = 0, manufacturerIds_1 = manufacturerIds;
                                            _h.label = 15;
                                        case 15:
                                            if (!(_i < manufacturerIds_1.length)) return [3 /*break*/, 18];
                                            manufacturerId = manufacturerIds_1[_i];
                                            _g = updatedSequenceCount;
                                            return [4 /*yield*/, this_1.productSoftDeleteService.resequenceForManufacturerInSession(manufacturerId, session)];
                                        case 16:
                                            updatedSequenceCount = _g + _h.sent();
                                            _h.label = 17;
                                        case 17:
                                            _i++;
                                            return [3 /*break*/, 15];
                                        case 18:
                                            resequenceApplied = updatedSequenceCount > 0;
                                            _h.label = 19;
                                        case 19:
                                            normalizedPaymentReferenceNo = this_1.normalizePaymentReferenceNo(createPaymentDto.paymentReferenceNo);
                                            if (!normalizedPaymentReferenceNo) return [3 /*break*/, 21];
                                            return [4 /*yield*/, this_1.assertPaymentReferenceNoUnique(normalizedPaymentReferenceNo, undefined, session)];
                                        case 20:
                                            _h.sent();
                                            _h.label = 21;
                                        case 21:
                                            paymentData = __assign(__assign({ paymentId: paymentId, urnNo: normalizedUrnNo, vendorId: vendorObjectId, quoteAmount: createPaymentDto.quoteAmount, quoteGstAmount: createPaymentDto.quoteGstAmount, quoteTdsAmount: createPaymentDto.quoteTdsAmount, quoteTotal: createPaymentDto.quoteTotal, proposalFile: proposalFilePath, adminGstNo: createPaymentDto.adminGstNo, vendorGstNo: createPaymentDto.vendorGstNo, paymentType: normalizedPaymentType }, (renewalCycleObjectId
                                                ? { renewalCycleId: renewalCycleObjectId }
                                                : {})), { paymentMode: createPaymentDto.paymentMode, onlinePaymentId: createPaymentDto.onlinePaymentId || 0, paymentReferenceNo: normalizedPaymentReferenceNo, paymentChequeDate: createPaymentDto.paymentChequeDate
                                                    ? new Date(createPaymentDto.paymentChequeDate)
                                                    : undefined, productsToBeCertified: productsToBeCertified, paymentStatus: 0, vendorProposalApprovalStatus: 0, proposalRejectionRemarks: undefined, createdDate: now, updatedDate: now });
                                            payment = new this_1.paymentDetailsModel(paymentData);
                                            return [4 /*yield*/, payment.save({ session: session })];
                                        case 22:
                                            savedPayment = _h.sent();
                                            if (!(normalizedPaymentType === 'renew' && renewalCycleObjectId)) return [3 /*break*/, 24];
                                            return [4 /*yield*/, this_1.renewalCycleModel.updateOne({ _id: renewalCycleObjectId }, {
                                                    $set: {
                                                        paymentId: savedPayment.paymentId,
                                                        updatedAt: now,
                                                    },
                                                }, { session: session })];
                                        case 23:
                                            _h.sent();
                                            _h.label = 24;
                                        case 24:
                                            if (!proposalFilePath) return [3 /*break*/, 26];
                                            return [4 /*yield*/, (0, product_document_version_integration_1.trackPaymentFileChange)(this_1.documentVersioningService, __assign(__assign({ urnNo: normalizedUrnNo, paymentId: savedPayment._id, field: 'proposalFile', userId: vendorObjectId, filePath: proposalFilePath, file: proposalFile, action: 'added', paymentType: normalizedPaymentType }, (normalizedPaymentType === 'renew' && renewalCycleObjectId
                                                    ? { renewalCycleId: renewalCycleObjectId }
                                                    : {})), { session: session }))];
                                        case 25:
                                            _h.sent();
                                            _h.label = 26;
                                        case 26: return [4 /*yield*/, session.commitTransaction()];
                                        case 27:
                                            _h.sent();
                                            session.endSession();
                                            return [4 /*yield*/, this_1.tryLogPaymentCreated(vendorId, vendorObjectId, normalizedUrnNo, normalizedPaymentType, Boolean(proposalFilePath))];
                                        case 28:
                                            _h.sent();
                                            if (proposalFilePath &&
                                                (normalizedPaymentType === 'registration' ||
                                                    normalizedPaymentType === 'certification')) {
                                                this_1.tryNotifyPaymentProposalReady(normalizedUrnNo, vendorObjectId, savedPayment.paymentId, normalizedPaymentType, savedPayment.quoteTotal);
                                                if (normalizedPaymentType === 'registration') {
                                                    this_1.tryNotifyUrnRegistrationApproved(normalizedUrnNo, vendorObjectId, previousUrnStatus);
                                                }
                                            }
                                            return [4 /*yield*/, this_1.formatPaymentForApi(savedPayment)];
                                        case 29:
                                            response = _h.sent();
                                            if (normalizedPaymentType === 'certification') {
                                                return [2 /*return*/, { value: __assign(__assign({}, response), { selectedProductIds: selectedProductIds_1, rejectedProductIds: rejectedProductIds, resequenceApplied: resequenceApplied, updatedSequenceCount: updatedSequenceCount }) }];
                                            }
                                            return [2 /*return*/, { value: response }];
                                        case 30:
                                            error_1 = _h.sent();
                                            return [4 /*yield*/, session.abortTransaction()];
                                        case 31:
                                            _h.sent();
                                            session.endSession();
                                            // For validation errors, throw immediately
                                            if (error_1 instanceof common_1.NotFoundException ||
                                                error_1 instanceof common_1.BadRequestException ||
                                                error_1 instanceof common_1.ForbiddenException) {
                                                console.error('Validation error:', error_1.message);
                                                throw error_1;
                                            }
                                            if (!(error_1.code === 11000 ||
                                                (error_1.name === 'MongoServerError' &&
                                                    ((_d = error_1.message) === null || _d === void 0 ? void 0 : _d.includes('duplicate'))))) return [3 /*break*/, 34];
                                            retryCount++;
                                            console.error("[Payment Creation] Duplicate paymentId error detected. Error code: ".concat(error_1.code, ", Message: ").concat(error_1.message));
                                            if (!(retryCount < maxRetries)) return [3 /*break*/, 33];
                                            console.warn("[Payment Creation] Retrying payment creation. Attempt ".concat(retryCount + 1, "/").concat(maxRetries, "..."));
                                            // Wait a bit before retry (exponential backoff)
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    return setTimeout(resolve, 200 * retryCount);
                                                })];
                                        case 32:
                                            // Wait a bit before retry (exponential backoff)
                                            _h.sent();
                                            return [2 /*return*/, "continue"];
                                        case 33:
                                            console.error("[Payment Creation] Failed after ".concat(maxRetries, " attempts due to duplicate paymentId"));
                                            throw new common_1.InternalServerErrorException('Failed to create payment after multiple attempts due to duplicate paymentId. Please try again.');
                                        case 34:
                                            // Log the actual error for debugging
                                            console.error('Payment creation error:', error_1);
                                            console.error('Error name:', error_1.name);
                                            console.error('Error message:', error_1.message);
                                            console.error('Error code:', error_1.code);
                                            console.error('Error stack:', error_1.stack);
                                            // Check for specific error types
                                            if (error_1.name === 'CastError' ||
                                                ((_e = error_1.message) === null || _e === void 0 ? void 0 : _e.includes('Cast to ObjectId'))) {
                                                throw new common_1.BadRequestException("Invalid ID format provided: ".concat(error_1.message));
                                            }
                                            errorMessage = error_1.message || 'Failed to create payment';
                                            throw new common_1.InternalServerErrorException("".concat(errorMessage, ". Check server logs for details."));
                                        case 35: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _f.label = 1;
                        case 1:
                            if (!(retryCount < maxRetries)) return [3 /*break*/, 3];
                            return [5 /*yield**/, _loop_1()];
                        case 2:
                            state_1 = _f.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            return [3 /*break*/, 1];
                        case 3: 
                        // Should never reach here, but just in case
                        throw new common_1.InternalServerErrorException('Failed to create payment after all retry attempts.');
                    }
                });
            });
        };
        /**
         * Get payment details for a URN (vendor/admin payment form load).
         */
        PaymentsService_1.prototype.getPaymentByUrn = function (urnNo, options) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedUrn, payment, callerObjectId, urnOwnerObjectId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedUrn = this.normalizeUrnNo(urnNo);
                            if (!normalizedUrn) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.findPaymentRecordForUrn(normalizedUrn, {
                                    paymentType: options === null || options === void 0 ? void 0 : options.paymentType,
                                    renewalCycleId: options === null || options === void 0 ? void 0 : options.renewalCycleId,
                                })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            if (!((options === null || options === void 0 ? void 0 : options.vendorId) && this.isVendorPortalRole(options.actorRole))) return [3 /*break*/, 3];
                            callerObjectId = this.toObjectId(options.vendorId, 'vendorId');
                            return [4 /*yield*/, this.resolveUrnOwnerVendorObjectId(normalizedUrn)];
                        case 2:
                            urnOwnerObjectId = _a.sent();
                            if (!this.idsEqual(urnOwnerObjectId, callerObjectId) &&
                                !this.idsEqual(payment.vendorId, callerObjectId)) {
                                throw new common_1.ForbiddenException('You do not have access to this URN payment');
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/, this.formatPaymentForApi(payment)];
                    }
                });
            });
        };
        /**
         * Update payment details. If urnStatus is provided, also updates products.urnStatus for that URN
         * and creates an activity log entry.
         */
        PaymentsService_1.prototype.updatePaymentDetailsByUrn = function (urnNo, updatePaymentDto, vendorId, chequeOrDdFile, tdsFile, proposalFile, actorRole) {
            return __awaiter(this, void 0, void 0, function () {
                var session, normalizedUrn_1, urnOptions, paymentTypeHint, renewCycleIdHint, existingPayment, urnOwnerObjectId, callerObjectId, effectiveVendorObjectId, effectiveVendorId, paymentPlain, currentApproval, paymentType, now, updateData, trackedProposalPath, trackedProposalAction, trackedChequePath, trackedChequeAction, trackedTdsPath, trackedTdsAction, previousProposal, newProposalPath, vendorProofUpdate, normalizedPaymentReferenceNo, previousCheque, _a, previousTds, _b, paymentStatusUpdate, certificationProductsRequired, certificationProductsRaw, updatedPayment, resolvedPaymentType, trackRenewalCycleId, deferredUrnLog, urnNoToUse, urnStatusProductFilter, anyProduct, productsRaw, previousPaymentStatus, newPaymentStatus, renewPaymentSubmitted, renewUrnFilter, anyProduct, urnStatus, previousUrnStatus, anyProduct, urnStatus, certificationSubmitted, anyProduct, urnStatus, anyProduct, urnStatus, isCertification, anyProduct, urnStatus, error_2;
                var _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _l.sent();
                            session.startTransaction();
                            _l.label = 2;
                        case 2:
                            _l.trys.push([2, 53, , 55]);
                            normalizedUrn_1 = this.normalizeUrnNo(urnNo);
                            if (!normalizedUrn_1) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            if (updatePaymentDto.urnNo !== undefined &&
                                this.normalizeUrnNo(updatePaymentDto.urnNo) !== normalizedUrn_1) {
                                throw new common_1.BadRequestException('Body urnNo must match path urnNo when both are provided');
                            }
                            urnOptions = this.urnCandidates(normalizedUrn_1);
                            paymentTypeHint = updatePaymentDto.paymentType !== undefined
                                ? this.normalizePaymentType(updatePaymentDto.paymentType)
                                : undefined;
                            renewCycleIdHint = String((_c = updatePaymentDto.renewalCycleId) !== null && _c !== void 0 ? _c : '').trim();
                            return [4 /*yield*/, this.findPaymentRecordForUrn(normalizedUrn_1, {
                                    paymentType: paymentTypeHint,
                                    renewalCycleId: renewCycleIdHint || undefined,
                                    session: session,
                                })];
                        case 3:
                            existingPayment = _l.sent();
                            if (!existingPayment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            return [4 /*yield*/, this.resolveUrnOwnerVendorObjectId(normalizedUrn_1, session)];
                        case 4:
                            urnOwnerObjectId = _l.sent();
                            if (vendorId && this.isVendorPortalRole(actorRole)) {
                                callerObjectId = this.toObjectId(vendorId, 'vendorId');
                                if (!this.idsEqual(urnOwnerObjectId, callerObjectId) &&
                                    !this.idsEqual(existingPayment.vendorId, callerObjectId)) {
                                    throw new common_1.ForbiddenException('You do not have access to this URN payment');
                                }
                            }
                            if (!!this.idsEqual(existingPayment.vendorId, urnOwnerObjectId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findByIdAndUpdate(existingPayment._id, { $set: { vendorId: urnOwnerObjectId, updatedDate: new Date() } }, { new: true, session: session })
                                    .exec()];
                        case 5:
                            existingPayment = _l.sent();
                            if (!existingPayment) {
                                throw new common_1.NotFoundException('Payment not found after vendor sync');
                            }
                            _l.label = 6;
                        case 6:
                            effectiveVendorObjectId = urnOwnerObjectId;
                            effectiveVendorId = effectiveVendorObjectId.toString();
                            paymentPlain = this.paymentToPlain(existingPayment);
                            currentApproval = (0, payment_proposal_util_1.resolveVendorProposalApprovalStatus)(paymentPlain);
                            paymentType = updatePaymentDto.paymentType !== undefined
                                ? this.normalizePaymentType(updatePaymentDto.paymentType)
                                : existingPayment.paymentType;
                            now = new Date();
                            updateData = { updatedDate: now };
                            if (renewCycleIdHint && paymentType === 'renew') {
                                updateData.renewalCycleId = (0, renew_common_util_1.toRenewObjectId)(renewCycleIdHint, 'renewalCycleId');
                            }
                            trackedProposalPath = void 0;
                            trackedProposalAction = 'added';
                            trackedChequePath = void 0;
                            trackedChequeAction = 'added';
                            trackedTdsPath = void 0;
                            trackedTdsAction = 'added';
                            if (!proposalFile) return [3 /*break*/, 8];
                            if (!this.isAdminPortalRole(actorRole)) {
                                throw new common_1.ForbiddenException('Only admin portal users can upload a proposal document');
                            }
                            previousProposal = existingPayment.proposalFile;
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(proposalFile, 'payments')];
                        case 7:
                            newProposalPath = (_l.sent())
                                .fileUrl;
                            if (currentApproval === 2 &&
                                this.isAdminQuoteFieldsUpdate(updatePaymentDto) &&
                                !proposalFile) {
                                throw new common_1.BadRequestException('Vendor rejected the proposal document. Upload a revised proposal file before updating amounts.');
                            }
                            if (currentApproval === 2) {
                                updateData.previousProposalFile = previousProposal;
                                updateData.proposalRejectionRemarks = undefined;
                                updateData.vendorProposalApprovalStatus = 0;
                                updateData.paymentStatus = 0;
                                this.clearVendorPaymentProofFields(updateData);
                            }
                            else if (currentApproval === 1) {
                                updateData.previousProposalFile = previousProposal;
                                updateData.vendorProposalApprovalStatus = 0;
                                this.clearVendorPaymentProofFields(updateData);
                            }
                            else {
                                updateData.vendorProposalApprovalStatus = 0;
                                this.clearVendorPaymentProofFields(updateData);
                            }
                            updateData.proposalFile = newProposalPath;
                            trackedProposalPath = newProposalPath;
                            trackedProposalAction = previousProposal ? 'replaced' : 'added';
                            return [3 /*break*/, 9];
                        case 8:
                            if (currentApproval === 2 &&
                                this.isAdminQuoteFieldsUpdate(updatePaymentDto)) {
                                throw new common_1.BadRequestException('Vendor rejected the proposal document. Upload a revised proposal file before updating amounts.');
                            }
                            _l.label = 9;
                        case 9:
                            vendorProofUpdate = this.isVendorPaymentProofPayload(updatePaymentDto, chequeOrDdFile, tdsFile);
                            if (vendorProofUpdate &&
                                paymentType === 'registration' &&
                                currentApproval !== 1) {
                                throw new common_1.BadRequestException('Approve the proposal before submitting payment details');
                            }
                            this.validateSupportingDocumentForPaymentSubmission({
                                dto: updatePaymentDto,
                                existingPayment: existingPayment,
                                tdsFile: tdsFile,
                                actorRole: actorRole,
                                vendorProofUpdate: vendorProofUpdate,
                            });
                            if (this.isVendorPortalRole(actorRole)) {
                                this.validateVendorPaymentProofMutationAllowed({
                                    existingPayment: existingPayment,
                                    updatePaymentDto: updatePaymentDto,
                                    vendorProofUpdate: vendorProofUpdate,
                                });
                            }
                            if (updatePaymentDto.paymentMode === 'cheque_or_dd' &&
                                (!chequeOrDdFile || !tdsFile)) {
                                throw new common_1.BadRequestException('For paymentMode=cheque_or_dd, both cheque_or_dd_file and tds_file are required');
                            }
                            if (updatePaymentDto.quoteAmount !== undefined)
                                updateData.quoteAmount = updatePaymentDto.quoteAmount;
                            if (updatePaymentDto.quoteGstAmount !== undefined)
                                updateData.quoteGstAmount = updatePaymentDto.quoteGstAmount;
                            if (updatePaymentDto.quoteTdsAmount !== undefined)
                                updateData.quoteTdsAmount = updatePaymentDto.quoteTdsAmount;
                            if (updatePaymentDto.quoteTotal !== undefined)
                                updateData.quoteTotal = updatePaymentDto.quoteTotal;
                            if (updatePaymentDto.adminGstNo !== undefined)
                                updateData.adminGstNo = updatePaymentDto.adminGstNo;
                            if (updatePaymentDto.vendorGstNo !== undefined)
                                updateData.vendorGstNo = updatePaymentDto.vendorGstNo;
                            if (updatePaymentDto.paymentType !== undefined) {
                                updateData.paymentType = this.normalizePaymentType(updatePaymentDto.paymentType);
                            }
                            if (updatePaymentDto.paymentMode !== undefined)
                                updateData.paymentMode = updatePaymentDto.paymentMode;
                            if (updatePaymentDto.onlinePaymentId !== undefined)
                                updateData.onlinePaymentId = updatePaymentDto.onlinePaymentId;
                            if (!(updatePaymentDto.paymentReferenceNo !== undefined)) return [3 /*break*/, 12];
                            normalizedPaymentReferenceNo = this.normalizePaymentReferenceNo(updatePaymentDto.paymentReferenceNo);
                            if (!normalizedPaymentReferenceNo) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.assertPaymentReferenceNoUnique(normalizedPaymentReferenceNo, existingPayment._id, session)];
                        case 10:
                            _l.sent();
                            _l.label = 11;
                        case 11:
                            updateData.paymentReferenceNo = normalizedPaymentReferenceNo;
                            _l.label = 12;
                        case 12:
                            if (updatePaymentDto.paymentChequeDate !== undefined) {
                                updateData.paymentChequeDate = updatePaymentDto.paymentChequeDate
                                    ? new Date(updatePaymentDto.paymentChequeDate)
                                    : undefined;
                            }
                            if (!chequeOrDdFile) return [3 /*break*/, 14];
                            previousCheque = existingPayment.chequeOrDdFile;
                            _a = updateData;
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(chequeOrDdFile, 'payments')];
                        case 13:
                            _a.chequeOrDdFile = (_l.sent()).fileUrl;
                            trackedChequePath = updateData.chequeOrDdFile;
                            trackedChequeAction = previousCheque ? 'replaced' : 'added';
                            _l.label = 14;
                        case 14:
                            if (!tdsFile) return [3 /*break*/, 16];
                            previousTds = existingPayment.tdsFile;
                            _b = updateData;
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(tdsFile, 'payments')];
                        case 15:
                            _b.tdsFile = (_l.sent()).fileUrl;
                            trackedTdsPath = updateData.tdsFile;
                            trackedTdsAction = previousTds ? 'replaced' : 'added';
                            _l.label = 16;
                        case 16:
                            paymentStatusUpdate = this.applyPaymentStatusUpdate(updateData, updatePaymentDto, existingPayment, actorRole);
                            certificationProductsRequired = paymentType === 'certification' &&
                                (paymentStatusUpdate.adminApprovedPayment ||
                                    updatePaymentDto.paymentStatus === 2 ||
                                    (this.isVendorPortalRole(actorRole) &&
                                        (vendorProofUpdate || updatePaymentDto.paymentStatus === 1)));
                            certificationProductsRaw = updatePaymentDto.productsToBeCertified !== undefined
                                ? updatePaymentDto.productsToBeCertified
                                : certificationProductsRequired
                                    ? existingPayment.productsToBeCertified
                                    : undefined;
                            if (paymentType === 'certification' &&
                                (updatePaymentDto.productsToBeCertified !== undefined ||
                                    certificationProductsRequired)) {
                                this.validateCertificationProductsField(certificationProductsRaw, {
                                    required: certificationProductsRequired,
                                });
                                if (updatePaymentDto.productsToBeCertified !== undefined &&
                                    String(updatePaymentDto.productsToBeCertified).trim()) {
                                    updateData.productsToBeCertified =
                                        this.normalizeCertificationProductsField(updatePaymentDto.productsToBeCertified);
                                }
                            }
                            else if (updatePaymentDto.productsToBeCertified !== undefined) {
                                updateData.productsToBeCertified =
                                    updatePaymentDto.productsToBeCertified;
                            }
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findOneAndUpdate({ _id: existingPayment._id }, updateData, {
                                    new: true,
                                    session: session,
                                })
                                    .exec()];
                        case 17:
                            updatedPayment = _l.sent();
                            if (!updatedPayment) {
                                throw new common_1.NotFoundException('Payment not found after update');
                            }
                            resolvedPaymentType = (_d = updatedPayment.paymentType) !== null && _d !== void 0 ? _d : paymentType;
                            trackRenewalCycleId = String(resolvedPaymentType).toLowerCase() === 'renew'
                                ? ((_e = updatedPayment.renewalCycleId) !== null && _e !== void 0 ? _e : null)
                                : undefined;
                            if (!trackedProposalPath) return [3 /*break*/, 19];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackPaymentFileChange)(this.documentVersioningService, {
                                    urnNo: normalizedUrn_1,
                                    paymentId: updatedPayment._id,
                                    field: 'proposalFile',
                                    userId: effectiveVendorObjectId,
                                    filePath: trackedProposalPath,
                                    file: proposalFile,
                                    action: trackedProposalAction,
                                    paymentType: resolvedPaymentType,
                                    renewalCycleId: trackRenewalCycleId,
                                    session: session,
                                })];
                        case 18:
                            _l.sent();
                            _l.label = 19;
                        case 19:
                            if (!trackedChequePath) return [3 /*break*/, 21];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackPaymentFileChange)(this.documentVersioningService, {
                                    urnNo: normalizedUrn_1,
                                    paymentId: updatedPayment._id,
                                    field: 'chequeOrDdFile',
                                    userId: effectiveVendorObjectId,
                                    filePath: trackedChequePath,
                                    file: chequeOrDdFile,
                                    action: trackedChequeAction,
                                    paymentType: resolvedPaymentType,
                                    renewalCycleId: trackRenewalCycleId,
                                    session: session,
                                })];
                        case 20:
                            _l.sent();
                            _l.label = 21;
                        case 21:
                            if (!trackedTdsPath) return [3 /*break*/, 23];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackPaymentFileChange)(this.documentVersioningService, {
                                    urnNo: normalizedUrn_1,
                                    paymentId: updatedPayment._id,
                                    field: 'tdsFile',
                                    userId: effectiveVendorObjectId,
                                    filePath: trackedTdsPath,
                                    file: tdsFile,
                                    action: trackedTdsAction,
                                    paymentType: resolvedPaymentType,
                                    renewalCycleId: trackRenewalCycleId,
                                    session: session,
                                })];
                        case 22:
                            _l.sent();
                            _l.label = 23;
                        case 23:
                            deferredUrnLog = null;
                            if (!(updatePaymentDto.urnStatus !== undefined)) return [3 /*break*/, 27];
                            urnNoToUse = normalizedUrn_1;
                            if (!urnNoToUse) {
                                throw new common_1.BadRequestException('URN number is required to update urnStatus');
                            }
                            urnStatusProductFilter = (0, renew_eligible_product_util_1.buildProductFilterForUrnStatusUpdate)({ urnNo: { $in: urnOptions }, vendorId: effectiveVendorObjectId }, resolvedPaymentType, updatePaymentDto.urnStatus);
                            return [4 /*yield*/, this.productModel
                                    .findOne(urnStatusProductFilter)
                                    .session(session)
                                    .exec()];
                        case 24:
                            anyProduct = _l.sent();
                            if (!!anyProduct) return [3 /*break*/, 25];
                            console.warn("[Update Payment] No eligible product found for URN ".concat(urnNoToUse, "; skipped products.urnStatus update."));
                            return [3 /*break*/, 27];
                        case 25: return [4 /*yield*/, this.productModel.updateMany(urnStatusProductFilter, {
                                $set: { urnStatus: updatePaymentDto.urnStatus, updatedDate: now },
                            }, { session: session })];
                        case 26:
                            _l.sent();
                            deferredUrnLog = {
                                urnNo: urnNoToUse,
                                newUrnStatus: updatePaymentDto.urnStatus,
                                previousUrnStatus: Number((_f = anyProduct.urnStatus) !== null && _f !== void 0 ? _f : 0),
                                manufacturerId: anyProduct.manufacturerId.toString(),
                            };
                            _l.label = 27;
                        case 27:
                            if (!(paymentStatusUpdate.adminApprovedPayment &&
                                paymentType === 'certification')) return [3 /*break*/, 29];
                            productsRaw = (_g = updatedPayment.productsToBeCertified) !== null && _g !== void 0 ? _g : existingPayment.productsToBeCertified;
                            return [4 /*yield*/, this.certificationLifecycle.applyCertificationApproval({
                                    urnNoOptions: urnOptions,
                                    vendorId: effectiveVendorObjectId,
                                    productsToBeCertifiedRaw: productsRaw,
                                    approvedAt: now,
                                    session: session,
                                })];
                        case 28:
                            _l.sent();
                            _l.label = 29;
                        case 29:
                            previousPaymentStatus = Number((_h = existingPayment.paymentStatus) !== null && _h !== void 0 ? _h : 0);
                            newPaymentStatus = Number((_j = updatedPayment.paymentStatus) !== null && _j !== void 0 ? _j : 0);
                            renewPaymentSubmitted = paymentType === 'renew' &&
                                this.isVendorPortalRole(actorRole) &&
                                previousPaymentStatus !== 1 &&
                                newPaymentStatus === 1;
                            if (!renewPaymentSubmitted) return [3 /*break*/, 31];
                            renewUrnFilter = (0, renew_eligible_product_util_1.buildProductFilterForUrnStatusUpdate)({ urnNo: { $in: urnOptions }, vendorId: effectiveVendorObjectId }, 'renew', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED);
                            return [4 /*yield*/, this.productModel.updateMany(renewUrnFilter, {
                                    $set: {
                                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 30:
                            _l.sent();
                            _l.label = 31;
                        case 31:
                            if (!(paymentStatusUpdate.adminApprovedPayment &&
                                paymentType === 'renew' &&
                                this.renewalOrchestration)) return [3 /*break*/, 33];
                            return [4 /*yield*/, this.renewalOrchestration.onRenewPaymentApproved({
                                    urnNo: normalizedUrn_1,
                                    paymentId: updatedPayment.paymentId,
                                    renewalCycleId: updatedPayment.renewalCycleId
                                        ? String(updatedPayment.renewalCycleId)
                                        : updatePaymentDto.renewalCycleId,
                                    vendorId: effectiveVendorObjectId,
                                    userId: effectiveVendorObjectId,
                                    session: session,
                                })];
                        case 32:
                            _l.sent();
                            _l.label = 33;
                        case 33: return [4 /*yield*/, session.commitTransaction()];
                        case 34:
                            _l.sent();
                            session.endSession();
                            if (!deferredUrnLog) return [3 /*break*/, 36];
                            return [4 /*yield*/, this.tryLogUrnLifecycleAfterPayment(effectiveVendorId, deferredUrnLog.manufacturerId, deferredUrnLog.urnNo, deferredUrnLog.newUrnStatus, deferredUrnLog.previousUrnStatus)];
                        case 35:
                            _l.sent();
                            if (deferredUrnLog.newUrnStatus === 2 &&
                                deferredUrnLog.previousUrnStatus < 2) {
                                this.lifecycleNotification
                                    .notifyUrnInitialApproved({
                                    manufacturerId: deferredUrnLog.manufacturerId,
                                    urnNo: deferredUrnLog.urnNo,
                                })
                                    .catch(function (err) {
                                    return console.warn('[Payment] URN registration approved notification failed:', err === null || err === void 0 ? void 0 : err.message);
                                });
                            }
                            _l.label = 36;
                        case 36:
                            if (!proposalFile) return [3 /*break*/, 39];
                            return [4 /*yield*/, this.findUrnProductForOrg(normalizedUrn_1, effectiveVendorObjectId, 'manufacturerId urnStatus')];
                        case 37:
                            anyProduct = _l.sent();
                            if (!anyProduct) return [3 /*break*/, 39];
                            urnStatus = typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
                            return [4 /*yield*/, this.logTimelineEntry(effectiveVendorId, anyProduct.manufacturerId.toString(), normalizedUrn_1, {
                                    activity: currentApproval === 2
                                        ? 'Assign Registration Fee'
                                        : 'Assign Registration Fee',
                                    responsibility: 'Admin',
                                    next_activity: 'Approve/Reject Registration Fee Proposal and make payment',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 38:
                            _l.sent();
                            if (paymentType === 'registration' ||
                                paymentType === 'certification') {
                                this.tryNotifyPaymentProposalReady(normalizedUrn_1, effectiveVendorObjectId, updatedPayment.paymentId, paymentType, updatedPayment.quoteTotal);
                                if (paymentType === 'registration' &&
                                    (!deferredUrnLog || deferredUrnLog.newUrnStatus !== 2)) {
                                    previousUrnStatus = (_k = deferredUrnLog === null || deferredUrnLog === void 0 ? void 0 : deferredUrnLog.previousUrnStatus) !== null && _k !== void 0 ? _k : urnStatus;
                                    this.tryNotifyUrnRegistrationApproved(normalizedUrn_1, effectiveVendorObjectId, previousUrnStatus);
                                }
                            }
                            _l.label = 39;
                        case 39:
                            if (!(vendorProofUpdate &&
                                this.isVendorPortalRole(actorRole) &&
                                paymentType === 'registration')) return [3 /*break*/, 42];
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    vendorId: effectiveVendorObjectId,
                                })
                                    .select('manufacturerId urnStatus')
                                    .lean()
                                    .exec()];
                        case 40:
                            anyProduct = _l.sent();
                            if (!anyProduct) return [3 /*break*/, 42];
                            urnStatus = typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
                            return [4 /*yield*/, this.logTimelineEntry(effectiveVendorId, anyProduct.manufacturerId.toString(), normalizedUrn_1, {
                                    activity: 'Approve/Reject Registration Fee Proposal and make payment',
                                    responsibility: 'Manufacturer',
                                    next_activity: 'Approve/Reject Registration Fee',
                                    next_responsibility: 'Admin',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 41:
                            _l.sent();
                            _l.label = 42;
                        case 42:
                            certificationSubmitted = paymentType === 'certification' &&
                                this.isVendorPortalRole(actorRole) &&
                                previousPaymentStatus !== 1 &&
                                newPaymentStatus === 1 &&
                                (vendorProofUpdate || updatePaymentDto.paymentStatus === 1);
                            if (!certificationSubmitted) return [3 /*break*/, 45];
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    vendorId: effectiveVendorObjectId,
                                })
                                    .select('manufacturerId urnStatus')
                                    .lean()
                                    .exec()];
                        case 43:
                            anyProduct = _l.sent();
                            if (!anyProduct) return [3 /*break*/, 45];
                            urnStatus = typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
                            return [4 /*yield*/, this.logTimelineEntry(effectiveVendorId, anyProduct.manufacturerId.toString(), normalizedUrn_1, {
                                    activity: 'Certification Fee Payment',
                                    responsibility: 'Manufacturer',
                                    next_activity: 'Approve/Reject Certification Fee',
                                    next_responsibility: 'Admin',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 44:
                            _l.sent();
                            this.lifecycleNotification
                                .notifyCertificationPaymentSubmitted({
                                manufacturerId: anyProduct.manufacturerId.toString(),
                                urnNo: normalizedUrn_1,
                                paymentId: updatedPayment.paymentId,
                                quoteTotal: updatedPayment.quoteTotal,
                            })
                                .catch(function (err) {
                                return console.warn('[Payment] Certification submitted notification failed:', err === null || err === void 0 ? void 0 : err.message);
                            });
                            _l.label = 45;
                        case 45:
                            if (!paymentStatusUpdate.adminApprovedPayment) return [3 /*break*/, 49];
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    vendorId: effectiveVendorObjectId,
                                })
                                    .select('manufacturerId urnStatus')
                                    .lean()
                                    .exec()];
                        case 46:
                            anyProduct = _l.sent();
                            if (!anyProduct) return [3 /*break*/, 49];
                            urnStatus = typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
                            isCertification = paymentType === 'certification';
                            return [4 /*yield*/, this.logTimelineEntry(effectiveVendorId, anyProduct.manufacturerId.toString(), normalizedUrn_1, {
                                    activity: isCertification
                                        ? 'Approve/Reject Certification Fee'
                                        : 'Approve/Reject Registration Fee',
                                    responsibility: 'Admin',
                                    next_activity: isCertification
                                        ? 'Approve/Reject Certification Fee'
                                        : 'Process Forms in Progress',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 47:
                            _l.sent();
                            return [4 /*yield*/, this.syncPaymentToZohoDeal(updatedPayment, anyProduct.manufacturerId.toString()).catch(function (error) {
                                    console.warn("[Update Payment] Zoho deal payment update failed for ".concat(normalizedUrn_1, ":"), (error === null || error === void 0 ? void 0 : error.message) || error);
                                })];
                        case 48:
                            _l.sent();
                            if (isCertification) {
                                this.lifecycleNotification
                                    .notifyCertificationPaymentApproved({
                                    manufacturerId: anyProduct.manufacturerId.toString(),
                                    urnNo: normalizedUrn_1,
                                    paymentId: updatedPayment.paymentId,
                                })
                                    .catch(function (err) {
                                    return console.warn('[Payment] Certification approved notification failed:', err === null || err === void 0 ? void 0 : err.message);
                                });
                            }
                            _l.label = 49;
                        case 49:
                            if (!paymentStatusUpdate.adminRejectedPayment) return [3 /*break*/, 52];
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    vendorId: effectiveVendorObjectId,
                                })
                                    .select('manufacturerId urnStatus')
                                    .lean()
                                    .exec()];
                        case 50:
                            anyProduct = _l.sent();
                            if (!(anyProduct && paymentStatusUpdate.paymentRejectionRemarks)) return [3 /*break*/, 52];
                            urnStatus = typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
                            return [4 /*yield*/, this.logAdminPaymentRejected(effectiveVendorId, anyProduct.manufacturerId.toString(), normalizedUrn_1, paymentType, paymentStatusUpdate.paymentRejectionRemarks, urnStatus)];
                        case 51:
                            _l.sent();
                            _l.label = 52;
                        case 52: return [2 /*return*/, this.formatPaymentForApi(updatedPayment)];
                        case 53:
                            error_2 = _l.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 54:
                            _l.sent();
                            session.endSession();
                            if (error_2 instanceof common_1.NotFoundException ||
                                error_2 instanceof common_1.BadRequestException ||
                                error_2 instanceof common_1.ForbiddenException) {
                                throw error_2;
                            }
                            console.error('[Update Payment] Error:', error_2);
                            console.error('[Update Payment] Error stack:', error_2.stack);
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to update payment. Please check the logs for details.');
                        case 55: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Vendor approves or rejects admin registration-fee proposal for a URN.
         */
        PaymentsService_1.prototype.setVendorProposalApproval = function (urnNo, vendorId, dto, actorRole) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedUrn, paymentType, status, _a, vendorObjectId, product, urnOptions, urnOwnerObjectId, payment, paymentPlain, currentApproval, paymentStatus, remarks, now, updated, urnStatus, activityLabel;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (this.isAdminPortalRole(actorRole)) {
                                throw new common_1.ForbiddenException('Proposal approval is for the vendor portal only. Admins create or revise proposals via POST/PATCH /payments with proposal_file; vendors approve here with a vendor login.');
                            }
                            if (!this.isVendorPortalRole(actorRole)) {
                                throw new common_1.ForbiddenException('Only vendor or partner users can approve or reject registration fee proposals');
                            }
                            normalizedUrn = this.normalizeUrnNo(urnNo);
                            if (!normalizedUrn) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            paymentType = this.normalizePaymentType(dto.paymentType);
                            if (paymentType !== 'registration') {
                                throw new common_1.BadRequestException('Proposal approval is only supported for registration payments');
                            }
                            status = dto.vendorProposalApprovalStatus;
                            if (status !== 1 && status !== 2) {
                                throw new common_1.BadRequestException('vendorProposalApprovalStatus must be 1 (approve) or 2 (reject)');
                            }
                            return [4 /*yield*/, this.assertCallerOwnsUrn(normalizedUrn, vendorId)];
                        case 1:
                            _a = _e.sent(), vendorObjectId = _a.vendorObjectId, product = _a.product;
                            urnOptions = this.urnCandidates(normalizedUrn);
                            return [4 /*yield*/, this.resolveUrnOwnerVendorObjectId(normalizedUrn)];
                        case 2:
                            urnOwnerObjectId = _e.sent();
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findOne({
                                    urnNo: { $in: urnOptions },
                                    paymentType: paymentType,
                                })
                                    .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
                                    .exec()];
                        case 3:
                            payment = _e.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException("No ".concat(paymentType, " payment found for URN: ").concat(normalizedUrn));
                            }
                            if (!!this.idsEqual(payment.vendorId, urnOwnerObjectId)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findByIdAndUpdate(payment._id, { $set: { vendorId: urnOwnerObjectId, updatedDate: new Date() } }, { new: true })
                                    .exec()];
                        case 4:
                            payment = _e.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found after vendor sync');
                            }
                            _e.label = 5;
                        case 5:
                            paymentPlain = this.paymentToPlain(payment);
                            if (!String((_b = paymentPlain.proposalFile) !== null && _b !== void 0 ? _b : '').trim()) {
                                throw new common_1.BadRequestException('No proposal document on this payment; cannot approve or reject');
                            }
                            currentApproval = (0, payment_proposal_util_1.resolveVendorProposalApprovalStatus)(paymentPlain);
                            paymentStatus = Number((_c = payment.paymentStatus) !== null && _c !== void 0 ? _c : 0);
                            if (![0, 3].includes(paymentStatus)) {
                                throw new common_1.BadRequestException('Proposal review is not available for the current payment status');
                            }
                            if (currentApproval === 2) {
                                throw new common_1.BadRequestException('Proposal was rejected. Wait for admin to upload a revised proposal document before approving.');
                            }
                            if (currentApproval === 1 && status === 1) {
                                throw new common_1.BadRequestException('Proposal is already approved');
                            }
                            if (currentApproval !== 0) {
                                throw new common_1.BadRequestException('Proposal cannot be updated in the current approval state');
                            }
                            remarks = status === 2
                                ? String((_d = dto.proposalRejectionRemarks) !== null && _d !== void 0 ? _d : '').trim() || undefined
                                : undefined;
                            now = new Date();
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .findByIdAndUpdate(payment._id, {
                                    $set: {
                                        vendorProposalApprovalStatus: status,
                                        proposalRejectionRemarks: remarks,
                                        updatedDate: now,
                                    },
                                }, { new: true })
                                    .exec()];
                        case 6:
                            updated = _e.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Payment not found after update');
                            }
                            urnStatus = typeof product.urnStatus === 'number' ? product.urnStatus : 0;
                            if (!(status === 1)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.logTimelineEntry(vendorId, product.manufacturerId.toString(), normalizedUrn, {
                                    activity: 'Approve/Reject Registration Fee Proposal and make payment',
                                    responsibility: 'Manufacturer',
                                    next_activity: 'Approve/Reject Registration Fee',
                                    next_responsibility: 'Manufacturer',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 7:
                            _e.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            activityLabel = remarks
                                ? "Approve/Reject Registration Fee Proposal and make payment: ".concat(remarks)
                                : 'Approve/Reject Registration Fee Proposal and make payment';
                            return [4 /*yield*/, this.logTimelineEntry(vendorId, product.manufacturerId.toString(), normalizedUrn, {
                                    activity: activityLabel,
                                    responsibility: 'Manufacturer',
                                    next_activity: 'Assign Registration Fee',
                                    next_responsibility: 'Admin',
                                    activities_id: urnStatus,
                                    activity_status: urnStatus,
                                }, urnStatus)];
                        case 9:
                            _e.sent();
                            _e.label = 10;
                        case 10: return [2 /*return*/, this.formatPaymentForApi(updated)];
                    }
                });
            });
        };
        PaymentsService_1.prototype.buildPaymentListQueryClauses = function (listPaymentsDto, baseMatch, options) {
            var search = listPaymentsDto.search, status = listPaymentsDto.status, paymentType = listPaymentsDto.paymentType;
            var andClauses = [baseMatch];
            if (status !== undefined && status !== null) {
                andClauses.push((options === null || options === void 0 ? void 0 : options.vendorHistoryStatusFilter) &&
                    (status === 0 || status === 1 || status === 2)
                    ? (0, payment_overdue_util_1.buildVendorHistoryStatusClause)(status)
                    : { paymentStatus: status });
            }
            if (paymentType) {
                andClauses.push({ paymentType: paymentType });
            }
            if (!(options === null || options === void 0 ? void 0 : options.skipSearchClause) && search && search.trim() !== '') {
                var searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                andClauses.push({
                    $or: [{ urnNo: searchRegex }, { paymentReferenceNo: searchRegex }],
                });
            }
            return andClauses.length === 1 ? andClauses[0] : { $and: andClauses };
        };
        PaymentsService_1.prototype.enrichPaymentsWithManufacturer = function (payments) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorIds, manufacturers, byId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorIds = __spreadArray([], new Set(payments
                                .map(function (p) { var _a; return String((_a = p.vendorId) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(function (id) { return mongoose_1.Types.ObjectId.isValid(id); })), true).map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            if (vendorIds.length === 0) {
                                return [2 /*return*/, payments.map(function (p) { return (__assign(__assign({}, p), { manufacturerId: p.vendorId != null ? String(p.vendorId) : null, manufacturerName: null, vendorName: null, vendorEmail: null })); })];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: vendorIds } })
                                    .select('manufacturerName vendor_name vendor_email')
                                    .lean()
                                    .exec()];
                        case 1:
                            manufacturers = _a.sent();
                            byId = new Map(manufacturers.map(function (m) { return [String(m._id), m]; }));
                            return [2 /*return*/, payments.map(function (p) {
                                    var _a, _b, _c, _d, _e;
                                    var mfg = byId.get(String((_a = p.vendorId) !== null && _a !== void 0 ? _a : ''));
                                    return __assign(__assign({}, p), { manufacturerId: p.vendorId != null ? String(p.vendorId) : null, manufacturerName: (_c = (_b = mfg === null || mfg === void 0 ? void 0 : mfg.manufacturerName) !== null && _b !== void 0 ? _b : mfg === null || mfg === void 0 ? void 0 : mfg.vendor_name) !== null && _c !== void 0 ? _c : null, vendorName: (_d = mfg === null || mfg === void 0 ? void 0 : mfg.vendor_name) !== null && _d !== void 0 ? _d : null, vendorEmail: (_e = mfg === null || mfg === void 0 ? void 0 : mfg.vendor_email) !== null && _e !== void 0 ? _e : null });
                                })];
                    }
                });
            });
        };
        PaymentsService_1.prototype.queryPaymentsPaginated = function (listPaymentsDto, baseMatch, options) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, _c, sort, skip, mongoSort, query, _d, totalCount, rows, data, enriched;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = listPaymentsDto.page, page = _a === void 0 ? 1 : _a, _b = listPaymentsDto.limit, limit = _b === void 0 ? 50 : _b, _c = listPaymentsDto.sort, sort = _c === void 0 ? 'desc' : _c;
                            skip = (page - 1) * limit;
                            mongoSort = (0, parse_payment_list_sort_util_1.buildPaymentListMongoSort)((0, parse_payment_list_sort_util_1.parsePaymentListSort)(sort));
                            query = this.buildPaymentListQueryClauses(listPaymentsDto, baseMatch, options);
                            return [4 /*yield*/, Promise.all([
                                    this.paymentDetailsModel.countDocuments(query).exec(),
                                    this.paymentDetailsModel
                                        .find(query)
                                        .sort(mongoSort)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _d = _e.sent(), totalCount = _d[0], rows = _d[1];
                            data = (0, payment_proposal_util_1.formatPaymentRecords)(rows).map(function (payment) {
                                var _a, _b, _c, _d;
                                return (options === null || options === void 0 ? void 0 : options.vendorHistoryStatusFilter)
                                    ? __assign(__assign({}, payment), { vendorDisplayPaymentStatus: (0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(Number((_a = payment.paymentStatus) !== null && _a !== void 0 ? _a : 0), (_b = payment.createdDate) !== null && _b !== void 0 ? _b : payment.created_date), vendor_display_payment_status: (0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(Number((_c = payment.paymentStatus) !== null && _c !== void 0 ? _c : 0), (_d = payment.createdDate) !== null && _d !== void 0 ? _d : payment.created_date) }) : payment;
                            });
                            return [4 /*yield*/, this.enrichPaymentsWithManufacturer(data)];
                        case 2:
                            enriched = _e.sent();
                            return [2 /*return*/, {
                                    data: enriched,
                                    pagination: {
                                        page: page,
                                        limit: limit,
                                        totalCount: totalCount,
                                        totalPages: Math.ceil(totalCount / limit),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Admin payment history — all vendors, or one manufacturer when `manufacturerId` is set.
         * Uses the same URN-based rules as the vendor portal list.
         */
        PaymentsService_1.prototype.getAdminPayments = function (listPaymentsDto) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, scoped, data, search, baseMatch, searchRegex, matchingManufacturers, manufacturerIds, result, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            manufacturerId = (_a = listPaymentsDto.manufacturerId) === null || _a === void 0 ? void 0 : _a.trim();
                            if (!manufacturerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getPayments(listPaymentsDto, manufacturerId)];
                        case 1:
                            scoped = _b.sent();
                            return [4 /*yield*/, this.enrichPaymentsWithManufacturer(scoped.data)];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, {
                                    data: data,
                                    pagination: scoped.pagination,
                                    meta: __assign(__assign({}, scoped.meta), { scope: 'manufacturer', manufacturerId: manufacturerId }),
                                }];
                        case 3:
                            search = listPaymentsDto.search;
                            baseMatch = {};
                            if (!(search && search.trim() !== '')) return [3 /*break*/, 5];
                            searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({
                                    $or: [
                                        { manufacturerName: searchRegex },
                                        { vendor_name: searchRegex },
                                        { vendor_email: searchRegex },
                                    ],
                                })
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 4:
                            matchingManufacturers = _b.sent();
                            manufacturerIds = matchingManufacturers.map(function (m) { return m._id; });
                            baseMatch = {
                                $or: __spreadArray([
                                    { urnNo: searchRegex },
                                    { paymentReferenceNo: searchRegex }
                                ], (manufacturerIds.length > 0
                                    ? [{ vendorId: { $in: manufacturerIds } }]
                                    : []), true),
                            };
                            _b.label = 5;
                        case 5: return [4 /*yield*/, this.queryPaymentsPaginated(listPaymentsDto, baseMatch, (search === null || search === void 0 ? void 0 : search.trim()) ? { skipSearchClause: true } : undefined)];
                        case 6:
                            result = _b.sent();
                            return [2 /*return*/, __assign(__assign({}, result), { meta: {
                                        scope: 'platform',
                                        manufacturerId: null,
                                    } })];
                        case 7:
                            error_3 = _b.sent();
                            console.error('[Get Admin Payments] Error:', error_3);
                            throw new common_1.InternalServerErrorException(error_3.message ||
                                'Failed to get admin payment history. Please check the logs for details.');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get payments for a vendor with pagination, search, filtering, and sorting
         * Filtered by vendorId from authenticated user
         */
        PaymentsService_1.prototype.getPayments = function (listPaymentsDto, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var organizationIds, urnNos, baseMatch, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.resolveVendorOrganizationIds(vendorId)];
                        case 1:
                            organizationIds = _a.sent();
                            return [4 /*yield*/, this.resolveAllVendorUrns(organizationIds)];
                        case 2:
                            urnNos = _a.sent();
                            baseMatch = this.buildVendorPaymentsListMatch(organizationIds, urnNos);
                            return [4 /*yield*/, this.queryPaymentsPaginated(listPaymentsDto, baseMatch, {
                                    vendorHistoryStatusFilter: true,
                                })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, result), { meta: {
                                        organizationIds: organizationIds.map(function (id) { return id.toString(); }),
                                        urnCount: urnNos.length,
                                        scope: 'vendor',
                                    } })];
                        case 4:
                            error_4 = _a.sent();
                            console.error('[Get Payments] Error:', error_4);
                            console.error('[Get Payments] Error stack:', error_4.stack);
                            throw new common_1.InternalServerErrorException(error_4.message ||
                                'Failed to get payments. Please check the logs for details.');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return PaymentsService_1;
    }());
    __setFunctionName(_classThis, "PaymentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsService = _classThis;
}();
exports.PaymentsService = PaymentsService;
