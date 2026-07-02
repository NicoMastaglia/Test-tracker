import { getFullName, formatProjectDate, getColorsForDeadline } from "./tableHelpers";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";

// re-esportata per non rompere eventuali import esistenti da questo file
export { getColorsForDeadline };




// per costruire gli info item mostrati nella sezione "Panoramica" del dettaglio progetto
export const getProjectInfoItems = (selectedProject) => {
  const creator = selectedProject?.created_by;

  const deadlineRaw = selectedProject?.deadline;
  const isCompleted = selectedProject?.status === "Completato";
  const hasDeadline = !!deadlineRaw && !Number.isNaN(new Date(deadlineRaw).getTime());

  // giorni alla deadline (positivo se mancano, negativo se è passata); null se non c'è deadline
  const dayToLeft = hasDeadline
    ? Math.floor((new Date(deadlineRaw) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  // una deadline è "scaduta" solo se c'è, è passata e il progetto NON è completato
  const isDeadlineOverdue = hasDeadline && !isCompleted && dayToLeft < 0;

  // testo dei giorni: nessun conteggio se il progetto è completato o senza deadline
  // (altrimenti per un progetto finito mostrerebbe giorni negativi)
  let daysToDeadline = "";
  if (hasDeadline && !isCompleted) {
    daysToDeadline = isDeadlineOverdue
      ? `(Scaduta da ${Math.abs(dayToLeft)} giorni)`
      : `(${dayToLeft} giorni)`;
  }

  // colore neutro (grigio) se completato o senza deadline
  const colorforDeadline = (isCompleted || !hasDeadline)
    ? "text-slate-600 bg-slate-100/50"
    : getColorsForDeadline(dayToLeft);

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
