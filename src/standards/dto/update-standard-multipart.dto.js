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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStandardMultipartDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var sectors_array_from_form_transform_1 = require("./sectors-array-from-form.transform");
var sector_id_from_form_transform_1 = require("./sector-id-from-form.transform");
var UpdateStandardMultipartDto = function () {
    var _a;
    var _sectors_decorators;
    var _sectors_initializers = [];
    var _sectors_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _member_decorators;
    var _member_initializers = [];
    var _member_extraInitializers = [];
    var _sector_ids_decorators;
    var _sector_ids_initializers = [];
    var _sector_ids_extraInitializers = [];
    var _member_decorators_1;
    var _member_initializers_1 = [];
    var _member_extraInitializers_1 = [];
    var _sectorIds_decorators;
    var _sectorIds_initializers = [];
    var _sectorIds_extraInitializers = [];
    var _member_decorators_2;
    var _member_initializers_2 = [];
    var _member_extraInitializers_2 = [];
    var _sector_id_decorators;
    var _sector_id_initializers = [];
    var _sector_id_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _category_ids_decorators;
    var _category_ids_initializers = [];
    var _category_ids_extraInitializers = [];
    var _member_decorators_3;
    var _member_initializers_3 = [];
    var _member_extraInitializers_3 = [];
    var _categoryIds_decorators;
    var _categoryIds_initializers = [];
    var _categoryIds_extraInitializers = [];
    var _member_decorators_4;
    var _member_initializers_4 = [];
    var _member_extraInitializers_4 = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _resource_standard_type_decorators;
    var _resource_standard_type_initializers = [];
    var _resource_standard_type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _remove_file_decorators;
    var _remove_file_initializers = [];
    var _remove_file_extraInitializers = [];
    var _delete_file_decorators;
    var _delete_file_initializers = [];
    var _delete_file_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateStandardMultipartDto() {
                this.sectors = __runInitializers(this, _sectors_initializers, void 0);
                this.sector = (__runInitializers(this, _sectors_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
                this['sectors[]'] = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _member_initializers, void 0));
                this.sector_ids = (__runInitializers(this, _member_extraInitializers), __runInitializers(this, _sector_ids_initializers, void 0));
                this['sector_ids[]'] = (__runInitializers(this, _sector_ids_extraInitializers), __runInitializers(this, _member_initializers_1, void 0));
                this.sectorIds = (__runInitializers(this, _member_extraInitializers_1), __runInitializers(this, _sectorIds_initializers, void 0));
                this['sectorIds[]'] = (__runInitializers(this, _sectorIds_extraInitializers), __runInitializers(this, _member_initializers_2, void 0));
                /** Legacy admin UI aliases (ignored when **sectors** / **sector_ids** are sent). */
                this.sector_id = (__runInitializers(this, _member_extraInitializers_2), __runInitializers(this, _sector_id_initializers, void 0));
                this.category_id = (__runInitializers(this, _sector_id_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.category_ids = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _category_ids_initializers, void 0));
                this['category_ids[]'] = (__runInitializers(this, _category_ids_extraInitializers), __runInitializers(this, _member_initializers_3, void 0));
                this.categoryIds = (__runInitializers(this, _member_extraInitializers_3), __runInitializers(this, _categoryIds_initializers, void 0));
                this['categoryIds[]'] = (__runInitializers(this, _categoryIds_extraInitializers), __runInitializers(this, _member_initializers_4, void 0));
                this.name = (__runInitializers(this, _member_extraInitializers_4), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.resource_standard_type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _resource_standard_type_initializers, void 0));
                /** Ignored on multipart update. Use PATCH `.../status` to change active/inactive. */
                this.status = (__runInitializers(this, _resource_standard_type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                /** Admin UI: remove attached PDF without uploading a replacement (handled in service). */
                this.remove_file = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _remove_file_initializers, void 0));
                this.delete_file = (__runInitializers(this, _remove_file_extraInitializers), __runInitializers(this, _delete_file_initializers, void 0));
                __runInitializers(this, _delete_file_extraInitializers);
            }
            return UpdateStandardMultipartDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sectors_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'When sent, replaces linked categories with **all** categories in **each** selected sector (multiselect). Omit all sector fields to leave categories unchanged.',
                    type: [Number],
                    example: [1, 3],
                }), (0, sectors_array_from_form_transform_1.SectorsArrayFromForm)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.Min)(1, { each: true })];
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Legacy single sector id; when sent alone, same as one **sectors** entry.',
                    example: 2,
                }), (0, sector_id_from_form_transform_1.SectorIdFromForm)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)({ message: 'sector must be an integer' }), (0, class_validator_1.Min)(1, { message: 'sector must be a positive integer' })];
            _member_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _sector_ids_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _member_decorators_1 = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _sectorIds_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _member_decorators_2 = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _sector_id_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _category_id_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _category_ids_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _member_decorators_3 = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _categoryIds_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _member_decorators_4 = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _resource_standard_type_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1)];
            _status_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _remove_file_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            _delete_file_decorators = [(0, class_validator_1.Allow)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _sectors_decorators, { kind: "field", name: "sectors", static: false, private: false, access: { has: function (obj) { return "sectors" in obj; }, get: function (obj) { return obj.sectors; }, set: function (obj, value) { obj.sectors = value; } }, metadata: _metadata }, _sectors_initializers, _sectors_extraInitializers);
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _member_decorators, { kind: "field", name: 'sectors[]', static: false, private: false, access: { has: function (obj) { return 'sectors[]' in obj; }, get: function (obj) { return obj['sectors[]']; }, set: function (obj, value) { obj['sectors[]'] = value; } }, metadata: _metadata }, _member_initializers, _member_extraInitializers);
            __esDecorate(null, null, _sector_ids_decorators, { kind: "field", name: "sector_ids", static: false, private: false, access: { has: function (obj) { return "sector_ids" in obj; }, get: function (obj) { return obj.sector_ids; }, set: function (obj, value) { obj.sector_ids = value; } }, metadata: _metadata }, _sector_ids_initializers, _sector_ids_extraInitializers);
            __esDecorate(null, null, _member_decorators_1, { kind: "field", name: 'sector_ids[]', static: false, private: false, access: { has: function (obj) { return 'sector_ids[]' in obj; }, get: function (obj) { return obj['sector_ids[]']; }, set: function (obj, value) { obj['sector_ids[]'] = value; } }, metadata: _metadata }, _member_initializers_1, _member_extraInitializers_1);
            __esDecorate(null, null, _sectorIds_decorators, { kind: "field", name: "sectorIds", static: false, private: false, access: { has: function (obj) { return "sectorIds" in obj; }, get: function (obj) { return obj.sectorIds; }, set: function (obj, value) { obj.sectorIds = value; } }, metadata: _metadata }, _sectorIds_initializers, _sectorIds_extraInitializers);
            __esDecorate(null, null, _member_decorators_2, { kind: "field", name: 'sectorIds[]', static: false, private: false, access: { has: function (obj) { return 'sectorIds[]' in obj; }, get: function (obj) { return obj['sectorIds[]']; }, set: function (obj, value) { obj['sectorIds[]'] = value; } }, metadata: _metadata }, _member_initializers_2, _member_extraInitializers_2);
            __esDecorate(null, null, _sector_id_decorators, { kind: "field", name: "sector_id", static: false, private: false, access: { has: function (obj) { return "sector_id" in obj; }, get: function (obj) { return obj.sector_id; }, set: function (obj, value) { obj.sector_id = value; } }, metadata: _metadata }, _sector_id_initializers, _sector_id_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _category_ids_decorators, { kind: "field", name: "category_ids", static: false, private: false, access: { has: function (obj) { return "category_ids" in obj; }, get: function (obj) { return obj.category_ids; }, set: function (obj, value) { obj.category_ids = value; } }, metadata: _metadata }, _category_ids_initializers, _category_ids_extraInitializers);
            __esDecorate(null, null, _member_decorators_3, { kind: "field", name: 'category_ids[]', static: false, private: false, access: { has: function (obj) { return 'category_ids[]' in obj; }, get: function (obj) { return obj['category_ids[]']; }, set: function (obj, value) { obj['category_ids[]'] = value; } }, metadata: _metadata }, _member_initializers_3, _member_extraInitializers_3);
            __esDecorate(null, null, _categoryIds_decorators, { kind: "field", name: "categoryIds", static: false, private: false, access: { has: function (obj) { return "categoryIds" in obj; }, get: function (obj) { return obj.categoryIds; }, set: function (obj, value) { obj.categoryIds = value; } }, metadata: _metadata }, _categoryIds_initializers, _categoryIds_extraInitializers);
            __esDecorate(null, null, _member_decorators_4, { kind: "field", name: 'categoryIds[]', static: false, private: false, access: { has: function (obj) { return 'categoryIds[]' in obj; }, get: function (obj) { return obj['categoryIds[]']; }, set: function (obj, value) { obj['categoryIds[]'] = value; } }, metadata: _metadata }, _member_initializers_4, _member_extraInitializers_4);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _resource_standard_type_decorators, { kind: "field", name: "resource_standard_type", static: false, private: false, access: { has: function (obj) { return "resource_standard_type" in obj; }, get: function (obj) { return obj.resource_standard_type; }, set: function (obj, value) { obj.resource_standard_type = value; } }, metadata: _metadata }, _resource_standard_type_initializers, _resource_standard_type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _remove_file_decorators, { kind: "field", name: "remove_file", static: false, private: false, access: { has: function (obj) { return "remove_file" in obj; }, get: function (obj) { return obj.remove_file; }, set: function (obj, value) { obj.remove_file = value; } }, metadata: _metadata }, _remove_file_initializers, _remove_file_extraInitializers);
            __esDecorate(null, null, _delete_file_decorators, { kind: "field", name: "delete_file", static: false, private: false, access: { has: function (obj) { return "delete_file" in obj; }, get: function (obj) { return obj.delete_file; }, set: function (obj, value) { obj.delete_file = value; } }, metadata: _metadata }, _delete_file_initializers, _delete_file_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateStandardMultipartDto = UpdateStandardMultipartDto;
