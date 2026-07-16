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
Object.defineProperty(exports, "__esModule", { value: true });
exports.migratePayments = migratePayments;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
function migratePayments(ctx, targetTable) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (targetTable === 'online_payment_details') {
                return [2 /*return*/, migrateOnlinePayments(ctx)];
            }
            return [2 /*return*/, migratePaymentDetails(ctx)];
        });
    });
}
function migratePaymentDetails(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlRows, inserted, errors, notes, rows, docs, _i, _a, row, paymentId, vendorOid, mongoId;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mysqlTable = 'payment_details';
                    mongoCollection = 'payment_details';
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _d.sent();
                    inserted = 0;
                    errors = 0;
                    notes = [];
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'payment_id')];
                case 2:
                    rows = _d.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _d.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    row = _a[_i];
                    paymentId = Number(row.payment_id);
                    return [4 /*yield*/, ctx.idMap.resolve('vendors', Number(row.vendor_id))];
                case 4:
                    vendorOid = _d.sent();
                    if (!vendorOid) {
                        errors++;
                        notes.push("payment ".concat(paymentId, ": missing vendor ").concat(row.vendor_id));
                        return [3 /*break*/, 6];
                    }
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        paymentId: paymentId,
                        urnNo: (0, transforms_1.normalizeUrn)(row.urn_no),
                        vendorId: vendorOid,
                        quoteAmount: (0, transforms_1.parseDecimalNumber)(row.quote_amount),
                        quoteGstAmount: (0, transforms_1.parseDecimalNumber)(row.quote_gst_amount),
                        quoteTdsAmount: (0, transforms_1.parseDecimalNumber)(row.quote_tds_amount),
                        quoteTotal: (0, transforms_1.parseDecimalNumber)(row.quote_total),
                        proposalFile: (0, transforms_1.trimString)(row.proposal_file) || undefined,
                        adminGstNo: (0, transforms_1.trimString)(row.admin_gst_no),
                        vendorGstNo: (0, transforms_1.trimString)(row.vendor_gst_no),
                        paymentType: (0, transforms_1.trimString)(row.payment_type) || 'registration',
                        paymentMode: (0, transforms_1.trimString)(row.payment_mode) || undefined,
                        onlinePaymentId: Number((_b = row.online_payment_id) !== null && _b !== void 0 ? _b : 0),
                        paymentReferenceNo: (0, transforms_1.trimString)(row.payment_reference_no) || undefined,
                        paymentChequeDate: (0, transforms_1.parseMysqlDate)(row.payment_cheque_date),
                        chequeOrDdFile: (0, transforms_1.trimString)(row.cheque_or_dd_file) || undefined,
                        tdsFile: (0, transforms_1.trimString)(row.tds_file) || undefined,
                        productsToBeCertified: (0, transforms_1.parseJsonArray)(row.products_to_be_certified),
                        paymentStatus: Number((_c = row.payment_status) !== null && _c !== void 0 ? _c : 0),
                        createdDate: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedDate: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: paymentId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'paymentId',
                            legacyNumericId: paymentId,
                        })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 8:
                    inserted = _d.sent();
                    return [2 /*return*/, { mysqlTable: mysqlTable, mongoCollection: mongoCollection, mysqlRows: mysqlRows, inserted: inserted, skipped: 0, errors: errors, notes: notes }];
            }
        });
    });
}
function migrateOnlinePayments(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlRows, rows, docs, _i, _a, row, legacyOnlinePaymentId, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'online_payment_details';
                    mongoCollection = 'migration_online_payments';
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _c.sent();
                    if (mysqlRows === 0) {
                        return [2 /*return*/, {
                                mysqlTable: mysqlTable,
                                mongoCollection: mongoCollection,
                                mysqlRows: 0,
                                inserted: 0,
                                skipped: 0,
                                errors: 0,
                                notes: ['Table empty or not present in source'],
                            }];
                    }
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'online_payment_id')];
                case 2:
                    rows = _c.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    row = _a[_i];
                    legacyOnlinePaymentId = Number(row.online_payment_id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push(__assign(__assign({ _id: mongoId, legacyOnlinePaymentId: legacyOnlinePaymentId }, row), { pgJsonResponse: (_b = row.pg_json_response) !== null && _b !== void 0 ? _b : row.pgJsonResponse, migratedAt: new Date() }));
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyOnlinePaymentId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyOnlinePaymentId',
                            legacyNumericId: legacyOnlinePaymentId,
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 7:
                    inserted = _c.sent();
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: mysqlRows,
                            inserted: inserted,
                            skipped: 0,
                            errors: 0,
                            notes: ['Stored in migration_online_payments — embed on payment_details at cutover if needed'],
                        }];
            }
        });
    });
}
