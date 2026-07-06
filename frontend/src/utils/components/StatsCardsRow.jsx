import { Progress } from "@/Components/ui/progress";

// Singola card statistica: icona + valore in evidenza + etichetta
export const StatCard = ({ icon, iconColor = "text-blue-600", bgIcon = "bg-blue-100", label, value, className = "", onClick, active = false, activeClass = "border-slate-400 ring-2 ring-slate-300 ring-offset-1 dark:border-slate-500 dark:ring-slate-600" }) => {
  const Icon = icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all
        ${onClick ? "cursor-pointer hover:border-muted-foreground/40" : ""}
        ${active ? activeClass : "border-border"}
        ${className}`}
    >
      {Icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgIcon}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-2xl leading-tight font-bold text-foreground">{value}</div>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

// Card statistica con barra di completamento 
export const CompletionStatCard = ({ icon, iconColor = "text-emerald-600", bgIcon = "bg-emerald-100", label, value, progress, className = "", onClick, active = false }) => {
  const Icon = icon;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all
        ${onClick ? "cursor-pointer hover:border-muted-foreground/40" : ""}
        ${active ? "border-slate-400 ring-2 ring-slate-300 ring-offset-1 dark:border-slate-500 dark:ring-slate-600" : "border-border"}
        ${className}`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgIcon}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />

          </div>
        )}
        <div className="min-w-0">
          <div className="text-2xl leading-tight font-bold text-foreground">{value}</div>
          <p className="truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      {typeof progress === "number" && (
        <Progress value={progress} className="h-1.5 bg-muted [&>div]:bg-emerald-500" />
      )}
    </div>
  );
};

// Riga di card statistiche, con eventuale card di completamento più larga in coda
const StatsCardsRow = ({ stats = [], completion, className = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", }) => (
  <div className={className}>
    {stats.map((stat, index) => (
      <StatCard key={stat.label ?? index} {...stat} />
    ))}
    {completion && <CompletionStatCard {...completion} />}
  </div>
);

export default StatsCardsRow;
