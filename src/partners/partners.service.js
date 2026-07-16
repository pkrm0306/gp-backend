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
exports.PartnersService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var bcrypt = require("bcryptjs");
var phone_lookup_util_1 = require("../common/utils/phone-lookup.util");
var partner_phone_util_1 = require("./utils/partner-phone.util");
var notification_recipient_groups_util_1 = require("../notifications/utils/notification-recipient-groups.util");
var PartnersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PartnersService = _classThis = /** @class */ (function () {
        function PartnersService_1(vendorUserModel, manufacturerModel, globalPhoneUniqueness, emailService, configService) {
            this.vendorUserModel = vendorUserModel;
            this.manufacturerModel = manufacturerModel;
            this.globalPhoneUniqueness = globalPhoneUniqueness;
            this.emailService = emailService;
            this.configService = configService;
            this.logger = new common_1.Logger(PartnersService.name);
        }
        PartnersService_1.prototype.toManufacturerObjectId = function (vendorId) {
            try {
                return new mongoose_1.Types.ObjectId(vendorId);
            }
            catch (_a) {
                throw new common_1.BadRequestException('Invalid vendor ID format');
            }
        };
        PartnersService_1.prototype.manufacturerScopeFilter = function (manufacturerObjectId) {
            return {
                $or: [
                    { manufacturerId: manufacturerObjectId },
                    { vendorId: manufacturerObjectId },
                ],
            };
        };
        PartnersService_1.prototype.resolvePhone = function (dto) {
            return (0, partner_phone_util_1.resolvePartnerPhone)(dto);
        };
        PartnersService_1.prototype.resolveCountryCode = function (dto) {
            return (0, partner_phone_util_1.resolvePartnerCountryCode)(dto);
        };
        PartnersService_1.prototype.buildPartnerPhoneMatch = function (phone) {
            return (0, phone_lookup_util_1.buildPhoneFieldMatchClauses)('phone', phone);
        };
        PartnersService_1.prototype.assertPasswordsMatch = function (password, confirmPassword) {
            if (password !== confirmPassword) {
                throw new common_1.BadRequestException('Password and confirm password do not match');
            }
        };
        PartnersService_1.prototype.scheduleAdminTeamMemberRegisteredEmail = function (manufacturerId, params) {
            var _this = this;
            var adminEmail = (0, notification_recipient_groups_util_1.resolveAdminAlertTo)(this.configService);
            this.emailService.sendInBackground(function () { return __awaiter(_this, void 0, void 0, function () {
                var manufacturer, manufacturerName;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.manufacturerModel
                                .findById(manufacturerId)
                                .select('manufacturerName vendor_name')
                                .lean()
                                .exec()];
                        case 1:
                            manufacturer = _c.sent();
                            manufacturerName = String((_a = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : '').trim() ||
                                String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _b !== void 0 ? _b : '').trim() ||
                                undefined;
                            return [4 /*yield*/, this.emailService.sendVendorTeamMemberCredentialsEmail(params.memberEmail, {
                                    memberName: params.memberName,
                                    password: params.password,
                                    manufacturerName: manufacturerName,
                                    loginUrl: this.resolveVendorPortalLoginUrl(),
                                })];
                        case 2:
                            _c.sent();
                            if (!adminEmail) {
                                this.logger.warn('Admin alert email not configured (SMTP_ADMIN_ALERT_EMAIL / ADMIN_ALERT_EMAIL); skipped admin team member notification');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.emailService.sendVendorTeamMemberRegisteredAdminEmail(adminEmail, {
                                    manufacturerName: manufacturerName,
                                    memberName: params.memberName,
                                    memberEmail: params.memberEmail,
                                    memberPhone: params.memberPhone,
                                    password: params.password,
                                })];
                        case 3:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        PartnersService_1.prototype.resolveVendorPortalLoginUrl = function () {
            var _a, _b, _c;
            var explicit = ((_a = this.configService.get('VENDOR_PORTAL_URL')) === null || _a === void 0 ? void 0 : _a.trim()) ||
                ((_b = this.configService.get('VENDOR_LOGIN_URL')) === null || _b === void 0 ? void 0 : _b.trim());
            if (explicit) {
                return explicit.replace(/\/$/, '');
            }
            var frontend = (_c = this.configService.get('FRONTEND_URL')) === null || _c === void 0 ? void 0 : _c.trim();
            if (frontend) {
                return "".concat(frontend.replace(/\/$/, ''), "/vendor/login");
            }
            return undefined;
        };
        PartnersService_1.prototype.findAll = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, partners, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            manufacturerObjectId = this.toManufacturerObjectId(vendorId);
                            return [4 /*yield*/, this.vendorUserModel
                                    .find(__assign(__assign({}, this.manufacturerScopeFilter(manufacturerObjectId)), { type: 'partner', status: { $ne: 2 } }))
                                    .sort({ createdAt: -1, _id: -1 })
                                    .exec()];
                        case 1:
                            partners = _a.sent();
                            return [2 /*return*/, partners];
                        case 2:
                            error_1 = _a.sent();
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.BadRequestException(error_1.message || 'Error retrieving partners');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PartnersService_1.prototype.findOne = function (id, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, partnerId, partner, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            manufacturerObjectId = this.toManufacturerObjectId(vendorId);
                            partnerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne(__assign(__assign({ _id: partnerId }, this.manufacturerScopeFilter(manufacturerObjectId)), { type: 'partner' }))
                                    .exec()];
                        case 1:
                            partner = _a.sent();
                            if (!partner) {
                                throw new common_1.NotFoundException('Partner not found');
                            }
                            return [2 /*return*/, partner];
                        case 2:
                            error_2 = _a.sent();
                            if (error_2 instanceof common_1.NotFoundException ||
                                error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.BadRequestException('Invalid ID format');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PartnersService_1.prototype.create = function (vendorId, createPartnerDto) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, phone, countryCode, email, scope, phoneMatch, existingActivePartner, softDeletedPartner, ownerId, hashedPassword, restored, partnerData, _a, partner, created, error_3, field, softDeletedPartner, ownerId, hashedPassword, restoredCountryCode, restoredDuplicate;
                var _b, _c;
                var _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _j.trys.push([0, 9, , 15]);
                            this.assertPasswordsMatch(createPartnerDto.password, createPartnerDto.confirmPassword);
                            manufacturerObjectId = this.toManufacturerObjectId(vendorId);
                            phone = this.resolvePhone(createPartnerDto);
                            countryCode = this.resolveCountryCode(createPartnerDto);
                            email = createPartnerDto.email.trim().toLowerCase();
                            return [4 /*yield*/, this.globalPhoneUniqueness.assertPhoneAvailable(phone)];
                        case 1:
                            _j.sent();
                            scope = this.manufacturerScopeFilter(manufacturerObjectId);
                            phoneMatch = this.buildPartnerPhoneMatch(phone);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne(__assign(__assign({}, scope), { status: { $ne: 2 }, $or: __spreadArray([{ email: email }], phoneMatch, true) }))
                                    .exec()];
                        case 2:
                            existingActivePartner = _j.sent();
                            if (existingActivePartner) {
                                if (existingActivePartner.email === email) {
                                    throw new common_1.ConflictException('Email already exists for this vendor');
                                }
                                throw new common_1.ConflictException('Phone number already exists for this vendor');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    email: email,
                                    status: 2,
                                    type: 'partner',
                                })
                                    .exec()];
                        case 3:
                            softDeletedPartner = _j.sent();
                            if (!softDeletedPartner) return [3 /*break*/, 6];
                            ownerId = ((_d = softDeletedPartner.manufacturerId) === null || _d === void 0 ? void 0 : _d.toString()) ||
                                ((_e = softDeletedPartner.vendorId) === null || _e === void 0 ? void 0 : _e.toString());
                            if (ownerId !== vendorId) {
                                throw new common_1.ConflictException('Email already exists for another vendor');
                            }
                            return [4 /*yield*/, bcrypt.hash(createPartnerDto.password, 10)];
                        case 4:
                            hashedPassword = _j.sent();
                            softDeletedPartner.manufacturerId = manufacturerObjectId;
                            softDeletedPartner.vendorId = manufacturerObjectId;
                            softDeletedPartner.name = createPartnerDto.name.trim();
                            softDeletedPartner.phone = phone;
                            if (countryCode) {
                                softDeletedPartner.countryCode = countryCode;
                            }
                            softDeletedPartner.password = hashedPassword;
                            softDeletedPartner.status = 1;
                            softDeletedPartner.isVerified = true;
                            softDeletedPartner.updatedAt = new Date();
                            return [4 /*yield*/, softDeletedPartner.save()];
                        case 5:
                            restored = _j.sent();
                            this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
                                memberName: createPartnerDto.name.trim(),
                                memberEmail: email,
                                memberPhone: phone,
                                password: createPartnerDto.password,
                            });
                            return [2 /*return*/, restored];
                        case 6:
                            _a = [__assign({ manufacturerId: manufacturerObjectId, vendorId: manufacturerObjectId, name: createPartnerDto.name.trim(), email: email, phone: phone }, (countryCode ? { countryCode: countryCode } : {}))];
                            _b = { type: 'partner', status: 1, isVerified: true };
                            return [4 /*yield*/, bcrypt.hash(createPartnerDto.password, 10)];
                        case 7:
                            partnerData = __assign.apply(void 0, _a.concat([(_b.password = _j.sent(), _b)]));
                            partner = new this.vendorUserModel(partnerData);
                            return [4 /*yield*/, partner.save()];
                        case 8:
                            created = _j.sent();
                            this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
                                memberName: createPartnerDto.name.trim(),
                                memberEmail: email,
                                memberPhone: phone,
                                password: createPartnerDto.password,
                            });
                            return [2 /*return*/, created];
                        case 9:
                            error_3 = _j.sent();
                            if (error_3 instanceof common_1.ConflictException ||
                                error_3 instanceof common_1.BadRequestException) {
                                throw error_3;
                            }
                            if (!(error_3.code === 11000)) return [3 /*break*/, 14];
                            field = Object.keys(error_3.keyPattern || {})[0] || 'field';
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne((_c = {},
                                    _c[field] = (_f = error_3.keyValue) === null || _f === void 0 ? void 0 : _f[field],
                                    _c.status = 2,
                                    _c.type = 'partner',
                                    _c))
                                    .exec()];
                        case 10:
                            softDeletedPartner = _j.sent();
                            ownerId = ((_g = softDeletedPartner === null || softDeletedPartner === void 0 ? void 0 : softDeletedPartner.manufacturerId) === null || _g === void 0 ? void 0 : _g.toString()) ||
                                ((_h = softDeletedPartner === null || softDeletedPartner === void 0 ? void 0 : softDeletedPartner.vendorId) === null || _h === void 0 ? void 0 : _h.toString());
                            if (!(softDeletedPartner && ownerId === vendorId)) return [3 /*break*/, 13];
                            return [4 /*yield*/, bcrypt.hash(createPartnerDto.password, 10)];
                        case 11:
                            hashedPassword = _j.sent();
                            softDeletedPartner.manufacturerId =
                                this.toManufacturerObjectId(vendorId);
                            softDeletedPartner.vendorId = this.toManufacturerObjectId(vendorId);
                            softDeletedPartner.name = createPartnerDto.name.trim();
                            softDeletedPartner.email = createPartnerDto.email
                                .trim()
                                .toLowerCase();
                            softDeletedPartner.phone = this.resolvePhone(createPartnerDto);
                            restoredCountryCode = this.resolveCountryCode(createPartnerDto);
                            if (restoredCountryCode) {
                                softDeletedPartner.countryCode = restoredCountryCode;
                            }
                            softDeletedPartner.password = hashedPassword;
                            softDeletedPartner.status = 1;
                            softDeletedPartner.isVerified = true;
                            softDeletedPartner.updatedAt = new Date();
                            return [4 /*yield*/, softDeletedPartner.save()];
                        case 12:
                            restoredDuplicate = _j.sent();
                            this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
                                memberName: createPartnerDto.name.trim(),
                                memberEmail: createPartnerDto.email.trim().toLowerCase(),
                                memberPhone: this.resolvePhone(createPartnerDto),
                                password: createPartnerDto.password,
                            });
                            return [2 /*return*/, restoredDuplicate];
                        case 13: throw new common_1.ConflictException("".concat(field, " already exists"));
                        case 14:
                            if (error_3.name === 'ValidationError') {
                                throw new common_1.BadRequestException(error_3.message);
                            }
                            throw new common_1.BadRequestException(error_3.message || 'Invalid vendor ID or data. Please check your input.');
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        PartnersService_1.prototype.update = function (id, vendorId, updatePartnerDto) {
            return __awaiter(this, void 0, void 0, function () {
                var partner, phoneFieldsTouched, resolvedPhone, resolvedCountryCode, manufacturerObjectId, partnerId, emailPhoneConditions, existingPartner, nextEmail, error_4, updateData, _a, partnerId, updatedPartner, error_5;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, vendorId)];
                        case 1:
                            partner = _o.sent();
                            if ((_b = updatePartnerDto.password) === null || _b === void 0 ? void 0 : _b.trim()) {
                                this.assertPasswordsMatch(updatePartnerDto.password, String((_c = updatePartnerDto.confirmPassword) !== null && _c !== void 0 ? _c : ''));
                            }
                            phoneFieldsTouched = updatePartnerDto.phone !== undefined ||
                                updatePartnerDto.mobile !== undefined ||
                                updatePartnerDto.countryCode !== undefined ||
                                updatePartnerDto.country_code !== undefined ||
                                updatePartnerDto.dialCode !== undefined ||
                                updatePartnerDto.dial_code !== undefined;
                            resolvedPhone = phoneFieldsTouched
                                ? this.resolvePhone({
                                    phone: (_e = (_d = updatePartnerDto.phone) !== null && _d !== void 0 ? _d : updatePartnerDto.mobile) !== null && _e !== void 0 ? _e : partner.phone,
                                    mobile: updatePartnerDto.mobile,
                                    countryCode: (_g = (_f = updatePartnerDto.countryCode) !== null && _f !== void 0 ? _f : updatePartnerDto.country_code) !== null && _g !== void 0 ? _g : partner.countryCode,
                                    country_code: updatePartnerDto.country_code,
                                    dialCode: updatePartnerDto.dialCode,
                                    dial_code: updatePartnerDto.dial_code,
                                })
                                : undefined;
                            resolvedCountryCode = phoneFieldsTouched
                                ? this.resolveCountryCode({
                                    countryCode: (_j = (_h = updatePartnerDto.countryCode) !== null && _h !== void 0 ? _h : updatePartnerDto.country_code) !== null && _j !== void 0 ? _j : partner.countryCode,
                                    country_code: updatePartnerDto.country_code,
                                    dialCode: updatePartnerDto.dialCode,
                                    dial_code: updatePartnerDto.dial_code,
                                })
                                : undefined;
                            if (!(updatePartnerDto.email || resolvedPhone)) return [3 /*break*/, 7];
                            _o.label = 2;
                        case 2:
                            _o.trys.push([2, 6, , 7]);
                            manufacturerObjectId = this.toManufacturerObjectId(vendorId);
                            partnerId = new mongoose_1.Types.ObjectId(id);
                            if (!resolvedPhone) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.globalPhoneUniqueness.assertPhoneAvailable(resolvedPhone, {
                                    excludeUserId: partnerId,
                                })];
                        case 3:
                            _o.sent();
                            _o.label = 4;
                        case 4:
                            emailPhoneConditions = [];
                            if (updatePartnerDto.email) {
                                emailPhoneConditions.push({
                                    email: updatePartnerDto.email.trim().toLowerCase(),
                                });
                            }
                            if (resolvedPhone) {
                                emailPhoneConditions.push.apply(emailPhoneConditions, this.buildPartnerPhoneMatch(resolvedPhone));
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    $and: __spreadArray([
                                        this.manufacturerScopeFilter(manufacturerObjectId),
                                        { _id: { $ne: partnerId } },
                                        { status: { $ne: 2 } }
                                    ], (emailPhoneConditions.length > 0
                                        ? [{ $or: emailPhoneConditions }]
                                        : []), true),
                                })
                                    .exec()];
                        case 5:
                            existingPartner = _o.sent();
                            if (existingPartner) {
                                nextEmail = (_k = updatePartnerDto.email) === null || _k === void 0 ? void 0 : _k.trim().toLowerCase();
                                if (nextEmail && existingPartner.email === nextEmail) {
                                    throw new common_1.ConflictException('Email already exists for this vendor');
                                }
                                throw new common_1.ConflictException('Phone number already exists for this vendor');
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            error_4 = _o.sent();
                            if (error_4 instanceof common_1.ConflictException ||
                                error_4 instanceof common_1.BadRequestException) {
                                throw error_4;
                            }
                            throw new common_1.BadRequestException('Invalid ID format');
                        case 7:
                            updateData = {
                                updatedAt: new Date(),
                                manufacturerId: (_l = partner.manufacturerId) !== null && _l !== void 0 ? _l : this.toManufacturerObjectId(vendorId),
                                vendorId: (_m = partner.vendorId) !== null && _m !== void 0 ? _m : this.toManufacturerObjectId(vendorId),
                            };
                            if (updatePartnerDto.name) {
                                updateData.name = updatePartnerDto.name.trim();
                            }
                            if (updatePartnerDto.email) {
                                updateData.email = updatePartnerDto.email.trim().toLowerCase();
                            }
                            if (resolvedPhone) {
                                updateData.phone = resolvedPhone;
                            }
                            if (resolvedCountryCode) {
                                updateData.countryCode = resolvedCountryCode;
                            }
                            if (!(updatePartnerDto.password && updatePartnerDto.password.trim() !== '')) return [3 /*break*/, 9];
                            _a = updateData;
                            return [4 /*yield*/, bcrypt.hash(updatePartnerDto.password, 10)];
                        case 8:
                            _a.password = _o.sent();
                            _o.label = 9;
                        case 9:
                            _o.trys.push([9, 11, , 12]);
                            partnerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(partnerId, updateData, { new: true })
                                    .exec()];
                        case 10:
                            updatedPartner = _o.sent();
                            if (!updatedPartner) {
                                throw new common_1.NotFoundException('Partner not found');
                            }
                            return [2 /*return*/, updatedPartner];
                        case 11:
                            error_5 = _o.sent();
                            if (error_5 instanceof common_1.NotFoundException) {
                                throw error_5;
                            }
                            throw new common_1.BadRequestException('Invalid partner ID');
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        PartnersService_1.prototype.updateStatus = function (vendorId, updateStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                var partner, newStatus, partnerId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(updateStatusDto.partnerId, vendorId)];
                        case 1:
                            partner = _a.sent();
                            if (partner.status !== updateStatusDto.currentStatus) {
                                throw new common_1.BadRequestException("Partner current status is ".concat(partner.status, ", not ").concat(updateStatusDto.currentStatus));
                            }
                            newStatus = updateStatusDto.currentStatus === 1 ? 0 : 1;
                            try {
                                partnerId = new mongoose_1.Types.ObjectId(updateStatusDto.partnerId);
                                return [2 /*return*/, this.vendorUserModel
                                        .findByIdAndUpdate(partnerId, {
                                        status: newStatus,
                                        updatedAt: new Date(),
                                    }, { new: true })
                                        .exec()];
                            }
                            catch (error) {
                                throw new common_1.BadRequestException('Invalid partner ID');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return PartnersService_1;
    }());
    __setFunctionName(_classThis, "PartnersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PartnersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PartnersService = _classThis;
}();
exports.PartnersService = PartnersService;
