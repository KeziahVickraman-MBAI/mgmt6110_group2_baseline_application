import { ShieldCheck, ShieldAlert, WifiOff } from "lucide-react";

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = "Reading the last hour of counts…" }: LoadingViewProps) {
  return (
    <div className="py-20 text-center">
      <div className="inline-block w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin mb-4" />
      <p className="text-stone-700 text-lg font-medium tracking-tight">
        {message}
      </p>
    </div>
  );
}

interface EmptyViewProps {
  totalWatched: number;
}

/**
 * Empty state: "Nothing is off baseline right now."
 * THIS IS GOOD NEWS AND THE SCREEN MUST READ AS SUCH.
 * Do not style it as an error, do not grey the page out, do not show an empty-box illustration.
 * Second line: "All [N] watched sites are within 10% of their usual level for this hour."
 */
export function EmptyView({ totalWatched }: EmptyViewProps) {
  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-8 my-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-emerald-100/80 rounded-lg text-emerald-800 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-950 tracking-tight mb-1">
            Nothing is off baseline right now.
          </h2>
          <p className="text-emerald-800 text-base leading-relaxed">
            All {totalWatched} watched sites are within 10% of their usual level for this hour.
          </p>
        </div>
      </div>
    </div>
  );
}

interface RefusedViewProps {
  onRetry?: () => void;
}

export function RefusedView({ onRetry }: RefusedViewProps) {
  return (
    <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-8 my-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-rose-100 text-rose-800 rounded-lg shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-rose-950 tracking-tight mb-2">
            The transport feed rejected our credential. Nothing on this screen is current.
          </h2>
          <p className="text-rose-800 text-sm leading-relaxed mb-4">
            LTA DataMall rejected the AccountKey configured in the environment. Verify that <code className="font-mono bg-rose-100/80 px-1 py-0.5 rounded text-rose-900">LTA_ACCOUNT_KEY</code> is added in Vercel settings and redeploy.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-900 bg-white border border-rose-300 rounded hover:bg-rose-100/50 cursor-pointer shadow-xs transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface UnreachableViewProps {
  lastGoodReadingTime: string | null;
  onRetry?: () => void;
}

export function UnreachableView({ lastGoodReadingTime, onRetry }: UnreachableViewProps) {
  const formattedLastGood = lastGoodReadingTime
    ? new Date(lastGoodReadingTime).toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }) + " SGT"
    : "earlier today";

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-xl p-8 my-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-stone-200 text-stone-700 rounded-lg shrink-0">
          <WifiOff className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
            Can't reach the transport feed. Last good reading was {formattedLastGood}.
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            The Land Transport Authority DataMall endpoint is currently unresponsive or network connectivity is interrupted. The board will continue trying automatically.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer shadow-xs transition-colors"
            >
              Retry Transport Feed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
