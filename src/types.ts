export interface WatchedSite {
  id: string;
  development: string;
  area: string;
  totalLots: number;
  latitude: number;
  longitude: number;
}

export interface EvaluatedSite {
  id: string;
  development: string;
  area: string;
  lotsAvailable: number;
  totalLots: number;
  actualOccupancyRate: number;
  expectedOccupancyRate: number;
  baselineOccupancyRate: number;
  observedOn?: string;
  rainFactor: number;
  nearestAreaName: string | null;
  nearestAreaForecast: string | null;
  distanceKm?: number;
  deviation: number;
  deviationPercent: number;
  deviationSignedStr: string;
  absDeviation: number;
  plainSentence: string;
  isFull: boolean;
}

export interface MissingSite {
  id: string;
  development: string;
  status: string;
}

export interface CorruptedSite {
  id: string;
  development: string;
  area: string;
  lotsAvailable: number;
  totalLots: number;
  status: string;
}

export interface DeviationsResponse {
  readingTimestamp: string;
  minutesOld: number;
  isStale: boolean;
  cacheAge: number;
  timeContext: {
    dayType: "weekday" | "saturday" | "sunday";
    hour: number;
    weekdayName: string;
    period: string;
    timeLabel: string;
  };
  isAllWithinThreshold: boolean;
  isMiscalibrated?: boolean;
  miscalibrationReason?: string | null;
  over100Count?: number;
  totalWatchedCount: number;
  evaluatedCount: number;
  flaggedExceptions: EvaluatedSite[];
  quietList: EvaluatedSite[];
  missingSites: MissingSite[];
  corruptedSites?: CorruptedSite[];
  omittedDueToNoBaseline: Array<{ id: string; development: string; reason: string }>;
  weather: {
    degraded: boolean;
    reason: string;
    unmatchedForecastStrings: string[];
  };
  lastGoodReadingTimestamp: string | null;
  error?: string;
  isRefused?: boolean;
  isUnreachable?: boolean;
}

export type BoardState = "loading" | "empty" | "flagged" | "stale" | "refused" | "unreachable" | "miscalibrated";
export type NotifyState = "idle" | "submitting" | "sent" | "rejected" | "unreachable";
