import { Badge } from "@/Components/ui/badge";

// Etichetta condivisa per i dati non ancora forniti dal backend
export const NOT_AVAILABLE = "Non disponibile";

// Testo grigio da usare al posto di un valore non ancora disponibile
export const NotAvailable = () => (
  <span className="text-sm font-normal text-slate-400">{NOT_AVAILABLE}</span>
);

// Badge grigio da usare al posto di un badge non ancora disponibile (es. tipo, priorità, stato)
export const PlaceholderBadge = () => (
  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-400">
    {NOT_AVAILABLE}
  </Badge>
);
