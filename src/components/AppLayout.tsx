
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "OffertPro" }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Desktop header with sidebar trigger */}
          <header className="hidden md:flex h-14 items-center border-b bg-background px-4">
            <SidebarTrigger />
            <div className="ml-4 text-lg font-semibold text-brand-800">{title}</div>
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
