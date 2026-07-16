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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditValueTransformer = void 0;
var common_1 = require("@nestjs/common");
var audit_ignore_fields_1 = require("./audit-ignore-fields");
var AUDIT_ENUM_LABELS = {
    paymenttype: {
        registration: 'Registration',
        certification: 'Certification',
        renew: 'Renewal',
    },
    paymentmode: {
        online: 'Online',
        cheque_or_dd: 'Cheque / DD',
        neft_or_rtgs: 'NEFT / RTGS',
    },
    decision: {
        approved: 'Approved',
        rejected: 'Rejected',
    },
    updatestatustype: {
        urn_status: 'URN Status',
        payment_status: 'Payment Status',
    },
};
var AuditValueTransformer = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditValueTransformer = _classThis = /** @class */ (function () {
        function AuditValueTransformer_1(statusResolver) {
            this.statusResolver = statusResolver;
        }
        AuditValueTransformer_1.prototype.safeBodySnapshot = function (body, stringMax) {
            if (stringMax === void 0) { stringMax = 500; }
            if (!body) {
                return undefined;
            }
            var out = {};
            for (var _i = 0, _a = Object.entries(body); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                var normalized = this.normalizeAuditValue(key, value, stringMax);
                if (normalized !== undefined) {
                    out[key] = normalized;
                }
            }
            return Object.keys(out).length ? out : undefined;
        };
        AuditValueTransformer_1.prototype.safeResponseSnapshot = function (response, stringMax) {
            if (stringMax === void 0) { stringMax = 500; }
            if (!response || typeof response !== 'object' || Array.isArray(response)) {
                return undefined;
            }
            var responseRecord = response;
            var data = responseRecord['data'] &&
                typeof responseRecord['data'] === 'object' &&
                !Array.isArray(responseRecord['data'])
                ? responseRecord['data']
                : responseRecord;
            return this.safeBodySnapshot(data, stringMax);
        };
        AuditValueTransformer_1.prototype.safeBodyFieldKeys = function (body) {
            if (!body) {
                return [];
            }
            return Object.keys(body).filter(function (key) { return !(0, audit_ignore_fields_1.isAuditIgnoredField)(key); });
        };
        AuditValueTransformer_1.prototype.safeFileSnapshot = function (req) {
            var files = this.flattenFiles(req);
            if (!files.length) {
                return undefined;
            }
            return files.map(function (file) { return ({
                field: file.fieldname,
                original_name: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                stored_name: file.filename,
                storage_path: file.path,
            }); });
        };
        AuditValueTransformer_1.prototype.mergeSnapshots = function (base, extra) {
            if (!base && !extra) {
                return undefined;
            }
            return this.sanitizeSnapshot(__assign(__assign({}, (base !== null && base !== void 0 ? base : {})), (extra !== null && extra !== void 0 ? extra : {})));
        };
        AuditValueTransformer_1.prototype.sanitizeSnapshot = function (values) {
            if (!values || typeof values !== 'object' || Array.isArray(values)) {
                return values;
            }
            var sanitized = this.sanitizeRecord(values);
            return Object.keys(sanitized).length ? sanitized : undefined;
        };
        AuditValueTransformer_1.prototype.buildChanges = function (oldValues, newValues) {
            if (!oldValues || !newValues) {
                return undefined;
            }
            var changes = {};
            var keys = new Set(__spreadArray(__spreadArray([], Object.keys(oldValues), true), Object.keys(newValues), true));
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                var before = this.sanitizeAuditValue(key, oldValues[key]);
                var after = this.sanitizeAuditValue(key, newValues[key]);
                if (this.valuesEqual(before, after)) {
                    continue;
                }
                changes[key] = { before: before, after: after };
            }
            return Object.keys(changes).length ? changes : undefined;
        };
        AuditValueTransformer_1.prototype.transformDisplayValues = function (values, resolveLookup) {
            if (!values || typeof values !== 'object' || Array.isArray(values)) {
                return values;
            }
            var out = this.transformDisplayRecord(values, resolveLookup);
            return Object.keys(out).length ? out : undefined;
        };
        AuditValueTransformer_1.prototype.transformDisplayRecord = function (values, resolveLookup) {
            var out = {};
            for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                var statusLabel = this.statusResolver.resolve(key, value);
                if (statusLabel) {
                    out[key] = statusLabel;
                    continue;
                }
                var enumLabel = this.enumLabel(key, value);
                if (enumLabel) {
                    out[key] = enumLabel;
                    continue;
                }
                var lookupLabel = resolveLookup(key, value);
                if (lookupLabel) {
                    out[key] = lookupLabel;
                    continue;
                }
                var transformed = this.transformSingleDisplayValue(key, value, resolveLookup);
                if (transformed !== undefined) {
                    out[key] = transformed;
                }
            }
            return out;
        };
        AuditValueTransformer_1.prototype.transformDisplayChanges = function (changes, resolveLookup) {
            if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
                return changes;
            }
            var out = {};
            for (var _i = 0, _a = Object.entries(changes); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], change = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                if (!change || typeof change !== 'object' || Array.isArray(change)) {
                    out[key] = this.sanitizeAuditValue(key, change);
                    continue;
                }
                var pair = change;
                out[key] = {
                    before: this.transformSingleDisplayValue(key, pair.before, resolveLookup),
                    after: this.transformSingleDisplayValue(key, pair.after, resolveLookup),
                };
            }
            return Object.keys(out).length ? out : undefined;
        };
        AuditValueTransformer_1.prototype.sanitizeChanges = function (changes) {
            if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
                return changes;
            }
            var out = {};
            for (var _i = 0, _a = Object.entries(changes); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], change = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                if (!change || typeof change !== 'object' || Array.isArray(change)) {
                    var sanitized = this.sanitizeAuditValue(key, change);
                    if (sanitized !== undefined) {
                        out[key] = sanitized;
                    }
                    continue;
                }
                var pair = change;
                var before = this.sanitizeAuditValue(key, pair.before);
                var after = this.sanitizeAuditValue(key, pair.after);
                if (!this.valuesEqual(before, after)) {
                    out[key] = { before: before, after: after };
                }
            }
            return Object.keys(out).length ? out : undefined;
        };
        AuditValueTransformer_1.prototype.flattenFiles = function (req) {
            if (req.file) {
                return [req.file];
            }
            if (Array.isArray(req.files)) {
                return req.files;
            }
            if (req.files && typeof req.files === 'object') {
                return Object.values(req.files).flat();
            }
            return [];
        };
        AuditValueTransformer_1.prototype.valuesEqual = function (a, b) {
            if (a === b) {
                return true;
            }
            return JSON.stringify(a) === JSON.stringify(b);
        };
        AuditValueTransformer_1.prototype.sanitizeRecord = function (value) {
            var out = {};
            for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], item = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                var sanitized = this.sanitizeAuditValue(key, item);
                if (sanitized !== undefined) {
                    out[key] = sanitized;
                }
            }
            return out;
        };
        AuditValueTransformer_1.prototype.sanitizeAuditValue = function (key, value) {
            return this.normalizeAuditValue(key, value);
        };
        AuditValueTransformer_1.prototype.transformSingleDisplayValue = function (key, value, resolveLookup) {
            var _this = this;
            var _a, _b;
            var scalarLabel = (_b = (_a = this.statusResolver.resolve(key, value)) !== null && _a !== void 0 ? _a : this.enumLabel(key, value)) !== null && _b !== void 0 ? _b : resolveLookup(key, value);
            if (scalarLabel) {
                return scalarLabel;
            }
            if (!value || typeof value !== 'object') {
                return value;
            }
            if (value instanceof Date) {
                return value;
            }
            if (Array.isArray(value)) {
                return value.map(function (item) {
                    var _a, _b, _c;
                    if (item && typeof item === 'object' && !Array.isArray(item)) {
                        return _this.transformDisplayRecord(item, resolveLookup);
                    }
                    return ((_c = (_b = (_a = _this.statusResolver.resolve(key, item)) !== null && _a !== void 0 ? _a : _this.enumLabel(key, item)) !== null && _b !== void 0 ? _b : resolveLookup(key, item)) !== null && _c !== void 0 ? _c : item);
                });
            }
            if (typeof value.toHexString === 'function') {
                return value;
            }
            return this.transformDisplayRecord(value, resolveLookup);
        };
        AuditValueTransformer_1.prototype.enumLabel = function (key, value) {
            var _a;
            var normalizedKey = this.statusResolver.normalizeKey(key);
            var labels = AUDIT_ENUM_LABELS[normalizedKey];
            if (!labels) {
                return undefined;
            }
            if (typeof value === 'string') {
                return (_a = labels[value.trim().toLowerCase()]) !== null && _a !== void 0 ? _a : labels[value.trim()];
            }
            if (typeof value === 'number' || typeof value === 'boolean') {
                return labels[String(value)];
            }
            return undefined;
        };
        AuditValueTransformer_1.prototype.normalizeAuditValue = function (key, value, stringMax, seen) {
            var _this = this;
            if (stringMax === void 0) { stringMax = 500; }
            if (seen === void 0) { seen = new WeakSet(); }
            if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key) || value === undefined) {
                return undefined;
            }
            if (value === null) {
                return null;
            }
            if (typeof value === 'string') {
                return this.normalizeAuditString(value, stringMax);
            }
            if (typeof value === 'number' || typeof value === 'boolean') {
                return value;
            }
            if (typeof value === 'bigint') {
                return value.toString();
            }
            if (value instanceof Date) {
                return value.toISOString();
            }
            if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
                return undefined;
            }
            if (typeof value !== 'object') {
                return String(value);
            }
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
            if (typeof value.toHexString === 'function') {
                return String(value);
            }
            if (Array.isArray(value)) {
                var normalized_1 = value
                    .map(function (item) { return _this.normalizeAuditValue(key, item, stringMax, seen); })
                    .filter(function (item) {
                    if (item && typeof item === 'object' && !Array.isArray(item)) {
                        return Object.keys(item).length > 0;
                    }
                    return item !== undefined;
                });
                return normalized_1.length ? normalized_1 : undefined;
            }
            var maybePlain = this.toPlainObject(value);
            if (!maybePlain) {
                return undefined;
            }
            var normalized = this.normalizeAuditRecord(maybePlain, stringMax, seen);
            return Object.keys(normalized).length ? normalized : undefined;
        };
        AuditValueTransformer_1.prototype.normalizeAuditRecord = function (value, stringMax, seen) {
            var out = {};
            for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], item = _b[1];
                if ((0, audit_ignore_fields_1.isAuditIgnoredField)(key)) {
                    continue;
                }
                var normalized = this.normalizeAuditValue(key, item, stringMax, seen);
                if (normalized !== undefined) {
                    out[key] = normalized;
                }
            }
            return out;
        };
        AuditValueTransformer_1.prototype.normalizeAuditString = function (value, stringMax) {
            var trimmed = value.trim();
            if (trimmed === '[object Object]') {
                return undefined;
            }
            var parsed = this.parseJsonString(trimmed);
            if (parsed !== undefined) {
                return this.normalizeAuditValue('', parsed, stringMax);
            }
            return value.length > stringMax ? value.slice(0, stringMax) : value;
        };
        AuditValueTransformer_1.prototype.parseJsonString = function (value) {
            if (!value || !['{', '['].includes(value[0])) {
                return undefined;
            }
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                return undefined;
            }
        };
        AuditValueTransformer_1.prototype.toPlainObject = function (value) {
            if (typeof value.toObject === 'function') {
                return value.toObject();
            }
            if (typeof value.toJSON === 'function') {
                var json = value.toJSON();
                if (json && typeof json === 'object' && !Array.isArray(json)) {
                    return json;
                }
            }
            return value;
        };
        return AuditValueTransformer_1;
    }());
    __setFunctionName(_classThis, "AuditValueTransformer");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditValueTransformer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditValueTransformer = _classThis;
}();
exports.AuditValueTransformer = AuditValueTransformer;
