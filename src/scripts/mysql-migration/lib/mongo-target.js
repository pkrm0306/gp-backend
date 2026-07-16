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
exports.connectMigrationMongo = connectMigrationMongo;
exports.ensureMigrationMetaIndexes = ensureMigrationMetaIndexes;
exports.insertBatches = insertBatches;
exports.countMongoCollection = countMongoCollection;
exports.recordSkipped = recordSkipped;
var mongodb_1 = require("mongodb");
var META_COLLECTION = 'migration_meta';
var DbMetaStore = /** @class */ (function () {
    function DbMetaStore(db) {
        this.db = db;
        this.memory = new Map();
        this.dryRun = false;
    }
    DbMetaStore.prototype.setDryRun = function (value) {
        this.dryRun = value;
    };
    DbMetaStore.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.memory.has(key))
                            return [2 /*return*/, this.memory.get(key)];
                        return [4 /*yield*/, this.db.collection(META_COLLECTION).findOne({ key: key })];
                    case 1:
                        row = _a.sent();
                        if ((row === null || row === void 0 ? void 0 : row.value) !== undefined)
                            this.memory.set(key, row.value);
                        return [2 /*return*/, row === null || row === void 0 ? void 0 : row.value];
                }
            });
        });
    };
    DbMetaStore.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Cache in memory in all modes so dry runs resolve meta-dependent lookups.
                        this.memory.set(key, value);
                        if (this.dryRun)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.db.collection(META_COLLECTION).updateOne({ key: key }, { $set: { key: key, value: value, updatedAt: new Date() } }, { upsert: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DbMetaStore;
}());
function connectMigrationMongo(config) {
    return __awaiter(this, void 0, void 0, function () {
        var client, dbName, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mongodb_1.MongoClient(config.migrationMongoUri);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    dbName = new URL(config.migrationMongoUri).pathname.replace(/^\//, '');
                    db = client.db(dbName || 'greenpro_migration');
                    return [2 /*return*/, { client: client, db: db, meta: new DbMetaStore(db) }];
            }
        });
    });
}
function ensureMigrationMetaIndexes(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db
                        .collection(META_COLLECTION)
                        .createIndex({ key: 1 }, { unique: true, name: 'uniq_meta_key' })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function insertBatches(db, collection, docs, dryRun) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!docs.length)
                        return [2 /*return*/, 0];
                    if (dryRun)
                        return [2 /*return*/, docs.length];
                    return [4 /*yield*/, db.collection(collection).insertMany(docs, { ordered: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, docs.length];
            }
        });
    });
}
function countMongoCollection(db, collection) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.collection(collection).countDocuments()];
        });
    });
}
var SKIPPED_COLLECTION = 'migration_skipped';
/**
 * Captures a source row that could not be migrated (e.g. missing FK / draft data)
 * so nothing is silently lost. No-op in dry-run mode.
 */
function recordSkipped(db, sourceTable, legacyId, reason, row, dryRun) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (dryRun)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(SKIPPED_COLLECTION).insertOne({
                            sourceTable: sourceTable,
                            legacyId: legacyId,
                            reason: reason,
                            payload: row,
                            skippedAt: new Date(),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
