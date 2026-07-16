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
exports.GlobalPhoneUniquenessService = exports.ADMIN_MOBILE_UNAVAILABLE_MESSAGE = exports.GLOBAL_PHONE_UNAVAILABLE_MESSAGE = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var phone_lookup_util_1 = require("../utils/phone-lookup.util");
exports.GLOBAL_PHONE_UNAVAILABLE_MESSAGE = 'Phone number already exists';
exports.ADMIN_MOBILE_UNAVAILABLE_MESSAGE = 'Mobile Number already exists';
var GlobalPhoneUniquenessService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GlobalPhoneUniquenessService = _classThis = /** @class */ (function () {
        function GlobalPhoneUniquenessService_1(vendorUserModel, manufacturerModel) {
            this.vendorUserModel = vendorUserModel;
            this.manufacturerModel = manufacturerModel;
        }
        /**
         * Ensures **phone** is not used by any active portal user (admin, vendor, staff, partner)
         * or any manufacturer's **vendor_phone**.
         */
        GlobalPhoneUniquenessService_1.prototype.assertPhoneAvailable = function (phone_1) {
            return __awaiter(this, arguments, void 0, function (phone, options) {
                var digits, excludeUserId, excludeManufacturerId, session, _a, conflictMessage, excludeUserOid, excludeMfgOid, userClauses, userFilter, userQuery, mfgClauses, mfgFilter, mfgQuery;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            digits = (0, phone_lookup_util_1.normalizePhoneDigits)(phone);
                            if (digits.length < 7) {
                                return [2 /*return*/];
                            }
                            excludeUserId = options.excludeUserId, excludeManufacturerId = options.excludeManufacturerId, session = options.session, _a = options.conflictMessage, conflictMessage = _a === void 0 ? exports.GLOBAL_PHONE_UNAVAILABLE_MESSAGE : _a;
                            excludeUserOid = this.toObjectId(excludeUserId);
                            excludeMfgOid = this.toObjectId(excludeManufacturerId);
                            userClauses = (0, phone_lookup_util_1.buildPhoneFieldMatchClauses)('phone', phone);
                            if (!userClauses.length) return [3 /*break*/, 2];
                            userFilter = {
                                status: { $ne: 2 },
                                $or: userClauses,
                            };
                            if (excludeUserOid) {
                                userFilter._id = { $ne: excludeUserOid };
                            }
                            userQuery = this.vendorUserModel
                                .findOne(userFilter)
                                .select('_id type phone')
                                .lean();
                            if (session)
                                userQuery.session(session);
                            return [4 /*yield*/, userQuery.exec()];
                        case 1:
                            if (_b.sent()) {
                                throw new common_1.ConflictException(conflictMessage);
                            }
                            _b.label = 2;
                        case 2:
                            mfgClauses = (0, phone_lookup_util_1.buildPhoneFieldMatchClauses)('vendor_phone', phone);
                            if (!mfgClauses.length) return [3 /*break*/, 4];
                            mfgFilter = {
                                $and: [
                                    { $or: mfgClauses },
                                    {
                                        $or: [
                                            { accountDeletedAt: { $exists: false } },
                                            { accountDeletedAt: null },
                                        ],
                                    },
                                ],
                            };
                            if (excludeMfgOid) {
                                mfgFilter._id = { $ne: excludeMfgOid };
                            }
                            mfgQuery = this.manufacturerModel
                                .findOne(mfgFilter)
                                .select('_id vendor_phone')
                                .lean();
                            if (session)
                                mfgQuery.session(session);
                            return [4 /*yield*/, mfgQuery.exec()];
                        case 3:
                            if (_b.sent()) {
                                throw new common_1.ConflictException(conflictMessage);
                            }
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GlobalPhoneUniquenessService_1.prototype.isPhoneAvailable = function (phone_1) {
            return __awaiter(this, arguments, void 0, function (phone, options) {
                var e_1;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.assertPhoneAvailable(phone, options)];
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
        GlobalPhoneUniquenessService_1.prototype.toObjectId = function (id) {
            if (!id)
                return undefined;
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            var s = String(id).trim();
            return mongoose_1.Types.ObjectId.isValid(s) ? new mongoose_1.Types.ObjectId(s) : undefined;
        };
        return GlobalPhoneUniquenessService_1;
    }());
    __setFunctionName(_classThis, "GlobalPhoneUniquenessService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalPhoneUniquenessService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalPhoneUniquenessService = _classThis;
}();
exports.GlobalPhoneUniquenessService = GlobalPhoneUniquenessService;
