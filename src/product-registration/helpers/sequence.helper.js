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
exports.SequenceHelper = void 0;
var common_1 = require("@nestjs/common");
var SequenceHelper = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SequenceHelper = _classThis = /** @class */ (function () {
        function SequenceHelper_1(connection) {
            this.connection = connection;
        }
        SequenceHelper_1.prototype.getNextSequenceValue = function (sequenceName) {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, result, seqValue, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            sequenceCollection = this.connection.collection('sequences');
                            return [4 /*yield*/, sequenceCollection.findOneAndUpdate({ _id: sequenceName }, { $inc: { sequenceValue: 1 } }, { upsert: true, returnDocument: 'after' })];
                        case 1:
                            result = _c.sent();
                            seqValue = (_b = (_a = result === null || result === void 0 ? void 0 : result.value) === null || _a === void 0 ? void 0 : _a.sequenceValue) !== null && _b !== void 0 ? _b : result === null || result === void 0 ? void 0 : result.sequenceValue;
                            return [2 /*return*/, typeof seqValue === 'number' ? seqValue : 1];
                        case 2:
                            error_1 = _c.sent();
                            console.error("Sequence error for ".concat(sequenceName, ":"), error_1);
                            throw new Error("Failed to get next sequence value for ".concat(sequenceName, ": ").concat(error_1.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SequenceHelper_1.prototype.getProductId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getNextSequenceValue('product_id')];
                });
            });
        };
        SequenceHelper_1.prototype.getProductPlantId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getNextSequenceValue('product_plant_id')];
                });
            });
        };
        /** Reserve a contiguous block of sequence values (inclusive start, for bulk inserts). */
        SequenceHelper_1.prototype.reserveSequenceValues = function (sequenceName, count) {
            return __awaiter(this, void 0, void 0, function () {
                var safeCount, sequenceCollection, result, endValue, end, start;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            safeCount = Math.max(0, Math.floor(count));
                            if (safeCount === 0) {
                                return [2 /*return*/, []];
                            }
                            sequenceCollection = this.connection.collection('sequences');
                            return [4 /*yield*/, sequenceCollection.findOneAndUpdate({ _id: sequenceName }, { $inc: { sequenceValue: safeCount } }, { upsert: true, returnDocument: 'after' })];
                        case 1:
                            result = _c.sent();
                            endValue = (_b = (_a = result === null || result === void 0 ? void 0 : result.value) === null || _a === void 0 ? void 0 : _a.sequenceValue) !== null && _b !== void 0 ? _b : result === null || result === void 0 ? void 0 : result.sequenceValue;
                            end = typeof endValue === 'number' ? endValue : safeCount;
                            start = end - safeCount + 1;
                            return [2 /*return*/, Array.from({ length: safeCount }, function (_, index) { return start + index; })];
                    }
                });
            });
        };
        SequenceHelper_1.prototype.getPaymentId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, existingSequence, paymentCollection_1, maxPayment, maxPaymentId, result, nextValue, paymentCollection, existingPayment, maxPayment, maxPaymentId, error_2, paymentCollection, maxPayment, maxPaymentId, fallbackError_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'payment_id';
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 11, , 16]);
                            return [4 /*yield*/, sequenceCollection.findOne({
                                    _id: sequenceName,
                                })];
                        case 2:
                            existingSequence = _c.sent();
                            if (!!existingSequence) return [3 /*break*/, 5];
                            paymentCollection_1 = this.connection.collection('payment_details');
                            return [4 /*yield*/, paymentCollection_1.findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } })];
                        case 3:
                            maxPayment = _c.sent();
                            maxPaymentId = (maxPayment === null || maxPayment === void 0 ? void 0 : maxPayment.paymentId) || 0;
                            // Initialize sequence to maxPaymentId (next increment will give maxPaymentId + 1)
                            return [4 /*yield*/, sequenceCollection.insertOne({
                                    _id: sequenceName,
                                    sequenceValue: maxPaymentId,
                                })];
                        case 4:
                            // Initialize sequence to maxPaymentId (next increment will give maxPaymentId + 1)
                            _c.sent();
                            _c.label = 5;
                        case 5: return [4 /*yield*/, sequenceCollection.findOneAndUpdate({ _id: sequenceName }, { $inc: { sequenceValue: 1 } }, { returnDocument: 'after' })];
                        case 6:
                            result = _c.sent();
                            nextValue = (_b = (_a = result === null || result === void 0 ? void 0 : result.value) === null || _a === void 0 ? void 0 : _a.sequenceValue) !== null && _b !== void 0 ? _b : result === null || result === void 0 ? void 0 : result.sequenceValue;
                            if (!nextValue) {
                                throw new Error('Failed to get next payment ID from sequence');
                            }
                            paymentCollection = this.connection.collection('payment_details');
                            return [4 /*yield*/, paymentCollection.findOne({
                                    paymentId: nextValue,
                                })];
                        case 7:
                            existingPayment = _c.sent();
                            if (!existingPayment) return [3 /*break*/, 10];
                            return [4 /*yield*/, paymentCollection.findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } })];
                        case 8:
                            maxPayment = _c.sent();
                            maxPaymentId = (maxPayment === null || maxPayment === void 0 ? void 0 : maxPayment.paymentId) || 0;
                            // Update sequence to maxPaymentId + 1
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $set: { sequenceValue: maxPaymentId + 1 } })];
                        case 9:
                            // Update sequence to maxPaymentId + 1
                            _c.sent();
                            return [2 /*return*/, maxPaymentId + 1];
                        case 10: return [2 /*return*/, nextValue];
                        case 11:
                            error_2 = _c.sent();
                            console.error('Payment ID sequence error:', error_2);
                            _c.label = 12;
                        case 12:
                            _c.trys.push([12, 14, , 15]);
                            paymentCollection = this.connection.collection('payment_details');
                            return [4 /*yield*/, paymentCollection.findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } })];
                        case 13:
                            maxPayment = _c.sent();
                            maxPaymentId = (maxPayment === null || maxPayment === void 0 ? void 0 : maxPayment.paymentId) || 0;
                            console.log("[Payment ID] Using fallback: maxPaymentId=".concat(maxPaymentId, ", returning ").concat(maxPaymentId + 1));
                            return [2 /*return*/, maxPaymentId + 1];
                        case 14:
                            fallbackError_1 = _c.sent();
                            console.error('Fallback payment ID generation error:', fallbackError_1);
                            throw new Error("Failed to get payment ID: ".concat(error_2.message));
                        case 15: return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next product design ID
         * Ensures the sequence is initialized/synced with the max existing productDesignId
         * in `process_product_design` to avoid duplicate key errors.
         */
        SequenceHelper_1.prototype.getProductDesignId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, designCollection, maxDesign, maxDesignId, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'product_design_id';
                            designCollection = this.connection.collection('process_product_design');
                            return [4 /*yield*/, designCollection.findOne({}, { sort: { productDesignId: -1 }, projection: { productDesignId: 1 } })];
                        case 1:
                            maxDesign = _a.sent();
                            maxDesignId = (maxDesign === null || maxDesign === void 0 ? void 0 : maxDesign.productDesignId) || 0;
                            // Ensure sequence exists and is at least maxDesignId
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, {
                                    $setOnInsert: { sequenceValue: 0 },
                                    $max: { sequenceValue: maxDesignId },
                                }, { upsert: true })];
                        case 2:
                            // Ensure sequence exists and is at least maxDesignId
                            _a.sent();
                            // Atomically increment and get next value
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_3 = _a.sent();
                            console.error('Product design ID sequence error:', error_3);
                            return [2 /*return*/, this.getNextSequenceValue('product_design_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next product design measure ID
         * Ensures sequence is synced with max existing productDesignMeasureId in `process_pd_measures`
         */
        SequenceHelper_1.prototype.getProductDesignMeasureId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, measuresCollection, maxRow, maxId, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'product_design_measure_id';
                            measuresCollection = this.connection.collection('process_pd_measures');
                            return [4 /*yield*/, measuresCollection.findOne({}, {
                                    sort: { productDesignMeasureId: -1 },
                                    projection: { productDesignMeasureId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.productDesignMeasureId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_4 = _a.sent();
                            console.error('Product design measure ID sequence error:', error_4);
                            return [2 /*return*/, this.getNextSequenceValue('product_design_measure_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next product document ID
         * Ensures sequence is synced with max existing productDocumentId in `all_product_documents`
         */
        SequenceHelper_1.prototype.getProductDocumentId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, docsCollection, maxRow, maxId, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'product_document_id';
                            docsCollection = this.connection.collection('all_product_documents');
                            return [4 /*yield*/, docsCollection.findOne({}, {
                                    sort: { productDocumentId: -1 },
                                    projection: { productDocumentId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.productDocumentId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_5 = _a.sent();
                            console.error('Product document ID sequence error:', error_5);
                            return [2 /*return*/, this.getNextSequenceValue('product_document_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next product performance ID
         * Ensures sequence is synced with max existing processProductPerformanceId in `process_product_performance`
         */
        SequenceHelper_1.prototype.getProductPerformanceId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, performanceCollection, maxPerformance, maxPerformanceId, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'product_performance_id';
                            performanceCollection = this.connection.collection('process_product_performance');
                            return [4 /*yield*/, performanceCollection.findOne({}, {
                                    sort: { processProductPerformanceId: -1 },
                                    projection: { processProductPerformanceId: 1 },
                                })];
                        case 1:
                            maxPerformance = _a.sent();
                            maxPerformanceId = (maxPerformance === null || maxPerformance === void 0 ? void 0 : maxPerformance.processProductPerformanceId) || 0;
                            // Ensure sequence exists and is at least maxPerformanceId
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, {
                                    $setOnInsert: { sequenceValue: 0 },
                                    $max: { sequenceValue: maxPerformanceId },
                                }, { upsert: true })];
                        case 2:
                            // Ensure sequence exists and is at least maxPerformanceId
                            _a.sent();
                            // Atomically increment and get next value
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_6 = _a.sent();
                            console.error('Product performance ID sequence error:', error_6);
                            return [2 /*return*/, this.getNextSequenceValue('product_performance_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next product performance test report row ID
         * Synced with max `productPerformanceTestReportId` in `process_pp_test_reports`
         */
        SequenceHelper_1.prototype.getProductPerformanceTestReportId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, reportsCollection, maxRow, maxId, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'product_performance_test_report_id';
                            reportsCollection = this.connection.collection('process_pp_test_reports');
                            return [4 /*yield*/, reportsCollection.findOne({}, {
                                    sort: { productPerformanceTestReportId: -1 },
                                    projection: { productPerformanceTestReportId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.productPerformanceTestReportId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_7 = _a.sent();
                            console.error('Product performance test report ID sequence error:', error_7);
                            return [2 /*return*/, this.getNextSequenceValue('product_performance_test_report_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials hazardous products ID
         * Ensures sequence is synced with max existing rawMaterialsHazardousProductsId in `raw_materials_hazardous_products`
         */
        SequenceHelper_1.prototype.getRawMaterialsHazardousProductsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_hazardous_products_id';
                            collection = this.connection.collection('raw_materials_hazardous_products');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsHazardousProductsId: -1 },
                                    projection: { rawMaterialsHazardousProductsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsHazardousProductsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_8 = _a.sent();
                            console.error('Raw materials hazardous products ID sequence error:', error_8);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_hazardous_products_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials additives ID
         * Ensures sequence is synced with max existing rawMaterialsAdditivesId in `raw_materials_additives`
         */
        SequenceHelper_1.prototype.getRawMaterialsAdditivesId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_additives_id';
                            collection = this.connection.collection('raw_materials_additives');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsAdditivesId: -1 },
                                    projection: { rawMaterialsAdditivesId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsAdditivesId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_9 = _a.sent();
                            console.error('Raw materials additives ID sequence error:', error_9);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_additives_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials elimination of formaldehyde ID
         * Ensures sequence is synced with max existing rawMaterialsEliminationOfFormaldehydeId
         * in `raw_materials_elimination_of_formaldehyde`
         */
        SequenceHelper_1.prototype.getRawMaterialsEliminationOfFormaldehydeId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_elimination_of_formaldehyde_id';
                            collection = this.connection.collection('raw_materials_elimination_of_formaldehyde');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsEliminationOfFormaldehydeId: -1 },
                                    projection: { rawMaterialsEliminationOfFormaldehydeId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsEliminationOfFormaldehydeId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_10 = _a.sent();
                            console.error('Raw materials elimination of formaldehyde ID sequence error:', error_10);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_elimination_of_formaldehyde_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials elimination of prohibited flame ID
         * Ensures sequence is synced with max existing rawMaterialsEliminationOfProhibitedFlameId
         * in `raw_materials_elimination_of_prohibited_flame`
         */
        SequenceHelper_1.prototype.getRawMaterialsEliminationOfProhibitedFlameId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_elimination_of_prohibited_flame_id';
                            collection = this.connection.collection('raw_materials_elimination_of_prohibited_flame');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsEliminationOfProhibitedFlameId: -1 },
                                    projection: { rawMaterialsEliminationOfProhibitedFlameId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsEliminationOfProhibitedFlameId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_11 = _a.sent();
                            console.error('Raw materials elimination of prohibited flame ID sequence error:', error_11);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_elimination_of_prohibited_flame_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials elimination of prohibited flame solvents ID
         * Ensures sequence is synced with max existing rawMaterialsEliminationOfProhibitedFlameSolventsId
         * in `raw_materials_elimination_of_prohibited_flame_solvents`
         */
        SequenceHelper_1.prototype.getRawMaterialsEliminationOfProhibitedFlameSolventsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_elimination_of_prohibited_flame_solvents_id';
                            collection = this.connection.collection('raw_materials_elimination_of_prohibited_flame_solvents');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsEliminationOfProhibitedFlameSolventsId: -1 },
                                    projection: { rawMaterialsEliminationOfProhibitedFlameSolventsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsEliminationOfProhibitedFlameSolventsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_12 = _a.sent();
                            console.error('Raw materials elimination of prohibited flame solvents ID sequence error:', error_12);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_elimination_of_prohibited_flame_solvents_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials elimination of prohibited flame solvents products ID
         * Ensures sequence is synced with max existing
         * rawMaterialsEliminationProhibitedFlameSolventsProductsId
         * in `raw_materials_elimination_of_prohibited_flame_solvents_products`
         */
        SequenceHelper_1.prototype.getRawMaterialsEliminationOfProhibitedFlameSolventsProductsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_elimination_of_prohibited_flame_solvents_products_id';
                            collection = this.connection.collection('raw_materials_elimination_of_prohibited_flame_solvents_products');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: {
                                        rawMaterialsEliminationProhibitedFlameSolventsProductsId: -1,
                                    },
                                    projection: {
                                        rawMaterialsEliminationProhibitedFlameSolventsProductsId: 1,
                                    },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsEliminationProhibitedFlameSolventsProductsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_13 = _a.sent();
                            console.error('Raw materials elimination of prohibited flame solvents products ID sequence error:', error_13);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_elimination_of_prohibited_flame_solvents_products_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials green supply ID
         * Ensures sequence is synced with max existing rawMaterialsGreenSupplyId
         * in `raw_materials_green_supply`
         */
        SequenceHelper_1.prototype.getRawMaterialsGreenSupplyId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_green_supply_id';
                            collection = this.connection.collection('raw_materials_green_supply');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsGreenSupplyId: -1 },
                                    projection: { rawMaterialsGreenSupplyId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsGreenSupplyId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_14 = _a.sent();
                            console.error('Raw materials green supply ID sequence error:', error_14);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_green_supply_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials hazardous ID
         * Ensures sequence is synced with max existing rawMaterialsHazardousId
         * in `raw_materials_hazardous`
         */
        SequenceHelper_1.prototype.getRawMaterialsHazardousId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_hazardous_id';
                            collection = this.connection.collection('raw_materials_hazardous');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsHazardousId: -1 },
                                    projection: { rawMaterialsHazardousId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsHazardousId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_15 = _a.sent();
                            console.error('Raw materials hazardous ID sequence error:', error_15);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_hazardous_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials optimization of raw mix ID
         * Ensures sequence is synced with max existing rawMaterialsOptimizationOfRawMixId
         * in `raw_materials_optimization_of_raw_mix`
         */
        SequenceHelper_1.prototype.getRawMaterialsOptimizationOfRawMixId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_optimization_of_raw_mix_id';
                            collection = this.connection.collection('raw_materials_optimization_of_raw_mix');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsOptimizationOfRawMixId: -1 },
                                    projection: { rawMaterialsOptimizationOfRawMixId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsOptimizationOfRawMixId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_16 = _a.sent();
                            console.error('Raw materials optimization of raw mix ID sequence error:', error_16);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_optimization_of_raw_mix_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials rapidly renewable materials ID
         * Ensures sequence is synced with max existing rawMaterialsRapidlyRenewableMaterialsId
         * in `raw_materials_rapidly_renewable_materials`
         */
        SequenceHelper_1.prototype.getRawMaterialsRapidlyRenewableMaterialsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_rapidly_renewable_materials_id';
                            collection = this.connection.collection('raw_materials_rapidly_renewable_materials');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsRapidlyRenewableMaterialsId: -1 },
                                    projection: { rawMaterialsRapidlyRenewableMaterialsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsRapidlyRenewableMaterialsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_17 = _a.sent();
                            console.error('Raw materials rapidly renewable materials ID sequence error:', error_17);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_rapidly_renewable_materials_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials recovery ID
         * Ensures sequence is synced with max existing rawMaterialsRecoveryId
         * in `raw_materials_recovery`
         */
        SequenceHelper_1.prototype.getRawMaterialsRecoveryId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_recovery_id';
                            collection = this.connection.collection('raw_materials_recovery');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsRecoveryId: -1 },
                                    projection: { rawMaterialsRecoveryId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsRecoveryId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_18 = _a.sent();
                            console.error('Raw materials recovery ID sequence error:', error_18);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_recovery_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials recycled content ID
         * Ensures sequence is synced with max existing rawMaterialsRecycledContentId
         * in `raw_materials_recycled_content`
         */
        SequenceHelper_1.prototype.getRawMaterialsRecycledContentId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_recycled_content_id';
                            collection = this.connection.collection('raw_materials_recycled_content');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsRecycledContentId: -1 },
                                    projection: { rawMaterialsRecycledContentId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsRecycledContentId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_19 = _a.sent();
                            console.error('Raw materials recycled content ID sequence error:', error_19);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_recycled_content_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials reduce environmental ID
         * Ensures sequence is synced with max existing rawMaterialsReduceEnvironmentalId
         * in `raw_materials_reduce_environmental`
         */
        SequenceHelper_1.prototype.getRawMaterialsReduceEnvironmentalId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_reduce_environmental_id';
                            collection = this.connection.collection('raw_materials_reduce_environmental');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsReduceEnvironmentalId: -1 },
                                    projection: { rawMaterialsReduceEnvironmentalId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsReduceEnvironmentalId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_20 = _a.sent();
                            console.error('Raw materials reduce environmental ID sequence error:', error_20);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_reduce_environmental_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials regional materials ID
         * Ensures sequence is synced with max existing rawMaterialsRegionalMaterialsId
         * in `raw_materials_regional_materials`
         */
        SequenceHelper_1.prototype.getRawMaterialsRegionalMaterialsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_regional_materials_id';
                            collection = this.connection.collection('raw_materials_regional_materials');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsRegionalMaterialsId: -1 },
                                    projection: { rawMaterialsRegionalMaterialsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsRegionalMaterialsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_21 = _a.sent();
                            console.error('Raw materials regional materials ID sequence error:', error_21);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_regional_materials_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials utilization ID
         * Ensures sequence is synced with max existing rawMaterialsUtilizationId
         * in `raw_materials_utilization`
         */
        SequenceHelper_1.prototype.getRawMaterialsUtilizationId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_utilization_id';
                            collection = this.connection.collection('raw_materials_utilization');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsUtilizationId: -1 },
                                    projection: { rawMaterialsUtilizationId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsUtilizationId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_22 = _a.sent();
                            console.error('Raw materials utilization ID sequence error:', error_22);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_utilization_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials utilization manufacturing units ID
         * Ensures sequence is synced with max existing rawMaterialsUtilizationManufacturingUnitsId
         * in `raw_materials_utilization_manufacturing_units`
         */
        SequenceHelper_1.prototype.getRawMaterialsUtilizationManufacturingUnitsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_utilization_manufacturing_units_id';
                            collection = this.connection.collection('raw_materials_utilization_manufacturing_units');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsUtilizationManufacturingUnitsId: -1 },
                                    projection: { rawMaterialsUtilizationManufacturingUnitsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsUtilizationManufacturingUnitsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_23 = _a.sent();
                            console.error('Raw materials utilization manufacturing units ID sequence error:', error_23);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_utilization_manufacturing_units_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next raw materials utilization RMC ID
         * Ensures sequence is synced with max existing rawMaterialsUtilizationRmcId
         * in `raw_materials_utilization_rmc`
         */
        SequenceHelper_1.prototype.getRawMaterialsUtilizationRmcId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'raw_materials_utilization_rmc_id';
                            collection = this.connection.collection('raw_materials_utilization_rmc');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { rawMaterialsUtilizationRmcId: -1 },
                                    projection: { rawMaterialsUtilizationRmcId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.rawMaterialsUtilizationRmcId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_24 = _a.sent();
                            console.error('Raw materials utilization RMC ID sequence error:', error_24);
                            return [2 /*return*/, this.getNextSequenceValue('raw_materials_utilization_rmc_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process manufacturing ID
         * Ensures sequence is synced with max existing processManufacturingId in `process_manufacturing`
         */
        SequenceHelper_1.prototype.getProcessManufacturingId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_25;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_manufacturing_id';
                            collection = this.connection.collection('process_manufacturing');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processManufacturingId: -1 },
                                    projection: { processManufacturingId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processManufacturingId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_25 = _a.sent();
                            console.error('Process manufacturing ID sequence error:', error_25);
                            return [2 /*return*/, this.getNextSequenceValue('process_manufacturing_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process mp manufacturing unit ID
         * Ensures sequence is synced with max existing processMpManufacturingUnitId in `process_mp_manufacturing_units`
         */
        SequenceHelper_1.prototype.getProcessMpManufacturingUnitId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_mp_manufacturing_unit_id';
                            collection = this.connection.collection('process_mp_manufacturing_units');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processMpManufacturingUnitId: -1 },
                                    projection: { processMpManufacturingUnitId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processMpManufacturingUnitId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_26 = _a.sent();
                            console.error('Process MP manufacturing unit ID sequence error:', error_26);
                            return [2 /*return*/, this.getNextSequenceValue('process_mp_manufacturing_unit_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process waste management ID
         * Ensures sequence is synced with max existing processWasteManagementId in `process_waste_management`
         */
        SequenceHelper_1.prototype.getProcessWasteManagementId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_waste_management_id';
                            collection = this.connection.collection('process_waste_management');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processWasteManagementId: -1 },
                                    projection: { processWasteManagementId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processWasteManagementId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_27 = _a.sent();
                            console.error('Process waste management ID sequence error:', error_27);
                            return [2 /*return*/, this.getNextSequenceValue('process_waste_management_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process WM manufacturing unit ID
         * Ensures sequence is synced with max existing processWmManufacturingUnitId in `process_wm_manufacturing_units`
         */
        SequenceHelper_1.prototype.getProcessWmManufacturingUnitId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_wm_manufacturing_unit_id';
                            collection = this.connection.collection('process_wm_manufacturing_units');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processWmManufacturingUnitId: -1 },
                                    projection: { processWmManufacturingUnitId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processWmManufacturingUnitId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_28 = _a.sent();
                            console.error('Process WM manufacturing unit ID sequence error:', error_28);
                            return [2 /*return*/, this.getNextSequenceValue('process_wm_manufacturing_unit_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process life cycle approach ID
         * Ensures sequence is synced with max existing processLifeCycleApproachId in `process_life_cycle_approach`
         */
        SequenceHelper_1.prototype.getProcessLifeCycleApproachId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_29;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_life_cycle_approach_id';
                            collection = this.connection.collection('process_life_cycle_approach');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processLifeCycleApproachId: -1 },
                                    projection: { processLifeCycleApproachId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processLifeCycleApproachId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_29 = _a.sent();
                            console.error('Process life cycle approach ID sequence error:', error_29);
                            return [2 /*return*/, this.getNextSequenceValue('process_life_cycle_approach_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process product stewardship ID
         * Ensures sequence is synced with max existing processProductStewardshipId in `process_product_stewardship`
         */
        SequenceHelper_1.prototype.getProcessProductStewardshipId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_30;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_product_stewardship_id';
                            collection = this.connection.collection('process_product_stewardship');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processProductStewardshipId: -1 },
                                    projection: { processProductStewardshipId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processProductStewardshipId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_30 = _a.sent();
                            console.error('Process product stewardship ID sequence error:', error_30);
                            return [2 /*return*/, this.getNextSequenceValue('process_product_stewardship_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process innovation ID
         * Ensures sequence is synced with max existing processInnovationId in `process_innovation`
         */
        SequenceHelper_1.prototype.getProcessInnovationId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_31;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_innovation_id';
                            collection = this.connection.collection('process_innovation');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processInnovationId: -1 },
                                    projection: { processInnovationId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processInnovationId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_31 = _a.sent();
                            console.error('Process innovation ID sequence error:', error_31);
                            return [2 /*return*/, this.getNextSequenceValue('process_innovation_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get next process comments ID
         * Ensures sequence is synced with max existing processCommentsId in `process_comments`
         */
        SequenceHelper_1.prototype.getProcessCommentsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, collection, maxRow, maxId, error_32;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'process_comments_id';
                            collection = this.connection.collection('process_comments');
                            return [4 /*yield*/, collection.findOne({}, {
                                    sort: { processCommentsId: -1 },
                                    projection: { processCommentsId: 1 },
                                })];
                        case 1:
                            maxRow = _a.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow.processCommentsId) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } }, { upsert: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 3:
                            error_32 = _a.sent();
                            console.error('Process comments ID sequence error:', error_32);
                            return [2 /*return*/, this.getNextSequenceValue('process_comments_id')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SequenceHelper_1.prototype.getProcessFinalReviewId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_final_review_id', 'process_final_review', 'processFinalReviewId')];
                });
            });
        };
        /** Per-user in-app notification numeric id (`user_notifications.id`). */
        SequenceHelper_1.prototype.getUserNotificationId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, sequenceName, existingSequence, notificationCollection, maxRow, maxId, error_33;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sequenceCollection = this.connection.collection('sequences');
                            sequenceName = 'user_notification_id';
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, sequenceCollection.findOne({
                                    _id: sequenceName,
                                })];
                        case 2:
                            existingSequence = _b.sent();
                            if (!!existingSequence) return [3 /*break*/, 5];
                            notificationCollection = this.connection.collection('user_notifications');
                            return [4 /*yield*/, notificationCollection.findOne({}, { sort: { id: -1 }, projection: { id: 1 } })];
                        case 3:
                            maxRow = _b.sent();
                            maxId = Number((_a = maxRow === null || maxRow === void 0 ? void 0 : maxRow.id) !== null && _a !== void 0 ? _a : 0) || 0;
                            return [4 /*yield*/, sequenceCollection.insertOne({
                                    _id: sequenceName,
                                    sequenceValue: maxId,
                                })];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 6:
                            error_33 = _b.sent();
                            console.error('User notification ID sequence error:', error_33);
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SequenceHelper_1.prototype.syncMaxAndNext = function (sequenceName, collectionName, idField) {
            return __awaiter(this, void 0, void 0, function () {
                var sequenceCollection, dataCollection, maxRow, maxId, error_34;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 5, , 6]);
                            sequenceCollection = this.connection.collection('sequences');
                            dataCollection = this.connection.collection(collectionName);
                            return [4 /*yield*/, dataCollection.findOne({}, { sort: (_a = {}, _a[idField] = -1, _a), projection: (_b = {}, _b[idField] = 1, _b) })];
                        case 1:
                            maxRow = _c.sent();
                            maxId = (maxRow === null || maxRow === void 0 ? void 0 : maxRow[idField]) || 0;
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $setOnInsert: { sequenceValue: 0 } }, { upsert: true })];
                        case 2:
                            _c.sent();
                            if (!(maxId > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, sequenceCollection.updateOne({ _id: sequenceName }, { $max: { sequenceValue: maxId } })];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4: return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 5:
                            error_34 = _c.sent();
                            console.error("Sequence error for ".concat(sequenceName, ":"), error_34);
                            return [2 /*return*/, this.getNextSequenceValue(sequenceName)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SequenceHelper_1.prototype.getRenewProductDocumentId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('renew_product_document_id', 'all_renew_product_documents', 'productDocumentId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewManufacturingId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_manufacturing_id', 'process_renew_manufacturing', 'processRenewManufacturingId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewProductPerformanceId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_product_performance_id', 'process_renew_product_performance', 'processRenewProductPerformanceId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewProductPerformanceTestReportId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_pp_test_report_id', 'process_renew_pp_test_reports', 'processRenewProductPerformanceTestReportId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewWasteManagementId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_waste_management_id', 'process_renew_waste_management', 'processRenewWasteManagementId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewInnovationId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_innovation_id', 'process_renew_innovation', 'processRenewInnovationId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewProductStewardshipId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_product_stewardship_id', 'process_renew_product_stewardship', 'processRenewProductStewardshipId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewCommentsId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_comments_id', 'process_renew_comments', 'processRenewCommentsId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewMpManufacturingUnitId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_mp_manufacturing_unit_id', 'process_renew_mp_manufacturing_units', 'processRenewMpManufacturingUnitId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewMpEnergyConsumptionId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_mp_energy_consumption_id', 'process_renew_mp_energy_consumption', 'processRenewMpEnergyConsumptionId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewWmManufacturingUnitId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_wm_manufacturing_unit_id', 'process_renew_wm_manufacturing_units', 'processRenewWmManufacturingUnitId')];
                });
            });
        };
        SequenceHelper_1.prototype.getProcessRenewPsStakeholderEduAwarnessId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncMaxAndNext('process_renew_ps_stakeholder_edu_awarness_id', 'process_renew_ps_stakeholder_edu_awarness', 'processRenewPsStakeholderEduAwarnessId')];
                });
            });
        };
        return SequenceHelper_1;
    }());
    __setFunctionName(_classThis, "SequenceHelper");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SequenceHelper = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SequenceHelper = _classThis;
}();
exports.SequenceHelper = SequenceHelper;
