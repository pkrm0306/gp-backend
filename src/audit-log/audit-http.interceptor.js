"use strict";
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
exports.AuditHttpInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var audit_decorator_1 = require("./decorators/audit.decorator");
var AuditHttpInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditHttpInterceptor = _classThis = /** @class */ (function () {
        function AuditHttpInterceptor_1(auditLogService, reflector, auditEntryFactory) {
            this.auditLogService = auditLogService;
            this.reflector = reflector;
            this.auditEntryFactory = auditEntryFactory;
        }
        AuditHttpInterceptor_1.prototype.intercept = function (context, next) {
            var _this = this;
            if (context.getType() !== 'http') {
                return next.handle();
            }
            var http = context.switchToHttp();
            var req = http.getRequest();
            var res = http.getResponse();
            var method = (req.method || 'GET').toUpperCase();
            // Use the resolved URL (real param values), not the route template (`:urnNo`).
            var resolvedPath = (req.originalUrl || req.url || '/').split('?')[0] || '/';
            var pathNorm = this.auditEntryFactory.normalizePath(resolvedPath);
            if (!this.auditEntryFactory.shouldAudit(method, pathNorm)) {
                return next.handle();
            }
            var started = Date.now();
            var auditReq = req;
            var correlationId = this.auditEntryFactory.newCorrelationId(req);
            auditReq.auditCorrelationId = correlationId;
            auditReq.auditEventId = this.auditEntryFactory.newAuditEventId();
            res.setHeader('X-Request-Id', correlationId);
            var auditMeta = this.reflector.getAllAndOverride(audit_decorator_1.AUDIT_METADATA_KEY, [context.getHandler(), context.getClass()]);
            return next.handle().pipe((0, operators_1.tap)(function (responseBody) {
                auditReq.__auditResponseBody = responseBody;
                req.__auditOutcome = 'success';
                req.__auditStatus = res.statusCode || 200;
            }), (0, operators_1.catchError)(function (err) {
                var status = err instanceof common_1.HttpException
                    ? err.getStatus()
                    : typeof (err === null || err === void 0 ? void 0 : err.status) === 'number'
                        ? err.status
                        : 500;
                var r = req;
                r.__auditOutcome = 'failure';
                r.__auditStatus = status;
                r.__auditErr =
                    err instanceof Error
                        ? err.message
                        : typeof err === 'string'
                            ? err
                            : undefined;
                return (0, rxjs_1.throwError)(function () { return err; });
            }), (0, operators_1.finalize)(function () {
                var _a, _b;
                var r = req;
                var outcome = r.__auditOutcome === 'failure' ? 'failure' : 'success';
                var statusCode = (_b = (_a = r.__auditStatus) !== null && _a !== void 0 ? _a : res.statusCode) !== null && _b !== void 0 ? _b : 500;
                if (!_this.auditEntryFactory.shouldRecordHttpAudit({
                    req: auditReq,
                    method: method,
                    pathNorm: pathNorm,
                    outcome: outcome,
                })) {
                    return;
                }
                void _this.auditLogService.record(_this.auditEntryFactory.create({
                    req: auditReq,
                    method: method,
                    resolvedPath: resolvedPath,
                    pathNorm: pathNorm,
                    outcome: outcome,
                    statusCode: statusCode,
                    startedAt: started,
                    errorMessage: r.__auditErr,
                    auditMeta: auditMeta,
                }));
            }));
        };
        return AuditHttpInterceptor_1;
    }());
    __setFunctionName(_classThis, "AuditHttpInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditHttpInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditHttpInterceptor = _classThis;
}();
exports.AuditHttpInterceptor = AuditHttpInterceptor;
