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
exports.runTableMigration = runTableMigration;
var generic_migrator_1 = require("../lib/generic-migrator");
var countries_and_states_1 = require("./custom/countries-and-states");
var manufacturers_and_vendors_1 = require("./custom/manufacturers-and-vendors");
var users_1 = require("./custom/users");
var products_1 = require("./custom/products");
var product_plants_1 = require("./custom/product-plants");
var payments_1 = require("./custom/payments");
var documents_1 = require("./custom/documents");
var cms_1 = require("./custom/cms");
var archives_1 = require("./custom/archives");
var renewal_cycles_1 = require("./custom/renewal-cycles");
function runTableMigration(ctx, definition) {
    return __awaiter(this, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            handler = definition.handler;
            if (handler === 'generic') {
                return [2 /*return*/, (0, generic_migrator_1.runGenericMigrator)(ctx, definition)];
            }
            switch (handler) {
                case 'custom:countries-states':
                    return [2 /*return*/, (0, countries_and_states_1.migrateCountriesAndStates)(ctx)];
                case 'custom:manufacturers-vendors':
                    return [2 /*return*/, (0, manufacturers_and_vendors_1.migrateManufacturersAndVendors)(ctx, definition.mysqlTable)];
                case 'custom:users':
                    return [2 /*return*/, (0, users_1.migrateUsers)(ctx, definition.mysqlTable)];
                case 'custom:products':
                    return [2 /*return*/, (0, products_1.migrateProducts)(ctx)];
                case 'custom:product-plants':
                    return [2 /*return*/, (0, product_plants_1.migrateProductPlants)(ctx)];
                case 'custom:payments':
                    return [2 /*return*/, (0, payments_1.migratePayments)(ctx, definition.mysqlTable)];
                case 'custom:documents':
                    return [2 /*return*/, (0, documents_1.migrateDocuments)(ctx)];
                case 'custom:cms':
                    return [2 /*return*/, (0, cms_1.migrateCms)(ctx, definition.mysqlTable)];
                case 'custom:archives':
                    return [2 /*return*/, (0, archives_1.migrateArchives)(ctx, definition)];
                case 'custom:renewal-cycles':
                    return [2 /*return*/, (0, renewal_cycles_1.migrateRenewalCycles)(ctx)];
                default:
                    throw new Error("Unknown migration handler: ".concat(handler));
            }
            return [2 /*return*/];
        });
    });
}
