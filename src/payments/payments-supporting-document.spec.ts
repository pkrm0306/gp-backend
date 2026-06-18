import { BadRequestException } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE,
  PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
} from './payment-response.util';

describe('Payments supporting document validation', () => {
  function serviceHarness() {
    return Object.create(PaymentsService.prototype) as {
      validateSupportingDocumentForPaymentSubmission: (params: {
        dto: { paymentStatus?: number; paymentMode?: string };
        existingPayment: { tdsFile?: string };
        tdsFile?: Express.Multer.File;
        actorRole?: string;
        vendorProofUpdate: boolean;
      }) => void;
      validateVendorPaymentProofMutationAllowed: (params: {
        existingPayment: {
          paymentStatus?: number;
          paymentType?: string;
          vendorProposalApprovalStatus?: number;
        };
        updatePaymentDto: {
          paymentStatus?: number;
          paymentMode?: string;
          paymentReferenceNo?: string;
        };
        vendorProofUpdate: boolean;
      }) => void;
      normalizePaymentReferenceNo: (value?: string) => string | undefined;
    };
  }

  function file(name = 'supporting.pdf'): Express.Multer.File {
    return {
      originalname: name,
      size: 128,
      buffer: Buffer.from('file'),
    } as Express.Multer.File;
  }

  it('rejects vendor payment submission when Supporting Document is missing', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateSupportingDocumentForPaymentSubmission({
        dto: { paymentStatus: 1 },
        existingPayment: {},
        actorRole: 'vendor',
        vendorProofUpdate: false,
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      service.validateSupportingDocumentForPaymentSubmission({
        dto: { paymentStatus: 1 },
        existingPayment: {},
        actorRole: 'vendor',
        vendorProofUpdate: false,
      }),
    ).toThrow('Supporting Document is required.');
  });

  it('allows vendor payment submission when Supporting Document is uploaded', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateSupportingDocumentForPaymentSubmission({
        dto: { paymentStatus: 1 },
        existingPayment: {},
        tdsFile: file(),
        actorRole: 'vendor',
        vendorProofUpdate: false,
      }),
    ).not.toThrow();
  });

  it('allows resubmission when Supporting Document already exists on payment', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateSupportingDocumentForPaymentSubmission({
        dto: { paymentStatus: 1 },
        existingPayment: { tdsFile: '/uploads/payments/supporting.pdf' },
        actorRole: 'vendor',
        vendorProofUpdate: false,
      }),
    ).not.toThrow();
  });

  it('does not require Supporting Document for admin proposal uploads', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateSupportingDocumentForPaymentSubmission({
        dto: { paymentStatus: 0 },
        existingPayment: {},
        actorRole: 'admin',
        vendorProofUpdate: true,
      }),
    ).not.toThrow();
  });

  it('passes supporting_document API upload as the stored supporting file argument', async () => {
    const updatePaymentDetailsByUrn = jest
      .fn()
      .mockResolvedValue({ paymentStatus: 1 });
    const controller = new PaymentsController({
      updatePaymentDetailsByUrn,
    } as unknown as PaymentsService);
    const supportingDocument = file();

    const response = await controller.updatePayment(
      { manufacturerId: 'vendor-1', role: 'vendor' },
      'URN-1',
      {
        paymentStatus: '1',
        paymentMode: 'neft_or_rtgs',
        paymentReferenceNo: 'REF-1',
      },
      undefined,
      undefined,
      {
        supporting_document: [supportingDocument],
      },
    );

    expect(updatePaymentDetailsByUrn).toHaveBeenCalledWith(
      'URN-1',
      expect.objectContaining({
        paymentStatus: 1,
        paymentMode: 'neft_or_rtgs',
        paymentReferenceNo: 'REF-1',
      }),
      'vendor-1',
      undefined,
      supportingDocument,
      undefined,
      'vendor',
    );
    expect(response).toEqual({
      success: true,
      message: 'Payment updated successfully',
      data: { paymentStatus: 1 },
    });
  });

  it('accepts alphanumeric Transaction Reference Number values', () => {
    const service = serviceHarness();

    expect(service.normalizePaymentReferenceNo(' REF123456ABC ')).toBe(
      'REF123456ABC',
    );
  });

  it('rejects Transaction Reference Number with non-alphanumeric characters', () => {
    const service = serviceHarness();

    expect(() => service.normalizePaymentReferenceNo('REF-123')).toThrow(
      BadRequestException,
    );
    expect(() => service.normalizePaymentReferenceNo('REF-123')).toThrow(
      'Transaction Reference Number must be alphanumeric',
    );
  });

  it('rejects Transaction Reference Number beyond existing length constraints', () => {
    const service = serviceHarness();

    expect(() => service.normalizePaymentReferenceNo('A'.repeat(51))).toThrow(
      'Transaction Reference Number must not exceed 50 characters',
    );
  });
});

describe('Payments submitted proposal lock validation', () => {
  function serviceHarness() {
    return Object.create(PaymentsService.prototype) as {
      validateVendorPaymentProofMutationAllowed: (params: {
        existingPayment: {
          paymentStatus?: number;
          paymentType?: string;
          vendorProposalApprovalStatus?: number;
        };
        updatePaymentDto: {
          paymentStatus?: number;
          paymentMode?: string;
          paymentReferenceNo?: string;
        };
        vendorProofUpdate: boolean;
      }) => void;
    };
  }

  it('allows draft payment proof edits before submission', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateVendorPaymentProofMutationAllowed({
        existingPayment: {
          paymentType: 'registration',
          paymentStatus: 0,
          vendorProposalApprovalStatus: 1,
        },
        updatePaymentDto: { paymentMode: 'neft_or_rtgs' },
        vendorProofUpdate: true,
      }),
    ).not.toThrow();
  });

  it('rejects updates after vendor submits payment proof', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateVendorPaymentProofMutationAllowed({
        existingPayment: {
          paymentType: 'registration',
          paymentStatus: 1,
          vendorProposalApprovalStatus: 1,
        },
        updatePaymentDto: { paymentReferenceNo: 'NEWREF' },
        vendorProofUpdate: true,
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      service.validateVendorPaymentProofMutationAllowed({
        existingPayment: {
          paymentType: 'registration',
          paymentStatus: 1,
          vendorProposalApprovalStatus: 1,
        },
        updatePaymentDto: { paymentReferenceNo: 'NEWREF' },
        vendorProofUpdate: true,
      }),
    ).toThrow(PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE);
  });

  it('rejects updates after payment approval', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateVendorPaymentProofMutationAllowed({
        existingPayment: {
          paymentType: 'registration',
          paymentStatus: 2,
          vendorProposalApprovalStatus: 1,
        },
        updatePaymentDto: {},
        vendorProofUpdate: true,
      }),
    ).toThrow(PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE);
  });

  it('allows resubmission after admin payment rejection', () => {
    const service = serviceHarness();

    expect(() =>
      service.validateVendorPaymentProofMutationAllowed({
        existingPayment: {
          paymentType: 'registration',
          paymentStatus: 3,
          vendorProposalApprovalStatus: 1,
        },
        updatePaymentDto: { paymentStatus: 1, paymentMode: 'neft_or_rtgs' },
        vendorProofUpdate: true,
      }),
    ).not.toThrow();
  });
});
