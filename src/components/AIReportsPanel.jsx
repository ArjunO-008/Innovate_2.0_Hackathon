import { useState } from "react";

const REPORTS = [
  {
    id: 1,
    source: "Initial Creation",
    sourceIcon: "◈",
    time: "Feb 1, 2025 · 10:02 AM",
    title: "Project Setup Analysis",
    summary: "AI reviewed the initial project configuration, team structure, and goal alignment.",
    insights: [
      { type: "green", text: "Project scope is well-defined with clear deliverables and measurable outcomes." },
      { type: "green", text: "Team composition covers all critical skill areas — frontend, backend, QA, and design." },
      { type: "green", text: "Timeline is realistic given team size and task complexity." },
      { type: "yellow", text: "No explicit risk mitigation plan documented for third-party API dependencies." },
      { type: "yellow", text: "Two roles currently unassigned — may cause bottlenecks in design phase." },
    ],
  },
  {
    id: 2,
    source: "Standup",
    sourceIcon: "⟳",
    time: "Feb 18, 2025 · 9:15 AM",
    title: "Daily Standup Review",
    summary: "AI monitored standup notes and cross-referenced against task progress and sprint goals.",
    insights: [
      { type: "green", text: "Frontend authentication (Google login) is on track — estimated completion within 4 days." },
      { type: "green", text: "Team communication is healthy — no blockers reported for 5 consecutive standups." },
      { type: "yellow", text: "QA test scenarios not yet started despite development being 60% complete." },
      { type: "yellow", text: "Analytics instrumentation is behind schedule by approximately 2 days." },
      { type: "red", text: "API response time averaging 1.8s under load — exceeds the 500ms SLA threshold by 3.6x." },
    ],
  },
  {
    id: 3,
    source: "GitHub",
    sourceIcon: "⌥",
    time: "Feb 20, 2025 · 2:44 PM",
    title: "Code Review & Repository Analysis",
    summary: "AI scanned recent commits, pull requests, and code patterns for quality and risk signals.",
    insights: [
      { type: "green", text: "Code coverage is at 78% — above the 70% project threshold." },
      { type: "green", text: "No critical CVEs detected in current dependency tree." },
      { type: "yellow", text: "3 pull requests open for more than 48 hours without review — review bottleneck forming." },
      { type: "yellow", text: "AuthService module has cyclomatic complexity of 14 — refactor recommended before release." },
      { type: "red", text: "Detected hardcoded API key in commit a3f91bc — immediate rotation required, potential security breach." },
      { type: "red", text: "Memory leak pattern detected in useWebSocket hook — can cause app crashes under sustained usage." },
    ],
  },
  {
    id: 4,
    source: "Jira",
    sourceIcon: "◉",
    time: "Feb 21, 2025 · 11:30 AM",
    title: "Sprint & Ticket Health Report",
    summary: "AI analyzed sprint velocity, ticket aging, and delivery risk across the active sprint.",
    insights: [
      { type: "green", text: "Sprint velocity is consistent at 34 points over last 3 sprints — team is predictable." },
      { type: "green", text: "5 tickets moved to Done this week — highest weekly throughput this quarter." },
      { type: "yellow", text: "2 tickets have been in 'In Progress' for over 6 days without updates — possible stall." },
      { type: "yellow", text: "Scope creep detected — 3 unplanned tickets added mid-sprint totaling 8 story points." },
      { type: "red", text: "Current burn rate puts sprint completion at risk — 40% of work remaining with 25% of time left." },
    ],
  },
  {
    id: 5,
    source: "Standup",
    sourceIcon: "⟳",
    time: "Feb 22, 2025 · 9:08 AM",
    title: "Daily Standup Review",
    summary: "AI reviewed latest standup and flagged emerging risks and progress updates.",
    insights: [
      { type: "green", text: "API response time reduced to 340ms after caching implementation — SLA now met." },
      { type: "green", text: "Onboarding wireframes v1 delivered to engineering on schedule." },
      { type: "yellow", text: "Marketing asset deadline is March 8 — design handoff not yet confirmed." },
      { type: "yellow", text: "Sprint review meeting scheduled but agenda not yet shared with stakeholders." },
      { type: "red", text: "Hardcoded API key from GitHub report not yet rotated — 48 hours since detection, escalating risk." },
    ],
  },
];

const INSIGHT_STYLES = {
  green:  { bar: "bg-green-400",  bg: "bg-green-50",  text: "text-green-800",  icon: "✓", label: "Good",    badge: "bg-green-100 text-green-700 border-green-200"  },
  yellow: { bar: "bg-yellow-400", bg: "bg-yellow-50", text: "text-yellow-800", icon: "⚠", label: "Warning", badge: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  red:    { bar: "bg-red-400",    bg: "bg-red-50",    text: "text-red-800",    icon: "✕", label: "Alert",   badge: "bg-red-100 text-red-700 border-red-200"         },
};

const SOURCE_STYLES = {
  "Initial Creation": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  "Standup":          { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200"   },
  "GitHub":           { bg: "bg-gray-100",   text: "text-gray-700",   border: "border-gray-300"   },
  "Jira":             { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
};

const FILTER_KEYS = ["all", "green", "yellow", "red"];
const FILTER_LABELS = { all: "All", green: "Good", yellow: "Warnings", red: "Alerts" };

export default function AIReportsPanel() {
  const [openIds, setOpenIds]   = useState(new Set([5])); // latest open by default
  const [filter, setFilter]     = useState("all");

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter reports — show report if it has at least one insight matching filter
  const visibleReports = REPORTS.slice().reverse().filter((r) =>
    filter === "all" ? true : r.insights.some((i) => i.type === filter)
  );

  // Global counts across all reports
  const allInsights = REPORTS.flatMap((r) => r.insights);
  const counts = {
    all:    allInsights.length,
    green:  allInsights.filter((i) => i.type === "green").length,
    yellow: allInsights.filter((i) => i.type === "yellow").length,
    red:    allInsights.filter((i) => i.type === "red").length,
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Reports</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {REPORTS.length} reports · AI-generated insights across all sources
          </p>
        </div>
        {/* Alert summary pills */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
            <span>✓</span> {counts.green}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            <span>⚠</span> {counts.yellow}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
            <span>✕</span> {counts.red}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTER_KEYS.map((key) => {
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filter === key
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                }
              `}
            >
              {key !== "all" && (
                <span className={`text-xs font-bold`}>{INSIGHT_STYLES[key].icon}</span>
              )}
              {FILTER_LABELS[key]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Report cards */}
      <div className="flex flex-col gap-3">
        {visibleReports.map((report) => {
          const isOpen       = openIds.has(report.id);
          const sourceStyle  = SOURCE_STYLES[report.source] ?? SOURCE_STYLES["Standup"];
          const visibleInsights = filter === "all"
            ? report.insights
            : report.insights.filter((i) => i.type === filter);

          const redCount    = report.insights.filter((i) => i.type === "red").length;
          const yellowCount = report.insights.filter((i) => i.type === "yellow").length;

          return (
            <div
              key={report.id}
              className={`
                bg-white rounded-2xl border shadow-sm transition-all duration-200
                ${redCount > 0 ? "border-red-200" : yellowCount > 0 ? "border-yellow-200" : "border-green-200"}
              `}
            >
              {/* Accordion header */}
              <button
                onClick={() => toggle(report.id)}
                className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 rounded-2xl transition-colors text-left"
              >
                {/* Source icon */}
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-base flex-shrink-0">
                  {report.sourceIcon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceStyle.bg} ${sourceStyle.text} ${sourceStyle.border}`}>
                      {report.source}
                    </span>
                    <span className="text-xs text-gray-400">{report.time}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{report.title}</p>
                  {!isOpen && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{report.summary}</p>
                  )}
                </div>

                {/* Right: insight counts + chevron */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  {redCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                      {redCount} alert{redCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {yellowCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      {yellowCount} warn
                    </span>
                  )}
                  <span className={`text-gray-400 transition-transform duration-200 text-sm ${isOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className="border-t border-gray-100 rounded-b-2xl overflow-hidden">
                  {/* Summary */}
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed">{report.summary}</p>
                  </div>

                  {/* Insights */}
                  <div className="divide-y divide-gray-50">
                    {visibleInsights.map((insight, i) => {
                      const style = INSIGHT_STYLES[insight.type];
                      return (
                        <div key={i} className={`flex items-start gap-0 ${style.bg}`}>
                          {/* Color bar */}
                          <div className={`w-1 self-stretch flex-shrink-0 ${style.bar}`} />
                          {/* Icon */}
                          <div className={`w-8 flex-shrink-0 flex items-center justify-center py-3 text-xs font-bold ${style.text} opacity-70`}>
                            {style.icon}
                          </div>
                          {/* Text */}
                          <p className={`flex-1 py-3 pr-5 text-sm leading-relaxed ${style.text}`}>
                            {insight.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visibleReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <span className="text-4xl">◎</span>
          <p className="text-sm">No reports match this filter.</p>
        </div>
      )}
    </div>
  );
}