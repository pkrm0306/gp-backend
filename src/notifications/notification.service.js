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
exports.NotificationService = void 0;
var common_1 = require("@nestjs/common");
var NotificationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationService = _classThis = /** @class */ (function () {
        function NotificationService_1(channelRegistry, templateRegistry) {
            this.channelRegistry = channelRegistry;
            this.templateRegistry = templateRegistry;
            this.logger = new common_1.Logger(NotificationService.name);
        }
        /**
         * Central dispatch — modules should use NotificationHelper instead of EmailService directly.
         */
        NotificationService_1.prototype.send = function (request) {
            return __awaiter(this, void 0, void 0, function () {
                var recipients, channels, results, _i, recipients_1, recipient, _a, channels_1, channel, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.validateRequest(request);
                            this.templateRegistry.getDefinition(request.template);
                            recipients = this.resolveRecipients(request);
                            channels = this.normalizeChannels(request.type);
                            results = [];
                            _i = 0, recipients_1 = recipients;
                            _d.label = 1;
                        case 1:
                            if (!(_i < recipients_1.length)) return [3 /*break*/, 6];
                            recipient = recipients_1[_i];
                            _a = 0, channels_1 = channels;
                            _d.label = 2;
                        case 2:
                            if (!(_a < channels_1.length)) return [3 /*break*/, 5];
                            channel = channels_1[_a];
                            _c = (_b = results).push;
                            return [4 /*yield*/, this.dispatchChannel(channel, request, recipient)];
                        case 3:
                            _c.apply(_b, [_d.sent()]);
                            _d.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, {
                                template: request.template,
                                recipientCount: recipients.length,
                                results: results,
                            }];
                    }
                });
            });
        };
        /**
         * Queue-ready: fire-and-forget; logs failures without throwing to caller.
         */
        NotificationService_1.prototype.sendInBackground = function (request) {
            var _this = this;
            this.send(__assign(__assign({}, request), { async: true }))
                .then(function (result) {
                var failed = result.results.filter(function (r) { return !r.success && !r.skipped; });
                if (failed.length > 0) {
                    _this.logger.warn("Background notification [".concat(request.template, "] had ").concat(failed.length, " channel failure(s)"));
                }
            })
                .catch(function (error) {
                _this.logger.error("Background notification [".concat(request.template, "] failed: ").concat(error === null || error === void 0 ? void 0 : error.message));
            });
        };
        /** Multiple explicit recipients — one dispatch per recipient (failure isolated). */
        NotificationService_1.prototype.sendToMany = function (recipients, request) {
            return __awaiter(this, void 0, void 0, function () {
                var allResults, _i, recipients_2, recipient, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!recipients.length) {
                                throw new common_1.BadRequestException('At least one recipient is required');
                            }
                            allResults = [];
                            _i = 0, recipients_2 = recipients;
                            _a.label = 1;
                        case 1:
                            if (!(_i < recipients_2.length)) return [3 /*break*/, 4];
                            recipient = recipients_2[_i];
                            return [4 /*yield*/, this.send(__assign(__assign({}, request), { userId: recipient.userId, email: recipient.email }))];
                        case 2:
                            result = _a.sent();
                            allResults.push.apply(allResults, result.results);
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, {
                                template: request.template,
                                recipientCount: recipients.length,
                                results: allResults,
                            }];
                    }
                });
            });
        };
        /**
         * Future: resolve users by role and broadcast.
         * Throws until role resolver is implemented.
         */
        NotificationService_1.prototype.sendToRoles = function (_roleKeys, _request) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new common_1.BadRequestException('Role-based notification broadcast is not implemented yet. Use userIds or emails.');
                });
            });
        };
        NotificationService_1.prototype.validateRequest = function (request) {
            if (!request.template) {
                throw new common_1.BadRequestException('template is required');
            }
            if (!Array.isArray(request.type) || request.type.length === 0) {
                throw new common_1.BadRequestException('At least one notification channel type is required');
            }
            var recipients = this.resolveRecipients(request);
            if (recipients.length === 0) {
                throw new common_1.BadRequestException('At least one recipient is required (userId, userIds, email, or emails)');
            }
        };
        NotificationService_1.prototype.normalizeChannels = function (types) {
            var _this = this;
            var unique = __spreadArray([], new Set(types), true);
            var unsupported = unique.filter(function (c) { return !_this.channelRegistry.get(c); });
            if (unsupported.length > 0) {
                throw new common_1.BadRequestException("Unsupported or not-yet-implemented channels: ".concat(unsupported.join(', '), ". ") +
                    "Available: ".concat(this.channelRegistry.listImplemented().join(', ')));
            }
            return unique;
        };
        NotificationService_1.prototype.resolveRecipients = function (request) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var list = [];
            if ((_a = request.userId) === null || _a === void 0 ? void 0 : _a.trim()) {
                list.push({
                    userId: request.userId.trim(),
                    email: (_b = request.email) === null || _b === void 0 ? void 0 : _b.trim(),
                });
            }
            for (var _i = 0, _l = (_c = request.userIds) !== null && _c !== void 0 ? _c : []; _i < _l.length; _i++) {
                var uid = _l[_i];
                if (uid === null || uid === void 0 ? void 0 : uid.trim()) {
                    list.push({ userId: uid.trim() });
                }
            }
            if (((_d = request.email) === null || _d === void 0 ? void 0 : _d.trim()) && !list.some(function (r) { var _a; return r.email === ((_a = request.email) === null || _a === void 0 ? void 0 : _a.trim()); })) {
                list.push({ email: request.email.trim(), userId: (_e = request.userId) === null || _e === void 0 ? void 0 : _e.trim() });
            }
            for (var _m = 0, _o = (_f = request.emails) !== null && _f !== void 0 ? _f : []; _m < _o.length; _m++) {
                var em = _o[_m];
                if (em === null || em === void 0 ? void 0 : em.trim()) {
                    list.push({ email: em.trim() });
                }
            }
            var deduped = new Map();
            for (var _p = 0, list_1 = list; _p < list_1.length; _p++) {
                var r = list_1[_p];
                var key = "".concat((_g = r.userId) !== null && _g !== void 0 ? _g : '', "|").concat((_h = r.email) !== null && _h !== void 0 ? _h : '');
                if (!key.replace(/\|/g, ''))
                    continue;
                var existing = deduped.get(key);
                if (existing) {
                    deduped.set(key, {
                        userId: (_j = existing.userId) !== null && _j !== void 0 ? _j : r.userId,
                        email: (_k = existing.email) !== null && _k !== void 0 ? _k : r.email,
                    });
                }
                else {
                    deduped.set(key, r);
                }
            }
            return __spreadArray([], deduped.values(), true);
        };
        NotificationService_1.prototype.dispatchChannel = function (channel, request, recipient) {
            return __awaiter(this, void 0, void 0, function () {
                var handler, context, error_1, message;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            handler = this.channelRegistry.get(channel);
                            if (!handler) {
                                return [2 /*return*/, {
                                        channel: channel,
                                        success: false,
                                        error: 'Channel handler not registered',
                                    }];
                            }
                            context = {
                                template: request.template,
                                payload: (_a = request.payload) !== null && _a !== void 0 ? _a : {},
                                recipient: recipient,
                                cc: request.cc,
                                inAppOverrides: request.inApp,
                            };
                            if (!handler.supports(context)) {
                                this.logger.debug("Skipping ".concat(channel, " for template ").concat(request.template, ": recipient missing required fields"));
                                return [2 /*return*/, {
                                        channel: channel,
                                        success: false,
                                        skipped: true,
                                        error: 'Recipient missing required fields for channel',
                                    }];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, handler.send(context)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            error_1 = _b.sent();
                            message = (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Channel dispatch failed';
                            this.logger.error("Unhandled error on ".concat(channel, " [").concat(request.template, "]: ").concat(message));
                            if (!request.async) {
                                // Failure isolation: return result instead of throwing
                            }
                            return [2 /*return*/, { channel: channel, success: false, error: message, attempts: 1 }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return NotificationService_1;
    }());
    __setFunctionName(_classThis, "NotificationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationService = _classThis;
}();
exports.NotificationService = NotificationService;
