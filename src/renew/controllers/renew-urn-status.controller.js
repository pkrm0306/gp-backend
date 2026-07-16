"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.RenewUrnStatusController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var RenewUrnStatusController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Renew - URN Status'), (0, common_1.Controller)('renew'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _updateRenewUrnStatus_decorators;
    var RenewUrnStatusController = _classThis = /** @class */ (function () {
        function RenewUrnStatusController_1(renewUrnStatusService) {
            this.renewUrnStatusService = (__runInitializers(this, _instanceExtraInitializers), renewUrnStatusService);
        }
        RenewUrnStatusController_1.prototype.updateRenewUrnStatus = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var actorContext, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            actorContext = this.resolveActorContext(user);
                            return [4 /*yield*/, this.renewUrnStatusService.updateRenewUrnStatus(dto, actorContext)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, __assign({ success: true }, result)];
                    }
                });
            });
        };
        RenewUrnStatusController_1.prototype.resolveActorContext = function (user) {
            var _a, _b, _c, _d, _e, _f, _g;
            var userId = String((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.sub) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user._id) !== null && _c !== void 0 ? _c : '').trim();
            if (!userId) {
                throw new common_1.BadRequestException('User ID not found in token');
            }
            var role = String((_e = (_d = user === null || user === void 0 ? void 0 : user.role) !== null && _d !== void 0 ? _d : user === null || user === void 0 ? void 0 : user.type) !== null && _e !== void 0 ? _e : '').toLowerCase();
            if (role === 'admin') {
                return { actor: 'admin', userId: userId };
            }
            var vendorOrManufacturerId = String((_g = (_f = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _f !== void 0 ? _f : user === null || user === void 0 ? void 0 : user.manufacturerId) !== null && _g !== void 0 ? _g : '').trim();
            if (!vendorOrManufacturerId) {
                throw new common_1.BadRequestException('Vendor organization ID not found in token');
            }
            return {
                actor: 'vendor',
                userId: userId,
                vendorOrManufacturerId: vendorOrManufacturerId,
            };
        };
        return RenewUrnStatusController_1;
    }());
    __setFunctionName(_classThis, "RenewUrnStatusController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _updateRenewUrnStatus_decorators = [(0, common_1.Patch)('urn-status'), (0, swagger_1.ApiOperation)({
                summary: 'Update renewal URN status (12–17, 11 completed)',
                description: 'Renewal-only status transitions. Do not use PATCH /api/admin/products/urn-status for renew flows. ' +
                    'Admin submit for final review: updateStatusTo 17 with renewalCycleId completes renewal (persists urnStatus 11, productRenewStatus 2, dates). ' +
                    'Vendor: submit for review (14→15, 16→15). Admin: payment approve (13→14), resend (15→16).',
            })];
        __esDecorate(_classThis, null, _updateRenewUrnStatus_decorators, { kind: "method", name: "updateRenewUrnStatus", static: false, private: false, access: { has: function (obj) { return "updateRenewUrnStatus" in obj; }, get: function (obj) { return obj.updateRenewUrnStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewUrnStatusController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewUrnStatusController = _classThis;
}();
exports.RenewUrnStatusController = RenewUrnStatusController;
