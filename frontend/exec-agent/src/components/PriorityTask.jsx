import { CalendarClock, ArrowRight } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./Badge";
import SourceBadge from "./SourceBadge";

export default function PriorityTask({ task }) {
  return (
    <div className="bg-white rounded-xl2 border border-slate-100 shadow-card p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">{task.description}</p>
        </div>
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

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarClock size={13} className="text-slate-400" />
            {task.deadline}
          </span>
          {task.recipient && (
            <span className="flex items-center gap-1.5">
              {task.owner} <ArrowRight size={11} /> {task.recipient}
            </span>
          )}
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
        <button className="text-xs font-medium text-ink-700 bg-azure-50 hover:bg-azure-100 px-3 py-1.5 rounded-lg transition-colors shrink-0">
          View details
        </button>
      </div>
    </div>
  );
}
