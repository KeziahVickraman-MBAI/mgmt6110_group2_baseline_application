import { useState } from "react";
import { Info, ChevronDown, ChevronUp, Users, Eye, ArrowRightCircle, History } from "lucide-react";

export function UserStatementBanner() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section
      id="product-user-statement-banner"
      aria-label="Product and User Statement"
      className="mb-6 rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden transition-all"
    >
      {/* Clickable Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-stone-100/70 border-b border-stone-200/80">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="user-statement-content"
          className="flex-1 flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-stone-800 text-amber-300 font-bold text-xs">
              <Info className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                  Product &amp; User Statement
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Class Overview
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                The operational oversight framework: Who opens this, what they see, and what action they take.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 group-hover:text-stone-900 pl-4">
            <span className="hidden sm:inline">{isOpen ? "Collapse brief" : "Expand brief"}</span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-500 group-hover:text-stone-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500 group-hover:text-stone-800" />
            )}
          </div>
        </button>
      </div>

      {/* Collapsible Content Body */}
      {isOpen && (
        <div id="user-statement-content" className="p-5 sm:p-6 space-y-4 bg-white">
          {/* Main 3-Step User Statement Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: User opens this app */}
            <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold font-mono">
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-600" />
                    User Opens App
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-950 mb-1">
                  Multi-site Facilities Manager
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Opens this board at shift start and on the hourly check, covering a portfolio of properties they cannot physically see — a REIT operations team, a school cluster, a healthcare group&apos;s sites.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                Context: Multi-site portfolio oversight
              </div>
            </div>

            {/* Step 2: Sees something */}
            <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold font-mono">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-stone-600" />
                    Sees Something
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-950 mb-1">
                  Directional Baseline Exceptions
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Which site is running abnormally <strong className="text-amber-900">above</strong> its own normal pattern for this hour, and which is running <strong className="text-sky-900">below</strong>, with the net cars affected rather than a percentage.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                Metric: Net cars vs. rain-adjusted baseline
              </div>
            </div>

            {/* Step 3: Hence does something */}
            <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
                    3
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                    <ArrowRightCircle className="w-3.5 h-3.5 text-stone-600" />
                    Hence Does Something
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-950 mb-1">
                  Calls the Site Before It Becomes a Complaint
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Off-pattern usually means something else is wrong — an unflagged event, a barrier fault, a road closure, a tenant issue. The action is a phone call to find out which, not a dispatch.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                Action: Verify within the hour
              </div>
            </div>
          </div>

          {/* New Fourth Beat: What this replaces (Single full-width row) */}
          <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-bold font-mono">
                  4
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-stone-600" />
                  What This Replaces
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-950 mb-1">
                Nothing, Currently
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Today nothing tells a multi-site manager that a property is off-pattern. They find out when somebody complains — a tenant, a driver, a security lead. The board does not replace an existing tool; it fills a gap where the current detection method is a phone call from someone annoyed.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
              Gap: Detection is currently reactive
            </div>
          </div>

          {/* Core Synthesis Band */}
          <div className="rounded-lg bg-stone-900 text-stone-100 p-4 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm leading-relaxed text-stone-200">
              <span className="font-bold text-amber-400 font-mono uppercase text-xs mr-2">
                Core Synthesis:
              </span>
              &ldquo;The facilities manager opens this board and sees which site in the portfolio is behaving unlike itself, by how many cars, and how recently the count was taken — then calls that site to find out why, before anyone else notices.&rdquo;
            </div>
            <span className="text-[11px] font-mono text-stone-400 bg-stone-800 px-2.5 py-1 rounded border border-stone-700 shrink-0 self-start sm:self-auto">
              Decision Rule: 10% off own baseline
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
