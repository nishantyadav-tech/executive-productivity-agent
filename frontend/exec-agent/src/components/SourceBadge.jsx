import { Mail, CalendarDays, FileText, Mic } from "lucide-react";

const ICONS = {
  Email: Mail,
  "Vendor List Email": Mail,
  "Expense Report Email": Mail,
  Calendar: CalendarDays,
  "Meeting Transcript": FileText,
  "Leadership Sync": FileText,
  "Voice Note": Mic,
  "Voice Note 1": Mic,
};

export default function SourceBadge({ label }) {
  const Icon = ICONS[label] || FileText;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-xs text-slate-600">
      <Icon size={12} className="text-slate-400" />
      {label}
    </span>
  );
}
