
// Header descrittivo riutilizzabile: icona + titolo + badge + descrizione,
// azioni opzionali in alto a destra e footer opzionale
const EntityHeaderCard = ({
  icon: Icon,
  iconClassName = "bg-emerald-50 border border-emerald-100/50 text-emerald-600",
  title,
  badge,
  description,
  actions,
  footer,
  children,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Blocco sinistro: icona + titolo/badge/descrizione */}
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
                <Icon className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
                {badge}
              </div>

              {description && (
                <div className="text-sm text-slate-400 font-medium">{description}</div>
              )}
            </div>
          </div>

          {/* Blocco destro: azioni (es. Modifica / menu ⋮) */}
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>

        {children}
      </div>

      {footer}
    </div>
  );
};

export default EntityHeaderCard;
