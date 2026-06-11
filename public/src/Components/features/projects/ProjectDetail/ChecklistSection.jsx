import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import ChecklistTable from "./ChecklistTable";
import { checklistFields } from "@/utils/fields/checklistFields";
import {toast} from "sonner";

const ChecklistSection = ({ projectId, isAdmin }) => {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [modalForEdit, setModalForEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();

  const { checklistItems, fetchChecklistsByProject, addChecklist, selectChecklist,
    updateChecklist,removeChecklist
   } =
    useChecklistContext();

  useEffect(() => {
    if (projectId) fetchChecklistsByProject(projectId);
    console.log(" checklistItems in ChecklistSection:", checklistItems);
  }, [projectId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return checklistItems;
    return checklistItems.filter((cl) =>
      cl.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [checklistItems, search]);

  const handleCreate = async () => {
    if (!projectId) return;
    await addChecklist({ title: formData.title, project_id: Number(projectId) });
    await fetchChecklistsByProject(projectId);
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

  const handleOpenEditModal = (cl) => {
  setEditingId(cl.checklist_id);
  setFormData({ title: cl.title }); 
  setModalForEdit(true);
};

const handleEdit = async (editingId) => {
  console.log("Editing checklist with ID:", editingId, "and new title:", formData.title);

  if (!editingId) return;

  try {
  
    await updateChecklist(editingId, { title: formData.title });
    await fetchChecklistsByProject(projectId); // Rinfresca la lista
    toast.success("Checklist modificata con successo");
    
    // Reset degli stati e chiusura modale
    setFormData({ title: "" });
    setEditingId(null);
    setModalForEdit(false);
  } catch (error) {
    toast.error("Errore durante la modifica della checklist");
  }
}
  const handleDelete =  async (clId) => {

    if (!clId) {
      toast.error("ID della checklist non valido");
      return;
    }

    try {
      await removeChecklist(clId);
      await fetchChecklistsByProject(projectId);
      toast.success("Checklist eliminata con successo");
    } catch (error) {
      toast.error("Errore durante l'eliminazione della checklist");
    }
     
   
  }

 
 


  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca checklist..."
          buttonText={isAdmin ? "Crea Checklist" : null}
          onButtonClick={() => setModal(true)}
          buttonVariant="emerald"
        />

        <ChecklistTable
          checklists={filtered}
          onOpen={handleOpen}
          isAdmin={isAdmin}
          handleEdit={handleOpenEditModal}
          handleDelete={handleDelete}
        />
      </div>

         <ModalForm
        modalOpen={modalForEdit}
        setModalOpen={setModalForEdit}
          // Quando si chiude il modale, puliamo sia il form che l'ID salvato
          onClose={() => {
             setFormData({ title: "" });
          setEditingId(null);
             }}
        title="Modifica Checklist"
       infos="Modifica il template checklist associato al progetto corrente."
      fields={checklistFields}
      formData={formData}
      setFormData={setFormData}
     onSubmit={handleEdit} 
     submitLabel="Salva modifiche"
     cancelLabel="Annulla"

      />

       



      <ModalForm
        modalOpen={modal}
        setModalOpen={setModal}
        onClose={() => setFormData({ title: "" })}
        title="Nuova Checklist"
        infos="Crea un template checklist associato al progetto corrente."
        fields={checklistFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreate}
        submitLabel="Crea Checklist"
        cancelLabel="Annulla"
      />
    </div>
  );
};

export default ChecklistSection;
