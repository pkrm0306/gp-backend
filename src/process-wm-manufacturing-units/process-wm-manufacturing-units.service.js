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
exports.ProcessWmManufacturingUnitsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var wm_manufacturing_unit_numeric_fields_util_1 = require("./utils/wm-manufacturing-unit-numeric-fields.util");
var wm_waste_disposal_calculations_util_1 = require("./utils/wm-waste-disposal-calculations.util");
var ProcessWmManufacturingUnitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessWmManufacturingUnitsService = _classThis = /** @class */ (function () {
        function ProcessWmManufacturingUnitsService_1(model, sequenceHelper) {
            this.model = model;
            this.sequenceHelper = sequenceHelper;
        }
        ProcessWmManufacturingUnitsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessWmManufacturingUnitsService_1.prototype.buildUnitPayload = function (dto, urnNo) {
            var _id = dto.processWmManufacturingUnitId, _dtoUrn = dto.urnNo, _bulkRshwd = dto.calculateBulkRshwd, _bulkRsnhwd = dto.calculateBulkRsnhwd, _bulkRshwdMultipled = dto.calculateBulkRshwdMultipled, _bulkRsnhwdMultipled = dto.calculateBulkRsnhwdMultipled, fieldUpdates = __rest(dto, ["processWmManufacturingUnitId", "urnNo", "calculateBulkRshwd", "calculateBulkRsnhwd", "calculateBulkRshwdMultipled", "calculateBulkRsnhwdMultipled"]);
            var normalized = (0, wm_manufacturing_unit_numeric_fields_util_1.normalizeWmManufacturingUnitNumericInputs)(__assign(__assign({}, fieldUpdates), { urnNo: urnNo }));
            return (0, wm_waste_disposal_calculations_util_1.enrichWmManufacturingUnitCalculations)(normalized);
        };
        ProcessWmManufacturingUnitsService_1.prototype.persistCalculatedWmFields = function (rowId, payload, updatedAt) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.model
                                .updateOne({ _id: rowId }, {
                                $set: __assign(__assign({}, (0, wm_waste_disposal_calculations_util_1.pickPersistedWmCalculationFields)(payload)), { updatedDate: updatedAt }),
                            })
                                .exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProcessWmManufacturingUnitsService_1.prototype.enrichUnitRow = function (row) {
            var plain = typeof row.toObject === 'function'
                ? row.toObject()
                : __assign({}, row);
            return (0, wm_waste_disposal_calculations_util_1.enrichWmManufacturingUnitCalculations)(plain);
        };
        ProcessWmManufacturingUnitsService_1.prototype.create = function (dto, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, now, urnNo, dtoUnitId, incomingPayload, updated, id, doc, _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            urnNo = dto.urnNo.trim();
                            dtoUnitId = dto.processWmManufacturingUnitId;
                            incomingPayload = this.buildUnitPayload(dto, urnNo);
                            (0, wm_manufacturing_unit_numeric_fields_util_1.assertWmManufacturingUnitNonNegativeNumbers)(incomingPayload);
                            if (!(dtoUnitId != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({
                                    processWmManufacturingUnitId: dtoUnitId,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                }, {
                                    $set: __assign(__assign({}, incomingPayload), { updatedDate: now }),
                                }, { new: true })
                                    .exec()];
                        case 1:
                            updated = _b.sent();
                            if (!updated) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.persistCalculatedWmFields(updated._id, incomingPayload, now)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, this.enrichUnitRow(__assign(__assign({}, updated.toObject()), incomingPayload))];
                        case 3: return [4 /*yield*/, this.sequenceHelper.getProcessWmManufacturingUnitId()];
                        case 4:
                            id = _b.sent();
                            doc = new this.model(__assign(__assign({ processWmManufacturingUnitId: id, vendorId: vendorObjectId }, incomingPayload), { createdDate: now, updatedDate: now }));
                            _a = this.enrichUnitRow;
                            return [4 /*yield*/, doc.save()];
                        case 5: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                        case 6:
                            error_1 = _b.sent();
                            if (error_1 instanceof common_1.BadRequestException)
                                throw error_1;
                            console.error('[Process WM Manufacturing Units] Create error:', error_1);
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to create waste management manufacturing unit record.');
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessWmManufacturingUnitsService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo, vendorId: vendorObjectId })
                                    .sort({ processWmManufacturingUnitId: 1 })
                                    .exec()];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (row) { return _this.enrichUnitRow(row); })];
                        case 2:
                            error_2 = _a.sent();
                            console.error('[Process WM Manufacturing Units] List error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list waste management manufacturing unit records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessWmManufacturingUnitsService_1.prototype.deleteById = function (processWmManufacturingUnitId, urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, deleted, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.model
                                    .findOneAndDelete({
                                    processWmManufacturingUnitId: processWmManufacturingUnitId,
                                    urnNo: trimmedUrn,
                                    vendorId: vendorObjectId,
                                })
                                    .exec()];
                        case 1:
                            deleted = _a.sent();
                            // Idempotent: already removed (double delete, or client/server race).
                            if (!deleted) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, deleted];
                        case 2:
                            error_3 = _a.sent();
                            if (error_3 instanceof common_1.BadRequestException) {
                                throw error_3;
                            }
                            console.error('[Process WM Manufacturing Units] Delete error:', error_3);
                            throw new common_1.InternalServerErrorException(error_3.message ||
                                'Failed to delete waste management manufacturing unit record.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessWmManufacturingUnitsService_1;
    }());
    __setFunctionName(_classThis, "ProcessWmManufacturingUnitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessWmManufacturingUnitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessWmManufacturingUnitsService = _classThis;
}();
exports.ProcessWmManufacturingUnitsService = ProcessWmManufacturingUnitsService;
