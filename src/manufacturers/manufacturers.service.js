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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturersService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var website_public_product_filter_1 = require("../product-registration/constants/website-public-product.filter");
var list_manufacturers_query_util_1 = require("./utils/list-manufacturers-query.util");
var public_website_manufacturer_visibility_filter_1 = require("./constants/public-website-manufacturer-visibility.filter");
var upload_file_util_1 = require("../utils/upload-file.util");
var vendor_profile_document_validation_1 = require("../common/upload/vendor-profile-document.validation");
var global_phone_uniqueness_service_1 = require("../common/services/global-phone-uniqueness.service");
var phone_lookup_util_1 = require("../common/utils/phone-lookup.util");
var manufacturer_identifier_util_1 = require("./manufacturer-identifier.util");
var exceljs_1 = require("exceljs");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/** Case-insensitive exact match allowing flexible whitespace between tokens. */
function companyNameExactRegex(normalizedName) {
    var parts = (0, manufacturer_identifier_util_1.normalizeManufacturerName)(normalizedName)
        .split(/\s+/)
        .filter(Boolean)
        .map(escapeRegex);
    if (parts.length === 0) {
        return /^$/;
    }
    return new RegExp("^".concat(parts.join('\\s+'), "$"), 'i');
}
function csvEscape(value) {
    if (value === null || value === undefined)
        return '';
    var s = String(value);
    if (/[",\n\r]/.test(s)) {
        return "\"".concat(s.replace(/"/g, '""'), "\"");
    }
    return s;
}
/** List / CSV: 0 inactive/pending, 1 verified, 2 unverified */
function manufacturerStatusLabel(status) {
    switch (status) {
        case 0:
            return 'Inactive / pending';
        case 1:
            return 'Verified';
        case 2:
            return 'Unverified';
        default:
            return "Unknown (".concat(status, ")");
    }
}
/** List / CSV: 0 unverified, 1 active, 2 inactive */
function vendorStatusLabel(status) {
    switch (status) {
        case 0:
            return 'Unverified';
        case 1:
            return 'Active';
        case 2:
            return 'Inactive';
        default:
            return "Unknown (".concat(status, ")");
    }
}
var ManufacturersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ManufacturersService = _classThis = /** @class */ (function () {
        function ManufacturersService_1(manufacturerModel, productModel, vendorUserModel, connection, vendorUsersService, manufacturerIdGeneration, emailService, authService, globalPhoneUniqueness, zohoDealsService, lifecycleNotification) {
            this.manufacturerModel = manufacturerModel;
            this.productModel = productModel;
            this.vendorUserModel = vendorUserModel;
            this.connection = connection;
            this.vendorUsersService = vendorUsersService;
            this.manufacturerIdGeneration = manufacturerIdGeneration;
            this.emailService = emailService;
            this.authService = authService;
            this.globalPhoneUniqueness = globalPhoneUniqueness;
            this.zohoDealsService = zohoDealsService;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(ManufacturersService.name);
        }
        ManufacturersService_1.prototype.normalizeVendorEmail = function (raw) {
            return String(raw !== null && raw !== void 0 ? raw : '').trim().toLowerCase();
        };
        ManufacturersService_1.prototype.normalizeProfilePhone = function (raw) {
            return String(raw !== null && raw !== void 0 ? raw : '').trim();
        };
        /** True when the client sent a contact value that differs from any known current value. */
        ManufacturersService_1.prototype.isVendorEmailChanging = function (incoming) {
            var _this = this;
            var currentValues = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                currentValues[_i - 1] = arguments[_i];
            }
            if (incoming === undefined) {
                return false;
            }
            var normalizedIncoming = this.normalizeVendorEmail(incoming);
            if (!normalizedIncoming) {
                return false;
            }
            var currentSet = new Set(currentValues
                .map(function (value) { return _this.normalizeVendorEmail(value); })
                .filter(function (value) { return value.length > 0; }));
            return !currentSet.has(normalizedIncoming);
        };
        ManufacturersService_1.prototype.isVendorPhoneChanging = function (incoming) {
            var _this = this;
            var currentValues = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                currentValues[_i - 1] = arguments[_i];
            }
            if (incoming === undefined) {
                return false;
            }
            var normalizedIncoming = this.normalizeProfilePhone(incoming);
            if (!normalizedIncoming) {
                return false;
            }
            var currentSet = new Set(currentValues
                .map(function (value) { return _this.normalizeProfilePhone(value); })
                .filter(function (value) { return value.length > 0; }));
            return !currentSet.has(normalizedIncoming);
        };
        ManufacturersService_1.prototype.vendorEmailDuplicateMessage = function () {
            return 'This email id is already registered';
        };
        ManufacturersService_1.prototype.vendorEmailCaseInsensitiveRegex = function (normalized) {
            return new RegExp("^".concat(escapeRegex(normalized), "$"), 'i');
        };
        /** Ensures login email is not used by another manufacturer or portal user account. */
        ManufacturersService_1.prototype.assertVendorEmailAvailableForManufacturer = function (email, manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, emailRx, mfgIdStr, mfgQuery, usersQuery, usersWithEmail, _i, usersWithEmail_1, row, ownerId;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalized = this.normalizeVendorEmail(email);
                            if (!normalized) {
                                throw new common_1.BadRequestException('vendor_email is required');
                            }
                            emailRx = this.vendorEmailCaseInsensitiveRegex(normalized);
                            mfgIdStr = manufacturerId.toString();
                            mfgQuery = this.manufacturerModel
                                .findOne({
                                vendor_email: emailRx,
                                _id: { $ne: manufacturerId },
                                $or: [
                                    { accountDeletedAt: { $exists: false } },
                                    { accountDeletedAt: null },
                                ],
                            })
                                .select('_id')
                                .lean();
                            if (session)
                                mfgQuery.session(session);
                            return [4 /*yield*/, mfgQuery.exec()];
                        case 1:
                            if (_c.sent()) {
                                throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                            }
                            usersQuery = this.vendorUserModel
                                .find({ email: emailRx, status: { $ne: 2 } })
                                .select('_id manufacturerId vendorId')
                                .lean();
                            if (session)
                                usersQuery.session(session);
                            return [4 /*yield*/, usersQuery.exec()];
                        case 2:
                            usersWithEmail = _c.sent();
                            for (_i = 0, usersWithEmail_1 = usersWithEmail; _i < usersWithEmail_1.length; _i++) {
                                row = usersWithEmail_1[_i];
                                ownerId = ((_a = row.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = row.vendorId) === null || _b === void 0 ? void 0 : _b.toString()) || '';
                                if (!ownerId || ownerId !== mfgIdStr) {
                                    throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Returns false when another manufacturer or user already uses this email. */
        ManufacturersService_1.prototype.isVendorEmailAvailableForManufacturer = function (manufacturerId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.assertVendorEmailAvailableForManufacturer(email, new mongoose_1.Types.ObjectId(manufacturerId))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_1 = _a.sent();
                            if (e_1 instanceof common_1.ConflictException) {
                                return [2 /*return*/, false];
                            }
                            throw e_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Ensures phone is not used by another manufacturer or portal user. */
        ManufacturersService_1.prototype.assertVendorPhoneAvailableForManufacturer = function (phone, manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(phone !== null && phone !== void 0 ? phone : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('vendor_phone is required');
                            }
                            return [4 /*yield*/, this.globalPhoneUniqueness.assertPhoneAvailable(trimmed, {
                                    excludeManufacturerId: manufacturerId,
                                    session: session,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.isVendorPhoneAvailableForManufacturer = function (manufacturerId, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.assertVendorPhoneAvailableForManufacturer(phone, new mongoose_1.Types.ObjectId(manufacturerId))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_2 = _a.sent();
                            if (e_2 instanceof common_1.ConflictException) {
                                return [2 /*return*/, false];
                            }
                            throw e_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Validates vendor email/phone in parallel and returns every conflict message
         * (so the client can show email and phone errors on one submit).
         */
        ManufacturersService_1.prototype.collectManufacturerContactConflicts = function (manufacturerId, fields, options) {
            return __awaiter(this, void 0, void 0, function () {
                var conflicts, tasks, normalized, trimmed;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            conflicts = [];
                            tasks = [];
                            if (fields.email !== undefined) {
                                normalized = this.normalizeVendorEmail(fields.email);
                                if (!normalized) {
                                    conflicts.push('vendor_email is required');
                                }
                                else {
                                    tasks.push(this.isVendorEmailAvailableForManufacturer(manufacturerId, normalized).then(function (ok) {
                                        if (!ok) {
                                            conflicts.push(_this.vendorEmailDuplicateMessage());
                                        }
                                    }));
                                }
                            }
                            if (fields.phone !== undefined) {
                                trimmed = String(fields.phone).trim();
                                if (trimmed) {
                                    tasks.push(this.globalPhoneUniqueness
                                        .isPhoneAvailable(trimmed, {
                                        excludeManufacturerId: manufacturerId,
                                        excludeUserId: options === null || options === void 0 ? void 0 : options.excludeUserId,
                                        session: options === null || options === void 0 ? void 0 : options.session,
                                    })
                                        .then(function (ok) {
                                        if (!ok) {
                                            conflicts.push(global_phone_uniqueness_service_1.GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
                                        }
                                    }));
                                }
                            }
                            return [4 /*yield*/, Promise.all(tasks)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, conflicts];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.assertVendorPhoneAvailableForUserId = function (phone, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(phone !== null && phone !== void 0 ? phone : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Phone is required');
                            }
                            return [4 /*yield*/, this.globalPhoneUniqueness.assertPhoneAvailable(trimmed, {
                                    excludeUserId: userId,
                                    session: session,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Vendor profile row without a linked manufacturer (rare). */
        ManufacturersService_1.prototype.assertVendorEmailAvailableForUserId = function (email, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, emailRx, mfgQuery, userFilter, usersQuery;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = this.normalizeVendorEmail(email);
                            if (!normalized) {
                                throw new common_1.BadRequestException('Email is required');
                            }
                            emailRx = this.vendorEmailCaseInsensitiveRegex(normalized);
                            mfgQuery = this.manufacturerModel
                                .findOne({
                                vendor_email: emailRx,
                                $or: [
                                    { accountDeletedAt: { $exists: false } },
                                    { accountDeletedAt: null },
                                ],
                            })
                                .select('_id')
                                .lean();
                            if (session)
                                mfgQuery.session(session);
                            return [4 /*yield*/, mfgQuery.exec()];
                        case 1:
                            if (_a.sent()) {
                                throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                            }
                            userFilter = {
                                email: emailRx,
                                status: { $ne: 2 },
                            };
                            if (mongoose_1.Types.ObjectId.isValid(userId)) {
                                userFilter._id = { $ne: new mongoose_1.Types.ObjectId(userId) };
                            }
                            usersQuery = this.vendorUserModel
                                .find(userFilter)
                                .select('_id')
                                .limit(1)
                                .lean();
                            if (session)
                                usersQuery.session(session);
                            return [4 /*yield*/, usersQuery.exec()];
                        case 2:
                            if (_a.sent()) {
                                throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Keeps vendor_users.email in sync with manufacturer.vendor_email (login uses both).
         */
        ManufacturersService_1.prototype.syncVendorUserEmailsForManufacturer = function (manufacturerId, newEmail, session) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            normalized = this.normalizeVendorEmail(newEmail);
                            if (!normalized)
                                return [2 /*return*/, 0];
                            return [4 /*yield*/, this.vendorUserModel.updateMany({
                                    $or: [{ manufacturerId: manufacturerId }, { vendorId: manufacturerId }],
                                    type: { $in: ['vendor', 'partner'] },
                                }, { $set: { email: normalized, updatedAt: new Date() } }, session ? { session: session } : undefined)];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0];
                    }
                });
            });
        };
        /** Keeps primary vendor user `name` in sync with manufacturer.vendor_name. */
        ManufacturersService_1.prototype.syncVendorUserNamesForManufacturer = function (manufacturerId, newName, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = String(newName !== null && newName !== void 0 ? newName : '').trim();
                            if (!trimmed)
                                return [2 /*return*/, 0];
                            return [4 /*yield*/, this.vendorUserModel.updateMany({
                                    $or: [{ manufacturerId: manufacturerId }, { vendorId: manufacturerId }],
                                    type: 'vendor',
                                }, { $set: { name: trimmed, updatedAt: new Date() } }, session ? { session: session } : undefined)];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0];
                    }
                });
            });
        };
        /**
         * Vendor display name: use stored vendor_name unless legacy rows copied company name
         * into vendor_name — then prefer the linked vendor user's contact name.
         */
        ManufacturersService_1.prototype.resolveVendorDisplayName = function (manufacturer, primaryVendorUserName) {
            var _a, _b;
            var stored = String((_a = manufacturer.vendor_name) !== null && _a !== void 0 ? _a : '').trim();
            var company = String((_b = manufacturer.manufacturerName) !== null && _b !== void 0 ? _b : '').trim();
            var userName = String(primaryVendorUserName !== null && primaryVendorUserName !== void 0 ? primaryVendorUserName : '').trim();
            if (userName &&
                (!stored ||
                    (company && stored.toLowerCase() === company.toLowerCase()))) {
                return userName;
            }
            return stored || userName;
        };
        ManufacturersService_1.prototype.loadPrimaryVendorUsersByManufacturerIds = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var map, users, _i, users_1, row, mid, name_1, userId;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            map = new Map();
                            if (!ids.length)
                                return [2 /*return*/, map];
                            return [4 /*yield*/, this.vendorUserModel
                                    .find({
                                    $or: [
                                        { manufacturerId: { $in: ids } },
                                        { vendorId: { $in: ids } },
                                    ],
                                    type: 'vendor',
                                    status: { $ne: 2 },
                                })
                                    .select('manufacturerId vendorId name')
                                    .lean()
                                    .exec()];
                        case 1:
                            users = _e.sent();
                            for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                                row = users_1[_i];
                                mid = ((_a = row.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = row.vendorId) === null || _b === void 0 ? void 0 : _b.toString()) || '';
                                if (!mid || map.has(mid))
                                    continue;
                                name_1 = String((_c = row.name) !== null && _c !== void 0 ? _c : '').trim();
                                userId = String((_d = row._id) !== null && _d !== void 0 ? _d : '').trim();
                                if (name_1 || userId) {
                                    map.set(mid, { name: name_1, userId: userId });
                                }
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.resolveManufacturerImageUrl = function (manufacturerImage) {
            return (0, upload_file_util_1.resolvePublicUploadUrl)(manufacturerImage);
        };
        ManufacturersService_1.prototype.formatManufacturerApiRow = function (m, options) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (options === void 0) { options = {}; }
            var idStr = String(m._id);
            var vendorDisplay = this.resolveVendorDisplayName(m, options.primaryVendorUserName);
            var iniRaw = String((_a = m.manufacturerInitial) !== null && _a !== void 0 ? _a : '').trim();
            var manufacturerInitial = iniRaw ? iniRaw : null;
            var mSt = Number((_b = m.manufacturerStatus) !== null && _b !== void 0 ? _b : 0);
            var vSt = Number((_c = m.vendor_status) !== null && _c !== void 0 ? _c : 0);
            var companyName = String((_d = m.manufacturerName) !== null && _d !== void 0 ? _d : '').trim();
            var resolvedManufacturerImage = this.resolveManufacturerImageUrl(m.manufacturerImage);
            var accountDeletedAt = m.accountDeletedAt
                ? new Date(m.accountDeletedAt)
                : null;
            var accountDeleted = Boolean(accountDeletedAt);
            return __assign(__assign({ _id: m._id, manufacturerName: companyName, 
                /** Company / organization name (admin grid "Manufacturer Name"). */
                companyName: companyName, gpInternalId: (_e = m.gpInternalId) !== null && _e !== void 0 ? _e : null, manufacturerInitial: manufacturerInitial, initial: manufacturerInitial, manufacturerImage: resolvedManufacturerImage, manufacturerImageUrl: resolvedManufacturerImage, manufacturerStatus: mSt, manufacturerStatusLabel: manufacturerStatusLabel(mSt), vendor_name: vendorDisplay, 
                /** Primary contact name — not the company name. */
                vendorName: vendorDisplay, vendorUserId: (_f = options.primaryVendorUserId) !== null && _f !== void 0 ? _f : null, vendor_email: (_g = m.vendor_email) !== null && _g !== void 0 ? _g : '', vendor_phone: (_h = m.vendor_phone) !== null && _h !== void 0 ? _h : '', vendor_status: vSt, vendorStatusLabel: vendorStatusLabel(vSt), statusToggle: vSt === 1 ? 'On' : 'Off', accountDeleted: accountDeleted, accountDeletedAt: accountDeletedAt, manufacturer_product_count: options.manufacturer_product_count, manufacturer_vendor_count: options.manufacturer_vendor_count }, (options.productCount !== undefined
                ? { productCount: options.productCount }
                : {})), { createdAt: m.createdAt, updatedAt: m.updatedAt });
        };
        ManufacturersService_1.prototype.findByIdForApi = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer, primaryVendors, primaryVendor, counts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.loadPrimaryVendorUsersByManufacturerIds([
                                    manufacturer._id,
                                ])];
                        case 2:
                            primaryVendors = _a.sent();
                            primaryVendor = primaryVendors.get(manufacturer._id.toString());
                            return [4 /*yield*/, this.countForManufacturer(manufacturer._id)];
                        case 3:
                            counts = _a.sent();
                            return [2 /*return*/, this.formatManufacturerApiRow(manufacturer, {
                                    primaryVendorUserName: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.name,
                                    primaryVendorUserId: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.userId,
                                    manufacturer_product_count: counts.manufacturer_product_count,
                                    manufacturer_vendor_count: counts.manufacturer_vendor_count,
                                })];
                    }
                });
            });
        };
        /**
         * New random login password for all vendor/partner users on a manufacturer (admin email change).
         */
        ManufacturersService_1.prototype.resetVendorLoginPasswordsForManufacturer = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var plainPassword, passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            plainPassword = crypto.randomBytes(8).toString('hex');
                            return [4 /*yield*/, bcrypt.hash(plainPassword, 10)];
                        case 1:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.vendorUserModel.updateMany({
                                    $or: [{ manufacturerId: manufacturerId }, { vendorId: manufacturerId }],
                                    type: { $in: ['vendor', 'partner'] },
                                }, { $set: { password: passwordHash, updatedAt: new Date() } }, session ? { session: session } : undefined)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, plainPassword];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.create = function (data, session) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer;
                return __generator(this, function (_a) {
                    manufacturer = new this.manufacturerModel(data);
                    if (session) {
                        return [2 /*return*/, manufacturer.save({ session: session })];
                    }
                    return [2 /*return*/, manufacturer.save()];
                });
            });
        };
        /**
         * Called after vendor email OTP succeeds so admin **unverified** lists can include this manufacturer.
         */
        ManufacturersService_1.prototype.markVendorPortalEmailVerified = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var oid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                oid = new mongoose_1.Types.ObjectId(manufacturerId);
                            }
                            catch (_b) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .updateOne({ _id: oid }, { $set: { vendorPortalEmailVerified: true } })
                                    .exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Persists **gpInternalId** + **manufacturerInitial** for a not-yet-verified manufacturer,
         * using the same rules as {@link updateManufacturerDetails} for unverified rows.
         * Used after self-service vendor registration so admin unverified listings show IDs immediately.
         */
        ManufacturersService_1.prototype.assignAutoGpIdentifiersForUnverifiedManufacturer = function (manufacturerId, displayName, session) {
            return __awaiter(this, void 0, void 0, function () {
                var oid, existing, nameForGen, auto, dupInitial, dupGp, e_3;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            oid = new mongoose_1.Types.ObjectId(manufacturerId);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(oid)
                                    .session(session)
                                    .exec()];
                        case 1:
                            existing = _c.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            if (((_a = existing.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) === 1) {
                                return [2 /*return*/];
                            }
                            nameForGen = String(displayName !== null && displayName !== void 0 ? displayName : '').trim() ||
                                String((_b = existing.manufacturerName) !== null && _b !== void 0 ? _b : '').trim();
                            if (!nameForGen) {
                                throw new common_1.BadRequestException('Manufacturer name is required for GP id allocation');
                            }
                            return [4 /*yield*/, this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(nameForGen, existing._id, {
                                    manufacturerName: existing.manufacturerName,
                                    manufacturerInitial: existing.manufacturerInitial,
                                    gpInternalId: existing.gpInternalId,
                                }, session)];
                        case 2:
                            auto = _c.sent();
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 7, , 9]);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    manufacturerInitial: auto.manufacturerInitial,
                                    _id: { $ne: existing._id },
                                })
                                    .session(session)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 4:
                            dupInitial = _c.sent();
                            if (dupInitial) {
                                throw new common_1.ConflictException('manufacturerInitial already exists on another manufacturer');
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    gpInternalId: auto.gpInternalId,
                                    _id: { $ne: existing._id },
                                })
                                    .session(session)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 5:
                            dupGp = _c.sent();
                            if (dupGp) {
                                throw new common_1.ConflictException('gpInternalId already exists on another manufacturer');
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(oid, {
                                    manufacturerInitial: auto.manufacturerInitial,
                                    gpInternalId: auto.gpInternalId,
                                    updatedAt: new Date(),
                                }, { session: session, new: true })
                                    .exec()];
                        case 6:
                            _c.sent();
                            return [3 /*break*/, 9];
                        case 7:
                            e_3 = _c.sent();
                            return [4 /*yield*/, this.manufacturerIdGeneration.reconcileSequentialStateFromManufacturers(session)];
                        case 8:
                            _c.sent();
                            throw e_3;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.manufacturerModel.findById(id).exec()];
                });
            });
        };
        ManufacturersService_1.prototype.findByVendorEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, notSoftDeleted, exact;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = String(email !== null && email !== void 0 ? email : '').trim().toLowerCase();
                            if (!normalized) {
                                return [2 /*return*/, null];
                            }
                            notSoftDeleted = {
                                $or: [
                                    { accountDeletedAt: { $exists: false } },
                                    { accountDeletedAt: null },
                                ],
                            };
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne(__assign({ vendor_email: normalized }, notSoftDeleted))
                                    .exec()];
                        case 1:
                            exact = _a.sent();
                            if (exact) {
                                return [2 /*return*/, exact];
                            }
                            return [2 /*return*/, this.manufacturerModel
                                    .findOne(__assign({ vendor_email: {
                                        $regex: new RegExp("^".concat(escapeRegex(normalized), "$"), 'i'),
                                    } }, notSoftDeleted))
                                    .exec()];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.findByVendorPhone = function (phone) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, variants;
                return __generator(this, function (_a) {
                    normalized = String(phone !== null && phone !== void 0 ? phone : '').trim();
                    if (!normalized) {
                        return [2 /*return*/, null];
                    }
                    variants = (0, phone_lookup_util_1.buildPhoneLookupVariants)(normalized);
                    if (!variants.length) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, this.manufacturerModel
                            .findOne({ vendor_phone: { $in: variants } })
                            .exec()];
                });
            });
        };
        ManufacturersService_1.prototype.findByCompanyName = function (companyName) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized;
                return __generator(this, function (_a) {
                    normalized = (0, manufacturer_identifier_util_1.normalizeManufacturerName)(companyName);
                    if (!normalized) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, this.manufacturerModel
                            .findOne({
                            manufacturerName: { $regex: companyNameExactRegex(normalized) },
                            $or: [
                                { accountDeletedAt: { $exists: false } },
                                { accountDeletedAt: null },
                            ],
                        })
                            .exec()];
                });
            });
        };
        ManufacturersService_1.prototype.update = function (id, data, session) {
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = session ? { session: session, new: true } : { new: true };
                    return [2 /*return*/, this.manufacturerModel.findByIdAndUpdate(id, data, options).exec()];
                });
            });
        };
        ManufacturersService_1.prototype.getProfile = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(manufacturerId)];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.BadRequestException('Manufacturer not found');
                            }
                            return [2 /*return*/, manufacturer];
                    }
                });
            });
        };
        /**
         * Resolve vendor-facing profile using login auth user id -> users.manufacturerId -> manufacturers doc.
         */
        ManufacturersService_1.prototype.getVendorDetailsByAuthUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUser, manufacturerId, manufacturer, showGpIdentifiers, vendorDisplay;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                return __generator(this, function (_6) {
                    switch (_6.label) {
                        case 0: return [4 /*yield*/, this.vendorUsersService.findById(userId)];
                        case 1:
                            vendorUser = _6.sent();
                            if (!vendorUser) {
                                throw new common_1.NotFoundException('Vendor user not found');
                            }
                            manufacturerId = ((_a = vendorUser.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = vendorUser.vendorId) === null || _b === void 0 ? void 0 : _b.toString());
                            if (!manufacturerId) {
                                throw new common_1.NotFoundException('Manufacturer mapping not found for user');
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .lean()
                                    .exec()];
                        case 2:
                            manufacturer = _6.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            showGpIdentifiers = Boolean(vendorUser.isVerified);
                            vendorDisplay = this.resolveVendorDisplayName(manufacturer, vendorUser.name);
                            return [2 /*return*/, {
                                    _id: manufacturer._id,
                                    manufacturerName: manufacturer.manufacturerName,
                                    companyName: (_c = manufacturer.manufacturerName) !== null && _c !== void 0 ? _c : '',
                                    gpInternalId: showGpIdentifiers
                                        ? ((_d = manufacturer.gpInternalId) !== null && _d !== void 0 ? _d : null)
                                        : null,
                                    manufacturerInitial: showGpIdentifiers
                                        ? ((_e = manufacturer.manufacturerInitial) !== null && _e !== void 0 ? _e : null)
                                        : null,
                                    manufacturerImage: (_f = manufacturer.manufacturerImage) !== null && _f !== void 0 ? _f : null,
                                    manufacturerStatus: (_g = manufacturer.manufacturerStatus) !== null && _g !== void 0 ? _g : 0,
                                    vendor_name: vendorDisplay,
                                    vendorName: vendorDisplay,
                                    vendor_email: (_h = manufacturer.vendor_email) !== null && _h !== void 0 ? _h : '',
                                    vendor_phone: (_j = manufacturer.vendor_phone) !== null && _j !== void 0 ? _j : '',
                                    vendor_website: (_k = manufacturer.vendor_website) !== null && _k !== void 0 ? _k : '',
                                    vendor_facebook: (_l = manufacturer.vendor_facebook) !== null && _l !== void 0 ? _l : '',
                                    vendor_youtube: (_m = manufacturer.vendor_youtube) !== null && _m !== void 0 ? _m : '',
                                    vendor_twitter: (_o = manufacturer.vendor_twitter) !== null && _o !== void 0 ? _o : '',
                                    vendor_linkedin: (_p = manufacturer.vendor_linkedin) !== null && _p !== void 0 ? _p : '',
                                    facebook: (_q = manufacturer.vendor_facebook) !== null && _q !== void 0 ? _q : '',
                                    youtube: (_r = manufacturer.vendor_youtube) !== null && _r !== void 0 ? _r : '',
                                    twitter: (_s = manufacturer.vendor_twitter) !== null && _s !== void 0 ? _s : '',
                                    linkedin: (_t = manufacturer.vendor_linkedin) !== null && _t !== void 0 ? _t : '',
                                    facebookUrl: (_u = manufacturer.vendor_facebook) !== null && _u !== void 0 ? _u : '',
                                    youtubeUrl: (_v = manufacturer.vendor_youtube) !== null && _v !== void 0 ? _v : '',
                                    twitterUrl: (_w = manufacturer.vendor_twitter) !== null && _w !== void 0 ? _w : '',
                                    linkedinUrl: (_x = manufacturer.vendor_linkedin) !== null && _x !== void 0 ? _x : '',
                                    vendor_designation: (_y = manufacturer.vendor_designation) !== null && _y !== void 0 ? _y : '',
                                    vendor_gst: (_z = manufacturer.vendor_gst) !== null && _z !== void 0 ? _z : '',
                                    gstPdf: (_0 = manufacturer.vendorGstPdf) !== null && _0 !== void 0 ? _0 : '',
                                    companyLogo: (_1 = manufacturer.companyLogo) !== null && _1 !== void 0 ? _1 : '',
                                    vendor_status: (_2 = manufacturer.vendor_status) !== null && _2 !== void 0 ? _2 : 0,
                                    companySize: (_3 = manufacturer.companySize) !== null && _3 !== void 0 ? _3 : '',
                                    pan: (_4 = manufacturer.vendorPanDocument) !== null && _4 !== void 0 ? _4 : '',
                                    panNumber: (_5 = manufacturer.vendorPan) !== null && _5 !== void 0 ? _5 : '',
                                    technicalContact: this.mapVendorContactSlot(manufacturer.technicalContact),
                                    marketingContact: this.mapVendorContactSlot(manufacturer.marketingContact),
                                    createdAt: manufacturer.createdAt,
                                    updatedAt: manufacturer.updatedAt,
                                }];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.toProfilePayloadShape = function (manufacturer) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            return {
                companyName: (_a = manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : '',
                name: (_b = manufacturer.vendor_name) !== null && _b !== void 0 ? _b : '',
                designation: (_c = manufacturer.vendor_designation) !== null && _c !== void 0 ? _c : '',
                gst: (_d = manufacturer.vendor_gst) !== null && _d !== void 0 ? _d : '',
                gstPdf: (_e = manufacturer.vendorGstPdf) !== null && _e !== void 0 ? _e : '',
                companyLogo: (_f = manufacturer.companyLogo) !== null && _f !== void 0 ? _f : '',
                pan: (_g = manufacturer.vendorPanDocument) !== null && _g !== void 0 ? _g : '',
                panNumber: (_h = manufacturer.vendorPan) !== null && _h !== void 0 ? _h : '',
                email: (_j = manufacturer.vendor_email) !== null && _j !== void 0 ? _j : '',
                mobile: (_k = manufacturer.vendor_phone) !== null && _k !== void 0 ? _k : '',
                facebook: (_l = manufacturer.vendor_facebook) !== null && _l !== void 0 ? _l : '',
                youtube: (_m = manufacturer.vendor_youtube) !== null && _m !== void 0 ? _m : '',
                twitter: (_o = manufacturer.vendor_twitter) !== null && _o !== void 0 ? _o : '',
                linkedin: (_p = manufacturer.vendor_linkedin) !== null && _p !== void 0 ? _p : '',
                facebookUrl: (_q = manufacturer.vendor_facebook) !== null && _q !== void 0 ? _q : '',
                youtubeUrl: (_r = manufacturer.vendor_youtube) !== null && _r !== void 0 ? _r : '',
                twitterUrl: (_s = manufacturer.vendor_twitter) !== null && _s !== void 0 ? _s : '',
                linkedinUrl: (_t = manufacturer.vendor_linkedin) !== null && _t !== void 0 ? _t : '',
            };
        };
        /** Vendor panel may send `facebookUrl` etc.; normalize to canonical keys for persistence. */
        ManufacturersService_1.prototype.normalizeVendorProfileSocialLinks = function (dto) {
            var pairs = [
                { canonical: 'facebook', alias: 'facebookUrl' },
                { canonical: 'youtube', alias: 'youtubeUrl' },
                { canonical: 'twitter', alias: 'twitterUrl' },
                { canonical: 'linkedin', alias: 'linkedinUrl' },
            ];
            var out = __assign({}, dto);
            for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
                var _a = pairs_1[_i], canonical = _a.canonical, alias = _a.alias;
                if (out[canonical] !== undefined) {
                    continue;
                }
                if (out[alias] !== undefined) {
                    out[canonical] = out[alias];
                }
            }
            return out;
        };
        ManufacturersService_1.prototype.emptyVendorContactSlot = function () {
            return {
                name: '',
                email_id: '',
                phone_number: '',
                designation: '',
            };
        };
        ManufacturersService_1.prototype.mapVendorContactSlot = function (slot) {
            var _a, _b, _c, _d;
            if (!slot) {
                return this.emptyVendorContactSlot();
            }
            var s = slot;
            return {
                name: String((_a = s.name) !== null && _a !== void 0 ? _a : '').trim(),
                email_id: String((_b = s.email_id) !== null && _b !== void 0 ? _b : '').trim(),
                phone_number: String((_c = s.phone_number) !== null && _c !== void 0 ? _c : '').trim(),
                designation: String((_d = s.designation) !== null && _d !== void 0 ? _d : '').trim(),
            };
        };
        ManufacturersService_1.prototype.looksLikeVendorAssetUrl = function (value) {
            var t = String(value !== null && value !== void 0 ? value : '').trim();
            if (!t)
                return false;
            return t.startsWith('/') || /^https?:\/\//i.test(t);
        };
        ManufacturersService_1.prototype.normalizeIndianPan = function (value) {
            return String(value !== null && value !== void 0 ? value : '').trim().toUpperCase();
        };
        ManufacturersService_1.prototype.normalizeIndianGstin = function (value) {
            return String(value !== null && value !== void 0 ? value : '')
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '');
        };
        /** GST / tax id text for storage — trim, uppercase, no format checks. */
        ManufacturersService_1.prototype.normalizeGstNumberForStorage = function (raw) {
            return this.normalizeIndianGstin(raw).slice(0, 64);
        };
        ManufacturersService_1.prototype.partitionGstAndPdfFromUpdateDto = function (updateDto) {
            var rawGst = updateDto.gst !== undefined ? String(updateDto.gst).trim() : '';
            var rawGstNumber = updateDto.gstNumber !== undefined
                ? String(updateDto.gstNumber).trim()
                : '';
            var gstNumberToApply = rawGstNumber;
            var gstPdfToApply;
            if (rawGst && this.looksLikeVendorAssetUrl(rawGst)) {
                gstPdfToApply = rawGst;
            }
            else if (rawGst) {
                gstNumberToApply = gstNumberToApply || rawGst;
            }
            return { gstNumberToApply: gstNumberToApply, gstPdfToApply: gstPdfToApply };
        };
        ManufacturersService_1.prototype.resolveManufacturerForVendorProfile = function (authUser) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, manufacturerIdFromToken, manufacturerFromToken, _a, vendorUser, mappedManufacturerId, manufacturer, _b, fallbackManufacturer, _c, fallbackByContact, _d, resolvedManufacturer;
                var _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            userId = typeof authUser === 'string' ? authUser : authUser.userId;
                            manufacturerIdFromToken = typeof authUser === 'string'
                                ? ''
                                : String(authUser.manufacturerId || authUser.vendorId || '').trim();
                            if (!(manufacturerIdFromToken && mongoose_1.Types.ObjectId.isValid(manufacturerIdFromToken))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.manufacturerModel.findById(manufacturerIdFromToken).exec()];
                        case 1:
                            _a = _g.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = null;
                            _g.label = 3;
                        case 3:
                            manufacturerFromToken = _a;
                            return [4 /*yield*/, this.vendorUsersService.findById(userId)];
                        case 4:
                            vendorUser = _g.sent();
                            mappedManufacturerId = ((_e = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.manufacturerId) === null || _e === void 0 ? void 0 : _e.toString()) ||
                                ((_f = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.vendorId) === null || _f === void 0 ? void 0 : _f.toString()) ||
                                '';
                            if (!mappedManufacturerId) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.manufacturerModel.findById(mappedManufacturerId).exec()];
                        case 5:
                            _b = _g.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _b = null;
                            _g.label = 7;
                        case 7:
                            manufacturer = _b;
                            if (!(!manufacturer && mongoose_1.Types.ObjectId.isValid(userId))) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.manufacturerModel.findById(userId).exec()];
                        case 8:
                            _c = _g.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _c = null;
                            _g.label = 10;
                        case 10:
                            fallbackManufacturer = _c;
                            if (!(!manufacturer &&
                                !fallbackManufacturer &&
                                vendorUser &&
                                (vendorUser.email || vendorUser.phone))) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    $or: __spreadArray(__spreadArray([], (vendorUser.email
                                        ? [{ vendor_email: String(vendorUser.email).trim() }]
                                        : []), true), (vendorUser.phone
                                        ? [{ vendor_phone: String(vendorUser.phone).trim() }]
                                        : []), true),
                                })
                                    .exec()];
                        case 11:
                            _d = _g.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            _d = null;
                            _g.label = 13;
                        case 13:
                            fallbackByContact = _d;
                            resolvedManufacturer = manufacturer ||
                                manufacturerFromToken ||
                                fallbackManufacturer ||
                                fallbackByContact;
                            return [2 /*return*/, { resolvedManufacturer: resolvedManufacturer, vendorUser: vendorUser }];
                    }
                });
            });
        };
        /** Public wrapper used by dashboard and other modules. */
        ManufacturersService_1.prototype.resolveManufacturerForAuthUser = function (authUser) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.resolveManufacturerForVendorProfile(authUser)];
                });
            });
        };
        /**
         * Vendor dashboard gate — GST (number or certificate PDF), designation, and phone.
         * Falls back to vendor-users row when manufacturer text fields were only saved there.
         */
        ManufacturersService_1.prototype.isVendorAccountProfileComplete = function (manufacturer, vendorUser) {
            var _a, _b, _c, _d, _e, _f;
            var gst = String((_a = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_gst) !== null && _a !== void 0 ? _a : '').trim() ||
                String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendorGstPdf) !== null && _b !== void 0 ? _b : '').trim();
            var designation = String((_c = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_designation) !== null && _c !== void 0 ? _c : '').trim() ||
                String((_d = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.designation) !== null && _d !== void 0 ? _d : '').trim();
            var phone = String((_e = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_phone) !== null && _e !== void 0 ? _e : '').trim() ||
                String((_f = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.phone) !== null && _f !== void 0 ? _f : '').trim();
            return Boolean(gst && designation && phone);
        };
        /**
         * Many clients send both `pan` and `panDocument` (or `gst` + `gstDocument`); the first slot
         * is often an empty file part. Prefer **document** field names, then any slice with bytes.
         */
        ManufacturersService_1.prototype.pickVendorProfileUploadSlice = function (files, fieldOrder) {
            var _this = this;
            if (!files) {
                return undefined;
            }
            var slices = fieldOrder
                .map(function (k) { var _a; return (_a = files[k]) === null || _a === void 0 ? void 0 : _a[0]; })
                .filter(function (f) { return !!f; });
            var withBytes = slices.find(function (f) { return _this.multerFileByteLength(f) > 0; });
            if (withBytes) {
                return withBytes;
            }
            return slices[0];
        };
        /** Multer file groups for vendor GST logo / PAN (field aliases supported). */
        ManufacturersService_1.prototype.vendorProfileBrandingMulterFiles = function (files) {
            var _a;
            return {
                gstFile: this.pickVendorProfileUploadSlice(files, [
                    'gstDocument',
                    'gst',
                ]),
                logoFile: (_a = files === null || files === void 0 ? void 0 : files.companyLogo) === null || _a === void 0 ? void 0 : _a[0],
                panFile: this.pickVendorProfileUploadSlice(files, [
                    'panDocument',
                    'pan',
                ]),
            };
        };
        ManufacturersService_1.prototype.multerFileByteLength = function (file) {
            var _a, _b;
            if (typeof file.size === 'number' && file.size > 0) {
                return file.size;
            }
            return (_b = (_a = file.buffer) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        };
        /**
         * Multipart text fields sometimes land on `req.body` but not on the validated DTO.
         * Fills only keys that are missing or blank on `dto` from `raw` (never overwrites non-empty values).
         */
        ManufacturersService_1.prototype.mergeVendorProfileDtoFromRawBody = function (dto, raw) {
            if (!raw || typeof raw !== 'object') {
                return dto;
            }
            var out = __assign({}, dto);
            var isBlank = function (v) {
                return v === undefined ||
                    v === null ||
                    (typeof v === 'string' && v.trim() === '');
            };
            var readRaw = function (key) {
                var rawVal = raw[key];
                if (rawVal === undefined || rawVal === null) {
                    return undefined;
                }
                if (Array.isArray(rawVal)) {
                    var first = rawVal[0];
                    return typeof first === 'string' ? first.trim() : String(first !== null && first !== void 0 ? first : '').trim();
                }
                return typeof rawVal === 'string' ? rawVal.trim() : String(rawVal).trim();
            };
            var fill = function (key) {
                if (!isBlank(out[key])) {
                    return;
                }
                var s = readRaw(key);
                if (s === undefined || s === '') {
                    return;
                }
                out[key] = s;
            };
            [
                'companyName',
                'name',
                'designation',
                'gst',
                'companyLogo',
                'pan',
                'email',
                'mobile',
                'facebook',
                'facebookUrl',
                'youtube',
                'youtubeUrl',
                'twitter',
                'twitterUrl',
                'linkedin',
                'linkedinUrl',
            ].forEach(fill);
            return this.normalizeVendorProfileSocialLinks(out);
        };
        /**
         * Persists vendor branding files only through the shared `uploadFile()` helper
         * in `upload-file.util` (`uploads/manufacturers/` locally or S3 when configured).
         */
        ManufacturersService_1.prototype.uploadVendorBrandingMulterFile = function (file, label) {
            return __awaiter(this, void 0, void 0, function () {
                var e_4, msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.multerFileByteLength(file) <= 0) {
                                throw new common_1.BadRequestException("".concat(label, " file is empty or unreadable. Pick the file again in the browser (replayed curl without binary body will not upload)."));
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'manufacturers')];
                        case 2: return [2 /*return*/, (_a.sent()).fileUrl];
                        case 3:
                            e_4 = _a.sent();
                            msg = e_4 instanceof Error ? e_4.message : String(e_4);
                            if (msg.includes('requires file buffer')) {
                                throw new common_1.BadRequestException("".concat(label, " could not be read or is empty. Re-select the file and retry."));
                            }
                            throw e_4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.vendorBrandingFileUrlsFromUploadFile = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, gstFile, logoFile, panFile, out, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = this.vendorProfileBrandingMulterFiles(files), gstFile = _a.gstFile, logoFile = _a.logoFile, panFile = _a.panFile;
                            out = {};
                            if (!gstFile) return [3 /*break*/, 2];
                            if (!(0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(gstFile)) {
                                throw new common_1.BadRequestException(vendor_profile_document_validation_1.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
                            }
                            _b = out;
                            return [4 /*yield*/, this.uploadVendorBrandingMulterFile(gstFile, 'GST certificate')];
                        case 1:
                            _b.gst = _e.sent();
                            _e.label = 2;
                        case 2:
                            if (!logoFile) return [3 /*break*/, 4];
                            _c = out;
                            return [4 /*yield*/, this.uploadVendorBrandingMulterFile(logoFile, 'Company logo')];
                        case 3:
                            _c.companyLogo = _e.sent();
                            _e.label = 4;
                        case 4:
                            if (!panFile) return [3 /*break*/, 6];
                            if (!(0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(panFile)) {
                                throw new common_1.BadRequestException(vendor_profile_document_validation_1.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
                            }
                            _d = out;
                            return [4 /*yield*/, this.uploadVendorBrandingMulterFile(panFile, 'PAN document')];
                        case 5:
                            _d.pan = _e.sent();
                            _e.label = 6;
                        case 6: return [2 /*return*/, out];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.uploadVendorProfileBranding = function (authUser, files) {
            return __awaiter(this, void 0, void 0, function () {
                var dto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.vendorBrandingFileUrlsFromUploadFile(files)];
                        case 1:
                            dto = _a.sent();
                            if (!dto.gst && !dto.companyLogo && !dto.pan) {
                                throw new common_1.BadRequestException('Send at least one file: **gst** / **gstDocument** (PDF, JPG, or PNG only), **companyLogo** (image), and/or **pan** / **panDocument** (PDF, JPG, or PNG only).');
                            }
                            return [2 /*return*/, this.editProfile(authUser, dto)];
                    }
                });
            });
        };
        /**
         * Same as {@link editProfile} but merges optional multipart files into the DTO
         * (used by PATCH /api/vendor/profile with multipart). Field aliases: **gstDocument** → gst, **panDocument** → pan.
         * Files are stored only via the shared `uploadFile()` helper (`upload-file.util`).
         */
        ManufacturersService_1.prototype.editProfileWithOptionalBrandingFiles = function (authUser, updateDto, files, rawBody) {
            return __awaiter(this, void 0, void 0, function () {
                var mergedText, fromFiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mergedText = this.mergeVendorProfileDtoFromRawBody(updateDto, rawBody);
                            return [4 /*yield*/, this.vendorBrandingFileUrlsFromUploadFile(files)];
                        case 1:
                            fromFiles = _a.sent();
                            return [2 /*return*/, this.editProfile(authUser, __assign(__assign({}, mergedText), fromFiles))];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.editProfile = function (authUser, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, _a, rawGstinFromPartition, gstPdfToApply, gstNumberToApply, rawPanField, rawPanNumberOnly, panNumberToApply, panDocUrlToApply, brandingAttempted, session, _b, resolvedManufacturer, vendorUser, emailChanging, phoneChanging, profileContactConflicts, vendorUserUpdate, newEmail, newPhone, e_5, vendorOnlyGst, gstExists, panExists, updateData, logo, profileEmailChanged, profileNotifyEmail_1, newEmail, oldEmail, vendorUserSelfPatch, e_6, code, keyPattern, updated_1, error_1;
                var _this = this;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                return __generator(this, function (_3) {
                    switch (_3.label) {
                        case 0:
                            updateDto = this.normalizeVendorProfileSocialLinks(updateDto);
                            userId = typeof authUser === 'string' ? authUser : authUser.userId;
                            _a = this.partitionGstAndPdfFromUpdateDto(updateDto), rawGstinFromPartition = _a.gstNumberToApply, gstPdfToApply = _a.gstPdfToApply;
                            gstNumberToApply = this.normalizeGstNumberForStorage(rawGstinFromPartition);
                            rawPanField = updateDto.pan !== undefined ? String(updateDto.pan).trim() : '';
                            rawPanNumberOnly = updateDto.panNumber !== undefined
                                ? String(updateDto.panNumber).trim()
                                : '';
                            panNumberToApply = '';
                            if (rawPanNumberOnly) {
                                panNumberToApply = this.normalizeIndianPan(rawPanNumberOnly);
                            }
                            if (rawPanField) {
                                if (this.looksLikeVendorAssetUrl(rawPanField)) {
                                    panDocUrlToApply = rawPanField;
                                }
                                else if (rawPanField && !panNumberToApply) {
                                    panNumberToApply = this.normalizeIndianPan(rawPanField);
                                }
                            }
                            brandingAttempted = updateDto.companyLogo !== undefined ||
                                gstPdfToApply !== undefined ||
                                panDocUrlToApply !== undefined;
                            return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _3.sent();
                            session.startTransaction();
                            _3.label = 2;
                        case 2:
                            _3.trys.push([2, 32, 34, 35]);
                            return [4 /*yield*/, this.resolveManufacturerForVendorProfile(authUser)];
                        case 3:
                            _b = _3.sent(), resolvedManufacturer = _b.resolvedManufacturer, vendorUser = _b.vendorUser;
                            if (!resolvedManufacturer) return [3 /*break*/, 5];
                            emailChanging = this.isVendorEmailChanging(updateDto.email, resolvedManufacturer.vendor_email, vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.email);
                            phoneChanging = this.isVendorPhoneChanging(updateDto.mobile, resolvedManufacturer.vendor_phone, vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.phone);
                            return [4 /*yield*/, this.collectManufacturerContactConflicts(resolvedManufacturer._id.toString(), {
                                    email: emailChanging ? updateDto.email : undefined,
                                    phone: phoneChanging ? updateDto.mobile : undefined,
                                }, { excludeUserId: userId, session: session })];
                        case 4:
                            profileContactConflicts = _3.sent();
                            if (profileContactConflicts.length > 0) {
                                throw new common_1.ConflictException(profileContactConflicts);
                            }
                            _3.label = 5;
                        case 5:
                            if (!!resolvedManufacturer) return [3 /*break*/, 15];
                            if (brandingAttempted) {
                                throw new common_1.BadRequestException('Company logo, GST certificate, and PAN document require a linked manufacturer profile.');
                            }
                            vendorUserUpdate = {};
                            if (updateDto.name !== undefined) {
                                vendorUserUpdate.name = updateDto.name;
                            }
                            if (updateDto.designation !== undefined) {
                                vendorUserUpdate.designation = updateDto.designation;
                            }
                            if (!this.isVendorEmailChanging(updateDto.email, vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.email)) return [3 /*break*/, 7];
                            newEmail = this.normalizeVendorEmail(updateDto.email);
                            return [4 /*yield*/, this.assertVendorEmailAvailableForUserId(newEmail, userId, session)];
                        case 6:
                            _3.sent();
                            vendorUserUpdate.email = newEmail;
                            _3.label = 7;
                        case 7:
                            if (!this.isVendorPhoneChanging(updateDto.mobile, vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.phone)) return [3 /*break*/, 9];
                            newPhone = this.normalizeProfilePhone(updateDto.mobile);
                            return [4 /*yield*/, this.assertVendorPhoneAvailableForUserId(newPhone, userId, session)];
                        case 8:
                            _3.sent();
                            vendorUserUpdate.phone = newPhone;
                            _3.label = 9;
                        case 9:
                            if (!(Object.keys(vendorUserUpdate).length > 0)) return [3 /*break*/, 13];
                            _3.label = 10;
                        case 10:
                            _3.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(userId, vendorUserUpdate, { new: true, session: session })
                                    .exec()];
                        case 11:
                            _3.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            e_5 = _3.sent();
                            if ((e_5 === null || e_5 === void 0 ? void 0 : e_5.code) === 11000) {
                                throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                            }
                            throw e_5;
                        case 13: return [4 /*yield*/, session.commitTransaction()];
                        case 14:
                            _3.sent();
                            vendorOnlyGst = gstNumberToApply || '';
                            return [2 /*return*/, {
                                    companyName: (_c = updateDto.companyName) !== null && _c !== void 0 ? _c : '',
                                    name: (_e = (_d = updateDto.name) !== null && _d !== void 0 ? _d : vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.name) !== null && _e !== void 0 ? _e : '',
                                    designation: (_g = (_f = updateDto.designation) !== null && _f !== void 0 ? _f : vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.designation) !== null && _g !== void 0 ? _g : '',
                                    gst: vendorOnlyGst,
                                    gstPdf: '',
                                    companyLogo: '',
                                    pan: '',
                                    panNumber: panNumberToApply || '',
                                    email: (_j = (_h = updateDto.email) !== null && _h !== void 0 ? _h : vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.email) !== null && _j !== void 0 ? _j : '',
                                    mobile: (_l = (_k = updateDto.mobile) !== null && _k !== void 0 ? _k : vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.phone) !== null && _l !== void 0 ? _l : '',
                                    facebook: (_o = (_m = updateDto.facebook) !== null && _m !== void 0 ? _m : updateDto.facebookUrl) !== null && _o !== void 0 ? _o : '',
                                    youtube: (_q = (_p = updateDto.youtube) !== null && _p !== void 0 ? _p : updateDto.youtubeUrl) !== null && _q !== void 0 ? _q : '',
                                    twitter: (_s = (_r = updateDto.twitter) !== null && _r !== void 0 ? _r : updateDto.twitterUrl) !== null && _s !== void 0 ? _s : '',
                                    linkedin: (_u = (_t = updateDto.linkedin) !== null && _t !== void 0 ? _t : updateDto.linkedinUrl) !== null && _u !== void 0 ? _u : '',
                                    facebookUrl: (_w = (_v = updateDto.facebook) !== null && _v !== void 0 ? _v : updateDto.facebookUrl) !== null && _w !== void 0 ? _w : '',
                                    youtubeUrl: (_y = (_x = updateDto.youtube) !== null && _x !== void 0 ? _x : updateDto.youtubeUrl) !== null && _y !== void 0 ? _y : '',
                                    twitterUrl: (_0 = (_z = updateDto.twitter) !== null && _z !== void 0 ? _z : updateDto.twitterUrl) !== null && _0 !== void 0 ? _0 : '',
                                    linkedinUrl: (_2 = (_1 = updateDto.linkedin) !== null && _1 !== void 0 ? _1 : updateDto.linkedinUrl) !== null && _2 !== void 0 ? _2 : '',
                                }];
                        case 15:
                            if (!gstNumberToApply) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    _id: { $ne: resolvedManufacturer._id },
                                    vendor_gst: gstNumberToApply,
                                })
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 16:
                            gstExists = _3.sent();
                            if (gstExists) {
                                throw new common_1.BadRequestException('GST number already exists. Please change it.');
                            }
                            _3.label = 17;
                        case 17:
                            if (!panNumberToApply) return [3 /*break*/, 19];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne({
                                    _id: { $ne: resolvedManufacturer._id },
                                    vendorPan: panNumberToApply,
                                })
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 18:
                            panExists = _3.sent();
                            if (panExists) {
                                throw new common_1.BadRequestException('PAN number already exists for another vendor.');
                            }
                            _3.label = 19;
                        case 19:
                            updateData = {};
                            if (updateDto.companyName) {
                                updateData.manufacturerName = updateDto.companyName;
                            }
                            if (updateDto.name) {
                                updateData.vendor_name = updateDto.name;
                            }
                            if (updateDto.designation !== undefined) {
                                updateData.vendor_designation = String(updateDto.designation).trim();
                            }
                            if (gstNumberToApply) {
                                updateData.vendor_gst = gstNumberToApply;
                            }
                            if (gstPdfToApply !== undefined) {
                                updateData.vendorGstPdf = gstPdfToApply;
                            }
                            if (updateDto.companyLogo !== undefined) {
                                logo = String(updateDto.companyLogo).trim();
                                if (logo) {
                                    updateData.companyLogo = logo;
                                }
                            }
                            if (panNumberToApply) {
                                updateData.vendorPan = panNumberToApply;
                            }
                            if (panDocUrlToApply !== undefined) {
                                updateData.vendorPanDocument = panDocUrlToApply;
                            }
                            if (updateDto.facebook !== undefined) {
                                updateData.vendor_facebook = String(updateDto.facebook).trim();
                            }
                            if (updateDto.youtube !== undefined) {
                                updateData.vendor_youtube = String(updateDto.youtube).trim();
                            }
                            if (updateDto.twitter !== undefined) {
                                updateData.vendor_twitter = String(updateDto.twitter).trim();
                            }
                            if (updateDto.linkedin !== undefined) {
                                updateData.vendor_linkedin = String(updateDto.linkedin).trim();
                            }
                            profileEmailChanged = false;
                            profileNotifyEmail_1 = null;
                            if (updateDto.email !== undefined && String(updateDto.email).trim()) {
                                newEmail = this.normalizeVendorEmail(updateDto.email);
                                oldEmail = this.normalizeVendorEmail(resolvedManufacturer.vendor_email);
                                if (newEmail !== oldEmail) {
                                    profileEmailChanged = true;
                                    profileNotifyEmail_1 = newEmail;
                                }
                                updateData.vendor_email = newEmail;
                            }
                            if (updateDto.mobile) {
                                updateData.vendor_phone = updateDto.mobile;
                            }
                            if (!(Object.keys(updateData).length > 0)) return [3 /*break*/, 21];
                            return [4 /*yield*/, this.update(resolvedManufacturer._id.toString(), updateData, session)];
                        case 20:
                            _3.sent();
                            _3.label = 21;
                        case 21:
                            if (!(profileEmailChanged && profileNotifyEmail_1)) return [3 /*break*/, 23];
                            return [4 /*yield*/, this.syncVendorUserEmailsForManufacturer(resolvedManufacturer._id, profileNotifyEmail_1, session)];
                        case 22:
                            _3.sent();
                            _3.label = 23;
                        case 23:
                            vendorUserSelfPatch = {};
                            if (updateDto.name !== undefined && String(updateDto.name).trim()) {
                                vendorUserSelfPatch.name = String(updateDto.name).trim();
                            }
                            if (updateDto.designation !== undefined) {
                                vendorUserSelfPatch.designation = String(updateDto.designation).trim();
                            }
                            if (updateDto.email !== undefined && String(updateDto.email).trim()) {
                                vendorUserSelfPatch.email = this.normalizeVendorEmail(updateDto.email);
                            }
                            if (updateDto.mobile !== undefined && String(updateDto.mobile).trim()) {
                                vendorUserSelfPatch.phone = String(updateDto.mobile).trim();
                            }
                            if (!(Object.keys(vendorUserSelfPatch).length > 0)) return [3 /*break*/, 27];
                            _3.label = 24;
                        case 24:
                            _3.trys.push([24, 26, , 27]);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(userId, vendorUserSelfPatch, {
                                    new: true,
                                    session: session,
                                })
                                    .exec()];
                        case 25:
                            _3.sent();
                            return [3 /*break*/, 27];
                        case 26:
                            e_6 = _3.sent();
                            code = e_6 === null || e_6 === void 0 ? void 0 : e_6.code;
                            if (code === 11000) {
                                keyPattern = e_6 === null || e_6 === void 0 ? void 0 : e_6.keyPattern;
                                if (keyPattern && 'phone' in keyPattern) {
                                    throw new common_1.ConflictException(global_phone_uniqueness_service_1.GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
                                }
                                throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                            }
                            throw e_6;
                        case 27: return [4 /*yield*/, session.commitTransaction()];
                        case 28:
                            _3.sent();
                            return [4 /*yield*/, this.findById(resolvedManufacturer._id.toString())];
                        case 29:
                            updated_1 = _3.sent();
                            if (!updated_1) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            if (!(profileEmailChanged && profileNotifyEmail_1)) return [3 /*break*/, 31];
                            return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(resolvedManufacturer._id.toString())];
                        case 30:
                            _3.sent();
                            this.emailService.sendInBackground(function () {
                                var _a, _b;
                                return _this.emailService
                                    .sendVendorLoginEmailUpdatedEmail(profileNotifyEmail_1, String((_b = (_a = updated_1.vendor_name) !== null && _a !== void 0 ? _a : updated_1.manufacturerName) !== null && _b !== void 0 ? _b : ''))
                                    .catch(function (err) {
                                    _this.logger.warn("Vendor login email notification failed for ".concat(profileNotifyEmail_1, ": ").concat(err.message || 'unknown error'));
                                });
                            });
                            _3.label = 31;
                        case 31: return [2 /*return*/, this.toProfilePayloadShape(updated_1)];
                        case 32:
                            error_1 = _3.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 33:
                            _3.sent();
                            throw error_1;
                        case 34:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 35: return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.getVendorContactsByAuthUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var resolvedManufacturer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveManufacturerForVendorProfile(userId)];
                        case 1:
                            resolvedManufacturer = (_a.sent()).resolvedManufacturer;
                            if (!resolvedManufacturer) {
                                return [2 /*return*/, {
                                        technicalContact: this.emptyVendorContactSlot(),
                                        marketingContact: this.emptyVendorContactSlot(),
                                    }];
                            }
                            return [2 /*return*/, {
                                    technicalContact: this.mapVendorContactSlot(resolvedManufacturer.technicalContact),
                                    marketingContact: this.mapVendorContactSlot(resolvedManufacturer.marketingContact),
                                }];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.updateVendorContacts = function (authUser, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var resolvedManufacturer, session, updated, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveManufacturerForVendorProfile(authUser)];
                        case 1:
                            resolvedManufacturer = (_a.sent()).resolvedManufacturer;
                            if (!resolvedManufacturer) {
                                throw new common_1.BadRequestException('Vendor contacts require a linked manufacturer profile.');
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _a.sent();
                            session.startTransaction();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 7, 9, 10]);
                            return [4 /*yield*/, this.update(resolvedManufacturer._id.toString(), {
                                    technicalContact: {
                                        name: dto.technicalContact.name.trim(),
                                        email_id: dto.technicalContact.email_id.trim().toLowerCase(),
                                        phone_number: dto.technicalContact.phone_number.trim(),
                                        designation: dto.technicalContact.designation.trim(),
                                    },
                                    marketingContact: {
                                        name: dto.marketingContact.name.trim(),
                                        email_id: dto.marketingContact.email_id.trim().toLowerCase(),
                                        phone_number: dto.marketingContact.phone_number.trim(),
                                        designation: dto.marketingContact.designation.trim(),
                                    },
                                }, session)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, this.findById(resolvedManufacturer._id.toString())];
                        case 6:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            return [2 /*return*/, {
                                    technicalContact: this.mapVendorContactSlot(updated.technicalContact),
                                    marketingContact: this.mapVendorContactSlot(updated.marketingContact),
                                }];
                        case 7:
                            error_2 = _a.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 8:
                            _a.sent();
                            throw error_2;
                        case 9:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.changePassword = function (userId, changePasswordDto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isCurrentPasswordValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
                                throw new common_1.BadRequestException('New password and confirm password do not match');
                            }
                            return [4 /*yield*/, this.vendorUsersService.findById(userId)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('User not found');
                            }
                            return [4 /*yield*/, this.vendorUsersService.comparePassword(changePasswordDto.currentPassword, user.password)];
                        case 2:
                            isCurrentPasswordValid = _a.sent();
                            if (!isCurrentPasswordValid) {
                                throw new common_1.UnauthorizedException('Current password is incorrect');
                            }
                            return [4 /*yield*/, this.vendorUsersService.update(userId, {
                                    password: changePasswordDto.newPassword,
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.authService.invalidateSessionsForUser(userId)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        /**
         * Updates core manufacturer fields. Unverified rows: **manufacturerInitial** and **gpInternalId**
         * are always server-generated from **manufacturerName** (client values ignored). Verified rows:
         * optional manual **gpInternalId** / **manufacturerInitial** when provided.
         */
        ManufacturersService_1.prototype.updateManufacturerDetails = function (id, dto, imagePath) {
            return __awaiter(this, void 0, void 0, function () {
                var notifyEmailChange, manufacturerId_1, manufacturer, email_1, vendorName_1, password_1, error_3, keyPattern;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notifyEmailChange = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            manufacturerId_1 = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerIdGeneration.withTransaction(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var existing, emailChanging, phoneChanging, contactConflicts, isUnverified, updateData, vendorEmailChanged, newEmail, oldEmail, vendorNameChanged, newVendorName, oldVendorName, auto, rawGp, rawIni, dupInitial, dupGp, updated, newPassword;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, this.manufacturerModel
                                                    .findById(manufacturerId_1)
                                                    .session(session)
                                                    .exec()];
                                            case 1:
                                                existing = _c.sent();
                                                if (!existing) {
                                                    throw new common_1.NotFoundException('Manufacturer not found');
                                                }
                                                if (!(dto.vendor_email !== undefined || dto.vendor_phone !== undefined)) return [3 /*break*/, 3];
                                                emailChanging = this.isVendorEmailChanging(dto.vendor_email, existing.vendor_email);
                                                phoneChanging = this.isVendorPhoneChanging(dto.vendor_phone, existing.vendor_phone);
                                                return [4 /*yield*/, this.collectManufacturerContactConflicts(id, {
                                                        email: emailChanging ? dto.vendor_email : undefined,
                                                        phone: phoneChanging ? dto.vendor_phone : undefined,
                                                    }, { session: session })];
                                            case 2:
                                                contactConflicts = _c.sent();
                                                if (contactConflicts.length > 0) {
                                                    throw new common_1.ConflictException(contactConflicts);
                                                }
                                                _c.label = 3;
                                            case 3:
                                                isUnverified = ((_a = existing.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) !== 1;
                                                updateData = {
                                                    manufacturerName: dto.manufacturerName,
                                                    updatedAt: new Date(),
                                                };
                                                vendorEmailChanged = false;
                                                if (dto.vendor_email !== undefined) {
                                                    newEmail = this.normalizeVendorEmail(dto.vendor_email);
                                                    oldEmail = this.normalizeVendorEmail(existing.vendor_email);
                                                    if (newEmail !== oldEmail) {
                                                        vendorEmailChanged = true;
                                                    }
                                                    updateData.vendor_email = newEmail;
                                                }
                                                if (dto.vendor_phone !== undefined) {
                                                    updateData.vendor_phone = String(dto.vendor_phone).trim();
                                                }
                                                vendorNameChanged = false;
                                                if (dto.vendor_name !== undefined) {
                                                    newVendorName = String(dto.vendor_name).trim();
                                                    oldVendorName = String((_b = existing.vendor_name) !== null && _b !== void 0 ? _b : '').trim();
                                                    updateData.vendor_name = newVendorName;
                                                    vendorNameChanged =
                                                        newVendorName !== oldVendorName && newVendorName.length > 0;
                                                }
                                                if (imagePath) {
                                                    updateData.manufacturerImage = imagePath;
                                                }
                                                if (!isUnverified) return [3 /*break*/, 5];
                                                return [4 /*yield*/, this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(dto.manufacturerName, existing._id, {
                                                        manufacturerName: existing.manufacturerName,
                                                        manufacturerInitial: existing.manufacturerInitial,
                                                        gpInternalId: existing.gpInternalId,
                                                    }, session)];
                                            case 4:
                                                auto = _c.sent();
                                                updateData.manufacturerInitial = auto.manufacturerInitial;
                                                updateData.gpInternalId = auto.gpInternalId;
                                                return [3 /*break*/, 6];
                                            case 5:
                                                rawGp = dto.gpInternalId !== undefined
                                                    ? String(dto.gpInternalId).trim()
                                                    : '';
                                                rawIni = dto.manufacturerInitial !== undefined
                                                    ? String(dto.manufacturerInitial).trim()
                                                    : '';
                                                if (rawGp) {
                                                    updateData.gpInternalId = rawGp.toUpperCase();
                                                }
                                                if (rawIni) {
                                                    updateData.manufacturerInitial = rawIni.toUpperCase();
                                                }
                                                _c.label = 6;
                                            case 6:
                                                if (!(updateData.manufacturerInitial !== undefined)) return [3 /*break*/, 8];
                                                return [4 /*yield*/, this.manufacturerModel
                                                        .findOne({
                                                        manufacturerInitial: updateData.manufacturerInitial,
                                                        _id: { $ne: existing._id },
                                                    })
                                                        .session(session)
                                                        .select('_id')
                                                        .lean()
                                                        .exec()];
                                            case 7:
                                                dupInitial = _c.sent();
                                                if (dupInitial) {
                                                    throw new common_1.ConflictException('manufacturerInitial already exists on another manufacturer');
                                                }
                                                _c.label = 8;
                                            case 8:
                                                if (!(updateData.gpInternalId !== undefined)) return [3 /*break*/, 10];
                                                return [4 /*yield*/, this.manufacturerModel
                                                        .findOne({
                                                        gpInternalId: updateData.gpInternalId,
                                                        _id: { $ne: existing._id },
                                                    })
                                                        .session(session)
                                                        .select('_id')
                                                        .lean()
                                                        .exec()];
                                            case 9:
                                                dupGp = _c.sent();
                                                if (dupGp) {
                                                    throw new common_1.ConflictException('gpInternalId already exists on another manufacturer');
                                                }
                                                _c.label = 10;
                                            case 10: return [4 /*yield*/, this.manufacturerModel
                                                    .findByIdAndUpdate(manufacturerId_1, updateData, {
                                                    new: true,
                                                    session: session,
                                                })
                                                    .exec()];
                                            case 11:
                                                updated = _c.sent();
                                                if (!updated) {
                                                    throw new common_1.NotFoundException('Manufacturer not found');
                                                }
                                                if (!(vendorEmailChanged && updateData.vendor_email)) return [3 /*break*/, 14];
                                                return [4 /*yield*/, this.syncVendorUserEmailsForManufacturer(manufacturerId_1, String(updateData.vendor_email), session)];
                                            case 12:
                                                _c.sent();
                                                return [4 /*yield*/, this.resetVendorLoginPasswordsForManufacturer(manufacturerId_1, session)];
                                            case 13:
                                                newPassword = _c.sent();
                                                notifyEmailChange = {
                                                    email: String(updateData.vendor_email),
                                                    vendorName: this.resolveVendorDisplayName(updated),
                                                    password: newPassword,
                                                };
                                                _c.label = 14;
                                            case 14:
                                                if (!(vendorNameChanged && updateData.vendor_name)) return [3 /*break*/, 16];
                                                return [4 /*yield*/, this.syncVendorUserNamesForManufacturer(manufacturerId_1, String(updateData.vendor_name), session)];
                                            case 15:
                                                _c.sent();
                                                _c.label = 16;
                                            case 16: return [2 /*return*/, updated];
                                        }
                                    });
                                }); })];
                        case 2:
                            manufacturer = _a.sent();
                            if (!notifyEmailChange) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(id)];
                        case 3:
                            _a.sent();
                            email_1 = notifyEmailChange.email, vendorName_1 = notifyEmailChange.vendorName, password_1 = notifyEmailChange.password;
                            this.emailService.sendInBackground(function () {
                                return _this.emailService
                                    .sendVendorLoginEmailUpdatedEmail(email_1, vendorName_1, password_1)
                                    .catch(function (error) {
                                    _this.logger.warn("Vendor login credentials email failed for ".concat(email_1, ": ").concat(error.message || 'unknown error'));
                                });
                            });
                            _a.label = 4;
                        case 4: return [2 /*return*/, manufacturer];
                        case 5:
                            error_3 = _a.sent();
                            if ((error_3 === null || error_3 === void 0 ? void 0 : error_3.code) === 11000) {
                                keyPattern = error_3 === null || error_3 === void 0 ? void 0 : error_3.keyPattern;
                                if (keyPattern && ('email' in keyPattern || 'vendor_email' in keyPattern)) {
                                    throw new common_1.ConflictException(this.vendorEmailDuplicateMessage());
                                }
                                if (keyPattern &&
                                    ('phone' in keyPattern || 'vendor_phone' in keyPattern)) {
                                    throw new common_1.ConflictException(global_phone_uniqueness_service_1.GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
                                }
                                throw new common_1.ConflictException('Duplicate manufacturer identifier (initial or internal id)');
                            }
                            if (error_3 instanceof common_1.NotFoundException ||
                                error_3 instanceof common_1.ConflictException) {
                                throw error_3;
                            }
                            if (error_3.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_3.message || 'Failed to update manufacturer');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.fireManufacturerApprovedNotification = function (manufacturer) {
            var _this = this;
            var _a, _b;
            var manufacturerId = manufacturer._id.toString();
            var manufacturerName = String((_b = (_a = manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : manufacturer.vendor_name) !== null && _b !== void 0 ? _b : '').trim();
            var vendorEmail = this.normalizeVendorEmail(manufacturer.vendor_email);
            this.lifecycleNotification
                .notifyManufacturerApproved(manufacturerId, {
                manufacturerName: manufacturerName || undefined,
                vendorEmail: vendorEmail || undefined,
            })
                .catch(function (err) {
                return _this.logger.warn("[manufacturerApproved] Notification failed for ".concat(manufacturerId, ": ").concat(err.message));
            });
        };
        /** Verifies an unverified manufacturer (confirm action). */
        ManufacturersService_1.prototype.verifyManufacturer = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, wasUnverified, updated, loginEmail;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _b.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            this.assertManufacturerAccountNotDeleted(manufacturer);
                            wasUnverified = ((_a = manufacturer.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) !== 1;
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    manufacturerStatus: 1,
                                    vendor_status: 1,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _b.sent();
                            loginEmail = this.normalizeVendorEmail(updated === null || updated === void 0 ? void 0 : updated.vendor_email);
                            if (!(updated && loginEmail)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.syncVendorUserEmailsForManufacturer(manufacturerId, loginEmail)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            if (!(updated && wasUnverified)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.tryConvertManufacturerLeadInZoho(updated, 'verifyManufacturer')];
                        case 5:
                            _b.sent();
                            this.fireManufacturerApprovedNotification(updated);
                            return [3 /*break*/, 8];
                        case 6:
                            if (!updated) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.tryConvertManufacturerLeadInZoho(updated, 'verifyManufacturer')];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8: return [2 /*return*/, updated];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.convertVerifiedManufacturerLeadInZoho = function (manufacturer) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorInternalId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorInternalId = String((_a = manufacturer.gpInternalId) !== null && _a !== void 0 ? _a : '').trim();
                            if (!vendorInternalId) {
                                this.logger.warn("[verifyManufacturer] Skipping Zoho vendor lead conversion for ".concat(manufacturer._id, ": gpInternalId missing"));
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.zohoDealsService.convertRegisteredVendorLead({
                                    manufacturerId: manufacturer._id.toString(),
                                    vendorInternalId: vendorInternalId,
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.tryConvertManufacturerLeadInZoho = function (manufacturer, source) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.convertVerifiedManufacturerLeadInZoho(manufacturer).catch(function (error) {
                                _this.logger.warn("[".concat(source, "] Zoho vendor lead conversion failed for ").concat(manufacturer._id, ": ").concat((error === null || error === void 0 ? void 0 : error.message) || error));
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.assertCoreFieldsPresentForActivation = function (manufacturer) {
            var _a, _b;
            var gpInternalId = ((_a = manufacturer.gpInternalId) !== null && _a !== void 0 ? _a : '').toString().trim();
            var manufacturerInitial = ((_b = manufacturer.manufacturerInitial) !== null && _b !== void 0 ? _b : '')
                .toString()
                .trim();
            if (!gpInternalId || !manufacturerInitial) {
                throw new common_1.ConflictException('Cannot activate manufacturer. Please fill gpInternalId and manufacturerInitial first.');
            }
        };
        /** Soft-deleted accounts (DPDP Complete) must never be reactivated. */
        ManufacturersService_1.prototype.assertManufacturerAccountNotDeleted = function (manufacturer) {
            if (manufacturer.accountDeletedAt) {
                throw new common_1.ConflictException('This manufacturer account was deleted and cannot be reactivated.');
            }
        };
        /**
         * Toggles vendor active/inactive for verified manufacturer.
         * Keeps manufacturerStatus pinned at 1.
         */
        ManufacturersService_1.prototype.toggleManufacturerStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, wasUnverified, currentVendor, newVendor, updated, error_4;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 9, , 10]);
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _c.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            this.assertManufacturerAccountNotDeleted(manufacturer);
                            wasUnverified = ((_a = manufacturer.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) !== 1;
                            currentVendor = (_b = manufacturer.vendor_status) !== null && _b !== void 0 ? _b : 0;
                            newVendor = currentVendor === 1 ? 0 : 1;
                            if (newVendor === 1) {
                                this.assertCoreFieldsPresentForActivation(manufacturer);
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    manufacturerStatus: 1,
                                    vendor_status: newVendor,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _c.sent();
                            if (!(updated && wasUnverified && newVendor === 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.tryConvertManufacturerLeadInZoho(updated, 'toggleManufacturerStatus')];
                        case 3:
                            _c.sent();
                            this.fireManufacturerApprovedNotification(updated);
                            return [3 /*break*/, 8];
                        case 4:
                            if (!(updated && newVendor === 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(manufacturerId.toString())];
                        case 5:
                            _c.sent();
                            this.lifecycleNotification
                                .notifyManufacturerInactive(manufacturerId.toString())
                                .catch(function (err) {
                                return _this.logger.warn("[toggleManufacturerStatus] Inactive notification failed: ".concat(err.message));
                            });
                            return [3 /*break*/, 8];
                        case 6:
                            if (!(updated && newVendor === 1)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.tryConvertManufacturerLeadInZoho(updated, 'toggleManufacturerStatus')];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8: return [2 /*return*/, updated];
                        case 9:
                            error_4 = _c.sent();
                            if (error_4 instanceof common_1.NotFoundException ||
                                error_4 instanceof common_1.ConflictException) {
                                throw error_4;
                            }
                            if (error_4.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_4.message || 'Failed to update manufacturer status');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Lightweight vendor_status update for verified manufacturer.
         * Ensures manufacturerStatus stays 1 and rejects toggling for unverified manufacturers.
         */
        ManufacturersService_1.prototype.setVendorStatusForVerified = function (id, vendor_status) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, updated, error_5;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _b.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            this.assertManufacturerAccountNotDeleted(manufacturer);
                            if (((_a = manufacturer.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) !== 1) {
                                throw new common_1.ConflictException('Only verified manufacturers can be toggled');
                            }
                            if (vendor_status === 1) {
                                this.assertCoreFieldsPresentForActivation(manufacturer);
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    manufacturerStatus: 1,
                                    vendor_status: vendor_status,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _b.sent();
                            if (!(updated && vendor_status === 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(manufacturerId.toString())];
                        case 3:
                            _b.sent();
                            this.lifecycleNotification
                                .notifyManufacturerInactive(manufacturerId.toString())
                                .catch(function (err) {
                                return _this.logger.warn("[setVendorStatusForVerified] Inactive notification failed: ".concat(err.message));
                            });
                            _b.label = 4;
                        case 4:
                            if (!(updated && vendor_status === 1)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.tryConvertManufacturerLeadInZoho(updated, 'setVendorStatusForVerified')];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [2 /*return*/, updated];
                        case 7:
                            error_5 = _b.sent();
                            if (error_5 instanceof common_1.NotFoundException ||
                                error_5 instanceof common_1.ConflictException) {
                                throw error_5;
                            }
                            if (error_5.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_5.message || 'Failed to update vendor status');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Soft-delete a manufacturer after an Account Deletion request is Completed:
         * - Sets vendor_status = 0 and accountDeletedAt (blocks login / JWT access)
         * - Frees vendor_email / vendor_phone (and portal user emails) for re-registration
         * - Invalidates sessions
         * Certified products stay in DB but are hidden from the public website via visibility filters.
         */
        ManufacturersService_1.prototype.softDeleteAccountAfterDeletionRequest = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, stamp, idStr, originalEmail, originalPhone, freedEmail, freedPhone, updated, portalUsers, i, user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _b.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            if (manufacturer.accountDeletedAt) {
                                return [2 /*return*/, manufacturer];
                            }
                            stamp = Date.now();
                            idStr = manufacturerId.toString();
                            originalEmail = this.normalizeVendorEmail(manufacturer.vendor_email);
                            originalPhone = String((_a = manufacturer.vendor_phone) !== null && _a !== void 0 ? _a : '').trim();
                            freedEmail = "deleted.".concat(idStr, ".").concat(stamp, "@account-deleted.local");
                            freedPhone = "DEL-".concat(idStr.slice(-8), "-").concat(stamp).slice(0, 32);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    vendor_status: 0,
                                    accountDeletedAt: new Date(),
                                    deletedVendorEmail: originalEmail || undefined,
                                    deletedVendorPhone: originalPhone || undefined,
                                    vendor_email: freedEmail,
                                    vendor_phone: freedPhone,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _b.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .find({
                                    $or: [{ manufacturerId: manufacturerId }, { vendorId: manufacturerId }],
                                    type: { $in: ['vendor', 'partner'] },
                                })
                                    .select('_id email phone')
                                    .exec()];
                        case 3:
                            portalUsers = _b.sent();
                            i = 0;
                            _b.label = 4;
                        case 4:
                            if (!(i < portalUsers.length)) return [3 /*break*/, 7];
                            user = portalUsers[i];
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(user._id, {
                                    status: 2,
                                    email: "deleted.user.".concat(idStr, ".").concat(i, ".").concat(stamp, "@account-deleted.local"),
                                    phone: "DELU-".concat(idStr.slice(-6), "-").concat(i, "-").concat(stamp).slice(0, 32),
                                    updatedAt: new Date(),
                                })
                                    .exec()];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            i++;
                            return [3 /*break*/, 4];
                        case 7: return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(idStr)];
                        case 8:
                            _b.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.countForManufacturer = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, manufacturer_product_count, manufacturer_vendor_count;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.productModel
                                    .countDocuments({
                                    manufacturerId: manufacturerId,
                                    $or: [
                                        { is_deleted: { $ne: true } },
                                        { is_deleted: { $exists: false } },
                                    ],
                                })
                                    .exec(),
                                this.vendorUserModel
                                    .countDocuments({
                                    manufacturerId: manufacturerId,
                                    type: 'vendor',
                                    status: { $ne: 2 },
                                })
                                    .exec(),
                            ])];
                        case 1:
                            _a = _b.sent(), manufacturer_product_count = _a[0], manufacturer_vendor_count = _a[1];
                            return [2 /*return*/, { manufacturer_product_count: manufacturer_product_count, manufacturer_vendor_count: manufacturer_vendor_count }];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.buildListFilter = function (query, restrictToManufacturerIds) {
            var parts = [];
            if (restrictToManufacturerIds && restrictToManufacturerIds.length > 0) {
                parts.push({ _id: { $in: restrictToManufacturerIds } });
            }
            if (query.search !== undefined && query.search.trim() !== '') {
                var rx = new RegExp(escapeRegex(query.search.trim()), 'i');
                parts.push({
                    $or: [
                        { manufacturerName: rx },
                        { vendor_name: rx },
                        { vendor_email: rx },
                        { gpInternalId: rx },
                    ],
                });
            }
            var scopeFilter = (0, list_manufacturers_query_util_1.resolveManufacturerScopeFilter)(query);
            if (scopeFilter) {
                parts.push(scopeFilter);
            }
            var vendorStatusFilter = (0, list_manufacturers_query_util_1.resolveVendorStatusFilter)(query);
            if (vendorStatusFilter) {
                parts.push(vendorStatusFilter);
            }
            if (query.manufacturerName !== undefined &&
                query.manufacturerName.trim() !== '') {
                parts.push({
                    manufacturerName: new RegExp(escapeRegex(query.manufacturerName.trim()), 'i'),
                });
            }
            if (query.gpInternalId !== undefined && query.gpInternalId.trim() !== '') {
                parts.push({
                    gpInternalId: new RegExp(escapeRegex(query.gpInternalId.trim()), 'i'),
                });
            }
            if (query.manufacturerInitial !== undefined &&
                query.manufacturerInitial.trim() !== '') {
                parts.push({
                    manufacturerInitial: new RegExp(escapeRegex(query.manufacturerInitial.trim()), 'i'),
                });
            }
            if (parts.length === 0) {
                return {};
            }
            if (parts.length === 1) {
                return parts[0];
            }
            return { $and: parts };
        };
        /** One row for CSV/XLSX: mirrors admin grid Initial + Status (toggle = vendor active). */
        ManufacturersService_1.prototype.buildManufacturerExportRows = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var sortBy, order, sortOrder, sort, rawRows, doc, filter, manufacturerIds, vendorUsersByMfgId;
                var _a;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            sortBy = (_b = query.sortBy) !== null && _b !== void 0 ? _b : 'createdAt';
                            order = (_c = query.order) !== null && _c !== void 0 ? _c : 'desc';
                            sortOrder = order === 'desc' ? -1 : 1;
                            sort = (_a = {}, _a[sortBy] = sortOrder, _a);
                            if (!query.id) return [3 /*break*/, 2];
                            if (!mongoose_1.Types.ObjectId.isValid(query.id)) {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(query.id)
                                    .lean()
                                    .exec()];
                        case 1:
                            doc = _d.sent();
                            rawRows = doc ? [doc] : [];
                            return [3 /*break*/, 4];
                        case 2:
                            filter = this.buildListFilter(query);
                            return [4 /*yield*/, this.manufacturerModel
                                    .find(filter)
                                    .sort(sort)
                                    .lean()
                                    .exec()];
                        case 3:
                            rawRows = (_d.sent());
                            _d.label = 4;
                        case 4:
                            manufacturerIds = rawRows.map(function (raw) { return new mongoose_1.Types.ObjectId(String(raw._id)); });
                            return [4 /*yield*/, this.loadPrimaryVendorUsersByManufacturerIds(manufacturerIds)];
                        case 5:
                            vendorUsersByMfgId = _d.sent();
                            return [2 /*return*/, Promise.all(rawRows.map(function (raw) { return __awaiter(_this, void 0, void 0, function () {
                                    var mid, counts, ini, mSt, vSt, vendorDisplay;
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                    return __generator(this, function (_k) {
                                        switch (_k.label) {
                                            case 0:
                                                mid = new mongoose_1.Types.ObjectId(String(raw._id));
                                                return [4 /*yield*/, this.countForManufacturer(mid)];
                                            case 1:
                                                counts = _k.sent();
                                                ini = String((_a = raw.manufacturerInitial) !== null && _a !== void 0 ? _a : '').trim();
                                                mSt = Number((_b = raw.manufacturerStatus) !== null && _b !== void 0 ? _b : 0);
                                                vSt = Number((_c = raw.vendor_status) !== null && _c !== void 0 ? _c : 0);
                                                vendorDisplay = this.resolveVendorDisplayName({
                                                    vendor_name: raw.vendor_name,
                                                    manufacturerName: raw.manufacturerName,
                                                }, (_d = vendorUsersByMfgId.get(mid.toString())) === null || _d === void 0 ? void 0 : _d.name);
                                                return [2 /*return*/, {
                                                        _id: String(raw._id),
                                                        manufacturerName: String((_e = raw.manufacturerName) !== null && _e !== void 0 ? _e : ''),
                                                        companyName: String((_f = raw.manufacturerName) !== null && _f !== void 0 ? _f : ''),
                                                        gpInternalId: String((_g = raw.gpInternalId) !== null && _g !== void 0 ? _g : ''),
                                                        initial: ini,
                                                        manufacturerStatus: mSt,
                                                        manufacturerStatusLabel: manufacturerStatusLabel(mSt),
                                                        vendor_status: vSt,
                                                        vendorStatusLabel: vendorStatusLabel(vSt),
                                                        statusToggle: vSt === 1 ? 'On' : 'Off',
                                                        vendor_name: vendorDisplay,
                                                        vendorName: vendorDisplay,
                                                        vendor_email: String((_h = raw.vendor_email) !== null && _h !== void 0 ? _h : ''),
                                                        vendor_phone: String((_j = raw.vendor_phone) !== null && _j !== void 0 ? _j : ''),
                                                        manufacturer_product_count: counts.manufacturer_product_count,
                                                        manufacturer_vendor_count: counts.manufacturer_vendor_count,
                                                        createdAt: raw.createdAt,
                                                        updatedAt: raw.updatedAt,
                                                    }];
                                        }
                                    });
                                }); }))];
                    }
                });
            });
        };
        /**
         * Full export (no pagination cap): same filters/sort as the listing.
         * Columns match the admin Excel layout, including **Initial** and **Status** (On/Off = vendor active).
         */
        ManufacturersService_1.prototype.buildCsvExport = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, header, lines;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.buildManufacturerExportRows(query)];
                        case 1:
                            rows = _a.sent();
                            header = [
                                'S.No',
                                'Manufacturer Name',
                                'GP Internal ID',
                                'Vendor Name',
                                'Vendor Email',
                                'Vendor Phone',
                                'Initial',
                                'Status',
                                'Manufacturer Verification',
                                'Vendor Status Detail',
                                'Product Count',
                                'Vendor User Count',
                                'MongoDB _id',
                                'Created At',
                                'Updated At',
                            ];
                            lines = [header.join(',')];
                            rows.forEach(function (r, idx) {
                                var row = [
                                    idx + 1,
                                    r.manufacturerName,
                                    r.gpInternalId,
                                    r.vendor_name,
                                    r.vendor_email,
                                    r.vendor_phone,
                                    r.initial,
                                    r.statusToggle,
                                    r.manufacturerStatusLabel,
                                    r.vendorStatusLabel,
                                    r.manufacturer_product_count,
                                    r.manufacturer_vendor_count,
                                    r._id,
                                    r.createdAt ? new Date(r.createdAt).toISOString() : '',
                                    r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
                                ]
                                    .map(csvEscape)
                                    .join(',');
                                lines.push(row);
                            });
                            return [2 /*return*/, lines.join('\r\n')];
                    }
                });
            });
        };
        /** Same data as CSV, as `.xlsx` for Excel (includes Initial + Status columns). */
        ManufacturersService_1.prototype.buildXlsxExport = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, workbook, ws, raw, buffer, stamp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.buildManufacturerExportRows(query)];
                        case 1:
                            rows = _a.sent();
                            workbook = new exceljs_1.default.Workbook();
                            ws = workbook.addWorksheet('Manufacturers');
                            ws.columns = [
                                { header: 'S.No', key: 'sno', width: 8 },
                                { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
                                { header: 'GP Internal ID', key: 'gpInternalId', width: 18 },
                                { header: 'Vendor Name', key: 'vendor_name', width: 24 },
                                { header: 'Vendor Email', key: 'vendor_email', width: 34 },
                                { header: 'Vendor Phone', key: 'vendor_phone', width: 18 },
                                { header: 'Initial', key: 'initial', width: 14 },
                                { header: 'Status', key: 'status', width: 12 },
                                { header: 'Manufacturer Verification', key: 'mfgVerify', width: 22 },
                                { header: 'Vendor Status Detail', key: 'vendorDetail', width: 18 },
                                { header: 'Created At', key: 'createdAt', width: 26 },
                            ];
                            rows.forEach(function (r, i) {
                                ws.addRow({
                                    sno: i + 1,
                                    manufacturerName: r.manufacturerName,
                                    gpInternalId: r.gpInternalId,
                                    vendor_name: r.vendor_name,
                                    vendor_email: r.vendor_email,
                                    vendor_phone: r.vendor_phone,
                                    initial: r.initial,
                                    status: r.statusToggle,
                                    mfgVerify: r.manufacturerStatusLabel,
                                    vendorDetail: r.vendorStatusLabel,
                                    createdAt: r.createdAt
                                        ? new Date(r.createdAt).toISOString()
                                        : '',
                                });
                            });
                            return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                        case 2:
                            raw = _a.sent();
                            buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
                            stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
                            return [2 /*return*/, {
                                    buffer: buffer,
                                    fileName: "manufacturers-export-".concat(stamp, ".xlsx"),
                                }];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.countWebsitePublicProductsByManufacturer = function (manufacturerIds) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, out, _i, rows_1, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!manufacturerIds.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $match: (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)({
                                            manufacturerId: { $in: manufacturerIds },
                                        }),
                                    },
                                    {
                                        $group: {
                                            _id: '$manufacturerId',
                                            manufacturer_product_count: { $sum: 1 },
                                        },
                                    },
                                ])
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            out = new Map();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                out.set(String(row._id), row.manufacturer_product_count);
                            }
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        /**
         * Public website manufacturers listing: only manufacturers with at least one certified,
         * non–soft-deleted product, excluding inactive / account-deleted manufacturers.
         */
        ManufacturersService_1.prototype.findAllPaginatedForWebsitePublic = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerIds, page, limit, visibleManufacturerIds, page, limit;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .distinct('manufacturerId', (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)())
                                .exec()];
                        case 1:
                            manufacturerIds = _e.sent();
                            if (!manufacturerIds.length) {
                                page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
                                limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 10;
                                return [2 /*return*/, {
                                        message: 'Manufacturers retrieved successfully',
                                        data: [],
                                        total: 0,
                                        totalCount: 0,
                                        page: page,
                                        limit: limit,
                                        totalPages: 0,
                                        currentPage: page,
                                    }];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .find(__assign({ _id: { $in: manufacturerIds } }, (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)('')))
                                    .select('_id')
                                    .lean()
                                    .exec()
                                    .then(function (rows) { return rows.map(function (r) { return r._id; }); })];
                        case 2:
                            visibleManufacturerIds = _e.sent();
                            if (!visibleManufacturerIds.length) {
                                page = (_c = query.page) !== null && _c !== void 0 ? _c : 1;
                                limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 10;
                                return [2 /*return*/, {
                                        message: 'Manufacturers retrieved successfully',
                                        data: [],
                                        total: 0,
                                        totalCount: 0,
                                        page: page,
                                        limit: limit,
                                        totalPages: 0,
                                        currentPage: page,
                                    }];
                            }
                            return [2 /*return*/, this.findAllPaginated(query, visibleManufacturerIds, {
                                    useWebsitePublicCertifiedProductCount: true,
                                })];
                    }
                });
            });
        };
        ManufacturersService_1.prototype.findAllPaginated = function (query, restrictToManufacturerIds, options) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, sortBy, order, sortOrder, sort, filter, skip, _a, rows, total, manufacturerIds, useWebsitePublicCertifiedProductCount, _b, vendorUsersByMfgId, publicProductCountsByManufacturerId, data, totalPages;
                var _c;
                var _this = this;
                var _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            page = (_d = query.page) !== null && _d !== void 0 ? _d : 1;
                            limit = (_e = query.limit) !== null && _e !== void 0 ? _e : 10;
                            sortBy = (_f = query.sortBy) !== null && _f !== void 0 ? _f : 'createdAt';
                            order = (_g = query.order) !== null && _g !== void 0 ? _g : 'desc';
                            sortOrder = order === 'desc' ? -1 : 1;
                            sort = (_c = {}, _c[sortBy] = sortOrder, _c);
                            filter = this.buildListFilter(query, restrictToManufacturerIds);
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.manufacturerModel
                                        .find(filter)
                                        .sort(sort)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.manufacturerModel.countDocuments(filter).exec(),
                                ])];
                        case 1:
                            _a = _h.sent(), rows = _a[0], total = _a[1];
                            manufacturerIds = rows.map(function (m) { return new mongoose_1.Types.ObjectId(String(m._id)); });
                            useWebsitePublicCertifiedProductCount = (options === null || options === void 0 ? void 0 : options.useWebsitePublicCertifiedProductCount) === true;
                            return [4 /*yield*/, Promise.all([
                                    this.loadPrimaryVendorUsersByManufacturerIds(manufacturerIds),
                                    useWebsitePublicCertifiedProductCount
                                        ? this.countWebsitePublicProductsByManufacturer(manufacturerIds)
                                        : Promise.resolve(undefined),
                                ])];
                        case 2:
                            _b = _h.sent(), vendorUsersByMfgId = _b[0], publicProductCountsByManufacturerId = _b[1];
                            return [4 /*yield*/, Promise.all(rows.map(function (m) { return __awaiter(_this, void 0, void 0, function () {
                                    var mid, primaryVendor, manufacturer_product_count, counts;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                mid = new mongoose_1.Types.ObjectId(String(m._id));
                                                primaryVendor = vendorUsersByMfgId.get(mid.toString());
                                                if (useWebsitePublicCertifiedProductCount) {
                                                    manufacturer_product_count = (_a = publicProductCountsByManufacturerId === null || publicProductCountsByManufacturerId === void 0 ? void 0 : publicProductCountsByManufacturerId.get(mid.toString())) !== null && _a !== void 0 ? _a : 0;
                                                    return [2 /*return*/, this.formatManufacturerApiRow(m, {
                                                            primaryVendorUserName: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.name,
                                                            primaryVendorUserId: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.userId,
                                                            manufacturer_product_count: manufacturer_product_count,
                                                            productCount: manufacturer_product_count,
                                                        })];
                                                }
                                                return [4 /*yield*/, this.countForManufacturer(mid)];
                                            case 1:
                                                counts = _b.sent();
                                                return [2 /*return*/, this.formatManufacturerApiRow(m, {
                                                        primaryVendorUserName: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.name,
                                                        primaryVendorUserId: primaryVendor === null || primaryVendor === void 0 ? void 0 : primaryVendor.userId,
                                                        manufacturer_product_count: counts.manufacturer_product_count,
                                                        manufacturer_vendor_count: counts.manufacturer_vendor_count,
                                                    })];
                                        }
                                    });
                                }); }))];
                        case 3:
                            data = _h.sent();
                            totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
                            return [2 /*return*/, {
                                    message: 'Manufacturers retrieved successfully',
                                    data: data,
                                    total: total,
                                    totalCount: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: totalPages,
                                    currentPage: page,
                                }];
                    }
                });
            });
        };
        /** Delete verified manufacturer only when both counts are zero. */
        ManufacturersService_1.prototype.deleteManufacturerWithConstraint = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, counts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            if (manufacturer.manufacturerStatus !== 1) {
                                throw new common_1.BadRequestException('Use unverified delete endpoint for unverified manufacturer');
                            }
                            return [4 /*yield*/, this.countForManufacturer(manufacturerId)];
                        case 2:
                            counts = _a.sent();
                            if (counts.manufacturer_product_count > 0 ||
                                counts.manufacturer_vendor_count > 0) {
                                throw new common_1.ConflictException('Delete blocked: manufacturer_product_count and manufacturer_vendor_count must be 0');
                            }
                            return [4 /*yield*/, this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(manufacturer.gpInternalId)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { _id: id }];
                    }
                });
            });
        };
        /** Dedicated endpoint: delete only if unverified. */
        ManufacturersService_1.prototype.deleteUnverifiedById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, manufacturerName, vendorEmail;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _d.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            if (manufacturer.manufacturerStatus === 1) {
                                throw new common_1.BadRequestException('Only unverified manufacturer can be deleted from this endpoint');
                            }
                            manufacturerName = String((_b = (_a = manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : manufacturer.vendor_name) !== null && _b !== void 0 ? _b : 'Manufacturer').trim();
                            vendorEmail = String((_c = manufacturer.vendor_email) !== null && _c !== void 0 ? _c : '')
                                .trim()
                                .toLowerCase();
                            return [4 /*yield*/, this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec()];
                        case 2:
                            _d.sent();
                            this.lifecycleNotification
                                .notifyManufacturerRejected(manufacturerName, id, { vendorEmail: vendorEmail })
                                .catch(function (err) {
                                return _this.logger.warn("[deleteUnverifiedById] Rejection notification failed: ".concat(err.message));
                            });
                            return [4 /*yield*/, this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(manufacturer.gpInternalId)];
                        case 3:
                            _d.sent();
                            return [2 /*return*/, { _id: id }];
                    }
                });
            });
        };
        return ManufacturersService_1;
    }());
    __setFunctionName(_classThis, "ManufacturersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManufacturersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManufacturersService = _classThis;
}();
exports.ManufacturersService = ManufacturersService;
