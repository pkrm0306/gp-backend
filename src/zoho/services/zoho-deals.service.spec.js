"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var mongoose_1 = require("mongoose");
var zoho_deals_service_1 = require("./zoho-deals.service");
jest.mock('axios');
function queryMock(result) {
    return {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
    };
}
function execMock(result) {
    return {
        exec: jest.fn().mockResolvedValue(result),
    };
}
describe('ZohoDealsService', function () {
    var service;
    var configService;
    var apiClient;
    var dealMappingModel;
    var leadMappingModel;
    var syncLogModel;
    var mockedAxios = axios_1.default;
    beforeEach(function () {
        jest.clearAllMocks();
        configService = {
            get: jest.fn(function (key) {
                if (key === 'ZOHO_VENDOR_CONVERT_ZAPIKEY')
                    return 'zapikey-123';
                if (key === 'ZOHO_BASE_URL')
                    return 'https://www.zohoapis.in';
                return undefined;
            }),
        };
        apiClient = {
            put: jest.fn(),
            post: jest.fn(),
        };
        dealMappingModel = {
            findOne: jest.fn(),
            findOneAndUpdate: jest
                .fn()
                .mockReturnValue(execMock({ _id: 'deal-map' })),
            findByIdAndUpdate: jest
                .fn()
                .mockReturnValue(execMock({ _id: 'deal-map' })),
        };
        leadMappingModel = {
            findOne: jest.fn(),
        };
        syncLogModel = {
            create: jest.fn().mockResolvedValue({ _id: 'log-1' }),
        };
        service = new zoho_deals_service_1.ZohoDealsService(configService, apiClient, dealMappingModel, leadMappingModel, syncLogModel);
    });
    it('converts a registered vendor lead and stores contact/deal/account ids', function () { return __awaiter(void 0, void 0, void 0, function () {
        var manufacturerId, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manufacturerId = new mongoose_1.Types.ObjectId().toString();
                    leadMappingModel.findOne.mockReturnValue(queryMock({
                        zohoLeadId: '1110053000001280001',
                    }));
                    mockedAxios.post.mockResolvedValue({
                        data: {
                            code: 'success',
                            details: {
                                output: JSON.stringify({
                                    Contacts: '1110053000001287004',
                                    Deals: '1110053000001287007',
                                    Accounts: '1110053000001287001',
                                }),
                            },
                        },
                    });
                    return [4 /*yield*/, service.convertRegisteredVendorLead({
                            manufacturerId: manufacturerId,
                            vendorInternalId: 'VEN-01',
                        })];
                case 1:
                    result = _a.sent();
                    expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringContaining('/crm/v7/functions/vendor_contact/actions/execute'), {
                        data: [
                            {
                                Lead_id: '1110053000001280001',
                                Vendor_ID: 'VEN-01',
                            },
                        ],
                    }, expect.objectContaining({
                        headers: { 'Content-Type': 'application/json' },
                    }));
                    expect(dealMappingModel.findOneAndUpdate).toHaveBeenCalledWith({ portalEntityId: manufacturerId }, expect.objectContaining({
                        $set: expect.objectContaining({
                            portalEntityType: 'manufacturer',
                            zohoLeadId: '1110053000001280001',
                            zohoContactId: '1110053000001287004',
                            zohoDealId: '1110053000001287007',
                            zohoAccountId: '1110053000001287001',
                            manufacturerId: expect.any(mongoose_1.Types.ObjectId),
                            vendorId: expect.any(mongoose_1.Types.ObjectId),
                        }),
                    }), { new: true, upsert: true });
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'lead.convert.vendor-function',
                        status: 'success',
                        portalEntityId: manufacturerId,
                        zohoRecordId: '1110053000001287007',
                    }));
                    expect(result).toEqual({
                        Contacts: '1110053000001287004',
                        Deals: '1110053000001287007',
                        Accounts: '1110053000001287001',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips vendor lead conversion when lead mapping is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    leadMappingModel.findOne.mockReturnValue(queryMock(null));
                    return [4 /*yield*/, expect(service.convertRegisteredVendorLead({
                            manufacturerId: new mongoose_1.Types.ObjectId().toString(),
                            vendorInternalId: 'VEN-01',
                        })).rejects.toBeInstanceOf(common_1.BadGatewayException)];
                case 1:
                    _a.sent();
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'lead.convert.vendor-function',
                        status: 'skipped',
                        errorMessage: 'Zoho Lead ID mapping not found',
                    }));
                    expect(mockedAxios.post).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates Zoho Potentials with approved payment details', function () { return __awaiter(void 0, void 0, void 0, function () {
        var manufacturerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manufacturerId = new mongoose_1.Types.ObjectId().toString();
                    dealMappingModel.findOne.mockReturnValue(queryMock({
                        _id: 'deal-map-id',
                        zohoDealId: '1110053000005094008',
                        rawSnapshot: { existing: true },
                    }));
                    apiClient.put.mockResolvedValue({
                        ok: true,
                        statusCode: 200,
                        data: {
                            data: [
                                {
                                    code: 'SUCCESS',
                                    status: 'success',
                                    details: { id: '1110053000005094008' },
                                },
                            ],
                        },
                    });
                    return [4 /*yield*/, service.updateDealPaymentDetails({
                            manufacturerId: manufacturerId,
                            quoteNumber: 454545,
                            gstin: '876587687y6',
                            amount: 8989,
                            transactionNumber: '98776654321',
                            paymentMode: 'online',
                        })];
                case 1:
                    _a.sent();
                    expect(apiClient.put).toHaveBeenCalledWith('/crm/v8/Potentials', {
                        data: [
                            {
                                id: '1110053000005094008',
                                Quote_Number: 454545,
                                GSTIN: '876587687y6',
                                Amount: 8989,
                                Transaction_Number: '98776654321',
                                Payment_Mode: 'Online',
                            },
                        ],
                    });
                    expect(dealMappingModel.findByIdAndUpdate).toHaveBeenCalledWith('deal-map-id', expect.objectContaining({
                        $set: expect.objectContaining({
                            manufacturerId: expect.any(mongoose_1.Types.ObjectId),
                            lastSyncedAt: expect.any(Date),
                            rawSnapshot: expect.objectContaining({
                                existing: true,
                                lastPaymentUpdate: expect.objectContaining({
                                    id: '1110053000005094008',
                                    Payment_Mode: 'Online',
                                }),
                            }),
                        }),
                    }));
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'deal.payment.update',
                        status: 'success',
                        zohoModule: 'Potentials',
                        zohoRecordId: '1110053000005094008',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('logs failed Zoho Potentials update', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealMappingModel.findOne.mockReturnValue(queryMock({
                        _id: 'deal-map-id',
                        zohoDealId: '1110053000005094008',
                    }));
                    apiClient.put.mockResolvedValue({
                        ok: false,
                        statusCode: 400,
                        error: { code: 'INVALID_DATA', message: 'Invalid deal update' },
                    });
                    return [4 /*yield*/, expect(service.updateDealPaymentDetails({
                            manufacturerId: new mongoose_1.Types.ObjectId().toString(),
                            quoteNumber: 454545,
                            amount: 8989,
                        })).rejects.toBeInstanceOf(common_1.BadGatewayException)];
                case 1:
                    _a.sent();
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'deal.payment.update',
                        status: 'failed',
                        errorCode: 'INVALID_DATA',
                        errorMessage: 'Invalid deal update',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
