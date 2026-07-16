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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.migrateProductPlants = migrateProductPlants;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
var DEFAULT_CITY = 'Unknown';
function migrateProductPlants(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlRows, inserted, errors, notes, defaultCountryHex, defaultCountryId, _a, _b, _c, batch, docs, _i, _d, row, productPlantId, productOid, vendorOid, categoryOid, manufacturerOid, stateLegacyId, stateOid, mongoId, _e, e_1_1;
        var _f, e_1, _g, _h;
        var _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    mysqlTable = 'product_plants';
                    mongoCollection = 'product_plants';
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _l.sent();
                    inserted = 0;
                    errors = 0;
                    notes = [];
                    return [4 /*yield*/, ctx.meta.get('defaultCountryMongoId')];
                case 2:
                    defaultCountryHex = (_l.sent());
                    defaultCountryId = defaultCountryHex
                        ? new mongodb_1.ObjectId(defaultCountryHex)
                        : null;
                    _l.label = 3;
                case 3:
                    _l.trys.push([3, 22, 23, 28]);
                    _a = true, _b = __asyncValues((0, mysql_source_1.streamMysqlRows)(ctx.mysql, mysqlTable, 'product_plant_id', ctx.config.batchSize));
                    _l.label = 4;
                case 4: return [4 /*yield*/, _b.next()];
                case 5:
                    if (!(_c = _l.sent(), _f = _c.done, !_f)) return [3 /*break*/, 21];
                    _h = _c.value;
                    _a = false;
                    batch = _h;
                    docs = [];
                    _i = 0, _d = batch;
                    _l.label = 6;
                case 6:
                    if (!(_i < _d.length)) return [3 /*break*/, 18];
                    row = _d[_i];
                    productPlantId = Number(row.product_plant_id);
                    return [4 /*yield*/, ctx.idMap.resolve('products', Number(row.product_id))];
                case 7:
                    productOid = _l.sent();
                    return [4 /*yield*/, ctx.idMap.resolve('vendors', Number(row.vendor_id))];
                case 8:
                    vendorOid = _l.sent();
                    return [4 /*yield*/, ctx.idMap.resolve('categories', Number(row.category_id))];
                case 9:
                    categoryOid = _l.sent();
                    return [4 /*yield*/, ctx.idMap.resolve('manufacturers', Number(row.manufacturer_id))];
                case 10:
                    manufacturerOid = _l.sent();
                    stateLegacyId = Number(String((_j = row.state) !== null && _j !== void 0 ? _j : '').trim());
                    return [4 /*yield*/, ctx.idMap.resolve('states', stateLegacyId)];
                case 11:
                    stateOid = _l.sent();
                    if (!(!productOid || !vendorOid || !categoryOid || !manufacturerOid)) return [3 /*break*/, 13];
                    errors++;
                    notes.push("plant ".concat(productPlantId, ": missing product/vendor/category/mfr FK"));
                    return [4 /*yield*/, (0, mongo_target_1.recordSkipped)(ctx.mongo, mysqlTable, productPlantId, 'missing product/vendor/category/manufacturer FK', row, ctx.dryRun)];
                case 12:
                    _l.sent();
                    return [3 /*break*/, 17];
                case 13:
                    if (!!stateOid) return [3 /*break*/, 15];
                    errors++;
                    notes.push("plant ".concat(productPlantId, ": unresolved state id=").concat(row.state));
                    return [4 /*yield*/, (0, mongo_target_1.recordSkipped)(ctx.mongo, mysqlTable, productPlantId, "unresolved state '".concat(row.state, "' (null/empty/out-of-range)"), row, ctx.dryRun)];
                case 14:
                    _l.sent();
                    return [3 /*break*/, 17];
                case 15:
                    if (!defaultCountryId) {
                        errors++;
                        notes.push('defaultCountryMongoId missing — run states migration first');
                        return [3 /*break*/, 17];
                    }
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        productPlantId: productPlantId,
                        productId: productOid,
                        vendorId: vendorOid,
                        categoryId: categoryOid,
                        manufacturerId: manufacturerOid,
                        urnNo: (0, transforms_1.normalizeUrn)(row.urn_no),
                        eoiNo: (0, transforms_1.trimString)(row.eoi_no),
                        plantName: (0, transforms_1.trimString)(row.plant_name) || 'Plant',
                        plantLocation: (0, transforms_1.trimString)(row.plant_location),
                        countryId: defaultCountryId,
                        stateId: stateOid,
                        city: (0, transforms_1.trimString)(row.city) || DEFAULT_CITY,
                        plantStatus: Number((_k = row.plant_status) !== null && _k !== void 0 ? _k : 1),
                        createdDate: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        legacyStateId: stateLegacyId,
                        legacyAdditionalPlantInfo: (0, transforms_1.trimString)(row.additional_plant_info) || undefined,
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: productPlantId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'productPlantId',
                            legacyNumericId: productPlantId,
                        })];
                case 16:
                    _l.sent();
                    _l.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 6];
                case 18:
                    _e = inserted;
                    return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 19:
                    inserted = _e + _l.sent();
                    _l.label = 20;
                case 20:
                    _a = true;
                    return [3 /*break*/, 4];
                case 21: return [3 /*break*/, 28];
                case 22:
                    e_1_1 = _l.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 28];
                case 23:
                    _l.trys.push([23, , 26, 27]);
                    if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 25];
                    return [4 /*yield*/, _g.call(_b)];
                case 24:
                    _l.sent();
                    _l.label = 25;
                case 25: return [3 /*break*/, 27];
                case 26:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 27: return [7 /*endfinally*/];
                case 28: return [2 /*return*/, {
                        mysqlTable: mysqlTable,
                        mongoCollection: mongoCollection,
                        mysqlRows: mysqlRows,
                        inserted: inserted,
                        skipped: 0,
                        errors: errors,
                        notes: __spreadArray([], new Set(notes), true).slice(0, 25),
                    }];
            }
        });
    });
}
