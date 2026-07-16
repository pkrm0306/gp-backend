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
exports.StaffRoleMappingSchema = exports.StaffRoleMapping = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var StaffRoleMapping = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'staff_role_mappings', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _vendorUserId_decorators;
    var _vendorUserId_initializers = [];
    var _vendorUserId_extraInitializers = [];
    var _roleId_decorators;
    var _roleId_initializers = [];
    var _roleId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var StaffRoleMapping = _classThis = /** @class */ (function () {
        function StaffRoleMapping_1() {
            this.manufacturerId = __runInitializers(this, _manufacturerId_initializers, void 0);
            this.vendorUserId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _vendorUserId_initializers, void 0));
            this.roleId = (__runInitializers(this, _vendorUserId_extraInitializers), __runInitializers(this, _roleId_initializers, void 0));
            this.status = (__runInitializers(this, _roleId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = __runInitializers(this, _status_extraInitializers);
        }
        return StaffRoleMapping_1;
    }());
    __setFunctionName(_classThis, "StaffRoleMapping");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: false, default: null })];
        _vendorUserId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'VendorUser', required: true })];
        _roleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Role', required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _vendorUserId_decorators, { kind: "field", name: "vendorUserId", static: false, private: false, access: { has: function (obj) { return "vendorUserId" in obj; }, get: function (obj) { return obj.vendorUserId; }, set: function (obj, value) { obj.vendorUserId = value; } }, metadata: _metadata }, _vendorUserId_initializers, _vendorUserId_extraInitializers);
        __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: function (obj) { return "roleId" in obj; }, get: function (obj) { return obj.roleId; }, set: function (obj, value) { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _roleId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StaffRoleMapping = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StaffRoleMapping = _classThis;
}();
exports.StaffRoleMapping = StaffRoleMapping;
exports.StaffRoleMappingSchema = mongoose_1.SchemaFactory.createForClass(StaffRoleMapping);
exports.StaffRoleMappingSchema.index({ vendorUserId: 1, roleId: 1 }, {
    unique: true,
    partialFilterExpression: {
        $or: [
            { manufacturerId: null },
            { manufacturerId: { $exists: false } },
        ],
    },
});
exports.StaffRoleMappingSchema.index({ manufacturerId: 1, vendorUserId: 1, roleId: 1 }, {
    unique: true,
    partialFilterExpression: {
        manufacturerId: { $exists: true, $type: 'objectId' },
    },
});
