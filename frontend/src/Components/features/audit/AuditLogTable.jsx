import { Info, Activity, FolderKanban, ListChecks, ClipboardList, CircleDot, CalendarClock } from "lucide-react";
import { TableCell, TableRow } from "@/Components/ui/table";
import StandardTable from "@/utils/components/StandardTable";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getOutcomeBadgeClass, getRoleInfo, formatProjectDate, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";
import { parseStrDetails } from "@/utils/helpers/parseStrDetails";
import { auditActions, detailFieldMap } from "@/utils/helpers/auditActions";
import { resolveDetailValue } from "@/utils/helpers/auditDetailValue";

const HEADERS = [
  { key: "when", label: "Data e Ora", className: "text-center font-semibold text-foreground px-4 py-3" },
  { key: "user", label: "Utente", className: "text-center font-semibold text-foreground px-4 py-3" },
  { key: "action", label: "Azione", className: "text-center font-semibold text-foreground px-4 py-3" },
  { key: "details", label: "Dettagli", className: "text-center font-semibold text-foreground px-4 py-3" },
];

// contesto gerarchico Progetto/Checklist/Task: array di blocchi label+valore

const buildContextParts = (item) => [
  item.project_name ? { label: "Progetto", value: uppercaseFirstLetter(item.project_name), icon: FolderKanban } : null,
  item.checklist_name ? { label: "Checklist", value: uppercaseFirstLetter(item.checklist_name), icon: ListChecks } : null,
  item.task_description ? { label: "Task", value: uppercaseFirstLetter(item.task_description), icon: ClipboardList } : null,
].filter(Boolean);


// (verde=attivo, arancione=in pausa, rosso=bloccato/eliminato, blu=aggiornato)
const STATUS_BADGE_MAP = {
  "attivo": "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  "in corso": "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  "completato": "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  "completata": "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  "in pausa": "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  "non iniziato": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  "todo": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  "archiviata": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  "bloccata": "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  "bloccato": "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  "eliminato": "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  "eliminata": "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  "aggiornato": "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
};

// riconosce sia i ruoli (riusa la palette già esistente altrove nell'app) sia le parole
// di stato sopra; nessun match -> niente badge, resta testo semplice (fallback sicuro)
const getValueBadgeClass = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["user", "admin", "superadmin"].includes(normalized)) {
    return getRoleInfo(value).className;
  }
  return STATUS_BADGE_MAP[normalized] ?? null;
};

const DATE_DETAIL_KEYS = new Set(["deadline", "newDeadline"]);

// singolo campo della griglia: etichetta piccola maiuscola + valore in grassetto,
// o badge colorato al posto del valore quando riconosciuto come stato/ruolo.
// badgeClassOverride copre i casi con una palette dedicata già esistente (es. Esito).
const DetailField = ({ label, value, icon: Icon, badgeClassOverride }) => {
  const badgeClass = badgeClassOverride ?? getValueBadgeClass(value);
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        {label}
      </span>
      {badgeClass ? (
        <span className={`inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-xs font-bold ${badgeClass}`}>
          {value}
        </span>
      ) : (
        <span className="truncate text-sm font-bold text-foreground" title={String(value ?? "")}>
          {value}
        </span>
      )}
    </div>
  );
};

// Tabella audit log riutilizzabile: usata sia dall'anteprima nella dashboard
// superadmin sia dalla pagina dedicata /admin/audit-log.
const AuditLogTable = ({ activities = [], currentUserId, emptyMessage = "Nessuna attività da visualizzare.", containerClass = "" }) => (
  <StandardTable
    containerClass={containerClass}
    headers={HEADERS}
    data={activities}
    emptyMessage={emptyMessage}
    emptyIcon={Activity}
    renderRow={(item) => {
      const rawDetails = parseStrDetails(item.details);

      const { outcome, ...restDetails } = Object.fromEntries(
        Object.entries(rawDetails).filter(([key]) => key !== "checklistId" && key !== "templateId" && key !== "itemId" && key !== "sessionId"),
      );
      const contextParts = buildContextParts(item);
      const action = auditActions[item.action];
      const Icon = action?.icon || Activity;
      const isCurrentUser = currentUserId != null && currentUserId === item.user_id;

      // un unico elenco di campi da mostrare in griglia: contesto (dove) prima, poi
      // l'esito se presente, poi il resto dei dettagli così come arrivano
      const fields = [
        ...contextParts,
        ...(outcome != null ? [{ label: "Esito", value: resolveDetailValue("outcome", outcome, item), icon: CircleDot, badgeClassOverride: getOutcomeBadgeClass(outcome) }] : []),
        ...Object.entries(restDetails).map(([key, value]) => {
          const field = detailFieldMap[key] ?? { label: key };
          const isDate = DATE_DETAIL_KEYS.has(key);
          return {
            label: field.label,
            value: isDate ? formatProjectDate(value) : resolveDetailValue(key, value, item),
            icon: isDate ? CalendarClock : undefined,
          };
        }),
      ];

      return (
        <TableRow
          key={item.id}
          className={`hover:bg-muted/60 ${isCurrentUser ? "bg-emerald-50/60 dark:bg-emerald-500/10" : ""}`}
        >
          <TableCell className="px-4 py-3 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-foreground">
                {new Date(item.timestamp).toLocaleDateString("it-IT", { dateStyle: "medium" })}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          </TableCell>

          <TableCell className="px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <UserAvatar user={item} size="sm" />
              <span className="text-sm font-semibold text-foreground">
                {getFullName(item)}
                {isCurrentUser ? <span className="font-normal text-muted-foreground"> (tu)</span> : ""}
              </span>
            </div>
          </TableCell>

          <TableCell className="px-4 py-3 text-center">
            <div className="flex justify-center">
              <div className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${action?.bgColor ?? "bg-muted"} ${action?.color ?? "text-foreground"}`}>
                <Icon className="h-3.5 w-3.5" />
                {action?.label ?? item.action}
              </div>
            </div>
          </TableCell>

          <TableCell className="px-4 py-3">
            {fields.length > 0 ? (
              <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm sm:grid-cols-3">
                {fields.map((f, idx) => (
                  <DetailField key={`${f.label}-${idx}`} label={f.label} value={f.value} icon={f.icon} badgeClassOverride={f.badgeClassOverride} />
                ))}
              </div>
            ) : (
              <div className="mx-auto flex w-fit items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                Nessun dettaglio
              </div>
            )}
          </TableCell>
        </TableRow>
      );
    }}
  />
);

export default AuditLogTable;
