import { Progress } from "@/Components/ui/progress";

// Singola card statistica: icona + valore in evidenza + etichetta
export const StatCard = ({ icon, iconColor = "text-blue-600", bgIcon = "bg-blue-100", label, value, className = "", onClick, active = false, activeClass = "border-slate-400 ring-2 ring-slate-300 ring-offset-1" }) => {
  const Icon = icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all
        ${onClick ? "cursor-pointer hover:border-slate-300" : ""}
        ${active ? activeClass : "border-slate-200"}
        ${className}`}
    >
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgIcon}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-xl leading-tight font-bold text-slate-900">{value}</div>
        <p className="truncate text-xs text-slate-500">{label}</p>
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
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all
        ${onClick ? "cursor-pointer hover:border-slate-300" : ""}
        ${active ? "border-slate-400 ring-2 ring-slate-300 ring-offset-1" : "border-slate-200"}
        ${className}`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgIcon}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          
          </div>
        )}
        <div className="min-w-0">
          <div className="text-xl leading-tight font-bold text-slate-900">{value}</div>
          <p className="truncate text-xs text-slate-500">{label}</p>
        </div>
      </div>

      {typeof progress === "number" && (
        <Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
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
