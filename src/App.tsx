
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

// Ensure users array exists in localStorage
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    checkAuth();
    
    // Check if routes exist on load
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
  
  // Function to protect routes
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/connect" element={
              <ProtectedRoute>
                <Connect />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={<Resources />} />
            <Route path="/map" element={<Map />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
