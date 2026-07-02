import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";

// Pulsante icona riutilizzabile per le colonne "Azioni" delle tabelle.
// NOTA: `color` deve includere anche l'hover:text-* esplicito (es. "text-blue-600 hover:text-blue-700 hover:bg-blue-100"):
// il variant "ghost" applica hover:text-foreground che altrimenti vince sull'hover, rendendo l'icona grigia.
// Non si può costruire questa classe dinamicamente (es. `hover:${colore}`), perché Tailwind
// genera il CSS solo per classi presenti come stringa letterale nel sorgente.
const TableActionButton = ({ onClick, icon, color,action,...props }) => {
  const Icon = icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClick}
          aria-label={action}
          className={`h-9 w-9 rounded-lg transition-colors duration-150 cursor-pointer ${color}`}
          {...props}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      {action && <TooltipContent>{action}</TooltipContent>}
    </Tooltip>
  );
};

export default TableActionButton;
