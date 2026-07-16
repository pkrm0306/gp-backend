"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ActivityLogController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var create_activity_log_dto_1 = require("./dto/create-activity-log.dto");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var ActivityLogController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Activity Log'), (0, common_1.Controller)('activity-log'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createActivityLog_decorators;
    var _getActivityLogsByUrn_decorators;
    var ActivityLogController = _classThis = /** @class */ (function () {
        function ActivityLogController_1(activityLogService) {
            this.activityLogService = (__runInitializers(this, _instanceExtraInitializers), activityLogService);
        }
        ActivityLogController_1.prototype.createActivityLog = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.activityLogService.logActivity({
                                vendor_id: dto.vendor_id,
                                manufacturer_id: dto.manufacturer_id,
                                urn_no: dto.urn_no.trim(),
                                activities_id: dto.activities_id,
                                activity: dto.activity,
                                activity_status: dto.activity_status,
                                sub_activities_id: dto.sub_activities_id,
                                responsibility: dto.responsibility,
                                next_responsibility: dto.next_responsibility,
                                next_acitivities_id: dto.next_acitivities_id,
                                next_activity: dto.next_activity,
                                status: dto.status,
                            })];
                        case 1:
                            saved = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Activity logged successfully',
                                    data: saved.toObject(),
                                }];
                    }
                });
            });
        };
        ActivityLogController_1.prototype.getActivityLogsByUrn = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, workflowEntries, auxiliaryEvents, allEntries, currentActivity, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            if (!urnNo || urnNo.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.activityLogService.getActivityLogsByUrnForCaller(urnNo.trim(), user)];
                        case 1:
                            _a = _b.sent(), workflowEntries = _a.workflowEntries, auxiliaryEvents = _a.auxiliaryEvents, allEntries = _a.allEntries, currentActivity = _a.currentActivity;
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Activity logs retrieved successfully',
                                    data: workflowEntries,
                                    allEntries: allEntries,
                                    auxiliaryEvents: auxiliaryEvents,
                                    currentActivity: currentActivity,
                                    quickView: currentActivity,
                                }];
                        case 2:
                            error_1 = _b.sent();
                            console.error('Controller error:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ActivityLogController_1;
    }());
    __setFunctionName(_classThis, "ActivityLogController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createActivityLog_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Create activity log entry',
                description: 'Common endpoint to persist one activity log row. Server-side code can instead inject `ActivityLogService.logActivity()` directly.',
            }), (0, swagger_1.ApiBody)({ type: create_activity_log_dto_1.CreateActivityLogDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Activity log created' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or invalid ObjectId',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to save activity log' })];
        _getActivityLogsByUrn_decorators = [(0, common_1.Get)(':urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Get activity logs by URN (admin or vendor)',
                description: 'Returns workflow activity logs for a URN (site-visit admin events are in `auxiliaryEvents`, not `data`). ' +
                    'Use `currentActivity` / `quickView` for Quick View status. ' +
                    'Legacy clients that read the last `data[]` row should use workflow-only `data`. ' +
                    '**Admin/staff** may read any URN. **Vendor/partner** may only read URNs they own (403 otherwise). ' +
                    'Empty array when no logs yet.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn_no',
                description: 'URN number',
                example: 'URN-20240302120000',
                type: String,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Activity logs retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    vendor_id: { type: 'string' },
                                    manufacturer_id: { type: 'string' },
                                    urn_no: { type: 'string', example: 'URN-20240302120000' },
                                    activities_id: { type: 'number', example: 3 },
                                    activity: {
                                        type: 'string',
                                        example: 'Approve/Reject Registration Fee Proposal and make payment',
                                    },
                                    activity_status: { type: 'number', example: 3 },
                                    sub_activities_id: { type: 'number' },
                                    responsibility: { type: 'string', example: 'Manufacturer' },
                                    next_responsibility: { type: 'string', example: 'Admin' },
                                    next_acitivities_id: { type: 'number', example: 4 },
                                    next_activity: {
                                        type: 'string',
                                        example: 'Approve/Reject Registration Fee',
                                    },
                                    status: { type: 'number', example: 1 },
                                    created_at: { type: 'string', format: 'date-time' },
                                    updated_at: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid URN number' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Vendor does not own this URN' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'URN not found' })];
        __esDecorate(_classThis, null, _createActivityLog_decorators, { kind: "method", name: "createActivityLog", static: false, private: false, access: { has: function (obj) { return "createActivityLog" in obj; }, get: function (obj) { return obj.createActivityLog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivityLogsByUrn_decorators, { kind: "method", name: "getActivityLogsByUrn", static: false, private: false, access: { has: function (obj) { return "getActivityLogsByUrn" in obj; }, get: function (obj) { return obj.getActivityLogsByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityLogController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityLogController = _classThis;
}();
exports.ActivityLogController = ActivityLogController;
