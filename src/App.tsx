
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Connect from "./pages/Connect";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => {
  // Check if routes exist on load
  useEffect(() => {
    const checkRoutes = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && ![
        "login", 
        "signup", 
        "connect", 
        "resources", 
        "map", 
        "alerts", 
        "profile", 
        "settings", 
        "forgot-password"
      ].some(route => currentPath.includes(route))) {
        console.error(`404 Error: User attempted to access non-existent route: ${currentPath}`);
      }
    };
    
    checkRoutes();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/map" element={<Map />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
