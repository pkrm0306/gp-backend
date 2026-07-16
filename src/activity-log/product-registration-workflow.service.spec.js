"use strict";
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
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var activity_workflow_constants_1 = require("./activity-workflow.constants");
var product_registration_workflow_service_1 = require("./product-registration-workflow.service");
describe('ProductRegistrationWorkflowService', function () {
    var vendorId = new mongoose_1.Types.ObjectId();
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var urnNo = 'URN-202606250001';
    function createService(savedRows) {
        var _this = this;
        if (savedRows === void 0) { savedRows = []; }
        var rows = __spreadArray([], savedRows, true);
        var activityLogModel = {
            find: jest.fn().mockImplementation(function () { return ({
                sort: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockImplementation(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, __spreadArray([], rows, true)];
                        }); }); }),
                    }),
                }),
            }); }),
        };
        var service = new product_registration_workflow_service_1.ProductRegistrationWorkflowService(activityLogModel);
        var saveSpy = jest
            .spyOn(service, 'saveWorkflowRow')
            .mockImplementation(function (_ctx, activityId, itemStatus) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                rows.push({
                    urn_no: urnNo,
                    activities_id: activityId,
                    activity_status: activityId,
                    status: itemStatus,
                    created_at: new Date(Date.now() + rows.length),
                });
                return [2 /*return*/, { toObject: function () { return rows[rows.length - 1]; } }];
            });
        }); });
        return { service: service, rows: rows, activityLogModel: activityLogModel, saveSpy: saveSpy };
    }
    var ctx = { vendorId: vendorId, manufacturerId: manufacturerId, urnNo: urnNo };
    it('initializes registration with step 0 Done and step 1 Pending', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, saveSpy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createService(), service = _a.service, saveSpy = _a.saveSpy;
                    return [4 /*yield*/, service.initializeOnProductRegistration(ctx)];
                case 1:
                    _b.sent();
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done);
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending);
                    return [2 /*return*/];
            }
        });
    }); });
    it('completes the current pending activity and activates the next step', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, saveSpy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createService([
                        {
                            urn_no: urnNo,
                            activities_id: activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
                            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                            created_at: new Date(),
                        },
                    ]), service = _a.service, saveSpy = _a.saveSpy;
                    return [4 /*yield*/, service.completeActivity(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT)];
                case 1:
                    _b.sent();
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done);
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending);
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects product approval by re-opening product registration as Pending', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, saveSpy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createService([
                        {
                            urn_no: urnNo,
                            activities_id: activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
                            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                            created_at: new Date(),
                        },
                    ]), service = _a.service, saveSpy = _a.saveSpy;
                    return [4 /*yield*/, service.rejectActivity(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT)];
                case 1:
                    _b.sent();
                    expect(saveSpy).toHaveBeenCalledTimes(1);
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending);
                    return [2 /*return*/];
            }
        });
    }); });
    it('prevents completing a non-pending activity', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = createService([
                        {
                            urn_no: urnNo,
                            activities_id: activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
                            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                            created_at: new Date(),
                        },
                    ]).service;
                    return [4 /*yield*/, expect(service.completeActivity(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('syncs urn status 4 to review pending without using legacy step 6', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, saveSpy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createService([
                        {
                            urn_no: urnNo,
                            activities_id: activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
                            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                            created_at: new Date(),
                        },
                    ]), service = _a.service, saveSpy = _a.saveSpy;
                    return [4 /*yield*/, service.syncToUrnStatus(ctx, 3, 4)];
                case 1:
                    _b.sent();
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done);
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW, activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending);
                    return [2 /*return*/];
            }
        });
    }); });
    it('completes workflow when urn status reaches certified (11)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, saveSpy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createService([
                        {
                            urn_no: urnNo,
                            activities_id: activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
                            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                            created_at: new Date(),
                        },
                    ]), service = _a.service, saveSpy = _a.saveSpy;
                    return [4 /*yield*/, service.syncToUrnStatus(ctx, 10, 11)];
                case 1:
                    _b.sent();
                    expect(saveSpy).toHaveBeenCalledWith(ctx, activity_workflow_constants_1.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE, activity_workflow_constants_1.ActivityWorkflowItemStatus.Done);
                    return [2 /*return*/];
            }
        });
    }); });
});
