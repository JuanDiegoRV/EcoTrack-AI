export type FuelType = "diesel" | "gasoline" | "natural-gas" | "electric";

export type ActivityData = {
  electricityKwh?: number;
  vehicles?: number;
  distanceKm?: number;
  fuel?: FuelType;
};

const NUMBER_WORDS: Record<string, number> = {
  cero: 0,
  un: 1,
  una: 1,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  dieciseis: 16,
  diecisiete: 17,
  dieciocho: 18,
  diecinueve: 19,
  veinte: 20,
};

const NUMBER_WORD_PATTERN = Object.keys(NUMBER_WORDS).join("|");
const NUMBER_PATTERN = `(\\d{1,3}(?:[.,]\\d{3})+(?:[.,]\\d+)?|\\d+(?:[.,]\\d+)?|${NUMBER_WORD_PATTERN})`;

const electricityPattern = new RegExp(
  `${NUMBER_PATTERN}\\s*(?:kwh|kw\\s*h|kilovatios?\\s*(?:hora|horas)|kilowatts?\\s*(?:hour|hours))`,
  "i",
);

const vehiclePattern = new RegExp(
  `${NUMBER_PATTERN}\\s*(?:camionetas?|vehiculos?|furgonetas?|camiones?|autos?|coches?)`,
  "i",
);

const distancePattern = new RegExp(
  `${NUMBER_PATTERN}\\s*(?:km|kms|kilometros?)(?!\\s*\\/\\s*h\\b)`,
  "i",
);

const fuelPatterns: ReadonlyArray<[FuelType, RegExp]> = [
  ["diesel", /\b(?:diesel|di[eé]sel)\b/i],
  ["gasoline", /\b(?:gasolina|nafta)\b/i],
  ["natural-gas", /\b(?:gas natural|gnv)\b/i],
  ["electric", /\b(?:vehiculo electrico|vehiculos electricos|camioneta electrica|camionetas electricas)\b/i],
];

function toNumber(value: string): number | undefined {
  const normalizedValue = value
    .toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/[^a-z0-9.,]/g, "");

  if (normalizedValue in NUMBER_WORDS) {
    return NUMBER_WORDS[normalizedValue];
  }

  const separators = normalizedValue.match(/[.,]/g) ?? [];
  const lastSeparator = Math.max(normalizedValue.lastIndexOf(","), normalizedValue.lastIndexOf("."));
  const decimalDigits = normalizedValue.length - lastSeparator - 1;
  const usesThousandsSeparator = separators.length > 0 && decimalDigits === 3;
  const hasComma = normalizedValue.includes(",");
  const hasPeriod = normalizedValue.includes(".");
  const numberText = hasComma && hasPeriod
    ? normalizedValue.lastIndexOf(",") > normalizedValue.lastIndexOf(".")
      ? normalizedValue.replaceAll(".", "").replace(",", ".")
      : normalizedValue.replaceAll(",", "")
    : usesThousandsSeparator
      ? normalizedValue.replace(/[.,]/g, "")
      : normalizedValue.replace(",", ".");
  const number = Number(numberText);
  return Number.isFinite(number) ? number : undefined;
}

function getNumberMatch(pattern: RegExp, text: string): number | undefined {
  const match = pattern.exec(text);

  if (!match) {
    return undefined;
  }

  return toNumber(match[1]);
}

function normalizeForMatching(text: string): string {
  return text
    .toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Extracts a small set of business activity signals from free-form Spanish text.
 * It recognizes digits and common written numbers up to twenty. The parser is
 * intentionally deterministic and local; it does not calculate emissions.
 */
export function parseActivityText(text: string): ActivityData {
  const result: ActivityData = {};
  const normalizedText = normalizeForMatching(text);

  const electricityKwh = getNumberMatch(electricityPattern, normalizedText);
  const vehicles = getNumberMatch(vehiclePattern, normalizedText);
  const distanceKm = getNumberMatch(distancePattern, normalizedText);
  const fuel = fuelPatterns.find(([, pattern]) => pattern.test(normalizedText))?.[0];

  if (electricityKwh !== undefined) {
    result.electricityKwh = electricityKwh;
  }

  if (vehicles !== undefined) {
    result.vehicles = vehicles;
  }

  if (distanceKm !== undefined) {
    result.distanceKm = distanceKm;
  }

  if (fuel !== undefined) {
    result.fuel = fuel;
  }

  return result;
}
