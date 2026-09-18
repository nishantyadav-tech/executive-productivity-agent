const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Waiting: "bg-azure-50 text-ink-700",
  Scheduled: "bg-azure-50 text-ink-700",
  Received: "bg-forest-50 text-forest-600",
  Completed: "bg-forest-50 text-forest-600",
  Unassigned: "bg-rose-50 text-rose-600",
};

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cls = PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {priority} priority
    </span>
  );
}
