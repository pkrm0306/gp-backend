import {

  Injectable,

  BadRequestException,

  NotFoundException,

} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { ClientSession, Model, Types } from 'mongoose';

import {

  RenewalCycle,

  RenewalCycleDocument,

  RenewalCycleStatus,

} from '../schemas/renewal-cycle.schema';

import { toRenewObjectId } from '../helpers/renew-common.util';



export interface CreateRenewalCycleInput {

  urnNo: string;

  vendorId: string | Types.ObjectId;

  manufacturerId: string | Types.ObjectId;

  paymentId?: number;

  urnStatusAtStart?: number;

  userId: string | Types.ObjectId;

  session?: ClientSession;

}



@Injectable()

export class RenewalCycleService {

  constructor(

    @InjectModel(RenewalCycle.name)

    private readonly renewalCycleModel: Model<RenewalCycleDocument>,

  ) {}



  /** Active or specified cycle — used to stamp `products.renewCycleNo`. */
  async resolveCycleForProductUpdate(
    urnNo: string,
    renewalCycleId?: string,
    session?: ClientSession,
  ): Promise<RenewalCycleDocument> {
    const trimmedUrn = urnNo.trim();
    if (renewalCycleId?.trim()) {
      const query = this.renewalCycleModel.findById(renewalCycleId.trim());
      if (session) {
        query.session(session);
      }
      const cycle = await query.exec();
      if (!cycle || cycle.urnNo !== trimmedUrn) {
        throw new NotFoundException(
          `Renewal cycle ${renewalCycleId} not found for URN ${trimmedUrn}`,
        );
      }
      return cycle;
    }

    const active = await this.getActiveInProgressCycle(trimmedUrn, session);
    if (!active) {
      throw new NotFoundException(
        `No in-progress renewal cycle found for URN ${trimmedUrn}`,
      );
    }
    return active;
  }

  async getActiveInProgressCycle(

    urnNo: string,

    session?: ClientSession,

  ): Promise<RenewalCycleDocument | null> {

    const query = this.renewalCycleModel.findOne({

      urnNo: urnNo.trim(),

      status: RenewalCycleStatus.IN_PROGRESS,

    });

    if (session) {

      query.session(session);

    }

    return query.exec();

  }



  /**
   * Close any in-progress cycles, then create the next cycle (admin test renewal).
   * Does not copy process/payment data — new cycle starts empty.
   */
  async closeInProgressAndCreateNextCycle(
    input: CreateRenewalCycleInput,
  ): Promise<RenewalCycleDocument> {
    const trimmedUrn = input.urnNo.trim();
    const userObjectId = toRenewObjectId(input.userId, 'userId');
    const now = new Date();

    const closeQuery = this.renewalCycleModel.updateMany(
      { urnNo: trimmedUrn, status: RenewalCycleStatus.IN_PROGRESS },
      {
        $set: {
          status: RenewalCycleStatus.COMPLETED,
          completedAt: now,
          updatedAt: now,
          updatedBy: userObjectId,
        },
      },
    );
    if (input.session) {
      closeQuery.session(input.session);
    }
    await closeQuery.exec();

    return this.createCycle({ ...input, session: input.session }, { allowExistingActive: false });
  }

  async createCycle(

    input: CreateRenewalCycleInput,

    options?: { allowExistingActive?: boolean },

  ): Promise<RenewalCycleDocument> {

    const trimmedUrn = input.urnNo.trim();

    const vendorObjectId = toRenewObjectId(input.vendorId, 'vendorId');

    const manufacturerObjectId = toRenewObjectId(

      input.manufacturerId,

      'manufacturerId',

    );

    const userObjectId = toRenewObjectId(input.userId, 'userId');

    const now = new Date();



    const lastCycle = await this.renewalCycleModel

      .findOne({ urnNo: trimmedUrn })

      .sort({ cycleNo: -1 })

      .exec();

    const cycleNo = (lastCycle?.cycleNo ?? 0) + 1;



    const active = await this.getActiveInProgressCycle(trimmedUrn, input.session);

    if (active && options?.allowExistingActive !== false) {

      throw new BadRequestException(

        `An in-progress renewal cycle already exists for URN ${trimmedUrn}`,

      );

    }



    const doc = new this.renewalCycleModel({

      urnNo: trimmedUrn,

      cycleNo,

      paymentId: input.paymentId,

      vendorId: vendorObjectId,

      manufacturerId: manufacturerObjectId,

      status: RenewalCycleStatus.IN_PROGRESS,

      urnStatusAtStart: input.urnStatusAtStart,

      startedAt: now,

      createdAt: now,

      updatedAt: now,

      createdBy: userObjectId,

      updatedBy: userObjectId,

    });



    if (input.session) {

      return doc.save({ session: input.session });

    }

    return doc.save();

  }



  async completeCycle(

    urnNo: string,

    userId: string | Types.ObjectId,

    session?: ClientSession,

  ): Promise<RenewalCycleDocument | null> {

    const userObjectId = toRenewObjectId(userId, 'userId');

    const now = new Date();



    const query = this.renewalCycleModel.findOneAndUpdate(

      {

        urnNo: urnNo.trim(),

        status: RenewalCycleStatus.IN_PROGRESS,

      },

      {

        $set: {

          status: RenewalCycleStatus.COMPLETED,

          completedAt: now,

          updatedAt: now,

          updatedBy: userObjectId,

        },

      },

      { new: true },

    );



    if (session) {

      query.session(session);

    }



    const updated = await query.exec();

    if (!updated) {

      throw new NotFoundException(

        `No in-progress renewal cycle found for URN ${urnNo}`,

      );

    }

    return updated;

  }

  /** Complete a specific in-progress cycle (admin final review with renewalCycleId). */
  async completeCycleById(
    urnNo: string,
    renewalCycleId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<RenewalCycleDocument> {
    const userObjectId = toRenewObjectId(userId, 'userId');
    const cycleObjectId = toRenewObjectId(renewalCycleId, 'renewalCycleId');
    const now = new Date();

    const query = this.renewalCycleModel.findOneAndUpdate(
      {
        _id: cycleObjectId,
        urnNo: urnNo.trim(),
        status: RenewalCycleStatus.IN_PROGRESS,
      },
      {
        $set: {
          status: RenewalCycleStatus.COMPLETED,
          completedAt: now,
          updatedAt: now,
          updatedBy: userObjectId,
        },
      },
      { new: true },
    );

    if (session) {
      query.session(session);
    }

    const updated = await query.exec();
    if (updated) {
      return updated;
    }

    const existingQuery = this.renewalCycleModel.findOne({
      _id: cycleObjectId,
      urnNo: urnNo.trim(),
      status: RenewalCycleStatus.COMPLETED,
    });
    if (session) {
      existingQuery.session(session);
    }
    const alreadyCompleted = await existingQuery.exec();
    if (alreadyCompleted) {
      return alreadyCompleted;
    }

    throw new NotFoundException(
      `No in-progress renewal cycle found for URN ${urnNo} and renewalCycleId ${String(renewalCycleId)}`,
    );
  }

}


