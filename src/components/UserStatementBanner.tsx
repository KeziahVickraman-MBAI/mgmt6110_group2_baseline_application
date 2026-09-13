import { useState } from "react";
import { Info, ChevronDown, ChevronUp, Users, Eye, ArrowRightCircle, History, BellRing } from "lucide-react";

export function UserStatementBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const [productView, setProductView] = useState<"consumer" | "industry">("consumer");

  return (
    <section
      id="panel-publish"
      aria-label="Application Panel - Product and User Statement"
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
                  Application Panel
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {productView === "consumer" ? "Consumer Product" : "Industry Product"}
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                The same live feed, two users, two entirely different products.
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
        <div id="user-statement-content" className="p-5 sm:p-6 space-y-5 bg-white">
          {/* Top of Panel: Explanatory line & Two-Option Single-Select Toggle */}
          <div className="border-b border-stone-200/80 pb-4">
            <p className="text-xs text-stone-600 font-medium mb-2.5">
              The same live feed, two users, two entirely different products. Switch between them.
            </p>
            <div
              className="inline-flex rounded-lg bg-stone-100 p-1 border border-stone-300 gap-1"
              role="group"
              aria-label="Product view switcher"
            >
              <button
                type="button"
                className={`toggle-btn px-3 py-1 text-xs font-bold rounded-md transition-none cursor-pointer ${
                  productView === "consumer"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                aria-pressed={productView === "consumer"}
                onClick={() => setProductView("consumer")}
              >
                Consumer
              </button>
              <button
                type="button"
                className={`toggle-btn px-3 py-1 text-xs font-bold rounded-md transition-none cursor-pointer ${
                  productView === "industry"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                aria-pressed={productView === "industry"}
                onClick={() => setProductView("industry")}
              >
                Industry
              </button>
            </div>
          </div>

          {/* VIEW C: CONSUMER VIEW (Default) */}
          {productView === "consumer" && (
            <div id="consumer-view-content" className="space-y-4">
              {/* 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold font-mono">
                        1
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-600" />
                        USER OPENS APP
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-950 mb-1">
                      SMU student who drives in
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Opens it once, to subscribe. Then never opens it again — the product reaches them, not the other way round.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                    Context: One campus, one morning
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold font-mono">
                        2
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <BellRing className="w-3.5 h-3.5 text-amber-700" />
                        SEES SOMETHING
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-950 mb-1">
                      A warning, not a board
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      &ldquo;Bras Basah is filling faster than usual for a Tuesday. It normally has 40 free at 8:40; right now it has 12.&rdquo; Sent before they leave, not shown when they arrive.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                    Metric: Their site, their usual arrival time
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
                        3
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <ArrowRightCircle className="w-3.5 h-3.5 text-stone-600" />
                        HENCE DOES SOMETHING
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-950 mb-1">
                      Leaves ten minutes earlier
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Or takes the train. The decision costs nothing and is made at home, which is the only moment it can still be acted on.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                    Action: Before leaving, not on arrival
                  </div>
                </div>
              </div>

              {/* Fourth Beat */}
              <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-bold font-mono">
                      4
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-stone-600" />
                      WHAT THIS REPLACES
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-950 mb-1">
                    Finding out on arrival
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Existing apps show what a carpark looks like right now. That is the one moment the information is useless — the driver is already there. The gap is not live data, it is a warning early enough to change the plan.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
                  Gap: Timing, not availability
                </div>
              </div>

              {/* Core Synthesis Band */}
              <div className="rounded-lg bg-stone-900 text-stone-100 p-4 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm leading-relaxed text-stone-200">
                  <span className="font-bold text-amber-400 font-mono uppercase text-xs mr-2">
                    Core Synthesis:
                  </span>
                  &ldquo;The student subscribes once to a threshold at one carpark at one time of day, and the board contacts them on the mornings it matters. They never see a ranking, a deviation or a map.&rdquo;
                </div>
                <span className="text-[11px] font-mono text-stone-400 bg-stone-800 px-2.5 py-1 rounded border border-stone-700 shrink-0 self-start sm:self-auto">
                  Decision Rule: Their site, their time, their threshold
                </span>
              </div>
            </div>
          )}

          {/* VIEW B: INDUSTRY VIEW (Unchanged original copy) */}
          {productView === "industry" && (
            <div id="industry-view-content" className="space-y-4">
              {/* Main 3-Step User Statement Sequence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: User opens this app */}
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold font-mono">
                        1
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-600" />
                        USER OPENS APP
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
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold font-mono">
                        2
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        SEES SOMETHING
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
                <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
                        3
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                        <ArrowRightCircle className="w-3.5 h-3.5 text-stone-600" />
                        HENCE DOES SOMETHING
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
              <div className="rule-card rounded-lg border border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-bold font-mono">
                      4
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-stone-600" />
                      WHAT THIS REPLACES
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

          {/* D. Comparison Table (Shown in BOTH views) */}
          <div className="mt-6 border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 font-mono text-stone-600 uppercase text-[11px]">
                  <th className="py-2.5 px-3 sm:px-4 font-semibold">Dimension</th>
                  <th className="py-2.5 px-3 sm:px-4 font-semibold text-stone-800">Consumer</th>
                  <th className="py-2.5 px-3 sm:px-4 font-semibold text-stone-800">Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 bg-white">
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-700">Opens it</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Once, to subscribe</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Hourly, across a portfolio</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-700">Wants</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">A warning before 8am</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Which site is off-pattern</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-700">Acts by</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Leaving earlier</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Calling the site</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-700">Unit of decision</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">Their own morning</td>
                  <td className="py-2.5 px-3 sm:px-4 text-stone-600">One site in a portfolio</td>
                </tr>
                {/* Last row: Visually emphasised */}
                <tr className="bg-amber-50/80 border-t-2 border-amber-300 font-semibold text-amber-950">
                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-amber-900">Who reviews it</td>
                  <td className="py-3 px-3 sm:px-4 font-bold text-amber-900">Nobody</td>
                  <td className="py-3 px-3 sm:px-4 font-bold text-amber-900">A named facilities lead</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* E. One paragraph beneath the table (Shown in BOTH views) */}
          <div className="p-3.5 rounded-lg bg-stone-50 border-l-3 border-stone-800 text-xs text-stone-700 leading-relaxed">
            The same functions serve both. What changes is not the data but the unit of decision — and with it, the oversight. Nobody reviews a student&apos;s choice to leave ten minutes early, which is why a consumer product can run on a feed whose availability we cannot guarantee. A portfolio manager acting on the same number is making a decision somebody else will later ask about, which is why the industry version needs the freshness line, the corrupted-reading quarantine and the health endpoint, and the consumer version arguably does not.
          </div>
        </div>
      )}
    </section>
  );
}

