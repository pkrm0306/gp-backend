import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DeleteDocumentQueryDto } from './dto/delete-document-query.dto';
import { deleteUploadedFileByDocumentLink } from '../utils/upload-file.util';
import { DocumentVersioningService } from './document-versioning.service';
import { buildAllProductDocumentTrackInput } from './helpers/document-version.helper';
import { certificationStreamSlotKeyForDocument } from './helpers/certification-document-version.util';
import { findAllProductDocumentByIdParam } from './helpers/resolve-all-product-document.util';
import { syncProcessSectionDocumentFlags } from './helpers/sync-process-section-document-flags.util';

type ResolvedProductDocument = AllProductDocument & { _id: Types.ObjectId };

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private readonly connection: Connection,
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

  private assertDocumentAccess(
    document: ResolvedProductDocument,
    vendorId: string,
    urnNo: string,
  ): void {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

    if (document.vendorId.toString() !== vendorObjectId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this document');
    }

    if (document.urnNo !== urnNo) {
      throw new NotFoundException('Document not found for provided urnNo');
    }
  }

  private async syncSectionFlagsForDocument(
    document: Pick<
      AllProductDocument,
      'urnNo' | 'documentForm' | 'documentFormSubsection'
    >,
  ): Promise<void> {
    await syncProcessSectionDocumentFlags({
      documentModel: this.allProductDocumentModel,
      connection: this.connection,
      urnNo: document.urnNo,
      documentForm: document.documentForm,
      documentFormSubsection: document.documentFormSubsection,
    });
  }

  private buildDeleteResult(document: ResolvedProductDocument): {
    documentId: number;
    urnNo: string;
    sectionKey: string;
  } {
    return {
      documentId: document.productDocumentId,
      urnNo: document.urnNo,
      sectionKey: document.documentForm,
    };
  }

  async softDeleteDocument(
    documentIdParam: string,
    vendorId: string,
    query: DeleteDocumentQueryDto,
  ): Promise<{ documentId: number; urnNo: string; sectionKey: string }> {
    const document = (await findAllProductDocumentByIdParam(
      this.allProductDocumentModel,
      documentIdParam,
    )) as ResolvedProductDocument | null;

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    this.assertDocumentAccess(document, vendorId, query.urnNo);

    if (document.isDeleted) {
      await this.syncSectionFlagsForDocument(document);
      return this.buildDeleteResult(document);
    }

    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

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
        documentId: document._id,
        productDocumentId: document.productDocumentId,
        userId: vendorObjectId,
      }),
    );

    await this.syncSectionFlagsForDocument(document);

    return this.buildDeleteResult(document);
  }
}
