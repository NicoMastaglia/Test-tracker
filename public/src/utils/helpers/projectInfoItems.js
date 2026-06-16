import { getFullName } from "./tableHelpers";

import { formatProjectDate } from "./tableHelpers";


// in base a quanti gg mancanpo alla deadline, restituisce una classe di colore per evidenziare la scadenza
// pooi devo chiedere i criteri in termini di giorni
// la func prende in input il numero di gg alla deadline (positivo se mancano giorni, negativo se è scaduta)
// se il progetto è completato, ignora la deadline e restituisce sempre grigio  
export const getColorsForDeadline = (daysLeft) => {
  if (daysLeft < 0) {
    return "text-red-600 bg-red-50/50";
  }
  if (daysLeft <= 7) {
    return "text-amber-600 bg-amber-50/50";
  }
  if (daysLeft > 7) {
    return "text-slate-600 bg-slate-100/50";
  }

  return "text-slate-600 bg-slate-100/50";

}




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
    completed_at: selectedProject?.completed_at ?? "Progetto non completato...",

    responsible: creator ? getFullName(creator) : "Non disponibile",
    responsibleEmail: creator?.email ?? "Non disponibile",
  };
};
