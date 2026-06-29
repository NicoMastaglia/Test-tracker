import React,{useEffect} from "react";
import { Button } from "@/Components/ui/button";
import { ClipboardList, ClipboardCheck, Folder, Pencil, Trash2 } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
import EntityHeaderCard from "@/utils/components/EntityHeaderCard";

// Riga di metadati del template checklist (solo i campi realmente disponibili)
const ChecklistMetaRow = ({ checklist, selectedProject }) => {
  const items = [
    {
      icon: Folder,
      label: "Progetto",
      value: selectedProject?.name ?? `Progetto ${checklist.project_id}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 px-6 py-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-6">
            {index > 0 && <div className="hidden h-10 w-px bg-slate-200 sm:block" />}
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="text-sm font-medium text-slate-900 uppercase">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChecklistInfoCard = ({
  checklist,
  selectedProject,
  onCreateChecklist,
  onEditChecklist,
  onDeleteChecklist,
}) => {
  const { user } = useAuthContext();
  const activeChecklist = checklist ?? null;
  const isAdmin = user?.role !== "user";


  useEffect(() => {
    console.log(selectedProject)


  },[])
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
    <EntityHeaderCard
      icon={ClipboardCheck}
      title={activeChecklist.title}
      description={activeChecklist.description || "Nessuna descrizione"}
      actions={
        isAdmin ? (
          <>
            <Button
              onClick={onEditChecklist}
              className="h-9 gap-2 rounded-lg bg-emerald-500 text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow"
            >
              <Pencil className="h-4 w-4" />
              Modifica
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onDeleteChecklist}
              className="h-9 w-9 rounded-lg border-red-200 text-red-500 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : null
      }
      footer={<ChecklistMetaRow checklist={activeChecklist} selectedProject={selectedProject} />}
    />
  );
};

export default ChecklistInfoCard;
