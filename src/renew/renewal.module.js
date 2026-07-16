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
exports.RenewalModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var passport_1 = require("@nestjs/passport");
var product_registration_module_1 = require("../product-registration/product-registration.module");
var activity_log_module_1 = require("../activity-log/activity-log.module");
var documents_module_1 = require("../documents/documents.module");
var auth_module_1 = require("../auth/auth.module");
var rbac_module_1 = require("../rbac/rbac.module");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var payment_details_schema_1 = require("../payments/schemas/payment-details.schema");
var category_schema_1 = require("../categories/schemas/category.schema");
var all_product_document_schema_1 = require("../product-design/schemas/all-product-document.schema");
var renewal_cycle_schema_1 = require("./schemas/renewal-cycle.schema");
var all_renew_product_document_schema_1 = require("./schemas/all-renew-product-document.schema");
var process_renew_comments_schema_1 = require("./schemas/process-renew-comments.schema");
var process_renew_product_performance_schema_1 = require("./schemas/process-renew-product-performance.schema");
var process_renew_pp_test_report_schema_1 = require("./schemas/process-renew-pp-test-report.schema");
var product_status_audit_schema_1 = require("./schemas/product-status-audit.schema");
var admin_renew_product_discontinue_controller_1 = require("./controllers/admin-renew-product-discontinue.controller");
var admin_renew_product_discontinue_service_1 = require("./services/admin-renew-product-discontinue.service");
var process_renew_manufacturing_schema_1 = require("./schemas/process-renew-manufacturing.schema");
var process_renew_innovation_schema_1 = require("./schemas/process-renew-innovation.schema");
var process_renew_waste_management_schema_1 = require("./schemas/process-renew-waste-management.schema");
var process_renew_product_stewardship_schema_1 = require("./schemas/process-renew-product-stewardship.schema");
var process_renew_ps_stakeholder_edu_awarness_schema_1 = require("./schemas/process-renew-ps-stakeholder-edu-awarness.schema");
var process_renew_mp_manufacturing_unit_schema_1 = require("./schemas/process-renew-mp-manufacturing-unit.schema");
var process_renew_mp_energy_consumption_schema_1 = require("./schemas/process-renew-mp-energy-consumption.schema");
var process_renew_wm_manufacturing_unit_schema_1 = require("./schemas/process-renew-wm-manufacturing-unit.schema");
var process_wm_manufacturing_unit_schema_1 = require("../process-wm-manufacturing-units/schemas/process-wm-manufacturing-unit.schema");
var renewal_cycle_service_1 = require("./services/renewal-cycle.service");
var renewal_orchestration_service_1 = require("./services/renewal-orchestration.service");
var renew_quick_view_service_1 = require("./services/renew-quick-view.service");
var renew_documents_service_1 = require("./documents/renew-documents.service");
var admin_renew_controller_1 = require("./controllers/admin-renew.controller");
var vendor_renew_controller_1 = require("./controllers/vendor-renew.controller");
var renew_documents_controller_1 = require("./documents/renew-documents.controller");
var process_renew_innovation_controller_1 = require("./process-renew-innovation/process-renew-innovation.controller");
var process_renew_innovation_service_1 = require("./process-renew-innovation/process-renew-innovation.service");
var process_renew_manufacturing_controller_1 = require("./process-renew-manufacturing/process-renew-manufacturing.controller");
var process_renew_manufacturing_service_1 = require("./process-renew-manufacturing/process-renew-manufacturing.service");
var process_renew_waste_management_controller_1 = require("./process-renew-waste-management/process-renew-waste-management.controller");
var process_renew_waste_management_service_1 = require("./process-renew-waste-management/process-renew-waste-management.service");
var process_renew_comments_controller_1 = require("./process-renew-comments/process-renew-comments.controller");
var admin_renew_process_comments_controller_1 = require("./process-renew-comments/admin-renew-process-comments.controller");
var process_renew_comments_service_1 = require("./process-renew-comments/process-renew-comments.service");
var process_renew_product_stewardship_controller_1 = require("./process-renew-product-stewardship/process-renew-product-stewardship.controller");
var process_renew_product_stewardship_service_1 = require("./process-renew-product-stewardship/process-renew-product-stewardship.service");
var process_renew_product_performance_controller_1 = require("./process-renew-product-performance/process-renew-product-performance.controller");
var process_renew_product_performance_service_1 = require("./process-renew-product-performance/process-renew-product-performance.service");
var process_renew_mp_manufacturing_units_controller_1 = require("./process-renew-mp-manufacturing-units/process-renew-mp-manufacturing-units.controller");
var process_renew_mp_manufacturing_units_service_1 = require("./process-renew-mp-manufacturing-units/process-renew-mp-manufacturing-units.service");
var process_renew_wm_manufacturing_units_controller_1 = require("./process-renew-wm-manufacturing-units/process-renew-wm-manufacturing-units.controller");
var process_renew_wm_manufacturing_units_service_1 = require("./process-renew-wm-manufacturing-units/process-renew-wm-manufacturing-units.service");
var renew_urn_status_controller_1 = require("./controllers/renew-urn-status.controller");
var renew_urn_status_service_1 = require("./services/renew-urn-status.service");
var renew_details_controller_1 = require("./controllers/renew-details.controller");
var renew_details_service_1 = require("./services/renew-details.service");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var doc_stream_schema_1 = require("../documents/schemas/doc-stream.schema");
var urn_renew_tab_review_schema_1 = require("./schemas/urn-renew-tab-review.schema");
var renew_urn_tab_review_service_1 = require("./services/renew-urn-tab-review.service");
var renew_document_promotion_service_1 = require("./services/renew-document-promotion.service");
var renew_admin_test_validity_service_1 = require("./services/renew-admin-test-validity.service");
var renew_process_header_indexes_service_1 = require("./services/renew-process-header-indexes.service");
var RenewalModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: renewal_cycle_schema_1.RenewalCycle.name, schema: renewal_cycle_schema_1.RenewalCycleSchema },
                    { name: all_renew_product_document_schema_1.AllRenewProductDocument.name, schema: all_renew_product_document_schema_1.AllRenewProductDocumentSchema },
                    { name: all_product_document_schema_1.AllProductDocument.name, schema: all_product_document_schema_1.AllProductDocumentSchema },
                    { name: process_renew_comments_schema_1.ProcessRenewComments.name, schema: process_renew_comments_schema_1.ProcessRenewCommentsSchema },
                    {
                        name: process_renew_product_performance_schema_1.ProcessRenewProductPerformance.name,
                        schema: process_renew_product_performance_schema_1.ProcessRenewProductPerformanceSchema,
                    },
                    {
                        name: process_renew_manufacturing_schema_1.ProcessRenewManufacturing.name,
                        schema: process_renew_manufacturing_schema_1.ProcessRenewManufacturingSchema,
                    },
                    { name: process_renew_innovation_schema_1.ProcessRenewInnovation.name, schema: process_renew_innovation_schema_1.ProcessRenewInnovationSchema },
                    {
                        name: process_renew_waste_management_schema_1.ProcessRenewWasteManagement.name,
                        schema: process_renew_waste_management_schema_1.ProcessRenewWasteManagementSchema,
                    },
                    {
                        name: process_renew_product_stewardship_schema_1.ProcessRenewProductStewardship.name,
                        schema: process_renew_product_stewardship_schema_1.ProcessRenewProductStewardshipSchema,
                    },
                    {
                        name: process_renew_ps_stakeholder_edu_awarness_schema_1.ProcessRenewPsStakeholderEduAwarness.name,
                        schema: process_renew_ps_stakeholder_edu_awarness_schema_1.ProcessRenewPsStakeholderEduAwarnessSchema,
                    },
                    {
                        name: process_renew_mp_manufacturing_unit_schema_1.ProcessRenewMpManufacturingUnit.name,
                        schema: process_renew_mp_manufacturing_unit_schema_1.ProcessRenewMpManufacturingUnitSchema,
                    },
                    {
                        name: process_renew_mp_energy_consumption_schema_1.ProcessRenewMpEnergyConsumption.name,
                        schema: process_renew_mp_energy_consumption_schema_1.ProcessRenewMpEnergyConsumptionSchema,
                    },
                    {
                        name: process_renew_wm_manufacturing_unit_schema_1.ProcessRenewWmManufacturingUnit.name,
                        schema: process_renew_wm_manufacturing_unit_schema_1.ProcessRenewWmManufacturingUnitSchema,
                    },
                    {
                        name: process_wm_manufacturing_unit_schema_1.ProcessWmManufacturingUnit.name,
                        schema: process_wm_manufacturing_unit_schema_1.ProcessWmManufacturingUnitSchema,
                    },
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                    { name: payment_details_schema_1.PaymentDetails.name, schema: payment_details_schema_1.PaymentDetailsSchema },
                    { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                    { name: doc_stream_schema_1.DocStream.name, schema: doc_stream_schema_1.DocStreamSchema },
                    { name: product_status_audit_schema_1.ProductStatusAudit.name, schema: product_status_audit_schema_1.ProductStatusAuditSchema },
                    { name: process_renew_pp_test_report_schema_1.ProcessRenewPpTestReport.name, schema: process_renew_pp_test_report_schema_1.ProcessRenewPpTestReportSchema },
                    { name: urn_renew_tab_review_schema_1.UrnRenewTabReview.name, schema: urn_renew_tab_review_schema_1.UrnRenewTabReviewSchema },
                ]),
                (0, common_1.forwardRef)(function () { return product_registration_module_1.ProductRegistrationModule; }),
                activity_log_module_1.ActivityLogModule,
                (0, common_1.forwardRef)(function () { return documents_module_1.DocumentsModule; }),
                auth_module_1.AuthModule,
                passport_1.PassportModule,
                rbac_module_1.RbacModule,
            ],
            controllers: [
                admin_renew_controller_1.AdminRenewController,
                admin_renew_process_comments_controller_1.AdminRenewProcessCommentsController,
                admin_renew_product_discontinue_controller_1.AdminRenewProductDiscontinueController,
                vendor_renew_controller_1.VendorRenewController,
                renew_details_controller_1.RenewDetailsController,
                renew_documents_controller_1.RenewDocumentsController,
                process_renew_innovation_controller_1.ProcessRenewInnovationController,
                process_renew_manufacturing_controller_1.ProcessRenewManufacturingController,
                process_renew_waste_management_controller_1.ProcessRenewWasteManagementController,
                process_renew_comments_controller_1.ProcessRenewCommentsController,
                process_renew_product_stewardship_controller_1.ProcessRenewProductStewardshipController,
                process_renew_product_performance_controller_1.ProcessRenewProductPerformanceController,
                process_renew_mp_manufacturing_units_controller_1.ProcessRenewMpManufacturingUnitsController,
                process_renew_wm_manufacturing_units_controller_1.ProcessRenewWmManufacturingUnitsController,
                renew_urn_status_controller_1.RenewUrnStatusController,
            ],
            providers: [
                renewal_cycle_service_1.RenewalCycleService,
                renewal_orchestration_service_1.RenewalOrchestrationService,
                renew_document_promotion_service_1.RenewDocumentPromotionService,
                renew_admin_test_validity_service_1.RenewAdminTestValidityService,
                renew_quick_view_service_1.RenewQuickViewService,
                renew_details_service_1.RenewDetailsService,
                admin_renew_product_discontinue_service_1.AdminRenewProductDiscontinueService,
                renew_documents_service_1.RenewDocumentsService,
                process_renew_innovation_service_1.ProcessRenewInnovationService,
                process_renew_manufacturing_service_1.ProcessRenewManufacturingService,
                process_renew_waste_management_service_1.ProcessRenewWasteManagementService,
                process_renew_comments_service_1.ProcessRenewCommentsService,
                process_renew_product_stewardship_service_1.ProcessRenewProductStewardshipService,
                process_renew_product_performance_service_1.ProcessRenewProductPerformanceService,
                process_renew_mp_manufacturing_units_service_1.ProcessRenewMpManufacturingUnitsService,
                process_renew_wm_manufacturing_units_service_1.ProcessRenewWmManufacturingUnitsService,
                renew_urn_status_service_1.RenewUrnStatusService,
                renew_urn_tab_review_service_1.RenewUrnTabReviewService,
                renew_process_header_indexes_service_1.RenewProcessHeaderIndexesService,
                permissions_guard_1.PermissionsGuard,
            ],
            exports: [
                renewal_orchestration_service_1.RenewalOrchestrationService,
                renewal_cycle_service_1.RenewalCycleService,
                renew_admin_test_validity_service_1.RenewAdminTestValidityService,
                renew_urn_tab_review_service_1.RenewUrnTabReviewService,
                renew_details_service_1.RenewDetailsService,
                process_renew_comments_service_1.ProcessRenewCommentsService,
                renew_documents_service_1.RenewDocumentsService,
                process_renew_product_performance_service_1.ProcessRenewProductPerformanceService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewalModule = _classThis = /** @class */ (function () {
        function RenewalModule_1() {
        }
        return RenewalModule_1;
    }());
    __setFunctionName(_classThis, "RenewalModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewalModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewalModule = _classThis;
}();
exports.RenewalModule = RenewalModule;
