

// componente riutilizzabile per visualizzare una barra di azioni con funzionalità di ricerca e pulsante personalizzabile


import React from "react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

const ActionBar = ({
  search,
  setSearch,
  placeholder = "cerca...",
  buttonText,
  onButtonClick,
  buttonVariant = "primary",
  buttonDisabled = false,
  children,
  // opzionali: mostra un bottone "Reset filtri" quando c'è almeno un filtro attivo
  // (ricerca, filtri KPI, date...) — la pagina decide cosa conta come "attivo" e cosa resettare
  onReset,
  hasActiveFilters = false,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-4 w-full">
      
    
      <div className="flex flex-col flex-1 flex-wrap gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full md:w-75">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 focus-visible:ring-emerald-500 border-border"
          />
        </div>

    
        {children && (
          <div className="flex flex-wrap items-center gap-2">
            {children}
          </div>
        )}

        {onReset && hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 shrink-0 cursor-pointer gap-1.5 border border-amber-200 text-amber-700 transition-colors duration-150 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
          >
            <X className="h-3.5 w-3.5" />
            Reset filtri
          </Button>
        )}
      </div>

      
      {buttonText && (
        <Button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={`h-10 px-6 font-medium transition-all active:scale-95 shrink-0
            ${buttonVariant === "emerald"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-muted hover:bg-muted/70 text-foreground"
            }
            ${buttonDisabled ? "opacity-50 cursor-not-allowed hover:bg-inherit active:scale-100" : ""}`}
        >
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ActionBar;
