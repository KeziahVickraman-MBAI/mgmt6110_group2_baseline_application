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

    if (weatherDegraded || !nearestArea) {
      rainFactor = 1.00;
    } else {
      const factorResult = getRainFactor(nearestArea.forecast);
      rainFactor = typeof factorResult.factor === "number" && !isNaN(factorResult.factor) ? factorResult.factor : 1.00;

      if (factorResult.isUnmatched) {
        unmatchedForecastStrings.add(nearestArea.forecast);
      }
    }

    // Safety fallback: if rainFactor missing or unrecognised, fallback to 1.00 and log
    if (typeof rainFactor !== "number" || isNaN(rainFactor) || rainFactor <= 0) {
      console.warn(`[RAIN FACTOR] Invalid factor for site ${site.id}. Falling back to 1.00.`);
      rainFactor = 1.00;
    }

    // Cast every number at the boundary
    const actualAvailable = Number(site.lotsAvailable);
    const totalLots = Number(site.totalLots);

    // expectedRaw: baseline expected available lots
    const expectedRaw = Number(Math.round((1 - baselineRate) * totalLots));

    // expectedAdjusted: baseline expected available lots adjusted by rainFactor
    const expectedAdjusted = Number(Math.round(expectedRaw * rainFactor));

    // Lots affected calculation (cars occupied above or below expected)
    const actualLotsOccupied = totalLots - actualAvailable;
    const expectedLotsOccupied = totalLots - expectedAdjusted;
    const carsDiff = actualLotsOccupied - expectedLotsOccupied; // > 0 = above normal, < 0 = below normal
    const absCarsDiff = Math.abs(carsDiff);

    // Occupancy rate calculation (for baseline model calibration guard)
    const actualOccupancyRate = Number(site.occupancyRate);
    const expectedOccupancyRate = Number(((totalLots - expectedAdjusted) / totalLots).toFixed(4));
    const occupancyDeviation = expectedOccupancyRate > 0
      ? (actualOccupancyRate - expectedOccupancyRate) / expectedOccupancyRate
      : 0;
    const absOccupancyDeviation = Math.abs(occupancyDeviation);

    // Deviations (availability lots):
    // deviationRaw: against the unadjusted baseline
    const deviationRaw = expectedRaw > 0
      ? Math.round(((actualAvailable - expectedRaw) / expectedRaw) * 100)
      : 0;

    // deviationAdjusted: against baseline * rainFactor
    const deviationAdjusted = expectedAdjusted > 0
      ? Math.round(((actualAvailable - expectedAdjusted) / expectedAdjusted) * 100)
      : 0;

    // Backward compatible deviation (signed float, e.g. -0.39 or +1.63)
    const deviation = Number((deviationAdjusted / 100).toFixed(4));
    const absDeviation = Number(absOccupancyDeviation.toFixed(4));
    const deviationPercent = deviationAdjusted;
    const deviationSignedStr = (deviationAdjusted > 0 ? "+" : "") + `${deviationAdjusted}%`;

    // Direction and Headline figures
    let direction = "normal";
    let carsHeadline = "Normal occupancy";
    let actionText = "Monitor site.";

    if (carsDiff > 0) {
      direction = "above";
      carsHeadline = `${carsDiff.toLocaleString()} cars above normal`;
      actionText = "Filling faster than usual.";
    } else if (carsDiff < 0) {
      direction = "below";
      carsHeadline = `${absCarsDiff.toLocaleString()} cars below normal`;
      actionText = "More capacity available than usual.";
    }

    // Build plain sentence branching on the factor
    const absPercent = Math.abs(deviationAdjusted);
    const dirWord = deviationAdjusted >= 0 ? "above" : "below";
    let plainSentence = "";

    if (rainFactor === 1.00 || weatherDegraded || !nearestArea) {
      let weatherDesc = "clear in City";
      if (!weatherDegraded && nearestArea && nearestArea.forecast) {
        weatherDesc = `${nearestArea.forecast.toLowerCase()} in ${nearestArea.name}`;
      }
      plainSentence = `running ${absPercent}% ${dirWord} its usual ${timeContext.timeLabel} availability. No weather adjustment — ${weatherDesc}`;
    } else {
      const loweringPercent = Math.round((1 - rainFactor) * 100);
      const weatherDesc = nearestArea && nearestArea.forecast
        ? `${nearestArea.forecast.toLowerCase()} in ${nearestArea.name}`
        : "heavy rain in City";
      plainSentence = `running ${absPercent}% ${dirWord} its usual ${timeContext.timeLabel} availability, after lowering the expectation ${loweringPercent}% for ${weatherDesc}`;
    }

    evaluatedSites.push({
      id: site.id,
      development: site.development,
      area: site.area,
      lotsAvailable: actualAvailable,
      totalLots,
      actualLotsOccupied,
      expectedLotsOccupied,
      carsDiff,
      absCarsDiff,
      carsHeadline,
      actionText,
      direction,
      latitude: Number(site.latitude),
      longitude: Number(site.longitude),
      actualOccupancyRate: site.occupancyRate,
      expectedOccupancyRate: Number(((totalLots - expectedAdjusted) / totalLots).toFixed(4)),
      baselineOccupancyRate: baselineRate,
      expectedRaw,
      expectedAdjusted,
      deviationRaw,
      deviationAdjusted,
      observedOn: baselineObj.observedOn,
      rainFactor: Number(rainFactor.toFixed(2)),
      nearestAreaName: nearestArea ? nearestArea.name : null,
      nearestAreaForecast: nearestArea ? nearestArea.forecast : null,
      distanceKm: nearestArea ? Number(nearestArea.distanceKm) : 0,
      deviation,
      deviationPercent,
      deviationSignedStr,
      absDeviation,
      plainSentence,
      isFull: actualAvailable === 0
    });
  }

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

  // SPLIT EXCEPTIONS BY DIRECTION & RANK BY LOTS AFFECTED
  // "Needs attention": sites furthest ABOVE baseline (carsDiff > 0, ranked by carsDiff descending)
  // "Has capacity": sites furthest BELOW baseline (carsDiff < 0, ranked by absCarsDiff descending)
  const thresholdRate = 0.10; // 10% deviation threshold
  const thresholdCars = 15;   // at least 15 cars affected to qualify as a substantial operational deviation

  const aboveSites = evaluatedSites
    .filter(s => s.carsDiff > 0 && s.absDeviation >= thresholdRate && s.carsDiff >= thresholdCars)
    .sort((a, b) => b.carsDiff - a.carsDiff);

  const belowSites = evaluatedSites
    .filter(s => s.carsDiff < 0 && s.absDeviation >= thresholdRate && s.absCarsDiff >= thresholdCars)
    .sort((a, b) => b.absCarsDiff - a.absCarsDiff);

  // Flag top ONE in each direction (not top two overall)
  const topAbove = !isMiscalibrated && aboveSites.length > 0 ? aboveSites[0] : null;
  const topBelow = !isMiscalibrated && belowSites.length > 0 ? belowSites[0] : null;

  const isAllWithinThreshold = !topAbove && !topBelow;

  // No travel distance calculation needed for student campus decision
  const flaggedDistance = null;

  // ONE DECISION LINE ABOVE EVERYTHING
  let decisionHeadline = "All carparks near campus are operating within normal baseline.";
  let decisionSubtext = "Occupancy across all watched sites near campus is within expected levels for this hour.";

  if (topAbove && topBelow) {
    decisionHeadline = `Two sites near campus deviating from normal baseline.`;
    decisionSubtext = `${topAbove.development} is filling faster than usual (${topAbove.carsHeadline}); ${topBelow.development} has extra space (${topBelow.carsHeadline}).`;
  } else if (topAbove) {
    decisionHeadline = `${topAbove.development} is filling faster than normal.`;
    decisionSubtext = `${topAbove.carsHeadline} (${topAbove.deviationSignedStr} vs baseline). Consider leaving earlier or heading to an alternative campus carpark.`;
  } else if (topBelow) {
    decisionHeadline = `${topBelow.development} has more space than usual.`;
    decisionSubtext = `${topBelow.carsHeadline} (${topBelow.deviationSignedStr} vs baseline). Other campus carparks operating near normal baseline.`;
  }

  // Flagged set for quiet list
  const flaggedIds = new Set([
    ...(topAbove ? [topAbove.id] : []),
    ...(topBelow ? [topBelow.id] : [])
  ]);

  // Remaining watched sites as a quiet ranked list beneath
  // Ranked by lots affected (absCarsDiff) descending
  const quietList = evaluatedSites
    .filter(s => !flaggedIds.has(s.id))
    .sort((a, b) => b.absCarsDiff - a.absCarsDiff);

  // Backward compatibility: flaggedExceptions array contains flagged sites (up to 2: topAbove, topBelow)
  const flaggedExceptions = [
    ...(topAbove ? [topAbove] : []),
    ...(topBelow ? [topBelow] : [])
  ];

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
    decisionHeadline,
    decisionSubtext,
    topAbove,
    topBelow,
    flaggedDistance,
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
