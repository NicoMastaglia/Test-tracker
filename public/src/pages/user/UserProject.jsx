import { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import AppLayout from "@/Components/layout/AppLayout";
import ActionBar from "@/utils/ActionBar";
import UserProjectsTable from "@/Components/features/projects/UserProjectsTable";
import { useNavigate } from "react-router-dom";
const UserProject = () => {
  const { fetchProjects, projects } = useProjectContext();
  const { users } = useUserContext();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  useEffect(() => {
    setFilteredProjects(filtered);
  }, [filtered]);

  
  // const assignedUsers = (selectedProject && Number(selectedProject.id) === Number(assignProject?.id))
  //   ? selectedProject.assigned_users || []
  //   : (assignProject?.assigned_users || []);

  // const availableUsers = users.filter(u => {
  //   const isAssigned = assignedUsers.some(au => (au.id ?? au.user_id) === u.id);
  //   return !isAssigned;
  // });

  const handleProjectRowClick = (projectId) => {
    console.log(projectId,'id')
   
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
