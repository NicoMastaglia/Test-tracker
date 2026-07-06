import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, PlayCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
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
        label: "Progetti Attivi",
        value: String(activeProjects),
        icon: Folder,
        iconColor: "text-green-600",
        bgIcon: "bg-green-100",
      },
      {
        label: "Sessioni in Corso",
        value: String(sessionsInProgress),
        icon: PlayCircle,
        iconColor: "text-blue-600",
        bgIcon: "bg-blue-100",
      },
      {
        label: "Sessioni Totali",
        value: String(sessionList.length),
        icon: CheckCircle,
        iconColor: "text-blue-600",
        bgIcon: "bg-blue-100",
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
      {
        title: "Sessioni",
        description: "Consulta le sessioni di test dei tuoi progetti",
        icon: PlayCircle,
        iconClass: "bg-blue-100 text-blue-600",
        onClick: () => navigate("/admin/sessions"),
      },
    ];


    return(
           <div className="p-6 space-y-6">

            <WelcomeCard
              user={user}
              subtitle="Gestisci progetti, checklist e sessioni del team."
            />

             <StatsCardsRow stats={statCards} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" />

             {/* Azioni rapide */}
             <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-6">
                 <Card className="col-span-full border-border bg-card shadow-sm">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-foreground">
                       <Zap className="h-4 w-4 text-muted-foreground" />
                       Azioni rapide
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="grid gap-4 md:grid-cols-2">
                     {quickActions.map((action) => {
                       const Icon = action.icon;

                       return (
                         <button
                           key={action.title}
                           type="button"
                           onClick={action.onClick}
                           className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
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

                           <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
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
