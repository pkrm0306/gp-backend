"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlatformAdminUser = isPlatformAdminUser;
/** Platform admin accounts (`users.type === 'admin'`) have unrestricted portal access. */
function isPlatformAdminUser(user) {
    var _a, _b;
    if (!user)
        return false;
    var role = String((_b = (_a = user.role) !== null && _a !== void 0 ? _a : user.type) !== null && _b !== void 0 ? _b : '')
        .trim()
        .toLowerCase();
    return role === 'admin';
}
