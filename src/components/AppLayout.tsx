
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "OffertPro" }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <MobileHeader title={title} />
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
          <div className="container py-4 md:py-6 px-4 md:px-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
