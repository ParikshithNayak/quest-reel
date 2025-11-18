import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Completion from "./pages/Completion";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Navigation from "./pages/Navigation";
import SplashCursor from "./components/SplashCursor";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showCursor = location.pathname !== "/videoplayer";

  return (
    <>
      {showCursor && <SplashCursor />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/videoplayer" element={<Index />} />
        <Route path="/completion" element={<Completion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/navigation" element={<Navigation />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
