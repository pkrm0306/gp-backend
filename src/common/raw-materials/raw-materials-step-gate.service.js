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
exports.RawMaterialsStepGateService = exports.VENDOR_URN_REVIEW_LOCK_STATUS = exports.VENDOR_URN_REVIEW_LOCK_MESSAGE = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var vendor_urn_edit_util_1 = require("../vendor/vendor-urn-edit.util");
Object.defineProperty(exports, "VENDOR_URN_REVIEW_LOCK_MESSAGE", { enumerable: true, get: function () { return vendor_urn_edit_util_1.VENDOR_URN_REVIEW_LOCK_MESSAGE; } });
Object.defineProperty(exports, "VENDOR_URN_REVIEW_LOCK_STATUS", { enumerable: true, get: function () { return vendor_urn_edit_util_1.VENDOR_URN_REVIEW_LOCK_STATUS; } });
var document_section_key_constants_1 = require("../constants/document-section-key.constants");
var raw_materials_upload_util_1 = require("./raw-materials-upload.util");
var RawMaterialsStepGateService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsStepGateService = _classThis = /** @class */ (function () {
        function RawMaterialsStepGateService_1(allProductDocumentModel, productModel) {
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
        }
        RawMaterialsStepGateService_1.prototype.assertVendorCanEditUrn = function (vendorId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, urnNo)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Review lock + vendor empty-form mirror (single entry for POST handlers). */
        RawMaterialsStepGateService_1.prototype.assertStepSubmitAllowed = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertVendorCanEditUrn(params.vendorId, params.urnNo)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.assertAtLeastOne(params)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Vendor “≥ 1 field” mirror: incoming content, new files, saved documents, or persisted rows.
         */
        RawMaterialsStepGateService_1.prototype.assertAtLeastOne = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var retainedDocumentCount, _a, payloadBody;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!params.documentForm) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.countDocumentsOnUrn(params.vendorId, params.urnNo, params.documentForm)];
                        case 1:
                            _a = _e.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = 0;
                            _e.label = 3;
                        case 3:
                            retainedDocumentCount = _a;
                            payloadBody = (_b = params.body) !== null && _b !== void 0 ? _b : params.multipartBody;
                            if (payloadBody && (0, raw_materials_upload_util_1.hasAnyMeaningfulRawMaterialsSavePayload)(payloadBody)) {
                                return [2 /*return*/];
                            }
                            (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({
                                files: params.files,
                                textValues: params.textValues,
                                rows: params.rows,
                                rowKeys: params.rowKeys,
                                body: (_c = params.body) !== null && _c !== void 0 ? _c : params.multipartBody,
                                retainedDocumentCount: retainedDocumentCount,
                                persistedRecordCount: (_d = params.persistedRecordCount) !== null && _d !== void 0 ? _d : 0,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsStepGateService_1.prototype.countDocumentsOnUrn = function (vendorId, urnNo, documentForm) {
            return __awaiter(this, void 0, void 0, function () {
                var forms, normalized;
                return __generator(this, function (_a) {
                    if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                        return [2 /*return*/, 0];
                    }
                    forms = Array.isArray(documentForm) ? documentForm : [documentForm];
                    normalized = __spreadArray([], new Set(forms.map(function (f) { return (0, document_section_key_constants_1.normalizeDocumentSectionKey)(String(f)); }).filter(Boolean)), true);
                    if (!normalized.length) {
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/, this.allProductDocumentModel
                            .countDocuments({
                            vendorId: new mongoose_1.Types.ObjectId(vendorId),
                            urnNo: urnNo.trim(),
                            documentForm: { $in: normalized },
                            isDeleted: { $ne: true },
                        })
                            .exec()];
                });
            });
        };
        return RawMaterialsStepGateService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsStepGateService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsStepGateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsStepGateService = _classThis;
}();
exports.RawMaterialsStepGateService = RawMaterialsStepGateService;
