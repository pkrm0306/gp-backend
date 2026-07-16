"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var process_renew_comments_service_1 = require("./process-renew-comments.service");
describe('ProcessRenewCommentsService admin section validation', function () {
    var service = Object.create(process_renew_comments_service_1.ProcessRenewCommentsService.prototype);
    it('rejects POST with no section field', function () {
        expect(function () {
            return service.pickSingleAdminSectionField({
                urnNo: 'URN-1',
                renewalCycleId: 'abc',
            });
        }).toThrow(common_1.BadRequestException);
    });
    it('rejects POST with multiple section fields', function () {
        expect(function () {
            return service.pickSingleAdminSectionField({
                urnNo: 'URN-1',
                productPerformance: 'a',
                wasteManagement: 'b',
            });
        }).toThrow(/Only one process comment section field/);
    });
    it('accepts legacy manfacturingProcess field name', function () {
        var patch = service.pickSingleAdminSectionField({
            urnNo: 'URN-1',
            manfacturingProcess: '<p>ok</p>',
        });
        expect(patch).toEqual({ manfacturingProcess: '<p>ok</p>' });
    });
});
