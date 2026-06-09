import { SidebarProvider, SidebarInset,SidebarTrigger} from "@/Components/ui/sidebar"; 
import AppSidebar from "./Sidebar"; 
import Header from "./Header";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { TooltipProvider } from "../ui/tooltip";
const AppLayout = ({ children, page, hideHeader = false }) => {
  const { user } = useAuthContext();

  return (
    // Il Provider avvolge tutto il layout per gestire lo stato della sidebar
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-100">
        
        
        <AppSidebar user={user} />

       
        <SidebarInset className="flex flex-col flex-1 bg-slate-50">
            
            {/* BARRA MOBILE: Questo header contiene l'hamburger visibile SOLO su schermi piccoli */}
            <header className="flex h-14 items-center gap-4 border-b bg-white px-4 md:hidden">
              <SidebarTrigger className="text-slate-700" />
              <span className="font-semibold text-sm text-slate-900"></span>
            </header>

            {/* Il tuo Header Desktop (nascondilo su mobile aggiungendo "hidden md:block" al suo interno se duplica la barra) */}
            {!hideHeader && <Header user={user} page={page} />}

            {/* Il contenuto della pagina */}
            <main className="flex-1">
              {children}
            </main>
            
          </SidebarInset>
      </div>
    </SidebarProvider>
    </TooltipProvider>
  );
};

export default AppLayout;