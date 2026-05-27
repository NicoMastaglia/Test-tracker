import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const AssignDialog = ({ assignProject, onClose, availableUsers, selectedUserId, setSelectedUserId, handleAssignUser, handleUnassignUser }) => (
  <Dialog open={!!assignProject} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-110">
      <DialogHeader>
        <DialogTitle>Gestisci assegnazione utente</DialogTitle>
        <DialogDescription>Seleziona utente da assegnare o rimuovere dal progetto.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label>Utente</Label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona utente" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {(user.nome ?? user.name ?? "")} {(user.cognome ?? user.surname ?? "")} - {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annulla</Button>
        <Button variant="secondary" onClick={handleUnassignUser} disabled={!selectedUserId}>Rimuovi</Button>
        <Button onClick={handleAssignUser} disabled={!selectedUserId}>Assegna</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AssignDialog;
