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
var common_1 = require("@nestjs/common");
var mongoose_2 = require("mongoose");
var documents_service_1 = require("./documents.service");
var all_product_document_schema_1 = require("../product-design/schemas/all-product-document.schema");
var document_versioning_service_1 = require("./document-versioning.service");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
describe('DocumentsService', function () {
    var service;
    var findOneMock = jest.fn();
    var updateOneMock = jest.fn();
    var countDocumentsMock = jest.fn();
    var collectionUpdateOneMock = jest.fn();
    var vendorA = new mongoose_2.Types.ObjectId().toString();
    var vendorB = new mongoose_2.Types.ObjectId().toString();
    var buildDoc = function (overrides) {
        if (overrides === void 0) { overrides = {}; }
        return (__assign({ _id: new mongoose_2.Types.ObjectId(), productDocumentId: 123, vendorId: new mongoose_2.Types.ObjectId(vendorA), urnNo: 'URN-1', documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN, documentLink: 'uploads/urns/URN-1/test.pdf', isDeleted: false }, overrides));
    };
    var mockFindOneResult = function (doc) {
        findOneMock.mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(doc),
            }),
        });
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneMock.mockReset();
                    updateOneMock.mockReset();
                    countDocumentsMock.mockReset();
                    collectionUpdateOneMock.mockReset();
                    countDocumentsMock.mockResolvedValue(0);
                    collectionUpdateOneMock.mockResolvedValue({ acknowledged: true });
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                documents_service_1.DocumentsService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(all_product_document_schema_1.AllProductDocument.name),
                                    useValue: {
                                        findOne: findOneMock,
                                        updateOne: updateOneMock,
                                        countDocuments: countDocumentsMock,
                                    },
                                },
                                {
                                    provide: (0, mongoose_1.getConnectionToken)(),
                                    useValue: {
                                        collection: jest.fn().mockReturnValue({
                                            updateOne: collectionUpdateOneMock,
                                        }),
                                    },
                                },
                                {
                                    provide: document_versioning_service_1.DocumentVersioningService,
                                    useValue: {
                                        trackDocumentVersionChangeSafe: jest.fn().mockResolvedValue(undefined),
                                    },
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(documents_service_1.DocumentsService);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('soft deletes document on happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var doc, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doc = buildDoc();
                    mockFindOneResult(doc);
                    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });
                    return [4 /*yield*/, service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                        })];
                case 1:
                    result = _a.sent();
                    expect(updateOneMock).toHaveBeenCalledTimes(1);
                    expect(updateOneMock.mock.calls[0][1].$set.isDeleted).toBe(true);
                    expect(result).toEqual({
                        documentId: 123,
                        urnNo: 'URN-1',
                        sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws 403 for wrong vendor ownership', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFindOneResult(buildDoc({ vendorId: new mongoose_2.Types.ObjectId(vendorB) }));
                    return [4 /*yield*/, expect(service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                        })).rejects.toBeInstanceOf(common_1.ForbiddenException)];
                case 1:
                    _a.sent();
                    expect(updateOneMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('soft deletes when sectionKey does not match stored documentForm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var doc, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doc = buildDoc({ documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE });
                    mockFindOneResult(doc);
                    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });
                    return [4 /*yield*/, service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                        })];
                case 1:
                    result = _a.sent();
                    expect(updateOneMock).toHaveBeenCalledTimes(1);
                    expect(result.sectionKey).toBe(document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE);
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws 404 for wrong URN', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFindOneResult(buildDoc({ urnNo: 'URN-2' }));
                    return [4 /*yield*/, expect(service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                        })).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    expect(updateOneMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns success when document is already deleted (idempotent)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFindOneResult(buildDoc({
                        isDeleted: true,
                        documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                        documentFormSubsection: 'wm_supporting_documents',
                    }));
                    return [4 /*yield*/, service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                        })];
                case 1:
                    result = _a.sent();
                    expect(updateOneMock).not.toHaveBeenCalled();
                    expect(collectionUpdateOneMock).toHaveBeenCalledWith({ urnNo: 'URN-1' }, expect.objectContaining({
                        $set: expect.objectContaining({
                            wmSupportingDocuments: null,
                        }),
                    }));
                    expect(result.documentId).toBe(123);
                    return [2 /*return*/];
            }
        });
    }); });
    it('clears waste management supporting-doc flag when last file is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doc = buildDoc({
                        documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                        documentFormSubsection: 'wm_supporting_documents',
                    });
                    mockFindOneResult(doc);
                    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });
                    return [4 /*yield*/, service.softDeleteDocument('123', vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                        })];
                case 1:
                    _a.sent();
                    expect(collectionUpdateOneMock).toHaveBeenCalledWith({ urnNo: 'URN-1' }, expect.objectContaining({
                        $set: expect.objectContaining({
                            wmSupportingDocuments: null,
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('resolves document by MongoDB _id string', function () { return __awaiter(void 0, void 0, void 0, function () {
        var objectId, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    objectId = new mongoose_2.Types.ObjectId();
                    doc = buildDoc({ _id: objectId });
                    mockFindOneResult(doc);
                    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });
                    return [4 /*yield*/, service.softDeleteDocument(objectId.toString(), vendorA, {
                            urnNo: 'URN-1',
                            sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                        })];
                case 1:
                    _a.sent();
                    expect(findOneMock).toHaveBeenCalledWith({ _id: objectId });
                    return [2 /*return*/];
            }
        });
    }); });
});
