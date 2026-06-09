import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Connection, Model } from 'mongoose';

import {

  ProcessRenewManufacturing,

  ProcessRenewManufacturingDocument,

} from '../schemas/process-renew-manufacturing.schema';

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

import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';

import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

import { uploadFile } from '../../utils/upload-file.util';

import { DocumentVersioningService } from '../../documents/document-versioning.service';


import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  renewUploadPath,
} from '../helpers/renew-common.util';
import { buildRenewProcessHeaderFilter } from '../helpers/renew-cycle-scope.util';
import {
  applyRenewSectionDocumentKeepList,
  buildRenewSectionDocMigrationFilter,
  insertRenewSectionDocuments,
} from '../helpers/renew-section-documents.util';
import { deleteUploadedFileByDocumentLink } from '../../utils/upload-file.util';
import * as path from 'path';

export interface UpsertRenewManufacturingInput {
  urnNo: string;
  renewalCycleId?: string;
  portableWaterDemand?: string;
  rainWaterHarvesting?: string;
  beyondTheFenceInitiatives?: string;
  totalEnergyConsumption?: number;
  processManufacturingStatus?: number;
  existingDocumentIds?: string[];
}



@Injectable()

export class ProcessRenewManufacturingService {

  constructor(

    @InjectModel(ProcessRenewManufacturing.name)

    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,

    @InjectModel(AllRenewProductDocument.name)

    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,

    @InjectModel(RenewalCycle.name)

    private readonly renewalCycleModel: Model<RenewalCycleDocument>,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

    @InjectConnection() private readonly connection: Connection,

    private readonly sequenceHelper: SequenceHelper,

    private readonly documentVersioningService: DocumentVersioningService,

  ) {}



  async upsert(

    input: UpsertRenewManufacturingInput,

    conservationFiles?: Express.Multer.File[],

    consumptionFiles?: Express.Multer.File[],

  ) {

    const { cycle, context } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo,
      input.renewalCycleId,
    );
    const ownership = renewOwnershipFields(context);
    const renewalCycleObjectId = cycle._id;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const now = new Date();
      const trimmedUrn = ownership.urnNo;
      const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);

      const existing = await this.renewManufacturingModel
        .findOne(headerFilter)
        .session(session);

      const processRenewManufacturingId =

        existing?.processRenewManufacturingId ??

        (await this.sequenceHelper.getProcessRenewManufacturingId());



      let energyConservationSupportingDocuments =

        existing?.energyConservationSupportingDocuments ?? 0;

      let energyConsumptionDocuments =

        existing?.energyConsumptionDocuments ?? 0;



      const conservationUploads = Array.isArray(conservationFiles)

        ? conservationFiles

        : [];

      const consumptionUploads = Array.isArray(consumptionFiles)

        ? consumptionFiles

        : [];



      const oldFileLinksToDeleteAfterCommit =
        await applyRenewSectionDocumentKeepList({
          renewDocumentModel: this.renewDocumentModel,
          documentVersioningService: this.documentVersioningService,
          urnNo: trimmedUrn,
          vendorObjectId: ownership.vendorId,
          renewalCycleObjectId,
          cycleNo: Number(cycle.cycleNo ?? 1),
          sectionKey: DocumentSectionKey.PROCESS_MANUFACTURING,
          existingDocumentIds: input.existingDocumentIds,
          now,
          session,
        });

      const newDocRows: Array<{
        productDocumentId: number;
        documentFormSubsection: string;
        documentName: string;
        documentOriginalName: string;
        documentLink: string;
      }> = [];

      for (const file of conservationUploads) {
        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));
        energyConservationSupportingDocuments = 1;
        newDocRows.push({
          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),
          documentFormSubsection: 'energy_conservation_supporting_documents',
          documentName: path.basename(uploaded.fileUrl),
          documentOriginalName: file.originalname,
          documentLink: uploaded.fileUrl,
        });
      }

      for (const file of consumptionUploads) {
        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));
        energyConsumptionDocuments = 1;
        newDocRows.push({
          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),
          documentFormSubsection: 'energy_consumption_documents',
          documentName: path.basename(uploaded.fileUrl),
          documentOriginalName: file.originalname,
          documentLink: uploaded.fileUrl,
        });
      }

      const saved = await this.renewManufacturingModel
        .findOneAndUpdate(
          headerFilter,
          {
            $set: {
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              renewalCycleId: renewalCycleObjectId,
              portableWaterDemand: input.portableWaterDemand ?? '',
              rainWaterHarvesting: input.rainWaterHarvesting ?? '',
              beyondTheFenceInitiatives: input.beyondTheFenceInitiatives ?? '',
              totalEnergyConsumption: input.totalEnergyConsumption,
              energyConservationSupportingDocuments,
              energyConsumptionDocuments,
              processManufacturingStatus: input.processManufacturingStatus ?? 0,
              updatedDate: now,
            },
            $setOnInsert: {
              processRenewManufacturingId,
              urnNo: trimmedUrn,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      await insertRenewSectionDocuments({
        renewDocumentModel: this.renewDocumentModel,
        documentVersioningService: this.documentVersioningService,
        urnNo: trimmedUrn,
        vendorObjectId: ownership.vendorId,
        manufacturerObjectId: ownership.manufacturerId,
        renewalCycleObjectId,
        sectionKey: DocumentSectionKey.PROCESS_MANUFACTURING,
        formPrimaryId: processRenewManufacturingId,
        now,
        session,
        rows: newDocRows,
      });

      await session.commitTransaction();
      session.endSession();

      for (const link of oldFileLinksToDeleteAfterCommit) {
        await deleteUploadedFileByDocumentLink(link).catch(() => undefined);
      }

      return saved;

    } catch (error: any) {

      await session.abortTransaction();

      session.endSession();

      throw new InternalServerErrorException(

        error.message || 'Failed to save renew manufacturing',

      );

    }

  }



  async getByUrn(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    let cycle = null;
    if (renewalCycleId?.trim()) {
      cycle = await this.renewalCycleModel.findById(renewalCycleId.trim()).exec();
    } else {
      cycle = await this.renewalCycleModel
        .findOne({ urnNo: trimmedUrn, status: 'in_progress' })
        .sort({ cycleNo: -1 })
        .exec();
    }
    const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);
    const header = await this.renewManufacturingModel
      .findOne(headerFilter)
      .lean()
      .exec();
    const docFilter =
      cycle?._id != null
        ? buildRenewSectionDocMigrationFilter(
            trimmedUrn,
            cycle._id,
            DocumentSectionKey.PROCESS_MANUFACTURING,
            Number(cycle.cycleNo ?? 1) > 1,
          )
        : {
            urnNo: trimmedUrn,
            documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
            isDeleted: { $ne: true },
          };
    const documents = await this.renewDocumentModel.find(docFilter).lean().exec();
    return { header, documents };
  }

}


