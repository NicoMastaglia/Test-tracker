import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Users, Folder, PlayCircle, CheckCircle, ArrowUpRight, ArrowRight, Zap } from "lucide-react";


const AdminDashboard = () => {
    const statCards = [
      {
        title: "Progetti Attivi",
        value: "3",
        trend: "es +2 mese precedente",
        icon: Folder,
        iconClass: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Sessioni in Corso",
        value: "5",
        trend: "numero user attivi atm",
        icon: PlayCircle,
        iconClass: "bg-blue-100 text-blue-700",
      },
      {
        title: "Checklist aggiornate",
        value: "4",
        trend: "...",
        icon: CheckCircle,
        iconClass: "bg-amber-100 text-amber-700",
      },
      // {
      //   title: "Team Attivo",
      //   value: "4",
      //   trend: "non vede tutti quelli del sistema",
      //   icon: Users,
      //   iconClass: "bg-violet-100 text-violet-700",
      // },
    ];

    const quickActions = [
      {
        title: "Gestisci Progetti",
        description: "Visualizza e gestisci tutti i progetti e i relativi tester",
        icon: Folder,
        iconClass: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Apri Sessioni",
        description: "Gestisci le sessioni di testing in corso",
        icon: PlayCircle,
        iconClass: "bg-blue-100 text-blue-700",
      },
      {
        title: "Apri Checklist Progetto",
        description: "Accedi alle checklist dei progetti e gestisci le task",
        icon: CheckCircle,
        iconClass: "bg-amber-100 text-amber-700",
      },
    ];


    return(
           <div className="p-6 space-y-6">
           
          
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {statCards.map((card) => {
                 const Icon = card.icon;

                 return (
                   <Card key={card.title} className="border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                     <CardContent className="flex items-start gap-4 pt-2">
                       <div className={`flex h-14 w-14 shrink-0 items-start justify-center rounded-2xl pt-3 ${card.iconClass}`}>
                         <Icon className="h-6 w-6" />
                       </div>

                       <div className="min-w-0 flex flex-col items-start text-left gap-3">
                       
                         <p className="mt-1 text-sm text-slate-500">{card.title}</p>
                           <p className="text-[30px] leading-none text-slate-900">{card.value}</p>
                         <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                           <ArrowUpRight className="h-3.5 w-3.5" />
                           {card.trend}
                         </p>
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
             </div>
       
             {/* Sezione Attività Recente o Progetti Prioritari */}
             <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-6">
                
                
                 <Card className="col-span-full border-slate-200/80 bg-white shadow-sm">
                   <CardHeader className="pb-4">
                     <CardTitle className="flex items-center gap-2 text-slate-800">
                       <Zap className="h-4 w-4 text-slate-700" />
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
                           className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
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

                           <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700" />
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


