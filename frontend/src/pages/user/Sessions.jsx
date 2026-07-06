import AppLayout from "@/Components/layout/AppLayout";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import SessionRow from "./SessionRow";
import CreateSessionModal from "./CreateSessionModal";
import ActionBar from "@/utils/components/ActionBar";
import Loader from "@/utils/components/Loader";
import { useTaskContext } from "@/context/Task/TaskContext";
import { toast } from "sonner";

const headers = [
  { label: "#", key: "id" },
  { label: "Progetto", key: "project_name" },
  { label: "Inizio", key: "start_time" },
  { label: "Fine", key: "end_time" },
  { label: 'Stato', key: 'status' },
];

const Sessions = () => {
  const navigate = useNavigate();
  const { sessions, fetchSessions, createSession, loading } = useSessionContext();
  const { fetchAssignedTasks, assignedTasks } = useTaskContext();

  const [search, setSearch] = useState("");
  const [addSessionOpen, setAddSessionOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAssignedTasks();
    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    const bySearch = search
      ? sessions.filter((s) => (s.project_name ?? "").toLowerCase().includes(search.toLowerCase()))
      : sessions;
    if (filterStatus === "blocked") {
      return bySearch.filter((s) => s.has_blocked_task);
    }
    return filterStatus === "all" ? bySearch : bySearch.filter((s) => s.status === filterStatus);
  }, [sessions, search, filterStatus]);

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  // "blocked" è un filtro sintetico (deriva da has_blocked_task, non da un vero status)
  const sessionFilters = useMemo(() => [
    { value: "In corso", label: "In corso", count: sessions.filter((s) => s.status === "In corso").length },
    { value: "Completata", label: "Completate", count: sessions.filter((s) => s.status === "Completata").length },
    { value: "blocked", label: "Bloccate", count: sessions.filter((s) => s.has_blocked_task).length },
  ], [sessions]);

  // Raggruppa le task assegnate (lavorabili) per progetto: alimenta sia il select
  // progetto che la lista task della modale di creazione sessione 
  // Completata/Archiviata/Bloccata non sono "lavorabili" (stessa regola del BE,
  
  // Un progetto "Completato" o "In pausa" non può essere il punto di partenza di una nuova sessione.
  const tasksByProject = useMemo(() => {
    const workable = assignedTasks.filter(
      (task) =>
        task.status !== "Completata" &&
        task.status !== "Archiviata" &&
        task.status !== "Bloccata" &&
        task.project_status !== "Completato" &&
        task.project_status !== "In pausa" &&
        !task.in_open_session
    );

    const grouped = new Map();
    for (const task of workable) {
      if (!grouped.has(task.project_id)) {
        grouped.set(task.project_id, {
          projectId: task.project_id,
          projectName: task.project_name,
          tasks: [],
        });
      }
      grouped.get(task.project_id).tasks.push(task);
    }
    return Array.from(grouped.values());
  }, [assignedTasks]);

  const handleCreateSession = async (taskIds) => {
    try {
      await createSession(taskIds);
      toast.success("Sessione creata");
      setAddSessionOpen(false);
    } catch (error) {
      const message = error.response?.data?.error || "Errore durante la creazione della sessione";
      toast.error(message);
    }
  };

  return (
    <AppLayout page="sessions" title="Sessioni">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca sessione..."
            buttonText="Nuova sessione"
            onButtonClick={() => setAddSessionOpen(true)}
            buttonVariant="emerald"
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          >
            <StatusFilterPills
              filters={sessionFilters}
              active={filterStatus}
              onChange={setFilterStatus}
              totalCount={sessions.length}
            />
          </ActionBar>
          {loading && sessions.length === 0 ? (
            <Loader label="Caricamento sessioni..." />
          ) : (
            <StandardTable
              headers={headers}
              data={filteredSessions}
              emptyMessage="Nessuna sessione trovata..."
              emptyIcon={PlayCircle}
              renderRow={(s, index) => (
                <SessionRow
                  session={s}
                  index={index + 1}
                  onView={(sessionId) => navigate(`/sessions/${sessionId}`)}
                />
              )}
            />
          )}

          <CreateSessionModal
            modalOpen={addSessionOpen}
            setModalOpen={setAddSessionOpen}
            tasksByProject={tasksByProject}
            onSubmit={handleCreateSession}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Sessions;
