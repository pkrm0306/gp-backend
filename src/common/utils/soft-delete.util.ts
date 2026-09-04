import { Document } from 'mongoose';

export interface SoftDeleteDocument extends Document {
  deletedAt?: Date | null;
  isDeleted?: boolean;
}

/** Mongo filter: exclude soft-deleted rows (missing/false `isDeleted`). */
export const NOT_SOFT_DELETED = { isDeleted: { $ne: true } } as const;

export class SoftDeleteUtil {
  static notDeletedFilter(): { isDeleted: { $ne: true } } {
    return { isDeleted: { $ne: true } };
  }

  /** Fields to `$set` when soft-deleting a document. */
  static softDeleteSet(now: Date = new Date()): {
    isDeleted: true;
    deletedAt: Date;
  } {
    return { isDeleted: true, deletedAt: now };
  }

  /** Fields to `$set` when restoring a soft-deleted document. */
  static restoreSet(): { isDeleted: false; deletedAt: null } {
    return { isDeleted: false, deletedAt: null };
  }

  static softDelete<T extends SoftDeleteDocument>(document: T): T {
    document.deletedAt = new Date();
    document.isDeleted = true;
    return document;
  }

  static restore<T extends SoftDeleteDocument>(document: T): T {
    document.deletedAt = null;
    document.isDeleted = false;
    return document;
  }
}
