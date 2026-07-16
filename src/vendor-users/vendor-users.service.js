"use strict";
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
exports.VendorUsersService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var crypto_1 = require("crypto");
var bcrypt = require("bcryptjs");
var vendor_user_manufacturer_rules_util_1 = require("./utils/vendor-user-manufacturer-rules.util");
var vendor_login_email_util_1 = require("./utils/vendor-login-email.util");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var VendorUsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VendorUsersService = _classThis = /** @class */ (function () {
        function VendorUsersService_1(vendorUserModel) {
            this.vendorUserModel = vendorUserModel;
        }
        VendorUsersService_1.prototype.create = function (data, session) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, vendorUser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (0, vendor_user_manufacturer_rules_util_1.assertVendorUserManufacturerRules)({
                                type: data.type,
                                manufacturerId: data.manufacturerId,
                                vendorId: data.vendorId,
                            });
                            if (!data.password) return [3 /*break*/, 2];
                            _a = data;
                            return [4 /*yield*/, bcrypt.hash(data.password, 10)];
                        case 1:
                            _a.password = _b.sent();
                            _b.label = 2;
                        case 2:
                            vendorUser = new this.vendorUserModel(data);
                            if (session) {
                                return [2 /*return*/, vendorUser.save({ session: session })];
                            }
                            return [2 /*return*/, vendorUser.save()];
                    }
                });
            });
        };
        VendorUsersService_1.prototype.findByEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, exact;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = (0, vendor_login_email_util_1.normalizeLoginEmail)(email);
                            if (!normalized) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({ email: normalized, status: { $ne: 2 } })
                                    .exec()];
                        case 1:
                            exact = _a.sent();
                            if (exact) {
                                return [2 /*return*/, exact];
                            }
                            return [2 /*return*/, this.vendorUserModel
                                    .findOne({
                                    email: { $regex: new RegExp("^".concat(escapeRegex(normalized), "$"), 'i') },
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                    }
                });
            });
        };
        /**
         * Login lookup: exact email first, then a single likely typo match (e.g. gmil.com → gmail.com).
         */
        VendorUsersService_1.prototype.findLoginUserByEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, exact, parts, candidates, typoMatches;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = (0, vendor_login_email_util_1.normalizeLoginEmail)(email);
                            if (!normalized) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.findByEmail(normalized)];
                        case 1:
                            exact = _a.sent();
                            if (exact) {
                                return [2 /*return*/, exact];
                            }
                            parts = (0, vendor_login_email_util_1.splitLoginEmail)(normalized);
                            if (!parts) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .find({
                                    email: { $regex: new RegExp("^".concat(escapeRegex(parts.local), "@"), 'i') },
                                    status: { $ne: 2 },
                                })
                                    .limit(10)
                                    .exec()];
                        case 2:
                            candidates = _a.sent();
                            typoMatches = candidates.filter(function (candidate) {
                                var _a;
                                var candidateDomain = (_a = (0, vendor_login_email_util_1.splitLoginEmail)(candidate.email)) === null || _a === void 0 ? void 0 : _a.domain;
                                return (candidateDomain &&
                                    (0, vendor_login_email_util_1.isLikelyEmailDomainTypo)(parts.domain, candidateDomain));
                            });
                            if (typoMatches.length === 1) {
                                return [2 /*return*/, typoMatches[0]];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        /**
         * First vendor/partner login row for a manufacturer (by `manufacturerId` or legacy `vendorId`).
         * Used when login email matches **manufacturer.vendor_email** but not **vendor_users.email** (legacy data).
         */
        VendorUsersService_1.prototype.findPrimaryLoginUserForManufacturer = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var mid, rows;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(manufacturerId)) {
                                return [2 /*return*/, null];
                            }
                            mid = new mongoose_1.Types.ObjectId(manufacturerId);
                            return [4 /*yield*/, this.vendorUserModel
                                    .find({
                                    $or: [{ manufacturerId: mid }, { vendorId: mid }],
                                    type: { $in: ['vendor', 'partner'] },
                                })
                                    .sort({ createdAt: 1 })
                                    .limit(1)
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                    }
                });
            });
        };
        VendorUsersService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vendorUserModel.findById(id).exec()];
                });
            });
        };
        VendorUsersService_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!data.password) return [3 /*break*/, 2];
                            _a = data;
                            return [4 /*yield*/, bcrypt.hash(data.password, 10)];
                        case 1:
                            _a.password = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, this.vendorUserModel
                                .findByIdAndUpdate(id, data, { new: true })
                                .exec()];
                    }
                });
            });
        };
        VendorUsersService_1.prototype.verifyOtp = function (email, otp) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findByEmail(email)];
                        case 1:
                            user = _a.sent();
                            if (!user || user.otp !== otp) {
                                return [2 /*return*/, null];
                            }
                            user.isVerified = true;
                            user.otp = undefined;
                            return [2 /*return*/, user.save()];
                    }
                });
            });
        };
        /**
         * Verify a plaintext password against the stored hash.
         * Supports bcrypt (current) and legacy MySQL MD5 hashes from migration.
         */
        VendorUsersService_1.prototype.comparePassword = function (password, hashedPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var stored, plain;
                return __generator(this, function (_a) {
                    stored = String(hashedPassword !== null && hashedPassword !== void 0 ? hashedPassword : '').trim();
                    plain = String(password !== null && password !== void 0 ? password : '');
                    if (!stored || plain === '') {
                        return [2 /*return*/, false];
                    }
                    if (this.isBcryptHash(stored)) {
                        return [2 /*return*/, bcrypt.compare(plain, stored)];
                    }
                    if (this.isMd5Hash(stored)) {
                        return [2 /*return*/, this.md5Hex(plain) === stored.toLowerCase()];
                    }
                    return [2 /*return*/, false];
                });
            });
        };
        /**
         * After a successful login with a legacy MD5 password, re-hash to bcrypt
         * so subsequent logins use the modern hash without forcing a password change.
         */
        VendorUsersService_1.prototype.upgradeLegacyPasswordIfNeeded = function (userId, plainPassword, currentHash) {
            return __awaiter(this, void 0, void 0, function () {
                var passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isMd5Hash(String(currentHash !== null && currentHash !== void 0 ? currentHash : '').trim())) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, bcrypt.hash(plainPassword, 10)];
                        case 1:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(userId, {
                                    $set: { password: passwordHash },
                                    $unset: { legacyPasswordHash: 1, legacyPasswordAlgo: 1 },
                                })
                                    .exec()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        VendorUsersService_1.prototype.isBcryptHash = function (value) {
            return /^\$2[aby]?\$\d{2}\$/.test(value);
        };
        VendorUsersService_1.prototype.isMd5Hash = function (value) {
            return /^[a-f0-9]{32}$/i.test(value);
        };
        VendorUsersService_1.prototype.md5Hex = function (value) {
            return (0, crypto_1.createHash)('md5').update(value, 'utf8').digest('hex');
        };
        return VendorUsersService_1;
    }());
    __setFunctionName(_classThis, "VendorUsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorUsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorUsersService = _classThis;
}();
exports.VendorUsersService = VendorUsersService;
