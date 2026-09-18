import {
  LayoutDashboard,
  ListChecks,
  Clock,
  CalendarDays,
  Database,
  MessageSquareText,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "brief", label: "Executive Brief", icon: LayoutDashboard },
  { key: "actions", label: "My Actions", icon: ListChecks },
  { key: "waiting", label: "Waiting on Others", icon: Clock },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "sources", label: "Sources", icon: Database },
  { key: "ask", label: "Ask Agent", icon: MessageSquareText },
];

export default function Sidebar({ activePage, onNavigate, variant = "desktop" }) {
  const asideClass =
    variant === "mobile"
      ? "flex flex-col w-full h-full bg-white"
      : "hidden md:flex md:flex-col md:w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-100";

  return (
    <aside className={asideClass}>
      {variant === "desktop" && (
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-100">
        <div className="h-8 w-8 rounded-lg bg-ink-700 flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">AIONOS</p>
          <p className="text-[11px] text-slate-500">Executive Agent</p>
        </div>
      </div>
      )}

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-azure-50 text-ink-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={2} className={isActive ? "text-ink-700" : "text-slate-400"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => onNavigate("settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <div className="h-9 w-9 rounded-full bg-ink-700 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">Arjun Malhotra</p>
            <p className="text-xs text-slate-500 truncate">VP Sales</p>
          </div>
          <Settings size={16} className="text-slate-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
