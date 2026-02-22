import { useState } from "react";

const MILESTONES = [
  {
    id: 1,
    title: "Project Kickoff",
    phase: "Phase 1",
    due: "Feb 1, 2025",
    completed: true,
    tasks: [
      { label: "Define project scope and objectives", done: true },
      { label: "Assemble team and assign roles", done: true },
      { label: "Set up project tooling and repositories", done: true },
    ],
  },
  {
    id: 2,
    title: "Design System Approved",
    phase: "Phase 1",
    due: "Feb 10, 2025",
    completed: true,
    tasks: [
      { label: "Create component library in Figma", done: true },
      { label: "Get stakeholder sign-off on design language", done: true },
      { label: "Export assets and share with engineering", done: true },
    ],
  },
  {
    id: 3,
    title: "API Integration Complete",
    phase: "Phase 2",
    due: "Feb 22, 2025",
    completed: true,
    tasks: [
      { label: "Connect authentication endpoints", done: true },
      { label: "Integrate third-party analytics APIs", done: true },
      { label: "Write integration tests", done: true },
    ],
  },
  {
    id: 4,
    title: "Beta Launch Prep",
    phase: "Phase 2",
    due: "Mar 15, 2025",
    completed: false,
    active: true,
    tasks: [
      { label: "Complete onboarding flow with Google login", done: true },
      { label: "Implement response caching for API", done: true },
      { label: "Instrument analytics events on all screens", done: false },
      { label: "Pass QA sign-off on onboarding", done: false },
      { label: "Deliver marketing screenshots and notes", done: false },
    ],
  },
  {
    id: 5,
    title: "QA Sign-off",
    phase: "Phase 3",
    due: "Mar 20, 2025",
    completed: false,
    tasks: [
      { label: "Execute full regression test suite", done: false },
      { label: "Resolve all P0 and P1 bugs", done: false },
      { label: "Get QA lead approval", done: false },
    ],
  },
  {
    id: 6,
    title: "Soft Launch",
    phase: "Phase 4",
    due: "Apr 1, 2025",
    completed: false,
    tasks: [
      { label: "Deploy to production environment", done: false },
      { label: "Enable feature flags for beta users", done: false },
      { label: "Monitor error rates and performance", done: false },
      { label: "Publish release notes", done: false },
    ],
  },
];

const PHASE_COLORS = {
  "Phase 1": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", dot: "bg-purple-400" },
  "Phase 2": { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",   dot: "bg-blue-400"   },
  "Phase 3": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", dot: "bg-orange-400" },
  "Phase 4": { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200",  dot: "bg-green-400"  },
};

export default function MilestonesPanel() {
  const [openIds, setOpenIds] = useState(new Set([4])); // active milestone open by default

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const completed = MILESTONES.filter((m) => m.completed).length;
  const total     = MILESTONES.length;
  const pct       = Math.round((completed / total) * 100);

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Milestones</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {completed} of {total} completed
          </p>
        </div>
        {/* Overall progress pill */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">{pct}%</span>
        </div>
      </div>

      {/* Milestone list */}
      <div className="flex flex-col gap-3">
        {MILESTONES.map((milestone) => {
          const isOpen    = openIds.has(milestone.id);
          const phase     = PHASE_COLORS[milestone.phase] ?? PHASE_COLORS["Phase 1"];
          const doneCount = milestone.tasks.filter((t) => t.done).length;
          const taskPct   = Math.round((doneCount / milestone.tasks.length) * 100);

          return (
            <div
              key={milestone.id}
              className={`
                bg-white rounded-2xl border shadow-sm transition-all duration-200
                ${milestone.active
                  ? "border-orange-300 shadow-orange-100"
                  : milestone.completed
                    ? "border-green-200"
                    : "border-gray-200"
                }
              `}
            >
              {/* Accordion header */}
              <button
                onClick={() => toggle(milestone.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 rounded-2xl transition-colors text-left"
              >
                {/* Completion circle */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                  ${milestone.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : milestone.active
                      ? "bg-white border-orange-500 text-orange-500"
                      : "bg-white border-gray-200 text-gray-300"
                  }
                `}>
                  {milestone.completed ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : milestone.active ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-gray-800 ${milestone.completed ? "line-through text-gray-400" : ""}`}>
                      {milestone.title}
                    </span>
                    {milestone.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${phase.bg} ${phase.text} ${phase.border}`}>
                      {milestone.phase}
                    </span>
                    <span className="text-xs text-gray-400">Due {milestone.due}</span>
                    <span className="text-xs text-gray-400">{doneCount}/{milestone.tasks.length} tasks</span>
                  </div>
                </div>

                {/* Right: mini progress + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${milestone.completed ? "bg-green-400" : "bg-orange-400"}`}
                      style={{ width: `${taskPct}%` }}
                    />
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 text-sm ${isOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-2.5 bg-gray-50 rounded-b-2xl">
                  {milestone.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`
                        mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${task.done
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                        }
                      `}>
                        {task.done && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm leading-snug ${task.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}