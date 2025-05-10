
import { NavLink, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  User, 
  Settings,
  LayoutDashboard,
  FileText,
  Menu
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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;
  
  // Helper functions
  const isActive = (path: string) => {
    if (path === "/") return currentPath === path;
    return currentPath.startsWith(path);
  };
  
  const isGroupExpanded = navItems.some(item => isActive(item.path));
  
  const getNavClass = (isItemActive: boolean) => {
    return `flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors ${
      isItemActive 
        ? "bg-brand-100 text-brand-700 font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    }`;
  };

  return (
    <Sidebar 
      className={`border-r border-gray-200 ${state === "collapsed" ? "w-16" : "w-64"} ${
        isMobile ? (state === "collapsed" ? "hidden" : "absolute z-40 h-screen bg-white") : "relative"
      } transition-all duration-300`}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {state !== "collapsed" && (
          <div className="text-lg font-semibold text-brand-800">OffertPro</div>
        )}
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Meny
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={() => getNavClass(isActive(item.path))}
                    >
                      <item.icon className="h-5 w-5" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
