"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.RawMaterialsUtilizationRmcService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var RawMaterialsUtilizationRmcService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsUtilizationRmcService = _classThis = /** @class */ (function () {
        function RawMaterialsUtilizationRmcService_1(model, allProductDocumentModel, productModel, sequenceHelper, documentVersioningService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        RawMaterialsUtilizationRmcService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, raw_materials_upload_util_1.countVendorUrnDocuments)(this.model, urnNo, vendorId)];
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsUtilizationRmcService_1.prototype.saveFileToUrnFolder = function (file, urnNo, fileType) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1: return [2 /*return*/, (_a.sent()).fileUrl];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.buildValidationError = function (fieldErrors) {
            throw new common_1.BadRequestException({
                code: 'VALIDATION_ERROR',
                message: 'Invalid Step 15 payload',
                fieldErrors: fieldErrors,
            });
        };
        /** Partial-save: invalid/empty numerics become null (explicit 0 preserved). */
        RawMaterialsUtilizationRmcService_1.prototype.parseRmcNumericInput = function (value) {
            return (0, raw_materials_upload_util_1.parseRawMaterialsUnitNumericInput)(value);
        };
        RawMaterialsUtilizationRmcService_1.prototype.sanitizeRmcNumericPayload = function (payload) {
            var out = {};
            for (var _i = 0, _a = Object.entries(payload); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value === null || value === undefined) {
                    out[key] = null;
                    continue;
                }
                var n = Number(value);
                out[key] = Number.isFinite(n) ? n : null;
            }
            return out;
        };
        RawMaterialsUtilizationRmcService_1.prototype.getNumericSchemaFields = function () {
            var excludeNumericFields = new Set(['rawMaterialsUtilizationRmcId']);
            return Object.entries(this.model.schema.paths)
                .filter(function (_a) {
                var key = _a[0], schemaType = _a[1];
                if (['_id', '__v'].includes(key) || excludeNumericFields.has(key))
                    return false;
                return schemaType.instance === 'Number';
            })
                .map(function (_a) {
                var key = _a[0];
                return key;
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.applyAliases = function (raw) {
            var out = __assign({}, raw);
            var aliasMap = {
                brandSelfCpmactiongConcrete: 'brandSelfCpmactingConcrete',
                brandSelfCpmactionConcrete: 'brandSelfCpmactingConcrete',
                brandSelfCompactingConcrete: 'brandSelfCpmactingConcrete',
                productionYear1SelfCpmactiongConcrete: 'productionYear1SelfCpmactingConcrete',
                productionYear2SelfCpmactiongConcrete: 'productionYear2SelfCpmactingConcrete',
                productionYear3SelfCpmactiongConcrete: 'productionYear3SelfCpmactingConcrete',
                productionYear1SelfCompactingConcrete: 'productionYear1SelfCpmactingConcrete',
                productionYear2SelfCompactingConcrete: 'productionYear2SelfCpmactingConcrete',
                productionYear3SelfCompactingConcrete: 'productionYear3SelfCpmactingConcrete',
            };
            for (var _i = 0, _a = ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']; _i < _a.length; _i++) {
                var mat = _a[_i];
                for (var _b = 0, _c = [1, 2, 3, 4]; _b < _c.length; _b++) {
                    var yr = _c[_b];
                    aliasMap["percentYear".concat(yr, "Subsitution").concat(mat)] = "percentYear".concat(yr, "Subsititution").concat(mat);
                    aliasMap["percentYear".concat(yr, "Substitution").concat(mat)] = "percentYear".concat(yr, "Subsititution").concat(mat);
                    // Frontend may send lowercase material suffixes (e.g. "...Subsitutioniron")
                    var lowerMat = mat.toLowerCase();
                    aliasMap["percentYear".concat(yr, "Subsitution").concat(lowerMat)] =
                        "percentYear".concat(yr, "Subsititution").concat(mat);
                    aliasMap["percentYear".concat(yr, "Substitution").concat(lowerMat)] =
                        "percentYear".concat(yr, "Subsititution").concat(mat);
                    aliasMap["percentYear".concat(yr, "Subsititution").concat(lowerMat)] =
                        "percentYear".concat(yr, "Subsititution").concat(mat);
                }
            }
            // Plant block: accept misspelled Subsitution variants from frontend.
            for (var _d = 0, _e = [1, 2, 3, 4]; _d < _e.length; _d++) {
                var yr = _e[_d];
                aliasMap["plantYear".concat(yr, "PercentSubsitution")] = "plantYear".concat(yr, "PercentSubstitution");
                aliasMap["plantYear".concat(yr, "Percentsubstitution")] = "plantYear".concat(yr, "PercentSubstitution");
            }
            for (var _f = 0, _g = Object.entries(aliasMap); _f < _g.length; _f++) {
                var _h = _g[_f], alias = _h[0], canonical = _h[1];
                if (out[canonical] === undefined && out[alias] !== undefined) {
                    out[canonical] = out[alias];
                }
            }
            return out;
        };
        RawMaterialsUtilizationRmcService_1.prototype.wasFieldProvided = function (input, field) {
            var value = input[field];
            return value !== undefined && value !== null && value !== '';
        };
        RawMaterialsUtilizationRmcService_1.prototype.parseAndNormalizePayload = function (rawInput) {
            var _a, _b;
            var input = this.applyAliases(rawInput);
            var numericFields = this.getNumericSchemaFields();
            var numericPayload = {};
            for (var _i = 0, numericFields_1 = numericFields; _i < numericFields_1.length; _i++) {
                var field = numericFields_1[_i];
                if (this.wasFieldProvided(input, field)) {
                    numericPayload[field] = this.parseRmcNumericInput(input[field]);
                }
            }
            var setTotal = function (key, parts) {
                var total = raw_materials_upload_util_1.sumNullableRawMaterialsNumerics.apply(void 0, parts);
                if (total !== null) {
                    numericPayload[key] = total;
                }
            };
            setTotal('total1', [
                numericPayload.cement1,
                numericPayload.flyash1,
                numericPayload.coarseAggregate1,
                numericPayload.fineAggregate1,
                numericPayload.admixture1,
                numericPayload.alcofine1,
                numericPayload.ggbs1,
                numericPayload.anyOtherMaterial1,
            ]);
            setTotal('total2', [
                numericPayload.cement2,
                numericPayload.flyash2,
                numericPayload.coarseAggregate2,
                numericPayload.fineAggregate2,
                numericPayload.admixture2,
                numericPayload.alcofine2,
                numericPayload.ggbs2,
                numericPayload.anyOtherMaterial2,
            ]);
            setTotal('total3', [
                numericPayload.cement3,
                numericPayload.flyash3,
                numericPayload.coarseAggregate3,
                numericPayload.fineAggregate3,
                numericPayload.admixture3,
                numericPayload.alcofine3,
                numericPayload.ggbs3,
                numericPayload.anyOtherMaterial3,
            ]);
            setTotal('brandTotalConcrete', [
                numericPayload.brandConcreteWithHighScm,
                numericPayload.brandHighStrengthConcrete,
                numericPayload.brandSelfCpmactingConcrete,
                numericPayload.brandLowDensityConcrete,
                numericPayload.brandClsmConcrete,
                numericPayload.brandAnyOtherTypes,
            ]);
            setTotal('productionYear1TotalConcrete', [
                numericPayload.productionYear1ConcreteWithHighScm,
                numericPayload.productionYear1HighStrengthConcrete,
                numericPayload.productionYear1SelfCpmactingConcrete,
                numericPayload.productionYear1LowDensityConcrete,
                numericPayload.productionYear1ClsmConcrete,
                numericPayload.productionYear1AnyOtherTypes,
            ]);
            setTotal('productionYear2TotalConcrete', [
                numericPayload.productionYear2ConcreteWithHighScm,
                numericPayload.productionYear2HighStrengthConcrete,
                numericPayload.productionYear2SelfCpmactingConcrete,
                numericPayload.productionYear2LowDensityConcrete,
                numericPayload.productionYear2ClsmConcrete,
                numericPayload.productionYear2AnyOtherTypes,
            ]);
            setTotal('productionYear3TotalConcrete', [
                numericPayload.productionYear3ConcreteWithHighScm,
                numericPayload.productionYear3HighStrengthConcrete,
                numericPayload.productionYear3SelfCpmactingConcrete,
                numericPayload.productionYear3LowDensityConcrete,
                numericPayload.productionYear3ClsmConcrete,
                numericPayload.productionYear3AnyOtherTypes,
            ]);
            var opcUsed = (_a = numericPayload.totalQuantityOfOpcUsed) !== null && _a !== void 0 ? _a : null;
            var supplementary = (_b = numericPayload.totalQuantityOfSupplementary) !== null && _b !== void 0 ? _b : null;
            if (opcUsed !== null || supplementary !== null) {
                var opcDenom = (opcUsed !== null && opcUsed !== void 0 ? opcUsed : 0) + (supplementary !== null && supplementary !== void 0 ? supplementary : 0);
                numericPayload.opcSubstitution =
                    opcDenom > 0
                        ? Number(((supplementary !== null && supplementary !== void 0 ? supplementary : 0) / opcDenom).toFixed(4))
                        : 0;
            }
            return this.sanitizeRmcNumericPayload(numericPayload);
        };
        RawMaterialsUtilizationRmcService_1.prototype.ensureUrnOwnership = function (urnNo, vendorObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                var owned, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel.findOne({ urnNo: urnNo, vendorId: vendorObjectId }).lean().exec()];
                        case 1:
                            owned = _a.sent();
                            if (owned)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.productModel.findOne({ urnNo: urnNo }).lean().exec()];
                        case 2:
                            exists = _a.sent();
                            if (!exists) {
                                throw new common_1.HttpException({ code: 'URN_NOT_FOUND', message: 'URN not found' }, common_1.HttpStatus.NOT_FOUND);
                            }
                            throw new common_1.HttpException({ code: 'URN_ACCESS_DENIED', message: 'Authenticated vendor does not own this URN' }, common_1.HttpStatus.FORBIDDEN);
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.buildResponse = function (doc) {
            var d = (0, raw_materials_upload_util_1.withRawMaterialsNumericFields)(typeof (doc === null || doc === void 0 ? void 0 : doc.toObject) === 'function' ? doc.toObject() : __assign({}, doc), this.getNumericSchemaFields());
            return {
                urnNo: d.urnNo,
                vendorId: String(d.vendorId),
                data: {
                    consumption_year1: d.consumptionYear1,
                    consumption_year2: d.consumptionYear2,
                    consumption_year3: d.consumptionYear3,
                    rawConsumption: {
                        cement1: d.cement1,
                        cement2: d.cement2,
                        cement3: d.cement3,
                        flyash1: d.flyash1,
                        flyash2: d.flyash2,
                        flyash3: d.flyash3,
                        coarseAggregate1: d.coarseAggregate1,
                        coarseAggregate2: d.coarseAggregate2,
                        coarseAggregate3: d.coarseAggregate3,
                        fineAggregate1: d.fineAggregate1,
                        fineAggregate2: d.fineAggregate2,
                        fineAggregate3: d.fineAggregate3,
                        admixture1: d.admixture1,
                        admixture2: d.admixture2,
                        admixture3: d.admixture3,
                        alcofine1: d.alcofine1,
                        alcofine2: d.alcofine2,
                        alcofine3: d.alcofine3,
                        ggbs1: d.ggbs1,
                        ggbs2: d.ggbs2,
                        ggbs3: d.ggbs3,
                        anyOtherMaterial1: d.anyOtherMaterial1,
                        anyOtherMaterial2: d.anyOtherMaterial2,
                        anyOtherMaterial3: d.anyOtherMaterial3,
                    },
                    concreteTypes: {
                        brandConcreteWithHighScm: d.brandConcreteWithHighScm,
                        brandHighStrengthConcrete: d.brandHighStrengthConcrete,
                        brandSelfCpmactingConcrete: d.brandSelfCpmactingConcrete,
                        brandLowDensityConcrete: d.brandLowDensityConcrete,
                        brandClsmConcrete: d.brandClsmConcrete,
                        brandAnyOtherTypes: d.brandAnyOtherTypes,
                    },
                    opcSummary: {
                        total_quantity_of_opc_used: d.totalQuantityOfOpcUsed,
                        total_quantity_of_supplementary: d.totalQuantityOfSupplementary,
                        total_opc_substitution_ratio: d.opcSubstitution,
                    },
                },
                computed: {
                    total_fields1: d.total1,
                    total_fields2: d.total2,
                    total_fields3: d.total3,
                    total_brand_name_concrete: d.brandTotalConcrete,
                    total_production_year1_final: d.productionYear1TotalConcrete,
                    total_production_year2_final: d.productionYear2TotalConcrete,
                    total_production_year3_final: d.productionYear3TotalConcrete,
                },
                updatedDate: d.updatedDate,
            };
        };
        RawMaterialsUtilizationRmcService_1.prototype.withLegacyRmcAliases = function (row) {
            var base = typeof (row === null || row === void 0 ? void 0 : row.toObject) === 'function' ? row.toObject() : row;
            if (!base)
                return base;
            return (0, raw_materials_upload_util_1.normalizeRawMaterialsUtilizationRmcRow)(base);
        };
        RawMaterialsUtilizationRmcService_1.prototype.upsertStep15Document = function (urnNo, vendorObjectId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var now, safePayload, existing, id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            safePayload = this.sanitizeRmcNumericPayload(payload);
                            return [4 /*yield*/, this.model.findOne({ urnNo: urnNo, vendorId: vendorObjectId }).exec()];
                        case 1:
                            existing = _a.sent();
                            if (!existing) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({ urnNo: urnNo, vendorId: vendorObjectId }, { $set: __assign(__assign({}, safePayload), { updatedDate: now }) }, { new: true, runValidators: false })
                                    .exec()];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [4 /*yield*/, this.sequenceHelper.getRawMaterialsUtilizationRmcId()];
                        case 4:
                            id = _a.sent();
                            return [4 /*yield*/, this.model
                                    .findOneAndUpdate({ urnNo: urnNo, vendorId: vendorObjectId }, {
                                    $set: __assign(__assign({}, safePayload), { updatedDate: now }),
                                    $setOnInsert: {
                                        rawMaterialsUtilizationRmcId: id,
                                        urnNo: urnNo,
                                        vendorId: vendorObjectId,
                                        createdDate: now,
                                    },
                                }, {
                                    upsert: true,
                                    new: true,
                                    runValidators: false,
                                    setDefaultsOnInsert: true,
                                })
                                    .exec()];
                        case 5: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.persistStep15Files = function (urnNo, vendorObjectId, formPrimaryId, files, fileNameHint) {
            return __awaiter(this, void 0, void 0, function () {
                var now, createDoc;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!files.file1 && !files.file2) {
                                return [2 /*return*/];
                            }
                            now = new Date();
                            createDoc = function (file, documentFormSubsection, fileType) { return __awaiter(_this, void 0, void 0, function () {
                                var storedRelativePath, productDocumentId, createdDoc;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo, fileType)];
                                        case 1:
                                            storedRelativePath = _a.sent();
                                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                                        case 2:
                                            productDocumentId = _a.sent();
                                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                                    productDocumentId: productDocumentId,
                                                    vendorId: vendorObjectId,
                                                    urnNo: urnNo,
                                                    eoiNo: '',
                                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                                                    documentFormSubsection: documentFormSubsection,
                                                    formPrimaryId: formPrimaryId,
                                                    documentName: (fileNameHint === null || fileNameHint === void 0 ? void 0 : fileNameHint.trim()) || path.basename(storedRelativePath),
                                                    documentOriginalName: file.originalname,
                                                    documentLink: storedRelativePath,
                                                    createdDate: now,
                                                    updatedDate: now,
                                                })];
                                        case 3:
                                            createdDoc = _a.sent();
                                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                                    productModel: this.productModel,
                                                    versioning: this.documentVersioningService,
                                                    documentModel: this.allProductDocumentModel,
                                                    urnNo: urnNo,
                                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                                                    userId: vendorObjectId,
                                                    vendorId: vendorObjectId,
                                                    doc: createdDoc,
                                                    file: file,
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            if (!files.file1) return [3 /*break*/, 2];
                            return [4 /*yield*/, createDoc(files.file1, 'step_15_1_supporting_document', 'step_15_1_supporting_document')];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!files.file2) return [3 /*break*/, 4];
                            return [4 /*yield*/, createDoc(files.file2, 'step_15_2_supporting_document', 'step_15_2_supporting_document')];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.create = function (dto, vendorId, files, urnNoFromPath) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, uploadFiles, _a, retainedDocumentCount, persistedRecordCount, normalizedNumericPayload, upserted, error_1;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            if (!vendorId) {
                                throw new common_1.HttpException({ code: 'VALIDATION_ERROR', message: 'Invalid Step 15 payload', fieldErrors: { vendorId: 'Vendor is required' } }, common_1.HttpStatus.BAD_REQUEST);
                            }
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = String((_b = urnNoFromPath !== null && urnNoFromPath !== void 0 ? urnNoFromPath : dto === null || dto === void 0 ? void 0 : dto.urnNo) !== null && _b !== void 0 ? _b : '').trim();
                            if (!urnNo) {
                                this.buildValidationError({ urnNo: 'URN number is required' });
                            }
                            return [4 /*yield*/, this.ensureUrnOwnership(urnNo, vendorObjectId)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, urnNo)];
                        case 2:
                            _c.sent();
                            uploadFiles = [files === null || files === void 0 ? void 0 : files.file1, files === null || files === void 0 ? void 0 : files.file2].filter(Boolean);
                            return [4 /*yield*/, Promise.all([
                                    this.allProductDocumentModel
                                        .countDocuments({
                                        vendorId: vendorObjectId,
                                        urnNo: urnNo,
                                        documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                                        isDeleted: { $ne: true },
                                    })
                                        .exec(),
                                    this.model
                                        .countDocuments({ urnNo: urnNo, vendorId: vendorObjectId })
                                        .exec(),
                                ])];
                        case 3:
                            _a = _c.sent(), retainedDocumentCount = _a[0], persistedRecordCount = _a[1];
                            if (uploadFiles.length === 0 &&
                                !(0, raw_materials_upload_util_1.hasAnyMeaningfulBodyField)(dto !== null && dto !== void 0 ? dto : {}) &&
                                retainedDocumentCount === 0 &&
                                persistedRecordCount === 0) {
                                throw new common_1.BadRequestException(raw_materials_upload_util_1.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
                            }
                            normalizedNumericPayload = this.parseAndNormalizePayload(dto !== null && dto !== void 0 ? dto : {});
                            return [4 /*yield*/, this.upsertStep15Document(urnNo, vendorObjectId, normalizedNumericPayload)];
                        case 4:
                            upserted = _c.sent();
                            return [4 /*yield*/, this.persistStep15Files(urnNo, vendorObjectId, upserted.rawMaterialsUtilizationRmcId, files !== null && files !== void 0 ? files : {}, dto === null || dto === void 0 ? void 0 : dto.utilizationRmcFileName)];
                        case 5:
                            _c.sent();
                            return [2 /*return*/, this.buildResponse(upserted.toObject())];
                        case 6:
                            error_1 = _c.sent();
                            console.error('[Raw Materials Utilization RMC] Create error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.HttpException) {
                                throw error_1;
                            }
                            if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.code) === 11000) {
                                throw new common_1.HttpException({ code: 'CONFLICT_DUPLICATE_KEY', message: 'Duplicate key conflict' }, common_1.HttpStatus.CONFLICT);
                            }
                            throw new common_1.InternalServerErrorException({ code: 'INTERNAL_ERROR', message: error_1.message || 'Failed to save Step 15 payload' });
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, rows, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
                                    .sort({ createdDate: 1 })
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return _this.withLegacyRmcAliases(row); })];
                        case 2:
                            error_2 = _a.sent();
                            console.error('[Raw Materials Utilization RMC] List error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list raw materials utilization RMC records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsUtilizationRmcService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsUtilizationRmcService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsUtilizationRmcService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsUtilizationRmcService = _classThis;
}();
exports.RawMaterialsUtilizationRmcService = RawMaterialsUtilizationRmcService;
