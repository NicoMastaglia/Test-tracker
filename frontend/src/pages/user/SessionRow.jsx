import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { getSessionStatusBadgeClass } from "@/utils/helpers/tableHelpers";

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

const SessionRow = ({ session, onView, index }) => {
  // testo data completamento: stessa tonalità del badge di stato per coerenza visiva
  const dateColorClass = session.status === "Completata" ? "text-emerald-700" : "text-indigo-600";

  return (
  <TableRow
    className="text-center cursor-pointer group transition-colors hover:bg-slate-50/50"
    onClick={() => onView?.(session.id)}
  >
    <TableCell className="font-mono text-slate-400">
      {index}
    </TableCell>

    <TableCell>
      <span className="capitalize font-medium text-slate-900">
        {session.project_name || "Progetto non disponibile"}
      </span>
    </TableCell>

    <TableCell className="text-slate-600">
      {formatDate(session.started_at)}
    </TableCell>

    <TableCell className={session.completed_at ? dateColorClass : "text-slate-400"}>
      {session.completed_at
        ? formatDate(session.completed_at)
        : "Sessione ancora aperta"}
    </TableCell>

    <TableCell>
      <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getSessionStatusBadgeClass(session.status)}`}>
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {session.status || "N/D"}
      </Badge>
    </TableCell>
  </TableRow>
  );
};

export default SessionRow;
