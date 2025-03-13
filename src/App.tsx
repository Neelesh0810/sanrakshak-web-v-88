
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import EmergencyPlan from "./pages/EmergencyPlan";
import ShelterMap from "./pages/ShelterMap";
import ChatSection from "./pages/ChatSection";
import ResourceDetails from "./pages/ResourceDetails";
import StatusDetails from "./pages/StatusDetails";
import LandingPage from "./pages/LandingPage";
import VolunteerTasks from "./pages/VolunteerTasks";
import VolunteerTaskDetails from "./pages/VolunteerTaskDetails";
import VolunteerStats from "./pages/VolunteerStats";

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
        try {
          // Validate the JSON format
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          // Invalid JSON, clear it
          console.error("Invalid authUser data:", e);
          localStorage.removeItem('authUser');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
    
    // Listen for storage events to update auth state
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authUser') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
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
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Function to protect routes
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetails />} />
              <Route path="/map" element={<Map />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/status/:id" element={<StatusDetails />} />
              <Route path="/emergency-plan" element={<EmergencyPlan />} />
              <Route path="/shelter-map" element={<ShelterMap />} />
              <Route path="/chat/:contactId" element={<ChatSection />} />
              <Route path="/volunteer-tasks" element={<VolunteerTasks />} />
              <Route path="/volunteer-tasks/:id" element={<VolunteerTaskDetails />} />
              <Route path="/volunteer-stats" element={<VolunteerStats />} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
