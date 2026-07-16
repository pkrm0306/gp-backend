"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUMMIT_HIGHLIGHTS_TITLE_MAX = exports.SUMMIT_HIGHLIGHTS_TITLE_MIN = exports.SUMMIT_HIGHLIGHTS_MAX = exports.SUMMIT_FOCUS_POINTS_MAX = exports.SUMMIT_CMS_FIELD_MAX = exports.SUMMIT_CMS_FIELD_MIN = exports.SUMMIT_CMS_CARD_MAX = exports.SUMMIT_PDF_MAX_BYTES = exports.SUMMIT_IMAGE_MAX_BYTES = exports.SUMMIT_UPLOAD_TYPES = exports.SUMMIT_SECTION_KEYS = exports.SUMMIT_SPONSOR_TIERS = exports.SUMMIT_STATUSES = void 0;
exports.SUMMIT_STATUSES = ['active', 'inactive'];
exports.SUMMIT_SPONSOR_TIERS = [
    'Title Sponsor',
    'Principal',
    'Platinum Sponsor',
    'Gold Sponsor',
    'Silver Sponsor',
    'Bronze Sponsor',
    'Partner',
];
exports.SUMMIT_SECTION_KEYS = [
    'basic',
    'banners',
    'downloads',
    'about-greenpro',
    'about-summit',
    'highlights',
    'focused-area',
    'event-outcomes',
    'speakers',
    'agenda',
    'sponsors',
];
exports.SUMMIT_UPLOAD_TYPES = [
    'banner',
    'speaker',
    'sponsor',
    'pdf_industrial',
    'pdf_buildings',
];
exports.SUMMIT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
exports.SUMMIT_PDF_MAX_BYTES = 10 * 1024 * 1024;
/** Shared CMS card / bullet field limits (Highlights, Focused Area, Event Outcomes, Agenda). */
exports.SUMMIT_CMS_CARD_MAX = 3;
exports.SUMMIT_CMS_FIELD_MIN = 3;
exports.SUMMIT_CMS_FIELD_MAX = 75;
exports.SUMMIT_FOCUS_POINTS_MAX = 3;
/** @deprecated use SUMMIT_CMS_CARD_MAX */
exports.SUMMIT_HIGHLIGHTS_MAX = exports.SUMMIT_CMS_CARD_MAX;
/** @deprecated use SUMMIT_CMS_FIELD_MIN */
exports.SUMMIT_HIGHLIGHTS_TITLE_MIN = exports.SUMMIT_CMS_FIELD_MIN;
/** @deprecated use SUMMIT_CMS_FIELD_MAX */
exports.SUMMIT_HIGHLIGHTS_TITLE_MAX = exports.SUMMIT_CMS_FIELD_MAX;
