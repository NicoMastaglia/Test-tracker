import { Info, Activity } from "lucide-react";
import { TableCell, TableRow } from "@/Components/ui/table";
import StandardTable from "@/utils/components/StandardTable";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getOutcomeBadgeClass, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";
import { parseStrDetails } from "@/utils/helpers/parseStrDetails";
import { auditActions, detailFieldMap } from "@/utils/helpers/auditActions";
import { resolveDetailValue } from "@/utils/helpers/auditDetailValue";

const HEADERS = [
  { key: "when", label: "Data e Ora", className: "text-center font-semibold text-slate-900 px-4 py-3" },
  { key: "user", label: "Utente", className: "text-center font-semibold text-slate-900 px-4 py-3" },
  { key: "action", label: "Azione", className: "text-center font-semibold text-slate-900 px-4 py-3" },
  { key: "details", label: "Dettagli", className: "text-center font-semibold text-slate-900 px-4 py-3" },
];

// costruisce la stringa di contesto gerarchico: Progetto → Checklist → Task
const buildContext = (item) => {
  const parts = [
    item.project_name ? `Progetto: ${uppercaseFirstLetter(item.project_name)}` : null,
    item.checklist_name ? `Checklist: ${uppercaseFirstLetter(item.checklist_name)}` : null,
    item.task_description ? `Task: ${uppercaseFirstLetter(item.task_description)}` : null,
  ].filter(Boolean);
  return parts.join(" → ");
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
      // checklistId/templateId/itemId sono id grezzi ridondanti: i nomi leggibili
      // arrivano già pronti dal BE in checklist_name/project_name/task_description.
      const details = Object.fromEntries(
        Object.entries(rawDetails).filter(([key]) => key !== "checklistId" && key !== "templateId" && key !== "itemId"),
      );
      const context = buildContext(item);
      const action = auditActions[item.action];
      const Icon = action?.icon || Activity;
      const isCurrentUser = currentUserId != null && currentUserId === item.user_id;

      return (
        <TableRow
          key={item.id}
          className={`hover:bg-slate-50/60 ${isCurrentUser ? "bg-emerald-50/60" : ""}`}
        >
          <TableCell className="px-4 py-2.5 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-900">
                {new Date(item.timestamp).toLocaleDateString("it-IT", { dateStyle: "medium" })}
              </span>
              <span className="text-xs text-slate-600">
                {new Date(item.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          </TableCell>

          <TableCell className="px-4 py-2.5 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <UserAvatar user={item} size="sm" />
              <span className="text-sm font-semibold text-slate-900">
                {getFullName(item)}
                {isCurrentUser ? <span className="font-normal text-slate-500"> (tu)</span> : ""}
              </span>
            </div>
          </TableCell>

          <TableCell className="px-4 py-2.5 text-center">
            <div className="flex justify-center">
              <div className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${action?.bgColor ?? "bg-slate-100"} ${action?.color ?? "text-slate-700"}`}>
                <Icon className="h-3.5 w-3.5" />
                {action?.label ?? item.action}
              </div>
            </div>
          </TableCell>

          <TableCell className="px-4 py-2.5 text-center">
            {context && (
              <p className="mb-1.5 text-xs font-medium text-slate-600">{context}</p>
            )}
            {Object.entries(details).length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {Object.entries(details).map(([key, value]) => {
                  const field = detailFieldMap[key] ?? { label: key };
                  // l'esito (Positivo/Negativo) usa sempre lo stesso colore semantico
                  // ovunque compaia, indipendentemente dal colore dell'azione
                  const valueClass = key === "outcome"
                    ? getOutcomeBadgeClass(value)
                    : "bg-slate-100 text-slate-700";
                  return (
                    <span key={key} className="inline-flex w-fit items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs">
                      <span className="font-medium text-slate-600">{field.label}:</span>
                      <span className={`rounded-md px-1.5 font-semibold ${valueClass}`}>
                        {resolveDetailValue(key, value, item)}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
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
