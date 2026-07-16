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
exports.ProcessRenewWmManufacturingUnitsService = void 0;
var common_1 = require("@nestjs/common");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var renew_details_format_util_1 = require("../utils/renew-details-format.util");
var renew_wm_units_read_util_1 = require("../helpers/renew-wm-units-read.util");
function readRenewalCycleId(dto) {
    var _a;
    var raw = (_a = dto
        .renewalCycleId) !== null && _a !== void 0 ? _a : dto.renewal_cycle_id;
    var trimmed = String(raw !== null && raw !== void 0 ? raw : '').trim();
    return trimmed || undefined;
}
var ProcessRenewWmManufacturingUnitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewWmManufacturingUnitsService = _classThis = /** @class */ (function () {
        function ProcessRenewWmManufacturingUnitsService_1(model, certWmModel, renewWasteModel, productModel, renewalCycleModel, sequenceHelper) {
            this.model = model;
            this.certWmModel = certWmModel;
            this.renewWasteModel = renewWasteModel;
            this.productModel = productModel;
            this.renewalCycleModel = renewalCycleModel;
            this.sequenceHelper = sequenceHelper;
        }
        ProcessRenewWmManufacturingUnitsService_1.prototype.resolveUnitId = function (dto) {
            var _a;
            var renewId = dto
                .processRenewWmManufacturingUnitId;
            return (_a = dto.processWmManufacturingUnitId) !== null && _a !== void 0 ? _a : renewId;
        };
        ProcessRenewWmManufacturingUnitsService_1.prototype.resolveWasteManagementId = function (urnNo, dtoWasteId, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle, header;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (dtoWasteId != null) {
                                return [2 /*return*/, dtoWasteId];
                            }
                            return [4 /*yield*/, (0, renew_cycle_scope_util_1.resolveRenewCycleForQuery)(this.renewalCycleModel, urnNo, renewalCycleId)];
                        case 1:
                            cycle = _a.sent();
                            return [4 /*yield*/, this.renewWasteModel
                                    .findOne((0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(urnNo, cycle))
                                    .select('processRenewWasteManagementId')
                                    .lean()
                                    .exec()];
                        case 2:
                            header = _a.sent();
                            return [2 /*return*/, header === null || header === void 0 ? void 0 : header.processRenewWasteManagementId];
                    }
                });
            });
        };
        ProcessRenewWmManufacturingUnitsService_1.prototype.formatRow = function (doc) {
            var plain = typeof doc.toObject === 'function'
                ? doc.toObject()
                : __assign({}, doc);
            return (0, renew_details_format_util_1.formatRenewWmManufacturingUnitForDetails)(plain);
        };
        ProcessRenewWmManufacturingUnitsService_1.prototype.upsert = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var cycleIdHint, _a, cycle, context, ownership, renewalCycleObjectId, now, urnNo, unitId, processRenewWasteManagementId, _b, _wmId, _wasteId, _urn, _renewalCycleId, _renewalCycleSnake, fieldUpdates, setFields, updated, id, doc, saved, error_1, message;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 7, , 8]);
                            cycleIdHint = readRenewalCycleId(dto);
                            return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, dto.urnNo, cycleIdHint)];
                        case 1:
                            _a = _c.sent(), cycle = _a.cycle, context = _a.context;
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            renewalCycleObjectId = cycle._id;
                            now = new Date();
                            urnNo = ownership.urnNo;
                            unitId = this.resolveUnitId(dto);
                            return [4 /*yield*/, this.resolveWasteManagementId(urnNo, dto.processWasteManagementId, cycleIdHint)];
                        case 2:
                            processRenewWasteManagementId = _c.sent();
                            _b = dto, _wmId = _b.processWmManufacturingUnitId, _wasteId = _b.processWasteManagementId, _urn = _b.urnNo, _renewalCycleId = _b.renewalCycleId, _renewalCycleSnake = _b.renewal_cycle_id, fieldUpdates = __rest(_b, ["processWmManufacturingUnitId", "processWasteManagementId", "urnNo", "renewalCycleId", "renewal_cycle_id"]);
                            setFields = __assign(__assign({}, fieldUpdates), { urnNo: urnNo, renewalCycleId: renewalCycleObjectId, updatedDate: now });
                            if (processRenewWasteManagementId != null) {
                                setFields.processRenewWasteManagementId = processRenewWasteManagementId;
                            }
                            if (!(unitId != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({
                                    processRenewWmManufacturingUnitId: unitId,
                                    urnNo: urnNo,
                                    vendorId: ownership.vendorId,
                                }, { $set: setFields }, { new: true })
                                    .exec()];
                        case 3:
                            updated = _c.sent();
                            if (updated) {
                                return [2 /*return*/, this.formatRow(updated)];
                            }
                            _c.label = 4;
                        case 4: return [4 /*yield*/, this.sequenceHelper.getProcessRenewWmManufacturingUnitId()];
                        case 5:
                            id = _c.sent();
                            doc = new this.model(__assign(__assign({ processRenewWmManufacturingUnitId: id, vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, processRenewWasteManagementId: processRenewWasteManagementId }, setFields), { renewalCycleId: renewalCycleObjectId, createdDate: now }));
                            return [4 /*yield*/, doc.save()];
                        case 6:
                            saved = _c.sent();
                            return [2 /*return*/, this.formatRow(saved)];
                        case 7:
                            error_1 = _c.sent();
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.ForbiddenException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            message = error_1 instanceof Error
                                ? error_1.message
                                : 'Failed to save renew WM manufacturing unit.';
                            throw new common_1.InternalServerErrorException(message);
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewWmManufacturingUnitsService_1.prototype.listByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, (0, renew_cycle_scope_util_1.resolveRenewCycleForQuery)(this.renewalCycleModel, trimmedUrn, renewalCycleId)];
                        case 1:
                            cycle = _a.sent();
                            return [2 /*return*/, (0, renew_wm_units_read_util_1.findRenewWmUnitsForRead)(this.model, this.certWmModel, trimmedUrn, cycle)];
                    }
                });
            });
        };
        ProcessRenewWmManufacturingUnitsService_1.prototype.deleteById = function (unitId, urnNo) {
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
                                    processRenewWmManufacturingUnitId: unitId,
                                    urnNo: trimmedUrn,
                                })
                                    .exec()];
                        case 2:
                            deleted = _a.sent();
                            if (!deleted) {
                                return [2 /*return*/, null];
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
                                : 'Failed to delete renew WM manufacturing unit.';
                            throw new common_1.InternalServerErrorException(message);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessRenewWmManufacturingUnitsService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewWmManufacturingUnitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewWmManufacturingUnitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewWmManufacturingUnitsService = _classThis;
}();
exports.ProcessRenewWmManufacturingUnitsService = ProcessRenewWmManufacturingUnitsService;
