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
import {getFullName, isDateInPast} from "@/utils/helpers/tableHelpers"
import {Plus} from "lucide-react"
import StatusFilterPills from "@/utils/components/StatusFilterPills"
import Loader from "@/utils/components/Loader"

const STATUS_FILTERS = [
  { value: "Non iniziato", label: "Non iniziati" },
  { value: "Attivo", label: "Attivi" },
  { value: "In pausa", label: "In pausa" },
  { value: "Completato", label: "Completati" },
];
import { withMinDuration } from "@/utils/helpers/withMinDuration"
const AdminProjects = () => {
  const { projects, addProject, fetchProjects, loading } = useProjectContext();
  const { users, fetchUsers } = useUserContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
      setFormErrors({});
    }
  }, [modalOpen]);

  const handleAddProject = async () => {
    if (user?.role !== "admin" && user?.role !== "superadmin") return;

    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Il nome è obbligatorio";
    if (!formData.description.trim()) nextErrors.description = "La descrizione è obbligatoria";
    if (!formData.responsabile) nextErrors.responsabile = "Seleziona un responsabile";
    if (formData.deadline && isNaN(Date.parse(formData.deadline))) {
      nextErrors.deadline = "La data di scadenza non è valida";
    } else if (formData.deadline && isDateInPast(formData.deadline)) {
      nextErrors.deadline = "La data di scadenza non può essere nel passato";
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const newProject = {
      name: formData.name.trim(),
      description: formData.description.trim(),
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

    

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  // conteggi di stato dei progetti (admin: i suoi; superadmin: tutti)
  const projectFilters = useMemo(() => {
    const list = projects || [];
    return STATUS_FILTERS.map(({ value, label }) => ({
      value,
      label,
      count: list.filter((p) => p.status === value).length,
    }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list = projects || [];
    const bySearch = search
      ? list.filter((p) =>
          (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
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
        helperText: "Solo utenti con ruolo admin possono essere responsabili di un progetto",
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca progetto..."
            buttonText={user?.role === "admin" || user?.role === "superadmin" ? "Nuovo progetto" : null}
            onButtonClick={user?.role === "admin" || user?.role === "superadmin" ? () => setModalOpen(true) : undefined}
            buttonVariant="emerald"
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          >
            <StatusFilterPills
              filters={projectFilters}
              active={filterStatus}
              onChange={setFilterStatus}
              totalCount={(projects || []).length}
            />
          </ActionBar>

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
            errors={formErrors}
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

               
