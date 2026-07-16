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
exports.PlantMergeModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var passport_1 = require("@nestjs/passport");
var product_schema_1 = require("../schemas/product.schema");
var product_plant_schema_1 = require("../schemas/product-plant.schema");
var renewal_cycle_schema_1 = require("../../renew/schemas/renewal-cycle.schema");
var plant_merge_audit_schema_1 = require("./schemas/plant-merge-audit.schema");
var plant_merge_controller_1 = require("./plant-merge.controller");
var plant_merge_service_1 = require("./plant-merge.service");
var plant_merge_urn_preview_service_1 = require("./services/plant-merge-urn-preview.service");
var plant_merge_urn_validation_service_1 = require("./services/plant-merge-urn-validation.service");
var plant_merge_urn_execute_service_1 = require("./services/plant-merge-urn-execute.service");
var activity_log_module_1 = require("../../activity-log/activity-log.module");
var auth_module_1 = require("../../auth/auth.module");
var rbac_module_1 = require("../../rbac/rbac.module");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var sequence_helper_1 = require("../helpers/sequence.helper");
var redis_module_1 = require("../../common/redis/redis.module");
var PlantMergeModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                    { name: product_plant_schema_1.ProductPlant.name, schema: product_plant_schema_1.ProductPlantSchema },
                    { name: renewal_cycle_schema_1.RenewalCycle.name, schema: renewal_cycle_schema_1.RenewalCycleSchema },
                    { name: plant_merge_audit_schema_1.PlantMergeAudit.name, schema: plant_merge_audit_schema_1.PlantMergeAuditSchema },
                ]),
                passport_1.PassportModule,
                auth_module_1.AuthModule,
                rbac_module_1.RbacModule,
                activity_log_module_1.ActivityLogModule,
                redis_module_1.RedisModule,
            ],
            controllers: [plant_merge_controller_1.PlantMergeController],
            providers: [
                plant_merge_service_1.PlantMergeService,
                plant_merge_urn_preview_service_1.PlantMergeUrnPreviewService,
                plant_merge_urn_validation_service_1.PlantMergeUrnValidationService,
                plant_merge_urn_execute_service_1.PlantMergeUrnExecuteService,
                sequence_helper_1.SequenceHelper,
                permissions_guard_1.PermissionsGuard,
            ],
            exports: [
                plant_merge_service_1.PlantMergeService,
                plant_merge_urn_preview_service_1.PlantMergeUrnPreviewService,
                plant_merge_urn_validation_service_1.PlantMergeUrnValidationService,
                plant_merge_urn_execute_service_1.PlantMergeUrnExecuteService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlantMergeModule = _classThis = /** @class */ (function () {
        function PlantMergeModule_1() {
        }
        return PlantMergeModule_1;
    }());
    __setFunctionName(_classThis, "PlantMergeModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeModule = _classThis;
}();
exports.PlantMergeModule = PlantMergeModule;
