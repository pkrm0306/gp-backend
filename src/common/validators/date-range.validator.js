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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFromDateNotLaterThanToDateConstraint = exports.FROM_DATE_LATER_THAN_TO_MESSAGE = void 0;
exports.isFromDateNotLaterThanToDate = isFromDateNotLaterThanToDate;
exports.assertFromDateNotLaterThanToDate = assertFromDateNotLaterThanToDate;
exports.IsFromDateNotLaterThanToDate = IsFromDateNotLaterThanToDate;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
exports.FROM_DATE_LATER_THAN_TO_MESSAGE = 'From Date cannot be later than To Date.';
/** True when either bound is missing, or From <= To (same calendar day allowed). */
function isFromDateNotLaterThanToDate(from, to) {
    var fromRaw = String(from !== null && from !== void 0 ? from : '').trim();
    var toRaw = String(to !== null && to !== void 0 ? to : '').trim();
    if (!fromRaw || !toRaw)
        return true;
    var fromDay = fromRaw.slice(0, 10);
    var toDay = toRaw.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(fromDay) &&
        /^\d{4}-\d{2}-\d{2}$/.test(toDay)) {
        return fromDay <= toDay;
    }
    var fromTime = Date.parse(fromRaw);
    var toTime = Date.parse(toRaw);
    if (Number.isNaN(fromTime) || Number.isNaN(toTime))
        return true;
    return fromTime <= toTime;
}
/** Throws BadRequestException when From > To. */
function assertFromDateNotLaterThanToDate(from, to) {
    if (!isFromDateNotLaterThanToDate(from, to)) {
        throw new common_1.BadRequestException(exports.FROM_DATE_LATER_THAN_TO_MESSAGE);
    }
}
var IsFromDateNotLaterThanToDateConstraint = function () {
    var _classDecorators = [(0, class_validator_1.ValidatorConstraint)({ name: 'isFromDateNotLaterThanToDate', async: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IsFromDateNotLaterThanToDateConstraint = _classThis = /** @class */ (function () {
        function IsFromDateNotLaterThanToDateConstraint_1() {
        }
        IsFromDateNotLaterThanToDateConstraint_1.prototype.validate = function (_value, args) {
            var obj = args.object;
            return isFromDateNotLaterThanToDate(obj.from, obj.to);
        };
        IsFromDateNotLaterThanToDateConstraint_1.prototype.defaultMessage = function () {
            return exports.FROM_DATE_LATER_THAN_TO_MESSAGE;
        };
        return IsFromDateNotLaterThanToDateConstraint_1;
    }());
    __setFunctionName(_classThis, "IsFromDateNotLaterThanToDateConstraint");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IsFromDateNotLaterThanToDateConstraint = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IsFromDateNotLaterThanToDateConstraint = _classThis;
}();
exports.IsFromDateNotLaterThanToDateConstraint = IsFromDateNotLaterThanToDateConstraint;
/**
 * Property decorator (typically on `to`): From Date must be <= To Date when both are set.
 */
function IsFromDateNotLaterThanToDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: __assign({ message: exports.FROM_DATE_LATER_THAN_TO_MESSAGE }, validationOptions),
            constraints: [],
            validator: IsFromDateNotLaterThanToDateConstraint,
        });
    };
}
