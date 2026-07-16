"use strict";
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
exports.migrateRenewalCycles = migrateRenewalCycles;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
/**
 * Synthesizes renewal_cycles from products with renew activity + renew payments.
 * MySQL has no renewal_cycles table.
 */
function migrateRenewalCycles(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mongoCollection, products, payments, renewPaymentsByUrn, _i, _a, p, urn, list, docs, syntheticId, _b, _c, row, urn, renewStatus, renewPayments, vendorOid, cycles, cycleNo, legacyRenewalCycleId, mongoId, payment, inserted;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    mongoCollection = 'renewal_cycles';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, 'products', 'product_id')];
                case 1:
                    products = _g.sent();
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, 'payment_details', 'payment_id')];
                case 2:
                    payments = _g.sent();
                    renewPaymentsByUrn = new Map();
                    for (_i = 0, _a = payments; _i < _a.length; _i++) {
                        p = _a[_i];
                        if ((0, transforms_1.trimString)(p.payment_type) !== 'renew')
                            continue;
                        urn = (0, transforms_1.normalizeUrn)(p.urn_no);
                        if (!urn)
                            continue;
                        list = (_d = renewPaymentsByUrn.get(urn)) !== null && _d !== void 0 ? _d : [];
                        list.push(p);
                        renewPaymentsByUrn.set(urn, list);
                    }
                    docs = [];
                    syntheticId = 1;
                    _b = 0, _c = products;
                    _g.label = 3;
                case 3:
                    if (!(_b < _c.length)) return [3 /*break*/, 9];
                    row = _c[_b];
                    urn = (0, transforms_1.normalizeUrn)(row.urn_no);
                    if (!urn)
                        return [3 /*break*/, 8];
                    renewStatus = Number((_e = row.product_renew_status) !== null && _e !== void 0 ? _e : 0);
                    renewPayments = (_f = renewPaymentsByUrn.get(urn)) !== null && _f !== void 0 ? _f : [];
                    if (renewStatus === 0 && renewPayments.length === 0)
                        return [3 /*break*/, 8];
                    return [4 /*yield*/, ctx.idMap.resolve('vendors', Number(row.vendor_id))];
                case 4:
                    vendorOid = _g.sent();
                    cycles = Math.max(1, renewPayments.length || (renewStatus > 0 ? 1 : 0));
                    cycleNo = 1;
                    _g.label = 5;
                case 5:
                    if (!(cycleNo <= cycles)) return [3 /*break*/, 8];
                    legacyRenewalCycleId = syntheticId++;
                    mongoId = new mongodb_1.ObjectId();
                    payment = renewPayments[cycleNo - 1];
                    docs.push({
                        _id: mongoId,
                        legacyRenewalCycleId: legacyRenewalCycleId,
                        urnNo: urn,
                        vendorId: vendorOid !== null && vendorOid !== void 0 ? vendorOid : undefined,
                        cycleNo: cycleNo,
                        status: renewStatus >= 2 ? 'completed' : 'in_progress',
                        legacyProductId: Number(row.product_id),
                        legacyPaymentId: payment ? Number(payment.payment_id) : undefined,
                        synthesized: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: 'renewal_cycles',
                            mysqlId: legacyRenewalCycleId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyRenewalCycleId',
                            legacyNumericId: legacyRenewalCycleId,
                        })];
                case 6:
                    _g.sent();
                    _g.label = 7;
                case 7:
                    cycleNo++;
                    return [3 /*break*/, 5];
                case 8:
                    _b++;
                    return [3 /*break*/, 3];
                case 9: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 10:
                    inserted = _g.sent();
                    return [2 /*return*/, {
                            mysqlTable: 'renewal_cycles',
                            mongoCollection: mongoCollection,
                            mysqlRows: docs.length,
                            inserted: inserted,
                            skipped: 0,
                            errors: 0,
                            notes: ['Synthetic cycles from product_renew_status + renew payments'],
                        }];
            }
        });
    });
}
