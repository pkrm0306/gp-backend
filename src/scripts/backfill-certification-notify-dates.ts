/**
 * Backfill first/second/third notify dates for active certified products
 * using computeNotifyDates(validtillDate) — 3 / 2 / +3 month offsets.
 *
 * Uses mongoose directly (no Nest AppModule) so it works under ts-node.
 *
 * Defaults to DRY_RUN=true. Set DRY_RUN=false to write.
 *
 *   npm run migrate:certification-notify-dates
 *   DRY_RUN=false npm run migrate:certification-notify-dates
 */
import { config as loadEnv } from 'dotenv';
import mongoose from 'mongoose';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import { computeNotifyDates } from '../product-registration/helpers/certification-dates.util';
import { PRODUCT_STATUS_CERTIFIED } from '../renew/constants/product-status.constants';

loadEnv();

type Counters = {
  scanned: number;
  updated: number;
  skipped_no_validtill: number;
  already_ok: number;
};

function sameDay(a: Date | null | undefined, b: Date): boolean {
  if (!a) return false;
  const x = new Date(a);
  return (
    x.getFullYear() === b.getFullYear() &&
    x.getMonth() === b.getMonth() &&
    x.getDate() === b.getDate()
  );
}

async function run() {
  const uri = String(process.env.MONGODB_URI ?? '').trim();
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  const dryRun = String(process.env.DRY_RUN ?? 'true').toLowerCase() !== 'false';
  const counters: Counters = {
    scanned: 0,
    updated: 0,
    skipped_no_validtill: 0,
    already_ok: 0,
  };

  await mongoose.connect(uri);
  try {
    const productsCol = mongoose.connection.collection('products');
    const filter = matchActiveProducts({
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: { $exists: true, $ne: null },
    });

    const cursor = productsCol.find(filter, {
      projection: {
        _id: 1,
        productId: 1,
        validtillDate: 1,
        firstNotifyDate: 1,
        secondNotifyDate: 1,
        thirdNotifyDate: 1,
      },
    });

    for await (const row of cursor) {
      counters.scanned += 1;
      if (!row.validtillDate) {
        counters.skipped_no_validtill += 1;
        continue;
      }

      const notify = computeNotifyDates(new Date(row.validtillDate as Date));
      if (
        sameDay(row.firstNotifyDate as Date | undefined, notify.firstNotifyDate) &&
        sameDay(row.secondNotifyDate as Date | undefined, notify.secondNotifyDate) &&
        sameDay(row.thirdNotifyDate as Date | undefined, notify.thirdNotifyDate)
      ) {
        counters.already_ok += 1;
        continue;
      }

      if (!dryRun) {
        await productsCol.updateOne(
          { _id: row._id },
          {
            $set: {
              firstNotifyDate: notify.firstNotifyDate,
              secondNotifyDate: notify.secondNotifyDate,
              thirdNotifyDate: notify.thirdNotifyDate,
              updatedDate: new Date(),
            },
          },
        );
      }
      counters.updated += 1;
    }

    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          dryRun,
          ...counters,
          note: dryRun
            ? 'No writes. Re-run with DRY_RUN=false to apply.'
            : 'Notify dates updated for certified active products.',
        },
        null,
        2,
      ),
    );
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
