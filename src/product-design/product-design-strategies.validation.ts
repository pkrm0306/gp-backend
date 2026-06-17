import { BadRequestException } from '@nestjs/common';

export const PRODUCT_DESIGN_STRATEGIES_MIN = 10;
export const PRODUCT_DESIGN_STRATEGIES_MAX = 1000;

const SCRIPT_INJECTION_PATTERNS = [
  /<script\b/i,
  /<\/script>/i,
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /on\w+\s*=/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /<\s*meta\b/i,
  /<\s*link\b/i,
  /<\s*style\b/i,
];

const MEANINGFUL_CHAR = /[A-Za-z0-9]/;

function trimField(value: string): string {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function collapseSpacesPreservingLineBreaks(value: string): string {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.replace(/ {2,}/g, ' '))
    .join('\n');
}

export function containsHtmlTags(value: string): boolean {
  return /<[^>]*>/i.test(value);
}

export function containsScriptInjection(value: string): boolean {
  return SCRIPT_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

function hasOnlySpecialCharacters(value: string): boolean {
  const trimmed = trimField(value);
  if (!trimmed) return true;
  return !MEANINGFUL_CHAR.test(trimmed);
}

export function normalizeProductDesignStrategiesForValidation(
  raw: string | undefined,
): string {
  let value = String(raw ?? '').replace(/\r\n/g, '\n');
  value = collapseSpacesPreservingLineBreaks(value);
  return trimField(value);
}

/**
 * Validates strategies when the vendor provided non-empty text.
 * Empty/whitespace-only strategies are allowed (another product-design field may be filled).
 */
export function getProductDesignStrategiesValidationError(
  raw: string | undefined,
): string | null {
  const normalized = normalizeProductDesignStrategiesForValidation(raw);
  if (!normalized) {
    return null;
  }

  if (normalized.length < PRODUCT_DESIGN_STRATEGIES_MIN) {
    return `Strategies must be at least ${PRODUCT_DESIGN_STRATEGIES_MIN} characters.`;
  }
  if (normalized.length > PRODUCT_DESIGN_STRATEGIES_MAX) {
    return `Strategies must be ${PRODUCT_DESIGN_STRATEGIES_MAX} characters or less.`;
  }
  const rawValue = String(raw ?? '');
  if (containsHtmlTags(rawValue)) {
    return 'HTML tags are not allowed in Strategies.';
  }
  if (containsScriptInjection(rawValue)) {
    return 'Script or unsafe content is not allowed in Strategies.';
  }
  if (hasOnlySpecialCharacters(normalized)) {
    return 'Strategies cannot contain only special characters.';
  }
  return null;
}

export function assertProductDesignStrategiesValid(
  strategies: string | undefined,
): void {
  const message = getProductDesignStrategiesValidationError(strategies);
  if (!message) {
    return;
  }
  throw new BadRequestException({
    message,
    fieldErrors: {
      strategies: message,
      statergies: message,
    },
  });
}
