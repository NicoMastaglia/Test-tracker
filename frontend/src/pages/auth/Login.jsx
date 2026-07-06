import { LoginForm } from "@/Components/LoginForm";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login effettuato");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Login fallito");
    }
  };

  return (
<div className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden bg-background">

      <div className="w-full max-w-md space-y-1">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Test Tracker</h1>
          <p className="mt-1 text-md text-muted-foreground">Benvenuto! Inserisci i tuoi dati per continuare</p>
        </div>

       <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <LoginForm
            handleSubmit={handleSubmit}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
