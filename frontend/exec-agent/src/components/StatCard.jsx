const TONE_STYLES = {
  ink: { bg: "bg-azure-50", icon: "text-ink-700" },
  forest: { bg: "bg-forest-50", icon: "text-forest-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600" },
};

export default function StatCard({ icon: Icon, label, value, description, tone = "ink" }) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.ink;
  return (
    <div className="bg-white rounded-xl2 border border-slate-100 shadow-card p-5 flex items-start gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${styles.bg}`}>
        <Icon size={20} className={styles.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-900 leading-none">{value}</p>
        <p className="text-sm font-medium text-slate-700 mt-1.5">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
