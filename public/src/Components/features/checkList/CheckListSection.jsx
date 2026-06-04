import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import CheckListTable from "./CheckListTable";
import { checkListFields } from "@/utils/fields/checkListFields";

const CheckListSection = ({ projectId, isAdmin }) => {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const navigate = useNavigate();

  const { checklistItems, fetchCheckListsByProject, addCheckList, selectChecklist } =
    useCheckListContext();

  useEffect(() => {
    if (projectId) fetchCheckListsByProject(projectId);
  }, [projectId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return checklistItems;
    return checklistItems.filter((cl) =>
      cl.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [checklistItems, search]);

  const handleCreate = async () => {
    if (!projectId) return;
    await addCheckList({ title: formData.title, project_id: Number(projectId) });
    await fetchCheckListsByProject(projectId);
    setFormData({ title: "" });
    setModal(false);
  };

  const handleOpen = (cl) => {
    selectChecklist(cl);
    const base = isAdmin
      ? `/admin/projects/${projectId}/checklist`
      : `/user/projects/${projectId}/checklist`;
    navigate(`${base}/${cl.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca checklist..."
          buttonText={isAdmin ? "Crea Checklist" : null}
          onButtonClick={() => setModal(true)}
          buttonVariant="emerald"
        />
      </div>

      <CheckListTable checklists={filtered} onOpen={handleOpen} />

      <ModalForm
        modalOpen={modal}
        setModalOpen={setModal}
        onClose={() => setFormData({ title: "" })}
        title="Nuova Checklist"
        infos="Crea un template checklist associato al progetto corrente."
        fields={checkListFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreate}
        submitLabel="Crea Checklist"
        cancelLabel="Annulla"
      />
    </div>
  );
};

export default CheckListSection;
