import { APPROXIMATE_EMISSION_FACTORS } from "./emission-factors";
import { parseActivityText, type ActivityData } from "./activity-parser";

export type EmissionsEstimate = {
  detectedData: ActivityData;
  electricityKgCo2e: number;
  transportKgCo2e: number;
  totalKgCo2e: number;
};

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function estimateTransportEmissions(data: ActivityData): number {
  const { distanceKm, vehicles, fuel } = data;

  if (distanceKm !== undefined) {
    const factor = fuel
      ? APPROXIMATE_EMISSION_FACTORS.transportKgCo2ePerKmByFuel[fuel]
      : APPROXIMATE_EMISSION_FACTORS.defaultTransportKgCo2ePerKm;
    const vehicleCount = vehicles ?? 1;

    return distanceKm * vehicleCount * factor;
  }

  if (vehicles !== undefined) {
    return vehicles * APPROXIMATE_EMISSION_FACTORS.transportKgCo2ePerVehicleDay;
  }

  return 0;
}

/**
 * Produces a simplified, educational CO2e estimate using simulated factors.
 * This is not an official carbon footprint measurement.
 */
export function estimateEmissions(text: string): EmissionsEstimate {
  const detectedData = parseActivityText(text);
  const electricityKgCo2e = detectedData.electricityKwh
    ? detectedData.electricityKwh * APPROXIMATE_EMISSION_FACTORS.electricityKgCo2ePerKwh
    : 0;
  const transportKgCo2e = estimateTransportEmissions(detectedData);

  return {
    detectedData,
    electricityKgCo2e: roundToTwoDecimals(electricityKgCo2e),
    transportKgCo2e: roundToTwoDecimals(transportKgCo2e),
    totalKgCo2e: roundToTwoDecimals(electricityKgCo2e + transportKgCo2e),
  };
}
