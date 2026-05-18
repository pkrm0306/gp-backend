import { Transform } from 'class-transformer';

/**
 * Multipart sends **sector** as a string; normalize to integer.
 * Empty / null / undefined → undefined.
 */
export function SectorIdFromForm() {
  return Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'number' && Number.isInteger(value)) {
      return value;
    }
    const n = parseInt(String(value).trim(), 10);
    return Number.isFinite(n) ? n : Number.NaN;
  });
}
