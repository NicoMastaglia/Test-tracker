import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/Components/ui/button";

// Error Boundary React: cattura errori di rendering non gestiti in qualsiasi punto
// dell'albero (es. un campo null/undefined non previsto dal backend) mostrando un
// fallback invece di far collassare l'intera SPA a schermo bianco. Deve restare una
// class component: non esiste un equivalente hook di componentDidCatch/getDerivedStateFromError.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }



  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Errore non gestito nell'interfaccia:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Qualcosa è andato storto</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Si è verificato un errore imprevisto. Prova a ricaricare la pagina; se il problema persiste, contatta un amministratore.
          </p>
          <Button onClick={() => window.location.reload()} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Ricarica la pagina
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
