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

    it('drops incomplete draft highlight cards instead of failing', () => {
      const result = normalizeHighlightsSection({
        highlightsTitle: 'Why Attend',
        highlights: [
          {
            id: '98f69cb9-aed7-45ff-a0cc-7b644a531de1',
            heading: 'Only heading',
            description: '   ',
          },
          {
            heading: '',
            description: '',
          },
        ],
      });

      expect(result.items).toHaveLength(0);
    });

    it('keeps complete highlights and drops empty placeholders in the same payload', () => {
      const result = normalizeHighlightsSection({
        highlightsTitle: 'Why Attend',
        highlights: [
          {
            heading: 'Knowledge sessions',
            description: 'Learn from industry experts and GreenPro leaders.',
          },
          {
            id: 'draft-empty',
            heading: '',
            description: '',
          },
        ],
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].heading).toBe('Knowledge sessions');
    });

    it('accepts API round-trip payloads that only send combined text', () => {
      const result = normalizeHighlightsSection({
        highlightsTitle: 'Why Attend',
        highlights: [
          {
            id: '650b2c41-c0d5-4331-a58e-56de49fb1f4f',
            heading: 'Knowledge sessions',
            text: 'Knowledge sessions — Learn from industry experts and GreenPro leaders across sectors.',
          },
        ],
      });

      expect(result.items[0].heading).toBe('Knowledge sessions');
      expect(result.items[0].description).toContain('industry experts');
      expect(result.items[0].description.length).toBeLessThanOrEqual(75);
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

    it('accepts focus points sent with heading instead of text', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        focusedAreas: [
          {
            heading: 'Building Materials',
            points: [
              {
                id: '6a4f8af52be5dc79ec2a405d',
                heading: 'Cement, steel, glass and flooring products',
              },
            ],
          },
        ],
      });

      expect(result.cards[0].points[0].text).toContain('Cement');
    });

    it('merges legacy items strings when points have empty text', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        focusedAreas: [
          {
            heading: 'Building Materials',
            items: ['Cement, steel, glass and flooring products'],
            points: [{ id: '6a4f8af52be5dc79ec2a405d', text: '' }],
          },
        ],
      });

      expect(result.cards[0].points[0].text).toContain('Cement');
    });

    it('accepts topic cards sent under areaPoints with nested points', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        areaPoints: [
          {
            id: 'card-1',
            heading: 'Building Materials',
            points: [
              'Cement, steel, glass and flooring products',
              'Paints, insulation and coatings for buildings',
            ],
          },
        ],
      });

      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].heading).toBe('Building Materials');
      expect(result.cards[0].points).toHaveLength(2);
      expect(result.cards[0].points[0].text).toContain('Cement');
      expect(result.cards[0].points[1].text).toContain('Paints');
    });

    it('accepts legacy areaPoints with heading and description', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        areaPoints: [
          {
            heading: 'Building Materials',
            description: 'Cement, steel, glass and flooring products',
          },
        ],
      });

      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].heading).toBe('Building Materials');
      expect(result.cards[0].points[0].text).toContain('Cement');
    });

    it('regroups flat areaPoints from API into topic cards', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        areaPoints: [
          { id: 'p1', sortOrder: 0, text: 'Cement, steel, glass and flooring products' },
          { id: 'p2', sortOrder: 1, text: 'Paints, insulation and coatings for buildings' },
          { id: 'p3', sortOrder: 2, text: 'Sustainable aggregates and wall materials' },
          { id: 'p4', sortOrder: 10, text: 'Water-efficient fixtures and fittings for projects' },
          { id: 'p5', sortOrder: 11, text: 'Rainwater harvesting and greywater systems' },
          { id: 'p6', sortOrder: 12, text: 'Wastewater treatment and reuse technologies' },
          { id: 'p7', sortOrder: 20, text: 'Solar panels and renewable energy integration' },
          { id: 'p8', sortOrder: 21, text: 'Energy-efficient HVAC and lighting systems' },
          { id: 'p9', sortOrder: 22, text: 'Smart building automation and monitoring tools' },
        ],
      });

      expect(result.cards).toHaveLength(3);
      expect(result.cards[0].points).toHaveLength(3);
      expect(result.cards[1].points).toHaveLength(3);
      expect(result.cards[2].points).toHaveLength(3);
    });

    it('drops empty nested points when card items provide text', () => {
      const result = normalizeFocusedAreaSection({
        focusedAreaTitle: 'Focused Area',
        focusedAreas: [
          {
            heading: 'Building Materials',
            items: ['Cement, steel, glass and flooring products'],
            points: [{ id: '6a4fa4cd88731a032a90cc51', text: '' }],
          },
        ],
      });

      expect(result.cards[0].points[0].text).toContain('Cement');
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

    it('drops incomplete draft agenda points instead of failing', () => {
      const result = normalizeAgendaSectionInput({
        agendaTitle: "GreenPro's Core Agenda",
        agendaPoints: [
          { heading: 'Opening remarks', description: '' },
          { heading: '', description: '' },
        ],
      });

      expect(result.points).toHaveLength(0);
    });

    it('accepts agenda points posted as a top-level agenda array', () => {
      const result = normalizeAgendaSectionInput({
        agendaTitle: "GreenPro's Core Agenda",
        agenda: [
          { id: 'a1', text: 'Opening remarks and welcome address for summit' },
          { id: 'a2', text: 'Panel discussion on sustainable building materials' },
        ],
      });

      expect(result.points).toHaveLength(2);
      expect(result.points[0].description).toContain('Opening remarks');
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
