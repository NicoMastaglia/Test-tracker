import React, { useState } from "react";
import { useProjectContext } from "@/context/Project/ProjectContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react"; // Icone per un look più rifinito

const ProjectActions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projectUpdate, setProjectUpdate] = useState({
    name: '',
    description: '',
    users: []
  });
  const [val, setVal] = useState('');

  const { addProject } = useProjectContext();

  const handleAddProject = () => {
    // Qui puoi aggiungere la logica di validazione prima di addProject
    addProject(projectUpdate);
    setModalOpen(false); // Chiude il dialog dopo l'invio
    setProjectUpdate({ name: '', description: '', users: [] }); // Reset form
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      
      {/* Search Bar con Icona */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cerca progetti..."
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="pl-10 focus:ring-emerald-500"
        />
      </div>

      {/* Dialog per Aggiungere Progetto */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nuovo Progetto
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Crea Nuovo Progetto</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del progetto qui sotto. Clicca su salva quando hai finito.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nome Progetto */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Progetto</Label>
              <Input
                id="name"
                value={projectUpdate.name}
                onChange={(e) => setProjectUpdate({...projectUpdate, name: e.target.value})}
                placeholder="Es. Beta Testing App"
              />
            </div>

            {/* Descrizione */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descrizione</Label>
              <Input
                id="description"
                value={projectUpdate.description}
                onChange={(e) => setProjectUpdate({...projectUpdate, description: e.target.value})}
                placeholder="Breve descrizione del progetto..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddProject}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Salva Progetto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectActions;