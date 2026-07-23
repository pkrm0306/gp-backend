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
exports.VendorCertificateService = void 0;
var common_1 = require("@nestjs/common");
var pdf_lib_1 = require("pdf-lib");
var archiver_1 = require("archiver");
var stream_1 = require("stream");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("../constants/active-product.filter");
var upload_file_read_util_1 = require("../../utils/upload-file-read.util");
var fs_1 = require("fs");
var path_1 = require("path");
var CERTIFIED_PRODUCT_STATUS = 2;
var PAGE_W = 787;
var PAGE_H = 590;
var CERTIFICATE_BACKGROUND_FILES = [
    'GPAMNS281001 2_page-0001.jpg',
    'cert-bg2.jpg',
    'cert-bg.jpg',
];
var VendorCertificateService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VendorCertificateService = _classThis = /** @class */ (function () {
        function VendorCertificateService_1(productModel, categoryModel, manufacturerModel, allProductDocumentModel, productPlantModel) {
            this.productModel = productModel;
            this.categoryModel = categoryModel;
            this.manufacturerModel = manufacturerModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productPlantModel = productPlantModel;
            this.logger = new common_1.Logger(VendorCertificateService.name);
            /** Reused across one download-all run so we do not re-fetch artwork 100s of times. */
            this.certificateBackgroundBytesPromise = null;
        }
        VendorCertificateService_1.prototype.downloadEoiCertificate = function (vendorId_1, productId_1) {
            return __awaiter(this, arguments, void 0, function (vendorId, productId, format) {
                var product, plants, _a, _b, buffer;
                if (format === void 0) { format = 'merged'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.loadCertifiedProductForVendor(vendorId, productId)];
                        case 1:
                            product = _c.sent();
                            _a = this.resolveEffectivePlantsForCertificates;
                            _b = [product];
                            return [4 /*yield*/, this.loadPlantsForProduct(product)];
                        case 2:
                            plants = _a.apply(this, _b.concat([_c.sent()]));
                            if (format === 'zip') {
                                return [2 /*return*/, this.downloadEoiCertificateZip(product, plants)];
                            }
                            return [4 /*yield*/, this.mergePlantCertificateBuffers(product, plants, "No certificate files are available for EOI ".concat(product.eoiNo))];
                        case 3:
                            buffer = _c.sent();
                            return [2 /*return*/, {
                                    buffer: buffer,
                                    fileName: this.buildCertificateFileName(product.eoiNo, plants.length),
                                    contentType: 'application/pdf',
                                }];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.listEoiPlantCertificates = function (vendorId, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var product, plants, _a, _b, trimmedProductId;
                var _this = this;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.loadCertifiedProductForVendor(vendorId, productId)];
                        case 1:
                            product = _e.sent();
                            _a = this.resolveEffectivePlantsForCertificates;
                            _b = [product];
                            return [4 /*yield*/, this.loadPlantsForProduct(product)];
                        case 2:
                            plants = _a.apply(this, _b.concat([_e.sent()]));
                            trimmedProductId = String(product._id);
                            return [2 /*return*/, {
                                    productId: trimmedProductId,
                                    eoiNo: String((_c = product.eoiNo) !== null && _c !== void 0 ? _c : ''),
                                    productName: String((_d = product.productName) !== null && _d !== void 0 ? _d : ''),
                                    plantCount: plants.length,
                                    plants: plants.map(function (plant, index) {
                                        var _a;
                                        return ({
                                            plantId: plant.id,
                                            productPlantId: plant.productPlantId,
                                            plantName: String((_a = plant.plantName) !== null && _a !== void 0 ? _a : "Plant ".concat(index + 1)),
                                            location: _this.derivePlantLocation(plant),
                                            order: index + 1,
                                            downloadPath: _this.buildPlantCertificatePath(trimmedProductId, plant.id),
                                        });
                                    }),
                                    downloads: {
                                        mergedPdfPath: this.buildEoiCertificatePath(trimmedProductId, 'merged'),
                                        zipPath: this.buildEoiCertificatePath(trimmedProductId, 'zip'),
                                    },
                                }];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.downloadEoiPlantCertificate = function (vendorId, productId, plantId) {
            return __awaiter(this, void 0, void 0, function () {
                var product, plant, buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadCertifiedProductForVendor(vendorId, productId)];
                        case 1:
                            product = _a.sent();
                            return [4 /*yield*/, this.loadPlantForProduct(product, plantId)];
                        case 2:
                            plant = _a.sent();
                            return [4 /*yield*/, this.resolvePlantCertificateBuffer(product, plant)];
                        case 3:
                            buffer = _a.sent();
                            return [2 /*return*/, {
                                    buffer: buffer,
                                    fileName: this.buildPlantCertificateFileName(product.eoiNo, plant.plantName, plant.productPlantId, plant.id, String(product._id)),
                                    contentType: 'application/pdf',
                                }];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.downloadUrnCertificatesPdf = function (vendorId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, vendorObjectId, products, hydrated, mergedPdf, addedPages, _i, hydrated_1, product, plants, _a, _b, plantBuffer, src, pages, _c, pages_1, p, _d, mergedBuffer, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            trimmedUrn = String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .find(this.matchCertifiedProductsForVendor(vendorObjectId, {
                                    urnNo: trimmedUrn,
                                }))
                                    .sort({ eoiNo: 1 })
                                    .exec()];
                        case 1:
                            products = _g.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No certified products found for this URN');
                            }
                            return [4 /*yield*/, Promise.all(products.map(function (product) { return _this.hydrateProduct(product); }))];
                        case 2:
                            hydrated = _g.sent();
                            return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                        case 3:
                            mergedPdf = _g.sent();
                            addedPages = 0;
                            _i = 0, hydrated_1 = hydrated;
                            _g.label = 4;
                        case 4:
                            if (!(_i < hydrated_1.length)) return [3 /*break*/, 12];
                            product = hydrated_1[_i];
                            _g.label = 5;
                        case 5:
                            _g.trys.push([5, 10, , 11]);
                            _a = this.resolveEffectivePlantsForCertificates;
                            _b = [product];
                            return [4 /*yield*/, this.loadPlantsForProduct(product)];
                        case 6:
                            plants = _a.apply(this, _b.concat([_g.sent()]));
                            return [4 /*yield*/, this.mergePlantCertificateBuffers(product, plants)];
                        case 7:
                            plantBuffer = _g.sent();
                            return [4 /*yield*/, pdf_lib_1.PDFDocument.load(plantBuffer)];
                        case 8:
                            src = _g.sent();
                            return [4 /*yield*/, mergedPdf.copyPages(src, src.getPageIndices())];
                        case 9:
                            pages = _g.sent();
                            for (_c = 0, pages_1 = pages; _c < pages_1.length; _c++) {
                                p = pages_1[_c];
                                mergedPdf.addPage(p);
                            }
                            addedPages += pages.length;
                            return [3 /*break*/, 11];
                        case 10:
                            _d = _g.sent();
                            return [3 /*break*/, 11];
                        case 11:
                            _i++;
                            return [3 /*break*/, 4];
                        case 12:
                            if (addedPages === 0) {
                                throw new common_1.NotFoundException('No certificate files are available for this URN');
                            }
                            _f = (_e = Buffer).from;
                            return [4 /*yield*/, mergedPdf.save()];
                        case 13:
                            mergedBuffer = _f.apply(_e, [_g.sent()]);
                            return [2 /*return*/, {
                                    buffer: mergedBuffer,
                                    fileName: "Certificates_".concat(trimmedUrn, ".pdf"),
                                    contentType: 'application/pdf',
                                }];
                    }
                });
            });
        };
        /** All plant certificates across every certified EOI for the logged-in vendor. */
        VendorCertificateService_1.prototype.downloadVendorAllCertifiedCertificates = function (vendorId_1) {
            return __awaiter(this, arguments, void 0, function (vendorId, _format) {
                var vendorObjectId, products, hydrated, plantsByProductId, entries, _i, hydrated_2, product, productId, plants, effectivePlants, _a, _b, _c, index, plant, files, _d, _e, _f, index, entry, buffer, seq, baseName, zipBuffer;
                var _g, _h;
                if (_format === void 0) { _format = 'zip'; }
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
                            return [4 /*yield*/, this.listCertifiedProductsForVendor(vendorObjectId)];
                        case 1:
                            products = _j.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No certified products found for this vendor');
                            }
                            // Warm background once for the whole portfolio download.
                            this.certificateBackgroundBytesPromise = this.loadCertificateBackgroundBytesFresh();
                            _j.label = 2;
                        case 2:
                            _j.trys.push([2, , 10, 11]);
                            return [4 /*yield*/, this.hydrateProductsInBatches(products)];
                        case 3:
                            hydrated = _j.sent();
                            return [4 /*yield*/, this.loadPlantsGroupedByProductIds(hydrated.map(function (product) { return product._id; }))];
                        case 4:
                            plantsByProductId = _j.sent();
                            entries = [];
                            for (_i = 0, hydrated_2 = hydrated; _i < hydrated_2.length; _i++) {
                                product = hydrated_2[_i];
                                productId = String(product._id);
                                plants = (_g = plantsByProductId.get(productId)) !== null && _g !== void 0 ? _g : [];
                                effectivePlants = this.resolveEffectivePlantsForCertificates(product, plants);
                                for (_a = 0, _b = effectivePlants.entries(); _a < _b.length; _a++) {
                                    _c = _b[_a], index = _c[0], plant = _c[1];
                                    entries.push({
                                        product: product,
                                        plant: plant,
                                        orderKey: "".concat(String((_h = product.eoiNo) !== null && _h !== void 0 ? _h : ''), "_").concat(String(plant.productPlantId || index + 1), "_").concat(plant.id),
                                    });
                                }
                            }
                            if (!entries.length) {
                                throw new common_1.NotFoundException('No certificate files are available for this vendor');
                            }
                            this.logger.log("[downloadVendorAll] vendor=".concat(vendorId, " products=").concat(hydrated.length, " certificates=").concat(entries.length, " format=zip"));
                            files = [];
                            _d = 0, _e = entries.entries();
                            _j.label = 5;
                        case 5:
                            if (!(_d < _e.length)) return [3 /*break*/, 8];
                            _f = _e[_d], index = _f[0], entry = _f[1];
                            return [4 /*yield*/, this.generateCertificatePdfSafe(entry.product, this.derivePlantLocation(entry.plant))];
                        case 6:
                            buffer = _j.sent();
                            seq = String(index + 1).padStart(3, '0');
                            baseName = this.buildPlantCertificateFileName(entry.product.eoiNo, entry.plant.plantName, entry.plant.productPlantId || index + 1, entry.plant.id, String(entry.product._id));
                            files.push({
                                name: "".concat(seq, "_").concat(baseName),
                                buffer: buffer,
                            });
                            _j.label = 7;
                        case 7:
                            _d++;
                            return [3 /*break*/, 5];
                        case 8: return [4 /*yield*/, this.buildZipBuffer(files)];
                        case 9:
                            zipBuffer = _j.sent();
                            return [2 /*return*/, {
                                    buffer: zipBuffer,
                                    fileName: 'GreenPro_Certificates_All_Plants.zip',
                                    contentType: 'application/zip',
                                    certificateCount: files.length,
                                }];
                        case 10:
                            this.certificateBackgroundBytesPromise = null;
                            return [7 /*endfinally*/];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.countVendorCertifiedPlantCertificates = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, products, total, _i, products_1, product, declared;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .find(this.matchCertifiedProductsForVendor(vendorObjectId))
                                    .select({ _id: 1, plantCount: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _b.sent();
                            total = 0;
                            for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                                product = products_1[_i];
                                declared = Number((_a = product.plantCount) !== null && _a !== void 0 ? _a : 0);
                                total += declared > 0 ? declared : 1;
                            }
                            return [2 /*return*/, total];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.matchCertifiedProductsForVendor = function (vendorObjectId, extra) {
            if (extra === void 0) { extra = {}; }
            var now = new Date();
            // Match vendor certified list (status 2, not expired) so Download all = UI total.
            return (0, active_product_filter_1.matchActiveProducts)(__assign(__assign({}, extra), { productStatus: CERTIFIED_PRODUCT_STATUS, $and: [
                    {
                        $or: [
                            { vendorId: vendorObjectId },
                            { manufacturerId: vendorObjectId },
                        ],
                    },
                    {
                        $or: [
                            { validtillDate: null },
                            { validtillDate: { $exists: false } },
                            { validtillDate: { $gte: now } },
                        ],
                    },
                ] }));
        };
        VendorCertificateService_1.prototype.hydrateProductsInBatches = function (products_2) {
            return __awaiter(this, arguments, void 0, function (products, batchSize) {
                var hydrated, i, chunk, chunkHydrated;
                var _this = this;
                if (batchSize === void 0) { batchSize = 25; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hydrated = [];
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < products.length)) return [3 /*break*/, 4];
                            chunk = products.slice(i, i + batchSize);
                            return [4 /*yield*/, Promise.all(chunk.map(function (product) { return _this.hydrateProduct(product); }))];
                        case 2:
                            chunkHydrated = _a.sent();
                            hydrated.push.apply(hydrated, chunkHydrated);
                            _a.label = 3;
                        case 3:
                            i += batchSize;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, hydrated];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.loadPlantsGroupedByProductIds = function (productIds) {
            return __awaiter(this, void 0, void 0, function () {
                var grouped, rows, _i, rows_1, row, productId, stateDoc, plant, list;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            grouped = new Map();
                            if (!productIds.length) {
                                return [2 /*return*/, grouped];
                            }
                            return [4 /*yield*/, this.productPlantModel
                                    .aggregate([
                                    {
                                        $match: {
                                            $or: [
                                                { productId: { $in: productIds } },
                                                { productId: { $in: productIds.map(function (id) { return String(id); }) } },
                                            ],
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'states',
                                            localField: 'stateId',
                                            foreignField: '_id',
                                            as: 'state',
                                        },
                                    },
                                    { $sort: { createdDate: 1, productPlantId: 1 } },
                                ])
                                    .exec()];
                        case 1:
                            rows = _f.sent();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                productId = String((_a = row.productId) !== null && _a !== void 0 ? _a : '');
                                if (!productId)
                                    continue;
                                stateDoc = Array.isArray(row.state)
                                    ? row.state[0]
                                    : undefined;
                                plant = {
                                    id: String(row._id),
                                    productPlantId: Number((_b = row.productPlantId) !== null && _b !== void 0 ? _b : 0),
                                    plantName: row.plantName,
                                    plantLocation: row.plantLocation,
                                    city: row.city,
                                    stateName: (_d = (_c = stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.stateName) !== null && _c !== void 0 ? _c : stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.name) !== null && _d !== void 0 ? _d : null,
                                };
                                list = (_e = grouped.get(productId)) !== null && _e !== void 0 ? _e : [];
                                list.push(plant);
                                grouped.set(productId, list);
                            }
                            return [2 /*return*/, grouped];
                    }
                });
            });
        };
        /**
         * Vendor certified list shows `plantCount` per EOI. Include every plant row and
         * pad up to plantCount when rows are missing — never drop plants.
         */
        VendorCertificateService_1.prototype.resolveEffectivePlantsForCertificates = function (product, plants) {
            var _a, _b, _c, _d, _e, _f, _g;
            var declared = Number((_a = product.plantCount) !== null && _a !== void 0 ? _a : 0);
            var target = Math.max(plants.length, declared > 0 ? declared : 0, 1);
            if (plants.length === 0) {
                return this.synthesizePlantsFromProductCount(product, target);
            }
            if (plants.length >= target) {
                return plants;
            }
            var padded = __spreadArray([], plants, true);
            for (var index = plants.length; index < target; index += 1) {
                padded.push({
                    id: "synthetic-".concat(String(product._id), "-").concat(index + 1),
                    productPlantId: index + 1,
                    plantName: "Plant ".concat(index + 1),
                    plantLocation: (_c = (_b = plants[0]) === null || _b === void 0 ? void 0 : _b.plantLocation) !== null && _c !== void 0 ? _c : '',
                    city: (_e = (_d = plants[0]) === null || _d === void 0 ? void 0 : _d.city) !== null && _e !== void 0 ? _e : '',
                    stateName: (_g = (_f = plants[0]) === null || _f === void 0 ? void 0 : _f.stateName) !== null && _g !== void 0 ? _g : null,
                });
            }
            return padded;
        };
        VendorCertificateService_1.prototype.synthesizePlantsFromProductCount = function (product, overrideCount) {
            var _a;
            var declared = Number((_a = product.plantCount) !== null && _a !== void 0 ? _a : 0);
            var count = overrideCount && overrideCount > 0
                ? overrideCount
                : declared > 0
                    ? declared
                    : 1;
            return Array.from({ length: count }, function (_, index) { return ({
                id: "synthetic-".concat(String(product._id), "-").concat(index + 1),
                productPlantId: index + 1,
                plantName: "Plant ".concat(index + 1),
                plantLocation: '',
                city: '',
                stateName: null,
            }); });
        };
        VendorCertificateService_1.prototype.listCertifiedProductsForVendor = function (vendorObjectId) {
            return this.productModel
                .find(this.matchCertifiedProductsForVendor(vendorObjectId))
                .sort({ eoiNo: 1 })
                .exec();
        };
        VendorCertificateService_1.prototype.collectPlantCertificateBuffers = function (product, plantsOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var plants, _a, _b, _c, buffers, _i, plants_1, plant, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = this.resolveEffectivePlantsForCertificates;
                            _b = [product];
                            if (!(plantsOverride !== null && plantsOverride !== void 0)) return [3 /*break*/, 1];
                            _c = plantsOverride;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.loadPlantsForProduct(product)];
                        case 2:
                            _c = (_f.sent());
                            _f.label = 3;
                        case 3:
                            plants = _a.apply(this, _b.concat([_c]));
                            buffers = [];
                            _i = 0, plants_1 = plants;
                            _f.label = 4;
                        case 4:
                            if (!(_i < plants_1.length)) return [3 /*break*/, 7];
                            plant = plants_1[_i];
                            _e = (_d = buffers).push;
                            return [4 /*yield*/, this.generateCertificatePdfSafe(product, this.derivePlantLocation(plant))];
                        case 5:
                            _e.apply(_d, [_f.sent()]);
                            _f.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/, buffers];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.appendBufferToMergedPdf = function (mergedPdf, buffer) {
            return __awaiter(this, void 0, void 0, function () {
                var src, pages, _i, pages_2, page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.load(buffer)];
                        case 1:
                            src = _a.sent();
                            return [4 /*yield*/, mergedPdf.copyPages(src, src.getPageIndices())];
                        case 2:
                            pages = _a.sent();
                            for (_i = 0, pages_2 = pages; _i < pages_2.length; _i++) {
                                page = pages_2[_i];
                                mergedPdf.addPage(page);
                            }
                            return [2 /*return*/, pages.length];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.loadCertifiedProductForVendor = function (vendorId, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedId, vendorObjectId, product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedId = String(productId !== null && productId !== void 0 ? productId : '').trim();
                            if (!mongoose_1.Types.ObjectId.isValid(trimmedId)) {
                                throw new common_1.BadRequestException('Invalid product id');
                            }
                            vendorObjectId = this.toObjectId(vendorId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({
                                    _id: new mongoose_1.Types.ObjectId(trimmedId),
                                    productStatus: CERTIFIED_PRODUCT_STATUS,
                                    $and: [
                                        {
                                            $or: [
                                                { vendorId: vendorObjectId },
                                                { manufacturerId: vendorObjectId },
                                            ],
                                        },
                                    ],
                                }))
                                    .exec()];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Certified product not found for this vendor');
                            }
                            return [2 /*return*/, this.hydrateProduct(product)];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.hydrateProduct = function (product) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, category, manufacturer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                product.categoryId
                                    ? this.categoryModel
                                        .findById(product.categoryId)
                                        .select('categoryName category_name')
                                        .exec()
                                    : null,
                                product.manufacturerId
                                    ? this.manufacturerModel
                                        .findById(product.manufacturerId)
                                        .select('manufacturerName')
                                        .exec()
                                    : null,
                            ])];
                        case 1:
                            _a = _b.sent(), category = _a[0], manufacturer = _a[1];
                            return [2 /*return*/, Object.assign(product, {
                                    category: category,
                                    manufacturer: manufacturer,
                                })];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.loadPlantsForProduct = function (product) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productPlantModel
                                .aggregate([
                                {
                                    $match: {
                                        $or: [
                                            { productId: product._id },
                                            { productId: String(product._id) },
                                        ],
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'states',
                                        localField: 'stateId',
                                        foreignField: '_id',
                                        as: 'state',
                                    },
                                },
                                { $sort: { createdDate: 1, productPlantId: 1 } },
                            ])
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a, _b, _c;
                                    var stateDoc = Array.isArray(row.state)
                                        ? row.state[0]
                                        : undefined;
                                    return {
                                        id: String(row._id),
                                        productPlantId: Number((_a = row.productPlantId) !== null && _a !== void 0 ? _a : 0),
                                        plantName: row.plantName,
                                        plantLocation: row.plantLocation,
                                        city: row.city,
                                        stateName: (_c = (_b = stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.stateName) !== null && _b !== void 0 ? _b : stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.name) !== null && _c !== void 0 ? _c : null,
                                    };
                                })];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.loadPlantForProduct = function (product, plantId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedPlantId, rows, row, stateDoc;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            trimmedPlantId = String(plantId !== null && plantId !== void 0 ? plantId : '').trim();
                            if (!mongoose_1.Types.ObjectId.isValid(trimmedPlantId)) {
                                throw new common_1.BadRequestException('Invalid plant id');
                            }
                            return [4 /*yield*/, this.productPlantModel
                                    .aggregate([
                                    {
                                        $match: {
                                            _id: new mongoose_1.Types.ObjectId(trimmedPlantId),
                                            $or: [
                                                { productId: product._id },
                                                { productId: String(product._id) },
                                            ],
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'states',
                                            localField: 'stateId',
                                            foreignField: '_id',
                                            as: 'state',
                                        },
                                    },
                                    { $limit: 1 },
                                ])
                                    .exec()];
                        case 1:
                            rows = _d.sent();
                            row = rows[0];
                            if (!row) {
                                throw new common_1.NotFoundException('Plant not found for this certified EOI');
                            }
                            stateDoc = Array.isArray(row.state)
                                ? row.state[0]
                                : undefined;
                            return [2 /*return*/, {
                                    id: String(row._id),
                                    productPlantId: Number((_a = row.productPlantId) !== null && _a !== void 0 ? _a : 0),
                                    plantName: row.plantName,
                                    plantLocation: row.plantLocation,
                                    city: row.city,
                                    stateName: (_c = (_b = stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.stateName) !== null && _b !== void 0 ? _b : stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.name) !== null && _c !== void 0 ? _c : null,
                                }];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.downloadEoiCertificateZip = function (product, plants) {
            return __awaiter(this, void 0, void 0, function () {
                var files, _i, _a, _b, index, plant, buffer, _c, zipBuffer;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            files = [];
                            _i = 0, _a = plants.entries();
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            _b = _a[_i], index = _b[0], plant = _b[1];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.resolvePlantCertificateBuffer(product, plant)];
                        case 3:
                            buffer = _d.sent();
                            files.push({
                                name: this.buildPlantCertificateFileName(product.eoiNo, plant.plantName, plant.productPlantId || index + 1, plant.id, String(product._id)),
                                buffer: buffer,
                            });
                            return [3 /*break*/, 5];
                        case 4:
                            _c = _d.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            if (!files.length) {
                                throw new common_1.NotFoundException("No certificate files are available for EOI ".concat(product.eoiNo));
                            }
                            return [4 /*yield*/, this.buildZipBuffer(files)];
                        case 7:
                            zipBuffer = _d.sent();
                            return [2 /*return*/, {
                                    buffer: zipBuffer,
                                    fileName: this.buildCertificateZipFileName(product.eoiNo),
                                    contentType: 'application/zip',
                                }];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.buildZipBuffer = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
                            var stream = new stream_1.PassThrough();
                            var chunks = [];
                            stream.on('data', function (chunk) { return chunks.push(chunk); });
                            stream.on('end', function () { return resolve(Buffer.concat(chunks)); });
                            stream.on('error', reject);
                            archive.on('error', reject);
                            archive.pipe(stream);
                            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                                var file = files_1[_i];
                                archive.append(file.buffer, { name: file.name });
                            }
                            void archive.finalize();
                        })];
                });
            });
        };
        VendorCertificateService_1.prototype.mergePlantCertificateBuffers = function (product, plants, emptyMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var mergedPdf, addedPages, _i, plants_2, plant, buffer, src, pages, _a, pages_3, p, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                        case 1:
                            mergedPdf = _e.sent();
                            addedPages = 0;
                            _i = 0, plants_2 = plants;
                            _e.label = 2;
                        case 2:
                            if (!(_i < plants_2.length)) return [3 /*break*/, 9];
                            plant = plants_2[_i];
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, this.resolvePlantCertificateBuffer(product, plant)];
                        case 4:
                            buffer = _e.sent();
                            return [4 /*yield*/, pdf_lib_1.PDFDocument.load(buffer)];
                        case 5:
                            src = _e.sent();
                            return [4 /*yield*/, mergedPdf.copyPages(src, src.getPageIndices())];
                        case 6:
                            pages = _e.sent();
                            for (_a = 0, pages_3 = pages; _a < pages_3.length; _a++) {
                                p = pages_3[_a];
                                mergedPdf.addPage(p);
                            }
                            addedPages += pages.length;
                            return [3 /*break*/, 8];
                        case 7:
                            _b = _e.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            _i++;
                            return [3 /*break*/, 2];
                        case 9:
                            if (addedPages === 0) {
                                throw new common_1.NotFoundException(emptyMessage !== null && emptyMessage !== void 0 ? emptyMessage : 'No certificate files are available for this EOI');
                            }
                            _d = (_c = Buffer).from;
                            return [4 /*yield*/, mergedPdf.save()];
                        case 10: return [2 /*return*/, _d.apply(_c, [_e.sent()])];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.resolvePlantCertificateBuffer = function (product, plant) {
            return __awaiter(this, void 0, void 0, function () {
                var location;
                return __generator(this, function (_a) {
                    location = this.derivePlantLocation(plant);
                    return [2 /*return*/, this.generateCertificatePdf(product, location)];
                });
            });
        };
        VendorCertificateService_1.prototype.resolveCertificateBuffer = function (product, locationOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var fromDocument, fromAssessment, _i, _a, relativePath, buffer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.readCertificateFromDocuments(product)];
                        case 1:
                            fromDocument = _b.sent();
                            if (fromDocument) {
                                return [2 /*return*/, this.ensurePdfBuffer(product, fromDocument, locationOverride)];
                            }
                            if (!product.assessmentReportUrl) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_read_util_1.readUploadedFileBuffer)(product.assessmentReportUrl)];
                        case 2:
                            fromAssessment = _b.sent();
                            if (fromAssessment === null || fromAssessment === void 0 ? void 0 : fromAssessment.length) {
                                return [2 /*return*/, this.ensurePdfBuffer(product, fromAssessment, locationOverride)];
                            }
                            _b.label = 3;
                        case 3:
                            _i = 0, _a = this.buildCertificatePathCandidates(product);
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            relativePath = _a[_i];
                            return [4 /*yield*/, (0, upload_file_read_util_1.readUploadedFileBuffer)(relativePath)];
                        case 5:
                            buffer = _b.sent();
                            if (buffer === null || buffer === void 0 ? void 0 : buffer.length) {
                                return [2 /*return*/, this.ensurePdfBuffer(product, buffer, locationOverride)];
                            }
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/, this.generateCertificatePdf(product, locationOverride)];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.ensurePdfBuffer = function (product, buffer, locationOverride) {
            if (buffer.length >= 5 && buffer.subarray(0, 5).toString() === '%PDF-') {
                return buffer;
            }
            return this.generateCertificatePdf(product, locationOverride);
        };
        VendorCertificateService_1.prototype.readCertificateFromDocuments = function (product) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, eoiNo, docs, _i, docs_1, doc, buffer;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnNo = String((_a = product.urnNo) !== null && _a !== void 0 ? _a : '').trim();
                            eoiNo = String((_b = product.eoiNo) !== null && _b !== void 0 ? _b : '').trim();
                            if (!urnNo) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    urnNo: urnNo,
                                    vendorId: product.vendorId,
                                    eoiNo: eoiNo,
                                    isDeleted: { $ne: true },
                                    $or: [
                                        { documentForm: { $regex: /certificate/i } },
                                        { documentFormSubsection: { $regex: /certificate/i } },
                                        { documentName: { $regex: /certificate/i } },
                                        { documentOriginalName: { $regex: /certificate/i } },
                                    ],
                                })
                                    .sort({ updatedDate: -1, createdDate: -1 })
                                    .limit(5)
                                    .lean()
                                    .exec()];
                        case 1:
                            docs = _c.sent();
                            _i = 0, docs_1 = docs;
                            _c.label = 2;
                        case 2:
                            if (!(_i < docs_1.length)) return [3 /*break*/, 5];
                            doc = docs_1[_i];
                            return [4 /*yield*/, (0, upload_file_read_util_1.readUploadedFileBuffer)(doc.documentLink)];
                        case 3:
                            buffer = _c.sent();
                            if (buffer === null || buffer === void 0 ? void 0 : buffer.length) {
                                return [2 /*return*/, buffer];
                            }
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, null];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.buildCertificatePathCandidates = function (product) {
            var _a, _b, _c;
            var urnNo = String((_a = product.urnNo) !== null && _a !== void 0 ? _a : '').trim();
            var eoiNo = String((_b = product.eoiNo) !== null && _b !== void 0 ? _b : '').trim();
            var productId = String((_c = product.productId) !== null && _c !== void 0 ? _c : '').trim();
            var safeEoi = eoiNo.replace(/[^a-zA-Z0-9._-]/g, '_');
            var safeUrn = urnNo.replace(/[^a-zA-Z0-9._-]/g, '_');
            return [
                "certificates/".concat(safeEoi, ".pdf"),
                "certificates/".concat(safeUrn, "/").concat(safeEoi, ".pdf"),
                "certificate/".concat(safeEoi, ".pdf"),
                "greenpro_certificates/".concat(safeEoi, ".pdf"),
                "certificates/".concat(productId, ".pdf"),
                "urns/".concat(safeUrn, "/certificates/").concat(safeEoi, ".pdf"),
                "urns/".concat(safeUrn, "/certificate_").concat(safeEoi, ".pdf"),
                "feedback/".concat(safeEoi, ".pdf"),
            ];
        };
        VendorCertificateService_1.prototype.generateCertificatePdf = function (product, locationOverride) {
            return this.generateCertificatePdfWithTemplateLayout(product, locationOverride);
        };
        /** Never drop a plant slot — retry with safe location, then a minimal PDF. */
        VendorCertificateService_1.prototype.generateCertificatePdfSafe = function (product, locationOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.generateCertificatePdf(product, locationOverride)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.warn("[certificate] retry without location product=".concat(String(product._id), ": ").concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1));
                            return [3 /*break*/, 3];
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.generateCertificatePdf(product, '')];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            error_2 = _a.sent();
                            this.logger.warn("[certificate] fallback minimal PDF product=".concat(String(product._id), ": ").concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || error_2));
                            return [2 /*return*/, this.generateMinimalCertificatePdf(product)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.generateMinimalCertificatePdf = function (product) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, page, font, label, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                        case 1:
                            pdfDoc = _c.sent();
                            page = pdfDoc.addPage([PAGE_W, PAGE_H]);
                            return [4 /*yield*/, pdfDoc.embedStandardFont(pdf_lib_1.StandardFonts.Helvetica)];
                        case 2:
                            font = _c.sent();
                            label = this.safeLatinText("".concat(product.productName || 'Product', " (").concat(product.eoiNo || 'EOI', ")"));
                            page.drawText(label.slice(0, 80) || 'GreenPro Certificate', {
                                x: 72,
                                y: PAGE_H / 2,
                                size: 14,
                                font: font,
                                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                            });
                            _b = (_a = Buffer).from;
                            return [4 /*yield*/, pdfDoc.save()];
                        case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.resolveCertificateBackgroundPath = function () {
            var roots = [
                (0, path_1.join)(process.cwd(), 'uploads', 'certificates'),
                (0, path_1.join)(process.cwd(), 'public', 'certificate'),
            ];
            for (var _i = 0, CERTIFICATE_BACKGROUND_FILES_1 = CERTIFICATE_BACKGROUND_FILES; _i < CERTIFICATE_BACKGROUND_FILES_1.length; _i++) {
                var fileName = CERTIFICATE_BACKGROUND_FILES_1[_i];
                for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                    var root = roots_1[_a];
                    var candidate = (0, path_1.join)(root, fileName);
                    if ((0, fs_1.existsSync)(candidate))
                        return candidate;
                }
            }
            return null;
        };
        VendorCertificateService_1.prototype.loadCertificateBackgroundBytes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.certificateBackgroundBytesPromise) {
                        this.certificateBackgroundBytesPromise =
                            this.loadCertificateBackgroundBytesFresh();
                    }
                    return [2 /*return*/, this.certificateBackgroundBytesPromise];
                });
            });
        };
        VendorCertificateService_1.prototype.loadCertificateBackgroundBytesFresh = function () {
            return __awaiter(this, void 0, void 0, function () {
                var bgPath, base, _i, CERTIFICATE_BACKGROUND_FILES_2, fileName, url, res, _a, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            bgPath = this.resolveCertificateBackgroundPath();
                            if (bgPath) {
                                try {
                                    return [2 /*return*/, (0, fs_1.readFileSync)(bgPath)];
                                }
                                catch (_f) {
                                    /* fall through to remote static assets */
                                }
                            }
                            base = String((_d = process.env.CERTIFICATE_ASSET_BASE_URL) !== null && _d !== void 0 ? _d : 'https://greenpro-portals.vercel.app/vendor/certificate')
                                .trim()
                                .replace(/\/+$/, '');
                            if (!base)
                                return [2 /*return*/, null];
                            _i = 0, CERTIFICATE_BACKGROUND_FILES_2 = CERTIFICATE_BACKGROUND_FILES;
                            _e.label = 1;
                        case 1:
                            if (!(_i < CERTIFICATE_BACKGROUND_FILES_2.length)) return [3 /*break*/, 8];
                            fileName = CERTIFICATE_BACKGROUND_FILES_2[_i];
                            url = "".concat(base, "/").concat(encodeURIComponent(fileName));
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, fetch(url)];
                        case 3:
                            res = _e.sent();
                            if (!res.ok) return [3 /*break*/, 5];
                            _b = (_a = Buffer).from;
                            return [4 /*yield*/, res.arrayBuffer()];
                        case 4: return [2 /*return*/, _b.apply(_a, [_e.sent()])];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            _c = _e.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            _i++;
                            return [3 /*break*/, 1];
                        case 8: return [2 /*return*/, null];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.embedCertificateBackground = function (pdfDoc, page) {
            return __awaiter(this, void 0, void 0, function () {
                var bytes, isJpeg, image, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.loadCertificateBackgroundBytes()];
                        case 1:
                            bytes = _c.sent();
                            if (!bytes)
                                return [2 /*return*/];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 7, , 8]);
                            isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
                            if (!isJpeg) return [3 /*break*/, 4];
                            return [4 /*yield*/, pdfDoc.embedJpg(bytes)];
                        case 3:
                            _a = _c.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, pdfDoc.embedPng(bytes)];
                        case 5:
                            _a = _c.sent();
                            _c.label = 6;
                        case 6:
                            image = _a;
                            page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
                            return [3 /*break*/, 8];
                        case 7:
                            _b = _c.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.generateCertificatePdfWithTemplateLayout = function (product, locationOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, page, regular, bold, italic, boldItalic, PRODUCT_SZ, EOI_SZ, P_SZ, Y_PRODUCT, Y_EOI, Y_MANU1, Y_MANU2, Y_VALID, productName, eoiNo, manufacturerName, location, validDate, hasLocation, bytes;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                        case 1:
                            pdfDoc = _b.sent();
                            page = pdfDoc.addPage([PAGE_W, PAGE_H]);
                            return [4 /*yield*/, this.embedCertificateBackground(pdfDoc, page)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pdfDoc.embedStandardFont(pdf_lib_1.StandardFonts.Helvetica)];
                        case 3:
                            regular = _b.sent();
                            return [4 /*yield*/, pdfDoc.embedStandardFont(pdf_lib_1.StandardFonts.HelveticaBold)];
                        case 4:
                            bold = _b.sent();
                            return [4 /*yield*/, pdfDoc.embedStandardFont(pdf_lib_1.StandardFonts.HelveticaOblique)];
                        case 5:
                            italic = _b.sent();
                            return [4 /*yield*/, pdfDoc.embedStandardFont(pdf_lib_1.StandardFonts.HelveticaBoldOblique)];
                        case 6:
                            boldItalic = _b.sent();
                            PRODUCT_SZ = 18;
                            EOI_SZ = 15;
                            P_SZ = 12;
                            Y_PRODUCT = 341.4;
                            Y_EOI = 311.8;
                            Y_MANU1 = 283.6;
                            Y_MANU2 = 261.7;
                            Y_VALID = 239.7;
                            productName = this.safeLatinText(product.productName || 'N/A');
                            eoiNo = this.safeLatinText(product.eoiNo || 'N/A');
                            manufacturerName = this.safeLatinText(((_a = product.manufacturer) === null || _a === void 0 ? void 0 : _a.manufacturerName) || 'N/A');
                            location = this.safeLatinText((locationOverride === null || locationOverride === void 0 ? void 0 : locationOverride.trim()) || this.deriveLocation(product));
                            validDate = this.safeLatinText(this.formatValidityMonthYear(product.validtillDate) || 'N/A');
                            this.centerInBox(page, productName, bold, PRODUCT_SZ, 0, PAGE_W, Y_PRODUCT);
                            this.centerInBox(page, "(".concat(eoiNo, ")"), regular, EOI_SZ, 0, PAGE_W, Y_EOI);
                            hasLocation = location.trim().length > 0;
                            // Boundary space on preceding run — pdf-lib drops leading spaces after font changes.
                            this.centerSegments(page, __spreadArray(__spreadArray([
                                { text: 'Manufactured by ', font: italic, size: P_SZ },
                                {
                                    text: hasLocation ? manufacturerName : "".concat(manufacturerName, " "),
                                    font: boldItalic,
                                    size: P_SZ,
                                }
                            ], (hasLocation
                                ? [
                                    { text: ' at ', font: italic, size: P_SZ },
                                    { text: "".concat(location, " "), font: boldItalic, size: P_SZ },
                                ]
                                : []), true), [
                                { text: 'meets the requirements of', font: italic, size: P_SZ },
                            ], false), 0, PAGE_W, Y_MANU1);
                            this.centerSegments(page, [
                                {
                                    text: 'GreenPro Ecolabel and qualifies as Green Product.',
                                    font: italic,
                                    size: P_SZ,
                                },
                            ], 0, PAGE_W, Y_MANU2);
                            this.centerSegments(page, [
                                { text: 'This certification is valid till ', font: italic, size: P_SZ },
                                { text: validDate, font: boldItalic, size: P_SZ },
                            ], 0, PAGE_W, Y_VALID);
                            return [4 /*yield*/, pdfDoc.save()];
                        case 7:
                            bytes = _b.sent();
                            return [2 /*return*/, Buffer.from(bytes)];
                    }
                });
            });
        };
        VendorCertificateService_1.prototype.safeLatinText = function (value) {
            // Helvetica (WinAnsi) rejects many Unicode glyphs; keep printable ASCII to avoid PDF generation failures.
            return String(value !== null && value !== void 0 ? value : '')
                .normalize('NFKD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\x20-\x7E]/g, '?')
                .trim();
        };
        VendorCertificateService_1.prototype.centerInBox = function (page, text, font, size, boxLeft, boxWidth, y) {
            var safe = text || 'N/A';
            try {
                var width = font.widthOfTextAtSize(safe, size);
                var x = boxLeft + Math.max(0, (boxWidth - width) / 2);
                page.drawText(safe, {
                    x: x,
                    y: y,
                    size: size,
                    font: font,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
            }
            catch (_a) {
                page.drawText('N/A', {
                    x: boxLeft + boxWidth / 2 - 10,
                    y: y,
                    size: size,
                    font: font,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
            }
        };
        VendorCertificateService_1.prototype.centerSegments = function (page, segments, boxLeft, boxWidth, y) {
            var _a;
            var safeSegments = segments.map(function (s) { return (__assign(__assign({}, s), { text: s.text || '' })); });
            try {
                var totalWidth = safeSegments.reduce(function (sum, s) { return sum + s.font.widthOfTextAtSize(s.text, s.size); }, 0);
                var x = boxLeft + Math.max(0, (boxWidth - totalWidth) / 2);
                for (var _i = 0, safeSegments_1 = safeSegments; _i < safeSegments_1.length; _i++) {
                    var s = safeSegments_1[_i];
                    if (!s.text)
                        continue;
                    page.drawText(s.text, {
                        x: x,
                        y: y,
                        size: s.size,
                        font: s.font,
                        color: (0, pdf_lib_1.rgb)(0, 0, 0),
                    });
                    x += s.font.widthOfTextAtSize(s.text, s.size);
                }
            }
            catch (_b) {
                page.drawText('N/A', {
                    x: boxLeft + boxWidth / 2 - 10,
                    y: y,
                    size: 12,
                    font: (_a = safeSegments[0]) === null || _a === void 0 ? void 0 : _a.font,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
            }
        };
        VendorCertificateService_1.prototype.deriveLocation = function (product) {
            var city = product === null || product === void 0 ? void 0 : product.city;
            var state = product === null || product === void 0 ? void 0 : product.stateName;
            var c = String(city !== null && city !== void 0 ? city : '').trim();
            var s = String(state !== null && state !== void 0 ? state : '').trim();
            if (c && s)
                return "".concat(c, ", ").concat(s);
            return c || s || '';
        };
        VendorCertificateService_1.prototype.derivePlantLocation = function (plant) {
            var additional = String(plant.additionalPlantInfo !== null && plant.additionalPlantInfo !== void 0 ? plant.additionalPlantInfo : '').trim();
            var city = String(plant.city !== null && plant.city !== void 0 ? plant.city : '').trim();
            var state = String(plant.stateName !== null && plant.stateName !== void 0 ? plant.stateName : '').trim();
            var legacy = String(plant.plantLocation !== null && plant.plantLocation !== void 0 ? plant.plantLocation : '').trim();
            var structured = [additional, city, state].filter(Boolean);
            var parts = structured.length > 0 ? structured : legacy ? [legacy] : [];
            var unique = [];
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                var prev = unique[unique.length - 1];
                if (prev && prev.toLowerCase() === part.toLowerCase())
                    continue;
                unique.push(part);
            }
            return unique.join(', ');
        };
        VendorCertificateService_1.prototype.formatValidityMonthYear = function (value) {
            if (!value) {
                return null;
            }
            var d = new Date(value);
            if (Number.isNaN(d.getTime())) {
                return null;
            }
            return d.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
            });
        };
        VendorCertificateService_1.prototype.buildCertificateFileName = function (eoiNo, plantCount) {
            if (plantCount === void 0) { plantCount = 1; }
            var safe = String(eoiNo !== null && eoiNo !== void 0 ? eoiNo : 'certificate')
                .trim()
                .replace(/[^a-zA-Z0-9._-]/g, '_');
            if (plantCount > 1) {
                return "GreenPro_Certificates_".concat(safe || 'certificate', ".pdf");
            }
            return "GreenPro_Certificate_".concat(safe || 'certificate', ".pdf");
        };
        VendorCertificateService_1.prototype.buildCertificateZipFileName = function (eoiNo) {
            var safe = String(eoiNo !== null && eoiNo !== void 0 ? eoiNo : 'certificate')
                .trim()
                .replace(/[^a-zA-Z0-9._-]/g, '_');
            return "GreenPro_Certificates_".concat(safe || 'certificate', ".zip");
        };
        VendorCertificateService_1.prototype.buildPlantCertificateFileName = function (eoiNo, plantName, plantKey, plantId, productId) {
            var _a, _b;
            var safeEoi = String(eoiNo !== null && eoiNo !== void 0 ? eoiNo : 'certificate')
                .trim()
                .replace(/[^a-zA-Z0-9._-]+/g, '_');
            var safePlant = String((_a = plantName !== null && plantName !== void 0 ? plantName : plantKey) !== null && _a !== void 0 ? _a : 'plant')
                .trim()
                .replace(/[^a-zA-Z0-9._-]+/g, '_');
            var safePlantId = String((_b = plantId !== null && plantId !== void 0 ? plantId : plantKey) !== null && _b !== void 0 ? _b : '')
                .trim()
                .replace(/[^a-zA-Z0-9._-]+/g, '_')
                .slice(-12);
            var safeProductId = String(productId !== null && productId !== void 0 ? productId : '')
                .trim()
                .replace(/[^a-zA-Z0-9._-]+/g, '_')
                .slice(-8);
            var unique = [safePlantId, safeProductId].filter(Boolean).join('_');
            return "GreenPro_Certificate_".concat(safeEoi, "_").concat(safePlant).concat(unique ? "_".concat(unique) : '', ".pdf");
        };
        VendorCertificateService_1.prototype.buildEoiCertificatePath = function (productId, format) {
            var suffix = format === 'zip' ? '?format=zip' : '';
            return "/products/certificates/eoi/".concat(productId).concat(suffix);
        };
        VendorCertificateService_1.prototype.buildPlantCertificatePath = function (productId, plantId) {
            return "/products/certificates/eoi/".concat(productId, "/plants/").concat(plantId);
        };
        VendorCertificateService_1.prototype.formatDate = function (value) {
            if (!value) {
                return null;
            }
            var d = new Date(value);
            if (Number.isNaN(d.getTime())) {
                return null;
            }
            return d.toISOString().slice(0, 10);
        };
        VendorCertificateService_1.prototype.toObjectId = function (value, label) {
            var trimmed = String(value !== null && value !== void 0 ? value : '').trim();
            if (!mongoose_1.Types.ObjectId.isValid(trimmed)) {
                throw new common_1.BadRequestException("Invalid ".concat(label));
            }
            return new mongoose_1.Types.ObjectId(trimmed);
        };
        return VendorCertificateService_1;
    }());
    __setFunctionName(_classThis, "VendorCertificateService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorCertificateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorCertificateService = _classThis;
}();
exports.VendorCertificateService = VendorCertificateService;
