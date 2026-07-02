import { useMemo, useState } from "react";
import ActionBar from "@/utils/components/ActionBar";
import TaskTable from "./TaskTable";

const STATUS_FILTERS = ["TODO", "In corso", "Completata", "Bloccata", "Archiviata"];

// DETTAGLIO CHECKLIST: TABELLA DEI TASK ASSOCIATI ALLA CHECKLIST SELEZIONATA
// (titolo/descrizione/edit/delete checklist sono già nel breadcrumb e nella lista in ChecklistSection)
const ChecklistDetailView = ({
  checklist,
  handleAdd,
  handleEdit,
  handleDelete,
  handleAssign,
  handleUnassign,
  handleArchive,
  handleReopen,
  handleBlock,
  handleUnblock,

  isAdmin,
  canAddTask = isAdmin,
  teamMembers = [],

}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const taskItems = useMemo(
    () =>  checklist?.items ?? [] ,
    [checklist]
  );

  const filteredTasks = useMemo(() => {
    const bySearch = search.trim()
      ? taskItems.filter((task) => task.description?.toLowerCase().includes(search.toLowerCase()))
      : taskItems;
    return filterStatus === "all" ? bySearch : bySearch.filter((task) => task.status === filterStatus);
  }, [taskItems, search, filterStatus]);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca task..."
          buttonText={canAddTask ? "Crea Task" : null}
          onButtonClick={handleAdd}
          buttonVariant="emerald"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterStatus === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              Tutti
            </button>
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus((prev) => (prev === status ? "all" : status))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterStatus === status ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </ActionBar>

        <TaskTable  teamMembers={teamMembers} tasks={filteredTasks} handleAssign={handleAssign}
        handleUnassign={handleUnassign}
        handleEdit={handleEdit} handleDelete={handleDelete} isAdmin={isAdmin}
        handleArchive={handleArchive}
        handleReopen={handleReopen}
        handleBlock={handleBlock}
        handleUnblock={handleUnblock}
         />
      </div>
    </div>
  );
};

export default ChecklistDetailView;
