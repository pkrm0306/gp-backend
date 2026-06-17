export function resolveRenewPlantState(
  plant: Record<string, unknown>,
): unknown {
  return (
    plant.State ?? plant.state ?? plant.stateName ?? plant.state_name ?? null
  );
}

export function withRenewPlantStateAliases(
  plant: Record<string, unknown>,
): Record<string, unknown> {
  const state = resolveRenewPlantState(plant);
  return {
    ...plant,
    state,
    State: state,
  };
}

export function withRenewPlantsStateAliases(
  plants: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return plants.map((plant) => withRenewPlantStateAliases(plant));
}
