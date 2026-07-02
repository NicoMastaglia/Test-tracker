import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { getSessionStatusBadgeClass, getFullName, formatProjectDateTime } from "@/utils/helpers/tableHelpers";

const AdminSessionRow = ({ session, index, onView }) => {
  const dateColorClass = session.status === "Completata" ? "text-emerald-700" : "text-indigo-600";

  return (
    <TableRow
      className={`text-center transition-colors hover:bg-slate-50/50 ${onView ? "cursor-pointer" : ""}`}
      onClick={() => onView?.(session.id)}
    >
      <TableCell className="font-mono text-slate-400">{index}</TableCell>

      <TableCell>
        <span className="capitalize font-medium text-slate-900">
          {session.project_name || "Progetto non disponibile"}
        </span>
      </TableCell>

      <TableCell className="capitalize font-semibold text-slate-900">
        {getFullName({ nome: session.tester_nome, cognome: session.tester_cognome })}
      </TableCell>

      <TableCell className="text-slate-600">{formatProjectDateTime(session.started_at)}</TableCell>

      <TableCell className={session.completed_at ? dateColorClass : "text-slate-400"}>
        {session.completed_at ? formatProjectDateTime(session.completed_at) : "Sessione ancora aperta"}
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

export default AdminSessionRow;
