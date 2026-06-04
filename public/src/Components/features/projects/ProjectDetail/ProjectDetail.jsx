import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { ArrowLeft, Flag, FolderOpen } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { getFullName, getProjectStatusBadgeClass } from "@/utils/tableHelpers";
import ProjectSectionNav from "./ProjectSectionNav";
import ProjectOverviewSection from "./ProjectOverviewSection";
import ProjectTeamSection from "./ProjectTeamSection";
import ProjectActivitiesSection from "./ProjectActivitiesSection";
import CheckListSection from "@/Components/features/checkList/CheckListSection";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import {useAuthContext} from "@/context/Auth/AuthContext";
const ProjectDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: projectId } = useParams();
    const { user } = useAuthContext();
    const isAdmin = user?.role !== "user";
    const { checklistItems } = useCheckListContext();

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
    const [activeSection, setActiveSection] = useState(location.state?.section ?? "overview");


   
    const projectAssignedUsers = selectedProject?.user_list || [];

    useEffect(() => {
    if (!projectId) {
        clearSelectedProject();
        return;
    }

    fetchProjectDetails(projectId);

    if (isAdmin) {
        fetchUsers();
    }

    return () => {
        clearSelectedProject();
    };
}, [projectId, isAdmin]);

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
    

    // La res del be dovrà diventare un oggetto anche  se ora usiamo un arr
    const readProjectValue = (...keys) => {
        for (const key of keys) {
            const candidate = selectedProject?.[key];
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
        // {
        //     label: "Responsabile",
        //     value: createdByUser ? getFullName(createdByUser) : "Non disponibile",
        // },
    ];
   
    const projectSectionCounts = {
        checklist: checklistItems.length,
        team: projectAssignedUsers.length,
        activities: 3,
    };

    const statusLabel = selectedProject?.status ?? "Unknown";
    
    // user ritorna ai suoi progetti
    const backRoute =
    user?.role === "user"
    ? "/user/projects"
    : "/admin/projects";


    

        return (
       
                <AppLayout page="projects" hideHeader>
                    <div className="w-full flex flex-col gap-6 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => navigate(backRoute)} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Torna ai progetti
                </Button>

                {/* <Button className="gap-2" onClick={handleManageChecklist}>
                    <CheckSquare2 className="h-4 w-4" />
                    Apri checklist
                </Button> */}

            </div>

            {loading && !selectedProject ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    Caricamento dettagli progetto...
                </div>
            ) : selectedProject ? (
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
                                            <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name ?? selectedProject.nome}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                        <Badge className={`border-none px-3 py-1 text-xs ${getProjectStatusBadgeClass(selectedProject.status)}`}>
                                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                                            {selectedProject.status ?? "Unknown"}
                                        </Badge>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            Codice: #{selectedProject.id}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            Creato da {selectedProject.created_by ? getFullName(selectedProject.created_by) : "Non disponibile"}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                                            {selectedProject.description || "Nessuna descrizione disponibile."}
                                        </span>




                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProjectSectionNav activeSection={activeSection}
                     onSectionChange={setActiveSection} counts={projectSectionCounts} 
                     isAdmin={isAdmin}
                     />

                    {activeSection === "overview" ? (
                        <ProjectOverviewSection
                            projectData={selectedProject}
                            createdByUser={selectedProject.created_by ? getFullName(selectedProject.created_by) : "Non disponibile"}
                            projectInfoItems={projectInfoItems}
                            onOpenChecklist={() => setActiveSection("checklist")}
                            statusBadgeClass={getProjectStatusBadgeClass(selectedProject.status)}
                            formatProjectStatusLabel={statusLabel} />
                    ) : null}

                    {activeSection === "checklist" ? (
                        <CheckListSection projectId={projectId} isAdmin={isAdmin} />
                    ) : null}

                    { isAdmin  && activeSection === "team" ? (
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

                    { isAdmin  && activeSection === "activities" ? <ProjectActivitiesSection /> : null}
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