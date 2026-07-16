"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var SectorsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Sectors'), (0, common_1.Controller)('api/sectors')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _exportCsv_decorators;
    var _findOne_decorators;
    var _create_decorators;
    var _update_decorators;
    var _patchStatus_decorators;
    var _remove_decorators;
    var SectorsController = _classThis = /** @class */ (function () {
        function SectorsController_1(sectorsService) {
            this.sectorsService = (__runInitializers(this, _instanceExtraInitializers), sectorsService);
        }
        SectorsController_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sectorsService.findAllPaginated(query)];
                });
            });
        };
        /** Must be registered before GET :id */
        SectorsController_1.prototype.exportCsv = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var csv, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sectorsService.buildCsvExport(query)];
                        case 1:
                            csv = _a.sent();
                            buf = Buffer.from(csv, 'utf-8');
                            return [2 /*return*/, new common_1.StreamableFile(buf, {
                                    type: 'text/csv; charset=utf-8',
                                    disposition: 'attachment; filename="sectors-export.csv"',
                                })];
                    }
                });
            });
        };
        SectorsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.sectorsService.parseSectorId(id);
                            return [4 /*yield*/, this.sectorsService.findOneById(numericId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sector retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        SectorsController_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sectorsService.create(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sector created successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        SectorsController_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.sectorsService.parseSectorId(id);
                            return [4 /*yield*/, this.sectorsService.update(numericId, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sector updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        SectorsController_1.prototype.patchStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.sectorsService.parseSectorId(id);
                            return [4 /*yield*/, this.sectorsService.updateStatus(numericId, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sector status updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        SectorsController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var numericId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numericId = this.sectorsService.parseSectorId(id);
                            return [4 /*yield*/, this.sectorsService.softDelete(numericId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sector deleted successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return SectorsController_1;
    }());
    __setFunctionName(_classThis, "SectorsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'List sectors (paginated)',
                description: 'Pagination, search on name (case-insensitive), filter by status, sort by id or name. Example: ?page=1&limit=10&search=IT&status=1&sortBy=id&order=desc (limit up to 500; for full export use GET /api/sectors/export).',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Paginated list with total, page, limit',
            })];
        _exportCsv_decorators = [(0, common_1.Get)('export'), (0, swagger_1.ApiOperation)({
                summary: 'Export sectors as CSV',
                description: 'Applies same search and status filters as the list (no pagination).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file download' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get sector by id' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric sector id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create sector' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Created' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update sector name, description and/or status' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric sector id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        _patchStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Set sector status (active/inactive)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric sector id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Soft delete sector' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Numeric sector id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'Sector is assigned to one or more categories',
            })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCsv_decorators, { kind: "method", name: "exportCsv", static: false, private: false, access: { has: function (obj) { return "exportCsv" in obj; }, get: function (obj) { return obj.exportCsv; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchStatus_decorators, { kind: "method", name: "patchStatus", static: false, private: false, access: { has: function (obj) { return "patchStatus" in obj; }, get: function (obj) { return obj.patchStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SectorsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SectorsController = _classThis;
}();
exports.SectorsController = SectorsController;
