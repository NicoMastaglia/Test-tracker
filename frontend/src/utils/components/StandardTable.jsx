// componente riutilizzabile per visualizzare tabelle, con paginazione client-side integrata
// ancora da implementare: ordinamento e filtraggio (oltre alla ricerca testuale già gestita dalle pagine tramite ActionBar)


import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";

const StandardTable = ({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "Nessun dato trovato.",
  emptyIcon: EmptyIcon,
  emptyAction,
  containerClass = "mx-auto my-8 max-w-300 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // se la lista si riduce (es. filtro di ricerca) la pagina richiesta potrebbe non
  // esistere più: "safePage" la riporta automaticamente nel range valido, senza
  // bisogno di un useEffect per resettare currentPage.
  const totalPages = Math.max(Math.ceil(data.length / pageSize), 1);
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedData = data.slice(pageStart, pageStart + pageSize);

  return (
    <div className={containerClass}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="bg-slate-50 hover:bg-slate-50 center">
              {headers.map((h, idx) => (
                <TableHead key={h.key ?? idx} className={`${h.className ?? "font-semibold text-slate-900"} text-center`}>
                  {h.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              // l'indice passato a renderRow è globale (non relativo alla pagina), così
              // numerazioni tipo "#12" restano corrette anche dalla seconda pagina in poi
              paginatedData.map((item, idx) => renderRow ? renderRow(item, pageStart + idx) : null)
            ) : (
              <TableRow >
                <TableCell colSpan={Math.max(headers.length, 1)} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    {EmptyIcon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <EmptyIcon className="h-6 w-6" />
                      </div>
                    )}
                    <span className="text-sm text-slate-500">{emptyMessage}</span>
                    {emptyAction}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <span className="text-xs text-slate-500">
            Pagina {safePage} di {totalPages} · {data.length} risultati
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Pagina precedente"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Pagina successiva"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardTable;
