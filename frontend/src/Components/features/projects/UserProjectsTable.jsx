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
import {
  getFullName,
  getProjectStatusBadgeClass,
  uppercaseFirstLetter,
  getClickableRowProps,
} from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";

// Tabella dei progetti assegnati all'utente: stesso stile della tabella admin (ProjectRow)
const UserProjectsTable = ({ data = [], handleProjectDetail }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader className="bg-muted/70 border-b border-border">
        <TableRow className="bg-muted/70 hover:bg-muted/70">
          <TableHead className="text-foreground font-semibold text-sm text-center px-4 py-3">Progetto</TableHead>
          <TableHead className="text-foreground font-semibold text-sm text-center px-4 py-3">Stato</TableHead>
          <TableHead className="text-foreground font-semibold text-sm text-center px-4 py-3">Creatore</TableHead>
          <TableHead className="text-foreground font-semibold text-sm text-center px-4 py-3">Responsabile</TableHead>
          <TableHead className="text-foreground font-semibold text-sm text-center px-4 py-3">Descrizione</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((project) => {
            return (
              <TableRow
                key={project.id}
                className="group cursor-pointer transition-colors hover:bg-muted/60"
                onClick={() => handleProjectDetail(project.id)}
                {...getClickableRowProps(() => handleProjectDetail(project.id))}
              >
                {/* 1. CELLA: INFO PROGETTO */}
                <TableCell className="text-center px-4 py-3">
                  <p className="font-bold text-foreground text-sm leading-tight">
                    {uppercaseFirstLetter(project.name)}
                  </p>
                </TableCell>

                {/* 2. CELLA: STATO */}
                <TableCell className="text-center px-4 py-3">
                  <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getProjectStatusBadgeClass(project.status)}`}>
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    {project.status ?? "Unknown"}
                  </Badge>
                </TableCell>

                {/* 3. CELLA: CREATORE */}
                <TableCell className="text-center px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <UserAvatar user={project.created_by} size="md" />
                    <div className="min-w-0 text-left">
                      <p className="font-medium text-sm text-foreground">
                        {getFullName(project.created_by)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">Creatore progetto</p>
                    </div>
                  </div>
                </TableCell>

                {/* 4. CELLA: RESPONSABILE */}
                <TableCell className="text-center px-4 py-3">
                  {project.manager ? (
                    <div className="flex items-center justify-center gap-3">
                      <UserAvatar user={project.manager} size="md" />
                      <div className="min-w-0 text-left">
                        <p className="font-medium text-sm text-foreground">
                          {getFullName(project.manager)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">Responsabile</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-muted-foreground font-medium">—</p>
                  )}
                </TableCell>

                {/* 5. CELLA: DESCRIZIONE */}
                <TableCell className="max-w-140 px-4 py-3 text-center text-sm text-muted-foreground">
                  <p className="line-clamp-2">
                    {project.description || "Nessuna descrizione disponibile."}
                  </p>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm font-medium">
              Nessun progetto assegnato trovato.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default UserProjectsTable;
