import React, { useState, useEffect } from "react";
import { fakeTasks } from "@/fake_data/data";
import StandardTable from "@/utils/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui";

const fake_task_header = [
  {
    key: "id",
    label: "#",
    className: "w-16 font-semibold text-slate-900 text-center",
  },
  {
    key: "description",
    label: "Descrizione",
    className: "font-semibold text-slate-900 text-center",
  },
  {
    key: "position",
    label: "Posizione",
    className: "w-28 font-semibold text-slate-900 text-center",
  },
  {
    key: "actions",
    label: "Azioni",
    className: "w-28 font-semibold text-slate-900 text-center",
  },
];

const TaskTable = ({
  tasks,
  isAdmin,
  handleDelete,
  handleEdit,
}) => {
  const data = tasks && tasks.length > 0 ? tasks : fakeTasks;

  return (
    <StandardTable
      headers={fake_task_header}
      data={data}
      emptyMessage="Nessun task trovato per questa checklist."
      containerClass=""
      renderRow={(task, index) => (
        <TableRow
          key={task.id}
          className="group transition-colors hover:bg-slate-50"
        >
          <TableCell className="font-mono text-slate-400 text-center">
            #{task.id}
          </TableCell>
          <TableCell className="font-semibold text-slate-900">
            {task.description}
          </TableCell>
          <TableCell className="text-slate-500 text-center">
            {task.position}
          </TableCell>

          <TableCell>
            {isAdmin ? (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-emerald-600"
                  onClick={() => handleEdit?.(task)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-600"
                  onClick={() => handleDelete?.(task)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <span className="text-sm text-slate-500">
                Nessuna azione disponibile
              </span>
            )}
          </TableCell>
        </TableRow>
      )}
    />
  );
};

export default TaskTable;
