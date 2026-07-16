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
exports.AuditEntryFactory = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var audit_actions_1 = require("./audit-actions");
var audit_route_map_1 = require("./audit-route-map");
var audit_friendlies_1 = require("./audit-friendlies");
var audit_listing_routes_util_1 = require("./audit-listing-routes.util");
var AuditEntryFactory = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditEntryFactory = _classThis = /** @class */ (function () {
        function AuditEntryFactory_1(routeMapper, valueTransformer) {
            this.routeMapper = routeMapper;
            this.valueTransformer = valueTransformer;
        }
        AuditEntryFactory_1.prototype.newCorrelationId = function (req) {
            var incoming = req.headers['x-request-id'];
            if (typeof incoming === 'string' && incoming.trim()) {
                return incoming.trim().slice(0, 128);
            }
            if (Array.isArray(incoming) && incoming[0]) {
                return String(incoming[0]).trim().slice(0, 128);
            }
            return (0, crypto_1.randomUUID)();
        };
        AuditEntryFactory_1.prototype.newAuditEventId = function () {
            return (0, crypto_1.randomUUID)();
        };
        AuditEntryFactory_1.prototype.normalizePath = function (url) {
            var noQuery = url.replace(/\?.*$/, '');
            return (noQuery.replace(/\/+$/, '') || '/').toLowerCase();
        };
        AuditEntryFactory_1.prototype.shouldAudit = function (method, pathNorm) {
            if (!new Set(['POST', 'PUT', 'PATCH', 'DELETE']).has(method.toUpperCase())) {
                return false;
            }
            return !this.shouldSkipAuditRoute(method, pathNorm);
        };
        AuditEntryFactory_1.prototype.shouldRecordHttpAudit = function (params) {
            if (params.outcome !== 'success') {
                return true;
            }
            var bulk = this.rawMaterialsBulkRow(params.method, params.pathNorm, params.req);
            if (bulk && !bulk.isFinalRow) {
                return false;
            }
            return !this.isExplicitNoopStatusChange(params.req);
        };
        AuditEntryFactory_1.prototype.create = function (params) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var req = params.req, method = params.method, resolvedPath = params.resolvedPath, pathNorm = params.pathNorm, outcome = params.outcome, statusCode = params.statusCode, startedAt = params.startedAt, errorMessage = params.errorMessage, auditMeta = params.auditMeta;
            var action = (_a = auditMeta === null || auditMeta === void 0 ? void 0 : auditMeta.action) !== null && _a !== void 0 ? _a : this.resolveAction(method, pathNorm);
            var user = req.user;
            var actor = this.actorFromUser(user);
            var body = this.bodyObj(req);
            var performedBy = (0, audit_route_map_1.buildPerformedBy)(user, actor, pathNorm, body);
            var friendly = this.routeMapper.map(method, pathNorm, req, outcome);
            var businessEvent = this.businessEventSummary(method, pathNorm, req, outcome);
            var bodySnapshot = this.valueTransformer.safeBodySnapshot(body);
            var responseSnapshot = outcome === 'success' && ['PATCH', 'PUT'].includes(method.toUpperCase())
                ? this.valueTransformer.safeResponseSnapshot(req.__auditResponseBody)
                : undefined;
            var fileSnapshot = this.valueTransformer.safeFileSnapshot(req);
            var explicitNewValues = req.__auditNewValues;
            var rawNewValues = (_d = (_c = (_b = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.new_values) !== null && _b !== void 0 ? _b : explicitNewValues) !== null && _c !== void 0 ? _c : responseSnapshot) !== null && _d !== void 0 ? _d : this.valueTransformer.mergeSnapshots(friendly.new_values, bodySnapshot);
            var newValues = this.valueTransformer.sanitizeSnapshot(rawNewValues);
            var oldValues = this.valueTransformer.sanitizeSnapshot((_e = req.__auditOldValues) !== null && _e !== void 0 ? _e : friendly.old_values);
            var metadata = {
                duration_ms: Date.now() - startedAt,
                audit_event_id: (_g = (_f = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.auditEventId) !== null && _f !== void 0 ? _f : req.auditEventId) !== null && _g !== void 0 ? _g : this.newAuditEventId(),
            };
            Object.assign(metadata, businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.metadata);
            var bodyFields = this.valueTransformer.safeBodyFieldKeys(body);
            if (bodyFields.length) {
                metadata.body_fields = bodyFields;
            }
            if (fileSnapshot === null || fileSnapshot === void 0 ? void 0 : fileSnapshot.length) {
                metadata.file_uploads = fileSnapshot;
            }
            if (outcome === 'failure') {
                var truncated = this.truncateMessage(errorMessage);
                if (truncated) {
                    metadata.error_message = truncated;
                }
            }
            return {
                action: action,
                outcome: outcome,
                module: (_h = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.module) !== null && _h !== void 0 ? _h : friendly.module,
                action_type: (_j = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.action_type) !== null && _j !== void 0 ? _j : friendly.action_type,
                entity_name: (_k = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.entity_name) !== null && _k !== void 0 ? _k : friendly.entity_name,
                description: (_l = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.description) !== null && _l !== void 0 ? _l : friendly.description,
                performed_by: performedBy,
                old_values: oldValues,
                new_values: newValues,
                http_method: method,
                route: resolvedPath,
                status_code: statusCode,
                actor: actor && Object.values(actor).some(function (v) { return v; }) ? actor : undefined,
                resource: this.mergeResource((_m = businessEvent === null || businessEvent === void 0 ? void 0 : businessEvent.resource) !== null && _m !== void 0 ? _m : this.inferResource(method, pathNorm, req), auditMeta, req),
                request: {
                    correlation_id: req.auditCorrelationId,
                    ip: this.clientIp(req),
                    user_agent: this.truncateUa(req.headers['user-agent']),
                },
                changes: friendly.old_values || oldValues
                    ? this.valueTransformer.buildChanges(oldValues, newValues)
                    : undefined,
                metadata: metadata,
            };
        };
        AuditEntryFactory_1.prototype.resolveAction = function (method, pathNorm) {
            var m = method.toUpperCase();
            if (m === 'POST' && pathNorm.endsWith('/auth/login')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_LOGIN;
            }
            if (m === 'POST' && pathNorm.endsWith('/auth/refresh')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_REFRESH;
            }
            if (m === 'POST' && pathNorm.endsWith('/auth/register-vendor')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_REGISTER_VENDOR;
            }
            if (m === 'POST' && pathNorm.endsWith('/auth/verify-otp')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_VERIFY_OTP;
            }
            if (m === 'POST' && pathNorm.endsWith('/auth/resend-otp')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_RESEND_OTP;
            }
            if (m === 'POST' && pathNorm.endsWith('/auth/forgot-password')) {
                return audit_actions_1.AUDIT_ACTION.AUTH_FORGOT_PASSWORD;
            }
            if (m === 'POST' && pathNorm.endsWith('/payments')) {
                return audit_actions_1.AUDIT_ACTION.PAYMENT_CREATED;
            }
            if (m === 'PATCH' && /^\/payments\/[^/]+$/i.test(pathNorm)) {
                return audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED;
            }
            if (m === 'PATCH' &&
                (pathNorm.endsWith('/api/admin/products/urn-status') ||
                    /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm))) {
                return audit_actions_1.AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED;
            }
            if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
                return audit_actions_1.AUDIT_ACTION.ACTIVITY_LOG_CREATED;
            }
            return audit_actions_1.AUDIT_ACTION.HTTP_MUTATION;
        };
        AuditEntryFactory_1.prototype.shouldSkipAuditRoute = function (method, pathNorm) {
            if ((0, audit_listing_routes_util_1.isListingAuditPath)(pathNorm)) {
                return true;
            }
            var m = method.toUpperCase();
            var routes = [
                { method: 'POST', regex: /^\/auth\/refresh$/i },
                { method: '*', regex: /^\/website(?:\/|$)/i },
            ];
            return routes.some(function (route) {
                return (route.method === '*' || route.method === m) &&
                    route.regex.test(pathNorm);
            });
        };
        AuditEntryFactory_1.prototype.businessEventSummary = function (method, pathNorm, req, outcome) {
            var _a, _b;
            if (outcome !== 'success') {
                return undefined;
            }
            return ((_b = (_a = this.rawMaterialsBulkSummary(method, pathNorm, req)) !== null && _a !== void 0 ? _a : this.vendorProposalSummary(method, pathNorm, req)) !== null && _b !== void 0 ? _b : this.productContentOrUploadSummary(method, pathNorm, req));
        };
        AuditEntryFactory_1.prototype.rawMaterialsBulkSummary = function (method, pathNorm, req) {
            var _a, _b, _c;
            var bulk = this.rawMaterialsBulkRow(method, pathNorm, req);
            if (!(bulk === null || bulk === void 0 ? void 0 : bulk.isFinalRow)) {
                return undefined;
            }
            var body = this.bodyObj(req);
            var urnNo = this.stringField(body, 'urnNo');
            var batchKey = (_c = (_b = (_a = this.stringField(body, 'auditBatchId')) !== null && _a !== void 0 ? _a : this.stringField(body, 'batchId')) !== null && _b !== void 0 ? _b : this.stringField(body, 'uploadBatchId')) !== null && _c !== void 0 ? _c : "".concat(urnNo !== null && urnNo !== void 0 ? urnNo : 'unknown', ":").concat(bulk.totalRows);
            var auditEventId = "raw-materials-hazardous-products:bulk:".concat(this.hashId(batchKey));
            return {
                auditEventId: auditEventId,
                module: audit_friendlies_1.AUDIT_MODULE.RAW_MATERIALS,
                action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                entity_name: urnNo,
                description: 'Raw materials hazardous products bulk upload completed',
                new_values: {
                    urnNo: urnNo,
                    operation: 'bulk_upload',
                    completedRows: bulk.totalRows,
                    totalRows: bulk.totalRows,
                },
                resource: urnNo
                    ? {
                        type: 'RawMaterialsHazardousProducts',
                        id: urnNo,
                        urn_no: urnNo,
                    }
                    : undefined,
                metadata: {
                    business_event_type: 'raw_materials_hazardous_products_bulk_upload',
                    consolidated: true,
                    row_index: bulk.rowIndex,
                    total_rows: bulk.totalRows,
                },
            };
        };
        AuditEntryFactory_1.prototype.vendorProposalSummary = function (method, pathNorm, req) {
            var _a;
            if (method.toUpperCase() !== 'PATCH' ||
                !/^\/payments\/[^/]+\/vendor-proposal-approval$/.test(pathNorm)) {
                return undefined;
            }
            var body = this.bodyObj(req);
            var urnNo = pathNorm.split('/').filter(Boolean)[1];
            var status = body === null || body === void 0 ? void 0 : body['vendorProposalApprovalStatus'];
            var statusNum = typeof status === 'number'
                ? status
                : typeof status === 'string' && status.trim() !== ''
                    ? Number(status)
                    : NaN;
            if (statusNum !== 1 && statusNum !== 2) {
                return undefined;
            }
            var paymentType = (_a = this.stringField(body, 'paymentType')) !== null && _a !== void 0 ? _a : 'registration';
            var remarks = this.stringField(body, 'proposalRejectionRemarks');
            var decodedUrn = urnNo ? decodeURIComponent(urnNo) : undefined;
            return {
                auditEventId: "proposal-review:".concat(this.hashId("".concat(decodedUrn !== null && decodedUrn !== void 0 ? decodedUrn : 'unknown', ":").concat(paymentType, ":").concat(statusNum))),
                module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
                action_type: statusNum === 2 ? audit_friendlies_1.AUDIT_ACTION_TYPE.REJECT : audit_friendlies_1.AUDIT_ACTION_TYPE.APPROVE,
                entity_name: decodedUrn,
                description: statusNum === 2
                    ? 'Proposal rejected by vendor'
                    : 'Proposal approved by vendor',
                new_values: __assign({ urnNo: decodedUrn, paymentType: paymentType, vendorProposalApprovalStatus: statusNum }, (remarks ? { proposalRejectionRemarks: remarks } : {})),
                resource: decodedUrn
                    ? { type: 'Proposal', id: decodedUrn, urn_no: decodedUrn }
                    : undefined,
                metadata: {
                    business_event_type: 'vendor_proposal_review',
                    consolidated: true,
                    related_domain_events: ['payment_update', 'activity_timeline_entry'],
                },
            };
        };
        AuditEntryFactory_1.prototype.rawMaterialsBulkRow = function (method, pathNorm, req) {
            if (method.toUpperCase() !== 'POST' ||
                pathNorm !== '/raw-materials-hazardous-products') {
                return undefined;
            }
            var body = this.bodyObj(req);
            var rowIndex = this.numberField(body, 'rowIndex');
            var totalRows = this.numberField(body, 'totalRows');
            if (rowIndex === undefined ||
                totalRows === undefined ||
                totalRows <= 1 ||
                rowIndex < 0 ||
                rowIndex >= totalRows) {
                return undefined;
            }
            return {
                rowIndex: rowIndex,
                totalRows: totalRows,
                isFinalRow: rowIndex === totalRows - 1,
            };
        };
        AuditEntryFactory_1.prototype.productContentOrUploadSummary = function (method, pathNorm, req) {
            var _a, _b;
            var methodUpper = method.toUpperCase();
            if (!['PATCH', 'PUT'].includes(methodUpper)) {
                return undefined;
            }
            if (this.isStatusRoute(pathNorm)) {
                return undefined;
            }
            if (!this.isProductContentOrUploadRoute(pathNorm)) {
                return undefined;
            }
            var body = this.bodyObj(req);
            var fileSnapshot = this.valueTransformer.safeFileSnapshot(req);
            var uploadEvent = Boolean(fileSnapshot === null || fileSnapshot === void 0 ? void 0 : fileSnapshot.length);
            var newValues = this.productContentSnapshot(body);
            var entityName = (_b = (_a = this.stringField(body, 'urnNo')) !== null && _a !== void 0 ? _a : this.stringField(body, 'eoiNo')) !== null && _b !== void 0 ? _b : this.pathEntityId(pathNorm);
            return {
                module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                entity_name: entityName,
                description: uploadEvent
                    ? 'Product document uploaded'
                    : 'Product content saved',
                new_values: newValues,
                resource: entityName
                    ? {
                        type: uploadEvent ? 'ProductDocument' : 'Product',
                        id: entityName,
                        urn_no: this.stringField(body, 'urnNo'),
                    }
                    : undefined,
                metadata: {
                    business_event_type: uploadEvent
                        ? 'product_document_upload'
                        : 'product_content_save',
                    content_event: true,
                },
            };
        };
        AuditEntryFactory_1.prototype.productContentSnapshot = function (body) {
            var snapshot = this.valueTransformer.safeBodySnapshot(body);
            if (!snapshot) {
                return undefined;
            }
            var statusKeys = new Set([
                'productStatus',
                'productRenewStatus',
                'urnStatus',
                'updateStatusType',
                'updateStatusTo',
            ]);
            for (var _i = 0, statusKeys_1 = statusKeys; _i < statusKeys_1.length; _i++) {
                var key = statusKeys_1[_i];
                delete snapshot[key];
            }
            return Object.keys(snapshot).length ? snapshot : undefined;
        };
        AuditEntryFactory_1.prototype.isProductContentOrUploadRoute = function (pathNorm) {
            return (/^\/product-registration\/[^/]+$/.test(pathNorm) ||
                /^\/api\/admin\/products\/certified\/[^/]+(?:\/passport)?$/.test(pathNorm) ||
                /^\/products\/certified\/[^/]+$/.test(pathNorm));
        };
        AuditEntryFactory_1.prototype.isExplicitNoopStatusChange = function (req) {
            var oldValues = req.__auditOldValues;
            var newValues = req.__auditNewValues;
            if (!oldValues || !newValues) {
                return false;
            }
            var keys = ['updateStatusTo', 'urnStatus', 'productStatus'];
            return keys.some(function (key) {
                return oldValues[key] !== undefined &&
                    newValues[key] !== undefined &&
                    String(oldValues[key]) === String(newValues[key]);
            });
        };
        AuditEntryFactory_1.prototype.isStatusRoute = function (pathNorm) {
            return (pathNorm.endsWith('/api/admin/products/urn-status') ||
                /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm) ||
                pathNorm.endsWith('/products/urn-status'));
        };
        AuditEntryFactory_1.prototype.stringField = function (body, key) {
            var value = body === null || body === void 0 ? void 0 : body[key];
            if (typeof value !== 'string') {
                return undefined;
            }
            var trimmed = value.trim();
            return trimmed || undefined;
        };
        AuditEntryFactory_1.prototype.numberField = function (body, key) {
            var value = body === null || body === void 0 ? void 0 : body[key];
            var num = typeof value === 'number'
                ? value
                : typeof value === 'string' && value.trim() !== ''
                    ? Number(value)
                    : NaN;
            return Number.isInteger(num) ? num : undefined;
        };
        AuditEntryFactory_1.prototype.hashId = function (value) {
            return (0, crypto_1.createHash)('sha256').update(value).digest('hex').slice(0, 24);
        };
        AuditEntryFactory_1.prototype.pathEntityId = function (pathNorm) {
            var parts = pathNorm.split('/').filter(Boolean);
            var last = parts.at(-1);
            if (!last || last === 'passport') {
                return parts.at(-2);
            }
            return decodeURIComponent(last);
        };
        AuditEntryFactory_1.prototype.inferResource = function (method, pathNorm, req) {
            var _a, _b;
            var pay = pathNorm.match(/^\/payments\/([^/]+)$/);
            if (pay) {
                var urn = decodeURIComponent(pay[1]);
                return { type: 'Payment', id: urn, urn_no: urn };
            }
            if (method.toUpperCase() === 'PATCH' &&
                (pathNorm.endsWith('/api/admin/products/urn-status') ||
                    /\/admin\/urn\/([^/]+)\/status$/i.test(pathNorm))) {
                var urnFromPath = (_a = pathNorm.match(/\/admin\/urn\/([^/]+)\/status$/i)) === null || _a === void 0 ? void 0 : _a[1];
                var urn = (urnFromPath ? decodeURIComponent(urnFromPath) : undefined) ||
                    (typeof ((_b = req.body) === null || _b === void 0 ? void 0 : _b.urnNo) === 'string'
                        ? req.body.urnNo.trim()
                        : undefined);
                if (urn) {
                    return { type: 'Product', id: urn, urn_no: urn };
                }
            }
            if (method.toUpperCase() === 'POST' && pathNorm.endsWith('/activity-log')) {
                var body = req.body;
                var urn = typeof (body === null || body === void 0 ? void 0 : body.urn_no) === 'string' ? body.urn_no.trim() : undefined;
                if (urn) {
                    return { type: 'ActivityLog', urn_no: urn };
                }
            }
            return undefined;
        };
        AuditEntryFactory_1.prototype.mergeResource = function (base, meta, req) {
            var _a, _b;
            var out = __assign({}, (base !== null && base !== void 0 ? base : {}));
            if (!meta) {
                return Object.keys(out).length ? out : undefined;
            }
            if (meta.resource_type) {
                out.type = meta.resource_type;
            }
            if (meta.resource_param && ((_a = req.params) === null || _a === void 0 ? void 0 : _a[meta.resource_param])) {
                out.id = String(req.params[meta.resource_param]);
            }
            if (meta.urn_param && ((_b = req.params) === null || _b === void 0 ? void 0 : _b[meta.urn_param])) {
                out.urn_no = String(req.params[meta.urn_param]);
            }
            return Object.values(out).some(function (v) { return v !== undefined; }) ? out : undefined;
        };
        AuditEntryFactory_1.prototype.actorFromUser = function (user) {
            if (!user || typeof user !== 'object') {
                return undefined;
            }
            return {
                user_id: user['userId'] !== undefined ? String(user['userId']) : undefined,
                role: user['role'] !== undefined ? String(user['role']) : undefined,
                vendor_id: user['vendorId'] !== undefined ? String(user['vendorId']) : undefined,
                manufacturer_id: user['manufacturerId'] !== undefined
                    ? String(user['manufacturerId'])
                    : undefined,
            };
        };
        AuditEntryFactory_1.prototype.bodyObj = function (req) {
            var body = req.body;
            if (!body || typeof body !== 'object' || Array.isArray(body)) {
                return undefined;
            }
            return body;
        };
        AuditEntryFactory_1.prototype.clientIp = function (req) {
            var _a;
            var xff = req.headers['x-forwarded-for'];
            if (typeof xff === 'string' && xff.trim()) {
                return xff.split(',')[0].trim();
            }
            if (Array.isArray(xff) && xff[0]) {
                return String(xff[0]).split(',')[0].trim();
            }
            return req.ip || ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress);
        };
        AuditEntryFactory_1.prototype.truncateUa = function (ua, max) {
            if (max === void 0) { max = 256; }
            if (!ua) {
                return undefined;
            }
            return ua.length <= max ? ua : ua.slice(0, max);
        };
        AuditEntryFactory_1.prototype.truncateMessage = function (msg, max) {
            if (max === void 0) { max = 400; }
            if (!msg) {
                return undefined;
            }
            var value = String(msg);
            return value.length <= max ? value : value.slice(0, max);
        };
        return AuditEntryFactory_1;
    }());
    __setFunctionName(_classThis, "AuditEntryFactory");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditEntryFactory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditEntryFactory = _classThis;
}();
exports.AuditEntryFactory = AuditEntryFactory;
