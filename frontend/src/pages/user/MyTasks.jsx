import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/Components/layout/AppLayout";
import StandardTable from "@/utils/components/StandardTable";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import ActionBar from "@/utils/components/ActionBar";
import MyTaskRow from "./MyTaskRow";
import { useTaskContext } from "@/context/Task/TaskContext";
import { ListChecks, ClipboardList, PlayCircle, CheckCircle2, CircleSlash } from "lucide-react";

const headers = [
  { label: "Progetto", key: "project_name" },
  { label: "Checklist", key: "checklist_title" },
  { label: "Descrizione", key: "description" },
  { label: "Scadenza", key: "deadline" },
  { label: "Stato", key: "status" },
];

const MyTasks = () => {
  const { fetchAssignedTasks, assignedTasks } = useTaskContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const toggle = (status) => setFilterStatus((prev) => (prev === status ? "all" : status));

  const taskStats = useMemo(() => [
    { label: "Task totali", value: assignedTasks.length, icon: ListChecks, iconColor: "text-slate-600", bgIcon: "bg-slate-100", onClick: () => setFilterStatus("all"), active: filterStatus === "all" },
    { label: "TODO", value: assignedTasks.filter((t) => t.status === "TODO").length, icon: ClipboardList, iconColor: "text-amber-600", bgIcon: "bg-amber-100", onClick: () => toggle("TODO"), active: filterStatus === "TODO", activeClass: "border-amber-400 ring-2 ring-amber-200 ring-offset-1" },
    { label: "In corso", value: assignedTasks.filter((t) => t.status === "In corso").length, icon: PlayCircle, iconColor: "text-blue-600", bgIcon: "bg-blue-100", onClick: () => toggle("In corso"), active: filterStatus === "In corso", activeClass: "border-blue-400 ring-2 ring-blue-200 ring-offset-1" },
    { label: "Completate", value: assignedTasks.filter((t) => t.status === "Completata").length, icon: CheckCircle2, iconColor: "text-emerald-600", bgIcon: "bg-emerald-100", onClick: () => toggle("Completata"), active: filterStatus === "Completata", activeClass: "border-emerald-400 ring-2 ring-emerald-200 ring-offset-1" },
    { label: "Bloccate", value: assignedTasks.filter((t) => t.status === "Bloccata").length, icon: CircleSlash, iconColor: "text-red-600", bgIcon: "bg-red-100", onClick: () => toggle("Bloccata"), active: filterStatus === "Bloccata", activeClass: "border-red-400 ring-2 ring-red-200 ring-offset-1" },
  ], [assignedTasks, filterStatus]);

  const filteredTasks = useMemo(() => {
    const bySearch = search.trim()
      ? assignedTasks.filter((t) =>
          (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (t.project_name ?? "").toLowerCase().includes(search.toLowerCase())
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <StatsCardsRow stats={taskStats} className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5" />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca per progetto o descrizione..."
          />
          <StandardTable
            headers={headers}
            data={filteredTasks}
            emptyMessage="Nessuna task assegnata trovata."
            emptyIcon={ListChecks}
            renderRow={(task) => <MyTaskRow key={task.id} task={task} />}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default MyTasks;
