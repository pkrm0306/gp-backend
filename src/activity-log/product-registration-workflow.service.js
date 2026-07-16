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
exports.ProductRegistrationWorkflowService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var activity_workflow_constants_1 = require("./activity-workflow.constants");
var activity_log_util_1 = require("./activity-log.util");
var ProductRegistrationWorkflowService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductRegistrationWorkflowService = _classThis = /** @class */ (function () {
        function ProductRegistrationWorkflowService_1(activityLogModel) {
            this.activityLogModel = activityLogModel;
        }
        ProductRegistrationWorkflowService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProductRegistrationWorkflowService_1.prototype.normalizeUrn = function (urnNo) {
            return String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
        };
        ProductRegistrationWorkflowService_1.prototype.buildNextFields = function (activityId) {
            var nextId = (0, activity_workflow_constants_1.workflowForwardNextActivityId)(activityId);
            if (nextId == null) {
                return {
                    next_activity: 'Workflow Completed',
                    next_responsibility: undefined,
                };
            }
            return {
                next_acitivities_id: nextId,
                next_activity: (0, activity_workflow_constants_1.workflowActivityName)(nextId),
                next_responsibility: (0, activity_workflow_constants_1.workflowActivityResponsibility)(nextId),
            };
        };
        ProductRegistrationWorkflowService_1.prototype.saveWorkflowRow = function (ctx, activityId, itemStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, nextFields, row;
                return __generator(this, function (_a) {
                    urnNo = this.normalizeUrn(ctx.urnNo);
                    if (!urnNo) {
                        throw new common_1.BadRequestException('URN number is required');
                    }
                    nextFields = this.buildNextFields(activityId);
                    row = new this.activityLogModel(__assign(__assign({ vendor_id: this.toObjectId(ctx.vendorId, 'vendor_id'), manufacturer_id: this.toObjectId(ctx.manufacturerId, 'manufacturer_id'), urn_no: urnNo, activities_id: activityId, activity: (0, activity_workflow_constants_1.workflowActivityName)(activityId), activity_status: activityId, responsibility: (0, activity_workflow_constants_1.workflowActivityResponsibility)(activityId) }, nextFields), { status: itemStatus }));
                    if (ctx.session) {
                        return [2 /*return*/, row.save({ session: ctx.session })];
                    }
                    return [2 /*return*/, row.save()];
                });
            });
        };
        /** Product registered — step 0 Done, step 1 Pending. */
        ProductRegistrationWorkflowService_1.prototype.initializeOnProductRegistration = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = this.normalizeUrn(ctx.urnNo);
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 1:
                            existing = _a.sent();
                            if (existing != null)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationWorkflowService_1.prototype.getCurrentPendingActivityId = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, rows, sorted, _i, sorted_1, row;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalized = this.normalizeUrn(urnNo);
                            if (!normalized)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.activityLogModel
                                    .find({ urn_no: { $in: (0, activity_log_util_1.urnCandidates)(normalized) } })
                                    .sort({ created_at: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _c.sent();
                            sorted = __spreadArray([], rows, true).sort(function (a, b) {
                                var _a, _b;
                                var ta = new Date((_a = a.created_at) !== null && _a !== void 0 ? _a : 0).getTime();
                                var tb = new Date((_b = b.created_at) !== null && _b !== void 0 ? _b : 0).getTime();
                                return tb - ta;
                            });
                            for (_i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
                                row = sorted_1[_i];
                                if ((0, activity_log_util_1.isAuxiliaryActivityLog)(row))
                                    continue;
                                if (Number(row.status) === activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending) {
                                    return [2 /*return*/, Number((_b = (_a = row.activities_id) !== null && _a !== void 0 ? _a : row.activity_status) !== null && _b !== void 0 ? _b : NaN)];
                                }
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        ProductRegistrationWorkflowService_1.prototype.assertCanComplete = function (activityId, pendingId) {
            if (pendingId == null) {
                throw new common_1.BadRequestException('No pending activity to complete');
            }
            if (pendingId !== activityId) {
                throw new common_1.BadRequestException("Cannot complete activity ".concat(activityId, ": current pending activity is ").concat(pendingId));
            }
            if (!(activityId in activity_workflow_constants_1.WORKFLOW_COMPLETE_NEXT)) {
                throw new common_1.BadRequestException("Activity ".concat(activityId, " cannot be completed (workflow finished or invalid)"));
            }
        };
        ProductRegistrationWorkflowService_1.prototype.assertCanReject = function (activityId, pendingId) {
            if (pendingId == null) {
                throw new common_1.BadRequestException('No pending activity to reject');
            }
            if (pendingId !== activityId) {
                throw new common_1.BadRequestException("Cannot reject activity ".concat(activityId, ": current pending activity is ").concat(pendingId));
            }
            if (!(activityId in activity_workflow_constants_1.WORKFLOW_REJECT_TARGET)) {
                throw new common_1.BadRequestException("Activity ".concat(activityId, " does not support rejection rollback"));
            }
        };
        /** Mark current activity Done and activate the next Pending activity. */
        ProductRegistrationWorkflowService_1.prototype.completeActivity = function (ctx, activityId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, pendingId, nextId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = this.normalizeUrn(ctx.urnNo);
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 1:
                            pendingId = _a.sent();
                            this.assertCanComplete(activityId, pendingId);
                            nextId = activity_workflow_constants_1.WORKFLOW_COMPLETE_NEXT[activityId];
                            if (nextId == null) {
                                throw new common_1.BadRequestException("Activity ".concat(activityId, " has no forward step"));
                            }
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, activityId, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, nextId, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Roll back to the previous activity per workflow rules. */
        ProductRegistrationWorkflowService_1.prototype.rejectActivity = function (ctx, activityId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, pendingId, rollbackId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = this.normalizeUrn(ctx.urnNo);
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 1:
                            pendingId = _a.sent();
                            this.assertCanReject(activityId, pendingId);
                            rollbackId = activity_workflow_constants_1.WORKFLOW_REJECT_TARGET[activityId];
                            if (rollbackId == null) {
                                throw new common_1.BadRequestException("Activity ".concat(activityId, " has no reject target"));
                            }
                            // Rejected step stays incomplete — only re-activate the rollback activity as Pending.
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, rollbackId, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending)];
                        case 2:
                            // Rejected step stays incomplete — only re-activate the rollback activity as Pending.
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Mark final certification approval Done — workflow completed (no pending step). */
        ProductRegistrationWorkflowService_1.prototype.completeWorkflow = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, pendingId, finalId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = this.normalizeUrn(ctx.urnNo);
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 1:
                            pendingId = _a.sent();
                            finalId = activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE;
                            if (!(pendingId === finalId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.saveWorkflowRow(ctx, finalId, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3:
                            if (pendingId != null) {
                                throw new common_1.BadRequestException("Cannot complete workflow while activity ".concat(pendingId, " is still pending"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Align workflow pending activity with `products.urnStatus` without skipping steps.
         * Used when URN status is advanced through existing product/payment services.
         */
        ProductRegistrationWorkflowService_1.prototype.syncToUrnStatus = function (ctx, previousUrnStatus, nextUrnStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var targetPending, urnNo, pendingId, maxSteps, steps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (nextUrnStatus >= 12)
                                return [2 /*return*/];
                            targetPending = activity_workflow_constants_1.URN_STATUS_PENDING_ACTIVITY[nextUrnStatus];
                            if (targetPending === undefined)
                                return [2 /*return*/];
                            urnNo = this.normalizeUrn(ctx.urnNo);
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 1:
                            pendingId = _a.sent();
                            if (!(pendingId == null && nextUrnStatus === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.initializeOnProductRegistration(ctx)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3:
                            if (!(targetPending === null)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.completeWorkflow(ctx)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                        case 5:
                            maxSteps = 20;
                            steps = 0;
                            _a.label = 6;
                        case 6:
                            if (!(pendingId !== targetPending && steps < maxSteps)) return [3 /*break*/, 16];
                            steps += 1;
                            if (!(pendingId == null)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.initializeOnProductRegistration(ctx)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 8:
                            pendingId = _a.sent();
                            return [3 /*break*/, 6];
                        case 9:
                            if (!this.shouldRejectToReach(pendingId, targetPending)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.rejectActivity(ctx, pendingId)];
                        case 10:
                            _a.sent();
                            return [3 /*break*/, 14];
                        case 11:
                            if (!this.shouldCompleteToReach(pendingId, targetPending)) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.completeActivity(ctx, pendingId)];
                        case 12:
                            _a.sent();
                            return [3 /*break*/, 14];
                        case 13: throw new common_1.BadRequestException("Invalid workflow transition from activity ".concat(pendingId, " to target ").concat(targetPending, " (urnStatus ").concat(previousUrnStatus, "\u2192").concat(nextUrnStatus, ")"));
                        case 14: return [4 /*yield*/, this.getCurrentPendingActivityId(urnNo)];
                        case 15:
                            pendingId = _a.sent();
                            return [3 /*break*/, 6];
                        case 16:
                            if (pendingId !== targetPending) {
                                throw new common_1.InternalServerErrorException('Workflow sync exceeded maximum transition steps');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationWorkflowService_1.prototype.shouldCompleteToReach = function (currentPending, targetPending) {
            var cursor = currentPending;
            var visited = new Set();
            while (cursor != null && !visited.has(cursor)) {
                visited.add(cursor);
                if (cursor === targetPending)
                    return true;
                var next = activity_workflow_constants_1.WORKFLOW_COMPLETE_NEXT[cursor];
                if (next == null)
                    break;
                cursor = next;
            }
            return false;
        };
        ProductRegistrationWorkflowService_1.prototype.shouldRejectToReach = function (currentPending, targetPending) {
            if (!(currentPending in activity_workflow_constants_1.WORKFLOW_REJECT_TARGET))
                return false;
            var rejectTarget = activity_workflow_constants_1.WORKFLOW_REJECT_TARGET[currentPending];
            if (rejectTarget == null)
                return false;
            return this.shouldCompleteToReach(rejectTarget, targetPending);
        };
        return ProductRegistrationWorkflowService_1;
    }());
    __setFunctionName(_classThis, "ProductRegistrationWorkflowService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductRegistrationWorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductRegistrationWorkflowService = _classThis;
}();
exports.ProductRegistrationWorkflowService = ProductRegistrationWorkflowService;
