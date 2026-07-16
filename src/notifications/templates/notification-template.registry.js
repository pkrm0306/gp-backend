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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateRegistry = void 0;
var common_1 = require("@nestjs/common");
var notification_templates_1 = require("./notification-templates");
var notification_template_util_1 = require("./notification-template.util");
var NotificationTemplateRegistry = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationTemplateRegistry = _classThis = /** @class */ (function () {
        function NotificationTemplateRegistry_1() {
        }
        NotificationTemplateRegistry_1.prototype.getDefinition = function (code) {
            var def = notification_templates_1.NOTIFICATION_TEMPLATES[code];
            if (!def) {
                throw new common_1.BadRequestException("Unknown notification template: ".concat(code));
            }
            return def;
        };
        NotificationTemplateRegistry_1.prototype.resolveEmail = function (code, payload) {
            var def = this.getDefinition(code);
            if (!def.email) {
                return null;
            }
            return {
                subject: (0, notification_template_util_1.interpolateTemplate)(def.email.subject, payload),
                html: (0, notification_template_util_1.interpolateTemplate)(def.email.html, payload),
                text: def.email.text
                    ? (0, notification_template_util_1.interpolateTemplate)(def.email.text, payload)
                    : undefined,
            };
        };
        NotificationTemplateRegistry_1.prototype.resolveInApp = function (code, payload, overrides) {
            var _a, _b, _c, _d, _e, _f, _g;
            var def = this.getDefinition(code);
            if (!def.inApp && !(overrides === null || overrides === void 0 ? void 0 : overrides.title)) {
                return null;
            }
            var base = (_a = def.inApp) !== null && _a !== void 0 ? _a : {
                title: '',
                content: '',
                type: 'info',
                notifyType: code,
            };
            return {
                title: (_b = overrides === null || overrides === void 0 ? void 0 : overrides.title) !== null && _b !== void 0 ? _b : (0, notification_template_util_1.interpolateTemplate)(base.title, payload),
                content: (_c = overrides === null || overrides === void 0 ? void 0 : overrides.content) !== null && _c !== void 0 ? _c : (0, notification_template_util_1.interpolateTemplate)(base.content, payload),
                type: (_e = (_d = overrides === null || overrides === void 0 ? void 0 : overrides.type) !== null && _d !== void 0 ? _d : base.type) !== null && _e !== void 0 ? _e : 'info',
                notifyType: (_g = (_f = overrides === null || overrides === void 0 ? void 0 : overrides.notifyType) !== null && _f !== void 0 ? _f : base.notifyType) !== null && _g !== void 0 ? _g : code,
            };
        };
        return NotificationTemplateRegistry_1;
    }());
    __setFunctionName(_classThis, "NotificationTemplateRegistry");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationTemplateRegistry = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationTemplateRegistry = _classThis;
}();
exports.NotificationTemplateRegistry = NotificationTemplateRegistry;
