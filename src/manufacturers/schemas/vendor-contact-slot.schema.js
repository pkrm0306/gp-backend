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
exports.VendorContactSlotSchema = exports.VendorContactSlot = void 0;
var mongoose_1 = require("@nestjs/mongoose");
/** Technical or marketing contact row on a manufacturer (vendor portal). */
var VendorContactSlot = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_id_decorators;
    var _email_id_initializers = [];
    var _email_id_extraInitializers = [];
    var _phone_number_decorators;
    var _phone_number_initializers = [];
    var _phone_number_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var VendorContactSlot = _classThis = /** @class */ (function () {
        function VendorContactSlot_1() {
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.email_id = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_id_initializers, void 0));
            this.phone_number = (__runInitializers(this, _email_id_extraInitializers), __runInitializers(this, _phone_number_initializers, void 0));
            this.designation = (__runInitializers(this, _phone_number_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
            __runInitializers(this, _designation_extraInitializers);
        }
        return VendorContactSlot_1;
    }());
    __setFunctionName(_classThis, "VendorContactSlot");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _email_id_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _phone_number_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _designation_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_id_decorators, { kind: "field", name: "email_id", static: false, private: false, access: { has: function (obj) { return "email_id" in obj; }, get: function (obj) { return obj.email_id; }, set: function (obj, value) { obj.email_id = value; } }, metadata: _metadata }, _email_id_initializers, _email_id_extraInitializers);
        __esDecorate(null, null, _phone_number_decorators, { kind: "field", name: "phone_number", static: false, private: false, access: { has: function (obj) { return "phone_number" in obj; }, get: function (obj) { return obj.phone_number; }, set: function (obj, value) { obj.phone_number = value; } }, metadata: _metadata }, _phone_number_initializers, _phone_number_extraInitializers);
        __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorContactSlot = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorContactSlot = _classThis;
}();
exports.VendorContactSlot = VendorContactSlot;
exports.VendorContactSlotSchema = mongoose_1.SchemaFactory.createForClass(VendorContactSlot);
