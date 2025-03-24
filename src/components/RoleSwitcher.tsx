import React, { useState } from 'react';
import { User, UserCheck, Building, Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RoleSwitcher: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const switchRole = async (role: 'victim' | 'volunteer' | 'ngo' | 'government') => {
    if (!user) return;
    
    try {
      await updateUser({ role });
      
      toast({
        title: "Role Changed",
        description: `You are now viewing as: ${getRoleName(role)}`,
        duration: 3000,
      });
      
      // Generate a timestamp to force dashboard refresh
      const timestamp = Date.now();
      
      // If already on dashboard, force a reload to refresh content
      if (location.pathname === '/dashboard') {
        // Use a combination of navigate and window.location.reload for a full refresh
        navigate(`/dashboard?refresh=${timestamp}`, { replace: true });
        // Add a slight delay before reloading to ensure navigation completes
        setTimeout(() => window.location.reload(), 100);
      } else {
        // Otherwise just navigate to dashboard
        navigate(`/dashboard?refresh=${timestamp}`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast({
        title: "Error",
        description: "Failed to switch role. Please try again.",
        variant: "destructive",
      });
    }
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
  if (!user || 
      user.role === 'admin' || 
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
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'victim' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('victim')}
        >
          <User size={16} className="mr-2" />
          <span className="flex-1 text-left">Affected Person</span>
          {user.role === 'victim' && <Check size={16} className="text-green-400" />}
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'volunteer' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('volunteer')}
        >
          <UserCheck size={16} className="mr-2" />
          <span className="flex-1 text-left">Volunteer</span>
          {user.role === 'volunteer' && <Check size={16} className="text-green-400" />}
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'ngo' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('ngo')}
        >
          <Building size={16} className="mr-2" />
          <span className="flex-1 text-left">NGO</span>
          {user.role === 'ngo' && <Check size={16} className="text-green-400" />}
        </button>
        
        <button
          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'government' ? 'bg-white/5' : ''}`}
          onClick={() => switchRole('government')}
        >
          <Shield size={16} className="mr-2" />
          <span className="flex-1 text-left">Government</span>
          {user.role === 'government' && <Check size={16} className="text-green-400" />}
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
