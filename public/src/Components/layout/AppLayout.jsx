import { SidebarProvider, SidebarInset,SidebarTrigger} from "@/Components/ui/sidebar"; 
import AppSidebar from "./Sidebar"; 
import Header from "./Header";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { TooltipProvider } from "../ui/tooltip";
import { Menu } from "lucide-react";
const AppLayout = ({ children, page, hideHeader = false }) => {
  const { user } = useAuthContext();

  return (
    // Il Provider avvolge tutto il layout per gestire lo stato della sidebar
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-100">
        
        
        <AppSidebar user={user} />

       
        <SidebarInset className="flex flex-col flex-1 bg-slate-50">
            
            
          <header className="flex h-14 items-center gap-4 border-b border-[#0B1F45] bg-[#07142B] px-4 md:hidden">
             <SidebarTrigger className="text-[#F5F7FA] hover:bg-[#0E3B52] rounded-md">
              <Menu className="h-5 w-5" /> 
            </SidebarTrigger>
             <span className="font-semibold text-sm text-[#F5F7FA]">Menu</span>
        </header>
   

        
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