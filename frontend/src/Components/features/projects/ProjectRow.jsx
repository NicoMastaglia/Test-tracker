import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/Components/ui/tooltip";
import { Pencil, Trash2, Flag } from "lucide-react";
import {
  formatTableDate,
  getCreatorName,
  getFullName,
  getProjectStatusBadgeClass,
  getClickableRowProps,
} from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import TableActionButton from "@/utils/components/TableActionButton";
import {  uppercaseFirstLetter  } from "@/utils/helpers/tableHelpers";
import   {getRelativeTime}  from "@/utils/helpers/tableHelpers";

const ProjectRow = ({ project, isAdmin, isSuperadmin, users, handleProjectRowClick, openEditDialog, openStatusDialog, setDeleteProjectTarget }) => {
  const canOpenProjectDetail = isAdmin || isSuperadmin;
  const creator = project.created_by;   // chi ha creato il progetto
  const responsabile = project.manager; // responsabile (può differire dal creatore)
  const assignedUsers = Array.isArray(project.user_list) ? project.user_list : [];
  const visibleAssignees = assignedUsers.slice(0, 2);
  const extraAssignees = Math.max(assignedUsers.length - visibleAssignees.length, 0);

  

  return (
   <TableRow
  key={project.id}
  className={`group transition-colors hover:bg-muted/60 ${canOpenProjectDetail ? "cursor-pointer" : ""}`}
  onClick={() => handleProjectRowClick(project.id)}
  {...(canOpenProjectDetail ? getClickableRowProps(() => handleProjectRowClick(project.id)) : {})}
>
  {/* 1. CELLA: INFO PROGETTO (Centrata) */}
  <TableCell className="text-center px-4 py-3">
    <p className="font-semibold text-foreground text-sm leading-tight">
      {uppercaseFirstLetter(project.name)}
    </p>
  </TableCell>

  {/* 2. CELLA: STATUS BADGE (Centrato) */}
  <TableCell className="text-center px-4 py-3">
    <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getProjectStatusBadgeClass(project.status)}`}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {project.status ?? "Unknown"}
    </Badge>
  </TableCell>

  {/* 3a. CELLA: CREATORE AVATAR (Centrato) */}
  <TableCell className="text-center px-4 py-3">
    <div className="flex items-center justify-center">
      <Tooltip key={`creator-${creator?.id ?? project.created_by}`}>
        <TooltipTrigger>
          <div>
            <UserAvatar user={creator} size="md" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-3 py-2 text-xs font-medium">
          <span className="whitespace-nowrap">{creator ? getFullName(creator) : getCreatorName(project, users)}</span>
        </TooltipContent>
      </Tooltip>
    </div>
  </TableCell>

  {/* 3b. CELLA: RESPONSABILE AVATAR (Centrato) */}
  <TableCell className="text-center px-4 py-3">
    <div className="flex items-center justify-center">
      {responsabile ? (
        <Tooltip key={`manager-${responsabile?.id ?? project.manager_id}`}>
          <TooltipTrigger>
            <div>
              <UserAvatar user={responsabile} size="md" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 text-xs font-medium">
            <span className="whitespace-nowrap">{getFullName(responsabile)}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-xs text-muted-foreground font-medium">—</span>
      )}
    </div>
  </TableCell>

  {/* 4. CELLA: TEAM ASSEGNATO (Allineato a sinistra/centro fluido) */}
  <TableCell className="px-4 py-3">
    <div className="flex items-center justify-center gap-1.5">
      {visibleAssignees.length > 0 ? (
        visibleAssignees.map((assignedUser) => (
          <Tooltip key={assignedUser.id ?? assignedUser.user_id}>
            <TooltipTrigger asChild>
              <div>
                <UserAvatar user={assignedUser} size="sm" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="px-3 py-2 text-xs font-medium">
              <span className="whitespace-nowrap">{getFullName(assignedUser)}</span>
            </TooltipContent>
          </Tooltip>
        ))
      ) : (
        <span className="text-xs text-muted-foreground font-medium">Nessun tester</span>
      )}

      {/* Contatore Extra (+X) */}
      {extraAssignees > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-muted-foreground border border-border/40 shadow-sm cursor-help">
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
  <TableCell className="text-center px-4 py-3 font-medium text-sm text-muted-foreground">
    {project.deadline ? formatTableDate(project.deadline) : "—"}
  </TableCell>

  {/* 6. CELLA: ULTIMO AGGIORNAMENTO (Grigio Chiaro, Centrato) */}
  <TableCell className="text-center px-4 py-3 text-sm text-muted-foreground font-medium">
    {project.updated_at ?  getRelativeTime(project.updated_at) : "nessun aggiornamento"}
  </TableCell>

  {/* 7. CELLA: AZIONI OPERATIVE (Centrato) */}
  <TableCell className="text-center px-4 py-3" onClick={(e) => e.stopPropagation()}>
    <div className="flex items-center justify-center gap-1">
      {(isAdmin || isSuperadmin) && project.status !== "Completato" ? (
        <>
          <TableActionButton
            onClick={() => openEditDialog(project)}
            icon={Pencil}
            color="text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10"
            action="Modifica progetto"
          />
          <TableActionButton
            onClick={() => openStatusDialog(project)}
            icon={Flag}
            color="text-amber-600 hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-500/10"
            action="Aggiorna stato"
          />
        </>
      ) : (isAdmin || isSuperadmin) ? null : (
        <span className="text-xs text-muted-foreground font-medium">—</span>
      )}

      {isSuperadmin && (
        <TableActionButton
          onClick={() => setDeleteProjectTarget(project)}
          icon={Trash2}
          color="text-red-600 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-500/10"
          action="Elimina progetto"
        />
      )}
    </div>
  </TableCell>
</TableRow>
  );
};

export default ProjectRow;
