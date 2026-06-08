import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { Pencil, Trash2, Flag } from "lucide-react";
import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getInitials,
  getRoundColorClass,
  getProjectStatusBadgeClass,
} from "@/utils/tableHelpers";

const ProjectRow = ({ project, isAdmin, isSuperadmin, users, calculateProgress, sessionCount, handleProjectRowClick, openEditDialog, openStatusDialog, setDeleteProjectTarget }) => {
  const progressValue = calculateProgress(project.id);
  const canOpenProjectDetail = isAdmin || isSuperadmin;
  const creator = project.created_by || users.find((user) => user.id === project.created_by);
  const assignedUsers = Array.isArray(project.user_list) ? project.user_list : [];
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
        <div className="flex items-center justify-center gap-3 text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm shadow-sm ${getRoundColorClass(0)}`}>
                {getInitials(creator)}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-none px-3 py-2 text-xs">
              <span className="whitespace-nowrap">Creato da: {creator ? getFullName(creator) : getCreatorName(project, users)}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {visibleAssignees.length > 0 ? (
            visibleAssignees.map((assignedUser, index) => (
              <Tooltip key={assignedUser.id ?? assignedUser.user_id}>
                <TooltipTrigger asChild>
                  <div className={`flex h-12 w-12 items-center gap-2 rounded-full px-2 py-1 shadow-sm ${getRoundColorClass(index + 1)}`}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-xs text-slate-700 shadow-sm">
                      {getInitials(assignedUser)}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="px-3 py-2 text-xs">
                  <div className="flex flex-col gap-0.5">
                    {/* <span className="font-medium">Tester assegnato</span> */}
                    <span className="whitespace-nowrap">{getFullName(assignedUser)}</span>
                    
                  </div>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <span className="text-sm text-slate-500">Nessun tester assegnato</span>
          )}

          {extraAssignees > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex h-7 items-center justify-center rounded-full px-3 text-xs shadow-sm ${getRoundColorClass(visibleAssignees.length + 1)}`}>
                  + {extraAssignees}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-3 py-2 text-xs">
                <div className="flex flex-col gap-1">
                 
                  {assignedUsers.slice(2).map((assignedUser) => (
                    <div key={assignedUser.id ?? assignedUser.user_id} className="flex flex-col">
                      <span className="whitespace-nowrap">{getFullName(assignedUser)}</span>
                    
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>

      <TableCell className="font-medium text-slate-900">{sessionCount ?? 0}</TableCell>

      <TableCell>
        <div className="flex flex-col gap-2">
          <Progress value={progressValue} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-center gap-2">
          {isAdmin || isSuperadmin ? (
            <>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); openEditDialog(project); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-amber-600" onClick={(e) => { e.stopPropagation(); openStatusDialog(project); }}>
                <Flag className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-sm text-slate-500">Nessuna azione disponibile</span>
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
