/**
 * Certificate plant location line used in "Manufactured by X at {location} ...".
 * Prefer structured fields; legacy plantLocation only when structured fields are empty.
 */
export function formatCertificatePlantLocation(input: {
  additionalPlantInfo?: string | null;
  city?: string | null;
  stateName?: string | null;
  plantLocation?: string | null;
}): string {
  const additional = String(input.additionalPlantInfo ?? '').trim();
  const city = String(input.city ?? '').trim();
  const state = String(input.stateName ?? '').trim();
  const legacy = String(input.plantLocation ?? '').trim();

  const structured = [additional, city, state].filter(Boolean);
  const parts = structured.length > 0 ? structured : legacy ? [legacy] : [];

  const unique: string[] = [];
  for (const part of parts) {
    const prev = unique[unique.length - 1];
    if (prev && prev.toLowerCase() === part.toLowerCase()) continue;
    unique.push(part);
  }
  return unique.join(', ');
}
