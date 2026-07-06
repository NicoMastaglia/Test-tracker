import { formatProjectDateTime } from "@/utils/helpers/tableHelpers";

// chiavi i cui valori grezzi (id numerici, array di id) vengono sostituite con
// informazioni leggibili già risolte dal BE (related_user_*, session_started_at)
// o con un riassunto, invece di mostrare l'id così com'è. Stessa funzione usata
// sia dall'audit log generale che da quello di progetto
export const resolveDetailValue = (key, value, item) => {
  if (key === "assignedTo" || key === "userId" || key === "unassignedFrom") {
    return item.related_user_nome
      ? `${item.related_user_nome} ${item.related_user_cognome ?? ""}`.trim()
      : `Utente #${value}`;
  }
  if (key === "sessionId") {
    return item.session_started_at
      ? `Sessione del ${formatProjectDateTime(item.session_started_at)}`
      : `Sessione #${value}`;
  }
  if (key === "checklistItemIds" && Array.isArray(value)) {
    return `${value.length} task`;
  }
  return String(value);
};
