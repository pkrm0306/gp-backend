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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var notification_types_1 = require("../notifications/interfaces/notification.types");
var crypto = require("crypto");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var permission_hierarchy_1 = require("../common/permissions/permission-hierarchy");
var vendor_login_email_util_1 = require("../vendor-users/utils/vendor-login-email.util");
var platform_rbac_scope_util_1 = require("../common/utils/platform-rbac-scope.util");
var otp_util_1 = require("./utils/otp.util");
var vendor_registration_otp_response_util_1 = require("./utils/vendor-registration-otp-response.util");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(jwtService, configService, connection, manufacturersService, vendorUsersService, captchaService, notificationHelper, lifecycleNotification, redisService, rbacService, sessionInvalidation, globalPhoneUniqueness, zohoLeadsService, websiteAnalytics) {
            this.jwtService = jwtService;
            this.configService = configService;
            this.connection = connection;
            this.manufacturersService = manufacturersService;
            this.vendorUsersService = vendorUsersService;
            this.captchaService = captchaService;
            this.notificationHelper = notificationHelper;
            this.lifecycleNotification = lifecycleNotification;
            this.redisService = redisService;
            this.rbacService = rbacService;
            this.sessionInvalidation = sessionInvalidation;
            this.globalPhoneUniqueness = globalPhoneUniqueness;
            this.zohoLeadsService = zohoLeadsService;
            this.websiteAnalytics = websiteAnalytics;
            this.logger = new common_1.Logger(AuthService.name);
        }
        AuthService_1.prototype.normalizeRegistrationPhone = function (phoneRaw, countryCodeRaw) {
            var phoneInput = String(phoneRaw !== null && phoneRaw !== void 0 ? phoneRaw : '').trim();
            var countryCodeInput = String(countryCodeRaw !== null && countryCodeRaw !== void 0 ? countryCodeRaw : '').trim();
            if (!phoneInput) {
                throw new common_1.BadRequestException('Phone is required');
            }
            var normalizeDialCode = function (raw) {
                var digits = raw.replace(/[^\d]/g, '');
                return digits ? "+".concat(digits) : '';
            };
            var sanitizedPhone = phoneInput.replace(/[^\d+]/g, '');
            var normalizedDialCode = normalizeDialCode(countryCodeInput);
            var normalizedPhone = sanitizedPhone;
            if (sanitizedPhone.startsWith('+')) {
                normalizedPhone = "+".concat(sanitizedPhone.slice(1).replace(/[^\d]/g, ''));
            }
            else {
                var digits = sanitizedPhone.replace(/[^\d]/g, '');
                normalizedPhone = normalizedDialCode
                    ? "".concat(normalizedDialCode).concat(digits)
                    : digits;
            }
            var digitCount = normalizedPhone.replace(/[^\d]/g, '').length;
            if (digitCount < 7) {
                throw new common_1.BadRequestException('Phone number is invalid');
            }
            return normalizedPhone;
        };
        /**
         * Login / refresh **user** payload for admin portal accounts (`admin` / `staff` users).
         * Includes flat **designation**, **mobile** (from `phone`) and nested **vendorUser** for clients that merge either shape.
         */
        /**
         * Response shaping only — which user payload to return. Does not override portal access rules.
         */
        AuthService_1.prototype.resolveEffectiveLoginPortal = function (user, portal) {
            if (!user) {
                return portal;
            }
            if (user.type === 'vendor' || user.type === 'partner') {
                return 'vendor';
            }
            if (user.type === 'admin' || user.type === 'staff') {
                return portal === 'vendor' ? 'vendor' : portal !== null && portal !== void 0 ? portal : 'admin';
            }
            return portal;
        };
        AuthService_1.prototype.buildVendorPortalUserPayload = function (user) {
            var _a, _b, _c;
            var idStr = user._id.toString();
            var manufacturerId = ((_a = user.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = user.vendorId) === null || _b === void 0 ? void 0 : _b.toString());
            var mobile = String((_c = user.phone) !== null && _c !== void 0 ? _c : '').trim();
            return {
                id: idStr,
                vendorUserId: idStr,
                email: user.email,
                name: user.name,
                type: user.type,
                role: user.type,
                mobile: mobile,
                phone: mobile,
                vendorId: manufacturerId,
                manufacturerId: manufacturerId,
                isVendorPortalUser: true,
            };
        };
        AuthService_1.prototype.buildAdminPortalUserPayload = function (user) {
            var _a, _b;
            var idStr = user._id.toString();
            var mobile = String((_a = user.phone) !== null && _a !== void 0 ? _a : '').trim();
            var designation = String((_b = user.designation) !== null && _b !== void 0 ? _b : '').trim();
            return {
                id: idStr,
                vendorUserId: idStr,
                email: user.email,
                name: user.name,
                type: user.type,
                designation: designation,
                mobile: mobile,
                phone: mobile,
                vendorUser: {
                    designation: designation,
                    mobile: mobile,
                    vendorUserId: idStr,
                },
            };
        };
        AuthService_1.prototype.buildAuthTokenPayload = function (user) {
            var _a, _b;
            var manufacturerId = ((_a = user.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = user.vendorId) === null || _b === void 0 ? void 0 : _b.toString());
            var base = {
                userId: user._id.toString(),
                type: user.type,
                role: user.type,
                name: user.name,
                email: user.email,
            };
            if (this.isVendorPortalRole(user.type) && manufacturerId) {
                base.manufacturerId = manufacturerId;
            }
            return base;
        };
        AuthService_1.prototype.assertStaffPortalAccess = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var hasRole;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.hasAnyActiveStaffRoleMapping(undefined, user._id.toString())];
                        case 1:
                            hasRole = _a.sent();
                            if (!hasRole) {
                                throw new common_1.UnauthorizedException('Portal access restricted');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.splitContactName = function (name) {
            var parts = String(name || '')
                .trim()
                .split(/\s+/)
                .filter(Boolean);
            if (parts.length <= 1) {
                return { lastName: parts[0] || 'Vendor' };
            }
            return {
                firstName: parts.slice(0, -1).join(' '),
                lastName: parts[parts.length - 1],
            };
        };
        AuthService_1.prototype.syncRegistrationLeadToZoho = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, firstName, lastName;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.splitContactName(params.contactName), firstName = _a.firstName, lastName = _a.lastName;
                            return [4 /*yield*/, this.zohoLeadsService.createLead({
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: params.email,
                                    mobile: params.phone,
                                    company: params.companyName,
                                    leadStatus: 'New',
                                    leadSource: 'Portal',
                                    city: this.configService.get('ZOHO_DEFAULT_LEAD_CITY') || 'Hyderabad',
                                    state: this.configService.get('ZOHO_DEFAULT_LEAD_STATE') ||
                                        'Telangana',
                                    country: this.configService.get('ZOHO_DEFAULT_LEAD_COUNTRY') || 'India',
                                    portalUserId: params.portalUserId,
                                    vendorId: params.vendorId,
                                    manufacturerId: params.vendorId,
                                    customFields: {
                                        GBC_s_Services: 'Greenpro',
                                    },
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Force logout for all users under a manufacturer (e.g. admin changed vendor email). */
        AuthService_1.prototype.invalidateSessionsForManufacturer = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionInvalidation.invalidateSessionsForManufacturer(manufacturerId)];
                });
            });
        };
        /** Force logout for a single user (e.g. self-service or admin password change). */
        AuthService_1.prototype.invalidateSessionsForUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionInvalidation.invalidateSessionsForUser(userId)];
                });
            });
        };
        AuthService_1.prototype.getRecaptchaVerifyCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('RECAPTCHA_VERIFY_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '120', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
        };
        AuthService_1.prototype.buildRecaptchaVerifyCacheKey = function (token) {
            var tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            return this.redisService.buildKey('auth', 'recaptcha', 'verify', tokenHash);
        };
        AuthService_1.prototype.buildRevokedTokenKey = function (jti) {
            return this.redisService.buildKey('auth', 'revoked-token', jti);
        };
        AuthService_1.prototype.getNowEpochSeconds = function () {
            return Math.floor(Date.now() / 1000);
        };
        /**
         * After an admin email change, vendor_users may still list the old address until sync.
         * Login must use the current manufacturer.vendor_email only.
         */
        AuthService_1.prototype.assertVendorLoginEmailIsCurrent = function (user, submittedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var mfgId, mfg, canonical;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (user.type !== 'vendor') {
                                return [2 /*return*/];
                            }
                            mfgId = ((_a = user.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = user.vendorId) === null || _b === void 0 ? void 0 : _b.toString());
                            if (!mfgId) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.manufacturersService.findById(mfgId)];
                        case 1:
                            mfg = _d.sent();
                            if (!mfg) {
                                return [2 /*return*/];
                            }
                            canonical = String((_c = mfg.vendor_email) !== null && _c !== void 0 ? _c : '')
                                .trim()
                                .toLowerCase();
                            if (!canonical) {
                                return [2 /*return*/];
                            }
                            if (canonical !== submittedEmail) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** True for vendor-portal accounts only (not admin/staff). */
        AuthService_1.prototype.isVendorPortalRole = function (role) {
            var r = String(role !== null && role !== void 0 ? role : '').trim().toLowerCase();
            return r === 'vendor' || r === 'partner';
        };
        /**
         * Vendor portal users (vendor/partner) require manufacturerStatus=1 and vendor_status=1.
         * Used on login, refresh, and JWT validation so inactive orgs cannot keep using old tokens.
         * Admin portal staff share a manufacturerId for RBAC but must not use this gate.
         */
        AuthService_1.prototype.assertVendorOrganizationActive = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var id, m, manufacturerOk, vendorOk, accountDeleted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
                            if (!id) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            return [4 /*yield*/, this.manufacturersService.findById(id)];
                        case 1:
                            m = _a.sent();
                            if (!m) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            manufacturerOk = Number(m.manufacturerStatus) === 1;
                            vendorOk = Number(m.vendor_status) === 1;
                            accountDeleted = Boolean(m.accountDeletedAt);
                            if (!manufacturerOk || !vendorOk || accountDeleted) {
                                throw new common_1.UnauthorizedException('Vendor portal access is not available. Your organization must be active.');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Vendor portal login accounts must have user status active (1). */
        AuthService_1.prototype.assertVendorPortalUserAccountActive = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var id, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = String(userId !== null && userId !== void 0 ? userId : '').trim();
                            if (!id) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            return [4 /*yield*/, this.vendorUsersService.findById(id)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            if (user.type !== 'vendor' && user.type !== 'partner') {
                                return [2 /*return*/];
                            }
                            if (Number(user.status) !== 1) {
                                throw new common_1.UnauthorizedException('Account is inactive');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.revokeTokenByJtiAndExp = function (jti, exp) {
            return __awaiter(this, void 0, void 0, function () {
                var ttl;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!jti || !exp)
                                return [2 /*return*/];
                            ttl = exp - this.getNowEpochSeconds();
                            if (ttl <= 0)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.redisService
                                    .set(this.buildRevokedTokenKey(jti), { revoked: true }, ttl)
                                    .catch(function (error) {
                                    _this.logger.warn("Token revoke cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.isTokenRevoked = function (jti) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!jti)
                                return [2 /*return*/, false];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(this.buildRevokedTokenKey(jti))];
                        case 2:
                            cached = _a.sent();
                            return [2 /*return*/, Boolean(cached === null || cached === void 0 ? void 0 : cached.revoked)];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.warn("Token revoke cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.registerVendor = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                var captchaToken, captchaValid, normalizedEmail, normalizedPhone, normalizedCompanyName, normalizedContactName, normalizedCompanySize, _a, existingUser, existingManufacturer, existingManufacturerByCompanyName, phoneAvailable, registrationConflicts, session, transactionCommitted, manufacturer, otp, vendorUser, emailDelivered, notifyError_1, zohoError_1, error_2, keyPattern, keyValue, duplicateField, duplicateValue, message;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (registerDto.password !== registerDto.confirmPassword) {
                                throw new common_1.BadRequestException('Passwords do not match');
                            }
                            captchaToken = String(registerDto.captchaToken || '').trim();
                            if (!captchaToken) {
                                throw new common_1.BadRequestException('Please complete the reCAPTCHA verification.');
                            }
                            return [4 /*yield*/, this.captchaService.verifyCaptcha(captchaToken)];
                        case 1:
                            captchaValid = _d.sent();
                            if (!captchaValid) {
                                throw new common_1.BadRequestException('reCAPTCHA verification failed. Please try again.');
                            }
                            normalizedEmail = String(registerDto.email || '')
                                .trim()
                                .toLowerCase();
                            normalizedPhone = this.normalizeRegistrationPhone(registerDto.phone, registerDto.countryCode);
                            normalizedCompanyName = ((_b = registerDto.companyName) === null || _b === void 0 ? void 0 : _b.trim()) ||
                                ((_c = normalizedEmail.split('@')[0]) === null || _c === void 0 ? void 0 : _c.trim()) ||
                                'Vendor';
                            normalizedContactName = String(registerDto.name || '')
                                .trim()
                                .slice(0, 200);
                            normalizedCompanySize = String(registerDto.companySize || '')
                                .trim()
                                .slice(0, 64);
                            return [4 /*yield*/, Promise.all([
                                    this.vendorUsersService.findByEmail(normalizedEmail),
                                    this.manufacturersService.findByVendorEmail(normalizedEmail),
                                    this.manufacturersService.findByCompanyName(normalizedCompanyName),
                                    this.globalPhoneUniqueness.isPhoneAvailable(normalizedPhone),
                                ])];
                        case 2:
                            _a = _d.sent(), existingUser = _a[0], existingManufacturer = _a[1], existingManufacturerByCompanyName = _a[2], phoneAvailable = _a[3];
                            registrationConflicts = [];
                            if (existingUser || existingManufacturer) {
                                registrationConflicts.push('Email already exists');
                            }
                            if (!phoneAvailable) {
                                registrationConflicts.push('Phone number already exists');
                            }
                            if (existingManufacturerByCompanyName) {
                                registrationConflicts.push('Company name already exists');
                            }
                            if (registrationConflicts.length > 0) {
                                throw new common_1.ConflictException(registrationConflicts);
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 3:
                            session = _d.sent();
                            session.startTransaction();
                            transactionCommitted = false;
                            _d.label = 4;
                        case 4:
                            _d.trys.push([4, 16, 19, 20]);
                            return [4 /*yield*/, this.manufacturersService.create({
                                    manufacturerName: normalizedCompanyName,
                                    manufacturerStatus: 0,
                                    vendorPortalEmailVerified: false,
                                    vendor_name: normalizedContactName || normalizedCompanyName,
                                    vendor_email: normalizedEmail,
                                    vendor_phone: normalizedPhone,
                                    vendor_status: 0,
                                    companySize: normalizedCompanySize,
                                }, session)];
                        case 5:
                            manufacturer = _d.sent();
                            return [4 /*yield*/, this.manufacturersService.assignAutoGpIdentifiersForUnverifiedManufacturer(manufacturer._id.toString(), normalizedCompanyName, session)];
                        case 6:
                            _d.sent();
                            otp = (0, otp_util_1.generateVendorRegistrationOtp)(this.configService);
                            return [4 /*yield*/, this.vendorUsersService.create({
                                    manufacturerId: manufacturer._id,
                                    vendorId: manufacturer._id,
                                    name: normalizedContactName,
                                    email: normalizedEmail,
                                    phone: normalizedPhone,
                                    password: registerDto.password,
                                    type: 'vendor',
                                    status: 1,
                                    otp: otp,
                                    isVerified: false,
                                }, session)];
                        case 7:
                            vendorUser = _d.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 8:
                            _d.sent();
                            transactionCommitted = true;
                            emailDelivered = false;
                            _d.label = 9;
                        case 9:
                            _d.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.lifecycleNotification.notifyNewVendorRegistered({
                                    userId: vendorUser._id.toString(),
                                    email: normalizedEmail,
                                    name: normalizedContactName || normalizedCompanyName,
                                    companyName: normalizedCompanyName,
                                    password: registerDto.password,
                                    otp: otp,
                                })];
                        case 10:
                            _d.sent();
                            emailDelivered = true;
                            return [3 /*break*/, 12];
                        case 11:
                            notifyError_1 = _d.sent();
                            this.logger.error("[registerVendor] Welcome/OTP email failed for ".concat(normalizedEmail, ": ").concat((notifyError_1 === null || notifyError_1 === void 0 ? void 0 : notifyError_1.message) || notifyError_1));
                            return [3 /*break*/, 12];
                        case 12:
                            _d.trys.push([12, 14, , 15]);
                            return [4 /*yield*/, this.syncRegistrationLeadToZoho({
                                    portalUserId: vendorUser._id.toString(),
                                    vendorId: manufacturer._id.toString(),
                                    contactName: normalizedContactName || normalizedCompanyName,
                                    email: normalizedEmail,
                                    phone: normalizedPhone,
                                    companyName: normalizedCompanyName,
                                })];
                        case 13:
                            _d.sent();
                            return [3 /*break*/, 15];
                        case 14:
                            zohoError_1 = _d.sent();
                            this.logger.warn("[registerVendor] Zoho lead sync failed for ".concat(normalizedEmail, ": ").concat((zohoError_1 === null || zohoError_1 === void 0 ? void 0 : zohoError_1.message) || zohoError_1));
                            return [3 /*break*/, 15];
                        case 15:
                            void this.websiteAnalytics
                                .recordSignUp({
                                visitorKey: normalizedEmail,
                                signUpType: 'vendor_registration',
                                path: '/register-vendor',
                            })
                                .catch(function (error) {
                                _this.logger.warn("[registerVendor] Analytics sign_up record failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
                            });
                            return [2 /*return*/, __assign({ message: (0, vendor_registration_otp_response_util_1.buildVendorRegistrationSuccessMessage)(this.configService, normalizedEmail, otp, emailDelivered), emailDelivered: emailDelivered }, (0, vendor_registration_otp_response_util_1.buildVendorRegistrationOtpClientPayload)(this.configService, normalizedEmail, otp))];
                        case 16:
                            error_2 = _d.sent();
                            if (!(session.inTransaction() && !transactionCommitted)) return [3 /*break*/, 18];
                            return [4 /*yield*/, session.abortTransaction()];
                        case 17:
                            _d.sent();
                            _d.label = 18;
                        case 18:
                            if (error_2 instanceof common_1.HttpException) {
                                throw error_2;
                            }
                            if ((error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000) {
                                keyPattern = (error_2 === null || error_2 === void 0 ? void 0 : error_2.keyPattern) || {};
                                keyValue = (error_2 === null || error_2 === void 0 ? void 0 : error_2.keyValue) || {};
                                duplicateField = Object.keys(keyPattern)[0];
                                duplicateValue = duplicateField
                                    ? keyValue === null || keyValue === void 0 ? void 0 : keyValue[duplicateField]
                                    : undefined;
                                message = String((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || '');
                                if (duplicateField === 'email' ||
                                    duplicateField === 'vendor_email' ||
                                    (message.includes('email') && message.includes('dup key'))) {
                                    throw new common_1.ConflictException('Email already exists');
                                }
                                if (duplicateField === 'phone' ||
                                    duplicateField === 'vendor_phone' ||
                                    (message.includes('phone') && message.includes('dup key'))) {
                                    throw new common_1.ConflictException('Phone number already exists');
                                }
                                if (duplicateField === 'gpInternalId' ||
                                    message.includes('gpInternalId_1') ||
                                    (String(duplicateValue || '').toLowerCase() === 'null' &&
                                        message.includes('gpInternalId'))) {
                                    throw new common_1.ConflictException('GP Internal ID already exists');
                                }
                                if (duplicateField === 'manufacturerInitial' ||
                                    message.includes('manufacturerInitial_1') ||
                                    message.includes('manufacturer_initial')) {
                                    throw new common_1.ConflictException('Manufacturer initials already exist');
                                }
                                throw new common_1.ConflictException('Duplicate value found. Please use different registration details.');
                            }
                            throw error_2;
                        case 19:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 20: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyOtp = function (verifyOtpDto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, manufacturerId, gpInternalId, manufacturerInitial, manufacturerName, m, rawGp, rawIni, notifyError_2;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, this.vendorUsersService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp)];
                        case 1:
                            user = _h.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Invalid OTP or email');
                            }
                            manufacturerId = ((_a = user.manufacturerId) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = user.vendorId) === null || _b === void 0 ? void 0 : _b.toString());
                            if (!manufacturerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.manufacturersService.markVendorPortalEmailVerified(manufacturerId)];
                        case 2:
                            _h.sent();
                            _h.label = 3;
                        case 3:
                            gpInternalId = null;
                            manufacturerInitial = null;
                            manufacturerName = String((_c = user.name) !== null && _c !== void 0 ? _c : '').trim();
                            if (!manufacturerId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.manufacturersService.findById(manufacturerId)];
                        case 4:
                            m = _h.sent();
                            if (m) {
                                rawGp = String((_d = m.gpInternalId) !== null && _d !== void 0 ? _d : '').trim();
                                rawIni = String((_e = m.manufacturerInitial) !== null && _e !== void 0 ? _e : '').trim();
                                gpInternalId = rawGp ? rawGp : null;
                                manufacturerInitial = rawIni ? rawIni : null;
                                manufacturerName =
                                    String((_f = m.manufacturerName) !== null && _f !== void 0 ? _f : '').trim() ||
                                        String((_g = m.vendor_name) !== null && _g !== void 0 ? _g : '').trim() ||
                                        manufacturerName;
                            }
                            _h.label = 5;
                        case 5:
                            _h.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.lifecycleNotification.notifyVendorRegistrationComplete(user._id.toString(), verifyOtpDto.email.trim().toLowerCase(), manufacturerName || verifyOtpDto.email)];
                        case 6:
                            _h.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            notifyError_2 = _h.sent();
                            this.logger.warn("[verifyOtp] Registration complete notification failed: ".concat((notifyError_2 === null || notifyError_2 === void 0 ? void 0 : notifyError_2.message) || notifyError_2));
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, {
                                message: 'Email verified successfully',
                                gpInternalId: gpInternalId,
                                manufacturerInitial: manufacturerInitial,
                            }];
                    }
                });
            });
        };
        AuthService_1.prototype.otpResendCooldownKey = function (email) {
            return this.redisService.buildKey('auth', 'otp-resend', 'cooldown', email);
        };
        AuthService_1.prototype.otpResendCountKey = function (email) {
            return this.redisService.buildKey('auth', 'otp-resend', 'count', email);
        };
        AuthService_1.prototype.assertOtpResendRateLimit = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var cooldownKey, cooldownActive, countRaw, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cooldownKey = this.otpResendCooldownKey(email);
                            return [4 /*yield*/, this.redisService.get(cooldownKey)];
                        case 1:
                            cooldownActive = _a.sent();
                            if (cooldownActive) {
                                throw new common_1.HttpException({
                                    message: "Please wait ".concat(otp_util_1.OTP_RESEND_COOLDOWN_SECONDS, " seconds before requesting another OTP."),
                                    retryAfterSeconds: otp_util_1.OTP_RESEND_COOLDOWN_SECONDS,
                                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
                            }
                            return [4 /*yield*/, this.redisService.get(this.otpResendCountKey(email))];
                        case 2:
                            countRaw = _a.sent();
                            count = Number(countRaw !== null && countRaw !== void 0 ? countRaw : 0);
                            if (Number.isFinite(count) && count >= otp_util_1.OTP_RESEND_MAX_PER_WINDOW) {
                                throw new common_1.HttpException({
                                    message: 'Too many OTP resend attempts. Please try again in a few minutes.',
                                    retryAfterSeconds: otp_util_1.OTP_RESEND_WINDOW_SECONDS,
                                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.recordOtpResendAttempt = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var countKey, countRaw, nextCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService.set(this.otpResendCooldownKey(email), '1', otp_util_1.OTP_RESEND_COOLDOWN_SECONDS)];
                        case 1:
                            _a.sent();
                            countKey = this.otpResendCountKey(email);
                            return [4 /*yield*/, this.redisService.get(countKey)];
                        case 2:
                            countRaw = _a.sent();
                            nextCount = Number(countRaw !== null && countRaw !== void 0 ? countRaw : 0) + 1;
                            return [4 /*yield*/, this.redisService.set(countKey, nextCount, otp_util_1.OTP_RESEND_WINDOW_SECONDS)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.resendOtp = function (resendOtpDto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, user, otp, notifyError_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = (0, vendor_login_email_util_1.normalizeLoginEmail)(resendOtpDto.email);
                            if (!email) {
                                throw new common_1.BadRequestException('email must be a valid email address');
                            }
                            return [4 /*yield*/, this.assertOtpResendRateLimit(email)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.vendorUsersService.findByEmail(email)];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Email not registered');
                            }
                            if (user.isVerified) {
                                throw new common_1.BadRequestException('Email is already verified. Please sign in.');
                            }
                            if (user.type !== 'vendor' && user.type !== 'partner') {
                                throw new common_1.BadRequestException('OTP resend is only available for vendor registration');
                            }
                            otp = (0, otp_util_1.generateVendorRegistrationOtp)(this.configService);
                            return [4 /*yield*/, this.vendorUsersService.update(user._id.toString(), { otp: otp })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.lifecycleNotification.notifyVendorOtpResent({
                                    userId: user._id.toString(),
                                    email: email,
                                    name: user.name,
                                    otp: otp,
                                    expiresInMinutes: otp_util_1.VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES,
                                })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            notifyError_3 = _a.sent();
                            this.logger.warn("[resendOtp] OTP email failed for ".concat(email, ": ").concat((notifyError_3 === null || notifyError_3 === void 0 ? void 0 : notifyError_3.message) || notifyError_3));
                            throw new common_1.BadRequestException('Failed to send OTP email. Please try again later.');
                        case 7: return [4 /*yield*/, this.recordOtpResendAttempt(email)];
                        case 8:
                            _a.sent();
                            return [2 /*return*/, __assign({ message: (0, vendor_registration_otp_response_util_1.buildVendorResendOtpMessage)(this.configService, email, otp) }, (0, vendor_registration_otp_response_util_1.buildVendorRegistrationOtpClientPayload)(this.configService, email, otp))];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (loginDto, portal) {
            return __awaiter(this, void 0, void 0, function () {
                var submittedEmail, nodeEnv, isStaging, submittedPassword, isStagingMasterPassword, user, manufacturerForLoginEmail, fallbackManufacturer, _a, _b, isPasswordValid, _c, _d, effectivePortal, requestedPortal, resolvedUserType, allowedTypesByPortal, allowedTypes, message, vendorSideUser, manufacturerOnlyLogin, manufacturerId, payload, accessTokenJti, refreshTokenJti, accessToken, refreshToken, responseUser, forAdminPortal, loginData, ctx;
                var _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            submittedEmail = (0, vendor_login_email_util_1.normalizeLoginEmail)((_f = (_e = loginDto.email) !== null && _e !== void 0 ? _e : loginDto.username) !== null && _f !== void 0 ? _f : '');
                            if (!submittedEmail) {
                                throw new common_1.UnauthorizedException('Email not registered');
                            }
                            nodeEnv = String(this.configService.get('NODE_ENV') ||
                                this.configService.get('APP_ENV') ||
                                this.configService.get('ENV') ||
                                '')
                                .trim()
                                .toLowerCase();
                            isStaging = nodeEnv === 'staging';
                            submittedPassword = String((_g = loginDto.password) !== null && _g !== void 0 ? _g : '').trim();
                            isStagingMasterPassword = isStaging && submittedPassword === 'Vendor@greenpro';
                            return [4 /*yield*/, this.vendorUsersService.findLoginUserByEmail(submittedEmail)];
                        case 1:
                            user = _k.sent();
                            manufacturerForLoginEmail = null;
                            if (!!user) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manufacturersService.findByVendorEmail(submittedEmail)];
                        case 2:
                            manufacturerForLoginEmail =
                                _k.sent();
                            if (!manufacturerForLoginEmail) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.vendorUsersService.findPrimaryLoginUserForManufacturer(manufacturerForLoginEmail._id.toString())];
                        case 3:
                            user =
                                _k.sent();
                            _k.label = 4;
                        case 4:
                            if (!(!user && isStagingMasterPassword)) return [3 /*break*/, 8];
                            if (!(manufacturerForLoginEmail !== null && manufacturerForLoginEmail !== void 0)) return [3 /*break*/, 5];
                            _b = manufacturerForLoginEmail;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.manufacturersService.findByVendorEmail(submittedEmail)];
                        case 6:
                            _b = (_k.sent());
                            _k.label = 7;
                        case 7:
                            _a = (_b);
                            return [3 /*break*/, 9];
                        case 8:
                            _a = null;
                            _k.label = 9;
                        case 9:
                            fallbackManufacturer = _a;
                            if (!user && !fallbackManufacturer) {
                                throw new common_1.UnauthorizedException('Email not registered');
                            }
                            if (!(user && !isStagingMasterPassword)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.assertVendorLoginEmailIsCurrent(user, submittedEmail)];
                        case 10:
                            _k.sent();
                            _k.label = 11;
                        case 11:
                            if (!user) return [3 /*break*/, 15];
                            if (!isStagingMasterPassword) return [3 /*break*/, 12];
                            _d = true;
                            return [3 /*break*/, 14];
                        case 12: return [4 /*yield*/, this.vendorUsersService.comparePassword(submittedPassword, user.password)];
                        case 13:
                            _d = _k.sent();
                            _k.label = 14;
                        case 14:
                            _c = _d;
                            return [3 /*break*/, 16];
                        case 15:
                            _c = isStagingMasterPassword;
                            _k.label = 16;
                        case 16:
                            isPasswordValid = _c;
                            if (!isPasswordValid) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            if (!(user && !isStagingMasterPassword)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.vendorUsersService.upgradeLegacyPasswordIfNeeded(user._id.toString(), submittedPassword, user.password)];
                        case 17:
                            _k.sent();
                            _k.label = 18;
                        case 18:
                            if (user &&
                                !isStagingMasterPassword &&
                                user.type !== 'partner' &&
                                !user.isVerified) {
                                throw new common_1.UnauthorizedException('Email not verified');
                            }
                            if (!(user && !isStagingMasterPassword)) return [3 /*break*/, 20];
                            return [4 /*yield*/, this.assertVendorPortalUserAccountActive(user._id.toString())];
                        case 19:
                            _k.sent();
                            _k.label = 20;
                        case 20:
                            effectivePortal = this.resolveEffectiveLoginPortal(user, portal);
                            requestedPortal = portal;
                            resolvedUserType = user ? user.type : 'vendor';
                            allowedTypesByPortal = {
                                admin: ['admin', 'staff'],
                                vendor: ['vendor', 'partner'],
                            };
                            if (requestedPortal) {
                                allowedTypes = allowedTypesByPortal[requestedPortal];
                                if (!allowedTypes.includes(resolvedUserType)) {
                                    message = requestedPortal === 'admin'
                                        ? 'Admin portal allows only admin or staff users'
                                        : 'Vendor portal allows only vendor or partner users';
                                    throw new common_1.UnauthorizedException(message);
                                }
                            }
                            vendorSideUser = user && (user.type === 'vendor' || user.type === 'partner');
                            manufacturerOnlyLogin = !user && !!fallbackManufacturer;
                            if (!(vendorSideUser || manufacturerOnlyLogin)) return [3 /*break*/, 22];
                            manufacturerId = user
                                ? ((_h = user.manufacturerId) === null || _h === void 0 ? void 0 : _h.toString()) || ((_j = user.vendorId) === null || _j === void 0 ? void 0 : _j.toString())
                                : fallbackManufacturer._id.toString();
                            return [4 /*yield*/, this.assertVendorOrganizationActive(manufacturerId)];
                        case 21:
                            _k.sent();
                            _k.label = 22;
                        case 22:
                            if (!(user && resolvedUserType === 'staff')) return [3 /*break*/, 24];
                            return [4 /*yield*/, this.assertStaffPortalAccess(user)];
                        case 23:
                            _k.sent();
                            _k.label = 24;
                        case 24:
                            payload = user
                                ? this.buildAuthTokenPayload(user)
                                : {
                                    userId: fallbackManufacturer._id.toString(),
                                    manufacturerId: fallbackManufacturer._id.toString(),
                                    type: 'vendor',
                                    role: 'vendor',
                                    name: fallbackManufacturer.vendor_name ||
                                        fallbackManufacturer.manufacturerName,
                                    email: fallbackManufacturer.vendor_email,
                                };
                            accessTokenJti = crypto.randomUUID();
                            refreshTokenJti = crypto.randomUUID();
                            accessToken = this.jwtService.sign(payload, {
                                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
                                jwtid: accessTokenJti,
                            });
                            refreshToken = this.jwtService.sign(payload, {
                                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '24h',
                                jwtid: refreshTokenJti,
                            });
                            if (user) {
                                forAdminPortal = effectivePortal === 'admin' ||
                                    user.type === 'admin' ||
                                    user.type === 'staff';
                                responseUser = forAdminPortal
                                    ? this.buildAdminPortalUserPayload(user)
                                    : this.buildVendorPortalUserPayload(user);
                            }
                            else {
                                responseUser = {
                                    id: fallbackManufacturer._id,
                                    email: fallbackManufacturer.vendor_email,
                                    name: fallbackManufacturer.vendor_name ||
                                        fallbackManufacturer.manufacturerName,
                                    type: 'vendor',
                                };
                            }
                            loginData = {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                user: responseUser,
                            };
                            if (!((user === null || user === void 0 ? void 0 : user.type) === 'admin')) return [3 /*break*/, 25];
                            loginData.isPlatformAdmin = true;
                            loginData.effectivePermissions = (0, permission_hierarchy_1.expandEffectivePermissions)(permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES, permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES);
                            return [3 /*break*/, 27];
                        case 25:
                            if (!((user === null || user === void 0 ? void 0 : user.type) === 'staff')) return [3 /*break*/, 27];
                            return [4 /*yield*/, this.rbacService.getStaffPermissionContext(undefined, user._id.toString())];
                        case 26:
                            ctx = _k.sent();
                            loginData.isPlatformAdmin = ctx.isPlatformAdmin;
                            loginData.effectivePermissions = ctx.effectivePermissions;
                            _k.label = 27;
                        case 27: return [2 /*return*/, {
                                message: 'Login successful',
                                data: loginData,
                            }];
                    }
                });
            });
        };
        AuthService_1.prototype.forgotPassword = function (forgotPasswordDto, portal) {
            return __awaiter(this, void 0, void 0, function () {
                var submittedEmail, user, manufacturer, _a, allowedTypes, hasRole, newPassword, notifyResult, failed, error_3;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            submittedEmail = String((_b = forgotPasswordDto.email) !== null && _b !== void 0 ? _b : '')
                                .trim()
                                .toLowerCase();
                            return [4 /*yield*/, this.vendorUsersService.findByEmail(submittedEmail)];
                        case 1:
                            user = _c.sent();
                            if (!!user) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manufacturersService.findByVendorEmail(submittedEmail)];
                        case 2:
                            manufacturer = _c.sent();
                            if (!manufacturer) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.vendorUsersService.findPrimaryLoginUserForManufacturer(manufacturer._id.toString())];
                        case 3:
                            user =
                                _c.sent();
                            _c.label = 4;
                        case 4:
                            if (!user) {
                                if (portal === 'admin') {
                                    throw new common_1.BadRequestException('Email id is not registered');
                                }
                                throw new common_1.BadRequestException('User not registered');
                            }
                            if (!(user.type === 'vendor' || user.type === 'partner')) return [3 /*break*/, 10];
                            _c.label = 5;
                        case 5:
                            _c.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.assertVendorLoginEmailIsCurrent(user, submittedEmail)];
                        case 6:
                            _c.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _a = _c.sent();
                            if (portal === 'admin') {
                                throw new common_1.BadRequestException('Email id is not registered');
                            }
                            throw new common_1.BadRequestException('User not registered');
                        case 8:
                            if (!(portal === 'vendor' || portal === undefined)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.assertVendorPortalUserAccountActive(user._id.toString())];
                        case 9:
                            _c.sent();
                            _c.label = 10;
                        case 10:
                            if (!(portal === 'admin')) return [3 /*break*/, 12];
                            allowedTypes = ['admin', 'staff'];
                            if (!allowedTypes.includes(user.type)) {
                                throw new common_1.BadRequestException('Portal access restricted');
                            }
                            if (!(user.type === 'staff')) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.rbacService.hasAnyActiveStaffRoleMapping(undefined, user._id.toString())];
                        case 11:
                            hasRole = _c.sent();
                            if (!hasRole) {
                                throw new common_1.BadRequestException('Portal access restricted');
                            }
                            _c.label = 12;
                        case 12:
                            newPassword = crypto.randomBytes(8).toString('hex');
                            return [4 /*yield*/, this.vendorUsersService.update(user._id.toString(), {
                                    password: newPassword,
                                })];
                        case 13:
                            _c.sent();
                            _c.label = 14;
                        case 14:
                            _c.trys.push([14, 16, , 17]);
                            return [4 /*yield*/, this.notificationHelper.send({
                                    type: user._id
                                        ? [notification_types_1.NotificationChannel.EMAIL, notification_types_1.NotificationChannel.IN_APP]
                                        : [notification_types_1.NotificationChannel.EMAIL],
                                    template: notification_types_1.NotificationTemplateCode.PASSWORD_RESET,
                                    userId: user._id.toString(),
                                    email: submittedEmail,
                                    payload: { newPassword: newPassword },
                                })];
                        case 15:
                            notifyResult = _c.sent();
                            failed = notifyResult.results.filter(function (r) { return !r.success && !r.skipped; });
                            if (failed.length > 0) {
                                this.logger.warn("[forgotPassword] SMTP failed for ".concat(submittedEmail, ": ").concat(failed
                                    .map(function (f) { return f.error; })
                                    .join('; ')));
                                throw new common_1.BadRequestException('Failed to send password email. Please try again later.');
                            }
                            return [3 /*break*/, 17];
                        case 16:
                            error_3 = _c.sent();
                            if (error_3 instanceof common_1.BadRequestException)
                                throw error_3;
                            this.logger.warn("[forgotPassword] SMTP error for ".concat(submittedEmail, ": ").concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || error_3));
                            throw new common_1.BadRequestException('Failed to send password email. Please try again later.');
                        case 17:
                            this.lifecycleNotification
                                .notifyPasswordResetAdmin({
                                email: submittedEmail,
                                portal: portal,
                                userId: user._id.toString(),
                            })
                                .catch(function (err) {
                                return _this.logger.warn("Password reset admin notification failed for ".concat(submittedEmail, ": ").concat(err.message));
                            });
                            return [2 /*return*/, {
                                    message: 'New password has been sent to your email',
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.refresh = function (refreshTokenDto) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedRefreshToken, payload, jwtSecret, refreshSecret, verificationSecrets, env, allowExpiredInNonProd, lastVerifyError, _i, verificationSecrets_1, verifySecret, isExpired, isPlatformPortalAccount, mid, roleForOrg, vu, newPayload, accessTokenJti, newRefreshTokenJti, accessToken, refreshToken, refreshData, ctx, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalizedRefreshToken = String((_b = refreshTokenDto === null || refreshTokenDto === void 0 ? void 0 : refreshTokenDto.refreshToken) !== null && _b !== void 0 ? _b : '')
                                .trim()
                                .replace(/^bearer\s+/i, '')
                                .replace(/^["']|["']$/g, '')
                                .replace(/\s+/g, '');
                            if (!normalizedRefreshToken) {
                                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                            }
                            jwtSecret = this.configService.get('JWT_SECRET');
                            refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
                            verificationSecrets = Array.from(new Set([refreshSecret, jwtSecret, 'secret']
                                .map(function (s) { return String(s || '').trim(); })
                                .filter(Boolean)));
                            env = String(this.configService.get('NODE_ENV') || '')
                                .trim()
                                .toLowerCase();
                            allowExpiredInNonProd = env !== 'production';
                            for (_i = 0, verificationSecrets_1 = verificationSecrets; _i < verificationSecrets_1.length; _i++) {
                                verifySecret = verificationSecrets_1[_i];
                                try {
                                    payload = this.jwtService.verify(normalizedRefreshToken, {
                                        secret: verifySecret,
                                    });
                                    break;
                                }
                                catch (err) {
                                    lastVerifyError = err;
                                    isExpired = String((err === null || err === void 0 ? void 0 : err.name) || '').includes('TokenExpiredError');
                                    if (allowExpiredInNonProd && isExpired) {
                                        try {
                                            payload = this.jwtService.verify(normalizedRefreshToken, {
                                                secret: verifySecret,
                                                ignoreExpiration: true,
                                            });
                                            break;
                                        }
                                        catch (expiredFallbackErr) {
                                            lastVerifyError = expiredFallbackErr;
                                        }
                                    }
                                }
                            }
                            if (!payload) {
                                this.logger.warn("[refresh] token verification failed in ".concat(env || 'unknown', " env: ").concat((lastVerifyError === null || lastVerifyError === void 0 ? void 0 : lastVerifyError.name) || 'UnknownError', " ").concat((lastVerifyError === null || lastVerifyError === void 0 ? void 0 : lastVerifyError.message) || '').trim());
                                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                            }
                            // Allow refresh even when the presented token was previously revoked.
                            // This keeps refresh flows resilient when clients call refresh with an
                            // expired/revoked user session token and still hold a usable refresh token.
                            if (!(payload === null || payload === void 0 ? void 0 : payload.userId) || !(payload === null || payload === void 0 ? void 0 : payload.role)) {
                                throw new common_1.UnauthorizedException('Invalid refresh token payload');
                            }
                            return [4 /*yield*/, this.sessionInvalidation.assertSessionActive({
                                    iat: payload === null || payload === void 0 ? void 0 : payload.iat,
                                    userId: payload === null || payload === void 0 ? void 0 : payload.userId,
                                    manufacturerId: payload === null || payload === void 0 ? void 0 : payload.manufacturerId,
                                    vendorId: payload === null || payload === void 0 ? void 0 : payload.vendorId,
                                })];
                        case 1:
                            _c.sent();
                            isPlatformPortalAccount = (0, platform_rbac_scope_util_1.isPlatformPortalAccountType)(payload.role);
                            if (!isPlatformPortalAccount && !(payload.manufacturerId || payload.vendorId)) {
                                throw new common_1.UnauthorizedException('Invalid refresh token payload');
                            }
                            mid = payload.manufacturerId || payload.vendorId;
                            roleForOrg = String(payload.type || payload.role || '');
                            if (!(!isPlatformPortalAccount && mid && this.isVendorPortalRole(roleForOrg))) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.assertVendorOrganizationActive(typeof mid === 'string' ? mid : String(mid))];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, this.assertVendorPortalUserAccountActive(String(payload.userId))];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4: return [4 /*yield*/, this.vendorUsersService.findById(String(payload.userId))];
                        case 5:
                            vu = _c.sent();
                            if (!((vu === null || vu === void 0 ? void 0 : vu.type) === 'staff')) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.assertStaffPortalAccess(vu)];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7:
                            newPayload = vu
                                ? this.buildAuthTokenPayload(vu)
                                : __assign(__assign(__assign({ userId: payload.userId, type: payload.type || payload.role, role: payload.role }, (mid ? { manufacturerId: mid } : {})), (payload.name ? { name: payload.name } : {})), (payload.email ? { email: payload.email } : {}));
                            accessTokenJti = crypto.randomUUID();
                            newRefreshTokenJti = crypto.randomUUID();
                            accessToken = this.jwtService.sign(newPayload, {
                                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
                                jwtid: accessTokenJti,
                            });
                            refreshToken = this.jwtService.sign(newPayload, {
                                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '24h',
                                jwtid: newRefreshTokenJti,
                            });
                            return [4 /*yield*/, this.revokeTokenByJtiAndExp(payload === null || payload === void 0 ? void 0 : payload.jti, typeof (payload === null || payload === void 0 ? void 0 : payload.exp) === 'number' ? payload.exp : undefined)];
                        case 8:
                            _c.sent();
                            refreshData = {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                            };
                            _c.label = 9;
                        case 9:
                            _c.trys.push([9, 13, , 14]);
                            if (vu && (vu.type === 'admin' || vu.type === 'staff')) {
                                refreshData.user = this.buildAdminPortalUserPayload(vu);
                            }
                            else if (vu && (vu.type === 'vendor' || vu.type === 'partner')) {
                                refreshData.user = this.buildVendorPortalUserPayload(vu);
                            }
                            if (!((vu === null || vu === void 0 ? void 0 : vu.type) === 'admin')) return [3 /*break*/, 10];
                            refreshData.isPlatformAdmin = true;
                            refreshData.effectivePermissions = (0, permission_hierarchy_1.expandEffectivePermissions)(permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES, permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES);
                            return [3 /*break*/, 12];
                        case 10:
                            if (!((vu === null || vu === void 0 ? void 0 : vu.type) === 'staff')) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.rbacService.getStaffPermissionContext(undefined, vu._id.toString())];
                        case 11:
                            ctx = _c.sent();
                            refreshData.isPlatformAdmin = ctx.isPlatformAdmin;
                            refreshData.effectivePermissions = ctx.effectivePermissions;
                            _c.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            _a = _c.sent();
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/, {
                                message: 'Token refreshed successfully',
                                data: refreshData,
                            }];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyRecaptcha = function (captchaToken) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedToken, cacheKey, cached, error_4, valid;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedToken = String(captchaToken || '').trim();
                            if (!normalizedToken) {
                                return [2 /*return*/, false];
                            }
                            cacheKey = this.buildRecaptchaVerifyCacheKey(normalizedToken);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (cached && typeof cached.valid === 'boolean') {
                                return [2 /*return*/, cached.valid];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.warn("reCAPTCHA cache read failed: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.captchaService.verifyCaptcha(normalizedToken)];
                        case 5:
                            valid = _a.sent();
                            this.redisService
                                .set(cacheKey, { valid: valid }, this.getRecaptchaVerifyCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("reCAPTCHA cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, valid];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (accessToken, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var secret, tokensToRevoke, _i, tokensToRevoke_1, token, payload, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            secret = this.configService.get('JWT_SECRET') || 'secret';
                            tokensToRevoke = [accessToken, refreshToken].filter(function (token) { return Boolean(token && token.trim()); });
                            _i = 0, tokensToRevoke_1 = tokensToRevoke;
                            _b.label = 1;
                        case 1:
                            if (!(_i < tokensToRevoke_1.length)) return [3 /*break*/, 6];
                            token = tokensToRevoke_1[_i];
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            payload = this.jwtService.verify(token, { secret: secret });
                            return [4 /*yield*/, this.revokeTokenByJtiAndExp(payload === null || payload === void 0 ? void 0 : payload.jti, typeof (payload === null || payload === void 0 ? void 0 : payload.exp) === 'number' ? payload.exp : undefined)];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, { loggedOut: true }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
