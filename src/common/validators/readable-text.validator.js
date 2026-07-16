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
exports.toReadableText = toReadableText;
exports.IsReadableNotEmpty = IsReadableNotEmpty;
exports.MaxReadableLength = MaxReadableLength;
var class_validator_1 = require("class-validator");
function decodeBasicHtmlEntities(value) {
    return value
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");
}
function toReadableText(value) {
    var raw = String(value !== null && value !== void 0 ? value : '');
    return decodeBasicHtmlEntities(raw
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim());
}
var IsReadableNotEmptyConstraint = function () {
    var _classDecorators = [(0, class_validator_1.ValidatorConstraint)({ name: 'isReadableNotEmpty', async: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IsReadableNotEmptyConstraint = _classThis = /** @class */ (function () {
        function IsReadableNotEmptyConstraint_1() {
        }
        IsReadableNotEmptyConstraint_1.prototype.validate = function (value) {
            return toReadableText(value).length > 0;
        };
        IsReadableNotEmptyConstraint_1.prototype.defaultMessage = function () {
            return 'must contain readable text';
        };
        return IsReadableNotEmptyConstraint_1;
    }());
    __setFunctionName(_classThis, "IsReadableNotEmptyConstraint");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IsReadableNotEmptyConstraint = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IsReadableNotEmptyConstraint = _classThis;
}();
var MaxReadableLengthConstraint = function () {
    var _classDecorators = [(0, class_validator_1.ValidatorConstraint)({ name: 'maxReadableLength', async: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MaxReadableLengthConstraint = _classThis = /** @class */ (function () {
        function MaxReadableLengthConstraint_1() {
        }
        MaxReadableLengthConstraint_1.prototype.validate = function (value, args) {
            var _a, _b;
            var maxLength = Number((_b = (_a = args === null || args === void 0 ? void 0 : args.constraints) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0);
            if (value === undefined || value === null)
                return true;
            return toReadableText(value).length <= maxLength;
        };
        MaxReadableLengthConstraint_1.prototype.defaultMessage = function (args) {
            var _a, _b;
            var maxLength = Number((_b = (_a = args === null || args === void 0 ? void 0 : args.constraints) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0);
            return "must be shorter than or equal to ".concat(maxLength, " readable characters");
        };
        return MaxReadableLengthConstraint_1;
    }());
    __setFunctionName(_classThis, "MaxReadableLengthConstraint");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaxReadableLengthConstraint = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaxReadableLengthConstraint = _classThis;
}();
function IsReadableNotEmpty(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsReadableNotEmptyConstraint,
        });
    };
}
function MaxReadableLength(maxLength, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [maxLength],
            validator: MaxReadableLengthConstraint,
        });
    };
}
