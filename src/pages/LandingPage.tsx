
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Shield, CheckCircle, MapPin, Menu, X } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useTheme } from '../context/ThemeProvider';

const LandingPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in and update state
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          // Verify that the stored data is valid JSON
          const parsedUser = JSON.parse(authUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('authUser');
            setUser(null);
          }
        } else {
          localStorage.removeItem('authUser'); // Ensure it's removed
          setUser(null);
        }
      } catch (e) {
        // Clear invalid data
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
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

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    
    // Close any open menus
    setMenuOpen(false);
    
    // Dispatch auth change events
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    // Navigate to landing page with replace
    navigate('/', { replace: true });
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  return (
    <div className={`min-h-screen bg-black text-foreground`}>
      <header className={`py-6 px-6 bg-black`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="flex items-center justify-center transform rotate-15"
                style={{ transform: 'rotate(15deg)' }}
              >
                <Shield size={28} className="text-primary font-bold" />
                <span className="font-bold text-2xl">S.</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {user && (
                <>
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
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-24 h-8 bg-white/10 animate-pulse rounded-lg"></div>
              ) : user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium py-1.5 px-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
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
                </>
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
      </header>

      {menuOpen && (
        <div className="fixed inset-0 pt-16 bg-black/95 backdrop-blur-md z-40 animate-fade-in md:hidden">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 p-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
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
                <Link 
                  to="/profile" 
                  className="text-2xl font-medium" 
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-2xl font-medium"
                >
                  Sign out
                </button>
              </>
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

      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <AnimatedTransition>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary-foreground text-sm">
                  <AlertTriangle size={14} className="mr-2" />
                  <span>Emergency Response Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Coordinate Relief Efforts in Disaster Situations
                </h1>
                
                <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                  Connect those in need with volunteers, NGOs, and government resources during emergencies.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {isLoading ? (
                    <div className="h-12 bg-white/10 animate-pulse rounded-lg w-40"></div>
                  ) : user ? (
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium bg-white text-black hover:bg-white/90 transition-colors"
                    >
                      Go to Dashboard
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  ) : (
                    <button 
                      onClick={handleGetStarted}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium bg-white text-black hover:bg-white/90 transition-colors"
                    >
                      Get Started
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  )}
                  
                  <Link 
                    to="/emergency-plan" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium bg-transparent border border-white/20 hover:bg-white/5 transition-colors"
                  >
                    Emergency Resources
                  </Link>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </section>
        
        <section className="py-16 bg-black/40">
          <div className="container mx-auto px-4">
            <AnimatedTransition>
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground">
                  Sanrakshak connects people in need with those who can help during emergencies
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl bg-black/20 border border-white/10">
                  <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-white/10">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Report Needs</h3>
                  <p className="text-muted-foreground">
                    Those affected by disasters can quickly request assistance for food, water, shelter or medical aid.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-black/20 border border-white/10">
                  <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-white/10">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coordinate Response</h3>
                  <p className="text-muted-foreground">
                    Volunteers, NGOs and government agencies can see real-time needs and coordinate effective responses.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-black/20 border border-white/10">
                  <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-white/10">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Monitor the status of assistance requests and relief efforts in real-time.
                  </p>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </section>
      </main>
      
      <footer className="py-8 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div 
                  className="flex items-center justify-center transform rotate-15"
                  style={{ transform: 'rotate(15deg)' }}
                >
                  <Shield size={20} className="text-primary font-bold" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Emergency Response Platform
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sanrakshak. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
