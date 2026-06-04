import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

const ProjectOverviewSection = ({ projectInfoItems, }) => {
    return (
        <div className="space-y-6">
            <div className="grid ">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-center gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Informazioni progetto</p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-900">Dettagli principali</h3>
                        </div>
                        {/* <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                            Tutti i dettagli
                        </Badge> */}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {projectInfoItems.map((item) => (
                            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                                <p className="mt-2 text-sm font-medium text-slate-900">{item.value ?? "Non disponibile"}</p>
                            </div>
                        ))}
                    </div>

                

                    
                </div>

              
            </div>
        </div>
    );
};

export default ProjectOverviewSection;