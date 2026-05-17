import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar"; // Importa i componenti Shadcn
import AppSidebar from "./Sidebar"; // La tua nuova Sidebar (quella che abbiamo scritto prima)
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "sonner";
const AppLayout = ({ children, page }) => {
  const { user } = useAuth();

  return (
    // Il Provider avvolge tutto il layout per gestire lo stato della sidebar
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-100">
        
        
        <AppSidebar user={user} />

       
        <SidebarInset className="flex flex-col flex-1 bg-slate-50">
        <Toaster richColors  position="bottom-right" />
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