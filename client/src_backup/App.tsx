import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { CryptoProvider } from "./context/CryptoContext";
import { InvestmentProvider } from "./context/InvestmentContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WalletPage from "./pages/WalletPage";
import CryptoPage from "./pages/CryptoPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import InvestPage from "./pages/InvestPage";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <WalletProvider>
      <CryptoProvider>
        <InvestmentProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <WalletPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/crypto" element={
                    <ProtectedRoute>
                      <CryptoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/portfolio" element={
                    <ProtectedRoute>
                      <PortfolioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/invest" element={
                    <ProtectedRoute>
                      <InvestPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </InvestmentProvider>
      </CryptoProvider>
    </WalletProvider>
  </AuthProvider>
);

export default App;
