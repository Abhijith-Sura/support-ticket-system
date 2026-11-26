const StatsCard = ({ title, value, subtitle, icon: Icon, colorClass = 'bg-indigo-50 text-indigo-600' }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
