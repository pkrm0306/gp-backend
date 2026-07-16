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
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateManufacturersAndVendors = migrateManufacturersAndVendors;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
function migrateManufacturersAndVendors(ctx, targetTable) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (targetTable === 'manufacturers') {
                return [2 /*return*/, migrateManufacturers(ctx)];
            }
            return [2 /*return*/, mergeVendorsIntoManufacturers(ctx)];
        });
    });
}
function migrateManufacturers(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, mysqlRows, docs, _i, _a, row, legacyManufacturerId, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'manufacturers';
                    mongoCollection = 'manufacturers';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'manufacturer_id')];
                case 1:
                    rows = _c.sent();
                    mysqlRows = rows.length;
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacyManufacturerId = Number(row.manufacturer_id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyManufacturerId: legacyManufacturerId,
                        manufacturerName: (0, transforms_1.trimString)(row.manufacturer_name),
                        gpInternalId: (0, transforms_1.trimString)(row.gp_internal_id) || undefined,
                        manufacturerInitial: (0, transforms_1.trimString)(row.manufacturer_initial) || undefined,
                        manufacturerImage: (0, transforms_1.trimString)(row.manufacturer_image) || undefined,
                        manufacturerStatus: Number((_b = row.manufacturer_status) !== null && _b !== void 0 ? _b : 1),
                        vendorPortalEmailVerified: true,
                        vendor_name: '',
                        vendor_email: "legacy-mfr-".concat(legacyManufacturerId, "@migration.greenpro.local"),
                        vendor_phone: '0000000000',
                        vendor_status: 0,
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                        _migrationValidity: (0, transforms_1.trimString)(row.validity) || undefined,
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyManufacturerId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyManufacturerId',
                            legacyNumericId: legacyManufacturerId,
                        })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 6:
                    inserted = _c.sent();
                    return [2 /*return*/, { mysqlTable: mysqlTable, mongoCollection: mongoCollection, mysqlRows: mysqlRows, inserted: inserted, skipped: 0, errors: 0 }];
            }
        });
    });
}
function mergeVendorsIntoManufacturers(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, mysqlRows, merged, createdStandalone, errors, notes, updateOps, newManufacturerDocs, _i, _a, row, legacyVendorId, legacyManufacturerId, manufacturerOid, vendorEmail, vendorFields, mongoId, CHUNK, i, insertedStandalone;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mysqlTable = 'vendors';
                    mongoCollection = 'manufacturers';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'vendor_id')];
                case 1:
                    rows = _d.sent();
                    mysqlRows = rows.length;
                    merged = 0;
                    createdStandalone = 0;
                    errors = 0;
                    notes = [];
                    updateOps = [];
                    newManufacturerDocs = [];
                    _i = 0, _a = rows;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    row = _a[_i];
                    legacyVendorId = Number(row.vendor_id);
                    legacyManufacturerId = Number(row.manufacturer_id);
                    return [4 /*yield*/, ctx.idMap.resolve('manufacturers', legacyManufacturerId)];
                case 3:
                    manufacturerOid = _d.sent();
                    vendorEmail = (0, transforms_1.normalizeEmail)(row.vendor_email) ||
                        "vendor-".concat(legacyVendorId, "@migration.greenpro.local");
                    vendorFields = {
                        legacyVendorId: legacyVendorId,
                        vendor_name: (0, transforms_1.trimString)(row.vendor_name) || 'Legacy Vendor',
                        vendor_email: vendorEmail,
                        vendor_phone: (0, transforms_1.trimString)(row.vendor_phone) || '0000000000',
                        vendor_website: (0, transforms_1.trimString)(row.vendor_website) || undefined,
                        vendor_designation: (0, transforms_1.trimString)(row.vendor_designation) || undefined,
                        vendor_gst: (0, transforms_1.trimString)(row.vendor_gst) || undefined,
                        vendor_status: Number((_b = row.vendor_status) !== null && _b !== void 0 ? _b : 1),
                        vendorPortalEmailVerified: true,
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    };
                    if (!manufacturerOid) return [3 /*break*/, 5];
                    // Vendor is linked to an existing manufacturer: merge vendor fields onto it.
                    updateOps.push({
                        updateOne: { filter: { _id: manufacturerOid }, update: { $set: vendorFields } },
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyVendorId,
                            mongoCollection: mongoCollection,
                            mongoId: manufacturerOid,
                            numericIdField: 'legacyVendorId',
                            legacyNumericId: legacyVendorId,
                        })];
                case 4:
                    _d.sent();
                    merged++;
                    return [3 /*break*/, 7];
                case 5:
                    // Vendor has no (or a missing) manufacturer link. In the merged MERN model a
                    // vendor IS a manufacturer, so promote it to its own manufacturer document.
                    if (legacyManufacturerId !== 0) {
                        notes.push("Vendor ".concat(legacyVendorId, ": manufacturer ").concat(legacyManufacturerId, " missing \u2014 created standalone manufacturer"));
                    }
                    mongoId = new mongodb_1.ObjectId();
                    newManufacturerDocs.push(__assign(__assign({ _id: mongoId, legacyManufacturerId: null, manufacturerName: vendorFields.vendor_name, manufacturerStatus: vendorFields.vendor_status, _standaloneFromVendor: true }, vendorFields), { createdAt: (0, transforms_1.parseMysqlDateRequired)((_c = row.created_date) !== null && _c !== void 0 ? _c : row.updated_date) }));
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyVendorId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyVendorId',
                            legacyNumericId: legacyVendorId,
                        })];
                case 6:
                    _d.sent();
                    createdStandalone++;
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8:
                    if (!(!ctx.dryRun && updateOps.length > 0)) return [3 /*break*/, 12];
                    CHUNK = 1000;
                    i = 0;
                    _d.label = 9;
                case 9:
                    if (!(i < updateOps.length)) return [3 /*break*/, 12];
                    return [4 /*yield*/, ctx.mongo
                            .collection(mongoCollection)
                            .bulkWrite(updateOps.slice(i, i + CHUNK), { ordered: false })];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    i += CHUNK;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, newManufacturerDocs, ctx.dryRun)];
                case 13:
                    insertedStandalone = _d.sent();
                    notes.unshift("Vendors merged onto existing manufacturers: ".concat(merged, "; promoted to standalone manufacturers: ").concat(createdStandalone, " (").concat(insertedStandalone, " inserted)"));
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: mysqlRows,
                            inserted: merged + createdStandalone,
                            skipped: 0,
                            errors: errors,
                            notes: notes.slice(0, 20),
                        }];
            }
        });
    });
}
