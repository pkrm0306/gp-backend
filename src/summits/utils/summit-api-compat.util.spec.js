"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var summit_api_compat_util_1 = require("./summit-api-compat.util");
describe('summit-api-compat.util', function () {
    it('formats card legacy text with em dash when both fields exist', function () {
        expect((0, summit_api_compat_util_1.formatSummitCardLegacyText)('Knowledge', 'Learn from experts')).toBe('Knowledge — Learn from experts');
    });
    it('enriches highlight cards with text and title aliases', function () {
        var row = (0, summit_api_compat_util_1.enrichSummitCardRow)({
            id: '1',
            sortOrder: 0,
            heading: 'Topic',
            description: 'Details',
        });
        expect(row.title).toBe('Topic');
        expect(row.text).toBe('Topic — Details');
    });
    it('enriches focused area cards with title and items aliases', function () {
        var row = (0, summit_api_compat_util_1.enrichFocusedAreaRow)({
            id: '1',
            sortOrder: 0,
            heading: 'Materials',
            points: [{ id: 'p1', sortOrder: 0, text: 'Cement and steel' }],
        });
        expect(row.title).toBe('Materials');
        expect(row.items).toEqual(['Cement and steel']);
    });
    it('builds agenda HTML list from plain-text points', function () {
        expect((0, summit_api_compat_util_1.buildAgendaHtmlFromPoints)([
            {
                id: '1',
                sortOrder: 0,
                heading: '',
                description: 'Opening remarks',
                text: 'Opening remarks',
            },
            {
                id: '2',
                sortOrder: 1,
                heading: '',
                description: 'Panel discussion',
                text: 'Panel discussion',
            },
        ])).toBe('<ul><li>Opening remarks</li><li>Panel discussion</li></ul>');
    });
    it('builds agenda HTML with bold headings when heading and description exist', function () {
        expect((0, summit_api_compat_util_1.buildAgendaHtmlFromPoints)([
            {
                id: '1',
                sortOrder: 0,
                heading: 'Opening',
                description: 'Welcome address',
                text: 'Opening — Welcome address',
            },
        ])).toBe('<ul><li><strong>Opening</strong> — Welcome address</li></ul>');
    });
});
