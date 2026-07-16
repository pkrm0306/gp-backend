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
exports.ZohoModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var redis_module_1 = require("../common/redis/redis.module");
var zoho_deal_mapping_schema_1 = require("./schemas/zoho-deal-mapping.schema");
var zoho_lead_mapping_schema_1 = require("./schemas/zoho-lead-mapping.schema");
var zoho_sync_log_schema_1 = require("./schemas/zoho-sync-log.schema");
var zoho_token_schema_1 = require("./schemas/zoho-token.schema");
var zoho_sync_queue_service_1 = require("./jobs/zoho-sync-queue.service");
var zoho_api_client_service_1 = require("./services/zoho-api-client.service");
var zoho_deals_service_1 = require("./services/zoho-deals.service");
var zoho_leads_service_1 = require("./services/zoho-leads.service");
var zoho_token_service_1 = require("./services/zoho-token.service");
var ZohoModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                redis_module_1.RedisModule,
                mongoose_1.MongooseModule.forFeature([
                    { name: zoho_token_schema_1.ZohoToken.name, schema: zoho_token_schema_1.ZohoTokenSchema },
                    { name: zoho_lead_mapping_schema_1.ZohoLeadMapping.name, schema: zoho_lead_mapping_schema_1.ZohoLeadMappingSchema },
                    { name: zoho_deal_mapping_schema_1.ZohoDealMapping.name, schema: zoho_deal_mapping_schema_1.ZohoDealMappingSchema },
                    { name: zoho_sync_log_schema_1.ZohoSyncLog.name, schema: zoho_sync_log_schema_1.ZohoSyncLogSchema },
                ]),
            ],
            providers: [
                zoho_token_service_1.ZohoTokenService,
                zoho_api_client_service_1.ZohoApiClientService,
                zoho_leads_service_1.ZohoLeadsService,
                zoho_deals_service_1.ZohoDealsService,
                zoho_sync_queue_service_1.ZohoSyncQueueService,
            ],
            exports: [
                zoho_token_service_1.ZohoTokenService,
                zoho_api_client_service_1.ZohoApiClientService,
                zoho_leads_service_1.ZohoLeadsService,
                zoho_deals_service_1.ZohoDealsService,
                zoho_sync_queue_service_1.ZohoSyncQueueService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZohoModule = _classThis = /** @class */ (function () {
        function ZohoModule_1() {
        }
        return ZohoModule_1;
    }());
    __setFunctionName(_classThis, "ZohoModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoModule = _classThis;
}();
exports.ZohoModule = ZohoModule;
