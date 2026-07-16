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
exports.migrateCountriesAndStates = migrateCountriesAndStates;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
var INDIA_COUNTRY_ID = 101;
function migrateCountriesAndStates(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlRows, countryId, existingCountry, rows, docs, errors, _i, _a, row, legacyStateId, mongoId, inserted;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mysqlTable = 'states';
                    mongoCollection = 'states';
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _d.sent();
                    countryId = new mongodb_1.ObjectId();
                    if (!!ctx.dryRun) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.mongo
                            .collection('countries')
                            .findOne({ id: INDIA_COUNTRY_ID })];
                case 2:
                    existingCountry = _d.sent();
                    if (!(existingCountry === null || existingCountry === void 0 ? void 0 : existingCountry._id)) return [3 /*break*/, 4];
                    countryId = existingCountry._id;
                    return [4 /*yield*/, ctx.mongo.collection('countries').updateOne({ _id: countryId }, {
                            $set: {
                                id: INDIA_COUNTRY_ID,
                                countryName: 'India',
                                countryCode: 'IN',
                                country_code: 'IN',
                                updatedAt: new Date(),
                            },
                        })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, ctx.mongo.collection('countries').insertOne({
                        _id: countryId,
                        id: INDIA_COUNTRY_ID,
                        countryName: 'India',
                        countryCode: 'IN',
                        country_code: 'IN',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: 
                // register()/meta.set() warm caches in both modes; DB writes only happen when not dry-run.
                return [4 /*yield*/, ctx.idMap.register({
                        mysqlTable: 'countries',
                        mysqlId: INDIA_COUNTRY_ID,
                        mongoCollection: 'countries',
                        mongoId: countryId,
                        numericIdField: 'id',
                        legacyNumericId: INDIA_COUNTRY_ID,
                    })];
                case 7:
                    // register()/meta.set() warm caches in both modes; DB writes only happen when not dry-run.
                    _d.sent();
                    return [4 /*yield*/, ctx.meta.set('defaultCountryMongoId', countryId.toHexString())];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'id')];
                case 9:
                    rows = _d.sent();
                    docs = [];
                    errors = 0;
                    _i = 0, _a = rows;
                    _d.label = 10;
                case 10:
                    if (!(_i < _a.length)) return [3 /*break*/, 13];
                    row = _a[_i];
                    legacyStateId = Number(row.id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyStateId: legacyStateId,
                        countryId: countryId,
                        country_id: Number((_b = row.country_id) !== null && _b !== void 0 ? _b : INDIA_COUNTRY_ID),
                        stateName: (0, transforms_1.trimString)(row.name),
                        stateCode: row.state_code != null ? String(row.state_code) : undefined,
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_at),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)((_c = row.updated_at) !== null && _c !== void 0 ? _c : row.created_at),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyStateId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyStateId',
                            legacyNumericId: legacyStateId,
                        })];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 14:
                    inserted = _d.sent();
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: mysqlRows,
                            inserted: inserted,
                            skipped: 0,
                            errors: errors,
                            notes: ['Seeded countries.id=101 (India) from states.country_id'],
                        }];
            }
        });
    });
}
