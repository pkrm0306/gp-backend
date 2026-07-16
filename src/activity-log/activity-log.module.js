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
exports.ActivityLogModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var activity_log_schema_1 = require("./schemas/activity-log.schema");
var activity_log_service_1 = require("./activity-log.service");
var activity_log_controller_1 = require("./activity-log.controller");
var admin_process_activity_log_controller_1 = require("./admin-process-activity-log.controller");
var activity_log_access_service_1 = require("./activity-log-access.service");
var product_registration_workflow_service_1 = require("./product-registration-workflow.service");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var rbac_module_1 = require("../rbac/rbac.module");
var auth_module_1 = require("../auth/auth.module");
var ActivityLogModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: activity_log_schema_1.ActivityLog.name, schema: activity_log_schema_1.ActivityLogSchema },
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                ]),
                auth_module_1.AuthModule,
                rbac_module_1.RbacModule,
            ],
            controllers: [activity_log_controller_1.ActivityLogController, admin_process_activity_log_controller_1.AdminProcessActivityLogController],
            providers: [
                activity_log_service_1.ActivityLogService,
                activity_log_access_service_1.ActivityLogAccessService,
                product_registration_workflow_service_1.ProductRegistrationWorkflowService,
                permissions_guard_1.PermissionsGuard,
            ],
            exports: [
                activity_log_service_1.ActivityLogService,
                activity_log_access_service_1.ActivityLogAccessService,
                product_registration_workflow_service_1.ProductRegistrationWorkflowService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ActivityLogModule = _classThis = /** @class */ (function () {
        function ActivityLogModule_1() {
        }
        return ActivityLogModule_1;
    }());
    __setFunctionName(_classThis, "ActivityLogModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityLogModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityLogModule = _classThis;
}();
exports.ActivityLogModule = ActivityLogModule;
