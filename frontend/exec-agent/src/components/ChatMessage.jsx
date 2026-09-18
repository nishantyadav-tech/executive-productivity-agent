import SourceBadge from "./SourceBadge";

export default function ChatMessage({ role, text, sources }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xl ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div
          className={`rounded-xl2 px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-ink-700 text-white rounded-br-sm"
              : "bg-white border border-slate-100 shadow-card text-slate-800 rounded-bl-sm"
          }`}
        >
          {text}
        </div>
        {!isUser && sources && sources.length > 0 && (
          <div className="pl-1">
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">Sources used</p>
            <div className="flex flex-wrap gap-1.5">
              {sources.map((s) => (
                <SourceBadge key={s} label={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
