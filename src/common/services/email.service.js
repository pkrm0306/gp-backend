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
exports.EmailService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var fs_1 = require("fs");
var path_1 = require("path");
var notification_recipient_groups_util_1 = require("../../notifications/utils/notification-recipient-groups.util");
var EmailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EmailService = _classThis = /** @class */ (function () {
        function EmailService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(EmailService.name);
            /** One or more SMTP endpoints (Gmail + Mailtrap can run together). */
            this.transporters = [];
            this.registeredKeys = new Set();
            // Primary SMTP (Gmail when SMTP_SERVER_* points at smtp.gmail.com / service=gmail).
            // Also still accepts Mailtrap here for backward compatibility.
            var primaryService = this.configService.get('SMTP_SERVER_SERVICE') ||
                this.configService.get('MAIL_SERVICE') ||
                '';
            var primaryHost = this.configService.get('SMTP_SERVER_HOST') ||
                this.configService.get('MAIL_HOST') ||
                'sandbox.smtp.mailtrap.io';
            var primaryPort = parseInt(this.configService.get('SMTP_SERVER_PORT') ||
                this.configService.get('MAIL_PORT') ||
                '2525', 10);
            var primarySecure = this.parseBool(this.configService.get('SMTP_SERVER_SECURE') ||
                this.configService.get('MAIL_SECURE'), false);
            var primaryUser = this.configService.get('SMTP_SERVER_USER') ||
                this.configService.get('MAIL_USERNAME') ||
                '';
            var primaryPass = this.configService.get('SMTP_SERVER_PASS') ||
                this.configService.get('MAIL_PASSWORD') ||
                '';
            var primaryFrom = this.configService.get('SMTP_SERVER_FROM') ||
                this.configService.get('MAIL_FROM_ADDRESS') ||
                'noreply@greenpro.com';
            var primaryLabel = this.isMailtrapHost(primaryHost)
                ? 'mailtrap'
                : primaryService.toLowerCase() === 'gmail' ||
                    /smtp\.gmail\.com/i.test(primaryHost)
                    ? 'gmail'
                    : 'smtp';
            this.registerTransport({
                label: primaryLabel,
                service: primaryService || undefined,
                host: primaryHost,
                port: primaryPort,
                secure: primarySecure,
                user: primaryUser,
                pass: primaryPass,
                from: primaryFrom,
            });
            // Optional second endpoint: keep Mailtrap capturing emails while Gmail delivers for real.
            var mailtrapHost = this.configService.get('MAILTRAP_HOST') ||
                this.configService.get('MAILTRAP_SERVER_HOST') ||
                '';
            var mailtrapUser = this.configService.get('MAILTRAP_USER') ||
                this.configService.get('MAILTRAP_USERNAME') ||
                this.configService.get('MAILTRAP_SERVER_USER') ||
                '';
            var mailtrapPass = this.configService.get('MAILTRAP_PASS') ||
                this.configService.get('MAILTRAP_PASSWORD') ||
                this.configService.get('MAILTRAP_SERVER_PASS') ||
                '';
            if (mailtrapHost && mailtrapUser && mailtrapPass) {
                var mailtrapPort = parseInt(this.configService.get('MAILTRAP_PORT') ||
                    this.configService.get('MAILTRAP_SERVER_PORT') ||
                    '2525', 10);
                var mailtrapSecure = this.parseBool(this.configService.get('MAILTRAP_SECURE') ||
                    this.configService.get('MAILTRAP_SERVER_SECURE'), false);
                var mailtrapFrom = this.configService.get('MAILTRAP_FROM') ||
                    this.configService.get('MAILTRAP_SERVER_FROM') ||
                    primaryFrom;
                // Avoid registering the same Mailtrap endpoint twice when SMTP_* is already Mailtrap.
                if (!(primaryLabel === 'mailtrap' &&
                    primaryHost === mailtrapHost &&
                    primaryUser === mailtrapUser)) {
                    this.registerTransport({
                        label: 'mailtrap',
                        host: mailtrapHost,
                        port: mailtrapPort,
                        secure: mailtrapSecure,
                        user: mailtrapUser,
                        pass: mailtrapPass,
                        from: mailtrapFrom,
                    });
                }
            }
            if (this.transporters.length === 0) {
                this.logger.warn('No SMTP transports configured; emails will fail until SMTP/Mailtrap env vars are set.');
            }
            else {
                this.logger.log("Email delivery endpoints: ".concat(this.transporters.map(function (t) { return t.label; }).join(' + ')));
            }
        }
        EmailService_1.prototype.hasHtmlTags = function (content) {
            return /<[a-z][\s\S]*>/i.test(content);
        };
        EmailService_1.prototype.stripHtml = function (content) {
            return String(content !== null && content !== void 0 ? content : '')
                .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                .replace(/<script[\s\S]*?<\/script>/gi, ' ')
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };
        EmailService_1.prototype.extractBodyContent = function (html) {
            var _a;
            var raw = String(html !== null && html !== void 0 ? html : '').trim();
            if (!raw)
                return '';
            var bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            return ((_a = bodyMatch === null || bodyMatch === void 0 ? void 0 : bodyMatch[1]) === null || _a === void 0 ? void 0 : _a.trim()) || raw;
        };
        EmailService_1.prototype.normalizeContentForTemplate = function (content) {
            var raw = String(content !== null && content !== void 0 ? content : '').trim();
            if (!raw) {
                return '<p>No additional details provided.</p>';
            }
            if (this.hasHtmlTags(raw)) {
                return this.extractBodyContent(raw);
            }
            var escaped = this.escapeHtml(raw).replace(/\r?\n/g, '<br/>');
            return "<p>".concat(escaped, "</p>");
        };
        EmailService_1.prototype.wrapWithGreenProTemplate = function (subject, content) {
            var title = this.escapeHtml(subject || 'GreenPro Notification');
            var normalizedContent = this.normalizeContentForTemplate(content);
            return "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>".concat(title, "</title>\n      </head>\n      <body style=\"margin:0; padding:20px; background:#f3f4f6; font-family: Arial, sans-serif; color:#1f2937;\">\n        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"max-width:700px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;\">\n          <tr>\n            <td style=\"background:#16a34a; color:#ffffff; text-align:center; padding:22px 16px;\">\n              <h1 style=\"margin:0; font-size:28px; line-height:1.3; font-weight:700;\">GreenPro</h1>\n              <p style=\"margin:8px 0 0; font-size:16px; font-weight:500; opacity:0.95;\">").concat(title, "</p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding:28px 32px; font-size:16px; line-height:1.7; color:#111827;\">\n              ").concat(normalizedContent, "\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding:0 32px 24px; font-size:12px; color:#6b7280;\">\n              This is an automated email from GreenPro.\n            </td>\n          </tr>\n        </table>\n      </body>\n      </html>\n    ");
        };
        EmailService_1.prototype.looksLikeFullHtmlDocument = function (html) {
            var raw = String(html !== null && html !== void 0 ? html : '').trim();
            return (/^<!doctype\s+html/i.test(raw) ||
                /^<html[\s>]/i.test(raw) ||
                /<html[\s>]/i.test(raw));
        };
        EmailService_1.prototype.escapeHtml = function (input) {
            return String(input !== null && input !== void 0 ? input : '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        EmailService_1.prototype.parseBool = function (raw, fallback) {
            if (fallback === void 0) { fallback = false; }
            if (raw == null || raw === '')
                return fallback;
            return String(raw).toLowerCase() === 'true';
        };
        EmailService_1.prototype.isMailtrapHost = function (host) {
            return /mailtrap\.io/i.test(host || '');
        };
        EmailService_1.prototype.createTransport = function (config) {
            var transportOptions = __assign(__assign(__assign(__assign({}, (config.service
                ? { service: config.service }
                : { host: config.host, port: config.port })), { secure: config.secure }), (config.user && config.pass
                ? { auth: { user: config.user, pass: config.pass } }
                : {})), { tls: {
                    rejectUnauthorized: false,
                } });
            return nodemailer.createTransport(transportOptions);
        };
        EmailService_1.prototype.registerTransport = function (config) {
            if (!config)
                return;
            var key = "".concat(config.label, "|").concat(config.service || '', "|").concat(config.host, "|").concat(config.port, "|").concat(config.user);
            if (this.registeredKeys.has(key))
                return;
            this.registeredKeys.add(key);
            this.transporters.push({
                label: config.label,
                from: config.from,
                transporter: this.createTransport(config),
            });
            this.logger.log("Email transport registered: ".concat(config.label, " \u2192 ").concat(config.service || config.host, ":").concat(config.port));
        };
        EmailService_1.prototype.sendEmail = function (to, subject, htmlBody, textBody, options) {
            return __awaiter(this, void 0, void 0, function () {
                var disabledRaw, disabled, defaultFrom, useRawHtml, html, text, cc, ccList, outcome, detail, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            disabledRaw = this.configService.get('EMAIL_DISABLED') || 'false';
                            disabled = String(disabledRaw).toLowerCase() === 'true';
                            defaultFrom = this.configService.get('SMTP_SERVER_FROM') ||
                                this.configService.get('MAIL_FROM_ADDRESS') ||
                                'noreply@greenpro.com';
                            useRawHtml = (options === null || options === void 0 ? void 0 : options.rawHtml) === true || this.looksLikeFullHtmlDocument(htmlBody);
                            html = useRawHtml
                                ? htmlBody
                                : this.wrapWithGreenProTemplate(subject, htmlBody);
                            text = textBody || this.stripHtml(htmlBody);
                            cc = (options === null || options === void 0 ? void 0 : options.skipAdminCc)
                                ? (0, notification_recipient_groups_util_1.parseEmailList)(Array.isArray(options === null || options === void 0 ? void 0 : options.cc)
                                    ? options.cc.join(',')
                                    : ((_a = options === null || options === void 0 ? void 0 : options.cc) !== null && _a !== void 0 ? _a : ''))
                                : (0, notification_recipient_groups_util_1.mergeOutgoingCc)(this.configService, to, options === null || options === void 0 ? void 0 : options.cc);
                            ccList = (cc === null || cc === void 0 ? void 0 : cc.length) ? cc : undefined;
                            this.saveLocalMailPreview({
                                to: to,
                                subject: subject,
                                html: html,
                                text: text,
                                cc: ccList,
                            });
                            if (disabled) {
                                this.logger.warn("EMAIL_DISABLED=true, skipping SMTP send to ".concat(to, " (local preview still saved if enabled)"));
                                return [2 /*return*/];
                            }
                            if (this.transporters.length === 0) {
                                throw new Error('No SMTP transports configured');
                            }
                            return [4 /*yield*/, this.dispatchToTransports({
                                    to: to,
                                    subject: subject,
                                    html: html,
                                    text: text,
                                    fromDefault: defaultFrom,
                                    cc: ccList,
                                    primaryOnly: (options === null || options === void 0 ? void 0 : options.primaryOnly) === true,
                                })];
                        case 1:
                            outcome = _b.sent();
                            if (!(!outcome.delivered && (ccList === null || ccList === void 0 ? void 0 : ccList.length))) return [3 /*break*/, 3];
                            this.logger.warn("Email to ".concat(to, " failed on primary SMTP with CC; retrying without CC"));
                            return [4 /*yield*/, this.dispatchToTransports({
                                    to: to,
                                    subject: subject,
                                    html: html,
                                    text: text,
                                    fromDefault: defaultFrom,
                                    primaryOnly: (options === null || options === void 0 ? void 0 : options.primaryOnly) === true,
                                })];
                        case 2:
                            outcome = _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!outcome.delivered) {
                                detail = outcome.primaryError
                                    ? ": ".concat(outcome.primaryError)
                                    : '';
                                throw new Error("Failed to send email to ".concat(to).concat(detail));
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            this.logger.error("Failed to send email to ".concat(to, ":"), error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /** True when at least one transport can deliver to a real inbox (not Mailtrap capture). */
        EmailService_1.prototype.hasPrimaryDeliveryTransport = function () {
            return this.transporters.some(function (t) { return t.label !== 'mailtrap'; });
        };
        EmailService_1.prototype.dispatchToTransports = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var transports, active, fromName, ccLabel, bccList, bccLabel, results, primaryOk, mailtrapOk, primaryError, delivered;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            transports = params.primaryOnly === true
                                ? this.transporters.filter(function (t) { return t.label !== 'mailtrap'; })
                                : this.transporters;
                            active = transports.length > 0 ? transports : this.transporters;
                            if (active.length === 0) {
                                return [2 /*return*/, {
                                        delivered: false,
                                        primaryError: 'No SMTP transports configured',
                                    }];
                            }
                            fromName = ((_a = this.configService.get('SMTP_FROM_NAME')) === null || _a === void 0 ? void 0 : _a.trim()) || 'GreenPro';
                            ccLabel = ((_b = params.cc) === null || _b === void 0 ? void 0 : _b.length) ? ", cc: ".concat(params.cc.join(', ')) : '';
                            bccList = Array.isArray(params.bcc)
                                ? params.bcc.map(function (x) { return String(x).trim(); }).filter(Boolean)
                                : (0, notification_recipient_groups_util_1.parseEmailList)(params.bcc);
                            bccLabel = bccList.length ? ", bcc: ".concat(bccList.join(', ')) : '';
                            return [4 /*yield*/, Promise.allSettled(active.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var fromAddress, mailOptions, info;
                                    var _c;
                                    var label = _b.label, from = _b.from, transporter = _b.transporter;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                fromAddress = from || params.fromDefault;
                                                mailOptions = __assign(__assign(__assign({ from: "\"".concat(fromName.replace(/"/g, ''), "\" <").concat(fromAddress, ">"), to: params.to, replyTo: fromAddress, subject: params.subject, html: params.html, text: params.text }, (((_c = params.cc) === null || _c === void 0 ? void 0 : _c.length) ? { cc: params.cc } : {})), (bccList.length ? { bcc: bccList } : {})), { headers: {
                                                        'X-GreenPro-Mail': '1',
                                                        'X-Entity-Ref-ID': "".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 10)),
                                                    } });
                                                return [4 /*yield*/, transporter.sendMail(mailOptions)];
                                            case 1:
                                                info = _d.sent();
                                                this.logger.log("Email sent via ".concat(label, " to ").concat(params.to).concat(ccLabel).concat(bccLabel, ". Message ID: ").concat(info.messageId) +
                                                    " accepted=".concat(JSON.stringify(info.accepted), " rejected=").concat(JSON.stringify(info.rejected), " response=").concat(info.response || ''));
                                                if (Array.isArray(info.rejected) && info.rejected.length > 0) {
                                                    throw new Error("SMTP rejected recipients via ".concat(label, ": ").concat(info.rejected.join(', ')));
                                                }
                                                return [2 /*return*/, { label: label, info: info }];
                                        }
                                    });
                                }); }))];
                        case 1:
                            results = _c.sent();
                            primaryOk = false;
                            mailtrapOk = false;
                            results.forEach(function (result, index) {
                                var _a, _b;
                                var label = ((_a = active[index]) === null || _a === void 0 ? void 0 : _a.label) || 'smtp';
                                if (result.status === 'fulfilled') {
                                    if (label === 'mailtrap') {
                                        mailtrapOk = true;
                                    }
                                    else {
                                        primaryOk = true;
                                    }
                                    return;
                                }
                                var message = ((_b = result.reason) === null || _b === void 0 ? void 0 : _b.message) || String(result.reason);
                                _this.logger.warn("Partial email failure via ".concat(label, " for ").concat(params.to, ": ").concat(message));
                                if (label !== 'mailtrap') {
                                    primaryError = message;
                                }
                            });
                            delivered = this.hasPrimaryDeliveryTransport()
                                ? primaryOk
                                : primaryOk || mailtrapOk;
                            if (!delivered && mailtrapOk && this.hasPrimaryDeliveryTransport()) {
                                this.logger.warn("Email to ".concat(params.to, " reached Mailtrap only; primary SMTP did not deliver"));
                            }
                            return [2 /*return*/, { delivered: delivered, primaryError: primaryError }];
                    }
                });
            });
        };
        /**
         * Fire-and-forget wrapper used by non-critical email flows.
         * Prevents request failures when SMTP has transient issues.
         */
        EmailService_1.prototype.sendInBackground = function (task) {
            var _this = this;
            task().catch(function (error) {
                _this.logger.warn("Background email task failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
            });
        };
        EmailService_1.prototype.sendRegistrationEmail = function (email, password, otp, options) {
            return __awaiter(this, void 0, void 0, function () {
                var subject, safeEmail, safePassword, safeOtp, htmlBody, textBody;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            subject = 'Welcome to GreenPro - Registration Successful';
                            safeEmail = this.escapeHtml(email);
                            safePassword = this.escapeHtml(password);
                            safeOtp = this.escapeHtml(otp);
                            htmlBody = "\n      <p>Dear Vendor,</p>\n      <p>Your account has been created successfully. Below are your login credentials:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Email:</strong> ".concat(safeEmail, "</p>\n        <p style=\"margin:5px 0;\"><strong>Password:</strong> ").concat(safePassword, "</p>\n      </div>\n      <p><strong>Please verify your email using the OTP below:</strong></p>\n      <div style=\"background:#fff3cd; border:1px solid #ffc107; padding:14px; text-align:center; margin:16px 0; border-radius:8px;\">\n        <p style=\"margin:0; color:#856404; font-size:28px; letter-spacing:4px; font-weight:700;\">").concat(safeOtp, "</p>\n      </div>\n      <p>Thank you for joining GreenPro!</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody = "\nWelcome to GreenPro!\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ".concat(email, "\nPassword: ").concat(password, "\n\nPlease verify your email using the OTP below:\nOTP: ").concat(otp, "\n\nThank you for joining GreenPro!\n    ");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody, __assign(__assign({}, options), { primaryOnly: true, skipAdminCc: true }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendNewsletterSubscribeEmail = function (email_1) {
            return __awaiter(this, arguments, void 0, function (email, subscribedFor) {
                var prefs, subject, htmlBody, textBody;
                if (subscribedFor === void 0) { subscribedFor = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prefs = subscribedFor.length > 0 ? subscribedFor.join(', ') : 'Newsletter';
                            subject = 'You are subscribed to GreenPro updates';
                            htmlBody = "\n      <p>Hi,</p>\n      <p>Thanks for subscribing to GreenPro. You will receive updates for:</p>\n      <p><strong>Subscribed For:</strong> ".concat(this.escapeHtml(prefs), "</p>\n      <p><strong>Email:</strong> ").concat(this.escapeHtml(email), "</p>\n      <p>Best regards,<br/>The GreenPro Team</p>\n    ");
                            textBody = "Thanks for subscribing to GreenPro.\n\nSubscribed For: ".concat(prefs, "\nEmail: ").concat(email, "\n\nBest regards,\nThe GreenPro Team");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendPasswordResetEmail = function (email, newPassword, options) {
            return __awaiter(this, void 0, void 0, function () {
                var subject, safePassword, htmlBody, textBody;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            subject = 'GreenPro - Password Reset';
                            safePassword = this.escapeHtml(newPassword);
                            htmlBody = "\n      <p>Dear User,</p>\n      <p>Your password has been reset successfully. Please find your new password below:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Your new password:</strong></p>\n        <p style=\"margin:10px 0; font-size:18px; font-weight:700; color:#16a34a;\">".concat(safePassword, "</p>\n      </div>\n      <div style=\"background:#fff3cd; border:1px solid #ffc107; padding:14px; margin:16px 0; border-radius:8px;\">\n        <p style=\"margin:0; color:#856404;\"><strong>Important:</strong> Please login and change your password immediately for security reasons.</p>\n      </div>\n      <p>If you did not request this password reset, please contact our support team immediately.</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody = "\nPassword Reset Request\n\nYour password has been reset successfully.\n\nYour new password is: ".concat(newPassword, "\n\nImportant: Please login and change your password immediately for security reasons.\n\nIf you did not request this password reset, please contact our support team immediately.\n\nBest regards,\nThe GreenPro Team\n    ");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody, options)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendStaffCredentialsEmail = function (email, password, staffName) {
            return __awaiter(this, void 0, void 0, function () {
                var safeName, safeEmail, safePassword, subject, htmlBody, textBody;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            safeName = this.escapeHtml((staffName === null || staffName === void 0 ? void 0 : staffName.trim()) || 'Team Member');
                            safeEmail = this.escapeHtml(email);
                            safePassword = this.escapeHtml(password);
                            subject = 'GreenPro Admin - Team Member Credentials';
                            htmlBody = "\n      <p>Hello ".concat(safeName, ",</p>\n      <p>Your team member account has been created. Use the credentials below to sign in:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Email:</strong> ").concat(safeEmail, "</p>\n        <p style=\"margin:5px 0;\"><strong>Password:</strong> ").concat(safePassword, "</p>\n      </div>\n      <p>For security, please sign in and change your password immediately.</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody = "\nGreenPro Team Access\n\nHello ".concat((staffName === null || staffName === void 0 ? void 0 : staffName.trim()) || 'Team Member', ",\n\nYour team member account has been created. Use the credentials below to sign in:\nEmail: ").concat(email, "\nPassword: ").concat(password, "\n\nFor security, please sign in and change your password immediately.\n\nBest regards,\nThe GreenPro Team\n    ");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Notify the assigned SPOC after a successful allocation assign/reassign.
         * Call only after the DB write succeeds; use once per history event.
         */
        EmailService_1.prototype.sendSpocAllocationEmail = function (email, params) {
            return __awaiter(this, void 0, void 0, function () {
                var isReassign, safeName, safeUrn, safeProduct, safeVendor, actionLabel, subject, htmlBody, textBody;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    isReassign = params.kind === 'reassign';
                    safeName = this.escapeHtml(((_a = params.spocName) === null || _a === void 0 ? void 0 : _a.trim()) || 'Team Member');
                    safeUrn = this.escapeHtml(((_b = params.urn) === null || _b === void 0 ? void 0 : _b.trim()) || '—');
                    safeProduct = this.escapeHtml(((_c = params.productName) === null || _c === void 0 ? void 0 : _c.trim()) || '—');
                    safeVendor = this.escapeHtml(((_d = params.vendorName) === null || _d === void 0 ? void 0 : _d.trim()) || '—');
                    actionLabel = isReassign ? 'reassigned' : 'assigned';
                    subject = isReassign
                        ? 'GreenPro — SPOC Reassignment'
                        : 'GreenPro — SPOC Assignment';
                    htmlBody = "\n      <p>Hello ".concat(safeName, ",</p>\n      <p>You have been <strong>").concat(actionLabel, "</strong> as the SPOC for the following product:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>URN:</strong> ").concat(safeUrn, "</p>\n        <p style=\"margin:5px 0;\"><strong>Product Name:</strong> ").concat(safeProduct, "</p>\n        <p style=\"margin:5px 0;\"><strong>Vendor Name:</strong> ").concat(safeVendor, "</p>\n      </div>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                    textBody = "\nGreenPro SPOC ".concat(isReassign ? 'Reassignment' : 'Assignment', "\n\nHello ").concat(((_e = params.spocName) === null || _e === void 0 ? void 0 : _e.trim()) || 'Team Member', ",\n\nYou have been ").concat(actionLabel, " as the SPOC for the following product:\n\nURN: ").concat(((_f = params.urn) === null || _f === void 0 ? void 0 : _f.trim()) || '—', "\nProduct Name: ").concat(((_g = params.productName) === null || _g === void 0 ? void 0 : _g.trim()) || '—', "\nVendor Name: ").concat((params.vendorName || '').trim() || '—', "\n\nBest regards,\nThe GreenPro Team\n    ");
                    return [2 /*return*/, this.sendEmail(email, subject, htmlBody, textBody)];
                });
            });
        };
        /** Admin manufacturer email change includes a new random password; profile self-edit does not. */
        EmailService_1.prototype.sendVendorLoginEmailUpdatedEmail = function (email, vendorName, password, options) {
            return __awaiter(this, void 0, void 0, function () {
                var safeName, safeEmail, safePassword, subject_1, htmlBody_1, textBody_1, subject, htmlBody, textBody;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            safeName = this.escapeHtml((vendorName === null || vendorName === void 0 ? void 0 : vendorName.trim()) || 'Vendor');
                            safeEmail = this.escapeHtml(email);
                            safePassword = password ? this.escapeHtml(password) : '';
                            if (!password) return [3 /*break*/, 2];
                            subject_1 = 'GreenPro - Your vendor portal login credentials';
                            htmlBody_1 = "\n      <p>Hello ".concat(safeName, ",</p>\n      <p>Your GreenPro vendor portal login has been updated. Use these credentials to sign in:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Email:</strong> ").concat(safeEmail, "</p>\n        <p style=\"margin:5px 0;\"><strong>Password:</strong> ").concat(safePassword, "</p>\n      </div>\n      <p>For security, please sign in and change your password after your first login.</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody_1 = "\nHello ".concat((vendorName === null || vendorName === void 0 ? void 0 : vendorName.trim()) || 'Vendor', ",\n\nYour GreenPro vendor portal login has been updated. Use these credentials to sign in:\n\nEmail: ").concat(email, "\nPassword: ").concat(password, "\n\nFor security, please sign in and change your password after your first login.\n\nBest regards,\nThe GreenPro Team\n      ");
                            return [4 /*yield*/, this.sendEmail(email, subject_1, htmlBody_1, textBody_1, options)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2:
                            subject = 'GreenPro - Your login email was updated';
                            htmlBody = "\n      <p>Hello ".concat(safeName, ",</p>\n      <p>Your GreenPro vendor portal login email has been updated to:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Email:</strong> ").concat(safeEmail, "</p>\n      </div>\n      <p>Your password is unchanged. Sign in with this email and your existing password.</p>\n      <p>If you cannot sign in, use <strong>Forgot password</strong> on the login page.</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody = "\nHello ".concat((vendorName === null || vendorName === void 0 ? void 0 : vendorName.trim()) || 'Vendor', ",\n\nYour GreenPro vendor portal login email has been updated to: ").concat(email, "\n\nYour password is unchanged. Sign in with this email and your existing password.\n\nIf you cannot sign in, use Forgot password on the login page.\n\nBest regards,\nThe GreenPro Team\n    ");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody, options)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Notifies platform admin when a vendor registers a new team member (partner). */
        EmailService_1.prototype.sendVendorTeamMemberRegisteredAdminEmail = function (adminEmail, params) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer, memberName, memberEmail, memberPhone, password, subject, htmlBody, textBody;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            manufacturer = this.escapeHtml(((_a = params.manufacturerName) === null || _a === void 0 ? void 0 : _a.trim()) || 'Vendor');
                            memberName = this.escapeHtml(params.memberName.trim() || 'Team Member');
                            memberEmail = this.escapeHtml(params.memberEmail.trim());
                            memberPhone = this.escapeHtml(((_b = params.memberPhone) === null || _b === void 0 ? void 0 : _b.trim()) || '—');
                            password = this.escapeHtml(params.password);
                            subject = 'GreenPro Admin — New vendor team member registered';
                            htmlBody = "\n      <p>A new team member was added from the <strong>vendor panel</strong>.</p>\n      <p><strong>Manufacturer:</strong> ".concat(manufacturer, "</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Name:</strong> ").concat(memberName, "</p>\n        <p style=\"margin:5px 0;\"><strong>Email (username):</strong> ").concat(memberEmail, "</p>\n        <p style=\"margin:5px 0;\"><strong>Mobile:</strong> ").concat(memberPhone, "</p>\n        <p style=\"margin:5px 0;\"><strong>Password:</strong> ").concat(password, "</p>\n      </div>\n      <p>The team member can sign in to the vendor portal with the email and password above.</p>\n      <p>Best regards,<br>The GreenPro System</p>\n    ");
                            textBody = "\nA new team member was added from the vendor panel.\n\nManufacturer: ".concat(((_c = params.manufacturerName) === null || _c === void 0 ? void 0 : _c.trim()) || 'Vendor', "\n\nName: ").concat(params.memberName.trim(), "\nEmail (username): ").concat(params.memberEmail.trim(), "\nMobile: ").concat(((_d = params.memberPhone) === null || _d === void 0 ? void 0 : _d.trim()) || '—', "\nPassword: ").concat(params.password, "\n\nThe team member can sign in to the vendor portal with the email and password above.\n\nBest regards,\nThe GreenPro System\n    ");
                            return [4 /*yield*/, this.sendEmail(adminEmail, subject, htmlBody, textBody)];
                        case 1:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Sends vendor portal login credentials to a newly added team member (partner). */
        EmailService_1.prototype.sendVendorTeamMemberCredentialsEmail = function (email, params) {
            return __awaiter(this, void 0, void 0, function () {
                var safeName, safeEmail, safePassword, manufacturer, loginUrl, loginLinkHtml, loginLinkText, subject, htmlBody, textBody;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            safeName = this.escapeHtml(params.memberName.trim() || 'Team Member');
                            safeEmail = this.escapeHtml(email.trim());
                            safePassword = this.escapeHtml(params.password);
                            manufacturer = this.escapeHtml(((_a = params.manufacturerName) === null || _a === void 0 ? void 0 : _a.trim()) || 'your organization');
                            loginUrl = (_b = params.loginUrl) === null || _b === void 0 ? void 0 : _b.trim();
                            loginLinkHtml = loginUrl
                                ? "<p><a href=\"".concat(this.escapeHtml(loginUrl), "\" style=\"color: #16a34a;\">Sign in to the vendor portal</a></p>")
                                : '';
                            loginLinkText = loginUrl
                                ? "\nSign in: ".concat(loginUrl, "\n")
                                : '';
                            subject = 'GreenPro - Your vendor portal login credentials';
                            htmlBody = "\n      <p>Hello ".concat(safeName, ",</p>\n      <p>You have been added as a team member for <strong>").concat(manufacturer, "</strong> on GreenPro. Use the credentials below to sign in to the vendor portal:</p>\n      <div style=\"background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;\">\n        <p style=\"margin:5px 0;\"><strong>Email:</strong> ").concat(safeEmail, "</p>\n        <p style=\"margin:5px 0;\"><strong>Password:</strong> ").concat(safePassword, "</p>\n      </div>\n      ").concat(loginLinkHtml, "\n      <p>For security, please change your password after your first login.</p>\n      <p>Best regards,<br>The GreenPro Team</p>\n    ");
                            textBody = "\nHello ".concat(params.memberName.trim() || 'Team Member', ",\n\nYou have been added as a team member for ").concat(((_c = params.manufacturerName) === null || _c === void 0 ? void 0 : _c.trim()) || 'your organization', " on GreenPro. Use the credentials below to sign in to the vendor portal:\n\nEmail: ").concat(email.trim(), "\nPassword: ").concat(params.password, "\n").concat(loginLinkText, "\nFor security, please change your password after your first login.\n\nBest regards,\nThe GreenPro Team\n    ");
                            return [4 /*yield*/, this.sendEmail(email, subject, htmlBody, textBody)];
                        case 1:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Writes HTML + text previews under `.local-mail/` so outbound SMTP can be
         * inspected locally. Enabled when EMAIL_SAVE_LOCAL=true, or by default outside production.
         * Folder is gitignored.
         */
        EmailService_1.prototype.saveLocalMailPreview = function (params) {
            var _a, _b, _c, _d;
            try {
                var nodeEnv = String((_a = this.configService.get('NODE_ENV')) !== null && _a !== void 0 ? _a : 'development').toLowerCase();
                var flag = String((_b = this.configService.get('EMAIL_SAVE_LOCAL')) !== null && _b !== void 0 ? _b : '')
                    .trim()
                    .toLowerCase();
                var enabled = flag === 'true' ||
                    (flag !== 'false' && nodeEnv !== 'production' && nodeEnv !== 'prod');
                if (!enabled) {
                    return;
                }
                var dir = (0, path_1.join)(process.cwd(), '.local-mail');
                if (!(0, fs_1.existsSync)(dir)) {
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                }
                var stamp = new Date().toISOString().replace(/[:.]/g, '-');
                var safeSubject = String((_c = params.subject) !== null && _c !== void 0 ? _c : 'email')
                    .replace(/[^a-zA-Z0-9._-]+/g, '_')
                    .slice(0, 80);
                var base = "".concat(stamp, "_").concat(safeSubject || 'email');
                var meta = [
                    "To: ".concat(params.to),
                    ((_d = params.cc) === null || _d === void 0 ? void 0 : _d.length) ? "Cc: ".concat(params.cc.join(', ')) : null,
                    "Subject: ".concat(params.subject),
                    "SavedAt: ".concat(new Date().toISOString()),
                    '',
                ]
                    .filter(function (line) { return line != null; })
                    .join('\n');
                (0, fs_1.writeFileSync)((0, path_1.join)(dir, "".concat(base, ".html")), params.html, 'utf8');
                (0, fs_1.writeFileSync)((0, path_1.join)(dir, "".concat(base, ".txt")), "".concat(meta).concat(params.text, "\n"), 'utf8');
                this.logger.log("Local email preview saved: .local-mail/".concat(base, ".html (open in browser)"));
            }
            catch (error) {
                this.logger.warn("Failed to save local email preview: ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
            }
        };
        return EmailService_1;
    }());
    __setFunctionName(_classThis, "EmailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailService = _classThis;
}();
exports.EmailService = EmailService;
