import React, { useState,useEffect,useMemo } from 'react';
import {Button} from "@/Components/ui/button"
import { toast } from "sonner";
import {Edit, Folder, Flag} from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ProjectRow from "./ProjectRow";
import StandardTable from "@/utils/components/StandardTable";
import ModalForm from "@/utils/components/ModalForm";
import DeleteConfirmModal from "@/utils/components/DeleteConfirmModal";
import { toDateInputValue, getFullName } from "@/utils/helpers/tableHelpers";
import { getAvailableProjectStatuses } from "@/utils/helpers/statusFlow";
import { withMinDuration } from "@/utils/helpers/withMinDuration";

const HEADERS = [
  { key: "project", label: "Progetto", className: "text-foreground font-semibold text-sm text-center px-4 py-3" },
  { key: "status", label: "Stato", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "creator", label: "Creatore", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "manager", label: "Responsabile", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "team", label: "Team", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "deadline", label: "Deadline", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "updated", label: "Ultimo aggiornamento", className: "text-foreground font-semibold text-sm px-4 py-3" },
  { key: "actions", label: "Azioni", className: "text-foreground font-semibold text-sm px-4 py-3" },
];


const ProjectTable = ({ data, users = [] }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const {
    fetchProjects,
    updateProject,
    deleteProject,
    updateProjectStatus,
  } = useProjectContext();

  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "",deadline: "", responsabile: "" });
  const [statusProject, setStatusProject] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const isAdmin = user?.role !== "user";
  const isSuperadmin = user?.role === "superadmin";


  useEffect(() => {
    if (editingProject) {
      setEditForm({
        name: editingProject.name ?? "",
        description: editingProject.description ?? "",
        deadline: toDateInputValue(editingProject.deadline),
        responsabile: editingProject.manager?.id ? String(editingProject.manager.id) : "",
      });
    }
  }, [editingProject]);

  // il responsabile è riassegnabile solo dal superadmin (il BE ignora manager_id per admin)
  const editFields = useMemo(() => {
    const base = [
      { name: "name", label: "Nome", type: "text" },
      { name: "description", label: "Descrizione", type: "textarea" },
      { name: "deadline", label: "Deadline", type: "date" },
    ];
    if (!isSuperadmin) return base;
    return [
      ...base,
      {
        name: "responsabile",
        label: "Responsabile",
        type: "select",
        placeholder: "Seleziona il responsabile del progetto",
        helperText: "Cambiare il responsabile toglierà l'accesso di gestione al precedente, se non è anche il creatore del progetto.",
        options: users.filter((u) => u.role === "admin").map((u) => ({
          value: String(u.id),
          label: getFullName(u),
        })),
      },
    ];
  }, [isSuperadmin, users]);

  const openEditDialog = (project) => {
    if (!isAdmin) return;
    // editForm viene popolato dalla useEffect su editingProject
    setEditingProject(project);
  };


  const handleUpdateProject = async () => {
    if (!isAdmin) {
      toast.error("Solo admin puo modificare un progetto");
      return;
    }
    if (!editingProject) return;
    if (editForm.name.trim() === "" || editForm.description.trim() === "") {
      toast.error("Nome e descrizione non possono essere vuoti");
      return;
    }

    if(editForm.deadline && isNaN(Date.parse(editForm.deadline))) {
      toast.error("Deadline non è una data valida");
      return;
    }

    if(editForm.deadline && new Date(editForm.deadline) < new Date()) {
      toast.error("La deadline non può essere una data passata");
      return;
    }
    try {
      await updateProject(editingProject.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        deadline: editForm.deadline || null,
        ...(isSuperadmin && editForm.responsabile ? { manager_id: Number(editForm.responsabile) } : {}),
      });
      await fetchProjects();
      toast.success("Progetto aggiornato con successo");
      setEditingProject(null);
    } catch (error) {
  
      const message = error.response?.data?.specific || error.response?.data?.error || "Errore durante l'aggiornamento del progetto"

      toast.error(message);

    }
  };

  const handleDeleteProject = async () => {
    if (!isSuperadmin) {
      toast.error("Solo superadmin puo eliminare un progetto");
      return;
    }
    if (!deleteProjectTarget) return;
    setDeletingProject(true);
    try {
      await withMinDuration(deleteProject(deleteProjectTarget.id));
      await fetchProjects();
      toast.success("Progetto eliminato con successo");
      setDeleteProjectTarget(null);
    } catch {
      toast.error("Errore durante l'eliminazione del progetto");
    } finally {
      setDeletingProject(false);
    }
  };

  const openStatusDialog = (project) => {
    if (!isAdmin) return;
    setStatusProject(project);
    setStatusValue("");
  };

  const performStatusUpdate = async () => {
    if (!statusProject) return;
    try {
      await updateProjectStatus(statusProject.id, statusValue);
      await fetchProjects();
      toast.success("Stato progetto aggiornato");
      setStatusProject(null);
    } catch (error) {
      const message = error.response?.data?.error;


      if (message === "Invalid status") {
        toast.error("Stato non valido. Gli stati validi sono: Attivo, Completato, In pausa.");
        return;
      }
      toast.error("Errore durante aggiornamento stato");
    }
  };

  const handleUpdateStatus = async () => {
    if (!isAdmin) {
      toast.error("Solo admin o superadmin possono aggiornare lo stato del progetto");
      return;
    }
    if (!statusProject) return;
    if (statusValue === "Completato") {
      setCompleteConfirmOpen(true);
      return;
    }
    await performStatusUpdate();
  };

  const handleConfirmComplete = async () => {
    await performStatusUpdate();
    setCompleteConfirmOpen(false);
  };

  const handleProjectRowClick = (projectId) => {
    if (!isAdmin) {
      navigate(`/user/projects/${projectId}`);
      return;
    }
    navigate(`/admin/projects/${projectId}`);
  };

  const hasProjectChanges =
    editForm.name.trim() !== (editingProject?.name ?? "").trim() ||
    editForm.description.trim() !== (editingProject?.description ?? "").trim() ||
    editForm.deadline !== toDateInputValue(editingProject?.deadline) ||
    (isSuperadmin && editForm.responsabile !== (editingProject?.manager?.id ? String(editingProject.manager.id) : ""));


  const customFooter = (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Annulla</Button>
      <Button
        type="button"
         className="bg-emerald-500 hover:bg-emerald-600 text-white"
        onClick={handleUpdateProject}
        disabled={!hasProjectChanges}
      >
        Salva modifiche
      </Button>
    </div>

  );
  return (
    <>
      <StandardTable
        containerClass="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-card"
        headers={HEADERS}
        data={data}
        emptyMessage="Nessun progetto trovato."
        emptyIcon={Folder}
        renderRow={(project) => (
          <ProjectRow
            key={project.id}
            project={project}
            isAdmin={isAdmin}
            isSuperadmin={isSuperadmin}
            users={users}
            handleProjectRowClick={handleProjectRowClick}
            openEditDialog={openEditDialog}
            openStatusDialog={openStatusDialog}
            setDeleteProjectTarget={setDeleteProjectTarget}
          />
        )}
      />



      <ModalForm
        modalOpen={!!editingProject}
        setModalOpen={setEditingProject}
        title="Modifica progetto"
        infos="Aggiorna nome e descrizione del progetto"
        fields={editFields}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleUpdateProject}
        submitLabel="Salva modifiche"
        submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
        dialogClassName="sm:max-w-124.25"
        titleIcon={Edit}
        iconColor="text-emerald-600"
        customFooter={customFooter}

    
      />

     

    
     <ModalForm 
        modalOpen={!!statusProject}
        setModalOpen={setStatusProject}
        title="Aggiorna stato progetto"
        infos="Seleziona uno stato valido lato backend."
        fields={[
          { name: "status", label: "Stato", type: "select", options: getAvailableProjectStatuses(statusProject?.status).map(status => ({ value: status, label: status })) }
        ]}
        formData={{ status: statusValue }}
        setFormData={(data) => setStatusValue(data.status)}
        onSubmit={handleUpdateStatus}
        submitLabel="Aggiorna stato"
        submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
        dialogClassName="sm:max-w-105"
        titleIcon={Edit}
        iconColor="text-emerald-600"
      />

      <ModalForm
        modalOpen={completeConfirmOpen}
        setModalOpen={setCompleteConfirmOpen}
        title="Completa progetto"
        infos="Stai per impostare il progetto su “Completato”."
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            È un'azione finale: il progetto non sarà più modificabile e non si potrà tornare allo stato precedente. Confermi?
          </div>
        )}
        onSubmit={handleConfirmComplete}
        submitLabel="Completa progetto"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={Flag}
        iconColor="text-emerald-500"
        submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
      />

      <DeleteConfirmModal
        modalOpen={!!deleteProjectTarget}
        setModalOpen={setDeleteProjectTarget}
        itemPhrase="il progetto"
        itemName={deleteProjectTarget?.name}
        extraInfo="Verranno eliminate anche tutte le checklist, le task, le sessioni di test e le assegnazioni del team collegate a questo progetto."
        onConfirm={handleDeleteProject}
        confirmLabel="Sì, Elimina progetto"
        loading={deletingProject}
      />


       

     
      

    
    </>
  );
};

export default ProjectTable;
