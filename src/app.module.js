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
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var mongoose_1 = require("@nestjs/mongoose");
var auth_module_1 = require("./auth/auth.module");
var manufacturers_module_1 = require("./manufacturers/manufacturers.module");
var vendor_users_module_1 = require("./vendor-users/vendor-users.module");
var partners_module_1 = require("./partners/partners.module");
var admin_module_1 = require("./admin/admin.module");
var states_module_1 = require("./states/states.module");
var categories_module_1 = require("./categories/categories.module");
var countries_module_1 = require("./countries/countries.module");
var product_registration_module_1 = require("./product-registration/product-registration.module");
var urn_merge_module_1 = require("./product-registration/urn-merge/urn-merge.module");
var plant_merge_module_1 = require("./product-registration/plant-merge/plant-merge.module");
var payments_module_1 = require("./payments/payments.module");
var activity_log_module_1 = require("./activity-log/activity-log.module");
var product_design_module_1 = require("./product-design/product-design.module");
var product_performance_module_1 = require("./product-performance/product-performance.module");
var raw_materials_hazardous_products_module_1 = require("./raw-materials-hazardous-products/raw-materials-hazardous-products.module");
var raw_materials_additives_module_1 = require("./raw-materials-additives/raw-materials-additives.module");
var raw_materials_elimination_of_formaldehyde_module_1 = require("./raw-materials-elimination-of-formaldehyde/raw-materials-elimination-of-formaldehyde.module");
var raw_materials_elimination_of_prohibited_flame_module_1 = require("./raw-materials-elimination-of-prohibited-flame/raw-materials-elimination-of-prohibited-flame.module");
var raw_materials_elimination_of_prohibited_flame_solvents_module_1 = require("./raw-materials-elimination-of-prohibited-flame-solvents/raw-materials-elimination-of-prohibited-flame-solvents.module");
var raw_materials_elimination_of_prohibited_flame_solvents_products_module_1 = require("./raw-materials-elimination-of-prohibited-flame-solvents-products/raw-materials-elimination-of-prohibited-flame-solvents-products.module");
var raw_materials_elimination_of_ozone_depleting_global_warming_substances_module_1 = require("./raw-materials-elimination-of-ozone-depleting-global-warming-substances/raw-materials-elimination-of-ozone-depleting-global-warming-substances.module");
var raw_materials_green_supply_module_1 = require("./raw-materials-green-supply/raw-materials-green-supply.module");
var raw_materials_hazardous_module_1 = require("./raw-materials-hazardous/raw-materials-hazardous.module");
var raw_materials_optimization_of_raw_mix_module_1 = require("./raw-materials-optimization-of-raw-mix/raw-materials-optimization-of-raw-mix.module");
var raw_materials_rapidly_renewable_materials_module_1 = require("./raw-materials-rapidly-renewable-materials/raw-materials-rapidly-renewable-materials.module");
var raw_materials_recovery_module_1 = require("./raw-materials-recovery/raw-materials-recovery.module");
var raw_materials_recycled_content_module_1 = require("./raw-materials-recycled-content/raw-materials-recycled-content.module");
var raw_materials_reduce_environmental_module_1 = require("./raw-materials-reduce-environmental/raw-materials-reduce-environmental.module");
var raw_materials_regional_materials_module_1 = require("./raw-materials-regional-materials/raw-materials-regional-materials.module");
var raw_materials_utilization_module_1 = require("./raw-materials-utilization/raw-materials-utilization.module");
var raw_materials_utilization_manufacturing_units_module_1 = require("./raw-materials-utilization-manufacturing-units/raw-materials-utilization-manufacturing-units.module");
var raw_materials_utilization_rmc_module_1 = require("./raw-materials-utilization-rmc/raw-materials-utilization-rmc.module");
var process_manufacturing_module_1 = require("./process-manufacturing/process-manufacturing.module");
var process_mp_manufacturing_units_module_1 = require("./process-mp-manufacturing-units/process-mp-manufacturing-units.module");
var process_waste_management_module_1 = require("./process-waste-management/process-waste-management.module");
var process_wm_manufacturing_units_module_1 = require("./process-wm-manufacturing-units/process-wm-manufacturing-units.module");
var process_life_cycle_approach_module_1 = require("./process-life-cycle-approach/process-life-cycle-approach.module");
var process_product_stewardship_module_1 = require("./process-product-stewardship/process-product-stewardship.module");
var process_innovation_module_1 = require("./process-innovation/process-innovation.module");
var process_comments_module_1 = require("./process-comments/process-comments.module");
var urn_site_visits_module_1 = require("./urn-site-visits/urn-site-visits.module");
var dashboard_module_1 = require("./dashboard/dashboard.module");
var sectors_module_1 = require("./sectors/sectors.module");
var standards_module_1 = require("./standards/standards.module");
var team_members_module_1 = require("./team-members/team-members.module");
var logging_middleware_1 = require("./common/middleware/logging.middleware");
var website_module_1 = require("./website/website.module");
var summits_module_1 = require("./summits/summits.module");
var audit_log_module_1 = require("./audit-log/audit-log.module");
var documents_module_1 = require("./documents/documents.module");
var redis_module_1 = require("./common/redis/redis.module");
var global_phone_uniqueness_module_1 = require("./common/services/global-phone-uniqueness.module");
var zoho_module_1 = require("./zoho/zoho.module");
var notifications_module_1 = require("./notifications/notifications.module");
var raw_materials_shared_module_1 = require("./common/raw-materials/raw-materials-shared.module");
var renewal_module_1 = require("./renew/renewal.module");
var cron_module_1 = require("./cron/cron.module");
var email_module_1 = require("./common/email.module");
var grievances_module_1 = require("./grievances/grievances.module");
var account_deletion_module_1 = require("./account-deletion/account-deletion.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                email_module_1.EmailModule,
                redis_module_1.RedisModule,
                notifications_module_1.NotificationsModule,
                raw_materials_shared_module_1.RawMaterialsSharedModule,
                global_phone_uniqueness_module_1.GlobalPhoneUniquenessModule,
                mongoose_1.MongooseModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    uri: configService.get('MONGODB_URI'),
                                })];
                        });
                    }); },
                    inject: [config_1.ConfigService],
                }),
                audit_log_module_1.AuditLogModule,
                auth_module_1.AuthModule,
                manufacturers_module_1.ManufacturersModule,
                vendor_users_module_1.VendorUsersModule,
                partners_module_1.PartnersModule,
                admin_module_1.AdminModule,
                states_module_1.StatesModule,
                categories_module_1.CategoriesModule,
                countries_module_1.CountriesModule,
                product_registration_module_1.ProductRegistrationModule,
                urn_merge_module_1.UrnMergeModule,
                plant_merge_module_1.PlantMergeModule,
                payments_module_1.PaymentsModule,
                activity_log_module_1.ActivityLogModule,
                product_design_module_1.ProductDesignModule,
                product_performance_module_1.ProductPerformanceModule,
                raw_materials_hazardous_products_module_1.RawMaterialsHazardousProductsModule,
                raw_materials_additives_module_1.RawMaterialsAdditivesModule,
                raw_materials_elimination_of_formaldehyde_module_1.RawMaterialsEliminationOfFormaldehydeModule,
                raw_materials_elimination_of_prohibited_flame_module_1.RawMaterialsEliminationOfProhibitedFlameModule,
                raw_materials_elimination_of_prohibited_flame_solvents_module_1.RawMaterialsEliminationOfProhibitedFlameSolventsModule,
                raw_materials_elimination_of_prohibited_flame_solvents_products_module_1.RawMaterialsEliminationOfProhibitedFlameSolventsProductsModule,
                raw_materials_elimination_of_ozone_depleting_global_warming_substances_module_1.RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesModule,
                raw_materials_green_supply_module_1.RawMaterialsGreenSupplyModule,
                raw_materials_hazardous_module_1.RawMaterialsHazardousModule,
                raw_materials_optimization_of_raw_mix_module_1.RawMaterialsOptimizationOfRawMixModule,
                raw_materials_rapidly_renewable_materials_module_1.RawMaterialsRapidlyRenewableMaterialsModule,
                raw_materials_recovery_module_1.RawMaterialsRecoveryModule,
                raw_materials_recycled_content_module_1.RawMaterialsRecycledContentModule,
                raw_materials_reduce_environmental_module_1.RawMaterialsReduceEnvironmentalModule,
                raw_materials_regional_materials_module_1.RawMaterialsRegionalMaterialsModule,
                raw_materials_utilization_module_1.RawMaterialsUtilizationModule,
                raw_materials_utilization_manufacturing_units_module_1.RawMaterialsUtilizationManufacturingUnitsModule,
                raw_materials_utilization_rmc_module_1.RawMaterialsUtilizationRmcModule,
                process_manufacturing_module_1.ProcessManufacturingModule,
                process_mp_manufacturing_units_module_1.ProcessMpManufacturingUnitsModule,
                process_waste_management_module_1.ProcessWasteManagementModule,
                process_wm_manufacturing_units_module_1.ProcessWmManufacturingUnitsModule,
                process_life_cycle_approach_module_1.ProcessLifeCycleApproachModule,
                process_product_stewardship_module_1.ProcessProductStewardshipModule,
                process_innovation_module_1.ProcessInnovationModule,
                process_comments_module_1.ProcessCommentsModule,
                urn_site_visits_module_1.UrnSiteVisitsModule,
                website_module_1.WebsiteModule,
                summits_module_1.SummitsModule,
                dashboard_module_1.DashboardModule,
                sectors_module_1.SectorsModule,
                standards_module_1.StandardsModule,
                team_members_module_1.TeamMembersModule,
                documents_module_1.DocumentsModule,
                zoho_module_1.ZohoModule,
                renewal_module_1.RenewalModule,
                cron_module_1.CronModule,
                grievances_module_1.GrievancesModule,
                account_deletion_module_1.AccountDeletionModule,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        AppModule_1.prototype.configure = function (consumer) {
            consumer.apply(logging_middleware_1.LoggingMiddleware).forRoutes('*');
        };
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
