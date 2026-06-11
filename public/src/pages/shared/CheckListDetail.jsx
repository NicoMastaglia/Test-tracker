import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useChecklistContext } from "@/context/Checklist/ChecklistContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ChecklistDetailView from "@/Components/features/projects/ProjectDetail/ChecklistDetail/ChecklistDetailView";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ChecklistDetail = () => {
  const { id, checklistId } = useParams();
  const navigate = useNavigate();

  const { checklistItems, selectedChecklist, fetchChecklistsByProject, clearChecklist } = useChecklistContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role !== "user";
  console.log(isAdmin)


  const checklist = useMemo(() => {
    if (selectedChecklist && String(selectedChecklist.id) === String(checklistId)) {
      return selectedChecklist;
    }
    return checklistItems.find((cl) => String(cl.id) === String(checklistId)) ?? null;
  }, [selectedChecklist, checklistItems, checklistId]);

  useEffect(() => {
    if (id) {
      if (!checklistItems.length) fetchChecklistsByProject(id);
      if (!selectedProject) fetchProjectDetails(id);
    }
    return () => {
      clearSelectedProject();
      clearChecklist();
    };
  }, [id]);

  const projectsPath = isAdmin ? "/admin/projects" : "/user/projects";
  const projectPath  = isAdmin ? `/admin/projects/${id}` : `/user/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;

  const goBackToChecklist = () =>
    navigate(projectPath, { state: { section: "checklist" } });

  const handleAddTask = () => {
    toast.info("Funzionalità di aggiunta task non ancora disponibile.");
  };

  const handleEditTask = () => {
    toast.info("Funzionalità di modifica task non ancora disponibile.");
  };

  const handleDeleteTask = () => {
    toast.info("Funzionalità di eliminazione task non ancora disponibile.");
  };



  return (
    <AppLayout page="checklists">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">

        {/* breadcrumb + back button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <button onClick={() => navigate(projectsPath)} className="hover:text-slate-900 transition-colors">
              Progetti
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={() => navigate(projectPath)} className="hover:text-slate-900 transition-colors">
              {projectLabel}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={goBackToChecklist} className="hover:text-slate-900 transition-colors">

            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">
              {checklist?.title ?? `#${checklistId}`}
            </span>
          </nav>

          <Button variant="ghost" size="sm" onClick={goBackToChecklist} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alle checklist
          </Button>
        </div>

        {/* content */}
        {checklist ? (
          <ChecklistDetailView
            checklist={checklist}
            project={selectedProject}
            isAdmin={isAdmin}
            handleAdd={handleAddTask}
            handleEdit={handleEditTask}
            handleDelete={handleDeleteTask}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Caricamento checklist...
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ChecklistDetail;
