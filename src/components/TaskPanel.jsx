import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiFetch";

const PRIORITY_STYLES = {
  High:   { badge: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
  Medium: { badge: "bg-yellow-50 text-yellow-700 border border-yellow-200", dot: "bg-yellow-400" },
  Low:    { badge: "bg-green-50 text-green-600 border border-green-200", dot: "bg-green-400" },
};

const STATUS_STYLES = {
  queued:    { badge: "bg-gray-100 text-gray-600", icon: "○" },
  running:   { badge: "bg-blue-100 text-blue-700", icon: "◌" },
  completed: { badge: "bg-green-100 text-green-700", icon: "●" },
  failed:    { badge: "bg-red-100 text-red-700", icon: "✕" },
};

const FILTER_TABS = [
  { key: "all",    label: "All" },
  { key: "High",   label: "High Priority" },
  { key: "Medium", label: "Medium Priority" },
  { key: "risk",   label: "At Risk" },
];

const EMPTY_FORM = {
  taskname: "",
  description: "",
  Timeline: "",
  Person: "",
  priority: "Medium",
  Dependencies: "",
  risk: false,
  status: "queued",
};

export default function TaskPanel({ projectName }) {
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expanded, setExpanded]         = useState({});

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState("");

  /* ── Fetch ── */
  const fetchTasks = async () => {
    try {
      const res  = await apiFetch(`task?projectName=${encodeURIComponent(projectName)}`);
      const data = await res.json();

      let taskArray = [];
      if (Array.isArray(data) && data[0]?.output) {
        taskArray = Object.entries(data[0].output).map(([key, val]) => ({
          id: key,
          ...val,
        }));
      } else if (Array.isArray(data)) {
        taskArray = data;
      }

      setTasks(taskArray);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  /* ── Filtering ── */
  const filtered = tasks.filter((t) => {
    if (activeFilter === "all")  return true;
    if (activeFilter === "risk") return t.risk === true;
    return t.priority === activeFilter;
  });

  const counts = {
    all:    tasks.length,
    High:   tasks.filter((t) => t.priority === "High").length,
    Medium: tasks.filter((t) => t.priority === "Medium").length,
    risk:   tasks.filter((t) => t.risk).length,
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ── Open Add modal ── */
  const openAdd = () => {
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setSaveError("");
    setModalOpen(true);
  };

  /* ── Open Edit modal ── */
  const openEdit = (task) => {
    setEditingTask(task);
    setFormData({
      taskname:     task.taskname ?? task.name ?? "",
      description:  task.description ?? "",
      Timeline:     task.Timeline ?? "",
      Person:       task.Person ?? "",
      priority:     task.priority ?? "Medium",
      Dependencies: Array.isArray(task.Dependencies)
        ? task.Dependencies.join(", ")
        : task.Dependencies ?? "",
      risk:   task.risk ?? false,
      status: task.status ?? "queued",
    });
    setSaveError("");
    setModalOpen(true);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!formData.taskname.trim()) {
      setSaveError("Task name is required.");
      return;
    }
    setSaving(true);
    setSaveError("");

    const payload = {
      ...formData,
      Dependencies: formData.Dependencies
        ? formData.Dependencies.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
      projectName,
      action: editingTask ? "edit" : "add",
      ...(editingTask ? { taskId: editingTask.id } : {}),
    };

    const endpoint = editingTask ? "task/update" : "task/create";

    try {
      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save task. Please try again.");

      // Optimistically update local state, then re-fetch for server truth
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...t, ...payload } : t
          )
        );
      } else {
        const newId = `task${Date.now()}`;
        setTasks((prev) => [...prev, { id: newId, ...payload }]);
      }

      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (taskId) => {
    // Optimistically remove from UI
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      const res = await apiFetch("task/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, projectName }),
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchTasks();
    } catch (err) {
      console.error("[handleDelete]", err.message);
      // Re-fetch to restore state if delete failed on server
      fetchTasks();
    }
  };

  const setField = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:text-orange-500 hover:border-orange-300 transition disabled:opacity-40"
          >
            <span className={`text-base ${loading ? "animate-spin inline-block" : ""}`}>↻</span>
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 shadow-md shadow-orange-200 transition-all"
          >
            <span className="text-lg leading-none">+</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${activeFilter === tab.key
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }
            `}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              activeFilter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm">Fetching tasks…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <span className="text-4xl">○</span>
          <p className="text-sm">No tasks found.</p>
          <button
            onClick={openAdd}
            className="mt-2 text-sm text-orange-500 hover:underline font-medium"
          >
            + Add your first task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              expanded={!!expanded[task.id]}
              onToggle={() => toggleExpand(task.id)}
              onEdit={() => openEdit(task)}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          isEdit={!!editingTask}
          formData={formData}
          setField={setField}
          saving={saving}
          saveError={saveError}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   Task Card
══════════════════════════════════════ */
function TaskCard({ task, expanded, onToggle, onEdit, onDelete }) {
  const priority  = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low;
  const statusKey = (task.status ?? "queued").toLowerCase();
  const status    = STATUS_STYLES[statusKey] ?? STATUS_STYLES.queued;

  return (
    <div className={`
      bg-white rounded-2xl border transition-all duration-200 group
      ${task.risk
        ? "border-red-200 shadow-sm shadow-red-50"
        : "border-gray-200 shadow-sm hover:shadow-md"
      }
    `}>
      <div className="p-5 flex items-start gap-4">

        <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${priority.dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="font-semibold text-gray-800 text-base leading-snug">
              {task.taskname ?? task.name}
            </h3>

            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {task.risk && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  ⚠ At Risk
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.badge}`}>
                {task.priority}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${status.badge}`}>
                {status.icon} {task.status ?? "queued"}
              </span>

              {/* Edit / Delete — appear on card hover */}
              <button
                onClick={onEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium flex items-center gap-1"
              >
                ✎ Edit
              </button>
              <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 font-medium"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
            {task.Person && (
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-[10px]">
                  {task.Person === "Unassigned" ? "?" : task.Person[0]}
                </span>
                {task.Person}
              </span>
            )}
            {task.Timeline && (
              <span className="flex items-center gap-1">
                🗓 {task.Timeline}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className="flex-shrink-0 text-gray-400 hover:text-orange-500 transition text-xl leading-none mt-0.5"
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4 bg-gray-50 rounded-b-2xl">
          {task.description && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
            </div>
          )}
          {task.Dependencies && task.Dependencies.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Dependencies</p>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(task.Dependencies) ? task.Dependencies : [task.Dependencies]).map((dep, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                    ↳ {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
          {task.message && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status Message</p>
              <p className="text-sm text-gray-600">{task.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   Task Modal (Add / Edit)
══════════════════════════════════════ */
function TaskModal({ isEdit, formData, setField, saving, saveError, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {isEdit ? "Edit Task" : "Add New Task"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? "Update the task details below" : "Fill in the details to create a new task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">

          <Field label="Task Name *">
            <input
              type="text"
              value={formData.taskname}
              onChange={(e) => setField("taskname", e.target.value)}
              placeholder="e.g. Implement login flow"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Assigned To">
              <input
                type="text"
                value={formData.Person}
                onChange={(e) => setField("Person", e.target.value)}
                placeholder="Name or Unassigned"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </Field>
            <Field label="Priority">
              <select
                value={formData.priority}
                onChange={(e) => setField("priority", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select
                value={formData.status}
                onChange={(e) => setField("status", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
              >
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </Field>
            <Field label="Timeline">
              <input
                type="text"
                value={formData.Timeline}
                onChange={(e) => setField("Timeline", e.target.value)}
                placeholder="e.g. By Wednesday"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </Field>
          </div>

          <Field label="Dependencies" hint="comma-separated">
            <input
              type="text"
              value={formData.Dependencies}
              onChange={(e) => setField("Dependencies", e.target.value)}
              placeholder="e.g. Design wireframes, Backend API"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </Field>

          {/* Risk toggle */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Mark as At Risk</p>
              <p className="text-xs text-gray-400">Flags this task with a risk warning</p>
            </div>
            <button
              onClick={() => setField("risk", !formData.risk)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                formData.risk ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                formData.risk ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          {saveError && (
            <p className="text-red-500 text-sm text-center">{saveError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 shadow-md shadow-orange-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}