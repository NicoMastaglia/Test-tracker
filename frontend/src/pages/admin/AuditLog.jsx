import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AppLayout from "@/Components/layout/AppLayout";
import { Input } from "@/Components/ui/input";
import AuditLogTable from "@/Components/features/audit/AuditLogTable";
import { useAuditContext } from "@/context/Audit/AuditContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { getFullName } from "@/utils/helpers/tableHelpers";

const PRESETS = [
  { label: "Oggi",        days: 0    },
  { label: "Ieri + oggi", days: 1    },
  { label: "7 giorni",   days: 6    },
  { label: "30 giorni",  days: 29   },
  { label: "Tutto",      days: null  },
];

const dateFromDaysAgo = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

const AuditLog = () => {
  const { fetchGlobalAudit } = useAuditContext();
  const { user } = useAuthContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [presetIdx, setPresetIdx] = useState(1); // default: "Ieri + oggi"

  const dateFrom = useMemo(() => {
    const days = PRESETS[presetIdx].days;
    return days !== null ? dateFromDaysAgo(days) : undefined;
  }, [presetIdx]);

  useEffect(() => {
    setLoading(true);
    setSearch("");
    // stesso limit per tutti i preset (era 200 solo per "Tutto": con nessun WHERE data,
    // un limite più basso di quello dei preset filtrati faceva sembrare "Tutto" più corto
    // di "30 giorni" quando il DB aveva più di 200 righe recenti)
    fetchGlobalAudit(500, dateFrom)
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
        (item.project_name ?? "").toLowerCase().includes(query),
    );
  }, [activities, search]);

  return (
    <AppLayout page="audit-log" title="Audit Log">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cerca per utente o progetto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPresetIdx(i)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors
                    ${presetIdx === i
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
