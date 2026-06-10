import { getFullName, formatProjectDate } from "./tableHelpers";

// per costruire gli info item mostrati nella sezione "Panoramica" del dettaglio progetto
export const getProjectInfoItems = (selectedProject) => [
  {
    label: "Creato da",
    value: selectedProject?.created_by ? getFullName(selectedProject.created_by) : "Non disponibile",
  },
  {
    label: "Data creazione",
    value: selectedProject?.created_at ? formatProjectDate(selectedProject.created_at) : "Non disponibile",
  },
  {
    label: "Data avvio progetto",
    value: selectedProject?.started_at ? formatProjectDate(selectedProject.started_at) : "Non disponibile",
  },
  {
    label: "Ultimo aggiornamento",
    value: selectedProject?.updated_at ? formatProjectDate(selectedProject.updated_at) : "Non disponibile",
  },
  {
    label: "Scadenza",
    value: selectedProject?.deadline ? formatProjectDate(selectedProject.deadline) : "Non disponibile",
  },
  {
    label: "Responsabile",
    value: selectedProject?.created_by ? getFullName(selectedProject.created_by) : "Non disponibile",
  },
];
