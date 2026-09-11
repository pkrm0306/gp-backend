/**
 * Backfill renewal provenance on doc_versions written by the old code.
 *
 * Old behaviour: promotion stamped processType='initial' + renewalCycleId=null.
 * Old behaviour: in-cycle uploads created per-cycle streams (processType='renewal').
 *
 * New behaviour: everything on the canonical stream; processType/renewalCycleId/renewalCycleNo
 * live on the VERSION row.
 *
 * This script:
 *  1. Finds all version rows on the canonical (initial) stream whose filePath matches
 *     a row in all_renew_product_documents (same urnNo + documentLink).
 *  2. Stamps those versions: processType='renewal', renewalCycleId, renewalCycleNo.
 *  3. Migrates version rows from legacy renewal streams into the canonical stream,
 *     re-numbering monotonically by createdAt.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register src/scripts/backfill-renewal-version-provenance.ts --dry-run
 *   npx ts-node -r tsconfig-paths/register src/scripts/backfill-renewal-version-provenance.ts --apply
 */
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppModule } from '../app.module';
import { DocStream, DocStreamDocument } from '../documents/schemas/doc-stream.schema';
import { DocVersion, DocVersionDocument } from '../documents/schemas/doc-version.schema';
import { RenewalCycle, RenewalCycleDocument } from '../renew/schemas/renewal-cycle.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../renew/schemas/all-renew-product-document.schema';

function normalizeFilePath(value: string | null | undefined): string {
  return String(value ?? '').trim().replace(/\\/g, '/').toLowerCase();
}

type UrnSummary = { stamped: number; migrated: number; skipped: number };

function resolveDryRun(argv: string[]): boolean {
  if (argv.includes('--apply')) return false;
  if (argv.includes('--dry-run')) return true;
  return String(process.env.DRY_RUN ?? 'true').toLowerCase() !== 'false';
}

async function run() {
  const dryRun = resolveDryRun(process.argv.slice(2));
  const byUrn = new Map<string, UrnSummary>();
  const bumpUrn = (urnNo: string, field: keyof UrnSummary) => {
    const key = String(urnNo ?? '').trim() || '(unknown)';
    const entry = byUrn.get(key) ?? { stamped: 0, migrated: 0, skipped: 0 };
    entry[field] += 1;
    byUrn.set(key, entry);
  };
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });

  const docStreamModel = app.get<Model<DocStreamDocument>>(getModelToken(DocStream.name));
  const docVersionModel = app.get<Model<DocVersionDocument>>(getModelToken(DocVersion.name));
  const renewalCycleModel = app.get<Model<RenewalCycleDocument>>(getModelToken(RenewalCycle.name));
  const renewDocModel = app.get<Model<AllRenewProductDocumentDocument>>(
    getModelToken(AllRenewProductDocument.name),
  );

  console.log(`[backfill-renewal-provenance] DRY_RUN=${dryRun}`);

  // Step 1: Build a map of normalizedFilePath → { renewalCycleId, cycleNo, urnNo }
  const renewDocs = await renewDocModel
    .find({ documentLink: { $exists: true, $ne: '' } })
    .select('urnNo documentLink renewalCycleId')
    .lean()
    .exec();

  const pathToRenewCycle = new Map<string, { cycleId: Types.ObjectId; urnNo: string }>();
  for (const rd of renewDocs) {
    if (!rd.documentLink || !rd.renewalCycleId) continue;
    const key = `${rd.urnNo.trim()}|${normalizeFilePath(rd.documentLink)}`;
    if (!pathToRenewCycle.has(key)) {
      pathToRenewCycle.set(key, {
        cycleId: rd.renewalCycleId as Types.ObjectId,
        urnNo: rd.urnNo.trim(),
      });
    }
  }
  console.log(`[backfill] Indexed ${pathToRenewCycle.size} unique (urn, filePath) renew entries`);

  // Build cycleId → cycleNo lookup
  const cycleIds = Array.from(new Set(Array.from(pathToRenewCycle.values()).map((v) => v.cycleId.toHexString())));
  const cycles = await renewalCycleModel
    .find({ _id: { $in: cycleIds.map((id) => new Types.ObjectId(id)) } })
    .select('cycleNo')
    .lean()
    .exec();
  const cycleNoById = new Map<string, number>();
  for (const c of cycles) {
    cycleNoById.set(String(c._id), Number(c.cycleNo));
  }
  console.log(`[backfill] Loaded ${cycleNoById.size} cycle records`);

  // Step 2: Find canonical (initial) version rows that should be stamped
  const canonicalStreams = await docStreamModel
    .find({ processType: 'initial', renewalCycleId: null })
    .select('_id urnNo sectionKey subsectionKey slotKey')
    .lean()
    .exec();

  let stamped = 0;
  let skipped = 0;

  for (const stream of canonicalStreams) {
    const versions = await docVersionModel
      .find({
        streamId: stream._id,
        processType: 'initial',
        filePath: { $exists: true, $ne: null },
      })
      .lean()
      .exec();

    for (const version of versions) {
      const fp = normalizeFilePath(version.filePath as string | null);
      if (!fp) { skipped++; bumpUrn(stream.urnNo, 'skipped'); continue; }
      const key = `${stream.urnNo.trim()}|${fp}`;
      const match = pathToRenewCycle.get(key);
      if (!match) { skipped++; bumpUrn(stream.urnNo, 'skipped'); continue; }

      const cycleNo = cycleNoById.get(match.cycleId.toHexString()) ?? null;
      console.log(
        `  [${dryRun ? 'DRY' : 'SET'}] version ${String(version._id)} urn=${stream.urnNo} section=${stream.sectionKey} slot=${stream.slotKey} → renewal cycleId=${match.cycleId} cycleNo=${cycleNo}`,
      );

      if (!dryRun) {
        await docVersionModel.updateOne(
          { _id: version._id },
          {
            $set: {
              processType: 'renewal',
              renewalCycleId: match.cycleId,
              renewalCycleNo: cycleNo,
            },
          },
        );
      }
      stamped++;
      bumpUrn(stream.urnNo, 'stamped');
    }
  }

  // Step 3: Migrate legacy renewal-stream versions into canonical stream
  const legacyStreams = await docStreamModel
    .find({ processType: 'renewal', renewalCycleId: { $ne: null } })
    .lean()
    .exec();

  let migrated = 0;
  for (const legacyStream of legacyStreams) {
    const canonicalFilter = {
      urnNo: String(legacyStream.urnNo).trim(),
      processType: 'initial' as const,
      renewalCycleId: null,
      sectionKey: legacyStream.sectionKey,
      subsectionKey: legacyStream.subsectionKey ?? null,
      slotKey: legacyStream.slotKey,
    };
    const canonicalStream = await docStreamModel.findOne(canonicalFilter).lean().exec();
    if (!canonicalStream) {
      console.log(`  [skip] No canonical stream for legacy renewal stream ${String(legacyStream._id)} urn=${legacyStream.urnNo} section=${legacyStream.sectionKey} slot=${legacyStream.slotKey}`);
      continue;
    }

    const legacyVersions = await docVersionModel
      .find({ streamId: legacyStream._id })
      .sort({ versionNo: 1 })
      .lean()
      .exec();

    const cycleNo = cycleNoById.get(String(legacyStream.renewalCycleId)) ?? null;

    for (const lv of legacyVersions) {
      const fp = normalizeFilePath(lv.filePath as string | null);
      const existsOnCanonical = fp
        ? !!(await docVersionModel.findOne({
            streamId: canonicalStream._id,
            filePath: { $regex: new RegExp(fp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
          }).lean().exec())
        : false;

      if (existsOnCanonical) {
        console.log(`  [skip-dup] filePath already on canonical stream: ${fp}`);
        continue;
      }

      const maxVersionDoc = await docVersionModel
        .findOne({ streamId: canonicalStream._id })
        .sort({ versionNo: -1 })
        .lean()
        .exec();
      const nextVersionNo = (maxVersionDoc?.versionNo ?? 0) + 1;

      console.log(
        `  [${dryRun ? 'DRY' : 'MIGRATE'}] legacy version ${String(lv._id)} → canonical stream ${String(canonicalStream._id)} as v${nextVersionNo} renewalCycleNo=${cycleNo}`,
      );

      if (!dryRun) {
        await docVersionModel.create({
          streamId: canonicalStream._id,
          urnNo: String(legacyStream.urnNo).trim(),
          processType: 'renewal',
          renewalCycleId: legacyStream.renewalCycleId,
          renewalCycleNo: cycleNo,
          roundNo: lv.roundNo ?? null,
          versionNo: nextVersionNo,
          action: lv.action,
          filePath: lv.filePath ?? null,
          originalName: lv.originalName ?? null,
          storedName: lv.storedName ?? null,
          mimeType: lv.mimeType ?? null,
          sizeBytes: lv.sizeBytes ?? null,
          checksum: lv.checksum ?? null,
          isLatest: false,
          createdAt: lv.createdAt ?? new Date(),
          createdBy: lv.createdBy,
        });
      }
      migrated++;
      bumpUrn(String(legacyStream.urnNo), 'migrated');
    }
  }

  console.log(`\n[backfill-renewal-provenance] Per-URN summary:`);
  for (const [urnNo, summary] of Array.from(byUrn.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    console.log(
      `  ${urnNo}: stamped=${summary.stamped} migrated=${summary.migrated} skipped=${summary.skipped}`,
    );
  }

  console.log(`\n[backfill-renewal-provenance] Done.`);
  console.log(`  Stamped: ${stamped} version rows with renewal provenance`);
  console.log(`  Migrated: ${migrated} legacy-stream versions to canonical streams`);
  console.log(`  Skipped (no renew match): ${skipped}`);
  if (dryRun) {
    console.log(`  DRY RUN — no changes written. Set DRY_RUN=false to apply.`);
  }

  await app.close();
}

run().catch((err) => {
  console.error('[backfill-renewal-provenance] FATAL:', err);
  process.exit(1);
});
