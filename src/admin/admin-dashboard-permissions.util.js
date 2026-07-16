"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canViewDashboardManufacturers = canViewDashboardManufacturers;
exports.canViewDashboardProducts = canViewDashboardProducts;
exports.canViewDashboardCertification = canViewDashboardCertification;
exports.resolveDashboardVisibleSections = resolveDashboardVisibleSections;
exports.filterDashboardMetricsByPermissions = filterDashboardMetricsByPermissions;
var permissions_constants_1 = require("../common/constants/permissions.constants");
var permission_hierarchy_1 = require("../common/permissions/permission-hierarchy");
var dashboard_metrics_filters_util_1 = require("./utils/dashboard-metrics-filters.util");
function canViewDashboardManufacturers(grants) {
    return ((0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.MANUFACTURERS_VIEW));
}
function canViewDashboardProducts(grants) {
    return ((0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW));
}
function canViewDashboardCertification(grants) {
    return ((0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.PRODUCTS_CERTIFIED_VIEW) ||
        (0, permission_hierarchy_1.hasEffectivePermission)(grants, permissions_constants_1.PERMISSIONS.PRODUCTS_UNCERTIFIED_VIEW));
}
function resolveDashboardVisibleSections(grants) {
    return {
        manufacturers: canViewDashboardManufacturers(grants),
        products: canViewDashboardProducts(grants),
        certification: canViewDashboardCertification(grants),
    };
}
function filterDashboardMetricsByPermissions(metrics, grants, appliedFilters) {
    var visibleSections = resolveDashboardVisibleSections(grants);
    return {
        appliedFilters: appliedFilters,
        visibleSections: visibleSections,
        totalManufacturers: visibleSections.manufacturers
            ? metrics.totalManufacturers
            : 0,
        manufacturers: visibleSections.manufacturers
            ? metrics.manufacturers
            : {
                verified: 0,
                unverified: 0,
                inactivePending: 0,
                verifiedActive: 0,
                verifiedInactive: 0,
            },
        productSubmissions: visibleSections.products
            ? metrics.productSubmissions
            : { total: 0, totalUrns: 0 },
        certificationProgress: visibleSections.certification
            ? metrics.certificationProgress
            : {
                byProductStatus: {
                    pending: 0,
                    approved: 0,
                    certified: 0,
                    rejected: 0,
                    expired: 0,
                },
                byUrnStatus: [],
                summary: {
                    certifiedProducts: 0,
                    inCertificationPipeline: 0,
                    proposalPending: 0,
                    certificatePublished: 0,
                },
            },
        charts: visibleSections.products || visibleSections.certification
            ? metrics.charts
            : (0, dashboard_metrics_filters_util_1.emptyDashboardCharts)(),
    };
}
