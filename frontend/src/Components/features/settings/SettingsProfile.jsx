import React from "react";
import { User, Save } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { getRoleInfo } from "@/utils/helpers/tableHelpers";

const InputField = ({ label, value, onChange, disabled, icon, type = "text", error }) => {

  return (
    <div className="flex flex-col gap-1.5 w-full justify-start">
      <label className="text-xs font-semibold text-muted-foreground text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}

          className={`w-full rounded-lg border py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
            icon ? "pl-3 pr-10" : "px-3"
          } ${
            disabled ? "bg-muted/50 text-muted-foreground border-border cursor-not-allowed select-none" : "bg-card"
          } ${error ? "border-red-300 dark:border-red-500/40" : "border-border"}`}
        />
        {icon && (

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

const SettingsProfile = ({ profileData = {}, handleSave, handleChange, errors = {} }) => {
  
  const { user } = useAuthContext();
  const isUnchanged = 
    profileData.nome === user.name &&
    profileData.cognome === user.surname &&
    profileData.email === user.email;

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl flex flex-col justify-between w-full max-w-xl h-full">


      <div className="p-6 pb-0 flex flex-col grow">


        <div className="flex items-center gap-4 pb-5 border-b border-border mb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-foreground">Profilo</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggiorna le informazioni del tuo profilo personale.
            </p>
          </div>
        </div>

    
        <div className="flex flex-col gap-4 grow">

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <InputField
              label="Nome"
              value={profileData.nome || ""}
              onChange={(e) => handleChange('nome', e.target.value)}
              error={errors.nome}
            />
            <InputField
              label="Cognome"
              value={profileData.cognome || ""}
              onChange={(e) => handleChange('cognome', e.target.value)}
              error={errors.cognome}
            />
          </div>


          <InputField
            label="Email"
            type="email"
            value={profileData.email || ""}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

         
          <div className="flex flex-col gap-1.5 w-full justify-start">
            <label className="text-xs font-semibold text-muted-foreground text-left">Ruolo</label>
            <select
              disabled
              value={getRoleInfo(user.role).label}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed select-none focus:outline-none"
            >
              <option>{getRoleInfo(user.role).label}</option>
            </select>
          </div>
        </div>
      </div>


      <div className="p-4 bg-muted/50 border-t border-border rounded-b-2xl flex justify-end mt-6">
        <button
          onClick={() => handleSave?.()}
          disabled={isUnchanged}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Save size={14} />
          Salva modifiche
        </button>
      </div> 

    </div>
  );
};

export default SettingsProfile;