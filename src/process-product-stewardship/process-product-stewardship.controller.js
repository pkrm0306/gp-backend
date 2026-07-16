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
exports.ProcessProductStewardshipController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var ProcessProductStewardshipController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Process Product Stewardship'), (0, common_1.Controller)('process-product-stewardship'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var ProcessProductStewardshipController = _classThis = /** @class */ (function () {
        function ProcessProductStewardshipController_1(processProductStewardshipService) {
            this.processProductStewardshipService = (__runInitializers(this, _instanceExtraInitializers), processProductStewardshipService);
        }
        ProcessProductStewardshipController_1.prototype.create = function (user, body, files, req) {
            return __awaiter(this, void 0, void 0, function () {
                var dto, seaSupportingDocumentsFiles, qmSupportingDocumentsFiles, eprSupportingDocumentsFiles, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId))
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            dto = {
                                urnNo: body.urnNo,
                                programmeDetails: this.parseProgrammeDetails(body.programmeDetails),
                                qualityManagementDetails: body.qualityManagementDetails,
                                eprImplementedDetails: body.eprImplementedDetails,
                                eprGreenPackagingDetails: body.eprGreenPackagingDetails,
                                productStewardshipStatus: body.productStewardshipStatus
                                    ? parseInt(body.productStewardshipStatus, 10)
                                    : undefined,
                                seaSupportingDocumentsFileName: body.seaSupportingDocumentsFileName,
                                qmSupportingDocumentsFileName: body.qmSupportingDocumentsFileName,
                                eprSupportingDocumentsFileName: body.eprSupportingDocumentsFileName,
                            };
                            seaSupportingDocumentsFiles = (files || []).filter(function (f) { return f.fieldname === 'seaSupportingDocumentsFile'; });
                            qmSupportingDocumentsFiles = (files || []).filter(function (f) { return f.fieldname === 'qmSupportingDocumentsFile'; });
                            eprSupportingDocumentsFiles = (files || []).filter(function (f) { return f.fieldname === 'eprSupportingDocumentsFile'; });
                            // Validate file names if files are uploaded
                            if (seaSupportingDocumentsFiles.length > 0 &&
                                (!dto.seaSupportingDocumentsFileName ||
                                    dto.seaSupportingDocumentsFileName.trim() === '')) {
                                throw new common_1.BadRequestException('seaSupportingDocumentsFileName is required when uploading seaSupportingDocumentsFile');
                            }
                            if (qmSupportingDocumentsFiles.length > 0 &&
                                (!dto.qmSupportingDocumentsFileName ||
                                    dto.qmSupportingDocumentsFileName.trim() === '')) {
                                throw new common_1.BadRequestException('qmSupportingDocumentsFileName is required when uploading qmSupportingDocumentsFile');
                            }
                            if (eprSupportingDocumentsFiles.length > 0 &&
                                (!dto.eprSupportingDocumentsFileName ||
                                    dto.eprSupportingDocumentsFileName.trim() === '')) {
                                throw new common_1.BadRequestException('eprSupportingDocumentsFileName is required when uploading eprSupportingDocumentsFile');
                            }
                            return [4 /*yield*/, this.processProductStewardshipService.createProcessProductStewardship(dto, user.vendorId, seaSupportingDocumentsFiles, qmSupportingDocumentsFiles, eprSupportingDocumentsFiles)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        ProcessProductStewardshipController_1.prototype.parseProgrammeDetails = function (raw) {
            if (raw === undefined || raw === null || raw === '') {
                return undefined;
            }
            if (Array.isArray(raw)) {
                return raw.map(function (row) {
                    var _a, _b;
                    return ({
                        programmeDetails: String((_a = row === null || row === void 0 ? void 0 : row.programmeDetails) !== null && _a !== void 0 ? _a : ''),
                        numberOfPrograms: String((_b = row === null || row === void 0 ? void 0 : row.numberOfPrograms) !== null && _b !== void 0 ? _b : ''),
                    });
                });
            }
            if (typeof raw === 'string') {
                try {
                    var parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        return parsed.map(function (row) {
                            var _a, _b;
                            return ({
                                programmeDetails: String((_a = row === null || row === void 0 ? void 0 : row.programmeDetails) !== null && _a !== void 0 ? _a : ''),
                                numberOfPrograms: String((_b = row === null || row === void 0 ? void 0 : row.numberOfPrograms) !== null && _b !== void 0 ? _b : ''),
                            });
                        });
                    }
                }
                catch (_a) {
                    // keep controller error friendly for malformed multipart JSON field
                }
                throw new common_1.BadRequestException('programmeDetails must be a JSON array string');
            }
            throw new common_1.BadRequestException('programmeDetails must be a JSON array string');
        };
        return ProcessProductStewardshipController_1;
    }());
    __setFunctionName(_classThis, "ProcessProductStewardshipController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_universal_config_1.certificationMultipartMemoryMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Create process product stewardship data',
                description: 'Creates process product stewardship data with file uploads. Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Only PDF and Excel (.pdf, .xls, .xlsx) uploads are allowed.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['urnNo'],
                    properties: {
                        urnNo: {
                            type: 'string',
                            description: 'URN number',
                            example: 'URN-20260305124230',
                        },
                        programmeDetails: {
                            type: 'string',
                            description: 'JSON string array: [{ programmeDetails, numberOfPrograms }]',
                            example: '[{"programmeDetails":"Training programme for channel partners","numberOfPrograms":"4"}]',
                        },
                        qualityManagementDetails: {
                            type: 'string',
                            description: 'Quality management details (text)',
                            example: 'Quality management implementation details',
                        },
                        eprImplementedDetails: {
                            type: 'string',
                            description: 'EPR implemented details (text)',
                            example: 'EPR implementation details',
                        },
                        eprGreenPackagingDetails: {
                            type: 'string',
                            description: 'EPR green packaging details (text)',
                            example: 'EPR green packaging details',
                        },
                        productStewardshipStatus: {
                            type: 'number',
                            description: 'Product stewardship status (0=Pending, 1=Completed)',
                            example: 0,
                            enum: [0, 1],
                        },
                        seaSupportingDocumentsFileName: {
                            type: 'string',
                            description: 'SEA supporting documents display name (required if uploading seaSupportingDocumentsFile)',
                            example: 'SEA Supporting Documents - March 2026',
                        },
                        qmSupportingDocumentsFileName: {
                            type: 'string',
                            description: 'Quality Management supporting documents display name (required if uploading qmSupportingDocumentsFile)',
                            example: 'Quality Management Supporting Documents - March 2026',
                        },
                        eprSupportingDocumentsFileName: {
                            type: 'string',
                            description: 'EPR supporting documents display name (required if uploading eprSupportingDocumentsFile)',
                            example: 'EPR Supporting Documents - March 2026',
                        },
                        seaSupportingDocumentsFile: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                            description: 'SEA supporting documents files (multiple supported)',
                        },
                        qmSupportingDocumentsFile: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                            description: 'Quality Management supporting documents files (multiple supported)',
                        },
                        eprSupportingDocumentsFile: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                            description: 'EPR supporting documents files (multiple supported)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Process product stewardship created successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                processProductStewardshipId: { type: 'number' },
                                vendorId: { type: 'string' },
                                urnNo: { type: 'string' },
                                seaSupportingDocuments: { type: 'number' },
                                qualityManagementDetails: { type: 'string' },
                                qmSupportingDocuments: { type: 'number' },
                                eprImplementedDetails: { type: 'string' },
                                eprGreenPackagingDetails: { type: 'string' },
                                eprSupportingDocuments: { type: 'number' },
                                productStewardshipStatus: { type: 'number' },
                                createdDate: { type: 'string', format: 'date-time' },
                                updatedDate: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessProductStewardshipController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessProductStewardshipController = _classThis;
}();
exports.ProcessProductStewardshipController = ProcessProductStewardshipController;
