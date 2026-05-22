import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress"; // Componente Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, Flag, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuth } from "@/context/Auth/AuthContext";
import { sessions } from "../../../fake_data/data";

const PROJECT_STATUS_OPTIONS = ["Attivo", "Completato", "In pausa"];

const ProjectTable = ({ data, users = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    fetchProjects,
    updateProject,
    deleteProject,
    updateProjectStatus,
    assignUserToProject,
    unAssingUserAssignment,
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
  
  const calculateProgress = (project_id) => {
    const sessionByProject = sessions.filter(s => s.project_id === project_id);
    if (sessionByProject.length === 0) return 0;

    const completedSessions = sessionByProject.filter(s => s.status === 'completed' || s.status === 'passed').length;
    return Math.round((completedSessions / sessionByProject.length) * 100);
  };

  const getProjectStatusBadge = (status) => {
    const normalizedStatus = (status ?? "")
      .toString()
      .trim()
      .toLowerCase();

    if (normalizedStatus === "attivo" || normalizedStatus === "active") {
      return <span className="capitalize px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">{status}</span>;
    }

    if (normalizedStatus === "completato" || normalizedStatus === "completed") {
      return <span className="capitalize px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">{status}</span>;
    }

    if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
      return <span className="capitalize px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-medium">{status}</span>;
    }

    return <span className="capitalize px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{status || "Unknown"}</span>;
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

  const openAssignDialog = (project) => {
    if (!isAdmin) return;
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
      toast.error("Errore durante assegnazione utente");
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
      toast.error("Errore durante rimozione utente");
    }
  };

  const handleProjectRowClick = (projectId) => {
    if (!isAdmin) return;
    navigate(`/admin/projects/${projectId}`);
  };

  const availableUsers = users.filter(u => {
    const isAssigned = assignProject?.assigned_users?.some(au => au.id === u.id);
    return !isAssigned;
  });

 

  return (
    <div className="mx-auto my-6 max-w-300 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {data && data.length >0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900 hover:bg-slate-900">
              <TableHead className="text-white font-bold w-25 text-center">Project #</TableHead>
            <TableHead className="text-white font-bold text-center">Name</TableHead>
            <TableHead className="text-white font-bold text-center">Status</TableHead>
            {/* <TableHead className="text-white font-bold">Description</TableHead> */}
             <TableHead className="text-white font-bold w-50 text-center">Created By</TableHead>
            <TableHead className="text-white font-bold w-50 text-center">Assigned Tester</TableHead>
               <TableHead className="text-white font-bold w-50 text-center">Sessions</TableHead>
            <TableHead className="text-white font-bold w-50 text-center">Progress</TableHead>
            <TableHead className="text-white font-bold w-50 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => {
            const progressValue = calculateProgress(project.id);
            
            return (
              <TableRow
                key={project.id}
                className={`group transition-colors hover:bg-slate-50 ${isAdmin ? "cursor-pointer" : ""}`}
                onClick={() => handleProjectRowClick(project.id)}
              >
                <TableCell className="font-mono text-slate-500">
                  #{project.id}
                </TableCell>
                
                <TableCell className="font-semibold text-slate-900">
                  {project.name}
                </TableCell>

                  <TableCell>
                  {getProjectStatusBadge(project.status)}
                </TableCell>
                 <TableCell className="font-semibold text-slate-900">
                  {users.find(u => u.id === project.created_by)?.nome.concat(" ", users.find(u => u.id === project.created_by)?.cognome) || "Unknown"}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  QUI I TESTER ASSEGNATI
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                 SESSIONI ATTIVEE
                </TableCell>
                 
            
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Avanzamento</span>
                      <span>{progressValue}%</span>
                    </div>
                    <Progress 
                      value={progressValue} 
                      className="h-2 bg-slate-100" 
                    //   indicatorClassName="bg-emerald-500" 
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-blue-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditDialog(project);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-amber-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            openStatusDialog(project);
                          }}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-emerald-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            openAssignDialog(project);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {isSuperadmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-red-600"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteProjectTarget(project);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>) : (
        <div className="text-center py-8 shadow-sm">
          <p className='text-red-500 py-2 px-4 '>Non ci sono Progetti attivi...</p>
        </div>
      )
    }

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

      <Dialog open={!!assignProject} onOpenChange={() => setAssignProject(null)}>
        <DialogContent className="sm:max-w-110">
          <DialogHeader>
            <DialogTitle>Gestisci assegnazione utente</DialogTitle>
            <DialogDescription>Seleziona utente da assegnare o rimuovere dal progetto.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label>Utente</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona utente" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {(user.nome ?? user.name ?? "")} {(user.cognome ?? user.surname ?? "")} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignProject(null)}>Annulla</Button>
            <Button variant="secondary" onClick={handleUnassignUser} disabled={!selectedUserId}>Rimuovi</Button>
            <Button onClick={handleAssignUser} disabled={!selectedUserId}>Assegna</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default ProjectTable;
