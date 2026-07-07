import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AppLayout from "@/Components/layout/AppLayout";
import { Input } from "@/Components/ui/input";
import AuditLogTable from "@/Components/features/audit/AuditLogTable";
import { useAuditContext } from "@/context/Audit/AuditContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { getFullName } from "@/utils/helpers/tableHelpers";
import { AUDIT_DATE_PRESETS, dateFromDaysAgo } from "@/utils/helpers/auditDatePresets";
import { auditActions } from "@/utils/helpers/auditActions";

const AUDIT_FETCH_LIMIT = 500;

const AuditLog = () => {
  const { fetchGlobalAudit } = useAuditContext();
  const { user } = useAuthContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [presetIdx, setPresetIdx] = useState(0); // default: "Oggi"

  const dateFrom = useMemo(() => {
    const days = AUDIT_DATE_PRESETS[presetIdx].days;
    return days !== null ? dateFromDaysAgo(days) : undefined;
  }, [presetIdx]);

  useEffect(() => {
    setLoading(true);
    setSearch("");
  
    fetchGlobalAudit(AUDIT_FETCH_LIMIT, dateFrom)
      .then((data) => setActivities(data?.activities ?? []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [dateFrom]);

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities;
    const query = search.toLowerCase();
    return activities.filter(
      (item) =>
        getFullName(item).toLowerCase().includes(query) ||
        (item.project_name ?? "").toLowerCase().includes(query) ||
        (auditActions[item.action]?.label ?? item.action ?? "").toLowerCase().includes(query),
    );
  }, [activities, search]);

  const isTruncated = activities.length >= AUDIT_FETCH_LIMIT;

  return (
    <AppLayout page="audit-log" title="Audit Log">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cerca per utente, progetto o azione..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 border-border focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {AUDIT_DATE_PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPresetIdx(i)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors
                    ${presetIdx === i
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`h-0.5 transition-opacity duration-700 ${loading ? "opacity-100" : "opacity-0"}`}>
            <div className="h-full w-full bg-emerald-400 animate-pulse" />
          </div>

          {!loading && isTruncated && (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              Mostrati i primi {AUDIT_FETCH_LIMIT} eventi per questo periodo. Restringi l'intervallo di date per vederli tutti.
            </div>
          )}

          <div className={`transition-opacity duration-500 ${loading ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
            <AuditLogTable
              activities={filteredActivities}
              currentUserId={user?.id}
              emptyMessage="Nessuna attività nel periodo selezionato."
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditLog;
