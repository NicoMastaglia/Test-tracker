import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/Components/layout/AppLayout";
import StandardTable from "@/utils/components/StandardTable";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import ActionBar from "@/utils/components/ActionBar";
import MyTaskRow from "./MyTaskRow";
import Loader from "@/utils/components/Loader";
import { useTaskContext } from "@/context/Task/TaskContext";
import { ListChecks } from "lucide-react";

const STATUS_FILTERS = ["TODO", "In corso", "Completata", "Bloccata", "Archiviata"];

const headers = [
  { label: "Task", key: "description" },
  { label: "Progetto", key: "project_name" },
  { label: "Checklist", key: "checklist_title" },
  
  { label: "Scadenza", key: "deadline" },
  { label: "Stato", key: "status" },
  { label: "Sessione", key: "open_session_id" },
];

const MyTasks = () => {
  const { fetchAssignedTasks, assignedTasks, loading } = useTaskContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  const statusFilters = useMemo(
    () =>
      STATUS_FILTERS.map((status) => ({
        value: status,
        count: assignedTasks.filter((t) => t.status === status).length,
      })),
    [assignedTasks],
  );

  const filteredTasks = useMemo(() => {
    const bySearch = search.trim()
      ? assignedTasks.filter((t) =>
          (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (t.project_name ?? "").toLowerCase().includes(search.toLowerCase()) || 
          (t.checklist_title ?? "").toLowerCase().includes(search.toLowerCase()),
        )
      : assignedTasks;
    const byStatus = filterStatus === "all" ? bySearch : bySearch.filter((t) => t.status === filterStatus);

    // scadenze più vicine/scadute per prime; senza scadenza in fondo
    return [...byStatus].sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [assignedTasks, search, filterStatus]);

  return (
    <AppLayout page="my-tasks" title="Le mie task">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca per task,progetto,o checklist..." 
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          >
            <StatusFilterPills
              filters={statusFilters}
              active={filterStatus}
              onChange={setFilterStatus}
              totalCount={assignedTasks.length}
            />
          </ActionBar>
          {loading && assignedTasks.length === 0 ? (
            <Loader label="Caricamento task..." />
          ) : (
            <StandardTable
              headers={headers}
              data={filteredTasks}
              emptyMessage="Nessuna task assegnata trovata."
              emptyIcon={ListChecks}
              renderRow={(task) => <MyTaskRow key={task.id} task={task} />}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyTasks;
