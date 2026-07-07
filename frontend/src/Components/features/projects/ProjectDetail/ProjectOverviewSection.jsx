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
import { getStatColorClasses } from "@/utils/components/StatsCardsRow";

// COMPONENTE PER LA SEZIONE OVERVIEW DEL PROGETTO, MOSTRA INFORMAZIONI PRINCIPALI SUL PROGETTO

// Contenitore card standard usato in tutta la sezione overview
const SectionCard = ({ title, className = "", children }) => (
  <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}>
    <h3 className="mb-3 text-base font-semibold text-foreground">{title}</h3>
    {children}
  </div>
);

// Riga label/valore usata nelle card "Informazioni generali" e "Timeline"
const InfoRow = ({ label, icon, children }) => {
  const Icon = icon;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </span>
      <span className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {children}
      </span>
    </div>
  );
};

// Box statistica usata nella card "Riepilogo progetto"
// `color` risolto tramite la stessa mappa di StatsCardsRow: un solo posto da
// aggiornare per le classi light+dark di ogni colore semantico.
const StatBox = ({ label, value, icon, color }) => {
  const Icon = icon;
  const { bg, icon: iconColorClass } = getStatColorClasses(color);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl leading-tight font-bold text-foreground">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
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
          
          <span className={`font-bold ${projectInfoItems.isDeadlineOverdue ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
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
          <span className="text-muted-foreground">--</span>
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
        color="indigo"
      />
      <StatBox
        label="Task totali"
        value={stats?.totalTasks ?? 0}
        icon={ListChecks}
        color="blue"
      />
      <StatBox
        label="Task completate"
        value={stats?.completedTasks ?? 0}
        icon={CheckCircle2}
        color="emerald"
      />
      <StatBox
        label="Sessioni totali"
        value={stats?.totalSessions ?? 0}
        icon={PlayCircle}
        color="blue"
      />
      {/* "Tester assegnati" solo se il BE fornisce la lista (admin/superadmin); il tester non la riceve */}
      {Array.isArray(testers) && (
        <StatBox
          label="Tester assegnati"
          value={testers.length}
          icon={Users}
          color="violet"
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
          color="amber"
        />
        <StatBox
          label="Task completate"
          value={completedTasks}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatBox
          label="Le mie sessioni"
          value={mySessions.length}
          icon={PlayCircle}
          color="blue"
        />
        <StatBox
          label="Sessioni in corso"
          value={sessionsInProgress}
          icon={PlayCircle}
          color="indigo"
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
