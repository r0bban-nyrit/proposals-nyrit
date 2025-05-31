
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Offerter from "./pages/Offerter";
import SkapaOffert from "./pages/SkapaOffert";
import Profil from "./pages/Profil";
import Installningar from "./pages/Installningar";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance inside the component
function App() {
  // Create a client instance that lives for the lifetime of the component
  const queryClient = new QueryClient();
  
  return (
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/offerter" element={<Offerter />} />
                <Route path="/skapa-offert" element={<SkapaOffert />} />
                <Route path="/skapa-offert/:id" element={<SkapaOffert />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/installningar" element={<Installningar />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;
