import AppLayout from "@/Components/layout/AppLayout";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ActionBar from "@/utils/components/ActionBar";
import ModalForm from "@/utils/components/ModalForm";
import { projectFields } from "@/utils/fields/projectFields";
import React, { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import {toast} from "sonner"
import {getFullName} from "@/utils/helpers/tableHelpers"
import {Plus, Folder, PlayCircle, PauseCircle, CheckCircle2} from "lucide-react"
import StatsCardsRow from "@/utils/components/StatsCardsRow"
import Loader from "@/utils/components/Loader"
import { withMinDuration } from "@/utils/helpers/withMinDuration"
const AdminProjects = () => {
  const { projects, addProject, fetchProjects, loading } = useProjectContext();
  const { users, fetchUsers } = useUserContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    responsabile: "",
    deadline: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // reset formData quando si chiude il modal, 
  // in modo da avere sempre un form vuoto all'apertura della
  //  modal per creare un nuovo progetto
  useEffect(() => {
    if (!modalOpen) {
      setFormData({
        name: "",
        description: "",
        responsabile: "",
        deadline: "",
      });
    }
  }, [modalOpen]);

  const handleAddProject = async () => {
    if (user?.role !== "admin" && user?.role !== "superadmin") return;

    if (!formData.name || !formData.description || !formData.responsabile) {
      toast.error("Per favore, compila tutti i campi obbligatori");
      return;
    }

    if (formData.deadline && isNaN(Date.parse(formData.deadline))) {
      toast.error("La data di scadenza non è valida");
      return;
    }

    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      toast.error("La data di scadenza non può essere nel passato");
      return;
    }

    const newProject = {
      name: formData.name,
      description: formData.description,
      manager_id: formData.responsabile,
      deadline: formData.deadline || null,
    };

    setCreatingProject(true);
    try {
      await withMinDuration(addProject(newProject));
      toast.success("Progetto creato con successo");
    await fetchProjects();

    setFormData({
      name: "",
      description: "",
      responsabile: "",
      deadline: "",
    });
    setModalOpen(false);
  }
   catch (error) {

    const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante la creazione del progetto"

    toast.error(message);


    } finally {
      setCreatingProject(false);
    }
  }

    

  const toggle = (status) => setFilterStatus((prev) => (prev === status ? "all" : status));

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  // conteggi di stato dei progetti (admin: i suoi; superadmin: tutti)
  const projectStats = useMemo(() => {
    const list = projects || [];
    const countByStatus = (status) => list.filter((p) => p.status === status).length;
    return [
      { label: "Progetti totali", value: list.length, icon: Folder, iconColor: "text-slate-600", bgIcon: "bg-slate-100", onClick: () => setFilterStatus("all"), active: filterStatus === "all" },
      { label: "Attivi", value: countByStatus("Attivo"), icon: PlayCircle, iconColor: "text-blue-600", bgIcon: "bg-blue-100", onClick: () => toggle("Attivo"), active: filterStatus === "Attivo", activeClass: "border-blue-400 ring-2 ring-blue-200 ring-offset-1" },
      { label: "In pausa", value: countByStatus("In pausa"), icon: PauseCircle, iconColor: "text-amber-600", bgIcon: "bg-amber-100", onClick: () => toggle("In pausa"), active: filterStatus === "In pausa", activeClass: "border-amber-400 ring-2 ring-amber-200 ring-offset-1" },
      { label: "Completati", value: countByStatus("Completato"), icon: CheckCircle2, iconColor: "text-emerald-600", bgIcon: "bg-emerald-100", onClick: () => toggle("Completato"), active: filterStatus === "Completato", activeClass: "border-emerald-400 ring-2 ring-emerald-200 ring-offset-1" },
    ];
  }, [projects, filterStatus]);

  const filteredProjects = useMemo(() => {
    const list = projects || [];
    const bySearch = search
      ? list.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          (p.status ?? "").toLowerCase().includes(search.toLowerCase())
        )
      : list;
    return filterStatus === "all" ? bySearch : bySearch.filter((p) => p.status === filterStatus);
  }, [projects, search, filterStatus]);


  const dynamicFields = useMemo(() => {
    return [
      ...projectFields,
      {
       key: "field-responsabile",
        name: "responsabile",
        label: "Responsabile",
        placeholder: "Seleziona il responsabile del progetto",
        type: "select",
        info: "Solo utenti con ruolo admin possono essere responsabili di un progetto",
        required: true,
      
        options: user?.role === 'admin' 
          ? [{
              value: user.id?.toString(),
              label: `${getFullName(user)}(tu)`
            }] 
          : users.filter(u => u.role === "admin").map(u => ({
              value: u.id?.toString(),
              label: `${getFullName(u)}`
            }))
      ,
   
      }
    ];
  }, [users, user]);

  return (
    <AppLayout page="projects" title="Progetti">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        {/* Box riepilogo stato progetti (admin: i suoi; superadmin: tutti) */}
        <StatsCardsRow stats={projectStats} />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca progetto..."
            buttonText={user?.role === "admin" || user?.role === "superadmin" ? "Add Project" : null}
            onButtonClick={user?.role === "admin" || user?.role === "superadmin" ? () => setModalOpen(true) : undefined}
            buttonVariant="emerald"
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {loading && projects.length === 0 ? (
            <Loader label="Caricamento progetti..." />
          ) : (
            <ProjectTable data={filteredProjects} users={users} />
          )}

          <ModalForm
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onClose={() => setFormData({
              name: "",
              description: "",
              responsabile: "",
              deadline: "",
            })}
            title="Nuovo Progetto"
            infos="Inserisci le informazioni di base per il nuovo progetto."
            fields={dynamicFields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddProject}
            submitLabel="Crea Progetto"
            loadingLabel="Creazione..."
            loading={creatingProject}
            cancelLabel="Annulla"
            titleIcon={Plus}
            iconColor="text-emerald-600"
            submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminProjects;

               
