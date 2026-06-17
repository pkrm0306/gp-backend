import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DeleteDocumentQueryDto } from './dto/delete-document-query.dto';
import { deleteUploadedFileByDocumentLink } from '../utils/upload-file.util';
import { DocumentVersioningService } from './document-versioning.service';
import { buildAllProductDocumentTrackInput } from './helpers/document-version.helper';
import { certificationStreamSlotKeyForDocument } from './helpers/certification-document-version.util';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    private readonly documentVersioningService: DocumentVersioningService,
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

  private async tryDeleteFile(documentLink?: string): Promise<void> {
    if (!this.shouldDeletePhysicalFile() || !documentLink) {
      return;
    }

    try {
      await deleteUploadedFileByDocumentLink(documentLink);
    } catch (error) {
      console.warn(
        `Document file cleanup failed for "${documentLink}":`,
        error,
      );
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

    if (document.urnNo !== query.urnNo) {
      throw new NotFoundException('Document not found for provided urnNo');
    }

    await this.tryDeleteFile(document.documentLink);

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

    await this.documentVersioningService.trackDocumentVersionChangeSafe(
      buildAllProductDocumentTrackInput({
        urnNo: document.urnNo,
        sectionKey: document.documentForm,
        subsectionKey: document.documentFormSubsection ?? null,
        slotKey: certificationStreamSlotKeyForDocument({
          documentForm: document.documentForm,
          documentFormSubsection: document.documentFormSubsection,
          documentTag: document.documentTag,
          productDocumentId: document.productDocumentId,
        }),
        action: 'deleted',
        documentId: document._id as Types.ObjectId,
        productDocumentId: document.productDocumentId,
        userId: vendorObjectId,
      }),
    );

    return {
      documentId: document.productDocumentId,
      urnNo: document.urnNo,
      sectionKey: document.documentForm,
    };
  }
}
