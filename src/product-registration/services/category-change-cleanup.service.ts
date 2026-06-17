import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import {
  UrnProcessTabReview,
  UrnProcessTabReviewDocument,
} from '../schemas/urn-process-tab-review.schema';
import { RAW_MATERIALS_TAB_KEY } from '../constants/urn-tab-review.constants';
import {
  RAW_MATERIAL_STEP_PURGE_TARGETS,
  addedRawMaterialStepsOnCategoryChange,
  retainedRawMaterialStepsOnCategoryChange,
  stepsToPurgeOnCategoryChange,
  visibleStepsForCategory,
} from '../helpers/category-change.util';
import { deleteUploadedFileByDocumentLink } from '../../utils/upload-file.util';

export type CategoryChangeCleanupResult = {
  purgedSteps: number[];
  retainedRawMaterialSteps: number[];
  addedRawMaterialSteps: number[];
  visibleRawMaterialSteps: number[];
  documentsRemoved: number;
  recordsRemovedByCollection: Record<string, number>;
  rawMaterialReviewsRemoved: number;
};

@Injectable()
export class CategoryChangeCleanupService {
  private readonly logger = new Logger(CategoryChangeCleanupService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(UrnProcessTabReview.name)
    private readonly urnTabReviewModel: Model<UrnProcessTabReviewDocument>,
  ) {}

  async purgeForCategoryChange(params: {
    urnNo: string;
    vendorId: Types.ObjectId;
    previousCategoryRawMaterialForms?: string | null;
    newCategoryRawMaterialForms?: string | null;
    session?: ClientSession;
  }): Promise<CategoryChangeCleanupResult> {
    const urnNo = String(params.urnNo ?? '').trim();
    const purgedSteps = stepsToPurgeOnCategoryChange(
      params.previousCategoryRawMaterialForms,
      params.newCategoryRawMaterialForms,
    );
    const retainedRawMaterialSteps = retainedRawMaterialStepsOnCategoryChange(
      params.previousCategoryRawMaterialForms,
      params.newCategoryRawMaterialForms,
    );
    const addedRawMaterialSteps = addedRawMaterialStepsOnCategoryChange(
      params.previousCategoryRawMaterialForms,
      params.newCategoryRawMaterialForms,
    );
    const visibleRawMaterialSteps = visibleStepsForCategory(
      params.newCategoryRawMaterialForms,
    );

    const recordsRemovedByCollection: Record<string, number> = {};
    const collectionNames = new Set<string>();
    const documentForms = new Set<string>();

    if (purgedSteps.length === 0) {
      return {
        purgedSteps,
        retainedRawMaterialSteps,
        addedRawMaterialSteps,
        visibleRawMaterialSteps,
        documentsRemoved: 0,
        recordsRemovedByCollection,
        rawMaterialReviewsRemoved: 0,
      };
    }

    for (const stepId of purgedSteps) {
      const target = RAW_MATERIAL_STEP_PURGE_TARGETS[stepId];
      if (!target) {
        continue;
      }
      for (const collection of target.collections) {
        collectionNames.add(collection);
      }
      for (const form of target.documentForms) {
        documentForms.add(form);
      }
    }

    for (const collectionName of collectionNames) {
      const result = await this.connection
        .collection(collectionName)
        .deleteMany(
          { urnNo, vendorId: params.vendorId },
          { session: params.session },
        );
      recordsRemovedByCollection[collectionName] = result.deletedCount ?? 0;
    }

    const documentsRemoved = await this.softDeleteDocuments({
      urnNo,
      vendorId: params.vendorId,
      documentForms: [...documentForms],
      session: params.session,
    });

    const reviewDelete = await this.urnTabReviewModel
      .deleteMany(
        {
          urnNo,
          tabKey: RAW_MATERIALS_TAB_KEY,
          stepId: { $in: purgedSteps },
        },
        { session: params.session },
      )
      .exec();

    return {
      purgedSteps,
      retainedRawMaterialSteps,
      addedRawMaterialSteps,
      visibleRawMaterialSteps,
      documentsRemoved,
      recordsRemovedByCollection,
      rawMaterialReviewsRemoved: reviewDelete.deletedCount ?? 0,
    };
  }

  private async softDeleteDocuments(params: {
    urnNo: string;
    vendorId: Types.ObjectId;
    documentForms: string[];
    session?: ClientSession;
  }): Promise<number> {
    if (!params.documentForms.length) {
      return 0;
    }

    const docs = await this.allProductDocumentModel
      .find({
        urnNo: params.urnNo,
        vendorId: params.vendorId,
        documentForm: { $in: params.documentForms },
        isDeleted: { $ne: true },
      })
      .session(params.session ?? null)
      .exec();

    if (!docs.length) {
      return 0;
    }

    const now = new Date();
    const fileLinks = docs
      .map((doc) => String(doc.documentLink ?? '').trim())
      .filter(Boolean);

    await this.allProductDocumentModel.updateMany(
      { _id: { $in: docs.map((doc) => doc._id) } },
      {
        $set: {
          isDeleted: true,
          deletedAt: now,
          deletedBy: params.vendorId,
          updatedDate: now,
        },
      },
      { session: params.session },
    );

    for (const link of fileLinks) {
      try {
        await deleteUploadedFileByDocumentLink(link);
      } catch (error) {
        this.logger.warn(
          `Failed to delete uploaded file for category change (${params.urnNo}): ${
            (error as Error)?.message || 'unknown error'
          }`,
        );
      }
    }

    return docs.length;
  }
}
