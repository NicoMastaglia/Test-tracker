import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useTaskContext } from "@/context/Task/TaskContext";
import { Folder, PlayCircle, FolderOpen, Clock3, ChevronRight, Gauge, CheckCircle, ListChecks } from "lucide-react";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import WelcomeCard from "./WelcomeCard";


const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { projects, fetchProjects } = useProjectContext();
  const { sessions, fetchSessions } = useSessionContext();
  const { assignedTasks, fetchAssignedTasks } = useTaskContext();

  useEffect(() => {
    // per il tester, GET /projects ritorna GIÀ solo i progetti assegnati;
    // GET /test-sessions (senza projectId) ritorna le sue sessioni.
    fetchProjects();
    fetchSessions();
    fetchAssignedTasks();
  }, []);

  // i progetti del tester sono già quelli assegnati (filtro lato BE)
  const assignedProjects = projects || [];
  const sessionList = sessions || [];
  const taskList = assignedTasks || [];

  const kpiItems = [
    {
      label: "Progetti Assegnati",
      value: assignedProjects.length.toString(),
      icon: Folder,
      color: "green",
    },
    {
      label: "Le mie sessioni",
      value: sessionList.length.toString(),
      icon: PlayCircle,
      color: "blue",
    },
    {
      label: "Sessioni concluse",
      value: sessionList.filter((s) => s.status === "Completata").length.toString(),
      icon: CheckCircle,
      color: "blue",
    },
    {
      label: "Task completate",
      value: taskList.filter((t) => t.status === "Completata").length.toString(),
      icon: ListChecks,
      color: "amber",
    },
  ];

  const quickActions = [
    {
      title: "Vai ai miei progetti",
      description: "Visualizza i progetti assegnati nel tuo workspace",
      icon: FolderOpen,
      onClick: () => navigate("/user/projects"),
      iconClass: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      disabled: false,
    },
    {
      title: "I miei lavori",
      description: "Visualizza le tue sessioni di test",
      icon: Clock3,
      onClick: () => navigate("/sessions-test"),
      // stesso pattern cromatico del KPI "Le mie sessioni" per coerenza visiva
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      disabled: false,
    },
    {
      title: "Le mie task",
      description: "Visualizza  tutte le task assegnate",
      icon: ListChecks,
      onClick: () => navigate("/user/tasks"),
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
      disabled: false,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <WelcomeCard
        user={user}
        subtitle="Visualizza i tuoi progetti, checklist e sessioni di test."
      />

      <StatsCardsRow stats={kpiItems} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" />

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            Azioni rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                disabled={action.disabled}
                onClick={action.onClick ?? undefined}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${action.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{action.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
