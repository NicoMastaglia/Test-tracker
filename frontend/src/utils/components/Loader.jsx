import { Loader2 } from "lucide-react";

// Spinner semplice da mostrare quando uno stato di loading è true.
const Loader = ({ label = "Caricamento...", className = "" }) => (
  <div className={`flex items-center justify-center gap-2 py-10 text-sm text-slate-500 ${className}`}>
    <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
    {label && <span>{label}</span>}
  </div>
);

export default Loader;
