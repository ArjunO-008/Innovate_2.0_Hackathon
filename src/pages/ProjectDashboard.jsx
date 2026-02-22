import { useParams, useNavigate, Link } from "react-router-dom";
import TaskPanel from "../components/TaskPanel";

const tabs = [
  { key: "overview", label: "Overview", icon: "◈" },
  { key: "tasks",    label: "Tasks",    icon: "⟳" },
  { key: "logs",     label: "Logs",     icon: "≡" },
  { key: "results",  label: "Results",  icon: "◎" },
];

export default function ProjectDashboard() {
  const { projectName: encoded } = useParams();
  const projectName = decodeURIComponent(encoded ?? "");
  const navigate    = useNavigate();

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
        {activeTab === "tasks"    && <TaskPanel projectName={projectName} />}
        {activeTab === "logs"     && <LogsPanel />}
        {activeTab === "results"  && <ResultsPanel />}
      </main>
    </div>
  );
}

/* ── Panels ── */

function OverviewPanel({ projectName }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Overview</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-lg font-bold">
            {projectName?.[0]?.toUpperCase() ?? "P"}
          </span>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{projectName}</p>
            <p className="text-xs text-gray-400">Active Project</p>
          </div>
        </div>
        <hr className="border-gray-100" />
        <p className="text-gray-600 leading-relaxed">
          This project has been approved and is currently undergoing background
          processing. Monitor progress in the{" "}
          <strong className="text-orange-500">Tasks</strong> tab.
        </p>
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
          <span className="text-orange-400 text-lg mt-0.5">ℹ</span>
          <p className="text-sm text-orange-700">
            You can safely leave this page — progress will continue on the server.
          </p>
        </div>
      </div>
    </div>
  );
}

function LogsPanel() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Logs</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
          <span className="text-4xl">≡</span>
          <p className="text-sm">Logs will appear here as backend tasks run.</p>
        </div>
      </div>
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
