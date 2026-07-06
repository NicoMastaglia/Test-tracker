import React from "react"

export const  PswRequirements = ({
    validation
           } ) => 

            
    
    
    {
      

    return (
      <div className="mt-2 p-3 bg-muted/50 border border-border rounded-xl">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Requisiti password
        </p>
        <ul className="flex flex-col gap-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.hasMinChar ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
            />
            Minimo 8 caratteri
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.passwordsMatch ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
            />
            Campi corrispondenti
          </li>
        </ul>
      </div>
    );
  
}



