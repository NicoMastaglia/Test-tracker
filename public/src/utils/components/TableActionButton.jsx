import { Button } from "@/Components/ui/button";

// Pulsante icona riutilizzabile per le colonne "Azioni" delle tabelle
const TableActionButton = ({ onClick, icon, color }) => {
  const Icon = icon;
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={`h-8 w-8 text-slate-400 rounded-lg transition-colors ${color}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default TableActionButton;
