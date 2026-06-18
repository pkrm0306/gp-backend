import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProcessRenewManufacturing,
  ProcessRenewManufacturingDocument,
} from '../schemas/process-renew-manufacturing.schema';
import {
  ProcessRenewWasteManagement,
  ProcessRenewWasteManagementDocument,
} from '../schemas/process-renew-waste-management.schema';
import {
  ProcessRenewInnovation,
  ProcessRenewInnovationDocument,
} from '../schemas/process-renew-innovation.schema';
import {
  ProcessRenewProductPerformance,
  ProcessRenewProductPerformanceDocument,
} from '../schemas/process-renew-product-performance.schema';
import {
  ProcessRenewProductStewardship,
  ProcessRenewProductStewardshipDocument,
} from '../schemas/process-renew-product-stewardship.schema';
import {
  ProcessRenewComments,
  ProcessRenewCommentsDocument,
} from '../schemas/process-renew-comments.schema';

type IndexListEntry = {
  name?: string;
  key?: Record<string, unknown>;
  unique?: boolean;
};

async function dropLegacyIndexIfPresent(
  collection: { dropIndex: (name: string) => Promise<unknown> },
  indexName: string,
  logger: Logger,
  collectionLabel: string,
): Promise<void> {
  try {
    await collection.dropIndex(indexName);
    logger.log(`Dropped legacy index ${indexName} on ${collectionLabel}`);
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    // 27 = IndexNotFound, 26 = NamespaceNotFound
    if (code !== 27 && code !== 26) {
      logger.warn(
        `Could not drop legacy index ${indexName} on ${collectionLabel}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

/** Drop any unique index keyed only on `urnNo` (blocks cycle 2+ header rows). */
async function dropUrnOnlyUniqueIndexes(
  collection: {
    indexes: () => Promise<IndexListEntry[]>;
    dropIndex: (name: string) => Promise<unknown>;
  },
  logger: Logger,
  collectionLabel: string,
): Promise<void> {
  const indexes = await collection.indexes();
  for (const index of indexes) {
    const name = String(index.name ?? '').trim();
    if (!name || name === '_id_') continue;
    const keys = Object.keys(index.key ?? {});
    if (keys.length === 1 && keys[0] === 'urnNo' && index.unique) {
      await dropLegacyIndexIfPresent(collection, name, logger, collectionLabel);
    }
  }
}

/** Drop legacy per-EOI unique indexes (urnNo + eoiNo without renewalCycleId). */
async function dropLegacyUrnEoiUniqueIndexes(
  collection: {
    indexes: () => Promise<IndexListEntry[]>;
    dropIndex: (name: string) => Promise<unknown>;
  },
  logger: Logger,
  collectionLabel: string,
): Promise<void> {
  const indexes = await collection.indexes();
  for (const index of indexes) {
    const name = String(index.name ?? '').trim();
    if (!name || name === '_id_') continue;
    const keys = Object.keys(index.key ?? {});
    const isLegacyUrnEoi =
      index.unique &&
      keys.length === 2 &&
      keys.includes('urnNo') &&
      keys.includes('eoiNo') &&
      !keys.includes('renewalCycleId');
    if (isLegacyUrnEoi) {
      await dropLegacyIndexIfPresent(collection, name, logger, collectionLabel);
    }
  }
}

async function syncModelIndexes(
  model: Model<any>,
  collectionLabel: string,
  logger: Logger,
): Promise<void> {
  try {
    await model.syncIndexes();
  } catch (error: unknown) {
    logger.warn(
      `${collectionLabel} syncIndexes: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Drops urn-only unique indexes so renewal cycle 2+ can insert separate
 * process_renew_* headers per (urnNo, renewalCycleId).
 */
@Injectable()
export class RenewProcessHeaderIndexesService implements OnModuleInit {
  private readonly logger = new Logger(RenewProcessHeaderIndexesService.name);

  constructor(
    @InjectModel(ProcessRenewManufacturing.name)
    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,
    @InjectModel(ProcessRenewWasteManagement.name)
    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,
    @InjectModel(ProcessRenewInnovation.name)
    private readonly renewInnovationModel: Model<ProcessRenewInnovationDocument>,
    @InjectModel(ProcessRenewProductPerformance.name)
    private readonly renewPerformanceModel: Model<ProcessRenewProductPerformanceDocument>,
    @InjectModel(ProcessRenewProductStewardship.name)
    private readonly renewStewardshipModel: Model<ProcessRenewProductStewardshipDocument>,
    @InjectModel(ProcessRenewComments.name)
    private readonly renewCommentsModel: Model<ProcessRenewCommentsDocument>,
  ) {}

  private async migrateLegacyIndexes(
    model: Model<any>,
    label: string,
    legacyIndexName?: string,
    dropUrnEoi = false,
  ): Promise<void> {
    if (legacyIndexName) {
      await dropLegacyIndexIfPresent(
        model.collection,
        legacyIndexName,
        this.logger,
        label,
      );
    }
    await dropUrnOnlyUniqueIndexes(model.collection, this.logger, label);
    if (dropUrnEoi) {
      await dropLegacyUrnEoiUniqueIndexes(model.collection, this.logger, label);
    }
    await syncModelIndexes(model, label, this.logger);
  }

  async onModuleInit(): Promise<void> {
    await this.migrateLegacyIndexes(
      this.renewManufacturingModel,
      'process_renew_manufacturing',
      'uniq_process_renew_manufacturing_urn',
    );
    await this.migrateLegacyIndexes(
      this.renewWasteModel,
      'process_renew_waste_management',
      'uniq_process_renew_waste_management_urn',
    );
    await this.migrateLegacyIndexes(
      this.renewInnovationModel,
      'process_renew_innovation',
      'uniq_process_renew_innovation_urn',
    );
    await this.migrateLegacyIndexes(
      this.renewPerformanceModel,
      'process_renew_product_performance',
      'uniq_process_renew_pp_urn_eoi',
      true,
    );
    await this.migrateLegacyIndexes(
      this.renewStewardshipModel,
      'process_renew_product_stewardship',
      'uniq_process_renew_product_stewardship_urn',
    );
    await this.migrateLegacyIndexes(
      this.renewCommentsModel,
      'process_renew_comments',
      'uniq_process_renew_comments_urn',
    );
  }
}
