import React from "react";

import { Separator } from "@/components/ui/separator"; // Opzionale, per un look pulito

const Header = ({ user, page }) => {
  const headerConfig = {
    dashboard: {
      title: (user) => `Benvenuto, ${user.name}!`,
      subtitle: (user) => `Hai effettuato l'accesso come ${user.role}`,
    },
    projects: {
      title: () => "Gestione Progetti",
      subtitle: () => "Crea, modifica e assegna progetti ai tester.",
    },
    sessions: {
      title: () => "Gestione Sessioni",
      subtitle: () => "Visualizza e gestisci le sessioni di test.",
    },
    users: {
      title: () => "Gestione Utenti",
      subtitle: () => "Visualizza e gestisci gli utenti della piattaforma.",
    },
  };

  // Fallback se la pagina non esiste nella config
  const currentConfig = headerConfig[page] || headerConfig["dashboard"];

  return (
    <header className="flex flex-col w-full bg-white border-b border-slate-200">
      {/* Barra superiore con il Trigger */}
      <div className="flex items-center h-14 px-4 gap-4">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-1">
           {/* Breadcrumb o testo piccolo opzionale */}
           <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
             {page}
           </span>
        </div>
      </div>

      {/* Sezione Titolo (quella che avevi nel Box grigio) */}
      <div className="px-6 py-8 md:px-10 bg-slate-50/50">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {currentConfig.title(user)}
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          {currentConfig.subtitle(user)}
        </p>
      </div>
    </header>
  );
};

export default Header;