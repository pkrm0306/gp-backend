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
exports.ZohoDealsService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var mongoose_1 = require("mongoose");
var ZohoDealsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZohoDealsService = _classThis = /** @class */ (function () {
        function ZohoDealsService_1(configService, apiClient, dealMappingModel, leadMappingModel, syncLogModel) {
            this.configService = configService;
            this.apiClient = apiClient;
            this.dealMappingModel = dealMappingModel;
            this.leadMappingModel = leadMappingModel;
            this.syncLogModel = syncLogModel;
            this.logger = new common_1.Logger(ZohoDealsService.name);
        }
        ZohoDealsService_1.prototype.convertRegisteredVendorLead = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, leadMapping, payload, response, output, error_1, responsePayload, message;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(options.manufacturerId);
                            if (!manufacturerObjectId) {
                                throw new common_1.BadGatewayException('Invalid manufacturer ID for Zoho sync');
                            }
                            return [4 /*yield*/, this.leadMappingModel
                                    .findOne({
                                    $or: [
                                        { manufacturerId: manufacturerObjectId },
                                        { vendorId: manufacturerObjectId },
                                    ],
                                })
                                    .sort({ updatedAt: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            leadMapping = _b.sent();
                            if (!!(leadMapping === null || leadMapping === void 0 ? void 0 : leadMapping.zohoLeadId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'lead.convert.vendor-function',
                                    status: 'skipped',
                                    portalEntityId: options.manufacturerId,
                                    requestPayload: { vendorInternalId: options.vendorInternalId },
                                    errorMessage: 'Zoho Lead ID mapping not found',
                                    attempts: 0,
                                })];
                        case 2:
                            _b.sent();
                            throw new common_1.BadGatewayException('Zoho Lead ID mapping not found');
                        case 3:
                            payload = {
                                data: [
                                    {
                                        Lead_id: leadMapping.zohoLeadId,
                                        Vendor_ID: options.vendorInternalId,
                                    },
                                ],
                            };
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 8, , 10]);
                            return [4 /*yield*/, axios_1.default.post(this.vendorConvertFunctionUrl(), payload, {
                                    headers: { 'Content-Type': 'application/json' },
                                    timeout: this.requestTimeoutMs(),
                                })];
                        case 5:
                            response = _b.sent();
                            output = this.parseVendorFunctionOutput(response.data);
                            if (!output.Deals) {
                                throw new Error('Zoho vendor conversion did not return a Deal ID');
                            }
                            return [4 /*yield*/, this.dealMappingModel
                                    .findOneAndUpdate({ portalEntityId: options.manufacturerId }, {
                                    $set: {
                                        portalEntityType: 'manufacturer',
                                        vendorId: manufacturerObjectId,
                                        manufacturerId: manufacturerObjectId,
                                        zohoLeadId: leadMapping.zohoLeadId,
                                        zohoContactId: output.Contacts,
                                        zohoAccountId: output.Accounts,
                                        zohoDealId: output.Deals,
                                        stage: 'Vendor Verified',
                                        lastSyncedAt: new Date(),
                                        rawSnapshot: {
                                            functionResponse: response.data,
                                            parsedOutput: output,
                                        },
                                    },
                                }, { new: true, upsert: true })
                                    .exec()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'lead.convert.vendor-function',
                                    status: 'success',
                                    portalEntityId: options.manufacturerId,
                                    zohoModule: 'Deals',
                                    zohoRecordId: output.Deals,
                                    requestPayload: payload,
                                    responsePayload: response.data,
                                    attempts: 1,
                                })];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, output];
                        case 8:
                            error_1 = _b.sent();
                            responsePayload = (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.data;
                            message = (responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.message) ||
                                (responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.code) ||
                                (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) ||
                                'Zoho vendor lead conversion failed';
                            this.logger.error("Zoho vendor lead conversion failed: ".concat(message));
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'lead.convert.vendor-function',
                                    status: 'failed',
                                    portalEntityId: options.manufacturerId,
                                    zohoModule: 'Leads',
                                    zohoRecordId: leadMapping.zohoLeadId,
                                    requestPayload: payload,
                                    responsePayload: responsePayload,
                                    errorMessage: String(message),
                                    attempts: 1,
                                })];
                        case 9:
                            _b.sent();
                            throw new common_1.BadGatewayException('Zoho vendor lead conversion failed');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.updateDealPaymentDetails = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, mapping, payload, response;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(options.manufacturerId);
                            if (!manufacturerObjectId) {
                                throw new common_1.BadGatewayException('Invalid manufacturer ID for Zoho sync');
                            }
                            return [4 /*yield*/, this.dealMappingModel
                                    .findOne({
                                    $or: [
                                        { manufacturerId: manufacturerObjectId },
                                        { vendorId: manufacturerObjectId },
                                        { portalEntityId: options.manufacturerId },
                                    ],
                                })
                                    .sort({ updatedAt: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            mapping = _c.sent();
                            if (!!(mapping === null || mapping === void 0 ? void 0 : mapping.zohoDealId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.payment.update',
                                    status: 'skipped',
                                    portalEntityId: options.manufacturerId,
                                    requestPayload: {
                                        quoteNumber: options.quoteNumber,
                                        transactionNumber: options.transactionNumber,
                                    },
                                    errorMessage: 'Zoho Deal ID mapping not found',
                                    attempts: 0,
                                })];
                        case 2:
                            _c.sent();
                            throw new common_1.BadGatewayException('Zoho Deal ID mapping not found');
                        case 3:
                            payload = {
                                data: [
                                    __assign(__assign(__assign(__assign({ id: mapping.zohoDealId, Quote_Number: options.quoteNumber }, (options.gstin ? { GSTIN: options.gstin } : {})), { Amount: options.amount }), (options.transactionNumber
                                        ? { Transaction_Number: options.transactionNumber }
                                        : {})), (options.paymentMode
                                        ? { Payment_Mode: this.toZohoPaymentMode(options.paymentMode) }
                                        : {})),
                                ],
                            };
                            return [4 /*yield*/, this.apiClient.put('/crm/v8/Potentials', payload)];
                        case 4:
                            response = _c.sent();
                            if (!!response.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.logFailure('deal.payment.update', options.manufacturerId, payload, response)];
                        case 5:
                            _c.sent();
                            throw new common_1.BadGatewayException(((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Zoho deal payment update failed');
                        case 6: return [4 /*yield*/, this.dealMappingModel
                                .findByIdAndUpdate(mapping._id, {
                                $set: {
                                    manufacturerId: manufacturerObjectId,
                                    vendorId: (_b = mapping.vendorId) !== null && _b !== void 0 ? _b : manufacturerObjectId,
                                    lastSyncedAt: new Date(),
                                    rawSnapshot: __assign(__assign({}, (mapping.rawSnapshot || {})), { lastPaymentUpdate: payload.data[0], lastPaymentUpdateResponse: response.data }),
                                },
                            })
                                .exec()];
                        case 7:
                            _c.sent();
                            return [4 /*yield*/, this.logSuccess('deal.payment.update', options.manufacturerId, 'Potentials', mapping.zohoDealId, payload, response)];
                        case 8:
                            _c.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.syncDealProducts = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, productItems, mapping, payload, response, error_2, responsePayload, message;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(options.manufacturerId);
                            if (!manufacturerObjectId) {
                                throw new common_1.BadGatewayException('Invalid manufacturer ID for Zoho sync');
                            }
                            productItems = options.products
                                .map(function (product) { return ({
                                Product_Name: String(product.productName || '').trim(),
                                Product_Detail: String(product.productDetail || '').trim(),
                            }); })
                                .filter(function (product) { return product.Product_Name; });
                            if (!(productItems.length === 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.products.sync',
                                    status: 'skipped',
                                    portalEntityId: options.manufacturerId,
                                    requestPayload: { urnNo: options.urnNo },
                                    errorMessage: 'No products available for Zoho deal product sync',
                                    attempts: 0,
                                })];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.dealMappingModel
                                .findOne({
                                $or: [
                                    { manufacturerId: manufacturerObjectId },
                                    { vendorId: manufacturerObjectId },
                                    { portalEntityId: options.manufacturerId },
                                ],
                            })
                                .sort({ updatedAt: -1 })
                                .lean()
                                .exec()];
                        case 3:
                            mapping = _c.sent();
                            if (!!(mapping === null || mapping === void 0 ? void 0 : mapping.zohoDealId)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.products.sync',
                                    status: 'skipped',
                                    portalEntityId: options.manufacturerId,
                                    requestPayload: {
                                        urnNo: options.urnNo,
                                        products: productItems,
                                    },
                                    errorMessage: 'Zoho Deal ID mapping not found',
                                    attempts: 0,
                                })];
                        case 4:
                            _c.sent();
                            throw new common_1.BadGatewayException('Zoho Deal ID mapping not found');
                        case 5:
                            payload = {
                                data: [
                                    {
                                        Deal_id: mapping.zohoDealId,
                                        Products: productItems,
                                    },
                                ],
                            };
                            _c.label = 6;
                        case 6:
                            _c.trys.push([6, 10, , 12]);
                            return [4 /*yield*/, axios_1.default.post(this.dealProductFunctionUrl(), payload, {
                                    headers: { 'Content-Type': 'application/json' },
                                    timeout: this.requestTimeoutMs(),
                                })];
                        case 7:
                            response = _c.sent();
                            return [4 /*yield*/, this.dealMappingModel
                                    .findByIdAndUpdate(mapping._id, {
                                    $set: {
                                        manufacturerId: manufacturerObjectId,
                                        vendorId: (_a = mapping.vendorId) !== null && _a !== void 0 ? _a : manufacturerObjectId,
                                        lastSyncedAt: new Date(),
                                        rawSnapshot: __assign(__assign({}, (mapping.rawSnapshot || {})), { lastProductSync: {
                                                urnNo: options.urnNo,
                                                requestPayload: payload,
                                                responsePayload: response.data,
                                            } }),
                                    },
                                })
                                    .exec()];
                        case 8:
                            _c.sent();
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.products.sync',
                                    status: 'success',
                                    portalEntityId: options.manufacturerId,
                                    zohoModule: 'Deals',
                                    zohoRecordId: mapping.zohoDealId,
                                    requestPayload: payload,
                                    responsePayload: response.data,
                                    attempts: 1,
                                })];
                        case 9:
                            _c.sent();
                            return [3 /*break*/, 12];
                        case 10:
                            error_2 = _c.sent();
                            responsePayload = (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _b === void 0 ? void 0 : _b.data;
                            message = (responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.message) ||
                                (responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.code) ||
                                (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) ||
                                'Zoho deal product sync failed';
                            this.logger.error("Zoho deal product sync failed: ".concat(message));
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.products.sync',
                                    status: 'failed',
                                    portalEntityId: options.manufacturerId,
                                    zohoModule: 'Deals',
                                    zohoRecordId: mapping.zohoDealId,
                                    requestPayload: payload,
                                    responsePayload: responsePayload,
                                    errorMessage: String(message),
                                    attempts: 1,
                                })];
                        case 11:
                            _c.sent();
                            throw new common_1.BadGatewayException('Zoho deal product sync failed');
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.updateDealStatus = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, mapping, payload, response;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(options.manufacturerId);
                            if (!manufacturerObjectId) {
                                throw new common_1.BadGatewayException('Invalid manufacturer ID for Zoho sync');
                            }
                            return [4 /*yield*/, this.dealMappingModel
                                    .findOne({
                                    $or: [
                                        { manufacturerId: manufacturerObjectId },
                                        { vendorId: manufacturerObjectId },
                                        { portalEntityId: options.manufacturerId },
                                    ],
                                })
                                    .sort({ updatedAt: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            mapping = _c.sent();
                            if (!!(mapping === null || mapping === void 0 ? void 0 : mapping.zohoDealId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: 'deal.status.update',
                                    status: 'skipped',
                                    portalEntityId: options.manufacturerId,
                                    requestPayload: { status: options.status },
                                    errorMessage: 'Zoho Deal ID mapping not found',
                                    attempts: 0,
                                })];
                        case 2:
                            _c.sent();
                            throw new common_1.BadGatewayException('Zoho Deal ID mapping not found');
                        case 3:
                            payload = {
                                data: [
                                    {
                                        id: mapping.zohoDealId,
                                        Status: options.status,
                                    },
                                ],
                            };
                            return [4 /*yield*/, this.apiClient.put('/crm/v8/Potentials', payload)];
                        case 4:
                            response = _c.sent();
                            if (!!response.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.logFailure('deal.status.update', options.manufacturerId, payload, response)];
                        case 5:
                            _c.sent();
                            throw new common_1.BadGatewayException(((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Zoho deal status update failed');
                        case 6: return [4 /*yield*/, this.dealMappingModel
                                .findByIdAndUpdate(mapping._id, {
                                $set: {
                                    manufacturerId: manufacturerObjectId,
                                    vendorId: (_b = mapping.vendorId) !== null && _b !== void 0 ? _b : manufacturerObjectId,
                                    stage: options.status,
                                    lastSyncedAt: new Date(),
                                    rawSnapshot: __assign(__assign({}, (mapping.rawSnapshot || {})), { lastStatusUpdate: payload.data[0], lastStatusUpdateResponse: response.data }),
                                },
                            })
                                .exec()];
                        case 7:
                            _c.sent();
                            return [4 /*yield*/, this.logSuccess('deal.status.update', options.manufacturerId, 'Potentials', mapping.zohoDealId, payload, response)];
                        case 8:
                            _c.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.convertLeadToDeal = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, response, details, dealId;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            payload = {
                                data: [
                                    __assign(__assign({ overwrite: true, notify_lead_owner: false, notify_new_entity_owner: false, Deals: __assign(__assign(__assign(__assign({ Deal_Name: options.dealName }, (options.stage ? { Stage: options.stage } : {})), (options.closingDate
                                            ? { Closing_Date: options.closingDate }
                                            : {})), (options.amount !== undefined ? { Amount: options.amount } : {})), (options.customFields || {})) }, (options.accountName
                                        ? { Accounts: { Account_Name: options.accountName } }
                                        : {})), (options.contactLastName
                                        ? { Contacts: { Last_Name: options.contactLastName } }
                                        : {})),
                                ],
                            };
                            return [4 /*yield*/, this.apiClient.post("/crm/v2/Leads/".concat(options.leadId, "/actions/convert"), payload)];
                        case 1:
                            response = _e.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logFailure('lead.convert', options.portalEntityId, payload, response)];
                        case 2:
                            _e.sent();
                            throw new common_1.BadGatewayException(((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Zoho lead conversion failed');
                        case 3:
                            details = ((_d = (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.details) || {};
                            dealId = String(details.Deals || details.id || '');
                            if (!dealId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.dealMappingModel
                                    .findOneAndUpdate({ portalEntityId: options.portalEntityId }, {
                                    $set: {
                                        portalEntityType: options.portalEntityType || 'product-registration',
                                        vendorId: this.toObjectId(options.vendorId),
                                        zohoLeadId: options.leadId,
                                        zohoContactId: this.toOptionalString(details.Contacts),
                                        zohoAccountId: this.toOptionalString(details.Accounts),
                                        zohoDealId: dealId,
                                        stage: options.stage,
                                        lastSyncedAt: new Date(),
                                        rawSnapshot: details,
                                    },
                                }, { new: true, upsert: true })
                                    .exec()];
                        case 4:
                            _e.sent();
                            _e.label = 5;
                        case 5: return [4 /*yield*/, this.logSuccess('lead.convert', options.portalEntityId, 'Deals', dealId, payload, response)];
                        case 6:
                            _e.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.updateDeal = function (dto, portalEntityId) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, response;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            payload = {
                                data: [
                                    __assign(__assign(__assign(__assign({}, (dto.stage ? { Stage: dto.stage } : {})), (dto.amount !== undefined ? { Amount: dto.amount } : {})), (dto.closingDate ? { Closing_Date: dto.closingDate } : {})), (dto.customFields || {})),
                                ],
                            };
                            return [4 /*yield*/, this.apiClient.put("/crm/v2/Deals/".concat(dto.dealId), payload)];
                        case 1:
                            response = _b.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logFailure('deal.update', portalEntityId, payload, response)];
                        case 2:
                            _b.sent();
                            throw new common_1.BadGatewayException(((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Zoho deal update failed');
                        case 3: return [4 /*yield*/, this.dealMappingModel
                                .findOneAndUpdate({ zohoDealId: dto.dealId }, {
                                $set: __assign(__assign({}, (dto.stage ? { stage: dto.stage } : {})), { lastSyncedAt: new Date(), rawSnapshot: payload.data[0] }),
                            })
                                .exec()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.logSuccess('deal.update', portalEntityId, 'Deals', dto.dealId, payload, response)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.logSuccess = function (operation, portalEntityId, zohoModule, zohoRecordId, requestPayload, response) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.syncLogModel.create({
                                operation: operation,
                                status: 'success',
                                portalEntityId: portalEntityId,
                                zohoModule: zohoModule,
                                zohoRecordId: zohoRecordId,
                                requestPayload: requestPayload,
                                responsePayload: ((_a = response.data) !== null && _a !== void 0 ? _a : {}),
                                attempts: 1,
                            })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.logFailure = function (operation, portalEntityId, requestPayload, response) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            this.logger.error("".concat(operation, " failed: ").concat((_a = response.error) === null || _a === void 0 ? void 0 : _a.message));
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: operation,
                                    status: 'failed',
                                    portalEntityId: portalEntityId,
                                    requestPayload: requestPayload,
                                    responsePayload: ((_b = response.data) !== null && _b !== void 0 ? _b : {}),
                                    errorCode: (_c = response.error) === null || _c === void 0 ? void 0 : _c.code,
                                    errorMessage: (_d = response.error) === null || _d === void 0 ? void 0 : _d.message,
                                    attempts: 1,
                                })];
                        case 1:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ZohoDealsService_1.prototype.toObjectId = function (value) {
            return value && mongoose_1.Types.ObjectId.isValid(value)
                ? new mongoose_1.Types.ObjectId(value)
                : undefined;
        };
        ZohoDealsService_1.prototype.toOptionalString = function (value) {
            return value ? String(value) : undefined;
        };
        ZohoDealsService_1.prototype.vendorConvertFunctionUrl = function () {
            var fullUrl = String(this.configService.get('ZOHO_VENDOR_CONVERT_FUNCTION_URL') || '')
                .split('#')[0]
                .trim();
            if (fullUrl &&
                /\/crm\/v7\/functions\/vendor_contact\/actions\/execute/i.test(fullUrl)) {
                return fullUrl;
            }
            if (fullUrl) {
                this.logger.warn('Ignoring ZOHO_VENDOR_CONVERT_FUNCTION_URL because it is not the required crm/v7 vendor_contact function endpoint');
            }
            var zapikey = String(this.configService.get('ZOHO_VENDOR_CONVERT_ZAPIKEY') || '')
                .split('#')[0]
                .trim();
            if (!zapikey) {
                throw new common_1.BadGatewayException('ZOHO_VENDOR_CONVERT_ZAPIKEY is not configured');
            }
            var baseUrl = String(this.configService.get('ZOHO_BASE_URL') ||
                'https://www.zohoapis.in')
                .split('#')[0]
                .trim()
                .replace(/\/crm\/v\d+\/?$/i, '');
            var normalizedBase = baseUrl.replace(/\/+$/, '');
            return "".concat(normalizedBase, "/crm/v7/functions/vendor_contact/actions/execute?auth_type=apikey&zapikey=").concat(encodeURIComponent(zapikey));
        };
        ZohoDealsService_1.prototype.dealProductFunctionUrl = function () {
            var fullUrl = String(this.configService.get('ZOHO_DEAL_PRODUCT_FUNCTION_URL') || '')
                .split('#')[0]
                .trim();
            if (fullUrl &&
                /\/crm\/v7\/functions\/deal_product\/actions\/execute/i.test(fullUrl)) {
                return fullUrl;
            }
            if (fullUrl) {
                this.logger.warn('Ignoring ZOHO_DEAL_PRODUCT_FUNCTION_URL because it is not the required crm/v7 deal_product function endpoint');
            }
            var zapikey = String(this.configService.get('ZOHO_DEAL_PRODUCT_ZAPIKEY') ||
                this.configService.get('ZOHO_VENDOR_CONVERT_ZAPIKEY') ||
                '')
                .split('#')[0]
                .trim();
            if (!zapikey) {
                throw new common_1.BadGatewayException('ZOHO_DEAL_PRODUCT_ZAPIKEY is not configured');
            }
            var baseUrl = String(this.configService.get('ZOHO_BASE_URL') ||
                'https://www.zohoapis.in')
                .split('#')[0]
                .trim()
                .replace(/\/crm\/v\d+\/?$/i, '');
            var normalizedBase = baseUrl.replace(/\/+$/, '');
            return "".concat(normalizedBase, "/crm/v7/functions/deal_product/actions/execute?auth_type=apikey&zapikey=").concat(encodeURIComponent(zapikey));
        };
        ZohoDealsService_1.prototype.parseVendorFunctionOutput = function (response) {
            var _a;
            if (response.code && response.code !== 'success') {
                throw new Error(response.message || 'Zoho function failed');
            }
            var rawOutput = (_a = response.details) === null || _a === void 0 ? void 0 : _a.output;
            if (!rawOutput) {
                throw new Error('Zoho function output missing');
            }
            var parsed = JSON.parse(rawOutput);
            return {
                Contacts: this.toOptionalString(parsed.Contacts),
                Deals: this.toOptionalString(parsed.Deals),
                Accounts: this.toOptionalString(parsed.Accounts),
            };
        };
        ZohoDealsService_1.prototype.requestTimeoutMs = function () {
            return (Number(this.configService.get('ZOHO_HTTP_TIMEOUT_MS')) || 15000);
        };
        ZohoDealsService_1.prototype.toZohoPaymentMode = function (paymentMode) {
            var normalized = String(paymentMode || '')
                .trim()
                .toLowerCase();
            if (normalized === 'online')
                return 'Online';
            if (normalized === 'cheque_or_dd')
                return 'Cheque Or DD';
            if (normalized === 'neft_or_rtgs')
                return 'NEFT Or RTGS';
            return paymentMode;
        };
        return ZohoDealsService_1;
    }());
    __setFunctionName(_classThis, "ZohoDealsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoDealsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoDealsService = _classThis;
}();
exports.ZohoDealsService = ZohoDealsService;
