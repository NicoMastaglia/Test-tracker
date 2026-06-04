import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import CheckListTable from "./CheckListTable";
import { checkListFields } from "@/utils/fields/checkListFields";
import {toast} from "sonner";

const CheckListSection = ({ projectId, isAdmin }) => {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [modalForEdit, setModalForEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();

  const { checklistItems, fetchCheckListsByProject, addCheckList, selectChecklist,
    updateCheckList,removeCheckList
   } =
    useCheckListContext();

  useEffect(() => {
    if (projectId) fetchCheckListsByProject(projectId);
    console.log(" checklistItems in CheckListSection:", checklistItems);
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

  const handleOpenEditModal = (cl) => {
  setEditingId(cl.id);
  setFormData({ title: cl.title }); // Pre-compila il campo con il titolo attuale
  setModalForEdit(true);
};

const handleEdit = async () => {
  if (!editingId) return;

  try {
  
    await updateCheckList(editingId, { title: formData.title });
    await fetchCheckListsByProject(projectId); // Rinfresca la lista
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
      await removeCheckList(clId);
      await fetchCheckListsByProject(projectId);
      toast.success("Checklist eliminata con successo");
    } catch (error) {
      toast.error("Errore durante l'eliminazione della checklist");
    }
     
   
  }

 
 


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

      
          <CheckListTable 
        checklists={filtered} 
        onOpen={handleOpen} 
        isAdmin={isAdmin} 
       handleEdit={handleOpenEditModal}  
         handleDelete={handleDelete} 
         />

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
      fields={checkListFields}
      formData={formData}
      setFormData={setFormData}
     onSubmit={handleEdit} // Adesso chiamerà la logica asincrona di aggiornamento
     submitLabel="Salva modifiche"
     cancelLabel="Annulla"

      />

       



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
