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
import { checklistFields } from "@/utils/fields/checklistFields";
import { ArrowLeft, ChevronRight, Pencil, User2,UserMinus} from "lucide-react";
import { toast } from "sonner";
import { getFullName } from "@/utils/helpers/tableHelpers";
import {useTaskContext} from "@/context/Task/TaskContext"


const ChecklistDetail = () => {
  const { id, checklistId } = useParams();
  const navigate = useNavigate();

  const { checklistItems, selectedChecklist, fetchChecklistsByProject,
     clearChecklist, updateChecklist, 
     removeChecklist, addChecklistItem, 
     updateChecklistItem, removeChecklistItem } = useChecklistContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject,
    getProjectUsers
   } = useProjectContext();
  const { user } = useAuthContext();
  const {assignTaskToUser,unassignTask,updateTask} = useTaskContext()

  const isAdmin = user?.role !== "user";
    // Solo admin/superadmin raggiungono il dettaglio checklist: path sempre su /admin
  const projectsPath = "/admin/projects";
  const projectPath  = `/admin/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;

 useEffect(() => {
    console.log(selectedProject,'progetto')
    console.log(projectLabel)
  
 },[])
 
    const [usersList, setUsersList] = useState([]);

// STATO MODALI 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [assignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const[unassignTaskModalOpen,setUnassignTaskModalOpen] = useState(false)
  

  // STATO TASK MODALI


  // nota ora ne usi 3 potresti usarne una per tutti 3 i metodi 
  const [editTaskTarget, setEditTaskTarget] = useState(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);
  const [currentTask,setCurrentTask] = useState(null)
  

  // FORM DATA 

  // PER CHECKLIST
  const [editFormData, setEditFormData] = useState({ title: "",description: "" });


  // PER TASK 
  const [editTaskFormData, setEditTaskFormData] = useState({ description: "" });
  const [addTaskFormData, setAddTaskFormData] = useState({ description: "" });
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
      // 
      if (!checklistItems.length) fetchChecklistsByProject(id);
      if (!selectedProject) fetchProjectDetails(id);
    }
    // Cosi all Unmount il contesto viene pulito e non rimangono dati della checklist precedente
    return () => {
      clearSelectedProject();
      clearChecklist();
    };
  }, [id]);

  useEffect(() => {
    console.log(currentTask,'currenttask')
    console.log(checklist)


  },[currentTask])

  useEffect(() => {
    handleUsersList();
    console.log(usersList,'usersList')
  }, [id]);
  

  

  


  {/* NAVIGA A PROJECTDETAIL*/}
  const goBackToChecklist = () =>
    navigate(projectPath, { state: { section: "checklist" } });
   
  {/* HANDLE PER MODALI  */}

  {/* APRE MODAl ADD TASK */}
  const handleOpenAddTaskModal = () => {
    setAddTaskFormData({ description: "" });
    setAddTaskModalOpen(true);
  };
  
  {/* APRE MODAl EDIT TASK */}
  const handleOpenEditTaskModal = (task) => {
    setEditTaskTarget(task);
    setEditTaskFormData({ description: task?.description ?? "" });
  };
  
  {/* APRE MODAl EDIT CHECKLIST */}
  const handleOpenEditChecklistModal = () => {
    setEditFormData({ title: checklist?.title ?? "" });
    setEditModalOpen(true);
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

    console.log(task,'task')
    console.log(unassignTaskFormData,'unassignTaskFormData')
  }

   {/* CHIAMATE API */}


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
  
  {/* HANDLE PER AGGIUNGERE UNA TASK*/}
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

 {/* HANDLE PER MODIFICARE UNA TASK*/}
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
  
  {/* HANDLE PER ELIMINARE UNA TASK*/}
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


  

  const handleBlock = async (task) => {
  try {
    await updateTask(task.id, "Bloccata");
    await fetchChecklistsByProject(id);
    toast.success("Task bloccata");
  } catch {
    toast.error("Errore durante il blocco della task");
  }
  };

  const handleArchive = async (task) => {
  try {
    await updateTask(task.id, "Archiviata");
    await fetchChecklistsByProject(id);
    toast.success("Task archiviata");
  } catch {
    toast.error("Errore durante l'archiviazione della task");
  }

}
const handleReopen = async (task) => {
  try {
    await updateTask(task.id, "Completata");
    await fetchChecklistsByProject(id);
    toast.success("Task riaperta");
  } catch {
    toast.error("Errore durante la riapertura della task");
  }
}




  {/* CHECKLIST HANDLERS */}
  
  {/* HANDLE PER  MODIFICARE UNA CHECKLIST*/}
  const handleEditChecklist = async () => {
    if (!checklist?.checklist_id) return;
    try {
      await updateChecklist(checklist.checklist_id, { title: editFormData.title, description: editFormData.description });
      await fetchChecklistsByProject(id);
      toast.success("Checklist modificata con successo");
      setEditModalOpen(false);
    } catch {
      toast.error("Errore durante la modifica della checklist");
    }
  };
  
  {/* HANDLE PER ELIMINARE UNA CHECKLIST*/}
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
            handleAssign={handleOpenAssignTaskModal}
            teamMembers={usersList}
            handleUnassign={handleOpenUnassignTaskModal}
            handleArchive={handleArchive}
            handleReopen={handleReopen}
            handleBlock={handleBlock}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Caricamento checklist...
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
      />


      {/* MODALE PER ASSEGNARE UN TASK */}
      <ModalForm
        modalOpen={!!assignTaskModalOpen}
        setModalOpen={(open)=> { if (!open) setAssignTaskModalOpen(null) }}
        title="Assegna Task ffffff"
        infos="Assegna un task alla checklist selezionata."
        fields={[
          { name: "user", 
            label: "Seleziona un utente", 
            type: "select", 
            key : "user",
            placeholder: "Seleziona un utente a cui assegnare il task",
            info: "Seleziona un utente dalla lista per assegnare il task.",
            required: true,
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
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-center">
  <p className="text-amber-800">
    Rimuovere il tester <span className="font-semibold text-amber-950">{usersList.find((u) => u.id === unassignTaskFormData.user) ? getFullName(usersList.find((u) => u.id === unassignTaskFormData.user)) : "Utente non specificato"}</span> dalla task <span className="font-semibold text-amber-950">"{currentTask?.description || "Task senza descrizione"}"</span>?
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


      {/* MODALE PER MODIFICARE LA CHECKLIST */}
    
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
      
      {/* MODALE PER ELIMINARE LA CHECKLIST */}
      <DeleteConfirmModal
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        title="Elimina checklist"
        itemPhrase="la checklist"
        itemName={checklist?.title}
        extraInfo={checklist?.description || "Nessuna descrizione"}
        warningText="Questa azione è irreversibile: la checklist e tutti i task collegati verranno eliminati definitivamente."
        onConfirm={handleDeleteChecklist}
        confirmLabel="Sì, Elimina checklist"
      />

      
    </AppLayout>
  );
}


      


 

export default ChecklistDetail;
