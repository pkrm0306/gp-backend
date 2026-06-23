import { Types } from 'mongoose';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ACTOR_ID_FIELDS = [
  'actor.user_id',
  'performed_by.user_id',
  'actor.vendor_id',
  'actor.manufacturer_id',
] as const;

/**
 * Matches audit rows for a selected user id, email, display name, or vendor org id.
 * Filter dropdowns may send vendorUserId or manufacturer _id, while some rows only
 * captured name/email.
 */
export function buildAuditActorUserFilter(
  raw: string,
): Record<string, unknown> | undefined {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return undefined;
  }

  const clauses: Record<string, unknown>[] = [];

  for (const field of ACTOR_ID_FIELDS) {
    clauses.push({ [field]: trimmed });
    if (Types.ObjectId.isValid(trimmed)) {
      clauses.push({ [field]: new Types.ObjectId(trimmed) });
    }
  }

  clauses.push({
    $expr: {
      $or: ACTOR_ID_FIELDS.map((field) => ({
        $eq: [{ $toString: `$${field}` }, trimmed],
      })),
    },
  });

  const exactCi = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');
  clauses.push(
    { 'performed_by.email': exactCi },
    { 'performed_by.name': exactCi },
  );

  return { $or: clauses };
}
