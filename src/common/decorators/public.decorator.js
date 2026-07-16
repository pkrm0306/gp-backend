"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
/** Mark a route as public (skips JwtAuthGuard). */
var Public = function () { return (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true); };
exports.Public = Public;
