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
exports.GrievanceSchema = exports.Grievance = exports.GrievanceStatus = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var grievance_id_counter_schema_1 = require("./grievance-id-counter.schema");
var GrievanceStatus;
(function (GrievanceStatus) {
    GrievanceStatus["Pending"] = "Pending";
    GrievanceStatus["Responded"] = "Responded";
    GrievanceStatus["Closed"] = "Closed";
})(GrievanceStatus || (exports.GrievanceStatus = GrievanceStatus = {}));
var Grievance = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'grievances', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _grievanceNo_decorators;
    var _grievanceNo_initializers = [];
    var _grievanceNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _attachment_decorators;
    var _attachment_initializers = [];
    var _attachment_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _adminResponse_decorators;
    var _adminResponse_initializers = [];
    var _adminResponse_extraInitializers = [];
    var _respondedBy_decorators;
    var _respondedBy_initializers = [];
    var _respondedBy_extraInitializers = [];
    var _respondedAt_decorators;
    var _respondedAt_initializers = [];
    var _respondedAt_extraInitializers = [];
    var Grievance = _classThis = /** @class */ (function () {
        function Grievance_1() {
            /** Auto-generated as GRV-000001, GRV-000002, … */
            this.grievanceNo = __runInitializers(this, _grievanceNo_initializers, void 0);
            this.vendorId = (__runInitializers(this, _grievanceNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.category = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.subject = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.attachment = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _attachment_initializers, void 0));
            this.status = (__runInitializers(this, _attachment_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.adminResponse = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _adminResponse_initializers, void 0));
            this.respondedBy = (__runInitializers(this, _adminResponse_extraInitializers), __runInitializers(this, _respondedBy_initializers, void 0));
            this.respondedAt = (__runInitializers(this, _respondedBy_extraInitializers), __runInitializers(this, _respondedAt_initializers, void 0));
            __runInitializers(this, _respondedAt_extraInitializers);
        }
        return Grievance_1;
    }());
    __setFunctionName(_classThis, "Grievance");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _grievanceNo_decorators = [(0, mongoose_1.Prop)({ type: String, unique: true, index: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true, index: true })];
        _category_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, index: true })];
        _subject_decorators = [(0, mongoose_1.Prop)({ type: String, required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ type: String, required: true })];
        _attachment_decorators = [(0, mongoose_1.Prop)({ type: String, required: false })];
        _status_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: Object.values(GrievanceStatus),
                default: GrievanceStatus.Pending,
                index: true,
            })];
        _adminResponse_decorators = [(0, mongoose_1.Prop)({ type: String, required: false, default: '' })];
        _respondedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: false, default: null })];
        _respondedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, required: false, default: null })];
        __esDecorate(null, null, _grievanceNo_decorators, { kind: "field", name: "grievanceNo", static: false, private: false, access: { has: function (obj) { return "grievanceNo" in obj; }, get: function (obj) { return obj.grievanceNo; }, set: function (obj, value) { obj.grievanceNo = value; } }, metadata: _metadata }, _grievanceNo_initializers, _grievanceNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _attachment_decorators, { kind: "field", name: "attachment", static: false, private: false, access: { has: function (obj) { return "attachment" in obj; }, get: function (obj) { return obj.attachment; }, set: function (obj, value) { obj.attachment = value; } }, metadata: _metadata }, _attachment_initializers, _attachment_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _adminResponse_decorators, { kind: "field", name: "adminResponse", static: false, private: false, access: { has: function (obj) { return "adminResponse" in obj; }, get: function (obj) { return obj.adminResponse; }, set: function (obj, value) { obj.adminResponse = value; } }, metadata: _metadata }, _adminResponse_initializers, _adminResponse_extraInitializers);
        __esDecorate(null, null, _respondedBy_decorators, { kind: "field", name: "respondedBy", static: false, private: false, access: { has: function (obj) { return "respondedBy" in obj; }, get: function (obj) { return obj.respondedBy; }, set: function (obj, value) { obj.respondedBy = value; } }, metadata: _metadata }, _respondedBy_initializers, _respondedBy_extraInitializers);
        __esDecorate(null, null, _respondedAt_decorators, { kind: "field", name: "respondedAt", static: false, private: false, access: { has: function (obj) { return "respondedAt" in obj; }, get: function (obj) { return obj.respondedAt; }, set: function (obj, value) { obj.respondedAt = value; } }, metadata: _metadata }, _respondedAt_initializers, _respondedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Grievance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Grievance = _classThis;
}();
exports.Grievance = Grievance;
exports.GrievanceSchema = mongoose_1.SchemaFactory.createForClass(Grievance);
exports.GrievanceSchema.index({ vendorId: 1, status: 1 });
exports.GrievanceSchema.index({ vendorId: 1, createdAt: -1 });
/**
 * Assigns grievanceNo (GRV-000001 …) on first save via an atomic counter.
 */
exports.GrievanceSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var CounterModel, counter, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!this.isNew || this.grievanceNo) {
                        return [2 /*return*/, next()];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    CounterModel = this.db.model(grievance_id_counter_schema_1.GrievanceIdCounter.name);
                    return [4 /*yield*/, CounterModel.findOneAndUpdate({ _id: grievance_id_counter_schema_1.GRIEVANCE_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { upsert: true, new: true })];
                case 2:
                    counter = _a.sent();
                    this.grievanceNo = "GRV-".concat(String(counter.seq).padStart(6, '0'));
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
