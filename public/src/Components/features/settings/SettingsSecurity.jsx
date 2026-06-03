import React, { useState } from "react";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";

const PasswordField = ({ label, value, onChange, placeholder = "••••••••" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-slate-700 text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 pl-3 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white placeholder-slate-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const SettingsSecurity = ({ handleUpdatePassword, handleChange, securityData }) => {
 

  const isUnchanged = securityData.Oldpassword === '' ||
   securityData.Newpassword === '' || 
   securityData.confirmPassword === '';


  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-xl flex flex-col justify-between min-h-125">
      
      {/* Header Sicurezza */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Shield size={22} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-900">Sicurezza</h2>
          <p className="text-sm text-slate-500">
            Cambia la tua password per mantenere il tuo account sicuro.
          </p>
        </div>
      </div>

      {/* Form Fields Container */}
      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5 grow" 
>
        
        {/* Campo Password Attuale */}
        <PasswordField
          label="Password attuale"
          value={securityData.Oldpassword}
          onChange={(e) => handleChange('Oldpassword', e.target.value)}
          
        />

        {/* Campo Nuova Password */}
        <PasswordField
          label="Nuova password"
          value={securityData.Newpassword}
          onChange={(e) => handleChange('Newpassword', e.target.value)}
        />

        {/* Campo Conferma Nuova Password */}
        <PasswordField
          label="Conferma nuova password"
          value={securityData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
        />

        {/* Bottone Aggiorna Password */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600
             hover:bg-emerald-700 text-white 
             font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm
             disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
          
          
            disabled={isUnchanged}>
            <Lock size={16} />
            Aggiorna password
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsSecurity;