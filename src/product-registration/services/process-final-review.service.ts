import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { matchActiveProducts } from '../constants/active-product.filter';
import { UpsertUrnFinalReviewDto } from '../dto/upsert-urn-final-review.dto';
import { formatProcessFinalReviewPayload } from '../helpers/format-process-final-review.util';
import { SequenceHelper } from '../helpers/sequence.helper';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProcessFinalReview,
  ProcessFinalReviewDocument,
} from '../schemas/process-final-review.schema';

@Injectable()
export class ProcessFinalReviewService {
  constructor(
    @InjectModel(ProcessFinalReview.name)
    private readonly processFinalReviewModel: Model<ProcessFinalReviewDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  async upsertForUrn(dto: UpsertUrnFinalReviewDto) {
    const urnNo = String(dto.urnNo ?? '').trim();
    if (!urnNo) {
      throw new BadRequestException('urnNo is required');
    }

    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo }))
      .select('vendorId urnNo productStatus')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No products found for URN ${urnNo}`);
    }

    const minCredits = dto.minCredits;
    const maxCredits = dto.maxCredits;
    if (
      minCredits != null &&
      maxCredits != null &&
      Number.isFinite(minCredits) &&
      Number.isFinite(maxCredits) &&
      maxCredits < minCredits
    ) {
      throw new BadRequestException(
        'maxCredits must be greater than or equal to minCredits',
      );
    }

    const vendorObjectId = product.vendorId as Types.ObjectId;
    const now = new Date();
    const setData: Record<string, unknown> = { updatedDate: now };

    if (dto.technicalReview !== undefined) {
      setData.technicalReview = dto.technicalReview;
    }
    if (dto.finalReview !== undefined) {
      setData.finalReview = dto.finalReview;
    }
    if (dto.minCredits !== undefined) {
      setData.minCredits = dto.minCredits;
    }
    if (dto.maxCredits !== undefined) {
      setData.maxCredits = dto.maxCredits;
    }

    const existing = await this.processFinalReviewModel
      .findOne({ urnNo, vendorId: vendorObjectId })
      .exec();

    let saved: ProcessFinalReviewDocument;
    if (existing) {
      Object.assign(existing, setData);
      saved = await existing.save();
    } else {
      const processFinalReviewId =
        await this.sequenceHelper.getProcessFinalReviewId();
      saved = await this.processFinalReviewModel.create({
        processFinalReviewId,
        urnNo,
        vendorId: vendorObjectId,
        technicalReview: dto.technicalReview ?? '',
        finalReview: dto.finalReview ?? '',
        minCredits: dto.minCredits,
        maxCredits: dto.maxCredits,
        createdDate: now,
        updatedDate: now,
      });
    }

    return formatProcessFinalReviewPayload(
      saved.toObject() as Record<string, unknown>,
    );
  }

  async getByUrn(urnNo: string) {
    const trimmed = String(urnNo ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('urnNo is required');
    }

    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: trimmed }))
      .select('vendorId')
      .lean()
      .exec();

    if (!product) {
      return null;
    }

    const row = await this.processFinalReviewModel
      .findOne({
        urnNo: trimmed,
        vendorId: product.vendorId as Types.ObjectId,
      })
      .lean()
      .exec();

    return formatProcessFinalReviewPayload(
      (row as Record<string, unknown> | null) ?? null,
    );
  }
}
