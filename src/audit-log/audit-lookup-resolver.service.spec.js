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
var testing_1 = require("@nestjs/testing");
var mongoose_1 = require("@nestjs/mongoose");
var audit_lookup_resolver_service_1 = require("./audit-lookup-resolver.service");
var audit_status_resolver_service_1 = require("./audit-status-resolver.service");
var category_schema_1 = require("../categories/schemas/category.schema");
var sector_schema_1 = require("../sectors/schemas/sector.schema");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var country_schema_1 = require("../countries/schemas/country.schema");
var state_schema_1 = require("../states/schemas/state.schema");
var standard_schema_1 = require("../standards/schemas/standard.schema");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var role_schema_1 = require("../rbac/schemas/role.schema");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
describe('AuditLookupResolver', function () {
    var resolver;
    var lookupFindExecMock = jest.fn().mockResolvedValue([]);
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var lookupModelMock, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookupFindExecMock.mockReset();
                    lookupFindExecMock.mockResolvedValue([]);
                    lookupModelMock = {
                        find: jest.fn().mockReturnValue({
                            lean: jest.fn().mockReturnValue({
                                exec: lookupFindExecMock,
                            }),
                        }),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                audit_lookup_resolver_service_1.AuditLookupResolver,
                                audit_status_resolver_service_1.AuditStatusResolver,
                                { provide: (0, mongoose_1.getModelToken)(category_schema_1.Category.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(sector_schema_1.Sector.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(country_schema_1.Country.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(state_schema_1.State.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(standard_schema_1.Standard.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(role_schema_1.Role.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(vendor_user_schema_1.VendorUser.name), useValue: lookupModelMock },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    resolver = module.get(audit_lookup_resolver_service_1.AuditLookupResolver);
                    return [2 /*return*/];
            }
        });
    }); });
    it('collects productIds from productsToBeCertified JSON string', function () { return __awaiter(void 0, void 0, void 0, function () {
        var valuesByModel, labels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookupFindExecMock.mockResolvedValueOnce([
                        { productId: 101, productName: 'Eco Paint' },
                        { productId: 102, productName: 'Green Adhesive' },
                    ]);
                    valuesByModel = resolver.collectValues([
                        { productsToBeCertified: '[101,102]' },
                    ]);
                    return [4 /*yield*/, resolver.resolveLookupLabels(valuesByModel)];
                case 1:
                    labels = _a.sent();
                    expect(valuesByModel.get('product')).toEqual(new Set(['101', '102']));
                    expect(resolver.resolveLabel(labels, 'productsToBeCertified', '[101,102]')).toBe('Eco Paint, Green Adhesive');
                    return [2 /*return*/];
            }
        });
    }); });
    it('uses deleted-product fallback for unknown ids in productsToBeCertified', function () { return __awaiter(void 0, void 0, void 0, function () {
        var valuesByModel, labels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookupFindExecMock.mockResolvedValueOnce([
                        { productId: 101, productName: 'Eco Paint' },
                    ]);
                    valuesByModel = resolver.collectValues([
                        { productsToBeCertified: '[101,999]' },
                    ]);
                    return [4 /*yield*/, resolver.resolveLookupLabels(valuesByModel)];
                case 1:
                    labels = _a.sent();
                    expect(resolver.resolveLabel(labels, 'productsToBeCertified', '[101,999]')).toBe('Eco Paint, Deleted product (999)');
                    return [2 /*return*/];
            }
        });
    }); });
});
