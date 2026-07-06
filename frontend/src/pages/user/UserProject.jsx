import { useState, useEffect, useMemo } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import AppLayout from "@/Components/layout/AppLayout";
import ActionBar from "@/utils/components/ActionBar";
import UserProjectsTable from "@/Components/features/projects/UserProjectsTable";
import Loader from "@/utils/components/Loader";
import StatusFilterPills from "@/utils/components/StatusFilterPills";
import { useNavigate } from "react-router-dom";

const STATUS_FILTERS = [
  { value: "Non iniziato", label: "Non iniziati" },
  { value: "Attivo", label: "Attivi" },
  { value: "In pausa", label: "In pausa" },
  { value: "Completato", label: "Completati" },
];

const UserProject = () => {
  const { fetchProjects, projects, loading } = useProjectContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // progetti filtrati per nome + stato (derivati, niente stato duplicato)
  const filteredProjects = useMemo(() => {
    const bySearch = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return filterStatus === "all" ? bySearch : bySearch.filter((p) => p.status === filterStatus);
  }, [projects, search, filterStatus]);

  const projectFilters = useMemo(
    () =>
      STATUS_FILTERS.map(({ value, label }) => ({
        value,
        label,
        count: projects.filter((p) => p.status === value).length,
      })),
    [projects],
  );

  const hasActiveFilters = Boolean(search.trim() || filterStatus !== "all");
  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  const handleProjectRowClick = (projectId) => {
    navigate(`/user/projects/${projectId}`);
  };

  return (
    <AppLayout page="projects" title="Progetti">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca tra i tuoi progetti..."
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          >
            <StatusFilterPills
              filters={projectFilters}
              active={filterStatus}
              onChange={setFilterStatus}
              totalCount={projects.length}
            />
          </ActionBar>

          {loading && projects.length === 0 ? (
            <Loader label="Caricamento progetti..." />
          ) : (
            <UserProjectsTable data={filteredProjects} handleProjectDetail={handleProjectRowClick} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProject;
