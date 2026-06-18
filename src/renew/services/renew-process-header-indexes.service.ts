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

type IndexedRenewModel = {
  model: Model<any>;
  label: string;
  legacyIndexName: string;
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
  ) {}

  async onModuleInit(): Promise<void> {
    const collections: IndexedRenewModel[] = [
      {
        model: this.renewManufacturingModel,
        label: 'process_renew_manufacturing',
        legacyIndexName: 'uniq_process_renew_manufacturing_urn',
      },
      {
        model: this.renewWasteModel,
        label: 'process_renew_waste_management',
        legacyIndexName: 'uniq_process_renew_waste_management_urn',
      },
      {
        model: this.renewInnovationModel,
        label: 'process_renew_innovation',
        legacyIndexName: 'uniq_process_renew_innovation_urn',
      },
    ];

    for (const { model, label, legacyIndexName } of collections) {
      await dropLegacyIndexIfPresent(
        model.collection,
        legacyIndexName,
        this.logger,
        label,
      );
      await syncModelIndexes(model, label, this.logger);
    }
  }
}
