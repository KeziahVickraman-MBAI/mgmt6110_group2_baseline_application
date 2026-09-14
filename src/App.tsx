import { useEffect, useState, useCallback } from "react";
import { DeviationsResponse, BoardState } from "./types";
import { getScenarioData } from "./demoData";
import { FreshnessHeader } from "./components/FreshnessHeader";
import { ExceptionCard } from "./components/ExceptionCard";
import { FlaggedDistanceBanner } from "./components/FlaggedDistanceBanner";
import { QuietRankedList } from "./components/QuietRankedList";
import { LoadingView, EmptyView, RefusedView, UnreachableView, MiscalibratedView } from "./components/StateViews";
import { NotifyForm } from "./components/NotifyForm";
import { CarparkSearch } from "./components/CarparkSearch";
import { UserStatementBanner } from "./components/UserStatementBanner";
import { Footer } from "./components/Footer";
import { Radio, Layers, Compass, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";

export default function App() {
  const [feedMode, setFeedMode] = useState<"live" | "simulated">("live");
  const [scenario, setScenario] = useState<"flagged" | "rain-adjusted" | "empty" | "stale" | "weather-degraded" | "miscalibrated" | "refused" | "unreachable">("flagged");
  const [data, setData] = useState<DeviationsResponse | null>(null);
  const [boardState, setBoardState] = useState<BoardState>("loading");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastGoodReadingTime, setLastGoodReadingTime] = useState<string | null>(null);

  const loadData = useCallback(async (isManualRefresh = false) => {
    setIsRefreshing(true);

    if (feedMode === "simulated") {
      // Handle simulated scenarios for duty supervisor review
      setTimeout(() => {
        if (scenario === "refused") {
          setBoardState("refused");
          setData(null);
        } else if (scenario === "unreachable") {
          setBoardState("unreachable");
          setData(null);
        } else {
          const simData = getScenarioData(scenario);
          setData(simData);
          setLastGoodReadingTime(simData.lastGoodReadingTimestamp);
          if (simData.isMiscalibrated) {
            setBoardState("miscalibrated");
          } else if (simData.isAllWithinThreshold) {
            setBoardState("empty");
          } else {
            setBoardState("flagged");
          }
        }
        setIsRefreshing(false);
      }, isManualRefresh ? 300 : 0);
      return;
    }

    // Live API mode
    try {
      const res = await fetch("/api/deviations");
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || json.isRefused) {
          setBoardState("refused");
        } else if (res.status === 503 && json.error && json.error.includes("LTA_ACCOUNT_KEY")) {
          // LTA_ACCOUNT_KEY is not set in environment
          setBoardState("refused");
        } else {
          setBoardState("unreachable");
          if (json.lastGoodReadingTimestamp) {
            setLastGoodReadingTime(json.lastGoodReadingTimestamp);
          }
        }
        setData(null);
        setIsRefreshing(false);
        return;
      }

      setData(json);
      if (json.lastGoodReadingTimestamp) {
        setLastGoodReadingTime(json.lastGoodReadingTimestamp);
      }

      // Sanity check before render:
      // If more than half the watched sites deviate by > 100%, baselines are miscalibrated
      if (json.isMiscalibrated) {
        setBoardState("miscalibrated");
      } else if (json.isAllWithinThreshold) {
        setBoardState("empty");
      } else {
        setBoardState("flagged");
      }
    } catch (netErr) {
      setBoardState("unreachable");
      setData(null);
    } finally {
      setIsRefreshing(false);
    }
  }, [feedMode, scenario]);

  useEffect(() => {
    loadData();

    // Cache TTL is 60 seconds, refresh interval on screen must match
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, [loadData]);

  const flaggedSites = data ? data.flaggedExceptions : [];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-stone-200">
      {/* Supervisor Control & Scenario Toolbar */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-2 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              FEED SOURCE:
            </span>
            <div className="inline-flex rounded bg-stone-800 p-0.5 border border-stone-700">
              <button
                onClick={() => {
                  setFeedMode("live");
                  setBoardState("loading");
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  feedMode === "live"
                    ? "bg-emerald-700 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Live API (LTA + data.gov.sg)
              </button>
              <button
                onClick={() => {
                  setFeedMode("simulated");
                  setBoardState("loading");
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  feedMode === "simulated"
                    ? "bg-stone-700 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                State Scenarios
              </button>
            </div>
          </div>

          {feedMode === "simulated" && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-stone-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                State:
              </span>
              {(["flagged", "rain-adjusted", "empty", "stale", "weather-degraded", "miscalibrated", "refused", "unreachable"] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => {
                    setScenario(sc);
                    setBoardState("loading");
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    scenario === sc
                      ? "bg-amber-400 text-stone-950 font-bold"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Freshness Top Line Header */}
      <FreshnessHeader
        readingTimestamp={data ? data.readingTimestamp : null}
        cacheAge={data ? data.cacheAge : 0}
        minutesOld={data ? data.minutesOld : 0}
        isStale={data ? data.isStale : false}
        weatherDegraded={data ? data.weather.degraded : false}
        weatherReason={data ? data.weather.reason : ""}
        unmatchedStrings={data ? data.weather.unmatchedForecastStrings : []}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(true)}
        feedMode={feedMode}
      />

      {/* Main Single-Screen Exception Board */}
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">
        {/* Class Overview: Collapsible Product & User Statement Segment */}
        <UserStatementBanner />

        {/* Carpark Search Bar: Available across all modes */}
        <CarparkSearch
          flaggedSites={data ? data.flaggedExceptions : getScenarioData("flagged").flaggedExceptions}
          quietList={data ? data.quietList : getScenarioData("flagged").quietList}
          missingSites={data ? data.missingSites : getScenarioData("flagged").missingSites}
          corruptedSites={data ? data.corruptedSites : []}
          onSelectSite={(id) => {
            const el = document.getElementById(`carpark-site-${id}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
        />

        {/* Loading State Sentence */}
        {boardState === "loading" && <LoadingView />}

        {/* Refused State Sentence */}
        {boardState === "refused" && <RefusedView onRetry={() => loadData(true)} />}

        {/* Unreachable State Sentence */}
        {boardState === "unreachable" && (
          <UnreachableView
            lastGoodReadingTime={lastGoodReadingTime}
            onRetry={() => loadData(true)}
          />
        )}

        {/* Baselines Miscalibrated Sanity Check State */}
        {boardState === "miscalibrated" && data && (
          <>
            <MiscalibratedView
              over100Count={data.over100Count || 0}
              evaluatedCount={data.evaluatedCount}
              timeLabel={data.timeContext?.timeLabel || "this hour"}
              onRetry={() => loadData(true)}
            />
            <QuietRankedList
              quietList={data.quietList}
              missingSites={data.missingSites}
              corruptedSites={data.corruptedSites}
              omittedSites={data.omittedDueToNoBaseline}
            />
          </>
        )}

        {/* Empty State Sentence (Good News) */}
        {boardState === "empty" && data && (
          <>
            <EmptyView totalWatched={data.totalWatchedCount} />
            <QuietRankedList
              quietList={data.quietList}
              missingSites={data.missingSites}
              corruptedSites={data.corruptedSites}
              omittedSites={data.omittedDueToNoBaseline}
            />
          </>
        )}

        {/* Flagged Exceptions State (Reframed for Duty Dispatcher) */}
        {boardState === "flagged" && data && (
          <>
            {/* E. One decision line above everything */}
            <div
              id="campus-status-decision-line"
              className="mb-6 bg-stone-900 text-stone-100 rounded-xl p-6 border border-stone-800 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-mono tracking-wider uppercase">
                  Morning Arrival
                </span>
                <span className="text-xs text-stone-400 font-mono">Next 60 Minutes • Campus Proximity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
                {data.decisionHeadline || "Sites near campus behaving normally."}
              </h1>
              {data.decisionSubtext && (
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
                  {data.decisionSubtext}
                </p>
              )}
            </div>

            {/* A. Two columns split by direction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Column 1: Needs attention (furthest ABOVE baseline) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>
                    <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                      Filling Faster Than Usual
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Above normal baseline
                  </span>
                </div>

                {data.topAbove ? (
                  <ExceptionCard site={data.topAbove} columnType="needs-attention" />
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center flex-1 flex flex-col justify-center items-center">
                    <CheckCircle2 className="w-8 h-8 text-stone-400 mb-2" />
                    <p className="text-stone-700 font-medium text-sm">No unusual demand</p>
                    <p className="text-stone-500 text-xs mt-1">
                      No carparks running significantly above normal baseline.
                    </p>
                  </div>
                )}
              </div>

              {/* Column 2: Has capacity (furthest BELOW baseline) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100"></span>
                    <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                      More Space Than Usual
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Below normal baseline
                  </span>
                </div>

                {data.topBelow ? (
                  <ExceptionCard site={data.topBelow} columnType="has-capacity" />
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center flex-1 flex flex-col justify-center items-center">
                    <UserCheck className="w-8 h-8 text-stone-400 mb-2" />
                    <p className="text-stone-700 font-medium text-sm">Normal occupancy</p>
                    <p className="text-stone-500 text-xs mt-1">
                      All sites are operating at or near normal baseline.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quiet Ranked List Beneath */}
            <QuietRankedList
              quietList={data.quietList}
              missingSites={data.missingSites}
              corruptedSites={data.corruptedSites}
              omittedSites={data.omittedDueToNoBaseline}
            />
          </>
        )}

        {/* Notify Form Below the Board */}
        <NotifyForm flaggedSites={flaggedSites} />

        {/* Footer with Licence Attribution & Headline Trap */}
        <Footer />
      </main>
    </div>
  );
}
