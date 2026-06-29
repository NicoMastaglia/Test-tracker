import { useMemo, useState } from "react";
import ActionBar from "@/utils/components/ActionBar";
import TaskTable from "./TaskTable";
import ChecklistInfoCard from "./ChecklistInfoCard";

// DETTAGLIO CHECKLIST: MOSTRA LE INFORMAZIONI PRINCIPALI SULLA CHECKLIST SELEZIONATA E LA TABELLA DEI TASK ASSOCIATI
const ChecklistDetailView = ({
  checklist,
  project,
  handleAdd,
  handleEdit,
  handleDelete,
  handleAssign,
  handleUnassign,
  handleArchive,
  handleReopen,
  handleBlock,

  isAdmin,
  onEditChecklist,
  onDeleteChecklist,
  teamMembers = [],

}) => {
  const [search, setSearch] = useState("");

  const taskItems = useMemo(
    () =>  checklist?.items ?? [] ,
    [checklist]
  );

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return taskItems;
    return taskItems.filter((task) =>
      task.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [taskItems, search]);

  return (
    <div className="flex flex-col gap-6">
      <ChecklistInfoCard
        checklist={checklist}
        selectedProject={project}
        onEditChecklist={onEditChecklist}
        onDeleteChecklist={onDeleteChecklist}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca task..."
          buttonText={isAdmin ? "Crea Task" : null}
          onButtonClick={handleAdd}
          buttonVariant="emerald"
        />

        <TaskTable  teamMembers={teamMembers} tasks={filteredTasks} handleAssign={handleAssign} 
        handleUnassign={handleUnassign}
        handleEdit={handleEdit} handleDelete={handleDelete} isAdmin={isAdmin}
        handleArchive={handleArchive}
        handleReopen={handleReopen}
        handleBlock={handleBlock}
         />
      </div>
    </div>
  );
};

export default ChecklistDetailView;
