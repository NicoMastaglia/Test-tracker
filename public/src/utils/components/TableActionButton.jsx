import { Button } from "@/Components/ui/button";

// Pulsante icona riutilizzabile per le colonne "Azioni" delle tabelle
const TableActionButton = ({ onClick, icon, color,action,...props }) => {
  const Icon = icon;
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      title={action}
      className={`h-8 w-8 rounded-lg transition-colors ${color} cursor-pointer`}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default TableActionButton;
