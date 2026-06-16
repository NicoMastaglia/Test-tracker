import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, PlayCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import WelcomeCard from "./WelcomeCard";


const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { projects, fetchProjects } = useProjectContext();
    const { sessions, fetchSessions } = useSessionContext();

    useEffect(() => {
      // per l'admin: GET /projects ritorna i progetti che ha creato,
      // GET /test-sessions le sessioni di quei progetti.
      fetchProjects();
      fetchSessions();
    }, []);

    const projectList = projects || [];
    const sessionList = sessions || [];

    const activeProjects = projectList.filter((p) => p.status === "Attivo").length;
    const sessionsInProgress = sessionList.filter((s) => s.status === "In corso").length;

    const statCards = [
      {
        title: "Progetti Attivi",
        value: String(activeProjects),
        icon: Folder,
        iconClass: "bg-green-100 text-green-600",
      },
      {
        title: "Sessioni in Corso",
        value: String(sessionsInProgress),
        icon: PlayCircle,
        iconClass: "bg-emerald-100 text-emerald-600",
      },
      {
        title: "Sessioni Totali",
        value: String(sessionList.length),
        icon: CheckCircle,
        iconClass: "bg-amber-100 text-amber-600",
      },
    ];

    const quickActions = [
      {
        title: "Gestisci Progetti",
        description: "Visualizza e gestisci i tuoi progetti e i relativi tester",
        icon: Folder,
        iconClass: "bg-green-100 text-green-600",
        onClick: () => navigate("/admin/projects"),
      },
    ];


    return(
           <div className="p-6 space-y-6">

            <WelcomeCard
              user={user}
              subtitle="Gestisci progetti, checklist e sessioni del team."
            />

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {statCards.map((card) => {
                 const Icon = card.icon;

                 return (
                   <Card key={card.title} className="border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                     <CardContent className="flex items-start gap-4 pt-2">
                       <div className={`flex h-14 w-14 shrink-0 items-start justify-center rounded-2xl pt-3 ${card.iconClass}`}>
                         <Icon className="h-6 w-6" />
                       </div>

                       <div className="min-w-0 flex flex-col items-start text-left gap-3">
                         <p className="mt-1 text-sm text-slate-500">{card.title}</p>
                         <p className="text-[30px] leading-none text-slate-900">{card.value}</p>
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
             </div>

             {/* Azioni rapide */}
             <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-6">
                 <Card className="col-span-full border-slate-200 bg-white shadow-sm">
                   <CardHeader className="pb-4">
                     <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Zap className="h-4 w-4 text-slate-400" />
                       Azioni rapide
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="grid gap-4 md:grid-cols-3">
                     {quickActions.map((action) => {
                       const Icon = action.icon;

                       return (
                         <button
                           key={action.title}
                           type="button"
                           onClick={action.onClick}
                           className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
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

                           <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-900" />
                         </button>
                       );
                     })}
                   </CardContent>
                </Card>
             </div>
           </div>

    )
}

export default AdminDashboard;
