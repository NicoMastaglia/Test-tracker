import { CircleSlash } from "lucide-react";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { getSessionStatusBadgeClass, blockedIndicatorBadgeClass, getClickableRowProps } from "@/utils/helpers/tableHelpers";

const formatDate = (date) => {
  if (!date) return "Non disponibile";

  return new Date(date).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SessionRow = ({ session, onView }) => {

  const dateColorClass = session.status === "Completata" ? "text-emerald-700 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400";

  return (
  <TableRow
    className="text-center cursor-pointer group transition-colors hover:bg-muted/50"
    onClick={() => onView?.(session.id)}
    {...getClickableRowProps(() => onView?.(session.id))}
  >
    <TableCell className="font-mono text-muted-foreground">
      {session.id}
    </TableCell>

    <TableCell>
      <span className="capitalize font-medium text-foreground">
        {session.project_name || "Progetto non disponibile"}
      </span>
    </TableCell>

    <TableCell className="text-muted-foreground">
      {formatDate(session.started_at)}
    </TableCell>

    <TableCell className={session.completed_at ? dateColorClass : "text-muted-foreground"}>
      {session.completed_at
        ? formatDate(session.completed_at)
        : "Sessione ancora aperta"}
    </TableCell>

    <TableCell>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getSessionStatusBadgeClass(session.status)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {session.status || "N/D"}
        </Badge>
        {session.has_blocked_task ? (
          <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${blockedIndicatorBadgeClass}`}>
            <CircleSlash className="mr-1 h-3 w-3" />
            Task bloccata
          </Badge>
        ) : null}
      </div>
    </TableCell>
  </TableRow>
  );
};

export default SessionRow;
