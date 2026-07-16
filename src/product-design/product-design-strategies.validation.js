"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_DESIGN_STRATEGIES_MAX = exports.PRODUCT_DESIGN_STRATEGIES_MIN = void 0;
exports.containsHtmlTags = containsHtmlTags;
exports.containsScriptInjection = containsScriptInjection;
exports.normalizeProductDesignStrategiesForValidation = normalizeProductDesignStrategiesForValidation;
exports.getProductDesignStrategiesValidationError = getProductDesignStrategiesValidationError;
exports.assertProductDesignStrategiesValid = assertProductDesignStrategiesValid;
var common_1 = require("@nestjs/common");
exports.PRODUCT_DESIGN_STRATEGIES_MIN = 10;
exports.PRODUCT_DESIGN_STRATEGIES_MAX = 1000;
var SCRIPT_INJECTION_PATTERNS = [
    /<script\b/i,
    /<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i,
    /<\s*iframe\b/i,
    /<\s*object\b/i,
    /<\s*embed\b/i,
    /<\s*meta\b/i,
    /<\s*link\b/i,
    /<\s*style\b/i,
];
var MEANINGFUL_CHAR = /[A-Za-z0-9]/;
function trimField(value) {
    return String(value !== null && value !== void 0 ? value : '')
        .replace(/\u00a0/g, ' ')
        .trim();
}
function collapseSpacesPreservingLineBreaks(value) {
    return String(value !== null && value !== void 0 ? value : '')
        .replace(/\u00a0/g, ' ')
        .split('\n')
        .map(function (line) { return line.replace(/ {2,}/g, ' '); })
        .join('\n');
}
function containsHtmlTags(value) {
    return /<[^>]*>/i.test(value);
}
function containsScriptInjection(value) {
    return SCRIPT_INJECTION_PATTERNS.some(function (pattern) { return pattern.test(value); });
}
function hasOnlySpecialCharacters(value) {
    var trimmed = trimField(value);
    if (!trimmed)
        return true;
    return !MEANINGFUL_CHAR.test(trimmed);
}
function normalizeProductDesignStrategiesForValidation(raw) {
    var value = String(raw !== null && raw !== void 0 ? raw : '').replace(/\r\n/g, '\n');
    value = collapseSpacesPreservingLineBreaks(value);
    return trimField(value);
}
/**
 * Validates strategies when the vendor provided non-empty text.
 * Empty/whitespace-only strategies are allowed (another product-design field may be filled).
 */
function getProductDesignStrategiesValidationError(raw) {
    var normalized = normalizeProductDesignStrategiesForValidation(raw);
    if (!normalized) {
        return null;
    }
    if (normalized.length < exports.PRODUCT_DESIGN_STRATEGIES_MIN) {
        return "Strategies must be at least ".concat(exports.PRODUCT_DESIGN_STRATEGIES_MIN, " characters.");
    }
    if (normalized.length > exports.PRODUCT_DESIGN_STRATEGIES_MAX) {
        return "Strategies must be ".concat(exports.PRODUCT_DESIGN_STRATEGIES_MAX, " characters or less.");
    }
    var rawValue = String(raw !== null && raw !== void 0 ? raw : '');
    if (containsHtmlTags(rawValue)) {
        return 'HTML tags are not allowed in Strategies.';
    }
    if (containsScriptInjection(rawValue)) {
        return 'Script or unsafe content is not allowed in Strategies.';
    }
    if (hasOnlySpecialCharacters(normalized)) {
        return 'Strategies cannot contain only special characters.';
    }
    return null;
}
function assertProductDesignStrategiesValid(strategies) {
    var message = getProductDesignStrategiesValidationError(strategies);
    if (!message) {
        return;
    }
    throw new common_1.BadRequestException({
        message: message,
        fieldErrors: {
            strategies: message,
            statergies: message,
        },
    });
}
