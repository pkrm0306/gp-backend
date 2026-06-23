import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaymentsService } from './payments.service';
import { PAYMENT_REFERENCE_UNIQUE_MESSAGE } from './payment-response.util';

describe('PaymentsService payment reference uniqueness', () => {
  type ServiceHarness = {
    assertPaymentReferenceNoUnique: (
      paymentReferenceNo: string,
      excludePaymentId?: Types.ObjectId,
    ) => Promise<void>;
    paymentDetailsModel: { findOne: jest.Mock };
  };

  function serviceWithFindOneResult(result: unknown) {
    const exec = jest.fn().mockResolvedValue(result);
    const lean = jest.fn().mockReturnValue({ exec });
    const session = jest.fn().mockReturnValue({ select: () => ({ lean }) });
    const select = jest.fn().mockReturnValue({ lean, session });
    const findOne = jest.fn().mockReturnValue({ select, session });

    const service = Object.create(
      PaymentsService.prototype,
    ) as ServiceHarness;
    service.paymentDetailsModel = { findOne };

    return { service, findOne, exec, select };
  }

  it('rejects duplicate payment reference numbers across records', async () => {
    const { service } = serviceWithFindOneResult({ _id: new Types.ObjectId() });

    await expect(
      service.assertPaymentReferenceNoUnique('REF123ABC'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.assertPaymentReferenceNoUnique('REF123ABC'),
    ).rejects.toThrow(PAYMENT_REFERENCE_UNIQUE_MESSAGE);
  });

  it('allows the same payment reference on the excluded payment record', async () => {
    const paymentId = new Types.ObjectId();
    const { service } = serviceWithFindOneResult(null);

    await expect(
      service.assertPaymentReferenceNoUnique('REF123ABC', paymentId),
    ).resolves.toBeUndefined();
  });

  it('queries payment_details with a case-insensitive exact match', async () => {
    const { service, findOne, select } = serviceWithFindOneResult(null);

    await service.assertPaymentReferenceNoUnique('Ref123ABC');

    expect(findOne).toHaveBeenCalledWith({
      paymentReferenceNo: { $regex: '^Ref123ABC$', $options: 'i' },
    });
    expect(select).toHaveBeenCalledWith('_id');
  });

  it('escapes regex characters in payment reference numbers', async () => {
    const { service, findOne } = serviceWithFindOneResult(null);

    await service.assertPaymentReferenceNoUnique('REF.123');

    expect(findOne).toHaveBeenCalledWith({
      paymentReferenceNo: { $regex: '^REF\\.123$', $options: 'i' },
    });
  });
});
