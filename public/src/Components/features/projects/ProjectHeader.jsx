import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ActionBar from '@/utils/ActionBar';

const ProjectHeader = ({ modalOpen, setModalOpen, formData, setFormData, search, setSearch, addProject, canCreateProject = true }) => {

  const handleAdd = () => {
    addProject();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      
      <ActionBar
        search={search}
        setSearch={setSearch}
        placeholder="Cerca progetto..."
        buttonText={canCreateProject ? "Add Project" : null}
        onButtonClick={canCreateProject ? () => setModalOpen(true) : undefined}
        buttonVariant="emerald"
      />
     
      {canCreateProject && (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Nuovo Progetto</DialogTitle>
            <DialogDescription>
              Inserisci le informazioni di base per il nuovo progetto.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700">Project Name</Label>
              <Input 
                id="name"
                placeholder="Nome del progetto..."
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus-visible:ring-emerald-500"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700">Description</Label>
              <Textarea 
                id="description"
                placeholder="Di cosa tratta questo progetto?"
                rows={4}
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="focus-visible:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setModalOpen(false)}
              className="hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
};

export default ProjectHeader;
