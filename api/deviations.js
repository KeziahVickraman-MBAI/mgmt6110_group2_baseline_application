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
 * Find nearest forecast area by straight-line distance
 */
function findNearestForecastArea(siteLat, siteLng, forecastAreas) {
  if (!forecastAreas || forecastAreas.length === 0) {
    return { name: "Singapore", forecast: "Unknown", distanceKm: 0 };
  }

  let nearest = null;
  let minDistanceSq = Infinity;

  const latRad = (siteLat * Math.PI) / 180;
  const cosLat = Math.cos(latRad);

  for (const area of forecastAreas) {
    const dLat = area.latitude - siteLat;
    const dLng = (area.longitude - siteLng) * cosLat;
    const distSq = dLat * dLat + dLng * dLng;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearest = area;
    }
  }

  return nearest;
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

  const { sites, missingSiteIds, timestamp: readingTimestamp, cacheAge } = carparksData;
  const forecastAreas = weatherData ? weatherData.areas : [];

  const evaluatedSites = [];
  const omittedDueToNoBaseline = [];

  for (const site of sites) {
    const baselineObj = BASELINES[site.id];
    const baselineRates = baselineObj ? baselineObj[timeContext.dayType] : null;
    const baselineRate = baselineRates && typeof baselineRates[timeContext.hour] === "number"
      ? baselineRates[timeContext.hour]
      : null;

    // "If a site has no baseline entry for the current day-type and hour, omit it from the ranking entirely"
    if (baselineRate === null || baselineRate === undefined || baselineRate <= 0) {
      omittedDueToNoBaseline.push({
        id: site.id,
        development: site.development,
        reason: "No baseline entry for " + timeContext.dayType + " hour " + timeContext.hour
      });
      continue;
    }

    // Match nearest forecast area
    const nearestArea = findNearestForecastArea(site.latitude, site.longitude, forecastAreas);

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
      adjustmentPhrase = `adjusted for ${forecastLower} in ${nearestArea.name}`;
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
      rainFactor,
      nearestAreaName: nearestArea ? nearestArea.name : null,
      nearestAreaForecast: nearestArea ? nearestArea.forecast : null,
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
    totalWatchedCount: WATCHED_SITES.length,
    evaluatedCount: evaluatedSites.length,
    flaggedExceptions,
    quietList,
    missingSites,
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
