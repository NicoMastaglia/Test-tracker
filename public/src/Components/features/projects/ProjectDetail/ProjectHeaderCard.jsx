import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Folder, Pencil, MoreVertical, Trash2 } from "lucide-react";
import { getFullName, getProjectStatusBadgeClass, uppercaseFirstLetter } from "@/utils/helpers/tableHelpers";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import ProjectSectionNav from "./ProjectSectionNav";
import EntityHeaderCard from "@/utils/components/EntityHeaderCard";
import StatusDropdown from "@/utils/components/StatusDropdown";
import { PROJECT_STATUSES, getAvailableProjectStatuses } from "@/utils/helpers/statusFlow";

// COMPONENTE PER LA CARD HEADER DEL PROGETTO, MOSTRA IL NOME DEL PROGETTO, LO STATO, IL CODICE, IL CREATORE E LA DESCRIZIONE
const ProjectHeaderCard = ({
  selectedProject,
  activeSection,
  oneSectionChange,
  counts,
  isAdmin,
  isSuperAdmin,
  onEditProject,
  onChangeStatus,
  onDeleteProject,
}) => {
  // I pulsanti "Cambia stato"/"Modifica" e il menu "⋮" sono visibili solo dentro "Panoramica"
  // Il menu "⋮" con l'opzione "Elimina progetto" è visibile solo agli super admin
  const showActions = activeSection === "overview" && isAdmin;

  // un progetto completato non è più modificabile
  const isCompleted = selectedProject.status === "Completato";

  // Solo le transizioni di stato consentite risultano selezionabili nel dropdown
  const allowedStatuses = getAvailableProjectStatuses(selectedProject.status);
  const statusOptions = PROJECT_STATUSES.map((status) => ({
    ...status,
    disabled: !allowedStatuses.includes(status.value),
  }));

  return (
    <EntityHeaderCard
      icon={Folder}
      title={uppercaseFirstLetter(selectedProject.name ?? selectedProject.nome ?? "Progetto senza nome")}
      badge={
        <Badge
          className={`border-none px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center justify-center gap-1.5 ${getProjectStatusBadgeClass(selectedProject.status)}`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {selectedProject.status ?? NOT_AVAILABLE}
        </Badge>
      }
      description={
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Codice: <span className="font-semibold text-slate-700">#{selectedProject.id}</span>
          </span>

          <span className="text-slate-200 font-normal">|</span>

          <span>
            Creato da{" "}
            <span className="font-semibold text-slate-700">
              {selectedProject.created_by ? getFullName(selectedProject.created_by) : NOT_AVAILABLE}
            </span>
          </span>
        </div>
      }
      actions={
        showActions ? (
          <>
            
            <StatusDropdown
              currentStatus={selectedProject.status}
              options={statusOptions}
              onSelect={onChangeStatus}
            />

            <Button
              onClick={onEditProject}
              disabled={isCompleted}
              title={isCompleted ? "Progetto completato: non modificabile" : undefined}
              className="h-9 gap-2 rounded-lg bg-emerald-500 text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500 disabled:hover:shadow-sm"
            >
              <Pencil className="h-4 w-4" />
              Modifica
            </Button>

            {isSuperAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-slate-200 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem variant="destructive" onClick={onDeleteProject}>
                    <Trash2 className="h-4 w-4" />
                    Elimina progetto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        ) : null
      }
      footer={
        <ProjectSectionNav
          activeSection={activeSection}
          onSectionChange={oneSectionChange}
          counts={counts}
          isAdmin={isAdmin}
        />
      }
    />
  );
};

export default ProjectHeaderCard;
