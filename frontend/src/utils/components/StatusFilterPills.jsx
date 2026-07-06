const pillClass = (isActive) =>
  `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
    isActive ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
  }`;

const countClass = (isActive) =>
  `rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums ${
    isActive ? "bg-white/20 text-white" : "bg-white text-slate-500"
  }`;

const StatusFilterPills = ({
  filters = [],
  active = "all",
  onChange,
  allLabel = "Tutti",
  totalCount,
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <button type="button" onClick={() => onChange?.("all")} className={pillClass(active === "all")}>
      {allLabel}
      {totalCount != null && <span className={countClass(active === "all")}>{totalCount}</span>}
    </button>

    {filters.map(({ value, label, count }) => {
      const isActive = active === value;
      return (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(isActive ? "all" : value)}
          className={pillClass(isActive)}
        >
          {label ?? value}
          {count != null && <span className={countClass(isActive)}>{count}</span>}
        </button>
      );
    })}
  </div>
);

export default StatusFilterPills;
