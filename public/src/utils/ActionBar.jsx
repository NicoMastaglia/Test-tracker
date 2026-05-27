import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

const ActionBar = ({
  search,
  setSearch,
  placeholder = "Cerca...",
  buttonText,
  onButtonClick,
  buttonVariant = "primary", 
  buttonDisabled = false,
  children,                  
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
      
    
      <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full md:w-75">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 focus-visible:ring-emerald-500 border-slate-200"
          />
        </div>

    
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>

      
      {buttonText && (
        <Button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={`h-10 px-6 font-medium transition-all active:scale-95 shrink-0
            ${buttonVariant === "emerald" 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-slate-900 hover:bg-slate-800 text-white"
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
