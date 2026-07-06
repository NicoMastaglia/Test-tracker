import { useState } from "react";
import { ClipboardCheck, ThumbsUp, ThumbsDown } from "lucide-react";
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
import { Textarea } from "@/Components/ui/textarea";

// Nota per chi la usa: il genitore deve montare questa modale con
// key={task?.checklist_item_id}, così cambiando task React la rimonta da zero
// e lo stato interno (outcome/nota) riparte sempre dai valori della task giusta,
// invece di restare "sporco" con i valori della task precedente.
const UpdateOutcomeModal = ({ modalOpen, setModalOpen, task, onSubmit }) => {
  const [outcome, setOutcome] = useState(task?.outcome ?? "");
  const [note, setNote] = useState(task?.note ?? "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!outcome) return;
    await onSubmit?.(outcome, note);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <ClipboardCheck className="h-5 w-5 text-emerald-500" />
            Aggiorna esito
          </DialogTitle>
          <DialogDescription>{task?.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label className="text-foreground">Esito</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOutcome("Positivo")}
                className={outcome === "Positivo" ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/10 dark:text-emerald-400" : ""}
              >
                <ThumbsUp className="h-4 w-4" />
                Positivo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOutcome("Negativo")}
                className={outcome === "Negativo" ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/10 dark:text-red-400" : ""}
              >
                <ThumbsDown className="h-4 w-4" />
                Negativo
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="outcome-note" className="text-foreground">
              Nota (opzionale)
            </Label>
            <Textarea
              id="outcome-note"
              placeholder="Aggiungi una nota su come è andata la task..."
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="hover:bg-muted">
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={!outcome}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Salva esito
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOutcomeModal;
