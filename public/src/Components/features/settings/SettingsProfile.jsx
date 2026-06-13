import React,{useEffect}from "react";
import { User, Save } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { getRoleInfo } from "@/utils/helpers/tableHelpers";

const InputField = ({ label, value, onChange, disabled, icon, type = "text" }) => {

  return (
    <div className="flex flex-col gap-1.5 w-full justify-start">
      <label className="text-xs font-semibold text-slate-500 text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}

          className={`w-full rounded-lg border border-slate-200 py-2.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
            icon ? "pl-3 pr-10" : "px-3"
          } ${
            disabled ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed select-none" : "bg-white"
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

const SettingsProfile = ({ profileData = {}, handleSave, handleChange}) => {
  
  const { user } = useAuthContext();
  const isUnchanged = 
    profileData.nome === user.name &&
    profileData.cognome === user.surname && 
    profileData.email === user.email;

    useEffect(() => {

console.log("Profile Data:", profileData);
console.log("User Data:", user);
    },[])
  

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col justify-between w-full max-w-xl h-full">


      <div className="p-6 pb-0 flex flex-col grow">


        <div className="flex items-center gap-4 pb-5 border-b border-slate-200 mb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-900">Profilo</h2>
            <p className="text-xs text-slate-500 mt-0.5">
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

         
          <div className="flex flex-col gap-1.5 w-full justify-start">
            <label className="text-xs font-semibold text-slate-500 text-left">Ruolo</label>
            <select
              disabled
              value={getRoleInfo(user.role).label}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none focus:outline-none"
            >
              <option>{getRoleInfo(user.role).label}</option>
            </select>
          </div>
        </div>
      </div>


      <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end mt-6">
        <button
          onClick={() => handleSave?.()}
          disabled={isUnchanged}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Save size={14} />
          Salva modifiche
        </button>
      </div> 

    </div>
  );
};

export default SettingsProfile;