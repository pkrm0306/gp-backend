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
exports.CertificationExpiryService = void 0;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../../renew/schemas/renewal-cycle.schema");
var certification_dates_util_1 = require("../../product-registration/helpers/certification-dates.util");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var cron_date_util_1 = require("../utils/cron-date.util");
var notification_recipient_groups_util_1 = require("../../notifications/utils/notification-recipient-groups.util");
var DEACTIVATION_EMAIL_CONCURRENCY = 5;
var CertificationExpiryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CertificationExpiryService = _classThis = /** @class */ (function () {
        function CertificationExpiryService_1(queryService, templateService, emailService, configService, productModel, renewalCycleModel, cronEmailLogModel, lifecycleNotification) {
            this.queryService = queryService;
            this.templateService = templateService;
            this.emailService = emailService;
            this.configService = configService;
            this.productModel = productModel;
            this.renewalCycleModel = renewalCycleModel;
            this.cronEmailLogModel = cronEmailLogModel;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(CertificationExpiryService.name);
        }
        CertificationExpiryService_1.prototype.notifyExpiryAdmin = function (product, stage, includeAdminEmail) {
            var _this = this;
            var _a, _b;
            var manufacturerName = String((_b = (_a = product.manufacturerName) !== null && _a !== void 0 ? _a : product.vendorName) !== null && _b !== void 0 ? _b : 'Manufacturer').trim();
            this.lifecycleNotification
                .notifyCertificationExpiryAdmin({
                manufacturerName: manufacturerName,
                urnNo: product.urnNo,
                eoiNo: product.eoiNo,
                stage: stage,
                productId: product.productId,
                includeAdminEmail: includeAdminEmail,
            })
                .catch(function (err) {
                return _this.logger.warn("[".concat(stage, "] Admin expiry notification failed for product ").concat(product.productId, ": ").concat(err.message));
            });
        };
        CertificationExpiryService_1.prototype.runBefore2Month = function () {
            return __awaiter(this, arguments, void 0, function (asOf) {
                var _this = this;
                if (asOf === void 0) { asOf = new Date(); }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.runJob('before2month', asOf, function (products, todayIso, result) { return __awaiter(_this, void 0, void 0, function () {
                            var year, vendorCc, _i, products_1, product, html;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        year = Number(todayIso.slice(0, 4));
                                        vendorCc = this.resolveExpiryVendorCc();
                                        _i = 0, products_1 = products;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < products_1.length)) return [3 /*break*/, 5];
                                        product = products_1[_i];
                                        if (!product.firstNotifyDate) {
                                            result.skipped += 1;
                                            return [3 /*break*/, 4];
                                        }
                                        if (!(0, cron_date_util_1.isSameCalendarDayInTimeZone)(product.firstNotifyDate, asOf)) {
                                            result.skipped += 1;
                                            return [3 /*break*/, 4];
                                        }
                                        return [4 /*yield*/, this.templateService.renderCertificationExpiryEmail(product, { includeYear: true, year: year })];
                                    case 2:
                                        html = _a.sent();
                                        return [4 /*yield*/, this.processProductEmail(product, {
                                                jobType: 'before2month',
                                                notifyDate: todayIso,
                                                subject: "GreenPro \u2014 Expiry reminder (".concat(product.eoiNo || product.urnNo, ")"),
                                                html: html,
                                                vendorCc: vendorCc,
                                                result: result,
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        CertificationExpiryService_1.prototype.runWeeklyMail = function () {
            return __awaiter(this, arguments, void 0, function (asOf) {
                var _this = this;
                if (asOf === void 0) { asOf = new Date(); }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.runJob('weeklyMail', asOf, function (products, todayIso, result) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, products_2, product, secondIso, thirdIso, notifyDate, html;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, products_2 = products;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < products_2.length)) return [3 /*break*/, 5];
                                        product = products_2[_i];
                                        if (!product.secondNotifyDate || !product.thirdNotifyDate) {
                                            result.skipped += 1;
                                            return [3 /*break*/, 4];
                                        }
                                        secondIso = (0, cron_date_util_1.toIsoDateInTimeZone)(product.secondNotifyDate);
                                        thirdIso = (0, cron_date_util_1.toIsoDateInTimeZone)(product.thirdNotifyDate);
                                        if (!(todayIso > secondIso && todayIso < thirdIso)) {
                                            result.skipped += 1;
                                            return [3 /*break*/, 4];
                                        }
                                        if ((0, cron_date_util_1.calendarDaysBetween)(product.secondNotifyDate, asOf) !== 7) {
                                            result.skipped += 1;
                                            return [3 /*break*/, 4];
                                        }
                                        notifyDate = "".concat(secondIso, "-weekly-d7");
                                        return [4 /*yield*/, this.templateService.renderCertificationExpiryEmail(product, { includeYear: false })];
                                    case 2:
                                        html = _a.sent();
                                        return [4 /*yield*/, this.processProductEmail(product, {
                                                jobType: 'weeklyMail',
                                                notifyDate: notifyDate,
                                                subject: "GreenPro \u2014 Weekly expiry reminder (".concat(product.eoiNo || product.urnNo, ")"),
                                                html: html,
                                                result: result,
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        CertificationExpiryService_1.prototype.runDeactivationMail = function () {
            return __awaiter(this, arguments, void 0, function (asOf) {
                var _this = this;
                if (asOf === void 0) { asOf = new Date(); }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.runJob('deactivationMail', asOf, function (products, todayIso, result) { return __awaiter(_this, void 0, void 0, function () {
                            var startedAt, regYear, currentYear, toDeactivate, productIds, now, updateResult;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        startedAt = Date.now();
                                        regYear = (0, cron_date_util_1.yearMonthsAgoInTimeZone)(24);
                                        currentYear = Number(todayIso.slice(0, 4));
                                        return [4 /*yield*/, this.planDeactivationBatch(products, todayIso, result)];
                                    case 1:
                                        toDeactivate = _c.sent();
                                        result.planned = toDeactivate.length;
                                        if (toDeactivate.length === 0) {
                                            result.durationMs = Date.now() - startedAt;
                                            return [2 /*return*/];
                                        }
                                        result.processed = toDeactivate.length;
                                        productIds = toDeactivate.map(function (item) { return item.product.productId; });
                                        now = new Date();
                                        return [4 /*yield*/, this.productModel.updateMany({
                                                productId: { $in: productIds },
                                                productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                            }, {
                                                $set: {
                                                    productStatus: product_status_constants_1.PRODUCT_STATUS_DISCONTINUED,
                                                    updatedDate: now,
                                                },
                                            })];
                                    case 2:
                                        updateResult = _c.sent();
                                        result.matchedCount = (_a = updateResult.matchedCount) !== null && _a !== void 0 ? _a : 0;
                                        result.modifiedCount = (_b = updateResult.modifiedCount) !== null && _b !== void 0 ? _b : 0;
                                        result.deactivated = result.modifiedCount;
                                        return [4 /*yield*/, this.sendDeactivationNotifications(toDeactivate, { regYear: regYear, currentYear: currentYear }, result)];
                                    case 3:
                                        _c.sent();
                                        result.durationMs = Date.now() - startedAt;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (date) { return _this.queryService.getDeactivationEligibleProducts(date); })];
                });
            });
        };
        /** Phase 1 — eligibility + idempotency in memory; no product status writes. */
        CertificationExpiryService_1.prototype.planDeactivationBatch = function (products, todayIso, result) {
            return __awaiter(this, void 0, void 0, function () {
                var candidates, _i, products_3, product, graceEndIso, productIds, notifyDates, _a, existingLogs, statusRows, loggedKeys, statusByProductId, toDeactivate, _b, candidates_1, item, logKey;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            candidates = [];
                            for (_i = 0, products_3 = products; _i < products_3.length; _i++) {
                                product = products_3[_i];
                                if (!product.validtillDate) {
                                    result.skipped += 1;
                                    continue;
                                }
                                graceEndIso = (0, cron_date_util_1.toIsoDateInTimeZone)((0, certification_dates_util_1.computeGraceEndDate)(product.validtillDate));
                                if (graceEndIso > todayIso) {
                                    result.skipped += 1;
                                    continue;
                                }
                                candidates.push({
                                    product: product,
                                    notifyDate: "deactivate-".concat(graceEndIso),
                                });
                            }
                            if (candidates.length === 0) {
                                return [2 /*return*/, []];
                            }
                            productIds = candidates.map(function (item) { return item.product.productId; });
                            notifyDates = __spreadArray([], new Set(candidates.map(function (item) { return item.notifyDate; })), true);
                            return [4 /*yield*/, Promise.all([
                                    this.cronEmailLogModel
                                        .find({
                                        jobType: 'deactivationMail',
                                        productId: { $in: productIds },
                                        notifyDate: { $in: notifyDates },
                                    })
                                        .select('productId notifyDate')
                                        .lean()
                                        .exec(),
                                    this.productModel
                                        .find({ productId: { $in: productIds } })
                                        .select('productId productStatus')
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _c.sent(), existingLogs = _a[0], statusRows = _a[1];
                            loggedKeys = new Set(existingLogs.map(function (row) { return "".concat(row.productId, ":").concat(row.notifyDate); }));
                            statusByProductId = new Map(statusRows.map(function (row) { return [Number(row.productId), Number(row.productStatus)]; }));
                            toDeactivate = [];
                            for (_b = 0, candidates_1 = candidates; _b < candidates_1.length; _b++) {
                                item = candidates_1[_b];
                                logKey = "".concat(item.product.productId, ":").concat(item.notifyDate);
                                if (loggedKeys.has(logKey) &&
                                    statusByProductId.get(item.product.productId) ===
                                        product_status_constants_1.PRODUCT_STATUS_DISCONTINUED) {
                                    result.skipped += 1;
                                    continue;
                                }
                                toDeactivate.push(item);
                            }
                            return [2 /*return*/, toDeactivate];
                    }
                });
            });
        };
        /** Phase 3 — vendor email + cron log after bulk status commit. */
        CertificationExpiryService_1.prototype.sendDeactivationNotifications = function (batch, templateVars, result) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.mapWithConcurrency(batch, DEACTIVATION_EMAIL_CONCURRENCY, function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var product, notifyDate, html, error_1;
                                var _a, _b, _c, _d, _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            product = item.product, notifyDate = item.notifyDate;
                                            _f.label = 1;
                                        case 1:
                                            _f.trys.push([1, 5, , 6]);
                                            return [4 /*yield*/, this.templateService.renderDeactivationEmail(product, {
                                                    productRegistrationYear: templateVars.regYear,
                                                    currentYear: templateVars.currentYear,
                                                })];
                                        case 2:
                                            html = _f.sent();
                                            return [4 /*yield*/, this.sendVendorEmail(product, "GreenPro \u2014 Product deactivated (".concat(product.eoiNo || product.urnNo, ")"), html)];
                                        case 3:
                                            _f.sent();
                                            return [4 /*yield*/, this.writeLog(product, 'deactivationMail', notifyDate)];
                                        case 4:
                                            _f.sent();
                                            result.sent += 1;
                                            this.notifyExpiryAdmin(product, 'deactivation', true);
                                            this.lifecycleNotification.notifyVendorCertificationExpiryInApp({
                                                manufacturerId: String(product.vendorId),
                                                productName: String((_b = (_a = product.productName) !== null && _a !== void 0 ? _a : product.eoiNo) !== null && _b !== void 0 ? _b : product.urnNo),
                                                eoiNo: String((_c = product.eoiNo) !== null && _c !== void 0 ? _c : ''),
                                                reminderStage: 'Product deactivated due to certification expiry',
                                                vendorEmail: product.vendorEmail,
                                                manufacturerName: String((_e = (_d = product.manufacturerName) !== null && _d !== void 0 ? _d : product.vendorName) !== null && _e !== void 0 ? _e : ''),
                                            });
                                            return [3 /*break*/, 6];
                                        case 5:
                                            error_1 = _f.sent();
                                            result.failed += 1;
                                            result.errors.push(this.errorEntry(product, error_1));
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.mapWithConcurrency = function (items, concurrency, worker) {
            return __awaiter(this, void 0, void 0, function () {
                var index, limit, runners;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (items.length === 0)
                                return [2 /*return*/];
                            index = 0;
                            limit = Math.max(1, Math.min(concurrency, items.length));
                            runners = Array.from({ length: limit }, function () { return __awaiter(_this, void 0, void 0, function () {
                                var current;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(index < items.length)) return [3 /*break*/, 2];
                                            current = items[index];
                                            index += 1;
                                            return [4 /*yield*/, worker(current)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 0];
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(runners)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.runJob = function (jobType_1, asOf_1, handler_1) {
            return __awaiter(this, arguments, void 0, function (jobType, asOf, handler, loadProducts) {
                var result, products, todayIso, error_2, emailOff, extras;
                var _this = this;
                var _a, _b, _c, _d, _e;
                if (loadProducts === void 0) { loadProducts = function (date) {
                    return _this.queryService.getEligibleProducts(date);
                }; }
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            result = {
                                success: true,
                                jobType: jobType,
                                processed: 0,
                                sent: 0,
                                skipped: 0,
                                failed: 0,
                                deactivated: 0,
                                errors: [],
                            };
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, loadProducts(asOf)];
                        case 2:
                            products = _f.sent();
                            todayIso = (0, cron_date_util_1.todayIsoInTimeZone)();
                            return [4 /*yield*/, handler(products, todayIso, result)];
                        case 3:
                            _f.sent();
                            result.success = result.failed === 0;
                            return [3 /*break*/, 5];
                        case 4:
                            error_2 = _f.sent();
                            result.success = false;
                            result.errors.push({
                                message: error_2 instanceof Error ? error_2.message : String(error_2),
                            });
                            return [3 /*break*/, 5];
                        case 5:
                            emailOff = String((_a = this.configService.get('EMAIL_DISABLED')) !== null && _a !== void 0 ? _a : 'false').toLowerCase() ===
                                'true';
                            extras = jobType === 'deactivationMail'
                                ? " planned=".concat((_b = result.planned) !== null && _b !== void 0 ? _b : 0, " matched=").concat((_c = result.matchedCount) !== null && _c !== void 0 ? _c : 0, " modified=").concat((_d = result.modifiedCount) !== null && _d !== void 0 ? _d : 0, " durationMs=").concat((_e = result.durationMs) !== null && _e !== void 0 ? _e : 0)
                                : '';
                            this.logger.log("[".concat(jobType, "] processed=").concat(result.processed, " sent=").concat(result.sent, " skipped=").concat(result.skipped, " failed=").concat(result.failed, " deactivated=").concat(result.deactivated).concat(extras, " emailDisabled=").concat(emailOff));
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.processProductEmail = function (product, options) {
            return __awaiter(this, void 0, void 0, function () {
                var jobType, notifyDate, subject, html, vendorCc, result, exists, email, expiryStage, includeAdminEmail, error_3;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            jobType = options.jobType, notifyDate = options.notifyDate, subject = options.subject, html = options.html, vendorCc = options.vendorCc, result = options.result;
                            return [4 /*yield*/, this.cronEmailLogModel.exists({
                                    productId: product.productId,
                                    jobType: jobType,
                                    notifyDate: notifyDate,
                                })];
                        case 1:
                            exists = _g.sent();
                            if (exists) {
                                result.skipped += 1;
                                return [2 /*return*/];
                            }
                            email = String((_a = product.vendorEmail) !== null && _a !== void 0 ? _a : '').trim();
                            if (!email) {
                                result.skipped += 1;
                                result.errors.push({
                                    productId: product.productId,
                                    urnNo: product.urnNo,
                                    message: 'Missing vendor email',
                                });
                                return [2 /*return*/];
                            }
                            result.processed += 1;
                            _g.label = 2;
                        case 2:
                            _g.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.sendVendorEmail(product, subject, html, vendorCc)];
                        case 3:
                            _g.sent();
                            return [4 /*yield*/, this.writeLog(product, jobType, notifyDate)];
                        case 4:
                            _g.sent();
                            result.sent += 1;
                            expiryStage = jobType === 'before2month'
                                ? '60-day'
                                : jobType === 'weeklyMail'
                                    ? 'weekly'
                                    : 'deactivation';
                            includeAdminEmail = jobType !== 'before2month';
                            this.notifyExpiryAdmin(product, expiryStage, includeAdminEmail);
                            this.lifecycleNotification.notifyVendorCertificationExpiryInApp({
                                manufacturerId: String(product.vendorId),
                                productName: String((_c = (_b = product.productName) !== null && _b !== void 0 ? _b : product.eoiNo) !== null && _c !== void 0 ? _c : product.urnNo),
                                eoiNo: String((_d = product.eoiNo) !== null && _d !== void 0 ? _d : ''),
                                reminderStage: expiryStage === '60-day'
                                    ? '60-day expiry reminder'
                                    : expiryStage === 'weekly'
                                        ? 'Weekly expiry reminder'
                                        : 'Product deactivated due to certification expiry',
                                vendorEmail: product.vendorEmail,
                                manufacturerName: String((_f = (_e = product.manufacturerName) !== null && _e !== void 0 ? _e : product.vendorName) !== null && _f !== void 0 ? _f : ''),
                            });
                            return [3 /*break*/, 6];
                        case 5:
                            error_3 = _g.sent();
                            result.failed += 1;
                            result.errors.push(this.errorEntry(product, error_3));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.sendVendorEmail = function (product, subject, html, cc) {
            return __awaiter(this, void 0, void 0, function () {
                var email, vendorEmail, ccFiltered;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            email = String((_a = product.vendorEmail) !== null && _a !== void 0 ? _a : '').trim();
                            if (!email)
                                return [2 /*return*/];
                            vendorEmail = email.toLowerCase();
                            ccFiltered = (_b = cc === null || cc === void 0 ? void 0 : cc.filter(function (addr) { return addr.trim().toLowerCase() !== vendorEmail; })) !== null && _b !== void 0 ? _b : [];
                            return [4 /*yield*/, this.emailService.sendEmail(email, subject, html, undefined, {
                                    rawHtml: true,
                                    cc: ccFiltered.length ? ccFiltered : undefined,
                                })];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.writeLog = function (product, jobType, notifyDate) {
            return __awaiter(this, void 0, void 0, function () {
                var inProgress;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: product.urnNo, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                .select('_id')
                                .lean()
                                .exec()];
                        case 1:
                            inProgress = _b.sent();
                            return [4 /*yield*/, this.cronEmailLogModel.create({
                                    productId: product.productId,
                                    urnNo: product.urnNo,
                                    eoiNo: product.eoiNo,
                                    jobType: jobType,
                                    notifyDate: notifyDate,
                                    vendorId: product.vendorId,
                                    renewCycleNo: (_a = product.renewCycleNo) !== null && _a !== void 0 ? _a : undefined,
                                    urnStatus: product.urnStatus,
                                    productRenewStatus: product.productRenewStatus,
                                    renewalCycleId: inProgress === null || inProgress === void 0 ? void 0 : inProgress._id,
                                    sentAt: new Date(),
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CertificationExpiryService_1.prototype.resolveExpiryVendorCc = function () {
            var _a;
            var fromGroups = (0, notification_recipient_groups_util_1.resolveCcGroups)(this.configService, ['SHEshi']);
            if (fromGroups.length) {
                return fromGroups;
            }
            var legacy = ((_a = this.configService.get('CRON_EXPIRY_INTERNAL_CC')) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            return (0, notification_recipient_groups_util_1.parseEmailList)(legacy);
        };
        CertificationExpiryService_1.prototype.errorEntry = function (product, error) {
            return {
                productId: product === null || product === void 0 ? void 0 : product.productId,
                urnNo: product === null || product === void 0 ? void 0 : product.urnNo,
                message: error instanceof Error ? error.message : String(error),
            };
        };
        return CertificationExpiryService_1;
    }());
    __setFunctionName(_classThis, "CertificationExpiryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CertificationExpiryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CertificationExpiryService = _classThis;
}();
exports.CertificationExpiryService = CertificationExpiryService;
