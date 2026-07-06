import { useState } from "react";
import { PlayCircle, CheckIcon, Loader2 } from "lucide-react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/Components/ui/command";
import { withMinDuration } from "@/utils/helpers/withMinDuration";
import { getDeadlineStatus } from "@/utils/helpers/tableHelpers";

// Modale dedicata (non ModalForm): per multi-select con Command+checkbox

// tasksByProject arriva già raggruppato dal genitore (Sessions.jsx): [{ projectId, projectName, tasks }]
const CreateSessionModal = ({ modalOpen, setModalOpen, tasksByProject = [], onSubmit }) => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [creatingSession, setCreatingSession] = useState(false);

  // cambiando progetto le task del progetto precedente non sono più valide da includere
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedTaskIds([]);
  };

  const resetForm = () => {
    setSelectedProjectId("");
    setSelectedTaskIds([]);
  };

  const handleOpenChange = (open) => {
    setModalOpen(open);
    if (!open) resetForm();
  };

  const toggleTask = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedTaskIds.length === 0) return;
    setCreatingSession(true);
    try {
      await withMinDuration(onSubmit?.(selectedTaskIds));
      resetForm();
    } finally {
      setCreatingSession(false);
    }
  };

  const currentProjectTasks = [
    ...(tasksByProject.find((p) => String(p.projectId) === selectedProjectId)?.tasks ?? []),
  ].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <PlayCircle className="h-5 w-5 text-emerald-500" />
            Crea nuova sessione
          </DialogTitle>
          <DialogDescription>
            Seleziona il progetto, poi le task assegnate da includere nella sessione.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="session-project" className="text-slate-900">
              Progetto
            </Label>
            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
              <SelectTrigger id="session-project" className="w-full">
                <SelectValue placeholder="Seleziona un progetto" />
              </SelectTrigger>
              <SelectContent>
                {tasksByProject.map((p) => (
                  <SelectItem key={p.projectId} value={String(p.projectId)}>
                    {p.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProjectId && (
            <div className="grid gap-2">
              <Label className="text-slate-900">Task assegnate</Label>
              <Command className="rounded-lg border border-slate-200">
                <CommandInput placeholder="Cerca task..." />
                <CommandList>
                  <CommandEmpty>Nessuna task lavorabile in questo progetto.</CommandEmpty>
                  <CommandGroup>
                    {currentProjectTasks.map((task) => {
                      const isSelected = selectedTaskIds.includes(task.id);
                      const deadlineStatus = getDeadlineStatus(task.deadline);
                      return (
                        <CommandItem
                          key={task.id}
                          value={`${task.description} ${task.checklist_title ?? ""}`}
                          onSelect={() => toggleTask(task.id)}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3" />}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm text-slate-900">{task.description}</span>
                            {task.checklist_title && (
                              <span className="text-xs text-slate-400">{task.checklist_title}</span>
                            )}
                          </span>
                          {deadlineStatus.hasDeadline && (
                            <span className={`ml-2 shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${deadlineStatus.colorClass}`}>
                              {deadlineStatus.label}
                              {deadlineStatus.isOverdue && " (scaduta)"}
                            </span>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
              <p className="text-xs text-slate-500">
                {selectedTaskIds.length} task selezionate
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={creatingSession} className="hover:bg-slate-100">
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={selectedTaskIds.length === 0 || creatingSession}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {creatingSession ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creazione...
                </>
              ) : (
                "Crea Sessione"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
