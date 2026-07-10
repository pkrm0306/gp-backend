import {
  PAYMENT_OVERDUE_DAYS,
  buildVendorHistoryStatusClause,
  isPaymentOverdue,
  parsePaymentCreatedDate,
  resolveVendorDisplayPaymentStatus,
} from './payment-overdue.util';

describe('payment-overdue.util', () => {
  const ref = new Date(2026, 6, 10); // 10 Jul 2026

  it('parses ISO and dd-mm-yyyy created dates', () => {
    expect(parsePaymentCreatedDate('2026-06-26T10:00:00.000Z')?.getFullYear()).toBe(
      2026,
    );
    expect(parsePaymentCreatedDate('26-06-2026')?.getDate()).toBe(26);
    expect(parsePaymentCreatedDate('')).toBeNull();
  });

  it('treats status 0 as pending before 14 calendar days', () => {
    const created = new Date(2026, 6, 1); // 1 Jul 2026 — 9 days before ref
    expect(isPaymentOverdue(0, created, ref)).toBe(false);
    expect(resolveVendorDisplayPaymentStatus(0, created, ref)).toBe(1);
  });

  it('treats status 0 as overdue on the 14th calendar day', () => {
    const created = new Date(2026, 5, 26); // 26 Jun 2026 — 14 days before ref
    expect(isPaymentOverdue(0, created, ref)).toBe(true);
    expect(resolveVendorDisplayPaymentStatus(0, created, ref)).toBe(0);
  });

  it('does not mark non-created statuses as overdue', () => {
    const created = new Date(2026, 0, 1);
    expect(isPaymentOverdue(1, created, ref)).toBe(false);
    expect(resolveVendorDisplayPaymentStatus(1, created, ref)).toBe(1);
    expect(resolveVendorDisplayPaymentStatus(2, created, ref)).toBe(2);
    expect(resolveVendorDisplayPaymentStatus(3, created, ref)).toBe(3);
  });

  it('builds vendor history status clauses for pending and overdue', () => {
    const overdueClause = buildVendorHistoryStatusClause(0, ref);
    const pendingClause = buildVendorHistoryStatusClause(1, ref);

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
    expect(PAYMENT_OVERDUE_DAYS).toBe(14);
  });
});
