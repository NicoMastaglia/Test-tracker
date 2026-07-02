import { useMemo, useState } from "react";
import { ShieldAlert, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { getFullName } from "@/utils/helpers/tableHelpers";
import AuditLogTable from "@/Components/features/audit/AuditLogTable";

// SEZIONE ATTIVITÀ DEL PROGETTO: audit log filtrato per project_id, con ricerca per utente.
// Stessa tabella compatta e paginata usata in /admin/audit-log, per coerenza visiva.
const ProjectActivitiesSection = ({ activities = [], loading = false, currentUserId }) => {
  const [search, setSearch] = useState("");

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities;
    return activities.filter((item) =>
      getFullName(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [activities, search]);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          Attività recenti del progetto
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative mb-4 w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cerca per utente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-slate-200 focus-visible:ring-emerald-500"
          />
        </div>

        <div className={`h-0.5 transition-opacity duration-700 ${loading ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full w-full bg-emerald-400 animate-pulse" />
        </div>

        <div className={`transition-opacity duration-500 ${loading ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
          <AuditLogTable
            activities={filteredActivities}
            currentUserId={currentUserId}
            emptyMessage="Nessuna attività recente da visualizzare per questo progetto."
            containerClass="overflow-hidden rounded-xl border border-slate-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActivitiesSection;
