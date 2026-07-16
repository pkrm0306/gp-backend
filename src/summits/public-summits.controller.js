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
exports.PublicSummitsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../common/decorators/public.decorator");
var PublicSummitsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Website Summits'), (0, common_1.Controller)('website/summits'), (0, public_decorator_1.Public)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _listRoot_decorators;
    var _getBySlug_decorators;
    var PublicSummitsController = _classThis = /** @class */ (function () {
        function PublicSummitsController_1(summitsService) {
            this.summitsService = (__runInitializers(this, _instanceExtraInitializers), summitsService);
        }
        PublicSummitsController_1.prototype.list = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.summitsService.buildPublicListResponse(query, origin)];
                });
            });
        };
        PublicSummitsController_1.prototype.listRoot = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.list(req, query)];
                });
            });
        };
        PublicSummitsController_1.prototype.getBySlug = function (req, slug) {
            return __awaiter(this, void 0, void 0, function () {
                var origin, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            origin = "".concat(req.protocol, "://").concat(req.get('host'));
                            return [4 /*yield*/, this.summitsService.findPublishedBySlug(slug, origin)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Summit retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return PublicSummitsController_1;
    }());
    __setFunctionName(_classThis, "PublicSummitsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)('list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public summit listing (active only)',
                description: 'Returns paginated summits with `status: active` only (legacy `published` included). ' +
                    'Each row includes `coverImageUrl`, `excerpt`, and nested `preview` for card rendering. ' +
                    'Default: page=1, limit=12 (max 50).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated active summits' })];
        _listRoot_decorators = [(0, common_1.Get)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public summit listing (alias of GET /website/summits/list)',
                description: 'Same paginated card preview payload as `/website/summits/list` — `coverImageUrl`, `excerpt`, and `preview`.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated active summits' })];
        _getBySlug_decorators = [(0, common_1.Get)(':slug'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public summit detail by slug',
                description: 'Active summits only. `data.visibleSections` lists filled sections for tab/nav rendering. ' +
                    'Inactive summits return 404.',
            }), (0, swagger_1.ApiParam)({ name: 'slug', example: 'greenpro-summit-2026' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found or inactive' })];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listRoot_decorators, { kind: "method", name: "listRoot", static: false, private: false, access: { has: function (obj) { return "listRoot" in obj; }, get: function (obj) { return obj.listRoot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBySlug_decorators, { kind: "method", name: "getBySlug", static: false, private: false, access: { has: function (obj) { return "getBySlug" in obj; }, get: function (obj) { return obj.getBySlug; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PublicSummitsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PublicSummitsController = _classThis;
}();
exports.PublicSummitsController = PublicSummitsController;
