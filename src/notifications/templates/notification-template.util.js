"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolateTemplate = interpolateTemplate;
var PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;
function interpolateTemplate(template, payload) {
    return template.replace(PLACEHOLDER_RE, function (_, key) { var _a; return String((_a = payload[key]) !== null && _a !== void 0 ? _a : ''); });
}
