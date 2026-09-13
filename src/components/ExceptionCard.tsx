import { EvaluatedSite } from "../types";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface ExceptionCardProps {
  key?: string | number;
  site: EvaluatedSite;
  rank: number;
}

export function ExceptionCard({ site, rank }: ExceptionCardProps) {
  const isDeficit = site.deviation < 0;
  const deviationFormatted = site.deviationSignedStr;

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-7 shadow-xs hover:border-stone-300 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              Priority #{rank}
            </span>
            <span className="text-xs text-stone-600">{site.area}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            {site.development}
          </h2>
        </div>

        {/* Large figure in tabular-nums */}
        <div className="text-right">
          <div
            className={`flex items-center justify-end gap-1 font-mono text-5xl font-extrabold tracking-tight tabular-nums ${
              isDeficit ? "text-amber-800" : "text-sky-800"
            }`}
          >
            {isDeficit ? (
              <ArrowDownRight className="w-9 h-9 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="w-9 h-9 stroke-[2.5]" />
            )}
            <span>{deviationFormatted}</span>
          </div>
          <div className="text-xs font-mono text-stone-600 uppercase tracking-wider mt-0.5">
            vs. adjusted baseline
          </div>
        </div>
      </div>

      {/* One plain sentence */}
      <div className="bg-stone-50 border border-stone-200/70 rounded-lg p-4 mb-4">
        <p className="text-stone-800 text-base leading-relaxed font-medium">
          {site.plainSentence}.
        </p>
      </div>

      {/* Raw numbers as small supporting text */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 pt-3 border-t border-stone-100 font-mono">
        <div>
          <span className="font-semibold text-stone-700">
            {site.lotsAvailable.toLocaleString()}
          </span>{" "}
          of {site.totalLots.toLocaleString()} lots available{" "}
          <span className="text-stone-600">
            ({Math.round(site.actualOccupancyRate * 100)}% occupied)
          </span>
        </div>
        <div>
          Normal expected:{" "}
          <span className="text-stone-700 font-medium">
            {Math.round(site.expectedOccupancyRate * 100)}%
          </span>
          {site.rainFactor !== 1.0 && (
            <span className="text-stone-600 ml-1">
              (baseline {Math.round(site.baselineOccupancyRate * 100)}% × rain factor {site.rainFactor})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
