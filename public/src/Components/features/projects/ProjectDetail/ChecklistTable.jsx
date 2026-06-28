import { Pencil, Trash2, ExternalLink, ClipboardCheck,ListTodo } from 'lucide-react';
import * as Icons from 'lucide-react';
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { getRoundColorClass } from "@/utils/helpers/tableHelpers";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";
import TableActionButton from "@/utils/components/TableActionButton";
import React from 'react';

const HEADERS = [
  {
    key: "checklist",
    label: "Checklist",
    className: "text-left font-semibold text-slate-900 px-5 py-3.5 w-full", 
  },
  {
    key: "task",
    label: "Task",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-24",
  },
  {
    key: "ultimo_aggiornamento",
    label: "Ultimo aggiornamento",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-52",
  },
  {
    key: "azioni",
    label: "Azioni",
    className: "text-center font-semibold text-slate-900 px-6 py-3.5 w-32",
  },
];

const formatDate = (value) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Data non disponibile";
  }
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const ChecklistTable = ({ 
  checklists = [], 
  onOpen, 
  handleEdit, 
  handleDelete, 
  isAdmin,
  
}) => (
  <div className="w-full">
    <StandardTable
      headers={HEADERS}
      data={checklists}
      emptyMessage="Nessuna checklist trovata per questo progetto."
      containerClass="border border-slate-200/80 rounded-xl shadow-sm overflow-hidden bg-white"
      renderRow={(cl) => {
        const totalTasks = cl.items?.length || 0;
        const colorClass = getRoundColorClass(cl.checklist_id);
        // chiedere a musti x inserire un campo "icon_name" nella checklist, se non c'è usare un'icona di default (es. ListTodo)
        const IconComponent = Icons[cl.icon_name] || Icons['ListTodo'] || ListTodo;

        return (
          <TableRow key={cl.checklist_id} className="group transition-colors hover:bg-slate-50/50">
            
            {/* 1. CELLA: INFO CHECKLIST (Usa la variabile colorClass per lo sfondo e l'icona) */}
            <TableCell className="text-left px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClass}`}>
                  <IconComponent className="h-4 w-4 text-current" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-semibold text-slate-900 text-sm leading-tight">
                    {cl.title}
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                    {cl.description || 'Nessuna descrizione'}
                  </span>
                </div>
              </div>
            </TableCell>

            

            {/* 2. CELLA: TASK */}
            <TableCell className="text-center font-semibold text-slate-800 text-sm px-4 py-3">
              {totalTasks}
            </TableCell>

            {/* 3. CELLA: ULTIMO AGGIORNAMENTO */}
            <TableCell className="text-center px-4 py-3 text-xs text-slate-400 font-medium">
              {cl.last_updated ? formatDate(cl.last_updated) : NOT_AVAILABLE}
            </TableCell>

            {/* 6. CELLA: AZIONI OPERATIVE */}
            <TableCell className="text-center px-6 py-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-0.5">
                <TableActionButton
                  onClick={() => onOpen(cl)}
                  icon={ExternalLink}
                  color="hover:text-slate-600 hover:bg-slate-100"
                />

                {isAdmin && (
                  <>
                    <TableActionButton
                      onClick={() => handleEdit(cl)}
                      icon={Pencil}
                      color="hover:text-emerald-600 hover:bg-emerald-50/50"
                    />
                    <TableActionButton
                      onClick={() => handleDelete(cl.checklist_id)}
                      icon={Trash2}
                      color="hover:text-red-600 hover:bg-red-50/50"
                    />
                  </>
                )}
              </div>
            </TableCell>

          </TableRow>
        );
      }}
    />
  </div>
);

export default ChecklistTable;