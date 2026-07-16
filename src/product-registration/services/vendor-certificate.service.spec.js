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
var mongoose_2 = require("mongoose");
var product_schema_1 = require("../schemas/product.schema");
var category_schema_1 = require("../../categories/schemas/category.schema");
var manufacturer_schema_1 = require("../../manufacturers/schemas/manufacturer.schema");
var all_product_document_schema_1 = require("../../product-design/schemas/all-product-document.schema");
var product_plant_schema_1 = require("../schemas/product-plant.schema");
var vendor_certificate_service_1 = require("./vendor-certificate.service");
jest.mock('archiver', function () { return jest.fn(); });
describe('VendorCertificateService', function () {
    var service;
    var vendorId = new mongoose_2.Types.ObjectId();
    var productObjectId = new mongoose_2.Types.ObjectId();
    var plantObjectId = new mongoose_2.Types.ObjectId();
    var productModel = {
        findOne: jest.fn(),
        find: jest.fn(),
    };
    var categoryModel = { findById: jest.fn() };
    var manufacturerModel = { findById: jest.fn() };
    var allProductDocumentModel = { find: jest.fn() };
    var productPlantModel = { aggregate: jest.fn() };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                vendor_certificate_service_1.VendorCertificateService,
                                { provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name), useValue: productModel },
                                { provide: (0, mongoose_1.getModelToken)(category_schema_1.Category.name), useValue: categoryModel },
                                {
                                    provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name),
                                    useValue: manufacturerModel,
                                },
                                {
                                    provide: (0, mongoose_1.getModelToken)(all_product_document_schema_1.AllProductDocument.name),
                                    useValue: allProductDocumentModel,
                                },
                                { provide: (0, mongoose_1.getModelToken)(product_plant_schema_1.ProductPlant.name), useValue: productPlantModel },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(vendor_certificate_service_1.VendorCertificateService);
                    return [2 /*return*/];
            }
        });
    }); });
    function mockCertifiedProduct() {
        return {
            _id: productObjectId,
            vendorId: vendorId,
            eoiNo: 'GPABC001',
            urnNo: 'URN-TEST',
            productName: 'Test Product',
            productStatus: 2,
            validtillDate: new Date('2028-12-31'),
            categoryId: new mongoose_2.Types.ObjectId(),
            manufacturerId: new mongoose_2.Types.ObjectId(),
        };
    }
    function mockPlantsAggregate(rows) {
        productPlantModel.aggregate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(rows),
        });
    }
    it('generates one merged PDF page per plant for a single-plant EOI', function () { return __awaiter(void 0, void 0, void 0, function () {
        var product, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product = mockCertifiedProduct();
                    productModel.findOne.mockReturnValue({
                        exec: jest.fn().mockResolvedValue(product),
                    });
                    categoryModel.findById.mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue({ categoryName: 'Category' }),
                        }),
                    });
                    manufacturerModel.findById.mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue({ manufacturerName: 'Acme' }),
                        }),
                    });
                    mockPlantsAggregate([
                        {
                            _id: plantObjectId,
                            productPlantId: 1,
                            plantName: 'Mumbai',
                            plantLocation: 'Mumbai',
                            city: 'Mumbai',
                            state: [{ stateName: 'Maharashtra' }],
                        },
                    ]);
                    return [4 /*yield*/, service.downloadEoiCertificate(String(vendorId), String(productObjectId), 'merged')];
                case 1:
                    file = _a.sent();
                    expect(file.contentType).toBe('application/pdf');
                    expect(file.buffer.subarray(0, 5).toString()).toBe('%PDF-');
                    expect(file.fileName).toBe('GreenPro_Certificate_GPABC001.pdf');
                    return [2 /*return*/];
            }
        });
    }); });
});
