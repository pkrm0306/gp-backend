import {
  buildTdsFileMetadata,
  enrichPaymentByUrnResponse,
  formatPaymentRecordsForUrnDetails,
  isPaymentSubmissionStageActive,
  isVendorPaymentProofEditable,
  maskPaymentSubmissionFields,
  PAYMENT_REFERENCE_UNIQUE_MESSAGE,
  PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
  resolvePaymentSubmissionStatus,
} from './payment-response.util';

describe('payment-response.util', () => {
  it('maps paymentStatus to submissionStatus values', () => {
    expect(resolvePaymentSubmissionStatus(0).submissionStatus).toBe('draft');
    expect(resolvePaymentSubmissionStatus(1).submissionStatus).toBe('submitted');
    expect(resolvePaymentSubmissionStatus(2).submissionStatus).toBe('approved');
    expect(resolvePaymentSubmissionStatus(3).submissionStatus).toBe('rejected');
  });

  it('builds TDS file metadata from stored file path', () => {
    expect(
      buildTdsFileMetadata('/uploads/payments/supporting-doc.pdf'),
    ).toMatchObject({
      storedName: 'supporting-doc.pdf',
      filePath: '/uploads/payments/supporting-doc.pdf',
    });
  });

  it('enriches payment by URN response with required vendor form fields', () => {
    const response = enrichPaymentByUrnResponse({
      urnNo: 'URN-1',
      paymentType: 'registration',
      vendorProposalApprovalStatus: 1,
      paymentStatus: 1,
      paymentReferenceNo: 'REF123',
      tdsFile: '/uploads/payments/supporting-doc.pdf',
      proposalFile: '/uploads/payments/proposal.pdf',
    });

    expect(response).toMatchObject({
      referenceNumberMustBeUnique: true,
      reference_number_must_be_unique: true,
      referenceNumberUniqueMessage: PAYMENT_REFERENCE_UNIQUE_MESSAGE,
      submissionStatus: 'submitted',
      submission_status: 'submitted',
      paymentProofEditable: false,
      payment_proof_editable: false,
      paymentProofLockMessage: PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
      tdsFileMetadata: {
        storedName: 'supporting-doc.pdf',
        filePath: '/uploads/payments/supporting-doc.pdf',
      },
      tds_file_metadata: {
        storedName: 'supporting-doc.pdf',
        filePath: '/uploads/payments/supporting-doc.pdf',
      },
    });
  });

  it('keeps registration payment stage inactive until proposal is approved', () => {
    expect(
      isPaymentSubmissionStageActive({
        paymentType: 'registration',
        vendorProposalApprovalStatus: 0,
        paymentStatus: 0,
        proposalFile: '/uploads/payments/proposal.pdf',
      }),
    ).toBe(false);
    expect(
      isPaymentSubmissionStageActive({
        paymentType: 'registration',
        vendorProposalApprovalStatus: 2,
        paymentStatus: 0,
        proposalFile: '/uploads/payments/proposal.pdf',
      }),
    ).toBe(false);
    expect(
      isPaymentSubmissionStageActive({
        paymentType: 'registration',
        vendorProposalApprovalStatus: 1,
        paymentStatus: 0,
        proposalFile: '/uploads/payments/proposal.pdf',
      }),
    ).toBe(true);
  });

  it('masks payment submission fields for URN details before payment stage', () => {
    const masked = maskPaymentSubmissionFields({
      paymentType: 'registration',
      vendorProposalApprovalStatus: 0,
      paymentStatus: 0,
      paymentMode: 'neft_or_rtgs',
      paymentReferenceNo: 'REF123',
      tdsFile: '/uploads/payments/supporting-doc.pdf',
      quoteTotal: 10800,
      proposalFile: '/uploads/payments/proposal.pdf',
    });

    expect(masked).toMatchObject({
      paymentStageActive: false,
      payment_stage_active: false,
      paymentMode: null,
      paymentReferenceNo: null,
      tdsFile: null,
      quoteTotal: 10800,
      proposalFile: '/uploads/payments/proposal.pdf',
    });
  });

  it('keeps payment submission fields visible after vendor submits payment', () => {
    const visible = formatPaymentRecordsForUrnDetails([
      {
        paymentType: 'registration',
        vendorProposalApprovalStatus: 1,
        paymentStatus: 1,
        paymentMode: 'neft_or_rtgs',
        paymentReferenceNo: 'REF123',
        tdsFile: '/uploads/payments/supporting-doc.pdf',
      },
    ]);

    expect(visible[0]).toMatchObject({
      paymentStageActive: true,
      paymentMode: 'neft_or_rtgs',
      paymentReferenceNo: 'REF123',
      tdsFile: '/uploads/payments/supporting-doc.pdf',
      paymentProofEditable: false,
      paymentProofLockMessage: PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
    });
  });

  it('marks draft payment proof as editable after proposal approval', () => {
    expect(
      isVendorPaymentProofEditable({
        paymentType: 'registration',
        paymentStatus: 0,
        vendorProposalApprovalStatus: 1,
      }),
    ).toBe(true);
    expect(
      isVendorPaymentProofEditable({
        paymentType: 'registration',
        paymentStatus: 0,
        vendorProposalApprovalStatus: 0,
      }),
    ).toBe(false);
    expect(
      isVendorPaymentProofEditable({
        paymentType: 'registration',
        paymentStatus: 1,
        vendorProposalApprovalStatus: 1,
      }),
    ).toBe(false);
    expect(
      isVendorPaymentProofEditable({
        paymentType: 'registration',
        paymentStatus: 3,
        vendorProposalApprovalStatus: 1,
      }),
    ).toBe(true);
  });
});
