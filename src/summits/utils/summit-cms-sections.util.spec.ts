import { BadRequestException } from '@nestjs/common';
import {
  mapAgendaFromDoc,
  mapFocusedAreasFromDoc,
  mapHighlightsFromDoc,
  normalizeAgendaSectionInput,
  normalizeEventOutcomesSection,
  normalizeFocusedAreaSection,
  normalizeHighlightsSection,
  parseAgendaHtmlToTexts,
} from './summit-cms-sections.util';
import type { SummitDocument } from '../schemas/summit.schema';

describe('summit-cms-sections.util', () => {
  describe('normalizeHighlightsSection', () => {
    it('persists up to 3 card rows with heading and description', () => {
      const result = normalizeHighlightsSection({
        highlightsTitle: 'Why Attend',
        highlights: [
          {
            heading: 'Knowledge sessions',
            description: 'Learn from industry experts and GreenPro leaders.',
          },
          {
            heading: 'Networking',
            description: 'Connect with architects, developers, and policymakers.',
          },
        ],
      });

      expect(result.title).toBe('Why Attend');
      expect(result.items).toHaveLength(2);
      expect(result.items[0].heading).toBe('Knowledge sessions');
      expect(result.items[0].description).toContain('industry experts');
    });

    it('rejects more than 3 highlights with fieldErrors', () => {
      expect(() =>
        normalizeHighlightsSection({
          highlightsTitle: 'Why Attend',
          highlights: [
            { heading: 'One', description: 'First highlight point here.' },
            { heading: 'Two', description: 'Second highlight point here.' },
            { heading: 'Three', description: 'Third highlight point here.' },
            { heading: 'Four', description: 'Fourth highlight point here.' },
          ],
        }),
      ).toThrow(BadRequestException);
    });

    it('requires heading and description on each saved row', () => {
      expect(() =>
        normalizeHighlightsSection({
          highlightsTitle: 'Why Attend',
          highlights: [{ heading: 'Only heading', description: '   ' }],
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('normalizeFocusedAreaSection', () => {
    it('persists cards with nested points', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        focusedAreas: [
          {
            heading: 'Building Materials',
            points: [
              { text: 'Cement, steel, glass and flooring products' },
              { text: 'Paints, insulation and coatings for buildings' },
            ],
          },
        ],
      });

      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].points).toHaveLength(2);
    });

    it('rejects cards with more than 3 points', () => {
      expect(() =>
        normalizeFocusedAreaSection({
          focusedAreaTitle: 'Focused Area',
          focusedAreas: [
            {
              heading: 'Building Materials',
              points: [
                { text: 'Point one with enough characters here.' },
                { text: 'Point two with enough characters here.' },
                { text: 'Point three with enough characters here.' },
                { text: 'Point four with enough characters here.' },
              ],
            },
          ],
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('normalizeAgendaSectionInput', () => {
    it('persists agenda points with heading and description', () => {
      const result = normalizeAgendaSectionInput({
        agendaTitle: "GreenPro's Core Agenda",
        agendaPoints: [
          {
            heading: 'Opening remarks',
            description: 'Welcome address for the summit attendees',
          },
          {
            heading: 'Panel discussion',
            description: 'Sustainable building materials in practice',
          },
        ],
      });

      expect(result.title).toBe("GreenPro's Core Agenda");
      expect(result.points).toHaveLength(2);
      expect(result.points[0].heading).toBe('Opening remarks');
      expect(result.points[0].description).toContain('Welcome address');
      expect(result.points[0].text).toBe(
        'Opening remarks — Welcome address for the summit attendees',
      );
    });

    it('rejects structured points missing heading or description', () => {
      expect(() =>
        normalizeAgendaSectionInput({
          agendaTitle: "GreenPro's Core Agenda",
          agendaPoints: [
            { heading: 'Opening remarks', description: '' },
          ],
        }),
      ).toThrow(BadRequestException);
    });

    it('accepts legacy text-only bullet rows without heading', () => {
      const result = normalizeAgendaSectionInput({
        agendaTitle: "GreenPro's Core Agenda",
        agendaPoints: [
          { text: 'Opening remarks and welcome address for summit' },
          { text: 'Panel discussion on sustainable building materials' },
        ],
      });

      expect(result.points).toHaveLength(2);
      expect(result.points[0].heading).toBe('');
      expect(result.points[0].description).toContain('Opening remarks');
      expect(result.points[0].text).toContain('Opening remarks');
    });

    it('parses legacy agenda HTML into bullet rows on write', () => {
      const result = normalizeAgendaSectionInput({
        agenda: {
          title: 'Legacy Agenda',
          content:
            '<ul><li>First parsed bullet point with enough text</li><li>Second parsed bullet point with enough text</li></ul>',
        },
      });

      expect(result.title).toBe('Legacy Agenda');
      expect(result.points).toHaveLength(2);
    });
  });

  describe('legacy read migration', () => {
    it('maps legacy highlight text rows to description-only cards', () => {
      const doc = {
        highlightsTitle: 'Highlights of GreenPro Summit',
        highlights: [
          {
            id: 'h1',
            sortOrder: 0,
            text: 'Legacy highlight bullet text here for migration',
          },
        ],
      } as unknown as SummitDocument;

      const rows = mapHighlightsFromDoc(doc);
      expect(rows[0].heading).toBe('');
      expect(rows[0].description).toContain('Legacy highlight');
    });

    it('maps legacy areaPoints to focused area cards', () => {
      const doc = {
        focusedAreas: [],
        areaPoints: [
          {
            id: 'p1',
            sortOrder: 0,
            text: 'Cement, steel, glass and flooring products here',
          },
        ],
      } as unknown as SummitDocument;

      const cards = mapFocusedAreasFromDoc(doc);
      expect(cards).toHaveLength(1);
      expect(cards[0].heading).toBe('');
      expect(cards[0].points[0].text).toContain('Cement');
    });

    it('maps legacy agenda HTML to agendaPoints on read', () => {
      const doc = {
        agendaTitle: 'Summit Agenda',
        agendaPoints: [],
        agenda: {
          title: 'Summit Agenda',
          content: '<p>Opening remarks and welcome address for everyone</p>',
        },
      } as unknown as SummitDocument;

      const agenda = mapAgendaFromDoc(doc);
      expect(agenda.title).toBe('Summit Agenda');
      expect(agenda.points[0].heading).toBe('');
      expect(agenda.points[0].description).toContain('Opening remarks');
      expect(agenda.points[0].text).toContain('Opening remarks');
    });

    it('maps stored agenda card rows with heading and description on read', () => {
      const doc = {
        agendaTitle: 'Summit Agenda',
        agendaPoints: [
          {
            id: 'a1',
            sortOrder: 0,
            heading: 'Opening remarks',
            description: 'Welcome address for the summit attendees',
          },
          { id: 'a2', sortOrder: 1, text: 'Legacy bullet without heading' },
        ],
      } as unknown as SummitDocument;

      const agenda = mapAgendaFromDoc(doc);
      expect(agenda.points[0].heading).toBe('Opening remarks');
      expect(agenda.points[0].text).toBe(
        'Opening remarks — Welcome address for the summit attendees',
      );
      expect(agenda.points[1].heading).toBe('');
      expect(agenda.points[1].description).toBe(
        'Legacy bullet without heading',
      );
      expect(agenda.points[1].text).toBe('Legacy bullet without heading');
    });
  });

  describe('parseAgendaHtmlToTexts', () => {
    it('prefers li tags, then p tags, then plain text', () => {
      expect(
        parseAgendaHtmlToTexts(
          '<ul><li>First item with enough characters here</li></ul>',
        ),
      ).toHaveLength(1);
      expect(
        parseAgendaHtmlToTexts(
          '<p>Paragraph one with enough characters here</p><p>Paragraph two with enough characters here</p>',
        ),
      ).toHaveLength(2);
    });
  });

  describe('normalizeEventOutcomesSection', () => {
    it('persists outcome cards with heading and description', () => {
      const result = normalizeEventOutcomesSection({
        eventOutcomesTitle: 'Event Outcomes',
        eventOutcomes: [
          {
            heading: 'Industry collaboration',
            description: 'New partnerships formed across multiple sectors.',
          },
        ],
      });

      expect(result.items[0].heading).toBe('Industry collaboration');
      expect(result.items[0].description).toContain('partnerships');
    });
  });
});
