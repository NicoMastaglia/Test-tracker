import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import ModalForm from "@/utils/ModalForm";
import { getProjectInfoItems } from "@/utils/projectInfoItems";
import ProjectSectionNav from "./ProjectSectionNav";
import ProjectHeaderCard from "./ProjectHeaderCard";
import ProjectOverviewSection from "./ProjectOverviewSection";
import ProjectTeamSection from "./ProjectTeamSection";
import ProjectActivitiesSection from "./ProjectActivitiesSection";
import CheckListSection from "@/Components/features/checkList/CheckListSection";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import {useAuthContext} from "@/context/Auth/AuthContext";
import { toast } from "sonner";
const ProjectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: projectId } = useParams();
  const { user } = useAuthContext();
  const isAdmin = user?.role !== "user";
  const { checklistItems, fetchCheckListsByProject } = useCheckListContext();

  const { users, fetchUsers } = useUserContext();
  const {
    loading,
    selectedProject,
    fetchProjectDetails,
    clearSelectedProject,
    unAssingUserAssignment,
    assignUserToProject,
  } = useProjectContext();

  const [removeUserTarget, setRemoveUserTarget] = useState(null);
  const [selectedAssignUserId, setSelectedAssignUserId] = useState("");
  const [activeSection, setActiveSection] = useState(
    location.state?.section ?? "overview",
  );

  const projectAssignedUsers = selectedProject?.user_list || [];

  useEffect(() => {
    if (!projectId) {
      clearSelectedProject();
      return;
    }

    fetchProjectDetails(projectId);
    fetchCheckListsByProject(projectId);

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
      await unAssingUserAssignment(
        Number(projectId),
        Number(removeUserTarget.id ?? removeUserTarget.user_id),
      );
      await fetchProjectDetails(Number(projectId));
      toast.success("Utente rimosso dal progetto");
      setRemoveUserTarget(null);
    } catch (error) {
      // il context aggiorna già lo stato di errore globale
    }
  };

  const handleAssignUser = async () => {
    if (!projectId || !selectedAssignUserId) return;

    try {
      await assignUserToProject(
        Number(projectId),
        Number(selectedAssignUserId),
      );
      await fetchProjectDetails(Number(projectId));
      toast.success("Utente assegnato al progetto");
      setSelectedAssignUserId("");
    } catch (error) {
      toast.error("Errore durante l'assegnazione dell'utente al progetto");
    }
  };

  const projectInfoItems = getProjectInfoItems(selectedProject);

  const projectSectionCounts = {
    // Per il conteggio della checklist, usiamo la lunghezza di checklistItems
    checklist: checklistItems.length,
    // Per il conteggio del team, usiamo la lunghezza di projectAssignedUsers
    team: projectAssignedUsers.length,
    // Placeholder per attività, da sostituire con dati reali quando disponibili
    activities: 3,
  };

  const deleteFormDescription = (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      {removeUserTarget ? (
        <>
          <p className="font-medium text-slate-900">
            {[
              removeUserTarget.nome ?? removeUserTarget.name ?? "",
              removeUserTarget.cognome ?? removeUserTarget.surname ?? "",
            ]
              .filter(Boolean)
              .join(" ") ||
              removeUserTarget.email ||
              `User ${removeUserTarget.id ?? removeUserTarget.user_id}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {removeUserTarget.email ??
              `ID ${removeUserTarget.id ?? removeUserTarget.user_id}`}
          </p>
        </>
      ) : null}
    </div>
  );

  // user ritorna ai suoi progetti
  const backRoute =
    user?.role === "user" ? "/user/projects" : "/admin/projects";

  return (
    <AppLayout page="projects" hideHeader>
      <div className="w-full flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(backRoute)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai progetti
          </Button>
        </div>

        {loading && !selectedProject ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Caricamento dettagli progetto...
          </div>
        ) : selectedProject ? (
          <div className="space-y-6">
            <ProjectHeaderCard selectedProject={selectedProject} />

            <ProjectSectionNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              counts={projectSectionCounts}
              isAdmin={isAdmin}
            />

            {activeSection === "overview" ? (
              <ProjectOverviewSection projectInfoItems={projectInfoItems} />
            ) : null}

            {activeSection === "checklist" ? (
              <CheckListSection projectId={projectId} isAdmin={isAdmin} />
            ) : null}

            {isAdmin && activeSection === "team" ? (
              <ProjectTeamSection
                users={users}
                projectAssignedUsers={projectAssignedUsers}
                selectedAssignUserId={selectedAssignUserId}
                setSelectedAssignUserId={setSelectedAssignUserId}
                projectId={projectId}
                assignUserToProject={assignUserToProject}
                fetchProjectDetails={fetchProjectDetails}
                onRemoveUser={setRemoveUserTarget}
                onAssignUser={handleAssignUser}
              />
            ) : null}

            {isAdmin && activeSection === "activities" ? (
              <ProjectActivitiesSection />
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Nessun dettaglio progetto disponibile.
          </div>
        )}
      </div>

      <ModalForm
        modalOpen={!!removeUserTarget}
        setModalOpen={setRemoveUserTarget}
        title="Conferma rimozione utente"
        infos="Stai per rimuovere questo utente dal progetto. L'operazione aggiornerà subito l'assegnazione."
        hasDescripion={true}
        description={deleteFormDescription}
        onSubmit={handleRemoveAssignedUser}
        submitLabel="Rimuovi dal progetto"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={Flag}
        iconColor="text-rose-500"
        submitVariant="destructive"
      />
    </AppLayout>
  );
};

export default ProjectDetail;