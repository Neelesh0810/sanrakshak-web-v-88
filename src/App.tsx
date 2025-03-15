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
import ResourceManagementDetails from "./pages/ResourceManagementDetails";
import StatusDetails from "./pages/StatusDetails";
import LandingPage from "./pages/LandingPage";
import VolunteerTasks from "./pages/VolunteerTasks";
import VolunteerTaskDetails from "./pages/VolunteerTaskDetails";
import VolunteerStats from "./pages/VolunteerStats";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('authUser');
            setUser(null);
          }
        } else {
          localStorage.removeItem('authUser');
          setUser(null);
        }
      } catch (e) {
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    const checkRoutes = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && ![
        "login", 
        "signup", 
        "dashboard",
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
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);
  
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return children;
  };

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
  };

  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (user) {
      return user.role === 'admin' 
        ? <Navigate to="/admin-dashboard" replace /> 
        : <Navigate to="/dashboard" replace />;
    }
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
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/admin-dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/*" element={
                <Navigate to="/admin-dashboard" replace />
              } />
              
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              } />
              <Route path="/forgot-password" element={
                <AuthRoute>
                  <ForgotPassword />
                </AuthRoute>
              } />
              
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/resources/:id" element={
                <ProtectedRoute>
                  <ResourceDetails />
                </ProtectedRoute>
              } />
              <Route path="/resource-management/details/:id" element={
                <ProtectedRoute>
                  <ResourceManagementDetails />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />
              <Route path="/status/:id" element={
                <ProtectedRoute>
                  <StatusDetails />
                </ProtectedRoute>
              } />
              <Route path="/emergency-plan" element={<EmergencyPlan />} />
              <Route path="/shelter-map" element={
                <ProtectedRoute>
                  <ShelterMap />
                </ProtectedRoute>
              } />
              <Route path="/chat/:contactId" element={
                <ProtectedRoute>
                  <ChatSection />
                </ProtectedRoute>
              } />
              <Route path="/volunteer-tasks" element={
                <ProtectedRoute>
                  <VolunteerTasks />
                </ProtectedRoute>
              } />
              <Route path="/volunteer-tasks/:id" element={
                <ProtectedRoute>
                  <VolunteerTaskDetails />
                </ProtectedRoute>
              } />
              <Route path="/volunteer-stats" element={
                <ProtectedRoute>
                  <VolunteerStats />
                </ProtectedRoute>
              } />
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
