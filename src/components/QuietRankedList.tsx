import { useState } from "react";
import { EvaluatedSite, MissingSite, CorruptedSite } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface QuietRankedListProps {
  quietList: EvaluatedSite[];
  missingSites: MissingSite[];
  corruptedSites?: CorruptedSite[];
  omittedSites?: Array<{ id: string; development: string; reason: string }>;
  defaultExpanded?: boolean;
}

export function QuietRankedList({
  quietList,
  missingSites,
  corruptedSites = [],
  omittedSites,
  defaultExpanded = false
}: QuietRankedListProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const totalCount = quietList.length + missingSites.length + corruptedSites.length + (omittedSites?.length || 0);
  const hasItems = totalCount > 0;

  if (!hasItems) return null;

  return (
    <section
      id="quiet-sites-section"
      className="mt-8 pt-6 border-t border-stone-200"
    >
      <div className="rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="quiet-sites-table-container"
          className="w-full px-4 py-3.5 flex items-center justify-between bg-stone-50/75 hover:bg-stone-100/80 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Other Watched Sites (Within Normal Range or Unflagged)
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 font-mono">
              {quietList.length} normal · {missingSites.length} missing{corruptedSites.length > 0 ? ` · ${corruptedSites.length} corrupted` : ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 group-hover:text-stone-900">
            <span>{isExpanded ? "Hide sites" : `Show ${totalCount} sites`}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-500 group-hover:text-stone-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500 group-hover:text-stone-800" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div id="quiet-sites-table-container" className="overflow-x-auto border-t border-stone-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-600 font-mono">
                  <th className="py-2.5 px-3.5 font-medium">Development</th>
                  <th className="py-2.5 px-3 font-medium">Area &amp; Weather</th>
                  <th className="py-2.5 px-3 font-medium text-right">Available Lots</th>
                  <th className="py-2.5 px-3 font-medium text-right">Occ / Expected</th>
                  <th className="py-2.5 px-3 font-medium text-right">Lots Affected</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
            {quietList.map((site) => {
              const isDeficit = site.deviation < 0;
              const carsDiff = site.carsDiff ?? (
                (site.totalLots - site.lotsAvailable) - Math.round(site.expectedOccupancyRate * site.totalLots)
              );
              const carsAffectedText = carsDiff > 0 
                ? `+${carsDiff.toLocaleString()} cars` 
                : carsDiff < 0 
                  ? `${carsDiff.toLocaleString()} cars` 
                  : "0 cars";

              return (
                <tr
                  key={site.id}
                  id={`carpark-site-${site.id}`}
                  className="hover:bg-stone-50/60 transition-colors"
                >
                  <td className="py-2.5 px-3.5 font-medium text-stone-900">
                    {site.development}
                  </td>
                  <td className="py-2.5 px-3 text-stone-600">
                    <span>{site.area}</span>
                    {site.nearestAreaName && (
                      <span className="text-stone-500 text-[11px] block">
                        near {site.nearestAreaName} {site.distanceKm ? `(${site.distanceKm}km)` : ""} · {site.nearestAreaForecast || "Fair"}
                        {site.rainFactor && site.rainFactor < 1.0 ? (
                          <span className="text-sky-700 font-semibold"> ({site.rainFactor}× rain discount)</span>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {site.isFull ? (
                      <span className="inline-flex items-center text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                        FULL (0 lots)
                      </span>
                    ) : (
                      <span>
                        {site.lotsAvailable.toLocaleString()} / {site.totalLots.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className="font-medium text-stone-800">{Math.round(site.actualOccupancyRate * 100)}%</span>
                    <span className="text-stone-400 text-[11px] ml-1">/ {Math.round(site.expectedOccupancyRate * 100)}%</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    <span className={carsDiff > 0 ? "text-amber-800" : carsDiff < 0 ? "text-sky-800" : "text-stone-500"}>
                      {carsAffectedText}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-semibold">
                    <span className={isDeficit ? "text-sky-800" : "text-amber-800"}>
                      {site.deviationSignedStr}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Corrupted sites: available > total, excluded from ranking */}
            {corruptedSites.map((corrupted) => (
              <tr key={corrupted.id} id={`carpark-site-${corrupted.id}`} className="bg-amber-50/50 text-stone-700">
                <td className="py-2.5 px-3.5 font-medium text-stone-900">
                  {corrupted.development}
                </td>
                <td className="py-2.5 px-3 text-stone-600">
                  {corrupted.area}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-900 font-semibold">
                  {corrupted.lotsAvailable.toLocaleString()} / {corrupted.totalLots.toLocaleString()}
                </td>
                <td colSpan={3} className="py-2.5 px-3.5 text-right font-mono text-rose-700 font-medium italic">
                  Reading looks wrong for this site
                </td>
              </tr>
            ))}

            {/* Missing sites: never report 0 lots, explicitly report "No reading for this site" */}
            {missingSites.map((missing) => (
              <tr key={missing.id} id={`carpark-site-${missing.id}`} className="bg-stone-50/40 text-stone-600">
                <td className="py-2.5 px-3.5 font-medium text-stone-600">
                  {missing.development}
                </td>
                <td className="py-2.5 px-3 text-stone-600 italic">Feed absent</td>
                <td colSpan={4} className="py-2.5 px-3.5 text-right font-mono text-amber-800/90 italic">
                  No reading for this site
                </td>
              </tr>
            ))}

            {/* Omitted due to no baseline */}
            {omittedSites && omittedSites.map((omitted) => (
              <tr key={omitted.id} id={`carpark-site-${omitted.id}`} className="bg-stone-50/30 text-stone-600">
                <td className="py-2 px-3.5 font-medium text-stone-600">
                  {omitted.development}
                </td>
                <td colSpan={5} className="py-2 px-3.5 text-right font-mono text-stone-600 italic">
                  Omitted: {omitted.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>
  );
}
