
import { User } from '@/context/AuthContext';
import { executeQuery } from '@/lib/mysql-client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'victim' | 'volunteer' | 'ngo' | 'government' | 'admin';
  profile_img: string | null;
  can_volunteer: number; // MySQL returns booleans as 0/1
  is_active: number;
}

export const useAuthActions = () => {
  // Login function
  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      // Get user from database
      const result = await executeQuery<UserRow[]>({
        query: 'SELECT * FROM users WHERE email = ?',
        values: [email]
      });
      
      if (result.length === 0) {
        return { error: 'Invalid email or password' };
      }
      
      const user = result[0];
      
      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { error: 'Invalid email or password' };
      }
      
      // Check if user is active
      if (!user.is_active) {
        return { error: 'Your account has been deactivated. Please contact support.' };
      }
      
      // Check for admin role if attempting admin login
      if (isAdmin && user.role !== 'admin') {
        return { error: 'You do not have administrator access.' };
      }
      
      // Store user info in localStorage
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImg: user.profile_img || undefined,
        canVolunteer: Boolean(user.can_volunteer),
        isActive: Boolean(user.is_active)
      };
      
      localStorage.setItem('authUser', JSON.stringify(userData));
      window.dispatchEvent(new Event('auth-state-changed'));
      
      return { user: userData };
    } catch (err) {
      console.error("Login error:", err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role = 'victim') => {
    try {
      // Check if user already exists
      const existingUsers = await executeQuery<UserRow[]>({
        query: 'SELECT id FROM users WHERE email = ?',
        values: [email]
      });
      
      if (existingUsers.length > 0) {
        return { error: 'Email is already registered' };
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate user ID
      const userId = uuidv4();
      
      // Create user in database
      await executeQuery({
        query: `
          INSERT INTO users (id, email, password, name, role, can_volunteer, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          userId,
          email,
          hashedPassword,
          name,
          role,
          role !== 'victim' ? 1 : 0,
          1
        ]
      });
      
      // Create user object for local storage
      const userData: User = {
        id: userId,
        email,
        name,
        role: role as User['role'],
        canVolunteer: role !== 'victim',
        isActive: true
      };
      
      localStorage.setItem('authUser', JSON.stringify(userData));
      window.dispatchEvent(new Event('auth-state-changed'));
      
      return { user: userData };
    } catch (err) {
      console.error("Signup error:", err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem('authUser');
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  // Update user function
  const updateUser = async (userData: Partial<User>, userId: string) => {
    try {
      // Build update query based on provided fields
      const updateFields: string[] = [];
      const values: any[] = [];
      
      if (userData.name !== undefined) {
        updateFields.push('name = ?');
        values.push(userData.name);
      }
      
      if (userData.role !== undefined) {
        updateFields.push('role = ?');
        values.push(userData.role);
      }
      
      if (userData.profileImg !== undefined) {
        updateFields.push('profile_img = ?');
        values.push(userData.profileImg);
      }
      
      if (userData.canVolunteer !== undefined) {
        updateFields.push('can_volunteer = ?');
        values.push(userData.canVolunteer ? 1 : 0);
      }
      
      if (updateFields.length === 0) {
        return { error: 'No fields to update' };
      }
      
      // Add userId to values array
      values.push(userId);
      
      await executeQuery({
        query: `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      });
      
      // Update local storage
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
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
