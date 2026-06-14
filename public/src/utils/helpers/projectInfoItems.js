import { getFullName, formatProjectDate,} from "./tableHelpers";
// formatRelativeDays

// per costruire gli info item mostrati nella sezione "Panoramica" del dettaglio progetto
export const getProjectInfoItems = (selectedProject) => {
  const creator = selectedProject?.created_by;

  const deadlineRaw = selectedProject?.deadline;
  const isDeadlineOverdue =
    !!deadlineRaw &&
    new Date(deadlineRaw) < new Date() &&
    selectedProject?.status !== "Completato";

  return {
    created_at: formatProjectDate(selectedProject?.created_at),
    createdBy: creator ? `da ${getFullName(creator)}` : "Non disponibile",

    started_at: formatProjectDate(selectedProject?.started_at),
    startedAgo: (selectedProject?.started_at),

    deadline: formatProjectDate(deadlineRaw),
    deadlineIn: deadlineRaw,
    isDeadlineOverdue,

    updated_at: formatProjectDate(selectedProject?.updated_at),
    completed_at: formatProjectDate(selectedProject?.completed_at),

    responsible: creator ? getFullName(creator) : "Non disponibile",
    responsibleEmail: creator?.email ?? "Non disponibile",
  };
};
