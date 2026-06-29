import { useMemo } from "react";
import { ShieldAlert, Info, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import UserAvatar from "@/utils/components/UserAvatar";
import Loader from "@/utils/components/Loader";
import { getFullName, ROUND_COLOR_CLASSES } from "@/utils/helpers/tableHelpers";
import { parseStrDetails } from "@/utils/helpers/parseStrDetails";
import { auditActions, detailFieldMap } from "@/utils/helpers/auditActions";
import DataTable, { SortableHeader } from "@/utils/components/DataTable";

const badgeClass = (action) =>
  `inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs ${auditActions[action]?.color || "bg-slate-100 text-slate-700"}`;

// SEZIONE ATTIVITÀ DEL PROGETTO: audit log filtrato per project_id (solo lettura, no filtri)
const ProjectActivitiesSection = ({ activities = [], loading = false, currentUserId }) => {
  const columns = useMemo(
    () => [
      {
        id: "quando",
        accessorFn: (item) => new Date(item.timestamp).getTime(),
        header: ({ column }) => <SortableHeader column={column} label="Quando" />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {new Date(row.original.timestamp).toLocaleDateString("it-IT", { dateStyle: "medium" })}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(row.original.timestamp).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        ),
      },
      {
        id: "utente",
        accessorFn: (item) => getFullName(item),
        header: ({ column }) => <SortableHeader column={column} label="Utente" />,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3">
              <UserAvatar user={item} size="sm" colorIndex={item.user_id % ROUND_COLOR_CLASSES.length} />
              <span>
                {getFullName(item)}
                {currentUserId === item.user_id ? " (tu)" : ""}
              </span>
            </div>
          );
        },
      },
      {
        id: "azione",
        accessorFn: (item) => auditActions[item.action]?.label || item.action,
        header: ({ column }) => <SortableHeader column={column} label="Azione" />,
        cell: ({ row }) => {
          const item = row.original;
          const Icon = auditActions[item.action]?.icon || Activity;
          const details = parseStrDetails(item.details);
          const entries = Object.entries(details).filter(
            ([key]) => key !== "checklistId" && key !== "templateId",
          );

          return (
            <div className="flex flex-col gap-1.5">
              <div className={badgeClass(item.action)}>
                <Icon className="h-3.5 w-3.5" />
                {auditActions[item.action]?.label || item.action}
              </div>
              {entries.length > 0 ? (
                entries.map(([key, value]) => {
                  const field = detailFieldMap[key] ?? { label: key };
                  return (
                    <div key={key} className={badgeClass(item.action)}>
                      <span className="font-medium text-slate-600">{field.label}:</span>
                      <span
                        className={`rounded-md px-2 font-semibold ${auditActions[item.action]?.bgColor || "bg-slate-100"} ${auditActions[item.action]?.color || "text-slate-700"}`}
                      >
                        {String(value)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Nessun dettaglio</span>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [currentUserId],
  );

  return (
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
          <DataTable
            columns={columns}
            data={activities}
            emptyMessage="Nessuna attività recente da visualizzare per questo progetto."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectActivitiesSection;
