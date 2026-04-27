import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { normalizeDocumentSectionKey } from '../common/constants/document-section-key.constants';
import { DeleteDocumentQueryDto } from './dto/delete-document-query.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
  ) {}

  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }

    return new Types.ObjectId(id);
  }

  private shouldDeletePhysicalFile(): boolean {
    return process.env.DOCUMENT_DELETE_REMOVE_FILE !== 'false';
  }

  private tryDeleteFile(documentLink?: string): void {
    if (!this.shouldDeletePhysicalFile() || !documentLink) {
      return;
    }

    if (/^https?:\/\//i.test(documentLink)) {
      return;
    }

    const resolvedPath = path.resolve(process.cwd(), documentLink);
    try {
      if (fs.existsSync(resolvedPath)) {
        fs.unlinkSync(resolvedPath);
      }
    } catch (error) {
      // Physical file delete failures should not block record soft-delete.
      console.warn(`Document file cleanup failed for "${resolvedPath}":`, error);
    }
  }

  async softDeleteDocument(
    documentId: number,
    vendorId: string,
    query: DeleteDocumentQueryDto,
  ): Promise<{ documentId: number; urnNo: string; sectionKey: string }> {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

    const document = await this.allProductDocumentModel
      .findOne({ productDocumentId: documentId })
      .exec();

    if (!document || document.isDeleted) {
      throw new NotFoundException('Document not found');
    }

    if (document.vendorId.toString() !== vendorObjectId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this document');
    }

    const normalizedRequestedSectionKey = normalizeDocumentSectionKey(query.sectionKey);
    const normalizedStoredSectionKey = normalizeDocumentSectionKey(document.documentForm);

    if (
      document.urnNo !== query.urnNo ||
      normalizedStoredSectionKey !== normalizedRequestedSectionKey
    ) {
      throw new NotFoundException('Document not found for provided urnNo and sectionKey');
    }

    this.tryDeleteFile(document.documentLink);

    const now = new Date();
    await this.allProductDocumentModel.updateOne(
      { _id: document._id },
      {
        $set: {
          isDeleted: true,
          deletedAt: now,
          deletedBy: vendorObjectId,
          updatedDate: now,
        },
      },
    );

    return {
      documentId: document.productDocumentId,
      urnNo: document.urnNo,
      sectionKey: document.documentForm,
    };
  }
}
