import React from "react";
import { User, Lock, Save } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";
const InputField = ({ label, value, onChange, disabled, icon,

}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full justify-start">
    
      <label className="text-sm font-semibold text-slate-700 text-left">{label}</label>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
            disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "bg-white"
          }`}
        />
        {icon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsProfile = ({ profileData = {},handleSave,handleChange  }) => {

    const {user} = useAuthContext()

  const isUnchanged = profileData.nome === user.name &&
   profileData.cognome === user.surname && 
   profileData.email === user.email;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-xl flex flex-col justify-between min-h-[500px]">
      
      {/* Header Profilo */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <User size={22} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-900">Profilo</h2>
          <p className="text-sm text-slate-500">
            Aggiorna le informazioni del tuo profilo.
          </p>
        </div>
      </div>

      {/* Form Fields Container */}
      <div className="flex flex-col gap-5 grow">
        {/* Riga Nome e Cognome */}
        <div className="flex flex-col sm:flex-row gap-4 w-full 
       
        ">
          <InputField
            label="Nome"
            
            value={profileData.nome}
            onChange={(e)=>handleChange('nome',e.target.value)} 
          />
          <InputField
            label="Cognome"
            value={profileData.cognome || ""}
            onChange={(e)=>handleChange('cognome',e.target.value)} 
          />
        </div>

        {/* Campo Email */}
        <InputField
          label="Email"
          value={profileData.email || ""}
          onChange={(e)=>handleChange('email',e.target.value)} 
        />

        {/* Campo Ruolo (Disabilitato con Lucchetto) */}
        <InputField
          label="Ruolo"
          value={user.role}
          disabled={true}
          icon={<Lock size={16} />}
        />
      </div>

      {/* Bottone Salva Modifiche */}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => handleSave()}
          className="flex items-center gap-2
          
          bg-blue-600 hover:bg-blue-700
           text-white font-medium px-4 py-2.5 
           rounded-lg text-sm transition-colors shadow-sm
           disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
        
          disabled={isUnchanged}
      
        
        >
          <Save size={16} />
          Salva modifiche
        </button>
      </div> 

    </div>
  );
};

export default SettingsProfile;