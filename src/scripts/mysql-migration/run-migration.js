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
 * GreenPro MySQL → MongoDB migration orchestrator.
 *
 * IMPORTANT: Targets MIGRATION_MONGO_URI only (separate DB). Does not touch live app DB.
 *
 * Usage:
 *   npm run migrate:mysql:list
 *   npm run migrate:mysql:analyze
 *   npm run migrate:mysql -- --phase 1
 *   npm run migrate:mysql -- --table products
 *   npm run migrate:mysql -- --all
 *   npm run migrate:mysql:validate
 */
var config_1 = require("./lib/config");
var migration_guard_1 = require("./lib/migration-guard");
var mysql_source_1 = require("./lib/mysql-source");
var mongo_target_1 = require("./lib/mongo-target");
var id_map_1 = require("./lib/id-map");
var migration_runner_1 = require("./lib/migration-runner");
var table_registry_1 = require("./lib/table-registry");
function parseArgs(argv) {
    var phaseEq = argv.find(function (a) { return a.startsWith('--phase='); });
    var phaseIdx = argv.indexOf('--phase');
    var phaseFromSpace = phaseIdx >= 0 && argv[phaseIdx + 1] ? Number(argv[phaseIdx + 1]) : undefined;
    var tableEq = argv.find(function (a) { return a.startsWith('--table='); });
    var tableIdx = argv.indexOf('--table');
    var tableFromSpace = tableIdx >= 0 && argv[tableIdx + 1] ? argv[tableIdx + 1] : undefined;
    var all = argv.includes('--all');
    var list = argv.includes('--list');
    var dryRun = argv.includes('--dry-run');
    var fresh = argv.includes('--fresh');
    return {
        phase: phaseEq ? Number(phaseEq.split('=')[1]) : phaseFromSpace,
        table: tableEq ? tableEq.split('=')[1] : tableFromSpace,
        all: all,
        list: list,
        dryRun: dryRun,
        fresh: fresh,
    };
}
function resetMigrationDatabase(db) {
    return __awaiter(this, void 0, void 0, function () {
        var collections, _i, collections_1, c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.listCollections().toArray()];
                case 1:
                    collections = _a.sent();
                    _i = 0, collections_1 = collections;
                    _a.label = 2;
                case 2:
                    if (!(_i < collections_1.length)) return [3 /*break*/, 5];
                    c = collections_1[_i];
                    return [4 /*yield*/, db.collection(c.name).drop().catch(function () { return undefined; })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("Reset: dropped ".concat(collections.length, " collections from migration DB"));
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, config, _loop_1, _i, MIGRATION_PHASES_1, p, mysql, _a, client, db, meta, idMap, ctx, _b, MIGRATION_PHASES_2, p;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    args = parseArgs(process.argv.slice(2));
                    config = (0, config_1.loadMigrationConfig)();
                    if (args.dryRun)
                        config.dryRun = true;
                    if (args.list) {
                        console.log('Migration tables (phase order):\n');
                        _loop_1 = function (p) {
                            console.log("Phase ".concat(p.phase, ": ").concat(p.label));
                            for (var _e = 0, _f = (0, migration_runner_1.listMigrationTables)().filter(function (x) { return x.phase === p.phase; }); _e < _f.length; _e++) {
                                var t = _f[_e];
                                console.log("  - ".concat(t.mysqlTable, " \u2192 ").concat(t.mongoCollection, " [").concat(t.handler, "] pk=").concat(t.mysqlPk, " numeric=").concat(t.numericIdField));
                            }
                        };
                        for (_i = 0, MIGRATION_PHASES_1 = table_registry_1.MIGRATION_PHASES; _i < MIGRATION_PHASES_1.length; _i++) {
                            p = MIGRATION_PHASES_1[_i];
                            _loop_1(p);
                        }
                        return [2 /*return*/];
                    }
                    (0, migration_guard_1.assertMigrationTargetSafe)(config);
                    console.log("Migration target: ".concat(config.migrationMongoUri.replace(/\/\/.*@/, '//***@')));
                    console.log("MySQL source: ".concat(config.mysqlHost, ":").concat(config.mysqlPort, "/").concat(config.mysqlDatabase));
                    if (config.dryRun)
                        console.log('DRY RUN — no Mongo writes');
                    return [4 /*yield*/, (0, mysql_source_1.connectMysql)(config)];
                case 1:
                    mysql = _d.sent();
                    return [4 /*yield*/, (0, mongo_target_1.connectMigrationMongo)(config)];
                case 2:
                    _a = _d.sent(), client = _a.client, db = _a.db, meta = _a.meta;
                    idMap = new id_map_1.IdMapService(db);
                    idMap.setDryRun(config.dryRun);
                    (_c = meta.setDryRun) === null || _c === void 0 ? void 0 : _c.call(meta, config.dryRun);
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, , 23, 27]);
                    if (!(args.fresh && !config.dryRun)) return [3 /*break*/, 5];
                    return [4 /*yield*/, resetMigrationDatabase(db)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    if (!!config.dryRun) return [3 /*break*/, 8];
                    return [4 /*yield*/, idMap.ensureIndexes()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, (0, mongo_target_1.ensureMigrationMetaIndexes)(db)];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    ctx = {
                        mysql: mysql,
                        mongo: db,
                        idMap: idMap,
                        config: config,
                        dryRun: config.dryRun,
                        meta: meta,
                    };
                    if (!args.table) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, migration_runner_1.runMigrationTable)(ctx, args.table)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, idMap.flush()];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 21];
                case 11:
                    if (!args.all) return [3 /*break*/, 17];
                    _b = 0, MIGRATION_PHASES_2 = table_registry_1.MIGRATION_PHASES;
                    _d.label = 12;
                case 12:
                    if (!(_b < MIGRATION_PHASES_2.length)) return [3 /*break*/, 16];
                    p = MIGRATION_PHASES_2[_b];
                    return [4 /*yield*/, (0, migration_runner_1.runMigrationPhase)(ctx, p.phase)];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, idMap.flush()];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    _b++;
                    return [3 /*break*/, 12];
                case 16: return [3 /*break*/, 21];
                case 17:
                    if (!(args.phase !== undefined)) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, migration_runner_1.runMigrationPhase)(ctx, args.phase)];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, idMap.flush()];
                case 19:
                    _d.sent();
                    return [3 /*break*/, 21];
                case 20:
                    console.log('\nProvide --list, --phase=N, --table=name, or --all');
                    console.log('Example: npm run migrate:mysql -- --phase 1');
                    process.exitCode = 1;
                    _d.label = 21;
                case 21: return [4 /*yield*/, idMap.flush()];
                case 22:
                    _d.sent();
                    console.log('\nMigration run finished.');
                    return [3 /*break*/, 27];
                case 23: return [4 /*yield*/, idMap.flush().catch(function () { return undefined; })];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, mysql.end()];
                case 25:
                    _d.sent();
                    return [4 /*yield*/, client.close()];
                case 26:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error('Migration failed:', err);
    process.exit(1);
});
