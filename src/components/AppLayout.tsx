
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "OffertPro" }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    // Get initial state from localStorage or default to open on desktop, closed on mobile
    const stored = localStorage.getItem("sidebar:state");
    if (stored !== null) {
      return stored === "true";
    }
    return !isMobile;
  });

  // Persist sidebar state to localStorage whenever it changes
  const handleSidebarChange = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem("sidebar:state", open.toString());
  };

  // Update default state when mobile/desktop changes, but only if no stored preference
  useEffect(() => {
    const stored = localStorage.getItem("sidebar:state");
    if (stored === null) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);
  
  return (
    <SidebarProvider 
      open={sidebarOpen}
      onOpenChange={handleSidebarChange}
    >
      <div className="min-h-screen w-full flex bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Desktop header with sidebar trigger */}
          <header className="hidden md:flex h-14 items-center border-b bg-card/50 backdrop-blur-sm px-4">
            <SidebarTrigger />
            <div className="ml-4 text-lg font-semibold text-foreground">{title}</div>
          </header>
          
          {/* Mobile header */}
          <MobileHeader title={title} />
          
          <main className="flex-1 overflow-x-hidden bg-background pt-14 md:pt-0">
            <div className="container py-4 md:py-6 px-2 md:px-6 max-w-full md:max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
