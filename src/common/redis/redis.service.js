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
exports.RedisService = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = require("ioredis");
var RedisService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RedisService = _classThis = /** @class */ (function () {
        function RedisService_1(configService) {
            var _this = this;
            var _a;
            this.configService = configService;
            this.logger = new common_1.Logger(RedisService.name);
            this.client = null;
            this.useInMemoryFallback = false;
            this.suppressClientErrors = false;
            this.inMemoryStore = new Map();
            this.prefix =
                this.configService.get('REDIS_KEY_PREFIX') || 'greenpro:';
            var redisEnabledRaw = (_a = this.configService.get('REDIS_ENABLED')) !== null && _a !== void 0 ? _a : 'true';
            var redisEnabled = redisEnabledRaw.toLowerCase() !== 'false';
            if (!redisEnabled) {
                this.useInMemoryFallback = true;
                this.logger.log('Redis disabled (REDIS_ENABLED=false); using in-process cache (Map)');
                return;
            }
            var redisUrl = (this.configService.get('REDIS_URL') || '').trim();
            var host = this.configService.get('REDIS_HOST') || '127.0.0.1';
            var port = parseInt(this.configService.get('REDIS_PORT') || '6379', 10);
            var password = this.configService.get('REDIS_PASSWORD') || undefined;
            var db = parseInt(this.configService.get('REDIS_DB') || '0', 10);
            var redisTlsRaw = this.configService.get('REDIS_TLS') || 'false';
            var useTls = redisTlsRaw.toLowerCase() === 'true' ||
                redisUrl.toLowerCase().startsWith('rediss://');
            var commonOptions = {
                db: db,
                lazyConnect: true,
                maxRetriesPerRequest: 2,
                enableReadyCheck: true,
                retryStrategy: function () { return null; },
            };
            this.client = redisUrl
                ? new ioredis_1.default(redisUrl, __assign(__assign({}, commonOptions), (useTls ? { tls: {} } : {})))
                : new ioredis_1.default(__assign(__assign({ host: host, port: port, password: password }, commonOptions), (useTls ? { tls: {} } : {})));
            this.client.on('error', function (error) {
                if (_this.useInMemoryFallback || _this.suppressClientErrors) {
                    return;
                }
                _this.logger.error("Redis error: ".concat(error.message));
            });
        }
        RedisService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var host, port, db, error_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (this.useInMemoryFallback || !this.client) {
                                if (!this.useInMemoryFallback) {
                                    this.useInMemoryFallback = true;
                                    this.logger.warn('Redis client not configured; using in-process cache (Map)');
                                }
                                return [2 /*return*/];
                            }
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            this.suppressClientErrors = true;
                            return [4 /*yield*/, this.client.connect()];
                        case 2:
                            _d.sent();
                            host = (_a = this.client.options.host) !== null && _a !== void 0 ? _a : 'unknown';
                            port = (_b = this.client.options.port) !== null && _b !== void 0 ? _b : 'unknown';
                            db = (_c = this.client.options.db) !== null && _c !== void 0 ? _c : 0;
                            this.logger.log("Redis connected (".concat(host, ":").concat(port, ", db=").concat(db, ", prefix=\"").concat(this.prefix, "\")"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _d.sent();
                            this.useInMemoryFallback = true;
                            this.logger.warn("Redis unavailable at ".concat(this.describeRedisTarget(), "; using in-process cache (Map): ").concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            this.disconnectRedisClient();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.describeRedisTarget = function () {
            var redisUrl = (this.configService.get('REDIS_URL') || '').trim();
            if (redisUrl) {
                return redisUrl.replace(/\/\/.*@/, '//***@');
            }
            var host = this.configService.get('REDIS_HOST') || '127.0.0.1';
            var port = this.configService.get('REDIS_PORT') || '6379';
            return "".concat(host, ":").concat(port);
        };
        RedisService_1.prototype.disconnectRedisClient = function () {
            if (!this.client)
                return;
            try {
                this.client.removeAllListeners();
                if (this.client.status !== 'end') {
                    this.client.disconnect(false);
                }
            }
            catch (_a) {
                // no-op
            }
            this.client = null;
        };
        RedisService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.inMemoryStore.clear();
                    this.disconnectRedisClient();
                    return [2 /*return*/];
                });
            });
        };
        RedisService_1.prototype.buildKey = function () {
            var parts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parts[_i] = arguments[_i];
            }
            var safe = parts
                .filter(function (p) { return p !== undefined && p !== null && String(p).trim() !== ''; })
                .map(function (p) { return String(p).trim(); });
            return "".concat(this.prefix).concat(safe.join(':'));
        };
        RedisService_1.prototype.get = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var raw;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.useInMemoryFallback) {
                                return [2 /*return*/, this.getFromMemory(key)];
                            }
                            return [4 /*yield*/, this.client.get(key)];
                        case 1:
                            raw = _a.sent();
                            if (raw === null)
                                return [2 /*return*/, null];
                            try {
                                return [2 /*return*/, JSON.parse(raw)];
                            }
                            catch (_b) {
                                return [2 /*return*/, raw];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.set = function (key, value, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var serialized;
                return __generator(this, function (_a) {
                    serialized = typeof value === 'string' ? value : JSON.stringify(value !== null && value !== void 0 ? value : null);
                    if (this.useInMemoryFallback) {
                        this.setInMemory(key, serialized, ttlSeconds);
                        return [2 /*return*/, 'OK'];
                    }
                    if (ttlSeconds && ttlSeconds > 0) {
                        return [2 /*return*/, this.client.set(key, serialized, 'EX', ttlSeconds)];
                    }
                    return [2 /*return*/, this.client.set(key, serialized)];
                });
            });
        };
        RedisService_1.prototype.del = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var existed;
                return __generator(this, function (_a) {
                    if (this.useInMemoryFallback) {
                        existed = this.inMemoryStore.delete(key);
                        return [2 /*return*/, existed ? 1 : 0];
                    }
                    return [2 /*return*/, this.client.del(key)];
                });
            });
        };
        RedisService_1.prototype.deleteByPattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var cursor, deleted, _a, nextCursor, keys, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (this.useInMemoryFallback) {
                                return [2 /*return*/, this.deleteByPatternInMemory(pattern)];
                            }
                            cursor = '0';
                            deleted = 0;
                            _d.label = 1;
                        case 1: return [4 /*yield*/, this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100)];
                        case 2:
                            _a = _d.sent(), nextCursor = _a[0], keys = _a[1];
                            cursor = nextCursor;
                            if (!(keys.length > 0)) return [3 /*break*/, 4];
                            _b = deleted;
                            return [4 /*yield*/, (_c = this.client).del.apply(_c, keys)];
                        case 3:
                            deleted = _b + _d.sent();
                            _d.label = 4;
                        case 4:
                            if (cursor !== '0') return [3 /*break*/, 1];
                            _d.label = 5;
                        case 5: return [2 /*return*/, deleted];
                    }
                });
            });
        };
        RedisService_1.prototype.exists = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.useInMemoryFallback) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getFromMemory(key)];
                        case 1: return [2 /*return*/, (_a.sent()) !== null];
                        case 2: return [4 /*yield*/, this.client.exists(key)];
                        case 3:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        RedisService_1.prototype.expire = function (key, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var current, ok;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.useInMemoryFallback) {
                                if (!this.inMemoryStore.has(key) || ttlSeconds <= 0)
                                    return [2 /*return*/, false];
                                current = this.inMemoryStore.get(key);
                                if (!current)
                                    return [2 /*return*/, false];
                                this.inMemoryStore.set(key, {
                                    value: current.value,
                                    expiresAt: Date.now() + ttlSeconds * 1000,
                                });
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this.client.expire(key, ttlSeconds)];
                        case 1:
                            ok = _a.sent();
                            return [2 /*return*/, ok === 1];
                    }
                });
            });
        };
        RedisService_1.prototype.getFromMemory = function (key) {
            var entry = this.inMemoryStore.get(key);
            if (!entry)
                return null;
            if (entry.expiresAt && entry.expiresAt <= Date.now()) {
                this.inMemoryStore.delete(key);
                return null;
            }
            try {
                return JSON.parse(entry.value);
            }
            catch (_a) {
                return entry.value;
            }
        };
        RedisService_1.prototype.setInMemory = function (key, serialized, ttlSeconds) {
            this.inMemoryStore.set(key, __assign({ value: serialized }, (ttlSeconds && ttlSeconds > 0
                ? { expiresAt: Date.now() + ttlSeconds * 1000 }
                : {})));
        };
        RedisService_1.prototype.deleteByPatternInMemory = function (pattern) {
            var deleted = 0;
            var regexPattern = new RegExp("^".concat(String(pattern)
                .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                .replace(/\*/g, '.*'), "$"));
            for (var _i = 0, _a = this.inMemoryStore.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                if (regexPattern.test(key)) {
                    this.inMemoryStore.delete(key);
                    deleted += 1;
                }
            }
            return deleted;
        };
        return RedisService_1;
    }());
    __setFunctionName(_classThis, "RedisService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedisService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedisService = _classThis;
}();
exports.RedisService = RedisService;
