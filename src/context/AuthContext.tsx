
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'victim' | 'volunteer' | 'ngo' | 'government' | 'admin';
  profileImg?: string;
  canVolunteer?: boolean;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<{ error?: string; user?: User }>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<{ error?: string; user?: User }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authActions = useAuthActions();

  // Initialize and check for existing session from localStorage
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
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  // Wrap the auth actions to update local state
  const login = async (email: string, password: string, isAdmin = false) => {
    const result = await authActions.login(email, password, isAdmin);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signup = async (email: string, password: string, name: string, role = 'victim') => {
    const result = await authActions.signup(email, password, name, role);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authActions.logout();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    const result = await authActions.updateUser(userData, user.id);
    if (!result.error) {
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
