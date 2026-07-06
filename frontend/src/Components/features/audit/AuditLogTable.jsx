import { Info, Activity } from "lucide-react";
import { TableCell, TableRow } from "@/Components/ui/table";
import StandardTable from "@/utils/components/StandardTable";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getOutcomeBadgeClass, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";
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
  item.project_name ? { label: "Progetto", value: uppercaseFirstLetter(item.project_name) } : null,
  item.checklist_name ? { label: "Checklist", value: uppercaseFirstLetter(item.checklist_name) } : null,
  item.task_description ? { label: "Task", value: uppercaseFirstLetter(item.task_description) } : null,
].filter(Boolean);

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

          <TableCell className="px-4 py-3 text-center">
            {(contextParts.length > 0 || outcome != null) && (
              <div className="mb-2 flex flex-wrap items-start justify-center gap-3">
                {contextParts.map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
                    <span className="text-xs font-semibold text-foreground">{value}</span>
                  </div>
                ))}
                {outcome != null && (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Esito</span>
                    <span className={`rounded-md px-1.5 text-xs font-semibold ${getOutcomeBadgeClass(outcome)}`}>
                      {resolveDetailValue("outcome", outcome, item)}
                    </span>
                  </div>
                )}
              </div>
            )}
            {Object.entries(restDetails).length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {Object.entries(restDetails).map(([key, value]) => {
                  const field = detailFieldMap[key] ?? { label: key };
                  return (
                    <span key={key} className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs">
                      <span className="font-medium text-muted-foreground">{field.label}:</span>
                      <span className="rounded-md px-1.5 font-semibold bg-muted text-foreground">
                        {resolveDetailValue(key, value, item)}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : contextParts.length === 0 && outcome == null ? (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                Nessun dettaglio
              </div>
            ) : null}
          </TableCell>
        </TableRow>
      );
    }}
  />
);

export default AuditLogTable;
