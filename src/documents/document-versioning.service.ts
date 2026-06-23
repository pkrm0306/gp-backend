import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { DocStream, DocStreamDocument } from './schemas/doc-stream.schema';
import { DocVersion, DocVersionDocument } from './schemas/doc-version.schema';
import {
  buildAllProductDocumentTrackInput,
  buildPaymentDocumentTrackInput,
  buildStreamIdentityFilter,
  buildStreamKey,
  normalizeProcessType,
  normalizeRenewalCycleId,
  toObjectId,
} from './helpers/document-version.helper';
import {
  DocumentStreamQueryInput,
  TrackAllProductDocumentInput,
  TrackDocumentVersionChangeInput,
  TrackPaymentDocumentInput,
} from './types/document-version.types';

@Injectable()
export class DocumentVersioningService {
  private readonly logger = new Logger(DocumentVersioningService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(DocStream.name)
    private readonly docStreamModel: Model<DocStreamDocument>,
    @InjectModel(DocVersion.name)
    private readonly docVersionModel: Model<DocVersionDocument>,
  ) {}

  async trackDocumentVersionChange(
    input: TrackDocumentVersionChangeInput,
  ): Promise<{ streamId: Types.ObjectId; versionId: Types.ObjectId; versionNo: number }> {
    const ownsSession = !input.session;
    const session = input.session ?? (await this.connection.startSession());

    const run = async (activeSession: ClientSession) => {
      const now = new Date();
      const userObjectId = toObjectId(input.userId, 'userId');
      const processType = normalizeProcessType(input.processType);
      const renewalCycleId = normalizeRenewalCycleId(input.renewalCycleId);
      const urnNo = input.urnNo.trim();
      const subsectionKey = input.subsectionKey ?? null;
      const slotKey = input.slotKey;
      const streamKey = buildStreamKey({
        urnNo,
        processType,
        renewalCycleId,
        sectionKey: input.sectionKey,
        subsectionKey,
        slotKey,
      });

      let stream = await this.docStreamModel
        .findOne({
          urnNo,
          processType,
          renewalCycleId,
          sectionKey: input.sectionKey,
          subsectionKey,
          slotKey,
        })
        .session(activeSession)
        .exec();

      const nextVersionNo = (stream?.latestVersionNo ?? 0) + 1;

      if (stream?.latestVersionId) {
        await this.docVersionModel.updateOne(
          { _id: stream.latestVersionId },
          { $set: { isLatest: false } },
          { session: activeSession },
        );
      }

      if (!stream) {
        const createdStreams = await this.docStreamModel.create(
          [
            {
              urnNo,
              processType,
              renewalCycleId,
              sectionKey: input.sectionKey,
              subsectionKey,
              slotKey,
              streamKey,
              liveSource: input.liveSource,
              liveRef: {
                collection: input.liveRef.collection,
                id: toObjectId(input.liveRef.id, 'liveRef.id'),
                field: input.liveRef.field,
              },
              latestVersionNo: 0,
              latestVersionId: null,
              isDeleted: false,
              createdAt: now,
              createdBy: userObjectId,
              updatedAt: now,
              updatedBy: userObjectId,
            },
          ],
          { session: activeSession },
        );
        stream = createdStreams[0];
      }

      const versionDocs = await this.docVersionModel.create(
        [
          {
            streamId: stream._id,
            urnNo,
            processType,
            renewalCycleId,
            roundNo: input.roundNo ?? null,
            versionNo: nextVersionNo,
            action: input.action,
            filePath: input.filePath ?? null,
            originalName: input.originalName ?? null,
            storedName: input.storedName ?? null,
            mimeType: input.mimeType ?? null,
            sizeBytes: input.sizeBytes ?? null,
            checksum: input.checksum ?? null,
            isLatest: true,
            createdAt: now,
            createdBy: userObjectId,
          },
        ],
        { session: activeSession },
      );
      const version = versionDocs[0];

      await this.docStreamModel.updateOne(
        { _id: stream._id },
        {
          $set: {
            liveSource: input.liveSource,
            liveRef: {
              collection: input.liveRef.collection,
              id: toObjectId(input.liveRef.id, 'liveRef.id'),
              field: input.liveRef.field,
            },
            latestVersionNo: nextVersionNo,
            latestVersionId: version._id,
            isDeleted: input.action === 'deleted',
            streamKey,
            updatedAt: now,
            updatedBy: userObjectId,
          },
        },
        { session: activeSession },
      );

      return {
        streamId: stream._id as Types.ObjectId,
        versionId: version._id as Types.ObjectId,
        versionNo: nextVersionNo,
      };
    };

    try {
      if (ownsSession) {
        session.startTransaction();
        const result = await run(session);
        await session.commitTransaction();
        return result;
      }

      return await run(session);
    } catch (error) {
      if (ownsSession && session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (ownsSession) {
        session.endSession();
      }
    }
  }

  async trackDocumentVersionChangeSafe(
    input: TrackDocumentVersionChangeInput,
  ): Promise<void> {
    try {
      await this.trackDocumentVersionChange(input);
    } catch (error) {
      this.logger.error(
        `Failed to track document version for URN ${input.urnNo}, section ${input.sectionKey}, slot ${input.slotKey}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async trackAllProductDocument(input: TrackAllProductDocumentInput): Promise<void> {
    await this.trackDocumentVersionChangeSafe(
      buildAllProductDocumentTrackInput(input),
    );
  }

  async trackPaymentDocument(input: TrackPaymentDocumentInput): Promise<void> {
    await this.trackDocumentVersionChangeSafe(
      buildPaymentDocumentTrackInput(input),
    );
  }

  async getDocumentHistory(query: DocumentStreamQueryInput) {
    const stream = await this.findStreamOrThrow(query);

    if (stream.isDeleted) {
      return {
        stream: this.mapStream(stream),
        versions: [],
      };
    }

    const versions = await this.docVersionModel
      .find({ streamId: stream._id, action: { $ne: 'deleted' } })
      .sort({ versionNo: -1 })
      .lean()
      .exec();

    return {
      stream: this.mapStream(stream),
      versions: versions.map((version) => this.mapVersion(version)),
    };
  }

  async getLatestDocumentMetadata(query: DocumentStreamQueryInput) {
    const stream = await this.findStreamOrThrow(query);

    if (stream.isDeleted) {
      throw new NotFoundException('Document stream has been deleted');
    }
    const latestVersion = await this.docVersionModel
      .findOne({ streamId: stream._id, isLatest: true })
      .lean()
      .exec();

    if (!latestVersion) {
      throw new NotFoundException('Latest document version not found for stream');
    }

    return {
      stream: this.mapStream(stream),
      latestVersion: this.mapVersion(latestVersion),
    };
  }

  private async findStreamOrThrow(
    query: DocumentStreamQueryInput,
  ): Promise<DocStreamDocument> {
    const filter = buildStreamIdentityFilter(query);
    const stream = await this.docStreamModel.findOne(filter).exec();

    if (!stream) {
      throw new NotFoundException('Document stream not found');
    }

    return stream;
  }

  private mapStream(stream: DocStreamDocument | Record<string, unknown>) {
    const plain =
      typeof (stream as DocStreamDocument).toObject === 'function'
        ? (stream as DocStreamDocument).toObject()
        : stream;

    return {
      _id: plain._id,
      urnNo: plain.urnNo,
      processType: plain.processType,
      renewalCycleId: plain.renewalCycleId ?? null,
      sectionKey: plain.sectionKey,
      subsectionKey: plain.subsectionKey ?? null,
      slotKey: plain.slotKey,
      streamKey: plain.streamKey,
      liveSource: plain.liveSource,
      liveRef: plain.liveRef,
      latestVersionNo: plain.latestVersionNo,
      latestVersionId: plain.latestVersionId ?? null,
      isDeleted: plain.isDeleted,
      createdAt: plain.createdAt,
      createdBy: plain.createdBy,
      updatedAt: plain.updatedAt,
      updatedBy: plain.updatedBy,
    };
  }

  private mapVersion(version: Record<string, unknown>) {
    return {
      _id: version._id,
      streamId: version.streamId,
      urnNo: version.urnNo,
      processType: version.processType,
      renewalCycleId: version.renewalCycleId ?? null,
      roundNo: version.roundNo ?? null,
      versionNo: version.versionNo,
      action: version.action,
      filePath: version.filePath ?? null,
      originalName: version.originalName ?? null,
      storedName: version.storedName ?? null,
      mimeType: version.mimeType ?? null,
      sizeBytes: version.sizeBytes ?? null,
      checksum: version.checksum ?? null,
      isLatest: version.isLatest,
      createdAt: version.createdAt,
      createdBy: version.createdBy,
    };
  }
}
