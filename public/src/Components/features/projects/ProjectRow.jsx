import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2, UserPlus, Flag } from "lucide-react";

const ProjectRow = ({
  project,
  isAdmin,
  isSuperadmin,
  users,
  calculateProgress,
  getProjectStatusBadge,
  handleProjectRowClick,
  openEditDialog,
  openStatusDialog,
  openAssignDialog,
  setDeleteProjectTarget,
}) => {
  const progressValue = calculateProgress(project.id);
  const canOpenProjectDetail = isAdmin || isSuperadmin;

  return (
    <TableRow
      key={project.id}
      className={`group transition-colors hover:bg-slate-50 ${canOpenProjectDetail ? "cursor-pointer" : ""}`}
      onClick={() => handleProjectRowClick(project.id)}
    >
      <TableCell className="font-mono text-slate-500">#{project.id}</TableCell>
      <TableCell className="font-semibold text-slate-900">{project.name}</TableCell>
      <TableCell>{getProjectStatusBadge(project.status)}</TableCell>
      <TableCell className="font-semibold text-slate-900">{users.find(u => u.id === project.created_by)?.nome.concat(" ", users.find(u => u.id === project.created_by)?.cognome) || "Unknown"}</TableCell>
      <TableCell className="font-semibold text-slate-900">QUI I TESTER ASSEGNATI</TableCell>
      <TableCell className="font-semibold text-slate-900">SESSIONI ATTIVEE</TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Avanzamento</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-slate-100" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          {isAdmin && (
            <>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); openEditDialog(project); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-amber-600" onClick={(e) => { e.stopPropagation(); openStatusDialog(project); }}>
                <Flag className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); openAssignDialog(project); }}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </>
          )}
          {isSuperadmin && (
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); setDeleteProjectTarget(project); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProjectRow;
