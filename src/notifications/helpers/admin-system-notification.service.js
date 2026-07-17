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
exports.AdminSystemNotificationService = void 0;
var common_1 = require("@nestjs/common");
var notification_recipient_groups_util_1 = require("../utils/notification-recipient-groups.util");
var AdminSystemNotificationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminSystemNotificationService = _classThis = /** @class */ (function () {
        function AdminSystemNotificationService_1(notificationModel, configService, emailService) {
            this.notificationModel = notificationModel;
            this.configService = configService;
            this.emailService = emailService;
            this.logger = new common_1.Logger(AdminSystemNotificationService.name);
        }
        /**
         * Admin panel bell feed. By default also emails ADMIN_ALERT_EMAIL with
         * rmeghana184@gmail.com (or ADMIN_MAIL_CC) always in CC.
         */
        AdminSystemNotificationService_1.prototype.createFeedNotification = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.notificationModel.create({
                                    title: input.title,
                                    message: input.message,
                                    type: (_a = input.type) !== null && _a !== void 0 ? _a : 'info',
                                    source: (_b = input.source) !== null && _b !== void 0 ? _b : 'vendor',
                                    referenceType: input.referenceType,
                                    referenceId: input.referenceId,
                                    actorName: input.actorName,
                                })];
                        case 1:
                            _e.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _e.sent();
                            this.logger.warn("Admin feed notification failed: ".concat(error_1 === null || error_1 === void 0 ? void 0 : error_1.message));
                            return [3 /*break*/, 3];
                        case 3:
                            if (input.skipEmail) {
                                return [2 /*return*/];
                            }
                            // Never block the caller (public forms / admin saves) on SMTP failures.
                            this.sendAdminAlertEmailInBackground({
                                subject: (_c = input.emailSubject) !== null && _c !== void 0 ? _c : "GreenPro \u2014 ".concat(input.title),
                                html: (_d = input.emailHtmlExtra) !== null && _d !== void 0 ? _d : "<p>".concat(this.escapeHtml(input.message), "</p>"),
                                text: input.message,
                                ccGroups: input.ccGroups,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Deliver admin alert via Gmail (not Mailtrap-only) with ops CC.
         */
        AdminSystemNotificationService_1.prototype.sendAdminAlertEmail = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var to, cc, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            to = (0, notification_recipient_groups_util_1.resolveAdminAlertTo)(this.configService);
                            if (!to) {
                                this.logger.warn('Admin alert email skipped — set ADMIN_ALERT_EMAIL or ADMIN_MAIL_CC');
                                return [2 /*return*/];
                            }
                            cc = this.resolveAdminAlertCc(input.ccGroups);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.emailService.sendEmail(to, input.subject, input.html, input.text, {
                                    cc: cc.length ? cc : undefined,
                                    primaryOnly: true,
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Admin alert email sent to ".concat(to).concat(cc.length ? ", cc: ".concat(cc.join(', ')) : '', " \u2014 ").concat(input.subject));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("Admin alert email failed to ".concat(to, " \u2014 ").concat(input.subject, ": ").concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || error_2));
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminSystemNotificationService_1.prototype.sendAdminAlertEmailInBackground = function (input) {
            var _this = this;
            this.emailService.sendInBackground(function () { return _this.sendAdminAlertEmail(input); });
        };
        /** Always CC ops (rmeghana184@gmail.com by default), even when also the To address. */
        AdminSystemNotificationService_1.prototype.resolveAdminAlertCc = function (ccGroups) {
            return (0, notification_recipient_groups_util_1.mergeEmailLists)([
                (0, notification_recipient_groups_util_1.resolveCcGroups)(this.configService, ccGroups),
                (0, notification_recipient_groups_util_1.resolveAlwaysAdminCc)(this.configService),
            ]);
        };
        AdminSystemNotificationService_1.prototype.escapeHtml = function (input) {
            return String(input !== null && input !== void 0 ? input : '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        return AdminSystemNotificationService_1;
    }());
    __setFunctionName(_classThis, "AdminSystemNotificationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminSystemNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminSystemNotificationService = _classThis;
}();
exports.AdminSystemNotificationService = AdminSystemNotificationService;
