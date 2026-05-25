import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { User, Mail, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useUserContext } from "@/context/User/UserContext";

const ModalForUsers = () => {
  const { selectedUser, clearSelectedUser, updateUser, deleteUser, changeUserRole } = useUserContext();
  const [name, setName] = useState(selectedUser?.nome ?? "");
  const [surname, setSurname] = useState(selectedUser?.cognome ?? "");
  const [email, setEmail] = useState(selectedUser?.email ?? "");
  const [role, setRole] = useState(selectedUser?.role ?? "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!selectedUser) {
    return null;
  }

  const hasProfileChanges =
    name.trim() !== (selectedUser.nome ?? "").trim() ||
    surname.trim() !== (selectedUser.cognome ?? "").trim() ||
    email.trim() !== (selectedUser.email ?? "").trim();

  const hasRoleChanges = role !== (selectedUser.role ?? "");

  const handleCloseModal = () => {
    setDeleteConfirmOpen(false);
    clearSelectedUser();
  };

  const handleSaveProfile = async () => {
    if (!hasProfileChanges) {
      toast.info("Nessuna modifica al profilo da salvare");
      return;
    }

    try {
      await updateUser(selectedUser.id, {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
      });
      toast.success("Profilo utente aggiornato con successo");
      handleCloseModal();
    } catch (error) {
      console.error("Errore durante il salvataggio utente:", error.response?.data || error.message);
    }
  };

  const handleRoleChange = async () => {
    if (!hasRoleChanges) {
      toast.info("Il ruolo è già aggiornato");
      return;
    }

    try {
      await changeUserRole(selectedUser.id, role);
      toast.success("Ruolo utente aggiornato con successo");
      handleCloseModal();
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del ruolo");
      console.error("Errore durante l'aggiornamento del ruolo:", error.response?.data || error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      toast.success("Utente eliminato con successo");
      setDeleteConfirmOpen(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Errore durante l'eliminazione dell'utente");
      console.error("Errore durante l'eliminazione utente:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-140">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-emerald-600" />
              Modifica Utente
            </DialogTitle>
            <DialogDescription>
              Aggiorna il profilo o il ruolo. Le due azioni sono separate.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700">Nome</Label>
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
              <Label htmlFor="surname" className="text-slate-700">Cognome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
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
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between sm:justify-between items-center mt-4">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Elimina Utente
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                Annulla
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges}
              >
                Salva Profilo
              </Button>
              <Button
                variant="secondary"
                onClick={handleRoleChange}
                disabled={!hasRoleChanges}
              >
                Aggiorna Ruolo
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Conferma eliminazione
            </DialogTitle>
            <DialogDescription>
              Stai per eliminare {selectedUser.nome} {selectedUser.cognome}. Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Elimina definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalForUsers;
