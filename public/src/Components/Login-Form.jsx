import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom";

export function LoginForm({login,email,password,setEmail,setPassword}) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const isLoggedIn = login(email, password);

    if (isLoggedIn === true) {
      navigate("/dashboard");
      
    }
  };


  return  (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="space-y-1 p-0 pb-6 text-center">
        {/* <CardDescription className="text-slate-500 text-base">
          Inserisci le tue credenziali per accedere
        </CardDescription> */}
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Campo Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@esempio.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Campo Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" university className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <a href="#" className="text-xs text-emerald-600 hover:underline">
                Password dimenticata?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Pulsante Accedi */}
          <Button 
            type="submit" 
            className="w-full h-11 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
          >
            Accedi al portale
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default LoginForm;