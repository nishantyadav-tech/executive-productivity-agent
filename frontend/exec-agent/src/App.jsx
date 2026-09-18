import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ExecutiveBrief from "./pages/ExecutiveBrief";
import MyActions from "./pages/MyActions";
import WaitingOnOthers from "./pages/WaitingOnOthers";
import Calendar from "./pages/Calendar";
import Sources from "./pages/Sources";
import AskAgent from "./pages/AskAgent";
import { getCalendar } from "./services/api";

const PAGES = {
  brief: { component: ExecutiveBrief },
  actions: { component: MyActions },
  waiting: { component: WaitingOnOthers },
  calendar: { component: Calendar },
  sources: { component: Sources },
  ask: { component: AskAgent },
};

export default function App() {
  const [activePage, setActivePage] = useState("brief");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState("Friday, 25 September 2026");

  useEffect(() => {
    getCalendar()
      .then((data) => setDateLabel(data.today.label))
      .catch(() => {});
  }, []);

  const handleNavigate = (key) => {
    if (key === "settings") return; // placeholder for a future settings page
    setActivePage(key);
    setMobileNavOpen(false);
  };

  const ActiveComponent = PAGES[activePage]?.component || ExecutiveBrief;

  return (
    <div className="flex min-h-screen bg-slate-25">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 bg-white">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <button onClick={() => setMobileNavOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>
            <Sidebar activePage={activePage} onNavigate={handleNavigate} variant="mobile" />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Header greetingName="Arjun" dateLabel={dateLabel} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1">
          <ActiveComponent onNavigate={handleNavigate} />
        </main>
      </div>
    </div>
  );
}
