import { Bell, Search, Menu } from "lucide-react";

export default function Header({ greetingName = "Arjun", dateLabel, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold text-slate-900 truncate">
              Good morning, {greetingName}
            </h1>
            <p className="text-xs text-slate-500 truncate">{dateLabel}</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-sm">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, people, meetings..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-25 focus:bg-white focus:border-ink-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <div className="h-9 w-9 rounded-full bg-ink-700 text-white flex items-center justify-center text-xs font-semibold">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
