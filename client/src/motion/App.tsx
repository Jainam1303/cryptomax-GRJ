import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RainOverlay from "@/components/RainOverlay";
import Affiliate from "./pages/Affiliate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/affiliate" element={<Affiliate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* Global rain overlay across the entire app */}
      <RainOverlay
        intensity={55}
        speed={0.55}
        wind={0.25}
        color="rgba(180,200,255,0.25)"
        className="fixed inset-0 z-20"
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
