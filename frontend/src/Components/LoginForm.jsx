import { useState } from "react";
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { forgotPassword } from "@/services/api";
import { toast } from "sonner";

export function LoginForm({email,password,setEmail,setPassword,handleSubmit}) {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const handleOpenForgot = () => {
    setForgotEmail(email || "");
    setForgotOpen(true);
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Inserisci la tua email");
      return;
    }
    setSendingReset(true);
    try {
      await forgotPassword(forgotEmail.trim());
      toast.success("Controlla la tua email per le istruzioni di reset.");
      setForgotOpen(false);
    } catch {
      toast.error("Errore durante l'invio della richiesta. Riprova.");
    } finally {
      setSendingReset(false);
    }
  };

  return  (
    <Card className="border-none shadow-none bg-transparent px-3">
      <CardHeader className="p-0 h-0" />
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Campo Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-900 ml-1">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                Password
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleOpenForgot}
              className="ml-1 justify-self-start text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Password dimenticata?
            </button>
          </div>

          {/* Pulsante Accedi */}
          <Button
            type="submit"
            className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            Accedi al portale
          </Button>
        </form>
      </CardContent>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              Password dimenticata
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Inserisci la tua email: se è registrata, riceverai un link per impostare una nuova password.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="forgot-email" className="text-sm font-medium text-slate-900">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="nome@esempio.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setForgotOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleForgotSubmit}
              disabled={sendingReset}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {sendingReset ? "Invio in corso..." : "Invia link di reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
export default LoginForm;
