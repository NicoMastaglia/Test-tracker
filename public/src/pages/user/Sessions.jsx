import { TableCell, TableRow } from "@/Components/ui/table";
import AppLayout from "@/Components/layout/AppLayout";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useEffect, useState, useMemo } from "react";
import StandardTable from "@/utils/components/StandardTable";
import SessionRow from "./SessionRow";
import ActionBar from "@/utils/components/ActionBar";
import ModalForm from "@/utils/components/ModalForm";
import { Plus } from "lucide-react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { toast } from "sonner";

const headers = [
  { label: "ID", key: "id" },
  { label: "Progetto", key: "project_name" },
  { label: "Inizio", key: "start_time" },
  { label: "Fine", key: "end_time" },
  { label: 'Stato', key: 'status'},
  { label: "Azioni", key: "actions" },
];

const Sessions = () => {
  const { sessions, fetchSessions, createSession } = useSessionContext();
  const { projects, fetchProjects } = useProjectContext();
  
  const [search, setSearch] = useState("");
  const [addSession, setAddSession] = useState(false);
  const [formData, setFormData] = useState({
    project: "",
  });

  // 1. Carica i dati iniziali
  useEffect(() => {
    fetchProjects();
    fetchSessions();
  }, []);

  // 2. Filtra le sessioni in base alla ricerca
  const filteredSessions = useMemo(() => {
    if (!search) return sessions;
    return sessions.filter((s) =>
      (s.project_name ?? '').toLowerCase().includes(search.toLowerCase())
    );
  }, [sessions, search]);

  // 3. IMPORTANTISSIMO: Memorizza i campi del form per forzare l'aggiornamento quando arrivano i progetti
  const formFields = useMemo(() => {
    return [
      {
        key: "field-project",
        name: "project",
        label: "Seleziona progetto",
        type: "select",
        // Assicurati che value sia una stringa se il select HTML standard lavora con stringhe
        options: projects.map(p => ({ value: String(p.id), label: p.name })),
        required: true,
      },
    ];
  }, [projects]); // Si aggiorna appena 'projects' viene popolato da fetchProjects

  const handleAddSession = async () => {
    if (!formData.project) {
      toast.error("Seleziona un progetto");
      return;
    }

    try {
      await createSession(formData.project);
      toast.success("Sessione creata");
      
      await fetchSessions();
      
      // Reset del form
      setFormData({ project: "" });
      setAddSession(false);
    } catch (error) {
      toast.error("Errore durante la creazione");
    }
  };

  return (
    <AppLayout page="sessions">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca sessione..."
            buttonText="Add Session"
            onButtonClick={setAddSession}
            buttonVariant="emerald"
            icon={Plus}
          />
          <StandardTable
            headers={headers}
            data={filteredSessions}
            emptyMessage="Nessuna sessione trovata..."
            renderRow={(s) => <SessionRow session={s} />}
          />

          <ModalForm
            modalOpen={!!addSession}
            setModalOpen={setAddSession}
            title="Crea nuova sessione"
            infos="Seleziona il progetto per cui vuoi creare una nuova sessione di test."
            fields={formFields} // Passiamo l'array memorizzato
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddSession}
            submitLabel="Crea Sessione"
            titleIcon={Plus}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Sessions;