const normalizeText = (value) => (value ?? "").toString().trim().toLowerCase();

export const getInitials = (item = {}) => {
  const firstName = item.nome ?? item.name ?? item.first_name ?? item.firstName ?? "";
  const lastName = item.cognome ?? item.surname ?? item.last_name ?? item.lastName ?? "";
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim();

  return initials || "U";
};

export const getFullName = (item = {}) => {
  const firstName = item.nome ?? item.name ?? item.first_name ?? item.firstName ?? "";
  const lastName = item.cognome ?? item.surname ?? item.last_name ?? item.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Utente senza nome";
};

export const getRoleInfo = (role) => {
  const normalizedRole = normalizeText(role) || "user";

  const roleMap = {
    user: {
      label: "Utente",
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

export const getCreatorName = (project = {}, users = []) => {
  const creator = users.find((user) => Number(user.id) === Number(project.created_by));

  if (!creator) {
    return `User ${project.created_by ?? "-"}`;
  }

  const fullName = [
    creator.nome ?? creator.name ?? "",
    creator.cognome ?? creator.surname ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || creator.email || `User ${creator.id}`;
};

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
