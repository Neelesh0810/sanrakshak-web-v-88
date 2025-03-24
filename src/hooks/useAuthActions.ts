
import { User } from '@/context/AuthContext';
import { supabaseClient } from '@/lib/supabase-client';

export const useAuthActions = () => {
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
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  // Update user function
  const updateUser = async (userData: Partial<User>, userId: string) => {
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          profile_img: userData.profileImg,
          can_volunteer: userData.canVolunteer,
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error updating user:", error);
        return { error: error.message };
      }
      
      // Notify other components about the change
      window.dispatchEvent(new Event('auth-state-changed'));
      return {};
    } catch (err) {
      console.error("Update user error:", err);
      return { error: 'An unexpected error occurred while updating user.' };
    }
  };

  return {
    login,
    signup,
    logout,
    updateUser
  };
};
