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
exports.HttpExceptionFilter = void 0;
var common_1 = require("@nestjs/common");
var HttpExceptionFilter = function () {
    var _classDecorators = [(0, common_1.Catch)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HttpExceptionFilter = _classThis = /** @class */ (function () {
        function HttpExceptionFilter_1() {
        }
        HttpExceptionFilter_1.prototype.catch = function (exception, host) {
            var _a;
            var ctx = host.switchToHttp();
            var response = ctx.getResponse();
            var request = ctx.getRequest();
            var status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            var message = 'Internal server error';
            var error = 'Internal Server Error';
            if (exception instanceof common_1.HttpException) {
                status = exception.getStatus();
                var exceptionResponse = exception.getResponse();
                if (typeof exceptionResponse === 'string') {
                    message = exceptionResponse;
                }
                else if (typeof exceptionResponse === 'object') {
                    var responseObj = exceptionResponse;
                    message = responseObj.message || message;
                    error = responseObj.error || error;
                }
            }
            else if (exception instanceof SyntaxError) {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = this.formatInvalidJsonMessage(exception.message);
                error = 'Bad Request';
            }
            else if (typeof exception === 'object' &&
                exception !== null &&
                exception.type === 'entity.parse.failed') {
                status = common_1.HttpStatus.BAD_REQUEST;
                var parseMessage = exception.message || 'Invalid JSON body';
                message = this.formatInvalidJsonMessage(parseMessage);
                error = 'Bad Request';
            }
            else if (typeof exception === 'object' &&
                exception !== null &&
                exception.type === 'entity.too.large') {
                status = common_1.HttpStatus.PAYLOAD_TOO_LARGE;
                message =
                    'Request body is too large. For bulk product upload, split into smaller batches or contact support.';
                error = 'Payload Too Large';
            }
            if (Array.isArray(message)) {
                message = message.join('; ');
            }
            // Server-side diagnostic logging (sanitized response is still returned to client)
            var reqMethod = (request === null || request === void 0 ? void 0 : request.method) || 'UNKNOWN';
            var reqPath = (request === null || request === void 0 ? void 0 : request.path) || (request === null || request === void 0 ? void 0 : request.url) || 'UNKNOWN_PATH';
            var isMissingStaticUpload = status === common_1.HttpStatus.NOT_FOUND &&
                reqMethod === 'GET' &&
                typeof reqPath === 'string' &&
                reqPath.startsWith('/uploads');
            if (!isMissingStaticUpload) {
                console.error("[HttpExceptionFilter] ".concat(reqMethod, " ").concat(reqPath, " -> ").concat(status), {
                    message: message,
                    error: error,
                    exceptionName: exception === null || exception === void 0 ? void 0 : exception.name,
                    exceptionMessage: exception === null || exception === void 0 ? void 0 : exception.message,
                    stack: exception === null || exception === void 0 ? void 0 : exception.stack,
                    response: exception instanceof common_1.HttpException ? exception.getResponse() : null,
                });
            }
            if (status === common_1.HttpStatus.BAD_REQUEST &&
                request.method === 'POST' &&
                request.path === '/auth/login' &&
                Array.isArray(message)) {
                message = "".concat(message.join(' '), " \u2014 No login data received. Use Body \u2192 raw \u2192 JSON (Content-Type: application/json) or x-www-form-urlencoded with keys email and password; do not use Body \u2192 none.");
            }
            var apiResponse = {
                success: false,
                message: message,
                error: error,
            };
            if (exception instanceof common_1.HttpException) {
                var body = exception.getResponse();
                if (body && typeof body === 'object' && !Array.isArray(body)) {
                    var extra = body;
                    if (extra.code && typeof extra.code === 'string') {
                        apiResponse.code = extra.code;
                    }
                    var fieldErrorSource = (_a = extra.fieldErrors) !== null && _a !== void 0 ? _a : extra.errors;
                    if (fieldErrorSource &&
                        typeof fieldErrorSource === 'object' &&
                        !Array.isArray(fieldErrorSource)) {
                        apiResponse.fieldErrors = fieldErrorSource;
                    }
                    if (Array.isArray(extra.issues)) {
                        apiResponse.issues = extra.issues;
                    }
                }
            }
            response.status(status).json(apiResponse);
        };
        HttpExceptionFilter_1.prototype.formatInvalidJsonMessage = function (raw) {
            if (/bad control character|unexpected token|json at position/i.test(raw)) {
                return ('Invalid JSON request body. String values cannot contain raw line breaks — ' +
                    'use \\n inside the string (e.g. "line one\\nline two") or keep text on one line.');
            }
            return raw || 'Invalid JSON request body';
        };
        return HttpExceptionFilter_1;
    }());
    __setFunctionName(_classThis, "HttpExceptionFilter");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HttpExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HttpExceptionFilter = _classThis;
}();
exports.HttpExceptionFilter = HttpExceptionFilter;
