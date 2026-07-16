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
exports.ZohoApiClientService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var zoho_constants_1 = require("../helpers/zoho.constants");
var ZohoApiClientService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZohoApiClientService = _classThis = /** @class */ (function () {
        function ZohoApiClientService_1(configService, tokenService) {
            this.configService = configService;
            this.tokenService = tokenService;
            this.logger = new common_1.Logger(ZohoApiClientService.name);
        }
        ZohoApiClientService_1.prototype.get = function (path, config) {
            return this.request('GET', path, undefined, config);
        };
        ZohoApiClientService_1.prototype.post = function (path, data, config) {
            return this.request('POST', path, data, config);
        };
        ZohoApiClientService_1.prototype.put = function (path, data, config) {
            return this.request('PUT', path, data, config);
        };
        ZohoApiClientService_1.prototype.patch = function (path, data, config) {
            return this.request('PATCH', path, data, config);
        };
        ZohoApiClientService_1.prototype.request = function (method, path, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var attempts, lastError, attempt, accessToken, _a, response, error_1, axiosError, status_1, shouldRetry, normalized;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            attempts = this.retryAttempts();
                            attempt = 1;
                            _d.label = 1;
                        case 1:
                            if (!(attempt <= attempts)) return [3 /*break*/, 11];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 8, , 10]);
                            if (!(attempt === 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.tokenService.getValidAccessToken()];
                        case 3:
                            _a = _d.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.tokenService.refreshAccessToken()];
                        case 5:
                            _a = _d.sent();
                            _d.label = 6;
                        case 6:
                            accessToken = _a;
                            return [4 /*yield*/, axios_1.default.request(__assign(__assign({}, config), { method: method, url: this.buildUrl(path), data: data, timeout: this.requestTimeoutMs(), headers: __assign({ Authorization: "Zoho-oauthtoken ".concat(accessToken), 'Content-Type': 'application/json' }, ((config === null || config === void 0 ? void 0 : config.headers) || {})) }))];
                        case 7:
                            response = _d.sent();
                            return [2 /*return*/, {
                                    ok: true,
                                    statusCode: response.status,
                                    data: response.data,
                                    zohoRequestId: this.resolveRequestId(response.headers),
                                }];
                        case 8:
                            error_1 = _d.sent();
                            lastError = error_1;
                            axiosError = error_1;
                            status_1 = (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.status;
                            shouldRetry = attempt < attempts && (!status_1 || status_1 === 401 || status_1 >= 500);
                            if (!shouldRetry) {
                                return [3 /*break*/, 11];
                            }
                            this.logger.warn("Retrying Zoho ".concat(method, " ").concat(path, "; attempt ").concat(attempt + 1, "/").concat(attempts));
                            return [4 /*yield*/, this.delay(this.retryDelayMs() * attempt)];
                        case 9:
                            _d.sent();
                            return [3 /*break*/, 10];
                        case 10:
                            attempt += 1;
                            return [3 /*break*/, 1];
                        case 11:
                            normalized = this.normalizeError(lastError);
                            this.logger.error("Zoho ".concat(method, " ").concat(path, " failed: ").concat((_c = normalized.error) === null || _c === void 0 ? void 0 : _c.message));
                            return [2 /*return*/, normalized];
                    }
                });
            });
        };
        ZohoApiClientService_1.prototype.buildUrl = function (path) {
            var baseUrl = String(this.configService.get('ZOHO_BASE_URL') || zoho_constants_1.ZOHO_DEFAULT_BASE_URL)
                .split('#')[0]
                .trim()
                .replace(/\/crm\/v\d+\/?$/i, '');
            var normalizedBase = baseUrl.replace(/\/+$/, '');
            var normalizedPath = path.startsWith('/') ? path : "/".concat(path);
            return "".concat(normalizedBase).concat(normalizedPath);
        };
        ZohoApiClientService_1.prototype.normalizeError = function (error) {
            var _a, _b, _c;
            if (axios_1.default.isAxiosError(error)) {
                var body = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
                var apiError = {
                    code: body === null || body === void 0 ? void 0 : body.code,
                    message: (body === null || body === void 0 ? void 0 : body.message) || error.message || 'Zoho API request failed',
                    details: (body === null || body === void 0 ? void 0 : body.details) || body,
                };
                return {
                    ok: false,
                    statusCode: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 503,
                    error: apiError,
                    zohoRequestId: this.resolveRequestId((_c = error.response) === null || _c === void 0 ? void 0 : _c.headers),
                };
            }
            if (error instanceof common_1.ServiceUnavailableException) {
                var response = error.getResponse();
                var message = typeof response === 'string'
                    ? response
                    : (response === null || response === void 0 ? void 0 : response.message) || error.message;
                return {
                    ok: false,
                    statusCode: 503,
                    error: { message: message },
                };
            }
            return {
                ok: false,
                statusCode: 500,
                error: {
                    message: error instanceof Error ? error.message : 'Zoho request failed',
                },
            };
        };
        ZohoApiClientService_1.prototype.resolveRequestId = function (headers) {
            if (!headers || typeof headers !== 'object')
                return undefined;
            var value = headers['x-zcrm-request-id'] ||
                headers['x-request-id'];
            return Array.isArray(value) ? value[0] : value;
        };
        ZohoApiClientService_1.prototype.retryAttempts = function () {
            return (Number(this.configService.get('ZOHO_RETRY_ATTEMPTS')) ||
                zoho_constants_1.ZOHO_DEFAULT_RETRY_ATTEMPTS);
        };
        ZohoApiClientService_1.prototype.retryDelayMs = function () {
            return (Number(this.configService.get('ZOHO_RETRY_DELAY_MS')) ||
                zoho_constants_1.ZOHO_DEFAULT_RETRY_DELAY_MS);
        };
        ZohoApiClientService_1.prototype.requestTimeoutMs = function () {
            return (Number(this.configService.get('ZOHO_HTTP_TIMEOUT_MS')) || 15000);
        };
        ZohoApiClientService_1.prototype.delay = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        return ZohoApiClientService_1;
    }());
    __setFunctionName(_classThis, "ZohoApiClientService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoApiClientService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoApiClientService = _classThis;
}();
exports.ZohoApiClientService = ZohoApiClientService;
