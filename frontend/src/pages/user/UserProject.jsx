import { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import AppLayout from "@/Components/layout/AppLayout";
import ActionBar from "@/utils/components/ActionBar";
import UserProjectsTable from "@/Components/features/projects/UserProjectsTable";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import { Folder, PlayCircle, PauseCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProject = () => {
  const { fetchProjects, projects } = useProjectContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggle = (status) => setFilterStatus((prev) => (prev === status ? "all" : status));

  // progetti filtrati per nome + stato (derivati, niente stato duplicato)
  const filteredProjects = useMemo(() => {
    const bySearch = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return filterStatus === "all" ? bySearch : bySearch.filter((p) => p.status === filterStatus);
  }, [projects, search, filterStatus]);

  // stessa logica/convenzione cromatica di AdminProjects.jsx (Attivo = blu, Completato = verde)
  const projectStats = useMemo(() => {
    const countByStatus = (status) => projects.filter((p) => p.status === status).length;
    return [
      { label: "Progetti assegnati", value: projects.length, icon: Folder, iconColor: "text-slate-600", bgIcon: "bg-slate-100", onClick: () => setFilterStatus("all"), active: filterStatus === "all" },
      { label: "Attivi", value: countByStatus("Attivo"), icon: PlayCircle, iconColor: "text-blue-600", bgIcon: "bg-blue-100", onClick: () => toggle("Attivo"), active: filterStatus === "Attivo", activeClass: "border-blue-400 ring-2 ring-blue-200 ring-offset-1" },
      { label: "In pausa", value: countByStatus("In pausa"), icon: PauseCircle, iconColor: "text-amber-600", bgIcon: "bg-amber-100", onClick: () => toggle("In pausa"), active: filterStatus === "In pausa", activeClass: "border-amber-400 ring-2 ring-amber-200 ring-offset-1" },
      { label: "Completati", value: countByStatus("Completato"), icon: CheckCircle2, iconColor: "text-emerald-600", bgIcon: "bg-emerald-100", onClick: () => toggle("Completato"), active: filterStatus === "Completato", activeClass: "border-emerald-400 ring-2 ring-emerald-200 ring-offset-1" },
    ];
  }, [projects, filterStatus]);

  const handleProjectRowClick = (projectId) => {
    navigate(`/user/projects/${projectId}`);
  };

  return (
    <AppLayout page="projects" title="Progetti">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <StatsCardsRow stats={projectStats} />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar search={search} setSearch={setSearch} placeholder="Cerca tra i tuoi progetti..." />

          <UserProjectsTable data={filteredProjects} handleProjectDetail={handleProjectRowClick} />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProject;
