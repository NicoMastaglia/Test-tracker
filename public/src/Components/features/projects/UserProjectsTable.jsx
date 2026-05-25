import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";

const getStatusBadgeClass = (status) => {
  const normalizedStatus = (status ?? "").toString().trim().toLowerCase();

  if (normalizedStatus === "attivo" || normalizedStatus === "active") {
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none";
  }

  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
  }

  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
    return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none";
  }

  return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none";
};

const getCreatorName = (project, users) => {
  const creator = users.find((user) => Number(user.id) === Number(project.created_by));

  if (!creator) {
    return `User ${project.created_by ?? "-"}`;
  }

  const fullName = [creator.nome ?? creator.name ?? "", creator.cognome ?? creator.surname ?? ""]
    .filter(Boolean)
    .join(" ");

  return fullName || creator.email || `User ${creator.id}`;
};

const UserProjectsTable = ({ data = [], users = [] }) => {
  return (
    <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="w-25 text-center font-bold text-white">Project #</TableHead>
            <TableHead className="text-center font-bold text-white">Name</TableHead>
            <TableHead className="text-center font-bold text-white">Status</TableHead>
            <TableHead className="text-center font-bold text-white">Created By</TableHead>
            <TableHead className="text-center font-bold text-white">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((project) => (
              <TableRow key={project.id} className="transition-colors hover:bg-slate-50/70">
                <TableCell className="font-mono text-xs text-slate-500">#{project.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{project.name}</TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusBadgeClass(project.status)}>{project.status ?? "Unknown"}</Badge>
                </TableCell>
                <TableCell className="text-slate-600">{getCreatorName(project, users)}</TableCell>
                <TableCell className="max-w-140 truncate text-slate-600">{project.description || "Nessuna descrizione disponibile."}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
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