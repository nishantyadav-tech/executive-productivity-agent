import { useEffect, useState } from "react";
import { Mail, CalendarDays, FileText, Mic, X } from "lucide-react";
import { getSources } from "../services/api";

const ICONS = {
  Emails: Mail,
  Calendar: CalendarDays,
  "Meeting Transcripts": FileText,
  "Voice Notes": Mic,
};

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState(null);

  useEffect(() => {
    getSources().then(setSources);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Sources</h1>
        <p className="text-sm text-slate-500 mt-1">
          What the agent reads to build your brief, actions and answers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sources.map((src) => {
          const Icon = ICONS[src.type] || FileText;
          return (
            <div key={src.id} className="bg-white rounded-xl2 border border-slate-100 shadow-card p-5">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-azure-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-ink-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{src.type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{src.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>{src.records} records</span>
                    <span>Processed {src.lastProcessed}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveSource(src)}
                className="mt-4 w-full text-xs font-medium text-ink-700 bg-azure-50 hover:bg-azure-100 rounded-lg py-2 transition-colors"
              >
                View details
              </button>
            </div>
          );
        })}
      </div>

      {activeSource && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 flex items-center justify-center p-4"
          onClick={() => setActiveSource(null)}
        >
          <div
            className="bg-white rounded-xl2 shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{activeSource.type}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeSource.records} records · processed {activeSource.lastProcessed}
                </p>
              </div>
              <button
                onClick={() => setActiveSource(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5">
              {activeSource.sample.map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3">
                  <p className="text-sm text-slate-800 font-medium">{item.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.from} · {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
