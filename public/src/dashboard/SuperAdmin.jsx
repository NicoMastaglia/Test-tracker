import React, { useEffect,useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle, ArrowUpRight, ArrowRight, ShieldAlert } from "lucide-react";
import { useUserContext } from "@/context/User/UserContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import {useAuthContext}  from "@/context/Auth/AuthContext";
import {KpiCard} from "@/utils/components/KpiCard";
import WelcomeCard from "./WelcomeCard";
import { useAuditContext } from "@/context/Audit/AuditContext";
import  {auditActions,detailFieldMap} from "@/utils/helpers/auditActions";
import StandardTable from "@/utils/components/StandardTable";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import UserAvatar from "@/utils/components/UserAvatar";
import { ROUND_COLOR_CLASSES } from "@/utils/helpers/tableHelpers";

import { getFullName } from "@/utils/helpers/tableHelpers";
import {Info,Mail} from "lucide-react";

const SuperAdminDashboard = ({navigate}) => {
  const { fetchUsers, users } = useUserContext();
  const { fetchProjects, projects } = useProjectContext();
  const { sessions, fetchSessions } = useSessionContext();
  const { user } = useAuthContext();
  const [audit, setAudit] = useState([]);
const { fetchGlobalAudit } = useAuditContext();

useEffect(() => {
  fetchGlobalAudit(5).then((auditData) => {
    console.log("Dati ricevuti da Swagger:", auditData);
    
    // Accedi direttamente alla proprietà .activities del JSON di Swagger
    if (auditData) {
      setAudit(auditData.activities); // <--- Questo salverà l'array vero e proprio
    } else {
      setAudit([]); // Fallback di sicurezza se la risposta è vuota o malformata
    }
  });

  fetchUsers();
  fetchProjects();
  fetchSessions();
}, []);
  

  const projectList = projects || [];
  const sessionList = sessions || [];
  const audit_logs  = audit || [];
  
  
  const activeProjects = projectList.filter((p) => p.status === "Attivo").length;
  const sessionsInProgress = sessionList.filter((s) => s.status === "In corso").length;
  const sessionsDone = sessionList.filter((s) => s.status === "Completata").length;

  const headersTable = [
    {  className: "text-center", label: "Data e Ora" },
    { key: "user", className: "text-center", label: "Utente" },
    { key: "action", className: "text-center", label: "Azione" },
    { key: "details", className: "text-center", label: "Dettagli" },
  ];
  

 
  const kpiItems = [
    {
      title: "Progetti Attivi",
      value: activeProjects.toString(),
      icon: Folder,
      subtext: "progetti con stato Attivo",
      iconClass: "bg-green-100 text-green-600",

    },
    {
      title: "Sessioni in Corso",
      value: sessionsInProgress.toString(),
      icon: PlayCircle,
      subtext: "sessioni attive adesso",
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Sessioni finite",
      value: sessionsDone.toString(),
      icon: CheckCircle,
      subtext: "sessioni concluse",
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
      path: "/admin/projects",
      disabled: false,
    },
    {
      title: "Gestisci utenti",
      description: "Assegna ruoli e permessi agli amministratori",
      icon: Users,
      iconClass: "bg-emerald-100 text-emerald-600",
      path: "/admin/users",
      disabled: false,
    },
    {
      // l'audit log non è ancora implementato (rotta /admin/audit-log assente, BE P4)
      title: "Controlla attività",
      description: "Monitora le attività recenti (disponibile a breve)",
      icon: ShieldAlert,
      iconClass: "bg-amber-100 text-amber-600",
      path: null,
      disabled: true,
    },
  ];

  

  return (
    <div className="p-6 space-y-6">
      <WelcomeCard
        user={user}
        subtitle="Gestisci progetti, utenti e sessioni di test da un'unica dashboard."
      />

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
          <CardContent className="flex-1 flex items-start  justify-items-start py-1">
            
          {audit_logs.length > 0 ?

          

          <StandardTable
          containerClass="mx-auto  w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            headers={headersTable}
            data={audit_logs}
            renderRow={(item, idx) =>
              
             
              
              
              {
                 const rawDetails = item.details ? JSON.parse(item.details) : {}
                 // checklistId/templateId sono id grezzi ridondanti: il nome leggibile
                 // arriva già pronto dal BE in item.checklist_name / item.project_name.
                 const details = Object.fromEntries(
                   Object.entries(rawDetails).filter(([key]) => key !== "checklistId" && key !== "templateId"),
                 );
                 const context = [item.project_name, item.checklist_name].filter(Boolean).join(" · ");
                 const Icon = auditActions[item.action]?.icon || ArrowUpRight;
     
                

                


             return (
               <TableRow
                 key={idx}
                 className="group cursor-pointer transition-colors hover:bg-slate-50/60 text-center"
               >
                 <TableCell className="">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-semibold text-slate-900">
                      {new Date(item.timestamp).toLocaleString("it-IT", {
                        dateStyle : 'medium'
                      })}

                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                      
                        
                  </div>
                 </TableCell>
                 <TableCell className="px-4 py-2">
                   <div className="flex items-center gap-3">
                     <UserAvatar
                       user={item}
                       size="sm"
                       colorIndex={item.user_id % ROUND_COLOR_CLASSES.length}
                     />
                     <span>
                       {getFullName(item)}
                       {user.id == item.user_id ? " (tu)" : ""}
                     </span>
                   </div>
                 </TableCell>
                 <TableCell className="px-4 py-2">
                   <div
  className={`inline-flex bw-fit items-center justify-center gap-1.5  px-3 py-1.5 text-xs ${auditActions[item.action]?.color || "bg-slate-100 text-slate-700"}`}
>
  {Icon && <Icon className="h-3.5 w-3.5" />}
  {auditActions[item.action]?.label}
</div>
                 </TableCell>
                 <TableCell className="px-4 py-2  text-s">
                   {context && (
                     <p className="mb-1 text-xs font-medium text-slate-500">{context}</p>
                   )}
                   {


                  Object.entries(details).length >0 ?   Object.entries(details).map(([key, value]) => {
                     const field = detailFieldMap[key] ?? { label: key };
                   
                     
                     return (
                       <div key={key} className={`inline-flex bw-fit items-center justify-center gap-1.5 rounded-lg px-3 py-1.5  ${auditActions[item.action]?.color || "bg-slate-100 text-slate-700"}`}>
                         
                         <span className="font-medium text-slate-600">
                           {field.label}:
                         </span>{"  "}
                         <span className={`${auditActions[item.action]?.bgColor || "bg-slate-100"} rounded-md px-2   font-semibold ${auditActions[item.action]?.color || "text-slate-700"}`}>
                           {String(value)}
                         </span>
                       </div>
                     );
                   }) :
                   (
                    <div className={`inline-flex bw-fit items-center justify-center gap-1.5 rounded-lg px-3 py-1.5  ${auditActions[item.action]?.color || "bg-slate-100 text-slate-700"}`}>
                    <Info className="h-4 w-4" />
                    <span className="font-semibold text-slate-600 text-xs">
                      Nessun dettaglio 
                    </span>
                  </div>
                   )
                  }
                 </TableCell>
               </TableRow>
             ); }}
            emptyMessage="Nessuna attività recente da visualizzare."
          />
          : 
          <p className="text-slate-500">Nessuna attività recente da visualizzare.</p>


                
              }
              
           
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
                  disabled={action.disabled}
                  className="cursor-pointer group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => action.path && navigate(action.path)}

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
