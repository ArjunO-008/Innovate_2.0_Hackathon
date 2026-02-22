import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import TaskPanel from "../components/TaskPanel";
import AIReportsPanel from "../components/AIReportsPanel";
import MembersPanel from "../components/MembersPanel";

const tabs = [
  { key: "overview", label: "Overview", icon: "◈" },
  { key: "tasks",    label: "Tasks",    icon: "⟳" },
  { key: "members",  label: "Members",  icon: "◉" },
  { key: "reports",  label: "AI Reports", icon: "◎" },
  { key: "results",  label: "Results",   icon: "◈" },
];

export default function ProjectDashboard() {
  const { projectName: encoded } = useParams();
  const projectName = decodeURIComponent(encoded ?? "");
  const navigate    = useNavigate();
  const location    = useLocation();
  // Set to true when navigating here right after project creation
  const initialTasks = location.state?.tasks ?? null;

  // Derive active tab from URL hash for deep-linkability, fallback to "tasks"
  const hash       = window.location.hash.replace("#", "") || "tasks";
  const activeTab  = tabs.find((t) => t.key === hash)?.key ?? "tasks";

  const setActiveTab = (key) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.hash = key;
    // Force re-render via navigate to same path with new hash
    navigate(`/project/${encoded}#${key}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top Navbar ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">

        {/* Brand + breadcrumb row */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-orange-500 transition text-sm"
            >
              ← Back
            </Link>
            <span className="text-gray-200 select-none">|</span>
            <Link
              to="/dashboard"
              className="text-xl font-bold text-orange-500 tracking-tight hover:opacity-80 transition"
            >
              ProMag
            </Link>
            <span className="text-gray-300 select-none">›</span>
            <span className="text-lg font-semibold text-gray-800 truncate max-w-xs">
              {projectName}
            </span>
          </div>

          <span className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Processing
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-8 border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-5 py-3 text-sm font-medium
                border-b-2 transition-all duration-150
                ${activeTab === tab.key
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }
              `}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {activeTab === "overview" && <OverviewPanel projectName={projectName} />}
        {activeTab === "tasks"    && <TaskPanel projectName={projectName} initialTasks={initialTasks} />}
        {activeTab === "members"  && <MembersPanel />}
        {activeTab === "reports"    && <AIReportsPanel />}
        {activeTab === "results"  && <ResultsPanel />}
      </main>
    </div>
  );
}

/* ── Panels ── */

/* ═══════════════════════════════════════════════
   HARDCODED DATA — swap with real API calls later
═══════════════════════════════════════════════ */
const MOCK_OVERVIEW = {
  milestone: {
    current: "Beta Launch Prep",
    due: "Mar 15, 2025",
    phase: 2,
    totalPhases: 4,
    description: "Complete onboarding flow, integrate analytics, and pass QA sign-off before soft launch.",
  },
  progress: {
    overall: 61,
    completed: 9,
    total: 15,
    breakdown: [
      { label: "Completed", value: 9,  color: "#22c55e", hover: "#16a34a" },
      { label: "In Progress", value: 3, color: "#f97316", hover: "#ea6b05" },
      { label: "Queued", value: 2,     color: "#94a3b8", hover: "#64748b" },
      { label: "Bugs / Failed", value: 1, color: "#ef4444", hover: "#dc2626" },
    ],
  },
  timeline: [
    { id: 1, title: "Project Kickoff",         date: "Feb 1",  done: true,  type: "milestone" },
    { id: 2, title: "Design System Approved",  date: "Feb 10", done: true,  type: "design"    },
    { id: 3, title: "API Integration Complete",date: "Feb 22", done: true,  type: "dev"       },
    { id: 4, title: "Beta Launch Prep",        date: "Mar 15", done: false, type: "milestone", active: true },
    { id: 5, title: "QA Sign-off",             date: "Mar 20", done: false, type: "qa"        },
    { id: 6, title: "Soft Launch",             date: "Apr 1",  done: false, type: "launch"    },
  ],
  calendar: {
    year: 2025,
    month: 2, // 0-indexed = March
    events: [
      { day: 5,  label: "Sprint Review",        type: "meeting" },
      { day: 8,  label: "Marketing Assets Due",  type: "deadline" },
      { day: 12, label: "QA Kickoff",            type: "task"    },
      { day: 15, label: "Beta Launch Prep Due",  type: "deadline" },
      { day: 18, label: "Stakeholder Demo",      type: "meeting" },
      { day: 20, label: "QA Sign-off",           type: "task"    },
      { day: 25, label: "Release Notes Draft",   type: "task"    },
      { day: 28, label: "Retro Meeting",         type: "meeting" },
    ],
  },
};

const EVENT_COLORS = {
  meeting:  { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  deadline: { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  task:     { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
};

const TYPE_ICONS = {
  milestone: "◆",
  design:    "✦",
  dev:       "⟨/⟩",
  qa:        "✓",
  launch:    "🚀",
};

/* ── Overview Panel ── */
function OverviewPanel({ projectName }) {
  const [overviewData, setOverviewData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call
    // const res = await apiFetch(`overview?projectName=${encodeURIComponent(projectName)}`);
    // const data = await res.json();
    const timer = setTimeout(() => {
      setOverviewData(MOCK_OVERVIEW);
      setLoadingOverview(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [projectName]);

  if (loadingOverview) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400 gap-3">
        <div className="w-7 h-7 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-sm">Loading overview…</span>
      </div>
    );
  }

  const { milestone, progress, timeline, calendar } = overviewData;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Top: project card (existing) ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <span className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl font-bold flex-shrink-0">
          {projectName?.[0]?.toUpperCase() ?? "P"}
        </span>
        <div className="flex-1">
          <p className="font-bold text-gray-800 text-lg leading-tight">{projectName}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active Project · Phase {milestone.phase} of {milestone.totalPhases}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
          Processing
        </div>
      </div>

      {/* ── Row 1: Milestone + Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MilestoneCard milestone={milestone} />
        <ProgressCard progress={progress} />
      </div>

      {/* ── Row 2: Timeline + Calendar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineCard timeline={timeline} />
        <CalendarCard calendar={calendar} />
      </div>
    </div>
  );
}

/* ── Milestone Card ── */
function MilestoneCard({ milestone }) {
  const pct = Math.round((milestone.phase / milestone.totalPhases) * 100);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Milestone</h3>
        <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
          Phase {milestone.phase}/{milestone.totalPhases}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-800 mb-1">{milestone.current}</p>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{milestone.description}</p>

      {/* Phase progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Phase progress</span>
          <span className="font-semibold text-gray-600">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 pt-1">
          <span>Started Feb 1</span>
          <span className="text-red-500 font-medium">Due {milestone.due}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Circular Progress Card ── */
function ProgressCard({ progress }) {
  const [tooltip, setTooltip] = useState(null);
  const total = progress.breakdown.reduce((s, b) => s + b.value, 0);
  const SIZE  = 160;
  const R     = 58;
  const CX    = SIZE / 2;
  const CY    = SIZE / 2;
  const STROKE = 22;
  const CIRC  = 2 * Math.PI * R;

  // Build arc segments
  let cumulative = 0;
  const segments = progress.breakdown.map((seg) => {
    const frac   = seg.value / total;
    const dash   = frac * CIRC;
    const offset = CIRC - cumulative * CIRC / total;
    const el = { ...seg, dash, offset, frac, cumulative };
    // eslint-disable-next-line react-hooks/immutability
    cumulative += seg.value;
    return el;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Overall Progress</h3>
        <span className="text-xs font-semibold text-gray-500">
          {progress.completed}/{progress.total} tasks
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
            {/* Background track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={tooltip?.label === seg.label ? seg.hover : seg.color}
                strokeWidth={STROKE}
                strokeDasharray={`${seg.dash} ${CIRC - seg.dash}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setTooltip(seg)}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </svg>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {tooltip ? (
              <>
                <span className="text-lg font-bold text-gray-800">{tooltip.value}/{total}</span>
                <span className="text-[10px] text-gray-400 text-center leading-tight px-2">{tooltip.label}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">{progress.overall}%</span>
                <span className="text-[10px] text-gray-400">complete</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {progress.breakdown.map((seg, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-sm text-gray-600">{seg.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{seg.value}</span>
            </div>
          ))}
          <div className="mt-1 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Total created</span>
            <span className="text-sm font-bold text-gray-800">{progress.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline Card ── */
function TimelineCard({ timeline }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Timeline</h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">Jira</span>
      </div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
        <div className="space-y-4">
          {timeline.map((item) => (
            <div key={item.id} className="flex items-start gap-4 relative">
              {/* Node */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 text-[10px]
                ${item.done
                  ? "bg-orange-500 border-orange-500 text-white"
                  : item.active
                    ? "bg-white border-orange-500 text-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
                    : "bg-white border-gray-200 text-gray-300"
                }
              `}>
                {item.done ? "✓" : TYPE_ICONS[item.type] ?? "○"}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium leading-tight ${
                    item.active ? "text-orange-600" : item.done ? "text-gray-700" : "text-gray-400"
                  }`}>
                    {item.title}
                    {item.active && (
                      <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">Current</span>
                    )}
                  </p>
                  <span className={`text-xs flex-shrink-0 ${item.done ? "text-gray-400" : item.active ? "text-orange-500 font-semibold" : "text-gray-300"}`}>
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Calendar Card ── */
function CalendarCard({ calendar }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const { year, month, events } = calendar;
  const firstDow  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const today     = new Date();

  const eventMap = {};
  events.forEach((e) => {
    if (!eventMap[e.day]) eventMap[e.day] = [];
    eventMap[e.day].push(e);
  });

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(d);

  const selectedEvents = selectedDay ? (eventMap[selectedDay] ?? []) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Calendar</h3>
        <span className="text-sm font-semibold text-gray-700">{MONTHS[month]} {year}</span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const evs      = eventMap[day] ?? [];
          const isToday  = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isSel    = selectedDay === day;
          const hasEvent = evs.length > 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSel ? null : day)}
              className={`
                relative aspect-square flex flex-col items-center justify-start pt-1 rounded-lg text-xs font-medium transition-all
                ${isToday  ? "bg-orange-500 text-white"                     : ""}
                ${isSel && !isToday ? "bg-orange-50 border border-orange-300 text-orange-700" : ""}
                ${!isToday && !isSel ? "text-gray-700 hover:bg-gray-50"     : ""}
              `}
            >
              {day}
              {hasEvent && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {evs.slice(0, 3).map((ev, ei) => (
                    <span
                      key={ei}
                      className={`w-1 h-1 rounded-full ${isToday ? "bg-white/70" : EVENT_COLORS[ev.type]?.dot ?? "bg-gray-400"}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {MONTHS[month]} {selectedDay}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="text-xs text-gray-400">No events</p>
          ) : (
            selectedEvents.map((ev, i) => {
              const style = EVENT_COLORS[ev.type] ?? EVENT_COLORS.task;
              return (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${style.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                  <span className={`text-xs font-medium ${style.text}`}>{ev.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function ResultsPanel() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Results</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
          <span className="text-4xl">◎</span>
          <p className="text-sm">
            Final outputs and generated artifacts will be available here once
            processing is complete.
          </p>
        </div>
      </div>
    </div>
  );
}