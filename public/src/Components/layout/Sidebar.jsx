import * as React from "react"
import { 
  Home, 
  Repeat, 
  Folder, 
  Users, 
  LogOut, 
  CheckCircle,
  Terminal,      // Icona per l'ambiente Tester
  ShieldAlert,   // Icona per l'ambiente Superadmin
  Briefcase      // Icona per l'ambiente Admin standard
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/Auth.js/AuthContext"
import { toast } from "sonner";
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
} from "@/components/ui/sidebar"

// Configurazione dinamica dei titoli in base al ruolo utente
const ROLE_CONSOLE_CONFIG = {
  superadmin: {
    title: "Console Root",
    subtitle: "Super Administrator",
    icon: ShieldAlert,
  },
  admin: {
    title: "Workspace Admin",
    subtitle: "Gestione Progetti & Team",
    icon: Briefcase,
  },
  tester: {
    title: "Testing Env",
    subtitle: "Analisi & Debug",
    icon: Terminal,
  }
}

const menuItems = [
  { text: "Dashboard", path: "/dashboard", roles: ["tester", "admin", "superadmin"], icon: Home },
  { text: "Sessions", path: "/admin/sessions", roles: ["admin", "superadmin"], icon: Repeat },
  { text: "Projects", path: "/admin/projects", roles: ["admin", "superadmin"], icon: Folder },
  { text: "Users", path: "/admin/users", roles: ["superadmin"], icon: Users },
  { text: "Team", path: "/admin/team", roles: ["admin"], icon: Users },
  { text: "Checklist", path: "/admin/checklist", roles: ["admin"], icon: CheckCircle },
  { text: "My Sessions", path: "/sessions-test", roles: ["tester"], icon: CheckCircle }
]

export default function AppSidebar() {
  const { logoutUser, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Recupera la configurazione del ruolo (con fallback di sicurezza)
  const roleConfig = ROLE_CONSOLE_CONFIG[user?.role] || {
    title: "Console",
    subtitle: user?.role || "Utente aziendale",
    icon: Terminal,
  }
  
  const RoleIcon = roleConfig.icon

  const handleLogout = () => {

    const token = localStorage.getItem("auth_token");

    if(!token){
      toast.error("Token di autenticazione mancante. Impossibile effettuare il logout.");
      return;
    }

    const confirmLogout = window.confirm("Sei sicuro di voler uscire?");

    if(confirmLogout){
      logoutUser(token);
      toast.success("Logout effettuato con successo!");
      navigate("/login");
    }
    
   


   
  }

  return (
    <Sidebar 
      collapsible="icon" 
      variant="sidebar" 
      className="border-r border-slate-200 bg-white text-slate-600"
    > 
      
      {/* HEADER: RUOLO DINAMICO */}
      <SidebarHeader className="flex flex-col gap-2 p-4 border-b border-slate-100 justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
        
       
        <div className="flex items-center justify-between w-full bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 bg-white text-slate-700 rounded-md flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <RoleIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-[11px] text-slate-900 leading-none tracking-wide">{roleConfig.title}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 truncate">{roleConfig.subtitle}</span>
            </div>
          </div>
          <SidebarTrigger className="text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 rounded-md h-7 w-7 ml-1 shrink-0" /> 
        </div>

        <div className="hidden group-data-[collapsible=icon]:block">
          <SidebarTrigger className="text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md" />
        </div>
      </SidebarHeader>

      {/* CONTENUTO PRINCIPALE */}
      <SidebarContent className="gap-0 pt-3 bg-white">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2 group-data-[collapsible=icon]:hidden">
            Menu Amministrazione
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                  
                  return (
                    <SidebarMenuItem key={item.text}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        tooltip={item.text}
                        className={`w-full transition-all duration-150 rounded-lg py-2 h-9 font-medium text-xs
                          ${isActive 
                            ? "bg-slate-100 text-slate-900 font-semibold" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        <button 
                          onClick={() => navigate(item.path)}
                          className="flex items-center w-full gap-3 px-2.5"
                        >
                         
                          <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{item.text}</span>
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
      <SidebarFooter className="p-2 border-t border-slate-100 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              tooltip="Disconnetti"
              className="w-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 font-medium py-2 h-9 rounded-lg transition-colors group"
            >
              <div className="flex items-center w-full gap-3 px-2.5">
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Disconnetti</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}