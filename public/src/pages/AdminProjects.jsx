import AppLayout from "@/Components/layout/AppLayout";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ProjectHeader from "@/Components/features/projects/ProjectHeader";
import React,{useState,useEffect,useMemo} from 'react'
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUsersContext } from "@/context/User/UserContext";
import { useAuth } from "@/context/Auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, FolderOpen, User, CalendarDays, Flag, Users2 } from "lucide-react";
// import { projects } from "@/fake_data/data";
const AdminProjects = () => {
    const {projects,addProject,fetchProjects,fetchProjectDetails,selectedProject,clearSelectedProject,loading,unAssingUserAssignment} = useProjectContext();
    const { users, fetchUsers } = useUsersContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id: projectId } = useParams();
    const [search,setSearch] = useState('')
    const [modalOpen,setModalOpen] = useState(false)
    const [removeUserTarget, setRemoveUserTarget] = useState(null)
    const [formData,setFormData] = useState({
        name: '',
        description: ''
    });

    
    useEffect(()=>{
        fetchProjects()
        fetchUsers()
    },[])

    useEffect(() => {
        if (!projectId) {
            clearSelectedProject();
            return;
        }

        fetchProjectDetails(projectId);

        return () => {
            clearSelectedProject();
        };
    }, [projectId]);

    const handleAddProject = async () =>{
        if (user?.role !== 'admin') return;

        const newProject = {
            name : formData.name,
            description: formData.description
        }
        await addProject(newProject);
        await fetchProjects();
        setFormData({
            name: '',
            description: ''
        })
        setModalOpen(false)
    }

    const handleRemoveAssignedUser = async () => {
        if (!projectId || !selectedProject || !removeUserTarget) return;

        try {
            await unAssingUserAssignment(Number(projectId), Number(removeUserTarget.id));
            await fetchProjectDetails(Number(projectId));
            await fetchProjects();
            setRemoveUserTarget(null);
        } catch (error) {
            // il context gestisce già l'errore nello stato globale
        }
    }

   const filteredProjects = useMemo(() => {
    if (!search) return projects;
    
    return projects.filter((project) =>
     project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
            (project.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);

   

    return (
        <>
        <AppLayout page="projects">
            {projectId ? (
                <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <Button variant="outline" onClick={() => navigate("/admin/projects")} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Torna ai progetti
                        </Button>
                    </div>

                    {loading && !selectedProject ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                            Caricamento dettagli progetto...
                        </div>
                    ) : selectedProject ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                                        <FolderOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Project Detail</p>
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr]">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Descrizione</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-700">{selectedProject.description || "Nessuna descrizione disponibile."}</p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Stato</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                                                <Flag className="h-4 w-4 text-slate-500" />
                                                {selectedProject.status ?? "Unknown"}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Creato da</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                                                <User className="h-4 w-4 text-slate-500" />
                                                {users.find((u) => u.id === selectedProject.created_by)?.nome ?? "Unknown"}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">ID progetto</p>
                                            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                                                <CalendarDays className="h-4 w-4 text-slate-500" />
                                                #{selectedProject.id}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Utenti assegnati</p>
                                            <div className="mt-4 space-y-3">
                                                {Array.isArray(selectedProject.assigned_users) && selectedProject.assigned_users.length > 0 ? (
                                                    selectedProject.assigned_users.map((assignedUser) => {
                                                        const assignedUserId = assignedUser.id ?? assignedUser.user_id;
                                                        const assignedUserName = [assignedUser.nome ?? assignedUser.name ?? "", assignedUser.cognome ?? assignedUser.surname ?? ""].filter(Boolean).join(" ");

                                                        return (
                                                            <div key={assignedUserId} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                                        <Users2 className="h-4 w-4 text-slate-500" />
                                                                        <span className="truncate">{assignedUserName || assignedUser.email || `User ${assignedUserId}`}</span>
                                                                    </div>
                                                                    <p className="mt-1 truncate text-xs text-slate-500">{assignedUser.email ?? `ID ${assignedUserId}`}</p>
                                                                </div>

                                                                <Button
                                                                    variant="outline"
                                                                    className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                                    onClick={() => setRemoveUserTarget(assignedUser)}
                                                                >
                                                                    Rimuovi
                                                                </Button>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                                        Nessun utente assegnato al progetto.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dati grezzi</p>
                                    <pre className="mt-3 max-h-105 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
{JSON.stringify(selectedProject, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                            Nessun dettaglio progetto disponibile.
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <ProjectHeader modalOpen={modalOpen} setModalOpen={setModalOpen} 
                        formData={formData} setFormData={setFormData}
                        search={search} setSearch={setSearch}
                        addProject={handleAddProject}
                        canCreateProject={user?.role === 'admin'}
                    />
                    
                    <ProjectTable data={filteredProjects} users={users} />
                </>
            )}

        </AppLayout>

        <Dialog open={!!removeUserTarget} onOpenChange={() => setRemoveUserTarget(null)}>
                <DialogContent className="sm:max-w-105">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Flag className="h-5 w-5 text-rose-500" />
                            Conferma rimozione utente
                        </DialogTitle>
                        <DialogDescription>
                            Stai per rimuovere questo utente dal progetto. L'operazione aggiornerà subito l'assegnazione.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        {removeUserTarget ? (
                            <>
                                <p className="font-medium text-slate-900">
                                    {[removeUserTarget.nome ?? removeUserTarget.name ?? "", removeUserTarget.cognome ?? removeUserTarget.surname ?? ""].filter(Boolean).join(" ") || removeUserTarget.email || `User ${removeUserTarget.id ?? removeUserTarget.user_id}`}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {removeUserTarget.email ?? `ID ${removeUserTarget.id ?? removeUserTarget.user_id}`}
                                </p>
                            </>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRemoveUserTarget(null)}>
                            Annulla
                        </Button>
                        <Button variant="destructive" onClick={handleRemoveAssignedUser}>
                            Rimuovi dal progetto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </>
    )




}

export default AdminProjects;
