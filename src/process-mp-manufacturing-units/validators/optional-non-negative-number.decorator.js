"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOptionalNonNegativeNumber = IsOptionalNonNegativeNumber;
var common_1 = require("@nestjs/common");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var parse_optional_number_util_1 = require("../../common/utils/parse-optional-number.util");
/** Optional numeric field (decimals allowed) that must be zero or positive when provided. */
function IsOptionalNonNegativeNumber() {
    return (0, common_1.applyDecorators)((0, class_transformer_1.Transform)(function (_a) {
        var _b;
        var value = _a.value;
        return (_b = (0, parse_optional_number_util_1.parseOptionalDecimalNumber)(value)) !== null && _b !== void 0 ? _b : value;
    }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.Min)(0));
}
