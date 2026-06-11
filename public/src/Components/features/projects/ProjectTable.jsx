import React, { useState } from 'react';
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
import { sessions } from "../../../fake_data/data";
import ProjectRow from "./ProjectRow";
import ModalForm from "@/utils/ModalForm";

const PROJECT_STATUS_OPTIONS = ["Attivo", "Completato", "In pausa",'Non iniziato'];

const getAvailableStatuses = (currentStatus) => {
  switch (currentStatus) {
    case 'Non iniziato':
      return ["Attivo"];
      
    case "Attivo":
      return ["Completato", "In pausa"];
    case "Completato":
      return ["Attivo", "In pausa"];
    case "In pausa":
      return ["Attivo", "Completato"];
    default:
      return PROJECT_STATUS_OPTIONS;
  }
}


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
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [statusProject, setStatusProject] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  const isAdmin = user?.role !== "user";
  const isSuperadmin = user?.role === "superadmin";

  // logica progress forzata con dati finti, idealmente calcolata lato backend
  const calculateProgress = (project_id) => {
    const sessionByProject = sessions.filter(s => s.project_id === project_id);
    if (sessionByProject.length === 0) return 0;
    const completedSessions = sessionByProject.filter(s => s.status === 'completed' || s.status === 'passed').length;
    return Math.round((completedSessions / sessionByProject.length) * 100);
  };

  const openEditDialog = (project) => {
    if (!isAdmin) return;
    setEditingProject(project);
    setEditForm({ name: project.name ?? "", description: project.description ?? "" });
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
    try {
      await updateProject(editingProject.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
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
    } catch (error) {
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
    editForm.description.trim() !== (editingProject?.description ?? "").trim();


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
          <TableHeader className="bg-slate-50">
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-slate-900 font-semibold w-25 text-center">ID</TableHead>
              <TableHead className="text-slate-900 font-semibold text-center">Progetto</TableHead>
              <TableHead className="text-slate-900 font-semibold text-center">Stato</TableHead>
              <TableHead className="text-slate-900 font-semibold w-50 text-center">Creato da</TableHead>
              <TableHead className="text-slate-900 font-semibold w-50 text-center">Tester assegnati</TableHead>
              <TableHead className="text-slate-900 font-semibold w-50 text-center">Sessioni</TableHead>
              <TableHead className="text-slate-900 font-semibold w-50 text-center">Progress</TableHead>
              <TableHead className="text-slate-900 font-semibold w-50 text-center">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isAdmin={isAdmin}
                  isSuperadmin={isSuperadmin}
                  users={users}
                  calculateProgress={calculateProgress}
                  sessionCount={null}
                  handleProjectRowClick={handleProjectRowClick}
                  openEditDialog={openEditDialog}
                  openStatusDialog={openStatusDialog}
                  setDeleteProjectTarget={setDeleteProjectTarget}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
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
          { name: "status", label: "Stato", type: "select", options: getAvailableStatuses(statusProject?.status).map(status => ({ value: status, label: status })) }
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
