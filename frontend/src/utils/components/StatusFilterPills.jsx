const pillClass = (isActive) =>
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
    isActive
      ? "bg-foreground text-background"
      : "bg-muted text-muted-foreground hover:bg-muted/70"
  }`;

const countClass = (isActive) =>
  `rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums ${
    isActive ? "bg-background/20 text-background" : "bg-card text-muted-foreground"
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
