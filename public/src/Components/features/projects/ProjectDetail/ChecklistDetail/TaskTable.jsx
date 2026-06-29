import React from "react";
import { Pencil, Trash2,UserPlus,UserMinus,
  Archive,RotateCcw,CircleSlash} from "lucide-react";

import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import TableActionButton from "@/utils/components/TableActionButton";
import {getTaskStatusBadgeClass} from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import { Badge } from "@/Components/ui/badge";
import { getFullName } from "@/utils/helpers/tableHelpers";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/Components/ui/tooltip";



const getTaskActions = (task, handlers) => [
  {
    key: "assign",
    show: !task.assigned_to && task.status !== "Archiviata",
    icon: UserPlus,
    color: "text-blue-600 hover:bg-blue-100",
    label: "Assegna Tester",
    
    onClick: () => handlers.handleAssign(task),
  },
  {
    key: "unassign",
    show: !!task.assigned_to && task.status !== "Archiviata",
    icon: UserMinus,
    color: "text-amber-500 hover:bg-amber-100",
    label: "Rimuovi Tester",
    onClick: () => handlers.handleUnassign(task),
  },
  {
    key: "edit",
    show: task.status !== "Archiviata",
    icon: Pencil,
    color: "text-emerald-600 hover:bg-emerald-100",
    label: "Modifica Task",
    onClick: () => handlers.handleEdit(task),
  },
  {
    key: "delete",
    show: true, // sempre disponibile
    icon: Trash2,
    color: "text-red-600 hover:bg-red-100",
    label: "Elimina Task",
    onClick: () => handlers.handleDelete(task),
  },
  {
    key: "block",
    show: task.status !== "Bloccata" && task.status !== "Archiviata",
    icon: CircleSlash,
    color: "text-orange-600 hover:bg-orange-100",
    label: "Blocca Task",
    onClick: () => handlers.handleBlock(task),
  },
  {
    key: "archive",
    show: task.status === "Completata",
    icon: Archive,
    color: "text-slate-500 hover:bg-slate-100",
    label: "Archivia Task",
    onClick: () => handlers.handleArchive(task),
  },
  {
    key: "reopen",
    show: task.status === "Archiviata",
    icon: RotateCcw,
    color: "text-teal-600 hover:bg-teal-100",
    label: "Riapri Task",
    onClick: () => handlers.handleReopen(task),
  },
];

// Colonne limitate ai campi realmente presenti nel BE (checklist_item: description, position)
const BASE_HEADERS = [
  // {
  //   key: "id",
  //   label: "#",
  //   className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-16",
  // },
  {
    key: "description",
    label: "Descrizione",
    className: "text-center font-semibold text-slate-900 px-5 py-3.5 w-32",
  },
  {
    key: "tester",
    label: "Tester",
    className: "text-center font-semibold text-slate-900 px-5 py-3.5 w-32",
  },
  {
    key: "status",
    label: "Stato",
    className: "text-center font-semibold text-slate-900 px-5 py-3.5 w-32",
  },

];

const ACTIONS_HEADER = {
  key: "azioni",
  label: "Azioni",
  className: "text-center font-semibold text-slate-900 px-5 py-3.5 w-32",
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
  teamMembers = [],
}) => (
  <StandardTable
    // la colonna Azioni esiste solo per l'admin (il tester vede i task in sola lettura)
    headers={isAdmin ? [...BASE_HEADERS, ACTIONS_HEADER] : BASE_HEADERS}
    data={tasks}
    emptyMessage="Nessun task trovato per questa checklist."
    containerClass=""
    renderRow={(task, index) => {

      const assignedTester = teamMembers.find(member => member.id === task.assigned_to) || null;

      return (
      <TableRow key={task.id} className="group transition-colors hover:bg-slate-50/50">
        {/* 1. CELLA: # */}
        {/* <TableCell className="text-center font-mono text-slate-400 px-4 py-3.5">
          {index+1 }
        </TableCell> */}

        {/* 2. CELLA: DESCRIZIONE */}
        <TableCell className="text-center px-5 py-3.5">
          <span className="font-semibold text-slate-900 text-sm">
            {task.description || "Nessuna descrizione"}
          </span>
        </TableCell>

        {/* 3. CELLA: STato */}
        <TableCell className="text-center px-5 py-3.5">
          <span className="font-semibold text-slate-900 text-sm">
            {assignedTester ? (
              <Tooltip key={`tester-${assignedTester.id}`}>
                <TooltipContent>
                  <p>{getFullName(assignedTester)}</p>
                </TooltipContent>
                <TooltipTrigger>
                  <UserAvatar  user={assignedTester} colorIndex={assignedTester.id} size="md" />
                </TooltipTrigger>
              </Tooltip>
            ): "Nessuno tester assegnato"}
          </span>
        </TableCell>

        <TableCell className="text-center px-5 py-3.5">
          <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getTaskStatusBadgeClass(task.status)}`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          
          {task.status || "Nessuno stato"}
          </Badge>
        </TableCell>

        {/* 4. CELLA: AZIONI (solo admin) */}
        {isAdmin && (
          <TableCell className="text-center px-6 py-3.5">
            <div className="inline-flex items-center justify-center gap-0.5">

              {getTaskActions(task, { handleAssign, handleUnassign, handleEdit, handleDelete, handleBlock, handleArchive, handleReopen })
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
