import React,{useEffect} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getInitials,
  getProjectStatusBadgeClass,
} from "@/utils/tableHelpers";




const UserProjectsTable = ({ data = [], handleProjectDetail}) => {


  useEffect(() => {
    console.log("Dati progetti ricevuti:", data);
  }, [data]);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-24 text-center font-semibold text-slate-900">
              ID
            </TableHead>
            <TableHead className="text-center font-semibold text-slate-900">
              Progetto
            </TableHead>
            <TableHead className="text-center font-semibold text-slate-900">
              Stato
            </TableHead>
            <TableHead className="text-center font-semibold text-slate-900">
              Creato da
            </TableHead>
            <TableHead className="text-center font-semibold text-slate-900">
              Descrizione
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((project) => (
              <TableRow
                key={project.id}
                className="group transition-colors hover:bg-slate-50"
                onClick={() => handleProjectDetail(project.id)}
              >
                <TableCell className="font-mono text-xs text-slate-400">
                  #{project.id}
                </TableCell>

                <TableCell className="text-slate-900">
                  <div className="flex items-center gap-3 justify-center">
                    {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
                      {getInitials(project)}
                    </div> */}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Creato il{" "}
                        {formatTableDate(
                          project.created_at ?? project.createdAt,
                        )}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={`border-none px-3 py-1 text-xs ${getProjectStatusBadgeClass(project.status)}`}
                  >
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    {project.status ?? "Unknown"}
                  </Badge>
                </TableCell>

                <TableCell className="text-slate-900">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-900">
                      {getInitials(project.created_by)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {project.created_by.nome.slice(0, 1).toUpperCase() +
                          project.created_by.nome.slice(1).toLowerCase()}{" "}
                        {project.created_by.cognome.slice(0, 1).toUpperCase() +
                          project.created_by.cognome.slice(1).toLowerCase()}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Creatore progetto
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="max-w-140 text-slate-500">
                  <p className="line-clamp-2">
                    {project.description || "Nessuna descrizione disponibile."}
                  </p>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-slate-500"
              >
                Nessun progetto assegnato trovato.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserProjectsTable;