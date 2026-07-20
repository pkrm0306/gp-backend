/**
 * HTTP path constants for SPOC allocation (Nest controller mounts these under the API).
 *
 * REST surface:
 *   GET    /api/admin/spoc-allocation/team-members
 *   GET    /api/admin/spoc-allocation/:productId
 *   POST   /api/admin/spoc-allocation
 *   PUT    /api/admin/spoc-allocation/:productId
 */
export const SPOC_ALLOCATION_BASE_PATH = 'api/admin/spoc-allocation';

export const SPOC_ALLOCATION_ROUTES = {
  teamMembers: 'team-members',
  /** Batch name lookup for list column (not a resource mutation). */
  lookup: 'lookup',
  byProduct: ':productId',
  root: '',
} as const;
