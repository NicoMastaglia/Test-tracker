import React, { useState } from "react";

import {
  Home,
  Repeat,
  Folder,
  Users,
  LogOut,
  CheckCircle,
  ListChecks,
  Terminal, // Icona per l'ambiente User
  Briefcase,
  Settings, // Icona per l'ambiente Admin standard
  Activity,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/Auth/AuthContext";
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
} from "@/Components/ui/sidebar";

import { Menu } from "lucide-react";
import { getInitials, getFullName } from "@/utils/helpers/tableHelpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

// Configurazione dinamica dei titoli in base al ruolo utente

const userConfig = ({ user }) => {
  const name = getFullName(user);
  const title = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Utente";
  return { name, title };
};

const menuItemsByRole = {
  user: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "I miei lavori", path: "/sessions-test", icon: CheckCircle },
    { text: "Le mie task", path: "/user/tasks", icon: ListChecks },
    { text: "I miei progetti", path: "/user/projects", icon: Folder },
    { text: "Impostazioni", path: "/settings", icon: Settings },
  ],
  admin: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "Progetti", path: "/admin/projects", icon: Folder },
    { text: "Sessioni", path: "/admin/sessions", icon: Repeat },
    { text: "Impostazioni", path: "/settings", icon: Settings },
  ],
  superadmin: [
    { text: "Dashboard", path: "/dashboard", icon: Home },
    { text: "Progetti", path: "/admin/projects", icon: Folder },
    { text: "Utenti", path: "/admin/users", icon: Users },
    { text: "Sessioni", path: "/admin/sessions", icon: Repeat },
    { text: "Attività", path: "/admin/audit-log", icon: Activity },
    { text: "Impostazioni", path: "/settings", icon: Settings },
  ],
};

export default function AppSidebar() {
  const { logoutUser, user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const menuItems = menuItemsByRole[user?.role] || [];
  const userConfigData = userConfig({ user });

  const handleLogout = () => {
    setDeleteConfirmOpen(false);

    const token = localStorage.getItem("auth_token");

    if (!token) {
      toast.error(
        "Token di autenticazione mancante. Impossibile effettuare il logout.",
      );
      return;
    }

    logoutUser(token);
    toast.success("Logout effettuato con successo!");
    navigate("/login");
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="text-white border-r-0

    **:data-[slot=sidebar-inner]:bg-slate-900"
      >
        {/* HEADER: RUOLO DINAMICO */}
        <SidebarHeader className="flex flex-col gap-2 p-4 justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
          <div className="flex items-center justify-between w-full bg-slate-800/60 rounded-xl p-3 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="h-10 w-10 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm shrink-0
            cursor-pointer "
                onClick={() => navigate("/settings")}
              >
                {/* <RoleIcon className="h-4 w-4" /> */}
                {/* <img src={logo}  alt="Logo" className="w-full h-full object-cover" /> */}
                <span className="font-bold">{getInitials(user)}</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-white leading-none tracking-wide text-[12px] font-bold">
                  {userConfigData.name}
                </span>
                <span className="text-[12px] text-slate-300 mt-1 truncate">
                  {userConfigData.title}
                </span>
              </div>
            </div>
            <SidebarTrigger className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-md h-7 w-7 ml-1 shrink-0">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
          <div className="hidden group-data-[collapsible=icon]:md:flex bg-slate-800/60 p-2 rounded-xl items-center justify-center">
            <SidebarTrigger className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-md h-7 w-7">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        </SidebarHeader>

        {/* CONTENUTO PRINCIPALE */}
        <SidebarContent className="gap-0 pt-4 bg-transparent">
          <SidebarGroup className="px-3">
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wide text-slate-400 px-2 mb-3 group-data-[collapsible=icon]:hidden">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {menuItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");

                  return (
                    <SidebarMenuItem key={item.text}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.text}
                        // mettiamo un effetto sfumato al testo e all'icona quando il menu è collassato
                        className={`
  w-full transition-all duration-150 rounded-xl py-2.5
  h-10 text-sm

  data-[active=true]:font-normal
  data-[active=true]:text-white
  data-[active=true]:rounded-2xl
  data-[active=true]:bg-[linear-gradient(90deg,#059669_0%,#10b981_55%,#8ef3c7_100%)]
  data-[active=true]:shadow-[0_0_25px_rgba(16,185,129,0.25)]
  cursor-pointer
 
`}
                      >
                        <button
                          onClick={() => navigate(item.path)}
                          className="flex items-center w-full gap-3 px-2.5"
                        >
                          <item.icon
                            className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-slate-400"}`}
                          />
                          <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                            {item.text}
                          </span>
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
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setDeleteConfirmOpen(true)}
                tooltip="Disconnetti"
                className="w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 py-2 h-9 rounded-xl transition-colors"
              >
                <div className="flex items-center w-full gap-3 ">
                  <LogOut className="w-4 h-4 text-slate-400 shrink-0 hover:text-red-400" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Esci
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-90">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground">
                Vuoi disconnetterti?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="hover:bg-muted">
                Annulla
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Disconnetti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Sidebar>
    </>
  );
}
