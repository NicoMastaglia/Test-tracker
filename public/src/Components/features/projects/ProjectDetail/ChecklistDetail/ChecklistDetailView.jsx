import { useMemo, useState,useEffect } from "react";
import { ListChecks, CheckCircle2, Loader2, Ban, PieChart } from "lucide-react";
import ActionBar from "@/utils/components/ActionBar";
import TaskTable from "./TaskTable";
import ChecklistInfoCard from "./ChecklistInfoCard";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import { NotAvailable } from "@/utils/components/Placeholder";

// DETTAGLIO CHECKLIST: MOSTRA LE INFORMAZIONI PRINCIPALI SULLA CHECKLIST SELEZIONATA E LA TABELLA DEI TASK ASSOCIATI
const ChecklistDetailView = ({
  checklist,
  project,
  handleAdd,
  handleView,
  handleEdit,
  handleDelete,
  isAdmin,
  onEditChecklist,
  onChangeChecklistStatus,
  onDeleteChecklist,
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

  useEffect(() => {
console.log(checklist.items);
  },[]);

  const taskStats = [
    {
      label: "Task totali",
      value: taskItems.length,
      icon: ListChecks,
      iconColor: "text-blue-600",
      bgIcon: "bg-blue-100",
    },
    {
      label: "Completati",
      value: <NotAvailable />,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgIcon: "bg-emerald-100",
    },
    {
      label: "In corso",
      value: <NotAvailable />,
      icon: Loader2,
      iconColor: "text-amber-600",
      bgIcon: "bg-amber-100",
    },
    {
      label: "Bloccati",
      value: <NotAvailable />,
      icon: Ban,
      iconColor: "text-red-600",
      bgIcon: "bg-red-100",
    },
  ];

  const completionStat = {
    label: "Completamento",
    value: <NotAvailable />,
    icon: PieChart,
    iconColor: "text-violet-600",
    bgIcon: "bg-violet-100",
  };

  return (
    <div className="flex flex-col gap-6">
      <ChecklistInfoCard
        checklist={checklist}
        selectedProject={project}
        onEditChecklist={onEditChecklist}
        onChangeStatus={onChangeChecklistStatus}
        onDeleteChecklist={onDeleteChecklist}
      />

      <StatsCardsRow
        stats={taskStats}
        completion={completionStat}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
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

        <TaskTable tasks={filteredTasks} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default ChecklistDetailView;
