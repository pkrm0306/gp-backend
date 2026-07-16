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
exports.ProcessFinalReviewService = void 0;
var common_1 = require("@nestjs/common");
var active_product_filter_1 = require("../constants/active-product.filter");
var format_process_final_review_util_1 = require("../helpers/format-process-final-review.util");
var ProcessFinalReviewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessFinalReviewService = _classThis = /** @class */ (function () {
        function ProcessFinalReviewService_1(processFinalReviewModel, productModel, sequenceHelper) {
            this.processFinalReviewModel = processFinalReviewModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
        }
        ProcessFinalReviewService_1.prototype.upsertForUrn = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, product, minCredits, maxCredits, vendorObjectId, now, setData, existing, saved, processFinalReviewId;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            urnNo = String((_a = dto.urnNo) !== null && _a !== void 0 ? _a : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: urnNo }))
                                    .select('vendorId urnNo productStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _d.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(urnNo));
                            }
                            minCredits = dto.minCredits;
                            maxCredits = dto.maxCredits;
                            if (minCredits != null &&
                                maxCredits != null &&
                                Number.isFinite(minCredits) &&
                                Number.isFinite(maxCredits) &&
                                maxCredits < minCredits) {
                                throw new common_1.BadRequestException('maxCredits must be greater than or equal to minCredits');
                            }
                            vendorObjectId = product.vendorId;
                            now = new Date();
                            setData = { updatedDate: now };
                            if (dto.technicalReview !== undefined) {
                                setData.technicalReview = dto.technicalReview;
                            }
                            if (dto.finalReview !== undefined) {
                                setData.finalReview = dto.finalReview;
                            }
                            if (dto.minCredits !== undefined) {
                                setData.minCredits = dto.minCredits;
                            }
                            if (dto.maxCredits !== undefined) {
                                setData.maxCredits = dto.maxCredits;
                            }
                            return [4 /*yield*/, this.processFinalReviewModel
                                    .findOne({ urnNo: urnNo, vendorId: vendorObjectId })
                                    .exec()];
                        case 2:
                            existing = _d.sent();
                            if (!existing) return [3 /*break*/, 4];
                            Object.assign(existing, setData);
                            return [4 /*yield*/, existing.save()];
                        case 3:
                            saved = _d.sent();
                            return [3 /*break*/, 7];
                        case 4: return [4 /*yield*/, this.sequenceHelper.getProcessFinalReviewId()];
                        case 5:
                            processFinalReviewId = _d.sent();
                            return [4 /*yield*/, this.processFinalReviewModel.create({
                                    processFinalReviewId: processFinalReviewId,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                    technicalReview: (_b = dto.technicalReview) !== null && _b !== void 0 ? _b : '',
                                    finalReview: (_c = dto.finalReview) !== null && _c !== void 0 ? _c : '',
                                    minCredits: dto.minCredits,
                                    maxCredits: dto.maxCredits,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 6:
                            saved = _d.sent();
                            _d.label = 7;
                        case 7: return [2 /*return*/, (0, format_process_final_review_util_1.formatProcessFinalReviewPayload)(saved.toObject())];
                    }
                });
            });
        };
        ProcessFinalReviewService_1.prototype.getByUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, product, row;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmed }))
                                    .select('vendorId')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.processFinalReviewModel
                                    .findOne({
                                    urnNo: trimmed,
                                    vendorId: product.vendorId,
                                })
                                    .lean()
                                    .exec()];
                        case 2:
                            row = _b.sent();
                            return [2 /*return*/, (0, format_process_final_review_util_1.formatProcessFinalReviewPayload)((_a = row) !== null && _a !== void 0 ? _a : null)];
                    }
                });
            });
        };
        return ProcessFinalReviewService_1;
    }());
    __setFunctionName(_classThis, "ProcessFinalReviewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessFinalReviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessFinalReviewService = _classThis;
}();
exports.ProcessFinalReviewService = ProcessFinalReviewService;
