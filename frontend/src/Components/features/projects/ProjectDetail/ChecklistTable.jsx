import { Pencil, Trash2, ListTodo } from 'lucide-react';
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";
import TableActionButton from "@/utils/components/TableActionButton";
import { Badge } from "@/Components/ui/badge";
import {getChecklistStatusBadgeClass, uppercaseFirstLetter, getClickableRowProps} from "@/utils/helpers/tableHelpers";
import React from 'react';

const HEADERS = [
  {
    key: "checklist",
    label: "Checklist",
    className: "text-center font-semibold text-slate-900 px-5 py-3.5 w-2/5",
  },
  {
    key: "task",
    label: "Task",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-28",
  },
  {
    key: 'status',
    label: 'Stato',
    className: 'text-center font-semibold text-slate-900 px-4 py-3.5 w-28',
  },
  {
    key: "ultimo_aggiornamento",
    label: "Ultimo aggiornamento",
    className: "text-center font-semibold text-slate-900 px-4 py-3.5 w-44",
  },
  {
    key: "azioni",
    label: "Azioni",
    className: "text-center font-semibold text-slate-900 px-6 py-3.5 w-32",
  },
];

// stato derivato di una checklist dai suoi item 
export const getChecklistStatus = (items = []) => {
  if (items.length === 0 || items.every((t) => t.status === "TODO")) return "Non Iniziata";
  if (items.every((t) => t.status === "Completata" || t.status === "Archiviata")) return "Completata";
  return "In Corso";
};

// scadenza più vicina tra le task della checklist (null se nessuna task ha deadline)
const getEarliestDeadline = (items = []) => {
  const times = items
    .map((t) => (t.deadline ? new Date(t.deadline).getTime() : NaN))
    .filter((time) => !isNaN(time));
  return times.length > 0 ? Math.min(...times) : null;
};

// ordina per scadenza crescente: chi gestisce il progetto vede prima le checklist
// con task in scadenza; quelle senza alcuna deadline finiscono in fondo
const sortByDeadline = (checklists) =>
  [...checklists].sort((a, b) => {
    const da = getEarliestDeadline(a.items);
    const db = getEarliestDeadline(b.items);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

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
      data={sortByDeadline(checklists)}
      emptyMessage="Nessuna checklist trovata per questo progetto."
      emptyIcon={ListTodo}
      containerClass="border border-slate-200/80 rounded-xl shadow-sm overflow-hidden bg-white"
      renderRow={(cl) => {
        const totalTasks = cl.items?.length || 0;
        const completedTasks = cl.items?.filter((t) => t.status === "Completata" || t.status === "Archiviata").length || 0;
        const checklistStatus = getChecklistStatus(cl.items);

        return (
          <TableRow
            key={cl.checklist_id}
            className="group transition-colors hover:bg-slate-50 cursor-pointer"
            onClick={() => onOpen(cl)}
            {...getClickableRowProps(() => onOpen(cl))}
          >

            {/* 1. CELLA: INFO CHECKLIST (solo nome e descrizione, niente icona) */}
            <TableCell className="text-center px-5 py-3.5">
              <div className="flex flex-col text-left min-w-0">
                <span className="font-semibold text-slate-900 text-sm leading-tight">
                  {uppercaseFirstLetter(cl.title)}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                  {uppercaseFirstLetter(cl.description) || 'Nessuna descrizione'}
                </span>
              </div>
            </TableCell>
            {/* 2. CELLA: TASK — completate/totali, per capire subito l'impatto della checklist sul progetto */}
            <TableCell className="text-center font-semibold text-slate-800 text-sm px-4 py-3">
              {completedTasks}/{totalTasks}
            </TableCell>

            {/* 3. CELLA: STATO */}
            <TableCell className="text-center font-semibold text-slate-800 text-sm px-4 py-3">
             <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center 
              ${getChecklistStatusBadgeClass(checklistStatus)}`}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {checklistStatus ?? "Unknown"}
    </Badge>
            </TableCell>

            

            {/* 3. CELLA: ULTIMO AGGIORNAMENTO */}
            <TableCell className="text-center px-4 py-3 text-xs text-slate-400 font-medium">
              {cl.last_updated ? formatDate(cl.last_updated) : NOT_AVAILABLE}
            </TableCell>

            {/* 6. CELLA: AZIONI OPERATIVE */}
            <TableCell className="text-center px-6 py-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-0.5">
                {isAdmin && (
                  <>
                    {/* checklist completata: sola visualizzazione, resta solo l'eliminazione */}
                    {checklistStatus !== "Completata" && (
                      <TableActionButton
                        onClick={(e) => { e.stopPropagation(); handleEdit(cl); }}
                        icon={Pencil}
                        color="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                      />
                    )}
                    <TableActionButton
                      onClick={(e) => { e.stopPropagation(); handleDelete(cl.checklist_id); }}
                      icon={Trash2}
                      color="text-red-600 hover:text-red-700 hover:bg-red-50/50"
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