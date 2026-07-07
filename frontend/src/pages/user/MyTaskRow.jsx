import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { getTaskStatusBadgeClass, getDeadlineStatus, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";

const MyTaskRow = ({ task }) => {
  const isDone = task.status === "Completata" || task.status === "Archiviata";
  const deadlineStatus = getDeadlineStatus(task.deadline, isDone);

  return (
    <TableRow className="text-center transition-colors hover:bg-muted/50">
      <TableCell className="max-w-xs">
        <span className="text-foreground text-sm">
          {uppercaseFirstLetter(task.description) || "Nessuna descrizione"}
        </span>
      </TableCell>

      <TableCell>
        <span className="capitalize font-medium text-foreground">
          {task.project_name || "Progetto non disponibile"}
        </span>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {uppercaseFirstLetter(task.checklist_title) || "—"}
      </TableCell>

      <TableCell>
        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${deadlineStatus.colorClass}`}>
          {deadlineStatus.label}
          {deadlineStatus.daysLabel && ` · ${deadlineStatus.daysLabel}`}
        </span>
      </TableCell>

      <TableCell>
        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getTaskStatusBadgeClass(task.status)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {task.status || "N/D"}
        </Badge>
      </TableCell>

      <TableCell>
        {task.open_session_id ? (
          <Link
            to={`/sessions/${task.open_session_id}`}
            className="inline-flex items-center rounded-lg bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25"
          >
            Sessione #{task.open_session_id}
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default MyTaskRow;
