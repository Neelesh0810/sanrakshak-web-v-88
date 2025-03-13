import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, Settings, User, LogOut, UserCheck, Building, ArrowRightLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Notifications from './Notifications';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';

interface HeaderProps {
  title?: string;
  emergency?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Sanrakshak", 
  emergency = false 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [user, setUser] = useState<any>(null);
  
  // Refs for click outside detection
  const profileRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);
  
  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile dropdown if click is outside
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      
      // Close role switcher dropdown if click is outside
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleRoleSwitcher = () => setRoleSwitcherOpen(!roleSwitcherOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    
    setMenuOpen(false);
    setProfileOpen(false);
    
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    
    navigate('/', { replace: true });
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setProfileOpen(false);
  };

  const switchRole = (role: 'victim' | 'volunteer' | 'ngo' | 'government') => {
    if (!user) return;
    
    const updatedUser = { ...user, role };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Role Changed",
      description: `You are now viewing as: ${getRoleName(role)}`,
      duration: 3000,
    });
    
    setRoleSwitcherOpen(false);
    
    window.location.reload();
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
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300',
        scrolled 
          ? isLight 
            ? 'backdrop-blur-xl bg-white/50 shadow-sm border-b border-gray-200' 
            : 'backdrop-blur-xl bg-black/50 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {emergency && (
              <div className="animate-pulse-subtle mr-2">
              </div>
            )}
            <div className="flex items-center">
              <span className="font-bold text-xl">Sanrakshak</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Dashboard
            </Link>
            <Link to="/resources" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Resources
            </Link>
            <Link to="/map" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Map
            </Link>
            <Link to="/alerts" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Alerts
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role && (
                  <div className="relative" ref={roleSwitcherRef}>
                    <button 
                      onClick={toggleRoleSwitcher}
                      className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transition-colors"
                      aria-label="Switch Role"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                        <ArrowRightLeft size={16} />
                      </div>
                    </button>
                    
                    {roleSwitcherOpen && (
                      <div className={`absolute right-0 mt-2 w-48 ${isLight ? "bg-white border border-gray-200" : "bg-black border border-white/10"} shadow-xl rounded-xl z-50 overflow-hidden`}>
                        <div className="flex justify-between items-center p-3 border-b border-white/10">
                          <p className="font-medium">Switch Role</p>
                          <button 
                            onClick={() => setRoleSwitcherOpen(false)}
                            className="p-1 rounded-full hover:bg-white/10"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div>
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'victim' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('victim')}
                          >
                            <User size={16} className="mr-2" />
                            <span>Affected Person</span>
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'volunteer' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('volunteer')}
                          >
                            <UserCheck size={16} className="mr-2" />
                            <span>Volunteer</span>
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'ngo' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('ngo')}
                          >
                            <Building size={16} className="mr-2" />
                            <span>NGO</span>
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 ${user.role === 'government' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('government')}
                          >
                            <span>Government</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div ref={notificationsRef}>
                  <Notifications />
                </div>
                
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transition-colors"
                    aria-label="User profile"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                      <User size={16} />
                    </div>
                  </button>
                  
                  {profileOpen && (
                    <div className={`absolute right-0 mt-2 w-48 ${isLight ? "bg-white border border-gray-200" : "bg-black border border-white/10"} shadow-xl rounded-xl z-50 overflow-hidden`}>
                      <div className="flex justify-between items-center p-3 border-b border-white/10">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className={`${isLight ? "text-gray-600" : "text-gray-400"} text-xs mt-0.5`}>{user.email}</p>
                        </div>
                        <button 
                          onClick={() => setProfileOpen(false)}
                          className="p-1 rounded-full hover:bg-white/10"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleNavigate('/profile')}
                          className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors w-full text-left`}
                        >
                          <User size={16} className="mr-2" />
                          <span>Profile</span>
                        </button>
                        <button 
                          onClick={() => handleNavigate('/settings')}
                          className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors w-full text-left`}
                        >
                          <Settings size={16} className="mr-2" />
                          <span>Settings</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100 border-t border-gray-200" : "hover:bg-white/5 border-t border-white/10"} transition-colors w-full text-left`}
                        >
                          <LogOut size={16} className="mr-2" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors`}
                >
                  Sign up
                </Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors focus-ring"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div className={`fixed inset-0 pt-16 ${isLight ? "bg-white/95 backdrop-blur-md" : "bg-black/95 backdrop-blur-md"} z-40 animate-fade-in md:hidden`}>
          <nav className="flex flex-col items-center justify-center h-full space-y-8 p-6">
            <Link 
              to="/" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/resources" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Resources
            </Link>
            <Link 
              to="/map" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Map
            </Link>
            <Link 
              to="/alerts" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Alerts
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-2xl font-medium" 
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="text-2xl font-medium" 
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-6">
                <Link 
                  to="/login" 
                  className={`text-xl font-medium py-2 px-6 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors`}
                  onClick={toggleMenu}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className={`text-xl font-medium py-2 px-6 rounded-lg ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors`}
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
