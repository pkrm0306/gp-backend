import {
  ConflictException,
  Injectable,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from './schemas/manufacturer.schema';
import {
  ManufacturerInternalIdCounter,
  ManufacturerInternalIdCounterDocument,
  MANUFACTURER_INTERNAL_ID_COUNTER_KEY,
} from './schemas/manufacturer-internal-id-counter.schema';
import {
  generateInitial as initialCandidatesFromName,
  generateInternalId as internalIdFromParts,
  internalIdMatchesInitial,
  normalizeManufacturerName,
  parseGpInternalNumericSuffix,
} from './manufacturer-identifier.util';

export type ManufacturerAutoIds = {
  manufacturerInitial: string;
  /** Stored as `gpInternalId` on {@link Manufacturer} (manufacturer internal id). */
  gpInternalId: string;
};

@Injectable()
export class ManufacturerIdGenerationService implements OnModuleInit {
  constructor(
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(ManufacturerInternalIdCounter.name)
    private readonly counterModel: Model<ManufacturerInternalIdCounterDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureCounterDocument();
    await this.reconcileSequentialStateFromManufacturers();
  }

  /**
   * All numeric suffixes **1–9999** in use on any `gpInternalId` (three-digit **001–999**
   * or four-digit **1000–9999** after the hyphen).
   */
  private async collectUsedNumericSuffixes(
    session?: ClientSession,
  ): Promise<Set<number>> {
    const q = this.manufacturerModel
      .find(
        {
          gpInternalId: { $exists: true, $nin: [null, ''] },
        },
        { gpInternalId: 1 },
      )
      .lean();
    if (session) {
      q.session(session);
    }
    const rows = await q.exec();
    const used = new Set<number>();
    for (const row of rows) {
      const n = parseGpInternalNumericSuffix(String(row.gpInternalId ?? ''));
      if (n != null && n >= 1 && n <= 9999) {
        used.add(n);
      }
    }
    return used;
  }

  /**
   * Highest trailing suffix from any `gpInternalId` (values **1–9999**).
   */
  async computeMaxSuffixFromManufacturers(
    session?: ClientSession,
  ): Promise<number> {
    const used = await this.collectUsedNumericSuffixes(session);
    let max = 0;
    for (const n of used) {
      max = Math.max(max, n);
    }
    return max;
  }

  private parseNumericSuffix(gpInternalId?: string): number | null {
    return parseGpInternalNumericSuffix(String(gpInternalId ?? ''));
  }

  /** True when every value **1…999** appears in `used` (required before issuing **1000+**). */
  private allThreeDigitSuffixSlotsFilled(used: Set<number>): boolean {
    for (let i = 1; i <= 999; i++) {
      if (!used.has(i)) {
        return false;
      }
    }
    return true;
  }

  private async ensureCounterDocument(session?: ClientSession): Promise<void> {
    await this.counterModel.updateOne(
      { _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY },
      { $setOnInsert: { seq: 0, reclaimedSuffixFifo: [] } },
      { upsert: true, session },
    );
  }

  /**
   * Rebuilds **seq** (max used suffix) and **reclaimedSuffixFifo** (ascending gaps 1..max)
   * from live manufacturer rows. Run on startup; also used to repair counter drift.
   * Supports suffixes **1–999** (three-digit form) and **1000–9999** (four-digit form).
   */
  async reconcileSequentialStateFromManufacturers(
    session?: ClientSession,
  ): Promise<void> {
    const used = await this.collectUsedNumericSuffixes(session);
    let max = 0;
    for (const u of used) {
      max = Math.max(max, u);
    }
    const holes: number[] = [];
    for (let i = 1; i <= max; i++) {
      if (!used.has(i)) {
        holes.push(i);
      }
    }
    await this.ensureCounterDocument(session);
    await this.counterModel.updateOne(
      { _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY },
      { $set: { seq: max, reclaimedSuffixFifo: holes } },
      { upsert: true, session },
    );
  }

  /** @deprecated Use {@link reconcileSequentialStateFromManufacturers}. */
  async syncCounterToManufacturerSuffixes(
    session?: ClientSession,
  ): Promise<void> {
    await this.reconcileSequentialStateFromManufacturers(session);
  }

  /**
   * When a manufacturer row is removed, its numeric suffix is queued for **FIFO** reuse
   * before the next sequential tail (**seq + 1**).
   */
  async enqueueReclaimedSuffixFromGpInternalId(
    gpInternalId?: string,
    session?: ClientSession,
  ): Promise<void> {
    const n = this.parseNumericSuffix(gpInternalId);
    if (n == null) {
      return;
    }
    await this.ensureCounterDocument(session);
    await this.counterModel.updateOne(
      { _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY },
      { $push: { reclaimedSuffixFifo: n } },
      { upsert: true, session },
    );
  }

  /**
   * Next global suffix: **FIFO** from {@link reclaimedSuffixFifo} (freed by deletes),
   * otherwise **seq + 1** (001, 002, … 999, then 1000, 1001, … 9999). Values **1000+**
   * are issued only after **every** integer **1…999** is already in use. Never issues beyond **9999**.
   */
  async allocateNextGlobalSuffix(session: ClientSession): Promise<number> {
    for (let attempt = 0; attempt < 40; attempt++) {
      await this.ensureCounterDocument(session);
      const used = await this.collectUsedNumericSuffixes(session);
      const doc = await this.counterModel
        .findOne({ _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY })
        .session(session)
        .exec();
      if (!doc) {
        continue;
      }
      const fifo = [...(doc.reclaimedSuffixFifo ?? [])];
      const seq = doc.seq ?? 0;
      const v = doc.__v ?? 0;
      let n: number;
      let update: Record<string, unknown>;

      if (fifo.length > 0) {
        n = fifo[0];
        if (used.has(n)) {
          await this.reconcileSequentialStateFromManufacturers(session);
          continue;
        }
        update = {
          $set: {
            reclaimedSuffixFifo: fifo.slice(1),
          },
          $inc: { __v: 1 },
        };
      } else {
        n = seq + 1;
        if (n > 9999) {
          throw new ConflictException(
            'Manufacturer internal id pool exhausted (max suffix 9999)',
          );
        }
        if (n >= 1000 && !this.allThreeDigitSuffixSlotsFilled(used)) {
          await this.reconcileSequentialStateFromManufacturers(session);
          continue;
        }
        if (used.has(n)) {
          await this.reconcileSequentialStateFromManufacturers(session);
          continue;
        }
        update = {
          $set: { seq: n },
          $inc: { __v: 1 },
        };
      }

      const versionFilter =
        v === 0
          ? { $or: [{ __v: 0 }, { __v: { $exists: false } }] }
          : { __v: v };

      const r = await this.counterModel.updateOne(
        {
          _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY,
          ...versionFilter,
        },
        update,
        { session },
      );
      if (r.matchedCount === 1) {
        return n;
      }
    }

    throw new ConflictException('Failed to allocate manufacturer internal id');
  }

  /**
   * First free initials from the ordered candidate list for this name, excluding `excludeManufacturerId`.
   */
  async pickUniqueInitial(
    manufacturerName: string,
    excludeManufacturerId: Types.ObjectId,
    session: ClientSession,
  ): Promise<string> {
    const candidates = initialCandidatesFromName(manufacturerName);
    if (candidates.length === 0) {
      throw new BadRequestException(
        'Manufacturer name must contain at least one letter to derive initials',
      );
    }
    for (const candidate of candidates) {
      const taken = await this.manufacturerModel
        .findOne({
          manufacturerInitial: candidate,
          _id: { $ne: excludeManufacturerId },
        })
        .select('_id')
        .session(session)
        .lean()
        .exec();
      if (!taken) {
        return candidate;
      }
    }
    throw new ConflictException(
      'Could not allocate unique manufacturer initials for this name',
    );
  }

  /**
   * Resolves initials + internal id for an **unverified** manufacturer save.
   * Reuses existing `gpInternalId` when the display name is unchanged, stored initials
   * still match the newly resolved pair, and the id is already in `GP<INI>-###` or `GP<INI>-####` form.
   */
  async resolveAutoIdentifiersForUnverified(
    manufacturerName: string,
    excludeManufacturerId: Types.ObjectId,
    existing: {
      manufacturerName?: string;
      manufacturerInitial?: string;
      gpInternalId?: string;
    },
    session: ClientSession,
  ): Promise<ManufacturerAutoIds> {
    const newName = normalizeManufacturerName(manufacturerName);
    const oldName = normalizeManufacturerName(
      String(existing.manufacturerName ?? ''),
    );
    const nameChanged = newName !== oldName;
    const hadInitial = !!String(existing.manufacturerInitial ?? '').trim();
    const hadId = !!String(existing.gpInternalId ?? '').trim();

    const initial = await this.pickUniqueInitial(
      newName,
      excludeManufacturerId,
      session,
    );

    const canReuseStored =
      !nameChanged &&
      hadInitial &&
      hadId &&
      String(existing.manufacturerInitial).trim().toUpperCase() === initial &&
      internalIdMatchesInitial(existing.gpInternalId, initial);

    if (canReuseStored) {
      return {
        manufacturerInitial: initial,
        gpInternalId: String(existing.gpInternalId).trim().toUpperCase(),
      };
    }

    await this.reconcileSequentialStateFromManufacturers(session);

    const maxAttempts = 24;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const allocatedSuffix = await this.allocateNextGlobalSuffix(session);
      const gpInternalId = internalIdFromParts(initial, allocatedSuffix);
      const collision = await this.manufacturerModel
        .findOne({
          gpInternalId,
          _id: { $ne: excludeManufacturerId },
        })
        .session(session)
        .select('_id')
        .lean()
        .exec();
      if (!collision) {
        return { manufacturerInitial: initial, gpInternalId };
      }
      await this.reconcileSequentialStateFromManufacturers(session);
    }

    throw new ConflictException(
      'Could not allocate unique GP internal id after retries',
    );
  }

  /**
   * Ordered 2-letter uppercase candidates from the display name (pure helper, no DB).
   */
  generateInitial(manufacturerName: string): readonly string[] {
    return initialCandidatesFromName(manufacturerName);
  }

  /** Builds `GP<INITIAL>-###` or `GP<INITIAL>-####` (pure helper, no DB). */
  generateInternalId(
    manufacturerInitial: string,
    suffixNumber: number,
  ): string {
    return internalIdFromParts(manufacturerInitial, suffixNumber);
  }

  /**
   * Runs `work` inside a transaction (caller should not nest another transaction on same session).
   */
  async withTransaction<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const out = await work(session);
      await session.commitTransaction();
      return out;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}
