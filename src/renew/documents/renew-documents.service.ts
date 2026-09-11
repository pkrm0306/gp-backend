import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../schemas/renewal-cycle.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { normalizeDocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { deleteUploadedFileByDocumentLink } from '../../utils/upload-file.util';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  resolveUrnRenewContext,
  toRenewObjectId,
} from '../helpers/renew-common.util';
import { assertRenewDocumentMatchesCycle } from '../helpers/renew-section-documents.util';
import { buildAllProductDocumentLookupFilter } from '../../documents/helpers/resolve-all-product-document.util';

export interface DeleteRenewDocumentQuery {
  urnNo: string;
  sectionKey: string;
  renewalCycleId: string;
}

@Injectable()
export class RenewDocumentsService {
  constructor(
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

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
        `Renew document file cleanup failed for "${documentLink}":`,
        error,
      );
    }
  }

  private async resolveCycle(
    urnNo: string,
    renewalCycleId: string,
  ): Promise<RenewalCycleDocument> {
    const cycle = await this.renewalCycleModel
      .findById(renewalCycleId.trim())
      .exec();
    if (!cycle || cycle.urnNo !== urnNo.trim()) {
      throw new BadRequestException('renewalCycleId does not match this URN');
    }
    return cycle;
  }

  async softDeleteDocument(
    documentIdParam: string,
    query: DeleteRenewDocumentQuery,
    deletedByUserId: string | Types.ObjectId,
  ): Promise<{
    documentId: number;
    urnNo: string;
    sectionKey: string;
    documentTag?: string;
    fileName?: string;
    documentStatus: 'deleted';
  }> {
    if (!query.renewalCycleId?.trim()) {
      throw new BadRequestException(
        'renewalCycleId is required for renewal document delete',
      );
    }
    if (!query.sectionKey?.trim()) {
      throw new BadRequestException(
        'sectionKey is required for renewal document delete',
      );
    }

    const context = await resolveUrnRenewContext(
      this.productModel,
      query.urnNo,
    );
    const deletedBy = toRenewObjectId(deletedByUserId, 'deletedBy');
    const cycle = await this.resolveCycle(context.urnNo, query.renewalCycleId);
    const cycleObjectId = cycle._id as Types.ObjectId;

    const lookupFilter = buildAllProductDocumentLookupFilter(documentIdParam);
    if (!lookupFilter) {
      throw new NotFoundException('Document not found');
    }

    const document = await this.renewDocumentModel.findOne(lookupFilter).exec();

    if (!document || document.isDeleted) {
      throw new NotFoundException('Document not found');
    }

    if (document.urnNo !== context.urnNo) {
      throw new NotFoundException('Document not found for provided urnNo');
    }

    const actorOwnsDocument =
      String(document.vendorId) === String(deletedBy) ||
      String(document.manufacturerId) === String(deletedBy) ||
      String(context.vendorId) === String(deletedBy) ||
      String(context.manufacturerId) === String(deletedBy);
    if (!actorOwnsDocument) {
      throw new ForbiddenException('You are not allowed to delete this document');
    }

    const normalizedRequestedSectionKey = normalizeDocumentSectionKey(
      query.sectionKey,
    );
    const normalizedStoredSectionKey = normalizeDocumentSectionKey(
      document.documentForm,
    );

    if (normalizedStoredSectionKey !== normalizedRequestedSectionKey) {
      throw new NotFoundException(
        'Document not found for provided urnNo and sectionKey',
      );
    }

    assertRenewDocumentMatchesCycle(
      document,
      cycleObjectId,
      Number(cycle.cycleNo ?? 1),
    );

    await this.tryDeleteFile(document.documentLink);

    const now = new Date();
    await this.renewDocumentModel.updateOne(
      { _id: document._id },
      {
        $set: {
          isDeleted: true,
          historyHidden: true,
          deletedAt: now,
          deletedBy,
          updatedDate: now,
        },
      },
    );

    // Vendor-initiated deletes must not create History version rows.

    return {
      documentId: document.productDocumentId,
      urnNo: document.urnNo,
      sectionKey: document.documentForm,
      documentTag: document.documentTag ?? undefined,
      fileName:
        document.documentOriginalName?.trim() ||
        document.documentName?.trim() ||
        undefined,
      documentStatus: 'deleted',
    };
  }
}
