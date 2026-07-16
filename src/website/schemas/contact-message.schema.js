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
exports.ContactMessageSchema = exports.ContactMessage = exports.INQUIRY_TYPES = void 0;
var mongoose_1 = require("@nestjs/mongoose");
exports.INQUIRY_TYPES = ['contact', 'product'];
var ContactMessage = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _inquiryType_decorators;
    var _inquiryType_initializers = [];
    var _inquiryType_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phoneNumber_decorators;
    var _phoneNumber_initializers = [];
    var _phoneNumber_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _organisation_decorators;
    var _organisation_initializers = [];
    var _organisation_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _urnNumber_decorators;
    var _urnNumber_initializers = [];
    var _urnNumber_extraInitializers = [];
    var ContactMessage = _classThis = /** @class */ (function () {
        function ContactMessage_1() {
            this.inquiryType = __runInitializers(this, _inquiryType_initializers, void 0);
            this.name = (__runInitializers(this, _inquiryType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.subject = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.message = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.designation = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
            this.organisation = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _organisation_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _organisation_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.productId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.categoryId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.urnNumber = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _urnNumber_initializers, void 0));
            this.createdAt = __runInitializers(this, _urnNumber_extraInitializers);
        }
        return ContactMessage_1;
    }());
    __setFunctionName(_classThis, "ContactMessage");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _inquiryType_decorators = [(0, mongoose_1.Prop)({ enum: exports.INQUIRY_TYPES, default: 'contact', index: true })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _email_decorators = [(0, mongoose_1.Prop)({ required: false, lowercase: true, trim: true, index: true, default: '' })];
        _phoneNumber_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _subject_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _message_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _designation_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _organisation_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _productId_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _categoryId_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        _urnNumber_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true, default: '' })];
        __esDecorate(null, null, _inquiryType_decorators, { kind: "field", name: "inquiryType", static: false, private: false, access: { has: function (obj) { return "inquiryType" in obj; }, get: function (obj) { return obj.inquiryType; }, set: function (obj, value) { obj.inquiryType = value; } }, metadata: _metadata }, _inquiryType_initializers, _inquiryType_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: function (obj) { return "phoneNumber" in obj; }, get: function (obj) { return obj.phoneNumber; }, set: function (obj, value) { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
        __esDecorate(null, null, _organisation_decorators, { kind: "field", name: "organisation", static: false, private: false, access: { has: function (obj) { return "organisation" in obj; }, get: function (obj) { return obj.organisation; }, set: function (obj, value) { obj.organisation = value; } }, metadata: _metadata }, _organisation_initializers, _organisation_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _urnNumber_decorators, { kind: "field", name: "urnNumber", static: false, private: false, access: { has: function (obj) { return "urnNumber" in obj; }, get: function (obj) { return obj.urnNumber; }, set: function (obj, value) { obj.urnNumber = value; } }, metadata: _metadata }, _urnNumber_initializers, _urnNumber_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContactMessage = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContactMessage = _classThis;
}();
exports.ContactMessage = ContactMessage;
exports.ContactMessageSchema = mongoose_1.SchemaFactory.createForClass(ContactMessage);
