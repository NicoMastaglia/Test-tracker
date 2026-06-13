import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Mail, Lock } from "lucide-react";

export function LoginForm({email,password,setEmail,setPassword,handleSubmit}) {

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
              <Label htmlFor="password" university className="text-sm font-medium text-slate-900">
                Password
              </Label>
              <a href="#" className="text-xs text-emerald-600 hover:underline">
                Password dimenticata?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
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
    </Card>
  );
}
export default LoginForm;
