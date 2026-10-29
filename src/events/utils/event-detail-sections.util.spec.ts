import {
  EVENT_WHO_SHOULD_ATTEND_ITEM_MAX,
  computeEventDayCount,
  mapEventFormatFromDoc,
  normalizeEventFormatInput,
  normalizeKeyThemesInput,
  normalizeProgrammeAtAGlanceInput,
  normalizeVenueAndTravelInput,
  normalizeWhoShouldAttendInput,
  normalizeEventTagsInput,
  pickFormArrayField,
} from './event-detail-sections.util';

describe('event detail sections normalize', () => {
  it('computes inclusive day count from start/end', () => {
    expect(
      computeEventDayCount(
        new Date('2026-04-08T00:00:00.000Z'),
        new Date('2026-04-08T00:00:00.000Z'),
      ),
    ).toBe(1);
    expect(
      computeEventDayCount(
        new Date('2026-04-08T00:00:00.000Z'),
        new Date('2026-04-10T00:00:00.000Z'),
      ),
    ).toBe(3);
  });

  it('accepts whoShouldAttend / keyThemes / tags arrays', () => {
    expect(normalizeWhoShouldAttendInput(['Architects'])).toEqual([
      'Architects',
    ]);
    expect(
      normalizeKeyThemesInput([
        {
          heading: 'Net-zero materials',
          description: 'Pathways to lower embodied carbon.',
        },
      ]),
    ).toEqual([
      {
        heading: 'Net-zero materials',
        description: 'Pathways to lower embodied carbon.',
      },
    ]);
    expect(normalizeEventTagsInput(['Summit', 'Eco-labels'])).toEqual([
      'Summit',
      'Eco-labels',
    ]);
  });

  it('normalizes format multiselect (inperson / online)', () => {
    expect(normalizeEventFormatInput(['inperson', 'online'])).toEqual([
      'inperson',
      'online',
    ]);
    expect(normalizeEventFormatInput('["inperson"]')).toEqual(['inperson']);
    expect(normalizeEventFormatInput('in-person,online')).toEqual([
      'inperson',
      'online',
    ]);
    expect(normalizeEventFormatInput(undefined)).toBeUndefined();
    expect(mapEventFormatFromDoc({ format: ['online', 'inperson'] })).toEqual([
      'online',
      'inperson',
    ]);
  });

  it('requires heading and description for key themes', () => {
    expect(() =>
      normalizeKeyThemesInput([{ heading: 'Net-zero materials' }]),
    ).toThrow();
    expect(() =>
      normalizeKeyThemesInput([
        { description: 'Pathways to lower embodied carbon.' },
      ]),
    ).toThrow();
  });

  it('enforces max length on whoShouldAttend items', () => {
    expect(() =>
      normalizeWhoShouldAttendInput([
        'x'.repeat(EVENT_WHO_SHOULD_ATTEND_ITEM_MAX + 1),
      ]),
    ).toThrow();
  });

  it('requires time and description for programme rows', () => {
    expect(
      normalizeProgrammeAtAGlanceInput([
        { time: '09:00 AM', description: 'Registration and welcome' },
      ]),
    ).toEqual([
      { day: 1, time: '09:00 AM', description: 'Registration and welcome' },
    ]);
    expect(() =>
      normalizeProgrammeAtAGlanceInput([{ time: '09:00 AM' }]),
    ).toThrow();
  });

  it('allows any number of programme entries including multiple per day', () => {
    expect(
      normalizeProgrammeAtAGlanceInput([
        { time: '09:00 AM', description: 'Day 1 only' },
      ]),
    ).toEqual([
      { day: 1, time: '09:00 AM', description: 'Day 1 only' },
    ]);

    expect(
      normalizeProgrammeAtAGlanceInput([
        { day: 1, time: '09:00 AM', description: 'Registration' },
        { day: 1, time: '10:00 AM', description: 'Keynote' },
        { day: 2, time: '09:30 AM', description: 'Workshops' },
      ]),
    ).toEqual([
      { day: 1, time: '09:00 AM', description: 'Registration' },
      { day: 1, time: '10:00 AM', description: 'Keynote' },
      { day: 2, time: '09:30 AM', description: 'Workshops' },
    ]);
  });

  it('expands nested day/items wrappers so multi-day slots are not dropped', () => {
    expect(
      normalizeProgrammeAtAGlanceInput([
        {
          day: 1,
          date: '2026-04-10',
          items: [
            { time: '09:00', description: 'Open' },
            { time: '11:00', description: 'Panel' },
          ],
        },
        {
          day: 2,
          date: '2026-04-11',
          items: [{ time: '10:00', description: 'Workshop' }],
        },
        {
          day: 3,
          items: [{ time: '14:00', description: 'Closing' }],
        },
      ]),
    ).toEqual([
      {
        day: 1,
        date: '2026-04-10',
        time: '09:00',
        description: 'Open',
      },
      {
        day: 1,
        date: '2026-04-10',
        time: '11:00',
        description: 'Panel',
      },
      {
        day: 2,
        date: '2026-04-11',
        time: '10:00',
        description: 'Workshop',
      },
      { day: 3, time: '14:00', description: 'Closing' },
    ]);
  });

  it('keeps flat multi-day slots with string day numbers', () => {
    expect(
      normalizeProgrammeAtAGlanceInput([
        { day: '1', time: '09:00', description: 'Open', date: '2026-04-10' },
        { day: '2', time: '10:00', description: 'Workshop', date: '2026-04-11' },
      ]),
    ).toEqual([
      {
        day: 1,
        date: '2026-04-10',
        time: '09:00',
        description: 'Open',
      },
      {
        day: 2,
        date: '2026-04-11',
        time: '10:00',
        description: 'Workshop',
      },
    ]);
  });

  it('accepts multipart numeric-keyed programme objects', () => {
    expect(
      normalizeProgrammeAtAGlanceInput({
        '0': { time: '09:00 AM', description: 'Registration and welcome' },
      }),
    ).toEqual([
      { day: 1, time: '09:00 AM', description: 'Registration and welcome' },
    ]);
  });

  it('picks programme from flat bracket multipart keys', () => {
    const raw = pickFormArrayField(
      {
        'programmeAtAGlance[0][time]': '09:00 AM',
        'programmeAtAGlance[0][description]': 'Registration and welcome',
      },
      ['programmeAtAGlance', 'programAtAGlance'],
    );
    expect(normalizeProgrammeAtAGlanceInput(raw)).toEqual([
      { day: 1, time: '09:00 AM', description: 'Registration and welcome' },
    ]);
  });

  it('normalizes venueAndTravel text', () => {
    expect(normalizeVenueAndTravelInput('  Nearest metro: Park Street  ')).toBe(
      'Nearest metro: Park Street',
    );
    expect(normalizeVenueAndTravelInput(undefined)).toBeUndefined();
  });

  it('parses JSON string payloads from multipart', () => {
    expect(normalizeEventTagsInput('["Summit","Building materials"]')).toEqual([
      'Summit',
      'Building materials',
    ]);
  });

  it('returns undefined when field omitted', () => {
    expect(normalizeWhoShouldAttendInput(undefined)).toBeUndefined();
    expect(normalizeProgrammeAtAGlanceInput(undefined)).toBeUndefined();
  });
});
