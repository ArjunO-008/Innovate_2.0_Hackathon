import { useState } from "react";

/* ── Hardcoded log entries — swap with API response later ──
   These come as plain log strings from a backend doc file.
   Stored oldest-first; we reverse to show newest at top.
─────────────────────────────────────────────────────────── */
const RAW_LOGS = [
  "Project initialized and webhook configuration verified.",
  "Problem statement parsed and stored to database.",
  "AI analysis started for project: Beta Launch Prep.",
  "Task generation pipeline triggered successfully.",
  "Generated 7 tasks from AI output.",
  "Task: 'Prepare revised onboarding wireframes' created with HIGH priority.",
  "Task: 'Implement frontend authentication (Google login)' created with HIGH priority.",
  "Task: 'Draft QA test scenarios for onboarding flow' created with HIGH priority.",
  "Task: 'Prepare final screenshots and feature notes for marketing' created with MEDIUM priority.",
  "Task: 'Investigate API response time and implement response caching' created with MEDIUM priority — flagged as AT RISK.",
  "Task: 'Instrument analytics events on each onboarding step' created with MEDIUM priority.",
  "Task: 'Circulate meeting minutes and coordinate design-engineering handoff' created with MEDIUM priority.",
  "Task assignments dispatched to team members.",
  "Nikhil Varma assigned to: Implement frontend authentication (Google login).",
  "Ananya Das assigned to: Draft QA test scenarios for onboarding flow.",
  "Meera Krishnan assigned to: Investigate API response time and implement response caching.",
  "Vikram Iyer assigned to: Instrument analytics events on each onboarding step.",
  "Priya Joseph assigned to: Circulate meeting minutes and coordinate design-engineering handoff.",
  "Task status updated — 'Implement frontend authentication' moved to RUNNING.",
  "Task status updated — 'Investigate API response time' moved to RUNNING.",
  "Caching layer analysis complete. Redis recommended as mitigation.",
  "API response time reduced from 1.8s to 340ms after caching implementation.",
  "QA test scenarios document shared with engineering team.",
  "Onboarding wireframes v1 uploaded to Figma by design team.",
  "Marketing asset deadline set for March 8 — reminder dispatched.",
  "Sprint review meeting scheduled for March 5.",
  "Task status updated — 'Circulate meeting minutes' moved to COMPLETED.",
  "Overall project progress updated to 61%.",
];

/* ── Classify log line for styling ── */
function classify(log) {
  const l = log.toLowerCase();
  if (l.includes("error") || l.includes("failed") || l.includes("risk"))
    return "error";
  if (l.includes("completed") || l.includes("success") || l.includes("verified") || l.includes("reduced"))
    return "success";
  if (l.includes("assigned") || l.includes("dispatched") || l.includes("updated") || l.includes("scheduled"))
    return "info";
  if (l.includes("created") || l.includes("generated") || l.includes("triggered") || l.includes("started"))
    return "action";
  return "default";
}

const LOG_STYLES = {
  error:   { bar: "bg-red-400",    bg: "bg-red-50",     text: "text-red-800",    icon: "✕", badge: "bg-red-100 text-red-600"       },
  success: { bar: "bg-green-400",  bg: "bg-green-50",   text: "text-green-800",  icon: "✓", badge: "bg-green-100 text-green-700"   },
  info:    { bar: "bg-blue-400",   bg: "bg-blue-50",    text: "text-blue-800",   icon: "→", badge: "bg-blue-100 text-blue-700"     },
  action:  { bar: "bg-orange-400", bg: "bg-orange-50",  text: "text-orange-800", icon: "◆", badge: "bg-orange-100 text-orange-600" },
  default: { bar: "bg-gray-300",   bg: "bg-gray-50",    text: "text-gray-700",   icon: "·", badge: "bg-gray-100 text-gray-500"    },
};

const FILTER_KEYS = ["all", "error", "success", "info", "action"];
const FILTER_LABELS = { all: "All", error: "Errors", success: "Success", info: "Updates", action: "Actions" };

export default function LogsPanel() {
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");

  // Reverse to show newest first (descending)
  const descendingLogs = [...RAW_LOGS].reverse().map((log, idx) => ({
    id: idx,
    text: log,
    type: classify(log),
    index: RAW_LOGS.length - idx, // original line number
  }));

  const filtered = descendingLogs.filter((log) => {
    const matchFilter = filter === "all" || log.type === filter;
    const matchSearch = log.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = FILTER_KEYS.reduce((acc, key) => {
    acc[key] = key === "all"
      ? descendingLogs.length
      : descendingLogs.filter((l) => l.type === key).length;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Logs</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {descendingLogs.length} entries · newest first
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
          <span>↓</span>
          <span>Descending order</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search logs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTER_KEYS.map((key) => {
          const style = LOG_STYLES[key] ?? LOG_STYLES.default;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${filter === key
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                }
              `}
            >
              {key !== "all" && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : style.badge}`}>
                  {FILTER_LABELS[key][0]}
                </span>
              )}
              {FILTER_LABELS[key]}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Log entries */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <span className="text-4xl">≡</span>
          <p className="text-sm">No logs match your filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Terminal-style header */}
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-900 border-b border-gray-700">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-400 font-mono">project.log</span>
            <span className="ml-auto text-xs text-gray-500 font-mono">{filtered.length} lines</span>
          </div>

          {/* Log list */}
          <div className="divide-y divide-gray-100 font-mono text-sm">
            {filtered.map((log) => {
              const style = LOG_STYLES[log.type];
              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-0 group transition-colors hover:${style.bg}`}
                >
                  {/* Left color bar */}
                  <div className={`w-1 self-stretch flex-shrink-0 ${style.bar}`} />

                  {/* Line number */}
                  <div className="w-12 flex-shrink-0 text-right pr-3 py-3 text-gray-300 text-xs select-none border-r border-gray-100">
                    {log.index}
                  </div>

                  {/* Icon */}
                  <div className={`w-8 flex-shrink-0 flex items-center justify-center py-3 text-xs ${style.text} opacity-60`}>
                    {style.icon}
                  </div>

                  {/* Log text */}
                  <p className={`flex-1 py-3 pr-5 text-xs leading-relaxed ${style.text} break-words`}>
                    {log.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">
              Showing {filtered.length} of {descendingLogs.length} entries
            </span>
            <span className="text-xs text-gray-400 font-mono">↑ newest at top</span>
          </div>
        </div>
      )}
    </div>
  );
}