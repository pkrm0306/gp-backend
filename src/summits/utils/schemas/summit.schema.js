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
exports.SummitSchema = exports.Summit = exports.SummitSponsorItem = exports.SummitSpeakerItem = exports.SummitFocusAreaCard = exports.SummitFocusPointItem = exports.SummitCardItem = exports.SummitTextItem = exports.SummitPdfItem = exports.SummitBannerItem = exports.SummitRichTextBlock = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const summit_constants_1 = require("../constants/summit.constants");
let SummitRichTextBlock = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    var SummitRichTextBlock = _classThis = class {
        constructor() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            __runInitializers(this, _content_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitRichTextBlock");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _content_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitRichTextBlock = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitRichTextBlock = _classThis;
})();
exports.SummitRichTextBlock = SummitRichTextBlock;
let SummitBannerItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _imageUrl_decorators;
    let _imageUrl_initializers = [];
    let _imageUrl_extraInitializers = [];
    var SummitBannerItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            __runInitializers(this, _imageUrl_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitBannerItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _imageUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: obj => "imageUrl" in obj, get: obj => obj.imageUrl, set: (obj, value) => { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitBannerItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitBannerItem = _classThis;
})();
exports.SummitBannerItem = SummitBannerItem;
let SummitPdfItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    var SummitPdfItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.title = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            __runInitializers(this, _fileName_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitPdfItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _title_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _fileUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _fileName_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitPdfItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitPdfItem = _classThis;
})();
exports.SummitPdfItem = SummitPdfItem;
let SummitTextItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    var SummitTextItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.text = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _text_initializers, void 0));
            __runInitializers(this, _text_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitTextItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _text_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitTextItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitTextItem = _classThis;
})();
exports.SummitTextItem = SummitTextItem;
/** Card row for Highlights / Event Outcomes tabs. */
let SummitCardItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    var SummitCardItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.heading = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
            this.description = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            /** @deprecated legacy flat bullet — migrated to description on read */
            this.text = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _text_initializers, void 0));
            __runInitializers(this, _text_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitCardItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _heading_decorators = [(0, mongoose_1.Prop)({ default: '', maxlength: 75 })];
        _description_decorators = [(0, mongoose_1.Prop)({ default: '', maxlength: 75 })];
        _text_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitCardItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitCardItem = _classThis;
})();
exports.SummitCardItem = SummitCardItem;
let SummitFocusPointItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    var SummitFocusPointItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.text = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _text_initializers, void 0));
            __runInitializers(this, _text_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitFocusPointItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _text_decorators = [(0, mongoose_1.Prop)({ default: '', maxlength: 75 })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitFocusPointItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitFocusPointItem = _classThis;
})();
exports.SummitFocusPointItem = SummitFocusPointItem;
let SummitFocusAreaCard = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _points_decorators;
    let _points_initializers = [];
    let _points_extraInitializers = [];
    var SummitFocusAreaCard = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.heading = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
            this.points = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _points_initializers, void 0));
            __runInitializers(this, _points_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitFocusAreaCard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _heading_decorators = [(0, mongoose_1.Prop)({ default: '', maxlength: 75 })];
        _points_decorators = [(0, mongoose_1.Prop)({ type: [SummitFocusPointItem], default: [] })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: obj => "points" in obj, get: obj => obj.points, set: (obj, value) => { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitFocusAreaCard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitFocusAreaCard = _classThis;
})();
exports.SummitFocusAreaCard = SummitFocusAreaCard;
let SummitSpeakerItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _designation_decorators;
    let _designation_initializers = [];
    let _designation_extraInitializers = [];
    let _organisation_decorators;
    let _organisation_initializers = [];
    let _organisation_extraInitializers = [];
    let _sub_decorators;
    let _sub_initializers = [];
    let _sub_extraInitializers = [];
    let _keyPoint_decorators;
    let _keyPoint_initializers = [];
    let _keyPoint_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _imageUrl_decorators;
    let _imageUrl_initializers = [];
    let _imageUrl_extraInitializers = [];
    var SummitSpeakerItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.name = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.designation = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
            this.organisation = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _organisation_initializers, void 0));
            this.sub = (__runInitializers(this, _organisation_extraInitializers), __runInitializers(this, _sub_initializers, void 0));
            this.keyPoint = (__runInitializers(this, _sub_extraInitializers), __runInitializers(this, _keyPoint_initializers, void 0));
            this.tags = (__runInitializers(this, _keyPoint_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            __runInitializers(this, _imageUrl_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitSpeakerItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _name_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _designation_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _organisation_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _sub_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _keyPoint_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _tags_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _imageUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: obj => "designation" in obj, get: obj => obj.designation, set: (obj, value) => { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
        __esDecorate(null, null, _organisation_decorators, { kind: "field", name: "organisation", static: false, private: false, access: { has: obj => "organisation" in obj, get: obj => obj.organisation, set: (obj, value) => { obj.organisation = value; } }, metadata: _metadata }, _organisation_initializers, _organisation_extraInitializers);
        __esDecorate(null, null, _sub_decorators, { kind: "field", name: "sub", static: false, private: false, access: { has: obj => "sub" in obj, get: obj => obj.sub, set: (obj, value) => { obj.sub = value; } }, metadata: _metadata }, _sub_initializers, _sub_extraInitializers);
        __esDecorate(null, null, _keyPoint_decorators, { kind: "field", name: "keyPoint", static: false, private: false, access: { has: obj => "keyPoint" in obj, get: obj => obj.keyPoint, set: (obj, value) => { obj.keyPoint = value; } }, metadata: _metadata }, _keyPoint_initializers, _keyPoint_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: obj => "imageUrl" in obj, get: obj => obj.imageUrl, set: (obj, value) => { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitSpeakerItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitSpeakerItem = _classThis;
})();
exports.SummitSpeakerItem = SummitSpeakerItem;
let SummitSponsorItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _logoUrl_decorators;
    let _logoUrl_initializers = [];
    let _logoUrl_extraInitializers = [];
    var SummitSponsorItem = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.name = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.tier = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
            this.logoUrl = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
            __runInitializers(this, _logoUrl_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SummitSponsorItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sortOrder_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _name_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _tier_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: summit_constants_1.SUMMIT_SPONSOR_TIERS,
                default: 'Partner',
            })];
        _logoUrl_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
        __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: obj => "logoUrl" in obj, get: obj => obj.logoUrl, set: (obj, value) => { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitSponsorItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitSponsorItem = _classThis;
})();
exports.SummitSponsorItem = SummitSponsorItem;
let Summit = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'summits',
            timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _banners_decorators;
    let _banners_initializers = [];
    let _banners_extraInitializers = [];
    let _industrialPdfs_decorators;
    let _industrialPdfs_initializers = [];
    let _industrialPdfs_extraInitializers = [];
    let _buildingsPdfs_decorators;
    let _buildingsPdfs_initializers = [];
    let _buildingsPdfs_extraInitializers = [];
    let _aboutGreenPro_decorators;
    let _aboutGreenPro_initializers = [];
    let _aboutGreenPro_extraInitializers = [];
    let _aboutSummit_decorators;
    let _aboutSummit_initializers = [];
    let _aboutSummit_extraInitializers = [];
    let _highlightsTitle_decorators;
    let _highlightsTitle_initializers = [];
    let _highlightsTitle_extraInitializers = [];
    let _highlights_decorators;
    let _highlights_initializers = [];
    let _highlights_extraInitializers = [];
    let _focusedAreaTitle_decorators;
    let _focusedAreaTitle_initializers = [];
    let _focusedAreaTitle_extraInitializers = [];
    let _focusedAreas_decorators;
    let _focusedAreas_initializers = [];
    let _focusedAreas_extraInitializers = [];
    let _areaPoints_decorators;
    let _areaPoints_initializers = [];
    let _areaPoints_extraInitializers = [];
    let _eventOutcomesTitle_decorators;
    let _eventOutcomesTitle_initializers = [];
    let _eventOutcomesTitle_extraInitializers = [];
    let _eventOutcomes_decorators;
    let _eventOutcomes_initializers = [];
    let _eventOutcomes_extraInitializers = [];
    let _speakers_decorators;
    let _speakers_initializers = [];
    let _speakers_extraInitializers = [];
    let _agendaTitle_decorators;
    let _agendaTitle_initializers = [];
    let _agendaTitle_extraInitializers = [];
    let _agendaPoints_decorators;
    let _agendaPoints_initializers = [];
    let _agendaPoints_extraInitializers = [];
    let _agenda_decorators;
    let _agenda_initializers = [];
    let _agenda_extraInitializers = [];
    let _agendaTitleLegacy_decorators;
    let _agendaTitleLegacy_initializers = [];
    let _agendaTitleLegacy_extraInitializers = [];
    let _sponsorsTitle_decorators;
    let _sponsorsTitle_initializers = [];
    let _sponsorsTitle_extraInitializers = [];
    let _sponsors_decorators;
    let _sponsors_initializers = [];
    let _sponsors_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Summit = _classThis = class {
        constructor() {
            this.year = __runInitializers(this, _year_initializers, void 0);
            this.title = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.slug = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.date = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.location = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.status = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.banners = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _banners_initializers, void 0));
            this.industrialPdfs = (__runInitializers(this, _banners_extraInitializers), __runInitializers(this, _industrialPdfs_initializers, void 0));
            this.buildingsPdfs = (__runInitializers(this, _industrialPdfs_extraInitializers), __runInitializers(this, _buildingsPdfs_initializers, void 0));
            this.aboutGreenPro = (__runInitializers(this, _buildingsPdfs_extraInitializers), __runInitializers(this, _aboutGreenPro_initializers, void 0));
            this.aboutSummit = (__runInitializers(this, _aboutGreenPro_extraInitializers), __runInitializers(this, _aboutSummit_initializers, void 0));
            this.highlightsTitle = (__runInitializers(this, _aboutSummit_extraInitializers), __runInitializers(this, _highlightsTitle_initializers, void 0));
            this.highlights = (__runInitializers(this, _highlightsTitle_extraInitializers), __runInitializers(this, _highlights_initializers, void 0));
            this.focusedAreaTitle = (__runInitializers(this, _highlights_extraInitializers), __runInitializers(this, _focusedAreaTitle_initializers, void 0));
            this.focusedAreas = (__runInitializers(this, _focusedAreaTitle_extraInitializers), __runInitializers(this, _focusedAreas_initializers, void 0));
            /** @deprecated legacy flat bullets — migrated to focusedAreas on read */
            this.areaPoints = (__runInitializers(this, _focusedAreas_extraInitializers), __runInitializers(this, _areaPoints_initializers, void 0));
            this.eventOutcomesTitle = (__runInitializers(this, _areaPoints_extraInitializers), __runInitializers(this, _eventOutcomesTitle_initializers, void 0));
            this.eventOutcomes = (__runInitializers(this, _eventOutcomesTitle_extraInitializers), __runInitializers(this, _eventOutcomes_initializers, void 0));
            this.speakers = (__runInitializers(this, _eventOutcomes_extraInitializers), __runInitializers(this, _speakers_initializers, void 0));
            this.agendaTitle = (__runInitializers(this, _speakers_extraInitializers), __runInitializers(this, _agendaTitle_initializers, void 0));
            /** Agenda point cards: heading + description (legacy rows may carry only `text`). */
            this.agendaPoints = (__runInitializers(this, _agendaTitle_extraInitializers), __runInitializers(this, _agendaPoints_initializers, void 0));
            /** @deprecated legacy rich-text agenda — migrated to agendaPoints on read */
            this.agenda = (__runInitializers(this, _agendaPoints_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
            /** @deprecated duplicate of agendaTitle — kept for legacy reads */
            this.agendaTitleLegacy = (__runInitializers(this, _agenda_extraInitializers), __runInitializers(this, _agendaTitleLegacy_initializers, void 0));
            this.sponsorsTitle = (__runInitializers(this, _agendaTitleLegacy_extraInitializers), __runInitializers(this, _sponsorsTitle_initializers, void 0));
            this.sponsors = (__runInitializers(this, _sponsorsTitle_extraInitializers), __runInitializers(this, _sponsors_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _sponsors_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Summit");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _year_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _title_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _slug_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, lowercase: true })];
        _date_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _location_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _status_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: summit_constants_1.SUMMIT_STATUSES,
                default: 'inactive',
            })];
        _banners_decorators = [(0, mongoose_1.Prop)({ type: [SummitBannerItem], default: [] })];
        _industrialPdfs_decorators = [(0, mongoose_1.Prop)({ type: [SummitPdfItem], default: [] })];
        _buildingsPdfs_decorators = [(0, mongoose_1.Prop)({ type: [SummitPdfItem], default: [] })];
        _aboutGreenPro_decorators = [(0, mongoose_1.Prop)({ type: SummitRichTextBlock, default: () => ({ title: '', content: '' }) })];
        _aboutSummit_decorators = [(0, mongoose_1.Prop)({ type: SummitRichTextBlock, default: () => ({ title: '', content: '' }) })];
        _highlightsTitle_decorators = [(0, mongoose_1.Prop)({ default: 'Highlights of GreenPro Summit' })];
        _highlights_decorators = [(0, mongoose_1.Prop)({ type: [SummitCardItem], default: [] })];
        _focusedAreaTitle_decorators = [(0, mongoose_1.Prop)({ default: 'Focused Area' })];
        _focusedAreas_decorators = [(0, mongoose_1.Prop)({ type: [SummitFocusAreaCard], default: [] })];
        _areaPoints_decorators = [(0, mongoose_1.Prop)({ type: [SummitTextItem], default: [] })];
        _eventOutcomesTitle_decorators = [(0, mongoose_1.Prop)({ default: 'Event Outcomes' })];
        _eventOutcomes_decorators = [(0, mongoose_1.Prop)({ type: [SummitCardItem], default: [] })];
        _speakers_decorators = [(0, mongoose_1.Prop)({ type: [SummitSpeakerItem], default: [] })];
        _agendaTitle_decorators = [(0, mongoose_1.Prop)({ default: "GreenPro's Core Agenda" })];
        _agendaPoints_decorators = [(0, mongoose_1.Prop)({ type: [SummitCardItem], default: [] })];
        _agenda_decorators = [(0, mongoose_1.Prop)({
                type: SummitRichTextBlock,
                default: () => ({ title: "GreenPro's Core Agenda", content: '' }),
            })];
        _agendaTitleLegacy_decorators = [(0, mongoose_1.Prop)()];
        _sponsorsTitle_decorators = [(0, mongoose_1.Prop)({ default: 'Our Sponsors & Partners' })];
        _sponsors_decorators = [(0, mongoose_1.Prop)({ type: [SummitSponsorItem], default: [] })];
        _deletedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _banners_decorators, { kind: "field", name: "banners", static: false, private: false, access: { has: obj => "banners" in obj, get: obj => obj.banners, set: (obj, value) => { obj.banners = value; } }, metadata: _metadata }, _banners_initializers, _banners_extraInitializers);
        __esDecorate(null, null, _industrialPdfs_decorators, { kind: "field", name: "industrialPdfs", static: false, private: false, access: { has: obj => "industrialPdfs" in obj, get: obj => obj.industrialPdfs, set: (obj, value) => { obj.industrialPdfs = value; } }, metadata: _metadata }, _industrialPdfs_initializers, _industrialPdfs_extraInitializers);
        __esDecorate(null, null, _buildingsPdfs_decorators, { kind: "field", name: "buildingsPdfs", static: false, private: false, access: { has: obj => "buildingsPdfs" in obj, get: obj => obj.buildingsPdfs, set: (obj, value) => { obj.buildingsPdfs = value; } }, metadata: _metadata }, _buildingsPdfs_initializers, _buildingsPdfs_extraInitializers);
        __esDecorate(null, null, _aboutGreenPro_decorators, { kind: "field", name: "aboutGreenPro", static: false, private: false, access: { has: obj => "aboutGreenPro" in obj, get: obj => obj.aboutGreenPro, set: (obj, value) => { obj.aboutGreenPro = value; } }, metadata: _metadata }, _aboutGreenPro_initializers, _aboutGreenPro_extraInitializers);
        __esDecorate(null, null, _aboutSummit_decorators, { kind: "field", name: "aboutSummit", static: false, private: false, access: { has: obj => "aboutSummit" in obj, get: obj => obj.aboutSummit, set: (obj, value) => { obj.aboutSummit = value; } }, metadata: _metadata }, _aboutSummit_initializers, _aboutSummit_extraInitializers);
        __esDecorate(null, null, _highlightsTitle_decorators, { kind: "field", name: "highlightsTitle", static: false, private: false, access: { has: obj => "highlightsTitle" in obj, get: obj => obj.highlightsTitle, set: (obj, value) => { obj.highlightsTitle = value; } }, metadata: _metadata }, _highlightsTitle_initializers, _highlightsTitle_extraInitializers);
        __esDecorate(null, null, _highlights_decorators, { kind: "field", name: "highlights", static: false, private: false, access: { has: obj => "highlights" in obj, get: obj => obj.highlights, set: (obj, value) => { obj.highlights = value; } }, metadata: _metadata }, _highlights_initializers, _highlights_extraInitializers);
        __esDecorate(null, null, _focusedAreaTitle_decorators, { kind: "field", name: "focusedAreaTitle", static: false, private: false, access: { has: obj => "focusedAreaTitle" in obj, get: obj => obj.focusedAreaTitle, set: (obj, value) => { obj.focusedAreaTitle = value; } }, metadata: _metadata }, _focusedAreaTitle_initializers, _focusedAreaTitle_extraInitializers);
        __esDecorate(null, null, _focusedAreas_decorators, { kind: "field", name: "focusedAreas", static: false, private: false, access: { has: obj => "focusedAreas" in obj, get: obj => obj.focusedAreas, set: (obj, value) => { obj.focusedAreas = value; } }, metadata: _metadata }, _focusedAreas_initializers, _focusedAreas_extraInitializers);
        __esDecorate(null, null, _areaPoints_decorators, { kind: "field", name: "areaPoints", static: false, private: false, access: { has: obj => "areaPoints" in obj, get: obj => obj.areaPoints, set: (obj, value) => { obj.areaPoints = value; } }, metadata: _metadata }, _areaPoints_initializers, _areaPoints_extraInitializers);
        __esDecorate(null, null, _eventOutcomesTitle_decorators, { kind: "field", name: "eventOutcomesTitle", static: false, private: false, access: { has: obj => "eventOutcomesTitle" in obj, get: obj => obj.eventOutcomesTitle, set: (obj, value) => { obj.eventOutcomesTitle = value; } }, metadata: _metadata }, _eventOutcomesTitle_initializers, _eventOutcomesTitle_extraInitializers);
        __esDecorate(null, null, _eventOutcomes_decorators, { kind: "field", name: "eventOutcomes", static: false, private: false, access: { has: obj => "eventOutcomes" in obj, get: obj => obj.eventOutcomes, set: (obj, value) => { obj.eventOutcomes = value; } }, metadata: _metadata }, _eventOutcomes_initializers, _eventOutcomes_extraInitializers);
        __esDecorate(null, null, _speakers_decorators, { kind: "field", name: "speakers", static: false, private: false, access: { has: obj => "speakers" in obj, get: obj => obj.speakers, set: (obj, value) => { obj.speakers = value; } }, metadata: _metadata }, _speakers_initializers, _speakers_extraInitializers);
        __esDecorate(null, null, _agendaTitle_decorators, { kind: "field", name: "agendaTitle", static: false, private: false, access: { has: obj => "agendaTitle" in obj, get: obj => obj.agendaTitle, set: (obj, value) => { obj.agendaTitle = value; } }, metadata: _metadata }, _agendaTitle_initializers, _agendaTitle_extraInitializers);
        __esDecorate(null, null, _agendaPoints_decorators, { kind: "field", name: "agendaPoints", static: false, private: false, access: { has: obj => "agendaPoints" in obj, get: obj => obj.agendaPoints, set: (obj, value) => { obj.agendaPoints = value; } }, metadata: _metadata }, _agendaPoints_initializers, _agendaPoints_extraInitializers);
        __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: obj => "agenda" in obj, get: obj => obj.agenda, set: (obj, value) => { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
        __esDecorate(null, null, _agendaTitleLegacy_decorators, { kind: "field", name: "agendaTitleLegacy", static: false, private: false, access: { has: obj => "agendaTitleLegacy" in obj, get: obj => obj.agendaTitleLegacy, set: (obj, value) => { obj.agendaTitleLegacy = value; } }, metadata: _metadata }, _agendaTitleLegacy_initializers, _agendaTitleLegacy_extraInitializers);
        __esDecorate(null, null, _sponsorsTitle_decorators, { kind: "field", name: "sponsorsTitle", static: false, private: false, access: { has: obj => "sponsorsTitle" in obj, get: obj => obj.sponsorsTitle, set: (obj, value) => { obj.sponsorsTitle = value; } }, metadata: _metadata }, _sponsorsTitle_initializers, _sponsorsTitle_extraInitializers);
        __esDecorate(null, null, _sponsors_decorators, { kind: "field", name: "sponsors", static: false, private: false, access: { has: obj => "sponsors" in obj, get: obj => obj.sponsors, set: (obj, value) => { obj.sponsors = value; } }, metadata: _metadata }, _sponsors_initializers, _sponsors_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Summit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Summit = _classThis;
})();
exports.Summit = Summit;
exports.SummitSchema = mongoose_1.SchemaFactory.createForClass(Summit);
exports.SummitSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
exports.SummitSchema.index({ year: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
exports.SummitSchema.index({ status: 1, year: 1, updatedAt: -1 });
exports.SummitSchema.index({ deletedAt: 1 });
