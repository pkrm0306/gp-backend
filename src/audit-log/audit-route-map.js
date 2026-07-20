"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRouteMapper = void 0;
exports.firstStringField = firstStringField;
exports.buildPerformedBy = buildPerformedBy;
exports.mapFriendlyAudit = mapFriendlyAudit;
var common_1 = require("@nestjs/common");
var audit_friendlies_1 = require("./audit-friendlies");
function bodyObj(req) {
    var b = req.body;
    if (!b || typeof b !== 'object' || Array.isArray(b)) {
        return undefined;
    }
    return b;
}
function firstStringField(body, keys, maxLen) {
    if (maxLen === void 0) { maxLen = 200; }
    if (!body) {
        return undefined;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        var v = body[k];
        if (typeof v === 'string' && v.trim()) {
            var t = v.trim();
            return t.length > maxLen ? t.slice(0, maxLen) : t;
        }
    }
    return undefined;
}
function methodDefaultActionType(method) {
    var m = method.toUpperCase();
    if (m === 'POST') {
        return audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE;
    }
    if (m === 'DELETE') {
        return audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE;
    }
    return audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE;
}
function actionVerbLabel(actionType) {
    if (actionType === audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE) {
        return 'created';
    }
    if (actionType === audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE) {
        return 'deleted';
    }
    return 'updated';
}
function isProductFamilyPath(p) {
    return (p.startsWith('/product-design') ||
        p.startsWith('/product-performance') ||
        p.startsWith('/product-registration') ||
        p.startsWith('/products') ||
        p.startsWith('/api/admin/products') ||
        p.startsWith('/api/admin/urn-site-visits') ||
        p.startsWith('/raw-materials-hazardous-products') ||
        p.startsWith('/process-comments') ||
        p.startsWith('/process-'));
}
function isRawMaterialsPath(p) {
    return (p.startsWith('/raw-materials-') || p.startsWith('/vendor/raw-materials/'));
}
function isProcessPath(p) {
    return p.startsWith('/process-') || p.startsWith('/admin/process');
}
function pathEntityId(pathNorm) {
    var id = pathNorm.split('/').filter(Boolean).pop();
    return id ? decodeURIComponent(id) : undefined;
}
function urnFromBody(body) {
    return firstStringField(body, ['urn_no', 'urnNo', 'urn']);
}
function resolveUrnStatusAuditAction(typeStr, toNum) {
    if (typeStr === 'product_status' && toNum === 3) {
        return {
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.REJECT,
            description: 'Product certification rejected',
        };
    }
    if (typeStr === 'urn_status' && (toNum === 5 || toNum === 9)) {
        return {
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.REJECT,
            description: toNum === 9
                ? 'Certification / URN payment rejected'
                : 'Certification / URN sent back to vendor',
        };
    }
    if (typeStr === 'urn_status' &&
        (toNum === 2 || toNum === 11 || toNum === 14)) {
        return {
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.APPROVE,
            description: 'Certification / URN status advanced',
        };
    }
    return {
        action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
        description: 'Certification / URN status updated',
    };
}
function nameFromBody(body) {
    return firstStringField(body, [
        'name',
        'title',
        'category_name',
        'companyName',
        'company_name',
        'email',
    ]);
}
/**
 * Maps HTTP context to user-facing audit fields. Always returns a consistent shape.
 */
function buildPerformedBy(user, actor, pathNorm, body) {
    if (user && typeof user === 'object') {
        var uid = user['userId'] !== undefined ? String(user['userId']) : actor === null || actor === void 0 ? void 0 : actor.user_id;
        var name_1 = user['name'] !== undefined
            ? String(user['name']).slice(0, 200)
            : undefined;
        var email = user['email'] !== undefined
            ? String(user['email']).slice(0, 200)
            : undefined;
        if (uid || name_1 || email) {
            return {
                user_id: uid,
                name: name_1 || undefined,
                email: email || undefined,
            };
        }
    }
    if (actor === null || actor === void 0 ? void 0 : actor.user_id) {
        return { user_id: actor.user_id };
    }
    if (pathNorm.endsWith('/auth/login') &&
        body &&
        typeof body['email'] === 'string') {
        var e = body['email'].trim();
        if (e) {
            return { email: e.slice(0, 200) };
        }
    }
    return undefined;
}
function mapFriendlyAudit(method, pathNorm, req, outcome, snapshot) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    var m = method.toUpperCase();
    var body = bodyObj(req);
    var snap = snapshot;
    if (m === 'POST' && pathNorm.endsWith('/auth/login')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.LOGIN,
            description: outcome === 'success' ? 'Signed in successfully' : 'Sign-in failed',
            entity_name: firstStringField(body, ['email']),
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/auth/refresh')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Access token refreshed',
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/auth/register-vendor')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Vendor registration submitted',
            entity_name: firstStringField(body, ['email', 'companyName']),
            new_values: snap,
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/auth/verify-otp')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Email verification (OTP)',
            entity_name: firstStringField(body, ['email']),
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/auth/resend-otp')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Registration OTP resent',
            entity_name: firstStringField(body, ['email']),
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/auth/forgot-password')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.AUTH,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Password reset requested',
            entity_name: firstStringField(body, ['email']),
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/addcategory')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Category created',
            entity_name: firstStringField(body, ['category_name']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' && /^\/categories\/[^/]+\/status$/.test(pathNorm)) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Category status updated',
            entity_name: firstStringField(body, ['category_name']),
            new_values: snap,
        };
    }
    if ((m === 'PATCH' || m === 'PUT') &&
        /^\/categories\/[^/]+$/.test(pathNorm)) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Category updated',
            entity_name: firstStringField(body, ['category_name']),
            new_values: snap,
        };
    }
    if (m === 'DELETE' && /^\/categories\/[^/]+$/.test(pathNorm)) {
        var id = pathNorm.split('/').pop();
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE,
            description: 'Category deleted',
            entity_name: id,
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/uploadcategoryimage')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Category image uploaded',
        };
    }
    if (m === 'POST' && pathNorm === '/api/sectors') {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Sector created',
            entity_name: firstStringField(body, ['name']),
            new_values: snap,
        };
    }
    if ((m === 'PATCH' || m === 'PUT') &&
        /^\/api\/sectors\/[^/]+$/.test(pathNorm) &&
        !pathNorm.endsWith('/export')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Sector updated',
            entity_name: firstStringField(body, ['name']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' && /^\/api\/sectors\/[^/]+\/status$/.test(pathNorm)) {
        var id = pathNorm.split('/').filter(Boolean).at(-2);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Sector status updated',
            entity_name: (_a = firstStringField(body, ['name'])) !== null && _a !== void 0 ? _a : id,
            new_values: snap,
        };
    }
    if (m === 'DELETE' && /^\/api\/sectors\/[^/]+$/.test(pathNorm)) {
        var id = pathNorm.split('/').pop();
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE,
            description: 'Sector deleted',
            entity_name: id,
        };
    }
    if (m === 'POST' && pathNorm === '/api/standards') {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Standard created',
            entity_name: nameFromBody(body),
            new_values: snap,
        };
    }
    if ((m === 'PATCH' || m === 'PUT') &&
        /^\/api\/standards\/[^/]+(?:\/edit)?$/.test(pathNorm)) {
        var parts = pathNorm.split('/').filter(Boolean);
        var id = parts.at(-1) === 'edit' ? parts.at(-2) : parts.at(-1);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Standard updated',
            entity_name: (_b = nameFromBody(body)) !== null && _b !== void 0 ? _b : id,
            new_values: snap,
        };
    }
    if (m === 'PATCH' && /^\/api\/standards\/[^/]+\/status$/.test(pathNorm)) {
        var id = pathNorm.split('/').filter(Boolean).at(-2);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Standard status updated',
            entity_name: (_c = nameFromBody(body)) !== null && _c !== void 0 ? _c : id,
            new_values: snap,
        };
    }
    if (m === 'DELETE' && /^\/api\/standards\/[^/]+$/.test(pathNorm)) {
        var id = pathNorm.split('/').pop();
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE,
            description: 'Standard deleted',
            entity_name: id,
        };
    }
    if (m === 'PATCH' &&
        (pathNorm.endsWith('/api/admin/products/urn-status') ||
            /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm))) {
        var urnFromPath = (_d = pathNorm.match(/\/admin\/urn\/([^/]+)\/status$/i)) === null || _d === void 0 ? void 0 : _d[1];
        var urn = (urnFromPath ? decodeURIComponent(urnFromPath) : undefined) ||
            firstStringField(body, ['urnNo']);
        var typeStr = body === null || body === void 0 ? void 0 : body['updateStatusType'];
        var toVal = body === null || body === void 0 ? void 0 : body['updateStatusTo'];
        var toNum = typeof toVal === 'number'
            ? toVal
            : typeof toVal === 'string' && toVal.trim() !== ''
                ? Number(toVal)
                : NaN;
        var actionMeta = resolveUrnStatusAuditAction(typeStr, toNum);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CERTIFICATION,
            action_type: actionMeta.action_type,
            description: actionMeta.description,
            entity_name: urn,
            new_values: typeof typeStr === 'string' || !Number.isNaN(toNum)
                ? __assign(__assign({}, (typeof typeStr === 'string'
                    ? { updateStatusType: typeStr }
                    : {})), (!Number.isNaN(toNum) ? { updateStatusTo: toNum } : {})) : undefined,
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/payments')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PAYMENT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Payment record created',
            entity_name: (_e = urnFromBody(body)) !== null && _e !== void 0 ? _e : firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        /^\/payments\/[^/]+\/vendor-proposal-approval$/.test(pathNorm)) {
        var urn = pathNorm.split('/').filter(Boolean)[1];
        var status_1 = body === null || body === void 0 ? void 0 : body['vendorProposalApprovalStatus'];
        var statusNum = typeof status_1 === 'number'
            ? status_1
            : typeof status_1 === 'string' && status_1.trim() !== ''
                ? Number(status_1)
                : NaN;
        var rejected = statusNum === 2;
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
            action_type: rejected
                ? audit_friendlies_1.AUDIT_ACTION_TYPE.REJECT
                : audit_friendlies_1.AUDIT_ACTION_TYPE.APPROVE,
            description: rejected ? 'Proposal rejected' : 'Proposal approved',
            entity_name: urn ? decodeURIComponent(urn) : undefined,
            new_values: snap,
        };
    }
    if (m === 'PATCH' && /^\/payments\/[^/]+$/.test(pathNorm)) {
        var urn = pathNorm.split('/').pop();
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PAYMENT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Payment record updated',
            entity_name: urn ? decodeURIComponent(urn) : undefined,
            new_values: snap,
        };
    }
    if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.ACTIVITY_LOG,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
            description: 'Certification activity logged',
            entity_name: urnFromBody(body),
            new_values: snap,
        };
    }
    if (isRawMaterialsPath(pathNorm)) {
        var at_1 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.RAW_MATERIALS,
            action_type: at_1,
            description: "Raw materials data ".concat(actionVerbLabel(at_1)),
            entity_name: (_f = urnFromBody(body)) !== null && _f !== void 0 ? _f : nameFromBody(body),
            new_values: snap,
        };
    }
    if (isProcessPath(pathNorm)) {
        var at_2 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PROCESS,
            action_type: at_2,
            description: "Process data ".concat(actionVerbLabel(at_2)),
            entity_name: (_g = urnFromBody(body)) !== null && _g !== void 0 ? _g : nameFromBody(body),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        pathNorm.endsWith('/api/admin/products/expired-reactivate/product')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Expired product reactivated to certified',
            entity_name: (_h = firstStringField(body, ['eoiNo'])) !== null && _h !== void 0 ? _h : firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        pathNorm.endsWith('/api/admin/products/expired-reactivate/urn')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'All expired products on URN reactivated to certified',
            entity_name: firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        pathNorm.endsWith('/api/admin/products/certified-reject/product')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Certified product rejected by admin',
            entity_name: (_j = firstStringField(body, ['eoiNo'])) !== null && _j !== void 0 ? _j : firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        pathNorm.endsWith('/api/admin/products/rejected-restore/product')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'Rejected product restored',
            entity_name: (_k = firstStringField(body, ['eoiNo'])) !== null && _k !== void 0 ? _k : firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (m === 'PATCH' &&
        pathNorm.endsWith('/api/admin/products/rejected-restore/urn')) {
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
            description: 'All rejected products on URN restored',
            entity_name: firstStringField(body, ['urnNo']),
            new_values: snap,
        };
    }
    if (isProductFamilyPath(pathNorm)) {
        var at_3 = methodDefaultActionType(m);
        var urn = urnFromBody(body);
        var description_1;
        if (at_3 === audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE) {
            description_1 = 'Product / process data created';
        }
        else if (at_3 === audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE) {
            description_1 = 'Product / process data deleted';
        }
        else {
            description_1 = 'Product / process data updated';
        }
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
            action_type: at_3,
            description: description_1,
            entity_name: urn,
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/banner') ||
        pathNorm.startsWith('/website/banners')) {
        var at_4 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.BANNER,
            action_type: at_4,
            description: "Banner ".concat(actionVerbLabel(at_4)),
            entity_name: (_l = nameFromBody(body)) !== null && _l !== void 0 ? _l : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/public/articles')) {
        var at_5 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.ARTICLE,
            action_type: at_5,
            description: "Article ".concat(actionVerbLabel(at_5)),
            entity_name: (_m = nameFromBody(body)) !== null && _m !== void 0 ? _m : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/events')) {
        var at_6 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.EVENT,
            action_type: at_6,
            description: "Event ".concat(actionVerbLabel(at_6)),
            entity_name: (_o = nameFromBody(body)) !== null && _o !== void 0 ? _o : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/public/gallery')) {
        var at_7 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.GALLERY,
            action_type: at_7,
            description: "Gallery item ".concat(actionVerbLabel(at_7)),
            entity_name: (_p = nameFromBody(body)) !== null && _p !== void 0 ? _p : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/newsletter')) {
        var at_8 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.NEWSLETTER,
            action_type: at_8,
            description: "Newsletter subscription ".concat(actionVerbLabel(at_8)),
            entity_name: (_q = firstStringField(body, ['email'])) !== null && _q !== void 0 ? _q : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/contact')) {
        var at_9 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.CONTACT,
            action_type: at_9,
            description: "Contact inquiry ".concat(actionVerbLabel(at_9)),
            entity_name: (_r = nameFromBody(body)) !== null && _r !== void 0 ? _r : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/team-members') ||
        pathNorm.startsWith('/api/team-members')) {
        var at_10 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.TEAM_MEMBER,
            action_type: at_10,
            description: "Team member ".concat(actionVerbLabel(at_10)),
            entity_name: (_s = nameFromBody(body)) !== null && _s !== void 0 ? _s : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/manufacturer/inquiry')) {
        var at_11 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.MANUFACTURER_INQUIRY,
            action_type: at_11,
            description: "Manufacturer inquiry ".concat(actionVerbLabel(at_11)),
            entity_name: (_t = nameFromBody(body)) !== null && _t !== void 0 ? _t : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website/summits') ||
        pathNorm.startsWith('/admin/summits')) {
        var at_12 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SUMMIT,
            action_type: at_12,
            description: "Summit ".concat(actionVerbLabel(at_12)),
            entity_name: (_u = nameFromBody(body)) !== null && _u !== void 0 ? _u : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/website')) {
        var at_13 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.WEBSITE,
            action_type: at_13,
            description: "Website content ".concat(actionVerbLabel(at_13)),
            entity_name: (_v = nameFromBody(body)) !== null && _v !== void 0 ? _v : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/api/manufacturers') ||
        pathNorm.startsWith('/api/admin/manufacturers')) {
        var at_14 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.MANUFACTURER,
            action_type: at_14,
            description: "Manufacturer ".concat(actionVerbLabel(at_14)),
            entity_name: (_w = nameFromBody(body)) !== null && _w !== void 0 ? _w : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/api/vendor/requests') ||
        (pathNorm.startsWith('/api/vendor') &&
            !pathNorm.startsWith('/api/vendor/dashboard'))) {
        var at_15 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.USER,
            action_type: at_15,
            description: "Vendor user ".concat(actionVerbLabel(at_15)),
            entity_name: (_x = nameFromBody(body)) !== null && _x !== void 0 ? _x : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/partners')) {
        var at_16 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.PARTNER,
            action_type: at_16,
            description: "Partner ".concat(actionVerbLabel(at_16)),
            entity_name: (_y = nameFromBody(body)) !== null && _y !== void 0 ? _y : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/states')) {
        var at_17 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STATE,
            action_type: at_17,
            description: "State ".concat(actionVerbLabel(at_17)),
            entity_name: (_z = nameFromBody(body)) !== null && _z !== void 0 ? _z : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/countries')) {
        var at_18 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.COUNTRY,
            action_type: at_18,
            description: "Country ".concat(actionVerbLabel(at_18)),
            entity_name: (_0 = nameFromBody(body)) !== null && _0 !== void 0 ? _0 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/api/vendor/dashboard') ||
        pathNorm.startsWith('/admin/dashboard')) {
        var at_19 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.DASHBOARD,
            action_type: at_19,
            description: "Dashboard ".concat(actionVerbLabel(at_19)),
            entity_name: (_1 = nameFromBody(body)) !== null && _1 !== void 0 ? _1 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/api/standards')) {
        var at_20 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: at_20,
            description: "Standard ".concat(actionVerbLabel(at_20)),
            entity_name: (_2 = nameFromBody(body)) !== null && _2 !== void 0 ? _2 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/documents')) {
        var at_21 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.DOCUMENT,
            action_type: at_21,
            description: "Document ".concat(actionVerbLabel(at_21)),
            entity_name: (_3 = nameFromBody(body)) !== null && _3 !== void 0 ? _3 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/admin/rbac')) {
        var at_22 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.RBAC,
            action_type: at_22,
            description: "RBAC ".concat(actionVerbLabel(at_22)),
            entity_name: (_4 = nameFromBody(body)) !== null && _4 !== void 0 ? _4 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.includes('/spoc-allocation')) {
        var pathParts = pathNorm.split('/').filter(Boolean);
        var pathTail = pathParts.length ? pathParts[pathParts.length - 1] : '';
        var productIdFromPath = pathTail &&
            pathTail !== 'spoc-allocation' &&
            pathTail !== 'lookup' &&
            pathTail !== 'team-members'
            ? pathTail
            : undefined;
        var productIdFromBody = (body === null || body === void 0 ? void 0 : body.productId) != null && String(body.productId).trim()
            ? String(body.productId).trim()
            : undefined;
        var productId = productIdFromBody !== null && productIdFromBody !== void 0 ? productIdFromBody : productIdFromPath;
        var urn = urnFromBody(body);
        var entityName = urn !== null && urn !== void 0 ? urn : (productId ? "Product ".concat(productId) : undefined);
        if (m === 'POST') {
            return {
                module: audit_friendlies_1.AUDIT_MODULE.SPOC_ALLOCATION,
                action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.CREATE,
                description: 'SPOC assigned',
                entity_name: entityName,
                new_values: snap,
            };
        }
        if (m === 'PUT' || m === 'PATCH') {
            return {
                module: audit_friendlies_1.AUDIT_MODULE.SPOC_ALLOCATION,
                action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                description: 'SPOC reassigned',
                entity_name: entityName,
                new_values: snap,
            };
        }
        var atSpoc = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.SPOC_ALLOCATION,
            action_type: atSpoc,
            description: "SPOC allocation ".concat(actionVerbLabel(atSpoc)),
            entity_name: entityName,
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/zoho')) {
        var at_23 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.ZOHO,
            action_type: at_23,
            description: "Zoho integration ".concat(actionVerbLabel(at_23)),
            entity_name: (_5 = nameFromBody(body)) !== null && _5 !== void 0 ? _5 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    if (pathNorm.startsWith('/admin')) {
        var at_24 = methodDefaultActionType(m);
        return {
            module: audit_friendlies_1.AUDIT_MODULE.ADMIN,
            action_type: at_24,
            description: "Admin action ".concat(actionVerbLabel(at_24)),
            entity_name: (_6 = nameFromBody(body)) !== null && _6 !== void 0 ? _6 : pathEntityId(pathNorm),
            new_values: snap,
        };
    }
    var at = methodDefaultActionType(m);
    var mod = audit_friendlies_1.AUDIT_MODULE.OTHER;
    var description = "".concat(m, " ").concat(pathNorm).slice(0, 200);
    return {
        module: mod,
        action_type: at,
        description: description,
        entity_name: urnFromBody(body),
    };
}
var AuditRouteMapper = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditRouteMapper = _classThis = /** @class */ (function () {
        function AuditRouteMapper_1(valueTransformer) {
            this.valueTransformer = valueTransformer;
        }
        AuditRouteMapper_1.prototype.map = function (method, pathNorm, req, outcome) {
            return mapFriendlyAudit(method, pathNorm, req, outcome, this.valueTransformer.safeBodySnapshot(bodyObj(req)));
        };
        return AuditRouteMapper_1;
    }());
    __setFunctionName(_classThis, "AuditRouteMapper");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditRouteMapper = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditRouteMapper = _classThis;
}();
exports.AuditRouteMapper = AuditRouteMapper;
