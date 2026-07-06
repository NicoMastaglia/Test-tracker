import React, { useState, useMemo } from 'react';
import { Shield, Eye, EyeOff, KeyRound } from 'lucide-react';
import { PswRequirements } from "./PasswordRequirements";

// isValid: undefined = nessun controllo client-side possibile (es. password attuale) -> anello standard
//          true = il campo è valido -> anello verde
//          false = il campo non è (ancora) valido -> anello standard, niente rosso finché l'utente sta scrivendo
const PasswordField = ({ label, value, onChange, onFocus, isValid, placeholder = "••••••••" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const ringClass = isValid
    ? "focus:ring-emerald-500/20 focus:border-emerald-500"
    : "focus:ring-slate-400/20 focus:border-slate-400";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-muted-foreground text-left">{label}</label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-border pl-3 pr-10 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 bg-card placeholder-muted-foreground ${ringClass}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};


const SettingsSecurity = ({ handleUpdatePassword, handleChange, securityData = {}, isFirstLogin = false }) => {
  // i requisiti si mostrano solo dopo che l'utente ha messo a fuoco il campo
  // "Nuova password" almeno una volta, non appena la pagina si apre
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

 const validation = useMemo(() => {
    const psw = securityData.Newpassword || "";
    const confirm = securityData.confirmPassword || "";

    return {
      hasMinChar: psw.length >= 8,
      passwordsMatch: psw.length > 0 && confirm.length > 0 && psw === confirm,
      hasOldPassword: isFirstLogin ? true : !!securityData.Oldpassword,
    };
  }, [securityData.Newpassword, securityData.confirmPassword, securityData.Oldpassword, isFirstLogin]);

  const newPasswordValid = validation.hasMinChar;

  //  il bottone si attiva solo se tutti i campi sono compilati correttamente
  //  e se la nuova password soddisfa i requisiti di sicurezza

  const isValid =
    validation.hasOldPassword &&
    newPasswordValid &&
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
    <div className="bg-card border border-border shadow-sm rounded-2xl flex flex-col justify-between w-full max-w-xl h-full">
      <form onSubmit={onSubmit} className="flex flex-col grow justify-between">
        <div className="p-6 pb-0 flex flex-col grow">

          <div className="flex items-center gap-4 pb-5 border-b border-border mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              <Shield size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-foreground">
                {isFirstLogin ? "Primo Accesso: Imposta Password" : "Sicurezza"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
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
              onFocus={() => setNewPasswordFocused(true)}
              isValid={newPasswordValid}
            />

            <PasswordField
              label="Conferma nuova password"
              value={securityData.confirmPassword || ""}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              isValid={validation.passwordsMatch}
            />

            {newPasswordFocused && <PswRequirements validation={validation} />}
          </div>
        </div>

        <div className="p-4 bg-muted/50 border-t border-border rounded-b-2xl flex justify-end mt-6">
          <button
            type="submit"
            disabled={isInvalid}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
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
