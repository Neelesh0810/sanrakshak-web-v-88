
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
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
  login: (email: string, password: string, isAdmin?: boolean) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authActions = useAuthActions();

  // Initialize and check for existing session
  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      const { data: userData, error: profileError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError || !userData) {
        console.error("Error fetching user profile:", profileError);
        setUser(null);
        return null;
      }
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        profileImg: userData.profile_img,
        canVolunteer: userData.can_volunteer,
        isActive: userData.is_active
      };
    };
    
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Get current user session
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          setUser(null);
        } else if (session) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Unexpected auth error:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial auth check
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        // Dispatch custom event for components listening for auth changes
        window.dispatchEvent(new Event('auth-state-changed'));
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wrap the auth actions to update local state
  const login = async (email: string, password: string, isAdmin = false) => {
    return authActions.login(email, password, isAdmin);
  };

  const signup = async (email: string, password: string, name: string, role = 'victim') => {
    return authActions.signup(email, password, name, role);
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
