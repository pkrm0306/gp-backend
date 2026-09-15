import { resolveRenewalActivityState, RENEWAL_ACTIVITY_UI } from '../constants/renewal-activity-state.constants';

describe('resolveRenewalActivityState', () => {
  it('TEST 1 — cycle started, no payment: Completed=cycle started, Current=payment generation pending', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 12,
      paymentStatus: null,
    });
    expect(s.phase).toBe('cycle_started_no_payment');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.CYCLE_STARTED);
    expect(s.completed?.status).toBe(1);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_GENERATION_PENDING);
    expect(s.current?.status).toBe(0);
    expect(s.current?.responsibility).toBe('Admin');
    expect(s.current?.activity).not.toBe(RENEWAL_ACTIVITY_UI.CYCLE_STARTED);
  });

  it('TEST 2 — payment generated unpaid', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 12,
      paymentStatus: 0,
    });
    expect(s.phase).toBe('payment_generated_unpaid');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_GENERATED);
    expect(s.completed?.status).toBe(1);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_PENDING);
    expect(s.current?.responsibility).toBe('Manufacturer');
    expect(s.current?.status).toBe(0);
  });

  it('TEST 3 — manufacturer has not paid (same as generated unpaid)', () => {
    const s = resolveRenewalActivityState({ urnStatus: 12, paymentStatus: 0 });
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_PENDING);
    expect(s.current?.responsibility).toBe('Manufacturer');
  });

  it('TEST 4 — manufacturer submitted payment → verification Current', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 13,
      paymentStatus: 1,
    });
    expect(s.phase).toBe('payment_submitted');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_SUBMITTED);
    expect(s.completed?.status).toBe(1);
    expect(s.completed?.responsibility).toBe('Manufacturer');
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION);
    expect(s.current?.status).toBe(0);
    expect(s.current?.responsibility).toBe('Admin');
    expect(s.current?.activity).not.toMatch(/submitted/i);
  });

  it('TEST 4b — paymentStatus=1 wins even if urnStatus still 12', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 12,
      paymentStatus: 1,
    });
    expect(s.phase).toBe('payment_submitted');
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION);
  });

  it('TEST 5 — admin approves payment → forms Current', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 14,
      paymentStatus: 2,
    });
    expect(s.phase).toBe('payment_approved_forms');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.PAYMENT_APPROVED);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.FORMS_IN_PROGRESS);
    expect(s.current?.responsibility).toBe('Manufacturer');
  });

  it('TEST 6 — vendor submitted forms → admin review Current', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 15,
      paymentStatus: 2,
    });
    expect(s.phase).toBe('forms_under_review');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.FORMS_SUBMITTED);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.ADMIN_REVIEW);
    expect(s.current?.responsibility).toBe('Admin');
  });

  it('TEST 7 — admin resend → vendor revision Current', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 16,
      paymentStatus: 2,
    });
    expect(s.phase).toBe('vendor_revision');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.FORMS_SENT_BACK);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.VENDOR_REVISION);
    expect(s.current?.responsibility).toBe('Manufacturer');
  });

  it('TEST 8 — vendor resubmits (back to 15) → admin review Current', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 15,
      paymentStatus: 2,
    });
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.ADMIN_REVIEW);
  });

  it('TEST 9 — final verification', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 17,
      paymentStatus: 2,
    });
    expect(s.phase).toBe('final_verification');
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.FINAL_VERIFICATION);
    expect(s.current?.status).toBe(0);
    expect(s.current?.responsibility).toBe('Admin');
  });

  it('TEST 10 — renewal completed', () => {
    const s = resolveRenewalActivityState({
      urnStatus: 11,
      paymentStatus: 2,
      productRenewStatus: 2,
    });
    expect(s.phase).toBe('renewal_completed');
    expect(s.completed?.activity).toBe(RENEWAL_ACTIVITY_UI.RENEWAL_COMPLETED);
    expect(s.completed?.status).toBe(1);
    expect(s.current?.status).toBe(1);
    expect(s.current?.activity).toBe(RENEWAL_ACTIVITY_UI.CERTIFICATE_PUBLISHED);
  });

  it('does not leave cycle started as Current Pending after fee exists', () => {
    const s = resolveRenewalActivityState({ urnStatus: 12, paymentStatus: 0 });
    expect(s.current?.activity).not.toMatch(/cycle started/i);
  });
});
