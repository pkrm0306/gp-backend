import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows, countMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import {
  normalizeEmail,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

export async function migrateManufacturersAndVendors(
  ctx: MigrationContext,
  targetTable: 'manufacturers' | 'vendors',
): Promise<MigrationResult> {
  if (targetTable === 'manufacturers') {
    return migrateManufacturers(ctx);
  }
  return mergeVendorsIntoManufacturers(ctx);
}

async function migrateManufacturers(
  ctx: MigrationContext,
): Promise<MigrationResult> {
  const mysqlTable = 'manufacturers';
  const mongoCollection = 'manufacturers';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'manufacturer_id');
  const mysqlRows = rows.length;
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyManufacturerId = Number(row.manufacturer_id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyManufacturerId,
      manufacturerName: trimString(row.manufacturer_name),
      gpInternalId: trimString(row.gp_internal_id) || undefined,
      manufacturerInitial: trimString(row.manufacturer_initial) || undefined,
      manufacturerImage: trimString(row.manufacturer_image) || undefined,
      manufacturerStatus: Number(row.manufacturer_status ?? 1),
      vendorPortalEmailVerified: true,
      vendor_name: '',
      vendor_email: `legacy-mfr-${legacyManufacturerId}@migration.greenpro.local`,
      vendor_phone: '0000000000',
      vendor_status: 0,
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
      _migrationValidity: trimString(row.validity) || undefined,
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyManufacturerId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyManufacturerId',
      legacyNumericId: legacyManufacturerId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows, inserted, skipped: 0, errors: 0 };
}

async function mergeVendorsIntoManufacturers(
  ctx: MigrationContext,
): Promise<MigrationResult> {
  const mysqlTable = 'vendors';
  const mongoCollection = 'manufacturers';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'vendor_id');
  const mysqlRows = rows.length;
  let merged = 0;
  let createdStandalone = 0;
  let errors = 0;
  const notes: string[] = [];

  const updateOps: Array<{
    updateOne: { filter: { _id: ObjectId }; update: { $set: Record<string, unknown> } };
  }> = [];
  const newManufacturerDocs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyVendorId = Number(row.vendor_id);
    const legacyManufacturerId = Number(row.manufacturer_id);
    const manufacturerOid = await ctx.idMap.resolve(
      'manufacturers',
      legacyManufacturerId,
    );

    const vendorEmail =
      normalizeEmail(row.vendor_email) ||
      `vendor-${legacyVendorId}@migration.greenpro.local`;
    const vendorFields = {
      legacyVendorId,
      vendor_name: trimString(row.vendor_name) || 'Legacy Vendor',
      vendor_email: vendorEmail,
      vendor_phone: trimString(row.vendor_phone) || '0000000000',
      vendor_website: trimString(row.vendor_website) || undefined,
      vendor_designation: trimString(row.vendor_designation) || undefined,
      vendor_gst: trimString(row.vendor_gst) || undefined,
      vendor_status: Number(row.vendor_status ?? 1),
      vendorPortalEmailVerified: true,
      updatedAt: parseMysqlDateRequired(row.updated_date),
    };

    if (manufacturerOid) {
      // Vendor is linked to an existing manufacturer: merge vendor fields onto it.
      updateOps.push({
        updateOne: { filter: { _id: manufacturerOid }, update: { $set: vendorFields } },
      });
      await ctx.idMap.register({
        mysqlTable,
        mysqlId: legacyVendorId,
        mongoCollection,
        mongoId: manufacturerOid,
        numericIdField: 'legacyVendorId',
        legacyNumericId: legacyVendorId,
      });
      merged++;
    } else {
      // Vendor has no (or a missing) manufacturer link. In the merged MERN model a
      // vendor IS a manufacturer, so promote it to its own manufacturer document.
      if (legacyManufacturerId !== 0) {
        notes.push(
          `Vendor ${legacyVendorId}: manufacturer ${legacyManufacturerId} missing — created standalone manufacturer`,
        );
      }
      const mongoId = new ObjectId();
      newManufacturerDocs.push({
        _id: mongoId,
        legacyManufacturerId: null,
        manufacturerName: vendorFields.vendor_name,
        manufacturerStatus: vendorFields.vendor_status,
        _standaloneFromVendor: true,
        ...vendorFields,
        createdAt: parseMysqlDateRequired(row.created_date ?? row.updated_date),
      });
      await ctx.idMap.register({
        mysqlTable,
        mysqlId: legacyVendorId,
        mongoCollection,
        mongoId,
        numericIdField: 'legacyVendorId',
        legacyNumericId: legacyVendorId,
      });
      createdStandalone++;
    }
  }

  if (!ctx.dryRun && updateOps.length > 0) {
    // bulkWrite in chunks to avoid oversized payloads over Atlas.
    const CHUNK = 1000;
    for (let i = 0; i < updateOps.length; i += CHUNK) {
      await ctx.mongo
        .collection(mongoCollection)
        .bulkWrite(updateOps.slice(i, i + CHUNK), { ordered: false });
    }
  }
  const insertedStandalone = await insertBatches(
    ctx.mongo,
    mongoCollection,
    newManufacturerDocs,
    ctx.dryRun,
  );

  notes.unshift(
    `Vendors merged onto existing manufacturers: ${merged}; promoted to standalone manufacturers: ${createdStandalone} (${insertedStandalone} inserted)`,
  );

  return {
    mysqlTable,
    mongoCollection,
    mysqlRows,
    inserted: merged + createdStandalone,
    skipped: 0,
    errors,
    notes: notes.slice(0, 20),
  };
}
