// funzioni helper per estrarre e formattare le tabelle 


// Normalizza il testo per confronti (tutto minuscolo, senza spazi)
const normalizeText = (value) => (value ?? "").toString().trim().toLowerCase();


// estrare le iniziali di un utente
// si può estendere anche per altri campi
export const getInitials = (item = {}) => {
  const firstName = item.nome ?? item.name ?? item.first_name ?? item.firstName ?? "";
  const lastName = item.cognome ?? item.surname ?? item.last_name ?? item.lastName ?? "";
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim();

  // Se non ci sono iniziali, restituisci "U" per indicare un utente senza nome
  return initials.toUpperCase() || "U";
};


// per ottenere il nome completo di un utente, con fallback a "Utente senza nome"
export const getFullName = (item = {}) => {
  const firstName = item.nome ?? item.name ?? item.first_name ?? item.firstName ?? "";
  const lastName = item.cognome ?? item.surname ?? item.last_name ?? item.lastName ?? "";
  const normalizedFirstName = firstName
    ? firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase()
    : "";
  const normalizedLastName = lastName
    ? lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase()
    : "";

  return `${normalizedFirstName} ${normalizedLastName}`.trim() || "Utente senza nome";
};

// passo una stringa ed ogni prima lettera in maiuscolo, utile per i nomi dei progetti o dei campi personalizzati
 export const uppercaseFirstLetter = (text) => {
  if (!text) return "";
  const letter = text.split(' ')
  
  return letter.map((l)=>l.charAt(0).toUpperCase().concat(l.slice(1))).join(' ')
};


// per ottenere le informazioni di ruolo, con classi di stile associate
export const getRoleInfo = (role) => {
  const normalizedRole = normalizeText(role) || "user";

  const roleMap = {
    user: {
      // label: "Utente",
      label: "USER",
      className: "bg-green-100 text-green-900",
    },
    admin: {
      label: "ADMIN",
      className: "bg-blue-100 text-blue-800",
    },
    superadmin: {
      label: "SUPER ADMIN",
      className: "bg-pink-100 text-pink-800",
    },
  };

  return roleMap[normalizedRole] || roleMap.user;
};


//  per ottenere le classi di stile in base allo stato
export const getStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus === "attivo" || normalizedStatus === "active") {
    return "font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none";
  }

  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "font-bold bg-blue-100 text-blue-800 hover:bg-blue-100 border-none";
  }

  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
    return "font-bold bg-amber-100 text-amber-800 hover:bg-amber-100 border-none";
  }

  return "font-bold bg-slate-100 text-slate-700 hover:bg-slate-100 border-none";
};


// per ottenere le classi di stile in base allo stato del task
export const getTaskStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);


  if (normalizedStatus === "todo") {
    return "font-bold bg-amber-100 text-amber-800 hover:bg-amber-100 border-none";


  }
  if (normalizedStatus === "in corso") {
    return "font-bold bg-blue-100 text-blue-800 hover:bg-blue-100 border-none";



  }
  if (normalizedStatus === "completata") {
    return "font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none";


  }

  if (normalizedStatus === "archiviata") {
    return "font-bold bg-slate-100 text-blue-700 hover:bg-slate-100 border-none";
  }

  if (normalizedStatus === "bloccata") {
    return "font-bold bg-red-100 text-red-800 hover:bg-red-100 border-none";

  }

  return "font-bold bg-slate-100 text-slate-700 hover:bg-slate-100 border-none";




}

export const getChecklistStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  // STATO: Non iniziata (Neutro / Grigio)
  if (normalizedStatus === "non iniziata" || normalizedStatus === "todo") {
    return "font-semibold bg-slate-100 text-slate-800 hover:bg-slate-100/80 border-none";
  }

  // STATO: In corso (Indigo)
  if (normalizedStatus === "in corso") {
    return "font-semibold bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80 border-none";
  }

  // STATO: Completata (Emerald)
  if (normalizedStatus === "completata") {
    return "font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-none";
  }


  // FALLBACK
  return "font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border-none";
}

// per ottenere le classi di stile in base allo stato della sessione (solo 2 stati: In corso/Completata)
export const getSessionStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus === "completata") {
    return "font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-none";
  }

  // FALLBACK: "in corso" e qualunque altro valore inatteso
  return "font-semibold bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80 border-none";
}

// badge aggiuntivo (non sostituisce lo stato sessione): segnala che almeno una
// task della sessione è "Bloccata", indipendentemente da In corso/Completata
export const blockedIndicatorBadgeClass = "font-semibold bg-red-100 text-red-800 hover:bg-red-100/80 border-none";

// per ottenere le classi di stile in base all'esito di una task in sessione (Positivo/Negativo/non ancora valutato)
export const getOutcomeBadgeClass = (outcome) => {
  const normalizedOutcome = normalizeText(outcome);

  if (normalizedOutcome === "positivo") {
    return "font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-none";
  }

  if (normalizedOutcome === "negativo") {
    return "font-semibold bg-red-100 text-red-800 hover:bg-red-100/80 border-none";
  }

  // FALLBACK: outcome non ancora impostato
  return "font-semibold bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-none";
}

// per ottenere il nome del creatore di un progetto
export const getCreatorName = (project = {}, users = []) => {
  const creator = users.find((user) => Number(user.id) === Number(project.created_by));

  if (!creator) {
    return `User ${project.created_by ?? "-"}`;
  }

  return getFullName(creator);
};

// per ottenere le classi di stile in base allo stato del progetto
export const getProjectStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  // Attivo / Active = "In Progress" -> blue
  if (normalizedStatus === "attivo" || normalizedStatus === "active" || normalizedStatus === "in progress" || normalizedStatus === "in_progress") {
    return "font-bold bg-blue-100 text-blue-800";
  }

  // Completato / Completed -> emerald
  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "font-bold bg-emerald-100 text-emerald-800";
  }

  // In pausa / Non iniziato / Pending -> amber
  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold" || normalizedStatus === "non iniziato" || normalizedStatus === "pending") {
    return "font-bold bg-amber-100 text-amber-800";
  }

  // Bloccato / Blocked -> red
  if (normalizedStatus === "bloccato" || normalizedStatus === "blocked") {
    return "font-bold bg-red-100 text-red-800";
  }

  return "font-bold bg-slate-100 text-slate-700";
};


// per formattare le date  nelle tabelle
export const formatTableDate = (value) => {
  if (!value) {
    return "Data non disponibile";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.toString();
  }

  return date.toLocaleDateString("it-IT");
};


// per formattare le date nella pagina di dettaglio progetto
export const formatProjectDate = (value) => {
  if (!value) return "Non disponibile";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
};

// converte un valore data (ISO/Date) nel formato "YYYY-MM-DD" atteso da <input type="date">
// usando i componenti LOCALI, così la deadline non slitta di un giorno per via del fuso orario.
export const toDateInputValue = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatProjectDateTime = (value) => {
  if (!value) return "Non disponibile";

  const parsed = new Date(value);

  return isNaN(parsed)
    ? String(value)
    : new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(parsed);
};

// in base a quanti gg mancano alla deadline, restituisce una classe di colore per evidenziarla
// (positivo = giorni rimanenti, negativo = scaduta)
export const getColorsForDeadline = (daysLeft) => {
  if (daysLeft < 0) {
    return "text-red-600 bg-red-50/50";
  }
  if (daysLeft <= 7) {
    return "text-amber-600 bg-amber-50/50";
  }
  return "text-slate-600 bg-slate-100/50";
};

// calcola lo stato di scadenza di un'entità qualsiasi (task, progetto...) a partire da una data
// opzionale: isDone=true (es. task Completata/Archiviata, progetto Completato) neutralizza il
// colore e il conteggio giorni, così un elemento concluso non appare "scaduto" in rosso.
export const getDeadlineStatus = (deadlineRaw, isDone = false) => {
  const hasDeadline = !!deadlineRaw && !Number.isNaN(new Date(deadlineRaw).getTime());

  const daysLeft = hasDeadline
    ? Math.floor((new Date(deadlineRaw) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const isOverdue = hasDeadline && !isDone && daysLeft < 0;

  let label = "—";
  if (hasDeadline) {
    label = formatProjectDate(deadlineRaw);
  }

  const colorClass = (!hasDeadline || isDone)
    ? "text-slate-600 bg-slate-100/50"
    : getColorsForDeadline(daysLeft);

  return { hasDeadline, daysLeft, isOverdue, label, colorClass };
};


// confrontiamo la data corrente con quella di modifica
// per dare un dato aggiornato es 1 min fa,2 ore fa,ora etcc

export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return "Ora";
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min fa`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ore fa`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} giorni fa`;
  


}
