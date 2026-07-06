import { useMemo, useState } from "react";
import ActionBar from "@/utils/components/ActionBar";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import TaskTable from "./TaskTable";

const STATUS_FILTERS = ["TODO", "In corso", "Completata", "Bloccata", "Archiviata"];

// DETTAGLIO CHECKLIST: TABELLA DEI TASK ASSOCIATI ALLA CHECKLIST SELEZIONATA

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

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ActionBar
          search={search}
          setSearch={setSearch}
          placeholder="Cerca task..."
          buttonText={canAddTask ? "Crea Task" : null}
          onButtonClick={handleAdd}
          buttonVariant="emerald"
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        >
          <StatusFilterPills
            filters={STATUS_FILTERS.map((status) => ({
              value: status,
              count: taskItems.filter((task) => task.status === status).length,
            }))}
            active={filterStatus}
            onChange={setFilterStatus}
            totalCount={taskItems.length}
          />
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
