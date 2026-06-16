import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import TableActionButton from "@/utils/components/TableActionButton";

// Colonne limitate ai campi realmente presenti nel BE (checklist_item: description, position)
const BASE_HEADERS = [
  {
    key: "id",
    label: "#",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-16",
  },
  {
    key: "description",
    label: "Descrizione",
    className: "text-left font-semibold text-slate-900 px-5 py-3.5 w-full",
  },
];

const ACTIONS_HEADER = {
  key: "azioni",
  label: "Azioni",
  className: "text-center font-semibold text-slate-900 px-6 py-3.5 w-32",
};

const TaskTable = ({
  tasks = [],
  isAdmin,
  handleEdit,
  handleDelete,
}) => (
  <StandardTable
    // la colonna Azioni esiste solo per l'admin (il tester vede i task in sola lettura)
    headers={isAdmin ? [...BASE_HEADERS, ACTIONS_HEADER] : BASE_HEADERS}
    data={tasks}
    emptyMessage="Nessun task trovato per questa checklist."
    containerClass=""
    renderRow={(task, index) => (
      <TableRow key={task.id} className="group transition-colors hover:bg-slate-50/50">
        {/* 1. CELLA: # */}
        <TableCell className="text-center font-mono text-slate-400 px-4 py-3.5">
          {index+1 }
        </TableCell>

        {/* 2. CELLA: DESCRIZIONE */}
        <TableCell className="text-left px-5 py-3.5">
          <span className="font-semibold text-slate-900 text-sm">
            {task.description || "Nessuna descrizione"}
          </span>
        </TableCell>

        {/* 3. CELLA: AZIONI (solo admin) */}
        {isAdmin && (
          <TableCell className="text-center px-6 py-3.5">
            <div className="flex items-center justify-center gap-0.5">
              <TableActionButton
                onClick={() => handleEdit?.(task)}
                icon={Pencil}
                color="hover:text-emerald-600 hover:bg-emerald-50/50"
              />
              <TableActionButton
                onClick={() => handleDelete?.(task)}
                icon={Trash2}
                color="hover:text-red-600 hover:bg-red-50/50"
              />
            </div>
          </TableCell>
        )}
      </TableRow>
    )}
  />
);

export default TaskTable;
