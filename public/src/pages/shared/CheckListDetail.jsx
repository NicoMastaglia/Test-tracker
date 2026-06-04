import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import CheckListDetailView from "@/Components/features/checkList/CheckListDetailView";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const CheckListDetail = () => {
  const { id, checklistId } = useParams();
  const navigate = useNavigate();

  const { checklistItems, selectedChecklist, fetchCheckListsByProject, clearChecklist } = useCheckListContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role !== "user";

  const checklist = useMemo(() => {
    if (selectedChecklist && String(selectedChecklist.id) === String(checklistId)) {
      return selectedChecklist;
    }
    return checklistItems.find((cl) => String(cl.id) === String(checklistId)) ?? null;
  }, [selectedChecklist, checklistItems, checklistId]);

  useEffect(() => {
    if (id) {
      if (!checklistItems.length) fetchCheckListsByProject(id);
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

  return (
    <AppLayout page="checklists">
      <div className="space-y-6">

        {/* breadcrumb */}
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
            Checklist
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-900">
            {checklist?.title ?? `#${checklistId}`}
          </span>
        </nav>

        {/* back button */}
        <Button variant="outline" onClick={goBackToChecklist} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Torna alle checklist
        </Button>

        {/* content */}
        {checklist ? (
          <CheckListDetailView
            checklist={checklist}
            project={selectedProject}
            isAdmin={isAdmin}
            onAddTask={handleAddTask}
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

export default CheckListDetail;
