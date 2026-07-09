import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ChecklistDetailView from "@/Components/features/projects/ProjectDetail/ChecklistDetail/ChecklistDetailView";
import { Button } from "@/Components/ui/button";
import ModalForm from "@/utils/components/ModalForm";
import DeleteConfirmModal from "@/utils/components/DeleteConfirmModal";
import ProjectCompletedBanner from "@/utils/components/ProjectCompletedBanner";
import Loader from "@/utils/components/Loader";
import { ArrowLeft, ChevronRight, Pencil, User2,UserMinus, CircleSlash} from "lucide-react";
import { toast } from "sonner";
import { getFullName, toDateInputValue, isDateInPast, getDaysDifference, formatProjectDate } from "@/utils/helpers/tableHelpers";
import {useTaskContext} from "@/context/Task/TaskContext"
import { withMinDuration } from "@/utils/helpers/withMinDuration";


const ChecklistDetail = () => {
  const { id, checklistId } = useParams();
  const navigate = useNavigate();

  const { checklistItems, selectedChecklist, fetchChecklistsByProject,
     clearChecklist, addChecklistItem,
     updateChecklistItem, removeChecklistItem } = useChecklistContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject,
    getProjectUsers
   } = useProjectContext();
  const { user } = useAuthContext();
  const {assignTaskToUser,unassignTask,updateTask} = useTaskContext()

  // admin e superadmin hanno entrambi pieno accesso alle azioni su checklist/task;
  // l'unico blocco è sullo stato del progetto (vedi isProjectCompleted sotto), non sul ruolo
  const isAdmin = user?.role !== "user";
    // Solo admin/superadmin raggiungono il dettaglio checklist: path sempre su /admin
  const projectsPath = "/admin/projects";
  const projectPath  = `/admin/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;
  // progetto Completato: sola consultazione, niente azioni di modifica sulle task
  const isProjectCompleted = selectedProject?.status === "Completato";
  // progetto In pausa: nessuna modifica a task/checklist esistenti finché non torna Attivo
  // (stesso trattamento di isProjectCompleted, solo reversibile)
  const isProjectPaused = selectedProject?.status === "In pausa";

    const [usersList, setUsersList] = useState([]);

// STATO MODALI
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [assignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const[unassignTaskModalOpen,setUnassignTaskModalOpen] = useState(false)
  

  // STATO TASK MODALI


  // nota ora ne usi 3 potresti usarne una per tutti 3 i metodi 
  const [editTaskTarget, setEditTaskTarget] = useState(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [blockTaskTarget, setBlockTaskTarget] = useState(null);
  const [currentTask,setCurrentTask] = useState(null)
  
  // scadenza task oltre quella del progetto: non è un'azione irreversibile, quindi
  // non blocchiamo, ma chiediamo conferma esplicita mostrando le due date e lo scarto
  const [deadlineWarning, setDeadlineWarning] = useState(null);


  // FORM DATA

  // PER TASK
  const [editTaskFormData, setEditTaskFormData] = useState({ description: "", deadline: "" });
  const [addTaskFormData, setAddTaskFormData] = useState({ description: "", deadline: "" });
  const [assignTaskFormData, setAssignTaskFormData] = useState({ user: "" });
  const [unassignTaskFormData, setUnassignTaskFormData] = useState({ user: "" });
 


  
  const checklist = useMemo(() => {
    // Cerca la checklist corrispondente all'ID fornito nei parametri
    const found = checklistItems.find(
      (cl) => String(cl.checklist_id) === String(checklistId),
    );
    // Se non viene trovata, verifica se la checklist selezionata nel contesto corrisponde all'ID fornito
    if (found) return found;
    // Se la checklist selezionata corrisponde all'ID fornito, restituiscila
    if (selectedChecklist && String(selectedChecklist.checklist_id) === String(checklistId)) {
      return selectedChecklist;
    }
    return null;
  }, [checklistItems, selectedChecklist, checklistId]);

  useEffect(() => {
    if (id) {
      // Fetch sempre incondizionato: CLEAR_SELECTED_CHECKLIST (cleanup sotto) non svuota
      // checklistItems, quindi un guard tipo "if (!checklistItems.length)" può restare bloccato
      // sui dati del progetto precedente e non far mai partire il fetch per quello nuovo.
      fetchChecklistsByProject(id);
      fetchProjectDetails(id);
    }
    // Così all'unmount il contesto viene pulito e non rimangono dati della checklist precedente
    return () => {
      clearSelectedProject();
      clearChecklist();
    };
  }, [id]);

  {/* Aggiorna la lista degli utenti del progetto per popolare il select della modale di assegnazione task */}
  const handleUsersList = async () => {
    if (!id) return;

    try {
      const users = await getProjectUsers(id);
      setUsersList(users);
    } catch (error) {
      console.error("Errore durante il recupero della lista utenti:", error);
    }
  }

  useEffect(() => {
    handleUsersList();
  }, [id]);


  

  


  {/* NAVIGA A PROJECTDETAIL*/}
  const goBackToChecklist = () =>
    navigate(projectPath, { state: { section: "checklist" } });
   
  {/* HANDLE PER MODALI  */}

  {/* APRE MODAl ADD TASK */}
  const handleOpenAddTaskModal = () => {
    setAddTaskFormData({ description: "", deadline: "" });
    setAddTaskModalOpen(true);
  };

  {/* APRE MODAl EDIT TASK */}
  const handleOpenEditTaskModal = (task) => {
    setEditTaskTarget(task);
    setEditTaskFormData({ description: task?.description ?? "", deadline: toDateInputValue(task?.deadline) });
  };
  
  {/* APRE MODAl ASSIGN TASK */}
  const handleOpenAssignTaskModal = (task) => {
    setCurrentTask(task)
    setAssignTaskModalOpen(true);
     setAssignTaskFormData({ user: task?.assigned_to ?? "" });
  }

  const handleOpenUnassignTaskModal = (task) => {
    setCurrentTask(task)
    setUnassignTaskModalOpen(true);
    setUnassignTaskFormData({ user: task?.assigned_to ?? "" });
  }

   {/* CHIAMATE API */}

  {/* CHIAMATA API EFFETTIVA DI AGGIUNTA TASK, richiamata direttamente o dopo conferma dal dialog scadenza */}
  const submitAddTask = async () => {
    try {
      await addChecklistItem(checklist.checklist_id, { description: addTaskFormData.description.trim(), deadline: addTaskFormData.deadline || null });
      await fetchChecklistsByProject(id);
      toast.success("Task aggiunto con successo");
      setAddTaskModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante l'aggiunta del task");
    }
  };

  {/* HANDLE PER AGGIUNGERE UNA TASK*/}
  const handleAddTask = async () => {
    if (!checklist?.checklist_id) return;
    if (addTaskFormData.description.trim() === "") {
      toast.error("La descrizione del task non può essere vuota");
      return;
    }
    if (addTaskFormData.deadline && isNaN(Date.parse(addTaskFormData.deadline))) {
      toast.error("La scadenza non è una data valida");
      return;
    }
    if (addTaskFormData.deadline && isDateInPast(addTaskFormData.deadline)) {
      toast.error("La scadenza non può essere una data passata");
      return;
    }
    if (addTaskFormData.deadline && selectedProject?.deadline) {
      const diffDays = getDaysDifference(selectedProject.deadline, addTaskFormData.deadline);
      if (diffDays > 0) {
        setDeadlineWarning({ type: "add", diffDays });
        return;
      }
    }
    await submitAddTask();
  };

  {/* CHIAMATA API EFFETTIVA DI MODIFICA TASK, richiamata direttamente o dopo conferma dal dialog scadenza */}
  const submitEditTask = async () => {
    try {
      await updateChecklistItem(editTaskTarget.item_id, { description: editTaskFormData.description.trim(), deadline: editTaskFormData.deadline || null });
      await fetchChecklistsByProject(id);
      toast.success("Task modificato con successo");
      setEditTaskTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante la modifica del task");
    }
  };

 {/* HANDLE PER MODIFICARE UNA TASK*/}
  const handleEditTask = async () => {
    if (!editTaskTarget?.item_id) return;
    if (editTaskFormData.description.trim() === "") {
      toast.error("La descrizione del task non può essere vuota");
      return;
    }
    if (editTaskFormData.deadline && isNaN(Date.parse(editTaskFormData.deadline))) {
      toast.error("La scadenza non è una data valida");
      return;
    }
    if (editTaskFormData.deadline && isDateInPast(editTaskFormData.deadline)) {
      toast.error("La scadenza non può essere una data passata");
      return;
    }
    if (editTaskFormData.deadline && selectedProject?.deadline) {
      const diffDays = getDaysDifference(selectedProject.deadline, editTaskFormData.deadline);
      if (diffDays > 0) {
        setDeadlineWarning({ type: "edit", diffDays });
        return;
      }
    }
    await submitEditTask();
  };

  {/* HANDLE PER CONFERMARE IL SALVATAGGIO NONOSTANTE LA SCADENZA OLTRE IL PROGETTO */}
  const confirmDeadlineWarning = async () => {
    if (deadlineWarning?.type === "add") await submitAddTask();
    else if (deadlineWarning?.type === "edit") await submitEditTask();
    setDeadlineWarning(null);
  };
  
  {/* HANDLE PER ELIMINARE UNA TASK*/}
  const handleDeleteTask = async () => {
    if (!deleteTaskTarget?.item_id) return;
    setDeletingTask(true);
    try {
      await withMinDuration(removeChecklistItem(deleteTaskTarget.item_id));
      await fetchChecklistsByProject(id);
      toast.success("Task eliminato con successo");
      setDeleteTaskTarget(null);
    } catch {
      toast.error("Errore durante l'eliminazione del task");
    } finally {
      setDeletingTask(false);
    }
  };

 {/*HANDLE PER ASSEGNARE UN TASK*/}
  const handleAssignTask = async () => {
    if (!currentTask?.id) return;
    if(assignTaskFormData.user.trim() === "") {
      toast.error("Seleziona un utente a cui assegnare il task");
      return;
    }

    const userId = Number(assignTaskFormData.user);

    try {
      await  assignTaskToUser (currentTask.id,userId)
      await fetchChecklistsByProject(id);
      toast.success("Task assegnato con successo");
      setAssignTaskModalOpen(false);
    }catch (error) {
      console.error("Errore durante l'assegnazione del task:", error);
      toast.error("Errore durante l'assegnazione del task");
    }



  
  }

  {/* HANDLE PER RIMUOVERE L'ASSEGNAZIONE DI UN TASK*/}

  const handleUnassignTask = async  () =>{

  

    if(!currentTask?.id){
      toast.error("Task non valido");
      return;
    }

    try {
      await  unassignTask(currentTask.id)
      await fetchChecklistsByProject(id);
      toast.success("Assegnazione rimossa con successo");
      setUnassignTaskModalOpen(false);
    }catch (error) {
      console.error("Errore durante la rimozione dell'assegnazione del task:", error);
      toast.error("Errore durante la rimozione dell'assegnazione del task");
    }

    


  }


  

  const handleBlock = (task) => setBlockTaskTarget(task);

  const confirmBlockTask = async () => {
    if (!blockTaskTarget) return;
    try {
      await updateTask(blockTaskTarget.id, "Bloccata");
      await fetchChecklistsByProject(id);
      toast.success("Task bloccata");
      setBlockTaskTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante il blocco della task");
    }
  };

  const handleUnblock = async (task) => {
  try {
    await updateTask(task.id, "TODO");
    await fetchChecklistsByProject(id);
    toast.success("Task sbloccata");
  } catch (error) {
    toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante lo sblocco della task");
  }
  };

  const handleArchive = async (task) => {
  try {
    await updateTask(task.id, "Archiviata");
    await fetchChecklistsByProject(id);
    toast.success("Task archiviata");
  } catch (error) {
    toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante l'archiviazione della task");
  }

}
const handleReopen = async (task) => {
  try {
    await updateTask(task.id, "Completata");
    await fetchChecklistsByProject(id);
    toast.success("Task riaperta");
  } catch (error) {
    toast.error(error.response?.data?.message || error.response?.data?.error || "Errore durante la riapertura della task");
  }
}




  return (
    <AppLayout page="checklists">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">

        {/* breadcrumb + back button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <button onClick={() => navigate(projectsPath)} className="cursor-pointer hover:text-foreground transition-colors">
              Progetti
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={() => navigate(projectPath)} className="cursor-pointer hover:text-foreground transition-colors">
              {projectLabel}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={goBackToChecklist} className="cursor-pointer hover:text-foreground transition-colors">
              Checklist
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              {checklist?.title ?? `#${checklistId}`}
            </span>
          </nav>

          <Button variant="ghost" size="sm" onClick={goBackToChecklist} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alle checklist
          </Button>
        </div>

        {isProjectCompleted && <ProjectCompletedBanner />}
        {isProjectPaused && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            Progetto in pausa: nessuna modifica a checklist o task finché non torna Attivo.
          </div>
        )}

        {/* content */}
        {checklist && selectedProject ? (
          <ChecklistDetailView
            checklist={checklist}
            isAdmin={isAdmin && !isProjectCompleted && !isProjectPaused}
            canAddTask={isAdmin && !isProjectCompleted && !isProjectPaused}
            handleAdd={handleOpenAddTaskModal}
            handleEdit={handleOpenEditTaskModal}
            handleDelete={(task) => setDeleteTaskTarget(task)}
            handleAssign={handleOpenAssignTaskModal}
            teamMembers={usersList}
            handleUnassign={handleOpenUnassignTaskModal}
            handleArchive={handleArchive}
            handleReopen={handleReopen}
            handleBlock={handleBlock}
            handleUnblock={handleUnblock}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <Loader label="Caricamento checklist..." />
          </div>
        )}
      </div>
      {/* MODALI */}

      {/* MODALE PER AGGIUNGERE UNA NUOVA TASK */}
      <ModalForm
        modalOpen={addTaskModalOpen}
        setModalOpen={setAddTaskModalOpen}
        title="Crea task"
        infos="Aggiungi un nuovo task alla checklist corrente."
        fields={[
          { name: "description", label: "Descrizione task", type: "textarea", rows: 3, placeholder: "Descrivi il task da testare" },
          { name: "deadline", label: "Scadenza", type: "date", placeholder: "Facoltativa" },
        ]}
        formData={addTaskFormData}
        setFormData={setAddTaskFormData}
        onSubmit={handleAddTask}
        submitLabel="Aggiungi task"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
      />


      {/* MODALE PER MODIFICARE UN TASK ESISTENTE  */}
      <ModalForm
        modalOpen={!!editTaskTarget}
        setModalOpen={(open) => { if (!open) setEditTaskTarget(null); }}
        title="Modifica task"
        infos="Aggiorna la descrizione del task."
        fields={[
          { name: "description", label: "Descrizione task", type: "textarea", rows: 3, placeholder: "Descrivi il task da testare" },
          { name: "deadline", label: "Scadenza", type: "date", placeholder: "Facoltativa" },
        ]}
        formData={editTaskFormData}
        setFormData={setEditTaskFormData}
        onSubmit={handleEditTask}
        submitLabel="Salva modifiche"
        cancelLabel="Annulla"
        titleIcon={Pencil}
        iconColor="text-emerald-500"
      />
      {/* MODALE PER ELIMINARE UN TASK ESISTENTE  */}
      <DeleteConfirmModal
        modalOpen={!!deleteTaskTarget}
        setModalOpen={(open) => { if (!open) setDeleteTaskTarget(null); }}
        title="Elimina task"
        itemPhrase="il task"
        itemName={deleteTaskTarget?.description || "Task senza descrizione"}
        warningText="Questa azione è irreversibile: il task verrà eliminato definitivamente."
        onConfirm={handleDeleteTask}
        confirmLabel="Sì, Elimina task"
        loading={deletingTask}
      />


      {/* MODALE PER ASSEGNARE UN TASK */}
      <ModalForm
        modalOpen={!!assignTaskModalOpen}
        setModalOpen={(open)=> { if (!open) setAssignTaskModalOpen(null) }}
        title="Assegna Task"
        infos="Assegna un task alla checklist selezionata."
        fields={[
          { name: "user",
            label: "Seleziona un utente",
            type: "select",
            key : "user",
            placeholder: "Seleziona un utente a cui assegnare il task",
            info: "Seleziona un utente dalla lista per assegnare il task.",
            required: true,
            disabled: usersList.length === 0,
            helperText: usersList.length === 0 ? "Nessun tester assegnato a questo progetto. Aggiungilo nella sezione Team prima di assegnare una task." : undefined,
           options: usersList.map(user => ({ value: String(user.id), label: getFullName(user) })) },
        ]}
        formData={assignTaskFormData}
        setFormData={setAssignTaskFormData}
        hasDescripion={true}
        // description={'ddd'}
        onSubmit={handleAssignTask}
        submitLabel="Assegna Task"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={User2}
        iconColor="text-blue-500"
      />

      <ModalForm
        modalOpen={!!unassignTaskModalOpen}
        setModalOpen={(open)=> {if (!open) setUnassignTaskModalOpen(null); }}
        title="Rimuovi assegnazione task"
        infos={
          `
          
          Questa azione rimuoverà l'assegnazione della task-
          `
        }
        hasDescripion={true} 
        description={(
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-center dark:border-amber-500/20 dark:bg-amber-500/10">
  <p className="text-amber-800 dark:text-amber-400">
    Rimuovere il tester <span className="font-semibold text-amber-950 dark:text-amber-300">{usersList.find((u) => u.id === unassignTaskFormData.user) ? getFullName(usersList.find((u) => u.id === unassignTaskFormData.user)) : "Utente non specificato"}</span> dalla task <span className="font-semibold text-amber-950 dark:text-amber-300">"{currentTask?.description || "Task senza descrizione"}"</span>?
  </p>
</div>
        )}
        onSubmit={handleUnassignTask}
        formData={unassignTaskFormData}
        setFormData={setUnassignTaskFormData}
        submitLabel="Rimuovi assegnazione"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={UserMinus}
        iconColor="text-amber-500"
        submitVariant="destructive"
      />

      <ModalForm
        modalOpen={!!blockTaskTarget}
        setModalOpen={(open) => { if (!open) setBlockTaskTarget(null); }}
        title="Blocca task"
        infos="La task non sarà più modificabile dal tester finché non viene sbloccata."
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-center dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-amber-800 dark:text-amber-400">
              Bloccare la task <span className="font-semibold text-amber-950 dark:text-amber-300">"{blockTaskTarget?.description || "Task senza descrizione"}"</span>?
            </p>
          </div>
        )}
        onSubmit={confirmBlockTask}
        submitLabel="Blocca Task"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={CircleSlash}
        iconColor="text-amber-500"
        submitVariant="destructive"
      />

      {/* MODALE DI CONFERMA: SCADENZA TASK OLTRE LA SCADENZA DEL PROGETTO */}
      <ModalForm
        modalOpen={!!deadlineWarning}
        setModalOpen={(open) => { if (!open) setDeadlineWarning(null); }}
        title="Scadenza oltre il progetto"
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-amber-800 dark:text-amber-400">
              Scadenza progetto: <strong>{formatProjectDate(selectedProject?.deadline)}</strong>
              <br />
              Scadenza inserita: <strong>{formatProjectDate(deadlineWarning?.type === "add" ? addTaskFormData.deadline : editTaskFormData.deadline)}</strong>
              <br />
              Supera la scadenza del progetto di <strong>{deadlineWarning?.diffDays} {deadlineWarning?.diffDays === 1 ? "giorno" : "giorni"}</strong>.
            </p>
          </div>
        )}
        onSubmit={confirmDeadlineWarning}
        submitLabel="Continua comunque"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={Pencil}
        iconColor="text-amber-500"
      />

    </AppLayout>
  );
}


      


 

export default ChecklistDetail;
