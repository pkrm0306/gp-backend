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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertUrnFinalReviewDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function omitEmptyOptional(value) {
    if (value === '' || value === null) {
        return undefined;
    }
    return value;
}
function parseOptionalNumber(value) {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
var UpsertUrnFinalReviewDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _technicalReview_decorators;
    var _technicalReview_initializers = [];
    var _technicalReview_extraInitializers = [];
    var _finalReview_decorators;
    var _finalReview_initializers = [];
    var _finalReview_extraInitializers = [];
    var _minCredits_decorators;
    var _minCredits_initializers = [];
    var _minCredits_extraInitializers = [];
    var _maxCredits_decorators;
    var _maxCredits_initializers = [];
    var _maxCredits_extraInitializers = [];
    var _technical_review_decorators;
    var _technical_review_initializers = [];
    var _technical_review_extraInitializers = [];
    var _final_review_decorators;
    var _final_review_initializers = [];
    var _final_review_extraInitializers = [];
    var _min_credits_decorators;
    var _min_credits_initializers = [];
    var _min_credits_extraInitializers = [];
    var _max_credits_decorators;
    var _max_credits_initializers = [];
    var _max_credits_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpsertUrnFinalReviewDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.technicalReview = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _technicalReview_initializers, void 0));
                this.finalReview = (__runInitializers(this, _technicalReview_extraInitializers), __runInitializers(this, _finalReview_initializers, void 0));
                this.minCredits = (__runInitializers(this, _finalReview_extraInitializers), __runInitializers(this, _minCredits_initializers, void 0));
                this.maxCredits = (__runInitializers(this, _minCredits_extraInitializers), __runInitializers(this, _maxCredits_initializers, void 0));
                this.technical_review = (__runInitializers(this, _maxCredits_extraInitializers), __runInitializers(this, _technical_review_initializers, void 0));
                this.final_review = (__runInitializers(this, _technical_review_extraInitializers), __runInitializers(this, _final_review_initializers, void 0));
                this.min_credits = (__runInitializers(this, _final_review_extraInitializers), __runInitializers(this, _min_credits_initializers, void 0));
                this.max_credits = (__runInitializers(this, _min_credits_extraInitializers), __runInitializers(this, _max_credits_initializers, void 0));
                __runInitializers(this, _max_credits_extraInitializers);
            }
            return UpsertUrnFinalReviewDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260527122016' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _technicalReview_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Technical review notes (HTML/text)' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return omitEmptyOptional(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.technical_review);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _finalReview_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Final review notes (HTML/text)' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return omitEmptyOptional(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.final_review);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _minCredits_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 50, description: 'Minimum credits achieved' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return parseOptionalNumber(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.min_credits);
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _maxCredits_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 85, description: 'Maximum credits achieved' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return parseOptionalNumber(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.max_credits);
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _technical_review_decorators = [(0, class_validator_1.Allow)()];
            _final_review_decorators = [(0, class_validator_1.Allow)()];
            _min_credits_decorators = [(0, class_validator_1.Allow)()];
            _max_credits_decorators = [(0, class_validator_1.Allow)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _technicalReview_decorators, { kind: "field", name: "technicalReview", static: false, private: false, access: { has: function (obj) { return "technicalReview" in obj; }, get: function (obj) { return obj.technicalReview; }, set: function (obj, value) { obj.technicalReview = value; } }, metadata: _metadata }, _technicalReview_initializers, _technicalReview_extraInitializers);
            __esDecorate(null, null, _finalReview_decorators, { kind: "field", name: "finalReview", static: false, private: false, access: { has: function (obj) { return "finalReview" in obj; }, get: function (obj) { return obj.finalReview; }, set: function (obj, value) { obj.finalReview = value; } }, metadata: _metadata }, _finalReview_initializers, _finalReview_extraInitializers);
            __esDecorate(null, null, _minCredits_decorators, { kind: "field", name: "minCredits", static: false, private: false, access: { has: function (obj) { return "minCredits" in obj; }, get: function (obj) { return obj.minCredits; }, set: function (obj, value) { obj.minCredits = value; } }, metadata: _metadata }, _minCredits_initializers, _minCredits_extraInitializers);
            __esDecorate(null, null, _maxCredits_decorators, { kind: "field", name: "maxCredits", static: false, private: false, access: { has: function (obj) { return "maxCredits" in obj; }, get: function (obj) { return obj.maxCredits; }, set: function (obj, value) { obj.maxCredits = value; } }, metadata: _metadata }, _maxCredits_initializers, _maxCredits_extraInitializers);
            __esDecorate(null, null, _technical_review_decorators, { kind: "field", name: "technical_review", static: false, private: false, access: { has: function (obj) { return "technical_review" in obj; }, get: function (obj) { return obj.technical_review; }, set: function (obj, value) { obj.technical_review = value; } }, metadata: _metadata }, _technical_review_initializers, _technical_review_extraInitializers);
            __esDecorate(null, null, _final_review_decorators, { kind: "field", name: "final_review", static: false, private: false, access: { has: function (obj) { return "final_review" in obj; }, get: function (obj) { return obj.final_review; }, set: function (obj, value) { obj.final_review = value; } }, metadata: _metadata }, _final_review_initializers, _final_review_extraInitializers);
            __esDecorate(null, null, _min_credits_decorators, { kind: "field", name: "min_credits", static: false, private: false, access: { has: function (obj) { return "min_credits" in obj; }, get: function (obj) { return obj.min_credits; }, set: function (obj, value) { obj.min_credits = value; } }, metadata: _metadata }, _min_credits_initializers, _min_credits_extraInitializers);
            __esDecorate(null, null, _max_credits_decorators, { kind: "field", name: "max_credits", static: false, private: false, access: { has: function (obj) { return "max_credits" in obj; }, get: function (obj) { return obj.max_credits; }, set: function (obj, value) { obj.max_credits = value; } }, metadata: _metadata }, _max_credits_initializers, _max_credits_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpsertUrnFinalReviewDto = UpsertUrnFinalReviewDto;
