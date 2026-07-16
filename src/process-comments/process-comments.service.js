"use strict";
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
exports.ProcessCommentsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var ProcessCommentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessCommentsService = _classThis = /** @class */ (function () {
        function ProcessCommentsService_1(processCommentsModel, sequenceHelper) {
            this.processCommentsModel = processCommentsModel;
            this.sequenceHelper = sequenceHelper;
        }
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessCommentsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        /**
         * Create or update process comments
         * Uses upsert to update existing record or create new one based on urnNo and vendorId
         */
        ProcessCommentsService_1.prototype.upsertProcessComments = function (createProcessCommentsDto, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, now, existingRecord, processCommentsId, updateData, updatedRecord, processCommentsData, newRecord, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processCommentsModel
                                    .findOne({
                                    urnNo: createProcessCommentsDto.urnNo,
                                    vendorId: vendorObjectId,
                                })
                                    .exec()];
                        case 1:
                            existingRecord = _a.sent();
                            processCommentsId = void 0;
                            if (!existingRecord) return [3 /*break*/, 3];
                            // Update existing record
                            processCommentsId = existingRecord.processCommentsId;
                            updateData = {
                                updatedDate: now,
                            };
                            // Only update fields that are provided in DTO
                            if (createProcessCommentsDto.productDesign !== undefined) {
                                updateData.productDesign = createProcessCommentsDto.productDesign;
                            }
                            if (createProcessCommentsDto.productPerformance !== undefined) {
                                updateData.productPerformance =
                                    createProcessCommentsDto.productPerformance;
                            }
                            if (createProcessCommentsDto.manfacturingProcess !== undefined) {
                                updateData.manfacturingProcess =
                                    createProcessCommentsDto.manfacturingProcess;
                            }
                            if (createProcessCommentsDto.wasteManagement !== undefined) {
                                updateData.wasteManagement = createProcessCommentsDto.wasteManagement;
                            }
                            if (createProcessCommentsDto.lifeCycleApproach !== undefined) {
                                updateData.lifeCycleApproach =
                                    createProcessCommentsDto.lifeCycleApproach;
                            }
                            if (createProcessCommentsDto.productStewardship !== undefined) {
                                updateData.productStewardship =
                                    createProcessCommentsDto.productStewardship;
                            }
                            if (createProcessCommentsDto.productInnovation !== undefined) {
                                updateData.productInnovation =
                                    createProcessCommentsDto.productInnovation;
                            }
                            if (createProcessCommentsDto.rawMaterials31 !== undefined) {
                                updateData.rawMaterials31 = createProcessCommentsDto.rawMaterials31;
                            }
                            if (createProcessCommentsDto.rawMaterials32 !== undefined) {
                                updateData.rawMaterials32 = createProcessCommentsDto.rawMaterials32;
                            }
                            if (createProcessCommentsDto.rawMaterials33 !== undefined) {
                                updateData.rawMaterials33 = createProcessCommentsDto.rawMaterials33;
                            }
                            if (createProcessCommentsDto.rawMaterials34 !== undefined) {
                                updateData.rawMaterials34 = createProcessCommentsDto.rawMaterials34;
                            }
                            if (createProcessCommentsDto.rawMaterials35 !== undefined) {
                                updateData.rawMaterials35 = createProcessCommentsDto.rawMaterials35;
                            }
                            if (createProcessCommentsDto.rawMaterials36 !== undefined) {
                                updateData.rawMaterials36 = createProcessCommentsDto.rawMaterials36;
                            }
                            if (createProcessCommentsDto.rawMaterials37 !== undefined) {
                                updateData.rawMaterials37 = createProcessCommentsDto.rawMaterials37;
                            }
                            if (createProcessCommentsDto.rawMaterials38 !== undefined) {
                                updateData.rawMaterials38 = createProcessCommentsDto.rawMaterials38;
                            }
                            if (createProcessCommentsDto.rawMaterials39 !== undefined) {
                                updateData.rawMaterials39 = createProcessCommentsDto.rawMaterials39;
                            }
                            if (createProcessCommentsDto.rawMaterials310 !== undefined) {
                                updateData.rawMaterials310 = createProcessCommentsDto.rawMaterials310;
                            }
                            if (createProcessCommentsDto.rawMaterials311 !== undefined) {
                                updateData.rawMaterials311 = createProcessCommentsDto.rawMaterials311;
                            }
                            if (createProcessCommentsDto.rawMaterials312 !== undefined) {
                                updateData.rawMaterials312 = createProcessCommentsDto.rawMaterials312;
                            }
                            if (createProcessCommentsDto.rawMaterials313 !== undefined) {
                                updateData.rawMaterials313 = createProcessCommentsDto.rawMaterials313;
                            }
                            if (createProcessCommentsDto.rawMaterials314 !== undefined) {
                                updateData.rawMaterials314 = createProcessCommentsDto.rawMaterials314;
                            }
                            if (createProcessCommentsDto.rawMaterials315 !== undefined) {
                                updateData.rawMaterials315 = createProcessCommentsDto.rawMaterials315;
                            }
                            return [4 /*yield*/, this.processCommentsModel
                                    .findOneAndUpdate({
                                    urnNo: createProcessCommentsDto.urnNo,
                                    vendorId: vendorObjectId,
                                }, { $set: updateData }, { new: true })
                                    .exec()];
                        case 2:
                            updatedRecord = _a.sent();
                            if (!updatedRecord) {
                                throw new common_1.InternalServerErrorException('Failed to update process comments');
                            }
                            return [2 /*return*/, updatedRecord];
                        case 3: return [4 /*yield*/, this.sequenceHelper.getProcessCommentsId()];
                        case 4:
                            // Create new record
                            processCommentsId = _a.sent();
                            processCommentsData = {
                                processCommentsId: processCommentsId,
                                urnNo: createProcessCommentsDto.urnNo,
                                vendorId: vendorObjectId,
                                productDesign: createProcessCommentsDto.productDesign || '',
                                productPerformance: createProcessCommentsDto.productPerformance || '',
                                manfacturingProcess: createProcessCommentsDto.manfacturingProcess || '',
                                wasteManagement: createProcessCommentsDto.wasteManagement || '',
                                lifeCycleApproach: createProcessCommentsDto.lifeCycleApproach || '',
                                productStewardship: createProcessCommentsDto.productStewardship || '',
                                productInnovation: createProcessCommentsDto.productInnovation || '',
                                rawMaterials31: createProcessCommentsDto.rawMaterials31 || '',
                                rawMaterials32: createProcessCommentsDto.rawMaterials32 || '',
                                rawMaterials33: createProcessCommentsDto.rawMaterials33 || '',
                                rawMaterials34: createProcessCommentsDto.rawMaterials34 || '',
                                rawMaterials35: createProcessCommentsDto.rawMaterials35 || '',
                                rawMaterials36: createProcessCommentsDto.rawMaterials36 || '',
                                rawMaterials37: createProcessCommentsDto.rawMaterials37 || '',
                                rawMaterials38: createProcessCommentsDto.rawMaterials38 || '',
                                rawMaterials39: createProcessCommentsDto.rawMaterials39 || '',
                                rawMaterials310: createProcessCommentsDto.rawMaterials310 || '',
                                rawMaterials311: createProcessCommentsDto.rawMaterials311 || '',
                                rawMaterials312: createProcessCommentsDto.rawMaterials312 || '',
                                rawMaterials313: createProcessCommentsDto.rawMaterials313 || '',
                                rawMaterials314: createProcessCommentsDto.rawMaterials314 || '',
                                rawMaterials315: createProcessCommentsDto.rawMaterials315 || '',
                                updatedDate: now,
                            };
                            newRecord = new this.processCommentsModel(processCommentsData);
                            return [4 /*yield*/, newRecord.save()];
                        case 5: return [2 /*return*/, _a.sent()];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            console.error('[Process Comments] Upsert error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message || 'Failed to save process comments.');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get process comments by URN and vendor ID
         */
        ProcessCommentsService_1.prototype.getByUrnAndVendor = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.processCommentsModel
                                    .findOne({
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                })
                                    .exec()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            console.error('[Process Comments] Get error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to get process comments.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessCommentsService_1;
    }());
    __setFunctionName(_classThis, "ProcessCommentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessCommentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessCommentsService = _classThis;
}();
exports.ProcessCommentsService = ProcessCommentsService;
