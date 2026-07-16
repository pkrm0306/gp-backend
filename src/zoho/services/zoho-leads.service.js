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
exports.ZohoLeadsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var ZohoLeadsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZohoLeadsService = _classThis = /** @class */ (function () {
        function ZohoLeadsService_1(apiClient, leadMappingModel, syncLogModel) {
            this.apiClient = apiClient;
            this.leadMappingModel = leadMappingModel;
            this.syncLogModel = syncLogModel;
            this.logger = new common_1.Logger(ZohoLeadsService.name);
        }
        ZohoLeadsService_1.prototype.createLead = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, portalEntityId, response, zohoLeadId;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            payload = this.toZohoLeadPayload(dto);
                            portalEntityId = dto.manufacturerId || dto.vendorId || dto.portalUserId;
                            return [4 /*yield*/, this.apiClient.post('/crm/v8/Leads', { data: [payload] })];
                        case 1:
                            response = _f.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logFailure('lead.create', portalEntityId, payload, response)];
                        case 2:
                            _f.sent();
                            throw new common_1.BadGatewayException(((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Lead sync failed');
                        case 3:
                            zohoLeadId = (_e = (_d = (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.details) === null || _e === void 0 ? void 0 : _e.id;
                            if (!!zohoLeadId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.logFailure('lead.create', portalEntityId, payload, response)];
                        case 4:
                            _f.sent();
                            throw new common_1.InternalServerErrorException('Zoho lead ID was not returned');
                        case 5:
                            if (!(dto.portalUserId || dto.manufacturerId || dto.vendorId)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.upsertLeadMapping(dto, zohoLeadId, payload)];
                        case 6:
                            _f.sent();
                            _f.label = 7;
                        case 7: return [4 /*yield*/, this.syncLogModel.create({
                                operation: 'lead.create',
                                status: 'success',
                                portalEntityId: portalEntityId,
                                zohoModule: 'Leads',
                                zohoRecordId: zohoLeadId,
                                requestPayload: payload,
                                responsePayload: response.data,
                                attempts: 1,
                            })];
                        case 8:
                            _f.sent();
                            return [2 /*return*/, {
                                    lead: { module: 'Leads', id: zohoLeadId },
                                    response: response,
                                }];
                    }
                });
            });
        };
        ZohoLeadsService_1.prototype.toZohoLeadPayload = function (dto) {
            return __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ Company: dto.company, Last_Name: dto.lastName }, (dto.firstName ? { First_Name: dto.firstName } : {})), (dto.email ? { Email: dto.email } : {})), (dto.phone ? { Phone: dto.phone } : {})), (dto.mobile ? { Mobile: dto.mobile } : {})), (dto.leadSource ? { Lead_Source: dto.leadSource } : {})), (dto.leadStatus ? { Lead_Status: dto.leadStatus } : {})), (dto.city ? { City: dto.city } : {})), (dto.state ? { State: dto.state } : {})), (dto.country ? { Country: dto.country } : {})), (dto.productInterest ? { Product_Interest: dto.productInterest } : {})), (dto.customFields || {}));
        };
        ZohoLeadsService_1.prototype.upsertLeadMapping = function (dto, zohoLeadId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, portalUserId, mappingFilter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(dto.manufacturerId || dto.vendorId);
                            portalUserId = dto.portalUserId || dto.manufacturerId || dto.vendorId || zohoLeadId;
                            mappingFilter = manufacturerObjectId
                                ? {
                                    $or: [
                                        { manufacturerId: manufacturerObjectId },
                                        { vendorId: manufacturerObjectId },
                                        { portalUserId: portalUserId },
                                    ],
                                }
                                : { portalUserId: portalUserId };
                            return [4 /*yield*/, this.leadMappingModel
                                    .findOneAndUpdate(mappingFilter, {
                                    $set: {
                                        zohoLeadId: zohoLeadId,
                                        vendorId: manufacturerObjectId,
                                        manufacturerId: manufacturerObjectId,
                                        email: dto.email,
                                        company: dto.company,
                                        source: dto.leadSource || 'vendor-registration',
                                        lastSyncedAt: new Date(),
                                        rawSnapshot: payload,
                                    },
                                    $setOnInsert: { portalUserId: portalUserId },
                                }, { new: true, upsert: true })
                                    .exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ZohoLeadsService_1.prototype.logFailure = function (operation, portalEntityId, requestPayload, response) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.logger.error("".concat(operation, " failed: ").concat((_a = response.error) === null || _a === void 0 ? void 0 : _a.message));
                            return [4 /*yield*/, this.syncLogModel.create({
                                    operation: operation,
                                    status: 'failed',
                                    portalEntityId: portalEntityId,
                                    zohoModule: 'Leads',
                                    requestPayload: requestPayload,
                                    responsePayload: response.data,
                                    errorCode: (_b = response.error) === null || _b === void 0 ? void 0 : _b.code,
                                    errorMessage: (_c = response.error) === null || _c === void 0 ? void 0 : _c.message,
                                    attempts: 1,
                                })];
                        case 1:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ZohoLeadsService_1.prototype.toObjectId = function (value) {
            return value && mongoose_1.Types.ObjectId.isValid(value)
                ? new mongoose_1.Types.ObjectId(value)
                : undefined;
        };
        return ZohoLeadsService_1;
    }());
    __setFunctionName(_classThis, "ZohoLeadsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoLeadsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoLeadsService = _classThis;
}();
exports.ZohoLeadsService = ZohoLeadsService;
