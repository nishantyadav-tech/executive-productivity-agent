import { useEffect, useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";
import { getTasks } from "../services/api";

const FILTERS = ["All", "Today", "Pending", "Completed", "High Priority"];

export default function MyActions() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t
      )
    );
  };

  const filtered = useMemo(() => {
    switch (filter) {
      case "Today":
        return tasks.filter((t) => t.dueBucket === "today");
      case "Pending":
        return tasks.filter((t) => t.status === "Pending");
      case "Completed":
        return tasks.filter((t) => t.status === "Completed");
      case "High Priority":
        return tasks.filter((t) => t.priority === "High");
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">My Actions</h1>
        <p className="text-sm text-slate-500 mt-1">Everything the agent has attributed to you.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filter === f
                ? "bg-ink-700 text-white border-ink-700"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No actions match this filter"
          description="Try a different filter or check back after the agent processes new sources."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onToggleStatus={toggleStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
