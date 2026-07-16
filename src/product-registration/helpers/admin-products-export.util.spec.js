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
var ExcelJS = require("exceljs");
var admin_products_export_util_1 = require("./admin-products-export.util");
describe('admin-products-export.util', function () {
    it('builds CSV with headers only when no rows match filters', function () {
        var csv = (0, admin_products_export_util_1.buildAdminProductsExportCsv)([]);
        var lines = csv.trim().split(/\r?\n/);
        expect(lines).toHaveLength(1);
        expect(lines[0]).toBe(admin_products_export_util_1.ADMIN_PRODUCTS_EXPORT_EOI_HEADERS.join(','));
    });
    it('builds XLSX with visible header row when no rows match filters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var buffer, workbook, ws;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, admin_products_export_util_1.buildAdminProductsExportXlsxBuffer)([])];
                case 1:
                    buffer = _a.sent();
                    expect(buffer.length).toBeGreaterThan(0);
                    workbook = new ExcelJS.Workbook();
                    return [4 /*yield*/, workbook.xlsx.load(buffer)];
                case 2:
                    _a.sent();
                    ws = workbook.getWorksheet('Products Export');
                    expect(ws).toBeTruthy();
                    expect(ws === null || ws === void 0 ? void 0 : ws.rowCount).toBeGreaterThanOrEqual(1);
                    expect(String(ws === null || ws === void 0 ? void 0 : ws.getRow(1).getCell(1).value)).toBe('Manufacturer Name');
                    expect(String(ws === null || ws === void 0 ? void 0 : ws.getRow(1).getCell(2).value)).toBe('Email');
                    expect(ws === null || ws === void 0 ? void 0 : ws.actualRowCount).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
