import { Types } from 'mongoose';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Matches audit rows for a selected user id, email, or display name.
 * Filter dropdowns may send vendorUserId, while some rows only captured name/email.
 */
export function buildAuditActorUserFilter(
  raw: string,
): Record<string, unknown> | undefined {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return undefined;
  }

  const clauses: Record<string, unknown>[] = [
    { 'actor.user_id': trimmed },
    { 'performed_by.user_id': trimmed },
  ];

  if (Types.ObjectId.isValid(trimmed)) {
    const objectId = new Types.ObjectId(trimmed);
    clauses.push(
      { 'actor.user_id': objectId },
      { 'performed_by.user_id': objectId },
    );
  }

  const exactCi = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');
  clauses.push(
    { 'performed_by.email': exactCi },
    { 'performed_by.name': exactCi },
  );

  return { $or: clauses };
}
