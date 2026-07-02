import { useEffect, useState,useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Flag, Pencil } from "lucide-react";
import ModalForm from "@/utils/components/ModalForm";
import DeleteConfirmModal from "@/utils/components/DeleteConfirmModal";
import { getProjectInfoItems } from "@/utils/helpers/projectInfoItems";
import { projectEditFields } from "@/utils/fields/projectEditFields";
import { toDateInputValue } from "@/utils/helpers/tableHelpers";
import Loader from "@/utils/components/Loader";
import ProjectHeaderCard from "./ProjectHeaderCard";
import ProjectOverviewSection from "./ProjectOverviewSection";
import ProjectTeamSection from "./ProjectTeamSection";
import ProjectActivitiesSection from "./ProjectActivitiesSection";
import ChecklistSection from "@/Components/features/projects/ProjectDetail/ChecklistSection";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import {useAuthContext} from "@/context/Auth/AuthContext";
import { useAuditContext } from "@/context/Audit/AuditContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import { toast } from "sonner";
import {filterSearch}  from '@/utils/helpers/filterSearch'
import { withMinDuration } from "@/utils/helpers/withMinDuration";

// COMPONENTE PRINCIPALE PER LA PAGINA DI DETTAGLIO DEL PROGETTO
const ProjectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: projectId } = useParams();
  const { user } = useAuthContext();
  // admin e superadmin hanno entrambi pieno accesso alle azioni di progetto/checklist/task;
  // l'unico blocco è sullo stato "Completato" del progetto, non sul ruolo
  const isAdmin = user?.role !== "user";
  const isSuperAdmin = user?.role === "superadmin";
  const { checklistItems, fetchChecklistsByProject } = useChecklistContext();

  const { users, fetchUsers } = useUserContext();
  const {
    loading,
    selectedProject,
    fetchProjectDetails,
    clearSelectedProject,
    unAssingUserAssignment,
    assignUserToProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    fetchProjectStats,
  } = useProjectContext();
  const { sessions, fetchSessions } = useSessionContext();

  const [removeUserTarget, setRemoveUserTarget] = useState(null);
  const [selectedAssignUserId, setSelectedAssignUserId] = useState("");
  const [activeSection, setActiveSection] = useState(
    location.state?.section ?? "overview",
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", deadline: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

   const [searchUser, setSearchUser] = useState("");
   const [assigningUser, setAssigningUser] = useState(false);

  const { fetchProjectAudit } = useAuditContext();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [projectStats, setProjectStats] = useState(null);



  const availableUser = useMemo(() => {
    if (!users || users.length === 0) return [];
    const assignedUserIds = selectedProject?.user_list?.map(u => u.id ?? u.user_id) || [];
    return users.filter(u => !assignedUserIds.includes(u.id) && u.role === "user");
  }, [users, selectedProject]);


 const projectAssignedUsers = useMemo(()=>{
  const assigned = selectedProject?.user_list || [];
  // filterSearch è null-safe (String(item[key] ?? "")), evita crash su campi mancanti
  return filterSearch(searchUser, assigned, ["email", "nome", "cognome", "first_name", "last_name"]);
 },[searchUser,selectedProject])


  

  useEffect(() => {
    if (!projectId) {
      clearSelectedProject();
      return;
    }

    fetchProjectDetails(projectId);
    fetchChecklistsByProject(projectId);
    // sessioni del progetto: per il tester il BE le filtra già alle sue,
    // servono alla vista "Panoramica" sia per lui (dati personali) sia per le stats admin
    fetchSessions(projectId);

    if (isAdmin) {
      fetchUsers();
      // statistiche aggregate: rotta dedicata, solo admin/superadmin (il BE risponde 403 al tester)
      fetchProjectStats(projectId).then(setProjectStats).catch(() => setProjectStats(null));
    }

    return () => {
      clearSelectedProject();
    };
  }, [projectId, isAdmin]);

  useEffect(() => {
    if (!projectId || !isAdmin || activeSection !== "activities") return;

    setActivitiesLoading(true);
    const d = new Date();
    d.setDate(d.getDate() - 6);
    const dateFrom7 = d.toISOString().slice(0, 10);
    fetchProjectAudit(projectId, 100, dateFrom7)
      .then((data) => setActivities(data?.activities ?? []))
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, [projectId, isAdmin, activeSection]);


 

  const handleRemoveAssignedUser = async () => {
    if (!projectId || !selectedProject || !removeUserTarget) return;

    try {
      await unAssingUserAssignment(
        Number(projectId),
        Number(removeUserTarget.id ?? removeUserTarget.user_id),
      );
      toast.success("Utente rimosso dal progetto");
      setRemoveUserTarget(null);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante la rimozione dell'utente dal progetto";
      toast.error(message);
    }
  };

  const handleAssignUser = async () => {
    if (!projectId || !selectedAssignUserId) return;

    setAssigningUser(true);
    try {
      await assignUserToProject(
        Number(projectId),
        Number(selectedAssignUserId),
      );
      toast.success("Utente assegnato al progetto");
      setSelectedAssignUserId("");
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante l'assegnazione dell'utente al progetto";
      toast.error(message);
    } finally {
      setAssigningUser(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditFormData({
      name: selectedProject?.name ?? "",
      description: selectedProject?.description ?? "",
      // il be vuole il formato "YYYY-MM-DD" (componenti locali per evitare lo slittamento di un giorno)
      deadline: toDateInputValue(selectedProject?.deadline),
    });
    setEditModalOpen(true);
  };

  const handleEditProject = async () => {
    if (!projectId || !selectedProject) return;

    if(editFormData.name.trim() === "" || editFormData.description.trim() === "") {
      toast.error("Nome e descrizione non possono essere vuoti");
      return;
    }

    if(editFormData.deadline && isNaN(Date.parse(editFormData.deadline))) {
      toast.error("La data di scadenza non è valida");
      return;
    }

    if(editFormData.deadline && new Date(editFormData.deadline) < new Date()) {
      toast.error("La deadline non può essere una data passata");
      return;
    }

    try {
      await updateProject(Number(projectId), {
        name: editFormData.name,
        description: editFormData.description,
        deadline: editFormData.deadline || null,
      });

      await fetchProjectDetails(Number(projectId));
      toast.success("Progetto aggiornato con successo");
      setEditModalOpen(false);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante l'aggiornamento del progetto";
      toast.error(message);
    }
  };

  // esegue davvero il cambio di stato
  const performStatusChange = async (status) => {
    try {
      await updateProjectStatus(Number(projectId), status);
      await fetchProjectDetails(Number(projectId));
      toast.success(`Stato del progetto aggiornato a "${status}"`);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante il cambio di stato del progetto";
      toast.error(message);
    }
  };

  // cambio stato separato dalla modifica: parte dal dropdown "Cambia stato" nell'header.
  // Per "Completato" chiediamo conferma (è un'azione finale: non si torna indietro e disabilita le modifiche).
  const handleChangeProjectStatus = (status) => {
    if (!projectId || !status || status === selectedProject?.status) return;
    if (status === "Completato") {
      setCompleteModalOpen(true);
      return;
    }
    performStatusChange(status);
  };

  const handleConfirmComplete = async () => {
    await performStatusChange("Completato");
    setCompleteModalOpen(false);
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    setDeletingProject(true);
    try {
      await withMinDuration(deleteProject(Number(projectId)));
      toast.success("Progetto eliminato con successo");
      navigate(backRoute);
    } catch (error) {
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante l'eliminazione del progetto";
      toast.error(message);
      setDeletingProject(false);
    }
  };

  // abilita "Salva modifiche" solo se almeno un campo è cambiato rispetto al progetto
  const hasProjectChanges =
    editFormData.name.trim() !== (selectedProject?.name ?? "").trim() ||
    editFormData.description.trim() !== (selectedProject?.description ?? "").trim() ||
    editFormData.deadline !== toDateInputValue(selectedProject?.deadline);

  const editModalFooter = (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)} className="hover:bg-slate-100">
        Annulla
      </Button>
      <Button
        type="button"
        onClick={handleEditProject}
        disabled={!hasProjectChanges}
        className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      >
        Salva modifiche
      </Button>
    </div>
  );

  const projectInfoItems = getProjectInfoItems(selectedProject);

  const projectSectionCounts = {
    // Per il conteggio della checklist, usiamo la lunghezza di checklistItems
    checklist: checklistItems.length,
    // Per il conteggio del team, usiamo la lunghezza di projectAssignedUsers
    team: projectAssignedUsers.length,
    // niente contatore per "Attività": il numero di eventi nel log non è
    // un'informazione utile da mostrare come badge sul tab
  };

  const deleteFormDescription = (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
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
      <div className="mx-auto flex w-full  flex-col gap-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <Button
  variant="outline"
  onClick={() => navigate(backRoute)}
  className="inline-flex items-center gap-2 border-none bg-transparent hover:bg-slate-50 py-2"
>
  {/* h-4 w-4 (16px) è la dimensione standard perfetta per i font di testo */}
  <ArrowLeft className="h-4 w-4 text-slate-600" />
  <span className="text-sm font-medium text-slate-600">Torna ai progetti</span>
</Button>
        </div>

        {loading && !selectedProject ? (
          <Loader label="Caricamento dettagli progetto..." />
        ) : selectedProject ? (
          <div className="flex w-full flex-col gap-6 ">
            <ProjectHeaderCard
              selectedProject={selectedProject}
              activeSection={activeSection}
              oneSectionChange={setActiveSection}
              counts={projectSectionCounts}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              onEditProject={handleOpenEditModal}
              onChangeStatus={handleChangeProjectStatus}
              onDeleteProject={() => setDeleteModalOpen(true)}
            />

            {!isAdmin || activeSection === "overview" ? (
              <ProjectOverviewSection
                projectInfoItems={projectInfoItems}
                selectedProject={selectedProject}
                checklistItems={checklistItems}
                isAdmin={isAdmin}
                stats={projectStats}
                sessions={sessions}
                currentUserId={user?.id}
              />
            ) : null}

            {isAdmin && activeSection === "checklist" ? (
              <ChecklistSection
                projectId={projectId}
                isAdmin={isAdmin}
                isCompleted={selectedProject.status === "Completato"}
                isPaused={selectedProject.status === "In pausa"}
              />
            ) : null}

            {isAdmin && activeSection === "team" ? (
              <ProjectTeamSection
                selectedProject={selectedProject}
                users={availableUser}
                projectAssignedUsers={projectAssignedUsers}
                selectedAssignUserId={selectedAssignUserId}
                setSelectedAssignUserId={setSelectedAssignUserId}
                projectId={projectId}
                assignUserToProject={assignUserToProject}
                fetchProjectDetails={fetchProjectDetails}
                onRemoveUser={setRemoveUserTarget}
                onAssignUser={handleAssignUser}
                assigningUser={assigningUser}
                searchUser={searchUser}
                setSearchUser={setSearchUser}
                isCompleted={selectedProject.status === "Completato"}
              />
            ) : null}

            {isAdmin && activeSection === "activities" ? (
              <ProjectActivitiesSection activities={activities} loading={activitiesLoading} currentUserId={user?.id} />
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Nessun dettaglio progetto disponibile.
          </div>
        )}
      </div>

      <ModalForm
        modalOpen={completeModalOpen}
        setModalOpen={setCompleteModalOpen}
        title="Completa progetto"
        infos="Stai per impostare il progetto su “Completato”."
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
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
        iconColor="text-red-500"
        submitVariant="destructive"
      />

      <ModalForm
        modalOpen={editModalOpen}
        setModalOpen={setEditModalOpen}
        title="Modifica progetto"
        infos="Aggiorna il nome e la descrizione del progetto o la scadenza. 
        "
        
        fields={projectEditFields}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleEditProject}
        submitLabel="Salva modifiche"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
        customFooter={editModalFooter}
      />

      <DeleteConfirmModal
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        title="Elimina progetto"
        itemPhrase="il progetto"
        itemName={selectedProject?.name}
        extraInfo={`Codice progetto #${selectedProject?.id}`}
        warningText="Questa azione è irreversibile: il progetto e tutti i dati collegati verranno eliminati definitivamente."
        onConfirm={handleDeleteProject}
        confirmLabel="Sì, Elimina progetto"
        loading={deletingProject}
      />
    </AppLayout>
  );
};

export default ProjectDetail;