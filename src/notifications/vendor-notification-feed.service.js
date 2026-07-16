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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorNotificationFeedService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var admin_notification_util_1 = require("../admin/helpers/admin-notification.util");
var VendorNotificationFeedService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VendorNotificationFeedService = _classThis = /** @class */ (function () {
        function VendorNotificationFeedService_1(userNotificationModel) {
            this.userNotificationModel = userNotificationModel;
        }
        VendorNotificationFeedService_1.prototype.listForUser = function (userId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var userObjectId, page, limit, safePage, safeLimit, skip, rangeWhere, baseWhere, listWhere, unreadWhere, _a, totalCount, unreadCount, rows;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(String(userId !== null && userId !== void 0 ? userId : '').trim())) {
                                throw new common_1.BadRequestException('Invalid user id');
                            }
                            userObjectId = new mongoose_1.Types.ObjectId(String(userId).trim());
                            page = Number((_b = query === null || query === void 0 ? void 0 : query.page) !== null && _b !== void 0 ? _b : 1);
                            limit = Number((_c = query === null || query === void 0 ? void 0 : query.limit) !== null && _c !== void 0 ? _c : 20);
                            safePage = Number.isFinite(page) && page > 0 ? page : 1;
                            safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
                            skip = (safePage - 1) * safeLimit;
                            rangeWhere = this.mapCreatedAtRange((0, admin_notification_util_1.buildAdminNotificationRangeWhere)(query));
                            baseWhere = __assign({ user_id: userObjectId, deleted_at: null }, rangeWhere);
                            listWhere = __assign({}, baseWhere);
                            if (query.seen === true) {
                                Object.assign(listWhere, this.mapSeenFilter((0, admin_notification_util_1.readSeenFilter)()));
                            }
                            else if (query.seen === false) {
                                Object.assign(listWhere, this.mapSeenFilter((0, admin_notification_util_1.unreadSeenFilter)()));
                            }
                            unreadWhere = __assign(__assign({}, baseWhere), this.mapSeenFilter((0, admin_notification_util_1.unreadSeenFilter)()));
                            return [4 /*yield*/, Promise.all([
                                    this.userNotificationModel.countDocuments(listWhere).exec(),
                                    this.userNotificationModel.countDocuments(unreadWhere).exec(),
                                    this.userNotificationModel
                                        .find(listWhere)
                                        .sort({ created_at: -1, _id: -1 })
                                        .skip(skip)
                                        .limit(safeLimit)
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _d.sent(), totalCount = _a[0], unreadCount = _a[1], rows = _a[2];
                            return [2 /*return*/, {
                                    data: (rows !== null && rows !== void 0 ? rows : []).map(function (n) { return _this.mapRow(n); }),
                                    totalCount: totalCount,
                                    unreadCount: unreadCount,
                                    currentPage: safePage,
                                    totalPages: Math.max(1, Math.ceil(totalCount / safeLimit) || 1),
                                }];
                    }
                });
            });
        };
        VendorNotificationFeedService_1.prototype.markSeen = function (userId, notificationId) {
            return __awaiter(this, void 0, void 0, function () {
                var updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(String(userId !== null && userId !== void 0 ? userId : '').trim())) {
                                throw new common_1.BadRequestException('Invalid user id');
                            }
                            if (!mongoose_1.Types.ObjectId.isValid(String(notificationId !== null && notificationId !== void 0 ? notificationId : '').trim())) {
                                throw new common_1.BadRequestException('Invalid notification id');
                            }
                            return [4 /*yield*/, this.userNotificationModel
                                    .findOneAndUpdate({
                                    _id: new mongoose_1.Types.ObjectId(notificationId.trim()),
                                    user_id: new mongoose_1.Types.ObjectId(userId.trim()),
                                    deleted_at: null,
                                }, { $set: { seen: 1 } }, { new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Notification not found');
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    id: String(updated._id),
                                    seen: 1,
                                }];
                    }
                });
            });
        };
        VendorNotificationFeedService_1.prototype.markAllSeen = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(String(userId !== null && userId !== void 0 ? userId : '').trim())) {
                                throw new common_1.BadRequestException('Invalid user id');
                            }
                            return [4 /*yield*/, this.userNotificationModel
                                    .updateMany(__assign({ user_id: new mongoose_1.Types.ObjectId(userId.trim()), deleted_at: null }, this.mapSeenFilter((0, admin_notification_util_1.unreadSeenFilter)())), { $set: { seen: 1 } })
                                    .exec()];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    markedCount: (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0,
                                }];
                    }
                });
            });
        };
        /** Admin utils use `createdAt`; vendor feed uses `created_at`. */
        VendorNotificationFeedService_1.prototype.mapCreatedAtRange = function (where) {
            if (!where.createdAt) {
                return {};
            }
            return { created_at: where.createdAt };
        };
        VendorNotificationFeedService_1.prototype.mapSeenFilter = function (filter) {
            return filter;
        };
        VendorNotificationFeedService_1.prototype.mapRow = function (n) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return {
                _id: String(n._id),
                id: String(n._id),
                numericId: (_a = n.id) !== null && _a !== void 0 ? _a : null,
                title: String((_b = n.title) !== null && _b !== void 0 ? _b : ''),
                message: String((_c = n.content) !== null && _c !== void 0 ? _c : ''),
                content: String((_d = n.content) !== null && _d !== void 0 ? _d : ''),
                type: String((_e = n.type) !== null && _e !== void 0 ? _e : 'info'),
                notifyType: String((_f = n.notify_type) !== null && _f !== void 0 ? _f : ''),
                source: 'system',
                name: 'System',
                role: 'Vendor',
                seen: (0, admin_notification_util_1.normalizeSeenToNumber)(n.seen),
                seenAt: (0, admin_notification_util_1.isNotificationSeen)(n.seen) ? ((_h = (_g = n.updated_at) !== null && _g !== void 0 ? _g : n.created_at) !== null && _h !== void 0 ? _h : null) : null,
                createdAt: (_j = n.created_at) !== null && _j !== void 0 ? _j : null,
            };
        };
        return VendorNotificationFeedService_1;
    }());
    __setFunctionName(_classThis, "VendorNotificationFeedService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorNotificationFeedService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorNotificationFeedService = _classThis;
}();
exports.VendorNotificationFeedService = VendorNotificationFeedService;
