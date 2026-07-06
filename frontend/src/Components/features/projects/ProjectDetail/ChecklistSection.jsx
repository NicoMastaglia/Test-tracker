import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import ActionBar from "@/utils/components/ActionBar";
import ModalForm from "@/utils/components/ModalForm";
import ChecklistTable, { getChecklistStatus } from "./ChecklistTable";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import { checklistFields } from "@/utils/fields/checklistFields";
import ProjectCompletedBanner from "@/utils/components/ProjectCompletedBanner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

const ChecklistSection = ({ projectId, isAdmin, isCompleted = false, isPaused = false }) => {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [modalForEdit, setModalForEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

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

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  const filtered = useMemo(() => {
    const bySearch = search.trim()
      ? checklistItems.filter((cl) => cl.title?.toLowerCase().includes(search.toLowerCase()))
      : checklistItems;
    return filterStatus === "all"
      ? bySearch
      : bySearch.filter((cl) => getChecklistStatus(cl.items) === filterStatus);
  }, [checklistItems, search, filterStatus]);

  // Conteggio checklist derivato dalle righe normalizzate del progetto
  const checklistCount = checklistItems.length;
  const countByStatus = (status) => checklistItems.filter((cl) => getChecklistStatus(cl.items) === status).length;

  const handleCreate = async () => {
    if (!projectId) return;


    try{
    await addChecklist({title: formData.title,project_id: Number(projectId),description: formData.description});
    await fetchChecklistsByProject(projectId);
    setFormData({ title: "", description: "" });
    toast.success("Checklist creata con successo");
    setModal(false);

    }catch(error){
      console.error("Errore durante la creazione della checklist:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante la creazione della checklist");
    }
    
    
  };

  const handleOpen = (cl) => {
    selectChecklist(cl);
    const base = isAdmin
      ? `/admin/projects/${projectId}/checklist`
      : `/user/projects/${projectId}/checklist`;
    navigate(`${base}/${cl.checklist_id}`);
  };

  const handleOpenEditModal = (cl) => {
    setEditingId(cl.checklist_id);
    setFormData({ title: cl.title, description: cl.description || "" }); 
    setModalForEdit(true);
  };

  const handleEdit = async () => {
    if (!editingId) return;
    try {
      await updateChecklist(editingId, { title: formData.title, description: formData.description });
      await fetchChecklistsByProject(projectId); 
      toast.success("Checklist modificata con successo");
      setFormData({ title: "", description: "" });
      setEditingId(null);
      setModalForEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante la modifica della checklist");
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await removeChecklist(pendingDeleteId);
      await fetchChecklistsByProject(projectId);
      toast.success("Checklist eliminata con successo");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante l'eliminazione della checklist");
    } finally {
      setPendingDeleteId(null);
    }
  };



  const checklistFilters = [
    { value: "Non Iniziata", label: "Non iniziate", count: countByStatus("Non Iniziata") },
    { value: "In Corso", label: "In corso", count: countByStatus("In Corso") },
    { value: "Completata", label: "Completate", count: countByStatus("Completata") },
  ];

  return (

    <div className="w-full max-w-5xl mx-auto space-y-2 px-4 py-2">

      {isCompleted && <ProjectCompletedBanner />}

      {/* 1. SEZIONE BARRA AZIONI */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca checklist..."
          buttonText={isAdmin && !isCompleted && !isPaused ? "Crea Checklist" : null}
          onButtonClick={() => setModal(true)}
          buttonVariant="emerald"
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        >
          <StatusFilterPills
            filters={checklistFilters}
            active={filterStatus}
            onChange={setFilterStatus}
            totalCount={checklistCount}
          />
        </ActionBar>


      {/* 2. SEZIONE TABELLA: progetto Completato = sola consultazione, niente Modifica/Elimina */}
      <ChecklistTable
        checklists={filtered}
        onOpen={handleOpen}
        isAdmin={isAdmin && !isCompleted}
        handleEdit={handleOpenEditModal}
        handleDelete={(clId) => setPendingDeleteId(clId)}
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

      {/* DIALOG CONFERMA ELIMINAZIONE */}
      <Dialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Trash2 className="h-4 w-4 text-red-500" />
              Elimina checklist
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Sei sicuro di voler eliminare questa checklist? L'operazione è irreversibile e rimuoverà anche tutte le task associate.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Annulla
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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