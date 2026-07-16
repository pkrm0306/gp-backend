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
exports.PlantMergeController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../../common/constants/permissions.constants");
var merge_eligibility_shared_1 = require("../helpers/merge-eligibility.shared");
var PlantMergeController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Plant Merge'), (0, common_1.Controller)('api/admin/products/plant-merge'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _validate_decorators;
    var _urnPreview_decorators;
    var _preview_decorators;
    var _urnExecute_decorators;
    var _execute_decorators;
    var PlantMergeController = _classThis = /** @class */ (function () {
        function PlantMergeController_1(plantMergeService, plantMergeUrnPreviewService, plantMergeUrnValidationService, plantMergeUrnExecuteService) {
            this.plantMergeService = (__runInitializers(this, _instanceExtraInitializers), plantMergeService);
            this.plantMergeUrnPreviewService = plantMergeUrnPreviewService;
            this.plantMergeUrnValidationService = plantMergeUrnValidationService;
            this.plantMergeUrnExecuteService = plantMergeUrnExecuteService;
        }
        PlantMergeController_1.prototype.validate = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plantMergeUrnValidationService.validate(dto)];
                });
            });
        };
        PlantMergeController_1.prototype.urnPreview = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plantMergeUrnPreviewService.previewBySourceUrn(query.sourceUrnNo)];
                });
            });
        };
        PlantMergeController_1.prototype.preview = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var sourcePlantIds;
                return __generator(this, function (_a) {
                    sourcePlantIds = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(query.sourcePlantIds)
                        .split(',')
                        .map(function (id) { return id.trim(); })
                        .filter(Boolean);
                    return [2 /*return*/, this.plantMergeService.preview(query.productId, query.targetPlantId, sourcePlantIds)];
                });
            });
        };
        PlantMergeController_1.prototype.adminUserId = function (user) {
            var _a, _b;
            var adminUserId = String((_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : '').trim();
            if (!adminUserId) {
                throw new common_1.BadRequestException('Admin user id not found in token');
            }
            return adminUserId;
        };
        PlantMergeController_1.prototype.urnExecute = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plantMergeUrnExecuteService.execute(dto, this.adminUserId(user))];
                });
            });
        };
        PlantMergeController_1.prototype.execute = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plantMergeService.execute(dto, this.adminUserId(user))];
                });
            });
        };
        return PlantMergeController_1;
    }());
    __setFunctionName(_classThis, "PlantMergeController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _validate_decorators = [(0, common_1.Post)('validate'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Validate a plant merge pair (source URN/EOI → target URN/EOI)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result with blockers' })];
        _urnPreview_decorators = [(0, common_1.Get)('urn-preview'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({
                summary: 'Preview plant merge targets for each certified EOI on a source URN (read-only)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'URN-level plant merge target preview' })];
        _preview_decorators = [(0, common_1.Get)('preview'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({ summary: 'Preview merging source plants into a target plant' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Plant merge preview' })];
        _urnExecute_decorators = [(0, common_1.Post)('urn-execute'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Execute URN-level plant merge (copy source product plants to target products)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'URN-level plant merge completed' })];
        _execute_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Execute plant merge (absorb source plants into target plant)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Plant merge completed' })];
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: function (obj) { return "validate" in obj; }, get: function (obj) { return obj.validate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _urnPreview_decorators, { kind: "method", name: "urnPreview", static: false, private: false, access: { has: function (obj) { return "urnPreview" in obj; }, get: function (obj) { return obj.urnPreview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _preview_decorators, { kind: "method", name: "preview", static: false, private: false, access: { has: function (obj) { return "preview" in obj; }, get: function (obj) { return obj.preview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _urnExecute_decorators, { kind: "method", name: "urnExecute", static: false, private: false, access: { has: function (obj) { return "urnExecute" in obj; }, get: function (obj) { return obj.urnExecute; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _execute_decorators, { kind: "method", name: "execute", static: false, private: false, access: { has: function (obj) { return "execute" in obj; }, get: function (obj) { return obj.execute; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeController = _classThis;
}();
exports.PlantMergeController = PlantMergeController;
