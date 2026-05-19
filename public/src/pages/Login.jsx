import { LoginForm } from "@/Components/Login-Form"

import { useAuth } from "@/context/Auth.js/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


function LoginPage() {

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


 const handleSubmit = async (e) => {

   e.preventDefault()

   const result = await login(email,password)

   if(result.success){

      toast.success("Login effettuato")

      navigate("/dashboard")

   } else {

      toast.error(result.error)
   }
}

  return (

    


// Wrapper principale
<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 ">
  <div className="w-full max-w-md space-y-2">
    
    {/* Header */}
    <div className="text-center">
      <h1 className="text-5xl font-extrabold text-emerald-700 tracking-tight">
        Test Tracker
      </h1>
      <p className="mt-2 text-md text-slate-600">
        Benvenuto! Inserisci i tuoi dati per continuare
      </p>
    </div>

    {/* Form Card */}
    <div className="bg-white p-8 shadow-2xl shadow-slate-200 rounded-2xl border border-slate-100">
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
   
  )
}

export default LoginPage;