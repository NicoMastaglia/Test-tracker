import { Button } from "@/Components/ui/button";
import { Check, ChevronDown, RefreshCcw } from "lucide-react";
import { NOT_AVAILABLE } from "@/utils/components/Placeholder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

// Bottone "Cambia stato" riutilizzabile: mostra lo stato corrente e apre un menu
// con gli stati selezionabili. Le opzioni (e quali sono abilitate) le decide il parent,
// così le regole di transizione restano fuori da questo componente.
// options: [{ value, dotClass, disabled }]
const StatusDropdown = ({ currentStatus, options = [], onSelect }) => {
  const current = options.find((option) => option.value === currentStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-2 rounded-lg border-border bg-card text-foreground shadow-sm transition-all hover:border-muted-foreground/40 hover:bg-muted hover:shadow"
        >
          <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />
          Cambia stato
          <span className={`inline-block h-2 w-2 rounded-full ${current?.dotClass ?? "bg-slate-300"}`} />
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-44">
        <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Stato: {currentStatus ?? NOT_AVAILABLE}
        </p>

        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={option.disabled}
            onClick={() => onSelect?.(option.value)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${option.dotClass}`} />
              {option.value}
            </span>
            {option.value === currentStatus && <Check className="h-4 w-4 text-emerald-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
