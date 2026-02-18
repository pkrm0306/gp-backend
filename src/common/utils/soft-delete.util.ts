import { Document } from 'mongoose';

export interface SoftDeleteDocument extends Document {
  deletedAt?: Date;
  isDeleted?: boolean;
}

export class SoftDeleteUtil {
  static softDelete<T extends SoftDeleteDocument>(document: T): T {
    document.deletedAt = new Date();
    document.isDeleted = true;
    return document;
  }

  static restore<T extends SoftDeleteDocument>(document: T): T {
    document.deletedAt = undefined;
    document.isDeleted = false;
    return document;
  }
}
