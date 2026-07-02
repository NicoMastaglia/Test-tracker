import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { getTaskStatusBadgeClass, getDeadlineStatus, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";

const MyTaskRow = ({ task }) => {
  const isDone = task.status === "Completata" || task.status === "Archiviata";
  const deadlineStatus = getDeadlineStatus(task.deadline, isDone);

  return (
    <TableRow className="text-center transition-colors hover:bg-slate-50/50">
      <TableCell>
        <span className="capitalize font-medium text-slate-900">
          {task.project_name || "Progetto non disponibile"}
        </span>
      </TableCell>

      <TableCell className="text-slate-600">
        {uppercaseFirstLetter(task.checklist_title) || "—"}
      </TableCell>

      <TableCell className="max-w-xs">
        <span className="text-slate-900 text-sm">
          {uppercaseFirstLetter(task.description) || "Nessuna descrizione"}
        </span>
      </TableCell>

      <TableCell>
        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${deadlineStatus.colorClass}`}>
          {deadlineStatus.label}
          {deadlineStatus.isOverdue && " (scaduta)"}
        </span>
      </TableCell>

      <TableCell>
        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getTaskStatusBadgeClass(task.status)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {task.status || "N/D"}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default MyTaskRow;
