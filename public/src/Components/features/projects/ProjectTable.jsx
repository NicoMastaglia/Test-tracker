import React, { useState,useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {Button} from "@/Components/ui/button"
import { toast } from "sonner";
import {User, Trash2, Edit, AlertTriangle} from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ProjectRow from "./ProjectRow";
import ModalForm from "@/utils/components/ModalForm";
import { getRoundColorClass, toDateInputValue } from "@/utils/helpers/tableHelpers";
import { getAvailableProjectStatuses } from "@/utils/helpers/statusFlow";


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
  const [editForm, setEditForm] = useState({ name: "", description: "",deadline: "" });
  const [statusProject, setStatusProject] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  const isAdmin = user?.role !== "user";
  const isSuperadmin = user?.role === "superadmin";
  
 
  useEffect(() => {
    if (editingProject) {
      setEditForm({
        name: editingProject.name ?? "",
        description: editingProject.description ?? "",
        deadline: toDateInputValue(editingProject.deadline),
      });
    }
  }, [editingProject]);
  
  const openEditDialog = (project) => {
    if (!isAdmin) return;
    // editForm viene popolato dalla useEffect su editingProject
    setEditingProject(project);
  };


  const handleUpdateProject = async () => {
    console.log('aggiorno progetto')
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
    try {
      await deleteProject(deleteProjectTarget.id);
      await fetchProjects();
      toast.success("Progetto eliminato con successo");
      setDeleteProjectTarget(null);
    } catch {
      toast.error("Errore durante l'eliminazione del progetto");
    }
  };

  const openStatusDialog = (project) => {
    if (!isAdmin) return;
    setStatusProject(project);
    setStatusValue("");
  };

  const handleUpdateStatus = async () => {
    if (!isAdmin) {
      toast.error("Solo admin o superadmin possono aggiornare lo stato del progetto");
      return;
    }
    if (!statusProject) return;
    try {
      await updateProjectStatus(statusProject.id, statusValue);
      await fetchProjects();
      toast.success("Stato progetto aggiornato");
      setStatusProject(null);
    } catch (error) {
      const message = error.response?.data?.error;

      // da implementare lato backend un messaggio di errore specifico per stato non valido, ora gestiamo in modo generico 
      if (message === "Invalid status") {
        toast.error("Stato non valido. Gli stati validi sono: Attivo, Completato, In pausa.");
        return;
      }
      toast.error("Errore durante aggiornamento stato");
    }
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
    editForm.deadline !== toDateInputValue(editingProject?.deadline);


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
      <div className="overflow-x-auto">
       <Table>
  <TableHeader className="bg-slate-50/70 border-b border-slate-100">
    <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
      {/* Progetto a sinistra perché contiene testi lunghi */}
      <TableHead className="text-slate-700 font-semibold text-sm text-left px-4 py-3">Progetto</TableHead>
      
      {/* Tutti gli altri centrati per bilanciare i badge e gli avatar */}
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Stato</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Creatore</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Responsabile</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Team</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Deadline</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Ultimo aggiornamento</TableHead>
      <TableHead className="text-slate-700 font-semibold text-sm text-center px-4 py-3">Azioni</TableHead>
    </TableRow>
  </TableHeader>
  
  <TableBody>
    {data && data.length > 0 ? (
      data.map((project) => {
        const colorClass = getRoundColorClass(project.id);

        return (
          <ProjectRow
            key={project.id}
            project={project}
            colorClass={colorClass}
            isAdmin={isAdmin}
            isSuperadmin={isSuperadmin}
            users={users}
            handleProjectRowClick={handleProjectRowClick}
            openEditDialog={openEditDialog}
            openStatusDialog={openStatusDialog}
            setDeleteProjectTarget={setDeleteProjectTarget}
          />
        );
      })
    ) : (
      <TableRow>
        <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-sm font-medium">
          Non ci sono Progetti attivi...
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
      </div>



      <ModalForm
        modalOpen={!!editingProject}
        setModalOpen={setEditingProject}
        title="Modifica progetto"
        infos="Aggiorna nome e descrizione del progetto"
        fields={
          
          [
          { name: "name", label: "Nome", type: "text" },
          { name: "description", label: "Descrizione", type: "textarea" },
          { name: "deadline", label: "Deadline", type: "date" },
        ]}
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
        modalOpen={!!deleteProjectTarget}
        setModalOpen={setDeleteProjectTarget}
        title="Conferma eliminazione"
        infos={ <span className="text-base text-slate-500">
              Stai per eliminare definitivamente il progetto{" "}
              <strong className="font-semibold text-slate-900 underline decoration-red-500/40 decoration-2 underline-offset-2">
                {deleteProjectTarget?.name}
              </strong>.

               Questa azione è irreversibile.
            </span>}

        formData={{}}
        setFormData={() => {}}
        onSubmit={handleDeleteProject}
        submitLabel="Elimina progetto"
        dialogClassName="sm:max-w-105"
        submitClassName="bg-red-600 hover:bg-red-700 text-white"
        titleIcon={AlertTriangle}
        iconColor="text-red-500"
        />


       

     
      

    
    </>
  );
};

export default ProjectTable;
