import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import ActionBar from "@/utils/ActionBar";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ChecklistInfoCard from "@/Components/features/checkList/ChecklistInfoCard";
import ModalForm from "@/utils/ModalForm";
import { checkListFields } from "@/utils/fields/checkListFields";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { toast } from "sonner";

const CheckList = () => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const { id } = useParams();
  const { fetchCheckListsByProject, checklistItems, addCheckList } = useCheckListContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const activeChecklist = useMemo(() => checklistItems?.[0] ?? null, [checklistItems]);
  const hasChecklist = Boolean(activeChecklist);

  const handleAddCheckList = async () => {
    if (!id) return;

    await addCheckList({
      title: formData.title,
      project_id: Number(id),
    });

    await fetchCheckListsByProject(id);
    setFormData({ title: "" });
    setModal(false);
  };

  const handleAddTask = () => {
    if (!hasChecklist) return;

    toast.info("La rotta per la creazione task non è ancora disponibile.");
  };

  useEffect(() => {
    if (id) {
      fetchCheckListsByProject(id);
      fetchProjectDetails(id);
    }

    return () => {
      clearSelectedProject();
    };
  }, [id]);

  return (
    <AppLayout page="checklists">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca checklist..."
            buttonText={user?.role === "admin" ? "Add Task" : null}
            onButtonClick={handleAddTask}
            buttonDisabled={!hasChecklist}
            buttonVariant="emerald"
          />

          <div className="pt-4">
            <ModalForm
              modalOpen={modal}
              setModalOpen={setModal}
              onClose={() => setFormData({ title: "" })}
              title="Nuova Checklist"
              infos="Crea un template checklist associato al progetto corrente."
              fields={checkListFields}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddCheckList}
              submitLabel="Crea Checklist"
              cancelLabel="Annulla"
            />
          </div>
        </div>

        <ChecklistInfoCard
          checklistItems={checklistItems}
          project={selectedProject}
          onCreateChecklist={() => setModal(true)}
        />
      </div>
    </AppLayout>
  );
};

export default CheckList;
