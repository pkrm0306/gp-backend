export type SustainabilityContributionKey =
  | 'energySaved'
  | 'waterSaved'
  | 'recyclability'
  | 'carbonOffset';

export const SUSTAINABILITY_CONTRIBUTION_DEFS: ReadonlyArray<{
  key: SustainabilityContributionKey;
  label: string;
  order: number;
  color: string;
}> = [
  { key: 'energySaved', label: 'Energy Saved', order: 1, color: '#22C55E' },
  { key: 'waterSaved', label: 'Water Saved', order: 2, color: '#3B82F6' },
  { key: 'recyclability', label: 'Recyclability', order: 3, color: '#8B5CF6' },
  { key: 'carbonOffset', label: 'Carbon Offset', order: 4, color: '#4ADE80' },
];

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function roundContributionPercent(value: number): number {
  return Math.round(clampPercent(value));
}

/** Average of positive numeric samples; returns 0 when empty. */
export function averagePositivePercent(samples: number[]): number {
  const valid = samples
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v) && v > 0);
  if (!valid.length) return 0;
  const total = valid.reduce((sum, v) => sum + v, 0);
  return roundContributionPercent(total / valid.length);
}

export function maxRecycledPercentFromRmcRow(
  row: Record<string, unknown>,
): number | null {
  const keys = [
    'percentYear1Recycled',
    'percentYear2Recycled',
    'percentYear3Recycled',
    'percentYear4Recycled',
    'percentYear1SubsititutionRecycled',
    'percentYear2SubsititutionRecycled',
    'percentYear3SubsititutionRecycled',
    'percentYear4SubsititutionRecycled',
  ];
  const values = keys
    .map((key) => Number(row[key]))
    .filter((v) => Number.isFinite(v) && v > 0);
  if (!values.length) return null;
  return Math.max(...values);
}

export function renewableCarbonScore(row: Record<string, unknown>): number | null {
  if (row.renewableEnergyUtilization === 'yes') {
    return 100;
  }

  const renewableFields = [
    row.reSolarPhotovoltaic,
    row.reWind,
    row.reBiomass,
    row.reSolarThermal,
    row.reOthers,
    row.offsiteRenewablePower,
  ]
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v) && v > 0);

  if (!renewableFields.length) return null;
  const total = renewableFields.reduce((sum, v) => sum + v, 0);
  return clampPercent(Math.min(100, total));
}
