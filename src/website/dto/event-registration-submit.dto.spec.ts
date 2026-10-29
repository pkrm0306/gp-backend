import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EventRegistrationSubmitDto } from './event-registration-submit.dto';

function buildValid(overrides: Record<string, unknown> = {}) {
  return plainToInstance(EventRegistrationSubmitDto, {
    eventSlug: 'greenpro-summit-2026',
    eventTitle: 'GreenPro Summit 2026',
    eventDate: '15 May 2026',
    eventTime: '09:00 AM',
    eventLocation: 'New Delhi',
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    organisation: 'Acme',
    attendanceMode: 'in-person',
    participantRole: 'Manufacturer',
    consent: true,
    sourcePath: '/event/greenpro-summit-2026',
    ...overrides,
  });
}

describe('EventRegistrationSubmitDto', () => {
  it('accepts a valid payload', async () => {
    const errors = await validate(buildValid());
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid phone format', async () => {
    const errors = await validate(buildValid({ phone: '9876543210' }));
    expect(errors.some((e) => e.property === 'phone')).toBe(true);
  });

  it('rejects consent false', async () => {
    const errors = await validate(buildValid({ consent: false }));
    expect(errors.some((e) => e.property === 'consent')).toBe(true);
  });

  it('rejects unknown participantRole', async () => {
    const errors = await validate(
      buildValid({ participantRole: 'Vendor' }),
    );
    expect(errors.some((e) => e.property === 'participantRole')).toBe(true);
  });

  it('parses comma-separated sessionsOfInterest', async () => {
    const dto = buildValid({
      sessionsOfInterest: 'Low carbon materials, Green public procurement',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.sessionsOfInterest).toEqual([
      'Low carbon materials',
      'Green public procurement',
    ]);
  });
});
