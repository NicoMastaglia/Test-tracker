import { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import AppLayout from "@/Components/layout/AppLayout";
import ActionBar from "@/utils/components/ActionBar";
import UserProjectsTable from "@/Components/features/projects/UserProjectsTable";
import { useNavigate } from "react-router-dom";

const UserProject = () => {
  const { fetchProjects, projects } = useProjectContext();
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // progetti filtrati per nome in base alla ricerca (derivati, niente stato duplicato)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const handleProjectRowClick = (projectId) => {
    navigate(`/user/projects/${projectId}`);
  };

  return (
    <AppLayout page="projects">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar search={search} setSearch={setSearch} placeholder="Cerca tra i tuoi progetti..." />

          <UserProjectsTable data={filteredProjects} handleProjectDetail={handleProjectRowClick} />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProject;
