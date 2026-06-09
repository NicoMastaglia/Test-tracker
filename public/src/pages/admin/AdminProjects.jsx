import AppLayout from "@/Components/layout/AppLayout";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ActionBar from "@/utils/ActionBar";
import ModalForm from "@/utils/ModalForm";
import { projectFields } from "@/utils/fields/projectFields";
import React, { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import {toast} from "sonner"
const AdminProjects = () => {
  const { projects, addProject, fetchProjects } = useProjectContext();
  const { users, fetchUsers } = useUserContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const emptyProjectData = { name: "", description: "", responsabile: "" };
  const [formData, setFormData] = useState(emptyProjectData);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // reset formData quando si chiude il modal, 
  // in modo da avere sempre un form vuoto all'apertura della
  //  modal per creare un nuovo progetto
  useEffect(() => {
    if (!modalOpen) {
      setFormData(emptyProjectData);
    }
  }, [modalOpen]);

  const handleAddProject = async () => {
    if (user?.role !== "admin" && user?.role !== "superadmin") return;

    const newProject = {
      name: formData.name,
      description: formData.description,
      responsabile: formData.responsabile,
    }; 

    try {
      await addProject(newProject);
      toast.success("Progetto creato con successo");
    await fetchProjects();

    setFormData(emptyProjectData);
    setModalOpen(false);
  }
   catch (error) {
    const message = error.response?.data?.error;

    // da implementare lato backend un messaggio di errore specifico per nome progetto duplicato, ora gestiamo in modo generico 
    if (message === "Project name already exists") {
      toast.error("Esiste già un progetto con questo nome, scegli un nome diverso");
      return;
    }
    toast.error("Errore durante creazione progetto");

    }
  } 

    

  const filteredProjects = useMemo(() => {
    if (!search) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        (project.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);


  const dynamicFields = useMemo(() => {
    return [
      ...projectFields,
      {
        name: "responsabile",
        label: "Responsabile",
        placeholder: "Seleziona il responsabile del progetto",
        type: "select",
        info: "Solo utenti con ruolo admin possono essere responsabili di un progetto",
        required: true,
        options: user?.role === 'admin' // Aggiunto il ? di sicurezza
          ? [{
              value: user.id,
              label: `${user.first_name} ${user.last_name} (tu)`
            }] 
          : users.filter(u => u.role === "admin").map(u => ({
              value: u.id,
              label: `${u.first_name} ${u.last_name}`
            }))
      }
    ];
  }, [users, user]);

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
              fields={dynamicFields}
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

               
