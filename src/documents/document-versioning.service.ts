import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { DocStream, DocStreamDocument } from './schemas/doc-stream.schema';
import { DocVersion, DocVersionDocument } from './schemas/doc-version.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../renew/schemas/renewal-cycle.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../renew/schemas/all-renew-product-document.schema';
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

type DocumentIdentitySets = {
  activeProductDocumentIds: Set<number>;
  activeFilePaths: Set<string>;
  /** Vendor-removed files only — superseded soft-deletes are NOT included. */
  historyHiddenProductDocumentIds: Set<number>;
  historyHiddenFilePaths: Set<string>;
};

@Injectable()
export class DocumentVersioningService implements OnModuleInit {
  private readonly logger = new Logger(DocumentVersioningService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(DocStream.name)
    private readonly docStreamModel: Model<DocStreamDocument>,
    @InjectModel(DocVersion.name)
    private readonly docVersionModel: Model<DocVersionDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly allRenewProductDocumentModel: Model<AllRenewProductDocumentDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.ensureDocVersionIndexes();
    } catch (error) {
      this.logger.warn(
        `doc_versions index migration skipped: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Drop legacy unique (streamId, versionNo) so multiple files can share a lifecycle version.
   */
  private async ensureDocVersionIndexes(): Promise<void> {
    const collection = this.connection.collection('doc_versions');
    const indexes = await collection.indexes();
    const legacy = indexes.find((idx) => idx.name === 'streamId_1_versionNo_1');
    if (legacy?.unique) {
      await collection.dropIndex('streamId_1_versionNo_1');
      this.logger.log(
        'Dropped legacy unique index streamId_1_versionNo_1 on doc_versions',
      );
    }
    await this.docVersionModel.createIndexes();
  }

  /**
   * Mark existing streams for the given section keys as awaiting vendor revision.
   * Does not change latestVersionNo / badge.
   */
  async markStreamsAwaitingRevision(input: {
    urnNo: string;
    sectionKeys: string[];
    session?: ClientSession;
  }): Promise<number> {
    const urnNo = input.urnNo.trim();
    const sectionKeys = Array.from(
      new Set(
        (input.sectionKeys ?? [])
          .map((k) => String(k ?? '').trim())
          .filter(Boolean),
      ),
    );
    if (!urnNo || sectionKeys.length === 0) {
      return 0;
    }

    const now = new Date();
    const result = await this.docStreamModel
      .updateMany(
        {
          urnNo,
          processType: 'initial',
          renewalCycleId: null,
          sectionKey: { $in: sectionKeys },
        },
        {
          $set: {
            awaitingRevision: true,
            updatedAt: now,
          },
        },
        input.session ? { session: input.session } : {},
      )
      .exec();

    return Number(result.modifiedCount ?? result.matchedCount ?? 0);
  }

  /**
   * Identities for CURRENT DOCUMENT lists vs full History timelines.
   * CURRENT uses the highest versionNo per stream that still has ≥1 active
   * (non-deleted) file — not blindly stream.latestVersionNo (which stays at the
   * allocation watermark even after vendor deletes every file in that version).
   * History rows remain in doc_versions; vendor-deleted files are excluded from
   * the CURRENT allowlist and from History API responses separately.
   */
  /**
   * CURRENT document allowlist: per stream, highest versionNo that still has ≥1
   * displayable file.
   * Defaults to initial-certification streams (processType=initial).
   * Pass processType:'renewal' (+ optional renewalCycleIds) for renew Quick View.
   *
   * excludeOpenRenewalCycles: Certified Products must resolve the last COMPLETED
   * certification — open renew versions (V5/V6 mid-cycle) are excluded. Soft-deleted
   * superseded files from the completed version remain eligible (not historyHidden).
   */
  async getCurrentVersionDocumentAllowlist(
    urnNo: string,
    options?: {
      processType?: 'initial' | 'renewal';
      renewalCycleIds?: Array<string | Types.ObjectId | null | undefined>;
      excludeOpenRenewalCycles?: boolean;
    },
  ): Promise<{
    productDocumentIds: Set<number>;
    filePaths: Set<string>;
    historicalProductDocumentIds: Set<number>;
    historicalFilePaths: Set<string>;
    hasVersionedStreams: boolean;
  }> {
    const trimmed = urnNo.trim();
    const productDocumentIds = new Set<number>();
    const filePaths = new Set<string>();
    const historicalProductDocumentIds = new Set<number>();
    const historicalFilePaths = new Set<string>();

    const processType = options?.processType ?? 'initial';
    const streamFilter: Record<string, unknown> = {
      urnNo: trimmed,
      processType,
      latestVersionNo: { $gt: 0 },
    };

    if (processType === 'initial') {
      streamFilter.renewalCycleId = null;
    } else if (options?.renewalCycleIds && options.renewalCycleIds.length > 0) {
      const cycleValues = options.renewalCycleIds.map((id) => {
        if (id == null || id === '') return null;
        if (id instanceof Types.ObjectId) return id;
        return normalizeRenewalCycleId(String(id));
      });
      streamFilter.renewalCycleId = { $in: cycleValues };
    }

    const streams = await this.docStreamModel
      .find(streamFilter)
      .select('_id latestVersionNo')
      .lean()
      .exec();

    if (!streams.length) {
      return {
        productDocumentIds,
        filePaths,
        historicalProductDocumentIds,
        historicalFilePaths,
        hasVersionedStreams: false,
      };
    }

    const streamIds = streams.map((stream) => stream._id);
    const [trackedVersions, identities] = await Promise.all([
      this.docVersionModel
        .find({
          streamId: { $in: streamIds },
          action: { $ne: 'deleted' },
        })
        .select('streamId versionNo productDocumentId filePath renewalCycleId processType')
        .lean()
        .exec(),
      this.loadProductDocumentIdentitiesForUrn(trimmed),
    ]);

    const allTrackedVersions = trackedVersions as Array<Record<string, unknown>>;

    // Historical identities must include open-cycle rows so live renew files are not
    // treated as "untracked" and kept in Certified CURRENT by fail-open.
    for (const version of allTrackedVersions) {
      const pid = Number(version.productDocumentId);
      if (Number.isFinite(pid) && pid > 0) {
        historicalProductDocumentIds.add(pid);
      }
      const path = String(version.filePath ?? '').trim().toLowerCase();
      if (path) {
        historicalFilePaths.add(path);
      }
    }

    let versionsForCurrentTip = allTrackedVersions;
    if (options?.excludeOpenRenewalCycles) {
      versionsForCurrentTip = await this.applyOpenCycleFilter(
        { urnNo: trimmed, includeOpenCycleVersions: false },
        allTrackedVersions,
      );
    }

    const displayableVersionByStream = options?.excludeOpenRenewalCycles
      ? this.resolveDisplayableVersionNoByStreamForCompletedCertification(
          versionsForCurrentTip,
          identities,
        )
      : this.resolveDisplayableVersionNoByStream(versionsForCurrentTip, identities);

    for (const version of versionsForCurrentTip) {
      const streamKey = String(version.streamId);
      const displayableVersion = displayableVersionByStream.get(streamKey);
      if (
        displayableVersion == null ||
        Number(version.versionNo) !== displayableVersion
      ) {
        continue;
      }
      const rowActive = options?.excludeOpenRenewalCycles
        ? !this.isVersionRowHiddenFromHistory(version, identities)
        : this.isVersionRowActive(version, identities);
      if (!rowActive) {
        continue;
      }
      const pid = Number(version.productDocumentId);
      if (Number.isFinite(pid) && pid > 0) {
        productDocumentIds.add(pid);
      }
      const path = String(version.filePath ?? '').trim().toLowerCase();
      if (path) {
        filePaths.add(path);
      }
    }

    return {
      productDocumentIds,
      filePaths,
      historicalProductDocumentIds,
      historicalFilePaths,
      hasVersionedStreams: true,
    };
  }

  /**
   * Soft-deleted-but-not-historyHidden files that belong to the completed-cert
   * CURRENT allowlist (needed when renew supersede soft-deleted the prior tip).
   */
  async loadCompletedCertificationDocumentsByAllowlist(
    urnNo: string,
    allowlist: {
      productDocumentIds: Set<number>;
      filePaths: Set<string>;
    },
  ): Promise<Array<Record<string, unknown>>> {
    const trimmed = urnNo.trim();
    const pids = [...allowlist.productDocumentIds].filter(
      (n) => Number.isFinite(n) && n > 0,
    );
    if (!pids.length) return [];

    const rows = await this.allProductDocumentModel
      .find({
        urnNo: trimmed,
        productDocumentId: { $in: pids },
        historyHidden: { $ne: true },
      })
      .lean()
      .exec();

    return (rows as Array<Record<string, unknown>>).filter((doc) => {
      const pid = Number(doc.productDocumentId ?? 0);
      if (Number.isFinite(pid) && pid > 0 && allowlist.productDocumentIds.has(pid)) {
        return true;
      }
      const path = String(doc.documentLink ?? '')
        .trim()
        .toLowerCase();
      return Boolean(path && allowlist.filePaths.has(path));
    });
  }

  /**
   * Stamp `versionNo` (and related fields) onto live document rows from doc_versions.
   * Used so CURRENT UI can keep only the latest active version group without
   * mutating History rows.
   */
  async stampProductDocumentVersionNos<T extends Record<string, unknown>>(
    urnNo: string,
    docs: T[],
  ): Promise<T[]> {
    if (!Array.isArray(docs) || docs.length === 0) {
      return docs;
    }
    const pids = [
      ...new Set(
        docs
          .map((doc) =>
            Number(doc.productDocumentId ?? doc.product_document_id ?? 0),
          )
          .filter((n) => Number.isFinite(n) && n > 0),
      ),
    ];
    if (!pids.length) {
      return docs;
    }

    const versions = await this.docVersionModel
      .find({
        urnNo: urnNo.trim(),
        productDocumentId: { $in: pids },
        action: { $ne: 'deleted' },
      })
      .select(
        'productDocumentId versionNo processType renewalCycleId renewalCycleNo isLatest',
      )
      .lean()
      .exec();

    type VersionMeta = {
      versionNo: number;
      processType?: string;
      renewalCycleId?: unknown;
      renewalCycleNo?: number | null;
      isLatest?: boolean;
    };
    const byPid = new Map<number, VersionMeta>();
    for (const version of versions) {
      const pid = Number(version.productDocumentId);
      if (!Number.isFinite(pid) || pid <= 0) continue;
      const versionNo = Number(version.versionNo);
      if (!Number.isFinite(versionNo) || versionNo <= 0) continue;
      const prev = byPid.get(pid);
      if (!prev || versionNo > prev.versionNo) {
        byPid.set(pid, {
          versionNo,
          processType:
            typeof version.processType === 'string'
              ? version.processType
              : undefined,
          renewalCycleId: version.renewalCycleId,
          renewalCycleNo:
            version.renewalCycleNo != null &&
            Number.isFinite(Number(version.renewalCycleNo))
              ? Number(version.renewalCycleNo)
              : null,
          isLatest: version.isLatest === true,
        });
      }
    }

    if (!byPid.size) {
      return docs;
    }

    return docs.map((doc) => {
      const pid = Number(doc.productDocumentId ?? doc.product_document_id ?? 0);
      const meta = byPid.get(pid);
      if (!meta) return doc;
      return {
        ...doc,
        versionNo: meta.versionNo,
        version_no: meta.versionNo,
        isLatest: meta.isLatest === true,
        is_latest: meta.isLatest === true,
        ...(meta.processType
          ? { processType: meta.processType, process_type: meta.processType }
          : {}),
        ...(meta.renewalCycleId != null
          ? {
              renewalCycleId: meta.renewalCycleId,
              renewal_cycle_id: meta.renewalCycleId,
            }
          : {}),
        ...(meta.renewalCycleNo != null
          ? { renewalCycleNo: meta.renewalCycleNo, renewal_cycle_no: meta.renewalCycleNo }
          : {}),
      };
    });
  }

  /**
   * Keep only documents that belong to the displayable current version of their stream
   * (highest versionNo with ≥1 active file). Does not mutate History (doc_versions).
   */
  filterDocumentsToCurrentVersion<T extends Record<string, unknown>>(
    docs: T[],
    allowlist: {
      productDocumentIds: Set<number>;
      filePaths: Set<string>;
      historicalProductDocumentIds?: Set<number>;
      historicalFilePaths?: Set<string>;
      hasVersionedStreams: boolean;
    },
    options?: {
      /** Certified CURRENT: only allowlist tip identities — never fail-open untracked rows. */
      strictAllowlist?: boolean;
    },
  ): T[] {
    if (!Array.isArray(docs) || docs.length === 0) {
      return docs;
    }
    if (!allowlist.hasVersionedStreams) {
      return docs;
    }

    const historicalIds = allowlist.historicalProductDocumentIds ?? new Set<number>();
    const historicalPaths = allowlist.historicalFilePaths ?? new Set<string>();
    const hasCurrent =
      allowlist.productDocumentIds.size > 0 || allowlist.filePaths.size > 0;
    const hasHistorical = historicalIds.size > 0 || historicalPaths.size > 0;

    // No active files on any displayable version: hide known History identities
    // (do not resurrect older-cycle rows as "current" via empty allowlist).
    if (!hasCurrent && !hasHistorical) {
      return docs;
    }

    return docs.filter((doc) => {
      const pid = Number(
        doc.productDocumentId ?? doc.product_document_id ?? 0,
      );
      const path = String(
        doc.documentLink ?? doc.document_link ?? doc.filePath ?? doc.file_path ?? '',
      )
        .trim()
        .toLowerCase();

      if (Number.isFinite(pid) && pid > 0 && allowlist.productDocumentIds.has(pid)) {
        return true;
      }
      if (path && allowlist.filePaths.has(path)) {
        return true;
      }

      if (options?.strictAllowlist) {
        return false;
      }

      // Known History identities that are not on the displayable version stay out of CURRENT.
      if (Number.isFinite(pid) && pid > 0 && historicalIds.has(pid)) {
        return false;
      }
      if (path && historicalPaths.has(path)) {
        return false;
      }

      // Not present in History — keep (legacy / untracked live docs).
      return true;
    });
  }

  /**
   * Product document IDs that do not yet have any doc_versions row.
   * Used to backfill renew uploads that skipped version tracking.
   */
  async filterUntrackedProductDocumentIds(
    productDocumentIds: number[],
    session?: ClientSession,
  ): Promise<number[]> {
    const ids = [
      ...new Set(
        productDocumentIds.filter((n) => Number.isFinite(n) && n > 0),
      ),
    ];
    if (!ids.length) return [];

    let query = this.docVersionModel
      .find({ productDocumentId: { $in: ids } })
      .select('productDocumentId')
      .lean();
    if (session) {
      query = query.session(session);
    }
    const rows = await query.exec();
    const tracked = new Set(
      rows
        .map((row) => Number(row.productDocumentId))
        .filter((n) => Number.isFinite(n) && n > 0),
    );
    return ids.filter((id) => !tracked.has(id));
  }

  private async loadProductDocumentIdentitiesForUrn(
    urnNo: string,
  ): Promise<DocumentIdentitySets> {
    const [certRows, renewRows] = await Promise.all([
      this.allProductDocumentModel
        .find({ urnNo })
        .select('productDocumentId documentLink isDeleted historyHidden')
        .lean()
        .exec(),
      this.allRenewProductDocumentModel
        .find({ urnNo })
        .select('productDocumentId documentLink isDeleted historyHidden')
        .lean()
        .exec(),
    ]);

    const activeProductDocumentIds = new Set<number>();
    const activeFilePaths = new Set<string>();
    const historyHiddenProductDocumentIds = new Set<number>();
    const historyHiddenFilePaths = new Set<string>();

    const ingest = (
      rows: Array<{
        productDocumentId?: number;
        documentLink?: string;
        isDeleted?: boolean;
        historyHidden?: boolean;
      }>,
    ) => {
      for (const row of rows) {
        const pid = Number(row.productDocumentId);
        const path = String(row.documentLink ?? '').trim().toLowerCase();
        if (row.historyHidden === true) {
          if (Number.isFinite(pid) && pid > 0) {
            historyHiddenProductDocumentIds.add(pid);
          }
          if (path) {
            historyHiddenFilePaths.add(path);
          }
        }
        if (row.isDeleted === true) {
          continue;
        }
        if (Number.isFinite(pid) && pid > 0) {
          activeProductDocumentIds.add(pid);
        }
        if (path) {
          activeFilePaths.add(path);
        }
      }
    };

    ingest(certRows);
    ingest(renewRows);

    return {
      activeProductDocumentIds,
      activeFilePaths,
      historyHiddenProductDocumentIds,
      historyHiddenFilePaths,
    };
  }

  /** Vendor-removed files only (not upload supersede soft-deletes). */
  private isVersionRowHiddenFromHistory(
    version: Record<string, unknown>,
    identities: DocumentIdentitySets,
  ): boolean {
    const pid = Number(version.productDocumentId ?? 0);
    const path = String(version.filePath ?? '').trim().toLowerCase();
    if (
      Number.isFinite(pid) &&
      pid > 0 &&
      identities.historyHiddenProductDocumentIds.has(pid)
    ) {
      return true;
    }
    if (path && identities.historyHiddenFilePaths.has(path)) {
      return true;
    }
    return false;
  }

  private isVersionRowActive(
    version: Record<string, unknown>,
    identities: DocumentIdentitySets,
  ): boolean {
    if (this.isVersionRowHiddenFromHistory(version, identities)) {
      return false;
    }

    const pid = Number(version.productDocumentId ?? 0);
    const path = String(version.filePath ?? '').trim().toLowerCase();

    if (Number.isFinite(pid) && pid > 0) {
      return identities.activeProductDocumentIds.has(pid);
    }

    // Payment / path-only rows: active when path is live.
    if (path) {
      return identities.activeFilePaths.has(path);
    }

    return false;
  }

  /**
   * Per stream: highest versionNo that still has ≥1 active (non-deleted) file.
   * Does not mutate stream.latestVersionNo (allocation watermark).
   */
  private resolveDisplayableVersionNoByStream(
    versions: Array<Record<string, unknown>>,
    identities: DocumentIdentitySets,
  ): Map<string, number> {
    const displayable = new Map<string, number>();
    for (const version of versions) {
      if (!this.isVersionRowActive(version, identities)) {
        continue;
      }
      const streamKey = String(version.streamId ?? '');
      if (!streamKey) continue;
      const versionNo = Number(version.versionNo);
      if (!Number.isFinite(versionNo) || versionNo <= 0) continue;
      const prev = displayable.get(streamKey) ?? 0;
      if (versionNo > prev) {
        displayable.set(streamKey, versionNo);
      }
    }
    return displayable;
  }

  /**
   * Certified Products: highest version among completed-cert versions whose files
   * are not vendor-deleted (historyHidden). Soft-deleted superseded uploads still count
   * so an open renew cannot blank the previous completed certification.
   */
  private resolveDisplayableVersionNoByStreamForCompletedCertification(
    versions: Array<Record<string, unknown>>,
    identities: DocumentIdentitySets,
  ): Map<string, number> {
    const displayable = new Map<string, number>();
    for (const version of versions) {
      if (this.isVersionRowHiddenFromHistory(version, identities)) {
        continue;
      }
      const streamKey = String(version.streamId ?? '');
      if (!streamKey) continue;
      const versionNo = Number(version.versionNo);
      if (!Number.isFinite(versionNo) || versionNo <= 0) continue;
      const prev = displayable.get(streamKey) ?? 0;
      if (versionNo > prev) {
        displayable.set(streamKey, versionNo);
      }
    }
    return displayable;
  }

  /**
   * Resolve the version number for an upload on this stream.
   * - awaitingRevision → atomically allocate next version (first post-resend upload)
   * - latestVersionNo <= 0 → allocate V1 (first ever upload)
   * - otherwise → reuse current latestVersionNo (same review cycle)
   */
  private async resolveStreamVersionNoForUpload(
    stream: DocStreamDocument,
    activeSession: ClientSession,
    now: Date,
    userObjectId: Types.ObjectId,
  ): Promise<number> {
    if (stream.awaitingRevision) {
      const claimed = await this.docStreamModel
        .findOneAndUpdate(
          { _id: stream._id, awaitingRevision: true },
          {
            $inc: { latestVersionNo: 1 },
            $set: {
              awaitingRevision: false,
              updatedAt: now,
              updatedBy: userObjectId,
            },
          },
          { new: true, session: activeSession },
        )
        .exec();

      if (claimed) {
        return Number(claimed.latestVersionNo);
      }

      const refreshed = await this.docStreamModel
        .findById(stream._id)
        .session(activeSession)
        .exec();
      const n = Number(refreshed?.latestVersionNo ?? stream.latestVersionNo ?? 1);
      return n > 0 ? n : 1;
    }

    const current = Number(stream.latestVersionNo ?? 0);
    if (current > 0) {
      return current;
    }

    const claimedFirst = await this.docStreamModel
      .findOneAndUpdate(
        { _id: stream._id, latestVersionNo: { $lte: 0 } },
        {
          $set: {
            latestVersionNo: 1,
            awaitingRevision: false,
            updatedAt: now,
            updatedBy: userObjectId,
          },
        },
        { new: true, session: activeSession },
      )
      .exec();

    if (claimedFirst) {
      return 1;
    }

    const refreshed = await this.docStreamModel
      .findById(stream._id)
      .session(activeSession)
      .exec();
    const n = Number(refreshed?.latestVersionNo ?? 1);
    return n > 0 ? n : 1;
  }

  async trackDocumentVersionChange(
    input: TrackDocumentVersionChangeInput,
  ): Promise<{ streamId: Types.ObjectId; versionId: Types.ObjectId; versionNo: number }> {
    // Vendor-initiated deletes must not create History rows.
    if (input.action === 'deleted') {
      return {
        streamId: new Types.ObjectId(),
        versionId: new Types.ObjectId(),
        versionNo: 0,
      };
    }

    const ownsSession = !input.session;
    const session = input.session ?? (await this.connection.startSession());

    const run = async (activeSession: ClientSession) => {
      const now = new Date();
      const userObjectId = toObjectId(input.userId, 'userId');
      const versionProcessType = normalizeProcessType(input.processType);
      const versionRenewalCycleId = normalizeRenewalCycleId(input.renewalCycleId);
      const urnNo = input.urnNo.trim();
      const subsectionKey = input.subsectionKey ?? null;
      const slotKey = input.slotKey;
      const filePath =
        input.filePath != null && String(input.filePath).trim() !== ''
          ? String(input.filePath).trim()
          : null;
      const productDocumentId =
        input.productDocumentId != null &&
        Number.isFinite(Number(input.productDocumentId))
          ? Number(input.productDocumentId)
          : null;

      let renewalCycleNo = input.renewalCycleNo ?? null;
      if (
        renewalCycleNo == null &&
        versionProcessType === 'renewal' &&
        versionRenewalCycleId != null
      ) {
        const cycle = await this.renewalCycleModel
          .findById(versionRenewalCycleId)
          .select('cycleNo')
          .lean()
          .session(activeSession)
          .exec();
        const no = Number(cycle?.cycleNo);
        if (Number.isFinite(no) && no > 0) {
          renewalCycleNo = no;
        }
      }

      const streamKey = buildStreamKey({
        urnNo,
        sectionKey: input.sectionKey,
        subsectionKey,
        slotKey,
      });

      let stream = await this.docStreamModel
        .findOne({
          urnNo,
          processType: 'initial',
          renewalCycleId: null,
          sectionKey: input.sectionKey,
          subsectionKey,
          slotKey,
        })
        .session(activeSession)
        .exec();

      if (!stream) {
        const createdStreams = await this.docStreamModel.create(
          [
            {
              urnNo,
              processType: 'initial',
              renewalCycleId: null,
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
              awaitingRevision: false,
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

      const forced = Number(input.lifecycleVersionNo);
      const versionNo =
        Number.isFinite(forced) && forced > 0
          ? forced
          : await this.resolveStreamVersionNoForUpload(
              stream,
              activeSession,
              now,
              userObjectId,
            );

      // Older lifecycle versions are no longer "latest".
      await this.docVersionModel.updateMany(
        { streamId: stream._id, versionNo: { $lt: versionNo } },
        { $set: { isLatest: false } },
        { session: activeSession },
      );

      const identityFilter: Record<string, unknown> = {
        streamId: stream._id,
        versionNo,
      };
      if (productDocumentId != null) {
        identityFilter.productDocumentId = productDocumentId;
      } else if (filePath) {
        identityFilter.filePath = filePath;
      }

      let version = await this.docVersionModel
        .findOne(identityFilter)
        .session(activeSession)
        .exec();

      if (version) {
        version.action = input.action;
        version.processType = versionProcessType;
        version.renewalCycleId = versionRenewalCycleId;
        version.renewalCycleNo = renewalCycleNo;
        version.roundNo = input.roundNo ?? null;
        version.filePath = filePath;
        version.originalName = input.originalName ?? null;
        version.storedName = input.storedName ?? null;
        version.mimeType = input.mimeType ?? null;
        version.sizeBytes = input.sizeBytes ?? null;
        version.checksum = input.checksum ?? null;
        version.productDocumentId = productDocumentId;
        version.isLatest = true;
        await version.save({ session: activeSession });
      } else {
        const versionDocs = await this.docVersionModel.create(
          [
            {
              streamId: stream._id,
              urnNo,
              processType: versionProcessType,
              renewalCycleId: versionRenewalCycleId,
              renewalCycleNo,
              roundNo: input.roundNo ?? null,
              versionNo,
              action: input.action,
              productDocumentId,
              filePath,
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
        version = versionDocs[0];
      }

      const nextLatest = Math.max(Number(stream.latestVersionNo ?? 0), versionNo);
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
            latestVersionNo: nextLatest,
            latestVersionId: version._id,
            isDeleted: false,
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
        versionNo,
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
    if (input.action === 'deleted') {
      return;
    }
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
    const { canonicalStream, legacyVersions } = await this.resolveHistoryStreams(query);

    if (!canonicalStream) {
      throw new NotFoundException('Document stream not found');
    }

    const canonicalVersions = await this.docVersionModel
      .find({ streamId: canonicalStream._id })
      .sort({ versionNo: 1, createdAt: 1 })
      .lean()
      .exec();

    const allVersions = this.mergeVersionTimelines(
      canonicalVersions as Array<Record<string, unknown>>,
      legacyVersions,
    );

    const withoutDeletedAction = allVersions.filter(
      (v) => String(v.action ?? '') !== 'deleted',
    );

    // Vendor soft-deletes must not appear in History (DB rows stay intact).
    const identities = await this.loadProductDocumentIdentitiesForUrn(
      String(canonicalStream.urnNo ?? query.urnNo ?? '').trim(),
    );
    const withoutVendorDeletedFiles = withoutDeletedAction.filter(
      (v) => !this.isVersionRowHiddenFromHistory(v, identities),
    );

    const filtered = await this.applyOpenCycleFilter(
      query,
      withoutVendorDeletedFiles,
    );

    const stream = this.mapStream(canonicalStream);
    let displayableVersionNo = 0;
    for (const version of filtered) {
      const n = Number(version.versionNo);
      if (Number.isFinite(n) && n > displayableVersionNo) {
        displayableVersionNo = n;
      }
    }
    if (displayableVersionNo > 0) {
      // CURRENT badge / History "(current)" helpers must not use allocation watermark
      // when vendor-deleted files removed the tip of the timeline from view.
      stream.latestVersionNo = displayableVersionNo;
    }

    return {
      stream,
      versions: filtered.map((v) => this.mapVersion(v)),
    };
  }

  async getLatestDocumentMetadata(query: DocumentStreamQueryInput) {
    const { canonicalStream } = await this.resolveHistoryStreams(query);

    if (!canonicalStream) {
      throw new NotFoundException('Document stream not found');
    }

    if (canonicalStream.isDeleted) {
      throw new NotFoundException('Document stream has been deleted');
    }

    const versions = await this.docVersionModel
      .find({
        streamId: canonicalStream._id,
        action: { $ne: 'deleted' },
      })
      .sort({ versionNo: -1, createdAt: -1 })
      .lean()
      .exec();

    const identities = await this.loadProductDocumentIdentitiesForUrn(
      String(canonicalStream.urnNo ?? query.urnNo ?? '').trim(),
    );

    // Certified Products: open renew versions must not become the badge/CURRENT tip.
    const visibleVersions = await this.applyOpenCycleFilter(
      query,
      versions as Array<Record<string, unknown>>,
    );

    const excludeOpen = query.includeOpenCycleVersions === false;
    const displayableByStream = excludeOpen
      ? this.resolveDisplayableVersionNoByStreamForCompletedCertification(
          visibleVersions,
          identities,
        )
      : this.resolveDisplayableVersionNoByStream(visibleVersions, identities);
    const displayableVersionNo = displayableByStream.get(
      String(canonicalStream._id),
    );

    if (displayableVersionNo != null && displayableVersionNo > 0) {
      const displayableVersion = visibleVersions.find((v) => {
        if (Number(v.versionNo) !== displayableVersionNo) return false;
        return excludeOpen
          ? !this.isVersionRowHiddenFromHistory(
              v as Record<string, unknown>,
              identities,
            )
          : this.isVersionRowActive(v as Record<string, unknown>, identities);
      });
      if (displayableVersion) {
        const stream = this.mapStream(canonicalStream);
        // Badge / CURRENT UI must use displayable version, not allocation watermark.
        stream.latestVersionNo = displayableVersionNo;
        return {
          stream,
          latestVersion: this.mapVersion(
            displayableVersion as Record<string, unknown>,
          ),
        };
      }
    }

    // No active CURRENT files — still expose History badge from highest
    // non-hidden history row (e.g. renew empty slot with prior certification files).
    let historyBadgeVersionNo = 0;
    let historyBadgeVersion: (typeof visibleVersions)[number] | null = null;
    for (const version of visibleVersions) {
      if (
        this.isVersionRowHiddenFromHistory(
          version as Record<string, unknown>,
          identities,
        )
      ) {
        continue;
      }
      const n = Number(version.versionNo);
      if (!Number.isFinite(n) || n <= 0) continue;
      if (n >= historyBadgeVersionNo) {
        historyBadgeVersionNo = n;
        historyBadgeVersion = version;
      }
    }
    if (historyBadgeVersion && historyBadgeVersionNo > 0) {
      const stream = this.mapStream(canonicalStream);
      stream.latestVersionNo = historyBadgeVersionNo;
      return {
        stream,
        latestVersion: this.mapVersion(
          historyBadgeVersion as Record<string, unknown>,
        ),
      };
    }

    // No history-visible versions remain for this stream.
    throw new NotFoundException('Latest document version not found for stream');
  }

  private async resolveHistoryStreams(query: DocumentStreamQueryInput): Promise<{
    canonicalStream: DocStreamDocument | null;
    legacyVersions: Array<Record<string, unknown>>;
  }> {
    const filter = buildStreamIdentityFilter(query);
    const canonicalStream = await this.docStreamModel.findOne(filter).exec();

    const legacyVersions: Array<Record<string, unknown>> = [];

    if (query.renewalCycleId && Types.ObjectId.isValid(query.renewalCycleId)) {
      const legacyCycleId = new Types.ObjectId(query.renewalCycleId);
      const legacyStreams = await this.docStreamModel
        .find({
          urnNo: query.urnNo.trim(),
          processType: 'renewal',
          renewalCycleId: legacyCycleId,
          sectionKey: query.sectionKey,
          subsectionKey: query.subsectionKey ?? null,
          slotKey: query.slotKey,
        })
        .exec();

      for (const legacyStream of legacyStreams) {
        const versions = await this.docVersionModel
          .find({ streamId: legacyStream._id })
          .lean()
          .exec();
        legacyVersions.push(...(versions as Array<Record<string, unknown>>));
      }
    }

    if (!canonicalStream && legacyVersions.length === 0) {
      return { canonicalStream: null, legacyVersions: [] };
    }

    const effectiveStream = canonicalStream ?? null;
    return { canonicalStream: effectiveStream, legacyVersions };
  }

  private mergeVersionTimelines(
    canonical: Array<Record<string, unknown>>,
    legacy: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    if (!legacy.length) return canonical;
    const all = [...canonical, ...legacy];
    all.sort((a, b) => {
      const va = Number(a.versionNo ?? 0);
      const vb = Number(b.versionNo ?? 0);
      if (va !== vb) return va - vb;
      const ta = new Date(String(a.createdAt ?? 0)).getTime();
      const tb = new Date(String(b.createdAt ?? 0)).getTime();
      return ta - tb;
    });
    return all;
  }

  private async applyOpenCycleFilter(
    query: Pick<DocumentStreamQueryInput, 'includeOpenCycleVersions'> & {
      urnNo?: string;
    },
    versions: Array<Record<string, unknown>>,
  ): Promise<Array<Record<string, unknown>>> {
    if (query.includeOpenCycleVersions !== false) {
      return versions;
    }

    const cycleIds = Array.from(
      new Set(
        versions
          .map((v) => (v.renewalCycleId != null ? String(v.renewalCycleId).trim() : ''))
          .filter(Boolean),
      ),
    );
    if (!cycleIds.length) return versions;

    const openCycleIds = new Set<string>();
    const cycles = await this.renewalCycleModel
      .find({
        _id: {
          $in: cycleIds
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id)),
        },
      })
      .select('status')
      .lean()
      .exec();

    const OPEN_STATUSES = new Set([
      'in_progress',
      'in-progress',
      'open',
      'active',
      'pending',
      'started',
    ]);
    for (const cycle of cycles) {
      const status = String(cycle.status ?? '').trim().toLowerCase();
      if (OPEN_STATUSES.has(status)) {
        openCycleIds.add(String(cycle._id));
      }
    }

    if (!openCycleIds.size) return versions;

    return versions.filter((v) => {
      const cid = v.renewalCycleId != null ? String(v.renewalCycleId).trim() : '';
      return !cid || !openCycleIds.has(cid);
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
      productDocumentId:
        version.productDocumentId != null &&
        Number.isFinite(Number(version.productDocumentId))
          ? Number(version.productDocumentId)
          : null,
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

  async findVersionByFilePath(
    urnNo: string,
    sectionKey: string,
    subsectionKey: string | null,
    slotKey: string,
    normalizedFilePath: string,
    session?: ClientSession,
  ): Promise<DocVersionDocument | null> {
    const stream = await this.docStreamModel
      .findOne({
        urnNo: urnNo.trim(),
        processType: 'initial',
        renewalCycleId: null,
        sectionKey,
        subsectionKey: subsectionKey ?? null,
        slotKey,
      })
      .exec();

    if (!stream) return null;

    const query = this.docVersionModel.findOne({
      streamId: stream._id,
      filePath: {
        $regex: new RegExp(
          normalizedFilePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ),
      },
    });
    if (session) query.session(session);
    return query.exec();
  }

  async markVersionAsCurrent(
    versionId: Types.ObjectId,
    urnNo: string,
    sectionKey: string,
    subsectionKey: string | null,
    slotKey: string,
    session?: ClientSession,
  ): Promise<void> {
    const stream = await this.docStreamModel
      .findOne({
        urnNo: urnNo.trim(),
        processType: 'initial',
        renewalCycleId: null,
        sectionKey,
        subsectionKey: subsectionKey ?? null,
        slotKey,
      })
      .exec();

    if (!stream) return;

    if (stream.latestVersionId) {
      const updatePrev = this.docVersionModel.updateOne(
        { _id: stream.latestVersionId },
        { $set: { isLatest: false } },
      );
      if (session) updatePrev.session(session);
      await updatePrev.exec();
    }

    const updateCurrent = this.docVersionModel.updateOne(
      { _id: versionId },
      { $set: { isLatest: true } },
    );
    if (session) updateCurrent.session(session);
    await updateCurrent.exec();

    const version = await this.docVersionModel.findById(versionId).lean().exec();
    const updateStream = this.docStreamModel.updateOne(
      { _id: stream._id },
      {
        $set: {
          latestVersionId: versionId,
          latestVersionNo: version?.versionNo ?? stream.latestVersionNo,
          updatedAt: new Date(),
        },
      },
    );
    if (session) updateStream.session(session);
    await updateStream.exec();
  }
}
