import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { ArrowLeft, CalendarDays, CheckSquare2, Flag, FolderOpen, User, Users2 } from "lucide-react";

const ProjectDetail = () => {
    const navigate = useNavigate();
    const { id: projectId } = useParams();
    const { users, fetchUsers } = useUserContext();
    const {
        loading,
        selectedProject,
        fetchProjectDetails,
        clearSelectedProject,
        unAssingUserAssignment,
    } = useProjectContext();
    const [removeUserTarget, setRemoveUserTarget] = useState(null);

    useEffect(() => {
        if (!projectId) {
            clearSelectedProject();
            return;
        }

        fetchProjectDetails(projectId);
        fetchUsers();

        return () => {
            clearSelectedProject();
        };
    }, [projectId]);

    const handleRemoveAssignedUser = async () => {
        if (!projectId || !selectedProject || !removeUserTarget) return;

        try {
            await unAssingUserAssignment(Number(projectId), Number(removeUserTarget.id ?? removeUserTarget.user_id));
            await fetchProjectDetails(Number(projectId));
            setRemoveUserTarget(null);
        } catch (error) {
            // il context aggiorna già lo stato di errore globale
        }
    };

    const handleManageChecklist = () => {
        navigate(`/admin/projects/${projectId}/checklist`);
    };

    const createdByUser = users.find((user) => user.id === selectedProject?.created_by);

    return (
        <AppLayout page="projects">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button variant="outline" onClick={() => navigate("/admin/projects")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Torna ai progetti
                    </Button>

                    <Button onClick={handleManageChecklist} className="gap-2">
                        <CheckSquare2 className="h-4 w-4" />
                        Manage Checklist
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
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {selectedProject.description || "Nessuna descrizione disponibile."}
                                    </p>
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
                                            {createdByUser?.nome ?? "Unknown"}
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
                                                    );
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
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Prossimo passaggio</p>
                                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="text-sm font-medium text-slate-900">Manage Checklist</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Da qui vai alla gestione delle checklist del progetto selezionato.
                                    </p>
                                    <Button className="mt-4 w-full gap-2" onClick={handleManageChecklist}>
                                        <CheckSquare2 className="h-4 w-4" />
                                        Apri checklist progetto
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                        Nessun dettaglio progetto disponibile.
                    </div>
                )}
            </div>

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
        </AppLayout>
    );
};

export default ProjectDetail;