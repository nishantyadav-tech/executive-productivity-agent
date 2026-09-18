import { CheckCircle2 } from "lucide-react";

const TYPE_DOT = {
  internal: "bg-slate-300",
  "1:1": "bg-ink-500",
  external: "bg-forest-500",
};

export default function CalendarTimeline({ events }) {
  return (
    <div className="bg-white rounded-xl2 border border-slate-100 shadow-card p-5">
      <ol className="space-y-0">
        {events.map((event, idx) => (
          <li key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={`h-2.5 w-2.5 rounded-full mt-1.5 ${TYPE_DOT[event.type] || "bg-slate-300"}`} />
              {idx !== events.length - 1 && <span className="w-px flex-1 bg-slate-100 my-1" />}
            </div>
            <div className={`pb-5 ${idx === events.length - 1 ? "pb-0" : ""}`}>
              <p className="text-xs text-slate-400 font-medium">{event.time}</p>
              <p className="text-sm text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                {event.title}
                {event.confirmed && (
                  <span className="inline-flex items-center gap-1 text-forest-600 text-xs font-normal">
                    <CheckCircle2 size={12} /> Confirmed
                  </span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
