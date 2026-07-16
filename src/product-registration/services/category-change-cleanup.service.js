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
exports.CategoryChangeCleanupService = void 0;
var common_1 = require("@nestjs/common");
var urn_tab_review_constants_1 = require("../constants/urn-tab-review.constants");
var category_change_util_1 = require("../helpers/category-change.util");
var upload_file_util_1 = require("../../utils/upload-file.util");
var CategoryChangeCleanupService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CategoryChangeCleanupService = _classThis = /** @class */ (function () {
        function CategoryChangeCleanupService_1(connection, allProductDocumentModel, urnTabReviewModel) {
            this.connection = connection;
            this.allProductDocumentModel = allProductDocumentModel;
            this.urnTabReviewModel = urnTabReviewModel;
            this.logger = new common_1.Logger(CategoryChangeCleanupService.name);
        }
        CategoryChangeCleanupService_1.prototype.purgeForCategoryChange = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, purgedSteps, retainedRawMaterialSteps, addedRawMaterialSteps, visibleRawMaterialSteps, recordsRemovedByCollection, collectionNames, documentForms, _i, purgedSteps_1, stepId, target, _a, _b, collection, _c, _d, form, _e, collectionNames_1, collectionName, result, documentsRemoved, reviewDelete;
                var _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            urnNo = String((_f = params.urnNo) !== null && _f !== void 0 ? _f : '').trim();
                            purgedSteps = (0, category_change_util_1.stepsToPurgeOnCategoryChange)(params.previousCategoryRawMaterialForms, params.newCategoryRawMaterialForms);
                            retainedRawMaterialSteps = (0, category_change_util_1.retainedRawMaterialStepsOnCategoryChange)(params.previousCategoryRawMaterialForms, params.newCategoryRawMaterialForms);
                            addedRawMaterialSteps = (0, category_change_util_1.addedRawMaterialStepsOnCategoryChange)(params.previousCategoryRawMaterialForms, params.newCategoryRawMaterialForms);
                            visibleRawMaterialSteps = (0, category_change_util_1.visibleStepsForCategory)(params.newCategoryRawMaterialForms);
                            recordsRemovedByCollection = {};
                            collectionNames = new Set();
                            documentForms = new Set();
                            if (purgedSteps.length === 0) {
                                return [2 /*return*/, {
                                        purgedSteps: purgedSteps,
                                        retainedRawMaterialSteps: retainedRawMaterialSteps,
                                        addedRawMaterialSteps: addedRawMaterialSteps,
                                        visibleRawMaterialSteps: visibleRawMaterialSteps,
                                        documentsRemoved: 0,
                                        recordsRemovedByCollection: recordsRemovedByCollection,
                                        rawMaterialReviewsRemoved: 0,
                                    }];
                            }
                            for (_i = 0, purgedSteps_1 = purgedSteps; _i < purgedSteps_1.length; _i++) {
                                stepId = purgedSteps_1[_i];
                                target = category_change_util_1.RAW_MATERIAL_STEP_PURGE_TARGETS[stepId];
                                if (!target) {
                                    continue;
                                }
                                for (_a = 0, _b = target.collections; _a < _b.length; _a++) {
                                    collection = _b[_a];
                                    collectionNames.add(collection);
                                }
                                for (_c = 0, _d = target.documentForms; _c < _d.length; _c++) {
                                    form = _d[_c];
                                    documentForms.add(form);
                                }
                            }
                            _e = 0, collectionNames_1 = collectionNames;
                            _j.label = 1;
                        case 1:
                            if (!(_e < collectionNames_1.length)) return [3 /*break*/, 4];
                            collectionName = collectionNames_1[_e];
                            return [4 /*yield*/, this.connection
                                    .collection(collectionName)
                                    .deleteMany({ urnNo: urnNo, vendorId: params.vendorId }, { session: params.session })];
                        case 2:
                            result = _j.sent();
                            recordsRemovedByCollection[collectionName] = (_g = result.deletedCount) !== null && _g !== void 0 ? _g : 0;
                            _j.label = 3;
                        case 3:
                            _e++;
                            return [3 /*break*/, 1];
                        case 4: return [4 /*yield*/, this.softDeleteDocuments({
                                urnNo: urnNo,
                                vendorId: params.vendorId,
                                documentForms: __spreadArray([], documentForms, true),
                                session: params.session,
                            })];
                        case 5:
                            documentsRemoved = _j.sent();
                            return [4 /*yield*/, this.urnTabReviewModel
                                    .deleteMany({
                                    urnNo: urnNo,
                                    tabKey: urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY,
                                    stepId: { $in: purgedSteps },
                                }, { session: params.session })
                                    .exec()];
                        case 6:
                            reviewDelete = _j.sent();
                            return [2 /*return*/, {
                                    purgedSteps: purgedSteps,
                                    retainedRawMaterialSteps: retainedRawMaterialSteps,
                                    addedRawMaterialSteps: addedRawMaterialSteps,
                                    visibleRawMaterialSteps: visibleRawMaterialSteps,
                                    documentsRemoved: documentsRemoved,
                                    recordsRemovedByCollection: recordsRemovedByCollection,
                                    rawMaterialReviewsRemoved: (_h = reviewDelete.deletedCount) !== null && _h !== void 0 ? _h : 0,
                                }];
                    }
                });
            });
        };
        CategoryChangeCleanupService_1.prototype.softDeleteDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var docs, now, fileLinks, _i, fileLinks_1, link, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!params.documentForms.length) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    urnNo: params.urnNo,
                                    vendorId: params.vendorId,
                                    documentForm: { $in: params.documentForms },
                                    isDeleted: { $ne: true },
                                })
                                    .session((_a = params.session) !== null && _a !== void 0 ? _a : null)
                                    .exec()];
                        case 1:
                            docs = _b.sent();
                            if (!docs.length) {
                                return [2 /*return*/, 0];
                            }
                            now = new Date();
                            fileLinks = docs
                                .map(function (doc) { var _a; return String((_a = doc.documentLink) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(Boolean);
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: docs.map(function (doc) { return doc._id; }) } }, {
                                    $set: {
                                        isDeleted: true,
                                        deletedAt: now,
                                        deletedBy: params.vendorId,
                                        updatedDate: now,
                                    },
                                }, { session: params.session })];
                        case 2:
                            _b.sent();
                            _i = 0, fileLinks_1 = fileLinks;
                            _b.label = 3;
                        case 3:
                            if (!(_i < fileLinks_1.length)) return [3 /*break*/, 8];
                            link = fileLinks_1[_i];
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(link)];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _b.sent();
                            this.logger.warn("Failed to delete uploaded file for category change (".concat(params.urnNo, "): ").concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 7];
                        case 7:
                            _i++;
                            return [3 /*break*/, 3];
                        case 8: return [2 /*return*/, docs.length];
                    }
                });
            });
        };
        return CategoryChangeCleanupService_1;
    }());
    __setFunctionName(_classThis, "CategoryChangeCleanupService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CategoryChangeCleanupService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CategoryChangeCleanupService = _classThis;
}();
exports.CategoryChangeCleanupService = CategoryChangeCleanupService;
