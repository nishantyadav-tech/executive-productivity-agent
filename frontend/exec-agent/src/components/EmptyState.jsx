export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-xl2 border border-dashed border-slate-200">
      {Icon && (
        <div className="h-11 w-11 rounded-lg bg-slate-50 flex items-center justify-center mb-3">
          <Icon size={20} className="text-slate-400" />
        </div>
      )}
      <p className="text-sm font-medium text-slate-800">{title}</p>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
