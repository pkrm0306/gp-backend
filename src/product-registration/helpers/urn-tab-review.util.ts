import {
  PROCESS_TAB_REVIEW_KEYS,
  PROCESS_TAB_STEP_ID,
  RAW_MATERIALS_TAB_KEY,
  RAW_MATERIAL_STEP_TITLES,
  PROCESS_TAB_LABELS,
  URN_TAB_REVIEW_STATUS,
  type ProcessTabReviewKey,
} from '../constants/urn-tab-review.constants';

/** True when admin has already approved or rejected this tab/step in the current review cycle. */
export function isTabReviewSlotAlreadyDecided(
  reviewStatus: number | null | undefined,
): boolean {
  return (
    reviewStatus === URN_TAB_REVIEW_STATUS.APPROVED ||
    reviewStatus === URN_TAB_REVIEW_STATUS.REJECTED
  );
}

/** Match admin UI `parseVisibleRawMaterialSteps`: empty CSV → all 15 steps. */
export function parseVisibleRawMaterialSteps(
  categoryRawMaterialForms?: string | null,
): number[] {
  const trimmed = String(categoryRawMaterialForms ?? '').trim();
  if (!trimmed) {
    return Array.from({ length: 15 }, (_, i) => i + 1);
  }
  const steps = trimmed
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 15);
  const unique = [...new Set(steps)].sort((a, b) => a - b);
  return unique.length > 0 ? unique : Array.from({ length: 15 }, (_, i) => i + 1);
}

export function isProcessTabKey(tabKey: string): tabKey is ProcessTabReviewKey {
  return (PROCESS_TAB_REVIEW_KEYS as readonly string[]).includes(tabKey);
}

export function normalizeReviewStepId(
  tabKey: string,
  stepId?: number | null,
): number {
  if (tabKey === RAW_MATERIALS_TAB_KEY) {
    const id = Number(stepId);
    if (!Number.isFinite(id) || id < 1 || id > 15) {
      throw new Error('stepId must be 1–15 for raw-materials');
    }
    return id;
  }
  if (isProcessTabKey(tabKey)) {
    return PROCESS_TAB_STEP_ID;
  }
  throw new Error('Invalid tabKey');
}

export function apiStepIdFromStored(
  tabKey: string,
  storedStepId: number,
): number | null {
  if (tabKey === RAW_MATERIALS_TAB_KEY) {
    return storedStepId;
  }
  return null;
}

export type RequiredReviewSlot = {
  tabKey: string;
  stepId: number | null;
  label: string;
};

export function buildRequiredReviewSlots(
  visibleRawMaterialSteps: number[],
): RequiredReviewSlot[] {
  const process: RequiredReviewSlot[] = PROCESS_TAB_REVIEW_KEYS.map((tabKey) => ({
    tabKey,
    stepId: null,
    label: PROCESS_TAB_LABELS[tabKey],
  }));
  const raw: RequiredReviewSlot[] = visibleRawMaterialSteps.map((stepId) => ({
    tabKey: RAW_MATERIALS_TAB_KEY,
    stepId,
    label: RAW_MATERIAL_STEP_TITLES[stepId] ?? `Raw materials step ${stepId}`,
  }));
  return [...process, ...raw];
}

export function reviewSlotKey(tabKey: string, stepId: number): string {
  return `${tabKey}::${stepId}`;
}
