import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress"; // Componente Shadcn
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, Flag, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { sessions } from "../../../fake_data/data";
import ProjectRow from "./ProjectRow";
import AssignDialog from "./AssignDialog";

const PROJECT_STATUS_OPTIONS = ["Attivo", "Completato", "In pausa"];

const ProjectTable = ({ data, users = [] }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const {
    fetchProjects,
    updateProject,
    deleteProject,
    updateProjectStatus,
    assignUserToProject,
    unAssingUserAssignment,
    fetchProjectDetails,
    selectedProject,
    clearSelectedProject



  } = useProjectContext();

  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [statusProject, setStatusProject] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [assignProject, setAssignProject] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);
  const isAdmin = user?.role === "admin";
  const isSuperadmin = user?.role === "superadmin";
  const [assignedUsersByProject, setAssignedUsersByProject] = useState({});


  
  const calculateProgress = (project_id) => {
    const sessionByProject = sessions.filter(s => s.project_id === project_id);
    if (sessionByProject.length === 0) return 0;

    const completedSessions = sessionByProject.filter(s => s.status === 'completed' || s.status === 'passed').length;
    return Math.round((completedSessions / sessionByProject.length) * 100);
  };
  
  

  const openEditDialog = (project) => {
    if (!isAdmin) return;
    setEditingProject(project);
    setEditForm({
      name: project.name ?? "",
      description: project.description ?? "",
    });
  };

  const handleUpdateProject = async () => {
    if (!isAdmin) {
      toast.error("Solo admin puo modificare un progetto");
      return;
    }

    if (!editingProject) return;

    try {
      await updateProject(editingProject.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
      });
      await fetchProjects();
      toast.success("Progetto aggiornato con successo");
      setEditingProject(null);
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del progetto");
    }
  };

  const handleDeleteProject = async () => {
    if (!isSuperadmin) {
      toast.error("Solo superadmin puo eliminare un progetto");
      return;
    }

    if (!deleteProjectTarget) {
      return;
    }
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
    setStatusValue(project.status ?? "Attivo");
  };

  const handleUpdateStatus = async () => {
    if (!isAdmin) {
      toast.error("Solo admin puo aggiornare lo stato del progetto");
      return;
    }

    if (!statusProject) return;

    try {
      await updateProjectStatus(statusProject.id, statusValue);
      await fetchProjects();
      toast.success("Stato progetto aggiornato");
      setStatusProject(null);
    } catch (error) {
      toast.error("Errore durante aggiornamento stato");
    }
  };

  const openAssignDialog = async (project) => {
    if (!isAdmin) return;
    try {
      await fetchProjectDetails(project.id);
    } catch (err) {
      // ignore - we'll still open the dialog but assigned users may be stale
    }
    setAssignProject(project);
    setSelectedUserId("");
  };

  const handleAssignUser = async () => {
    if (!isAdmin) {
      toast.error("Solo admin puo assegnare utenti al progetto");
      return;
    }

    if (!assignProject || !selectedUserId) {
      toast.error("Seleziona un utente");
      return;
    }

    try {
      await assignUserToProject(assignProject.id, Number(selectedUserId));
      await fetchProjects();
      toast.success("Utente assegnato al progetto");
      setAssignProject(null);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.error || error.response?.data?.message || "Errore durante assegnazione utente";
      toast.error(message);
    }
  };

  const handleUnassignUser = async () => {
    if (!isAdmin) {
      toast.error("Solo admin puo rimuovere utenti dal progetto");
      return;
    }

    if (!assignProject || !selectedUserId) {
      toast.error("Seleziona un utente");
      return;
    }

    try {
      await unAssingUserAssignment(assignProject.id, Number(selectedUserId));
      await fetchProjects();
      toast.success("Utente rimosso dal progetto");
      setAssignProject(null);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.error || error.response?.data?.message || "Errore durante rimozione utente";
      toast.error(message);
    }
  };

  const handleProjectRowClick = (projectId) => {
    if (!(isAdmin || isSuperadmin)) return;
    navigate(`/admin/projects/${projectId}`);
  };

  const assignedUsers = (selectedProject && Number(selectedProject.id) === Number(assignProject?.id))
    ? selectedProject.assigned_users || []
    : (assignProject?.assigned_users || []);

  const availableUsers = users.filter(u => {
    const isAssigned = assignedUsers.some(au => (au.id ?? au.user_id) === u.id);
    return !isAssigned;
  });

  

 

  return (
    <>
      <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="bg-slate-900 hover:bg-slate-900">
              <TableHead className="text-white font-semibold w-25 text-center">ID</TableHead>
              <TableHead className="text-white font-semibold text-center">Progetto</TableHead>
              <TableHead className="text-white font-semibold text-center">Stato</TableHead>
              <TableHead className="text-white font-semibold w-50 text-center">Creato da</TableHead>
              <TableHead className="text-white font-semibold w-50 text-center">Tester assegnati</TableHead>
              <TableHead className="text-white font-semibold w-50 text-center">Sessioni</TableHead>
              <TableHead className="text-white font-semibold w-50 text-center">Progress</TableHead>
              <TableHead className="text-white font-semibold w-50 text-center">Azioni</TableHead>
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
                  sessionCount={null} // manca logica sessioni 
                  handleProjectRowClick={handleProjectRowClick}
                  openEditDialog={openEditDialog}
                  openStatusDialog={openStatusDialog}
                  openAssignDialog={openAssignDialog}
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

      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>Modifica progetto</DialogTitle>
            <DialogDescription>Aggiorna nome e descrizione del progetto.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-project-name">Nome</Label>
              <Input
                id="edit-project-name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project-description">Descrizione</Label>
              <Input
                id="edit-project-description"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>Annulla</Button>
            <Button onClick={handleUpdateProject}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!statusProject} onOpenChange={() => setStatusProject(null)}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Aggiorna stato progetto</DialogTitle>
            <DialogDescription>Seleziona uno stato valido lato backend.</DialogDescription>
          </DialogHeader>

          <Select value={statusValue} onValueChange={setStatusValue}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona stato" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusProject(null)}>Annulla</Button>
            <Button onClick={handleUpdateStatus}>Aggiorna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssignDialog
        assignProject={assignProject}
        onClose={() => setAssignProject(null)}
        availableUsers={availableUsers}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        handleAssignUser={handleAssignUser}
        handleUnassignUser={handleUnassignUser}
      />

      <Dialog open={!!deleteProjectTarget} onOpenChange={() => setDeleteProjectTarget(null)}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Conferma eliminazione
            </DialogTitle>
            <DialogDescription>
              Stai per eliminare il progetto "{deleteProjectTarget?.name}". Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProjectTarget(null)}>Annulla</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Elimina progetto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectTable;
