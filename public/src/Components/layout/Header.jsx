import React from "react";
import { Badge } from "@/Components/ui/badge";
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";

const Header = ({ user, page }) => {
  const headerConfig = {
    dashboard: {
      hidden: true,
    },

    projects: {
      title: () => "Progetti",
      subtitle: () => "Gestisci i progetti della piattaforma.",
    },

    "user-projects": {
      title: () => "I miei progetti",
      subtitle: () => "Visualizza i progetti assegnati.",
    },

    sessions: {
      title: () => "Sessioni",
      subtitle: () => "Gestisci le sessioni di test.",
    },

    users: {
      title: () => "Utenti",
      subtitle: () => "Gestisci gli utenti della piattaforma.",
    },

    checklists: {
      title: (user) =>
        user?.role === "user"
          ? "La mia Checklist"
          : "Checklist",

      subtitle: (user) =>
        user?.role === "user"
          ? "Visualizza i task assegnati."
          : "Gestisci checklist e task.",
    },

    settings: {
      title: () => "Impostazioni",
      subtitle: () => "Gestisci il tuo account.",
    },
  };

  const currentConfig =
    headerConfig[page] || headerConfig.dashboard;

  if (currentConfig.hidden) {
    return null;
  }

  const roleBadge = getRoleInfo(user?.role);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <div className="flex items-center gap-3">
          {/* barretta decorativa accanto al titolo */}
          <span className="h-7 w-1 rounded-full bg-emerald-500" />
          <h1 className="text-2xl font-semibold text-slate-900">
            {currentConfig.title(user)}
          </h1>
        </div>

        <p className="mt-1 pl-4 text-sm text-slate-500">
          {currentConfig.subtitle(user)}
        </p>
      </div>

      {/* chip utente loggato: avatar, nome e ruolo */}
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-4 shadow-sm">
        <UserAvatar user={user} size="sm" />

        <div className="leading-tight">
          <p className="text-sm font-medium text-slate-900">{getFullName(user) || user?.email}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <Badge className={`border-none px-2 py-0.5 text-[11px] font-medium rounded-full ${roleBadge.className}`}>
          {roleBadge.label}
        </Badge>
      </div>
    </header>
  );
};

export default Header;