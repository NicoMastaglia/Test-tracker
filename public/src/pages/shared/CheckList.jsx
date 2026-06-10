import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import CheckListTable from "@/Components/features/checkList/CheckListTable";
import { checkListFields } from "@/utils/fields/checkListFields";
import { ChevronRight } from "lucide-react";

const CheckList = () => {
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);
  const [formData, setFormData]   = useState({ title: "" });

  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchCheckListsByProject, checklistItems, addCheckList, selectChecklist } = useCheckListContext();
  const { selectedProject, fetchProjectDetails, clearSelectedProject } = useProjectContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role !== "user";

  const filtered = useMemo(() => {
    if (!search.trim()) return checklistItems;
    return checklistItems.filter((cl) =>
      cl.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [checklistItems, search]);

  const handleCreate = async () => {
    if (!id) return;
    await addCheckList({ title: formData.title, project_id: Number(id) });
    await fetchCheckListsByProject(id);
    setFormData({ title: "" });
    setModal(false);
  };

  const handleOpen = (cl) => {
    selectChecklist(cl);
    const base = isAdmin
      ? `/admin/projects/${id}/checklist`
      : `/user/projects/${id}/checklist`;
    navigate(`${base}/${cl.id}`);
  }

 const handleEdit = (cl) => {
  console.log(cl)
   


 }

  const projectsPath = isAdmin ? "/admin/projects" : "/user/projects";
  const projectPath  = isAdmin ? `/admin/projects/${id}` : `/user/projects/${id}`;
  const projectLabel = selectedProject?.name ?? `Progetto #${id}`;

  useEffect(() => {
    if (id) {
      fetchCheckListsByProject(id);
      fetchProjectDetails(id);
    }
    return () => clearSelectedProject();
  }, [id]);

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
          <span className="font-medium text-slate-900">Checklist</span>
        </nav>

        {/* action bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca checklist..."
            buttonText={isAdmin ? "Crea Checklist" : null}
            onButtonClick={() => setModal(true)}
            buttonVariant="emerald"
          />
        </div>

        {/* tabella */}
        <CheckListTable checklists={filtered} onOpen={handleOpen} 
        handleEdit={handleEdit}
        isAdmin={isAdmin}
         />

        <ModalForm
          modalOpen={modal}
          setModalOpen={setModal}
          onClose={() => setFormData({ title: "" })}
          title="Nuova Checklist"
          infos="Crea un template checklist associato al progetto corrente."
          fields={checkListFields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          submitLabel="Crea Checklist"
          cancelLabel="Annulla"
        />
      </div>
    </AppLayout>
  );
};

export default CheckList;
