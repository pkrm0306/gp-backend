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
exports.runGenericMigrator = runGenericMigrator;
var mongodb_1 = require("mongodb");
var snake_to_camel_1 = require("./snake-to-camel");
var transforms_1 = require("./transforms");
var mysql_source_1 = require("./mysql-source");
var mongo_target_1 = require("./mongo-target");
function resolveMongoField(definition, mysqlColumn) {
    var _a, _b, _c;
    if ((_a = definition.skipColumns) === null || _a === void 0 ? void 0 : _a.includes(mysqlColumn))
        return null;
    if ((_b = definition.columnMap) === null || _b === void 0 ? void 0 : _b[mysqlColumn]) {
        return definition.columnMap[mysqlColumn];
    }
    if ((_c = definition.preserveColumns) === null || _c === void 0 ? void 0 : _c.includes(mysqlColumn)) {
        return mysqlColumn;
    }
    if (definition.mysqlTable === 'process_comments') {
        return (0, snake_to_camel_1.mapProcessCommentsColumn)(mysqlColumn);
    }
    return (0, snake_to_camel_1.snakeToCamel)(mysqlColumn);
}
function transformValue(mysqlColumn, value, definition) {
    var _a;
    if ((_a = definition.dateColumns) === null || _a === void 0 ? void 0 : _a.includes(mysqlColumn)) {
        var required = mysqlColumn === 'created_date' || mysqlColumn === 'updated_date';
        return required ? (0, transforms_1.parseMysqlDateRequired)(value) : (0, transforms_1.parseMysqlDate)(value);
    }
    if (mysqlColumn === 'urn_no') {
        return (0, transforms_1.normalizeUrn)(value);
    }
    return value;
}
function runGenericMigrator(ctx, definition) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlPk, numericIdField, _a, foreignKeys, mysqlRows, inserted, skipped, errors, notes, _b, _c, _d, batch, docs, _i, _e, row, legacyId, mongoId, doc, _f, _g, _h, mysqlColumn, rawValue, mongoField, _j, foreignKeys_1, fk, rawFk, resolved, err_1, _k, e_1_1;
        var _l;
        var _m, e_1, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    mysqlTable = definition.mysqlTable, mongoCollection = definition.mongoCollection, mysqlPk = definition.mysqlPk, numericIdField = definition.numericIdField, _a = definition.foreignKeys, foreignKeys = _a === void 0 ? [] : _a;
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _q.sent();
                    inserted = 0;
                    skipped = 0;
                    errors = 0;
                    notes = [];
                    _q.label = 2;
                case 2:
                    _q.trys.push([2, 18, 19, 24]);
                    _b = true, _c = __asyncValues((0, mysql_source_1.streamMysqlRows)(ctx.mysql, mysqlTable, mysqlPk, ctx.config.batchSize));
                    _q.label = 3;
                case 3: return [4 /*yield*/, _c.next()];
                case 4:
                    if (!(_d = _q.sent(), _m = _d.done, !_m)) return [3 /*break*/, 17];
                    _p = _d.value;
                    _b = false;
                    batch = _p;
                    docs = [];
                    _i = 0, _e = batch;
                    _q.label = 5;
                case 5:
                    if (!(_i < _e.length)) return [3 /*break*/, 14];
                    row = _e[_i];
                    _q.label = 6;
                case 6:
                    _q.trys.push([6, 12, , 13]);
                    legacyId = Number(row[mysqlPk]);
                    if (!Number.isFinite(legacyId)) {
                        skipped++;
                        return [3 /*break*/, 13];
                    }
                    mongoId = new mongodb_1.ObjectId();
                    doc = __assign((_l = { _id: mongoId }, _l[numericIdField] = legacyId, _l), definition.staticFields);
                    for (_f = 0, _g = Object.entries(row); _f < _g.length; _f++) {
                        _h = _g[_f], mysqlColumn = _h[0], rawValue = _h[1];
                        if (mysqlColumn === mysqlPk)
                            continue;
                        mongoField = resolveMongoField(definition, mysqlColumn);
                        if (!mongoField)
                            continue;
                        doc[mongoField] = transformValue(mysqlColumn, rawValue, definition);
                    }
                    _j = 0, foreignKeys_1 = foreignKeys;
                    _q.label = 7;
                case 7:
                    if (!(_j < foreignKeys_1.length)) return [3 /*break*/, 10];
                    fk = foreignKeys_1[_j];
                    rawFk = row[fk.mysqlColumn];
                    return [4 /*yield*/, ctx.idMap.resolve(fk.refTable, Number(rawFk))];
                case 8:
                    resolved = _q.sent();
                    if (!resolved) {
                        if (fk.optional) {
                            return [3 /*break*/, 9];
                        }
                        notes.push("Missing FK ".concat(fk.mysqlColumn, "=").concat(rawFk, " for ").concat(mysqlTable, ".").concat(legacyId));
                        errors++;
                        return [3 /*break*/, 9];
                    }
                    doc[fk.mongoField] = resolved;
                    _q.label = 9;
                case 9:
                    _j++;
                    return [3 /*break*/, 7];
                case 10:
                    docs.push(doc);
                    // register() warms the in-memory cache in both modes and only persists
                    // to Mongo when not in dry-run, so downstream FK resolution works in dry runs too.
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: numericIdField,
                            legacyNumericId: legacyId,
                        })];
                case 11:
                    // register() warms the in-memory cache in both modes and only persists
                    // to Mongo when not in dry-run, so downstream FK resolution works in dry runs too.
                    _q.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _q.sent();
                    errors++;
                    notes.push("Row error in ".concat(mysqlTable, ": ").concat(err_1.message));
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 5];
                case 14:
                    _k = inserted;
                    return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 15:
                    inserted = _k + _q.sent();
                    _q.label = 16;
                case 16:
                    _b = true;
                    return [3 /*break*/, 3];
                case 17: return [3 /*break*/, 24];
                case 18:
                    e_1_1 = _q.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 24];
                case 19:
                    _q.trys.push([19, , 22, 23]);
                    if (!(!_b && !_m && (_o = _c.return))) return [3 /*break*/, 21];
                    return [4 /*yield*/, _o.call(_c)];
                case 20:
                    _q.sent();
                    _q.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 23: return [7 /*endfinally*/];
                case 24: return [2 /*return*/, {
                        mysqlTable: mysqlTable,
                        mongoCollection: mongoCollection,
                        mysqlRows: mysqlRows,
                        inserted: inserted,
                        skipped: skipped,
                        errors: errors,
                        notes: notes.length ? __spreadArray([], new Set(notes), true).slice(0, 20) : undefined,
                    }];
            }
        });
    });
}
