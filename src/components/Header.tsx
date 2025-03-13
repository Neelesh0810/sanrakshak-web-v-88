
import React, { useState, useEffect } from 'react';
import { Menu, X, AlertTriangle, Bell, Settings, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Notifications from './Notifications';
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  title?: string;
  emergency?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Relief Connect", 
  emergency = false 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get user from localStorage
  const [user, setUser] = useState<any>(null);
  
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
    }
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    navigate('/');
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300',
        scrolled ? 'backdrop-blur-xl bg-black/50 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {emergency && (
              <div className="animate-pulse-subtle mr-2">
                <AlertTriangle size={20} className="text-white" />
              </div>
            )}
            <span className="font-semibold text-xl tracking-tight">{title}</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/resources" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Resources
            </Link>
            <Link to="/connect" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Connect
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
                <Notifications />
                
                <div className="relative">
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transition-colors"
                    aria-label="User profile"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User size={16} />
                    </div>
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 shadow-xl rounded-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/10 text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                      </div>
                      <div>
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          <span>Profile</span>
                        </Link>
                        <Link 
                          to="/settings" 
                          className="flex items-center px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          <span>Settings</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center px-4 py-2 text-sm hover:bg-white/5 transition-colors w-full text-left border-t border-white/10"
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
                  className="text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="text-sm font-medium py-1.5 px-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
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
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 pt-16 bg-black/95 backdrop-blur-md z-40 animate-fade-in md:hidden">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 p-6">
            <Link 
              to="/resources" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Resources
            </Link>
            <Link 
              to="/connect" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Connect
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
              <Link 
                to="/profile" 
                className="text-2xl font-medium" 
                onClick={toggleMenu}
              >
                Profile
              </Link>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-6">
                <Link 
                  to="/login" 
                  className="text-xl font-medium py-2 px-6 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={toggleMenu}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="text-xl font-medium py-2 px-6 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
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
