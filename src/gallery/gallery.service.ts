import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Gallery,
  GalleryDocument,
  GalleryType,
} from './schemas/gallery.schema';
import {
  GalleryIdCounter,
  GalleryIdCounterDocument,
  GALLERY_ID_COUNTER_KEY,
} from './schemas/gallery-id-counter.schema';

function toDateOnlyIso(value: Date): string {
  return value.toISOString().slice(0, 10);
}

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
    @InjectModel(GalleryIdCounter.name)
    private readonly galleryCounterModel: Model<GalleryIdCounterDocument>,
  ) {}

  private resolveImagePath(image?: string | null): string {
    const raw = String(image ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) {
      return raw.replace(/^\/uploads\//, '');
    }
    if (raw.startsWith('uploads/')) {
      return raw.replace(/^uploads\//, '');
    }
    return raw;
  }

  private async nextGalleryId(): Promise<number> {
    const doc = await this.galleryCounterModel
      .findOneAndUpdate(
        { _id: GALLERY_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate gallery id');
    }
    return doc.seq;
  }

  private parseGalleryIdentifier(identifier: string): {
    where: Record<string, unknown>;
  } {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Gallery id is required');
    if (Types.ObjectId.isValid(raw)) {
      return { where: { _id: new Types.ObjectId(raw) } };
    }
    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid gallery id (expected Mongo _id or numeric galleryId)',
      );
    }
    return { where: { galleryId: asNumber } };
  }

  private formatGalleryResponse(item: any) {
    if (!item) return item;
    const obj = typeof item.toObject === 'function' ? item.toObject() : item;
    const id = obj?._id
      ? String(obj._id)
      : obj?.id
        ? String(obj.id)
        : undefined;
    const { _id, __v, ...rest } = obj ?? {};
    const dateValue =
      rest?.date instanceof Date
        ? rest.date
        : rest?.date
          ? new Date(rest.date)
          : null;
    const datePart =
      dateValue && !Number.isNaN(dateValue.getTime())
        ? toDateOnlyIso(dateValue)
        : '';
    const images = Array.isArray(rest?.galleryImages)
      ? rest.galleryImages
      : rest?.image
        ? [rest.image]
        : [];

    return {
      ...rest,
      id,
      galleryId: rest?.galleryId,
      eventId: rest?.galleryId,
      title: rest?.title ?? '',
      eventName: rest?.title ?? '',
      description: rest?.description ?? '',
      eventDescription: rest?.description ?? '',
      date: datePart,
      eventDate: datePart,
      image: images[0] ?? null,
      galleryImages: images,
      gallery_image:
        rest?.gallery_image ?? this.resolveImagePath(rest?.image),
      is_active: Number(rest?.status) === 1,
    };
  }

  private mapGalleryListRow(g: any, serialNo: number) {
    const formatted = this.formatGalleryResponse(g);
    return {
      s_no: serialNo,
      id: formatted.id,
      eventId: formatted.galleryId,
      galleryId: formatted.galleryId,
      image: formatted.image,
      galleryImages: formatted.galleryImages,
      gallery_image: formatted.gallery_image,
      title: formatted.title,
      eventName: formatted.title,
      description: formatted.description,
      eventDescription: formatted.description,
      galleryType: formatted.galleryType ?? '',
      date: formatted.date,
      eventDate: formatted.date,
      is_active: formatted.is_active,
    };
  }

  async createGallery(payload: {
    title: string;
    date: Date;
    galleryType: GalleryType;
    description?: string;
    image?: string;
    galleryImages?: string[];
    status?: number;
  }) {
    const galleryId = await this.nextGalleryId();
    const now = new Date();
    const images =
      Array.isArray(payload.galleryImages) && payload.galleryImages.length
        ? payload.galleryImages
        : payload.image
          ? [payload.image]
          : [];

    const doc = new this.galleryModel({
      galleryId,
      title: payload.title,
      image: images[0],
      gallery_image: this.resolveImagePath(images[0]),
      galleryImages: images,
      galleryType: payload.galleryType,
      description: payload.description,
      date: payload.date,
      status:
        payload.status === 0 || payload.status === 1 ? payload.status : 1,
      createdDate: now,
      updatedDate: now,
    });

    const saved = await doc.save();
    return this.formatGalleryResponse(saved);
  }

  async updateGallery(
    identifier: string,
    payload: {
      title?: string;
      date?: Date;
      galleryType?: GalleryType;
      description?: string;
      image?: string;
      galleryImages?: string[];
    },
  ) {
    const { where } = this.parseGalleryIdentifier(identifier);
    const $set: Record<string, unknown> = { updatedDate: new Date() };

    if (payload.title !== undefined && String(payload.title).trim() !== '') {
      $set.title = payload.title;
    }
    if (payload.date !== undefined) {
      $set.date = payload.date;
    }
    if (
      payload.description !== undefined &&
      String(payload.description).trim() !== ''
    ) {
      $set.description = payload.description;
    }
    if (payload.galleryType !== undefined) {
      $set.galleryType = payload.galleryType;
    }
    if (payload.image !== undefined) {
      $set.image = payload.image;
      $set.gallery_image = this.resolveImagePath(payload.image);
    }
    if (payload.galleryImages !== undefined) {
      $set.galleryImages = Array.isArray(payload.galleryImages)
        ? payload.galleryImages
        : [];
      const first = Array.isArray(payload.galleryImages)
        ? payload.galleryImages[0]
        : undefined;
      if (first) {
        $set.image = first;
        $set.gallery_image = this.resolveImagePath(first);
      }
    }

    const updated = await this.galleryModel
      .findOneAndUpdate({ ...where }, { $set }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Gallery item not found');
    }

    return this.formatGalleryResponse(updated);
  }

  async listGalleryPaginated(
    page = 1,
    perPage = 50,
    options?: { activeOnly?: boolean },
  ) {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePerPage =
      Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 50;
    const where: Record<string, unknown> = {};
    if (options?.activeOnly) {
      where.status = 1;
    }

    const [total, rows] = await Promise.all([
      this.galleryModel.countDocuments(where).exec(),
      this.galleryModel
        .find(where)
        .sort({ createdDate: -1, _id: -1 })
        .skip((safePage - 1) * safePerPage)
        .limit(safePerPage)
        .lean()
        .exec(),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
    const data = (rows ?? []).map((row: any, idx: number) =>
      this.mapGalleryListRow(row, (safePage - 1) * safePerPage + idx + 1),
    );

    return {
      data,
      pagination: {
        page: safePage,
        perPage: safePerPage,
        total,
        totalPages,
      },
    };
  }

  async getGalleryById(identifier: string) {
    const { where } = this.parseGalleryIdentifier(identifier);
    const item = await this.galleryModel.findOne(where).lean().exec();
    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }
    return this.formatGalleryResponse(item);
  }

  async deleteGallery(identifier: string) {
    const { where } = this.parseGalleryIdentifier(identifier);
    const res = await this.galleryModel.deleteOne(where).exec();
    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Gallery item not found');
    }
    return { id: String(identifier ?? '').trim() };
  }

  async setOrToggleGalleryStatus(identifier: string, status?: number) {
    const { where } = this.parseGalleryIdentifier(identifier);

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.galleryModel
        .findOne(where)
        .select('status')
        .lean()
        .exec();
      if (!current) {
        throw new NotFoundException('Gallery item not found');
      }
      nextStatus = Number((current as any).status) === 1 ? 0 : 1;
    }

    const updated = await this.galleryModel
      .findOneAndUpdate(
        where,
        { $set: { status: nextStatus, updatedDate: new Date() } },
        { new: true },
      )
      .select('_id galleryId status')
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Gallery item not found');
    }

    return {
      id: String((updated as any)._id),
      galleryId: (updated as any).galleryId,
      status: nextStatus === 1 ? 'active' : 'inactive',
      is_active: nextStatus === 1,
    };
  }
}
