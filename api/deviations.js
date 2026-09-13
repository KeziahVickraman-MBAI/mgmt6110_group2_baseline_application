import { WATCHED_SITES, BASELINES, getRainFactor } from "./constants.js";
import { fetchCarparksData } from "./carparks.js";
import { fetchWeatherData } from "./weather.js";

// Memory storage for last successful read to support unreachable state sentence
let lastGoodReading = {
  timestamp: null,
  carparksData: null
};

/**
 * Determine Singapore day-type and hour
 */
export function getSingaporeTimeContext(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Singapore",
    weekday: "long",
    hour: "numeric",
    hourCycle: "h23"
  });
  const parts = formatter.formatToParts(date);
  let weekdayName = "";
  let hour = 0;

  for (const p of parts) {
    if (p.type === "weekday") weekdayName = p.value;
    if (p.type === "hour") hour = parseInt(p.value, 10);
  }

  const lower = weekdayName.toLowerCase();
  let dayType = "weekday";
  if (lower === "saturday") dayType = "saturday";
  else if (lower === "sunday") dayType = "sunday";

  let period = "afternoon";
  if (hour >= 0 && hour < 6) period = "early morning";
  else if (hour >= 6 && hour < 12) period = "morning";
  else if (hour >= 12 && hour < 18) period = "afternoon";
  else period = "evening";

  const timeLabel = dayType === "weekday" 
    ? `weekday ${period}` 
    : `${weekdayName} ${period}`;

  return { dayType, hour, weekdayName, period, timeLabel };
}

/**
 * Haversine formula for calculating spherical distance between two coordinates in kilometers
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest forecast area by Haversine distance
 * Reads coordinates strictly by key (never by position)
 */
function findNearestForecastArea(siteLat, siteLng, forecastAreas) {
  if (!forecastAreas || forecastAreas.length === 0) {
    return { name: "Singapore", forecast: "Unknown", distanceKm: 0 };
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const area of forecastAreas) {
    if (typeof area.latitude !== "number" || typeof area.longitude !== "number") continue;
    const d = haversineDistanceKm(siteLat, siteLng, area.latitude, area.longitude);
    if (d < minDistance) {
      minDistance = d;
      nearest = {
        name: area.name,
        forecast: area.forecast,
        latitude: area.latitude,
        longitude: area.longitude,
        distanceKm: Number(d.toFixed(2))
      };
    }
  }

  return nearest || { name: "Singapore", forecast: "Unknown", distanceKm: 0 };
}

/**
 * Compute deviation payload
 */
export async function computeDeviations() {
  const timeContext = getSingaporeTimeContext();
  const unmatchedForecastStrings = new Set();

  // 1. Fetch weather (degrades separately, never fails entire board)
  let weatherData = null;
  let weatherDegraded = false;
  let weatherDegradedReason = "";

  try {
    weatherData = await fetchWeatherData();
  } catch (wErr) {
    weatherDegraded = true;
    weatherDegradedReason = "Rain adjustment unavailable — deviations are unadjusted.";
    console.warn("[DEVIATIONS] Weather feed unavailable:", wErr.message);
  }

  // 2. Fetch carparks (key required, fails whole board if refused or unreachable)
  let carparksData;
  try {
    carparksData = await fetchCarparksData();
    // Record last good reading
    lastGoodReading = {
      timestamp: carparksData.timestamp,
      carparksData
    };
  } catch (cErr) {
    const status = cErr.statusCode || 500;
    const errorObj = {
      error: cErr.message,
      status,
      lastGoodReadingTimestamp: lastGoodReading.timestamp,
      isRefused: status === 401 || status === 403,
      isUnreachable: status === 502 || status === 503 || status === 504
    };
    throw errorObj;
  }

  const { sites, missingSiteIds, corruptedSites = [], timestamp: readingTimestamp, cacheAge } = carparksData;
  const forecastAreas = weatherData ? weatherData.areas : [];

  const evaluatedSites = [];
  const omittedDueToNoBaseline = [];

  for (const site of sites) {
    const baselineObj = BASELINES[site.id];

    // "Until a site has a real baseline, EXCLUDE it from the ranking entirely rather than ranking it against a placeholder"
    if (!baselineObj || !baselineObj.observedOn) {
      omittedDueToNoBaseline.push({
        id: site.id,
        development: site.development,
        reason: "No verified baseline with observedOn date"
      });
      continue;
    }

    const baselineRates = baselineObj[timeContext.dayType];
    const baselineRate = baselineRates && typeof baselineRates[timeContext.hour] === "number"
      ? baselineRates[timeContext.hour]
      : null;

    if (baselineRate === null || baselineRate === undefined || baselineRate <= 0) {
      omittedDueToNoBaseline.push({
        id: site.id,
        development: site.development,
        reason: "No baseline entry for " + timeContext.dayType + " hour " + timeContext.hour
      });
      continue;
    }

    // Match nearest forecast area using Haversine
    const nearestArea = findNearestForecastArea(site.latitude, site.longitude, forecastAreas);

    // Log every site-to-area match with the computed distance in kilometres
    console.log(`[AREA MATCH] Site ${site.id} (${site.development}, ${site.area}) -> Nearest area: "${nearestArea.name}" (${nearestArea.distanceKm} km, forecast: "${nearestArea.forecast}")`);

    let rainFactor = 1.00;
    let adjustmentPhrase = "";

    if (weatherDegraded || !nearestArea) {
      rainFactor = 1.00;
      adjustmentPhrase = "";
    } else {
      const factorResult = getRainFactor(nearestArea.forecast);
      rainFactor = factorResult.factor;

      if (factorResult.isUnmatched) {
        unmatchedForecastStrings.add(nearestArea.forecast);
      }

      // Format adjustment description: e.g. "adjusted for light rain in Bukit Merah"
      const forecastLower = nearestArea.forecast.toLowerCase();
      adjustmentPhrase = `adjusted for ${forecastLower} in ${nearestArea.name} (${nearestArea.distanceKm}km)`;
    }

    const expectedOccupancy = Number((baselineRate * rainFactor).toFixed(4));
    const actualOccupancy = site.occupancyRate;

    // Deviation = (actual occupancy - expected occupancy) / expected occupancy, signed percentage
    const deviation = expectedOccupancy > 0 
      ? (actualOccupancy - expectedOccupancy) / expectedOccupancy 
      : 0;

    const deviationPercent = Math.round(deviation * 100);
    const absDeviation = Math.abs(deviation);

    // Build plain sentence
    const absPercent = Math.abs(deviationPercent);
    const direction = deviation >= 0 ? "above" : "below";
    let plainSentence = `running ${absPercent}% ${direction} its usual ${timeContext.timeLabel} occupancy`;
    if (adjustmentPhrase) {
      plainSentence += `, ${adjustmentPhrase}`;
    }

    evaluatedSites.push({
      id: site.id,
      development: site.development,
      area: site.area,
      lotsAvailable: site.lotsAvailable,
      totalLots: site.totalLots,
      actualOccupancyRate: actualOccupancy,
      expectedOccupancyRate: expectedOccupancy,
      baselineOccupancyRate: baselineRate,
      observedOn: baselineObj.observedOn,
      rainFactor,
      nearestAreaName: nearestArea ? nearestArea.name : null,
      nearestAreaForecast: nearestArea ? nearestArea.forecast : null,
      distanceKm: nearestArea ? nearestArea.distanceKm : 0,
      deviation: Number(deviation.toFixed(4)),
      deviationPercent,
      deviationSignedStr: (deviationPercent > 0 ? "+" : "") + `${deviationPercent}%`,
      absDeviation: Number(absDeviation.toFixed(4)),
      plainSentence,
      isFull: site.lotsAvailable === 0
    });
  }

  // Sort by absolute deviation descending
  evaluatedSites.sort((a, b) => b.absDeviation - a.absDeviation);

  // SANITY CHECK: if more than half the watched sites deviate by over 100%,
  // the baselines are wrong, not the world.
  const over100Deviations = evaluatedSites.filter(s => s.absDeviation > 1.0);
  const isMiscalibrated = evaluatedSites.length > 0 && (over100Deviations.length > evaluatedSites.length / 2);
  const miscalibrationReason = isMiscalibrated
    ? `${over100Deviations.length} of ${evaluatedSites.length} evaluated sites deviate by over 100% from baseline.`
    : null;

  if (isMiscalibrated) {
    console.warn(`[SANITY CHECK] Baselines look miscalibrated (${over100Deviations.length}/${evaluatedSites.length} sites > 100% deviation). Deviations suppressed.`);
  }

  // Determine threshold breaches (beyond 10% deviation, i.e. absDeviation > 0.10)
  const breachedSites = evaluatedSites.filter(s => s.absDeviation > 0.10);
  const isAllWithinThreshold = breachedSites.length === 0;

  // The board shows the two largest deviations as the only prominent elements
  const flaggedExceptions = isAllWithinThreshold ? [] : breachedSites.slice(0, 2);
  const flaggedIds = new Set(flaggedExceptions.map(f => f.id));

  // Remaining watched sites as a quiet ranked list beneath
  const quietList = evaluatedSites.filter(s => !flaggedIds.has(s.id));

  // Format missing sites list
  const missingSites = WATCHED_SITES
    .filter(ws => missingSiteIds.includes(ws.id))
    .map(ws => ({
      id: ws.id,
      development: ws.development,
      status: "No reading for this site"
    }));

  // Freshness & staleness calculation (above 15 minutes old triggers stale state)
  const readingDate = new Date(readingTimestamp);
  const now = new Date();
  const minutesOld = Math.max(0, Math.floor((now.getTime() - readingDate.getTime()) / 60000));
  const isStale = minutesOld > 15;

  return {
    readingTimestamp,
    minutesOld,
    isStale,
    cacheAge,
    timeContext,
    isAllWithinThreshold,
    isMiscalibrated,
    miscalibrationReason,
    over100Count: over100Deviations.length,
    totalWatchedCount: WATCHED_SITES.length,
    evaluatedCount: evaluatedSites.length,
    flaggedExceptions,
    quietList,
    missingSites,
    corruptedSites,
    omittedDueToNoBaseline,
    weather: {
      degraded: weatherDegraded,
      reason: weatherDegradedReason,
      unmatchedForecastStrings: Array.from(unmatchedForecastStrings)
    },
    lastGoodReadingTimestamp: lastGoodReading.timestamp
  };
}

/**
 * Vercel Serverless Function Handler / Express Handler
 */
export default async function handler(req, res) {
  try {
    const data = await computeDeviations();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json(err);
  }
}
