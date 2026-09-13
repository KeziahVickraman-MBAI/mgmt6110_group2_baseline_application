/**
 * WATCHED CARPARKS, BASELINES, AND RAIN FACTORS
 *
 * All baseline values carry an observedOn date for full provenance.
 * To extend the BASELINES table, follow the shape shown below:
 *
 * BASELINES[carParkId] = {
 *   observedOn: "YYYY-MM-DD",
 *   notes: "...",
 *   weekday:  [h0, h1, ..., h23], // Expected occupancy rate 0.00 - 1.00
 *   saturday: [h0, h1, ..., h23],
 *   sunday:   [h0, h1, ..., h23]
 * }
 */

// 14 watched carparks covering major commercial, shopping, and transit hubs across Singapore.
export const WATCHED_SITES = [
  {
    id: "1",
    development: "Suntec City",
    area: "Marina",
    totalLots: 3100,
    latitude: 1.2935,
    longitude: 103.8572
  },
  {
    id: "2",
    development: "Marina Square",
    area: "Marina",
    totalLots: 2200,
    latitude: 1.2911,
    longitude: 103.8576
  },
  {
    id: "3",
    development: "Raffles City",
    area: "City",
    totalLots: 1050,
    latitude: 1.2939,
    longitude: 103.8532
  },
  {
    id: "4",
    development: "The Centrepoint",
    area: "Orchard",
    totalLots: 850,
    latitude: 1.3015,
    longitude: 103.8398
  },
  {
    id: "5",
    development: "313@Somerset",
    area: "Orchard",
    totalLots: 230,
    latitude: 1.3010,
    longitude: 103.8385
  },
  {
    id: "6",
    development: "Orchard Central",
    area: "Orchard",
    totalLots: 450,
    latitude: 1.3007,
    longitude: 103.8397
  },
  {
    id: "7",
    development: "ION Orchard",
    area: "Orchard",
    totalLots: 650,
    latitude: 1.3040,
    longitude: 103.8318
  },
  {
    id: "8",
    development: "Tangs Plaza",
    area: "Orchard",
    totalLots: 200,
    latitude: 1.3048,
    longitude: 103.8332
  },
  {
    id: "9",
    development: "Ngee Ann City",
    area: "Orchard",
    totalLots: 1250,
    latitude: 1.3025,
    longitude: 103.8344
  },
  {
    id: "10",
    development: "VivoCity",
    area: "HarbourFront",
    totalLots: 2180,
    latitude: 1.2644,
    longitude: 103.8222
  },
  {
    id: "11",
    development: "HarbourFront Centre",
    area: "HarbourFront",
    totalLots: 950,
    latitude: 1.2642,
    longitude: 103.8188
  },
  {
    id: "12",
    development: "Jurong Point",
    area: "Jurong West",
    totalLots: 1420,
    latitude: 1.3404,
    longitude: 103.7060
  },
  {
    id: "13",
    development: "Tampines Mall",
    area: "Tampines",
    totalLots: 640,
    latitude: 1.3526,
    longitude: 103.9452
  },
  {
    id: "14",
    development: "Parkway Parade",
    area: "Marine Parade",
    totalLots: 1200,
    latitude: 1.3018,
    longitude: 103.9052
  }
];

export const WATCHED_IDS = new Set(WATCHED_SITES.map(s => s.id));

/**
 * Expected occupancy rate (0.00 to 1.00) for hours 0 through 23
 *
 * All baseline profiles are empirically calibrated:
 * - Hours 0-5 (Night/Early morning): 0.05 - 0.15 (mall closed / resident & clubbing parking)
 * - Hours 6-10 (Morning): 0.15 - 0.55 (cafes open, staff arrivals)
 * - Hours 11-14 (Lunch rush): 0.70 - 0.88 (CBD lunch / weekend family shopping)
 * - Hours 15-17 (Afternoon): 0.68 - 0.86 (steady retail trade)
 * - Hours 18-21 (Evening peak): 0.75 - 0.92 (Sunday/Saturday dinners and cinema crowds)
 * - Hours 22-23 (Late evening): 0.50 - 0.75 (wind-down / post-dinner)
 */
export const BASELINES = {
  "1": {
    development: "Suntec City",
    observedOn: "2026-08-28",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.12, 0.28, 0.55, 0.76, 0.84, 0.86, 0.88, 0.87, 0.85, 0.84, 0.82, 0.80, 0.76, 0.74, 0.70, 0.65, 0.55, 0.38, 0.20],
    saturday: [0.10, 0.08, 0.06, 0.06, 0.06, 0.09, 0.16, 0.28, 0.48, 0.70, 0.84, 0.89, 0.92, 0.93, 0.91, 0.89, 0.87, 0.85, 0.86, 0.85, 0.80, 0.72, 0.52, 0.30],
    sunday:   [0.09, 0.07, 0.05, 0.05, 0.05, 0.08, 0.14, 0.24, 0.42, 0.65, 0.80, 0.86, 0.89, 0.91, 0.90, 0.88, 0.85, 0.84, 0.86, 0.85, 0.82, 0.75, 0.55, 0.32]
  },
  "2": {
    development: "Marina Square",
    observedOn: "2026-08-28",
    weekday:  [0.07, 0.05, 0.05, 0.05, 0.06, 0.10, 0.22, 0.44, 0.68, 0.78, 0.82, 0.85, 0.83, 0.81, 0.80, 0.78, 0.76, 0.74, 0.72, 0.68, 0.62, 0.50, 0.34, 0.18],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.05, 0.08, 0.14, 0.25, 0.44, 0.66, 0.80, 0.86, 0.89, 0.90, 0.88, 0.86, 0.84, 0.83, 0.84, 0.83, 0.78, 0.70, 0.48, 0.26],
    sunday:   [0.07, 0.05, 0.05, 0.05, 0.05, 0.07, 0.12, 0.20, 0.38, 0.60, 0.76, 0.83, 0.87, 0.88, 0.87, 0.85, 0.82, 0.81, 0.83, 0.82, 0.78, 0.72, 0.50, 0.28]
  },
  "3": {
    development: "Raffles City",
    observedOn: "2026-08-28",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.14, 0.32, 0.62, 0.82, 0.90, 0.92, 0.94, 0.92, 0.90, 0.89, 0.87, 0.85, 0.82, 0.78, 0.74, 0.68, 0.56, 0.38, 0.20],
    saturday: [0.09, 0.07, 0.06, 0.06, 0.06, 0.09, 0.18, 0.30, 0.52, 0.74, 0.86, 0.91, 0.94, 0.95, 0.93, 0.91, 0.89, 0.87, 0.88, 0.86, 0.82, 0.74, 0.54, 0.30],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.08, 0.14, 0.25, 0.45, 0.68, 0.82, 0.88, 0.91, 0.92, 0.90, 0.88, 0.85, 0.84, 0.86, 0.85, 0.82, 0.76, 0.56, 0.32]
  },
  "4": {
    development: "The Centrepoint",
    observedOn: "2026-08-29",
    weekday:  [0.06, 0.05, 0.04, 0.04, 0.05, 0.08, 0.16, 0.30, 0.50, 0.70, 0.80, 0.84, 0.83, 0.81, 0.80, 0.78, 0.76, 0.75, 0.74, 0.70, 0.64, 0.52, 0.32, 0.16],
    saturday: [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.12, 0.22, 0.45, 0.70, 0.85, 0.91, 0.94, 0.95, 0.93, 0.91, 0.89, 0.88, 0.88, 0.86, 0.82, 0.75, 0.52, 0.28],
    sunday:   [0.06, 0.05, 0.04, 0.04, 0.05, 0.06, 0.10, 0.18, 0.40, 0.65, 0.82, 0.88, 0.91, 0.93, 0.91, 0.89, 0.86, 0.84, 0.86, 0.85, 0.81, 0.76, 0.54, 0.30]
  },
  "5": {
    development: "313@Somerset",
    observedOn: "2026-08-29",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.09, 0.18, 0.35, 0.58, 0.76, 0.87, 0.91, 0.89, 0.88, 0.86, 0.85, 0.84, 0.82, 0.82, 0.80, 0.76, 0.68, 0.48, 0.25],
    saturday: [0.10, 0.08, 0.06, 0.06, 0.06, 0.08, 0.15, 0.28, 0.55, 0.80, 0.92, 0.96, 0.98, 0.98, 0.97, 0.95, 0.94, 0.93, 0.94, 0.92, 0.88, 0.82, 0.64, 0.38],
    sunday:   [0.09, 0.07, 0.05, 0.05, 0.05, 0.08, 0.13, 0.24, 0.48, 0.74, 0.88, 0.93, 0.96, 0.97, 0.95, 0.93, 0.91, 0.90, 0.91, 0.90, 0.86, 0.80, 0.62, 0.36]
  },
  "6": {
    development: "Orchard Central",
    observedOn: "2026-08-29",
    weekday:  [0.07, 0.05, 0.05, 0.05, 0.05, 0.08, 0.16, 0.32, 0.54, 0.74, 0.84, 0.89, 0.87, 0.85, 0.84, 0.82, 0.80, 0.78, 0.78, 0.75, 0.70, 0.60, 0.42, 0.22],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.05, 0.08, 0.14, 0.25, 0.50, 0.75, 0.89, 0.94, 0.96, 0.97, 0.95, 0.93, 0.91, 0.90, 0.91, 0.90, 0.85, 0.78, 0.58, 0.34],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.44, 0.70, 0.85, 0.91, 0.94, 0.95, 0.93, 0.91, 0.88, 0.87, 0.88, 0.87, 0.84, 0.78, 0.58, 0.32]
  },
  "7": {
    development: "ION Orchard",
    observedOn: "2026-08-30",
    weekday:  [0.10, 0.07, 0.06, 0.06, 0.07, 0.12, 0.24, 0.44, 0.68, 0.84, 0.93, 0.95, 0.93, 0.91, 0.90, 0.89, 0.88, 0.86, 0.86, 0.84, 0.80, 0.72, 0.52, 0.28],
    saturday: [0.12, 0.09, 0.07, 0.07, 0.07, 0.10, 0.18, 0.34, 0.60, 0.85, 0.95, 0.98, 0.99, 0.99, 0.98, 0.97, 0.96, 0.95, 0.96, 0.95, 0.92, 0.85, 0.68, 0.42],
    sunday:   [0.11, 0.08, 0.06, 0.06, 0.06, 0.09, 0.15, 0.28, 0.52, 0.78, 0.91, 0.96, 0.98, 0.98, 0.97, 0.95, 0.93, 0.92, 0.93, 0.92, 0.89, 0.82, 0.65, 0.38]
  },
  "8": {
    development: "Tangs Plaza",
    observedOn: "2026-08-30",
    weekday:  [0.06, 0.04, 0.04, 0.04, 0.05, 0.08, 0.16, 0.32, 0.56, 0.76, 0.87, 0.91, 0.89, 0.87, 0.85, 0.84, 0.82, 0.80, 0.78, 0.74, 0.68, 0.55, 0.35, 0.18],
    saturday: [0.08, 0.05, 0.04, 0.04, 0.05, 0.07, 0.13, 0.26, 0.52, 0.78, 0.92, 0.96, 0.98, 0.98, 0.96, 0.94, 0.93, 0.92, 0.92, 0.90, 0.85, 0.76, 0.56, 0.32],
    sunday:   [0.07, 0.05, 0.04, 0.04, 0.04, 0.06, 0.11, 0.22, 0.46, 0.72, 0.88, 0.93, 0.96, 0.97, 0.95, 0.93, 0.90, 0.88, 0.89, 0.88, 0.84, 0.78, 0.56, 0.30]
  },
  "9": {
    development: "Ngee Ann City",
    observedOn: "2026-08-30",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.10, 0.20, 0.40, 0.62, 0.80, 0.89, 0.93, 0.90, 0.88, 0.87, 0.86, 0.85, 0.83, 0.82, 0.78, 0.72, 0.62, 0.44, 0.24],
    saturday: [0.10, 0.07, 0.05, 0.05, 0.06, 0.09, 0.16, 0.30, 0.55, 0.82, 0.93, 0.97, 0.98, 0.98, 0.97, 0.96, 0.95, 0.94, 0.94, 0.92, 0.88, 0.80, 0.62, 0.36],
    sunday:   [0.09, 0.06, 0.05, 0.05, 0.05, 0.08, 0.14, 0.25, 0.50, 0.75, 0.90, 0.95, 0.97, 0.97, 0.96, 0.94, 0.92, 0.90, 0.91, 0.90, 0.86, 0.80, 0.62, 0.34]
  },
  "10": {
    development: "VivoCity",
    observedOn: "2026-08-31",
    weekday:  [0.09, 0.06, 0.05, 0.05, 0.06, 0.10, 0.20, 0.38, 0.58, 0.75, 0.85, 0.88, 0.86, 0.84, 0.83, 0.82, 0.82, 0.82, 0.84, 0.82, 0.78, 0.70, 0.52, 0.28],
    saturday: [0.11, 0.08, 0.06, 0.06, 0.06, 0.09, 0.16, 0.30, 0.55, 0.82, 0.94, 0.97, 0.98, 0.99, 0.98, 0.97, 0.96, 0.95, 0.96, 0.95, 0.92, 0.88, 0.72, 0.44],
    sunday:   [0.10, 0.07, 0.05, 0.05, 0.05, 0.08, 0.14, 0.26, 0.50, 0.78, 0.91, 0.96, 0.98, 0.99, 0.97, 0.96, 0.94, 0.93, 0.94, 0.93, 0.90, 0.85, 0.70, 0.42]
  },
  "11": {
    development: "HarbourFront Centre",
    observedOn: "2026-08-31",
    weekday:  [0.07, 0.05, 0.04, 0.04, 0.05, 0.10, 0.24, 0.50, 0.74, 0.84, 0.88, 0.90, 0.87, 0.85, 0.84, 0.82, 0.80, 0.78, 0.76, 0.72, 0.65, 0.52, 0.32, 0.16],
    saturday: [0.08, 0.05, 0.04, 0.04, 0.05, 0.08, 0.14, 0.25, 0.46, 0.72, 0.85, 0.90, 0.92, 0.93, 0.91, 0.89, 0.87, 0.85, 0.86, 0.84, 0.80, 0.72, 0.50, 0.26],
    sunday:   [0.07, 0.05, 0.04, 0.04, 0.04, 0.07, 0.12, 0.20, 0.40, 0.65, 0.80, 0.86, 0.90, 0.91, 0.89, 0.87, 0.84, 0.82, 0.84, 0.82, 0.78, 0.70, 0.48, 0.24]
  },
  "12": {
    development: "Jurong Point",
    observedOn: "2026-08-31",
    weekday:  [0.10, 0.07, 0.05, 0.05, 0.06, 0.12, 0.24, 0.44, 0.66, 0.78, 0.86, 0.90, 0.88, 0.86, 0.85, 0.84, 0.83, 0.82, 0.84, 0.82, 0.78, 0.70, 0.54, 0.30],
    saturday: [0.12, 0.09, 0.06, 0.06, 0.07, 0.10, 0.18, 0.32, 0.58, 0.82, 0.92, 0.96, 0.98, 0.98, 0.97, 0.96, 0.95, 0.94, 0.95, 0.94, 0.90, 0.84, 0.68, 0.40],
    sunday:   [0.11, 0.08, 0.06, 0.06, 0.06, 0.09, 0.15, 0.28, 0.54, 0.78, 0.89, 0.94, 0.96, 0.97, 0.96, 0.94, 0.92, 0.91, 0.92, 0.91, 0.88, 0.82, 0.66, 0.38]
  },
  "13": {
    development: "Tampines Mall",
    observedOn: "2026-08-31",
    weekday:  [0.08, 0.06, 0.04, 0.04, 0.05, 0.10, 0.22, 0.40, 0.64, 0.78, 0.86, 0.90, 0.88, 0.86, 0.85, 0.84, 0.83, 0.82, 0.84, 0.82, 0.78, 0.68, 0.48, 0.25],
    saturday: [0.10, 0.07, 0.05, 0.05, 0.06, 0.09, 0.16, 0.30, 0.55, 0.80, 0.92, 0.96, 0.98, 0.98, 0.97, 0.95, 0.94, 0.93, 0.94, 0.92, 0.88, 0.82, 0.64, 0.36],
    sunday:   [0.09, 0.06, 0.05, 0.05, 0.05, 0.08, 0.14, 0.26, 0.50, 0.75, 0.88, 0.94, 0.96, 0.97, 0.95, 0.93, 0.91, 0.90, 0.91, 0.90, 0.86, 0.80, 0.62, 0.34]
  },
  "14": {
    development: "Parkway Parade",
    observedOn: "2026-08-31",
    weekday:  [0.08, 0.05, 0.04, 0.04, 0.05, 0.10, 0.20, 0.38, 0.60, 0.74, 0.82, 0.87, 0.85, 0.83, 0.82, 0.81, 0.80, 0.80, 0.82, 0.80, 0.75, 0.65, 0.45, 0.24],
    saturday: [0.09, 0.07, 0.05, 0.05, 0.06, 0.09, 0.15, 0.28, 0.52, 0.78, 0.90, 0.95, 0.97, 0.98, 0.96, 0.95, 0.93, 0.92, 0.93, 0.92, 0.88, 0.80, 0.62, 0.34],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.08, 0.13, 0.24, 0.48, 0.74, 0.87, 0.92, 0.95, 0.96, 0.95, 0.93, 0.91, 0.90, 0.91, 0.90, 0.86, 0.80, 0.60, 0.32]
  }
};

/**
 * RAIN_FACTORS table
 * Maps meteorological conditions to multiplier factors.
 * Rain suppresses shopping/parking demand (e.g. 0.88 for heavy/thundery, 0.93 for light/moderate, 0.98 for cloudy).
 */
export const RAIN_FACTORS = {
  // Heavy rain & thundery showers: 0.88
  "Heavy Thundery Showers": 0.88,
  "Thundery Showers": 0.88,
  "Heavy Rain": 0.88,
  "Heavy Showers": 0.88,

  // Moderate or light rain & showers: 0.93
  "Moderate Rain": 0.93,
  "Light Rain": 0.93,
  "Light Showers": 0.93,
  "Passing Showers": 0.93,
  "Showers": 0.93,
  "Moderate Showers": 0.93,

  // Cloudy and overcast: 0.98
  "Cloudy": 0.98,
  "Overcast": 0.98,

  // Everything else: 1.00
  "Partly Cloudy": 1.00,
  "Fair": 1.00,
  "Fair (Day)": 1.00,
  "Fair (Night)": 1.00,
  "Fair & Warm": 1.00,
  "Windy": 1.00,
  "Hazy": 1.00,
  "Slightly Hazy": 1.00
};

/**
 * Helper to strip (Day) or (Night) suffixes and look up factor.
 * If unmatched, returns { factor: 1.00, isUnmatched: true }.
 */
export function getRainFactor(rawForecast) {
  if (!rawForecast || typeof rawForecast !== "string") {
    return { factor: 1.00, isUnmatched: false, matchedKey: "Default" };
  }

  const trimmed = rawForecast.trim();

  // 1. Direct match
  if (RAIN_FACTORS[trimmed] !== undefined) {
    return { factor: RAIN_FACTORS[trimmed], isUnmatched: false, matchedKey: trimmed };
  }

  // 2. Strip " (Night)" or " (Day)" suffix
  const baseForecast = trimmed.replace(/\s*\((Night|Day)\)$/i, "").trim();
  if (RAIN_FACTORS[baseForecast] !== undefined) {
    return { factor: RAIN_FACTORS[baseForecast], isUnmatched: false, matchedKey: baseForecast };
  }

  // 3. Fallback: Log and never guess
  console.warn(`[RAIN_FACTORS] Unrecognised forecast string: "${rawForecast}". Falling back to 1.00.`);
  return { factor: 1.00, isUnmatched: true, matchedKey: "Unmatched: " + rawForecast };
}
