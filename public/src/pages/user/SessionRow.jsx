import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/Components/ui/button";

const SessionRow = ({ session, onView }) => {
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

  const statusConfig = {
    open: {
      label: "Aperta",
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    completed: {
      label: "Completata",
      className:
        "bg-blue-100 text-blue-700 border-blue-200",
    },
    closed: {
      label: "Chiusa",
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const status =
    statusConfig[session.status] || {
      label: session.status || "N/D",
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    };

  return (
    <TableRow className="text-left group transition-colors hover:bg-slate-50/50">
      <TableCell className="font-mono text-slate-400">
        #{session.id}
      </TableCell>

      <TableCell>
        <span className="font-medium text-slate-900">
          {session.project_name || "Progetto non disponibile"}
        </span>
      </TableCell>

      <TableCell className="text-slate-600">
        {formatDate(session.start_time)}
      </TableCell>

      <TableCell className="text-slate-600">
        {session.end_time
          ? formatDate(session.end_time)
          : "Sessione ancora aperta"}
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={status.className}
        >
          {status.label}
        </Badge>
      </TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView?.(session.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SessionRow;