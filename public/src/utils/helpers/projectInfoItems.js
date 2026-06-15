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
  console.log("Raw deadline:", deadlineRaw); // Log della deadline raw per debug
  const isDeadlineOverdue =
    !!deadlineRaw &&
    new Date(deadlineRaw) < new Date() &&
    selectedProject?.status !== "Completato";

    const dayToLeft = Math.floor((new Date(deadlineRaw) - new Date()) / (1000 * 60 * 60 * 24));
    console.log(dayToLeft,'dl'); // Log del tempo alla deadline per debug

  // in attessa deti dati del be precisi 
  // ricordati di aggiornali
  return {
    created_at: selectedProject?.created_at ?? "Non disponibile",
    createdBy: creator ? `da ${getFullName(creator)}` : "Non disponibile",

    started_at: selectedProject?.started_at ?? "Non disponibile",
    startedAgo: (selectedProject?.started_at),

    deadline: formatProjectDate(deadlineRaw) ?? "Non disponibile",
    deadlineIn: deadlineRaw,
    isDeadlineOverdue,
    daysToDeadline: isDeadlineOverdue ? `(Scaduta da ${Math.abs(dayToLeft)} giorni)` : `(${dayToLeft} giorni)`,
    colorforDeadline: getColorsForDeadline(dayToLeft),

    updated_at: selectedProject?.updated_at ?? "Non disponibile",
    completed_at: selectedProject?.completed_at ?? "Progetto non completato...",

    responsible: creator ? getFullName(creator) : "Non disponibile",
    responsibleEmail: creator?.email ?? "Non disponibile",
  };
};
