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
var document_versioning_service_1 = require("./document-versioning.service");
describe('DocumentVersioningService', function () {
    var service = Object.create(document_versioning_service_1.DocumentVersioningService.prototype);
    var findStreamOrThrow = jest.fn();
    var docVersionFind = jest.fn();
    beforeEach(function () {
        jest.clearAllMocks();
        service.findStreamOrThrow = findStreamOrThrow;
        service.resolveHistoryStream = findStreamOrThrow;
        service.docVersionModel = { find: docVersionFind };
        service.renewDocumentModel = {
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([]),
                    }),
                }),
            }),
        };
        service.mapStream = function (stream) { return stream; };
        service.mapVersion = function (version) { return version; };
        service.filterRenewHistoryVersions = function (_query, versions) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, versions];
        }); }); };
    });
    describe('getDocumentHistory', function () {
        var resolveHistoryStream = jest.fn();
        beforeEach(function () {
            service.resolveHistoryStream = resolveHistoryStream;
            service.filterRenewHistoryVersions = function (_query, versions) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, versions];
            }); }); };
        });
        it('returns empty versions when the stream was deleted by vendor', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolveHistoryStream.mockResolvedValue({
                            _id: 'stream-1',
                            isDeleted: true,
                        });
                        return [4 /*yield*/, service.getDocumentHistory({
                                urnNo: 'URN-1',
                                sectionKey: 'product_design',
                                slotKey: 'eco_vision_upload',
                                processType: 'initial',
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.versions).toEqual([]);
                        expect(docVersionFind).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('excludes deleted version rows from history', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sort, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolveHistoryStream.mockResolvedValue({
                            _id: 'stream-1',
                            isDeleted: false,
                        });
                        sort = jest.fn().mockReturnValue({
                            lean: jest.fn().mockReturnValue({
                                exec: jest.fn().mockResolvedValue([
                                    { versionNo: 1, action: 'added', filePath: 'uploads/a.pdf' },
                                ]),
                            }),
                        });
                        docVersionFind.mockReturnValue({ sort: sort });
                        return [4 /*yield*/, service.getDocumentHistory({
                                urnNo: 'URN-1',
                                sectionKey: 'product_design',
                                slotKey: 'eco_vision_upload',
                                processType: 'initial',
                            })];
                    case 1:
                        result = _a.sent();
                        expect(docVersionFind).toHaveBeenCalledWith({
                            streamId: 'stream-1',
                            action: { $ne: 'deleted' },
                        });
                        expect(result.versions).toEqual([
                            { versionNo: 1, action: 'added', filePath: 'uploads/a.pdf' },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('filterRenewHistoryVersions', function () {
        var filterRenewHistoryVersions = document_versioning_service_1.DocumentVersioningService.prototype.filterRenewHistoryVersions.bind(service);
        beforeEach(function () {
            service.normalizeDocPath = function (value) {
                return value.trim().replace(/\\/g, '/').toLowerCase();
            };
        });
        it('excludes deleted renew document paths even when renewalCycleId is null on row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var versions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service.renewDocumentModel = {
                            find: jest.fn().mockReturnValue({
                                select: jest.fn().mockReturnValue({
                                    lean: jest.fn().mockReturnValue({
                                        exec: jest.fn().mockResolvedValue([
                                            {
                                                documentLink: 'uploads/deleted.pdf',
                                                productDocumentId: 10,
                                                isDeleted: true,
                                            },
                                        ]),
                                    }),
                                }),
                            }),
                        };
                        versions = [
                            { filePath: 'uploads/deleted.pdf', action: 'added' },
                            { filePath: 'uploads/active.xlsx', action: 'added' },
                        ];
                        return [4 /*yield*/, filterRenewHistoryVersions({
                                urnNo: 'URN-1',
                                sectionKey: 'product_performance',
                                processType: 'renewal',
                                renewalCycleId: '507f1f77bcf86cd799439011',
                            }, versions)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([{ filePath: 'uploads/active.xlsx', action: 'added' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('scopes legacy subsection stream history to active anchor document only', function () { return __awaiter(void 0, void 0, void 0, function () {
            var findMock, versions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findMock = jest
                            .fn()
                            .mockReturnValueOnce({
                            select: jest.fn().mockReturnValue({
                                lean: jest.fn().mockReturnValue({
                                    exec: jest.fn().mockResolvedValue([
                                        { documentLink: 'uploads/deleted.pdf', isDeleted: true },
                                    ]),
                                }),
                            }),
                        })
                            .mockReturnValueOnce({
                            select: jest.fn().mockReturnValue({
                                lean: jest.fn().mockReturnValue({
                                    exec: jest.fn().mockResolvedValue([
                                        {
                                            documentLink: 'uploads/active.pdf',
                                            isDeleted: false,
                                            productDocumentId: 42,
                                        },
                                    ]),
                                }),
                            }),
                        });
                        service.renewDocumentModel = { find: findMock };
                        versions = [
                            { filePath: 'uploads/deleted.pdf', action: 'added' },
                            { filePath: 'uploads/active.pdf', action: 'added' },
                            { filePath: 'uploads/other.xlsx', action: 'added' },
                        ];
                        return [4 /*yield*/, filterRenewHistoryVersions({
                                urnNo: 'URN-1',
                                sectionKey: 'product_performance',
                                processType: 'renewal',
                                renewalCycleId: '507f1f77bcf86cd799439011',
                                anchorProductDocumentId: 42,
                            }, versions)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([{ filePath: 'uploads/active.pdf', action: 'added' }]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getLatestDocumentMetadata', function () {
        it('throws when stream was deleted by vendor', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findStreamOrThrow.mockResolvedValue({
                            _id: 'stream-1',
                            isDeleted: true,
                        });
                        return [4 /*yield*/, expect(service.getLatestDocumentMetadata({
                                urnNo: 'URN-1',
                                sectionKey: 'product_design',
                                slotKey: 'eco_vision_upload',
                                processType: 'renewal',
                                renewalCycleId: 'cycle-1',
                            })).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
