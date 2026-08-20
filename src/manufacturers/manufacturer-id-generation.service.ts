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
  normalizeManufacturerName,
  parseGpscNumericSuffix,
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
   * Numeric suffixes already used on **GPSC-** ids only (so the sequence is
   * GPSC-000, GPSC-001, … and is not mixed with legacy GPXX-### ids).
   */
  private async collectUsedNumericSuffixes(
    session?: ClientSession,
  ): Promise<Set<number>> {
    const q = this.manufacturerModel
      .find({ gpInternalId: { $regex: /^GPSC-/i } }, { gpInternalId: 1 })
      .lean();
    if (session) {
      q.session(session);
    }
    const rows = await q.exec();
    const used = new Set<number>();
    for (const row of rows) {
      const n = parseGpscNumericSuffix(String(row.gpInternalId ?? ''));
      if (n != null && n >= 0 && n <= 9999) {
        used.add(n);
      }
    }
    return used;
  }

  /**
   * Highest GPSC suffix in use, or **-1** when none exist (so the next id is **000**).
   */
  async computeMaxSuffixFromManufacturers(
    session?: ClientSession,
  ): Promise<number> {
    const used = await this.collectUsedNumericSuffixes(session);
    if (used.size === 0) {
      return -1;
    }
    let max = -1;
    for (const n of used) {
      max = Math.max(max, n);
    }
    return max;
  }

  private parseNumericSuffix(gpInternalId?: string): number | null {
    return parseGpscNumericSuffix(String(gpInternalId ?? ''));
  }

  private async ensureCounterDocument(session?: ClientSession): Promise<void> {
    await this.counterModel.updateOne(
      { _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY },
      { $setOnInsert: { seq: -1, reclaimedSuffixFifo: [] } },
      { upsert: true, session },
    );
  }

  /**
   * Rebuilds **seq** as the highest existing GPSC suffix (**-1** if none).
   * Existing ids (including legacy `GPXX-###`) are never rewritten.
   */
  async reconcileSequentialStateFromManufacturers(
    session?: ClientSession,
  ): Promise<void> {
    const max = await this.computeMaxSuffixFromManufacturers(session);
    await this.ensureCounterDocument(session);
    await this.counterModel.updateOne(
      { _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY },
      { $set: { seq: max, reclaimedSuffixFifo: [] } },
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
   * Next GPSC suffix for a **newly verified** manufacturer: lowest unused
   * GPSC number from **0** (`GPSC-000`, `GPSC-001`, …). Legacy `GPXX-###`
   * ids are ignored and never rewritten.
   */
  async allocateNextGlobalSuffix(session: ClientSession): Promise<number> {
    for (let attempt = 0; attempt < 40; attempt++) {
      await this.ensureCounterDocument(session);
      const used = await this.collectUsedNumericSuffixes(session);
      let n = 0;
      while (n <= 9999 && used.has(n)) {
        n += 1;
      }
      const doc = await this.counterModel
        .findOne({ _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY })
        .session(session)
        .exec();
      if (!doc) {
        continue;
      }
      if (n > 9999) {
        throw new ConflictException(
          'Manufacturer internal id pool exhausted (max suffix 9999)',
        );
      }
      const v = doc.__v ?? 0;
      const versionFilter =
        v === 0
          ? { $or: [{ __v: 0 }, { __v: { $exists: false } }] }
          : { __v: v };

      const r = await this.counterModel.updateOne(
        {
          _id: MANUFACTURER_INTERNAL_ID_COUNTER_KEY,
          ...versionFilter,
        },
        {
          $set: { seq: n, reclaimedSuffixFifo: [] },
          $inc: { __v: 1 },
        },
        { session },
      );
      if (r.matchedCount === 1) {
        return n;
      }
    }

    throw new ConflictException('Failed to allocate manufacturer internal id');
  }

  private notDeletedFilter() {
    return {
      $or: [
        { accountDeletedAt: { $exists: false } },
        { accountDeletedAt: null },
      ],
    };
  }

  /**
   * True if another **verified** manufacturer already uses this initial.
   */
  async isInitialTakenByVerified(
    manufacturerInitial: string,
    excludeManufacturerId: Types.ObjectId,
    session: ClientSession,
  ): Promise<boolean> {
    const ini = String(manufacturerInitial ?? '').trim().toUpperCase();
    if (!ini) {
      return false;
    }
    const taken = await this.manufacturerModel
      .findOne({
        manufacturerInitial: ini,
        manufacturerStatus: 1,
        _id: { $ne: excludeManufacturerId },
        ...this.notDeletedFilter(),
      })
      .select('_id')
      .session(session)
      .lean()
      .exec();
    return !!taken;
  }

  /**
   * First free initials from the ordered candidate list for this name.
   * Uniqueness is among **verified** manufacturers only (same rule as before).
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
      const taken = await this.isInitialTakenByVerified(
        candidate,
        excludeManufacturerId,
        session,
      );
      if (!taken) {
        return candidate;
      }
    }
    throw new ConflictException(
      'Could not allocate unique manufacturer initials for this name',
    );
  }

  /**
   * Resolves unique name-based initials + GPSC internal id when a manufacturer
   * is **newly verified**. Initials never collide with another verified row.
   * Manufacturer id is `GPSC-000`, `GPSC-001`, … (independent of initials).
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
    if (!newName) {
      throw new BadRequestException(
        'Manufacturer name must contain at least one letter to derive initials',
      );
    }

    const existingIni = String(existing.manufacturerInitial ?? '')
      .trim()
      .toUpperCase();
    const existingGp = String(existing.gpInternalId ?? '').trim();
    const alreadyGpsc = /^GPSC-(?:\d{3}|[1-9]\d{3})$/i.test(existingGp);

    // Keep an existing initial only when it is still free among verified rows.
    let initial: string;
    if (
      existingIni &&
      !(await this.isInitialTakenByVerified(
        existingIni,
        excludeManufacturerId,
        session,
      ))
    ) {
      initial = existingIni;
    } else {
      initial = await this.pickUniqueInitial(
        manufacturerName,
        excludeManufacturerId,
        session,
      );
    }

    if (alreadyGpsc) {
      return {
        manufacturerInitial: initial,
        gpInternalId: existingGp.toUpperCase(),
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
          ...this.notDeletedFilter(),
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

  /** Name-based 2-letter initial candidates (same logic as before). */
  generateInitial(manufacturerName: string): readonly string[] {
    return initialCandidatesFromName(manufacturerName);
  }

  /** Builds `GPSC-###` or `GPSC-####` (pure helper, no DB). */
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
