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
exports.LifecycleNotificationService = void 0;
var common_1 = require("@nestjs/common");
var notification_types_1 = require("./interfaces/notification.types");
var admin_notification_messages_1 = require("./helpers/admin-notification-messages");
var LifecycleNotificationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LifecycleNotificationService = _classThis = /** @class */ (function () {
        function LifecycleNotificationService_1(notificationHelper, recipientService, adminSystemNotification) {
            this.notificationHelper = notificationHelper;
            this.recipientService = recipientService;
            this.adminSystemNotification = adminSystemNotification;
            this.logger = new common_1.Logger(LifecycleNotificationService.name);
        }
        LifecycleNotificationService_1.prototype.manufacturerLabelFromRecipient = function (recipient, fallback) {
            return ((0, admin_notification_messages_1.resolveManufacturerDisplayName)({
                manufacturerName: recipient === null || recipient === void 0 ? void 0 : recipient.companyName,
                companyName: recipient === null || recipient === void 0 ? void 0 : recipient.companyName,
                contactName: recipient === null || recipient === void 0 ? void 0 : recipient.vendorName,
                email: recipient === null || recipient === void 0 ? void 0 : recipient.email,
            }) ||
                fallback ||
                'Manufacturer');
        };
        LifecycleNotificationService_1.prototype.escapeHtml = function (input) {
            return String(input !== null && input !== void 0 ? input : '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        LifecycleNotificationService_1.prototype.notifyAdminFeedAndEmail = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.adminSystemNotification.createFeedNotification({
                                title: input.copy.title,
                                message: input.copy.message,
                                type: (_a = input.type) !== null && _a !== void 0 ? _a : 'info',
                                source: (_b = input.source) !== null && _b !== void 0 ? _b : 'manufacturer',
                                referenceType: input.referenceType,
                                referenceId: input.referenceId,
                                actorName: input.copy.actorName,
                                emailSubject: (_c = input.emailSubject) !== null && _c !== void 0 ? _c : "GreenPro \u2014 ".concat(input.copy.title),
                                emailHtmlExtra: (_d = input.emailHtmlExtra) !== null && _d !== void 0 ? _d : "<p>".concat(input.copy.message, "</p>"),
                                ccGroups: input.ccGroups,
                            })];
                        case 1:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Email + in-app when `userId` is present. Sign-up/OTP must not use this helper. */
        LifecycleNotificationService_1.prototype.vendorNotifyChannels = function (userId) {
            return (userId === null || userId === void 0 ? void 0 : userId.trim())
                ? [notification_types_1.NotificationChannel.EMAIL, notification_types_1.NotificationChannel.IN_APP]
                : [notification_types_1.NotificationChannel.EMAIL];
        };
        LifecycleNotificationService_1.prototype.sendVendorNotificationInBackground = function (recipient, template, payload, logContext) {
            var _this = this;
            var _a, _b;
            var email = (_a = recipient === null || recipient === void 0 ? void 0 : recipient.email) === null || _a === void 0 ? void 0 : _a.trim();
            var userId = (_b = recipient === null || recipient === void 0 ? void 0 : recipient.userId) === null || _b === void 0 ? void 0 : _b.trim();
            if (!email && !userId) {
                if (logContext) {
                    this.logger.warn("[sendVendorNotificationInBackground] Skipping ".concat(template, " \u2014 no vendor email/userId (").concat(logContext, ")"));
                }
                return;
            }
            if (!email) {
                if (logContext) {
                    this.logger.warn("[sendVendorNotificationInBackground] ".concat(template, " \u2014 email missing; sending in-app only (").concat(logContext, ")"));
                }
            }
            var manufacturerName = this.manufacturerLabelFromRecipient(recipient);
            this.notificationHelper
                .send({
                type: this.vendorNotifyChannels(userId),
                template: template,
                userId: userId,
                email: email,
                payload: __assign({ manufacturerName: manufacturerName, vendorName: manufacturerName }, payload),
            })
                .then(function (result) {
                var failed = result.results.filter(function (r) { return !r.success && !r.skipped; });
                if (failed.length > 0) {
                    _this.logger.warn("[sendVendorEmailInBackground] ".concat(template, " SMTP failed for ").concat(email) +
                        (logContext ? " (".concat(logContext, ")") : '') +
                        ": ".concat(failed.map(function (f) { return f.error; }).join('; ')));
                }
                else {
                    _this.logger.log("[sendVendorEmailInBackground] ".concat(template, " sent via SMTP to ").concat(email) +
                        (logContext ? " (".concat(logContext, ")") : ''));
                }
            })
                .catch(function (error) {
                _this.logger.warn("[sendVendorEmailInBackground] ".concat(template, " failed for ").concat(email) +
                    (logContext ? " (".concat(logContext, ")") : '') +
                    ": ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
            });
        };
        /** Welcome email only. Admin bell feed is created after OTP verify. */
        LifecycleNotificationService_1.prototype.notifyNewVendorRegistered = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerName, notifyResult, emailResult, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            manufacturerName = (0, admin_notification_messages_1.resolveManufacturerDisplayName)({
                                manufacturerName: params.companyName,
                                companyName: params.companyName,
                                contactName: params.name,
                                email: params.email,
                            });
                            return [4 /*yield*/, this.notificationHelper.send({
                                    type: [notification_types_1.NotificationChannel.EMAIL],
                                    template: notification_types_1.NotificationTemplateCode.USER_CREATED,
                                    userId: params.userId,
                                    email: params.email,
                                    payload: {
                                        name: params.name,
                                        manufacturerName: manufacturerName,
                                        email: params.email,
                                        password: params.password,
                                        otp: params.otp,
                                    },
                                })];
                        case 1:
                            notifyResult = _a.sent();
                            emailResult = notifyResult.results.find(function (r) { return r.channel === notification_types_1.NotificationChannel.EMAIL; });
                            if (!(emailResult === null || emailResult === void 0 ? void 0 : emailResult.success)) return [3 /*break*/, 3];
                            this.logger.log("[notifyNewVendorRegistered] email ok for ".concat(params.email));
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.vendorRegistrationOtpSent(manufacturerName, params.email),
                                    referenceType: 'vendor_registration_otp',
                                    referenceId: params.userId,
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 Vendor registration OTP sent \u2014 ".concat(manufacturerName),
                                    emailHtmlExtra: "<p>Registration OTP email was sent to <strong>".concat(this.escapeHtml(params.email), "</strong> for <strong>").concat(this.escapeHtml(manufacturerName), "</strong>.</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3:
                            error = (emailResult === null || emailResult === void 0 ? void 0 : emailResult.error) ||
                                notifyResult.results.map(function (r) { return r.error; }).filter(Boolean).join('; ') ||
                                'Registration welcome email failed';
                            this.logger.error("[notifyNewVendorRegistered] email failed for ".concat(params.email, ": ").concat(error));
                            // Surface failure so /auth/register-vendor can log + user can use Resend OTP.
                            throw new Error(error);
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyVendorOtpResent = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var notifyResult, _i, _a, r, manufacturerName;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.notificationHelper.send({
                                type: [notification_types_1.NotificationChannel.EMAIL],
                                template: notification_types_1.NotificationTemplateCode.OTP_VERIFICATION,
                                userId: params.userId,
                                email: params.email,
                                payload: {
                                    name: params.name,
                                    otp: params.otp,
                                    expiresInMinutes: params.expiresInMinutes,
                                },
                            })];
                        case 1:
                            notifyResult = _b.sent();
                            for (_i = 0, _a = notifyResult.results; _i < _a.length; _i++) {
                                r = _a[_i];
                                if (r.success) {
                                    this.logger.log("[notifyVendorOtpResent] ".concat(r.channel, " ok for ").concat(params.email));
                                }
                                else if (!r.skipped) {
                                    this.logger.warn("[notifyVendorOtpResent] ".concat(r.channel, " failed for ").concat(params.email, ": ").concat(r.error));
                                    throw new Error(r.error || 'OTP email send failed');
                                }
                            }
                            manufacturerName = (0, admin_notification_messages_1.resolveManufacturerDisplayName)({
                                contactName: params.name,
                                email: params.email,
                            });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.vendorOtpResent(manufacturerName, params.email),
                                    referenceType: 'vendor_otp_resent',
                                    referenceId: params.userId,
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 Vendor OTP resent \u2014 ".concat(manufacturerName),
                                    emailHtmlExtra: "<p>Verification OTP was resent to <strong>".concat(this.escapeHtml(params.email), "</strong> for <strong>").concat(this.escapeHtml(manufacturerName), "</strong>.</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyVendorRegistrationComplete = function (userId, email, manufacturerName) {
            return __awaiter(this, void 0, void 0, function () {
                var label, notifyResult, _i, _a, r, completeCopy;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            label = (0, admin_notification_messages_1.resolveManufacturerDisplayName)({ manufacturerName: manufacturerName, email: email });
                            return [4 /*yield*/, this.notificationHelper.send({
                                    type: this.vendorNotifyChannels(userId),
                                    template: notification_types_1.NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
                                    userId: userId,
                                    email: email,
                                    payload: { manufacturerName: label, vendorName: label, email: email },
                                })];
                        case 1:
                            notifyResult = _b.sent();
                            for (_i = 0, _a = notifyResult.results; _i < _a.length; _i++) {
                                r = _a[_i];
                                if (r.success) {
                                    this.logger.log("[notifyVendorRegistrationComplete] ".concat(r.channel, " ok for ").concat(email));
                                }
                                else if (!r.skipped) {
                                    this.logger.warn("[notifyVendorRegistrationComplete] ".concat(r.channel, " failed for ").concat(email, ": ").concat(r.error));
                                }
                            }
                            completeCopy = admin_notification_messages_1.AdminNotificationMessages.registrationComplete(label);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: completeCopy,
                                    referenceType: 'vendor_registration',
                                    referenceId: userId,
                                    type: 'success',
                                    emailSubject: "GreenPro \u2014 ".concat(completeCopy.title),
                                    emailHtmlExtra: "<p>".concat(this.escapeHtml(completeCopy.message), "</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyDocumentUploaded = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            copy = admin_notification_messages_1.AdminNotificationMessages.documentUploaded(manufacturerName);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'document_uploaded',
                                    referenceId: params.urnNo || params.manufacturerId,
                                    type: 'info',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyUrnInitialApproved = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, productName;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _e.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && ((_a = params.vendorEmail) === null || _a === void 0 ? void 0 : _a.trim())) {
                                recipient = {
                                    email: params.vendorEmail.trim().toLowerCase(),
                                    companyName: params.manufacturerName,
                                    vendorName: params.manufacturerName,
                                };
                            }
                            manufacturerName = (_b = params.manufacturerName) !== null && _b !== void 0 ? _b : this.manufacturerLabelFromRecipient(recipient);
                            productName = (_c = params.productName) !== null && _c !== void 0 ? _c : params.urnNo;
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.URN_INITIAL_APPROVED, {
                                urnNo: params.urnNo,
                                productName: productName,
                                approvedBy: (_d = params.approvedBy) !== null && _d !== void 0 ? _d : 'GreenPro Admin',
                            }, "notifyUrnInitialApproved manufacturerId=".concat(params.manufacturerId, " urn=").concat(params.urnNo));
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.urnInitialApproved(manufacturerName, params.urnNo, productName),
                                    referenceType: 'urn_initial_approved',
                                    referenceId: params.urnNo,
                                    type: 'success',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyUrnRegistrationRejected = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, reason, productName;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _d.sent();
                            reason = String((_a = params.reason) !== null && _a !== void 0 ? _a : '').trim() ||
                                'Your registration was not approved at the initial review stage.';
                            productName = (_b = params.productName) !== null && _b !== void 0 ? _b : params.urnNo;
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.URN_REGISTRATION_REJECTED, {
                                urnNo: params.urnNo,
                                productName: productName,
                                reason: reason,
                                rejectedBy: (_c = params.rejectedBy) !== null && _c !== void 0 ? _c : 'GreenPro Admin',
                            }, "notifyUrnRegistrationRejected manufacturerId=".concat(params.manufacturerId, " urn=").concat(params.urnNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductRegistered = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, productNames, eoiNos, copy, productRowsHtml, subjectNoun;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _d.sent();
                            manufacturerName = (_a = params.manufacturerName) !== null && _a !== void 0 ? _a : this.manufacturerLabelFromRecipient(recipient);
                            productNames = (((_b = params.productNames) === null || _b === void 0 ? void 0 : _b.length)
                                ? params.productNames
                                : params.productName
                                    ? [params.productName]
                                    : [])
                                .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
                                .filter(Boolean);
                            eoiNos = ((_c = params.eoiNos) !== null && _c !== void 0 ? _c : [])
                                .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
                                .filter(Boolean);
                            copy = admin_notification_messages_1.AdminNotificationMessages.productRegistered(manufacturerName, params.urnNo, productNames, params.eoiNo);
                            productRowsHtml = productNames.length === 0
                                ? '<p><em>No product names were provided.</em></p>'
                                : "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-collapse:collapse; margin:12px 0;\">\n            <thead>\n              <tr>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">#</th>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">Product name</th>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">EOI</th>\n              </tr>\n            </thead>\n            <tbody>\n              ".concat(productNames
                                    .map(function (name, index) {
                                    var _a;
                                    var eoi = eoiNos[index] ||
                                        (productNames.length === 1 ? ((_a = params.eoiNo) === null || _a === void 0 ? void 0 : _a.trim()) || '—' : '—');
                                    return "<tr>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">".concat(index + 1, "</td>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">").concat(_this.escapeHtml(name), "</td>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">").concat(_this.escapeHtml(eoi || '—'), "</td>\n                  </tr>");
                                })
                                    .join(''), "\n            </tbody>\n          </table>");
                            subjectNoun = productNames.length > 1 ? 'Products registered' : 'Product registered';
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'product_registered',
                                    referenceId: params.urnNo,
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 ".concat(subjectNoun, " by ").concat(manufacturerName),
                                    emailHtmlExtra: "\n        <p><strong>Vendor registered</strong> \u2014 please review the new product registration in the admin portal.</p>\n        <p><strong>Vendor / Manufacturer:</strong> ".concat(this.escapeHtml(manufacturerName), "</p>\n        <p><strong>URN:</strong> ").concat(this.escapeHtml(params.urnNo), "</p>\n        <p><strong>Product count:</strong> ").concat(productNames.length || 1, "</p>\n        <p><strong>Product name list:</strong></p>\n        ").concat(productRowsHtml, "\n      "),
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyUrnSubmittedForReview = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, productNames, eoiNos, copy, productRowsHtml;
                var _this = this;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _e.sent();
                            manufacturerName = (_b = (_a = params.manufacturerName) !== null && _a !== void 0 ? _a : this.manufacturerLabelFromRecipient(recipient)) !== null && _b !== void 0 ? _b : 'Manufacturer';
                            productNames = (((_c = params.productNames) === null || _c === void 0 ? void 0 : _c.length)
                                ? params.productNames
                                : params.productName
                                    ? [params.productName]
                                    : [])
                                .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
                                .filter(Boolean);
                            eoiNos = ((_d = params.eoiNos) !== null && _d !== void 0 ? _d : [])
                                .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
                                .filter(Boolean);
                            copy = admin_notification_messages_1.AdminNotificationMessages.urnSubmittedForReview(manufacturerName, params.urnNo, productNames);
                            productRowsHtml = productNames.length === 0
                                ? '<p><em>No product names were listed on this URN.</em></p>'
                                : "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-collapse:collapse; margin:12px 0;\">\n            <thead>\n              <tr>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">#</th>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">Product name</th>\n                <th align=\"left\" style=\"padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;\">EOI</th>\n              </tr>\n            </thead>\n            <tbody>\n              ".concat(productNames
                                    .map(function (name, index) {
                                    var eoi = eoiNos[index] || '—';
                                    return "<tr>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">".concat(index + 1, "</td>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">").concat(_this.escapeHtml(name), "</td>\n                    <td style=\"padding:8px 10px; border:1px solid #e5e7eb;\">").concat(_this.escapeHtml(eoi), "</td>\n                  </tr>");
                                })
                                    .join(''), "\n            </tbody>\n          </table>");
                            // Admin-only: vendor already knows they submitted; alert ops with URN details.
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'urn_submitted_for_review',
                                    referenceId: params.urnNo,
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 Vendor sent URN ".concat(params.urnNo, " for review"),
                                    emailHtmlExtra: "\n        <p><strong>Vendor sent this URN for review.</strong></p>\n        <p>Please open the admin portal and review the submitted URN details.</p>\n        <p><strong>Vendor / Manufacturer:</strong> ".concat(this.escapeHtml(manufacturerName), "</p>\n        <p><strong>URN:</strong> ").concat(this.escapeHtml(params.urnNo), "</p>\n        <p><strong>Product count:</strong> ").concat(productNames.length || 0, "</p>\n        <p><strong>Products under this URN:</strong></p>\n        ").concat(productRowsHtml, "\n      "),
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            // Admin-only: vendor already knows they submitted; alert ops with URN details.
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyCertificationPaymentSubmitted = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && !(recipient === null || recipient === void 0 ? void 0 : recipient.userId)) {
                                return [2 /*return*/];
                            }
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.notificationHelper.sendInBackground({
                                type: this.vendorNotifyChannels(recipient.userId),
                                template: notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED,
                                userId: recipient.userId,
                                email: recipient.email,
                                payload: {
                                    urnNo: params.urnNo,
                                    paymentId: String(params.paymentId),
                                    quoteTotal: String((_a = params.quoteTotal) !== null && _a !== void 0 ? _a : ''),
                                    manufacturerName: manufacturerName,
                                    vendorName: manufacturerName,
                                },
                                async: true,
                            });
                            copy = admin_notification_messages_1.AdminNotificationMessages.certificationFeeSubmitted(manufacturerName);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'certification_payment_submitted',
                                    referenceId: String(params.paymentId),
                                    type: 'info',
                                    emailHtmlExtra: "<p>".concat(this.escapeHtml(copy.message), "</p><p>URN: <strong>").concat(this.escapeHtml(params.urnNo), "</strong></p>"),
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyCertificationPaymentApproved = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && !(recipient === null || recipient === void 0 ? void 0 : recipient.userId)) {
                                return [2 /*return*/];
                            }
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED, {
                                urnNo: params.urnNo,
                                paymentId: String(params.paymentId),
                            });
                            copy = admin_notification_messages_1.AdminNotificationMessages.certificationFeeApproved(manufacturerName, params.urnNo);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'certification_payment_approved',
                                    referenceId: String(params.paymentId),
                                    type: 'success',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyManufacturerApproved = function (manufacturerId, context) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, name;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && !(recipient === null || recipient === void 0 ? void 0 : recipient.userId) && (context === null || context === void 0 ? void 0 : context.vendorEmail)) {
                                recipient = {
                                    email: context.vendorEmail.trim().toLowerCase(),
                                    companyName: context.manufacturerName,
                                    vendorName: context.manufacturerName,
                                };
                            }
                            name = this.manufacturerLabelFromRecipient(recipient) ||
                                (context === null || context === void 0 ? void 0 : context.manufacturerName) ||
                                'Manufacturer';
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.MANUFACTURER_APPROVED, {});
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.manufacturerApproved(name),
                                    referenceType: 'manufacturer_approved',
                                    referenceId: manufacturerId,
                                    type: 'success',
                                    emailSubject: "GreenPro \u2014 Manufacturer verified \u2014 ".concat(name),
                                    emailHtmlExtra: "<p><strong>".concat(name, "</strong> has been verified and activated on the GreenPro portal.</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyManufacturerInactive = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, name;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            name = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.MANUFACTURER_INACTIVE, {});
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.manufacturerInactive(name),
                                    referenceType: 'manufacturer_inactive',
                                    referenceId: manufacturerId,
                                    type: 'warning',
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyManufacturerRejected = function (manufacturerName, manufacturerId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var label, vendorEmail;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            label = (manufacturerName === null || manufacturerName === void 0 ? void 0 : manufacturerName.trim()) || 'Manufacturer';
                            vendorEmail = (_a = options === null || options === void 0 ? void 0 : options.vendorEmail) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
                            if (vendorEmail) {
                                this.sendVendorNotificationInBackground({
                                    email: vendorEmail,
                                    companyName: label,
                                    vendorName: label,
                                }, notification_types_1.NotificationTemplateCode.MANUFACTURER_REJECTED, { manufacturerName: label }, "notifyManufacturerRejected manufacturerId=".concat(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : ''));
                            }
                            else {
                                this.logger.warn("[notifyManufacturerRejected] Skipping vendor email \u2014 no vendorEmail for manufacturerId=".concat(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : ''));
                            }
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.manufacturerRejected(label),
                                    referenceType: 'manufacturer_rejected',
                                    referenceId: manufacturerId,
                                    type: 'warning',
                                    ccGroups: ['SHEshi'],
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyPaymentProposalReady = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, paymentTypeLabel, manufacturerName;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _c.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && params.vendorEmail) {
                                recipient = {
                                    email: params.vendorEmail.trim().toLowerCase(),
                                    companyName: params.manufacturerName,
                                    vendorName: params.manufacturerName,
                                };
                            }
                            paymentTypeLabel = params.paymentType === 'certification'
                                ? 'Certification fee'
                                : params.paymentType === 'renew'
                                    ? 'Renewal fee'
                                    : 'Registration fee';
                            manufacturerName = (_a = params.manufacturerName) !== null && _a !== void 0 ? _a : this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.PAYMENT_PROPOSAL_READY, {
                                urnNo: params.urnNo,
                                paymentId: String(params.paymentId),
                                paymentTypeLabel: paymentTypeLabel,
                                quoteTotal: String((_b = params.quoteTotal) !== null && _b !== void 0 ? _b : ''),
                            }, "notifyPaymentProposalReady manufacturerId=".concat(params.manufacturerId, " urn=").concat(params.urnNo));
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.paymentProposalReady(manufacturerName, params.urnNo, paymentTypeLabel, String(params.paymentId)),
                                    referenceType: "payment_proposal_".concat(params.paymentType),
                                    referenceId: String(params.paymentId),
                                    type: 'info',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductCertified = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.PRODUCT_APPROVED, {
                                urnNo: params.urnNo,
                                productName: params.productName,
                                approvedBy: (_a = params.approvedBy) !== null && _a !== void 0 ? _a : 'GreenPro Admin',
                            });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.productCertified(manufacturerName, params.urnNo, params.productName),
                                    referenceType: 'product_certified',
                                    referenceId: params.urnNo,
                                    type: 'success',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductRejected = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _c.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.PRODUCT_REJECTED, {
                                urnNo: params.urnNo,
                                productName: params.productName,
                                reason: (_a = params.reason) !== null && _a !== void 0 ? _a : 'Not approved',
                                rejectedBy: (_b = params.rejectedBy) !== null && _b !== void 0 ? _b : 'GreenPro Admin',
                            }, "notifyProductRejected manufacturerId=".concat(params.manufacturerId, " urn=").concat(params.urnNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductNameChangeDecision = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, email, userId, decisionLabel, decisionDetail, remarksBlock, copy, remarksLine, eoiLine;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _g.sent();
                            manufacturerName = params.manufacturerName ||
                                this.manufacturerLabelFromRecipient(recipient);
                            email = ((_a = params.email) === null || _a === void 0 ? void 0 : _a.trim()) || (recipient === null || recipient === void 0 ? void 0 : recipient.email);
                            userId = recipient === null || recipient === void 0 ? void 0 : recipient.userId;
                            if (email || userId) {
                                decisionLabel = params.decision === 'approved' ? 'Approved' : 'Rejected';
                                decisionDetail = params.decision === 'approved'
                                    ? "Updated Product Name: ".concat(params.requestedName)
                                    : "Product Name (unchanged): ".concat(params.currentName);
                                remarksBlock = params.decision === 'rejected' && ((_b = params.remarks) === null || _b === void 0 ? void 0 : _b.trim())
                                    ? "Admin Remarks: ".concat(params.remarks.trim())
                                    : '';
                                this.notificationHelper.sendInBackground({
                                    type: this.vendorNotifyChannels(userId),
                                    template: notification_types_1.NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION,
                                    userId: userId,
                                    email: email,
                                    payload: {
                                        manufacturerName: manufacturerName,
                                        urnNo: params.urnNo,
                                        eoiNo: (_c = params.eoiNo) !== null && _c !== void 0 ? _c : '',
                                        currentName: params.currentName,
                                        requestedName: params.requestedName,
                                        decisionLabel: decisionLabel,
                                        decisionDetail: decisionDetail,
                                        remarksBlock: remarksBlock,
                                    },
                                    async: true,
                                });
                            }
                            copy = admin_notification_messages_1.AdminNotificationMessages.productNameChangeDecision(manufacturerName, params.urnNo, params.currentName, params.requestedName, params.decision);
                            remarksLine = ((_d = params.remarks) === null || _d === void 0 ? void 0 : _d.trim())
                                ? "<p><strong>Remarks:</strong> ".concat(this.escapeHtml(params.remarks.trim()), "</p>")
                                : '';
                            eoiLine = ((_e = params.eoiNo) === null || _e === void 0 ? void 0 : _e.trim())
                                ? "<p><strong>EOI:</strong> ".concat(this.escapeHtml(params.eoiNo.trim()), "</p>")
                                : '';
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'product_name_change_decision',
                                    referenceId: (_f = params.requestId) !== null && _f !== void 0 ? _f : params.urnNo,
                                    type: params.decision === 'approved' ? 'success' : 'warning',
                                    emailSubject: "GreenPro \u2014 ".concat(copy.title),
                                    emailHtmlExtra: "\n        <p>".concat(this.escapeHtml(copy.message), "</p>\n        ").concat(eoiLine, "\n        <p><strong>Decision:</strong> ").concat(params.decision, "</p>\n        ").concat(remarksLine, "\n      "),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductNameChangeRequested = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy, eoiLine, reasonLine;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _c.sent();
                            manufacturerName = params.manufacturerName ||
                                this.manufacturerLabelFromRecipient(recipient);
                            copy = admin_notification_messages_1.AdminNotificationMessages.productNameChangeRequested(manufacturerName, params.urnNo, params.currentName, params.requestedName, params.reason);
                            eoiLine = ((_a = params.eoiNo) === null || _a === void 0 ? void 0 : _a.trim())
                                ? "<p><strong>EOI:</strong> ".concat(this.escapeHtml(params.eoiNo.trim()), "</p>")
                                : '';
                            reasonLine = ((_b = params.reason) === null || _b === void 0 ? void 0 : _b.trim())
                                ? "<p><strong>Reason:</strong> ".concat(this.escapeHtml(params.reason.trim()), "</p>")
                                : '';
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'product_name_change_request',
                                    referenceId: params.requestId,
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 Product Name Change Request from ".concat(manufacturerName),
                                    emailHtmlExtra: "\n        <p>".concat(this.escapeHtml(copy.message), "</p>\n        ").concat(eoiLine, "\n        <p><strong>Current name:</strong> ").concat(this.escapeHtml(params.currentName), "</p>\n        <p><strong>Requested name:</strong> ").concat(this.escapeHtml(params.requestedName), "</p>\n        ").concat(reasonLine, "\n        <p>Please review this request in the admin portal.</p>\n      "),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyProductEnquiry = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, email, copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            manufacturerName = params.manufacturerName ||
                                this.manufacturerLabelFromRecipient(recipient);
                            email = params.vendorEmail || (recipient === null || recipient === void 0 ? void 0 : recipient.email);
                            if (email) {
                                this.notificationHelper.sendInBackground({
                                    type: this.vendorNotifyChannels(recipient === null || recipient === void 0 ? void 0 : recipient.userId),
                                    template: notification_types_1.NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
                                    userId: recipient === null || recipient === void 0 ? void 0 : recipient.userId,
                                    email: email,
                                    payload: {
                                        manufacturerName: manufacturerName,
                                        visitorName: params.visitorName,
                                        visitorEmail: params.visitorEmail,
                                        visitorPhone: params.visitorPhone,
                                        visitorMessage: (_a = params.visitorMessage) !== null && _a !== void 0 ? _a : '',
                                    },
                                    async: true,
                                });
                            }
                            copy = admin_notification_messages_1.AdminNotificationMessages.productEnquiry(manufacturerName, params.visitorName);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'manufacturer_inquiry',
                                    referenceId: params.manufacturerId,
                                    source: 'website',
                                    type: 'info',
                                    emailHtmlExtra: "<p>".concat(copy.message, "</p><p>From: ").concat(params.visitorName, " (").concat(params.visitorEmail, ")</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyCertificationExpiryAdmin = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var stageLabel, copy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stageLabel = params.stage === '60-day'
                                ? '60-day expiry'
                                : params.stage === 'weekly'
                                    ? 'Weekly expiry'
                                    : 'Deactivation';
                            copy = admin_notification_messages_1.AdminNotificationMessages.certificationExpiryReminder(params.manufacturerName, params.urnNo, params.eoiNo, stageLabel);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: "certification_expiry_".concat(params.stage),
                                    referenceId: params.productId
                                        ? String(params.productId)
                                        : params.urnNo,
                                    type: params.stage === 'deactivation' ? 'warning' : 'info',
                                    ccGroups: ['SHEshi'],
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyPasswordResetAdmin = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var copy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            copy = admin_notification_messages_1.AdminNotificationMessages.passwordReset(params.email, params.portal);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'password_reset',
                                    referenceId: params.userId,
                                    source: params.portal === 'admin' ? 'admin' : 'manufacturer',
                                    type: 'info',
                                    emailSubject: "GreenPro \u2014 ".concat(copy.title),
                                    emailHtmlExtra: "<p>".concat(this.escapeHtml(copy.message), "</p>"),
                                    ccGroups: ['SHEshi'],
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyUrnMerged = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.URN_MERGED, {
                                sourceUrnNo: params.sourceUrnNo,
                                targetUrnNo: params.targetUrnNo,
                                movedCount: String(params.movedCount),
                            });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.urnMerged(manufacturerName, params.sourceUrnNo, params.targetUrnNo, params.movedCount),
                                    referenceType: 'urn_merge',
                                    referenceId: params.targetUrnNo,
                                    type: 'info',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyPlantMerged = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, eoiNo, manufacturerName;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _f.sent();
                            if (!(recipient === null || recipient === void 0 ? void 0 : recipient.email) && ((_a = params.vendorEmail) === null || _a === void 0 ? void 0 : _a.trim())) {
                                recipient = {
                                    email: params.vendorEmail.trim().toLowerCase(),
                                    companyName: params.manufacturerName,
                                    vendorName: params.manufacturerName,
                                };
                            }
                            eoiNo = (_c = (_b = params.eoiNo) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.PLANT_MERGED, {
                                urnNo: params.urnNo,
                                eoiNo: eoiNo,
                                eoiSuffix: eoiNo ? " (EOI ".concat(eoiNo, ")") : '',
                                productName: (_d = params.productName) !== null && _d !== void 0 ? _d : params.urnNo,
                                mergeSummary: params.mergeSummary,
                            }, "notifyPlantMerged manufacturerId=".concat(params.manufacturerId, " urn=").concat(params.urnNo));
                            manufacturerName = (_e = params.manufacturerName) !== null && _e !== void 0 ? _e : this.manufacturerLabelFromRecipient(recipient);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.plantMerged(manufacturerName, params.urnNo, params.mergeSummary),
                                    referenceType: 'plant_merge',
                                    referenceId: params.urnNo,
                                    type: 'info',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _f.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyRenewalSubmitted = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.RENEWAL_SUBMITTED, { urnNo: params.urnNo });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.renewalSubmitted(manufacturerName, params.urnNo),
                                    referenceType: 'renewal_submitted',
                                    referenceId: params.urnNo,
                                    type: 'info',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyRenewalDecision = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, decisionMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            decisionMessage = params.decision === 'approved'
                                ? 'Your renewal has been approved for final review.'
                                : 'Your renewal forms were sent back for corrections. Please update and resubmit.';
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.RENEWAL_DECISION, { urnNo: params.urnNo, decisionMessage: decisionMessage });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.renewalDecision(manufacturerName, params.urnNo, params.decision),
                                    referenceType: 'renewal_decision',
                                    referenceId: params.urnNo,
                                    type: params.decision === 'approved' ? 'success' : 'warning',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyRenewalCompleted = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.RENEWAL_COMPLETED, { urnNo: params.urnNo });
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: admin_notification_messages_1.AdminNotificationMessages.renewalCompleted(manufacturerName, params.urnNo),
                                    referenceType: 'renewal_completed',
                                    referenceId: params.urnNo,
                                    type: 'success',
                                    ccGroups: ['TEAM_LEADS'],
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * In-app only for certification expiry emails that use custom HTML via cron.
         * Cron still owns the email body; this creates the matching vendor bell row.
         */
        LifecycleNotificationService_1.prototype.notifyVendorCertificationExpiryInApp = function (params) {
            var _this = this;
            void this.recipientService
                .resolveByManufacturerId(params.manufacturerId)
                .then(function (recipient) {
                var _a, _b;
                var userId = (_a = recipient === null || recipient === void 0 ? void 0 : recipient.userId) === null || _a === void 0 ? void 0 : _a.trim();
                if (!userId) {
                    _this.logger.warn("[notifyVendorCertificationExpiryInApp] Skipping \u2014 no userId for manufacturer=".concat(params.manufacturerId));
                    return;
                }
                var manufacturerName = params.manufacturerName ||
                    _this.manufacturerLabelFromRecipient(recipient);
                _this.notificationHelper.sendInBackground({
                    type: [notification_types_1.NotificationChannel.IN_APP],
                    template: notification_types_1.NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER,
                    userId: userId,
                    email: (_b = recipient === null || recipient === void 0 ? void 0 : recipient.email) !== null && _b !== void 0 ? _b : params.vendorEmail,
                    payload: {
                        manufacturerName: manufacturerName,
                        productName: params.productName,
                        eoiNo: params.eoiNo,
                        reminderStage: params.reminderStage,
                    },
                    async: true,
                });
            })
                .catch(function (err) {
                return _this.logger.warn("[notifyVendorCertificationExpiryInApp] failed: ".concat(err.message));
            });
        };
        LifecycleNotificationService_1.prototype.notifyGrievanceCreated = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            copy = admin_notification_messages_1.AdminNotificationMessages.grievanceCreated(manufacturerName, params.grievanceNo, params.subject, params.category);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'grievance',
                                    referenceId: params.grievanceId,
                                    type: 'info',
                                    source: 'manufacturer',
                                    emailSubject: "GreenPro \u2014 Grievance ".concat(params.grievanceNo, " from ").concat(manufacturerName),
                                    emailHtmlExtra: "\n        <p>".concat(this.escapeHtml(copy.message), "</p>\n        <p><strong>Grievance No:</strong> ").concat(this.escapeHtml(params.grievanceNo), "</p>\n        <p><strong>Subject:</strong> ").concat(this.escapeHtml(params.subject), "</p>\n        ").concat(((_a = params.category) === null || _a === void 0 ? void 0 : _a.trim())
                                        ? "<p><strong>Category:</strong> ".concat(this.escapeHtml(params.category.trim()), "</p>")
                                        : '', "\n        <p>Please review this grievance in the admin portal.</p>\n      "),
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Vendor notification when admin saves a response. */
        LifecycleNotificationService_1.prototype.notifyGrievanceResponded = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.GRIEVANCE_RESPONDED, {
                                grievanceNo: params.grievanceNo,
                                subject: params.subject,
                                category: ((_a = params.category) === null || _a === void 0 ? void 0 : _a.trim()) || '—',
                            }, "grievance=".concat(params.grievanceNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Vendor notification when a grievance is closed. */
        LifecycleNotificationService_1.prototype.notifyGrievanceClosed = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.GRIEVANCE_CLOSED, {
                                grievanceNo: params.grievanceNo,
                                subject: params.subject,
                                category: ((_a = params.category) === null || _a === void 0 ? void 0 : _a.trim()) || '—',
                            }, "grievance=".concat(params.grievanceNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Admin feed when a vendor submits an account deletion request. */
        LifecycleNotificationService_1.prototype.notifyAccountDeletionRequested = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient, manufacturerName, copy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            manufacturerName = this.manufacturerLabelFromRecipient(recipient);
                            copy = admin_notification_messages_1.AdminNotificationMessages.accountDeletionRequested(manufacturerName, params.requestNo, params.reason);
                            return [4 /*yield*/, this.notifyAdminFeedAndEmail({
                                    copy: copy,
                                    referenceType: 'account_deletion',
                                    referenceId: params.requestId,
                                    type: 'info',
                                    source: 'manufacturer',
                                    emailSubject: "GreenPro \u2014 Account deletion ".concat(params.requestNo, " from ").concat(manufacturerName),
                                    emailHtmlExtra: "\n        <p>".concat(this.escapeHtml(copy.message), "</p>\n        <p><strong>Request No:</strong> ").concat(this.escapeHtml(params.requestNo), "</p>\n        <p><strong>Reason:</strong> ").concat(this.escapeHtml(params.reason), "</p>\n        <p>Please review this request in the admin portal. Do not permanently delete accounts from this workflow alone.</p>\n      "),
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyAccountDeletionApproved = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_APPROVED, {
                                requestNo: params.requestNo,
                                reason: params.reason,
                            }, "accountDeletion=".concat(params.requestNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyAccountDeletionRejected = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _b.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_REJECTED, {
                                requestNo: params.requestNo,
                                reason: params.reason,
                                adminRemarks: ((_a = params.adminRemarks) === null || _a === void 0 ? void 0 : _a.trim()) || '—',
                            }, "accountDeletion=".concat(params.requestNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        LifecycleNotificationService_1.prototype.notifyAccountDeletionCompleted = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var recipient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.recipientService.resolveByManufacturerId(params.manufacturerId)];
                        case 1:
                            recipient = _a.sent();
                            this.sendVendorNotificationInBackground(recipient, notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED, {
                                requestNo: params.requestNo,
                                reason: params.reason,
                            }, "accountDeletion=".concat(params.requestNo));
                            return [2 /*return*/];
                    }
                });
            });
        };
        return LifecycleNotificationService_1;
    }());
    __setFunctionName(_classThis, "LifecycleNotificationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LifecycleNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LifecycleNotificationService = _classThis;
}();
exports.LifecycleNotificationService = LifecycleNotificationService;
