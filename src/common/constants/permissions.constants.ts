export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  /** Admin dashboard — manufacturers KPI block */
  DASHBOARD_MANUFACTURERS_VIEW: 'dashboard:manufacturers:view',
  /** Admin dashboard — product submissions KPI block */
  DASHBOARD_PRODUCTS_VIEW: 'dashboard:products:view',
  /** Admin dashboard — certification progress KPI block */
  DASHBOARD_CERTIFICATION_VIEW: 'dashboard:certification:view',

  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_ADD: 'categories:add',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  SECTORS_VIEW: 'sectors:view',
  SECTORS_ADD: 'sectors:add',
  SECTORS_UPDATE: 'sectors:update',
  SECTORS_DELETE: 'sectors:delete',

  STANDARDS_VIEW: 'standards:view',
  STANDARDS_ADD: 'standards:add',
  STANDARDS_UPDATE: 'standards:update',
  STANDARDS_DELETE: 'standards:delete',

  MANUFACTURERS_VIEW: 'manufacturers:view',
  MANUFACTURERS_ADD: 'manufacturers:add',
  MANUFACTURERS_UPDATE: 'manufacturers:update',
  MANUFACTURERS_DELETE: 'manufacturers:delete',

  PRODUCTS_VIEW: 'products:view',
  /** Submenu / nested route; implied by {@link PERMISSIONS.PRODUCTS_VIEW}. */
  PRODUCTS_CERTIFIED_VIEW: 'products:certified:view',
  /** Submenu / nested route; implied by {@link PERMISSIONS.PRODUCTS_VIEW}. */
  PRODUCTS_UNCERTIFIED_VIEW: 'products:uncertified:view',
  PRODUCTS_ADD: 'products:add',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_ADD: 'payments:add',
  PAYMENTS_UPDATE: 'payments:update',
  PAYMENTS_DELETE: 'payments:delete',

  EVENTS_VIEW: 'events:view',
  EVENTS_ADD: 'events:add',
  EVENTS_UPDATE: 'events:update',
  EVENTS_DELETE: 'events:delete',

  SUMMITS_VIEW: 'summits:view',
  SUMMITS_ADD: 'summits:add',
  SUMMITS_UPDATE: 'summits:update',
  SUMMITS_DELETE: 'summits:delete',

  INQUIRIES_VIEW: 'inquiries:view',
  INQUIRIES_REPLY: 'inquiries:reply',
  INQUIRIES_DELETE: 'inquiries:delete',

  SUBSCRIBERS_VIEW: 'subscribers:view',
  SUBSCRIBERS_UPDATE: 'subscribers:update',

  BANNERS_VIEW: 'banners:view',
  BANNERS_ADD: 'banners:add',
  BANNERS_UPDATE: 'banners:update',
  BANNERS_DELETE: 'banners:delete',

  TEAM_MEMBERS_VIEW: 'team-members:view',
  TEAM_MEMBERS_ADD: 'team-members:add',
  TEAM_MEMBERS_UPDATE: 'team-members:update',
  TEAM_MEMBERS_DELETE: 'team-members:delete',

  GRIEVANCES_VIEW: 'grievances:view',
  GRIEVANCES_UPDATE: 'grievances:update',

  ACCOUNT_DELETION_VIEW: 'account-deletion:view',
  ACCOUNT_DELETION_UPDATE: 'account-deletion:update',

  PROFILE_VIEW: 'profile:view',
  PROFILE_UPDATE: 'profile:update',

  RBAC_ROLES_MANAGE: 'rbac:roles:manage',
  RBAC_STAFF_MANAGE: 'rbac:staff:manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** All registered permission strings; used to expand effective permissions for UI. */
export const ALL_KNOWN_PERMISSION_VALUES: readonly PermissionKey[] = Object.values(PERMISSIONS);

/** Role form: dashboard section checkboxes (nested under Dashboard). */
export const DASHBOARD_PERMISSION_CATALOG = [
  {
    key: PERMISSIONS.DASHBOARD_VIEW,
    label: 'Dashboard (all stats)',
    description: 'Full home dashboard including all widgets below.',
  },
  {
    key: PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW,
    label: 'View — Manufacturers',
    description: 'Manufacturers count and verification breakdown only.',
  },
  {
    key: PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    label: 'View — Products',
    description: 'Product submissions (EOIs / URNs) stats only.',
  },
  {
    key: PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
    label: 'View — Certification',
    description: 'Certification progress and pipeline stats only.',
  },
] as const;

export type DashboardVisibleSections = {
  manufacturers: boolean;
  products: boolean;
  certification: boolean;
};

