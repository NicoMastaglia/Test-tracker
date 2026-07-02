import {
  CalendarDays,
  PlayCircle,
  Calendar,
  Clock,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  Users,
} from "lucide-react";
import { NOT_AVAILABLE, NotAvailable } from "@/utils/components/Placeholder";
import {formatProjectDateTime} from "@/utils/helpers/tableHelpers";

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
          <span className="text-slate-400">--</span>
        ) : (
          <span className="font-bold">
            {formatProjectDateTime(projectInfoItems?.completed_at)}
          </span>
        )}
      </InfoRow>
    </div>
  </SectionCard>
);

// Card "Riepilogo progetto" per admin/superadmin: usa le statistiche aggregate
// dal BE (GET /api/projects/:id/stats) invece di ricalcolarle lato client
const SummaryCard = ({ checklistCount, stats, testers }) => (
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
        value={stats?.totalTasks ?? 0}
        icon={ListChecks}
        iconColor="text-blue-600"
        bgIcon="bg-blue-100"
      />
      <StatBox
        label="Task completate"
        value={stats?.completedTasks ?? 0}
        icon={CheckCircle2}
        iconColor="text-emerald-600"
        bgIcon="bg-emerald-100"
      />
      <StatBox
        label="Sessioni totali"
        value={stats?.totalSessions ?? 0}
        icon={PlayCircle}
        iconColor="text-blue-600"
        bgIcon="bg-blue-100"
      />
      {/* "Tester assegnati" solo se il BE fornisce la lista (admin/superadmin); il tester non la riceve */}
      {Array.isArray(testers) && (
        <StatBox
          label="Tester assegnati"
          value={testers.length}
          icon={Users}
          iconColor="text-violet-600"
          bgIcon="bg-violet-100"
        />
      )}
    </div>
  </SectionCard>
);

// Card "I miei dati" per il tester: solo le sue task e le sue sessioni in questo
// progetto, mai dati aggregati sull'intero team (il tester non deve vederli)
const MySummaryCard = ({ myTasks, mySessions }) => {
  const completedTasks = myTasks.filter((t) => t.status === "Completata").length;
  const sessionsInProgress = mySessions.filter((s) => s.status === "In corso").length;

  return (
    <SectionCard title="I miei dati su questo progetto">
      <div className="grid grid-cols-2 gap-3">
        <StatBox
          label="Le mie task"
          value={myTasks.length}
          icon={ListChecks}
          iconColor="text-amber-600"
          bgIcon="bg-amber-100"
        />
        <StatBox
          label="Task completate"
          value={completedTasks}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          bgIcon="bg-emerald-100"
        />
        <StatBox
          label="Le mie sessioni"
          value={mySessions.length}
          icon={PlayCircle}
          iconColor="text-blue-600"
          bgIcon="bg-blue-100"
        />
        <StatBox
          label="Sessioni in corso"
          value={sessionsInProgress}
          icon={PlayCircle}
          iconColor="text-indigo-600"
          bgIcon="bg-indigo-100"
        />
      </div>
    </SectionCard>
  );
};

const ProjectOverviewSection = ({
  projectInfoItems,
  selectedProject,
  checklistItems = [],
  isAdmin = true,
  stats = null,
  sessions = [],
  currentUserId = null,
}) => {
  const testers = selectedProject?.user_list;

  // checklist (il BE le manda già raggruppate)
  const checklistCount = checklistItems.length;

  // dati personali del tester: solo le sue task, ricavate filtrando gli item per assigned_to
  // (GET /api/checklists/:projectId per il tester include comunque tutte le task del
  // progetto, non solo le sue, perché il filtro lì è "sei assegnato al progetto", non alla task)
  const myTasks = checklistItems
    .flatMap((cl) => cl.items || [])
    .filter((item) => item.assigned_to === currentUserId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TimelineCard projectInfoItems={projectInfoItems} />
        {isAdmin ? (
          <SummaryCard checklistCount={checklistCount} stats={stats} testers={testers} />
        ) : (
          <MySummaryCard myTasks={myTasks} mySessions={sessions} />
        )}
      </div>
    </div>
  );
};

export default ProjectOverviewSection;
