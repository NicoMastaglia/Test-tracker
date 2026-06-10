import React from "react";
import { User, Lock, Save } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
const InputField = ({ label, value, onChange, disabled, icon, type = "text" }) => {

  return (
    <div className="flex flex-col gap-1.5 w-full justify-start">
      <label className="text-xs font-semibold text-slate-600 text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={type} 
          value={value}
          onChange={onChange}
          disabled={disabled}
       
          className={`w-full rounded-lg border border-slate-200 py-2.5 text-sm text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
            icon ? "pl-3 pr-10" : "px-3"
          } ${
            disabled ? "bg-slate-50 text-slate-400 border-slate-200/80 cursor-not-allowed select-none" : "bg-white"
          }`}
        />
        {icon && (
         
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsProfile = ({ profileData = {}, handleSave, handleChange, user = {} }) => {
  
 
  const isUnchanged = 
    profileData.nome === user.name &&
    profileData.cognome === user.surname && 
    profileData.email === user.email;

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col justify-between w-full max-w-xl min-h-125">
      
    
      <div className="p-6 pb-0 flex flex-col grow">
        

        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-900">Profilo</h2>
            <p className="text-xs text-slate-400 mt-0.5">
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
            />
            <InputField
              label="Cognome"
              value={profileData.cognome || ""}
              onChange={(e) => handleChange('cognome', e.target.value)} 
            />
          </div>

     
          <InputField
            label="Email"
            type="email"
            value={profileData.email || ""}
            onChange={(e) => handleChange('email', e.target.value)} 
          />

         
          <InputField
            label="Ruolo"
            value={user.role || ""}
            disabled={true}
            icon={<Lock size={15} />}
          />
        </div>
      </div>

      
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex justify-end mt-6">
        <button
          onClick={() => handleSave?.()}
          disabled={isUnchanged}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Save size={14} />
          Salva modifiche
        </button>
      </div> 

    </div>
  );
};

export default SettingsProfile;