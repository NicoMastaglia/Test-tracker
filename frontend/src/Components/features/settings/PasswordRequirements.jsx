import React from "react"

export const  PswRequirements = ({
    validation
           } ) => 

            
    
    
    {
      

    return (
      <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Requisiti password
        </p>
        <ul className="flex flex-col gap-y-1.5 text-xs text-slate-500">
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.hasMinChar ? "bg-green-500" : "bg-slate-300"}`}
            />
            Minimo 8 caratteri
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.passwordsMatch ? "bg-green-500" : "bg-slate-300"}`}
            />
            Campi corrispondenti
          </li>
        </ul>
      </div>
    );
  
}



