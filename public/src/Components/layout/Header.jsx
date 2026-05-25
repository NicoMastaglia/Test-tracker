import React from "react";
import { Separator } from "@/Components/ui/separator"; 

const Header = ({ user, page }) => {
  const headerConfig = {
    dashboard: {
      title: (user) => `Benvenuto, ${user.name}!`,
      subtitle: (user) => `Hai effettuato l'accesso come ${user.role}`,
    },
    projects: {
      title: () => "Gestione Progetti",
      subtitle: () => "Crea, modifica e assegna progetti ai user.",
    },
    "user-projects": {
      title: (user) => `I miei progetti${user?.name ? `, ${user.name}` : ""}`,
      subtitle: () => "Visualizza i progetti che ti sono stati assegnati.",
    },
    sessions: {
      title: () => "Gestione Sessioni",
      subtitle: () => "Visualizza e gestisci le sessioni di test.",
    },
    users: {
      title: () => "Gestione Utenti",
      subtitle: () => "Visualizza e gestisci gli utenti della piattaforma.",
    },
    checklists: {
      title: (user) => (user?.role === "user" ? "La mia Checklist" : "Gestione Checklist"),
      subtitle: (user) =>
        user?.role === "user"
          ? "Visualizza e gestisci i task della tua checklist."
          : "Crea, modifica e assegna task alla checklist.",
    },
  };

  const currentConfig = headerConfig[page] || headerConfig["dashboard"];
  const pageLabel = page === "checklists" ? "Checklist" : page;

  return (
    <header className="flex flex-col w-full bg-white border-b border-slate-100">
    
      <div className="flex items-center h-12 px-6 gap-2">
   
        <Separator orientation="vertical" className="h-4 bg-slate-200" />
        <div className="flex-1 pl-2">
          
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             {pageLabel}
           </span>
        </div>
      </div>

    
      <div className="px-6 py-6 md:px-8 bg-slate-50/40">
       
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {currentConfig.title(user)}
        </h1>
       
        <p className="mt-1 text-xs md:text-sm text-slate-400 font-medium tracking-wide">
          {currentConfig.subtitle(user)}
        </p>
      </div>
    </header>
  );
};

export default Header;