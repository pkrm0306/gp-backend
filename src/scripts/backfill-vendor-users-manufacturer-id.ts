import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../app.module';

type Counters = {
  scanned: number;
  updated: number;
  skipped_vendor_missing: number;
  skipped_manufacturer_missing: number;
  already_ok: number;
};

function toObjectIdSafe(value: unknown): Types.ObjectId | null {
  if (!value) return null;
  const asString = String(value);
  return Types.ObjectId.isValid(asString) ? new Types.ObjectId(asString) : null;
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const connection = app.get<Connection>(getConnectionToken());
  const dryRun = String(process.env.DRY_RUN ?? 'true').toLowerCase() === 'true';

  const counters: Counters = {
    scanned: 0,
    updated: 0,
    skipped_vendor_missing: 0,
    skipped_manufacturer_missing: 0,
    already_ok: 0,
  };

  try {
    const vendorUsersCol = connection.collection('vendorusers');
    const vendorsCol = connection.collection('vendors');

    // Process only records needing backfill.
    const cursor = vendorUsersCol.find(
      {
        $and: [
          { $or: [{ manufacturerId: { $exists: false } }, { manufacturerId: null }] },
          { vendorId: { $exists: true, $ne: null } },
        ],
      },
      { projection: { _id: 1, vendorId: 1, manufacturerId: 1 } },
    );

    for await (const row of cursor) {
      counters.scanned += 1;

      // Idempotency safety: if manufacturerId appears in any shape, skip.
      if (row.manufacturerId) {
        counters.already_ok += 1;
        continue;
      }

      const vendorId = toObjectIdSafe(row.vendorId);
      if (!vendorId) {
        counters.skipped_vendor_missing += 1;
        continue;
      }

      const vendor = await vendorsCol.findOne(
        { _id: vendorId },
        { projection: { _id: 1, manufacturerId: 1 } },
      );
      if (!vendor) {
        counters.skipped_vendor_missing += 1;
        continue;
      }

      const manufacturerId = toObjectIdSafe(vendor.manufacturerId);
      if (!manufacturerId) {
        counters.skipped_manufacturer_missing += 1;
        continue;
      }

      if (dryRun) {
        console.log(
          `[DRY_RUN] would set vendor_users(${row._id}) manufacturerId -> ${manufacturerId.toHexString()}`,
        );
        counters.updated += 1;
        continue;
      }

      await vendorUsersCol.updateOne(
        { _id: row._id, $or: [{ manufacturerId: { $exists: false } }, { manufacturerId: null }] },
        { $set: { manufacturerId } },
      );
      counters.updated += 1;
    }

    console.log('--- Backfill Summary ---');
    console.log(JSON.stringify({ dryRun, ...counters }, null, 2));
    console.log('Verification query:');
    console.log(
      `db.vendorusers.countDocuments({ $and: [ { $or: [ { manufacturerId: { $exists: false } }, { manufacturerId: null } ] }, { vendorId: { $exists: true, $ne: null } } ] })`,
    );
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
