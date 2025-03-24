
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

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

  // Initialize and check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Get current user session
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          setUser(null);
        } else if (session) {
          // Get user profile data from users table
          const { data: userData, error: profileError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError || !userData) {
            console.error("Error fetching user profile:", profileError);
            setUser(null);
          } else {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              profileImg: userData.profile_img,
              canVolunteer: userData.can_volunteer,
              isActive: userData.is_active
            });
          }
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
          // Get user profile on sign in
          const { data: userData, error: profileError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError || !userData) {
            console.error("Error fetching user profile:", profileError);
            setUser(null);
          } else {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              profileImg: userData.profile_img,
              canVolunteer: userData.can_volunteer,
              isActive: userData.is_active
            });
          }
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

  // Login function
  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // Get user profile from database
      const { data: userData, error: profileError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        return { error: 'Error fetching user profile' };
      }
      
      // Check if user is active
      if (!userData.is_active) {
        await supabaseClient.auth.signOut();
        return { error: 'Your account has been deactivated. Please contact support.' };
      }
      
      // Check for admin role if attempting admin login
      if (isAdmin && userData.role !== 'admin') {
        await supabaseClient.auth.signOut();
        return { error: 'You do not have administrator access.' };
      }
      
      return {};
    } catch (err) {
      console.error("Login error:", err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role = 'victim') => {
    try {
      // Register new user in auth
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        return { error: authError.message };
      }
      
      if (!authData.user) {
        return { error: 'Failed to create user' };
      }
      
      // Create user profile in users table
      const { error: profileError } = await supabaseClient
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            name: name,
            role: role,
            can_volunteer: role !== 'victim',
            is_active: true,
            created_at: new Date()
          }
        ]);
      
      if (profileError) {
        // Clean up auth entry if profile creation fails
        await supabaseClient.auth.admin.deleteUser(authData.user.id);
        return { error: 'Failed to create user profile' };
      }
      
      return {};
    } catch (err) {
      console.error("Signup error:", err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          profile_img: userData.profileImg,
          can_volunteer: userData.canVolunteer,
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Error updating user:", error);
        return;
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      // Notify other components about the change
      window.dispatchEvent(new Event('auth-state-changed'));
    } catch (err) {
      console.error("Update user error:", err);
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
