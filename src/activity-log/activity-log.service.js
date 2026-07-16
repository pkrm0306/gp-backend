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
exports.ActivityLogService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var activity_log_util_1 = require("./activity-log.util");
var ActivityLogService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ActivityLogService = _classThis = /** @class */ (function () {
        function ActivityLogService_1(activityLogModel, activityLogAccessService) {
            this.activityLogModel = activityLogModel;
            this.activityLogAccessService = activityLogAccessService;
        }
        /**
         * Safely convert string to ObjectId with validation
         */
        ActivityLogService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        /**
         * Log an activity
         * Automatically sets created_at and updated_at timestamps
         */
        ActivityLogService_1.prototype.logActivity = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, manufacturerObjectId, activityLogData, activityLog, savedActivityLog, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(data.vendor_id, 'vendor_id');
                            manufacturerObjectId = this.toObjectId(data.manufacturer_id, 'manufacturer_id');
                            activityLogData = {
                                vendor_id: vendorObjectId,
                                manufacturer_id: manufacturerObjectId,
                                urn_no: data.urn_no,
                                activities_id: data.activities_id,
                                activity: data.activity,
                                activity_status: data.activity_status,
                                sub_activities_id: data.sub_activities_id,
                                responsibility: data.responsibility,
                                next_responsibility: data.next_responsibility,
                                next_acitivities_id: data.next_acitivities_id,
                                next_activity: data.next_activity,
                                // Timeline entries represent the next actionable step by default.
                                status: (_a = data.status) !== null && _a !== void 0 ? _a : 0,
                                // created_at and updated_at will be automatically set by Mongoose timestamps
                            };
                            activityLog = new this.activityLogModel(activityLogData);
                            return [4 /*yield*/, activityLog.save()];
                        case 1:
                            savedActivityLog = _b.sent();
                            return [2 /*return*/, savedActivityLog];
                        case 2:
                            error_1 = _b.sent();
                            console.error('[Activity Log] Error logging activity:', error_1);
                            console.error('[Activity Log] Error stack:', error_1.stack);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to log activity. Please check the logs for details.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get all activity logs for a specific URN
         * Sorted by created_at ascending for timeline display
         */
        ActivityLogService_1.prototype.getActivityLogsByUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized;
                return __generator(this, function (_a) {
                    normalized = (0, activity_log_util_1.normalizeUrnNo)(urnNo);
                    if (!normalized) {
                        throw new common_1.BadRequestException('URN number is required');
                    }
                    try {
                        return [2 /*return*/, this.activityLogModel
                                .find({ urn_no: { $in: (0, activity_log_util_1.urnCandidates)(normalized) } })
                                .sort({ created_at: 1 })
                                .exec()];
                    }
                    catch (error) {
                        console.error('[Activity Log] Error getting activity logs by URN:', error);
                        console.error('[Activity Log] Error stack:', error.stack);
                        throw new common_1.InternalServerErrorException(error.message ||
                            'Failed to get activity logs. Please check the logs for details.');
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Timeline for admin or vendor — vendor may only read owned URNs.
         */
        ActivityLogService_1.prototype.getActivityLogsByUrnForCaller = function (urnNo, user) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.activityLogAccessService.assertCallerCanReadUrnLogs(urnNo, user)];
                        case 1:
                            normalized = _a.sent();
                            return [2 /*return*/, this.buildUrnActivityLogPayload(normalized)];
                    }
                });
            });
        };
        /** Quick View / admin URN details — workflow activity without auth caller check. */
        ActivityLogService_1.prototype.getQuickViewActivityForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = (0, activity_log_util_1.normalizeUrnNo)(urnNo);
                            if (!normalized) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.buildUrnActivityLogPayload(normalized)];
                        case 1:
                            payload = _a.sent();
                            return [2 /*return*/, payload.currentActivity];
                    }
                });
            });
        };
        ActivityLogService_1.prototype.buildUrnActivityLogPayload = function (normalizedUrn) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, rows, urnStatus, allEntries, workflowEntries, auxiliaryEvents;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.getActivityLogsByUrn(normalizedUrn),
                                this.activityLogAccessService.resolveMaxUrnWorkflowStatus(normalizedUrn),
                            ])];
                        case 1:
                            _a = _b.sent(), rows = _a[0], urnStatus = _a[1];
                            allEntries = rows.map(function (row) { return (0, activity_log_util_1.formatActivityLogRow)(row); });
                            workflowEntries = allEntries.filter(function (row) { return !(0, activity_log_util_1.isAuxiliaryActivityLog)(row); });
                            auxiliaryEvents = allEntries.filter(function (row) {
                                return (0, activity_log_util_1.isAuxiliaryActivityLog)(row);
                            });
                            return [2 /*return*/, {
                                    allEntries: allEntries,
                                    workflowEntries: workflowEntries,
                                    auxiliaryEvents: auxiliaryEvents,
                                    currentActivity: (0, activity_log_util_1.resolveCurrentWorkflowActivityLog)(rows, urnStatus),
                                }];
                    }
                });
            });
        };
        return ActivityLogService_1;
    }());
    __setFunctionName(_classThis, "ActivityLogService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityLogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityLogService = _classThis;
}();
exports.ActivityLogService = ActivityLogService;
