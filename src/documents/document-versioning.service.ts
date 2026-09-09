import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { DocStream, DocStreamDocument } from './schemas/doc-stream.schema';
import { DocVersion, DocVersionDocument } from './schemas/doc-version.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../renew/schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../renew/schemas/renewal-cycle.schema';
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
  certificationSlotKey,
  usesRenewPerDocumentVersionSlot,
} from './helpers/certification-document-version.util';
import {
  DocumentStreamQueryInput,
  TrackAllProductDocumentInput,
  TrackDocumentVersionChangeInput,
  TrackPaymentDocumentInput,
} from './types/document-version.types';

function normalizeHistoryPath(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\\/g, '/')
    .toLowerCase();
}

function normalizeHistoryFileName(value: unknown): string {
  const raw = normalizeHistoryPath(value);
  if (!raw) return '';
  const parts = raw.split('/');
  return parts[parts.length - 1] || raw;
}

@Injectable()
export class DocumentVersioningService {
  private readonly logger = new Logger(DocumentVersioningService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(DocStream.name)
    private readonly docStreamModel: Model<DocStreamDocument>,
    @InjectModel(DocVersion.name)
    private readonly docVersionModel: Model<DocVersionDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
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
    const stream = await this.resolveHistoryStream(query);

    if (!stream) {
      throw new NotFoundException('Document stream not found');
    }

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

    const filtered = await this.filterRenewHistoryVersions(
      query,
      versions as Array<Record<string, unknown>>,
    );

    const mapped = filtered.map((version) => this.mapVersion(version));
    const enriched = await this.enrichInitialHistoryVersionsWithRenewSources(
      query,
      mapped,
    );

    return {
      stream: this.mapStream(stream),
      versions: enriched,
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
    const stream = await this.resolveHistoryStream(query);

    if (!stream) {
      throw new NotFoundException('Document stream not found');
    }

    return stream;
  }

  private async resolveHistoryStream(
    query: DocumentStreamQueryInput,
  ): Promise<DocStreamDocument | null> {
    const filter = buildStreamIdentityFilter(query);
    let stream = await this.docStreamModel.findOne(filter).exec();

    if (
      !stream &&
      query.anchorProductDocumentId &&
      normalizeProcessType(query.processType) === 'renewal' &&
      usesRenewPerDocumentVersionSlot(query.sectionKey)
    ) {
      const legacySlot = certificationSlotKey(
        query.sectionKey,
        query.subsectionKey ?? null,
      );
      stream = await this.docStreamModel
        .findOne({
          ...filter,
          slotKey: legacySlot,
        })
        .exec();
    }

    return stream;
  }

  private normalizeDocPath(value: string): string {
    return value.trim().replace(/\\/g, '/').toLowerCase();
  }

  private async filterRenewHistoryVersions(
    query: DocumentStreamQueryInput,
    versions: Array<Record<string, unknown>>,
  ): Promise<Array<Record<string, unknown>>> {
    if (normalizeProcessType(query.processType) !== 'renewal') {
      return versions;
    }

    const urnNo = query.urnNo.trim();
    const sectionKey = query.sectionKey;
    const cycleId =
      query.renewalCycleId && Types.ObjectId.isValid(query.renewalCycleId)
        ? new Types.ObjectId(query.renewalCycleId)
        : null;

    const deletedFilter: Record<string, unknown> = {
      urnNo,
      documentForm: sectionKey,
      isDeleted: true,
    };
    if (cycleId) {
      deletedFilter.$or = [
        { renewalCycleId: cycleId },
        { renewalCycleId: null },
        { renewalCycleId: { $exists: false } },
      ];
    }

    const deletedDocs = await this.renewDocumentModel
      .find(deletedFilter)
      .select('documentLink productDocumentId')
      .lean()
      .exec();
    const deletedPaths = new Set(
      deletedDocs
        .map((doc) => this.normalizeDocPath(String(doc.documentLink ?? '')))
        .filter(Boolean),
    );

    let filtered = versions.filter((version) => {
      const path = this.normalizeDocPath(String(version.filePath ?? ''));
      return !path || !deletedPaths.has(path);
    });

    const anchorId = query.anchorProductDocumentId;
    if (!anchorId || !usesRenewPerDocumentVersionSlot(sectionKey)) {
      return filtered;
    }

    const docFilter: Record<string, unknown> = {
      urnNo,
      documentForm: sectionKey,
      productDocumentId: anchorId,
    };
    if (cycleId) {
      docFilter.renewalCycleId = cycleId;
    }

    const docRows = await this.renewDocumentModel
      .find(docFilter)
      .select('documentLink isDeleted')
      .lean()
      .exec();
    const active = docRows.find((doc) => doc.isDeleted !== true);
    if (!active) {
      return [];
    }

    const activePath = this.normalizeDocPath(String(active.documentLink ?? ''));
    const deletedPathsForAnchor = new Set(
      docRows
        .filter((doc) => doc.isDeleted === true)
        .map((doc) => this.normalizeDocPath(String(doc.documentLink ?? '')))
        .filter(Boolean),
    );

    return filtered.filter((version) => {
      const path = this.normalizeDocPath(String(version.filePath ?? ''));
      if (!path) return false;
      if (deletedPathsForAnchor.has(path)) return false;
      return !activePath || path === activePath;
    });
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
    const renewalCycleId =
      version.renewalCycleId != null && String(version.renewalCycleId).trim() !== ''
        ? String(version.renewalCycleId)
        : null;
    return {
      _id: version._id,
      streamId: version.streamId,
      urnNo: version.urnNo,
      processType: version.processType,
      renewalCycleId,
      renewalCycleNo:
        version.renewalCycleNo != null && Number.isFinite(Number(version.renewalCycleNo))
          ? Number(version.renewalCycleNo)
          : null,
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

  /**
   * After renew completion, uploads are promoted onto the Initial stream with
   * processType=initial. Re-label History rows that match renew product documents
   * so admin Source shows Cycle N instead of Initial.
   */
  private async enrichInitialHistoryVersionsWithRenewSources(
    query: DocumentStreamQueryInput,
    versions: Array<Record<string, unknown>>,
  ): Promise<Array<Record<string, unknown>>> {
    if (normalizeProcessType(query.processType) !== 'initial' || versions.length === 0) {
      return versions;
    }

    const urnNo = String(query.urnNo ?? '').trim();
    const sectionKey = String(query.sectionKey ?? '').trim();
    if (!urnNo || !sectionKey) return versions;

    const renewDocs = await this.renewDocumentModel
      .find({
        urnNo,
      })
      .select('documentLink documentOriginalName documentName renewalCycleId documentForm')
      .lean()
      .exec();

    if (!renewDocs.length) return versions;

    const cycleIds = Array.from(
      new Set(
        renewDocs
          .map((doc) =>
            doc.renewalCycleId != null ? String(doc.renewalCycleId).trim() : '',
          )
          .filter(Boolean),
      ),
    );

    const cycleNoById = new Map<string, number>();
    if (cycleIds.length > 0) {
      const cycles = await this.renewalCycleModel
        .find({
          _id: {
            $in: cycleIds
              .filter((id) => Types.ObjectId.isValid(id))
              .map((id) => new Types.ObjectId(id)),
          },
        })
        .select('cycleNo')
        .lean()
        .exec();
      for (const cycle of cycles) {
        const id = String(cycle._id);
        const no = Number(cycle.cycleNo);
        if (Number.isFinite(no) && no > 0) cycleNoById.set(id, no);
      }
    }

    type RenewMatch = { renewalCycleId: string; renewalCycleNo: number | null };
    const byPath = new Map<string, RenewMatch>();
    const byName = new Map<string, RenewMatch>();

    for (const doc of renewDocs) {
      const cycleId =
        doc.renewalCycleId != null ? String(doc.renewalCycleId).trim() : '';
      if (!cycleId) continue;
      const match: RenewMatch = {
        renewalCycleId: cycleId,
        renewalCycleNo: cycleNoById.get(cycleId) ?? null,
      };
      const path = normalizeHistoryPath(doc.documentLink);
      if (path) byPath.set(path, match);
      const original = normalizeHistoryFileName(doc.documentOriginalName);
      if (original) byName.set(original, match);
      const stored = normalizeHistoryFileName(doc.documentName);
      if (stored) byName.set(stored, match);
      if (path) {
        const pathName = normalizeHistoryFileName(path);
        if (pathName) byName.set(pathName, match);
      }
    }

    if (byPath.size === 0 && byName.size === 0) return versions;

    return versions.map((version) => {
      const existingProcess = String(version.processType ?? '')
        .trim()
        .toLowerCase();
      if (existingProcess === 'renewal' && version.renewalCycleId) {
        return version;
      }

      const path = normalizeHistoryPath(version.filePath);
      const original = normalizeHistoryFileName(version.originalName);
      const stored = normalizeHistoryFileName(version.storedName);
      const match =
        (path ? byPath.get(path) : undefined) ||
        (path ? byName.get(normalizeHistoryFileName(path)) : undefined) ||
        (original ? byName.get(original) : undefined) ||
        (stored ? byName.get(stored) : undefined);

      if (!match) return version;

      return {
        ...version,
        processType: 'renewal',
        renewalCycleId: match.renewalCycleId,
        renewalCycleNo: match.renewalCycleNo,
      };
    });
  }
}
