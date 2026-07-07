import { getFullName, formatProjectDate, getColorsForDeadline, getDeadlineStatus } from "./tableHelpers";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";

// re-esportata per non rompere eventuali import esistenti da questo file
export { getColorsForDeadline };




// per costruire gli info item mostrati nella sezione "Panoramica" del dettaglio progetto
export const getProjectInfoItems = (selectedProject) => {
  const creator = selectedProject?.created_by;

  const deadlineRaw = selectedProject?.deadline;
  const isCompleted = selectedProject?.status === "Completato";

  // stesso calcolo/helper usato per le scadenze di task e progetti in tutte le
  // tabelle (ProjectRow, TaskTable, MyTaskRow, CreateSessionModal): un'unica
  // implementazione evita che lo stesso bug di calcolo si ripresenti altrove
  const deadlineStatus = getDeadlineStatus(deadlineRaw, isCompleted);
  const isDeadlineOverdue = deadlineStatus.isOverdue;
  const daysToDeadline = deadlineStatus.daysLabel;
  const colorforDeadline = deadlineStatus.colorClass;

  return {
    created_at: selectedProject?.created_at ?? "Non disponibile",
    createdBy: creator ? `da ${getFullName(creator)}` : "Non disponibile",

    started_at: selectedProject?.started_at ?? "Non disponibile",
    startedAgo: (selectedProject?.started_at),

    deadline: formatProjectDate(deadlineRaw) ?? "Non disponibile",
    deadlineIn: deadlineRaw,
    isDeadlineOverdue,
    daysToDeadline,
    colorforDeadline,

    updated_at: selectedProject?.updated_at ?? "Non disponibile",
    completed_at: selectedProject?.completed_at ?? NOT_AVAILABLE,

    responsible: creator ? getFullName(creator) : "Non disponibile",
    responsibleEmail: creator?.email ?? "Non disponibile",
  };
};
