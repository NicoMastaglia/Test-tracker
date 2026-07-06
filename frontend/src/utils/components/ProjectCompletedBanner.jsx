import { Lock } from "lucide-react";

// banner riusato ovunque un progetto Completato blocchi la creazione/modifica
// di checklist o task, per spiegare il motivo invece di nascondere e basta i controlli
const ProjectCompletedBanner = ({ className = "" }) => (
  <div className={`flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 ${className}`}>
    <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
    Progetto completato: non è possibile modificare task o checklist.
  </div>
);

export default ProjectCompletedBanner;
