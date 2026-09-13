import { DeviationsResponse } from "./types";

export function getScenarioData(scenario: "flagged" | "empty" | "stale" | "weather-degraded"): DeviationsResponse {
  const baseTimestamp = new Date().toISOString();
  const oldTimestamp = new Date(Date.now() - 22 * 60 * 1000).toISOString(); // 22 minutes ago

  if (scenario === "empty") {
    return {
      readingTimestamp: baseTimestamp,
      minutesOld: 2,
      isStale: false,
      cacheAge: 14,
      timeContext: {
        dayType: "saturday",
        hour: 15,
        weekdayName: "Saturday",
        period: "afternoon",
        timeLabel: "Saturday afternoon"
      },
      isAllWithinThreshold: true,
      totalWatchedCount: 14,
      evaluatedCount: 14,
      flaggedExceptions: [],
      quietList: [
        {
          id: "1",
          development: "Suntec City",
          area: "Marina",
          lotsAvailable: 290,
          totalLots: 3100,
          actualOccupancyRate: 0.91,
          expectedOccupancyRate: 0.92,
          baselineOccupancyRate: 0.92,
          rainFactor: 1.0,
          nearestAreaName: "City",
          nearestAreaForecast: "Partly Cloudy",
          deviation: -0.01,
          deviationPercent: -1,
          deviationSignedStr: "-1%",
          absDeviation: 0.01,
          plainSentence: "running 1% below its usual Saturday afternoon occupancy",
          isFull: false
        },
        {
          id: "10",
          development: "VivoCity",
          area: "HarbourFront",
          lotsAvailable: 80,
          totalLots: 2100,
          actualOccupancyRate: 0.96,
          expectedOccupancyRate: 0.98,
          baselineOccupancyRate: 0.98,
          rainFactor: 1.0,
          nearestAreaName: "Bukit Merah",
          nearestAreaForecast: "Partly Cloudy",
          deviation: -0.02,
          deviationPercent: -2,
          deviationSignedStr: "-2%",
          absDeviation: 0.02,
          plainSentence: "running 2% below its usual Saturday afternoon occupancy",
          isFull: false
        },
        {
          id: "7",
          development: "ION Orchard",
          area: "Orchard",
          lotsAvailable: 15,
          totalLots: 600,
          actualOccupancyRate: 0.97,
          expectedOccupancyRate: 0.99,
          baselineOccupancyRate: 0.99,
          rainFactor: 1.0,
          nearestAreaName: "Tanglin",
          nearestAreaForecast: "Fair",
          deviation: -0.02,
          deviationPercent: -2,
          deviationSignedStr: "-2%",
          absDeviation: 0.02,
          plainSentence: "running 2% below its usual Saturday afternoon occupancy",
          isFull: false
        }
      ],
      missingSites: [],
      omittedDueToNoBaseline: [],
      weather: {
        degraded: false,
        reason: "",
        unmatchedForecastStrings: []
      },
      lastGoodReadingTimestamp: baseTimestamp
    };
  }

  // Standard flagged scenario (two distinct major anomalies)
  const isStale = scenario === "stale";
  const isWeatherDegraded = scenario === "weather-degraded";

  return {
    readingTimestamp: isStale ? oldTimestamp : baseTimestamp,
    minutesOld: isStale ? 22 : 3,
    isStale,
    cacheAge: isStale ? 1320 : 18,
    timeContext: {
      dayType: "saturday",
      hour: 15,
      weekdayName: "Saturday",
      period: "afternoon",
      timeLabel: "Saturday afternoon"
    },
    isAllWithinThreshold: false,
    totalWatchedCount: 14,
    evaluatedCount: 13,
    flaggedExceptions: [
      {
        id: "10",
        development: "VivoCity",
        area: "HarbourFront",
        lotsAvailable: 714,
        totalLots: 2100,
        actualOccupancyRate: 0.66,
        expectedOccupancyRate: isWeatherDegraded ? 0.98 : 0.91,
        baselineOccupancyRate: 0.98,
        rainFactor: isWeatherDegraded ? 1.0 : 0.93,
        nearestAreaName: "Bukit Merah",
        nearestAreaForecast: isWeatherDegraded ? "Moderate Rain" : "Light Rain",
        deviation: -0.22,
        deviationPercent: -22,
        deviationSignedStr: "-22%",
        absDeviation: 0.22,
        plainSentence: isWeatherDegraded 
          ? "running 22% below its usual Saturday afternoon occupancy"
          : "running 22% below its usual Saturday afternoon occupancy, adjusted for light rain in Bukit Merah",
        isFull: false
      },
      {
        id: "1",
        development: "Suntec City",
        area: "Marina",
        lotsAvailable: 155,
        totalLots: 3100,
        actualOccupancyRate: 0.95,
        expectedOccupancyRate: 0.81,
        baselineOccupancyRate: 0.92,
        rainFactor: isWeatherDegraded ? 1.0 : 0.88,
        nearestAreaName: "City",
        nearestAreaForecast: isWeatherDegraded ? "Thundery Showers" : "Thundery Showers",
        deviation: 0.17,
        deviationPercent: 17,
        deviationSignedStr: "+17%",
        absDeviation: 0.17,
        plainSentence: isWeatherDegraded
          ? "running 17% above its usual Saturday afternoon occupancy"
          : "running 17% above its usual Saturday afternoon occupancy, adjusted for thundery showers in City",
        isFull: false
      }
    ],
    quietList: [
      {
        id: "3",
        development: "Raffles City",
        area: "City",
        lotsAvailable: 180,
        totalLots: 1050,
        actualOccupancyRate: 0.83,
        expectedOccupancyRate: 0.83,
        baselineOccupancyRate: 0.94,
        rainFactor: 0.88,
        nearestAreaName: "City",
        nearestAreaForecast: "Thundery Showers",
        deviation: 0.00,
        deviationPercent: 0,
        deviationSignedStr: "0%",
        absDeviation: 0.00,
        plainSentence: "running 0% below its usual Saturday afternoon occupancy, adjusted for thundery showers in City",
        isFull: false
      },
      {
        id: "7",
        development: "ION Orchard",
        area: "Orchard",
        lotsAvailable: 0,
        totalLots: 600,
        actualOccupancyRate: 1.00,
        expectedOccupancyRate: 0.97,
        baselineOccupancyRate: 0.99,
        rainFactor: 0.98,
        nearestAreaName: "Tanglin",
        nearestAreaForecast: "Cloudy",
        deviation: 0.03,
        deviationPercent: 3,
        deviationSignedStr: "+3%",
        absDeviation: 0.03,
        plainSentence: "running 3% above its usual Saturday afternoon occupancy, adjusted for cloudy in Tanglin",
        isFull: true
      },
      {
        id: "12",
        development: "Jurong Point",
        area: "Jurong West",
        lotsAvailable: 120,
        totalLots: 1420,
        actualOccupancyRate: 0.92,
        expectedOccupancyRate: 0.96,
        baselineOccupancyRate: 0.98,
        rainFactor: 0.98,
        nearestAreaName: "Jurong West",
        nearestAreaForecast: "Overcast",
        deviation: -0.04,
        deviationPercent: -4,
        deviationSignedStr: "-4%",
        absDeviation: 0.04,
        plainSentence: "running 4% below its usual Saturday afternoon occupancy, adjusted for overcast in Jurong West",
        isFull: false
      },
      {
        id: "2",
        development: "Marina Square",
        area: "Marina",
        lotsAvailable: 130,
        totalLots: 1400,
        actualOccupancyRate: 0.91,
        expectedOccupancyRate: 0.88,
        baselineOccupancyRate: 0.88,
        rainFactor: 1.0,
        nearestAreaName: "City",
        nearestAreaForecast: "Partly Cloudy",
        deviation: 0.03,
        deviationPercent: 3,
        deviationSignedStr: "+3%",
        absDeviation: 0.03,
        plainSentence: "running 3% above its usual Saturday afternoon occupancy",
        isFull: false
      }
    ],
    missingSites: [
      {
        id: "14",
        development: "Parkway Parade",
        status: "No reading for this site"
      }
    ],
    omittedDueToNoBaseline: [],
    weather: {
      degraded: isWeatherDegraded,
      reason: isWeatherDegraded ? "Rain adjustment unavailable — deviations are unadjusted." : "",
      unmatchedForecastStrings: []
    },
    lastGoodReadingTimestamp: isStale ? oldTimestamp : baseTimestamp
  };
}
