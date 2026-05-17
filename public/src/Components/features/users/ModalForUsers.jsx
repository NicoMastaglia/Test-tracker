import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, ShieldCheck } from "lucide-react";

const ModalForUsers = ({ user, setModal }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
  
    console.log("Salvataggio:", { name, email, role });
    setModal(null); // Chiude la modale nel parent
  };

  return (
  
    <Dialog open={true} onOpenChange={() => setModal(null)}>
      <DialogContent className="sm:max-w-112.5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-emerald-600" />
            Modifica Utente
          </DialogTitle>
          <DialogDescription>
            Aggiorna i dettagli del profilo e i permessi di accesso dell'utente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
  
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700">Nome Completo</Label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input
                 id="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="pl-10 focus-visible:ring-emerald-500"
               />
            </div>
          </div>


          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-700">Indirizzo Email</Label>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input
                 id="email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="pl-10 focus-visible:ring-emerald-500"
               />
            </div>
          </div>

   
          <div className="grid gap-2">
            <Label className="text-slate-700">Ruolo Piattaforma</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full focus:ring-emerald-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Seleziona un ruolo" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="tester">Tester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between items-center mt-4">
    
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => { /* Logica elimina da inserire */ }}
          >
            Elimina Utente
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setModal(null)}>
              Annulla
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSave}
            >
              Salva Modifiche
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForUsers;