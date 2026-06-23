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

  RenewalCycleStatus,

} from '../schemas/renewal-cycle.schema';

import {

  Product,

  ProductDocument,

} from '../../product-registration/schemas/product.schema';

import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';

import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

import { uploadFile } from '../../utils/upload-file.util';

import { DocumentVersioningService } from '../../documents/document-versioning.service';

import { insertRenewSectionDocuments } from '../helpers/renew-section-documents.util';

import {

  assertRenewProcessEditable,

  renewOwnershipFields,

  renewUploadPath,

} from '../helpers/renew-common.util';

import { buildRenewProcessHeaderFilter } from '../helpers/renew-cycle-scope.util';

import * as path from 'path';



export interface UpsertRenewStewardshipInput {

  urnNo: string;

  renewalCycleId?: string;

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

    const { cycle, context, urnStatus } = await assertRenewProcessEditable(

      this.productModel,

      this.renewalCycleModel,

      input.urnNo,

      input.renewalCycleId,

    );

    const ownership = renewOwnershipFields(context);



    const session = await this.connection.startSession();

    session.startTransaction();



    try {

      const now = new Date();

      const trimmedUrn = ownership.urnNo;

      const renewalCycleObjectId = cycle._id;

      const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);



      const existing = await this.renewStewardshipModel

        .findOne(headerFilter)

        .session(session);

      const processRenewProductStewardshipId =

        existing?.processRenewProductStewardshipId ??

        (await this.sequenceHelper.getProcessRenewProductStewardshipId());



      let seaSupportingDocuments = existing?.seaSupportingDocuments ?? 0;

      let qmSupportingDocuments = existing?.qmSupportingDocuments ?? 0;

      let eprSupportingDocuments = existing?.eprSupportingDocuments ?? 0;



      const newDocRows: Array<{
        productDocumentId: number;
        documentFormSubsection: string;
        documentName: string;
        documentOriginalName: string;
        documentLink: string;
      }> = [];



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

          newDocRows.push({

            productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),

            documentFormSubsection: group.subsection,

            documentName: path.basename(uploaded.fileUrl),

            documentOriginalName: file.originalname,

            documentLink: uploaded.fileUrl,

          });

        }

      }



      const saved = await this.renewStewardshipModel

        .findOneAndUpdate(

          headerFilter,

          {

            $set: {

              vendorId: ownership.vendorId,

              manufacturerId: ownership.manufacturerId,

              renewalCycleId: renewalCycleObjectId,

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

        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,

        formPrimaryId: processRenewProductStewardshipId,

        urnStatus,

        now,

        session,

        rows: newDocRows,

        slotKeyMode: 'subsection',

      });



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



  async getByUrn(urnNo: string, renewalCycleId?: string) {

    const trimmedUrn = urnNo.trim();

    const cycle = renewalCycleId?.trim()
      ? await this.renewalCycleModel.findById(renewalCycleId.trim()).exec()
      : await this.renewalCycleModel
          .findOne({ urnNo: trimmedUrn, status: RenewalCycleStatus.IN_PROGRESS })
          .sort({ cycleNo: -1 })
          .exec();

    const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);

    const header = await this.renewStewardshipModel

      .findOne(headerFilter)

      .lean()

      .exec();

    const documentFilter = cycle?._id
      ? {
          urnNo: trimmedUrn,
          renewalCycleId: cycle._id,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        }
      : {
          urnNo: trimmedUrn,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        };

    const documents = await this.renewDocumentModel

      .find(documentFilter)

      .lean()

      .exec();



    return { header, documents };

  }

}


