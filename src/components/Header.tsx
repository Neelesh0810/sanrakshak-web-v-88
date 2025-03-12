
import React, { useState, useEffect } from 'react';
import { Menu, X, AlertTriangle, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
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
            <button 
              className="p-2 rounded-full hover:bg-white/5 transition-colors focus-ring"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-white/5 transition-colors focus-ring"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
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
            <Link 
              to="/profile" 
              className="text-2xl font-medium" 
              onClick={toggleMenu}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
