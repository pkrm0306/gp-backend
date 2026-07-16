"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var event_brochures_util_1 = require("./event-brochures.util");
describe('event-brochures.util', function () {
    it('normalizes valid brochure rows', function () {
        expect((0, event_brochures_util_1.normalizeEventBrochuresInput)([
            { heading: 'Main brochure', link: 'https://example.com/a.pdf' },
        ])).toEqual([
            { heading: 'Main brochure', link: 'https://example.com/a.pdf' },
        ]);
    });
    it('parses JSON string brochures from multipart forms', function () {
        expect((0, event_brochures_util_1.normalizeEventBrochuresInput)(JSON.stringify([
            { heading: 'Brochure 1', link: 'https://example.com/1.pdf' },
        ]))).toEqual([{ heading: 'Brochure 1', link: 'https://example.com/1.pdf' }]);
    });
    it('throws field errors when heading or link is missing', function () {
        try {
            (0, event_brochures_util_1.normalizeEventBrochuresInput)([{ heading: 'Only heading' }]);
            throw new Error('expected validation error');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.BadRequestException);
            var response = error.getResponse();
            expect(response.fieldErrors['brochures[0].link']).toBe('Brochure link is required.');
        }
    });
    it('migrates legacy brochureLink on read', function () {
        expect((0, event_brochures_util_1.mapEventBrochuresFromDoc)({
            brochureLink: 'https://example.com/legacy.pdf',
        })).toEqual([
            { heading: 'Brochure', link: 'https://example.com/legacy.pdf' },
        ]);
    });
    it('returns primary brochure link from array', function () {
        expect((0, event_brochures_util_1.primaryEventBrochureLink)([
            { heading: 'A', link: 'https://example.com/a.pdf' },
        ])).toBe('https://example.com/a.pdf');
    });
});
