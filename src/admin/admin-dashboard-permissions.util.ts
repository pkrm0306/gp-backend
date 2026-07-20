import {
  PERMISSIONS,
  PRODUCTS_VIEW_ANY,
  type DashboardVisibleSections,
} from '../common/constants/permissions.constants';
import { hasEffectivePermission } from '../common/permissions/permission-hierarchy';
import type {
  AdminDashboardMetrics,
  AdminDashboardMetricsResponse,
} from './admin-dashboard-metrics.types';
import { emptyDashboardCharts } from './utils/dashboard-metrics-filters.util';
import type { AppliedDashboardFilters } from './admin-dashboard-metrics.types';

export type { AdminDashboardMetricsResponse };

function hasAnyOf(grants: Iterable<string>, keys: readonly string[]): boolean {
  return keys.some((key) => hasEffectivePermission(grants, key));
}

export function canViewDashboardManufacturers(grants: Iterable<string>): boolean {
  return (
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.MANUFACTURERS_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.MANUFACTURERS_VERIFIED_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.MANUFACTURERS_UNVERIFIED_VIEW)
  );
}

export function canViewDashboardProducts(grants: Iterable<string>): boolean {
  return (
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_PRODUCTS_VIEW) ||
    hasAnyOf(grants, PRODUCTS_VIEW_ANY)
  );
}

export function canViewDashboardCertification(grants: Iterable<string>): boolean {
  return (
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_VIEW) ||
    hasEffectivePermission(grants, PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW) ||
    hasAnyOf(grants, PRODUCTS_VIEW_ANY)
  );
}

export function resolveDashboardVisibleSections(
  grants: Iterable<string>,
): DashboardVisibleSections {
  return {
    manufacturers: canViewDashboardManufacturers(grants),
    products: canViewDashboardProducts(grants),
    certification: canViewDashboardCertification(grants),
  };
}

export function filterDashboardMetricsByPermissions(
  metrics: AdminDashboardMetrics,
  grants: Iterable<string>,
  appliedFilters: AppliedDashboardFilters,
): AdminDashboardMetricsResponse {
  const visibleSections = resolveDashboardVisibleSections(grants);

  return {
    appliedFilters,
    visibleSections,
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
    charts:
      visibleSections.products || visibleSections.certification
        ? metrics.charts
        : emptyDashboardCharts(),
  };
}
