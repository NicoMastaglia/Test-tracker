import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ListChecks, CheckCircle2, PieChart } from "lucide-react";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import ActionBar from "@/utils/components/ActionBar";
import ModalForm from "@/utils/components/ModalForm";
import ChecklistTable from "./ChecklistTable";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import { NotAvailable } from "@/utils/components/Placeholder";
import { checklistFields } from "@/utils/fields/checklistFields";
import { toast } from "sonner";

const ChecklistSection = ({ projectId, isAdmin }) => {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [modalForEdit, setModalForEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();

  const { 
    checklistItems, 
    fetchChecklistsByProject, 
    addChecklist, 
    selectChecklist,
    updateChecklist,
    removeChecklist
  } = useChecklistContext();

  useEffect(() => {
    if (projectId) fetchChecklistsByProject(projectId);
  }, [projectId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return checklistItems;
    return checklistItems.filter((cl) =>
      cl.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [checklistItems, search]);

  // Conteggio checklist e task totali derivati dalle righe normalizzate del progetto
  const checklistCount = new Set(
    checklistItems.map((item) => item.checklist_id).filter(Boolean),
  ).size;
  const totalTasks = checklistItems.filter((item) => item.item_id != null).length;

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

  const handleEdit = async () => {
    if (!editingId) return;
    try {
      await updateChecklist(editingId, { title: formData.title });
      await fetchChecklistsByProject(projectId); 
      toast.success("Checklist modificata con successo");
      setFormData({ title: "" });
      setEditingId(null);
      setModalForEdit(false);
    } catch {
      toast.error("Errore durante la modifica della checklist");
    }
  };

  const handleDelete = async (clId) => {
    if (!clId) return;
    try {
      await removeChecklist(clId);
      await fetchChecklistsByProject(projectId);
      toast.success("Checklist eliminata con successo");
    } catch {
      toast.error("Errore durante l'eliminazione della checklist");
    }
  };

  const checklistStats = [
    {
      label: "Checklist totali",
      value: checklistCount,
      icon: ClipboardList,
      iconColor: "text-indigo-600",
      bgIcon: "bg-indigo-100",
    },
    {
      label: "Task totali",
      value: totalTasks,
      icon: ListChecks,
      iconColor: "text-blue-600",
      bgIcon: "bg-blue-100",
    },
    {
      label: "Task completate",
      value: <NotAvailable />,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgIcon: "bg-emerald-100",
    },
    {
      label: "Completamento medio",
      value: <NotAvailable />,
      icon: PieChart,
      iconColor: "text-amber-600",
      bgIcon: "bg-amber-100",
    },
  ];

  return (

    <div className="w-full max-w-5xl mx-auto space-y-4 px-4 py-2">

      {/*SEZIONE STATISTICHE */}
      <StatsCardsRow stats={checklistStats} />

      {/* 1. SEZIONE BARRA AZIONI */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca checklist..."
          buttonText={isAdmin ? "Crea Checklist" : null}
          onButtonClick={() => setModal(true)}
          buttonVariant="emerald"
        />
      

      {/* 2. SEZIONE TABELLA */}
      <ChecklistTable
        checklists={filtered}
        onOpen={handleOpen}
        isAdmin={isAdmin}
        handleEdit={handleOpenEditModal}
        handleDelete={handleDelete}
      />
      </div>

      {/* MODALE DI MODIFICA */}
      <ModalForm
        modalOpen={modalForEdit}
        setModalOpen={setModalForEdit}
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

      {/* MODALE DI CREAZIONE */}
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