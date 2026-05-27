import { SidebarProvider, SidebarInset} from "@/Components/ui/sidebar"; // Importa i componenti Shadcn
import AppSidebar from "./Sidebar"; // La tua nuova Sidebar (quella che abbiamo scritto prima)
import Header from "./Header";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { TooltipProvider } from "../ui/tooltip";
const AppLayout = ({ children, page }) => {
  const { user } = useAuthContext();

  return (
    // Il Provider avvolge tutto il layout per gestire lo stato della sidebar
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-100">
        
        
        <AppSidebar user={user} />

       
        <SidebarInset className="flex flex-col flex-1 bg-slate-50">
          {/*  Header */}
          <Header user={user} page={page} />

          {/* Il contenuto della pagina */}
          <main className="p-4 md:p-6">
            {children}
          </main>
          
        </SidebarInset>
      </div>
    </SidebarProvider>
    </TooltipProvider>
  );
};

export default AppLayout;