import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/User/UserContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
const KpiCard = ({ title, value, subtext, icon: Icon, subtextColor = "text-slate-400" }) => {
  return (
    <Card className="border-slate-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <p className={`text-xs font-medium mt-1 ${subtextColor}`}>{subtext}</p>
      </CardContent>
    </Card>
  );
};

const SuperAdminDashboard = () => {
  const {fetchUsers,users} = useUserContext();
  const {fetchProjects,projects} = useProjectContext();

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  },[]);

  const kpiItems = [
    {
      title: "Progetti Attivi",
      value: projects.filter(p => p.stato !=='completed').length.toString(),
      icon: Folder,
      subtextColor: "text-slate-400",
    },
    {
      title: "Sessioni in Corso",
      value: "0",
      icon: PlayCircle,
      subtextColor: "text-amber-500", 
    },
    {
      title: "Sessioni finite",
      value: "0",
      icon: CheckCircle,
      subtextColor: "text-emerald-500",
    },
    {
      title: "Utenti Totali",
      value:  users.length.toString(),
      icon: Users,
      subtextColor: "text-slate-400",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((kpi, idx) => (
          <KpiCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={kpi.icon}
            subtextColor={kpi.subtextColor}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-100 shadow-sm bg-white flex flex-col">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Attività Recente: Audit LOG
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400 italic bg-slate-50 px-4 py-2 rounded-full border border-slate-100/60">
              Nessun log o attività registrata nello storico
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-100 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Accessi Rapidi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4">
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 rounded-lg transition-colors"
            >
              Visualizza report
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 rounded-lg transition-colors"
            >
              Gestisci ruoli admin
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 rounded-lg transition-colors"
            >
              Visualizza audit sicurezza
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
