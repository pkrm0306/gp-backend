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
var mongoose_1 = require("mongoose");
var zoho_leads_service_1 = require("./zoho-leads.service");
function execQuery(result) {
    return {
        exec: jest.fn().mockResolvedValue(result),
    };
}
describe('ZohoLeadsService', function () {
    var service;
    var apiClient;
    var leadMappingModel;
    var syncLogModel;
    beforeEach(function () {
        jest.clearAllMocks();
        apiClient = {
            post: jest.fn(),
        };
        leadMappingModel = {
            findOneAndUpdate: jest.fn().mockReturnValue(execQuery({ _id: 'map-1' })),
        };
        syncLogModel = {
            create: jest.fn().mockResolvedValue({ _id: 'log-1' }),
        };
        service = new zoho_leads_service_1.ZohoLeadsService(apiClient, leadMappingModel, syncLogModel);
    });
    it('creates a Zoho lead and stores the returned lead id for the manufacturer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var manufacturerId, portalUserId, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manufacturerId = new mongoose_1.Types.ObjectId().toString();
                    portalUserId = new mongoose_1.Types.ObjectId().toString();
                    apiClient.post.mockResolvedValue({
                        ok: true,
                        statusCode: 201,
                        data: {
                            data: [
                                {
                                    status: 'success',
                                    details: { id: '1110053000001280001' },
                                },
                            ],
                        },
                    });
                    return [4 /*yield*/, service.createLead({
                            firstName: 'John',
                            lastName: 'Doe',
                            email: 'john@example.com',
                            mobile: '+919876543210',
                            company: 'ABC Pvt Ltd',
                            leadStatus: 'New',
                            leadSource: 'Portal',
                            city: 'Hyderabad',
                            state: 'Telangana',
                            country: 'India',
                            portalUserId: portalUserId,
                            vendorId: manufacturerId,
                            manufacturerId: manufacturerId,
                            customFields: {
                                GBC_s_Services: 'Greenpro',
                            },
                        })];
                case 1:
                    result = _a.sent();
                    expect(apiClient.post).toHaveBeenCalledWith('/crm/v8/Leads', {
                        data: [
                            expect.objectContaining({
                                First_Name: 'John',
                                Last_Name: 'Doe',
                                Email: 'john@example.com',
                                Mobile: '+919876543210',
                                Company: 'ABC Pvt Ltd',
                                Lead_Status: 'New',
                                Lead_Source: 'Portal',
                                City: 'Hyderabad',
                                State: 'Telangana',
                                Country: 'India',
                                GBC_s_Services: 'Greenpro',
                            }),
                        ],
                    });
                    expect(leadMappingModel.findOneAndUpdate).toHaveBeenCalledWith({
                        $or: [
                            { manufacturerId: expect.any(mongoose_1.Types.ObjectId) },
                            { vendorId: expect.any(mongoose_1.Types.ObjectId) },
                            { portalUserId: portalUserId },
                        ],
                    }, expect.objectContaining({
                        $set: expect.objectContaining({
                            zohoLeadId: '1110053000001280001',
                            email: 'john@example.com',
                            company: 'ABC Pvt Ltd',
                            source: 'Portal',
                            manufacturerId: expect.any(mongoose_1.Types.ObjectId),
                            vendorId: expect.any(mongoose_1.Types.ObjectId),
                        }),
                        $setOnInsert: { portalUserId: portalUserId },
                    }), { new: true, upsert: true });
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'lead.create',
                        status: 'success',
                        portalEntityId: manufacturerId,
                        zohoModule: 'Leads',
                        zohoRecordId: '1110053000001280001',
                    }));
                    expect(result.lead).toEqual({
                        module: 'Leads',
                        id: '1110053000001280001',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('logs and throws when Zoho lead creation fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiClient.post.mockResolvedValue({
                        ok: false,
                        statusCode: 400,
                        error: { message: 'Invalid data' },
                    });
                    return [4 /*yield*/, expect(service.createLead({
                            lastName: 'Doe',
                            company: 'ABC Pvt Ltd',
                            manufacturerId: new mongoose_1.Types.ObjectId().toString(),
                        })).rejects.toBeInstanceOf(common_1.BadGatewayException)];
                case 1:
                    _a.sent();
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'lead.create',
                        status: 'failed',
                        zohoModule: 'Leads',
                        errorMessage: 'Invalid data',
                    }));
                    expect(leadMappingModel.findOneAndUpdate).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws when Zoho does not return a lead id', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiClient.post.mockResolvedValue({
                        ok: true,
                        statusCode: 201,
                        data: { data: [{ status: 'success', details: {} }] },
                    });
                    return [4 /*yield*/, expect(service.createLead({
                            lastName: 'Doe',
                            company: 'ABC Pvt Ltd',
                            manufacturerId: new mongoose_1.Types.ObjectId().toString(),
                        })).rejects.toBeInstanceOf(common_1.InternalServerErrorException)];
                case 1:
                    _a.sent();
                    expect(syncLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        operation: 'lead.create',
                        status: 'failed',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
