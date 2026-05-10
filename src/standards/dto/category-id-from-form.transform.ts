import { Transform } from 'class-transformer';

/**
 * Multipart form sends category_id as a string; normalizes to integer.
 * Empty / null / undefined → undefined.
 * Non-numeric → NaN so @IsInt fails.
 */
export function CategoryIdFromForm() {
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
