import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

// Header cliccabile per colonne ordinabili (asc/desc/nessuno). Da usare nella `header`
// di una columnDef: header: ({ column }) => <SortableHeader column={column} label="Data" />
export const SortableHeader = ({ column, label }) => {
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-slate-600"
    >
      {label}
      <Icon className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );
};

// Tabella generica con ordinamento e filtro colonna (@tanstack/react-table).
// Le columnDef (con eventuali sortingFn/filterFn) si definiscono fuori da qui.
// Pensata per essere riusata sia per l'audit log di un progetto che per quello globale.
const DataTable = ({ columns, data = [], emptyMessage = "Nessun dato trovato." }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-slate-50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-5 py-3.5">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/60">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-5 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
