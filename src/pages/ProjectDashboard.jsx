import { useState } from "react";
import TaskPanel from "../components/TaskPanel";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "tasks", label: "Background Tasks" },
  { key: "logs", label: "Logs" },
  { key: "results", label: "Results" },
];

export default function ProjectDashboard({ projectName }) {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-4 py-6">
        <h2 className="text-lg font-bold text-orange-500 mb-6 truncate">
          {projectName}
        </h2>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                w-full text-left px-4 py-2 rounded-lg transition
                ${
                  activeTab === tab.key
                    ? "bg-orange-100 text-orange-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "overview" && (
          <OverviewPanel projectName={projectName} />
        )}

        {activeTab === "tasks" && (
          <TaskPanel projectName={projectName} />
        )}

        {activeTab === "logs" && <LogsPanel />}

        {activeTab === "results" && <ResultsPanel />}
      </main>
    </div>
  );
}

/* ---------- PANELS ---------- */

function OverviewPanel({ projectName }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>

      <div className="bg-white border rounded-xl p-6 space-y-3">
        <p className="text-gray-700">
          <strong>Project:</strong> {projectName}
        </p>

        <p className="text-gray-600">
          This project has been approved and is currently undergoing
          background processing. You can monitor progress in the
          <strong> Background Tasks</strong> tab.
        </p>

        <p className="text-gray-500 text-sm">
          You can safely leave this page — progress will continue on the server.
        </p>
      </div>
    </div>
  );
}

function LogsPanel() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Logs</h1>

      <div className="bg-white border rounded-xl p-6 text-gray-500">
        Logs will appear here as backend tasks run.
      </div>
    </div>
  );
}

function ResultsPanel() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      <div className="bg-white border rounded-xl p-6 text-gray-500">
        Final outputs and generated artifacts will be available here once
        processing is complete.
      </div>
    </div>
  );
}