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
exports.ProductDocumentUploadNotificationHelper = void 0;
var common_1 = require("@nestjs/common");
/**
 * Fire-and-forget admin feed when process / product documents are uploaded.
 */
var ProductDocumentUploadNotificationHelper = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductDocumentUploadNotificationHelper = _classThis = /** @class */ (function () {
        function ProductDocumentUploadNotificationHelper_1(lifecycleNotification) {
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(ProductDocumentUploadNotificationHelper.name);
        }
        ProductDocumentUploadNotificationHelper_1.prototype.notifyAfterDocumentsUploaded = function (manufacturerId, uploadedFileCount, urnNo) {
            var _this = this;
            if (!(manufacturerId === null || manufacturerId === void 0 ? void 0 : manufacturerId.trim()) || uploadedFileCount <= 0) {
                return;
            }
            this.lifecycleNotification
                .notifyDocumentUploaded({
                manufacturerId: manufacturerId.trim(),
                urnNo: urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim(),
            })
                .catch(function (err) {
                return _this.logger.warn("[notifyAfterDocumentsUploaded] failed for manufacturer ".concat(manufacturerId, ": ").concat(err === null || err === void 0 ? void 0 : err.message));
            });
        };
        return ProductDocumentUploadNotificationHelper_1;
    }());
    __setFunctionName(_classThis, "ProductDocumentUploadNotificationHelper");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductDocumentUploadNotificationHelper = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductDocumentUploadNotificationHelper = _classThis;
}();
exports.ProductDocumentUploadNotificationHelper = ProductDocumentUploadNotificationHelper;
