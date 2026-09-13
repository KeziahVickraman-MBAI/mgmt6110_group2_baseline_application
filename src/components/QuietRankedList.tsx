import { EvaluatedSite, MissingSite } from "../types";

interface QuietRankedListProps {
  quietList: EvaluatedSite[];
  missingSites: MissingSite[];
  omittedSites?: Array<{ id: string; development: string; reason: string }>;
}

export function QuietRankedList({ quietList, missingSites, omittedSites }: QuietRankedListProps) {
  const hasItems = quietList.length > 0 || missingSites.length > 0 || (omittedSites && omittedSites.length > 0);

  if (!hasItems) return null;

  return (
    <section className="mt-8 pt-6 border-t border-stone-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          Other Watched Sites (Within Normal Range or Unflagged)
        </h3>
        <span className="text-xs text-stone-600 font-mono">
          {quietList.length} reported · {missingSites.length} missing
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200/80 bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/75 text-stone-600 font-mono">
              <th className="py-2.5 px-3.5 font-medium">Development</th>
              <th className="py-2.5 px-3 font-medium">Area & Weather</th>
              <th className="py-2.5 px-3 font-medium text-right">Available Lots</th>
              <th className="py-2.5 px-3 font-medium text-right">Actual Occ.</th>
              <th className="py-2.5 px-3 font-medium text-right">Expected Occ.</th>
              <th className="py-2.5 px-3.5 font-medium text-right">Deviation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {quietList.map((site) => {
              const isDeficit = site.deviation < 0;
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
                      <span className="text-stone-600 text-[11px] block">
                        near {site.nearestAreaName} ({site.nearestAreaForecast || "Fair"})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {site.isFull ? (
                      <span className="inline-flex items-center text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                        FULL (0 lots available)
                      </span>
                    ) : (
                      <span>
                        {site.lotsAvailable.toLocaleString()} / {site.totalLots.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {Math.round(site.actualOccupancyRate * 100)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                    {Math.round(site.expectedOccupancyRate * 100)}%
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-semibold">
                    <span className={isDeficit ? "text-amber-800" : "text-sky-800"}>
                      {site.deviationSignedStr}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Missing sites: never report 0 lots, explicitly report "No reading for this site" */}
            {missingSites.map((missing) => (
              <tr key={missing.id} className="bg-stone-50/40 text-stone-600">
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
              <tr key={omitted.id} className="bg-stone-50/30 text-stone-600">
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
    </section>
  );
}
