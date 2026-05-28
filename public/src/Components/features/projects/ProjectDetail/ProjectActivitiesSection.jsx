import { Badge } from "@/Components/ui/badge";

const ProjectActivitiesSection = () => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Attività recenti</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Timeline in lavorazione</h3>
                </div>
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                    WIP
                </Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {[
                    {
                        title: "Log attività",
                        description: "Qui arriveranno gli eventi recenti del progetto.",
                    },
                    {
                        title: "Assegnazioni",
                        description: "Mostreremo aggiunte e rimozioni dei tester.",
                    },
                    {
                        title: "Stato e checklist",
                        description: "Aggiornamenti su stato progetto e checklist collegate.",
                    },
                ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Sezione ancora in sviluppo. Qui puoi  ci sarà audit log filtrata per project_id, attività recenti o note operative.
            </div>
        </div>
    );
};

export default ProjectActivitiesSection;