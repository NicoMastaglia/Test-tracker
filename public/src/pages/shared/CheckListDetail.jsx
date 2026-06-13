import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ChecklistDetailView from "@/Components/features/projects/ProjectDetail/ChecklistDetail/ChecklistDetailView";
import { Button } from "@/Components/ui/button";
import ModalForm from "@/utils/components/ModalForm";
import { checklistFields } from "@/utils/fields/checklistFields";
import { ArrowLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ChecklistDetail = () => {
  const { id, checklistId } = useParams();
  const navigate = useNavigate();

  const { checklistItems, selectedChecklist, fetchChecklistsByProject, clearChecklist, updateChecklist, removeChecklist } = useChecklistContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role !== "user";

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const checklist = useMemo(() => {
    if (selectedChecklist && String(selectedChecklist.id) === String(checklistId)) {
      return selectedChecklist;
    }
    return checklistItems.find((cl) => String(cl.id) === String(checklistId)) ?? null;
  }, [selectedChecklist, checklistItems, checklistId]);

  useEffect(() => {
    if (id) {
      if (!checklistItems.length) fetchChecklistsByProject(id);
      if (!selectedProject) fetchProjectDetails(id);
    }
    return () => {
      clearSelectedProject();
      clearChecklist();
    };
  }, [id]);

  const projectsPath = isAdmin ? "/admin/projects" : "/user/projects";
  const projectPath  = isAdmin ? `/admin/projects/${id}` : `/user/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;

  const goBackToChecklist = () =>
    navigate(projectPath, { state: { section: "checklist" } });

  const handleAddTask = () => {
    toast.info("Funzionalità di aggiunta task non ancora disponibile.");
  };

  const handleViewTask = () => {
    toast.info("Funzionalità di visualizzazione task non ancora disponibile.");
  };

  const handleEditTask = () => {
    toast.info("Funzionalità di modifica task non ancora disponibile.");
  };

  const handleDeleteTask = () => {
    toast.info("Funzionalità di eliminazione task non ancora disponibile.");
  };

  const handleOpenEditChecklistModal = () => {
    setEditFormData({ title: checklist?.title ?? "" });
    setEditModalOpen(true);
  };

  const handleEditChecklist = async () => {
    if (!checklist?.checklist_id) return;
    try {
      await updateChecklist(checklist.checklist_id, { title: editFormData.title });
      await fetchChecklistsByProject(id);
      toast.success("Checklist modificata con successo");
      setEditModalOpen(false);
    } catch {
      toast.error("Errore durante la modifica della checklist");
    }
  };

  // placeholder: il BE non espone ancora uno stato per le checklist
  const handleChangeChecklistStatus = () => {
    toast.info("Cambio stato non ancora disponibile: campo non presente nel backend.");
  };

  const handleDeleteChecklist = async () => {
    if (!checklist?.checklist_id) return;
    try {
      await removeChecklist(checklist.checklist_id);
      toast.success("Checklist eliminata con successo");
      goBackToChecklist();
    } catch {
      toast.error("Errore durante l'eliminazione della checklist");
    }
  };

  const deleteChecklistDescription = (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      <p className="font-medium text-slate-900">{checklist?.title}</p>
      <p className="mt-1 text-xs text-slate-500">{checklist?.description || "Nessuna descrizione"}</p>
    </div>
  );

  return (
    <AppLayout page="checklists">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">

        {/* breadcrumb + back button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <button onClick={() => navigate(projectsPath)} className="hover:text-slate-900 transition-colors">
              Progetti
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={() => navigate(projectPath)} className="hover:text-slate-900 transition-colors">
              {projectLabel}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={goBackToChecklist} className="hover:text-slate-900 transition-colors">
              Checklist
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">
              {checklist?.title ?? `#${checklistId}`}
            </span>
          </nav>

          <Button variant="ghost" size="sm" onClick={goBackToChecklist} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alle checklist
          </Button>
        </div>

        {/* content */}
        {checklist ? (
          <ChecklistDetailView
            checklist={checklist}
            project={selectedProject}
            isAdmin={isAdmin}
            handleAdd={handleAddTask}
            handleView={handleViewTask}
            handleEdit={handleEditTask}
            handleDelete={handleDeleteTask}
            onEditChecklist={handleOpenEditChecklistModal}
            onChangeChecklistStatus={handleChangeChecklistStatus}
            onDeleteChecklist={() => setDeleteModalOpen(true)}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Caricamento checklist...
          </div>
        )}
      </div>

      <ModalForm
        modalOpen={editModalOpen}
        setModalOpen={setEditModalOpen}
        title="Modifica Checklist"
        infos="Modifica il template checklist associato al progetto corrente."
        fields={checklistFields}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleEditChecklist}
        submitLabel="Salva modifiche"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
      />

      <ModalForm
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        title="Elimina checklist"
        infos="Questa azione è irreversibile: la checklist e tutti i task collegati verranno eliminati definitivamente."
        hasDescripion={true}
        description={deleteChecklistDescription}
        onSubmit={handleDeleteChecklist}
        submitLabel="Elimina checklist"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={Trash2}
        iconColor="text-red-500"
        submitVariant="destructive"
      />
    </AppLayout>
  );
};

export default ChecklistDetail;
