import { LoginForm } from "@/Components/LoginForm";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useAuthContext();
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
<div className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden"
  style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf4 50%, #ecfdf5 100%)' }}>

  {/*TUTTO PROVVISORIO*/}
  <div className="absolute -left-10 -top-10 h-[160%] w-52"
    style={{ background: 'linear-gradient(to right, #064e3b, #065f46)', transform: 'rotate(25deg)', transformOrigin: 'top left' }} />

  <div className="absolute -left-10 -top-10 h-[160%] w-8"
    style={{ background: 'linear-gradient(to right, #34d399, #10b981)', transform: 'rotate(25deg) translateX(210px)', transformOrigin: 'top left' }} />

  
  <div className="absolute -left-10 bottom-0 h-[160%] w-52"
    style={{ background: 'linear-gradient(to right, #064e3b, #065f46)', transform: 'rotate(-25deg)', transformOrigin: 'bottom left' }} />
 
  <div className="absolute -left-10 bottom-0 h-[160%] w-8"
    style={{ background: 'linear-gradient(to right, #34d399, #10b981)', transform: 'rotate(-25deg) translateX(210px)', transformOrigin: 'bottom left' }} />
  {/* FINE PROVVISORIO */}
  
 

      <div className="w-full max-w-md space-y-1">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700">Test Tracker</h1>
          <p className="mt-1 text-md text-slate-600">Benvenuto! Inserisci i tuoi dati per continuare</p>
        </div>

       <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-emerald-200/60">
          <LoginForm
            handleSubmit={handleSubmit}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
