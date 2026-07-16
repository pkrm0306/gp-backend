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
exports.IdMapService = void 0;
var COLLECTION = 'migration_id_map';
var FLUSH_THRESHOLD = 2000;
var IdMapService = /** @class */ (function () {
    function IdMapService(db) {
        this.db = db;
        this.cache = new Map();
        this.pending = [];
        this.dryRun = false;
    }
    IdMapService.prototype.setDryRun = function (value) {
        this.dryRun = value;
    };
    IdMapService.prototype.key = function (mysqlTable, mysqlId) {
        return "".concat(mysqlTable, ":").concat(mysqlId);
    };
    IdMapService.prototype.ensureIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var col;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        col = this.db.collection(COLLECTION);
                        return [4 /*yield*/, col.createIndex({ mysqlTable: 1, mysqlId: 1 }, { unique: true, name: 'uniq_mysql_table_id' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, col.createIndex({ mongoCollection: 1, mongoId: 1 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, col.createIndex({ legacyNumericId: 1, mongoCollection: 1 })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Registers a mapping. Updates cache immediately; DB write is buffered + bulk-flushed. */
    IdMapService.prototype.register = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cache.set(this.key(entry.mysqlTable, entry.mysqlId), entry.mongoId);
                        if (this.dryRun)
                            return [2 /*return*/];
                        doc = __assign(__assign({}, entry), { migratedAt: new Date() });
                        this.pending.push({
                            updateOne: {
                                filter: { mysqlTable: entry.mysqlTable, mysqlId: entry.mysqlId },
                                update: { $set: doc },
                                upsert: true,
                            },
                        });
                        if (!(this.pending.length >= FLUSH_THRESHOLD)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IdMapService.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ops;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.dryRun || this.pending.length === 0)
                            return [2 /*return*/];
                        ops = this.pending;
                        this.pending = [];
                        return [4 /*yield*/, this.db.collection(COLLECTION).bulkWrite(ops, { ordered: false })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IdMapService.prototype.resolve = function (mysqlTable, mysqlId) {
        return __awaiter(this, void 0, void 0, function () {
            var id, cached, row, oid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (mysqlId === null || mysqlId === undefined || mysqlId === 0) {
                            return [2 /*return*/, null];
                        }
                        id = Number(mysqlId);
                        if (!Number.isFinite(id) || id <= 0)
                            return [2 /*return*/, null];
                        cached = this.cache.get(this.key(mysqlTable, id));
                        if (cached)
                            return [2 /*return*/, cached];
                        if (this.dryRun)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.db.collection(COLLECTION).findOne({
                                mysqlTable: mysqlTable,
                                mysqlId: id,
                            })];
                    case 1:
                        row = _a.sent();
                        if (!(row === null || row === void 0 ? void 0 : row.mongoId))
                            return [2 /*return*/, null];
                        oid = row.mongoId;
                        this.cache.set(this.key(mysqlTable, id), oid);
                        return [2 /*return*/, oid];
                }
            });
        });
    };
    IdMapService.prototype.countByTable = function (mysqlTable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.collection(COLLECTION).countDocuments({ mysqlTable: mysqlTable })];
            });
        });
    };
    IdMapService.prototype.preloadTable = function (mysqlTable) {
        return __awaiter(this, void 0, void 0, function () {
            var cursor, _a, cursor_1, cursor_1_1, row, e_1_1;
            var _b, e_1, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        cursor = this.db.collection(COLLECTION).find({ mysqlTable: mysqlTable });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _a = true, cursor_1 = __asyncValues(cursor);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, cursor_1.next()];
                    case 3:
                        if (!(cursor_1_1 = _e.sent(), _b = cursor_1_1.done, !_b)) return [3 /*break*/, 5];
                        _d = cursor_1_1.value;
                        _a = false;
                        row = _d;
                        this.cache.set(this.key(mysqlTable, row.mysqlId), row.mongoId);
                        _e.label = 4;
                    case 4:
                        _a = true;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(!_a && !_b && (_c = cursor_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _c.call(cursor_1)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return IdMapService;
}());
exports.IdMapService = IdMapService;
