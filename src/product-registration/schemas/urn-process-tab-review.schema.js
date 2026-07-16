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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrnProcessTabReviewSchema = exports.UrnProcessTabReview = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var UrnProcessTabReview = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'urn_process_tab_reviews', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _tabKey_decorators;
    var _tabKey_initializers = [];
    var _tabKey_extraInitializers = [];
    var _stepId_decorators;
    var _stepId_initializers = [];
    var _stepId_extraInitializers = [];
    var _reviewStatus_decorators;
    var _reviewStatus_initializers = [];
    var _reviewStatus_extraInitializers = [];
    var _reviewedBy_decorators;
    var _reviewedBy_initializers = [];
    var _reviewedBy_extraInitializers = [];
    var _reviewedAt_decorators;
    var _reviewedAt_initializers = [];
    var _reviewedAt_extraInitializers = [];
    var _rejectionRemarks_decorators;
    var _rejectionRemarks_initializers = [];
    var _rejectionRemarks_extraInitializers = [];
    var UrnProcessTabReview = _classThis = /** @class */ (function () {
        function UrnProcessTabReview_1() {
            this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
            this.tabKey = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _tabKey_initializers, void 0));
            /** `0` = process tab aggregate; `1–15` = raw materials step */
            this.stepId = (__runInitializers(this, _tabKey_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
            /** `0` pending, `1` approved, `2` rejected */
            this.reviewStatus = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _reviewStatus_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _reviewStatus_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedAt = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedAt_initializers, void 0));
            this.rejectionRemarks = (__runInitializers(this, _reviewedAt_extraInitializers), __runInitializers(this, _rejectionRemarks_initializers, void 0));
            __runInitializers(this, _rejectionRemarks_extraInitializers);
        }
        return UrnProcessTabReview_1;
    }());
    __setFunctionName(_classThis, "UrnProcessTabReview");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, index: true })];
        _tabKey_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _stepId_decorators = [(0, mongoose_1.Prop)({ required: true, default: 0 })];
        _reviewStatus_decorators = [(0, mongoose_1.Prop)({ required: true, default: 0 })];
        _reviewedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: null })];
        _reviewedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        _rejectionRemarks_decorators = [(0, mongoose_1.Prop)({ trim: true, default: null })];
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _tabKey_decorators, { kind: "field", name: "tabKey", static: false, private: false, access: { has: function (obj) { return "tabKey" in obj; }, get: function (obj) { return obj.tabKey; }, set: function (obj, value) { obj.tabKey = value; } }, metadata: _metadata }, _tabKey_initializers, _tabKey_extraInitializers);
        __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: function (obj) { return "stepId" in obj; }, get: function (obj) { return obj.stepId; }, set: function (obj, value) { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
        __esDecorate(null, null, _reviewStatus_decorators, { kind: "field", name: "reviewStatus", static: false, private: false, access: { has: function (obj) { return "reviewStatus" in obj; }, get: function (obj) { return obj.reviewStatus; }, set: function (obj, value) { obj.reviewStatus = value; } }, metadata: _metadata }, _reviewStatus_initializers, _reviewStatus_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: function (obj) { return "reviewedBy" in obj; }, get: function (obj) { return obj.reviewedBy; }, set: function (obj, value) { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedAt_decorators, { kind: "field", name: "reviewedAt", static: false, private: false, access: { has: function (obj) { return "reviewedAt" in obj; }, get: function (obj) { return obj.reviewedAt; }, set: function (obj, value) { obj.reviewedAt = value; } }, metadata: _metadata }, _reviewedAt_initializers, _reviewedAt_extraInitializers);
        __esDecorate(null, null, _rejectionRemarks_decorators, { kind: "field", name: "rejectionRemarks", static: false, private: false, access: { has: function (obj) { return "rejectionRemarks" in obj; }, get: function (obj) { return obj.rejectionRemarks; }, set: function (obj, value) { obj.rejectionRemarks = value; } }, metadata: _metadata }, _rejectionRemarks_initializers, _rejectionRemarks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnProcessTabReview = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnProcessTabReview = _classThis;
}();
exports.UrnProcessTabReview = UrnProcessTabReview;
exports.UrnProcessTabReviewSchema = mongoose_1.SchemaFactory.createForClass(UrnProcessTabReview);
exports.UrnProcessTabReviewSchema.index({ urnNo: 1, tabKey: 1, stepId: 1 }, { unique: true });
exports.UrnProcessTabReviewSchema.index({ urnNo: 1, reviewStatus: 1 });
