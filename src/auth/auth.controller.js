"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var login_dto_1 = require("./dto/login.dto");
var verify_recaptcha_dto_1 = require("./dto/verify-recaptcha.dto");
var logout_dto_1 = require("./dto/logout.dto");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _registerVendor_decorators;
    var _verifyOtp_decorators;
    var _resendOtp_decorators;
    var _login_decorators;
    var _forgotPassword_decorators;
    var _refresh_decorators;
    var _refreshToken_decorators;
    var _logout_decorators;
    var _verifyRecaptcha_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        AuthController_1.prototype.extractAccessToken = function (req) {
            var _a, _b, _c, _d;
            var authHeader = String(((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || '').trim();
            if (/^Bearer\s+/i.test(authHeader)) {
                return authHeader.replace(/^Bearer\s+/i, '').trim();
            }
            var xAccessToken = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b['x-access-token'];
            if (typeof xAccessToken === 'string' && xAccessToken.trim()) {
                return xAccessToken.trim();
            }
            if (Array.isArray(xAccessToken) && ((_c = xAccessToken[0]) === null || _c === void 0 ? void 0 : _c.trim())) {
                return xAccessToken[0].trim();
            }
            var queryToken = String(((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.access_token) || '').trim();
            return queryToken || null;
        };
        AuthController_1.prototype.registerVendor = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.registerVendor(registerDto)];
                });
            });
        };
        AuthController_1.prototype.verifyOtp = function (verifyOtpDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.verifyOtp(verifyOtpDto)];
                });
            });
        };
        AuthController_1.prototype.resendOtp = function (resendOtpDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.resendOtp(resendOtpDto)];
                });
            });
        };
        AuthController_1.prototype.login = function (loginDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var portal;
                return __generator(this, function (_a) {
                    portal = this.resolvePortal(req, loginDto.portal);
                    return [2 /*return*/, this.authService.login(loginDto, portal)];
                });
            });
        };
        AuthController_1.prototype.resolvePortal = function (req, dtoPortal) {
            var _a, _b, _c, _d, _e;
            if (dtoPortal)
                return dtoPortal;
            /** Admin SPA often calls API on another port; Origin may be omitted — clients may send this header. */
            var xAdminPortal = String((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a['x-admin-portal']) !== null && _b !== void 0 ? _b : '')
                .trim()
                .toLowerCase();
            if (['1', 'true', 'yes', 'admin'].includes(xAdminPortal)) {
                return 'admin';
            }
            var host = String(((_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.host) || '')
                .trim()
                .toLowerCase();
            var origin = String(((_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.origin) || '')
                .trim()
                .toLowerCase();
            var referer = String(((_e = req === null || req === void 0 ? void 0 : req.headers) === null || _e === void 0 ? void 0 : _e.referer) || '')
                .trim()
                .toLowerCase();
            /**
             * Production admin SPA on Vercel: **Origin** is only the hostname
             * (`https://greenpro-portals.vercel.app`) — it does **not** contain the
             * string `admin`, so the old `greenpro-portals` + `admin` check never matched.
             * **Referer** may include `/admin/...` when the browser sends it.
             */
            if (referer.includes('/admin')) {
                return 'admin';
            }
            if (origin.includes('greenpro-portals.vercel.app') ||
                referer.includes('greenpro-portals.vercel.app')) {
                return 'admin';
            }
            var combined = "".concat(host, " ").concat(origin, " ").concat(referer);
            if (combined.includes('localhost:3004'))
                return 'admin';
            if (combined.includes('localhost:3001'))
                return 'vendor';
            if (combined.includes('admin/login'))
                return 'admin';
            if (combined.includes('greenpro-portals') &&
                combined.includes('admin')) {
                return 'admin';
            }
            return undefined;
        };
        AuthController_1.prototype.forgotPassword = function (forgotPasswordDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var portal;
                return __generator(this, function (_a) {
                    portal = this.resolvePortal(req, forgotPasswordDto.portal);
                    return [2 /*return*/, this.authService.forgotPassword(forgotPasswordDto, portal)];
                });
            });
        };
        AuthController_1.prototype.refresh = function (refreshTokenDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.refresh(refreshTokenDto)];
                });
            });
        };
        /** Alias for older / alternate clients that call `POST /auth/refresh-token`. */
        AuthController_1.prototype.refreshToken = function (refreshTokenDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.refresh(refreshTokenDto)];
                });
            });
        };
        AuthController_1.prototype.logout = function (req, body) {
            return __awaiter(this, void 0, void 0, function () {
                var accessToken;
                return __generator(this, function (_a) {
                    accessToken = this.extractAccessToken(req);
                    if (!accessToken) {
                        throw new common_1.UnauthorizedException('Authorization token missing');
                    }
                    return [2 /*return*/, this.authService.logout(accessToken, body === null || body === void 0 ? void 0 : body.refreshToken)];
                });
            });
        };
        AuthController_1.prototype.verifyRecaptcha = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var valid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.verifyRecaptcha(dto.captchaToken)];
                        case 1:
                            valid = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: valid ? 'reCAPTCHA verified' : 'Invalid reCAPTCHA token',
                                    data: { valid: valid },
                                }];
                    }
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _registerVendor_decorators = [(0, common_1.Post)('register-vendor'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register a new vendor' })];
        _verifyOtp_decorators = [(0, common_1.Post)('verify-otp'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verify email with OTP',
                description: 'On success, returns **gpInternalId** and **manufacturerInitial** from the linked manufacturer when set (otherwise **null**). Vendor profile GET also exposes these only after the account email is verified.',
            })];
        _resendOtp_decorators = [(0, common_1.Post)('resend-otp'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Resend vendor registration email verification OTP',
                description: 'Sends a new 6-digit OTP to the registered email. Only for **unverified** vendor/partner accounts. ' +
                    'Rate limited: 60s cooldown between requests; max 5 resends per 15 minutes per email. ' +
                    'In development/staging the OTP is **123456** unless `VENDOR_REGISTRATION_OTP_FIXED` is set.',
            })];
        _login_decorators = [(0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Login user',
                description: 'Requires a **body**. Unknown emails return **401** with **Email not registered** (not generic invalid credentials). For the **admin portal**, send **`portal`: `"admin"`** (recommended) for correct portal/type checks. ' +
                    'If the API runs on a different port than the SPA, also send header **`x-admin-portal`: `1`** when `Origin` may not identify the admin app. ' +
                    'Success responses for admin/staff include **designation**, **mobile**, **vendorUserId** on **`user`**.',
            }), (0, swagger_1.ApiBody)({
                type: login_dto_1.LoginDto,
                examples: {
                    vendor: {
                        summary: 'Vendor portal',
                        value: {
                            email: 'user@example.com',
                            password: 'YourPassword123',
                            portal: 'vendor',
                        },
                    },
                    admin: {
                        summary: 'Admin portal',
                        value: {
                            email: 'staff@example.com',
                            password: 'YourPassword123',
                            portal: 'admin',
                        },
                    },
                },
            })];
        _forgotPassword_decorators = [(0, common_1.Post)('forgot-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Request password reset',
                description: 'Prefer **`portal`: `"admin"`** or **`x-admin-portal`: `1`**. Without them, the API infers admin from **Referer** (`/admin` path) or **Origin** host **`greenpro-portals.vercel.app`**. Unknown email: admin → **400** **Email id is not registered**; vendor/other → **400** **User not registered**. Staff without RBAC or wrong account type → **Portal access restricted**.',
            })];
        _refresh_decorators = [(0, common_1.Post)('refresh'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' })];
        _refreshToken_decorators = [(0, common_1.Post)('refresh-token'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token (alias of POST /auth/refresh)' })];
        _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Logout current session',
                description: 'Revokes current access token and optional refresh token to prevent reuse.',
            }), (0, swagger_1.ApiBody)({ type: logout_dto_1.LogoutDto, required: false })];
        _verifyRecaptcha_decorators = [(0, common_1.Post)('verify-recaptcha'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verify reCAPTCHA token',
                description: 'Verifies a frontend reCAPTCHA token using RECAPTCHA_SECRET_KEY and returns whether it is valid.',
            }), (0, swagger_1.ApiBody)({ type: verify_recaptcha_dto_1.VerifyRecaptchaDto })];
        __esDecorate(_classThis, null, _registerVendor_decorators, { kind: "method", name: "registerVendor", static: false, private: false, access: { has: function (obj) { return "registerVendor" in obj; }, get: function (obj) { return obj.registerVendor; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyOtp_decorators, { kind: "method", name: "verifyOtp", static: false, private: false, access: { has: function (obj) { return "verifyOtp" in obj; }, get: function (obj) { return obj.verifyOtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resendOtp_decorators, { kind: "method", name: "resendOtp", static: false, private: false, access: { has: function (obj) { return "resendOtp" in obj; }, get: function (obj) { return obj.resendOtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: function (obj) { return "refresh" in obj; }, get: function (obj) { return obj.refresh; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshToken_decorators, { kind: "method", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyRecaptcha_decorators, { kind: "method", name: "verifyRecaptcha", static: false, private: false, access: { has: function (obj) { return "verifyRecaptcha" in obj; }, get: function (obj) { return obj.verifyRecaptcha; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
