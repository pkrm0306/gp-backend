import { AuditLogAdminController } from './audit-log-admin.controller';
import { AUDIT_MODULE, auditModuleDisplayName } from './audit-friendlies';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';

describe('audit module resolution', () => {
  let routeMapper: AuditRouteMapper;

  beforeEach(() => {
    const statusResolver = new AuditStatusResolver();
    const valueTransformer = new AuditValueTransformer(statusResolver);
    routeMapper = new AuditRouteMapper(valueTransformer);
  });

  it('does not classify urn_status 4 as reject', () => {
    const result = routeMapper.map(
      'PATCH',
      '/api/admin/products/urn-status',
      request({
        urnNo: 'URN-1',
        updateStatusType: 'urn_status',
        updateStatusTo: 4,
      }),
      'success',
    );

    expect(result.action_type).toBe('update');
    expect(result.description).toBe('Certification / URN status updated');
  });

  it('classifies vendor send-back and payment rejection correctly', () => {
    const sentBack = routeMapper.map(
      'PATCH',
      '/api/admin/products/urn-status',
      request({
        updateStatusType: 'urn_status',
        updateStatusTo: 5,
      }),
      'success',
    );
    const paymentRejected = routeMapper.map(
      'PATCH',
      '/api/admin/products/urn-status',
      request({
        updateStatusType: 'urn_status',
        updateStatusTo: 9,
      }),
      'success',
    );

    expect(sentBack.action_type).toBe('reject');
    expect(paymentRejected.action_type).toBe('reject');
  });

  it('maps vendor proposal approval to the proposal module', () => {
    const result = routeMapper.map(
      'PATCH',
      '/payments/URN-1/vendor-proposal-approval',
      request({
        vendorProposalApprovalStatus: 1,
        paymentType: 'registration',
      }),
      'success',
    );

    expect(result).toMatchObject({
      module: AUDIT_MODULE.PROPOSAL,
      action_type: 'approve',
      description: 'Proposal approved',
      entity_name: 'URN-1',
    });
  });

  it('maps vendor proposal rejection to the proposal module', () => {
    const result = routeMapper.map(
      'PATCH',
      '/payments/URN-2/vendor-proposal-approval',
      request({
        vendorProposalApprovalStatus: 2,
        paymentType: 'registration',
        proposalRejectionRemarks: 'Revise proposal',
      }),
      'success',
    );

    expect(result).toMatchObject({
      module: AUDIT_MODULE.PROPOSAL,
      action_type: 'reject',
      description: 'Proposal rejected',
      entity_name: 'URN-2',
    });
  });

  it('resolves centralized module display names', () => {
    expect(auditModuleDisplayName(AUDIT_MODULE.PROPOSAL)).toBe('Proposal');
    expect(auditModuleDisplayName(AUDIT_MODULE.CATEGORY)).toBe('Category');
    expect(auditModuleDisplayName(AUDIT_MODULE.SECTOR)).toBe('Sector');
    expect(auditModuleDisplayName(AUDIT_MODULE.STANDARD)).toBe('Standard');
    expect(auditModuleDisplayName(AUDIT_MODULE.RAW_MATERIALS)).toBe(
      'Raw Materials',
    );
    expect(auditModuleDisplayName('custom_module')).toBe('Custom Module');
    expect(auditModuleDisplayName(undefined)).toBeNull();
  });

  it('maps category controller routes to the category module', () => {
    const create = routeMapper.map(
      'POST',
      '/addcategory',
      request({ category_name: 'Paints' }),
      'success',
    );
    const update = routeMapper.map(
      'PUT',
      '/categories/123',
      request({ category_name: 'Adhesives' }),
      'success',
    );
    const status = routeMapper.map(
      'PATCH',
      '/categories/123/status',
      request({ category_name: 'Paints', status: 1 }),
      'success',
    );
    const remove = routeMapper.map(
      'DELETE',
      '/categories/123',
      request({}),
      'success',
    );

    expect(create).toMatchObject({
      module: AUDIT_MODULE.CATEGORY,
      action_type: 'create',
      description: 'Category created',
      entity_name: 'Paints',
    });
    expect(update).toMatchObject({
      module: AUDIT_MODULE.CATEGORY,
      action_type: 'update',
      description: 'Category updated',
      entity_name: 'Adhesives',
    });
    expect(status).toMatchObject({
      module: AUDIT_MODULE.CATEGORY,
      action_type: 'update',
      description: 'Category status updated',
      entity_name: 'Paints',
    });
    expect(remove).toMatchObject({
      module: AUDIT_MODULE.CATEGORY,
      action_type: 'delete',
      description: 'Category deleted',
      entity_name: '123',
    });
  });

  it('maps sector controller routes to the sector module', () => {
    const create = routeMapper.map(
      'POST',
      '/api/sectors',
      request({ name: 'Building Materials' }),
      'success',
    );
    const update = routeMapper.map(
      'PUT',
      '/api/sectors/123',
      request({ name: 'Construction' }),
      'success',
    );
    const status = routeMapper.map(
      'PATCH',
      '/api/sectors/123/status',
      request({ status: 1 }),
      'success',
    );
    const remove = routeMapper.map(
      'DELETE',
      '/api/sectors/123',
      request({}),
      'success',
    );

    expect(create).toMatchObject({
      module: AUDIT_MODULE.SECTOR,
      action_type: 'create',
      description: 'Sector created',
      entity_name: 'Building Materials',
    });
    expect(update).toMatchObject({
      module: AUDIT_MODULE.SECTOR,
      action_type: 'update',
      description: 'Sector updated',
      entity_name: 'Construction',
    });
    expect(status).toMatchObject({
      module: AUDIT_MODULE.SECTOR,
      action_type: 'update',
      description: 'Sector status updated',
      entity_name: '123',
    });
    expect(remove).toMatchObject({
      module: AUDIT_MODULE.SECTOR,
      action_type: 'delete',
      description: 'Sector deleted',
      entity_name: '123',
    });
  });

  it('maps standard controller routes to the standard module', () => {
    const create = routeMapper.map(
      'POST',
      '/api/standards',
      request({ name: 'GreenPro Standard' }),
      'success',
    );
    const edit = routeMapper.map(
      'PATCH',
      '/api/standards/123/edit',
      request({ name: 'Updated Standard' }),
      'success',
    );
    const status = routeMapper.map(
      'PATCH',
      '/api/standards/123/status',
      request({ status: 1 }),
      'success',
    );
    const remove = routeMapper.map(
      'DELETE',
      '/api/standards/123',
      request({}),
      'success',
    );

    expect(create).toMatchObject({
      module: AUDIT_MODULE.STANDARD,
      action_type: 'create',
      description: 'Standard created',
      entity_name: 'GreenPro Standard',
    });
    expect(edit).toMatchObject({
      module: AUDIT_MODULE.STANDARD,
      action_type: 'update',
      description: 'Standard updated',
      entity_name: 'Updated Standard',
    });
    expect(status).toMatchObject({
      module: AUDIT_MODULE.STANDARD,
      action_type: 'update',
      description: 'Standard status updated',
      entity_name: '123',
    });
    expect(remove).toMatchObject({
      module: AUDIT_MODULE.STANDARD,
      action_type: 'delete',
      description: 'Standard deleted',
      entity_name: '123',
    });
  });

  it('returns module display name in admin audit API rows', async () => {
    const controller = new AuditLogAdminController({
      list: jest.fn().mockResolvedValue({
        items: [
          {
            action: 'HTTP_MUTATION',
            outcome: 'success',
            module: AUDIT_MODULE.PROPOSAL,
            action_type: 'approve',
            description: 'Proposal approved',
            performed_by: { name: 'Vendor User' },
            new_values: { vendorProposalApprovalStatus: 1 },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        pages: 1,
        from: new Date('2026-06-01T00:00:00.000Z'),
        to: new Date('2026-06-09T00:00:00.000Z'),
      }),
    } as never);

    const response = await controller.list({});

    expect(response.data[0]).toMatchObject({
      module: AUDIT_MODULE.PROPOSAL,
      module_display: 'Proposal',
      action_display: 'approve',
      user_display: 'Vendor User',
    });
  });
});

function request(body: Record<string, unknown>) {
  return {
    body,
  } as never;
}
