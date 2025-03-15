
import React, { useState, useEffect } from 'react';
import { User, UserCheck, Building, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const RoleSwitcher: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Load current user
    const loadUser = () => {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        setCurrentUser(JSON.parse(authUser));
      }
    };
    
    loadUser();
    
    // Listen for auth state changes
    window.addEventListener('auth-state-changed', loadUser);
    window.addEventListener('storage', loadUser);
    
    return () => {
      window.removeEventListener('auth-state-changed', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);
  
  const switchRole = (role: 'victim' | 'volunteer' | 'ngo' | 'government') => {
    if (!currentUser) return;
    
    // Close the menu first
    document.getElementById('role-switcher-menu')?.classList.add('hidden');
    
    const updatedUser = { ...currentUser, role };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    
    // Use synchronous code for the critical operations
    setCurrentUser(updatedUser);
    
    // Dispatch event after the state is updated
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    toast({
      title: "Role Changed",
      description: `You are now viewing as: ${getRoleName(role)}`,
      duration: 3000,
    });
    
    // Force navigation with React Router directly
    navigate('/dashboard', { replace: true });
    
    // Log for debugging
    console.log("Role switched, redirecting to dashboard");
  };
  
  const getRoleName = (role: string): string => {
    switch (role) {
      case 'victim': return 'Affected Person';
      case 'volunteer': return 'Volunteer';
      case 'ngo': return 'NGO';
      case 'government': return 'Government';
      default: return role;
    }
  };
  
  // Don't render anything if:
  // 1. User is not logged in
  // 2. User role is admin
  // 3. Current page is the admin dashboard
  // 4. Current URL path includes "/admin"
  if (!currentUser || 
      currentUser.role === 'admin' || 
      window.location.pathname.includes('/admin-dashboard') || 
      window.location.pathname.includes('/admin')) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="p-2 rounded-md bg-black/60 hover:bg-black/80 border border-white/10 text-white"
        onClick={() => document.getElementById('role-switcher-menu')?.classList.toggle('hidden')}
      >
        Switch Role
      </button>
      
      <div id="role-switcher-menu" className="hidden absolute bottom-12 right-0 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden w-48">
        <div className="p-2 text-xs border-b border-white/10">
          View As:
        </div>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${currentUser.role === 'victim' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('victim')}
        >
          <User size={16} className="mr-2" />
          <span>Affected Person</span>
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${currentUser.role === 'volunteer' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('volunteer')}
        >
          <UserCheck size={16} className="mr-2" />
          <span>Volunteer</span>
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${currentUser.role === 'ngo' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('ngo')}
        >
          <Building size={16} className="mr-2" />
          <span>NGO</span>
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${currentUser.role === 'government' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('government')}
        >
          <Shield size={16} className="mr-2" />
          <span>Government</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
