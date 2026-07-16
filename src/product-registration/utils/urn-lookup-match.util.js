"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urnLookupMatchExpr = urnLookupMatchExpr;
/** Mongo `$expr` match for URN lookups (ignores trailing slashes / whitespace). */
function urnLookupMatchExpr() {
    return {
        $eq: [
            {
                $rtrim: {
                    input: { $trim: { input: { $toString: '$urnNo' } } },
                    chars: '/',
                },
            },
            {
                $rtrim: {
                    input: { $trim: { input: { $toString: '$$urnNo' } } },
                    chars: '/',
                },
            },
        ],
    };
}
