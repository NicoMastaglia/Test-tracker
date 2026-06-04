import { ExternalLink } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { TableRow, TableCell } from "@/Components/ui/table";
import StandardTable from "@/utils/StandardTable";


// Configurazione delle intestazioni della tabella con chiavi e css
const HEADERS = [
  { key: "id",          label: "#",                    className: "w-16 font-semibold text-white text-center" },
  { key: "title",       label: "Titolo",               className: "font-semibold text-white" },
  { key: "last_update", label: "Ultimo aggiornamento", className: "font-semibold text-white text-center" },
  { key: "actions",     label: "",                     className: "w-28 text-white" },
];


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

const CheckListTable = ({ checklists = [], onOpen }) => (
  <StandardTable
    headers={HEADERS}
    data={checklists}
    emptyMessage="Nessuna checklist trovata per questo progetto."
    renderRow={(cl) => (
      <TableRow key={cl.id} className="group transition-colors hover:bg-slate-50">
        <TableCell className="font-mono text-slate-500 text-center">#{cl.id }</TableCell>
        <TableCell className="font-semibold text-slate-900">{cl.title}</TableCell>
        <TableCell className="text-slate-600 text-center">{formatDate(cl.last_updated)}</TableCell>
        <TableCell className="text-center">
          <Button
            size="sm"
            onClick={() => onOpen(cl)}
            className="bg-slate-900 hover:bg-slate-700 text-white gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Apri
          </Button>
        </TableCell>
      </TableRow>
    )}
  />
);

export default CheckListTable;
