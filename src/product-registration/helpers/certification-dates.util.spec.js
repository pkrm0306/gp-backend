"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var certification_dates_util_1 = require("./certification-dates.util");
describe('certification-dates.util', function () {
    it('sets validtill to 2027-12-31 for certifications in Jan-Apr 2026', function () {
        var certified = new Date(2026, 0, 1, 14, 30, 0);
        var validtill = (0, certification_dates_util_1.computeValidTillFromCertified)(certified);
        expect(validtill.getFullYear()).toBe(2027);
        expect(validtill.getMonth()).toBe(11);
        expect(validtill.getDate()).toBe(31);
    });
    it('sets validtill to 2028-12-31 for certifications in May-Dec 2026', function () {
        var certified = new Date(2026, 4, 19, 14, 30, 0);
        var validtill = (0, certification_dates_util_1.computeValidTillFromCertified)(certified);
        expect(validtill.getFullYear()).toBe(2028);
        expect(validtill.getMonth()).toBe(11);
        expect(validtill.getDate()).toBe(31);
    });
    it('defaults to Dec 31 two years after certified year for other years', function () {
        var certified = new Date(2027, 0, 15, 14, 30, 0);
        var validtill = (0, certification_dates_util_1.computeValidTillFromCertified)(certified);
        expect(validtill.getFullYear()).toBe(2029);
        expect(validtill.getMonth()).toBe(11);
        expect(validtill.getDate()).toBe(31);
    });
    it('computes notify dates from validtill', function () {
        var validtill = new Date(2028, 11, 31);
        var notify = (0, certification_dates_util_1.computeNotifyDates)(validtill);
        expect(notify.firstNotifyDate.getFullYear()).toBe(2028);
        expect(notify.firstNotifyDate.getMonth()).toBe(9);
        expect(notify.firstNotifyDate.getDate()).toBe(31);
        expect(notify.secondNotifyDate.getMonth()).toBe(10);
        expect(notify.secondNotifyDate.getDate()).toBe(30);
        expect(notify.thirdNotifyDate.getFullYear()).toBe(2029);
        expect(notify.thirdNotifyDate.getMonth()).toBe(0);
        expect(notify.thirdNotifyDate.getDate()).toBe(31);
    });
    it('bundles certification approval dates', function () {
        var approvedAt = new Date(2026, 4, 19);
        var bundle = (0, certification_dates_util_1.computeCertificationDates)(approvedAt);
        expect(bundle.validtillDate.getFullYear()).toBe(2028);
        expect(bundle.firstNotifyDate.getMonth()).toBe(9);
        expect(bundle.thirdNotifyDate.getFullYear()).toBe(2029);
    });
});
