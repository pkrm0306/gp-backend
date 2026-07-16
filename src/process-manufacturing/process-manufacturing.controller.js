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
exports.ProcessManufacturingController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var parse_optional_number_util_1 = require("../common/utils/parse-optional-number.util");
var process_manufacturing_upload_util_1 = require("./process-manufacturing-upload.util");
var ProcessManufacturingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Process Manufacturing'), (0, common_1.Controller)('process-manufacturing'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var ProcessManufacturingController = _classThis = /** @class */ (function () {
        function ProcessManufacturingController_1(processManufacturingService) {
            this.processManufacturingService = (__runInitializers(this, _instanceExtraInitializers), processManufacturingService);
        }
        ProcessManufacturingController_1.prototype.create = function (user, body, files, req) {
            return __awaiter(this, void 0, void 0, function () {
                var dto, _a, energyConservationFiles, energyConsumptionFiles, urnNo, retainedDocumentCount, data;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId))
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            dto = {
                                urnNo: body.urnNo,
                                portableWaterDemand: body.portableWaterDemand,
                                rainWaterHarvesting: body.rainWaterHarvesting,
                                beyondTheFenceInitiatives: body.beyondTheFenceInitiatives,
                                totalEnergyConsumption: (0, parse_optional_number_util_1.parseOptionalDecimalNumber)(body.totalEnergyConsumption),
                                processManufacturingStatus: body.processManufacturingStatus
                                    ? parseInt(body.processManufacturingStatus, 10)
                                    : undefined,
                                energyConservationSupportingDocumentsFileName: body.energyConservationSupportingDocumentsFileName,
                                energyConsumptionDocumentsFileName: body.energyConsumptionDocumentsFileName,
                            };
                            _a = (0, process_manufacturing_upload_util_1.collectProcessManufacturingUploadFiles)(files), energyConservationFiles = _a.energyConservationFiles, energyConsumptionFiles = _a.energyConsumptionFiles;
                            // Validate file names if files are uploaded
                            if (energyConservationFiles.length > 0 &&
                                (!dto.energyConservationSupportingDocumentsFileName ||
                                    dto.energyConservationSupportingDocumentsFileName.trim() === '')) {
                                throw new common_1.BadRequestException('energyConservationSupportingDocumentsFileName is required when uploading energyConservationSupportingDocumentsFile');
                            }
                            if (energyConsumptionFiles.length > 0 &&
                                (!dto.energyConsumptionDocumentsFileName ||
                                    dto.energyConsumptionDocumentsFileName.trim() === '')) {
                                throw new common_1.BadRequestException('energyConsumptionDocumentsFileName is required when uploading energyConsumptionDocumentsFile');
                            }
                            if (dto.totalEnergyConsumption !== undefined &&
                                dto.totalEnergyConsumption < 0) {
                                throw new common_1.BadRequestException('Total energy consumption cannot be negative');
                            }
                            urnNo = String((_b = dto.urnNo) !== null && _b !== void 0 ? _b : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.processManufacturingService.countRetainedProcessManufacturingDocuments(urnNo, user.vendorId)];
                        case 1:
                            retainedDocumentCount = _c.sent();
                            (0, process_manufacturing_upload_util_1.assertAtLeastOneProcessManufacturingField)({
                                portableWaterDemand: dto.portableWaterDemand,
                                rainWaterHarvesting: dto.rainWaterHarvesting,
                                beyondTheFenceInitiatives: dto.beyondTheFenceInitiatives,
                                totalEnergyConsumption: dto.totalEnergyConsumption,
                                energyConservationFiles: energyConservationFiles,
                                energyConsumptionFiles: energyConsumptionFiles,
                                retainedDocumentCount: retainedDocumentCount,
                            });
                            return [4 /*yield*/, this.processManufacturingService.createProcessManufacturing(dto, user.vendorId, energyConservationFiles, energyConsumptionFiles)];
                        case 2:
                            data = _c.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        return ProcessManufacturingController_1;
    }());
    __setFunctionName(_classThis, "ProcessManufacturingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_universal_config_1.certificationMultipartMemoryMulterOptions)())), (0, swagger_1.ApiOperation)({
                summary: 'Create process manufacturing data',
                description: 'Creates process manufacturing data with file uploads. Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Only PDF and Excel (.pdf, .xls, .xlsx) uploads are allowed.',
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
                        portableWaterDemand: {
                            type: 'string',
                            description: 'Portable water demand (text)',
                            example: 'Water demand details',
                        },
                        rainWaterHarvesting: {
                            type: 'string',
                            description: 'Rain water harvesting (text)',
                            example: 'Rain water harvesting details',
                        },
                        beyondTheFenceInitiatives: {
                            type: 'string',
                            description: 'Beyond the fence initiatives (text)',
                            example: 'Beyond the fence initiatives details',
                        },
                        totalEnergyConsumption: {
                            type: 'number',
                            description: 'Total energy consumption',
                            example: 5000,
                        },
                        processManufacturingStatus: {
                            type: 'number',
                            description: 'Process manufacturing status (0=Pending, 1=Completed)',
                            example: 0,
                            enum: [0, 1],
                        },
                        energyConservationSupportingDocumentsFileName: {
                            type: 'string',
                            description: 'Energy conservation supporting documents display name (required if uploading energyConservationSupportingDocumentsFile)',
                            example: 'Energy Conservation Supporting Documents - March 2026',
                        },
                        energyConsumptionDocumentsFileName: {
                            type: 'string',
                            description: 'Energy consumption documents display name (required if uploading energyConsumptionDocumentsFile)',
                            example: 'Energy Consumption Documents - March 2026',
                        },
                        energyConservationSupportingDocumentsFile: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                            description: 'Energy conservation supporting documents files (multiple supported)',
                        },
                        energyConsumptionDocumentsFile: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                            description: 'Energy consumption documents files (multiple supported)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Process manufacturing created successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                processManufacturingId: { type: 'number' },
                                vendorId: { type: 'string' },
                                urnNo: { type: 'string' },
                                energyConservationSupportingDocuments: { type: 'number' },
                                portableWaterDemand: { type: 'string' },
                                rainWaterHarvesting: { type: 'string' },
                                beyondTheFenceInitiatives: { type: 'string' },
                                totalEnergyConsumption: { type: 'number' },
                                energyConsumptionDocuments: { type: 'number' },
                                processManufacturingStatus: { type: 'number' },
                                createdDate: { type: 'string', format: 'date-time' },
                                updatedDate: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessManufacturingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessManufacturingController = _classThis;
}();
exports.ProcessManufacturingController = ProcessManufacturingController;
