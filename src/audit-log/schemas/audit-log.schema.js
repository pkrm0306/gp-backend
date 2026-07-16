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
exports.AuditLogSchema = exports.AuditLog = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var AuditLog = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'audit_log',
            timestamps: false,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _occurred_at_decorators;
    var _occurred_at_initializers = [];
    var _occurred_at_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _outcome_decorators;
    var _outcome_initializers = [];
    var _outcome_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _action_type_decorators;
    var _action_type_initializers = [];
    var _action_type_extraInitializers = [];
    var _entity_name_decorators;
    var _entity_name_initializers = [];
    var _entity_name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _performed_by_decorators;
    var _performed_by_initializers = [];
    var _performed_by_extraInitializers = [];
    var _old_values_decorators;
    var _old_values_initializers = [];
    var _old_values_extraInitializers = [];
    var _new_values_decorators;
    var _new_values_initializers = [];
    var _new_values_extraInitializers = [];
    var _http_method_decorators;
    var _http_method_initializers = [];
    var _http_method_extraInitializers = [];
    var _route_decorators;
    var _route_initializers = [];
    var _route_extraInitializers = [];
    var _status_code_decorators;
    var _status_code_initializers = [];
    var _status_code_extraInitializers = [];
    var _actor_decorators;
    var _actor_initializers = [];
    var _actor_extraInitializers = [];
    var _resource_decorators;
    var _resource_initializers = [];
    var _resource_extraInitializers = [];
    var _request_decorators;
    var _request_initializers = [];
    var _request_extraInitializers = [];
    var _changes_decorators;
    var _changes_initializers = [];
    var _changes_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var AuditLog = _classThis = /** @class */ (function () {
        function AuditLog_1() {
            this.occurred_at = __runInitializers(this, _occurred_at_initializers, void 0);
            /** Technical / stable code (e.g. PAYMENT_UPDATED). */
            this.action = (__runInitializers(this, _occurred_at_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.outcome = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            /** User-facing bucket: category | sector | product | certification | auth | other */
            this.module = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _module_initializers, void 0));
            /** User-facing verb: create | update | delete | approve | reject | login */
            this.action_type = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _action_type_initializers, void 0));
            this.entity_name = (__runInitializers(this, _action_type_extraInitializers), __runInitializers(this, _entity_name_initializers, void 0));
            this.description = (__runInitializers(this, _entity_name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.performed_by = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _performed_by_initializers, void 0));
            this.old_values = (__runInitializers(this, _performed_by_extraInitializers), __runInitializers(this, _old_values_initializers, void 0));
            this.new_values = (__runInitializers(this, _old_values_extraInitializers), __runInitializers(this, _new_values_initializers, void 0));
            this.http_method = (__runInitializers(this, _new_values_extraInitializers), __runInitializers(this, _http_method_initializers, void 0));
            this.route = (__runInitializers(this, _http_method_extraInitializers), __runInitializers(this, _route_initializers, void 0));
            this.status_code = (__runInitializers(this, _route_extraInitializers), __runInitializers(this, _status_code_initializers, void 0));
            this.actor = (__runInitializers(this, _status_code_extraInitializers), __runInitializers(this, _actor_initializers, void 0));
            this.resource = (__runInitializers(this, _actor_extraInitializers), __runInitializers(this, _resource_initializers, void 0));
            this.request = (__runInitializers(this, _resource_extraInitializers), __runInitializers(this, _request_initializers, void 0));
            this.changes = (__runInitializers(this, _request_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.metadata = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
        return AuditLog_1;
    }());
    __setFunctionName(_classThis, "AuditLog");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _occurred_at_decorators = [(0, mongoose_1.Prop)({ type: Date, required: true, index: true })];
        _action_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _outcome_decorators = [(0, mongoose_1.Prop)({ required: true, enum: ['success', 'failure'], index: true })];
        _module_decorators = [(0, mongoose_1.Prop)({ index: true })];
        _action_type_decorators = [(0, mongoose_1.Prop)({ index: true })];
        _entity_name_decorators = [(0, mongoose_1.Prop)()];
        _description_decorators = [(0, mongoose_1.Prop)()];
        _performed_by_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _old_values_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _new_values_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _http_method_decorators = [(0, mongoose_1.Prop)()];
        _route_decorators = [(0, mongoose_1.Prop)()];
        _status_code_decorators = [(0, mongoose_1.Prop)()];
        _actor_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _resource_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _request_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _changes_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _metadata_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        __esDecorate(null, null, _occurred_at_decorators, { kind: "field", name: "occurred_at", static: false, private: false, access: { has: function (obj) { return "occurred_at" in obj; }, get: function (obj) { return obj.occurred_at; }, set: function (obj, value) { obj.occurred_at = value; } }, metadata: _metadata }, _occurred_at_initializers, _occurred_at_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: function (obj) { return "outcome" in obj; }, get: function (obj) { return obj.outcome; }, set: function (obj, value) { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
        __esDecorate(null, null, _action_type_decorators, { kind: "field", name: "action_type", static: false, private: false, access: { has: function (obj) { return "action_type" in obj; }, get: function (obj) { return obj.action_type; }, set: function (obj, value) { obj.action_type = value; } }, metadata: _metadata }, _action_type_initializers, _action_type_extraInitializers);
        __esDecorate(null, null, _entity_name_decorators, { kind: "field", name: "entity_name", static: false, private: false, access: { has: function (obj) { return "entity_name" in obj; }, get: function (obj) { return obj.entity_name; }, set: function (obj, value) { obj.entity_name = value; } }, metadata: _metadata }, _entity_name_initializers, _entity_name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _performed_by_decorators, { kind: "field", name: "performed_by", static: false, private: false, access: { has: function (obj) { return "performed_by" in obj; }, get: function (obj) { return obj.performed_by; }, set: function (obj, value) { obj.performed_by = value; } }, metadata: _metadata }, _performed_by_initializers, _performed_by_extraInitializers);
        __esDecorate(null, null, _old_values_decorators, { kind: "field", name: "old_values", static: false, private: false, access: { has: function (obj) { return "old_values" in obj; }, get: function (obj) { return obj.old_values; }, set: function (obj, value) { obj.old_values = value; } }, metadata: _metadata }, _old_values_initializers, _old_values_extraInitializers);
        __esDecorate(null, null, _new_values_decorators, { kind: "field", name: "new_values", static: false, private: false, access: { has: function (obj) { return "new_values" in obj; }, get: function (obj) { return obj.new_values; }, set: function (obj, value) { obj.new_values = value; } }, metadata: _metadata }, _new_values_initializers, _new_values_extraInitializers);
        __esDecorate(null, null, _http_method_decorators, { kind: "field", name: "http_method", static: false, private: false, access: { has: function (obj) { return "http_method" in obj; }, get: function (obj) { return obj.http_method; }, set: function (obj, value) { obj.http_method = value; } }, metadata: _metadata }, _http_method_initializers, _http_method_extraInitializers);
        __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: function (obj) { return "route" in obj; }, get: function (obj) { return obj.route; }, set: function (obj, value) { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
        __esDecorate(null, null, _status_code_decorators, { kind: "field", name: "status_code", static: false, private: false, access: { has: function (obj) { return "status_code" in obj; }, get: function (obj) { return obj.status_code; }, set: function (obj, value) { obj.status_code = value; } }, metadata: _metadata }, _status_code_initializers, _status_code_extraInitializers);
        __esDecorate(null, null, _actor_decorators, { kind: "field", name: "actor", static: false, private: false, access: { has: function (obj) { return "actor" in obj; }, get: function (obj) { return obj.actor; }, set: function (obj, value) { obj.actor = value; } }, metadata: _metadata }, _actor_initializers, _actor_extraInitializers);
        __esDecorate(null, null, _resource_decorators, { kind: "field", name: "resource", static: false, private: false, access: { has: function (obj) { return "resource" in obj; }, get: function (obj) { return obj.resource; }, set: function (obj, value) { obj.resource = value; } }, metadata: _metadata }, _resource_initializers, _resource_extraInitializers);
        __esDecorate(null, null, _request_decorators, { kind: "field", name: "request", static: false, private: false, access: { has: function (obj) { return "request" in obj; }, get: function (obj) { return obj.request; }, set: function (obj, value) { obj.request = value; } }, metadata: _metadata }, _request_initializers, _request_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: function (obj) { return "changes" in obj; }, get: function (obj) { return obj.changes; }, set: function (obj, value) { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLog = _classThis;
}();
exports.AuditLog = AuditLog;
exports.AuditLogSchema = mongoose_1.SchemaFactory.createForClass(AuditLog);
exports.AuditLogSchema.index({ occurred_at: -1 });
exports.AuditLogSchema.index({ action: 1, occurred_at: -1 });
exports.AuditLogSchema.index({ module: 1, occurred_at: -1 });
exports.AuditLogSchema.index({ action_type: 1, occurred_at: -1 });
exports.AuditLogSchema.index({ 'actor.user_id': 1, occurred_at: -1 });
exports.AuditLogSchema.index({ 'performed_by.user_id': 1, occurred_at: -1 });
exports.AuditLogSchema.index({ 'resource.type': 1, 'resource.id': 1, occurred_at: -1 });
exports.AuditLogSchema.index({ 'resource.urn_no': 1, occurred_at: -1 });
exports.AuditLogSchema.index({ 'metadata.audit_event_id': 1 }, {
    unique: true,
    sparse: true,
    partialFilterExpression: {
        'metadata.audit_event_id': { $type: 'string' },
    },
});
var AUDIT_IMMUTABLE_ERROR = 'Audit logs are append-only and cannot be modified';
function rejectAuditMutation(next) {
    next(new Error(AUDIT_IMMUTABLE_ERROR));
}
exports.AuditLogSchema.pre('save', function (next) {
    if (!this.isNew) {
        next(new Error(AUDIT_IMMUTABLE_ERROR));
        return;
    }
    next();
});
exports.AuditLogSchema.pre('updateOne', rejectAuditMutation);
exports.AuditLogSchema.pre('updateMany', rejectAuditMutation);
exports.AuditLogSchema.pre('findOneAndUpdate', rejectAuditMutation);
exports.AuditLogSchema.pre('replaceOne', rejectAuditMutation);
exports.AuditLogSchema.pre('findOneAndReplace', rejectAuditMutation);
exports.AuditLogSchema.pre('deleteOne', rejectAuditMutation);
exports.AuditLogSchema.pre('deleteMany', rejectAuditMutation);
exports.AuditLogSchema.pre('findOneAndDelete', rejectAuditMutation);
exports.AuditLogSchema.pre('bulkWrite', function (next, ops) {
    var hasMutation = ops.some(function (op) {
        return ['updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany'].some(function (operation) { return Object.prototype.hasOwnProperty.call(op, operation); });
    });
    if (hasMutation) {
        next(new Error(AUDIT_IMMUTABLE_ERROR));
        return;
    }
    next();
});
