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
exports.AdminModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var admin_controller_1 = require("./admin.controller");
var admin_vendor_user_controller_1 = require("./admin-vendor-user.controller");
var admin_dashboard_controller_1 = require("./dashboard/admin-dashboard.controller");
var admin_dashboard_stats_service_1 = require("./dashboard/admin-dashboard-stats.service");
var admin_dashboard_kpi_service_1 = require("./dashboard/admin-dashboard-kpi.service");
var admin_dashboard_widgets_service_1 = require("./dashboard/admin-dashboard-widgets.service");
var admin_dashboard_certification_timing_service_1 = require("./dashboard/admin-dashboard-certification-timing.service");
var admin_dashboard_sustainability_service_1 = require("./dashboard/admin-dashboard-sustainability.service");
var admin_dashboard_visitor_analytics_service_1 = require("./dashboard/admin-dashboard-visitor-analytics.service");
var website_analytics_module_1 = require("../website/website-analytics.module");
var admin_dashboard_optimized_service_1 = require("./dashboard/admin-dashboard-optimized.service");
var admin_revenue_dashboard_service_1 = require("./dashboard/admin-revenue-dashboard.service");
var admin_service_1 = require("./admin.service");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var manufacturers_module_1 = require("../manufacturers/manufacturers.module");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var banner_schema_1 = require("../banners/schemas/banner.schema");
var newsletter_subscriber_schema_1 = require("../website/schemas/newsletter-subscriber.schema");
var contact_message_schema_1 = require("../website/schemas/contact-message.schema");
var event_schema_1 = require("../events/schemas/event.schema");
var event_id_counter_schema_1 = require("../events/schemas/event-id-counter.schema");
var contact_reply_thread_schema_1 = require("./schemas/contact-reply-thread.schema");
var notification_schema_1 = require("../common/schemas/notification.schema");
var article_schema_1 = require("../articles/schemas/article.schema");
var rbac_module_1 = require("../rbac/rbac.module");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var categories_module_1 = require("../categories/categories.module");
var sectors_module_1 = require("../sectors/sectors.module");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var product_plant_schema_1 = require("../product-registration/schemas/product-plant.schema");
var category_schema_1 = require("../categories/schemas/category.schema");
var state_schema_1 = require("../states/schemas/state.schema");
var activity_log_schema_1 = require("../activity-log/schemas/activity-log.schema");
var product_registration_module_1 = require("../product-registration/product-registration.module");
var payments_module_1 = require("../payments/payments.module");
var auth_module_1 = require("../auth/auth.module");
var gallery_module_1 = require("../gallery/gallery.module");
var payment_details_schema_1 = require("../payments/schemas/payment-details.schema");
var vendor_product_change_request_schema_1 = require("../product-registration/schemas/vendor-product-change-request.schema");
var process_mp_manufacturing_unit_schema_1 = require("../process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema");
var raw_materials_recycled_content_schema_1 = require("../raw-materials-recycled-content/schemas/raw-materials-recycled-content.schema");
var raw_materials_recovery_schema_1 = require("../raw-materials-recovery/schemas/raw-materials-recovery.schema");
var raw_materials_rapidly_renewable_materials_schema_1 = require("../raw-materials-rapidly-renewable-materials/schemas/raw-materials-rapidly-renewable-materials.schema");
var raw_materials_utilization_rmc_schema_1 = require("../raw-materials-utilization-rmc/schemas/raw-materials-utilization-rmc.schema");
var AdminModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                (0, common_1.forwardRef)(function () { return auth_module_1.AuthModule; }),
                manufacturers_module_1.ManufacturersModule,
                rbac_module_1.RbacModule,
                categories_module_1.CategoriesModule,
                sectors_module_1.SectorsModule,
                product_registration_module_1.ProductRegistrationModule,
                payments_module_1.PaymentsModule,
                gallery_module_1.GalleryModule,
                website_analytics_module_1.WebsiteAnalyticsModule,
                mongoose_1.MongooseModule.forFeature([
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                    { name: product_plant_schema_1.ProductPlant.name, schema: product_plant_schema_1.ProductPlantSchema },
                    { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                    { name: state_schema_1.State.name, schema: state_schema_1.StateSchema },
                    { name: activity_log_schema_1.ActivityLog.name, schema: activity_log_schema_1.ActivityLogSchema },
                    { name: manufacturer_schema_1.Manufacturer.name, schema: manufacturer_schema_1.ManufacturerSchema },
                    { name: vendor_user_schema_1.VendorUser.name, schema: vendor_user_schema_1.VendorUserSchema },
                    { name: banner_schema_1.Banner.name, schema: banner_schema_1.BannerSchema },
                    { name: newsletter_subscriber_schema_1.NewsletterSubscriber.name, schema: newsletter_subscriber_schema_1.NewsletterSubscriberSchema },
                    { name: contact_message_schema_1.ContactMessage.name, schema: contact_message_schema_1.ContactMessageSchema },
                    { name: contact_reply_thread_schema_1.ContactReplyThread.name, schema: contact_reply_thread_schema_1.ContactReplyThreadSchema },
                    { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                    { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                    { name: event_id_counter_schema_1.EventIdCounter.name, schema: event_id_counter_schema_1.EventIdCounterSchema },
                    { name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema },
                    { name: payment_details_schema_1.PaymentDetails.name, schema: payment_details_schema_1.PaymentDetailsSchema },
                    {
                        name: vendor_product_change_request_schema_1.VendorProductChangeRequest.name,
                        schema: vendor_product_change_request_schema_1.VendorProductChangeRequestSchema,
                    },
                    { name: process_mp_manufacturing_unit_schema_1.ProcessMpManufacturingUnit.name, schema: process_mp_manufacturing_unit_schema_1.ProcessMpManufacturingUnitSchema },
                    { name: raw_materials_recycled_content_schema_1.RawMaterialsRecycledContent.name, schema: raw_materials_recycled_content_schema_1.RawMaterialsRecycledContentSchema },
                    { name: raw_materials_recovery_schema_1.RawMaterialsRecovery.name, schema: raw_materials_recovery_schema_1.RawMaterialsRecoverySchema },
                    {
                        name: raw_materials_rapidly_renewable_materials_schema_1.RawMaterialsRapidlyRenewableMaterials.name,
                        schema: raw_materials_rapidly_renewable_materials_schema_1.RawMaterialsRapidlyRenewableMaterialsSchema,
                    },
                    { name: raw_materials_utilization_rmc_schema_1.RawMaterialsUtilizationRmc.name, schema: raw_materials_utilization_rmc_schema_1.RawMaterialsUtilizationRmcSchema },
                ]),
            ],
            controllers: [
                admin_controller_1.AdminController,
                admin_vendor_user_controller_1.AdminVendorUserController,
                admin_dashboard_controller_1.AdminDashboardController,
            ],
            providers: [
                admin_service_1.AdminService,
                admin_dashboard_stats_service_1.AdminDashboardStatsService,
                admin_dashboard_kpi_service_1.AdminDashboardKpiService,
                admin_dashboard_widgets_service_1.AdminDashboardWidgetsService,
                admin_dashboard_certification_timing_service_1.AdminDashboardCertificationTimingService,
                admin_dashboard_sustainability_service_1.AdminDashboardSustainabilityService,
                admin_dashboard_visitor_analytics_service_1.AdminDashboardVisitorAnalyticsService,
                admin_dashboard_optimized_service_1.AdminDashboardOptimizedService,
                admin_revenue_dashboard_service_1.AdminRevenueDashboardService,
                permissions_guard_1.PermissionsGuard,
            ],
            exports: [admin_service_1.AdminService, gallery_module_1.GalleryModule],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminModule = _classThis = /** @class */ (function () {
        function AdminModule_1() {
        }
        return AdminModule_1;
    }());
    __setFunctionName(_classThis, "AdminModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminModule = _classThis;
}();
exports.AdminModule = AdminModule;
