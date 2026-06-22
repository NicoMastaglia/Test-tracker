import React, { useState, useMemo } from 'react';
import { Shield, Eye, EyeOff, KeyRound } from 'lucide-react';
import { PswRequirements, PswValidator } from "./PasswordRequirements";

const PasswordField = ({ label, value, onChange, placeholder = "••••••••" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 pl-3 pr-10 py-2.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white placeholder-slate-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 hover:text-slate-900 focus:outline-none"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};


const SettingsSecurity = ({ handleUpdatePassword, handleChange, securityData = {}, isFirstLogin = false }) => {


  


 const validation = useMemo(() => {
    const psw = securityData.Newpassword || "";
    const confirm = securityData.confirmPassword || "";

    return {
      hasMinChar: psw.length >= 8,
      hasNumber: /\d/.test(psw),
      hasUppercase: /[A-Z]/.test(psw),
      passwordsMatch: psw.length > 0 && confirm.length > 0 && psw === confirm,

      // un utente al primo login non ha l'obbligo di inserire la password attuale
      // poi ricordati di chiedere a Musti se vuole tenere questa logica
      // se è il primo login, consideriamo "hasOldPassword" come true per permettere l'aggiornamento senza inserire la vecchia password
      // devo pensare anche a cosa fare in caso di reset password da superadmin

      hasOldPassword: isFirstLogin ? true : !!securityData.Oldpassword
    };
  }, [securityData.Newpassword, securityData.confirmPassword, securityData.Oldpassword, isFirstLogin]);

  
  
  //  il bottone si attiva solo se tutti i campi sono compilati correttamente
  //  e se la nuova password soddisfa i requisiti di sicurezza
  
  const isValid = 
    validation.hasOldPassword && 
    validation.hasMinChar && 
    validation.hasNumber && 
    validation.hasUppercase && 
    validation.passwordsMatch;

  const isInvalid = !isValid;

  // Gestore del submit per il tag form
  const onSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      handleUpdatePassword?.();
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col justify-between w-full max-w-xl h-full">
      <form onSubmit={onSubmit} className="flex flex-col grow justify-between">
        <div className="p-6 pb-0 flex flex-col grow">

          <div className="flex items-center gap-4 pb-5 border-b border-slate-200 mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Shield size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-slate-900">
                {isFirstLogin ? "Primo Accesso: Imposta Password" : "Sicurezza"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFirstLogin ? "Per motivi di sicurezza, devi cambiare la password provvisoria." : "Cambia la tua password per mantenere il tuo account sicuro."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 grow">
            {/* Se è il primo login non serve la vecchia password */}
            {!isFirstLogin && (
              <PasswordField
                label="Password attuale"
                value={securityData.Oldpassword || ""}
                onChange={(e) => handleChange('Oldpassword', e.target.value)}
              />
            )}

            <PasswordField
              label="Nuova password"
              value={securityData.Newpassword || ""}
              onChange={(e) => handleChange('Newpassword', e.target.value)}
            />

            <PasswordField
              label="Conferma nuova password"
              value={securityData.confirmPassword || ""}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />

        
            <PswRequirements validation={validation} securityData={securityData} />
            
            <PswValidator validation={validation} securityData={securityData} />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end mt-6">
          <button
            type="submit"
            disabled={isInvalid}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <KeyRound size={14} />
            {isFirstLogin ? "Attiva Account e Accedi" : "Aggiorna password"}
          </button>
        </div>
      </form>
    </div>

    
  );
};

export default SettingsSecurity;