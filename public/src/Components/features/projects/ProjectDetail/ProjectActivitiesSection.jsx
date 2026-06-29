import { ShieldAlert, Info } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import UserAvatar from "@/utils/components/UserAvatar";
import Loader from "@/utils/components/Loader";
import { getFullName, ROUND_COLOR_CLASSES } from "@/utils/helpers/tableHelpers";
import { parseStrDetails } from "@/utils/helpers/parseStrDetails";
import { auditActions, detailFieldMap } from "@/utils/helpers/auditActions";

const HEADERS = [
  { key: "quando", label: "Quando", className: "text-left font-semibold text-slate-900 px-5 py-3.5 w-40" },
  { key: "utente", label: "Utente", className: "text-left font-semibold text-slate-900 px-5 py-3.5" },
  { key: "azione", label: "Azione", className: "text-left font-semibold text-slate-900 px-5 py-3.5" },
];

// SEZIONE ATTIVITÀ DEL PROGETTO: audit log filtrato per project_id (solo lettura, no filtri)
const ProjectActivitiesSection = ({ activities = [], loading = false, currentUserId }) => (
  <Card className="border-slate-200 bg-white shadow-sm">
    <CardHeader className="border-b border-slate-200 pb-4">
      <CardTitle className="flex items-center gap-2 text-slate-900">
        <ShieldAlert className="h-4 w-4 text-slate-400" />
        Attività recenti del progetto
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-4">
      {loading ? (
        <Loader label="Caricamento attività..." />
      ) : (
        <StandardTable
          containerClass="w-full overflow-hidden rounded-xl border border-slate-200"
          headers={HEADERS}
          data={activities}
          emptyMessage="Nessuna attività registrata per questo progetto."
          renderRow={(item) => {
            const details = parseStrDetails(item.details);
            // checklistId/templateId sono id grezzi ormai ridondanti: il nome leggibile
            // arriva già pronto dal BE in item.checklist_name / item.project_name.
            const detailEntries = Object.entries(details).filter(
              ([key]) => key !== "checklistId" && key !== "templateId",
            );
            const action = auditActions[item.action];
            const Icon = action?.icon || Info;
            const context = [item.project_name, item.checklist_name].filter(Boolean).join(" · ");

            return (
              <TableRow key={item.id} className="hover:bg-slate-50/60">
                <TableCell className="px-5 py-3">
                  <span className="text-sm text-slate-700">
                    {new Date(item.timestamp).toLocaleString("it-IT", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar
                      user={item}
                      size="sm"
                      colorIndex={item.user_id % ROUND_COLOR_CLASSES.length}
                    />
                    <span className="text-sm text-slate-700">
                      {getFullName(item)}
                      {currentUserId === item.user_id ? " (tu)" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <div
                    className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${action?.bgColor ?? "bg-slate-100"} ${action?.color ?? "text-slate-700"}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {action?.label ?? item.action}
                  </div>
                  {context && (
                    <p className="mt-1 text-xs font-medium text-slate-500">{context}</p>
                  )}
                  {detailEntries.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      {detailEntries
                        .map(([key, value]) => `${detailFieldMap[key]?.label ?? key}: ${value}`)
                        .join(" · ")}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            );
          }}
        />
      )}
    </CardContent>
  </Card>
);

export default ProjectActivitiesSection;
