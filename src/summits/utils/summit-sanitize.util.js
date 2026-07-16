"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeSummitHtml = sanitizeSummitHtml;
/** Lightweight HTML sanitization for rich-text summit sections. */
function sanitizeSummitHtml(html) {
    if (!html)
        return '';
    return String(html)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/javascript:/gi, '');
}
