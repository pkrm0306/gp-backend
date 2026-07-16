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
exports.ProcessProductStewardshipModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var process_product_stewardship_schema_1 = require("./schemas/process-product-stewardship.schema");
var all_product_document_schema_1 = require("../product-design/schemas/all-product-document.schema");
var process_ps_stakeholder_edu_awarness_schema_1 = require("./schemas/process-ps-stakeholder-edu-awarness.schema");
var process_product_stewardship_service_1 = require("./process-product-stewardship.service");
var process_product_stewardship_controller_1 = require("./process-product-stewardship.controller");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var product_registration_module_1 = require("../product-registration/product-registration.module");
var passport_1 = require("@nestjs/passport");
var auth_module_1 = require("../auth/auth.module");
var ProcessProductStewardshipModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    {
                        name: process_product_stewardship_schema_1.ProcessProductStewardship.name,
                        schema: process_product_stewardship_schema_1.ProcessProductStewardshipSchema,
                    },
                    {
                        name: process_ps_stakeholder_edu_awarness_schema_1.ProcessPsStakeholderEduAwarness.name,
                        schema: process_ps_stakeholder_edu_awarness_schema_1.ProcessPsStakeholderEduAwarnessSchema,
                    },
                    { name: all_product_document_schema_1.AllProductDocument.name, schema: all_product_document_schema_1.AllProductDocumentSchema },
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                ]),
                product_registration_module_1.ProductRegistrationModule, // for SequenceHelper
                passport_1.PassportModule,
                auth_module_1.AuthModule,
            ],
            controllers: [process_product_stewardship_controller_1.ProcessProductStewardshipController],
            providers: [process_product_stewardship_service_1.ProcessProductStewardshipService],
            exports: [process_product_stewardship_service_1.ProcessProductStewardshipService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessProductStewardshipModule = _classThis = /** @class */ (function () {
        function ProcessProductStewardshipModule_1() {
        }
        return ProcessProductStewardshipModule_1;
    }());
    __setFunctionName(_classThis, "ProcessProductStewardshipModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessProductStewardshipModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessProductStewardshipModule = _classThis;
}();
exports.ProcessProductStewardshipModule = ProcessProductStewardshipModule;
