/**
 * Public website visibility for a manufacturer document (or nested `manufacturer.*`).
 * Inactive / soft-deleted accounts must not appear with certified products on the website.
 */
export function matchPublicWebsiteManufacturerVisibility(
  fieldPrefix = 'manufacturer',
): Record<string, unknown> {
  const p = fieldPrefix ? `${fieldPrefix}.` : '';
  const statusField = `${p}manufacturerStatus`;
  const vendorStatusField = `${p}vendor_status`;
  const vendorStatusAltField = `${p}vendorStatus`;
  const deletedAtField = `${p}accountDeletedAt`;

  return {
    $and: [
      {
        $or: [
          { [statusField]: { $exists: false } },
          { [statusField]: null },
          { [statusField]: 1 },
          { [statusField]: true },
        ],
      },
      {
        $nor: [
          { [vendorStatusField]: 0 },
          { [vendorStatusField]: '0' },
          { [vendorStatusField]: false },
          { [vendorStatusAltField]: 0 },
          { [vendorStatusAltField]: '0' },
          { [vendorStatusAltField]: false },
        ],
      },
      {
        $or: [
          { [deletedAtField]: { $exists: false } },
          { [deletedAtField]: null },
        ],
      },
    ],
  };
}
