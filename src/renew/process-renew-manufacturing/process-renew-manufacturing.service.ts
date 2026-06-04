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

import { trackProductDocumentBatch } from '../../documents/helpers/product-document-version.integration';

import {

  assertRenewProcessEditable,

  renewOwnershipFields,

  renewUploadPath,

} from '../helpers/renew-common.util';

import * as path from 'path';



export interface UpsertRenewManufacturingInput {

  urnNo: string;

  portableWaterDemand?: string;

  rainWaterHarvesting?: string;

  beyondTheFenceInitiatives?: string;

  totalEnergyConsumption?: number;

  processManufacturingStatus?: number;

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

    );

    const ownership = renewOwnershipFields(context);



    const session = await this.connection.startSession();

    session.startTransaction();



    try {

      const now = new Date();

      const trimmedUrn = ownership.urnNo;



      const existing = await this.renewManufacturingModel

        .findOne({ urnNo: trimmedUrn })

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



      const docsToInsert: Array<Record<string, unknown>> = [];



      for (const file of conservationUploads) {

        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));

        energyConservationSupportingDocuments = 1;

        docsToInsert.push({

          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),

          vendorId: ownership.vendorId,

          manufacturerId: ownership.manufacturerId,

          urnNo: trimmedUrn,

          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,

          documentFormSubsection: 'energy_conservation_supporting_documents',

          formPrimaryId: processRenewManufacturingId,

          documentName: path.basename(uploaded.fileUrl),

          documentOriginalName: file.originalname,

          documentLink: uploaded.fileUrl,

          createdDate: now,

          updatedDate: now,

        });

      }



      for (const file of consumptionUploads) {

        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));

        energyConsumptionDocuments = 1;

        docsToInsert.push({

          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),

          vendorId: ownership.vendorId,

          manufacturerId: ownership.manufacturerId,

          urnNo: trimmedUrn,

          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,

          documentFormSubsection: 'energy_consumption_documents',

          formPrimaryId: processRenewManufacturingId,

          documentName: path.basename(uploaded.fileUrl),

          documentOriginalName: file.originalname,

          documentLink: uploaded.fileUrl,

          createdDate: now,

          updatedDate: now,

        });

      }



      const saved = await this.renewManufacturingModel

        .findOneAndUpdate(

          { urnNo: trimmedUrn },

          {

            $set: {

              vendorId: ownership.vendorId,

              manufacturerId: ownership.manufacturerId,

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

              createdDate: now,

            },

          },

          { upsert: true, new: true, session },

        )

        .exec();



      if (docsToInsert.length > 0) {

        const inserted = await this.renewDocumentModel.insertMany(docsToInsert, {

          session,

        });

        await trackProductDocumentBatch({

          versioning: this.documentVersioningService,

          urnNo: trimmedUrn,

          sectionKey: DocumentSectionKey.PROCESS_MANUFACTURING,

          userId: ownership.vendorId,

          docs: inserted,

          processType: 'renewal',

          renewalCycleId: cycle._id,

          session,

        });

      }



      await session.commitTransaction();

      session.endSession();

      return saved;

    } catch (error: any) {

      await session.abortTransaction();

      session.endSession();

      throw new InternalServerErrorException(

        error.message || 'Failed to save renew manufacturing',

      );

    }

  }



  async getByUrn(urnNo: string) {

    const trimmedUrn = urnNo.trim();

    const header = await this.renewManufacturingModel

      .findOne({ urnNo: trimmedUrn })

      .lean()

      .exec();

    const documents = await this.renewDocumentModel

      .find({

        urnNo: trimmedUrn,

        documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,

        isDeleted: { $ne: true },

      })

      .lean()

      .exec();



    return { header, documents };

  }

}


