"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
var PaginationUtil = /** @class */ (function () {
    function PaginationUtil() {
    }
    PaginationUtil.createPaginationResult = function (data, total, page, limit) {
        return {
            data: data,
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
        };
    };
    PaginationUtil.getSkip = function (page, limit) {
        return (page - 1) * limit;
    };
    return PaginationUtil;
}());
exports.PaginationUtil = PaginationUtil;
