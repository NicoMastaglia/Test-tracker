import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { useUserContext } from "@/context/User/UserContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import WelcomeCard from "./WelcomeCard";
import { useAuditContext } from "@/context/Audit/AuditContext";
import StandardTable from "@/utils/components/StandardTable";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import UserAvatar from "@/utils/components/UserAvatar";
import { getRelativeTime, getFullName, getSessionStatusBadgeClass, getClickableRowProps } from "@/utils/helpers/tableHelpers";
import AuditLogTable from "@/Components/features/audit/AuditLogTable";

const SuperAdminDashboard = ({ navigate }) => {
  const { fetchUsers, users } = useUserContext();
  const { fetchProjects, projects } = useProjectContext();
  const { sessions, fetchSessions } = useSessionContext();
  const { user } = useAuthContext();
  const [audit, setAudit] = useState([]);
  const { fetchGlobalAudit } = useAuditContext();

  useEffect(() => {
    // anteprima in dashboard: solo le ultime 3, l'elenco completo sta in /admin/audit-log
    // si può modificare 
    fetchGlobalAudit(3).then((auditData) => {
      setAudit(auditData?.activities ?? []);
    }).catch(() => setAudit([]));

    fetchUsers();
    fetchProjects();
    fetchSessions();
  }, []);

  const projectList = projects || [];
  const sessionList = sessions || [];
  const audit_logs = audit || [];

  const activeProjects = projectList.filter((p) => p.status === "Attivo").length;
  const sessionsInProgress = sessionList.filter((s) => s.status === "In corso").length;
  const sessionsDone = sessionList.filter((s) => s.status === "Completata").length;

  const kpiItems = [
    {
      label: "Progetti Attivi",
      value: activeProjects.toString(),
      icon: Folder,
      color: "green",
    },
    {
      label: "Sessioni in Corso",
      value: sessionsInProgress.toString(),
      icon: PlayCircle,
      color: "blue",
    },
    {
      label: "Sessioni finite",
      value: sessionsDone.toString(),
      icon: CheckCircle,
      color: "blue",
    },
    {
      label: "Utenti Totali",
      value: users.length.toString(),
      icon: Users,
      // viola: distinto da "Progetti Attivi" (verde) e non l'arancione già usato per le task
      color: "violet",
    },
  ];

  const quickActions = [
    {
      title: "Gestisci progetti",
      description: "Crea, modifica e assegna progetti",
      icon: Folder,
      iconClass: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      path: "/admin/projects",
    },
    {
      title: "Gestisci utenti",
      description: "Crea, modifica e rimuovi utenti",
      icon: Users,
      iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
      path: "/admin/users",
    },
  ];

  // prime 10 sessioni per l'anteprima in dashboard (tutte le sessioni visibili al superadmin)
  const previewSessions = sessionList.slice(0, 10);

  const sessionPreviewHeaders = [
    { key: "project", label: "Progetto", className: "text-left font-semibold text-foreground px-4 py-3" },
    { key: "tester", label: "Tester", className: "text-left font-semibold text-foreground px-4 py-3" },
    { key: "started", label: "Avvio", className: "text-left font-semibold text-foreground px-4 py-3" },
    { key: "status", label: "Stato", className: "text-left font-semibold text-foreground px-4 py-3" },
  ];

  return (
    <div className="p-6 space-y-6">
      <WelcomeCard
        user={user}
        subtitle="Gestisci progetti, utenti e sessioni di test da un'unica dashboard."
      />

      {/* KPI row */}
      <StatsCardsRow stats={kpiItems} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" />

      {/* Azioni rapide, sopra le tabelle: priorità più alta dell'audit/sessioni */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Azioni rapide</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                className="cursor-pointer group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                onClick={() => navigate(action.path)}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${action.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{action.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Audit (sinistra) + Sessioni anteprima (destra) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4 border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              Attività Recente: Audit Log
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/admin/audit-log")}>
              Vedi tutto
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 py-1">
            <AuditLogTable activities={audit_logs} currentUserId={user?.id} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
              Sessioni
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/admin/sessions")}>
              Vedi tutto
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="py-1">
            <StandardTable
              containerClass=""
              headers={sessionPreviewHeaders}
              data={previewSessions}
              emptyMessage="Nessuna sessione disponibile."
              emptyIcon={PlayCircle}
              renderRow={(session) => {
                const testerName = getFullName({ nome: session.tester_nome, cognome: session.tester_cognome });
                return (
                  <TableRow
                    key={session.id}
                    className="cursor-pointer hover:bg-muted/60"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                    {...getClickableRowProps(() => navigate(`/sessions/${session.id}`))}
                  >
                    <TableCell className="px-4 py-2.5 font-medium text-foreground capitalize">
                      {session.project_name ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-foreground/80">
                      {testerName}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-muted-foreground text-xs">
                      {getRelativeTime(session.started_at)}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <Badge className={`border-none px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getSessionStatusBadgeClass(session.status)}`}>
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {session.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
