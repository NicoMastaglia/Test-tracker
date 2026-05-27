import React from "react";
import { TableCell, TableRow } from "@/Components/ui/table";
import StandardTable from "@/utils/StandardTable";
import { Badge } from "@/Components/ui/badge";
import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getInitials,
  getStatusBadgeClass,
} from "@/utils/tableHelpers";


const UserProjectsTable = ({ data = [], users = [] }) => {
  const headers = [
    { key: "id", label: "ID", className: "w-24 text-center" },
    { key: "project", label: "Progetto", className: "text-center" },
    { key: "status", label: "Stato", className: "text-center" },
    { key: "creator", label: "Creato da", className: "text-center" },
    { key: "desc", label: "Descrizione", className: "text-center" },
  ];

  return (
    <StandardTable
      headers={headers}
      data={data}
      emptyMessage={"Nessun progetto assegnato trovato."}
      renderRow={(project) => (
        <TableRow key={project.id} className="group transition-colors hover:bg-slate-50">
          <TableCell className="font-mono text-xs text-slate-500">#{project.id}</TableCell>

          <TableCell className="text-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
                {getInitials(project)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{project.name}</p>
                <p className="truncate text-xs text-slate-500">Creato il {formatTableDate(project.created_at ?? project.createdAt)}</p>
              </div>
            </div>
          </TableCell>

          <TableCell className="text-center">
            <Badge className={`border-none px-3 py-1 text-xs ${getStatusBadgeClass(project.status)}`}>
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {project.status ?? "Unknown"}
            </Badge>
          </TableCell>

          <TableCell className="text-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
                {getInitials(users.find((userItem) => Number(userItem.id) === Number(project.created_by)) || { name: "U" })}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{getCreatorName(project, users)}</p>
                <p className="truncate text-xs text-slate-500">Creatore progetto</p>
              </div>
            </div>
          </TableCell>

          <TableCell className="max-w-140 text-slate-600">
            <p className="line-clamp-2">{project.description || "Nessuna descrizione disponibile."}</p>
          </TableCell>
        </TableRow>
      )}
    />
  );
};

export default UserProjectsTable;