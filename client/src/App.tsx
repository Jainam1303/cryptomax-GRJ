import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import RainOverlay from "@/components/RainOverlay";
import { useEffect } from "react";
import { captureReferralFromUrl } from "./lib/referral";
import Affiliate from "./pages/Affiliate";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WalletPage from "./pages/WalletPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";
import ProfilePage from "./pages/ProfilePage";
import InvestPage from "./pages/InvestPage";
import CryptoPage from "./pages/CryptoPage";
import CryptoDetailPage from "./pages/CryptoDetailPage";
import Terms from "./pages/Terms";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const ReferralCapture = () => {
  const location = useLocation();
  useEffect(() => {
    // Look for ?ref, ?referral, or ?affiliate and store a 30-day cookie in localStorage
    captureReferralFromUrl(location.search);
  }, [location.search]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ReferralCapture />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Dashboard-related pages (protected) */}
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/invest" element={<ProtectedRoute><InvestPage /></ProtectedRoute>} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/crypto/:id" element={<CryptoDetailPage />} />
          <Route path="/terms" element={<Terms />} />
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
