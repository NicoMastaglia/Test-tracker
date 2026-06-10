import React from "react"

export const  PswRequirements = ({securityData,
    validation
           } ) => 

            
    
    
    {
        // se la password è vuota, non  serve mostrare i requisiti 
        const hasInput =  !! securityData.Newpassword; 

    return (
      <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Requisiti password
        </p>
        <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-500">
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.hasMinChar >= 8 ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            Minimo 8 caratteri
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${/\d/.test(validation.hasNumber) ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            Almeno un numero
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(validation.hasUppercase) ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            Una lettera maiuscola
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${validation.passwordsMatch ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            Campi corrispondenti
          </li>
        </ul>
      </div>
    );
  
}


export const PswValidator = ({securityData,
   validation
   
}) =>{

    const hasNewPsw = !!securityData.Newpassword; // Controlla se c'è input nella nuova password
    const hasConfirmPsw = !!securityData.confirmPassword; // Controlla se c'è input nella conferma password

   

    if(!hasNewPsw && !hasConfirmPsw){
        // Se entrambi i campi sono vuoti, non mostriamo nulla (né errori né requisiti)
        return null;
    }
    return (
      <>
        <div className="flex flex-col gap-1 pl-1">
          {hasNewPsw && !validation.hasMinChar && (
            <p className="text-xs text-red-500 font-medium">
              La password deve essere lunga almeno 8 caratteri.
            </p>
          )}
          {hasNewPsw && !validation.hasNumber && (
            <p className="text-xs text-red-500 font-medium">
              La password deve contenere almeno un numero.
            </p>
          )}
          {hasNewPsw && !validation.hasUppercase && (
            <p className="text-xs text-red-500 font-medium">
              La password deve contenere almeno una lettera maiuscola.
            </p>
          )}
          {hasConfirmPsw && !validation.passwordsMatch && (
            <p className="text-xs text-red-500 font-medium">
              Le nuove password non corrispondono.
            </p>
          )}
        </div>
      </>
    );

            
    
}

