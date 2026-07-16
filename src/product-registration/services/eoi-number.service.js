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
exports.EoiNumberService = void 0;
exports.buildEoiNoFromManufacturerProfile = buildEoiNoFromManufacturerProfile;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var eoi_sequence_active_filter_1 = require("../constants/eoi-sequence-active.filter");
var active_product_filter_1 = require("../constants/active-product.filter");
var eoi_sequence_helper_1 = require("../helpers/eoi-sequence.helper");
/** Build EOI synchronously when manufacturer profile is already loaded (bulk / resequence). */
function buildEoiNoFromManufacturerProfile(profile, manufacturerProductCount) {
    var _a, _b;
    if (!Number.isFinite(manufacturerProductCount) ||
        manufacturerProductCount < 1 ||
        manufacturerProductCount > 999) {
        throw new common_1.BadRequestException('Manufacturer product sequence must be between 1 and 999');
    }
    var manufacturerInitial = (_a = profile.manufacturerInitial) === null || _a === void 0 ? void 0 : _a.trim();
    if (!manufacturerInitial) {
        throw new common_1.BadRequestException('Manufacturer does not have manufacturerInitial set.');
    }
    var gpInternalId = (_b = profile.gpInternalId) === null || _b === void 0 ? void 0 : _b.trim();
    if (!gpInternalId) {
        throw new common_1.BadRequestException('Manufacturer does not have gpInternalId set.');
    }
    var internalIdMatch = gpInternalId.match(/-(\d+)$/);
    var internalId = internalIdMatch
        ? internalIdMatch[1].padStart(3, '0')
        : '000';
    var paddedCount = manufacturerProductCount.toString().padStart(3, '0');
    return "GP".concat(manufacturerInitial).concat(internalId).concat(paddedCount);
}
/**
 * Manufacturer-scoped EOI assignment.
 * Active pool = productStatus 0/1/2 and not soft-deleted.
 * Inactive rows (rejected, expired, soft-deleted) keep their stored eoiNo.
 * New/restored active products receive max(active suffix) + 1 — never compact siblings.
 */
var EoiNumberService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EoiNumberService = _classThis = /** @class */ (function () {
        function EoiNumberService_1(productModel, productPlantModel, manufacturersService) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.manufacturersService = manufacturersService;
            this.manufacturerLocks = new Map();
        }
        /**
         * Max numeric EOI suffix among active (0/1/2, non-deleted) products for a manufacturer.
         */
        EoiNumberService_1.prototype.getMaxActiveSequenceSuffix = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, useSession, rows, maxSuffix, _i, rows_1, row, fromField, fromEoi, suffix;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturerObjectId = manufacturerId instanceof mongoose_1.Types.ObjectId
                                ? manufacturerId
                                : new mongoose_1.Types.ObjectId(String(manufacturerId));
                            useSession = session && session.inTransaction() ? session : undefined;
                            return [4 /*yield*/, this.productModel
                                    .find((0, eoi_sequence_active_filter_1.matchEoiSequenceActiveProducts)({
                                    manufacturerId: manufacturerObjectId,
                                }), { eoiNo: 1, eoiSequence: 1 })
                                    .session(useSession !== null && useSession !== void 0 ? useSession : null)
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            maxSuffix = 0;
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                fromField = row.eoiSequence != null && Number.isFinite(Number(row.eoiSequence))
                                    ? Number(row.eoiSequence)
                                    : null;
                                fromEoi = (0, eoi_sequence_helper_1.parseEoiSequenceSuffix)(row.eoiNo);
                                suffix = (_a = fromField !== null && fromField !== void 0 ? fromField : fromEoi) !== null && _a !== void 0 ? _a : 0;
                                if (suffix > maxSuffix) {
                                    maxSuffix = suffix;
                                }
                            }
                            return [2 /*return*/, maxSuffix];
                    }
                });
            });
        };
        /** Load manufacturer fields needed to build EOIs (call once per bulk/resequence batch). */
        EoiNumberService_1.prototype.loadManufacturerEoiProfile = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer, manufacturerInitial, gpInternalId;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.findById(manufacturerId)];
                        case 1:
                            manufacturer = _c.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            manufacturerInitial = String((_a = manufacturer.manufacturerInitial) !== null && _a !== void 0 ? _a : '').trim();
                            if (!manufacturerInitial) {
                                throw new common_1.BadRequestException("Manufacturer ".concat(manufacturerId, " does not have manufacturerInitial set."));
                            }
                            gpInternalId = String((_b = manufacturer.gpInternalId) !== null && _b !== void 0 ? _b : '').trim();
                            if (!gpInternalId) {
                                throw new common_1.BadRequestException("Manufacturer ".concat(manufacturerId, " does not have gpInternalId set."));
                            }
                            return [2 /*return*/, { manufacturerInitial: manufacturerInitial, gpInternalId: gpInternalId }];
                    }
                });
            });
        };
        /**
         * Build EOI for the given manufacturer and 1-based manufacturer product sequence.
         */
        EoiNumberService_1.prototype.buildEoiNo = function (manufacturerId, manufacturerProductCount, _session) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadManufacturerEoiProfile(manufacturerId)];
                        case 1:
                            profile = _a.sent();
                            return [2 /*return*/, buildEoiNoFromManufacturerProfile(profile, manufacturerProductCount)];
                    }
                });
            });
        };
        /**
         * Next EOI for a new registration: max active suffix + 1.
         */
        EoiNumberService_1.prototype.generateNextEoiNo = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var assignment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assignNextActiveEoiNo(manufacturerId, session)];
                        case 1:
                            assignment = _a.sent();
                            return [2 /*return*/, assignment.eoiNo];
                    }
                });
            });
        };
        /**
         * Assign next active EOI within a transaction, optionally from a running max
         * (for bulk restore / bulk register in one txn).
         */
        EoiNumberService_1.prototype.assignNextActiveEoiNo = function (manufacturerId, session, options) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.withManufacturerLock(manufacturerId, function () { return __awaiter(_this, void 0, void 0, function () {
                            var baseMax, _a, nextSequence, eoiNo;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!((_b = options === null || options === void 0 ? void 0 : options.runningMaxSuffix) !== null && _b !== void 0)) return [3 /*break*/, 1];
                                        _a = _b;
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, this.getMaxActiveSequenceSuffix(manufacturerId, session)];
                                    case 2:
                                        _a = (_c.sent());
                                        _c.label = 3;
                                    case 3:
                                        baseMax = _a;
                                        nextSequence = baseMax + 1;
                                        return [4 /*yield*/, this.buildEoiNo(manufacturerId, nextSequence, session)];
                                    case 4:
                                        eoiNo = _c.sent();
                                        return [2 /*return*/, {
                                                eoiNo: eoiNo,
                                                eoiSequence: nextSequence,
                                                previousEoiNo: options === null || options === void 0 ? void 0 : options.previousEoiNo,
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Apply a new EOI to a product row and sync active plants.
         */
        EoiNumberService_1.prototype.applyEoiReassignment = function (productObjectId, assignment, now, session) {
            return __awaiter(this, void 0, void 0, function () {
                var useSession, update;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            useSession = session && session.inTransaction() ? session : undefined;
                            update = {
                                eoiNo: assignment.eoiNo,
                                eoiSequence: assignment.eoiSequence,
                                updatedDate: now,
                                eoiReassignedAt: now,
                            };
                            if (assignment.previousEoiNo) {
                                update.previousEoiNo = assignment.previousEoiNo;
                            }
                            return [4 /*yield*/, this.productModel
                                    .updateOne({ _id: productObjectId }, { $set: update }, { session: useSession })
                                    .exec()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.productPlantModel
                                    .updateMany((0, active_product_filter_1.matchActiveProductPlants)({ productId: productObjectId }), { $set: { eoiNo: assignment.eoiNo } }, { session: useSession })
                                    .exec()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EoiNumberService_1.prototype.withManufacturerLock = function (manufacturerId, operation) {
            return __awaiter(this, void 0, void 0, function () {
                var previous, release, gate, current;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            previous = (_a = this.manufacturerLocks.get(manufacturerId)) !== null && _a !== void 0 ? _a : Promise.resolve();
                            gate = new Promise(function (resolve) {
                                release = resolve;
                            });
                            current = previous.then(function () { return gate; });
                            this.manufacturerLocks.set(manufacturerId, current);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 4, 5]);
                            return [4 /*yield*/, previous];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, operation()];
                        case 3: return [2 /*return*/, _b.sent()];
                        case 4:
                            release();
                            if (this.manufacturerLocks.get(manufacturerId) === current) {
                                this.manufacturerLocks.delete(manufacturerId);
                            }
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return EoiNumberService_1;
    }());
    __setFunctionName(_classThis, "EoiNumberService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EoiNumberService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EoiNumberService = _classThis;
}();
exports.EoiNumberService = EoiNumberService;
