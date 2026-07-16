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
exports.migrateCms = migrateCms;
var mongodb_1 = require("mongodb");
var mysql_source_1 = require("../../lib/mysql-source");
var mongo_target_1 = require("../../lib/mongo-target");
var transforms_1 = require("../../lib/transforms");
function getPlatformVendorId(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, existing, _a, mongoId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.meta.get('platformVendorMongoId')];
                case 1:
                    cached = (_b.sent());
                    if (cached)
                        return [2 /*return*/, new mongodb_1.ObjectId(cached)];
                    if (!ctx.dryRun) return [3 /*break*/, 2];
                    _a = null;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, ctx.mongo.collection('manufacturers').findOne({
                        vendor_email: 'platform-cms@migration.greenpro.local',
                    })];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    existing = _a;
                    if (!(existing === null || existing === void 0 ? void 0 : existing._id)) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.meta.set('platformVendorMongoId', existing._id.toString())];
                case 5:
                    _b.sent();
                    return [2 /*return*/, existing._id];
                case 6:
                    mongoId = new mongodb_1.ObjectId();
                    if (!!ctx.dryRun) return [3 /*break*/, 8];
                    return [4 /*yield*/, ctx.mongo.collection('manufacturers').insertOne({
                            _id: mongoId,
                            legacyVendorId: 0,
                            manufacturerName: 'GreenPro Platform (CMS)',
                            vendor_name: 'GreenPro Platform',
                            vendor_email: 'platform-cms@migration.greenpro.local',
                            vendor_phone: '0000000000',
                            vendor_status: 1,
                            manufacturerStatus: 1,
                            vendorPortalEmailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [4 /*yield*/, ctx.meta.set('platformVendorMongoId', mongoId.toHexString())];
                case 9:
                    _b.sent();
                    return [2 /*return*/, mongoId];
            }
        });
    });
}
function migrateCms(ctx, targetTable) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (targetTable) {
                case 'banners':
                    return [2 /*return*/, migrateBanners(ctx)];
                case 'contacts':
                    return [2 /*return*/, migrateContacts(ctx)];
                case 'subscription_list':
                    return [2 /*return*/, migrateSubscriptions(ctx)];
                case 'notifications':
                    return [2 /*return*/, migrateNotifications(ctx)];
                default:
                    throw new Error("Unknown CMS table: ".concat(targetTable));
            }
            return [2 /*return*/];
        });
    });
}
function migrateBanners(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, platformVendorId, docs, _i, _a, row, legacyBannerId, mongoId, image, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'banners';
                    mongoCollection = 'banners';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'banner_id')];
                case 1:
                    rows = _c.sent();
                    return [4 /*yield*/, getPlatformVendorId(ctx)];
                case 2:
                    platformVendorId = _c.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    row = _a[_i];
                    legacyBannerId = Number(row.banner_id);
                    mongoId = new mongodb_1.ObjectId();
                    image = (0, transforms_1.trimString)(row.banner_image);
                    docs.push({
                        _id: mongoId,
                        legacyBannerId: legacyBannerId,
                        vendorId: platformVendorId,
                        heading: (0, transforms_1.trimString)(row.banner_heading),
                        description: (0, transforms_1.trimString)(row.banner_description),
                        banner_image: image,
                        imageUrl: image ? "/uploads/banners/".concat(image) : '',
                        imageSource: 'manual_url',
                        sequenceNumber: legacyBannerId,
                        status: Number((_b = row.banner_status) !== null && _b !== void 0 ? _b : 1),
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyBannerId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyBannerId',
                            legacyNumericId: legacyBannerId,
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, (0, mongo_target_1.insertBatches)(ctx.mongo, mongoCollection, docs, ctx.dryRun)];
                case 7:
                    inserted = _c.sent();
                    return [2 /*return*/, {
                            mysqlTable: mysqlTable,
                            mongoCollection: mongoCollection,
                            mysqlRows: rows.length,
                            inserted: inserted,
                            skipped: 0,
                            errors: 0,
                            notes: ['Legacy banners assigned platform CMS vendorId'],
                        }];
            }
        });
    });
}
function migrateContacts(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, _i, _a, row, legacyContactId, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'contacts';
                    mongoCollection = 'contactmessages';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'contact_id')];
                case 1:
                    rows = _c.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacyContactId = Number(row.contact_id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyContactId: legacyContactId,
                        inquiryType: 'contact',
                        name: (0, transforms_1.trimString)(row.contact_name),
                        email: (0, transforms_1.normalizeEmail)(row.contact_email),
                        phoneNumber: (0, transforms_1.trimString)(row.contact_phone),
                        subject: (0, transforms_1.trimString)(row.contact_subject),
                        message: (0, transforms_1.trimString)(row.contact_message),
                        legacyStatus: Number((_b = row.contact_status) !== null && _b !== void 0 ? _b : 0),
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyContactId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyContactId',
                            legacyNumericId: legacyContactId,
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
                    return [2 /*return*/, { mysqlTable: mysqlTable, mongoCollection: mongoCollection, mysqlRows: rows.length, inserted: inserted, skipped: 0, errors: 0 }];
            }
        });
    });
}
function mapSubscriptionType(type) {
    if (type === 1)
        return ['Green Products'];
    if (type === 2)
        return ['Events'];
    return ['Green Products', 'Events'];
}
function migrateSubscriptions(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, _i, _a, row, legacySubscriptionId, mongoId, inserted;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mysqlTable = 'subscription_list';
                    mongoCollection = 'newslettersubscribers';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'subscription_id')];
                case 1:
                    rows = _d.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacySubscriptionId = Number(row.subscription_id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacySubscriptionId: legacySubscriptionId,
                        email: (0, transforms_1.normalizeEmail)(row.email_id),
                        subscribedFor: mapSubscriptionType(Number((_b = row.subscription_type) !== null && _b !== void 0 ? _b : 3)),
                        status: Number((_c = row.subscription_status) !== null && _c !== void 0 ? _c : 1),
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_date),
                        updatedAt: (0, transforms_1.parseMysqlDateRequired)(row.updated_date),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacySubscriptionId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacySubscriptionId',
                            legacyNumericId: legacySubscriptionId,
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
function migrateNotifications(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var mysqlTable, mongoCollection, rows, docs, _i, _a, row, legacyNotificationId, mongoId, inserted;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysqlTable = 'notifications';
                    mongoCollection = 'notifications';
                    return [4 /*yield*/, (0, mysql_source_1.fetchAllMysqlRows)(ctx.mysql, mysqlTable, 'id')];
                case 1:
                    rows = _c.sent();
                    docs = [];
                    _i = 0, _a = rows;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    row = _a[_i];
                    legacyNotificationId = Number(row.id);
                    mongoId = new mongodb_1.ObjectId();
                    docs.push({
                        _id: mongoId,
                        legacyNotificationId: legacyNotificationId,
                        title: (0, transforms_1.trimString)(row.title),
                        content: (0, transforms_1.trimString)(row.content),
                        legacyNotifyType: (0, transforms_1.trimString)(row.notify_type) || undefined,
                        legacyUserId: row.user_id != null ? Number(row.user_id) : undefined,
                        seen: Number((_b = row.seen) !== null && _b !== void 0 ? _b : 0) === 1,
                        createdAt: (0, transforms_1.parseMysqlDateRequired)(row.created_at),
                        updatedAt: (0, transforms_1.parseMysqlDate)(row.updated_at),
                        deletedAt: (0, transforms_1.parseMysqlDate)(row.deleted_at),
                    });
                    return [4 /*yield*/, ctx.idMap.register({
                            mysqlTable: mysqlTable,
                            mysqlId: legacyNotificationId,
                            mongoCollection: mongoCollection,
                            mongoId: mongoId,
                            numericIdField: 'legacyNotificationId',
                            legacyNumericId: legacyNotificationId,
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
                    return [2 /*return*/, { mysqlTable: mysqlTable, mongoCollection: mongoCollection, mysqlRows: rows.length, inserted: inserted, skipped: 0, errors: 0 }];
            }
        });
    });
}
