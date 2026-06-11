import { Pencil, Trash2,ExternalLink } from 'lucide-react';
import { Button} from "@/Components/ui/button";
import StandardTable from "@/utils/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";


import React,{useState,useEffect} from 'react';

// Configurazione delle intestazioni della tabella con chiavi e css
const HEADERS = [
  { key: "id",          label: "#",                    className: "w-16 font-semibold text-slate-900 text-center" },
  { key: "title",       label: "Titolo",               className: "font-semibold text-slate-900 text-center" },
  { key: "last_update", label: "Ultimo aggiornamento", className: "font-semibold text-slate-900 text-center" },
  { key: "actions",     label: "Azioni",                  className: "w-28 text-slate-900 text-center" },
];

const ButtonAction = ({ onClick, icon: Icon, label,color }) => (
  <Button
    size="sm"
    onClick={onClick}
    className={`gap-1.5 bg-transparent text-slate-400 ${color}`}
  >
    <Icon className={`h-3.5 w-3.5`} />
    {label}
  </Button>
);




// Formatta la data in formato italiano o restituisce un placeholder se non valida
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

const ChecklistTable = ({ checklists = [], onOpen,handleEdit,handleDelete
  ,isAdmin
 }) => (
  <StandardTable
    headers={HEADERS}
    data={checklists}
    emptyMessage="Nessuna checklist trovata per questo progetto."
    containerClass=""
    renderRow={(cl,index) => (
      <TableRow key={cl.checklist_id} className="group transition-colors hover:bg-slate-50">
        <TableCell className="font-mono text-slate-400 text-center">#{index+1}</TableCell>
        <TableCell className="font-semibold text-slate-900">{cl.title}</TableCell>
        <TableCell className="text-slate-500 text-center">{formatDate(cl.last_updated)}</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            <ButtonAction
              onClick={() => onOpen(cl)}
              icon={ExternalLink}
              color="hover:text-green-600"
              // label="Apri"

            />

            {isAdmin && (
            <>
            <ButtonAction
                onClick={() => handleEdit(cl)}
                icon={Pencil}
                color="hover:text-emerald-600" />

                <ButtonAction
                  onClick={() => handleDelete(cl.checklist_id)}
                  icon={Trash2}
                  color="hover:text-red-600" /></>
              )}

           
          </div>
        </TableCell>
      </TableRow>
    )}
  />
);

export default ChecklistTable;
