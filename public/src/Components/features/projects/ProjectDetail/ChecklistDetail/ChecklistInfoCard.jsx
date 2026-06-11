import React from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ClipboardList, Folder, CircleDot, ListChecks } from "lucide-react";
import {useAuthContext} from "@/context/Auth/AuthContext";
import { getProjectStatusBadgeClass } from "@/utils/tableHelpers";
const ChecklistInfoCard = ({ checklist, selectedProject, onCreateChecklist }) => {
  const {user} = useAuthContext();
  const activeChecklist = checklist ?? null;
  const taskItems =
    activeChecklist?.tasks ?? activeChecklist?.items ?? activeChecklist?.checklist_items ?? [];


  // se non c'è una checklist attiva, mostro un messaggio informativo
  if (!activeChecklist) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ClipboardList className="h-7 w-7" />
          </div>


          <div className="space-y-2">
            {user.role === "user" ? (
              <>
                <h2 className="text-lg font-semibold text-slate-900">Nessuna checklist assegnata</h2>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-900">Nessuna checklist trovata</h2>

                <Button onClick={onCreateChecklist} className="bg-emerald-500 text-white hover:bg-emerald-600">
                  Crea template checklist
                 </Button>

              </>
            )}
          </div>



        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-6 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{activeChecklist.title}</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Template Checklist</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:ml-auto">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Progetto</p>
              <p className="text-sm font-medium text-slate-900">{selectedProject?.name ?? `Project ${activeChecklist.project_id}`}</p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Stato progetto</p>
              <Badge className={`mt-1 border-none ${getProjectStatusBadgeClass(selectedProject?.status)}`}>
                {selectedProject?.status ?? "N/D"}
              </Badge>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Task collegate</p>
              <p className="text-sm font-medium text-slate-900">{taskItems.length} task</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistInfoCard;
