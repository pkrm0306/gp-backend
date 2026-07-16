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
exports.ProductRegistrationModule = void 0;
var common_1 = require("@nestjs/common");
var renewal_module_1 = require("../renew/renewal.module");
var mongoose_1 = require("@nestjs/mongoose");
var passport_1 = require("@nestjs/passport");
var product_registration_controller_1 = require("./product-registration.controller");
var products_controller_1 = require("./products.controller");
var vendor_requests_controller_1 = require("./vendor-requests.controller");
var admin_products_controller_1 = require("./admin-products.controller");
var admin_expired_reactivate_controller_1 = require("./admin-expired-reactivate.controller");
var admin_rejected_restore_controller_1 = require("./admin-rejected-restore.controller");
var admin_certified_reject_controller_1 = require("./admin-certified-reject.controller");
var admin_urn_add_product_controller_1 = require("./admin-urn-add-product.controller");
var admin_urn_controller_1 = require("./admin-urn.controller");
var product_controller_1 = require("./product.controller");
var product_registration_service_1 = require("./product-registration.service");
var eoi_number_service_1 = require("./services/eoi-number.service");
var product_soft_delete_service_1 = require("./services/product-soft-delete.service");
var vendor_certificate_service_1 = require("./services/vendor-certificate.service");
var product_schema_1 = require("./schemas/product.schema");
var product_plant_schema_1 = require("./schemas/product-plant.schema");
var sequence_helper_1 = require("./helpers/sequence.helper");
var manufacturers_module_1 = require("../manufacturers/manufacturers.module");
var countries_module_1 = require("../countries/countries.module");
var states_module_1 = require("../states/states.module");
var auth_module_1 = require("../auth/auth.module");
var categories_module_1 = require("../categories/categories.module");
var sectors_module_1 = require("../sectors/sectors.module");
var activity_log_module_1 = require("../activity-log/activity-log.module");
var rbac_module_1 = require("../rbac/rbac.module");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var urn_site_visits_module_1 = require("../urn-site-visits/urn-site-visits.module");
var category_schema_1 = require("../categories/schemas/category.schema");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var all_product_document_schema_1 = require("../product-design/schemas/all-product-document.schema");
var urn_process_tab_review_schema_1 = require("./schemas/urn-process-tab-review.schema");
var vendor_product_change_request_schema_1 = require("./schemas/vendor-product-change-request.schema");
var process_final_review_schema_1 = require("./schemas/process-final-review.schema");
var urn_tab_review_service_1 = require("./urn-tab-review.service");
var certification_lifecycle_service_1 = require("./certification-lifecycle.service");
var zoho_module_1 = require("../zoho/zoho.module");
var product_status_audit_schema_1 = require("../renew/schemas/product-status-audit.schema");
var admin_expired_reactivate_service_1 = require("./services/admin-expired-reactivate.service");
var admin_rejected_restore_service_1 = require("./services/admin-rejected-restore.service");
var admin_certified_reject_service_1 = require("./services/admin-certified-reject.service");
var admin_add_product_to_urn_service_1 = require("./services/admin-add-product-to-urn.service");
var category_change_cleanup_service_1 = require("./services/category-change-cleanup.service");
var process_final_review_service_1 = require("./services/process-final-review.service");
var process_comments_schema_1 = require("../process-comments/schemas/process-comments.schema");
var plant_merge_audit_schema_1 = require("./plant-merge/schemas/plant-merge-audit.schema");
var ProductRegistrationModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                    { name: product_plant_schema_1.ProductPlant.name, schema: product_plant_schema_1.ProductPlantSchema },
                    { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                    { name: manufacturer_schema_1.Manufacturer.name, schema: manufacturer_schema_1.ManufacturerSchema },
                    { name: all_product_document_schema_1.AllProductDocument.name, schema: all_product_document_schema_1.AllProductDocumentSchema },
                    { name: urn_process_tab_review_schema_1.UrnProcessTabReview.name, schema: urn_process_tab_review_schema_1.UrnProcessTabReviewSchema },
                    {
                        name: vendor_product_change_request_schema_1.VendorProductChangeRequest.name,
                        schema: vendor_product_change_request_schema_1.VendorProductChangeRequestSchema,
                    },
                    { name: product_status_audit_schema_1.ProductStatusAudit.name, schema: product_status_audit_schema_1.ProductStatusAuditSchema },
                    { name: process_final_review_schema_1.ProcessFinalReview.name, schema: process_final_review_schema_1.ProcessFinalReviewSchema },
                    { name: process_comments_schema_1.ProcessComments.name, schema: process_comments_schema_1.ProcessCommentsSchema },
                    { name: plant_merge_audit_schema_1.PlantMergeAudit.name, schema: plant_merge_audit_schema_1.PlantMergeAuditSchema },
                ]),
                passport_1.PassportModule,
                auth_module_1.AuthModule,
                manufacturers_module_1.ManufacturersModule,
                countries_module_1.CountriesModule,
                states_module_1.StatesModule,
                categories_module_1.CategoriesModule,
                sectors_module_1.SectorsModule,
                activity_log_module_1.ActivityLogModule,
                rbac_module_1.RbacModule,
                urn_site_visits_module_1.UrnSiteVisitsModule,
                zoho_module_1.ZohoModule,
                (0, common_1.forwardRef)(function () { return renewal_module_1.RenewalModule; }),
            ],
            controllers: [
                product_registration_controller_1.ProductRegistrationController,
                products_controller_1.ProductsController,
                vendor_requests_controller_1.VendorRequestsController,
                admin_products_controller_1.AdminProductsController,
                admin_expired_reactivate_controller_1.AdminExpiredReactivateController,
                admin_rejected_restore_controller_1.AdminRejectedRestoreController,
                admin_certified_reject_controller_1.AdminCertifiedRejectController,
                admin_urn_add_product_controller_1.AdminUrnAddProductController,
                admin_urn_controller_1.AdminUrnController,
                product_controller_1.ProductController,
            ],
            providers: [
                product_registration_service_1.ProductRegistrationService,
                eoi_number_service_1.EoiNumberService,
                product_soft_delete_service_1.ProductSoftDeleteService,
                sequence_helper_1.SequenceHelper,
                permissions_guard_1.PermissionsGuard,
                urn_tab_review_service_1.UrnTabReviewService,
                certification_lifecycle_service_1.CertificationLifecycleService,
                vendor_certificate_service_1.VendorCertificateService,
                admin_expired_reactivate_service_1.AdminExpiredReactivateService,
                admin_rejected_restore_service_1.AdminRejectedRestoreService,
                admin_certified_reject_service_1.AdminCertifiedRejectService,
                admin_add_product_to_urn_service_1.AdminAddProductToUrnService,
                category_change_cleanup_service_1.CategoryChangeCleanupService,
                process_final_review_service_1.ProcessFinalReviewService,
            ],
            exports: [
                product_registration_service_1.ProductRegistrationService,
                eoi_number_service_1.EoiNumberService,
                product_soft_delete_service_1.ProductSoftDeleteService,
                sequence_helper_1.SequenceHelper,
                urn_tab_review_service_1.UrnTabReviewService,
                certification_lifecycle_service_1.CertificationLifecycleService,
                vendor_certificate_service_1.VendorCertificateService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductRegistrationModule = _classThis = /** @class */ (function () {
        function ProductRegistrationModule_1() {
        }
        return ProductRegistrationModule_1;
    }());
    __setFunctionName(_classThis, "ProductRegistrationModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductRegistrationModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductRegistrationModule = _classThis;
}();
exports.ProductRegistrationModule = ProductRegistrationModule;
