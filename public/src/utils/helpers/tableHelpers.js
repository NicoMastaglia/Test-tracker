// funzioni helper per estrarre e formattare le tabelle 


// Normalizza il testo per confronti (tutto minuscolo, senza spazi)
const normalizeText = (value) => (value ?? "").toString().trim().toLowerCase();


// uso classi di colore predefinite per i badge e gli avatar
export const ROUND_COLOR_CLASSES = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-lime-100 text-lime-700",
  "bg-indigo-100 text-indigo-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",


];

export const getRoundColorClass = (index = 0) => {
  if (!index) return ROUND_COLOR_CLASSES[0];
  
  const id = index % ROUND_COLOR_CLASSES.length;
  return ROUND_COLOR_CLASSES[id];
};


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
      label: "User",
      className: "bg-green-100 text-green-800",
    },
    admin: {
      label: "Admin",
      className: "bg-blue-100 text-blue-700",
    },
    superadmin: {
      label: "Super Admin",
      className: "bg-pink-100 text-pink-700",
    },
  };

  return roleMap[normalizedRole] || roleMap.user;
};


//  per ottenere le classi di stile in base allo stato
export const getStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus === "attivo" || normalizedStatus === "active") {
    return "font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none";
  }

  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "font-bold bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
  }

  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
    return "font-bold bg-amber-100 text-amber-700 hover:bg-amber-100 border-none";
  }

  return "font-bold bg-slate-100 text-slate-600 hover:bg-slate-100 border-none";
};


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
    return "font-bold bg-blue-100 text-blue-700";
  }

  // Completato / Completed -> emerald
  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "font-bold bg-emerald-100 text-emerald-700";
  }

  // In pausa / Non iniziato / Pending -> amber
  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold" || normalizedStatus === "non iniziato" || normalizedStatus === "pending") {
    return "font-bold bg-amber-100 text-amber-700";
  }

  // Bloccato / Blocked -> red
  if (normalizedStatus === "bloccato" || normalizedStatus === "blocked") {
    return "font-bold bg-red-100 text-red-700";
  }

  return "font-bold bg-slate-100 text-slate-600";
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
