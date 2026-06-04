import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Connection, Model } from 'mongoose';

import {

  ProcessRenewProductStewardship,

  ProcessRenewProductStewardshipDocument,

} from '../schemas/process-renew-product-stewardship.schema';

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



export interface UpsertRenewStewardshipInput {

  urnNo: string;

  qualityManagementDetails?: string;

  eprImplementedDetails?: string;

  eprGreenPackagingDetails?: string;

  productStewardshipStatus?: number;

}



@Injectable()

export class ProcessRenewProductStewardshipService {

  constructor(

    @InjectModel(ProcessRenewProductStewardship.name)

    private readonly renewStewardshipModel: Model<ProcessRenewProductStewardshipDocument>,

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

    input: UpsertRenewStewardshipInput,

    seaFiles?: Express.Multer.File[],

    qmFiles?: Express.Multer.File[],

    eprFiles?: Express.Multer.File[],

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



      const existing = await this.renewStewardshipModel

        .findOne({ urnNo: trimmedUrn })

        .session(session);

      const processRenewProductStewardshipId =

        existing?.processRenewProductStewardshipId ??

        (await this.sequenceHelper.getProcessRenewProductStewardshipId());



      let seaSupportingDocuments = existing?.seaSupportingDocuments ?? 0;

      let qmSupportingDocuments = existing?.qmSupportingDocuments ?? 0;

      let eprSupportingDocuments = existing?.eprSupportingDocuments ?? 0;



      const docsToInsert: Array<Record<string, unknown>> = [];



      const fileGroups = [

        { files: seaFiles, subsection: 'sea_supporting_documents', flag: () => { seaSupportingDocuments = 1; } },

        { files: qmFiles, subsection: 'qm_supporting_documents', flag: () => { qmSupportingDocuments = 1; } },

        { files: eprFiles, subsection: 'epr_supporting_documents', flag: () => { eprSupportingDocuments = 1; } },

      ];



      for (const group of fileGroups) {

        const uploadList = Array.isArray(group.files) ? group.files : [];

        if (uploadList.length > 0) {

          group.flag();

        }

        for (const file of uploadList) {

          const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));

          docsToInsert.push({

            productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),

            vendorId: ownership.vendorId,

            manufacturerId: ownership.manufacturerId,

            urnNo: trimmedUrn,

            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,

            documentFormSubsection: group.subsection,

            formPrimaryId: processRenewProductStewardshipId,

            documentName: path.basename(uploaded.fileUrl),

            documentOriginalName: file.originalname,

            documentLink: uploaded.fileUrl,

            createdDate: now,

            updatedDate: now,

          });

        }

      }



      const saved = await this.renewStewardshipModel

        .findOneAndUpdate(

          { urnNo: trimmedUrn },

          {

            $set: {

              vendorId: ownership.vendorId,

              manufacturerId: ownership.manufacturerId,

              qualityManagementDetails: input.qualityManagementDetails ?? '',

              eprImplementedDetails: input.eprImplementedDetails ?? '',

              eprGreenPackagingDetails: input.eprGreenPackagingDetails ?? '',

              seaSupportingDocuments,

              qmSupportingDocuments,

              eprSupportingDocuments,

              productStewardshipStatus: input.productStewardshipStatus ?? 0,

              updatedDate: now,

            },

            $setOnInsert: {

              processRenewProductStewardshipId,

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

          sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,

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

        error.message || 'Failed to save renew product stewardship',

      );

    }

  }



  async getByUrn(urnNo: string) {

    const trimmedUrn = urnNo.trim();

    const header = await this.renewStewardshipModel

      .findOne({ urnNo: trimmedUrn })

      .lean()

      .exec();

    const documents = await this.renewDocumentModel

      .find({

        urnNo: trimmedUrn,

        documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,

        isDeleted: { $ne: true },

      })

      .lean()

      .exec();



    return { header, documents };

  }

}


