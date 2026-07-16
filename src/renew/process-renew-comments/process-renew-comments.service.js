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
exports.ProcessRenewCommentsService = exports.ADMIN_RENEW_PROCESS_COMMENT_FIELDS = void 0;
var common_1 = require("@nestjs/common");
var mongodb_1 = require("mongodb");
var mongoose_1 = require("mongoose");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renew_common_util_1 = require("../helpers/renew-common.util");
/** Admin renew review tabs — exact POST field names (incl. legacy typo). */
exports.ADMIN_RENEW_PROCESS_COMMENT_FIELDS = [
    'productPerformance',
    'manfacturingProcess',
    'wasteManagement',
    'productInnovation',
];
var COMMENT_FIELDS = [
    'productDesign',
    'productPerformance',
    'manfacturingProcess',
    'wasteManagement',
    'lifeCycleApproach',
    'productStewardship',
    'productInnovation',
    'rawMaterials31',
    'rawMaterials32',
    'rawMaterials33',
    'rawMaterials34',
    'rawMaterials35',
    'rawMaterials36',
    'rawMaterials37',
    'rawMaterials38',
    'rawMaterials39',
    'rawMaterials310',
    'rawMaterials311',
    'rawMaterials312',
    'rawMaterials313',
    'rawMaterials314',
    'rawMaterials315',
];
var LEGACY_URN_ONLY_INDEX = 'uniq_process_renew_comments_urn';
var ProcessRenewCommentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewCommentsService = _classThis = /** @class */ (function () {
        function ProcessRenewCommentsService_1(renewCommentsModel, renewalCycleModel, productModel, sequenceHelper) {
            this.renewCommentsModel = renewCommentsModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.logger = new common_1.Logger(ProcessRenewCommentsService.name);
        }
        ProcessRenewCommentsService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1, code, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.renewCommentsModel.collection.dropIndex(LEGACY_URN_ONLY_INDEX)];
                        case 1:
                            _a.sent();
                            this.logger.log("Dropped legacy index ".concat(LEGACY_URN_ONLY_INDEX, " on process_renew_comments"));
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            code = error_1 === null || error_1 === void 0 ? void 0 : error_1.code;
                            if (code !== 27 && code !== 26) {
                                this.logger.warn("Could not drop legacy index ".concat(LEGACY_URN_ONLY_INDEX, ": ").concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                            }
                            return [3 /*break*/, 3];
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.renewCommentsModel.syncIndexes()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            this.logger.warn("process_renew_comments syncIndexes: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.upsert = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, context, cycle, cycleId;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, input.urnNo)];
                        case 1:
                            _a = _b.sent(), context = _a.context, cycle = _a.cycle;
                            return [4 /*yield*/, this.resolveCycleId(input.urnNo, input.renewalCycleId, cycle._id)];
                        case 2:
                            cycleId = _b.sent();
                            return [2 /*return*/, this.upsertForCycle(input, (0, renew_common_util_1.renewOwnershipFields)(context), cycleId)];
                    }
                });
            });
        };
        /** Admin process review — no vendor edit lock. */
        ProcessRenewCommentsService_1.prototype.adminUpsert = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var context, ownership, cycleId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, input.urnNo)];
                        case 1:
                            context = _a.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            return [4 /*yield*/, this.resolveAdminCycleId(input.urnNo, input.renewalCycleId)];
                        case 2:
                            cycleId = _a.sent();
                            return [2 /*return*/, this.upsertForCycle(input, ownership, cycleId)];
                    }
                });
            });
        };
        /**
         * Admin POST — requires urnNo, renewalCycleId, and exactly one section field.
         */
        ProcessRenewCommentsService_1.prototype.adminUpsertSection = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var sectionPatch;
                var _a;
                return __generator(this, function (_b) {
                    if (!((_a = input.renewalCycleId) === null || _a === void 0 ? void 0 : _a.trim())) {
                        throw new common_1.BadRequestException('renewalCycleId is required');
                    }
                    sectionPatch = this.pickSingleAdminSectionField(input);
                    return [2 /*return*/, this.adminUpsert(__assign({ urnNo: input.urnNo, renewalCycleId: input.renewalCycleId }, sectionPatch))];
                });
            });
        };
        /** GET payload for admin UI — cert field names, cycle-scoped, non-empty only. */
        ProcessRenewCommentsService_1.prototype.adminGetCommentsPayload = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, row, out, _i, ADMIN_RENEW_PROCESS_COMMENT_FIELDS_1, field, value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveAdminCycleId(urnNo, renewalCycleId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.getByUrnAndCycle(urnNo, renewalCycleId)];
                        case 2:
                            doc = _a.sent();
                            if (!doc) {
                                return [2 /*return*/, {}];
                            }
                            row = doc.toObject();
                            out = {};
                            for (_i = 0, ADMIN_RENEW_PROCESS_COMMENT_FIELDS_1 = exports.ADMIN_RENEW_PROCESS_COMMENT_FIELDS; _i < ADMIN_RENEW_PROCESS_COMMENT_FIELDS_1.length; _i++) {
                                field = ADMIN_RENEW_PROCESS_COMMENT_FIELDS_1[_i];
                                value = row[field];
                                if (typeof value === 'string' && value.trim() !== '') {
                                    out[field] = value;
                                }
                            }
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.pickSingleAdminSectionField = function (input) {
            var _a;
            var provided = exports.ADMIN_RENEW_PROCESS_COMMENT_FIELDS.filter(function (field) { return input[field] !== undefined; });
            if (provided.length === 0) {
                throw new common_1.BadRequestException('One process comment section field is required (productPerformance, manfacturingProcess, wasteManagement, or productInnovation)');
            }
            if (provided.length > 1) {
                throw new common_1.BadRequestException('Only one process comment section field may be sent per request');
            }
            var field = provided[0];
            return _a = {}, _a[field] = input[field], _a;
        };
        ProcessRenewCommentsService_1.prototype.resolveAdminCycleId = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycleObjectId, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) {
                                throw new common_1.BadRequestException('renewalCycleId is required');
                            }
                            return [4 /*yield*/, this.resolveCycleId(urnNo, renewalCycleId)];
                        case 1:
                            cycleObjectId = _a.sent();
                            return [4 /*yield*/, this.renewalCycleModel.findById(cycleObjectId).lean().exec()];
                        case 2:
                            cycle = _a.sent();
                            if (!cycle) {
                                throw new common_1.BadRequestException('Renewal cycle not found');
                            }
                            if (cycle.status === renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED ||
                                cycle.status === renewal_cycle_schema_1.RenewalCycleStatus.CANCELLED) {
                                throw new common_1.BadRequestException("Renewal cycle is ".concat(cycle.status, "; process comments cannot be edited"));
                            }
                            return [2 /*return*/, cycleObjectId];
                    }
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.getByUrnAndCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycleObjectId, scoped, legacy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.resolveCycleId(trimmedUrn, renewalCycleId)];
                        case 1:
                            cycleObjectId = _a.sent();
                            return [4 /*yield*/, this.renewCommentsModel
                                    .findOne({ urnNo: trimmedUrn, renewalCycleId: cycleObjectId })
                                    .exec()];
                        case 2:
                            scoped = _a.sent();
                            if (scoped) {
                                return [2 /*return*/, scoped];
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.renewCommentsModel.findOne({ urnNo: trimmedUrn }).exec()];
                        case 4:
                            legacy = _a.sent();
                            return [2 /*return*/, legacy];
                    }
                });
            });
        };
        /** @deprecated use getByUrnAndCycle */
        ProcessRenewCommentsService_1.prototype.getByUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getByUrnAndCycle(urnNo)];
                });
            });
        };
        /** Cycle-scoped row first; fall back to legacy URN-only row (pre–renewalCycleId index). */
        ProcessRenewCommentsService_1.prototype.findExistingCommentRow = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var scoped;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.renewCommentsModel
                                .findOne({ urnNo: urnNo, renewalCycleId: renewalCycleId })
                                .exec()];
                        case 1:
                            scoped = _a.sent();
                            if (scoped) {
                                return [2 /*return*/, scoped];
                            }
                            return [2 /*return*/, this.renewCommentsModel
                                    .findOne({ urnNo: urnNo })
                                    .sort({ updatedDate: -1 })
                                    .exec()];
                    }
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.buildCommentUpdateData = function (input, ownership, renewalCycleId, now) {
            var updateData = {
                vendorId: ownership.vendorId,
                manufacturerId: ownership.manufacturerId,
                renewalCycleId: renewalCycleId,
                updatedDate: now,
            };
            for (var _i = 0, COMMENT_FIELDS_1 = COMMENT_FIELDS; _i < COMMENT_FIELDS_1.length; _i++) {
                var field = COMMENT_FIELDS_1[_i];
                if (input[field] !== undefined) {
                    updateData[field] = input[field];
                }
            }
            return updateData;
        };
        ProcessRenewCommentsService_1.prototype.updateExistingCommentRow = function (existing, updateData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.renewCommentsModel
                            .findByIdAndUpdate(existing._id, { $set: updateData }, { new: true })
                            .exec()];
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.upsertForCycle = function (input, ownership, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, trimmedUrn, updateData, existing, updated, processRenewCommentsId, record, error_3, legacy, updated, message;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            now = new Date();
                            trimmedUrn = ownership.urnNo;
                            updateData = this.buildCommentUpdateData(input, ownership, renewalCycleId, now);
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 6, , 10]);
                            return [4 /*yield*/, this.findExistingCommentRow(trimmedUrn, renewalCycleId)];
                        case 2:
                            existing = _h.sent();
                            if (!existing) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.updateExistingCommentRow(existing, updateData)];
                        case 3:
                            updated = _h.sent();
                            if (updated) {
                                return [2 /*return*/, updated];
                            }
                            _h.label = 4;
                        case 4: return [4 /*yield*/, this.sequenceHelper.getProcessRenewCommentsId()];
                        case 5:
                            processRenewCommentsId = _h.sent();
                            record = new this.renewCommentsModel(__assign({ processRenewCommentsId: processRenewCommentsId, urnNo: trimmedUrn, renewalCycleId: renewalCycleId, vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, productDesign: (_a = input.productDesign) !== null && _a !== void 0 ? _a : '', productPerformance: (_b = input.productPerformance) !== null && _b !== void 0 ? _b : '', manfacturingProcess: (_c = input.manfacturingProcess) !== null && _c !== void 0 ? _c : '', wasteManagement: (_d = input.wasteManagement) !== null && _d !== void 0 ? _d : '', lifeCycleApproach: (_e = input.lifeCycleApproach) !== null && _e !== void 0 ? _e : '', productStewardship: (_f = input.productStewardship) !== null && _f !== void 0 ? _f : '', productInnovation: (_g = input.productInnovation) !== null && _g !== void 0 ? _g : '', updatedDate: now }, Object.fromEntries(COMMENT_FIELDS.filter(function (f) { return input[f] !== undefined; }).map(function (f) { return [f, input[f]]; }))));
                            return [2 /*return*/, record.save()];
                        case 6:
                            error_3 = _h.sent();
                            if (!(error_3 instanceof mongodb_1.MongoServerError && error_3.code === 11000)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.renewCommentsModel.findOne({ urnNo: trimmedUrn }).exec()];
                        case 7:
                            legacy = _h.sent();
                            if (!legacy) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.updateExistingCommentRow(legacy, updateData)];
                        case 8:
                            updated = _h.sent();
                            if (updated) {
                                return [2 /*return*/, updated];
                            }
                            _h.label = 9;
                        case 9:
                            message = error_3 instanceof Error ? error_3.message : 'Failed to save renew comments';
                            throw new common_1.InternalServerErrorException(message);
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewCommentsService_1.prototype.resolveCycleId = function (urnNo, renewalCycleId, fallbackCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle_1, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            if (!mongoose_1.Types.ObjectId.isValid(renewalCycleId.trim())) {
                                throw new common_1.BadRequestException('Invalid renewalCycleId');
                            }
                            return [4 /*yield*/, this.renewalCycleModel.findById(renewalCycleId.trim()).exec()];
                        case 1:
                            cycle_1 = _a.sent();
                            if (!cycle_1 || cycle_1.urnNo !== urnNo.trim()) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, cycle_1._id];
                        case 2:
                            if (fallbackCycleId) {
                                return [2 /*return*/, fallbackCycleId];
                            }
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findOne({ urnNo: urnNo.trim(), status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                    .sort({ cycleNo: -1 })
                                    .exec()];
                        case 3:
                            cycle = _a.sent();
                            if (!cycle) {
                                throw new common_1.BadRequestException('renewalCycleId is required when no active renewal cycle exists');
                            }
                            return [2 /*return*/, cycle._id];
                    }
                });
            });
        };
        return ProcessRenewCommentsService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewCommentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewCommentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewCommentsService = _classThis;
}();
exports.ProcessRenewCommentsService = ProcessRenewCommentsService;
