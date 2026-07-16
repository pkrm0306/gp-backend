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
exports.migrateUsers = migrateUsers;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
function migrateUsers(ctx, targetTable) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (targetTable) {
                case 'admin':
                    return [2 /*return*/, migrateAdminUsers(ctx)];
                case 'vendor_users':
                    return [2 /*return*/, migrateVendorUsers(ctx)];
                case 'team_members':
                    return [2 /*return*/, migrateTeamMembers(ctx)];
                default:
                    throw new Error("Unknown users table: ".concat(targetTable));
            }
            return [2 /*return*/];
        });
    });
}
function migrateAdminUsers(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, _i, _a, row, legacyAdminId, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'admin';
                    mongoCollection = 'users';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'id')];
                case 1:
                    rows = _c.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacyAdminId = Number(row.id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyAdminId: legacyAdminId,
                        type: 'admin',
                        name: (0, transforms_1.trimString)(row.name),
                        email: (0, transforms_1.normalizeEmail)(row.email),
                        phone: (0, transforms_1.trimString)(row.mobile),
                        username: (0, transforms_1.trimString)(row.username),
                        password: (0, transforms_1.trimString)(row.password),
                        legacyPasswordHash: (0, transforms_1.trimString)(row.password),
                        legacyPasswordAlgo: 'md5',
                        status: Number((_b = row.status) !== null && _b !== void 0 ? _b : 1),
                        adminGstNo: (0, transforms_1.trimString)(row.admin_gst_no),
                        legacyRole: (0, transforms_1.trimString)(row.role) || undefined,
                        legacyAccess: (0, transforms_1.trimString)(row.access) || undefined,
                        image: (0, transforms_1.trimString)(row.image) || undefined,
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyAdminId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyAdminId',
                            legacyNumericId: legacyAdminId,
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
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: rows.length,
                            inserted: inserted,
                            skipped: 0,
                            errors: 0,
                            notes: ['Passwords stored as legacy MD5 — plan force-reset or verifier before live cutover'],
                        }];
            }
        });
    });
}
function migrateVendorUsers(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, errors, notes, _i, _a, row, legacyVendorUserId, legacyVendorId, manufacturerOid, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'vendor_users';
                    mongoCollection = 'users';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'vendor_user_id')];
                case 1:
                    rows = _c.sent();
                    docs = [];
                    errors = 0;
                    notes = [];
                    _i = 0, _a = rows;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    row = _a[_i];
                    legacyVendorUserId = Number(row.vendor_user_id);
                    legacyVendorId = Number(row.vendor_id);
                    return [4 /*yield*/, ctx.idMap.resolve('vendors', legacyVendorId)];
                case 3:
                    manufacturerOid = _c.sent();
                    if (!!manufacturerOid) return [3 /*break*/, 5];
                    errors++;
                    notes.push("vendor_user ".concat(legacyVendorUserId, ": missing vendor ").concat(legacyVendorId));
                    return [4 /*yield*/, (0, mongo_target_1.recordSkipped)(ctx.mongo, mysqlTable, legacyVendorUserId, "missing vendor ".concat(legacyVendorId), row, ctx.dryRun)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5:
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyVendorUserId: legacyVendorUserId,
                        type: (0, transforms_1.trimString)(row.vendor_user_type) || 'vendor',
                        manufacturerId: manufacturerOid,
                        vendorId: manufacturerOid,
                        name: (0, transforms_1.trimString)(row.vendor_user_name),
                        email: (0, transforms_1.normalizeEmail)(row.vendor_user_email),
                        phone: (0, transforms_1.trimString)(row.vendor_user_phone),
                        password: (0, transforms_1.trimString)(row.vendor_user_password),
                        legacyPasswordHash: (0, transforms_1.trimString)(row.vendor_user_password),
                        legacyPasswordAlgo: 'md5',
                        status: Number((_b = row.vendor_user_status) !== null && _b !== void 0 ? _b : 1),
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyVendorUserId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyVendorUserId',
                            legacyNumericId: legacyVendorUserId,
                        })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 9:
                    inserted = _c.sent();
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: rows.length,
                            inserted: inserted,
                            skipped: 0,
                            errors: errors,
                            notes: notes,
                        }];
            }
        });
    });
}
function migrateTeamMembers(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, _i, _a, row, legacyTeamMemberId, mongoId, inserted;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mysqlTable = 'team_members';
                    mongoCollection = 'users';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'team_member_id')];
                case 1:
                    rows = _d.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacyTeamMemberId = Number(row.team_member_id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyTeamMemberId: legacyTeamMemberId,
                        type: 'staff',
                        team: 'administrative',
                        showOnWebsite: Number((_b = row.team_member_status) !== null && _b !== void 0 ? _b : 1) === 1,
                        name: (0, transforms_1.trimString)(row.team_member_name),
                        email: (0, transforms_1.normalizeEmail)(row.team_member_email),
                        phone: (0, transforms_1.trimString)(row.team_member_phone),
                        designation: (0, transforms_1.trimString)(row.team_member_designation),
                        image: (0, transforms_1.trimString)(row.team_member_image),
                        vendor_facebook: (0, transforms_1.trimString)(row.team_member_facebook_url) || undefined,
                        vendor_twitter: (0, transforms_1.trimString)(row.team_member_twitter_url) || undefined,
                        vendor_linkedin: (0, transforms_1.trimString)(row.team_member_linkedin_url) || undefined,
                        status: Number((_c = row.team_member_status) !== null && _c !== void 0 ? _c : 1),
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyTeamMemberId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyTeamMemberId',
                            legacyNumericId: legacyTeamMemberId,
                        })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 6:
                    inserted = _d.sent();
                    return [2 /*return*/, { mysqlTable: mysqlTable, mongoCollection: mongoCollection, mysqlRows: rows.length, inserted: inserted, skipped: 0, errors: 0 }];
            }
        });
    });
}
