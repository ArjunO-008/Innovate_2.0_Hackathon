import { useEffect, useState } from "react";

export default function TaskPanel({ projectName }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `https://ieee.anjoostech.cfd/webhook-test/tasks?projectName=${projectName}`
      );
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
     
    fetchTasks();
    const interval = setInterval(fetchTasks, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Background Tasks</h2>

      {loading ? (
        <p className="text-gray-500">Fetching tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No background tasks started yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id ?? task.name} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Task Card ---------- */
function TaskCard({ task }) {
  return (
    <div className="border rounded-lg p-3 flex items-start justify-between gap-2 bg-white shadow-sm">
      <div>
        <p className="font-medium text-sm">{task.name}</p>
        {task.message && (
          <p className="text-xs text-gray-500 mt-1">{task.message}</p>
        )}
      </div>
      <StatusBadge status={task.status} />
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ status }) {
  const styles = {
    queued: "bg-gray-200 text-gray-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}