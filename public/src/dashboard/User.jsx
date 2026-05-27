import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { CheckCircle, Folder, PlayCircle, ListTodo, ArrowRight } from "lucide-react";

const KpiCard = ({ title, value, subtext, icon: Icon, subtextColor = "text-slate-400" }) => {
  return (
    <Card className="border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <p className={`mt-1 text-xs font-medium ${subtextColor}`}>{subtext}</p>
      </CardContent>
    </Card>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { projects, fetchProjects } = useProjectContext();

  useEffect(() => {
    fetchProjects();
  }, []);

  const assignedProjects = useMemo(() => {
    const currentUserId = Number(user?.id);

    if (!currentUserId) return [];

    return (projects || []).filter((project) => {
      const assignedUsers = Array.isArray(project.assigned_users) ? project.assigned_users : [];

      return assignedUsers.some((assignedUser) => Number(assignedUser.id ?? assignedUser.user_id) === currentUserId);
    });
  }, [projects, user?.id]);

  const kpiItems = [
    {
      title: "Progetti Assegnati",
      value: assignedProjects.length.toString(),
      icon: Folder,
      subtext: "Progetti attivi nel tuo workspace.",
      subtextColor: "text-slate-400",
    },
    {
      title: "Sessioni",
      value: "0",
      icon: PlayCircle,
      subtext: "Placeholder: rotta non ancora disponibile.",
      subtextColor: "text-amber-500",
    },
    {
      title: "Checklist",
      value: "0",
      icon: CheckCircle,
      subtext: "Placeholder: rotta non ancora disponibile.",
      subtextColor: "text-amber-500",
    },
    {
      title: "Priorità",
      value: "Bassa",
      icon: ListTodo,
      subtext: "Accesso limitato alle funzioni di test.",
      subtextColor: "text-slate-400",
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/30 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={kpi.icon}
            subtextColor={kpi.subtextColor}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col border-slate-100 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Progetti recenti assegnati
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center py-10">
            {assignedProjects.length > 0 ? (
              <div className="w-full space-y-3">
                {assignedProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.status ?? "Stato non disponibile"}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("/user/projects")}>
                      Vedi tutti
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-medium italic text-slate-400">
                Nessun progetto assegnato disponibile.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-100 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Accessi Rapidi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4">
            <Button
              variant="outline"
              className="h-9 justify-start rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              onClick={() => navigate("/user/projects")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Vai ai miei progetti
            </Button>
            <Button
              variant="outline"
              disabled
              className="h-9 justify-start rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-400"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Sessioni in arrivo
            </Button>
            <Button
              variant="outline"
              disabled
              className="h-9 justify-start rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-400"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Checklist in arrivo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-50 pb-4">
          <CardTitle className="text-base font-bold text-slate-900">Stato accesso</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Utente
            </span>
            <span>{user?.name ?? "Utente corrente"}</span>
            <span className="text-slate-300">•</span>
            <span>Ruolo: {user?.role ?? "user"}</span>
            <span className="text-slate-300">•</span>
            <span>Funzioni amministrative non disponibili</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
