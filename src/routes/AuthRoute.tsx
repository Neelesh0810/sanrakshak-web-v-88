
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (user) {
    return user.role === 'admin' 
      ? <Navigate to="/admin-dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default AuthRoute;
