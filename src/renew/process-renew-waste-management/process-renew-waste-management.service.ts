import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Connection, Model } from 'mongoose';

import {

  ProcessRenewWasteManagement,

  ProcessRenewWasteManagementDocument,

} from '../schemas/process-renew-waste-management.schema';

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



export interface UpsertRenewWasteManagementInput {

  urnNo: string;

  wmImplementationDetails?: string;

  processWasteManagementStatus?: number;

}



@Injectable()

export class ProcessRenewWasteManagementService {

  constructor(

    @InjectModel(ProcessRenewWasteManagement.name)

    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,

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

    input: UpsertRenewWasteManagementInput,

    files?: Express.Multer.File[],

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



      const existing = await this.renewWasteModel

        .findOne({ urnNo: trimmedUrn })

        .session(session);

      const processRenewWasteManagementId =

        existing?.processRenewWasteManagementId ??

        (await this.sequenceHelper.getProcessRenewWasteManagementId());



      let wmSupportingDocuments = existing?.wmSupportingDocuments ?? 0;

      const uploadedFiles = Array.isArray(files) ? files : [];

      const filePaths: string[] = [];



      for (const file of uploadedFiles) {

        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));

        filePaths.push(uploaded.fileUrl);

      }

      if (filePaths.length > 0) {

        wmSupportingDocuments = 1;

      }



      const saved = await this.renewWasteModel

        .findOneAndUpdate(

          { urnNo: trimmedUrn },

          {

            $set: {

              vendorId: ownership.vendorId,

              manufacturerId: ownership.manufacturerId,

              wmImplementationDetails: input.wmImplementationDetails ?? '',

              wmSupportingDocuments,

              processWasteManagementStatus:

                input.processWasteManagementStatus ?? 0,

              updatedDate: now,

            },

            $setOnInsert: {

              processRenewWasteManagementId,

              createdDate: now,

            },

          },

          { upsert: true, new: true, session },

        )

        .exec();



      if (filePaths.length > 0) {

        const docsToInsert = [];

        for (let i = 0; i < filePaths.length; i++) {

          docsToInsert.push({

            productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),

            vendorId: ownership.vendorId,

            manufacturerId: ownership.manufacturerId,

            urnNo: trimmedUrn,

            documentForm: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,

            documentFormSubsection: 'wm_supporting_documents',

            formPrimaryId: saved!.processRenewWasteManagementId,

            documentName: path.basename(filePaths[i]),

            documentOriginalName: uploadedFiles[i].originalname,

            documentLink: filePaths[i],

            createdDate: now,

            updatedDate: now,

          });

        }

        const inserted = await this.renewDocumentModel.insertMany(docsToInsert, {

          session,

        });

        await trackProductDocumentBatch({

          versioning: this.documentVersioningService,

          urnNo: trimmedUrn,

          sectionKey: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,

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

        error.message || 'Failed to save renew waste management',

      );

    }

  }



  async getByUrn(urnNo: string) {

    const trimmedUrn = urnNo.trim();

    const header = await this.renewWasteModel

      .findOne({ urnNo: trimmedUrn })

      .lean()

      .exec();

    const documents = await this.renewDocumentModel

      .find({

        urnNo: trimmedUrn,

        documentForm: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,

        isDeleted: { $ne: true },

      })

      .lean()

      .exec();



    return { header, documents };

  }

}


