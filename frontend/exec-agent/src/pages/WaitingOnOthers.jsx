import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";
import { getWaitingOnOthers } from "../services/api";

export default function WaitingOnOthers() {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    getWaitingOnOthers().then(setTasks);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Waiting on Others</h1>
        <p className="text-sm text-slate-500 mt-1">
          Commitments that depend on someone else before you can move forward.
        </p>
      </div>

      {tasks === null ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={Clock} title="You're not waiting on anyone right now" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
