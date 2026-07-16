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
/**
 * Compare MySQL row counts vs migration MongoDB collection counts.
 */
var config_1 = require("./lib/config");
var migration_guard_1 = require("./lib/migration-guard");
var mysql_source_1 = require("./lib/mysql-source");
var mongo_target_1 = require("./lib/mongo-target");
var table_registry_1 = require("./lib/table-registry");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, mysql, _a, client, db, seenCollections, mismatches, _i, TABLE_REGISTRY_1, def, mysqlCount, _b, mongoKey, mongoCount, _c, match, idMapCount;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = (0, config_1.loadMigrationConfig)();
                    (0, migration_guard_1.assertMigrationTargetSafe)(config);
                    return [4 /*yield*/, (0, mysql_source_1.connectMysql)(config)];
                case 1:
                    mysql = _d.sent();
                    return [4 /*yield*/, (0, mongo_target_1.connectMigrationMongo)(config)];
                case 2:
                    _a = _d.sent(), client = _a.client, db = _a.db;
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, , 20, 23]);
                    console.log('Table validation (MySQL vs migration Mongo):\n');
                    console.log("".concat('MySQL Table'.padEnd(40), " ").concat('Mongo Collection'.padEnd(35), " MySQL  Mongo  Match"));
                    console.log('-'.repeat(100));
                    seenCollections = new Set();
                    mismatches = 0;
                    _i = 0, TABLE_REGISTRY_1 = table_registry_1.TABLE_REGISTRY;
                    _d.label = 4;
                case 4:
                    if (!(_i < TABLE_REGISTRY_1.length)) return [3 /*break*/, 18];
                    def = TABLE_REGISTRY_1[_i];
                    if (def.mysqlTable === 'renewal_cycles')
                        return [3 /*break*/, 17];
                    if (def.handler === 'custom:manufacturers-vendors' && def.mysqlTable === 'vendors') {
                        return [3 /*break*/, 17];
                    }
                    mysqlCount = 0;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(mysql, def.mysqlTable)];
                case 6:
                    mysqlCount = _d.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = _d.sent();
                    mysqlCount = -1;
                    return [3 /*break*/, 8];
                case 8:
                    mongoKey = "".concat(def.mongoCollection, ":").concat(def.handler);
                    mongoCount = -1;
                    if (!(!seenCollections.has(mongoKey) || def.handler !== 'custom:manufacturers-vendors')) return [3 /*break*/, 16];
                    _d.label = 9;
                case 9:
                    _d.trys.push([9, 14, , 15]);
                    if (!(def.mysqlTable === 'vendors')) return [3 /*break*/, 11];
                    return [4 /*yield*/, db.collection('manufacturers').countDocuments({
                            legacyVendorId: { $exists: true },
                        })];
                case 10:
                    mongoCount = _d.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, (0, mongo_target_1.countMongoCollection)(db, def.mongoCollection)];
                case 12:
                    mongoCount = _d.sent();
                    _d.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    _c = _d.sent();
                    mongoCount = -1;
                    return [3 /*break*/, 15];
                case 15:
                    seenCollections.add(mongoKey);
                    _d.label = 16;
                case 16:
                    match = mysqlCount >= 0 && mongoCount >= 0 && mysqlCount === mongoCount ? 'OK' : 'DIFF';
                    if (match === 'DIFF' && mysqlCount > 0)
                        mismatches++;
                    console.log("".concat(def.mysqlTable.padEnd(40), " ").concat(def.mongoCollection.padEnd(35), " ").concat(String(mysqlCount).padStart(5), "  ").concat(String(mongoCount).padStart(5), "  ").concat(match));
                    _d.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 4];
                case 18: return [4 /*yield*/, db.collection('migration_id_map').countDocuments()];
                case 19:
                    idMapCount = _d.sent();
                    console.log('-'.repeat(100));
                    console.log("migration_id_map entries: ".concat(idMapCount));
                    console.log("Collections with count mismatch (non-empty source): ".concat(mismatches));
                    return [3 /*break*/, 23];
                case 20: return [4 /*yield*/, mysql.end()];
                case 21:
                    _d.sent();
                    return [4 /*yield*/, client.close()];
                case 22:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
