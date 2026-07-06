import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import Loader from "@/utils/components/Loader";
import UserAvatar from "@/utils/components/UserAvatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { TableCell, TableRow } from "@/Components/ui/table";
import StandardTable from "@/utils/components/StandardTable";
import { useUserContext } from "@/context/User/UserContext";
import {
  getFullName,
  getRoleInfo,
  getProjectStatusBadgeClass,
  getSessionStatusBadgeClass,
  formatProjectDateTime,
} from "@/utils/helpers/tableHelpers";
import { ArrowLeft, Folder, PlayCircle, ShieldQuestion } from "lucide-react";

const projectHeaders = [
  { label: "Progetto", key: "name" },
  { label: "Ruolo", key: "relation" },
  { label: "Stato", key: "status" },
];

const sessionHeaders = [
  { label: "Progetto", key: "project_name" },
  { label: "Inizio", key: "started_at" },
  { label: "Fine", key: "completed_at" },
  { label: "Stato", key: "status" },
];

// pagina di dettaglio utente: progetti collegati (come tester o responsabile)
// e storico sessioni di test, per dare contesto completo su un utente
const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserRelations } = useUserContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUserRelations(id).then((res) => {
      if (!cancelled) setData(res);
    }).catch(() => {
      if (!cancelled) setData(null);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = data === null;

  const user = data?.user;
  const roleInfo = user ? getRoleInfo(user.role) : null;

  return (
    <AppLayout page="users" hideHeader>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/users")}
          className="inline-flex w-fit items-center gap-2 border-none bg-transparent py-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Torna agli utenti</span>
        </Button>

        {loading ? (
          <Loader label="Caricamento utente..." />
        ) : !user ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            Utente non trovato.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <UserAvatar user={user} size="lg" />
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-foreground">{getFullName(user)}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
              {roleInfo && (
                <Badge className={`ml-auto border-none px-3 py-1 text-xs font-medium ${roleInfo.className}`}>
                  {roleInfo.label}
                </Badge>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Progetti ({data.projects.length})
                </h3>
              </div>
              <StandardTable
                headers={projectHeaders}
                data={data.projects}
                emptyMessage="Nessun progetto associato a questo utente."
                emptyIcon={Folder}
                containerClass=""
                renderRow={(p) => (
                  <TableRow key={p.id} className="hover:bg-muted/60">
                    <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.relation}</TableCell>
                    <TableCell>
                      <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium ${getProjectStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )}
              />
            </div>

            {/* admin/superadmin non eseguono sessioni di test: sezione sessioni solo per tester */}
            {data.user.role === "user" && (
              <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Sessioni ({data.sessions.length})
                  </h3>
                </div>
                <StandardTable
                  headers={sessionHeaders}
                  data={data.sessions}
                  emptyMessage="Nessuna sessione svolta da questo utente."
                  emptyIcon={ShieldQuestion}
                  containerClass=""
                  renderRow={(s) => (
                    <TableRow key={s.id} className="hover:bg-muted/60">
                      <TableCell className="font-medium text-foreground">{s.project_name}</TableCell>
                      <TableCell className="text-muted-foreground">{formatProjectDateTime(s.started_at)}</TableCell>
                      <TableCell className={s.completed_at ? (s.status === "Completata" ? "text-emerald-700 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400") : "text-muted-foreground"}>
                        {s.completed_at ? formatProjectDateTime(s.completed_at) : "Sessione ancora aperta"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-none px-2.5 py-0.5 text-xs font-medium ${getSessionStatusBadgeClass(s.status)}`}>
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default UserDetail;
