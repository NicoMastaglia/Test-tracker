import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle, ArrowUpRight, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useUserContext } from "@/context/User/UserContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import {useNavigate} from "react-router-dom"; 
import {KpiCard} from "@/utils/KpiCard";


const SuperAdminDashboard = ({navigate}) => {
  const { fetchUsers, users } = useUserContext();
  const { fetchProjects, projects } = useProjectContext();

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  },[]);

  const kpiItems = [
    {
      title: "Progetti Attivi",
      value: projects.filter(p => p.stato !== 'completed').length.toString(),
      icon: Folder,
      subtext: "progetti non completati",
      iconClass: "bg-green-100 text-green-600",

    },
    {
      title: "Sessioni in Corso",
      value: "0",
      icon: PlayCircle,
      subtext: "sessioni attive adesso",
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Sessioni finite",
      value: "0",
      icon: CheckCircle,
      subtext: "sessioni concluse oggi",
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Utenti Totali",
      value: users.length.toString(),
      icon: Users,
      subtext: "utenti registrati nel sistema",
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  const quickActions = [
    {
      title: "Visualizza  progetti",
      description: "Esplora e gestisci tutti i progetti attivi",
      icon: Folder,
      iconClass: "bg-green-100 text-green-600",
      path: "/admin/projects"

    },
    {
      title: "Gestisci utenti",
      description: "Assegna ruoli e permessi agli amministratori",
      icon: Users,
      iconClass: "bg-emerald-100 text-emerald-600",
      path: "/admin/users"
    },
    {
      title: "Controlla attività",
      description: "Monitora le attività recenti",
      icon: ShieldAlert,
      iconClass: "bg-amber-100 text-amber-600",
      path: "/admin/audit-log"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/*  */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((kpi, idx) => (
          <KpiCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={kpi.icon}
            iconClass={kpi.iconClass}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 bg-white shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="h-4 w-4 text-slate-400" />
              Attività Recente: Audit LOG
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-10">
            <p className="text-xs italic text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              Nessun log o attività registrata nello storico
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="h-4 w-4 text-slate-400" />
              Azioni rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  className="cursor-pointer group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  onClick={() => navigate(action.path)}

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

                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-900 " />
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
