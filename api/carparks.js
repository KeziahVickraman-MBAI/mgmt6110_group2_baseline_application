import { WATCHED_SITES, WATCHED_IDS } from "./constants.js";

// In-memory cache for carparks (60s TTL)
let memoryCache = {
  data: null,
  fetchedAt: 0
};

/**
 * Server-side internal fetcher for LTA CarParkAvailabilityv2
 */
export async function fetchCarparksData() {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Guard BEFORE the fetch: if missing or empty, return 503
  if (!accountKey || accountKey.trim() === "") {
    const err = new Error("LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy.");
    err.statusCode = 503;
    throw err;
  }

  const now = Date.now();
  if (memoryCache.data && (now - memoryCache.fetchedAt < 60000)) {
    const cacheAge = Math.floor((now - memoryCache.fetchedAt) / 1000);
    return { ...memoryCache.data, cacheAge, fromCache: true };
  }

  const ltaUrl = "https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2";

  let response;
  try {
    response = await fetch(ltaUrl, {
      headers: {
        AccountKey: accountKey.trim()
      }
    });
  } catch (netErr) {
    const err = new Error("Can't reach the transport feed. " + (netErr.message || "Network unreachable"));
    err.statusCode = 502;
    throw err;
  }

  // Check response.ok BEFORE reading any body. LTA returns an empty body on 401.
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const err = new Error("The transport feed rejected our credential. Nothing on this screen is current.");
      err.statusCode = 401;
      throw err;
    }
    const err = new Error(`Transport feed answered with HTTP ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  let json;
  try {
    json = await response.json();
  } catch (parseErr) {
    const err = new Error("Failed to parse transport feed response JSON.");
    err.statusCode = 502;
    throw err;
  }

  const rawList = Array.isArray(json.value) ? json.value : [];
  const readingTimestamp = new Date().toISOString();

  // Map of watched site ID to LTA record
  const ltaMap = new Map();
  for (const item of rawList) {
    const id = String(item.CarParkID || "").trim();
    if (WATCHED_IDS.has(id)) {
      ltaMap.set(id, item);
    }
  }

  // Build the filtered list against our WATCHED sites
  const sites = [];
  const missingSiteIds = [];
  const corruptedSites = [];

  for (const watched of WATCHED_SITES) {
    const ltaItem = ltaMap.get(watched.id);

    if (!ltaItem) {
      // Absent from payload -> UNKNOWN / No reading for this site
      missingSiteIds.push(watched.id);
      continue;
    }

    // CAST EVERY NUMBER carefully. AvailableLots can be a string in some payloads.
    const rawAvailable = ltaItem.AvailableLots;
    let availableLots = Number(rawAvailable);

    if (isNaN(availableLots) || availableLots === null) {
      missingSiteIds.push(watched.id);
      continue;
    }

    // Check if feed provides total lots (TotalLots, Lots, Capacity, etc.)
    let totalLots = watched.totalLots;
    let feedTotal = null;
    for (const key of ["TotalLots", "totalLots", "Total", "Lots", "Capacity"]) {
      if (ltaItem[key] !== undefined && ltaItem[key] !== null && ltaItem[key] !== "") {
        const parsed = Number(ltaItem[key]);
        if (!isNaN(parsed) && parsed > 0) {
          feedTotal = parsed;
          break;
        }
      }
    }

    if (feedTotal !== null) {
      // If the feed provides both, check they are not swapped
      if (availableLots > feedTotal && feedTotal > 0) {
        if (feedTotal <= availableLots && availableLots >= (watched.totalLots * 0.8)) {
          const temp = availableLots;
          availableLots = feedTotal;
          totalLots = temp;
        } else {
          totalLots = feedTotal;
        }
      } else {
        totalLots = feedTotal;
      }
    }

    // GUARD: if available > total, that site shows "Reading looks wrong for this site"
    // and is excluded from the ranking. Never clamp a nonsensical number into a plausible-looking one.
    if (availableLots > totalLots) {
      console.warn(`[DATA GUARD] Available lots (${availableLots}) exceeds total lots (${totalLots}) for site ${watched.id} (${watched.development}). Flagging as "Reading looks wrong for this site" and excluding from ranking.`);
      corruptedSites.push({
        id: watched.id,
        development: watched.development,
        area: watched.area,
        lotsAvailable: availableLots,
        totalLots: totalLots,
        status: "Reading looks wrong for this site"
      });
      continue;
    }

    // Safe Occupancy rate calculation (only when availableLots <= totalLots)
    const occupiedLots = totalLots - availableLots;
    const occupancyRate = totalLots > 0 ? (occupiedLots / totalLots) : 0;

    // Parse location coordinates if available in LTA (space or comma separated "lat lng" or "lat,lng")
    let latitude = watched.latitude;
    let longitude = watched.longitude;
    if (typeof ltaItem.Location === "string" && ltaItem.Location.trim()) {
      const parts = ltaItem.Location.trim().split(/[\s,]+/);
      if (parts.length >= 2) {
        const p0 = Number(parts[0]);
        const p1 = Number(parts[1]);
        // Verify coordinate ordering for Singapore (lat ~1.2-1.45, lng ~103.6-104.0)
        if (p0 >= 1.0 && p0 <= 1.5 && p1 >= 103.0 && p1 <= 104.5) {
          latitude = p0;
          longitude = p1;
        } else if (p1 >= 1.0 && p1 <= 1.5 && p0 >= 103.0 && p0 <= 104.5) {
          latitude = p1;
          longitude = p0;
        }
      }
    }

    sites.push({
      id: watched.id,
      development: watched.development,
      area: watched.area,
      lotsAvailable: availableLots,
      totalLots: totalLots,
      occupancyRate: Number(occupancyRate.toFixed(4)),
      readingTimestamp,
      latitude,
      longitude
    });
  }

  const result = {
    timestamp: readingTimestamp,
    cacheAge: 0,
    sites,
    missingSiteIds,
    corruptedSites
  };

  memoryCache = {
    data: result,
    fetchedAt: now
  };

  return result;
}

/**
 * Vercel Serverless Function Handler / Express Handler
 */
export default async function handler(req, res) {
  try {
    const data = await fetchCarparksData();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || "Failed to fetch carpark data",
      status
    });
  }
}
