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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMpManufacturingUnitsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var mp_manufacturing_unit_numeric_fields_util_1 = require("./utils/mp-manufacturing-unit-numeric-fields.util");
var mp_energy_consumption_calculations_util_1 = require("./utils/mp-energy-consumption-calculations.util");
var ProcessMpManufacturingUnitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessMpManufacturingUnitsService = _classThis = /** @class */ (function () {
        function ProcessMpManufacturingUnitsService_1(model, sequenceHelper) {
            this.model = model;
            this.sequenceHelper = sequenceHelper;
        }
        ProcessMpManufacturingUnitsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessMpManufacturingUnitsService_1.prototype.normalizeForSignature = function (value) {
            if (value === undefined || value === null)
                return '';
            if (typeof value === 'string')
                return value.trim();
            return String(value);
        };
        ProcessMpManufacturingUnitsService_1.prototype.unitSignature = function (payload) {
            var _this = this;
            var keys = [
                'unitName',
                'renewableEnergyUtilization',
                'ecdYear1',
                'ecdYear2',
                'ecdYear3',
                'ecdProductionUnit',
                'ecdProductionYear1',
                'ecdProductionYear2',
                'ecdProductionYear3',
                'ecdElectricUnit',
                'ecdElectricYear1',
                'ecdElectricYear2',
                'ecdElectricYear3',
                'ecdThermalUnitFuel1',
                'ecdThermalUnitFuel2',
                'ecdThermalUnitFuel3',
                'ecdThermalFuel1Year1',
                'ecdThermalFuel1Year2',
                'ecdThermalFuel1Year3',
                'ecdThermalFuel2Year1',
                'ecdThermalFuel2Year2',
                'ecdThermalFuel2Year3',
                'ecdThermalFuel3Year1',
                'ecdThermalFuel3Year2',
                'ecdThermalFuel3Year3',
                'ecdCalorificFuel1Year1',
                'ecdCalorificFuel1Year2',
                'ecdCalorificFuel1Year3',
                'ecdCalorificFuel2Year1',
                'ecdCalorificFuel2Year2',
                'ecdCalorificFuel2Year3',
                'ecdCalorificFuel3Year1',
                'ecdCalorificFuel3Year2',
                'ecdCalorificFuel3Year3',
                'ecdTextareaNewUnits',
                'wcdYear1',
                'wcdYear2',
                'wcdYear3',
                'wcdProductionUnit',
                'wcdWaterUnit',
                'wcdProductionYear1',
                'wcdProductionYear2',
                'wcdProductionYear3',
                'wcdWaterYear1',
                'wcdWaterYear2',
                'wcdWaterYear3',
                'reYear',
                'reSolarPhotovoltaic',
                'reWind',
                'reBiomass',
                'reSolarThermal',
                'reOthersUnit',
                'reOthers',
                'offsiteRenewablePower',
                'processMpManufacturingUnitStatus',
                'measuresImplementedMpUnits',
                'detailsOfRainWaterHarvestingMpUnits',
            ];
            return keys
                .map(function (key) { return "".concat(key, ":").concat(_this.normalizeForSignature(payload[key])); })
                .join('|');
        };
        ProcessMpManufacturingUnitsService_1.prototype.buildUnitPayload = function (dto, urnNo) {
            var _a, _b;
            var _id = dto.processMpManufacturingUnitId, _sec = dto.calculateBulkSec, _secMultipled = dto.calculateBulkSecMultipled, _swc = dto.calculateBulkSwc, _swcMultipled = dto.calculateBulkSwcMultipled, _stec = dto.calculateBulkStec, _stecMultipled = dto.calculateBulkStecMultipled, _tecMultipled = dto.calculateBulkTecMultipled, fields = __rest(dto, ["processMpManufacturingUnitId", "calculateBulkSec", "calculateBulkSecMultipled", "calculateBulkSwc", "calculateBulkSwcMultipled", "calculateBulkStec", "calculateBulkStecMultipled", "calculateBulkTecMultipled"]);
            var payload = (0, mp_energy_consumption_calculations_util_1.normalizeMpManufacturingUnitEnergyInputs)(__assign(__assign({}, fields), { urnNo: urnNo, offsiteRenewablePower: (_a = dto.offsiteRenewablePower) !== null && _a !== void 0 ? _a : null, processMpManufacturingUnitStatus: (_b = dto.processMpManufacturingUnitStatus) !== null && _b !== void 0 ? _b : 0 }));
            return (0, mp_energy_consumption_calculations_util_1.enrichMpManufacturingUnitCalculations)(payload);
        };
        ProcessMpManufacturingUnitsService_1.prototype.persistCalculatedEnergyFields = function (rowId, payload, updatedAt) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.model
                                .updateOne({ _id: rowId }, {
                                $set: __assign(__assign({}, (0, mp_energy_consumption_calculations_util_1.pickPersistedEnergyCalculationFields)(payload)), { updatedDate: updatedAt }),
                            })
                                .exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProcessMpManufacturingUnitsService_1.prototype.enrichUnitRow = function (row) {
            var plain = typeof row.toObject === 'function'
                ? row.toObject()
                : __assign({}, row);
            return (0, mp_energy_consumption_calculations_util_1.enrichMpManufacturingUnitCalculations)(plain);
        };
        ProcessMpManufacturingUnitsService_1.prototype.create = function (dto, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, now, urnNo, incomingPayload, updated, id, incomingSignature_1, existingRows, duplicateRow, doc, _a, error_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 9, , 10]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            urnNo = dto.urnNo.trim();
                            incomingPayload = this.buildUnitPayload(dto, urnNo);
                            (0, mp_manufacturing_unit_numeric_fields_util_1.assertMpManufacturingUnitNonNegativeNumbers)(incomingPayload);
                            if (!(dto.processMpManufacturingUnitId != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({
                                    processMpManufacturingUnitId: dto.processMpManufacturingUnitId,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                }, { $set: __assign(__assign({}, incomingPayload), { updatedDate: now }) }, { new: true })
                                    .exec()];
                        case 1:
                            updated = _b.sent();
                            if (!updated) {
                                throw new common_1.BadRequestException("Manufacturing unit ".concat(dto.processMpManufacturingUnitId, " not found for URN ").concat(urnNo));
                            }
                            return [4 /*yield*/, this.persistCalculatedEnergyFields(updated._id, incomingPayload, now)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, this.enrichUnitRow(__assign(__assign({}, updated.toObject()), incomingPayload))];
                        case 3: return [4 /*yield*/, this.sequenceHelper.getProcessMpManufacturingUnitId()];
                        case 4:
                            id = _b.sent();
                            incomingSignature_1 = this.unitSignature(incomingPayload);
                            return [4 /*yield*/, this.model.find({ urnNo: urnNo, vendorId: vendorObjectId }).exec()];
                        case 5:
                            existingRows = _b.sent();
                            duplicateRow = existingRows.find(function (row) { return _this.unitSignature(row.toObject()) === incomingSignature_1; });
                            if (!duplicateRow) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.persistCalculatedEnergyFields(duplicateRow._id, incomingPayload, now)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, this.enrichUnitRow(__assign(__assign({}, duplicateRow.toObject()), incomingPayload))];
                        case 7:
                            doc = new this.model(__assign(__assign({ processMpManufacturingUnitId: id, vendorId: vendorObjectId }, incomingPayload), { createdDate: now, updatedDate: now }));
                            _a = this.enrichUnitRow;
                            return [4 /*yield*/, doc.save()];
                        case 8: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                        case 9:
                            error_1 = _b.sent();
                            if (error_1 instanceof common_1.BadRequestException)
                                throw error_1;
                            console.error('[Process MP Manufacturing Units] Create error:', error_1);
                            throw new common_1.InternalServerErrorException(error_1.message || 'Failed to create manufacturing unit record.');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessMpManufacturingUnitsService_1.prototype.deleteById = function (processMpManufacturingUnitId, urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, deleted, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.model
                                    .findOneAndDelete({
                                    processMpManufacturingUnitId: processMpManufacturingUnitId,
                                    urnNo: trimmedUrn,
                                    vendorId: vendorObjectId,
                                })
                                    .exec()];
                        case 1:
                            deleted = _a.sent();
                            if (!deleted) {
                                throw new common_1.NotFoundException("Manufacturing unit ".concat(processMpManufacturingUnitId, " not found for URN ").concat(trimmedUrn));
                            }
                            return [2 /*return*/, deleted];
                        case 2:
                            error_2 = _a.sent();
                            if (error_2 instanceof common_1.BadRequestException ||
                                error_2 instanceof common_1.NotFoundException) {
                                throw error_2;
                            }
                            console.error('[Process MP Manufacturing Units] Delete error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to delete manufacturing unit record.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessMpManufacturingUnitsService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo, vendorId: vendorObjectId })
                                    .sort({ processMpManufacturingUnitId: 1 })
                                    .exec()];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (row) { return _this.enrichUnitRow(row); })];
                        case 2:
                            error_3 = _a.sent();
                            console.error('[Process MP Manufacturing Units] List error:', error_3);
                            throw new common_1.InternalServerErrorException(error_3.message || 'Failed to list manufacturing unit records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Platform admin: all manufacturing units for a URN (any vendor on that URN). */
        ProcessMpManufacturingUnitsService_1.prototype.listByUrnForAdmin = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, error_4;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            trimmed = urnNo.trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: trimmed })
                                    .sort({ processMpManufacturingUnitId: 1 })
                                    .exec()];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (row) { return _this.enrichUnitRow(row); })];
                        case 2:
                            error_4 = _a.sent();
                            if (error_4 instanceof common_1.BadRequestException)
                                throw error_4;
                            console.error('[Process MP Manufacturing Units] Admin list error:', error_4);
                            throw new common_1.InternalServerErrorException(error_4.message || 'Failed to list manufacturing unit records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessMpManufacturingUnitsService_1;
    }());
    __setFunctionName(_classThis, "ProcessMpManufacturingUnitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessMpManufacturingUnitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessMpManufacturingUnitsService = _classThis;
}();
exports.ProcessMpManufacturingUnitsService = ProcessMpManufacturingUnitsService;
