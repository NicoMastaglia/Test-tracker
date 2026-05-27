import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Pencil, Trash2, UserPlus, Flag } from "lucide-react";
import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getInitials,
  getProjectStatusBadgeClass,
} from "@/utils/tableHelpers";

const ProjectRow = ({
  project,
  isAdmin,
  isSuperadmin,
  users,
  calculateProgress,
  sessionCount,
  handleProjectRowClick,
  openEditDialog,
  openStatusDialog,
  openAssignDialog,
  setDeleteProjectTarget,
}) => {
  const progressValue = calculateProgress(project.id);
  const canOpenProjectDetail = isAdmin || isSuperadmin;
  const creator = users.find((userItem) => Number(userItem.id) === Number(project.created_by));
  const assignedUsers = Array.isArray(project.assigned_users) ? project.assigned_users : [];
  const visibleAssignees = assignedUsers.slice(0, 2);
  const extraAssignees = Math.max(assignedUsers.length - visibleAssignees.length, 0);

  return (
    <TableRow
      key={project.id}
      className={`group transition-colors hover:bg-slate-50 ${canOpenProjectDetail ? "cursor-pointer" : ""}`}
      onClick={() => handleProjectRowClick(project.id)}
    >
      <TableCell className="font-mono text-slate-500">#{project.id}</TableCell>

      <TableCell>
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

      <TableCell>
        <Badge className={`border-none px-3 py-1 text-xs ${getProjectStatusBadgeClass(project.status)}`}>
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {project.status ?? "Unknown"}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
            {creator ? getInitials(creator) : "U"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{creator ? getFullName(creator) : getCreatorName(project, users)}</p>
            <p className="truncate text-xs text-slate-500">Creatore progetto</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {visibleAssignees.length > 0 ? (
            visibleAssignees.map((assignedUser) => (
              <div key={assignedUser.id ?? assignedUser.user_id} className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] text-slate-700 shadow-sm">
                  {getInitials(assignedUser)}
                </div>
                <span className="text-xs text-slate-600">{getFullName(assignedUser)}</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-slate-500">Nessun tester assegnato</span>
          )}

          {extraAssignees > 0 && (
            <div className="flex h-7 items-center justify-center rounded-full bg-slate-100 px-3 text-xs text-slate-600">
              +{extraAssignees}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="font-medium text-slate-900">
        {sessionCount ?? 0}
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-2">
          <Progress value={progressValue} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
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
