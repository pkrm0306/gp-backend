import { UrnSiteVisitDocument } from './schemas/urn-site-visit.schema';

export type SiteVisitLike = Record<string, unknown>;

export function formatSiteVisitRecord(
  doc: SiteVisitLike | UrnSiteVisitDocument,
): Record<string, unknown> {
  const plain =
    typeof (doc as UrnSiteVisitDocument).toObject === 'function'
      ? (doc as UrnSiteVisitDocument).toObject()
      : { ...doc };

  const id = plain._id != null ? String(plain._id) : undefined;
  const urnNo = plain.urnNo != null ? String(plain.urnNo) : undefined;
  const auditConductedOn = plain.auditConductedOn ?? null;

  const {
    postalCode: _postalCode,
    postal_code: _postal_code,
    __v: _v,
    ...rest
  } = plain as Record<string, unknown>;

  return {
    ...rest,
    _id: id,
    urnNo,
    urn_no: urnNo,
    name: plain.name,
    addressLine1: plain.addressLine1 ?? '',
    address_line1: plain.addressLine1 ?? '',
    addressLine2: plain.addressLine2 ?? '',
    address_line2: plain.addressLine2 ?? '',
    city: plain.city ?? '',
    state: plain.state ?? '',
    country: plain.country ?? '',
    auditType: plain.auditType ?? null,
    audit_type: plain.auditType ?? null,
    auditConductedOn,
    audit_conducted_on: auditConductedOn,
    conductedBy: plain.conductedBy ?? null,
    conducted_by: plain.conductedBy ?? null,
    createdBy: plain.createdBy != null ? String(plain.createdBy) : null,
    updatedBy: plain.updatedBy != null ? String(plain.updatedBy) : null,
    createdAt: plain.createdAt,
    created_at: plain.createdAt,
    updatedAt: plain.updatedAt,
    updated_at: plain.updatedAt,
    isDeleted: Boolean(plain.isDeleted),
    is_deleted: Boolean(plain.isDeleted),
  };
}
