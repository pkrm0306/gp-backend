/**
 * Soft-delete live certification docs whose productDocumentId belongs to an older
 * history version (reject → re-upload left both rows live).
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register src/scripts/repair-superseded-live-documents.ts --dry-run
 *   npx ts-node -r tsconfig-paths/register src/scripts/repair-superseded-live-documents.ts --apply
 *   npx ts-node -r tsconfig-paths/register src/scripts/repair-superseded-live-documents.ts --apply --urn=URN-20260909091318
 */
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { DocStream, DocStreamDocument } from '../documents/schemas/doc-stream.schema';
import { DocVersion, DocVersionDocument } from '../documents/schemas/doc-version.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { productDocumentIdsSupersededByLaterVersions } from '../documents/helpers/superseded-live-documents.util';

function resolveDryRun(argv: string[]): boolean {
  if (argv.includes('--apply')) return false;
  return true;
}

function resolveUrnFilter(argv: string[]): string | null {
  const flag = argv.find((a) => a.startsWith('--urn='));
  if (!flag) return null;
  const urn = flag.slice('--urn='.length).trim();
  return urn || null;
}

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = resolveDryRun(argv);
  const urnFilter = resolveUrnFilter(argv);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const docStreamModel = app.get<Model<DocStreamDocument>>(
    getModelToken(DocStream.name),
  );
  const docVersionModel = app.get<Model<DocVersionDocument>>(
    getModelToken(DocVersion.name),
  );
  const productDocModel = app.get<Model<AllProductDocumentDocument>>(
    getModelToken(AllProductDocument.name),
  );

  const streamFilter: Record<string, unknown> = {
    processType: 'initial',
    renewalCycleId: null,
  };
  if (urnFilter) streamFilter.urnNo = urnFilter;

  const streams = await docStreamModel.find(streamFilter).lean().exec();
  let softDeleted = 0;
  let scanned = 0;

  for (const stream of streams) {
    scanned += 1;
    const versions = await docVersionModel
      .find({ streamId: stream._id })
      .select('versionNo productDocumentId')
      .lean()
      .exec();
    const superseded = productDocumentIdsSupersededByLaterVersions(versions);
    if (superseded.size === 0) continue;

    const ids = [...superseded];
    const live = await productDocModel
      .find({
        urnNo: stream.urnNo,
        productDocumentId: { $in: ids },
        isDeleted: { $ne: true },
      })
      .select('productDocumentId documentForm documentFormSubsection')
      .lean()
      .exec();

    if (!live.length) continue;

    console.log(
      `${dryRun ? '[dry-run] ' : ''}URN ${stream.urnNo} slot=${stream.slotKey}: soft-delete productDocumentIds ${live
        .map((d) => d.productDocumentId)
        .join(', ')}`,
    );

    if (!dryRun) {
      const now = new Date();
      const result = await productDocModel.updateMany(
        {
          urnNo: stream.urnNo,
          productDocumentId: { $in: live.map((d) => d.productDocumentId) },
          isDeleted: { $ne: true },
        },
        {
          $set: {
            isDeleted: true,
            deletedAt: now,
            updatedDate: now,
          },
        },
      );
      softDeleted += result.modifiedCount ?? 0;
    } else {
      softDeleted += live.length;
    }
  }

  console.log(
    `${dryRun ? 'Dry-run' : 'Applied'}: scanned ${scanned} streams, ${softDeleted} live row(s) ${dryRun ? 'would be' : ''} soft-deleted.`,
  );
  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
