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
exports.ProcessRenewMpManufacturingUnitsService = void 0;
var common_1 = require("@nestjs/common");
var mp_manufacturing_unit_numeric_fields_util_1 = require("../../process-mp-manufacturing-units/utils/mp-manufacturing-unit-numeric-fields.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var renew_details_format_util_1 = require("../utils/renew-details-format.util");
function readRenewalCycleId(dto) {
    var _a;
    var raw = (_a = dto
        .renewalCycleId) !== null && _a !== void 0 ? _a : dto.renewal_cycle_id;
    var trimmed = String(raw !== null && raw !== void 0 ? raw : '').trim();
    return trimmed || undefined;
}
var ProcessRenewMpManufacturingUnitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewMpManufacturingUnitsService = _classThis = /** @class */ (function () {
        function ProcessRenewMpManufacturingUnitsService_1(model, productModel, renewalCycleModel, sequenceHelper) {
            this.model = model;
            this.productModel = productModel;
            this.renewalCycleModel = renewalCycleModel;
            this.sequenceHelper = sequenceHelper;
        }
        ProcessRenewMpManufacturingUnitsService_1.prototype.normalizeForSignature = function (value) {
            if (value === undefined || value === null)
                return '';
            if (typeof value === 'string')
                return value.trim();
            return String(value);
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.unitSignature = function (payload) {
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
                'calculateBulkSec',
                'calculateBulkSwc',
                'calculateBulkSecMultipled',
                'calculateBulkSwcMultipled',
                'measuresImplementedMpUnits',
                'detailsOfRainWaterHarvestingMpUnits',
            ];
            return keys
                .map(function (key) { return "".concat(key, ":").concat(_this.normalizeForSignature(payload[key])); })
                .join('|');
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.resolveUnitId = function (dto) {
            var renewId = dto
                .processRenewMpManufacturingUnitId;
            return renewId !== null && renewId !== void 0 ? renewId : dto.processMpManufacturingUnitId;
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.buildUnitPayload = function (dto, urnNo) {
            var _a, _b;
            var _c = dto, _mpId = _c.processMpManufacturingUnitId, _urn = _c.urnNo, _renewalCycleId = _c.renewalCycleId, _renewalCycleSnake = _c.renewal_cycle_id, fields = __rest(_c, ["processMpManufacturingUnitId", "urnNo", "renewalCycleId", "renewal_cycle_id"]);
            var _d = fields, _renewId = _d.processRenewMpManufacturingUnitId, unitFields = __rest(_d, ["processRenewMpManufacturingUnitId"]);
            return __assign(__assign({}, unitFields), { urnNo: urnNo, offsiteRenewablePower: (_a = dto.offsiteRenewablePower) !== null && _a !== void 0 ? _a : 0, processMpManufacturingUnitStatus: (_b = dto.processMpManufacturingUnitStatus) !== null && _b !== void 0 ? _b : 0 });
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.formatRow = function (doc) {
            var plain = typeof doc.toObject === 'function'
                ? doc.toObject()
                : __assign({}, doc);
            return (0, renew_details_format_util_1.formatRenewMpManufacturingUnitForDetails)(plain);
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.upsert = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var cycleIdHint, _a, cycle, context, ownership, cycleFilter, renewalCycleObjectId, now, urnNo, incomingPayload, unitId, updated, id, incomingSignature_1, existingRows, duplicateRow, updatedDuplicate, doc, saved, error_1, message;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 9, , 10]);
                            cycleIdHint = readRenewalCycleId(dto);
                            return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, dto.urnNo, cycleIdHint)];
                        case 1:
                            _a = _b.sent(), cycle = _a.cycle, context = _a.context;
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            cycleFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(ownership.urnNo, cycle);
                            renewalCycleObjectId = cycle._id;
                            now = new Date();
                            urnNo = ownership.urnNo;
                            incomingPayload = this.buildUnitPayload(dto, urnNo);
                            (0, mp_manufacturing_unit_numeric_fields_util_1.assertMpManufacturingUnitNonNegativeNumbers)(incomingPayload);
                            unitId = this.resolveUnitId(dto);
                            if (!(unitId != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({
                                    processRenewMpManufacturingUnitId: unitId,
                                    urnNo: urnNo,
                                    vendorId: ownership.vendorId,
                                }, { $set: __assign(__assign({}, incomingPayload), { renewalCycleId: renewalCycleObjectId, updatedDate: now }) }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _b.sent();
                            if (updated) {
                                return [2 /*return*/, this.formatRow(updated)];
                            }
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this.sequenceHelper.getProcessRenewMpManufacturingUnitId()];
                        case 4:
                            id = _b.sent();
                            incomingSignature_1 = this.unitSignature(incomingPayload);
                            return [4 /*yield*/, this.model
                                    .find(__assign(__assign({}, cycleFilter), { vendorId: ownership.vendorId }))
                                    .exec()];
                        case 5:
                            existingRows = _b.sent();
                            duplicateRow = existingRows.find(function (row) {
                                return _this.unitSignature(row.toObject()) ===
                                    incomingSignature_1;
                            });
                            if (!duplicateRow) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({ _id: duplicateRow._id }, { $set: __assign(__assign({}, incomingPayload), { renewalCycleId: renewalCycleObjectId, updatedDate: now }) }, { new: true })
                                    .exec()];
                        case 6:
                            updatedDuplicate = _b.sent();
                            return [2 /*return*/, this.formatRow(updatedDuplicate !== null && updatedDuplicate !== void 0 ? updatedDuplicate : duplicateRow)];
                        case 7:
                            doc = new this.model(__assign(__assign({ processRenewMpManufacturingUnitId: id, vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId }, incomingPayload), { renewalCycleId: renewalCycleObjectId, createdDate: now, updatedDate: now }));
                            return [4 /*yield*/, doc.save()];
                        case 8:
                            saved = _b.sent();
                            return [2 /*return*/, this.formatRow(saved)];
                        case 9:
                            error_1 = _b.sent();
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.ForbiddenException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            message = error_1 instanceof Error ? error_1.message : 'Failed to save renew MP manufacturing unit.';
                            throw new common_1.InternalServerErrorException(message);
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.listByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle, filter, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, (0, renew_cycle_scope_util_1.resolveRenewCycleForQuery)(this.renewalCycleModel, trimmedUrn, renewalCycleId)];
                        case 1:
                            cycle = _a.sent();
                            filter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycle);
                            return [4 /*yield*/, this.model
                                    .find(filter)
                                    .sort({ processRenewMpManufacturingUnitId: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    return (0, renew_details_format_util_1.formatRenewMpManufacturingUnitForDetails)(row);
                                })];
                    }
                });
            });
        };
        ProcessRenewMpManufacturingUnitsService_1.prototype.deleteById = function (unitId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, deleted, error_2, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, urnNo)];
                        case 1:
                            _a.sent();
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.model
                                    .findOneAndDelete({
                                    processRenewMpManufacturingUnitId: unitId,
                                    urnNo: trimmedUrn,
                                })
                                    .exec()];
                        case 2:
                            deleted = _a.sent();
                            if (!deleted) {
                                throw new common_1.NotFoundException("Renew manufacturing unit ".concat(unitId, " not found for URN ").concat(trimmedUrn));
                            }
                            return [2 /*return*/, this.formatRow(deleted)];
                        case 3:
                            error_2 = _a.sent();
                            if (error_2 instanceof common_1.BadRequestException ||
                                error_2 instanceof common_1.ForbiddenException ||
                                error_2 instanceof common_1.NotFoundException) {
                                throw error_2;
                            }
                            message = error_2 instanceof Error
                                ? error_2.message
                                : 'Failed to delete renew MP manufacturing unit.';
                            throw new common_1.InternalServerErrorException(message);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessRenewMpManufacturingUnitsService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewMpManufacturingUnitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewMpManufacturingUnitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewMpManufacturingUnitsService = _classThis;
}();
exports.ProcessRenewMpManufacturingUnitsService = ProcessRenewMpManufacturingUnitsService;
