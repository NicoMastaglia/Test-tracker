import {
  CalendarDays,
  PlayCircle,
  Calendar,
  Clock,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  Users,
  Activity,
  PieChart,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getProjectStatusBadgeClass } from "@/utils/helpers/tableHelpers";
import { NOT_AVAILABLE, NotAvailable } from "@/utils/components/Placeholder";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/Components/ui/tooltip";
import {formatProjectDateTime,formatProjectDate} from "@/utils/helpers/tableHelpers";

// COMPONENTE PER LA SEZIONE OVERVIEW DEL PROGETTO, MOSTRA INFORMAZIONI PRINCIPALI SUL PROGETTO

// Contenitore card standard usato in tutta la sezione overview
const SectionCard = ({ title, className = "", children }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
    {children}
  </div>
);

// Riga label/valore usata nelle card "Informazioni generali" e "Timeline"
const InfoRow = ({ label, icon, children }) => {
  const Icon = icon;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {label}
      </span>
      <span className="max-w-[60%] text-right text-sm font-medium text-slate-700">
        {children}
      </span>
    </div>
  );
};

// Box statistica usata nella card "Riepilogo progetto"
const StatBox = ({ label, value, icon, iconColor, bgIcon }) => {
  const Icon = icon;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bgIcon}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl leading-tight font-bold text-slate-900">{value}</p>
        <p className="truncate text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
};

// Card placeholder per le sezioni non ancora collegate al backend (audit log e progresso task)
const PlaceholderCard = ({ title, icon, message, className = "" }) => {
  const Icon = icon;

  return (
    <SectionCard title={title} className={className}>
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
        <Icon className="h-6 w-6 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
        <p className="text-xs text-slate-400">{NOT_AVAILABLE}</p>
      </div>
    </SectionCard>
  );
};

// Card "Informazioni generali": dati anagrafici e di stato del progetto
const GeneralInfoCard = ({ selectedProject, creator,responsabile }) => (
  <SectionCard title="Informazioni generali">
    <div>
      <InfoRow label="Descrizione">
        {selectedProject?.description || <NotAvailable />}
      </InfoRow>
      <InfoRow label="Creato da">
        {creator ?  (
          <Tooltip>
            <TooltipTrigger>
             
                <UserAvatar user={creator} size="sm" />
               
            </TooltipTrigger>
            <TooltipContent>
              <p>{getFullName(creator)}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <NotAvailable />
        )}
      </InfoRow>
      <InfoRow label="Responsabile">
        {responsabile ? (
          <Tooltip>
            <TooltipTrigger>
        
                <UserAvatar user={responsabile} size="sm" />
                
      
            </TooltipTrigger>
            <TooltipContent>
              <p>{getFullName(responsabile)}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <NotAvailable />
        )}
      </InfoRow>
      <InfoRow label="Stato">
        <Badge className={`gap-1.5 ${getProjectStatusBadgeClass(selectedProject?.status)}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {selectedProject?.status ?? NOT_AVAILABLE}
        </Badge>
      </InfoRow>
    </div>
  </SectionCard>
);

// Card "Timeline": date principali del ciclo di vita del progetto
const TimelineCard = ({ projectInfoItems }) => (
  <SectionCard title="Timeline">
    <div>
      <InfoRow label="Creato il" icon={CalendarDays}>

        {projectInfoItems?.created_at === NOT_AVAILABLE ? (
          <NotAvailable />
        ) : (
          <span className="font-bold">
          {formatProjectDateTime(projectInfoItems.created_at)}
          </span>
        )}
      </InfoRow>
      <InfoRow label="Iniziato il" icon={PlayCircle}>
        {projectInfoItems?.started_at === NOT_AVAILABLE ? (
          <NotAvailable />
        ) : (
          <span className="font-bold">
            {formatProjectDateTime(projectInfoItems.started_at)}
          </span>
        )}
      </InfoRow>
      <InfoRow label="Deadline" icon={Calendar}>
        {projectInfoItems?.deadline === NOT_AVAILABLE ? (
          <NotAvailable />
        ) : (


          // Se la deadline è scaduta, mostro il testo in rosso
          // volendo potrei gestire una classica unica anziché una combinazione di classi per la deadline, 
        
          <span className={`font-bold ${projectInfoItems.isDeadlineOverdue ? "text-red-600" : "text-slate-700"}`}>
            {(projectInfoItems?.deadline) } 
            <span className={`ml-2 text-xs font-medium ${projectInfoItems.colorforDeadline}`}>
            {projectInfoItems.daysToDeadline}
            </span>

          </span>
        )}
      </InfoRow>
      <InfoRow label="Ultimo aggiornamento" icon={Clock}>
        {projectInfoItems?.updated_at === NOT_AVAILABLE ? (
          <NotAvailable />
        ) : (
        
          <span className="font-bold">
            {formatProjectDateTime(projectInfoItems?.updated_at)}
          </span>
        )}
      </InfoRow>
      <InfoRow label="Completato il" icon={CheckCircle2}>
        {projectInfoItems?.completed_at === NOT_AVAILABLE ? (
          <NotAvailable />
        ) : (
          <span className="font-bold">
            {formatProjectDateTime(projectInfoItems?.completed_at)}
          </span>
        )}
      </InfoRow>
    </div>
  </SectionCard>
);

// Card "Riepilogo progetto": conteggi su checklist, task, sessioni e team
const SummaryCard = ({ checklistCount, totalTasks, testers }) => (
  <SectionCard title="Riepilogo progetto">
    <div className="grid grid-cols-2 gap-3">
      <StatBox
        label="Checklist"
        value={checklistCount}
        icon={ClipboardList}
        iconColor="text-indigo-600"
        bgIcon="bg-indigo-100"
      />
      <StatBox
        label="Task totali"
        value={totalTasks}
        icon={ListChecks}
        iconColor="text-blue-600"
        bgIcon="bg-blue-100"
      />
      <StatBox
        label="Task completati"
        value={<NotAvailable />}
        icon={CheckCircle2}
        iconColor="text-emerald-600"
        bgIcon="bg-emerald-100"
      />
      <StatBox
        label="Sessioni"
        value={<NotAvailable />}
        icon={PlayCircle}
        iconColor="text-amber-600"
        bgIcon="bg-amber-100"
      />
      <StatBox
        label="Tester assegnati"
        value={Array.isArray(testers) ? testers.length : <NotAvailable />}
        icon={Users}
        iconColor="text-violet-600"
        bgIcon="bg-violet-100"
      />
    </div>
  </SectionCard>
);

const ProjectOverviewSection = ({ projectInfoItems, selectedProject, checklistItems = [] }) => {
  const creator = selectedProject?.created_by;
  const testers = selectedProject?.user_list;
  const responsabile = selectedProject?.manager;

 

  // checklist (il BE le manda già raggruppate) e task totali (somma degli items)
  const checklistCount = checklistItems.length;
  const totalTasks = checklistItems.reduce((sum, cl) => sum + (cl.items?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GeneralInfoCard selectedProject={selectedProject} creator={creator} responsabile={responsabile} />
        <TimelineCard projectInfoItems={projectInfoItems} />
        <SummaryCard checklistCount={checklistCount} totalTasks={totalTasks} testers={testers} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlaceholderCard
          title="Attività recenti"
          icon={Activity}
          message="Il log delle attività recenti non è ancora collegato."
        />
        <PlaceholderCard
          title="Progresso attività"
          icon={PieChart}
          message="I dati sull'avanzamento dei task non sono ancora disponibili."
        />
      </div>
    </div>
  );
};

export default ProjectOverviewSection;
