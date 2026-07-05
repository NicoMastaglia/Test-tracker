import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { setupAccount, verifySetupToken } from "@/services/api";
import { PswRequirements } from "@/Components/features/settings/PasswordRequirements";

const SetupAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  // stato del token: null = verifica in corso, true = valido, false = non valido/scaduto/già usato
  const [tokenValid, setTokenValid] = useState(token ? null : false);

  const validation = useMemo(() => ({
    hasMinChar: password.length >= 8,
    passwordsMatch: password.length > 0 && confirm.length > 0 && password === confirm,
  }), [password, confirm]);

  useEffect(() => {
    if (!token) return;
    verifySetupToken(token)
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token]);

  if (tokenValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Verifica del link in corso...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">
            Link non valido, scaduto o già utilizzato. Richiedi un nuovo link dalla pagina di login.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("La password deve essere di almeno 8 caratteri.");
      return;
    }
    if (password !== confirm) {
      toast.error("Le password non coincidono.");
      return;
    }

    setLoading(true);
    try {
      await setupAccount(token, password);
      toast.success("Password impostata. Puoi ora effettuare il login.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Link non valido o scaduto.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-1">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Test Tracker</h1>
          <p className="mt-1 text-md text-slate-500">Imposta la tua password per accedere alla piattaforma</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Almeno 8 caratteri"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm">Conferma password</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Ripeti la password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {passwordFocused && <PswRequirements validation={validation} />}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              {loading ? "Salvataggio..." : "Imposta password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupAccount;
