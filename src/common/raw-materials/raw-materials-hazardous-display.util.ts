import { Model, Types } from 'mongoose';
import { hasPartialRawMaterialsProductRow } from '../form-partial-field.util';

/** Vendor product table row — excludes file-only / empty placeholder DB rows. */
export function isHazardousProductRowForVendorDisplay(
  row: Record<string, unknown> | null | undefined,
): boolean {
  return hasPartialRawMaterialsProductRow({
    productsName: row?.productsName ?? row?.productName,
    productsTestReport: row?.productsTestReport ?? row?.testReportReference,
  });
}

export function filterHazardousProductsForVendorDisplay<T extends Record<string, unknown>>(
  rows: T[] | null | undefined,
): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.filter((row) => isHazardousProductRowForVendorDisplay(row));
}

/** Formaldehyde / solvents product rows — same partial-row rules as hazardous. */
export function filterFormaldehydeStyleProductsForVendorDisplay<
  T extends Record<string, unknown>,
>(rows: T[] | null | undefined): T[] {
  return filterHazardousProductsForVendorDisplay(rows);
}

/** Count product-table rows with at least one vendor-filled column (excludes empty stubs). */
export async function countMeaningfulRawMaterialsProductRows(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  urnNo: string,
  vendorId: string,
): Promise<number> {
  if (!Types.ObjectId.isValid(vendorId)) {
    return 0;
  }
  const rows = await model
    .find({
      urnNo: urnNo.trim(),
      vendorId: new Types.ObjectId(vendorId),
    })
    .lean()
    .exec();
  return filterHazardousProductsForVendorDisplay(
    rows as Array<Record<string, unknown>>,
  ).length;
}
