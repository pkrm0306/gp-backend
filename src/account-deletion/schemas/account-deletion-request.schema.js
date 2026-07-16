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
exports.AccountDeletionRequestSchema = exports.AccountDeletionRequest = exports.ACCOUNT_DELETION_REASONS = exports.AccountDeletionStatus = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var account_deletion_id_counter_schema_1 = require("./account-deletion-id-counter.schema");
var AccountDeletionStatus;
(function (AccountDeletionStatus) {
    AccountDeletionStatus["Requested"] = "Requested";
    AccountDeletionStatus["Approved"] = "Approved";
    AccountDeletionStatus["Rejected"] = "Rejected";
    AccountDeletionStatus["Completed"] = "Completed";
})(AccountDeletionStatus || (exports.AccountDeletionStatus = AccountDeletionStatus = {}));
exports.ACCOUNT_DELETION_REASONS = [
    'No longer using the platform',
    'Privacy concerns',
    'Duplicate account',
    'Business closed or transferred',
    'Other',
];
var AccountDeletionRequest = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'account_deletion_requests', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _requestNo_decorators;
    var _requestNo_initializers = [];
    var _requestNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _confirmed_decorators;
    var _confirmed_initializers = [];
    var _confirmed_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _adminRemarks_decorators;
    var _adminRemarks_initializers = [];
    var _adminRemarks_extraInitializers = [];
    var _reviewedBy_decorators;
    var _reviewedBy_initializers = [];
    var _reviewedBy_extraInitializers = [];
    var _reviewedAt_decorators;
    var _reviewedAt_initializers = [];
    var _reviewedAt_extraInitializers = [];
    var AccountDeletionRequest = _classThis = /** @class */ (function () {
        function AccountDeletionRequest_1() {
            /** Auto-generated as ADR-000001, ADR-000002, … */
            this.requestNo = __runInitializers(this, _requestNo_initializers, void 0);
            this.vendorId = (__runInitializers(this, _requestNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.reason = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            /** Vendor confirmed understanding that this is a deletion request workflow. */
            this.confirmed = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _confirmed_initializers, void 0));
            this.status = (__runInitializers(this, _confirmed_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.adminRemarks = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _adminRemarks_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _adminRemarks_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedAt = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedAt_initializers, void 0));
            __runInitializers(this, _reviewedAt_extraInitializers);
        }
        return AccountDeletionRequest_1;
    }());
    __setFunctionName(_classThis, "AccountDeletionRequest");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _requestNo_decorators = [(0, mongoose_1.Prop)({ type: String, unique: true, index: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true, index: true })];
        _reason_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, index: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ type: String, required: false, default: '' })];
        _confirmed_decorators = [(0, mongoose_1.Prop)({ type: Boolean, required: true, default: false })];
        _status_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: Object.values(AccountDeletionStatus),
                default: AccountDeletionStatus.Requested,
                index: true,
            })];
        _adminRemarks_decorators = [(0, mongoose_1.Prop)({ type: String, required: false, default: '' })];
        _reviewedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: false, default: null })];
        _reviewedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, required: false, default: null })];
        __esDecorate(null, null, _requestNo_decorators, { kind: "field", name: "requestNo", static: false, private: false, access: { has: function (obj) { return "requestNo" in obj; }, get: function (obj) { return obj.requestNo; }, set: function (obj, value) { obj.requestNo = value; } }, metadata: _metadata }, _requestNo_initializers, _requestNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _confirmed_decorators, { kind: "field", name: "confirmed", static: false, private: false, access: { has: function (obj) { return "confirmed" in obj; }, get: function (obj) { return obj.confirmed; }, set: function (obj, value) { obj.confirmed = value; } }, metadata: _metadata }, _confirmed_initializers, _confirmed_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _adminRemarks_decorators, { kind: "field", name: "adminRemarks", static: false, private: false, access: { has: function (obj) { return "adminRemarks" in obj; }, get: function (obj) { return obj.adminRemarks; }, set: function (obj, value) { obj.adminRemarks = value; } }, metadata: _metadata }, _adminRemarks_initializers, _adminRemarks_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: function (obj) { return "reviewedBy" in obj; }, get: function (obj) { return obj.reviewedBy; }, set: function (obj, value) { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedAt_decorators, { kind: "field", name: "reviewedAt", static: false, private: false, access: { has: function (obj) { return "reviewedAt" in obj; }, get: function (obj) { return obj.reviewedAt; }, set: function (obj, value) { obj.reviewedAt = value; } }, metadata: _metadata }, _reviewedAt_initializers, _reviewedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AccountDeletionRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AccountDeletionRequest = _classThis;
}();
exports.AccountDeletionRequest = AccountDeletionRequest;
exports.AccountDeletionRequestSchema = mongoose_1.SchemaFactory.createForClass(AccountDeletionRequest);
exports.AccountDeletionRequestSchema.index({ vendorId: 1, status: 1 });
exports.AccountDeletionRequestSchema.index({ vendorId: 1, createdAt: -1 });
/**
 * Assigns requestNo (ADR-000001 …) on first save via an atomic counter.
 */
exports.AccountDeletionRequestSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var CounterModel, counter, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!this.isNew || this.requestNo) {
                        return [2 /*return*/, next()];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    CounterModel = this.db.model(account_deletion_id_counter_schema_1.AccountDeletionIdCounter.name);
                    return [4 /*yield*/, CounterModel.findOneAndUpdate({ _id: account_deletion_id_counter_schema_1.ACCOUNT_DELETION_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { upsert: true, new: true })];
                case 2:
                    counter = _a.sent();
                    this.requestNo = "ADR-".concat(String(counter.seq).padStart(6, '0'));
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
