import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { ClipboardCheck, RotateCcw } from "lucide-react";
import TableActionButton from "@/utils/components/TableActionButton";
import { getTaskStatusBadgeClass, getOutcomeBadgeClass } from "@/utils/helpers/tableHelpers";

const SessionTaskRow = ({ task, onEdit, readOnly = false, currentUserId, onReopen }) => {
  // un admin può bloccare la task o rimuoverne l'assegnazione mentre la sessione
  // è ancora aperta: in entrambi i casi la task resta visibile (non sparisce, per
  // non confondere il tester) ma non è più completabile da qui.
  const isBlocked = task.task_status === "Bloccata";
  const isUnassigned = task.assigned_to !== currentUserId;
  const cannotEdit = isBlocked || isUnassigned;
  // un esito già inviato resta bloccato 
  //  "Aggiorna esito" e
  // "Riapri esito" sono mutuamente esclusivi in base al solo task.outcome, così
  // riaprire una task non sblocca anche le altre della stessa sessione
  const hasOutcome = task.outcome != null;

  return (
    <TableRow className="text-center group transition-colors hover:bg-slate-50/50">
      <TableCell>
        <span className="font-medium text-slate-900">{task.description}</span>
      </TableCell>

      <TableCell>
        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getTaskStatusBadgeClass(task.task_status)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {task.task_status || "Nessuno stato"}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getOutcomeBadgeClass(task.outcome)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {task.outcome || "Da valutare"}
        </Badge>
      </TableCell>

      <TableCell className="max-w-xs">
        <span className="text-sm text-slate-500 line-clamp-2">
          {task.note || "Nessuna nota"}
        </span>
      </TableCell>

      {!readOnly && (
        <TableCell className="text-center">
          {cannotEdit ? (
            <span className="text-xs text-slate-400">
              {isBlocked ? "Task bloccata" : "Non più assegnata a te"}
            </span>
          ) : hasOutcome ? (
            <TableActionButton
              onClick={() => onReopen?.(task)}
              icon={RotateCcw}
              color="text-amber-600 hover:text-amber-600 hover:bg-amber-50/50"
              action="Riapri esito"
            />
          ) : (
            <TableActionButton
              onClick={() => onEdit?.(task)}
              icon={ClipboardCheck}
              color="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50"
              action="Aggiorna esito"
            />
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

export default SessionTaskRow;
