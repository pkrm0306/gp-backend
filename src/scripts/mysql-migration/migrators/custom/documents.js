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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateDocuments = migrateDocuments;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
function migrateDocuments(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, mysqlRows, inserted, errors, notes, _a, _b, _c, batch, docs, _i, _d, row, productDocumentId, vendorOid, mongoId, _e, e_1_1;
        var _f, e_1, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    mysqlTable = 'all_product_documents';
                    mongoCollection = 'all_product_documents';
                    return [4 /*yield*/, (0, mysql_source_1.countMysqlRows)(ctx.mysql, mysqlTable)];
                case 1:
                    mysqlRows = _k.sent();
                    inserted = 0;
                    errors = 0;
                    notes = [];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 15, 16, 21]);
                    _a = true, _b = __asyncValues((0, mysql_source_1.streamMysqlRows)(ctx.mysql, mysqlTable, 'product_document_id', ctx.config.batchSize));
                    _k.label = 3;
                case 3: return [4 /*yield*/, _b.next()];
                case 4:
                    if (!(_c = _k.sent(), _f = _c.done, !_f)) return [3 /*break*/, 14];
                    _h = _c.value;
                    _a = false;
                    batch = _h;
                    docs = [];
                    _i = 0, _d = batch;
                    _k.label = 5;
                case 5:
                    if (!(_i < _d.length)) return [3 /*break*/, 11];
                    row = _d[_i];
                    productDocumentId = Number(row.product_document_id);
                    return [4 /*yield*/, ctx.idMap.resolve('vendors', Number(row.vendor_id))];
                case 6:
                    vendorOid = _k.sent();
                    if (!!vendorOid) return [3 /*break*/, 8];
                    errors++;
                    return [4 /*yield*/, (0, mongo_target_1.recordSkipped)(ctx.mongo, mysqlTable, productDocumentId, "missing vendor ".concat(row.vendor_id), row, ctx.dryRun)];
                case 7:
                    _k.sent();
                    return [3 /*break*/, 10];
                case 8:
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        productDocumentId: productDocumentId,
                        vendorId: vendorOid,
                        urnNo: (0, transforms_1.normalizeUrn)(row.urn_no),
                        eoiNo: (0, transforms_1.trimString)(row.eoi_no) || undefined,
                        documentForm: (0, transforms_1.trimString)(row.document_form),
                        documentFormSubsection: (0, transforms_1.trimString)(row.document_form_subsection) || undefined,
                        formPrimaryId: Number((_j = row.form_primary_id) !== null && _j !== void 0 ? _j : 0),
                        documentName: (0, transforms_1.trimString)(row.document_name),
                        documentOriginalName: (0, transforms_1.trimString)(row.document_original_name),
                        documentLink: (0, transforms_1.trimString)(row.document_link),
                        legacyDocumentLink: (0, transforms_1.trimString)(row.document_link),
                        createdDate: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedDate: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: productDocumentId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'productDocumentId',
                            legacyNumericId: productDocumentId,
                        })];
                case 9:
                    _k.sent();
                    _k.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11:
                    _e = inserted;
                    return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 12:
                    inserted = _e + _k.sent();
                    _k.label = 13;
                case 13:
                    _a = true;
                    return [3 /*break*/, 3];
                case 14: return [3 /*break*/, 21];
                case 15:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 21];
                case 16:
                    _k.trys.push([16, , 19, 20]);
                    if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 18];
                    return [4 /*yield*/, _g.call(_b)];
                case 17:
                    _k.sent();
                    _k.label = 18;
                case 18: return [3 /*break*/, 20];
                case 19:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 20: return [7 /*endfinally*/];
                case 21: return [2 /*return*/, {
                        mysqlTable: mysqlTable,
                        mongoCollection: mongoCollection,
                        mysqlRows: mysqlRows,
                        inserted: inserted,
                        skipped: 0,
                        errors: errors,
                        notes: errors ? ["".concat(errors, " rows skipped due to missing vendor FK")] : undefined,
                    }];
            }
        });
    });
}
