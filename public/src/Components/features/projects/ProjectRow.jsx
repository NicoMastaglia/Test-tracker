import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/Components/ui/tooltip";
import { Pencil, Trash2, Flag,Folder  } from "lucide-react";

import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getProjectStatusBadgeClass,
} from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import {  uppercaseFirstLetter  } from "@/utils/helpers/tableHelpers";

const ProjectRow = ({ project, isAdmin, isSuperadmin, users, handleProjectRowClick, openEditDialog, openStatusDialog, setDeleteProjectTarget,colorClass }) => {
  const canOpenProjectDetail = isAdmin || isSuperadmin;
  const creator = project.created_by || users.find((user) => user.id === project.created_by);
  const assignedUsers = Array.isArray(project.user_list) ? project.user_list : [];
  const visibleAssignees = assignedUsers.slice(0, 2);
  const extraAssignees = Math.max(assignedUsers.length - visibleAssignees.length, 0);

  

  return (
   <TableRow
  key={project.id}
  className={`group transition-colors hover:bg-slate-50/60 ${canOpenProjectDetail ? "cursor-pointer" : ""}`}
  onClick={() => handleProjectRowClick(project.id)}
>
  {/* 1. CELLA: INFO PROGETTO (Allineata a sinistra) */}
  <TableCell className="text-left px-4 py-3">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent ${colorClass}`}>
        <Folder className="h-5 w-5 text-current" />
      </div>
      
      <div className="flex flex-col text-left">
        <p className="font-semibold text-slate-900 text-sm leading-tight">
          {uppercaseFirstLetter(project.name)}
        </p>
        <p className="text-xs text-slate-400 mt-0.5"> 
          {project.type ?? project.tipo ?? 'Qui mettiamo tipologia'}
        </p>
      </div>
    </div>
  </TableCell>

  {/* 2. CELLA: STATUS BADGE (Centrato) */}
  <TableCell className="text-center px-4 py-3">
    <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getProjectStatusBadgeClass(project.status)}`}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {project.status ?? "Unknown"}
    </Badge>
  </TableCell>

  {/* 3. CELLA: RESPONSABILE AVATAR (Centrato) */}
  <TableCell className="text-center px-4 py-3">
    <div className="flex items-center justify-center">
      <Tooltip>
        <UserAvatar 
            user={creator} 
            colorIndex={project.id}
            // className={`${colorClass} font-semibold`} 
            size="md" 
          />
        <TooltipContent className="px-3 py-2 text-xs font-medium">
          <span className="whitespace-nowrap">Creato da: {creator ? getFullName(creator) : getCreatorName(project, users)}</span>
        </TooltipContent> 
      </Tooltip>
    </div>
  </TableCell>

  {/* 4. CELLA: TEAM ASSEGNATO (Allineato a sinistra/centro fluido) */}
  <TableCell className="px-4 py-3">
    <div className="flex items-center justify-center gap-1.5">
      {visibleAssignees.length > 0 ? (
        visibleAssignees.map((assignedUser, index) => (
          <Tooltip key={assignedUser.id ?? assignedUser.user_id}>
            <TooltipTrigger asChild>
              <div>
                <UserAvatar user={assignedUser} colorIndex={index + 1} size="sm" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="px-3 py-2 text-xs font-medium">
              <span className="whitespace-nowrap">{getFullName(assignedUser)}</span>
            </TooltipContent>
          </Tooltip>
        ))
      ) : (
        <span className="text-xs text-slate-400 font-medium">Nessun tester</span>
      )}

      {/* Contatore Extra (+X) */}
      {extraAssignees > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 border border-slate-200/40 shadow-sm cursor-help">
              +{extraAssignees}
            </div>
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 text-xs font-medium">
            <div className="flex flex-col gap-1">
              {assignedUsers.slice(2).map((assignedUser) => (
                <span key={assignedUser.id ?? assignedUser.user_id} className="whitespace-nowrap">
                  {getFullName(assignedUser)}
                </span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </TableCell>

  {/* 5. CELLA: DEADLINE (Testo Grigio Scuro Elegante, Centrato) */}
  <TableCell className="text-center px-4 py-3 font-medium text-sm text-slate-600">
    {project.deadline ? formatTableDate(project.deadline) : "—"}
  </TableCell>

  {/* 6. CELLA: ULTIMO AGGIORNAMENTO (Grigio Chiaro, Centrato) */}
  <TableCell className="text-center px-4 py-3 text-xs text-slate-400 font-medium">
    {project.last_updated ? formatTableDate(project.last_updated) : "—"}
  </TableCell>

  {/* 7. CELLA: AZIONI OPERATIVE (Centrato) */}
  <TableCell className="text-center px-4 py-3" onClick={(e) => e.stopPropagation()}>
    <div className="flex items-center justify-center gap-1">
      {isAdmin || isSuperadmin ? (
        <>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80" onClick={() => openEditDialog(project)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50" onClick={() => openStatusDialog(project)}>
            <Flag className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <span className="text-xs text-slate-400 font-medium">—</span>
      )}
      
      {isSuperadmin && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50/50" onClick={() => setDeleteProjectTarget(project)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  </TableCell>
</TableRow>
  );
};

export default ProjectRow;
