import { Sparkles } from "lucide-react";

export default function SuggestedQuestion({ question, onClick }) {
  return (
    <button
      onClick={() => onClick(question)}
      className="flex items-center gap-2 text-left text-sm text-slate-700 bg-white border border-slate-100 shadow-card rounded-lg px-4 py-3 hover:border-ink-500 hover:text-ink-700 transition-colors"
    >
      <Sparkles size={14} className="text-ink-500 shrink-0" />
      {question}
    </button>
  );
}
