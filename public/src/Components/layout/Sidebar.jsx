import React,{useState}from "react"
import { 
  Home, 
  Repeat, 
  Folder, 
  Users, 
  LogOut, 
  CheckCircle,
  Terminal,      // Icona per l'ambiente User
  ShieldAlert,   // Icona per l'ambiente Superadmin
  Briefcase,
  Settings    // Icona per l'ambiente Admin standard
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../context/Auth/AuthContext"
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/Components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { AlertTriangle } from "lucide-react";

// Configurazione dinamica dei titoli in base al ruolo utente
const ROLE_CONSOLE_CONFIG = {
  superadmin: {
    title: "SuperAdmin  ",
    subtitle: "Pannello di Controllo",
    icon: ShieldAlert,
  },
  admin: {
    title: "Workspace Admin",
    subtitle: "QA Testing Platform",
    icon: Briefcase,
  },
  user: {
    title: "Testing Env",
    subtitle: "Analisi & Debug",
    icon: Terminal,
  }
}

const menuItemsByRole = {
  user: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "My Sessions", path: "/sessions-test", icon: CheckCircle },
    { text: "My Projects", path: "/user/projects", icon: Folder },
    { text: "Checklist", path: "/user/checklists", icon: CheckCircle },
    {text: 'Impostazioni account', path: "/settings", icon: Settings}
  ],
  admin: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "Sessions", path: "/admin/sessions", icon: Repeat },
    { text: "Projects", path: "/admin/projects", icon: Folder },
    { text: "Team", path: "/admin/team", icon: Users },
    { text: "Checklist", path: "/admin/checklists", icon: CheckCircle },
    {text: 'Impostazioni account', path: "/settings", icon: Settings}
  ],
  superadmin: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "Projects", path: "/admin/projects", icon: Folder },
    { text: "Users", path: "/admin/users", icon: Users },
    { text: "Audit Log", path: "/admin/audit-log", icon: ShieldAlert },
    { text: "Impostazioni  ", path: "/settings", icon: Settings },
  ],
 
}

export default function AppSidebar() {
  const { logoutUser, user } = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const menuItems = menuItemsByRole[user?.role] || [];

  // Recupera la configurazione del ruolo (con fallback di sicurezza)
  const roleConfig = ROLE_CONSOLE_CONFIG[user?.role] || {
    title: "Console",
    subtitle: user?.role || "Utente aziendale",
    icon: Terminal,
  }
  
  const RoleIcon = roleConfig.icon

  const handleLogout = () => {
    setDeleteConfirmOpen(true);

    const token = localStorage.getItem("auth_token");

    if(!token){
      toast.error("Token di autenticazione mancante. Impossibile effettuare il logout.");
      return;
    }

    


      logoutUser(token);
      toast.success("Logout effettuato con successo!");
      navigate("/login");
    
    
   


   
  }

  return (
    <>
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="text-[#F5F7FA] **:data-[slot=sidebar-inner]:bg-linear-to-b **:data-[slot=sidebar-inner]:from-[#07142B] **:data-[slot=sidebar-inner]:to-[#0B1F45] **:data-[slot=sidebar-inner]:text-[#F5F7FA]"
    >

      {/* HEADER: RUOLO DINAMICO */}
      <SidebarHeader className="flex flex-col gap-2 p-4 justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">


        <div className="flex items-center justify-between w-full bg-[#0B1F45]/80 rounded-xl p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 bg-[#07142B] text-[#14D8A6] rounded-md flex items-center justify-center shadow-sm shrink-0">
              <RoleIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[12px] text-[#F5F7FA] leading-none tracking-wide">{roleConfig.title}</span>
              <span className="text-[11px] text-[#F5F7FA] mt-1 truncate">{roleConfig.subtitle}</span>
            </div>
          </div>
          <SidebarTrigger className="text-[#94A3B8] hover:bg-[#0E3B52] hover:text-[#AFC4E2] rounded-md h-7 w-7 ml-1 shrink-0" />
        </div>

        <div className="hidden group-data-[collapsible=icon]:block">
          <SidebarTrigger className="text-[#94A3B8] hover:bg-[#0E3B52] hover:text-[#AFC4E2] rounded-md" />
        </div>
      </SidebarHeader>

      {/* CONTENUTO PRINCIPALE */}
      <SidebarContent className="gap-0 pt-3 bg-transparent">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wide text-[#F5F7FA] px-2 mb-3 group-data-[collapsible=icon]:hidden">
            Menu Amministrazione
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

                return (
                  <SidebarMenuItem key={item.text}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.text}
                      className={`w-full transition-all duration-150 rounded-xl py-2.5 h-10 text-sm data-[active=true]:text-[#F5F7FA]! data-[active=true]:font-normal
                        ${isActive
                          ? "bg-linear-to-r from-[#0E3B52] via-[#0F6A67] to-[#10B981]/45 text-[#F5F7FA] shadow-[0_0_14px_rgba(20,216,166,0.26)]"
                            : "text-[#F5F7FA] hover:bg-[#0B1F45] hover:text-[#F5F7FA]"}`}
                    >
                      <button
                        onClick={() => navigate(item.path)}
                        className="flex items-center w-full gap-3 px-2.5"
                      >

                        <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#14D8A6]" : "text-[#94A3B8]"}`} />
                        <span className="truncate text-sm group-data-[collapsible=icon]:hidden">{item.text}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER: DISCONNESSIONE UTENTE */}
      <SidebarFooter className="p-2 bg-transparent">
        <SidebarMenu>
          {/* <SidebarMenuItem>
              <SidebarMenuButton 
              onClick={()=>navigate("/settings")}
              tooltip="Impostazioni account"
              className="w-full text-[#F5F7FA] hover:bg-slate-500/15 hover:text-slate-300 py-2 h-9 rounded-lg transition-colors"
              >

                <div className="flex items-center w-full gap-3 px-2.5">
                  <Settings className="w-4 h-4 text-[#94A3B8] shrink-0" />
                   <span className="group-data-[collapsible=icon]:hidden text-sm text-[#F5F7FA]">Impostazioni</span>
                </div>
              </SidebarMenuButton>
                
              
           
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={()=>setDeleteConfirmOpen(true)}
              tooltip="Disconnetti"
              className="w-full text-[#F5F7FA] hover:bg-rose-500/15 hover:text-rose-300 py-2 h-9 rounded-lg transition-colors"
            >
              <div className="flex items-center w-full gap-3 px-2.5">
                <LogOut className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Esci</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>


      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Conferma  disconnessione
            </DialogTitle>
            <DialogDescription>
              Sei sicuro di voler uscire? Tutti i progressi non salvati potrebbero andare persi.
            </DialogDescription>
          </DialogHeader>
          

          <DialogFooter>
            <Button variant="outline" onClick={()=>setDeleteConfirmOpen(false)}>Annulla</Button>
            <Button variant="destructive" onClick={handleLogout}>Effettua Disconessione</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
   
      
      </>
      
  )
}