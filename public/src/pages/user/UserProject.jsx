import { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import AppLayout from "@/Components/layout/AppLayout";
import ActionBar from "@/utils/ActionBar";
import UserProjectsTable from "@/Components/features/projects/UserProjectsTable";

const UserProject = () => {
  const { fetchProjects, projects } = useProjectContext();
  const { users } = useUserContext();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  useEffect(() => {
    setFilteredProjects(filtered);
  }, [filtered]);

  return (
    <AppLayout page="projects">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ActionBar search={search} setSearch={setSearch} placeholder="Cerca tra i tuoi progetti..." />
        </div>

        <UserProjectsTable data={filteredProjects} users={users} />
      </div>
    </AppLayout>
  );
};

export default UserProject;
