import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { getFullName } from "@/utils/helpers/tableHelpers";
import { AUDIT_DATE_PRESETS, dateFromDaysAgo } from "@/utils/helpers/auditDatePresets";
import { useAuditContext } from "@/context/Audit/AuditContext";
import AuditLogTable from "@/Components/features/audit/AuditLogTable";
import { auditActions } from "@/utils/helpers/auditActions";

// SEZIONE ATTIVITÀ DEL PROGETTO: audit log filtrato per project_id, con ricerca per utente
const ProjectActivitiesSection = ({ projectId, currentUserId }) => {
  const { fetchProjectAudit } = useAuditContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [presetIdx, setPresetIdx] = useState(0); // default: "Oggi"

  const dateFrom = useMemo(() => {
    const days = AUDIT_DATE_PRESETS[presetIdx].days;
    return days !== null ? dateFromDaysAgo(days) : undefined;
  }, [presetIdx]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetchProjectAudit(projectId, 100, dateFrom)
      .then((data) => setActivities(data?.activities ?? []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [projectId, dateFrom]);

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities;
    const query = search.toLowerCase();
    return activities.filter(
      (item) =>
        getFullName(item).toLowerCase().includes(query) ||
        (auditActions[item.action]?.label ?? item.action ?? "").toLowerCase().includes(query),
    );
  }, [activities, search]);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          Attività recenti del progetto
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca per utente o azione..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 border-border focus-visible:ring-emerald-500"
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

        <div className={`transition-opacity duration-500 ${loading ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
          <AuditLogTable
            activities={filteredActivities}
            currentUserId={currentUserId}
            emptyMessage="Nessuna attività nel periodo selezionato."
            containerClass="overflow-hidden rounded-xl border border-border"
            hideProjectContext
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActivitiesSection;
