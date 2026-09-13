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

// 12 watched carparks covering major commercial, shopping, and transit hubs across Singapore.
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
    totalLots: 1400,
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
    totalLots: 400,
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
    totalLots: 390,
    latitude: 1.3007,
    longitude: 103.8397
  },
  {
    id: "7",
    development: "ION Orchard",
    area: "Orchard",
    totalLots: 600,
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
    totalLots: 2100,
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
 * Hours 0-5 (Late night): Low occupancy (0.05 - 0.15)
 * Hours 6-10 (Morning): Ramping up
 * Hours 11-17 (Afternoon): Peak commercial/shopping occupancy
 * Hours 18-21 (Dinner/Evening): Second peak
 * Hours 22-23 (Night): Winding down
 */
export const BASELINES = {
  "1": {
    development: "Suntec City",
    observedOn: "2026-08-15",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.10, 0.22, 0.45, 0.72, 0.85, 0.88, 0.89, 0.86, 0.84, 0.83, 0.82, 0.80, 0.75, 0.70, 0.60, 0.45, 0.28, 0.18, 0.12],
    saturday: [0.09, 0.07, 0.05, 0.05, 0.06, 0.08, 0.14, 0.25, 0.45, 0.68, 0.82, 0.88, 0.91, 0.92, 0.90, 0.88, 0.85, 0.84, 0.82, 0.78, 0.62, 0.42, 0.24, 0.14],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.20, 0.38, 0.60, 0.78, 0.85, 0.89, 0.90, 0.88, 0.85, 0.82, 0.80, 0.75, 0.68, 0.50, 0.30, 0.18, 0.11]
  },
  "2": {
    development: "Marina Square",
    observedOn: "2026-08-15",
    weekday:  [0.06, 0.05, 0.04, 0.04, 0.05, 0.08, 0.18, 0.38, 0.65, 0.78, 0.82, 0.84, 0.81, 0.79, 0.77, 0.76, 0.74, 0.70, 0.65, 0.55, 0.40, 0.25, 0.15, 0.09],
    saturday: [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.12, 0.22, 0.40, 0.62, 0.76, 0.84, 0.87, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.72, 0.55, 0.36, 0.20, 0.11],
    sunday:   [0.06, 0.05, 0.04, 0.04, 0.04, 0.06, 0.10, 0.18, 0.35, 0.55, 0.72, 0.80, 0.85, 0.86, 0.84, 0.82, 0.78, 0.75, 0.70, 0.62, 0.45, 0.26, 0.15, 0.09]
  },
  "3": {
    development: "Raffles City",
    observedOn: "2026-08-16",
    weekday:  [0.07, 0.05, 0.05, 0.05, 0.06, 0.12, 0.28, 0.55, 0.80, 0.90, 0.92, 0.94, 0.91, 0.89, 0.88, 0.86, 0.83, 0.78, 0.72, 0.62, 0.46, 0.30, 0.18, 0.11],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.06, 0.09, 0.15, 0.28, 0.48, 0.72, 0.85, 0.90, 0.93, 0.94, 0.92, 0.90, 0.88, 0.86, 0.83, 0.77, 0.60, 0.40, 0.22, 0.13],
    sunday:   [0.07, 0.05, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.40, 0.62, 0.78, 0.86, 0.90, 0.91, 0.89, 0.86, 0.83, 0.80, 0.74, 0.65, 0.48, 0.28, 0.16, 0.10]
  },
  "4": {
    development: "The Centrepoint",
    observedOn: "2026-08-18",
    weekday:  [0.05, 0.04, 0.04, 0.04, 0.05, 0.07, 0.14, 0.26, 0.45, 0.65, 0.78, 0.82, 0.80, 0.78, 0.76, 0.75, 0.74, 0.72, 0.68, 0.58, 0.42, 0.24, 0.14, 0.08],
    saturday: [0.06, 0.04, 0.04, 0.04, 0.05, 0.06, 0.10, 0.20, 0.42, 0.68, 0.84, 0.91, 0.94, 0.95, 0.93, 0.91, 0.88, 0.86, 0.82, 0.76, 0.58, 0.36, 0.18, 0.10],
    sunday:   [0.05, 0.04, 0.04, 0.04, 0.04, 0.05, 0.08, 0.16, 0.36, 0.60, 0.78, 0.86, 0.90, 0.92, 0.90, 0.87, 0.84, 0.80, 0.74, 0.66, 0.46, 0.25, 0.14, 0.08]
  },
  "5": {
    development: "313@Somerset",
    observedOn: "2026-08-18",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.08, 0.16, 0.30, 0.52, 0.72, 0.85, 0.90, 0.88, 0.86, 0.85, 0.84, 0.82, 0.80, 0.76, 0.68, 0.50, 0.32, 0.20, 0.12],
    saturday: [0.09, 0.07, 0.05, 0.05, 0.06, 0.08, 0.14, 0.25, 0.50, 0.76, 0.90, 0.95, 0.97, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.82, 0.65, 0.44, 0.25, 0.15],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.44, 0.70, 0.85, 0.92, 0.95, 0.96, 0.94, 0.91, 0.88, 0.85, 0.80, 0.72, 0.54, 0.32, 0.18, 0.11]
  },
  "6": {
    development: "Orchard Central",
    observedOn: "2026-08-19",
    weekday:  [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.15, 0.28, 0.50, 0.70, 0.82, 0.87, 0.85, 0.83, 0.82, 0.80, 0.78, 0.76, 0.72, 0.64, 0.46, 0.28, 0.16, 0.10],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.46, 0.72, 0.88, 0.94, 0.96, 0.97, 0.95, 0.93, 0.90, 0.88, 0.85, 0.79, 0.62, 0.40, 0.22, 0.13],
    sunday:   [0.07, 0.05, 0.04, 0.04, 0.05, 0.06, 0.10, 0.18, 0.40, 0.65, 0.82, 0.90, 0.93, 0.94, 0.92, 0.89, 0.86, 0.82, 0.77, 0.68, 0.50, 0.30, 0.16, 0.10]
  },
  "7": {
    development: "ION Orchard",
    observedOn: "2026-08-20",
    weekday:  [0.10, 0.07, 0.06, 0.06, 0.07, 0.10, 0.20, 0.38, 0.60, 0.80, 0.91, 0.94, 0.92, 0.90, 0.89, 0.88, 0.86, 0.84, 0.81, 0.74, 0.56, 0.38, 0.24, 0.15],
    saturday: [0.11, 0.08, 0.06, 0.06, 0.07, 0.09, 0.16, 0.30, 0.55, 0.82, 0.94, 0.98, 0.99, 0.99, 0.98, 0.96, 0.95, 0.93, 0.90, 0.85, 0.70, 0.48, 0.28, 0.17],
    sunday:   [0.10, 0.07, 0.06, 0.06, 0.06, 0.08, 0.14, 0.25, 0.48, 0.75, 0.90, 0.95, 0.97, 0.98, 0.96, 0.94, 0.91, 0.88, 0.83, 0.75, 0.58, 0.36, 0.20, 0.13]
  },
  "8": {
    development: "Tangs Plaza",
    observedOn: "2026-08-20",
    weekday:  [0.06, 0.04, 0.04, 0.04, 0.05, 0.07, 0.14, 0.28, 0.52, 0.74, 0.86, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.74, 0.65, 0.45, 0.26, 0.15, 0.09],
    saturday: [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.12, 0.24, 0.48, 0.76, 0.91, 0.96, 0.98, 0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.80, 0.62, 0.40, 0.22, 0.12],
    sunday:   [0.06, 0.04, 0.04, 0.04, 0.04, 0.06, 0.10, 0.20, 0.42, 0.68, 0.85, 0.92, 0.95, 0.96, 0.94, 0.91, 0.88, 0.84, 0.78, 0.70, 0.50, 0.30, 0.16, 0.09]
  },
  "9": {
    development: "Ngee Ann City",
    observedOn: "2026-08-21",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.09, 0.18, 0.35, 0.58, 0.78, 0.88, 0.92, 0.89, 0.87, 0.86, 0.85, 0.83, 0.80, 0.76, 0.68, 0.50, 0.32, 0.20, 0.12],
    saturday: [0.09, 0.07, 0.05, 0.05, 0.06, 0.08, 0.14, 0.28, 0.52, 0.80, 0.92, 0.96, 0.98, 0.98, 0.97, 0.95, 0.93, 0.91, 0.88, 0.82, 0.66, 0.45, 0.26, 0.15],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.46, 0.72, 0.88, 0.94, 0.96, 0.97, 0.95, 0.92, 0.89, 0.85, 0.80, 0.72, 0.54, 0.34, 0.18, 0.11]
  },
  "10": {
    development: "VivoCity",
    observedOn: "2026-08-22",
    weekday:  [0.08, 0.06, 0.05, 0.05, 0.06, 0.09, 0.16, 0.30, 0.50, 0.70, 0.82, 0.86, 0.84, 0.82, 0.81, 0.80, 0.79, 0.78, 0.76, 0.70, 0.54, 0.36, 0.22, 0.13],
    saturday: [0.09, 0.07, 0.05, 0.05, 0.06, 0.08, 0.14, 0.26, 0.50, 0.78, 0.92, 0.96, 0.98, 0.99, 0.98, 0.97, 0.95, 0.93, 0.90, 0.84, 0.68, 0.46, 0.26, 0.15],
    sunday:   [0.08, 0.06, 0.05, 0.05, 0.05, 0.07, 0.12, 0.22, 0.45, 0.72, 0.88, 0.94, 0.97, 0.98, 0.96, 0.94, 0.92, 0.88, 0.84, 0.76, 0.58, 0.36, 0.20, 0.12]
  },
  "11": {
    development: "HarbourFront Centre",
    observedOn: "2026-08-22",
    weekday:  [0.06, 0.04, 0.04, 0.04, 0.05, 0.08, 0.20, 0.45, 0.70, 0.82, 0.86, 0.88, 0.85, 0.83, 0.82, 0.80, 0.78, 0.74, 0.68, 0.58, 0.42, 0.26, 0.15, 0.09],
    saturday: [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.12, 0.22, 0.42, 0.68, 0.82, 0.88, 0.91, 0.92, 0.90, 0.88, 0.85, 0.82, 0.78, 0.72, 0.56, 0.36, 0.20, 0.11],
    sunday:   [0.06, 0.04, 0.04, 0.04, 0.04, 0.06, 0.10, 0.18, 0.36, 0.60, 0.76, 0.84, 0.88, 0.89, 0.87, 0.84, 0.80, 0.76, 0.70, 0.62, 0.45, 0.26, 0.15, 0.09]
  },
  "12": {
    development: "Jurong Point",
    observedOn: "2026-08-23",
    weekday:  [0.09, 0.07, 0.05, 0.05, 0.06, 0.10, 0.20, 0.38, 0.60, 0.75, 0.84, 0.88, 0.86, 0.84, 0.83, 0.82, 0.81, 0.80, 0.78, 0.72, 0.58, 0.40, 0.25, 0.15],
    saturday: [0.10, 0.08, 0.06, 0.06, 0.07, 0.09, 0.15, 0.28, 0.52, 0.78, 0.90, 0.95, 0.97, 0.98, 0.97, 0.95, 0.94, 0.92, 0.89, 0.83, 0.68, 0.48, 0.28, 0.16],
    sunday:   [0.09, 0.07, 0.06, 0.06, 0.06, 0.08, 0.13, 0.24, 0.48, 0.72, 0.86, 0.92, 0.95, 0.96, 0.94, 0.92, 0.90, 0.87, 0.82, 0.75, 0.58, 0.38, 0.22, 0.14]
  },
  "13": {
    development: "Tampines Mall",
    observedOn: "2026-08-23",
    weekday:  [0.07, 0.05, 0.04, 0.04, 0.05, 0.08, 0.18, 0.35, 0.58, 0.74, 0.84, 0.88, 0.86, 0.84, 0.83, 0.82, 0.80, 0.78, 0.76, 0.70, 0.54, 0.36, 0.20, 0.11],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.06, 0.08, 0.14, 0.26, 0.50, 0.76, 0.90, 0.95, 0.97, 0.98, 0.96, 0.94, 0.92, 0.90, 0.87, 0.81, 0.65, 0.44, 0.24, 0.14],
    sunday:   [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.12, 0.22, 0.45, 0.70, 0.85, 0.92, 0.95, 0.96, 0.94, 0.91, 0.88, 0.84, 0.80, 0.72, 0.55, 0.34, 0.18, 0.11]
  },
  "14": {
    development: "Parkway Parade",
    observedOn: "2026-08-24",
    weekday:  [0.07, 0.05, 0.04, 0.04, 0.05, 0.08, 0.16, 0.32, 0.54, 0.70, 0.80, 0.85, 0.83, 0.81, 0.80, 0.79, 0.78, 0.76, 0.74, 0.68, 0.52, 0.34, 0.18, 0.10],
    saturday: [0.08, 0.06, 0.05, 0.05, 0.06, 0.08, 0.13, 0.25, 0.48, 0.74, 0.88, 0.94, 0.96, 0.97, 0.95, 0.93, 0.91, 0.89, 0.86, 0.80, 0.64, 0.42, 0.22, 0.12],
    sunday:   [0.07, 0.05, 0.04, 0.04, 0.05, 0.07, 0.11, 0.20, 0.42, 0.68, 0.84, 0.90, 0.94, 0.95, 0.93, 0.90, 0.87, 0.83, 0.78, 0.70, 0.52, 0.32, 0.16, 0.10]
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
