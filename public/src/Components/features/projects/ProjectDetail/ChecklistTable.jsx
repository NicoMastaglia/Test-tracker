import { Pencil, Trash2, ExternalLink, ClipboardCheck,ListTodo } from 'lucide-react';
import * as Icons from 'lucide-react';
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
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
    key: "completate",
    label: "Completate",
    className: "text-left font-semibold text-slate-900 px-4 py-3.5 w-60", 
  },
  {
    key: "stato",
    label: "Stato",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-32",
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
        const completedTasks = cl.items?.filter(item => item.is_completed || item.completed)?.length || 0;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
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

            {/* 3. CELLA: COMPLETATE */}
            <TableCell className="text-left px-4 py-3.5">
              <div className="flex items-center gap-3 w-full max-w-50">
                <Progress 
                  value={progressPercentage} 
                  className="h-1.5 bg-slate-100 w-24 shrink-0 [&>div]:bg-emerald-500" 
                />
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {completedTasks}/{totalTasks} ({progressPercentage}%)
                </span>
              </div>
            </TableCell>

            {/* 4. CELLA: STATO BADGE */}
            <TableCell className="text-center px-4 py-3">
              <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${
                progressPercentage === 100 
                  ? "bg-emerald-100 text-emerald-700" 
                  : progressPercentage > 0 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-slate-100 text-slate-600"
              }`}>
                {progressPercentage === 100 ? "Completata" : progressPercentage > 0 ? "In corso" : "Da iniziare"}
              </Badge>
            </TableCell>

            {/* 5. CELLA: ULTIMO AGGIORNAMENTO */}
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