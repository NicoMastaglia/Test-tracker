import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { ArrowLeft, CalendarDays, CheckSquare2, Flag, FolderOpen, User, Users2 } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { getFullName, getProjectStatusBadgeClass } from "@/utils/tableHelpers";
import ProjectSectionNav from "./ProjectSectionNav";
import ProjectOverviewSection from "./ProjectOverviewSection";
import ProjectTeamSection from "./ProjectTeamSection";
import ProjectActivitiesSection from "./ProjectActivitiesSection";

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
    const { assignUserToProject } = useProjectContext();
    const [removeUserTarget, setRemoveUserTarget] = useState(null);
    const [selectedAssignUserId, setSelectedAssignUserId] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    const projectData = Array.isArray(selectedProject) ? selectedProject[0] : selectedProject;
    const projectAssignedUsers = Array.isArray(projectData?.user_list)
        ? projectData.user_list
        : (Array.isArray(projectData?.assigned_users) ? projectData.assigned_users : []);

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
 
    const creatorFromProject = projectData?.created_by && typeof projectData.created_by === "object"
        ? projectData.created_by
        : null;

    const createdByUser = creatorFromProject
        || ((users || []).find((user) => Number(user.id) === Number(projectData?.created_by)) || null);

    const formatProjectDate = (value) => {
        if (!value) return "Non disponibile";

        const parsedDate = new Date(value);
        if (Number.isNaN(parsedDate.getTime())) return String(value);

        return new Intl.DateTimeFormat("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(parsedDate);
    };

    const readProjectValue = (...keys) => {
        for (const key of keys) {
            const candidate = projectData?.[key];
            if (candidate !== null && candidate !== undefined && String(candidate).trim() !== "") {
                return candidate;
            }
        }

        return null;
    };

    const projectInfoItems = [
        {
            label: "Cliente",
            value: readProjectValue("cliente", "client", "customer", "committente"),
        },
        {
            label: "Area",
            value: readProjectValue("area", "zone", "district"),
        },
        {
            label: "Categoria",
            value: readProjectValue("categoria", "category", "type"),
        },
        {
            label: "Inizio lavori",
            value: formatProjectDate(readProjectValue("inizio_lavori", "start_date", "startDate", "created_at")),
        },
        {
            label: "Scadenza",
            value: formatProjectDate(readProjectValue("scadenza", "deadline", "due_date", "end_date")),
        },
        {
            label: "Responsabile",
            value: createdByUser ? getFullName(createdByUser) : "Non disponibile",
        },
    ];

    const projectSectionCounts = {
        checklist: 1,
        team: projectAssignedUsers.length,
        activities: 3,
    };

    const statusLabel = projectData?.status ?? "Unknown";

        return (
       
                <AppLayout page="projects" hideHeader>
                    <div className="w-full flex flex-col gap-6 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => navigate("/admin/projects")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Torna ai progetti
                </Button>

                <Button className="gap-2" onClick={handleManageChecklist}>
                    <CheckSquare2 className="h-4 w-4" />
                    Apri checklist
                </Button>
            </div>

            {loading && !projectData ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    Caricamento dettagli progetto...
                </div>
            ) : projectData ? (
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                                            <FolderOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Project Detail</p>
                                            <h2 className="text-2xl font-bold text-slate-900">{projectData.name ?? projectData.nome}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                        <Badge className={`border-none px-3 py-1 text-xs ${getProjectStatusBadgeClass(projectData.status)}`}>
                                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                                            {projectData.status ?? "Unknown"}
                                        </Badge>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            Codice: #{projectData.id}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            Creato da {createdByUser ? getFullName(createdByUser) : "Non disponibile"}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            {projectData.description || "Nessuna descrizione disponibile."}
                                        </span>




                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProjectSectionNav activeSection={activeSection} onSectionChange={setActiveSection} counts={projectSectionCounts} />

                    {activeSection === "overview" ? (
                        <ProjectOverviewSection
                            projectData={projectData}
                            createdByUser={createdByUser ? getFullName(createdByUser) : "Non disponibile"}
                            projectInfoItems={projectInfoItems}
                            onOpenChecklist={handleManageChecklist}
                            statusBadgeClass={getProjectStatusBadgeClass(projectData.status)}
                            formatProjectStatusLabel={statusLabel} />
                    ) : null}

                    {activeSection === "checklist" ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Checklist</p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-900">Accesso rapido</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Visualizza e gestisci la checklist di questo progetto.
                            </p>
                            <Button className="mt-4 gap-2" onClick={handleManageChecklist}>
                                <CheckSquare2 className="h-4 w-4" />
                                Apri checklist progetto
                            </Button>
                        </div>
                    ) : null}

                    {activeSection === "team" ? (
                        <ProjectTeamSection
                            users={users}
                            projectAssignedUsers={projectAssignedUsers}
                            selectedAssignUserId={selectedAssignUserId}
                            setSelectedAssignUserId={setSelectedAssignUserId}
                            projectId={projectId}
                            assignUserToProject={assignUserToProject}
                            fetchProjectDetails={fetchProjectDetails}
                            onRemoveUser={setRemoveUserTarget} />
                    ) : null}

                    {activeSection === "activities" ? <ProjectActivitiesSection /> : null}
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