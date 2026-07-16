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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturerIdGenerationService = void 0;
var common_1 = require("@nestjs/common");
var manufacturer_internal_id_counter_schema_1 = require("./schemas/manufacturer-internal-id-counter.schema");
var manufacturer_identifier_util_1 = require("./manufacturer-identifier.util");
var ManufacturerIdGenerationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ManufacturerIdGenerationService = _classThis = /** @class */ (function () {
        function ManufacturerIdGenerationService_1(manufacturerModel, counterModel, connection) {
            this.manufacturerModel = manufacturerModel;
            this.counterModel = counterModel;
            this.connection = connection;
        }
        ManufacturerIdGenerationService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ensureCounterDocument()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * All numeric suffixes **1–9999** in use on any `gpInternalId` (three-digit **001–999**
         * or four-digit **1000–9999** after the hyphen).
         */
        ManufacturerIdGenerationService_1.prototype.collectUsedNumericSuffixes = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                var q, rows, used, _i, rows_1, row, n;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = this.manufacturerModel
                                .find({
                                gpInternalId: { $exists: true, $nin: [null, ''] },
                            }, { gpInternalId: 1 })
                                .lean();
                            if (session) {
                                q.session(session);
                            }
                            return [4 /*yield*/, q.exec()];
                        case 1:
                            rows = _b.sent();
                            used = new Set();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                n = (0, manufacturer_identifier_util_1.parseGpInternalNumericSuffix)(String((_a = row.gpInternalId) !== null && _a !== void 0 ? _a : ''));
                                if (n != null && n >= 1 && n <= 9999) {
                                    used.add(n);
                                }
                            }
                            return [2 /*return*/, used];
                    }
                });
            });
        };
        /**
         * Highest trailing suffix from any `gpInternalId` (values **1–9999**).
         */
        ManufacturerIdGenerationService_1.prototype.computeMaxSuffixFromManufacturers = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                var used, max, _i, used_1, n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.collectUsedNumericSuffixes(session)];
                        case 1:
                            used = _a.sent();
                            max = 0;
                            for (_i = 0, used_1 = used; _i < used_1.length; _i++) {
                                n = used_1[_i];
                                max = Math.max(max, n);
                            }
                            return [2 /*return*/, max];
                    }
                });
            });
        };
        ManufacturerIdGenerationService_1.prototype.parseNumericSuffix = function (gpInternalId) {
            return (0, manufacturer_identifier_util_1.parseGpInternalNumericSuffix)(String(gpInternalId !== null && gpInternalId !== void 0 ? gpInternalId : ''));
        };
        /** True when every value **1…999** appears in `used` (required before issuing **1000+**). */
        ManufacturerIdGenerationService_1.prototype.allThreeDigitSuffixSlotsFilled = function (used) {
            for (var i = 1; i <= 999; i++) {
                if (!used.has(i)) {
                    return false;
                }
            }
            return true;
        };
        ManufacturerIdGenerationService_1.prototype.ensureCounterDocument = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.counterModel.updateOne({ _id: manufacturer_internal_id_counter_schema_1.MANUFACTURER_INTERNAL_ID_COUNTER_KEY }, { $setOnInsert: { seq: 0, reclaimedSuffixFifo: [] } }, { upsert: true, session: session })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Rebuilds **seq** (max used suffix) and **reclaimedSuffixFifo** (ascending gaps 1..max)
         * from live manufacturer rows. Run on startup; also used to repair counter drift.
         * Supports suffixes **1–999** (three-digit form) and **1000–9999** (four-digit form).
         */
        ManufacturerIdGenerationService_1.prototype.reconcileSequentialStateFromManufacturers = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                var used, max, _i, used_2, u, holes, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.collectUsedNumericSuffixes(session)];
                        case 1:
                            used = _a.sent();
                            max = 0;
                            for (_i = 0, used_2 = used; _i < used_2.length; _i++) {
                                u = used_2[_i];
                                max = Math.max(max, u);
                            }
                            holes = [];
                            for (i = 1; i <= max; i++) {
                                if (!used.has(i)) {
                                    holes.push(i);
                                }
                            }
                            return [4 /*yield*/, this.ensureCounterDocument(session)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.counterModel.updateOne({ _id: manufacturer_internal_id_counter_schema_1.MANUFACTURER_INTERNAL_ID_COUNTER_KEY }, { $set: { seq: max, reclaimedSuffixFifo: holes } }, { upsert: true, session: session })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** @deprecated Use {@link reconcileSequentialStateFromManufacturers}. */
        ManufacturerIdGenerationService_1.prototype.syncCounterToManufacturerSuffixes = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * When a manufacturer row is removed, its numeric suffix is queued for **FIFO** reuse
         * before the next sequential tail (**seq + 1**).
         */
        ManufacturerIdGenerationService_1.prototype.enqueueReclaimedSuffixFromGpInternalId = function (gpInternalId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            n = this.parseNumericSuffix(gpInternalId);
                            if (n == null) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.ensureCounterDocument(session)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.counterModel.updateOne({ _id: manufacturer_internal_id_counter_schema_1.MANUFACTURER_INTERNAL_ID_COUNTER_KEY }, { $push: { reclaimedSuffixFifo: n } }, { upsert: true, session: session })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Next global suffix: **FIFO** from {@link reclaimedSuffixFifo} (freed by deletes),
         * otherwise **seq + 1** (001, 002, … 999, then 1000, 1001, … 9999). Values **1000+**
         * are issued only after **every** integer **1…999** is already in use. Never issues beyond **9999**.
         */
        ManufacturerIdGenerationService_1.prototype.allocateNextGlobalSuffix = function (session) {
            return __awaiter(this, void 0, void 0, function () {
                var attempt, used, doc, fifo, seq, v, n, update, versionFilter, r;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            attempt = 0;
                            _d.label = 1;
                        case 1:
                            if (!(attempt < 40)) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.ensureCounterDocument(session)];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, this.collectUsedNumericSuffixes(session)];
                        case 3:
                            used = _d.sent();
                            return [4 /*yield*/, this.counterModel
                                    .findOne({ _id: manufacturer_internal_id_counter_schema_1.MANUFACTURER_INTERNAL_ID_COUNTER_KEY })
                                    .session(session)
                                    .exec()];
                        case 4:
                            doc = _d.sent();
                            if (!doc) {
                                return [3 /*break*/, 14];
                            }
                            fifo = __spreadArray([], ((_a = doc.reclaimedSuffixFifo) !== null && _a !== void 0 ? _a : []), true);
                            seq = (_b = doc.seq) !== null && _b !== void 0 ? _b : 0;
                            v = (_c = doc.__v) !== null && _c !== void 0 ? _c : 0;
                            n = void 0;
                            update = void 0;
                            if (!(fifo.length > 0)) return [3 /*break*/, 7];
                            n = fifo[0];
                            if (!used.has(n)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 5:
                            _d.sent();
                            return [3 /*break*/, 14];
                        case 6:
                            update = {
                                $set: {
                                    reclaimedSuffixFifo: fifo.slice(1),
                                },
                                $inc: { __v: 1 },
                            };
                            return [3 /*break*/, 12];
                        case 7:
                            n = seq + 1;
                            if (n > 9999) {
                                throw new common_1.ConflictException('Manufacturer internal id pool exhausted (max suffix 9999)');
                            }
                            if (!(n >= 1000 && !this.allThreeDigitSuffixSlotsFilled(used))) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 8:
                            _d.sent();
                            return [3 /*break*/, 14];
                        case 9:
                            if (!used.has(n)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 10:
                            _d.sent();
                            return [3 /*break*/, 14];
                        case 11:
                            update = {
                                $set: { seq: n },
                                $inc: { __v: 1 },
                            };
                            _d.label = 12;
                        case 12:
                            versionFilter = v === 0
                                ? { $or: [{ __v: 0 }, { __v: { $exists: false } }] }
                                : { __v: v };
                            return [4 /*yield*/, this.counterModel.updateOne(__assign({ _id: manufacturer_internal_id_counter_schema_1.MANUFACTURER_INTERNAL_ID_COUNTER_KEY }, versionFilter), update, { session: session })];
                        case 13:
                            r = _d.sent();
                            if (r.matchedCount === 1) {
                                return [2 /*return*/, n];
                            }
                            _d.label = 14;
                        case 14:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 15: throw new common_1.ConflictException('Failed to allocate manufacturer internal id');
                    }
                });
            });
        };
        /**
         * First free initials from the ordered candidate list for this name, excluding `excludeManufacturerId`.
         */
        ManufacturerIdGenerationService_1.prototype.pickUniqueInitial = function (manufacturerName, excludeManufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var candidates, _i, candidates_1, candidate, taken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            candidates = (0, manufacturer_identifier_util_1.generateInitial)(manufacturerName);
                            if (candidates.length === 0) {
                                throw new common_1.BadRequestException('Manufacturer name must contain at least one letter to derive initials');
                            }
                            _i = 0, candidates_1 = candidates;
                            _a.label = 1;
                        case 1:
                            if (!(_i < candidates_1.length)) return [3 /*break*/, 4];
                            candidate = candidates_1[_i];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    manufacturerInitial: candidate,
                                    _id: { $ne: excludeManufacturerId },
                                })
                                    .select('_id')
                                    .session(session)
                                    .lean()
                                    .exec()];
                        case 2:
                            taken = _a.sent();
                            if (!taken) {
                                return [2 /*return*/, candidate];
                            }
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: throw new common_1.ConflictException('Could not allocate unique manufacturer initials for this name');
                    }
                });
            });
        };
        /**
         * Resolves initials + internal id for an **unverified** manufacturer save.
         * Reuses existing `gpInternalId` when the display name is unchanged, stored initials
         * still match the newly resolved pair, and the id is already in `GP<INI>-###` or `GP<INI>-####` form.
         */
        ManufacturerIdGenerationService_1.prototype.resolveAutoIdentifiersForUnverified = function (manufacturerName, excludeManufacturerId, existing, session) {
            return __awaiter(this, void 0, void 0, function () {
                var newName, oldName, nameChanged, hadInitial, hadId, initial, canReuseStored, maxAttempts, attempt, allocatedSuffix, gpInternalId, collision;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            newName = (0, manufacturer_identifier_util_1.normalizeManufacturerName)(manufacturerName);
                            oldName = (0, manufacturer_identifier_util_1.normalizeManufacturerName)(String((_a = existing.manufacturerName) !== null && _a !== void 0 ? _a : ''));
                            nameChanged = newName !== oldName;
                            hadInitial = !!String((_b = existing.manufacturerInitial) !== null && _b !== void 0 ? _b : '').trim();
                            hadId = !!String((_c = existing.gpInternalId) !== null && _c !== void 0 ? _c : '').trim();
                            return [4 /*yield*/, this.pickUniqueInitial(newName, excludeManufacturerId, session)];
                        case 1:
                            initial = _d.sent();
                            canReuseStored = !nameChanged &&
                                hadInitial &&
                                hadId &&
                                String(existing.manufacturerInitial).trim().toUpperCase() === initial &&
                                (0, manufacturer_identifier_util_1.internalIdMatchesInitial)(existing.gpInternalId, initial);
                            if (canReuseStored) {
                                return [2 /*return*/, {
                                        manufacturerInitial: initial,
                                        gpInternalId: String(existing.gpInternalId).trim().toUpperCase(),
                                    }];
                            }
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 2:
                            _d.sent();
                            maxAttempts = 24;
                            attempt = 0;
                            _d.label = 3;
                        case 3:
                            if (!(attempt < maxAttempts)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.allocateNextGlobalSuffix(session)];
                        case 4:
                            allocatedSuffix = _d.sent();
                            gpInternalId = (0, manufacturer_identifier_util_1.generateInternalId)(initial, allocatedSuffix);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    gpInternalId: gpInternalId,
                                    _id: { $ne: excludeManufacturerId },
                                })
                                    .session(session)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 5:
                            collision = _d.sent();
                            if (!collision) {
                                return [2 /*return*/, { manufacturerInitial: initial, gpInternalId: gpInternalId }];
                            }
                            return [4 /*yield*/, this.reconcileSequentialStateFromManufacturers(session)];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7:
                            attempt++;
                            return [3 /*break*/, 3];
                        case 8: throw new common_1.ConflictException('Could not allocate unique GP internal id after retries');
                    }
                });
            });
        };
        /**
         * Ordered 2-letter uppercase candidates from the display name (pure helper, no DB).
         */
        ManufacturerIdGenerationService_1.prototype.generateInitial = function (manufacturerName) {
            return (0, manufacturer_identifier_util_1.generateInitial)(manufacturerName);
        };
        /** Builds `GP<INITIAL>-###` or `GP<INITIAL>-####` (pure helper, no DB). */
        ManufacturerIdGenerationService_1.prototype.generateInternalId = function (manufacturerInitial, suffixNumber) {
            return (0, manufacturer_identifier_util_1.generateInternalId)(manufacturerInitial, suffixNumber);
        };
        /**
         * Runs `work` inside a transaction (caller should not nest another transaction on same session).
         */
        ManufacturerIdGenerationService_1.prototype.withTransaction = function (work) {
            return __awaiter(this, void 0, void 0, function () {
                var session, out, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _a.sent();
                            session.startTransaction();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, 7, 8]);
                            return [4 /*yield*/, work(session)];
                        case 3:
                            out = _a.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, out];
                        case 5:
                            e_1 = _a.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 6:
                            _a.sent();
                            throw e_1;
                        case 7:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        return ManufacturerIdGenerationService_1;
    }());
    __setFunctionName(_classThis, "ManufacturerIdGenerationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManufacturerIdGenerationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManufacturerIdGenerationService = _classThis;
}();
exports.ManufacturerIdGenerationService = ManufacturerIdGenerationService;
