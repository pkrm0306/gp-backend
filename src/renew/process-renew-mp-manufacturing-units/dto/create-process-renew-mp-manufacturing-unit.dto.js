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
exports.CreateProcessRenewMpManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_process_mp_manufacturing_unit_dto_1 = require("../../../process-mp-manufacturing-units/dto/create-process-mp-manufacturing-unit.dto");
var renew_cycle_scope_fields_dto_1 = require("../../dto/renew-cycle-scope-fields.dto");
var renew_mp_manufacturing_unit_id_fields_dto_1 = require("../../dto/renew-mp-manufacturing-unit-id-fields.dto");
var CreateProcessRenewMpManufacturingUnitDto = /** @class */ (function (_super) {
    __extends(CreateProcessRenewMpManufacturingUnitDto, _super);
    function CreateProcessRenewMpManufacturingUnitDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateProcessRenewMpManufacturingUnitDto;
}((0, swagger_1.IntersectionType)(create_process_mp_manufacturing_unit_dto_1.CreateProcessMpManufacturingUnitDto, renew_cycle_scope_fields_dto_1.RenewCycleScopeFields, renew_mp_manufacturing_unit_id_fields_dto_1.RenewMpManufacturingUnitIdFields)));
exports.CreateProcessRenewMpManufacturingUnitDto = CreateProcessRenewMpManufacturingUnitDto;
