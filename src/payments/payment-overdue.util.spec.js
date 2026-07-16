"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payment_overdue_util_1 = require("./payment-overdue.util");
describe('payment-overdue.util', function () {
    var ref = new Date(2026, 6, 10); // 10 Jul 2026
    it('parses ISO and dd-mm-yyyy created dates', function () {
        var _a, _b;
        expect((_a = (0, payment_overdue_util_1.parsePaymentCreatedDate)('2026-06-26T10:00:00.000Z')) === null || _a === void 0 ? void 0 : _a.getFullYear()).toBe(2026);
        expect((_b = (0, payment_overdue_util_1.parsePaymentCreatedDate)('26-06-2026')) === null || _b === void 0 ? void 0 : _b.getDate()).toBe(26);
        expect((0, payment_overdue_util_1.parsePaymentCreatedDate)('')).toBeNull();
    });
    it('treats status 0 as pending before 14 calendar days', function () {
        var created = new Date(2026, 6, 1); // 1 Jul 2026 — 9 days before ref
        expect((0, payment_overdue_util_1.isPaymentOverdue)(0, created, ref)).toBe(false);
        expect((0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(0, created, ref)).toBe(1);
    });
    it('treats status 0 as overdue on the 14th calendar day', function () {
        var created = new Date(2026, 5, 26); // 26 Jun 2026 — 14 days before ref
        expect((0, payment_overdue_util_1.isPaymentOverdue)(0, created, ref)).toBe(true);
        expect((0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(0, created, ref)).toBe(0);
    });
    it('does not mark non-created statuses as overdue', function () {
        var created = new Date(2026, 0, 1);
        expect((0, payment_overdue_util_1.isPaymentOverdue)(1, created, ref)).toBe(false);
        expect((0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(1, created, ref)).toBe(1);
        expect((0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(2, created, ref)).toBe(2);
        expect((0, payment_overdue_util_1.resolveVendorDisplayPaymentStatus)(3, created, ref)).toBe(3);
    });
    it('builds vendor history status clauses for pending and overdue', function () {
        var overdueClause = (0, payment_overdue_util_1.buildVendorHistoryStatusClause)(0, ref);
        var pendingClause = (0, payment_overdue_util_1.buildVendorHistoryStatusClause)(1, ref);
        expect(overdueClause).toMatchObject({
            paymentStatus: 0,
            createdDate: { $lte: expect.any(Date) },
        });
        expect(pendingClause).toMatchObject({
            $or: [
                { paymentStatus: 1 },
                {
                    paymentStatus: 0,
                    createdDate: { $gt: expect.any(Date) },
                },
            ],
        });
        expect(payment_overdue_util_1.PAYMENT_OVERDUE_DAYS).toBe(14);
    });
});
