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

const ProjectHeader = ({ modalOpen, setModalOpen, formData, setFormData, search, setSearch, addProject }) => {

  const handleAdd = () => {
    addProject();
  
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 p-4 bg-white border-b border-slate-100">
      
      {/* Search Input Group */}
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cerca progetto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 focus-visible:ring-emerald-500"
        />
      </div>

      {/* Add Project Button */}
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 h-10 transition-all active:scale-95"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>

     
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Nuovo Progetto</DialogTitle>
            <DialogDescription>
              Inserisci le informazioni di base per il nuovo progetto.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Project Name Field */}
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
            
            {/* Description Field */}
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
    </div>
  );
};

export default ProjectHeader;