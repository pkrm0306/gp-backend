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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewCycleScopeFields = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
/** Optional renewal cycle scope on renew process POST bodies. */
var RenewCycleScopeFields = function () {
    var _a;
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _renewal_cycle_id_decorators;
    var _renewal_cycle_id_initializers = [];
    var _renewal_cycle_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RenewCycleScopeFields() {
                this.renewalCycleId = __runInitializers(this, _renewalCycleId_initializers, void 0);
                this.renewal_cycle_id = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _renewal_cycle_id_initializers, void 0));
                __runInitializers(this, _renewal_cycle_id_extraInitializers);
            }
            return RenewCycleScopeFields;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _renewalCycleId_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: '6a1edd713ec5008b997aca94',
                    description: 'Renewal cycle scope (required when multiple cycles exist)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _renewal_cycle_id_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Snake-case alias for renewalCycleId',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            __esDecorate(null, null, _renewal_cycle_id_decorators, { kind: "field", name: "renewal_cycle_id", static: false, private: false, access: { has: function (obj) { return "renewal_cycle_id" in obj; }, get: function (obj) { return obj.renewal_cycle_id; }, set: function (obj, value) { obj.renewal_cycle_id = value; } }, metadata: _metadata }, _renewal_cycle_id_initializers, _renewal_cycle_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RenewCycleScopeFields = RenewCycleScopeFields;
