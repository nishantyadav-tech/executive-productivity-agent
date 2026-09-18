import { CalendarClock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./Badge";
import SourceBadge from "./SourceBadge";

const PRIORITY_ACCENT = {
  High: "before:bg-rose-500",
  Medium: "before:bg-amber-500",
  Low: "before:bg-slate-300",
};

export default function TaskCard({ task, onToggleStatus }) {
  const accent = PRIORITY_ACCENT[task.priority] || "before:bg-slate-300";
  const isCompleted = task.status === "Completed";

  return (
    <div
      className={`relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl2 ${accent} bg-white rounded-xl2 border border-slate-100 shadow-card p-5 pl-6`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`text-sm font-semibold text-slate-900 ${isCompleted ? "line-through text-slate-400" : ""}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {task.isOverdue && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600">
              Overdue
            </span>
          )}
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{task.description}</p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarClock size={13} className="text-slate-400" />
          {task.deadline}
        </span>
        {(task.recipient || task.waitingOn) && (
          <span className="flex items-center gap-1.5">
            <User size={13} className="text-slate-400" />
            {task.owner} <ArrowRight size={11} /> {task.recipient || task.waitingOn}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5">
        <div className="flex flex-wrap gap-1.5">
          {task.sources.map((s) => (
            <SourceBadge key={s} label={s} />
          ))}
        </div>
        {task.mergedFrom > 1 && (
          <span className="text-[11px] text-slate-400 italic">
            Deduplicated · merged from {task.mergedFrom} sources
          </span>
        )}
      </div>

      {onToggleStatus && (
        <div className="mt-4 pt-3.5 border-t border-slate-50 flex justify-end">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isCompleted
                ? "text-slate-500 hover:bg-slate-50"
                : "text-forest-600 bg-forest-50 hover:bg-forest-100"
            }`}
          >
            <CheckCircle2 size={14} />
            {isCompleted ? "Mark as pending" : "Mark as done"}
          </button>
        </div>
      )}
    </div>
  );
}
