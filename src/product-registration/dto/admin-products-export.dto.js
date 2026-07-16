"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AdminProductsExportDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var admin_list_products_dto_1 = require("./admin-list-products.dto");
var AdminProductsExportDto = function () {
    var _a;
    var _classSuper = admin_list_products_dto_1.AdminListProductsDto;
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    var _includeSheets_decorators;
    var _includeSheets_initializers = [];
    var _includeSheets_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(AdminProductsExportDto, _super);
            function AdminProductsExportDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.format = __runInitializers(_this, _format_initializers, 'xlsx');
                _this.includeSheets = (__runInitializers(_this, _format_extraInitializers), __runInitializers(_this, _includeSheets_initializers, void 0));
                __runInitializers(_this, _includeSheets_extraInitializers);
                return _this;
            }
            return AdminProductsExportDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _format_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Export file format',
                    enum: ['xlsx', 'csv'],
                    default: 'xlsx',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['xlsx', 'csv'])];
            _includeSheets_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Sheets to include in xlsx export',
                    type: [String],
                    example: ['urn_summary', 'eoi_details'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsIn)(['urn_summary', 'eoi_details'], { each: true })];
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _includeSheets_decorators, { kind: "field", name: "includeSheets", static: false, private: false, access: { has: function (obj) { return "includeSheets" in obj; }, get: function (obj) { return obj.includeSheets; }, set: function (obj, value) { obj.includeSheets = value; } }, metadata: _metadata }, _includeSheets_initializers, _includeSheets_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminProductsExportDto = AdminProductsExportDto;
