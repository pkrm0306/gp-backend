"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var admin_update_urn_status_dto_1 = require("./admin-update-urn-status.dto");
describe('AdminUpdateUrnStatusDto', function () {
    it('accepts renewal urn status 14 (regression for >11)', function () {
        var dto = (0, class_transformer_1.plainToInstance)(admin_update_urn_status_dto_1.AdminUpdateUrnStatusDto, {
            urnNo: 'URN-TEST-1',
            updateStatusType: 'urn_status',
            updateStatusTo: 14,
        });
        var errors = (0, class_validator_1.validateSync)(dto);
        expect(errors).toHaveLength(0);
    });
    it('rejects out-of-range urn status 18 with new bound', function () {
        var dto = (0, class_transformer_1.plainToInstance)(admin_update_urn_status_dto_1.AdminUpdateUrnStatusDto, {
            urnNo: 'URN-TEST-1',
            updateStatusType: 'urn_status',
            updateStatusTo: 18,
        });
        var errors = (0, class_validator_1.validateSync)(dto);
        var messages = errors
            .flatMap(function (err) { var _a; return Object.values((_a = err.constraints) !== null && _a !== void 0 ? _a : {}); })
            .join(' | ');
        expect(messages).toContain('must not be greater than 17');
        expect(messages).not.toContain('must not be greater than 11');
    });
});
