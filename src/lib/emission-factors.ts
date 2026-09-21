import type { FuelType } from "./activity-parser";

/**
 * Simulated factors for an educational MVP. They are approximate only and must
 * not be used for official reporting, compliance, or carbon accounting.
 */
export const APPROXIMATE_EMISSION_FACTORS = {
  electricityKgCo2ePerKwh: 0.42,
  transportKgCo2ePerVehicleDay: 2.5,
  transportKgCo2ePerKmByFuel: {
    diesel: 0.25,
    gasoline: 0.22,
    "natural-gas": 0.18,
    electric: 0.05,
  } satisfies Record<FuelType, number>,
  defaultTransportKgCo2ePerKm: 0.21,
} as const;
