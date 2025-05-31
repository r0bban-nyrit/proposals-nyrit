
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileHeaderProps {
  title: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b bg-card/90 backdrop-blur-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpenMobile(!openMobile)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="font-semibold text-lg">{title}</div>
      <div className="w-10"></div>
    </div>
  );
}
