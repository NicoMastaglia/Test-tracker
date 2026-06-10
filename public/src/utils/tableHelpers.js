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
];

export const getRoundColorClass = (index = 0) => ROUND_COLOR_CLASSES[index % ROUND_COLOR_CLASSES.length];


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
 export const upppercaseFirstLetter = (text) => {
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
      className: "bg-emerald-100 text-emerald-700",
    },
    admin: {
      label: "Admin",
      className: "bg-blue-100 text-blue-700",
    },
    superadmin: {
      label: "Super Admin",
      className: "bg-rose-100 text-rose-700",
    },
  };

  return roleMap[normalizedRole] || roleMap.user;
};


//  per ottenere le classi di stile in base allo stato
export const getStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus === "attivo" || normalizedStatus === "active") {
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none";
  }

  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
  }

  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
    return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none";
  }

  return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none";
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

  if (normalizedStatus === "attivo" || normalizedStatus === "active") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalizedStatus === "completato" || normalizedStatus === "completed") {
    return "bg-blue-100 text-blue-700";
  }

  if (normalizedStatus === "in pausa" || normalizedStatus === "paused" || normalizedStatus === "on hold" || normalizedStatus === "on_hold") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
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
