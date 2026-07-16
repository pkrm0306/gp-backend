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
exports.DocumentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var DocumentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Documents'), (0, common_1.Controller)('documents'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDocumentHistory_decorators;
    var _getLatestDocumentMetadata_decorators;
    var _deleteDocument_decorators;
    var DocumentsController = _classThis = /** @class */ (function () {
        function DocumentsController_1(documentsService, documentVersioningService, renewDocumentsService) {
            this.documentsService = (__runInitializers(this, _instanceExtraInitializers), documentsService);
            this.documentVersioningService = documentVersioningService;
            this.renewDocumentsService = renewDocumentsService;
        }
        DocumentsController_1.prototype.getDocumentHistory = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentVersioningService.getDocumentHistory(query)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Document history fetched successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        DocumentsController_1.prototype.getLatestDocumentMetadata = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentVersioningService.getLatestDocumentMetadata(query)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Latest document metadata fetched successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        DocumentsController_1.prototype.deleteDocument = function (user, params, query) {
            return __awaiter(this, void 0, void 0, function () {
                var actorId, data_1, data;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!(query.processType === 'renewal')) return [3 /*break*/, 2];
                            actorId = (_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.manufacturerId) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user.userId) !== null && _c !== void 0 ? _c : user === null || user === void 0 ? void 0 : user.sub;
                            if (!actorId) {
                                throw new common_1.BadRequestException('Unable to resolve user for document delete');
                            }
                            return [4 /*yield*/, this.renewDocumentsService.softDeleteDocument(params.documentId, {
                                    urnNo: query.urnNo,
                                    sectionKey: (_d = query.sectionKey) !== null && _d !== void 0 ? _d : '',
                                    renewalCycleId: (_e = query.renewalCycleId) !== null && _e !== void 0 ? _e : '',
                                }, String(actorId))];
                        case 1:
                            data_1 = _f.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Document deleted successfully',
                                    data: data_1,
                                }];
                        case 2:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            return [4 /*yield*/, this.documentsService.softDeleteDocument(params.documentId, user.vendorId, query)];
                        case 3:
                            data = _f.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Document deleted successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return DocumentsController_1;
    }());
    __setFunctionName(_classThis, "DocumentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDocumentHistory_decorators = [(0, common_1.Get)('history'), (0, swagger_1.ApiOperation)({ summary: 'Get document version history for a stream' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document history returned' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document stream not found' })];
        _getLatestDocumentMetadata_decorators = [(0, common_1.Get)('latest-metadata'), (0, swagger_1.ApiOperation)({ summary: 'Get latest document version metadata for a stream' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest document metadata returned' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document stream not found' })];
        _deleteDocument_decorators = [(0, common_1.Delete)(':documentId'), (0, swagger_1.ApiOperation)({
                summary: 'Soft-delete a section document',
                description: 'Certification: vendor-owned row in all_product_documents (urnNo required). ' +
                    'Renewal: pass processType=renewal, renewalCycleId, and sectionKey for all_renew_product_documents.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Document deleted successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Document deleted successfully' },
                        data: {
                            type: 'object',
                            properties: {
                                documentId: { type: 'number', example: 1001 },
                                urnNo: { type: 'string', example: 'URN-20260305124230' },
                                sectionKey: { type: 'string', example: 'product_design' },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad input' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized ownership' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found for URN' })];
        __esDecorate(_classThis, null, _getDocumentHistory_decorators, { kind: "method", name: "getDocumentHistory", static: false, private: false, access: { has: function (obj) { return "getDocumentHistory" in obj; }, get: function (obj) { return obj.getDocumentHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLatestDocumentMetadata_decorators, { kind: "method", name: "getLatestDocumentMetadata", static: false, private: false, access: { has: function (obj) { return "getLatestDocumentMetadata" in obj; }, get: function (obj) { return obj.getLatestDocumentMetadata; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteDocument_decorators, { kind: "method", name: "deleteDocument", static: false, private: false, access: { has: function (obj) { return "deleteDocument" in obj; }, get: function (obj) { return obj.deleteDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentsController = _classThis;
}();
exports.DocumentsController = DocumentsController;
