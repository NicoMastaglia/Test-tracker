import * as React from "react"
import { 
  Home, 
  Repeat, 
  Folder, 
  Users, 
  LogOut, 
  Menu,
  CheckCircle
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

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

const menuItems = [
  { text: "Dashboard", path: "/dashboard", roles: ["tester", "admin", "superadmin"], icon: Home },
  { text: "Sessions", path: "/admin/sessions", roles: ["admin", "superadmin"], icon: Repeat },
  { text: "Projects", path: "/admin/projects", roles: ["admin", "superadmin"], icon: Folder },
  { text: "Users", path: "/admin/users", roles: ["superadmin"], icon: Users },
  {text: 'Team', path: '/admin/team', roles: ['admin'], icon: Users},
  {text: 'Checklist', path: '/admin/checklist', roles: ['admin'], icon: CheckCircle
   
  },
  {
    text: 'My Sessions', path: '/sessions-test', roles: ['tester'], icon: CheckCircle
  }



]

export default function AppSidebar() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sidebar collapsible="icon"  variant="collapsible"> {/* Gestisce il collassamento automaticamente */}
      <SidebarHeader className="flex items-center justify-between p-4">
        {/* Questo pulsante sostituisce il tuo IconButton manuale */}
        <SidebarTrigger /> 
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => item.roles.includes(user.role))
                .map((item) => (
                  <SidebarMenuItem key={item.text}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname.startsWith(item.path)}
                      tooltip={item.text} // Tooltip automatico quando è chiusa!
                    >
                      <button onClick={() => navigate(item.path)}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.text}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}