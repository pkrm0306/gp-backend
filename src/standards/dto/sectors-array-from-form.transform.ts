import { Transform } from 'class-transformer';

/**
 * Multipart may send **sectors** as a string, JSON array string, or string[].
 * Empty / null / undefined → undefined.
 */
export function SectorsArrayFromForm() {
  return Transform(({ value }: { value: unknown }): number[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (Array.isArray(value)) {
      const nums: number[] = [];
      for (const x of value) {
        if (x === '' || x === null || x === undefined) continue;
        if (typeof x === 'number' && Number.isInteger(x) && x >= 1) {
          nums.push(x);
          continue;
        }
        const n = parseInt(String(x).trim(), 10);
        if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
          nums.push(n);
        }
      }
      return nums.length ? nums : undefined;
    }
    if (typeof value === 'number' && Number.isInteger(value) && value >= 1) {
      return [value];
    }
    const s = String(value).trim();
    if (!s) return undefined;
    if (s.startsWith('[')) {
      try {
        const arr = JSON.parse(s) as unknown;
        if (Array.isArray(arr)) {
          const nums: number[] = [];
          for (const x of arr) {
            const n =
              typeof x === 'number' && Number.isInteger(x)
                ? x
                : parseInt(String(x).trim(), 10);
            if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
              nums.push(n);
            }
          }
          return nums.length ? nums : undefined;
        }
      } catch {
        return undefined;
      }
    }
    const n = parseInt(s, 10);
    if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
      return [n];
    }
    return undefined;
  });
}
