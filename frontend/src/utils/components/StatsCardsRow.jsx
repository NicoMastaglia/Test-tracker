import { Progress } from "@/Components/ui/progress";

// Mappa colore semantico → classi (light+dark) per l'icona delle stat-card.
// Un solo punto da aggiornare invece di ripetere "bg-X-100 text-X-600" (senza
// variante dark:) in ogni dashboard/sezione che mostra una stat-card.
const STAT_COLOR_CLASSES = {
  green: { bg: "bg-green-100 dark:bg-green-500/15", icon: "text-green-600 dark:text-green-400" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-500/15", icon: "text-emerald-600 dark:text-emerald-400" },
  blue: { bg: "bg-blue-100 dark:bg-blue-500/15", icon: "text-blue-600 dark:text-blue-400" },
  amber: { bg: "bg-amber-100 dark:bg-amber-500/15", icon: "text-amber-600 dark:text-amber-400" },
  violet: { bg: "bg-violet-100 dark:bg-violet-500/15", icon: "text-violet-600 dark:text-violet-400" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-500/15", icon: "text-indigo-600 dark:text-indigo-400" },
  red: { bg: "bg-red-100 dark:bg-red-500/15", icon: "text-red-600 dark:text-red-400" },
};

// riusabile anche fuori da questo file (es. ProjectOverviewSection) per non duplicare la mappa
export const getStatColorClasses = (color) => STAT_COLOR_CLASSES[color] ?? STAT_COLOR_CLASSES.blue;

// Singola card statistica: icona + valore in evidenza + etichetta
// `color` (semantico, es. "emerald") ha la precedenza su iconColor/bgIcon (classi
// Tailwind grezze, mantenute solo per compatibilità con eventuali usi non ancora migrati)
export const StatCard = ({ icon, color, iconColor, bgIcon, label, value, className = "", onClick, active = false, activeClass = "border-slate-400 ring-2 ring-slate-300 ring-offset-1 dark:border-slate-500 dark:ring-slate-600" }) => {
  const Icon = icon;
  const resolved = color ? getStatColorClasses(color) : null;
  const resolvedIconColor = resolved?.icon ?? iconColor ?? "text-blue-600";
  const resolvedBgIcon = resolved?.bg ?? bgIcon ?? "bg-blue-100";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all
        ${onClick ? "cursor-pointer hover:border-muted-foreground/40" : ""}
        ${active ? activeClass : "border-border"}
        ${className}`}
    >
      {Icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${resolvedBgIcon}`}>
          <Icon className={`h-6 w-6 ${resolvedIconColor}`} />
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
export const CompletionStatCard = ({ icon, color, iconColor, bgIcon, label, value, progress, className = "", onClick, active = false }) => {
  const Icon = icon;
  const resolved = color ? getStatColorClasses(color) : null;
  const resolvedIconColor = resolved?.icon ?? iconColor ?? "text-emerald-600";
  const resolvedBgIcon = resolved?.bg ?? bgIcon ?? "bg-emerald-100";

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
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${resolvedBgIcon}`}>
            <Icon className={`h-6 w-6 ${resolvedIconColor}`} />

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
