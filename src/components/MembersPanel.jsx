import { useState } from "react";

/* ── Hardcoded data — swap with API call later ── */
const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Nikhil Varma",
    role: "Frontend Developer",
    avatar: "NV",
    status: "active",
    currentTask: "Implement frontend authentication (Google login)",
    taskStatus: "running",
    tasksCompleted: 4,
    tasksTotal: 6,
    email: "nikhil@promag.dev",
    tags: ["React", "Firebase", "UI"],
  },
  {
    id: 2,
    name: "Ananya Das",
    role: "QA Engineer",
    avatar: "AD",
    status: "active",
    currentTask: "Draft QA test scenarios for onboarding flow",
    taskStatus: "queued",
    tasksCompleted: 3,
    tasksTotal: 5,
    email: "ananya@promag.dev",
    tags: ["Testing", "Automation", "Jira"],
  },
  {
    id: 3,
    name: "Meera Krishnan",
    role: "Backend Engineer",
    avatar: "MK",
    status: "away",
    currentTask: "Investigate API response time and implement caching",
    taskStatus: "running",
    tasksCompleted: 5,
    tasksTotal: 7,
    email: "meera@promag.dev",
    tags: ["Node.js", "PostgreSQL", "Redis"],
  },
  {
    id: 4,
    name: "Vikram Iyer",
    role: "Data & Analytics",
    avatar: "VI",
    status: "active",
    currentTask: "Instrument analytics events on each onboarding step",
    taskStatus: "queued",
    tasksCompleted: 2,
    tasksTotal: 4,
    email: "vikram@promag.dev",
    tags: ["Mixpanel", "Segment", "SQL"],
  },
  {
    id: 5,
    name: "Priya Joseph",
    role: "Project Manager",
    avatar: "PJ",
    status: "active",
    currentTask: "Circulate meeting minutes and coordinate design handoff",
    taskStatus: "completed",
    tasksCompleted: 6,
    tasksTotal: 6,
    email: "priya@promag.dev",
    tags: ["Jira", "Notion", "Coordination"],
  },
  {
    id: 6,
    name: "Unassigned",
    role: "Designer",
    avatar: "?",
    status: "idle",
    currentTask: "Prepare revised onboarding wireframes",
    taskStatus: "queued",
    tasksCompleted: 0,
    tasksTotal: 2,
    email: null,
    tags: ["Figma", "Wireframing"],
  },
];

const STATUS_CONFIG = {
  active: { dot: "bg-green-400",  label: "Active", text: "text-green-600",  bg: "bg-green-50 border-green-200"   },
  away:   { dot: "bg-yellow-400", label: "Away",   text: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  idle:   { dot: "bg-gray-300",   label: "Idle",   text: "text-gray-500",   bg: "bg-gray-50 border-gray-200"     },
};

const TASK_STATUS_CONFIG = {
  running:   { bg: "bg-blue-100",  text: "text-blue-700",  label: "In Progress" },
  queued:    { bg: "bg-gray-100",  text: "text-gray-600",  label: "Queued"      },
  completed: { bg: "bg-green-100", text: "text-green-700", label: "Done"        },
  failed:    { bg: "bg-red-100",   text: "text-red-700",   label: "Failed"      },
};

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-rose-100 text-rose-600",
  "bg-gray-100 text-gray-500",
];

/* ══════════════════════════════════════
   MembersPanel
══════════════════════════════════════ */
export default function MembersPanel() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.currentTask.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : m.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:    MOCK_MEMBERS.length,
    active: MOCK_MEMBERS.filter((m) => m.status === "active").length,
    away:   MOCK_MEMBERS.filter((m) => m.status === "away").length,
    idle:   MOCK_MEMBERS.filter((m) => m.status === "idle").length,
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {MOCK_MEMBERS.length} people on this project
          </p>
        </div>
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search by name, role or task…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {["all", "active", "away", "idle"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all capitalize
              ${filter === f
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }
            `}
          >
            {f !== "all" && (
              <span className={`w-1.5 h-1.5 rounded-full ${filter === f ? "bg-white" : STATUS_CONFIG[f]?.dot}`} />
            )}
            {f === "all" ? "All" : STATUS_CONFIG[f].label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <span className="text-4xl">◉</span>
          <p className="text-sm">No members match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((member, idx) => (
            <MemberCard
              key={member.id}
              member={member}
              colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MemberCard
══════════════════════════════════════ */
function MemberCard({ member, colorClass }) {
  const status     = STATUS_CONFIG[member.status]         ?? STATUS_CONFIG.idle;
  const taskStatus = TASK_STATUS_CONFIG[member.taskStatus] ?? TASK_STATUS_CONFIG.queued;
  const progress   = member.tasksTotal > 0
    ? Math.round((member.tasksCompleted / member.tasksTotal) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">

      {/* Avatar + name + status */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${colorClass}`}>
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-800 text-sm truncate">{member.name}</p>
            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} flex-shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${member.status === "active" ? "animate-pulse" : ""}`} />
              {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
          {member.email && (
            <p className="text-xs text-gray-400 truncate">{member.email}</p>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Current task */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
          Currently Working On
        </p>
        <div className="flex items-start gap-2">
          <span className={`mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${taskStatus.bg} ${taskStatus.text}`}>
            {taskStatus.label}
          </span>
          <p className="text-sm text-gray-700 leading-snug line-clamp-2">{member.currentTask}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Tasks completed</span>
          <span className="font-semibold text-gray-600">
            {member.tasksCompleted}/{member.tasksTotal}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      {member.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}