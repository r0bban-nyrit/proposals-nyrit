
import { NavLink, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  User, 
  Settings,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";

const navItems = [
  { 
    title: "Översikt", 
    path: "/", 
    icon: LayoutDashboard 
  },
  { 
    title: "Offerter", 
    path: "/offerter", 
    icon: ClipboardList 
  },
  { 
    title: "Skapa offert", 
    path: "/skapa-offert", 
    icon: FileText 
  },
  { 
    title: "Profil", 
    path: "/profil", 
    icon: User 
  },
  { 
    title: "Inställningar", 
    path: "/installningar", 
    icon: Settings 
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const currentPath = location.pathname;
  
  // Helper functions
  const isActive = (path: string) => {
    if (path === "/") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleNavClick = () => {
    // Only close mobile sidebar when a nav item is clicked
    setOpenMobile(false);
  };

  return (
    <Sidebar 
      className="border-r border-gray-200"
      collapsible="icon"
    >
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>
            Meny
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.path}
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
