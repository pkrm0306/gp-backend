"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audit = exports.AUDIT_METADATA_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.AUDIT_METADATA_KEY = 'audit_metadata';
var Audit = function (meta) {
    return (0, common_1.SetMetadata)(exports.AUDIT_METADATA_KEY, meta);
};
exports.Audit = Audit;
