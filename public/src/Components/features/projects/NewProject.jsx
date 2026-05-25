import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

const NewProject = ({ modalOpen, setModalOpen, handleAddProject, formData, setFormData }) => {
	return (
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
						<label htmlFor="name" className="text-slate-700">Project Name</label>
						<input
							id="name"
							placeholder="Nome del progetto..."
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className="h-10 rounded-md border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>

					<div className="grid gap-2">
						<label htmlFor="description" className="text-slate-700">Description</label>
						<textarea
							id="description"
							placeholder="Di cosa tratta questo progetto?"
							rows={4}
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className="min-h-24 rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
						onClick={handleAddProject}
						className="bg-emerald-600 text-white hover:bg-emerald-700"
					>
						Create Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NewProject;
