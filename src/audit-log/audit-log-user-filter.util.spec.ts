import { Types } from 'mongoose';
import { buildAuditActorUserFilter } from './audit-log-user-filter.util';

describe('buildAuditActorUserFilter', () => {
  const userId = '507f1f77bcf86cd799439011';

  it('matches actor and performed_by user_id', () => {
    expect(buildAuditActorUserFilter(userId)).toEqual({
      $or: expect.arrayContaining([
        { 'actor.user_id': userId },
        { 'performed_by.user_id': userId },
        { 'actor.user_id': new Types.ObjectId(userId) },
        { 'performed_by.user_id': new Types.ObjectId(userId) },
        {
          $expr: {
            $or: expect.arrayContaining([
              { $eq: [{ $toString: '$actor.user_id' }, userId] },
              { $eq: [{ $toString: '$performed_by.user_id' }, userId] },
            ]),
          },
        },
      ]),
    });
  });

  it('matches vendor organization ids on actor', () => {
    const filter = buildAuditActorUserFilter(userId);
    expect(filter?.$or).toEqual(
      expect.arrayContaining([
        { 'actor.vendor_id': userId },
        { 'actor.manufacturer_id': userId },
        { 'actor.vendor_id': new Types.ObjectId(userId) },
        { 'actor.manufacturer_id': new Types.ObjectId(userId) },
      ]),
    );
  });

  it('matches performed_by name and email case-insensitively', () => {
    const filter = buildAuditActorUserFilter('Prabhas Miraki');
    expect(filter?.$or).toEqual(
      expect.arrayContaining([
        { 'performed_by.email': /^Prabhas Miraki$/i },
        { 'performed_by.name': /^Prabhas Miraki$/i },
      ]),
    );
  });

  it('returns undefined for blank input', () => {
    expect(buildAuditActorUserFilter('   ')).toBeUndefined();
  });
});
