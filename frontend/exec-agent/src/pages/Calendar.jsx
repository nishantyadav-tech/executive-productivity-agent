import { useEffect, useState } from "react";
import CalendarTimeline from "../components/CalendarTimeline";

import { getCalendar } from "../services/api";

export default function Calendar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCalendar().then(setData);
  }, []);

  if (!data) {
    return <div className="p-8 text-sm text-slate-400">Loading calendar...</div>;
  }

  const { today, todayEvents, weekSchedule } = data;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Calendar</h1>
        <p className="text-sm text-slate-500 mt-1">{today.label}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {weekSchedule.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl2 border p-4 ${
              day.isToday ? "border-ink-700 bg-azure-50" : "border-slate-100 bg-white"
            } shadow-card`}
          >
            <p className={`text-xs font-semibold ${day.isToday ? "text-ink-700" : "text-slate-500"}`}>
              {day.day}
            </p>
            <p className="text-xs text-slate-400 mb-3">{day.date}</p>
            <div className="space-y-2.5">
              {day.events.length === 0 ? (
                <p className="text-xs text-slate-300">No meetings</p>
              ) : (
                day.events.map((e) => (
                  <div key={e.id}>
                    <p
                      className={`text-xs font-medium ${
                        e.highlight ? "text-forest-600" : "text-slate-700"
                      }`}
                    >
                      {e.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{e.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-900 mb-3.5">Today's timeline</h2>
        <CalendarTimeline events={todayEvents} />
      </section>
    </div>
  );
}
