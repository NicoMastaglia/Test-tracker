import React from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import { useThemeContext } from "@/context/Theme/ThemeContext";

const Header = ({ user, page }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();
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

    "admin-sessions": {
      title: () => "Sessioni",
      subtitle: () => "Tutte le sessioni di test della piattaforma.",
    },

    users: {
      title: () => "Utenti",
      subtitle: () => "Gestisci gli utenti della piattaforma.",
    },

    "audit-log": {
      title: () => "Attività",
      subtitle: () => "Cronologia completa delle attività della piattaforma.",
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
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-8 py-5">
      <div>
        <div className="flex items-center gap-3">
          {/* barretta decorativa accanto al titolo */}
          <span className="h-7 w-1 rounded-full bg-emerald-500" />
          <h1 className="text-2xl font-semibold text-foreground">
            {currentConfig.title(user)}
          </h1>
        </div>

        <p className="mt-1 pl-4 text-sm text-muted-foreground">
          {currentConfig.subtitle(user)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
          className="h-9 w-9 rounded-full border-border text-muted-foreground shadow-sm
          cursor-pointer"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* chip utente loggato: avatar, nome e ruolo — cliccabile, porta alle impostazioni */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex cursor-pointer items-center gap-3 rounded-full border border-border bg-muted/50 py-1.5 pl-2 pr-4 shadow-sm transition-colors hover:bg-muted"
        >
          <UserAvatar user={user} size="sm" />

          <div className="leading-tight text-left">
            <p className="text-sm font-medium text-foreground">{getFullName(user) || user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          <Badge className={`border-none px-3 py-1 text-xs ${roleBadge.className}`}>
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {roleBadge.label}
          </Badge>
        </button>
      </div>
    </header>
  );
};

export default Header;