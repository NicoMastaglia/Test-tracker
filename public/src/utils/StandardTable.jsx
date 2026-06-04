

// componente riutilizzabile per visualizzare tabelle 
// ancora da implementare funzionalità di ordinamento, paginazione e filtraggio


import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/Components/ui/table";

const StandardTable = ({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "Nessun dato trovato.",
  containerClass = "mx-auto my-8 max-w-300 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
}) => {
  return (
    <div className={containerClass}>
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="bg-slate-900 hover:bg-slate-900 text-center">
            {headers.map((h, idx) => (
              <TableHead key={h.key ?? idx} className={`${h.className ?? "font-semibold text-white"}`}>
                {h.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.length > 0 ? (
            data.map((item, idx) => renderRow ? renderRow(item, idx) : null)
          ) : (
            <TableRow>
              <TableCell colSpan={Math.max(headers.length, 1)} className="h-24 text-center text-slate-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandardTable;
