import { Badge } from "@/Components/ui/badge";
import { FolderOpen } from "lucide-react";
import { getFullName, getProjectStatusBadgeClass } from "@/utils/tableHelpers";

const ProjectHeaderCard = ({ selectedProject }) => {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Project Detail
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedProject.name ?? selectedProject.nome}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Badge
                  className={`border-none px-3 py-1 text-xs ${getProjectStatusBadgeClass(selectedProject.status)}`}
                >
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  {selectedProject.status ?? "Unknown"}
                </Badge>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Codice: #{selectedProject.id}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Creato da{" "}
                  {selectedProject.created_by
                    ? getFullName(selectedProject.created_by)
                    : "Non disponibile"}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  {selectedProject.description ||
                    "Nessuna descrizione disponibile."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProjectHeaderCard;
