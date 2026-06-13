import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import TableActionButton from "@/utils/components/TableActionButton";

// Colonne limitate ai campi realmente presenti nel BE (checklist_item: description, position)
const HEADERS = [
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
  {
    key: "azioni",
    label: "Azioni",
    className: "text-center font-semibold text-slate-900 px-6 py-3.5 w-32",
  },
];

const TaskTable = ({
  tasks = [],
  isAdmin,
  handleView,
  handleEdit,
  handleDelete,
}) => (
  <StandardTable
    headers={HEADERS}
    data={tasks}
    emptyMessage="Nessun task trovato per questa checklist."
    containerClass=""
    renderRow={(task, index) => (
      <TableRow key={task.id ?? task.task_id ?? index} className="group transition-colors hover:bg-slate-50/50">
        {/* 1. CELLA: # */}
        <TableCell className="text-center font-mono text-slate-400 px-4 py-3.5">
          {task.position ?? index + 1}
        </TableCell>

        {/* 2. CELLA: DESCRIZIONE */}
        <TableCell className="text-left px-5 py-3.5">
          <span className="font-semibold text-slate-900 text-sm">
            {task.description || "Nessuna descrizione"}
          </span>
        </TableCell>

        {/* 3. CELLA: AZIONI */}
        <TableCell className="text-center px-6 py-3.5">
          <div className="flex items-center justify-center gap-0.5">
            <TableActionButton
              onClick={() => handleView?.(task)}
              icon={Eye}
              color="hover:text-slate-600 hover:bg-slate-100"
            />

            {isAdmin && (
              <>
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
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    )}
  />
);

export default TaskTable;
