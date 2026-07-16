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
 * Diagnose orphaned foreign keys in the MySQL source before migration.
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/mysql-migration/diagnose-orphans.ts
 */
var config_1 = require("./lib/config");
var mysql_source_1 = require("./lib/mysql-source");
function q(conn, sql) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, conn.query(sql)];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, conn, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    config = (0, config_1.loadMigrationConfig)();
                    return [4 /*yield*/, (0, mysql_source_1.connectMysql)(config)];
                case 1:
                    conn = _l.sent();
                    _l.label = 2;
                case 2:
                    _l.trys.push([2, , 8, 10]);
                    console.log('states.id range & sample:');
                    _b = (_a = console).table;
                    return [4 /*yield*/, q(conn, 'SELECT MIN(id) AS mn, MAX(id) AS mx, COUNT(*) AS c FROM states')];
                case 3:
                    _b.apply(_a, [_l.sent()]);
                    _d = (_c = console).table;
                    return [4 /*yield*/, q(conn, 'SELECT id, name FROM states ORDER BY id LIMIT 10')];
                case 4:
                    _d.apply(_c, [_l.sent()]);
                    console.log('\nDistinct plant.state values (top 20 by frequency):');
                    _f = (_e = console).table;
                    return [4 /*yield*/, q(conn, 'SELECT state, COUNT(*) AS c FROM product_plants GROUP BY state ORDER BY c DESC LIMIT 20')];
                case 5:
                    _f.apply(_e, [_l.sent()]);
                    console.log('\nplant.state values that DO match a states.id:');
                    _h = (_g = console).table;
                    return [4 /*yield*/, q(conn, 'SELECT COUNT(*) AS matching FROM product_plants pp WHERE EXISTS (SELECT 1 FROM states s WHERE s.id=pp.state)')];
                case 6:
                    _h.apply(_g, [_l.sent()]);
                    console.log('\nDoes plant.state match states by name or state_code instead of id?');
                    _k = (_j = console).table;
                    return [4 /*yield*/, q(conn, 'SELECT COUNT(*) AS match_by_name FROM product_plants pp WHERE EXISTS (SELECT 1 FROM states s WHERE s.name=pp.state)')];
                case 7:
                    _k.apply(_j, [_l.sent()]);
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, conn.end()];
                case 9:
                    _l.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
});
