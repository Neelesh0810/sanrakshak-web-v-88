
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ResourceRouteRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // This part ensures resources are still routed correctly
  if (user.role === 'victim') {
    return <Navigate to="/victim-resources" replace />;
  } else if (user.role === 'volunteer' || user.role === 'ngo' || user.role === 'government') {
    return <Navigate to="/volunteer-resources" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default ResourceRouteRedirect;
