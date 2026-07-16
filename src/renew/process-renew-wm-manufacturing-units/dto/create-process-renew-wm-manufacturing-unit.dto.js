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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProcessRenewWmManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_process_wm_manufacturing_unit_dto_1 = require("../../../process-wm-manufacturing-units/dto/create-process-wm-manufacturing-unit.dto");
var renew_cycle_scope_fields_dto_1 = require("../../dto/renew-cycle-scope-fields.dto");
var CreateProcessRenewWmManufacturingUnitDto = /** @class */ (function (_super) {
    __extends(CreateProcessRenewWmManufacturingUnitDto, _super);
    function CreateProcessRenewWmManufacturingUnitDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateProcessRenewWmManufacturingUnitDto;
}((0, swagger_1.IntersectionType)(create_process_wm_manufacturing_unit_dto_1.CreateProcessWmManufacturingUnitDto, renew_cycle_scope_fields_dto_1.RenewCycleScopeFields)));
exports.CreateProcessRenewWmManufacturingUnitDto = CreateProcessRenewWmManufacturingUnitDto;
