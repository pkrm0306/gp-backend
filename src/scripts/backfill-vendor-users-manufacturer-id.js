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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var app_module_1 = require("../app.module");
function toObjectIdSafe(value) {
    if (!value)
        return null;
    var asString = String(value);
    return mongoose_2.Types.ObjectId.isValid(asString) ? new mongoose_2.Types.ObjectId(asString) : null;
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var app, connection, dryRun, counters, vendorUsersCollectionName, vendorUsersCol, vendorsCol, cursor, _a, cursor_1, cursor_1_1, row, vendorId, vendor, manufacturerId, e_1_1, error_1;
        var _b, e_1, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
                        logger: ['error', 'warn', 'log'],
                    })];
                case 1:
                    app = _f.sent();
                    connection = app.get((0, mongoose_1.getConnectionToken)());
                    dryRun = String((_e = process.env.DRY_RUN) !== null && _e !== void 0 ? _e : 'true').toLowerCase() === 'true';
                    counters = {
                        scanned: 0,
                        updated: 0,
                        skipped_vendor_missing: 0,
                        skipped_manufacturer_missing: 0,
                        already_ok: 0,
                    };
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 17, 18, 20]);
                    vendorUsersCollectionName = String(process.env.VENDOR_USERS_MONGO_COLLECTION || '').trim() ||
                        'users';
                    vendorUsersCol = connection.collection(vendorUsersCollectionName);
                    vendorsCol = connection.collection('vendors');
                    cursor = vendorUsersCol.find({
                        $and: [
                            {
                                $or: [
                                    { manufacturerId: { $exists: false } },
                                    { manufacturerId: null },
                                ],
                            },
                            { vendorId: { $exists: true, $ne: null } },
                        ],
                    }, { projection: { _id: 1, vendorId: 1, manufacturerId: 1 } });
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 10, 11, 16]);
                    _a = true, cursor_1 = __asyncValues(cursor);
                    _f.label = 4;
                case 4: return [4 /*yield*/, cursor_1.next()];
                case 5:
                    if (!(cursor_1_1 = _f.sent(), _b = cursor_1_1.done, !_b)) return [3 /*break*/, 9];
                    _d = cursor_1_1.value;
                    _a = false;
                    row = _d;
                    counters.scanned += 1;
                    // Idempotency safety: if manufacturerId appears in any shape, skip.
                    if (row.manufacturerId) {
                        counters.already_ok += 1;
                        return [3 /*break*/, 8];
                    }
                    vendorId = toObjectIdSafe(row.vendorId);
                    if (!vendorId) {
                        counters.skipped_vendor_missing += 1;
                        return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, vendorsCol.findOne({ _id: vendorId }, { projection: { _id: 1, manufacturerId: 1 } })];
                case 6:
                    vendor = _f.sent();
                    if (!vendor) {
                        counters.skipped_vendor_missing += 1;
                        return [3 /*break*/, 8];
                    }
                    manufacturerId = toObjectIdSafe(vendor.manufacturerId);
                    if (!manufacturerId) {
                        counters.skipped_manufacturer_missing += 1;
                        return [3 /*break*/, 8];
                    }
                    if (dryRun) {
                        console.log("[DRY_RUN] would set ".concat(vendorUsersCollectionName, "(").concat(row._id, ") manufacturerId -> ").concat(manufacturerId.toHexString()));
                        counters.updated += 1;
                        return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, vendorUsersCol.updateOne({
                            _id: row._id,
                            $or: [
                                { manufacturerId: { $exists: false } },
                                { manufacturerId: null },
                            ],
                        }, { $set: { manufacturerId: manufacturerId } })];
                case 7:
                    _f.sent();
                    counters.updated += 1;
                    _f.label = 8;
                case 8:
                    _a = true;
                    return [3 /*break*/, 4];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _f.trys.push([11, , 14, 15]);
                    if (!(!_a && !_b && (_c = cursor_1.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _c.call(cursor_1)];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    console.log('--- Backfill Summary ---');
                    console.log(JSON.stringify(__assign({ dryRun: dryRun }, counters), null, 2));
                    console.log('Verification query:');
                    console.log("db.".concat(vendorUsersCollectionName, ".countDocuments({ $and: [ { $or: [ { manufacturerId: { $exists: false } }, { manufacturerId: null } ] }, { vendorId: { $exists: true, $ne: null } } ] })"));
                    return [3 /*break*/, 20];
                case 17:
                    error_1 = _f.sent();
                    console.error('Migration failed:', error_1);
                    process.exitCode = 1;
                    return [3 /*break*/, 20];
                case 18: return [4 /*yield*/, app.close()];
                case 19:
                    _f.sent();
                    return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    });
}
run();
