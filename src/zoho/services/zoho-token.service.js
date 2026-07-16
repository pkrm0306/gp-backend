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
exports.ZohoTokenService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var zoho_constants_1 = require("../helpers/zoho.constants");
var ZohoTokenService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZohoTokenService = _classThis = /** @class */ (function () {
        function ZohoTokenService_1(configService, redisService, tokenModel) {
            this.configService = configService;
            this.redisService = redisService;
            this.tokenModel = tokenModel;
            this.logger = new common_1.Logger(ZohoTokenService.name);
        }
        ZohoTokenService_1.prototype.getValidAccessToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cached, stored;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService.get(zoho_constants_1.ZOHO_TOKEN_CACHE_KEY)];
                        case 1:
                            cached = _a.sent();
                            if ((cached === null || cached === void 0 ? void 0 : cached.accessToken) && this.isUsable(cached.expiresAt)) {
                                return [2 /*return*/, cached.accessToken];
                            }
                            return [4 /*yield*/, this.tokenModel.findOne({ key: 'primary' }).exec()];
                        case 2:
                            stored = _a.sent();
                            if (!((stored === null || stored === void 0 ? void 0 : stored.accessToken) && this.isUsable(stored.expiresAt))) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.cacheToken(stored.accessToken, stored.expiresAt)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, stored.accessToken];
                        case 4: return [2 /*return*/, this.refreshAccessToken()];
                    }
                });
            });
        };
        ZohoTokenService_1.prototype.refreshAccessToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, clientSecret, stored, refreshToken, tokenUrl, body, response, expiresInSeconds, expiresAt, error_1, message;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            clientId = this.requiredConfig('ZOHO_CLIENT_ID');
                            clientSecret = this.requiredConfig('ZOHO_CLIENT_SECRET');
                            return [4 /*yield*/, this.tokenModel.findOne({ key: 'primary' }).exec()];
                        case 1:
                            stored = _b.sent();
                            refreshToken = this.configService.get('ZOHO_REFRESH_TOKEN') ||
                                (stored === null || stored === void 0 ? void 0 : stored.refreshToken);
                            if (!refreshToken) {
                                throw new common_1.ServiceUnavailableException('Zoho refresh token is not configured');
                            }
                            tokenUrl = "".concat(this.resolveAccountsBaseUrl(), "/oauth/v2/token");
                            body = new URLSearchParams({
                                refresh_token: String(refreshToken).trim(),
                                client_id: clientId,
                                client_secret: clientSecret,
                                grant_type: 'refresh_token',
                            });
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 6, , 8]);
                            return [4 /*yield*/, axios_1.default.post(tokenUrl, body.toString(), {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    timeout: this.requestTimeoutMs(),
                                })];
                        case 3:
                            response = _b.sent();
                            expiresInSeconds = (_a = response.data.expires_in) !== null && _a !== void 0 ? _a : 3600;
                            expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
                            return [4 /*yield*/, this.tokenModel
                                    .findOneAndUpdate({ key: 'primary' }, {
                                    $set: {
                                        accessToken: response.data.access_token,
                                        apiDomain: response.data.api_domain,
                                        expiresAt: expiresAt,
                                        lastRefreshError: undefined,
                                        lastRefreshedAt: new Date(),
                                    },
                                    $setOnInsert: { key: 'primary', refreshToken: refreshToken },
                                }, { new: true, upsert: true })
                                    .exec()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.cacheToken(response.data.access_token, expiresAt)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, response.data.access_token];
                        case 6:
                            error_1 = _b.sent();
                            message = this.extractRefreshErrorMessage(error_1);
                            this.logger.error("Zoho token refresh failed (".concat(tokenUrl, "): ").concat(message));
                            return [4 /*yield*/, this.tokenModel
                                    .findOneAndUpdate({ key: 'primary' }, {
                                    $set: {
                                        lastRefreshError: String(message),
                                        lastRefreshedAt: new Date(),
                                    },
                                    $setOnInsert: { key: 'primary', refreshToken: refreshToken },
                                }, { upsert: true })
                                    .exec()];
                        case 7:
                            _b.sent();
                            throw new common_1.ServiceUnavailableException("Unable to refresh Zoho token: ".concat(message));
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        ZohoTokenService_1.prototype.extractRefreshErrorMessage = function (error) {
            var _a, _b;
            if (axios_1.default.isAxiosError(error)) {
                var responseData = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
                if (typeof responseData === 'string' && responseData.trim()) {
                    try {
                        var parsed = JSON.parse(responseData);
                        var parsedMessage = parsed.error_description ||
                            parsed.error ||
                            parsed.message ||
                            '';
                        if (parsedMessage)
                            return parsedMessage;
                    }
                    catch (_c) {
                        return responseData;
                    }
                }
                if (responseData && typeof responseData === 'object') {
                    var body = responseData;
                    var message = body.error_description ||
                        body.error ||
                        body.message;
                    if (message)
                        return message;
                }
                var status_1 = (_b = error.response) === null || _b === void 0 ? void 0 : _b.status;
                return "HTTP ".concat(status_1 || 'unknown', " from Zoho accounts token endpoint");
            }
            if (error instanceof Error) {
                return error.message;
            }
            return 'Zoho token refresh failed';
        };
        ZohoTokenService_1.prototype.cacheToken = function (accessToken, expiresAt) {
            return __awaiter(this, void 0, void 0, function () {
                var expiry, ttlSeconds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expiry = expiresAt
                                ? new Date(expiresAt)
                                : new Date(Date.now() + 3600);
                            ttlSeconds = Math.max(1, Math.floor((expiry.getTime() - Date.now() - zoho_constants_1.ZOHO_TOKEN_REFRESH_SKEW_MS) / 1000));
                            return [4 /*yield*/, this.redisService.set(zoho_constants_1.ZOHO_TOKEN_CACHE_KEY, { accessToken: accessToken, expiresAt: expiry.toISOString() }, ttlSeconds)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ZohoTokenService_1.prototype.isUsable = function (expiresAt) {
            if (!expiresAt)
                return false;
            return (new Date(expiresAt).getTime() - Date.now() > zoho_constants_1.ZOHO_TOKEN_REFRESH_SKEW_MS);
        };
        /**
         * OAuth must hit accounts.zoho.* — not www.zohoapis.in (CRM).
         * Strips inline comments (# ...) often pasted into Render env values.
         */
        ZohoTokenService_1.prototype.resolveAccountsBaseUrl = function () {
            var raw = this.configService.get('ZOHO_ACCOUNTS_URL') ||
                zoho_constants_1.ZOHO_DEFAULT_ACCOUNTS_URL;
            var trimmed = String(raw).split('#')[0].trim().replace(/\/+$/, '');
            trimmed = trimmed.replace(/\/oauth\/v2\/token\/?$/i, '');
            if (/zohoapis\./i.test(trimmed)) {
                this.logger.warn("ZOHO_ACCOUNTS_URL is set to CRM host (".concat(trimmed, "); using ").concat(zoho_constants_1.ZOHO_DEFAULT_ACCOUNTS_URL, " for OAuth token refresh"));
                return zoho_constants_1.ZOHO_DEFAULT_ACCOUNTS_URL;
            }
            return trimmed || zoho_constants_1.ZOHO_DEFAULT_ACCOUNTS_URL;
        };
        ZohoTokenService_1.prototype.requiredConfig = function (key) {
            var _a;
            var value = String((_a = this.configService.get(key)) !== null && _a !== void 0 ? _a : '')
                .split('#')[0]
                .trim();
            if (!value) {
                throw new common_1.ServiceUnavailableException("".concat(key, " is not configured"));
            }
            return value;
        };
        ZohoTokenService_1.prototype.requestTimeoutMs = function () {
            return (Number(this.configService.get('ZOHO_HTTP_TIMEOUT_MS')) || 15000);
        };
        return ZohoTokenService_1;
    }());
    __setFunctionName(_classThis, "ZohoTokenService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoTokenService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoTokenService = _classThis;
}();
exports.ZohoTokenService = ZohoTokenService;
