import { useState, useMemo } from "react";
import { EvaluatedSite, MissingSite, CorruptedSite } from "../types";
import { Search, X, MapPin, CheckCircle, AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface CarparkSearchProps {
  flaggedSites: EvaluatedSite[];
  quietList: EvaluatedSite[];
  missingSites: MissingSite[];
  corruptedSites?: CorruptedSite[];
  onSelectSite?: (siteId: string) => void;
}

export function CarparkSearch({
  flaggedSites,
  quietList,
  missingSites,
  corruptedSites = [],
  onSelectSite
}: CarparkSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Combine all sites into a unified searchable list
  const allCarparks = useMemo(() => {
    const list: Array<{
      id: string;
      development: string;
      area: string;
      lotsAvailable: number | null;
      totalLots: number;
      occupancyRate: number | null;
      deviationPercent: number | null;
      deviationSignedStr: string | null;
      isFlagged: boolean;
      isFull: boolean;
      isMissing: boolean;
      isCorrupted?: boolean;
      weatherArea?: string | null;
      weatherForecast?: string | null;
      rainFactor?: number;
      plainSentence?: string;
    }> = [];

    // Flagged sites
    flaggedSites.forEach((site) => {
      list.push({
        id: site.id,
        development: site.development,
        area: site.area,
        lotsAvailable: site.lotsAvailable,
        totalLots: site.totalLots,
        occupancyRate: site.actualOccupancyRate,
        deviationPercent: site.deviationPercent,
        deviationSignedStr: site.deviationSignedStr,
        isFlagged: true,
        isFull: site.isFull,
        isMissing: false,
        weatherArea: site.nearestAreaName,
        weatherForecast: site.nearestAreaForecast,
        rainFactor: site.rainFactor,
        plainSentence: site.plainSentence
      });
    });

    // Quiet list sites
    quietList.forEach((site) => {
      list.push({
        id: site.id,
        development: site.development,
        area: site.area,
        lotsAvailable: site.lotsAvailable,
        totalLots: site.totalLots,
        occupancyRate: site.actualOccupancyRate,
        deviationPercent: site.deviationPercent,
        deviationSignedStr: site.deviationSignedStr,
        isFlagged: false,
        isFull: site.isFull,
        isMissing: false,
        weatherArea: site.nearestAreaName,
        weatherForecast: site.nearestAreaForecast,
        rainFactor: site.rainFactor,
        plainSentence: site.plainSentence
      });
    });

    // Corrupted sites: available > total
    corruptedSites.forEach((site) => {
      list.push({
        id: site.id,
        development: site.development,
        area: site.area,
        lotsAvailable: site.lotsAvailable,
        totalLots: site.totalLots,
        occupancyRate: null,
        deviationPercent: null,
        deviationSignedStr: null,
        isFlagged: false,
        isFull: false,
        isMissing: false,
        isCorrupted: true,
        plainSentence: "Reading looks wrong for this site"
      });
    });

    // Missing sites
    missingSites.forEach((site) => {
      list.push({
        id: site.id,
        development: site.development,
        area: "Monitored Zone",
        lotsAvailable: null,
        totalLots: 0,
        occupancyRate: null,
        deviationPercent: null,
        deviationSignedStr: null,
        isFlagged: false,
        isFull: false,
        isMissing: true,
        plainSentence: "Feed absent — no reading for this site"
      });
    });

    return list;
  }, [flaggedSites, quietList, missingSites, corruptedSites]);

  // Filtered results based on search query and filter chips
  const filteredCarparks = useMemo(() => {
    let result = allCarparks;

    // Apply quick filter chip
    if (selectedFilter === "flagged") {
      result = result.filter((s) => s.isFlagged);
    } else if (selectedFilter === "full") {
      result = result.filter((s) => s.isFull || (s.lotsAvailable !== null && s.lotsAvailable < 20));
    } else if (selectedFilter === "available") {
      result = result.filter((s) => s.lotsAvailable !== null && s.lotsAvailable >= 100);
    } else if (selectedFilter !== "all") {
      result = result.filter((s) => s.area.toLowerCase().includes(selectedFilter.toLowerCase()));
    }

    // Apply text search
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return result;

    return result.filter((site) => {
      return (
        site.development.toLowerCase().includes(cleanQuery) ||
        site.area.toLowerCase().includes(cleanQuery) ||
        site.id.toLowerCase() === cleanQuery ||
        (site.weatherArea && site.weatherArea.toLowerCase().includes(cleanQuery)) ||
        (site.weatherForecast && site.weatherForecast.toLowerCase().includes(cleanQuery))
      );
    });
  }, [allCarparks, query, selectedFilter]);

  const filterChips = [
    { id: "all", label: "All Near Campus" },
    { id: "flagged", label: "Flagged Exceptions" },
    { id: "City", label: "City / Bras Basah" },
    { id: "Marina", label: "Marina" },
    { id: "Orchard", label: "Orchard / Somerset" },
    { id: "available", label: "Available > 100 Lots" },
    { id: "full", label: "Full / Near Full" }
  ];

  const totalWatched = allCarparks.length;
  const excludedCount = (corruptedSites?.length || 0) + (missingSites?.length || 0);
  const baselinesCount = allCarparks.filter(s => !s.isCorrupted && !s.isMissing).length;

  return (
    <section className="mb-8 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col gap-3">
        {/* Title and quick stats */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold tracking-tight text-stone-900">
              8 sites near campus
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-mono">
            {filteredCarparks.length} {filteredCarparks.length === 1 ? "site" : "sites"} near campus
          </div>
        </div>

        {/* Search input field */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search carparks near campus (e.g. Suntec, Raffles City, Marina Square, Somerset)..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all shadow-2xs"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-0.5"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 shrink-0 mr-1 font-mono text-[11px]">Filter:</span>
          {filterChips.map((chip) => {
            const isActive = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedFilter(chip.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer text-xs font-medium ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Coverage line beneath the filters */}
        <div className="pt-2 border-t border-stone-100 text-xs font-mono text-stone-500">
          {totalWatched} watched · {baselinesCount} with baselines · {excludedCount} excluded
        </div>

        {/* Search Results Display */}
        {(query.trim() !== "" || selectedFilter !== "all") && (
          <div className="mt-2 pt-3 border-t border-stone-100">
            {filteredCarparks.length === 0 ? (
              <div className="py-8 text-center bg-stone-50/50 rounded-lg border border-dashed border-stone-200">
                <p className="text-sm text-stone-600 font-medium mb-1">
                  No carparks matching &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-stone-400">
                  Try searching for sites near campus (e.g. Suntec, Raffles City, Marina Square, Orchard Central).
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedFilter("all");
                  }}
                  className="mt-3 text-xs text-stone-700 underline font-semibold cursor-pointer hover:text-stone-950"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCarparks.map((site) => {
                  const isDeficit = site.deviationPercent !== null && site.deviationPercent < 0;
                  const isSurplus = site.deviationPercent !== null && site.deviationPercent > 0;

                  return (
                    <div
                      key={site.id}
                      onClick={() => onSelectSite && onSelectSite(site.id)}
                      className="bg-stone-50/60 hover:bg-stone-100/70 border border-stone-200 rounded-lg p-3.5 transition-colors cursor-pointer flex flex-col justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-mono text-[11px] font-semibold text-stone-500 bg-white px-1.5 py-0.2 border border-stone-200 rounded">
                              #{site.id}
                            </span>
                            <span className="text-stone-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              {site.area}
                            </span>
                            {site.weatherForecast && (
                              <span className="text-stone-500 text-[11px]">
                                · {site.weatherForecast}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                            {site.development}
                          </h3>
                        </div>

                        {/* Status / Deviation Badge */}
                        <div>
                          {site.isCorrupted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] font-semibold">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Reading looks wrong for this site
                            </span>
                          ) : site.isMissing ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px] font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              Feed Absent
                            </span>
                          ) : site.isFull ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-100 border border-rose-200 text-rose-800 font-mono text-[11px] font-bold">
                              FULL (0 lots)
                            </span>
                          ) : site.isFlagged ? (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                                isDeficit
                                  ? "bg-amber-100 border border-amber-300 text-amber-900"
                                  : "bg-sky-100 border border-sky-300 text-sky-900"
                              }`}
                            >
                              {isDeficit ? (
                                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                              )}
                              Exception: {site.deviationSignedStr}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px] font-medium">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Normal ({site.deviationSignedStr || "±0%"})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lot availability counts & progress meter */}
                      {!site.isMissing && !site.isCorrupted && site.lotsAvailable !== null && (
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-stone-600">
                            <span>
                              <strong className="text-stone-900 font-bold">
                                {site.lotsAvailable.toLocaleString()}
                              </strong>{" "}
                              lots available
                            </span>
                            <span>{site.totalLots.toLocaleString()} total capacity</span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                site.isFull
                                  ? "bg-rose-600"
                                  : (site.occupancyRate || 0) > 0.9
                                  ? "bg-amber-600"
                                  : "bg-emerald-600"
                              }`}
                              style={{
                                width: `${Math.round((site.occupancyRate || 0) * 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Sentence note */}
                      {site.plainSentence && (
                        <p className="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1">
                          {site.plainSentence}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
