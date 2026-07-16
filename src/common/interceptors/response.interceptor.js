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
exports.ResponseInterceptor = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var ResponseInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ResponseInterceptor = _classThis = /** @class */ (function () {
        function ResponseInterceptor_1() {
        }
        ResponseInterceptor_1.prototype.intercept = function (context, next) {
            var req = context.switchToHttp().getRequest();
            var url = (req === null || req === void 0 ? void 0 : req.url) || '';
            /** CSV/binary exports and raw file streams must not be wrapped as JSON */
            if (url.includes('/sectors/export') ||
                url.includes('/standards/export') ||
                url.includes('/categories/export') ||
                url.includes('/api/manufacturers/export') ||
                url.includes('/api/admin/products/export') ||
                url.includes('/products/certificates/') ||
                /\/api\/standards\/[^/]+\/file(?:\?|$)/.test(url)) {
                return next.handle();
            }
            return next.handle().pipe((0, operators_1.map)(function (data) {
                if (data == null || typeof data !== 'object') {
                    return data;
                }
                var payload = data;
                var response = {
                    success: true,
                    message: payload.message || 'Success',
                    data: payload.data !== undefined ? payload.data : data,
                };
                /** Preserve top-level fields (e.g. renewContext) when controller also returns `data`. */
                for (var _i = 0, _a = Object.entries(payload); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (key === 'message' || key === 'success' || key === 'data') {
                        continue;
                    }
                    if (value !== undefined) {
                        response[key] = value;
                    }
                }
                var metrics = data;
                if ((payload === null || payload === void 0 ? void 0 : payload.pagination) !== undefined) {
                    response.pagination = payload.pagination;
                }
                if ((payload === null || payload === void 0 ? void 0 : payload.meta) !== undefined) {
                    response.meta = payload.meta;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.total) === 'number') {
                    response.total = payload.total;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.page) === 'number') {
                    response.page = payload.page;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.limit) === 'number') {
                    response.limit = payload.limit;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.totalCount) === 'number') {
                    response.totalCount = payload.totalCount;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.currentPage) === 'number') {
                    response.currentPage = payload.currentPage;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.totalPages) === 'number') {
                    response.totalPages = payload.totalPages;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.unreadCount) === 'number') {
                    response.unreadCount = payload.unreadCount;
                }
                if (typeof (payload === null || payload === void 0 ? void 0 : payload.markedCount) === 'number') {
                    response.markedCount = payload.markedCount;
                }
                var withUrn = data;
                if (typeof withUrn.urnStatus === 'number' &&
                    !Number.isNaN(withUrn.urnStatus)) {
                    response.urnStatus = withUrn.urnStatus;
                }
                return response;
            }));
        };
        return ResponseInterceptor_1;
    }());
    __setFunctionName(_classThis, "ResponseInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResponseInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResponseInterceptor = _classThis;
}();
exports.ResponseInterceptor = ResponseInterceptor;
