import React from "react";
import { Pencil, Trash2,UserPlus,UserMinus,
  Archive,RotateCcw,CircleSlash,ThumbsDown,ListChecks,LockOpen} from "lucide-react";

import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import TableActionButton from "@/utils/components/TableActionButton";
import {getTaskStatusBadgeClass, uppercaseFirstLetter, getDeadlineStatus} from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import { Badge } from "@/Components/ui/badge";
import { getFullName } from "@/utils/helpers/tableHelpers";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/Components/ui/tooltip";



const getTaskActions = (task, handlers) => [
  {
    key: "assign",
    show: !task.assigned_to && task.status !== "Archiviata" && task.status !== "Completata",
    icon: UserPlus,
    color: "text-blue-600 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/15",
    label: "Assegna Tester",

    onClick: () => handlers.handleAssign(task),
  },
  {
    key: "unassign",
    show: !!task.assigned_to && task.status !== "Archiviata" && task.status !== "Completata",
    icon: UserMinus,
    color: "text-amber-500 hover:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/15",
    label: "Rimuovi Tester",
    onClick: () => handlers.handleUnassign(task),
  },
  {
    key: "edit",
    show: task.status !== "Archiviata" && task.status !== "Completata",
    icon: Pencil,
    color: "text-emerald-600 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/15",
    label: "Modifica Task",
    onClick: () => handlers.handleEdit(task),
  },
  {
    key: "delete",
    show: true, // sempre disponibile
    icon: Trash2,
    color: "text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/15",
    label: "Elimina Task",
    onClick: () => handlers.handleDelete(task),
  },
  {
    key: "block",
    show: task.status !== "Bloccata" && task.status !== "Archiviata" && task.status !== "Completata",
    icon: CircleSlash,
    color: "text-orange-600 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/15",
    label: "Blocca Task",
    onClick: () => handlers.handleBlock(task),
  },
  {
    key: "unblock",
    show: task.status === "Bloccata",
    icon: LockOpen,
    color: "text-teal-600 hover:text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-500/15",
    label: "Sblocca Task",
    onClick: () => handlers.handleUnblock(task),
  },
  {
    key: "archive",
    show: task.status === "Completata",
    icon: Archive,
    color: "text-slate-500 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500/15",
    label: "Archivia Task",
    onClick: () => handlers.handleArchive(task),
  },
  {
    key: "reopen",
    show: task.status === "Archiviata",
    icon: RotateCcw,
    color: "text-teal-600 hover:text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-500/15",
    label: "Riapri Task",
    onClick: () => handlers.handleReopen(task),
  },
];


const BASE_HEADERS = [
  // {
  //   key: "id",
  //   label: "#",
  //   className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-16",
  // },
  {
    key: "description",
    label: "Descrizione",
    className: "text-center font-semibold text-foreground px-5 py-3.5 w-32",
  },
  {
    key: "tester",
    label: "Tester",
    className: "text-center font-semibold text-foreground px-5 py-3.5 w-32",
  },
  {
    key: "deadline",
    label: "Scadenza",
    className: "text-center font-semibold text-foreground px-5 py-3.5 w-32",
  },
  {
    key: "status",
    label: "Stato",
    className: "text-center font-semibold text-foreground px-5 py-3.5 w-32",
  },

];

const ACTIONS_HEADER = {
  key: "azioni",
  label: "Azioni",
  className: "text-center font-semibold text-foreground px-5 py-3.5 w-32",
};

const TaskTable = ({
  tasks = [],
  isAdmin,
  handleEdit,
  handleDelete,
  handleAssign,
  handleUnassign,
  handleArchive,
  handleReopen,
  handleBlock,
  handleUnblock,
  teamMembers = [],
}) => (
  <StandardTable
    // la colonna Azioni esiste solo per l'admin (il tester vede i task in sola lettura)
    headers={isAdmin ? [...BASE_HEADERS, ACTIONS_HEADER] : BASE_HEADERS}
    data={tasks}
    emptyMessage="Nessun task trovato per questa checklist."
    emptyIcon={ListChecks}
    containerClass=""
    renderRow={(task) => {

      const assignedTester = teamMembers.find(member => member.id === task.assigned_to) || null;
      const isTaskDone = task.status === "Completata" || task.status === "Archiviata";
      const deadlineStatus = getDeadlineStatus(task.deadline, isTaskDone);

      return (
      <TableRow key={task.id} className="group transition-colors hover:bg-muted/50">
        {/* 1. CELLA: # */}
        {/* <TableCell className="text-center font-mono text-slate-400 px-4 py-3.5">
          {index+1 }
        </TableCell> */}

        {/* 2. CELLA: DESCRIZIONE */}
        <TableCell className="text-center px-5 py-3.5">
          <span className="font-semibold text-foreground text-sm">
            {uppercaseFirstLetter(task.description) || "Nessuna descrizione"}
          </span>
        </TableCell>

        {/* 3. CELLA: STato */}
        <TableCell className="text-center px-5 py-3.5">
          <span className="font-semibold text-foreground text-sm">
            {assignedTester ? (
              <Tooltip key={`tester-${assignedTester.id}`}>
                <TooltipContent>
                  <p>{getFullName(assignedTester)}</p>
                </TooltipContent>
                <TooltipTrigger>
                  <UserAvatar user={assignedTester} size="md" />
                </TooltipTrigger>
              </Tooltip>
            ): "Nessuno tester assegnato"}
          </span>
        </TableCell>

        {/* 3b. CELLA: SCADENZA */}
        <TableCell className="text-center px-5 py-3.5">
          <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${deadlineStatus.colorClass}`}>
            {deadlineStatus.label}
            {deadlineStatus.isOverdue && " (scaduta)"}
          </span>
        </TableCell>

        <TableCell className="text-center px-5 py-3.5">
          <div className="inline-flex items-center gap-1.5">
            <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getTaskStatusBadgeClass(task.status)}`}>
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />

            {task.status || "Nessuno stato"}
            </Badge>

         
            {task.latest_outcome === "Negativo" && (
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                    <ThumbsDown className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-60 text-xs">
                    Esito negativo{task.latest_note ? `: ${task.latest_note}` : " (nessuna nota)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TableCell>

        {/* 4. CELLA: AZIONI (solo admin) */}
        {isAdmin && (
          <TableCell className="text-center px-6 py-3.5">
            <div className="inline-flex items-center justify-center gap-0.5">

              {getTaskActions(task, { handleAssign, handleUnassign, handleEdit, handleDelete, handleBlock, handleUnblock, handleArchive, handleReopen })
  .filter((action) => action.show)
  .map((action) => (
    <TableActionButton key={action.key} onClick={action.onClick} icon={action.icon} color={action.color} action={action.label} />
  ))}

              
              
            </div>

        
          </TableCell>
          



        )}
      </TableRow>
)}}
  />
);

export default TaskTable;
