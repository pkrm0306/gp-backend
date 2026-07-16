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
exports.ManufacturersController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var update_vendor_status_dto_1 = require("./dto/update-vendor-status.dto");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var manufacturer_image_upload_config_1 = require("./manufacturer-image-upload.config");
var upload_file_util_1 = require("../utils/upload-file.util");
var ManufacturersController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Manufacturers'), (0, common_1.Controller)('api/manufacturers'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _exportFile_decorators;
    var _findAll_decorators;
    var _checkVendorEmail_decorators;
    var _checkVendorPhone_decorators;
    var _update_decorators;
    var _verify_decorators;
    var _updateStatus_decorators;
    var _updateVendorStatus_decorators;
    var _remove_decorators;
    var ManufacturersController = _classThis = /** @class */ (function () {
        function ManufacturersController_1(manufacturersService) {
            this.manufacturersService = (__runInitializers(this, _instanceExtraInitializers), manufacturersService);
        }
        ManufacturersController_1.prototype.exportFile = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var format, _a, buffer, fileName, csv, buf;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            format = (_b = query.format) !== null && _b !== void 0 ? _b : 'csv';
                            if (!(format === 'xlsx')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.manufacturersService.buildXlsxExport(query)];
                        case 1:
                            _a = _c.sent(), buffer = _a.buffer, fileName = _a.fileName;
                            return [2 /*return*/, new common_1.StreamableFile(buffer, {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    disposition: "attachment; filename=\"".concat(fileName, "\""),
                                })];
                        case 2: return [4 /*yield*/, this.manufacturersService.buildCsvExport(query)];
                        case 3:
                            csv = _c.sent();
                            buf = Buffer.from(csv, 'utf-8');
                            return [2 /*return*/, new common_1.StreamableFile(buf, {
                                    type: 'text/csv; charset=utf-8',
                                    disposition: 'attachment; filename="manufacturers-export.csv"',
                                })];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!query.id) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.manufacturersService.findByIdForApi(query.id)];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            return [2 /*return*/, {
                                    message: 'Manufacturer retrieved successfully',
                                    data: manufacturer,
                                }];
                        case 2: return [2 /*return*/, this.manufacturersService.findAllPaginated(query)];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.checkVendorEmail = function (id, email) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, available;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(email !== null && email !== void 0 ? email : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Query parameter "email" is required');
                            }
                            return [4 /*yield*/, this.manufacturersService.isVendorEmailAvailableForManufacturer(id, trimmed)];
                        case 1:
                            available = _a.sent();
                            return [2 /*return*/, {
                                    message: available
                                        ? 'Email is available'
                                        : 'This email id is already registered',
                                    data: { available: available },
                                }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.checkVendorPhone = function (id, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, available;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(phone !== null && phone !== void 0 ? phone : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Query parameter "phone" is required');
                            }
                            return [4 /*yield*/, this.manufacturersService.isVendorPhoneAvailableForManufacturer(id, trimmed)];
                        case 1:
                            available = _a.sent();
                            return [2 /*return*/, {
                                    message: available
                                        ? 'Phone number is available'
                                        : 'Phone number already exists',
                                    data: { available: available },
                                }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.update = function (id, dto, files) {
            return __awaiter(this, void 0, void 0, function () {
                var image, imagePath, _a, data;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            image = (_c = (_b = files === null || files === void 0 ? void 0 : files.image) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : (_d = files === null || files === void 0 ? void 0 : files.manufacturer_image) === null || _d === void 0 ? void 0 : _d[0];
                            if (!image) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(image, 'manufacturers')];
                        case 1:
                            _a = (_f.sent()).fileUrl;
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _f.label = 3;
                        case 3:
                            imagePath = _a;
                            return [4 /*yield*/, this.manufacturersService.updateManufacturerDetails(id, dto, imagePath)];
                        case 4:
                            _f.sent();
                            return [4 /*yield*/, this.manufacturersService.findByIdForApi(id)];
                        case 5:
                            data = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : null;
                            return [2 /*return*/, { message: 'Manufacturer updated successfully', data: data }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.verify = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.verifyManufacturer(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Manufacturer verified successfully', data: data }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data_1, data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!((dto === null || dto === void 0 ? void 0 : dto.manufacturerStatus) === 1)) return [3 /*break*/, 2];
                            if (dto.vendor_status === 0) {
                                throw new common_1.BadRequestException('When manufacturerStatus is set to 1, vendor_status cannot be 0');
                            }
                            return [4 /*yield*/, this.manufacturersService.verifyManufacturer(id)];
                        case 1:
                            data_1 = _b.sent();
                            return [2 /*return*/, { message: 'Manufacturer status updated successfully', data: data_1 }];
                        case 2:
                            if (!((dto === null || dto === void 0 ? void 0 : dto.vendor_status) === 0 || (dto === null || dto === void 0 ? void 0 : dto.vendor_status) === 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manufacturersService.setVendorStatusForVerified(id, dto.vendor_status)];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.manufacturersService.toggleManufacturerStatus(id)];
                        case 5:
                            _a = _b.sent();
                            _b.label = 6;
                        case 6:
                            data = _a;
                            return [2 /*return*/, { message: 'Manufacturer status updated successfully', data: data }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.updateVendorStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.setVendorStatusForVerified(id, dto.vendor_status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Vendor status updated',
                                    data: { _id: data._id, vendor_status: data.vendor_status },
                                }];
                    }
                });
            });
        };
        ManufacturersController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.deleteManufacturerWithConstraint(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Manufacturer deleted successfully', data: data }];
                    }
                });
            });
        };
        return ManufacturersController_1;
    }());
    __setFunctionName(_classThis, "ManufacturersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _exportFile_decorators = [(0, common_1.Get)('export'), (0, swagger_1.ApiOperation)({
                summary: 'Export manufacturers (CSV or Excel)',
                description: 'Same filters and sort as the paginated list (search, manufacturerName, gpInternalId, manufacturerInitial, manufacturerStatus, vendor_status, sortBy, order). Omits pagination and returns every matching row. Optional `id` exports a single manufacturer. Use `format=xlsx` for an Excel workbook that includes **Initial** and **Status** (On/Off) like the admin grid; default `format=csv`.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV or XLSX download' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'List manufacturers (paginated)',
                description: 'Pagination (`page`, `limit`) with filters: **gpInternalId** (manufacturer ID), **manufacturerInitial** (initial), **manufacturerName** (name), **search** (global). ' +
                    'For the **verified manufacturers** screen use `scope=verified` and optional **status** multiselect: `active` (vendor on) / `inactive` (vendor off) — comma-separated or repeated, e.g. `status=active` or `status=active,inactive`. ' +
                    'Legacy numeric filter: `vendor_status` or `vendor_status_list=0,1`. Sort: `sortBy`, `order`. Requires JWT.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Paginated list with total, page, limit',
            })];
        _checkVendorEmail_decorators = [(0, common_1.Get)(':id/check-vendor-email'), (0, swagger_1.ApiOperation)({
                summary: 'Check vendor email uniqueness',
                description: 'Returns whether **email** is available for this manufacturer (not used by another manufacturer or portal user).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: '{ available: boolean }' })];
        _checkVendorPhone_decorators = [(0, common_1.Get)(':id/check-vendor-phone'), (0, swagger_1.ApiOperation)({
                summary: 'Check vendor phone uniqueness',
                description: 'Returns whether **phone** is available globally (not used by another manufacturer, admin, vendor, staff, or partner).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: '{ available: boolean }' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'image', maxCount: 1 },
                { name: 'manufacturer_image', maxCount: 1 },
            ], (0, manufacturer_image_upload_config_1.manufacturerImageMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Update manufacturer',
                description: 'Updates manufacturer name (required). **gpInternalId** / **manufacturerInitial** are auto-generated while the manufacturer is **unverified**; optional for verified. Optional vendor fields and image.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['manufacturerName'],
                    properties: {
                        manufacturerName: { type: 'string' },
                        gpInternalId: {
                            type: 'string',
                            description: 'Optional when verified; ignored when unverified (auto).',
                            example: 'GPGP-001',
                        },
                        manufacturerInitial: {
                            type: 'string',
                            description: 'Optional when verified; ignored when unverified (auto).',
                        },
                        vendor_name: { type: 'string' },
                        vendor_email: { type: 'string' },
                        vendor_phone: { type: 'string' },
                        image: {
                            type: 'string',
                            format: 'binary',
                            description: 'Manufacturer image (optional)',
                        },
                        manufacturer_image: {
                            type: 'string',
                            format: 'binary',
                            description: 'Alternative image field name (optional)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Manufacturer updated' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        _verify_decorators = [(0, common_1.Patch)(':id/verify'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verify unverified manufacturer',
                description: 'Sets manufacturerStatus=1 and vendor_status=1.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Manufacturer verified' })];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Change manufacturer status',
                description: 'Supports: (1) manufacturerStatus=1 -> verifies manufacturer and sets vendor_status=1, (2) vendor_status=0/1 -> sets vendor status for verified manufacturer, (3) empty body -> toggles vendor_status between 0/1 while keeping manufacturerStatus=1.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiBody)({ type: update_vendor_status_dto_1.UpdateVendorStatusDto, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        _updateVendorStatus_decorators = [(0, common_1.Patch)(':id/vendor-status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update vendor active/inactive (verified only)',
                description: 'Lightweight status update for verified manufacturers. manufacturerStatus stays 1; only vendor_status changes (0/1).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' }), (0, swagger_1.ApiBody)({ type: update_vendor_status_dto_1.UpdateVendorStatusDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor status updated' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation / business rule error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Delete verified manufacturer with constraints',
                description: 'Delete is blocked when manufacturer_product_count > 0 or manufacturer_vendor_count > 0.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Manufacturer MongoDB id' })];
        __esDecorate(_classThis, null, _exportFile_decorators, { kind: "method", name: "exportFile", static: false, private: false, access: { has: function (obj) { return "exportFile" in obj; }, get: function (obj) { return obj.exportFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkVendorEmail_decorators, { kind: "method", name: "checkVendorEmail", static: false, private: false, access: { has: function (obj) { return "checkVendorEmail" in obj; }, get: function (obj) { return obj.checkVendorEmail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkVendorPhone_decorators, { kind: "method", name: "checkVendorPhone", static: false, private: false, access: { has: function (obj) { return "checkVendorPhone" in obj; }, get: function (obj) { return obj.checkVendorPhone; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verify_decorators, { kind: "method", name: "verify", static: false, private: false, access: { has: function (obj) { return "verify" in obj; }, get: function (obj) { return obj.verify; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVendorStatus_decorators, { kind: "method", name: "updateVendorStatus", static: false, private: false, access: { has: function (obj) { return "updateVendorStatus" in obj; }, get: function (obj) { return obj.updateVendorStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManufacturersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManufacturersController = _classThis;
}();
exports.ManufacturersController = ManufacturersController;
