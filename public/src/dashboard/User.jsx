import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { CheckCircle, Folder, PlayCircle, ArrowUpRight, FolderOpen, Clock3, CheckSquare, ChevronRight, Gauge } from "lucide-react";

const KpiCard = ({ title, value, subtext, icon: Icon, iconClass, subtextColor = "text-slate-400" }) => {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-start gap-4 pt-6">
        <div className={`flex h-14 w-14 shrink-0 items-start justify-center rounded-2xl pt-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex flex-col items-start text-left gap-3">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-[30px] leading-none text-slate-900">{value}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs ${subtextColor}`}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            {subtext}
          </p>
        </div>
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
      iconClass: "bg-emerald-100 text-emerald-700",
      subtext: "Progetti attivi nel tuo workspace.",
      subtextColor: "text-slate-400",
    },
    {
      title: "Sessioni",
      value: "0",
      icon: PlayCircle,
      iconClass: "bg-blue-100 text-blue-700",
      subtext: "Placeholder: rotta non ancora disponibile.",
      subtextColor: "text-amber-500",
    },
    {
      title: "Checklist",
      value: "0",
      icon: CheckCircle,
      iconClass: "bg-amber-100 text-amber-700",
      subtext: "Placeholder: rotta non ancora disponibile.",
      subtextColor: "text-amber-500",
    },
  ];

  const quickActions = [
    {
      title: "Vai ai miei progetti",
      description: "Visualizza i progetti assegnati nel tuo workspace",
      icon: FolderOpen,
      onClick: () => navigate("/user/projects"),
      iconClass: "bg-emerald-100 text-emerald-700",
      disabled: false,
    },
    {
      title: "Sessioni in arrivo",
      description: "Funzionalità disponibile a breve",
      icon: Clock3,
      onClick: null,
      iconClass: "bg-blue-100 text-blue-700",
      disabled: true,
    },
    {
      title: "Checklist in arrivo",
      description: "Funzionalità disponibile a breve",
      icon: CheckSquare,
      onClick: null,
      iconClass: "bg-amber-100 text-amber-700",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/30 p-6">
      <div>
        <h1 className="text-3xl text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Panoramica generale della piattaforma di testing</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiItems.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={kpi.icon}
            iconClass={kpi.iconClass}
            subtextColor={kpi.subtextColor}
          />
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Gauge className="h-4 w-4 text-slate-700" />
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
                className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${action.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-900">{action.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700" />
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
