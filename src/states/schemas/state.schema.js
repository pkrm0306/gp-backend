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
exports.StateSchema = exports.State = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var State = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    var _country_id_decorators;
    var _country_id_initializers = [];
    var _country_id_extraInitializers = [];
    var _country_code_decorators;
    var _country_code_initializers = [];
    var _country_code_extraInitializers = [];
    var _country_name_decorators;
    var _country_name_initializers = [];
    var _country_name_extraInitializers = [];
    var _stateName_decorators;
    var _stateName_initializers = [];
    var _stateName_extraInitializers = [];
    var _stateCode_decorators;
    var _stateCode_initializers = [];
    var _stateCode_extraInitializers = [];
    var State = _classThis = /** @class */ (function () {
        function State_1() {
            this.countryId = __runInitializers(this, _countryId_initializers, void 0);
            // Support for existing data structure
            this.country_id = (__runInitializers(this, _countryId_extraInitializers), __runInitializers(this, _country_id_initializers, void 0));
            this.country_code = (__runInitializers(this, _country_id_extraInitializers), __runInitializers(this, _country_code_initializers, void 0));
            this.country_name = (__runInitializers(this, _country_code_extraInitializers), __runInitializers(this, _country_name_initializers, void 0));
            this.stateName = (__runInitializers(this, _country_name_extraInitializers), __runInitializers(this, _stateName_initializers, void 0));
            this.stateCode = (__runInitializers(this, _stateName_extraInitializers), __runInitializers(this, _stateCode_initializers, void 0));
            this.createdAt = __runInitializers(this, _stateCode_extraInitializers);
        }
        return State_1;
    }());
    __setFunctionName(_classThis, "State");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _countryId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Country' })];
        _country_id_decorators = [(0, mongoose_1.Prop)()];
        _country_code_decorators = [(0, mongoose_1.Prop)()];
        _country_name_decorators = [(0, mongoose_1.Prop)()];
        _stateName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _stateCode_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
        __esDecorate(null, null, _country_id_decorators, { kind: "field", name: "country_id", static: false, private: false, access: { has: function (obj) { return "country_id" in obj; }, get: function (obj) { return obj.country_id; }, set: function (obj, value) { obj.country_id = value; } }, metadata: _metadata }, _country_id_initializers, _country_id_extraInitializers);
        __esDecorate(null, null, _country_code_decorators, { kind: "field", name: "country_code", static: false, private: false, access: { has: function (obj) { return "country_code" in obj; }, get: function (obj) { return obj.country_code; }, set: function (obj, value) { obj.country_code = value; } }, metadata: _metadata }, _country_code_initializers, _country_code_extraInitializers);
        __esDecorate(null, null, _country_name_decorators, { kind: "field", name: "country_name", static: false, private: false, access: { has: function (obj) { return "country_name" in obj; }, get: function (obj) { return obj.country_name; }, set: function (obj, value) { obj.country_name = value; } }, metadata: _metadata }, _country_name_initializers, _country_name_extraInitializers);
        __esDecorate(null, null, _stateName_decorators, { kind: "field", name: "stateName", static: false, private: false, access: { has: function (obj) { return "stateName" in obj; }, get: function (obj) { return obj.stateName; }, set: function (obj, value) { obj.stateName = value; } }, metadata: _metadata }, _stateName_initializers, _stateName_extraInitializers);
        __esDecorate(null, null, _stateCode_decorators, { kind: "field", name: "stateCode", static: false, private: false, access: { has: function (obj) { return "stateCode" in obj; }, get: function (obj) { return obj.stateCode; }, set: function (obj, value) { obj.stateCode = value; } }, metadata: _metadata }, _stateCode_initializers, _stateCode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        State = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return State = _classThis;
}();
exports.State = State;
exports.StateSchema = mongoose_1.SchemaFactory.createForClass(State);
