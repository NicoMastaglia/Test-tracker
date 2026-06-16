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

  const { checklistItems, selectedChecklist, fetchChecklistsByProject, clearChecklist, updateChecklist, removeChecklist, addChecklistItem, updateChecklistItem, removeChecklistItem } = useChecklistContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role !== "user";

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addTaskFormData, setAddTaskFormData] = useState({ description: "" });
  const [editTaskTarget, setEditTaskTarget] = useState(null);
  const [editTaskFormData, setEditTaskFormData] = useState({ description: "" });
  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);

  // il BE restituisce le checklist GIÀ raggruppate (con items): basta trovare quella giusta
  const checklist = useMemo(() => {
    const found = checklistItems.find(
      (cl) => String(cl.checklist_id) === String(checklistId),
    );
    if (found) return found;
    if (selectedChecklist && String(selectedChecklist.checklist_id) === String(checklistId)) {
      return selectedChecklist;
    }
    return null;
  }, [checklistItems, selectedChecklist, checklistId]);

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

  // Solo admin/superadmin raggiungono il dettaglio checklist: path sempre su /admin
  const projectsPath = "/admin/projects";
  const projectPath  = `/admin/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;

  const goBackToChecklist = () =>
    navigate(projectPath, { state: { section: "checklist" } });

  const handleOpenAddTaskModal = () => {
    setAddTaskFormData({ description: "" });
    setAddTaskModalOpen(true);
  };

  const handleAddTask = async () => {
    if (!checklist?.checklist_id) return;
    if (addTaskFormData.description.trim() === "") {
      toast.error("La descrizione del task non può essere vuota");
      return;
    }
    try {
      await addChecklistItem(checklist.checklist_id, { description: addTaskFormData.description.trim() });
      await fetchChecklistsByProject(id);
      toast.success("Task aggiunto con successo");
      setAddTaskModalOpen(false);
    } catch {
      toast.error("Errore durante l'aggiunta del task");
    }
  };

  const handleOpenEditTaskModal = (task) => {
    setEditTaskTarget(task);
    setEditTaskFormData({ description: task?.description ?? "" });
  };

  const handleEditTask = async () => {
    if (!editTaskTarget?.item_id) return;
    if (editTaskFormData.description.trim() === "") {
      toast.error("La descrizione del task non può essere vuota");
      return;
    }
    try {
      await updateChecklistItem(editTaskTarget.item_id, { description: editTaskFormData.description.trim() });
      await fetchChecklistsByProject(id);
      toast.success("Task modificato con successo");
      setEditTaskTarget(null);
    } catch {
      toast.error("Errore durante la modifica del task");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskTarget?.item_id) return;
    try {
      await removeChecklistItem(deleteTaskTarget.item_id);
      await fetchChecklistsByProject(id);
      toast.success("Task eliminato con successo");
      setDeleteTaskTarget(null);
    } catch {
      toast.error("Errore durante l'eliminazione del task");
    }
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
            handleAdd={handleOpenAddTaskModal}
            handleEdit={handleOpenEditTaskModal}
            handleDelete={(task) => setDeleteTaskTarget(task)}
            onEditChecklist={handleOpenEditChecklistModal}
            onDeleteChecklist={() => setDeleteModalOpen(true)}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Caricamento checklist...
          </div>
        )}
      </div>

      <ModalForm
        modalOpen={addTaskModalOpen}
        setModalOpen={setAddTaskModalOpen}
        title="Crea task"
        infos="Aggiungi un nuovo task alla checklist corrente."
        fields={[
          { name: "description", label: "Descrizione task", type: "textarea", rows: 3, placeholder: "Descrivi il task da testare" },
        ]}
        formData={addTaskFormData}
        setFormData={setAddTaskFormData}
        onSubmit={handleAddTask}
        submitLabel="Aggiungi task"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
      />

      <ModalForm
        modalOpen={!!editTaskTarget}
        setModalOpen={(open) => { if (!open) setEditTaskTarget(null); }}
        title="Modifica task"
        infos="Aggiorna la descrizione del task."
        fields={[
          { name: "description", label: "Descrizione task", type: "textarea", rows: 3, placeholder: "Descrivi il task da testare" },
        ]}
        formData={editTaskFormData}
        setFormData={setEditTaskFormData}
        onSubmit={handleEditTask}
        submitLabel="Salva modifiche"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
      />

      <ModalForm
        modalOpen={!!deleteTaskTarget}
        setModalOpen={(open) => { if (!open) setDeleteTaskTarget(null); }}
        title="Elimina task"
        infos="Questa azione è irreversibile: il task verrà eliminato definitivamente."
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-medium text-slate-900">{deleteTaskTarget?.description || "Task senza descrizione"}</p>
          </div>
        )}
        onSubmit={handleDeleteTask}
        submitLabel="Elimina task"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={Trash2}
        iconColor="text-red-500"
        submitVariant="destructive"
      />

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
