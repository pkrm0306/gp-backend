import { BadRequestException } from '@nestjs/common';
import {
  mapEventBrochuresFromDoc,
  normalizeEventBrochuresInput,
  primaryEventBrochureLink,
} from './event-brochures.util';

describe('event-brochures.util', () => {
  it('normalizes valid brochure rows', () => {
    expect(
      normalizeEventBrochuresInput([
        { heading: 'Main brochure', link: 'https://example.com/a.pdf' },
      ]),
    ).toEqual([
      { heading: 'Main brochure', link: 'https://example.com/a.pdf' },
    ]);
  });

  it('parses JSON string brochures from multipart forms', () => {
    expect(
      normalizeEventBrochuresInput(
        JSON.stringify([
          { heading: 'Brochure 1', link: 'https://example.com/1.pdf' },
        ]),
      ),
    ).toEqual([{ heading: 'Brochure 1', link: 'https://example.com/1.pdf' }]);
  });

  it('throws field errors when heading or link is missing', () => {
    try {
      normalizeEventBrochuresInput([{ heading: 'Only heading' }]);
      throw new Error('expected validation error');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as {
        fieldErrors: Record<string, string>;
      };
      expect(response.fieldErrors['brochures[0].link']).toBe(
        'Brochure link is required.',
      );
    }
  });

  it('migrates legacy brochureLink on read', () => {
    expect(
      mapEventBrochuresFromDoc({
        brochureLink: 'https://example.com/legacy.pdf',
      }),
    ).toEqual([
      { heading: 'Brochure', link: 'https://example.com/legacy.pdf' },
    ]);
  });

  it('returns primary brochure link from array', () => {
    expect(
      primaryEventBrochureLink([
        { heading: 'A', link: 'https://example.com/a.pdf' },
      ]),
    ).toBe('https://example.com/a.pdf');
  });
});
