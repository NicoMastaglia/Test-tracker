import AppLayout from "@/Components/layout/AppLayout";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import { projectFields } from "@/utils/fields/projectFields";
import React, { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { useAuthContext } from "@/context/Auth/AuthContext";

const AdminProjects = () => {
  const { projects, addProject, fetchProjects } = useProjectContext();
  const { users, fetchUsers } = useUserContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const emptyProjectData = { name: "", description: "" };
  const [formData, setFormData] = useState(emptyProjectData);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleAddProject = async () => {
    if (user?.role !== "admin" && user?.role !== "superadmin") return;

    const newProject = {
      name: formData.name,
      description: formData.description,
    };

    await addProject(newProject);
    await fetchProjects();
    setFormData(emptyProjectData);
    setModalOpen(false);
  };

  const filteredProjects = useMemo(() => {
    if (!search) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        (project.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);

  return (
    <AppLayout page="projects">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca progetto..."
            buttonText={user?.role === "admin" || user?.role === "superadmin" ? "Add Project" : null}
            onButtonClick={user?.role === "admin" || user?.role === "superadmin" ? () => setModalOpen(true) : undefined}
            buttonVariant="emerald"
          />
          <div className="pt-4">
            <ModalForm
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              onClose={() => setFormData(emptyProjectData)}
              title="Nuovo Progetto"
              infos="Inserisci le informazioni di base per il nuovo progetto."
              fields={projectFields}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddProject}
              submitLabel="Crea Progetto"
              cancelLabel="Annulla"
            />
          </div>
        </div>

        <ProjectTable data={filteredProjects} users={users} />
      </div>
    </AppLayout>
  );
};

export default AdminProjects;
