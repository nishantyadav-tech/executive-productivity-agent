import { useEffect, useState } from "react";
import { ListChecks, Clock, CalendarClock, AlertTriangle, ArrowRight } from "lucide-react";
import StatCard from "../components/StatCard";
import PriorityTask from "../components/PriorityTask";
import TaskCard from "../components/TaskCard";
import CalendarTimeline from "../components/CalendarTimeline";
import EmptyState from "../components/EmptyState";
import { getDailyBrief } from "../services/api";

export default function ExecutiveBrief({ onNavigate }) {
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    getDailyBrief().then(setBrief);
  }, []);

  if (!brief) {
    return <div className="p-8 text-sm text-slate-400">Loading executive brief...</div>;
  }

  const { stats, priorityActions, waitingOnOthers, unclearOwnership, todayEvents } = brief;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={ListChecks}
          label="My Actions"
          value={stats.myActions}
          description="Tasks you own right now"
          tone="ink"
        />
        <StatCard
          icon={Clock}
          label="Waiting on Others"
          value={stats.waitingOnOthers}
          description="Blocked on someone else"
          tone="ink"
        />
        <StatCard
          icon={CalendarClock}
          label="Overdue / At Risk"
          value={stats.overdue}
          description="Past their committed deadline"
          tone="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Unclear Ownership"
          value={stats.unclearOwnership}
          description="Needs confirmation, not assumption"
          tone="rose"
        />
      </section>

      {/* Priority actions */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-slate-900">Priority actions</h2>
          <button
            onClick={() => onNavigate("actions")}
            className="text-xs font-medium text-ink-700 flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {priorityActions.map((task) => (
            <PriorityTask key={task.id} task={task} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waiting on others */}
        <section>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-semibold text-slate-900">Waiting on others</h2>
            <button
              onClick={() => onNavigate("waiting")}
              className="text-xs font-medium text-ink-700 flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {waitingOnOthers.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* Attention required */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3.5">Attention required</h2>
          {unclearOwnership.length === 0 ? (
            <EmptyState icon={AlertTriangle} title="Nothing needs attention" />
          ) : (
            <div className="space-y-3">
              {unclearOwnership.map((task) => (
                <div
                  key={task.id}
                  className="bg-rose-50 border border-rose-100 rounded-xl2 p-5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-rose-600">Unclear ownership</p>
                      <p className="text-sm text-slate-800 font-medium mt-1">{task.title}</p>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{task.description}</p>
                      <p className="text-xs text-slate-500 mt-2.5">Deadline: {task.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Today's calendar */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-slate-900">Today's calendar</h2>
          <button
            onClick={() => onNavigate("calendar")}
            className="text-xs font-medium text-ink-700 flex items-center gap-1 hover:underline"
          >
            Full week <ArrowRight size={12} />
          </button>
        </div>
        <CalendarTimeline events={todayEvents} />
      </section>
    </div>
  );
}
