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
exports.runMigrationPhase = runMigrationPhase;
exports.runMigrationTable = runMigrationTable;
exports.listMigrationTables = listMigrationTables;
var table_registry_1 = require("./table-registry");
var migrators_1 = require("../migrators");
function runMigrationPhase(ctx, phase) {
    return __awaiter(this, void 0, void 0, function () {
        var tables, results, _i, tables_1, definition, result, _a, _b, note;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tables = (0, table_registry_1.getTablesByPhase)(phase);
                    results = [];
                    _i = 0, tables_1 = tables;
                    _d.label = 1;
                case 1:
                    if (!(_i < tables_1.length)) return [3 /*break*/, 4];
                    definition = tables_1[_i];
                    console.log("\n\u25B6 Phase ".concat(phase, " \u2014 ").concat(definition.mysqlTable, " \u2192 ").concat(definition.mongoCollection, " (").concat(definition.handler, ")"));
                    return [4 /*yield*/, (0, migrators_1.runTableMigration)(ctx, definition)];
                case 2:
                    result = _d.sent();
                    results.push(result);
                    console.log("  MySQL rows: ".concat(result.mysqlRows, " | inserted: ").concat(result.inserted, " | errors: ").concat(result.errors));
                    if ((_c = result.notes) === null || _c === void 0 ? void 0 : _c.length) {
                        for (_a = 0, _b = result.notes.slice(0, 5); _a < _b.length; _a++) {
                            note = _b[_a];
                            console.log("  note: ".concat(note));
                        }
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results];
            }
        });
    });
}
function runMigrationTable(ctx, mysqlTable) {
    return __awaiter(this, void 0, void 0, function () {
        var definition;
        return __generator(this, function (_a) {
            definition = (0, table_registry_1.getTableDefinition)(mysqlTable);
            if (!definition) {
                throw new Error("Unknown table: ".concat(mysqlTable));
            }
            return [2 /*return*/, (0, migrators_1.runTableMigration)(ctx, definition)];
        });
    });
}
function listMigrationTables() {
    return (0, table_registry_1.getTablesByPhase)();
}
