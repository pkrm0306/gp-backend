"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteUtil = void 0;
var SoftDeleteUtil = /** @class */ (function () {
    function SoftDeleteUtil() {
    }
    SoftDeleteUtil.softDelete = function (document) {
        document.deletedAt = new Date();
        document.isDeleted = true;
        return document;
    };
    SoftDeleteUtil.restore = function (document) {
        document.deletedAt = undefined;
        document.isDeleted = false;
        return document;
    };
    return SoftDeleteUtil;
}());
exports.SoftDeleteUtil = SoftDeleteUtil;
