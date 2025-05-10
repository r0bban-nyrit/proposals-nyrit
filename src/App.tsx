
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Offerter from "./pages/Offerter";
import SkapaOffert from "./pages/SkapaOffert";
import Profil from "./pages/Profil";
import Installningar from "./pages/Installningar";
import NotFound from "./pages/NotFound";
import { MobileHeader } from "./components/MobileHeader";

// Create a new QueryClient instance inside the component
function App() {
  // Create a client instance that lives for the lifetime of the component
  const queryClient = new QueryClient();
  
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileHeader title="OffertPro" />
            <div className="pt-14 md:pt-0"> {/* Add padding top on mobile for fixed header */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/offerter" element={<Offerter />} />
                <Route path="/skapa-offert" element={<SkapaOffert />} />
                <Route path="/skapa-offert/:id" element={<SkapaOffert />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/installningar" element={<Installningar />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
