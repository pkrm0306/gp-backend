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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalCycleService = void 0;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renew_common_util_1 = require("../helpers/renew-common.util");
var RenewalCycleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewalCycleService = _classThis = /** @class */ (function () {
        function RenewalCycleService_1(renewalCycleModel) {
            this.renewalCycleModel = renewalCycleModel;
        }
        /** Active or specified cycle — used to stamp `products.renewCycleNo`. */
        RenewalCycleService_1.prototype.resolveCycleForProductUpdate = function (urnNo, renewalCycleId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, query, cycle, active;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            query = this.renewalCycleModel.findById(renewalCycleId.trim());
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.exec()];
                        case 1:
                            cycle = _a.sent();
                            if (!cycle || cycle.urnNo !== trimmedUrn) {
                                throw new common_1.NotFoundException("Renewal cycle ".concat(renewalCycleId, " not found for URN ").concat(trimmedUrn));
                            }
                            return [2 /*return*/, cycle];
                        case 2: return [4 /*yield*/, this.getActiveInProgressCycle(trimmedUrn, session)];
                        case 3:
                            active = _a.sent();
                            if (!active) {
                                throw new common_1.NotFoundException("No in-progress renewal cycle found for URN ".concat(trimmedUrn));
                            }
                            return [2 /*return*/, active];
                    }
                });
            });
        };
        RenewalCycleService_1.prototype.getActiveInProgressCycle = function (urnNo, session) {
            return __awaiter(this, void 0, void 0, function () {
                var query;
                return __generator(this, function (_a) {
                    query = this.renewalCycleModel.findOne({
                        urnNo: urnNo.trim(),
                        status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                    });
                    if (session) {
                        query.session(session);
                    }
                    return [2 /*return*/, query.exec()];
                });
            });
        };
        /**
         * Close any in-progress cycles, then create the next cycle (admin test renewal).
         * Does not copy process/payment data — new cycle starts empty.
         */
        RenewalCycleService_1.prototype.closeInProgressAndCreateNextCycle = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, userObjectId, now, closeQuery;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = input.urnNo.trim();
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(input.userId, 'userId');
                            now = new Date();
                            closeQuery = this.renewalCycleModel.updateMany({ urnNo: trimmedUrn, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS }, {
                                $set: {
                                    status: renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED,
                                    completedAt: now,
                                    updatedAt: now,
                                    updatedBy: userObjectId,
                                },
                            });
                            if (input.session) {
                                closeQuery.session(input.session);
                            }
                            return [4 /*yield*/, closeQuery.exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.createCycle(__assign(__assign({}, input), { session: input.session }), { allowExistingActive: false })];
                    }
                });
            });
        };
        RenewalCycleService_1.prototype.createCycle = function (input, options) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, vendorObjectId, manufacturerObjectId, userObjectId, now, lastCycle, cycleNo, active, doc;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = input.urnNo.trim();
                            vendorObjectId = (0, renew_common_util_1.toRenewObjectId)(input.vendorId, 'vendorId');
                            manufacturerObjectId = (0, renew_common_util_1.toRenewObjectId)(input.manufacturerId, 'manufacturerId');
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(input.userId, 'userId');
                            now = new Date();
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findOne({ urnNo: trimmedUrn })
                                    .sort({ cycleNo: -1 })
                                    .exec()];
                        case 1:
                            lastCycle = _b.sent();
                            cycleNo = ((_a = lastCycle === null || lastCycle === void 0 ? void 0 : lastCycle.cycleNo) !== null && _a !== void 0 ? _a : 0) + 1;
                            return [4 /*yield*/, this.getActiveInProgressCycle(trimmedUrn, input.session)];
                        case 2:
                            active = _b.sent();
                            if (active && (options === null || options === void 0 ? void 0 : options.allowExistingActive) !== false) {
                                throw new common_1.BadRequestException("An in-progress renewal cycle already exists for URN ".concat(trimmedUrn));
                            }
                            doc = new this.renewalCycleModel({
                                urnNo: trimmedUrn,
                                cycleNo: cycleNo,
                                paymentId: input.paymentId,
                                vendorId: vendorObjectId,
                                manufacturerId: manufacturerObjectId,
                                status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                                urnStatusAtStart: input.urnStatusAtStart,
                                startedAt: now,
                                createdAt: now,
                                updatedAt: now,
                                createdBy: userObjectId,
                                updatedBy: userObjectId,
                            });
                            if (input.session) {
                                return [2 /*return*/, doc.save({ session: input.session })];
                            }
                            return [2 /*return*/, doc.save()];
                    }
                });
            });
        };
        RenewalCycleService_1.prototype.completeCycle = function (urnNo, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var userObjectId, now, query, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            now = new Date();
                            query = this.renewalCycleModel.findOneAndUpdate({
                                urnNo: urnNo.trim(),
                                status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                            }, {
                                $set: {
                                    status: renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED,
                                    completedAt: now,
                                    updatedAt: now,
                                    updatedBy: userObjectId,
                                },
                            }, { new: true });
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException("No in-progress renewal cycle found for URN ".concat(urnNo));
                            }
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        /** Complete a specific in-progress cycle (admin final review with renewalCycleId). */
        RenewalCycleService_1.prototype.completeCycleById = function (urnNo, renewalCycleId, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var userObjectId, cycleObjectId, now, query, updated, existingQuery, alreadyCompleted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            cycleObjectId = (0, renew_common_util_1.toRenewObjectId)(renewalCycleId, 'renewalCycleId');
                            now = new Date();
                            query = this.renewalCycleModel.findOneAndUpdate({
                                _id: cycleObjectId,
                                urnNo: urnNo.trim(),
                                status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                            }, {
                                $set: {
                                    status: renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED,
                                    completedAt: now,
                                    updatedAt: now,
                                    updatedBy: userObjectId,
                                },
                            }, { new: true });
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.exec()];
                        case 1:
                            updated = _a.sent();
                            if (updated) {
                                return [2 /*return*/, updated];
                            }
                            existingQuery = this.renewalCycleModel.findOne({
                                _id: cycleObjectId,
                                urnNo: urnNo.trim(),
                                status: renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED,
                            });
                            if (session) {
                                existingQuery.session(session);
                            }
                            return [4 /*yield*/, existingQuery.exec()];
                        case 2:
                            alreadyCompleted = _a.sent();
                            if (alreadyCompleted) {
                                return [2 /*return*/, alreadyCompleted];
                            }
                            throw new common_1.NotFoundException("No in-progress renewal cycle found for URN ".concat(urnNo, " and renewalCycleId ").concat(String(renewalCycleId)));
                    }
                });
            });
        };
        return RenewalCycleService_1;
    }());
    __setFunctionName(_classThis, "RenewalCycleService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewalCycleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewalCycleService = _classThis;
}();
exports.RenewalCycleService = RenewalCycleService;
