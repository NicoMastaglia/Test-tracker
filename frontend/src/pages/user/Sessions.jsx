import AppLayout from "@/Components/layout/AppLayout";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, CheckCircle2, ListChecks, CircleSlash } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
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

  // "blocked" è un filtro sintetico (deriva da has_blocked_task, non da un vero status),
  // quindi ha un toggle dedicato invece di riusare quello generico sullo status letterale
  const toggle = (status) => setFilterStatus((prev) => (prev === status ? "all" : status));
  const toggleBlocked = () => setFilterStatus((prev) => (prev === "blocked" ? "all" : "blocked"));

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  // stessa convenzione cromatica del badge di stato sessione (getSessionStatusBadgeClass)
  const sessionStats = useMemo(() => [
    { label: "Sessioni totali", value: sessions.length, icon: ListChecks, iconColor: "text-slate-600", bgIcon: "bg-slate-100", onClick: () => setFilterStatus("all"), active: filterStatus === "all" },
    { label: "In corso", value: sessions.filter((s) => s.status === "In corso").length, icon: PlayCircle, iconColor: "text-indigo-600", bgIcon: "bg-indigo-100", onClick: () => toggle("In corso"), active: filterStatus === "In corso", activeClass: "border-indigo-400 ring-2 ring-indigo-200 ring-offset-1" },
    { label: "Completate", value: sessions.filter((s) => s.status === "Completata").length, icon: CheckCircle2, iconColor: "text-emerald-600", bgIcon: "bg-emerald-100", onClick: () => toggle("Completata"), active: filterStatus === "Completata", activeClass: "border-emerald-400 ring-2 ring-emerald-200 ring-offset-1" },
    { label: "Bloccate", value: sessions.filter((s) => s.has_blocked_task).length, icon: CircleSlash, iconColor: "text-red-600", bgIcon: "bg-red-100", onClick: toggleBlocked, active: filterStatus === "blocked", activeClass: "border-red-400 ring-2 ring-red-200 ring-offset-1" },
  ], [sessions, filterStatus]);

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
        task.project_status !== "In pausa"
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
        <StatsCardsRow stats={sessionStats} className="grid grid-cols-1 gap-4 sm:grid-cols-4" />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca sessione..."
            buttonText="Add Session"
            onButtonClick={() => setAddSessionOpen(true)}
            buttonVariant="emerald"
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
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
