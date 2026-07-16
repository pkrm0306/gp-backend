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
exports.ProcessMpManufacturingUnitsModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var process_mp_manufacturing_unit_schema_1 = require("./schemas/process-mp-manufacturing-unit.schema");
var process_mp_manufacturing_units_service_1 = require("./process-mp-manufacturing-units.service");
var process_mp_manufacturing_units_controller_1 = require("./process-mp-manufacturing-units.controller");
var admin_process_mp_manufacturing_units_controller_1 = require("./admin-process-mp-manufacturing-units.controller");
var product_registration_module_1 = require("../product-registration/product-registration.module");
var passport_1 = require("@nestjs/passport");
var auth_module_1 = require("../auth/auth.module");
var rbac_module_1 = require("../rbac/rbac.module");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var ProcessMpManufacturingUnitsModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    {
                        name: process_mp_manufacturing_unit_schema_1.ProcessMpManufacturingUnit.name,
                        schema: process_mp_manufacturing_unit_schema_1.ProcessMpManufacturingUnitSchema,
                    },
                ]),
                product_registration_module_1.ProductRegistrationModule, // for SequenceHelper
                passport_1.PassportModule,
                auth_module_1.AuthModule,
                rbac_module_1.RbacModule,
            ],
            controllers: [
                process_mp_manufacturing_units_controller_1.ProcessMpManufacturingUnitsController,
                admin_process_mp_manufacturing_units_controller_1.AdminProcessMpManufacturingUnitsController,
                admin_process_mp_manufacturing_units_controller_1.ApiProcessMpManufacturingUnitsController,
            ],
            providers: [process_mp_manufacturing_units_service_1.ProcessMpManufacturingUnitsService, permissions_guard_1.PermissionsGuard],
            exports: [process_mp_manufacturing_units_service_1.ProcessMpManufacturingUnitsService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessMpManufacturingUnitsModule = _classThis = /** @class */ (function () {
        function ProcessMpManufacturingUnitsModule_1() {
        }
        return ProcessMpManufacturingUnitsModule_1;
    }());
    __setFunctionName(_classThis, "ProcessMpManufacturingUnitsModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessMpManufacturingUnitsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessMpManufacturingUnitsModule = _classThis;
}();
exports.ProcessMpManufacturingUnitsModule = ProcessMpManufacturingUnitsModule;
