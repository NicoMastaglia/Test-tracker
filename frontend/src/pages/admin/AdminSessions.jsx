import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { PlayCircle, FileSpreadsheet, FileText } from "lucide-react";
import StandardTable from "@/utils/components/StandardTable";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import ActionBar from "@/utils/components/ActionBar";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import AdminSessionRow from "./AdminSessionRow";
import Loader from "@/utils/components/Loader";
import { getFullName } from "@/utils/helpers/tableHelpers";
import { exportSessionsToExcel, exportSessionsToPdf } from "@/utils/helpers/exportSessionsList";

const headers = [
  { label: "#", key: "id" },
  { label: "Progetto", key: "project_name" },
  { label: "Tester", key: "tester" },
  { label: "Inizio", key: "started_at" },
  { label: "Fine", key: "completed_at" },
  { label: "Stato", key: "status" },
];

// elenco di sola consultazione di tutte le sessioni di test (superadmin: tutte;
// admin: solo quelle dei progetti che gestisce/ha creato, già filtrate dal BE)
const AdminSessions = () => {
  const { sessions, fetchSessions, loading } = useSessionContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterTester, setFilterTester] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((s) => (s.project_name ?? "").toLowerCase().includes(query));
    }

    if (filterTester.trim()) {
      const query = filterTester.toLowerCase();
      result = result.filter((s) =>
        getFullName({ nome: s.tester_nome, cognome: s.tester_cognome }).toLowerCase().includes(query)
      );
    }

    if (filterDateFrom) {
      result = result.filter((s) => s.started_at && s.started_at.slice(0, 10) >= filterDateFrom);
    }

    if (filterStatus === "blocked") {
      return result.filter((s) => s.has_blocked_task);
    }
    return filterStatus === "all" ? result : result.filter((s) => s.status === filterStatus);
  }, [sessions, search, filterTester, filterDateFrom, filterStatus]);

  const hasActiveFilters = Boolean(search.trim() || filterTester.trim() || filterDateFrom || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterTester("");
    setFilterDateFrom("");
    setFilterStatus("all");
  };

  // "blocked" è un filtro sintetico (deriva da has_blocked_task, non da un vero status)
  const sessionFilters = useMemo(
    () => [
      { value: "In corso", label: "In corso", count: sessions.filter((s) => s.status === "In corso").length },
      { value: "Completata", label: "Completate", count: sessions.filter((s) => s.status === "Completata").length },
      { value: "blocked", label: "Bloccate", count: sessions.filter((s) => s.has_blocked_task).length },
    ],
    [sessions],
  );

  return (
    <AppLayout page="admin-sessions" title="Sessioni">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ActionBar search={search} setSearch={setSearch} placeholder="Cerca per progetto..." onReset={resetFilters} hasActiveFilters={hasActiveFilters}>
            <StatusFilterPills
              filters={sessionFilters}
              active={filterStatus}
              onChange={setFilterStatus}
              totalCount={sessions.length}
            />
            <Input
              placeholder="Cerca per tester..."
              value={filterTester}
              onChange={(e) => setFilterTester(e.target.value)}
              className="h-10 w-full sm:w-48 border-border focus-visible:ring-emerald-500"
            />
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="h-10 w-full sm:w-40 border-border focus-visible:ring-emerald-500"
              title="Data inizio (da)"
            />

            {isSuperAdmin && filteredSessions.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => exportSessionsToExcel(filteredSessions)}
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => exportSessionsToPdf(filteredSessions)}
                >
                  <FileText className="h-4 w-4 text-red-500" />
                  PDF
                </Button>
              </div>
            )}
          </ActionBar>

          {loading && sessions.length === 0 ? (
            <Loader label="Caricamento sessioni..." />
          ) : (
            <StandardTable
              headers={headers}
              data={filteredSessions}
              emptyMessage="Nessuna sessione trovata."
              emptyIcon={PlayCircle}
              renderRow={(s, index) => (
                <AdminSessionRow
                  session={s}
                  index={index + 1}
                  onView={(id) => navigate(`/sessions/${id}`)}
                />
              )}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminSessions;
